import { registerComponent } from "../../../../infrastructure/RegisterComponents.js";
import { BaseForm } from "../../BaseForm.js";

const componentName = "custom-edit-request-form";
export class EditRequestForm extends BaseForm {
  constructor({ entity }) {
    super({ entity });

    this.init();
  }

  init() {}

  clickSubmit() {}

  async submit() {
    const errors = this.validate();
    if (errors.length) return;

    const request = this.entity;
  }

  fieldIsEditable(field) {
    const request = this.entity;

    const nonEditableFields = [request.ReqNum];

    return !nonEditableFields.includes(field);
  }

  params = this;
  componentName = componentName;
}

registerComponent({
  name: componentName,
  folder: "Forms/Request/EditForm",
  template: "EditRequestFormTemplate",
});
