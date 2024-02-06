import { registerComponent } from "../../../../infrastructure/RegisterComponents.js";
import { m_fnApproveResponseDocsForQA } from "../../../../pages/IA_DB/IA_DB.js";
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
    await m_fnApproveResponseDocsForQA(this.request, this.responseDocs());
    this.onComplete(true);
  }

  componentName = componentName;
  params = this;
}

registerComponent({
  name: componentName,
  folder: "Forms/ResponseDoc/ConfirmApprove",
  template: "ConfirmApproveResponseDocFormTemplate",
});
