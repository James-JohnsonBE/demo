import { directRegisterComponent } from "../../../../sal/infrastructure/index.js";
import { m_fnRejectResponseDoc } from "../../../../pages/ia_db/ia_db_services.js";
import { confirmRejectResponseDocFormTemplate } from "./ConfirmRejectResponseDocFormTemplate.js";

const componentName = "confirm-reject-response-doc";

export class ConfirmRejectResponseDocForm {
  constructor(request, response, responseDocs) {
    this.request = request;
    this.response = response;
    this.responseDocs(responseDocs);
  }

  rejectReason = ko.observable();
  responseDocs = ko.observableArray();
  saving = ko.observable(false);

  async clickSubmit() {
    this.saving(true);
    await this.submit();
    this.saving(false);
  }

  async submit() {
    await Promise.all(
      this.responseDocs().map((responseDoc) => {
        return m_fnRejectResponseDoc(
          this.request,
          responseDoc,
          this.rejectReason()
        );
      })
    );
    this.onComplete(true);
  }

  componentName = componentName;
  params = this;
}

directRegisterComponent(componentName, {
  template: confirmRejectResponseDocFormTemplate,
});
// registerComponent({
//   name: componentName,
//   folder: "forms/response_doc/confirm_reject",
//   template: "ConfirmRejectResponseDocFormTemplate",
// });
