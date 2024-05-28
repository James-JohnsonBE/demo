import { appContext } from "../infrastructure/application_db_context.js";
import { getPeopleByUsername, getSiteGroups } from "./people_manager.js";
import { roleNames } from "./permission_manager.js";
import { ItemPermissions } from "../sal/infrastructure/index.js";
import {
  AuditResponseStates,
  AuditRequest,
  AuditRequestsInternal,
} from "../entities/index.js";
import { People } from "../sal/entities/index.js";
import { addTask, finishTask, taskDefs } from "./tasks.js";
import { deleteRequestCoversheet } from "./coversheet_manager.js";

export async function getRequestById(id) {
  return await appContext.AuditRequests.FindById(id);
}

export async function getRequestByTitle(title) {
  const requestResults = await appContext.AuditRequests.FindByColumnValue(
    [{ column: "Title", value: title }],
    {},
    { count: 1 }
  );

  return requestResults.results[0] ?? null;
}

export async function addNewRequest(request) {
  const fields = request.FieldMap;

  // See if we have a request with this title already
  const existingRequests = await appContext.AuditRequests.FindByColumnValue(
    [{ column: "Title", value: fields.Title.Value() }],
    {},
    { count: 1 }
  );

  // TODO: use addFieldRequirement?
  if (existingRequests.results.length) {
    throw new Error("Request with this name already exists!");
  }

  request.FieldMap.EmailActionOffice.Value(
    request.FieldMap.ActionOffice.Value()
  );

  await appContext.AuditRequests.AddEntity(request);

  // This is handled by the IA_DB callback
  // await onAddNewRequest(request);
}

export async function updateRequest(request) {
  await appContext.AuditRequests.UpdateEntity(
    request,
    AuditRequest.Views.IACanUpdate
  );
}

export async function deleteRequest(requestId) {
  // Also delete related items:
  // xCoversheets, Emails (Folder), xRequestInternal, xResponseDocs (Folder), xResponses
  const request = await appContext.AuditRequests.FindById(requestId);
  if (!request) {
    alert("Could not find request: ", requestId);
  }
  const requestTitle = request.ReqNum.Value();
  const promises = [];
  // Delete Coversheets
  const coversheets = await getRequestCoversheets(request);

  coversheets.map((coversheet) => {
    promises.push(deleteRequestCoversheet(coversheet));
  });

  // Delete email folder
  promises.push(
    new Promise(async (resolve) => {
      const deleteItemTask = addTask(taskDefs.deleteEmailFolder);
      await appContext.AuditEmails.RemoveFolderByPath(requestTitle);
      finishTask(deleteItemTask);
      resolve();
    })
  );

  // Delete responses and responsedocs
  const responses = await getRequestResponses(request);
  responses.map((response) => {
    promises.push(deleteResponseAndFolder(response));
  });

  // Delete the internal item
  const requestInternalItem = await getRequestInternalItem(requestId);
  if (requestInternalItem) {
    promises.push(
      new Promise(async (resolve) => {
        const deleteItemTask = addTask(taskDefs.deleteRequestInternalItem);
        await appContext.AuditRequestsInternals.RemoveEntityById(
          requestInternalItem.ID
        );
        finishTask(deleteItemTask);
        resolve();
      })
    );
  }

  await Promise.all(promises);
  // Finally, delete the request
  await appContext.AuditRequests.RemoveEntityById(requestId);
  return true;
}

/* Begin Unreferenced Service Rewrites */
export async function onAddNewRequest(request) {
  await Promise.all([
    ensureRequestPermissions(request),
    ensureAuditEmailFolder(request),
    ensureRequestInternalItem(request),
  ]);
}

async function ensureAuditEmailFolder(request) {
  const newFolderId = await appContext.AuditEmails.UpsertFolderPath(
    request.ReqNum.Value()
  );

  const newItemPermissions = new ItemPermissions({
    hasUniqueRoleAssignments: true,
    roles: [],
  });

  const { owners, members, visitors } = await getSiteGroups();
  const qaGroup = await getPeopleByUsername(
    Audit.Common.Utilities.GetGroupNameQA()
  );

  newItemPermissions.addPrincipalRole(owners, roleNames.FullControl);
  newItemPermissions.addPrincipalRole(members, roleNames.RestrictedContribute);
  newItemPermissions.addPrincipalRole(visitors, roleNames.RestrictedRead);

  newItemPermissions.addPrincipalRole(qaGroup, roleNames.RestrictedContribute);

  const actionOffices = request.FieldMap.ActionOffice.Value();

  actionOffices.map((ao) => {
    newItemPermissions.addPrincipalRole(
      ao.UserGroup,
      roleNames.RestrictedContribute
    );
  });

  const result = await appContext.AuditEmails.SetItemPermissions(
    { ID: newFolderId },
    newItemPermissions,
    true
  );
}

async function ensureRequestPermissions(request) {
  const perms = await appContext.AuditRequests.GetItemPermissions(request);
  if (!perms.hasUniqueRoleAssignments) {
    if (window.DEBUG) console.log("Request does not have unique permissions");
    await breakRequestPermissions(request);
  }
}

async function ensureRequestInternalItem(request) {
  const requestInternalResult = getRequestInternalItem(request);
  if (requestInternalResult) return requestInternalResult;

  const requestInternal = new AuditRequestsInternal();
  requestInternal.ReqNum.Value(request);
  await appContext.AuditRequestsInternals.AddEntity(requestInternal);
  return requestInternal;
}

export async function breakRequestPermissions(request, responseStatus) {
  const curPerms = await appContext.AuditRequests.GetItemPermissions(request);

  const defaultGroups = await getSiteGroups();

  const qaGroup = await getPeopleByUsername(
    Audit.Common.Utilities.GetGroupNameQA()
  );

  const qaHasRead = curPerms.principalHasPermissionKind(
    qaGroup,
    SP.PermissionKind.viewListItems
  );

  const special1Group = await getPeopleByUsername(
    Audit.Common.Utilities.GetGroupNameSpecialPerm1()
  );
  const special2Group = await getPeopleByUsername(
    Audit.Common.Utilities.GetGroupNameSpecialPerm2()
  );

  const special1HasRead = curPerms.principalHasPermissionKind(
    special1Group,
    SP.PermissionKind.viewListItems
  );
  const special2HasRead = curPerms.principalHasPermissionKind(
    special2Group,
    SP.PermissionKind.viewListItems
  );

  const newRequestPermissions = new ItemPermissions({
    hasUniqueRoleAssignments: true,
    roles: [],
  });

  newRequestPermissions.addPrincipalRole(
    defaultGroups.owners,
    roleNames.FullControl
  );
  newRequestPermissions.addPrincipalRole(
    defaultGroups.members,
    roleNames.Contribute
  );
  newRequestPermissions.addPrincipalRole(
    defaultGroups.visitors,
    roleNames.RestrictedRead
  );

  if (qaHasRead || responseStatus == AuditResponseStates.ApprovedForQA) {
    newRequestPermissions.addPrincipalRole(qaGroup, roleNames.RestrictedRead);
  }

  if (special1HasRead) {
    newRequestPermissions.addPrincipalRole(
      special1Group,
      roleNames.RestrictedRead
    );
  }

  if (special2HasRead) {
    newRequestPermissions.addPrincipalRole(
      special2Group,
      roleNames.RestrictedRead
    );
  }

  const actionOffices = request.FieldMap.ActionOffice.Value();

  actionOffices.map((ao) =>
    newRequestPermissions.addPrincipalRole(
      new People(ao.UserGroup),
      roleNames.RestrictedRead
    )
  );

  await appContext.AuditRequests.SetItemPermissions(
    request,
    newRequestPermissions,
    true
  );
}

export async function getRequestInternalItem(request) {
  const requestInternalResult =
    await appContext.AuditRequestsInternals.FindByColumnValue(
      [{ column: "ReqNum", op: "eq", value: request.ID }],
      {},
      {}
    );

  if (requestInternalResult.results.length) {
    if (requestInternalResult.results.length > 1) {
      //TODO: attempt to purge extra items
      console.error(
        requestInternalResult.results.length + " internal items!",
        request
      );
    }
    return requestInternalResult.results[0];
  }
  return;
}

export async function getRequestCoversheets(request) {
  const coversheetsResult = await appContext.AuditCoversheets.FindByColumnValue(
    [{ column: "ReqNum", value: request.ID }],
    {},
    {}
  );

  return coversheetsResult.results;
}

export async function getRequestResponses(request) {
  const responsesResult = await appContext.AuditResponses.FindByColumnValue(
    [{ column: "ReqNum", value: request.ID }],
    {},
    { includePermissions: true }
  );

  return responsesResult.results;
}

export async function getRequestResponseDocs(request) {
  const responsesResult = await appContext.AuditResponseDocs.FindByColumnValue(
    [{ column: "ReqNum", value: request.ID }],
    {},
    { includePermissions: true }
  );

  return responsesResult.results;
}

export async function getRequestResponseDocsFolders(responseTitle) {
  const responsesResult = await appContext.AuditResponseDocs.FindByColumnValue(
    [{ column: "Title", value: responseTitle }],
    {},
    { includeFolders: true },
    ["ID", "Title"]
  );

  return responsesResult.results;
}

/* TO BE UPDATED */
