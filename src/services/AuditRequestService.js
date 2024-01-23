import { appContext } from "../infrastructure/ApplicationDbContext.js";
import { getPeopleByUsername, getSiteGroups } from "./PeopleManager.js";
import { roleNames } from "./PermissionManager.js";
import { ItemPermissions } from "../infrastructure/SAL.js";
import { AuditResponseStates } from "../entities/AuditResponse.js";
import { People } from "../entities/People.js";
import { AuditRequestsInternal } from "../entities/AuditRequestsInternal.js";
import { AuditRequest } from "../entities/AuditRequest.js";

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

export async function AddNewRequest(request) {
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

  await onAddNewRequest(request);
}

export async function onAddNewRequest(request) {
  await Promise.all([
    ensureRequestPermissions(request),
    ensureAuditEmailFolder(request),
    ensureRequestInternalItem(request),
  ]);
}

export async function updateRequest(request) {
  await appContext.AuditRequests.UpdateEntity(
    request,
    AuditRequest.Views.AOCanUpdate
  );
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

export async function ensureRequestPermissions(request) {
  const perms = await appContext.AuditRequests.GetItemPermissions(request);
  if (!perms.hasUniqueRoleAssignments) {
    if (window.DEBUG) console.log("Request does not have unique permissions");
    await breakRequestPermissions(request);
  }
}

export async function ensureRequestInternalItem(request) {
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

/* TO BE UPDATED */
