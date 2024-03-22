import { registerComponent } from "../../../../infrastructure/register_components.js";
import { deleteRequest } from "../../../../services/audit_request_service.js";

const componentName = "confirm-delete-request";
export class ConfirmDeleteRequestForm {
  constructor(request) {
    this.request = request;
  }

  saving = ko.observable();

  async clickSubmit() {
    this.saving(true);
    await this.submit();
    this.saving(false);
  }

  async submit() {
    const result = await deleteRequest(this.request.ID);
    if (result) {
      this.onComplete(true);
    }
  }

  componentName = componentName;
  params = this;
}

registerComponent({
  name: componentName,
  folder: "forms/request/confirm_delete",
  template: "ConfirmDeleteRequestFormTemplate",
});
