import {
  breakRequestPermissions,
  getRequestById,
  getRequestResponseDocs,
  getRequestResponses,
  breakRequestCoversheetPerms,
  getNewResponseDocTtitle,
  ensureRequestAuditResponseDocsROFolder,
  ensureRequestROEmailLogItem,
} from "./index.js";

import { AuditResponseStates } from "../entities/index.js";

import { appContext } from "../infrastructure/application_db_context.js";

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

async function approveResponseDocsForRO(requestId, responseDocsToApproveIds) {
  const request = await getRequestById(requestId);

  const requestingOffice = request.RequestingOffice.Value();

  if (!requestingOffice) return;

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

  if (!updatedResponses.length) return;

  await ensureRequestAuditResponseDocsROFolder(
    request.Title,
    requestingOffice.ID
  );

  const roEmailLogItem = await ensureRequestROEmailLogItem(requestingOffice);

  let cntApprovedResponseDocs = 0;
  // For each response doc to approve
  await Promise.all(
    responseDocsToApproveIds.map(async (responseDocId) => {
      const responseDoc = allRequestResponseDocs.find(
        (responseDoc) => responseDoc.ID == responseDocId
      );

      // 1. Check that the status isn't already approved
      if (
        responseDoc.DocumentStatus.Value() ==
        AuditResponseDocStates.ApprovedForQA
      )
        return;

      cntApprovedResponseDocs++;

      const response = allRequestResponses.find(
        (response) => response.ID == responseDoc.ResID.Value().ID
      );

      // 2. Get New ResponseDoc title
      const newReponseDocFileName = getNewResponseDocTtitle(
        request,
        response,
        responseDoc
      );

      // 3. Copy File to RO

      // 4. Update ResponseDoc Status
    })
  );
}
