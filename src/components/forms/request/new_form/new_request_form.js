import {
  AUDITREQUESTSTATES,
  AuditRequest,
} from "../../../../entities/index.js";

import { addNewRequest } from "../../../../services/index.js";

import { configurationsStore } from "../../../../infrastructure/store.js";
import { BaseForm } from "../../../../sal/components/forms/index.js";
import { directRegisterComponent } from "../../../../sal/infrastructure/index.js";
import { newRequestFormTemplate } from "./NewRequestFormTemplate.js";

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

    const fy = configurationsStore["current-fy"];
    request.FiscalYear.Value(fy);

    const reqType = configurationsStore["default-req-type"];
    request.ReqType.Value(reqType);

    request.Reminders.Value([
      "3 Days Before Due",
      "1 Day Before Due",
      "1 Day Past Due",
      "3 Days Past Due",
      "7 Days Past Due",
    ]);

    const remindersText = configurationsStore["default-reminders"];
    if (remindersText) {
      try {
        const reminders = JSON.parse(remindersText);
        request.Reminders.Value(reminders);
      } catch (e) {
        console.warn("Error parsing reminders default", remindersText);
      }
    }

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

directRegisterComponent(newRequestFormComponentName, {
  template: newRequestFormTemplate,
  viewModel: NewRequestFormModule,
});
