import { AuditRequest } from "../../entities/AuditRequest.js";
import { appContext } from "../../infrastructure/ApplicationDbContext.js";
import { registerComponent } from "../../infrastructure/RegisterComponents.js";
import { ConstrainedEntityView } from "../../primitives/ConstrainedEntityView.js";
import { ValidationError } from "../../primitives/ValidationError.js";
import { AddNewRequest } from "../../services/AuditRequestService.js";

export const newRequestFormComponentName = "newRequestForm";

export class NewRequestFormComponent {
  constructor({ onSubmitSuccess }) {
    this.onSubmitSuccess = onSubmitSuccess;
  }

  newRequest = ko.observable(new AuditRequest());

  params = ko.pureComputed(() => {
    return {
      newRequest: this.newRequest,
      reset: this.reset,
      onSubmitSuccess: this.onSubmitSuccess,
    };
  });

  componentName = newRequestFormComponentName;
}

export default class NewRequestFormModule extends ConstrainedEntityView {
  constructor({ newRequest, onSubmitSuccess }) {
    super({ entity: newRequest, view: AuditRequest.Views.New });

    this.onSubmitSuccess = onSubmitSuccess;

    this.init();
  }

  saving = ko.observable(false);

  init() {
    const request = this.entity();
    const internalDueDate = request.FieldMap.InternalDueDate.Value;
    const reqDueDate = request.FieldMap.ReqDueDate.Value;

    request.FieldMap.InternalDueDate.addFieldRequirement({
      requirement: ko.pureComputed(() => {
        return internalDueDate() > reqDueDate();
      }),
      error: new ValidationError(
        "text-field",
        "required-field",
        "The Internal Due Date must be before the Request Due Date!"
      ),
    });
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
      await AddNewRequest(request);
      // this.onSubmitSuccess(SP.UI.DialogResult.OK);
    } catch (e) {
      alert(e);
    }
  }

  clearForm() {
    this.entity(new AuditRequest());
    this.init();
  }
}

registerComponent({
  name: newRequestFormComponentName,
  folder: "NewRequestForm",
  module: NewRequestFormModule,
  template: "NewRequestFormTemplate",
});
