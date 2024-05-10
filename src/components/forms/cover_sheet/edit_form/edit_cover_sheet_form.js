import { BaseForm } from "../../../../sal/components/forms/index.js";
import { registerComponent } from "../../../../sal/infrastructure/index.js";
import { updateRequestCoverSheet } from "../../../../services/coversheet_manager.js";

const componentName = "custom-edit-coversheet-form";

export class EditCoverSheetForm extends BaseForm {
  constructor({ entity }) {
    super({ entity });
  }

  async clickSubmit() {
    this.saving(true);
    await this.submit();
    this.saving(false);
  }

  async submit() {
    const errors = this.validate();
    if (errors.length) return;

    const coverSheet = this.entity;

    try {
      await updateRequestCoverSheet(coverSheet);
      this.onComplete(SP.UI.DialogResult.OK);
    } catch (e) {
      alert(e);
    }
  }

  fieldIsEditable(field) {
    const entity = this.entity;

    const nonEditableFields = [entity.ReqNum, entity.FileRef];

    return !nonEditableFields.includes(field);
  }

  params = this;
  componentName = componentName;
}

registerComponent({
  name: componentName,
  folder: "forms/cover_sheet/edit_form",
  template: "EditCoverSheetFormTemplate",
});
