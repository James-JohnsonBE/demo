import {
  AuditResponse,
  AuditResponseStates,
  AuditResponseDoc,
  AuditResponseDocStates,
} from "../entities/index.js";

import { appContext } from "../infrastructure/application_db_context.js";
import { showModal } from "../sal/components/modal/index.js";
import { ItemPermissions } from "../sal/infrastructure/sal.js";
import { ValidationError } from "../sal/primitives/validation_error.js";
import { Result } from "../sal/shared/index.js";

import {
  breakRequestPermissions,
  getRequestById,
  getRequestResponseDocs,
  getRequestResponses,
  requestHasSpecialPerms,
} from "./audit_request_service.js";
import { breakRequestCoversheetPerms } from "./coversheet_manager.js";
import {
  getQAGroup,
  getSiteGroups,
  getSpecialPermGroups,
} from "./people_manager.js";
import { roleNames } from "./permission_manager.js";
import { addTask, finishTask, taskDefs } from "./tasks.js";

export async function showBulkAddResponseModal(request) {
  const options = {
    title: "Bulk Add Responses (" + request.ReqNum.Value() + ")",
    height: 800,
    url:
      Audit.Common.Utilities.GetSiteUrl() +
      "/SitePages/AuditBulkAddResponse.aspx?ReqNum=" +
      request.ReqNum.Value(),
  };

  await showModal(options);
}

export async function addResponse(request, response) {
  const responseTitle = getResponseTitle(request, response);
  const newResponseTask = addTask(taskDefs.newResponse(responseTitle));
  // Update title

  response.ReqNum.Value(request);

  response.Title.Value(responseTitle);

  response.ResStatus.Value(AuditResponseStates.Open);

  try {
    // Validate title is unique
    const responseResult = await appContext.AuditResponses.FindByColumnValue(
      [
        {
          column: "Title",
          value: responseTitle,
        },
      ],
      {},
      { count: 1 }
    );

    if (responseResult.results.length) {
      throw new Error(`Response with title ${responseTitle} already exists!`);
    }

    await appContext.AuditResponses.AddEntity(response);
  } catch (e) {
    console.error("Error adding Response: ", e);

    finishTask(newResponseTask);
    return Result.Failure(e);
  }

  finishTask(newResponseTask);
  return Result.Success();
}

export async function onAddNewResponse(request, response) {
  if (!request) {
    request = response.ReqNum.Value();
    await appContext.AuditRequests.LoadEntity(request);
  }

  const folderResult = await ensureResponseDocFolder(response);
  if (folderResult.isFailure) {
    return folderResult;
  }

  const permissionsResult = await ensureResponseDocFolderPermissions(
    request,
    response,
    folderResult.value
  );
}

export async function ensureResponseDocFolder(response) {
  const folderName = response.Title.toString();

  const results = await appContext.AuditResponseDocs.FindByColumnValue(
    [
      { column: "Title", value: folderName },
      { column: "ContentType", value: "Folder" },
    ],
    {},
    { count: 1, includePermissions: true, includeFolders: true }
  );

  if (results.results.length) {
    return Result.Success(results.results[0]);
  }

  // Else, we need to insert it
  const newFolderId = await appContext.AuditResponseDocs.UpsertFolderPath(
    folderName
  );

  const newFolder = await appContext.AuditResponseDocs.FindById(newFolderId);

  if (newFolder) {
    return Result.Success(newFolder);
  }

  return Result.Failure(`Folder not found and couldn't be created`);
}

export async function ensureResponseDocFolderPermissions(
  request,
  response,
  folder
) {
  const newItemPermissions = new ItemPermissions({
    hasUniqueRoleAssignments: true,
    roles: [],
  });

  const { owners, members, visitors } = await getSiteGroups();

  newItemPermissions.addPrincipalRole(owners, roleNames.FullControl);
  newItemPermissions.addPrincipalRole(members, roleNames.RestrictedContribute);
  newItemPermissions.addPrincipalRole(visitors, roleNames.RestrictedRead);

  if (request.isRequest()) {
    const qaGroup = await getQAGroup();
    newItemPermissions.addPrincipalRole(
      qaGroup,
      roleNames.RestrictedContribute
    );
  }
  const actionOffice = response.ActionOffice.Value();

  newItemPermissions.addPrincipalRole(
    actionOffice.UserGroup,
    roleNames.RestrictedContribute
  );

  if (await requestHasSpecialPerms(request)) {
    const { specialPermGroup1, specialPermGroup2 } =
      await getSpecialPermGroups();

    newItemPermissions.addPrincipalRole(
      specialPermGroup1,
      roleNames.RestrictedRead
    );
    newItemPermissions.addPrincipalRole(
      specialPermGroup2,
      roleNames.RestrictedRead
    );
  }

  const result = await appContext.AuditResponseDocs.SetItemPermissions(
    { ID: folder.ID },
    newItemPermissions,
    true
  );

  return result;
}

export async function updateResponse(request, response) {
  const updateResponseTask = addTask(
    taskDefs.updateResponse(response.Title.Value())
  );

  try {
    // FPRA Check
    const actionOfficeTitle =
      response.ActionOffice.Value()?.Title?.toLowerCase();
    if (!actionOfficeTitle.includes("fpra")) {
      if (response.POC.toString() || response.POCCC.toString()) {
        throw new Error(
          "Only FPRA Responses can have designated POC and POC CC fields."
        );
      }
    }

    // Sensitivity Check
    const currentResponseSensitivity = request.Sensitivity.Value();
    const selectedResponseStatus = response.ResStatus.Value();

    if (
      selectedResponseStatus == AuditResponseStates.ApprovedForQA &&
      currentResponseSensitivity == "None"
    ) {
      throw new Error("Request Sensitivity not set; cannot submit to QA.");
    }

    const responseTitle = getResponseTitle(request, response);

    if (response.Title.Value() != responseTitle)
      response.Title.Value(responseTitle);

    await appContext.AuditResponses.UpdateEntity(
      response,
      AuditResponse.Views.IACanUpdate
    );
  } catch (e) {
    console.error("Error Updating Response: ", e);
    alert(e.message);
  } finally {
    finishTask(updateResponseTask);
  }
}

export async function deleteResponseAndFolder(response) {
  // Find the Response Folder
  const responseTitle = response.Title.Value();

  const deleteFolderTask = addTask(
    taskDefs.deleteResponseDocFolder(responseTitle)
  );
  await appContext.AuditResponseDocs.RemoveFolderByPath(responseTitle);
  finishTask(deleteFolderTask);

  const deleteItemTask = addTask(taskDefs.deleteResponse(responseTitle));
  await appContext.AuditResponses.RemoveEntityById(response.ID);
  finishTask(deleteItemTask);
  return;
}

export async function updateResponseDoc(request, response, responseDoc) {
  const updateResponseDocTask = addTask(
    taskDefs.updateResponseDoc(responseDoc.Title.Value())
  );

  await appContext.AuditResponseDocs.UpdateEntity(
    responseDoc,
    AuditResponseDoc.Views.AOCanUpdate
  );

  finishTask(updateResponseDocTask);
}

export async function getResponsesReadyToClose(requestId) {
  const allRequestResponseDocs = await getRequestResponseDocs(request);

  const allRequestResponses = await getRequestResponses(request);

  return allRequestResponses.filter((response) =>
    isResponseReadyToClose(response, allRequestResponseDocs)
  );
}

async function isResponseReadyToClose(response, responseDocs) {
  const openResponseDocs = responseDocs.filter(
    (responseDoc) =>
      responseDoc.ResID.ID == response.ID &&
      [AuditResponseDocStates.Open, AuditResponseDocStates.Submitted].includes(
        responseDoc.DocumentStatus.Value()
      )
  );

  return openResponseDocs.length;
}

export async function closeResponseById(responseId) {
  const response = await appContext.AuditResponses.FindById(responseId);
  // TODO: Use Result
  if (!response) return;
  return closeResponse(response);
}

async function closeResponse(response) {
  const closeResponseTask = addTask(
    taskDefs.closeResponse(response.Title.Value())
  );

  response.markClosed();
  await appContext.AuditResponses.UpdateEntity(
    response,
    AuditResponse.Views.IAUpdateClosed
  );

  finishTask(closeResponseTask);
}

export async function uploadResponseDocFile(response, file) {
  const uploadResponseDocTask = addTask(taskDefs.uploadResponseDoc(file.name));
  const fileMetadata = {
    Title: file.name,
    ReqNumId: response.ReqNum.Value().ID,
    ResIDId: response.ID,
  };

  await appContext.AuditResponseDocs.UploadFileToFolderAndUpdateMetadata(
    file,
    file.name,
    response.Title.Value(),
    fileMetadata,
    ({ currentBlock, totalBlocks }) =>
      uploadResponseDocTask.updateProgress({
        percentDone: currentBlock / totalBlocks,
      })
  );
  finishTask(uploadResponseDocTask);
}

function getResponseTitle(request, response) {
  return `${request.ReqNum.Value()}-${
    response.ActionOffice.Value()?.Title
  }-${response.SampleNumber.Value()}`;
}

/* Begin Unreferenced Service Rewrites */

export function getNewResponseDocTitle(request, response, responseDoc) {
  const oldResponseDocTitle = responseDoc.FileName.Value();

  const createdDate = responseDoc.Created.Value().format("yyyyMMddTHHmmss");
  const responseName = response.Title.Value();
  const sensitivity = request.Sensitivity.Value();

  let newResponseDocTitle =
    responseName + "_" + createdDate + "_" + Math.ceil(Math.random() * 10000);

  if (sensitivity && sensitivity != "None")
    newResponseDocTitle += "_" + sensitivity;

  var docName = oldResponseDocTitle.substring(
    0,
    oldResponseDocTitle.lastIndexOf(".")
  );
  var docExt = oldResponseDocTitle.replace(docName, "");
  newResponseDocTitle += docExt;

  // Only use the new filename if it's not already encoded
  if (
    !oldResponseDocTitle.includes(responseName) ||
    !oldResponseDocTitle.includes(createdDate) ||
    (sensitivity && !oldResponseDocTitle.includes(sensitivity))
  )
    return newResponseDocTitle;

  return oldResponseDocTitle;
}
