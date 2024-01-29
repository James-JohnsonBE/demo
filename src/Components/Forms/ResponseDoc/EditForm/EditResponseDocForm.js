import { BaseForm } from "../../BaseForm.js";
import { updateResponseDoc } from "../../../../services/AuditResponseService.js";

import { registerComponent } from "../../../../infrastructure/RegisterComponents.js";
import { currentUser } from "../../../../services/PeopleManager.js";
import {
  AuditResponseDoc,
  AuditResponseDocStates,
} from "../../../../entities/AuditResponseDocs.js";
import { AUDITREQUESTSTATES } from "../../../../entities/AuditRequest.js";
import { AuditResponseStates } from "../../../../entities/AuditResponse.js";

const componentName = "custome-edit-responsedoc-form";

export class EditResponseDocForm extends BaseForm {
  constructor({ entity }) {
    super({ entity, view: AuditResponseDoc.Views.EditForm });
    this.currentResponseDocStatus = entity.DocumentStatus.Value();
    entity.DocumentStatus.Value.subscribe(this.onStatusChangedHandler, this);
  }

  onStatusChangedHandler = (newValue) => {
    if (newValue != this.currentResponseDocStatus) {
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

    const responseDoc = ko.unwrap(this.entity);
    const request = responseDoc.ReqNum.Value();
    const response = responseDoc.ResID.Value();

    try {
      await updateResponseDoc(request, response, responseDoc);
      this.onComplete(SP.UI.DialogResult.OK);
    } catch (e) {
      alert(e);
    }
  }

  fieldIsEditable(field) {
    const entity = ko.unwrap(this.entity);

    const nonEditableFields = [entity.ReqNum, entity.ResID, entity.FileName];

    return !nonEditableFields.includes(field);
  }

  StatusErrors = ko.pureComputed(() => {
    const errors = [];
    const responseDoc = ko.unwrap(this.entity);
    if (!responseDoc) return errors;
    const requestStatus = responseDoc.ReqNum.Value()?.ReqStatus.Value();
    const responseStatus = responseDoc.ResID.Value()?.ResStatus.Value();

    if (
      requestStatus != AUDITREQUESTSTATES.OPEN &&
      requestStatus != AUDITREQUESTSTATES.REOPENED
    ) {
      errors.push(
        "The Request associated to this Document is not Open. It can only be re-opened from the IA Dashboard"
      );
    }

    if (responseStatus == AuditResponseStates.Closed) {
      errors.push(
        "The Response associated to this Document is Closed. It can only be re-opened from the IA Dashboard"
      );
    }

    return errors;
  });

  componentName = componentName;
}

registerComponent({
  name: componentName,
  folder: "Forms/ResponseDoc/EditForm",
  template: "EditResponseDocFormTemplate",
});
