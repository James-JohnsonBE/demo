import { AuditRequest } from "../../entities/AuditRequest.js";
import { registerComponent } from "../../infrastructure/RegisterComponents.js";
import { ConstrainedEntityView } from "../../primitives/ConstrainedEntityView.js";

export const newRequestFormComponentName = "newRequestForm";

export class NewRequestFormComponent {
  constructor(params) {}

  newRequest = ko.observable(
    new ConstrainedEntityView({
      entity: new AuditRequest(),
      view: AuditRequest.Views.New,
    })
  );

  reset = () =>
    this.newRequest(
      new ConstrainedEntityView({
        entity: new AuditRequest(),
        view: AuditRequest.Views.New,
      })
    );

  params = {
    newRequest: this.newRequest,
    reset: this.reset,
  };

  componentName = newRequestFormComponentName;
}

export default class NewRequestFormModule {
  constructor({ newRequest, reset }) {
    this.newRequest = newRequest;
    this.reset = reset;
  }

  // newRequest = new ConstrainedEntityView({
  //   entity: new AuditRequest(),
  //   view: AuditRequest.Views.New,
  // });
  // newRequest = AuditRequest.components.new(new AuditRequest());

  submit() {
    const request = this.newRequest;
    const errors = request.validate();
    if (errors.length) return;
  }

  clearForm() {
    this.reset();
  }
}

registerComponent({
  name: newRequestFormComponentName,
  folder: "NewRequestForm",
  module: NewRequestFormModule,
  template: "NewRequestFormTemplate",
});
