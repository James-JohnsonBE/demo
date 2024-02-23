import {
  AuditResponse,
  AuditResponseStates,
} from "../entities/AuditResponse.js";
import {
  AuditResponseDoc,
  AuditResponseDocStates,
} from "../entities/AuditResponseDocs.js";
import { appContext } from "../infrastructure/ApplicationDbContext.js";
import { showModal } from "../infrastructure/SPModalService.js";
import {
  breakRequestPermissions,
  getRequestById,
  getRequestResponseDocs,
  getRequestResponses,
} from "./AuditRequestService.js";
import { breakRequestCoversheetPerms } from "./CoversheetManager.js";
import { addTask, finishTask, taskDefs } from "./Tasks.js";

export async function showBulkAddResponseModal(request) {
  const options = {
    title: "Bulk Add Responses (" + request.ReqNum.Value() + ")",
    height: 800,
    url:
      Audit.Common.Utilities.GetSiteUrl() +
      "/pages/AuditBulkAddResponse.aspx?ReqNum=" +
      request.ReqNum.Value(),
  };

  await showModal(options);
}

export async function addResponse(request, response) {
  const responseTitle = getResponseTitle(request, response);
  const newResponseTask = addTask(taskDefs.newResponse(responseTitle));
  // Update title

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
    alert(e.message);
  } finally {
    finishTask(newResponseTask);
  }
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
      AuditResponse.Views.AOCanUpdate
    );
  } catch (e) {
    console.error("Error Updating Response: ", e);
    alert(e.message);
  } finally {
    finishTask(updateResponseTask);
  }
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
    fileMetadata
  );
  finishTask(uploadResponseDocTask);
}

function getResponseTitle(request, response) {
  return `${request.ReqNum.Value()}-${
    response.ActionOffice.Value()?.Title
  }-${response.SampleNumber.Value()}`;
}

/* Begin Unreferenced Service Rewrites */
async function approveResponseDocsForQA(
  requestId,
  responseId = null,
  responseDocsToApproveIds
) {
  const request = await getRequestById(requestId);

  const allRequestResponseDocs = await getRequestResponseDocs(request);

  const allRequestResponses = await getRequestResponses(request);

  const updatedResponses = allRequestResponseDocs
    .filter((responseDoc) => responseDocsToApproveIds.includes(responseDoc.ID))
    .map((responseDoc) => responseDoc.ResID.Value())
    .reduce((accumulator, responseDocResponse) => {
      if (
        !accumulator.find((response) => response?.ID == responseDocResponse.ID)
      )
        accumulator.push(responseDocResponse);
      return accumulator;
    }, []);

  await Promise.all(
    responseDocsToApproveIds.map(async (responseDocId) => {
      const responseDoc = allRequestResponseDocs.find(
        (responseDoc) => responseDoc.ID == responseDocId
      );

      // TODO: this should just be an ensure on our AppDbContext
      const response = allRequestResponses.find(
        (response) => response.ID == responseDoc.ResID.Value().ID
      );

      if (
        responseDoc.DocumentStatus.Value() != AuditResponseDocStates.Submitted
      ) {
        console.error("Document status is not valid for approval");
        return;
      }

      responseDoc.DocumentStatus.Value(AuditResponseDocStates.SentToQA);

      // TODO: Fix naming conflicting with drag and drop upload

      const newReponseDocName = getNewResponseDocTtitle(
        request,
        response,
        responseDoc
      );

      responseDoc.FileName.Value(newReponseDocName);

      await appContext.AuditResponseDocs.UpdateEntity(
        responseDoc,
        AuditResponseDoc.Views.UpdateDocStatus
      );
    })
  );

  // Now see if we can approve any responses for QA
  const responsesToSubmitToQA = updatedResponses.filter((response) => {
    return response.ResStatus.Value() == AuditResponseStates.Submitted;
  });

  if (responsesToSubmitToQA.length) {
    await Promise.all(
      responsesToSubmitToQA.map(async (response) => {
        response.ResStatus.Value(AuditResponseStates.ApprovedForQA);
        await appContext.AuditResponses.UpdateEntity(response, ["ResStatus"]);
      })
    );

    // Break the request permissions
    await breakRequestPermissions(request, AuditResponseStates.ApprovedForQA);
    await breakRequestCoversheetPerms(request, true);
  }
}

function getNewResponseDocTtitle(request, response, responseDoc) {
  const createdDate = responseDoc.Created.Value();
  const responseName = response.Title.Value();
  const sensitivity = request.Sensitivity.Value();

  let newResponseDocTitle =
    responseName + "_" + createdDate.format("yyyyMMddTHHmmss");

  if (sensitivity != null && sensitivity != "" && sensitivity != "None")
    newResponseDocTitle += "_" + sensitivity;

  var oldResponseDocTitle = responseDoc.FileName.Value();
  var docName = oldResponseDocTitle.substring(
    0,
    oldResponseDocTitle.lastIndexOf(".")
  );
  var docExt = oldResponseDocTitle.replace(docName, "");
  newResponseDocTitle += docExt;
  return newResponseDocTitle;
}
