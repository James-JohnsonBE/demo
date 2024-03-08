import {
  AUDITREQUESTSTATES,
  AuditRequest,
} from "../../../../entities/AuditRequest.js";
import { appContext } from "../../../../infrastructure/ApplicationDbContext.js";
import { registerComponent } from "../../../../infrastructure/RegisterComponents.js";
import { ValidationError } from "../../../../primitives/ValidationError.js";
import { addNewRequest } from "../../../../services/AuditRequestService.js";
import { BaseForm } from "../../BaseForm.js";
import { configurationsStore } from "../../../../infrastructure/Store.js";

export const newRequestFormComponentName = "newRequestForm";

export class NewRequestFormComponent {
  constructor(params) {
    this.onComplete = params?.onComplete;
  }

  onComplete;

  newRequest = ko.observable(new AuditRequest());

  params = ko.pureComputed(() => {
    return {
      newRequest: this.newRequest,
      reset: this.reset,
      onComplete: this.onComplete,
    };
  });

  componentName = newRequestFormComponentName;
}

export default class NewRequestFormModule extends BaseForm {
  constructor({ newRequest, onComplete }) {
    super({ entity: newRequest, view: AuditRequest.Views.New });

    this.onComplete = onComplete;
    this.prepopulateRequestFields();
  }

  saving = ko.observable(false);

  prepopulateRequestFields() {
    const request = ko.unwrap(this.entity);

    if (!request) return;

    const fy = configurationsStore["CurrentFY"];
    request.FiscalYear.Value(fy);

    request.Reminders.Value(request.Reminders.Options());
    request.ReqStatus.Value(AUDITREQUESTSTATES.OPEN);
  }

  async clickSubmit() {
    this.saving(true);
    await this.submit();
    this.saving(false);
  }

  async submit() {
    const errors = this.validate();
    if (errors.length) return;

    const request = this.entity();

    try {
      await addNewRequest(request);
      this.onComplete(SP.UI.DialogResult.OK);
    } catch (e) {
      alert(e);
    }
  }

  clearForm() {
    this.entity(new AuditRequest());
    this.prepopulateRequestFields();
  }
}

registerComponent({
  name: newRequestFormComponentName,
  folder: "Forms/Request/NewForm",
  module: NewRequestFormModule,
  template: "NewRequestFormTemplate",
});
