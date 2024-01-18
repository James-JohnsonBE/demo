import {
  AuditResponse,
  AuditResponseStates,
} from "../entities/AuditResponse.js";
import { AuditResponseDoc } from "../entities/AuditResponseDocs.js";
import { appContext } from "../infrastructure/ApplicationDbContext.js";
import { showModal } from "../infrastructure/SPModalService.js";

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
  // Update title
  const responseTitle = getResponseTitle(request, response);

  response.Title.Value(responseTitle);

  response.ResStatus.Value(AuditResponseStates.Open);

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
}

export async function updateResponse(request, response) {
  // FPRA Check
  const actionOfficeTitle = response.ActionOffice.Value()?.Title?.toLowerCase();
  if (!actionOfficeTitle.includes("fpra")) {
    if (response.POC.toString() || response.POCCC.toString()) {
      throw new Error("Please clear the POC and CC fields.");
    }
  }

  // Sensitivity Check
  const currentResponseSensitivity = request.Sensitivity.Value();
  const selectedResponseStatus = response.ResStatus.Value();

  if (
    selectedResponseStatus == AuditResponseStates.ApprovedForQA &&
    currentResponseSensitivity == "None"
  )
    throw new Error("Request Sensitivity not set; cannot submit to QA.");

  const responseTitle = getResponseTitle(request, response);

  if (response.Title.Value() != responseTitle)
    response.Title.Value(responseTitle);

  await appContext.AuditResponses.UpdateEntity(
    response,
    AuditResponse.Views.AOCanUpdate
  );
}

export async function updateResponseDoc(request, response, responseDoc) {
  await appContext.AuditResponseDocs.UpdateEntity(
    responseDoc,
    AuditResponseDoc.Views.AOCanUpdate
  );
}

function getResponseTitle(request, response) {
  return `${request.ReqNum.Value()}-${
    response.ActionOffice.Value()?.Title
  }-${response.SampleNumber.Value()}`;
}
