import { addResponse } from "../../../../services/index.js";
import { AuditResponse } from "../../../../entities/index.js";

import { BaseForm } from "../../../../sal/components/forms/index.js";
import { directRegisterComponent } from "../../../../sal/infrastructure/index.js";
import { newResponseFormTemplate } from "./NewResponseFormTemplate.js";

const componentName = "custome-new-response-form";

export class NewResponseForm extends BaseForm {
  constructor({ entity }) {
    super({ entity, view: AuditResponse.Views.NewForm });
  }

  async clickSubmit() {
    this.saving(true);
    await this.submit();
    this.saving(false);
  }

  async submit() {
    const errors = this.validate();
    if (errors.length) return;

    const response = ko.unwrap(this.entity);

    const result = await addResponse(response.ReqNum.Value(), response);
    if (result.isFailure) {
      alert(result.error);
      return;
    }
    this.onComplete(SP.UI.DialogResult.OK);
  }

  clearForm() {}

  fieldIsEditable(field) {
    const entity = ko.unwrap(this.entity);

    const nonEditableFields = [entity.ReqNum];

    return !nonEditableFields.includes(field);
  }

  componentName = componentName;
}

directRegisterComponent(componentName, {
  template: newResponseFormTemplate,
});
