import { registerComponent } from "../../infrastructure/RegisterComponents.js";

const componentName = "component-request-detail-view";

export class RequestDetailView {
  constructor(report) {
    this.report = report;

    /*
    currentRequest
    arrCurrentRequestCoverSheets
    arrCurrentRequestResponses

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

    cntResponseDocs

    arrCurrentRequestResponseDocs
    ClickDeleteResponseDoc
    ClickCheckInResponseDocument
    ClickResendRejectedResponseDocToQA
    ClickViewResponseDoc
    ClickEditResponseDoc
    */
  }
  report;

  componentName = componentName;
  params = this;
}

registerComponent({
  name: componentName,
  folder: "RequestDetailView",
  template: "RequestDetailViewTemplate",
});
