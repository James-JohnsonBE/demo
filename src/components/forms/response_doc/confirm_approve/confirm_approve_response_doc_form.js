import { registerComponent } from "../../../../sal/infrastructure/index.js";
import { m_fnApproveResponseDocsForQA } from "../../../../pages/ia_db/ia_db_services.js";
import { approveResponseDocsForRO } from "../../../../services/index.js";
import { AUDITREQUESTTYPES } from "../../../../entities/index.js";
const componentName = "confirm-approve-response-doc";
export class ConfirmApproveResponseDocForm {
  constructor(request, response, responseDocs) {
    this.request = request;
    this.response = response;
    this.responseDocs(responseDocs);

    switch (request.reqType) {
      case AUDITREQUESTTYPES.TASKER:
        this.sendToText("Send to " + request.requestingOffice);
        break;
      case AUDITREQUESTTYPES.REQUEST:
        this.sendToText("Send to QA");
        break;
      default:
        this.sendToText("Uh Oh");
    }
  }

  sendToText = ko.observable();

  responseDocs = ko.observableArray();
  saving = ko.observable(false);

  async clickSubmit() {
    this.saving(true);
    await this.submit();
    this.saving(false);
  }

  async submit() {
    const responseDocIds = this.responseDocs().map((doc) => doc.ID);
    let result;
    switch (this.request.reqType) {
      case AUDITREQUESTTYPES.TASKER:
        result = await approveResponseDocsForRO(
          this.request.ID,
          responseDocIds
        );
        break;
      case AUDITREQUESTTYPES.REQUEST:
        result = await m_fnApproveResponseDocsForQA(
          this.request,
          this.responseDocs()
        );
        break;
      default:
        this.sendToText("Uh Oh");
    }

    // const result = await m_fnApproveResponseDocsForQA(
    //   this.request,
    //   this.responseDocs()
    // );
    if (result) {
      this.onComplete(true);
    }
  }

  componentName = componentName;
  params = this;
}

registerComponent({
  name: componentName,
  folder: "forms/response_doc/confirm_approve",
  template: "ConfirmApproveResponseDocFormTemplate",
});
