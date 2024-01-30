import { appContext } from "../../../../infrastructure/ApplicationDbContext.js";
import { registerComponent } from "../../../../infrastructure/RegisterComponents.js";
import {
  approveResponseDocsForQA,
  rejectResponseDoc,
} from "../../../../pages/IA_DB/IA_DB_Services.js";
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
        return rejectResponseDoc(
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

registerComponent({
  name: componentName,
  folder: "Forms/ResponseDoc/ConfirmReject",
  template: "ConfirmRejectResponseDocFormTemplate",
});
