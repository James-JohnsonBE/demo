import { registerComponent } from "../../../../sal/infrastructure/index.js";
import { m_fnApproveResponseDocsForQA } from "../../../../pages/ia_db/ia_db_services.js";
const componentName = "confirm-approve-response-doc";
export class ConfirmApproveResponseDocForm {
  constructor(request, response, responseDocs) {
    this.request = request;
    this.response = response;
    this.responseDocs(responseDocs);
  }

  responseDocs = ko.observableArray();
  saving = ko.observable(false);

  async clickSubmit() {
    this.saving(true);
    await this.submit();
    this.saving(false);
  }

  async submit() {
    const result = await m_fnApproveResponseDocsForQA(
      this.request,
      this.responseDocs()
    );
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
