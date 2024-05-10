import { updateResponse } from "../../../../services/audit_response_service.js";
import {
  AuditResponse,
  AuditResponseStates,
} from "../../../../entities/index.js";
import { currentUser } from "../../../../services/people_manager.js";

import { BaseForm } from "../../../../sal/components/forms/index.js";
import { registerComponent } from "../../../../sal/infrastructure/index.js";

const componentName = "custome-edit-response-form";

export class EditResponseForm extends BaseForm {
  constructor({ entity }) {
    super({ entity, view: AuditResponse.Views.EditForm });
    this.currentResponseStatus = entity.ResStatus.Value();
    entity.ResStatus.Value.subscribe(this.onStatusChangedHandler, this);
  }

  onStatusChangedHandler = async (newValue) => {
    if (
      newValue != this.currentResponseStatus &&
      newValue == AuditResponseStates.Closed
    ) {
      const response = ko.unwrap(this.entity);
      const curUser = await currentUser();
      response.ClosedBy.Value(curUser);
      response.ClosedDate.Value(new Date());
    }
  };

  async clickSubmit() {
    this.saving(true);
    await this.submit();
    this.saving(false);
  }

  async submit() {
    const errors = this.validate();
    if (errors.length) return;

    const response = ko.unwrap(this.entity);

    try {
      await updateResponse(response.ReqNum.Value(), response);
      this.onComplete(SP.UI.DialogResult.OK);
    } catch (e) {
      alert(e);
    }
  }

  fieldIsEditable(field) {
    const entity = ko.unwrap(this.entity);

    const nonEditableFields = [
      entity.ReqNum,
      entity.Title,
      entity.SampleNumber,
    ];

    return !nonEditableFields.includes(field);
  }

  componentName = componentName;
}

registerComponent({
  name: componentName,
  folder: "forms/response/edit_form",
  template: "EditResponseFormTemplate",
});
