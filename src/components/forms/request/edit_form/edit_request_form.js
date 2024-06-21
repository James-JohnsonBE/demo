import { updateRequest } from "../../../../services/index.js";
import { BaseForm } from "../../../../sal/components/forms/index.js";
import { editRequestFormTemplate } from "./EditRequestFormTemplate.js";
import { directRegisterComponent } from "../../../../sal/infrastructure/index.js";

const componentName = "custom-edit-request-form";

export class EditRequestForm extends BaseForm {
  constructor({ entity }) {
    super({ entity });

    this.init();
  }

  init() {}

  async clickSubmit() {
    this.saving(true);
    await this.submit();
    this.saving(false);
  }

  async submit() {
    const errors = this.validate();
    if (errors.length) return;

    const request = this.entity;

    try {
      await updateRequest(request);
      this.onComplete(SP.UI.DialogResult.OK);
    } catch (e) {
      alert(e);
    }
  }

  fieldIsEditable(field) {
    const request = this.entity;

    const nonEditableFields = [request.ReqNum, request.EmailSent];

    return !nonEditableFields.includes(field);
  }

  params = this;
  componentName = componentName;
}

directRegisterComponent(componentName, {
  template: editRequestFormTemplate,
});
