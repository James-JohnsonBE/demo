import { AuditRequest } from "../../entities/AuditRequest.js";
import { registerComponent } from "../../infrastructure/RegisterComponents.js";

export const newRequestFormComponentName = "newRequestForm";

export class NewRequestFormComponent {
  constructor(params) {
    this.params = params;
  }
  params;
  componentName = newRequestFormComponentName;
}

export default class NewRequestFormModule {
  constructor(params) {}

  newRequest = new AuditRequest();

  submit() {
    const request = this.newRequest;
    const errors = request.validate();
  }
}

registerComponent({
  name: newRequestFormComponentName,
  folder: "NewRequestForm",
  module: NewRequestFormModule,
  template: "NewRequestFormTemplate",
});
