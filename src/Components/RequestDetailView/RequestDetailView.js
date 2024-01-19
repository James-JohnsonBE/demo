import { appContext } from "../../infrastructure/ApplicationDbContext.js";
import { registerComponent } from "../../infrastructure/RegisterComponents.js";
import { uploadRequestCoversheetFile } from "../../services/CoversheetManager.js";
import { EditCoverSheetForm } from "../Forms/CoverSheet/EditForm/EditCoversheetForm.js";
import * as ModalDialog from "../../infrastructure/ModalDialog.js";
import { getRequestByTitle } from "../../services/AuditRequestService.js";

const componentName = "component-request-detail-view";

export class RequestDetailView {
  constructor({
    bDisplayClose,
    currentRequest,
    arrCurrentRequestCoverSheets,
    arrCurrentRequestResponses,
    cntResponseDocs,
    arrCurrentRequestResponseDocs,
    ClickEditCoversheet,
  }) {
    // this.report = args;
    this.bDisplayClose = bDisplayClose;
    this.currentRequest = currentRequest;
    this.arrCurrentRequestCoverSheets = arrCurrentRequestCoverSheets;
    this.arrCurrentRequestResponses = arrCurrentRequestResponses;
    this.cntResponseDocs = cntResponseDocs;
    this.arrCurrentRequestResponseDocs = arrCurrentRequestResponseDocs;

    this.editCoversheet = ClickEditCoversheet;
    /*
    ROOT FUNCTIONS 
    ClickViewCoversheet
    ClickEditCoversheet
    ClickUploadCoverSheet

    ClickAddResponse
    ClickBulkAddResponse
    ClickBulkEditResponse
    ClickReOpenResponse

    ClickViewResponse
    ClickEditResponse
    ClickReviewingResponse
    ClickViewResponseDocFolder
    ClickUploadToResponseDocFolder


    ClickDeleteResponseDoc
    ClickCheckInResponseDocument
    ClickResendRejectedResponseDocToQA
    ClickViewResponseDoc
    ClickEditResponseDoc
    */
    this.coverSheetFiles.subscribeAdded(this.onCoverSheetFileAttachedHandler);
  }

  coverSheetFiles = ko.observableArray();

  onCoverSheetFileAttachedHandler = async (newFiles) => {
    if (!newFiles.length) return;
    const request = await appContext.AuditRequests.FindById(
      this.currentRequest().ID
    );

    // Only allow 1 coversheet at a time
    const file = newFiles[0];
    const coversheet = await uploadRequestCoversheetFile(file, request);
    this.editCoversheet({ ID: coversheet.ID });
  };

  currentRequestResponseItems = ko.pureComputed(() => {
    return this.arrCurrentRequestResponses().map(
      (response) => new ResponseItem(response, this)
    );
  });

  componentName = componentName;
  params = this;
}

registerComponent({
  name: componentName,
  folder: "RequestDetailView",
  template: "RequestDetailViewTemplate",
});

class ResponseItem {
  constructor(response, report) {
    Object.assign(this, response);

    this.responseCoversheetFiles.subscribeAdded(
      this.onCoversheetFilesAttachedHandler
    );

    this.responseDocFiles.subscribeAdded(
      this.onResponseDocFilesAttachedHandler
    );
  }

  responseCoversheetFiles = ko.observableArray();
  responseDocFiles = ko.observableArray();

  onCoversheetFilesAttachedHandler = async (files) => {
    if (!files.length) return;
    const request = await getRequestByTitle(this.number);
    // const response = await appContext.AuditResponses.FindById(this.ID);
    const actionOfficeId = this.item.get_item("ActionOffice")?.get_lookupId();
    const actionOfficeIds = [];
    if (actionOfficeId) {
      actionOfficeIds.push({ ID: actionOfficeId });
    }
    const promises = [];

    for (let file of files) {
      promises.push(
        new Promise(async (resolve) => {
          const newSheet = await uploadRequestCoversheetFile(
            file,
            request,
            actionOfficeIds
          );
          //   this.requestCoversheets.push(new RequestDetailCoversheet(newSheet));
          resolve();
        })
      );
    }

    await Promise.all(promises);
    // TODO: need to requery coversheets
    window.location.reload();

    this.responseCoversheetFiles.removeAll();
  };

  onResponseDocFilesAttachedHandler = async (files) => {
    if (!files.length) return;
    // const request = await getRequestByTitle(this.number);
    const response = await appContext.AuditResponses.FindById(this.ID);

    const promises = [];

    for (let file of files) {
      promises.push(
        new Promise(async (resolve) => {
          const newSheet = await response.uploadResponseDocFile(file);
          resolve();
        })
      );
    }

    await Promise.all(promises);
    // TODO: need to requery responsedocs
    window.location.reload();
  };
}
