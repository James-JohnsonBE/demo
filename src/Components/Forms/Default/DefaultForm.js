import { BaseForm } from "../BaseForm.js";
import { registerComponent } from "../../../infrastructure/RegisterComponents.js";

const componentName = "default-constrained-entity-form";

/**
 * Combines functionality for View, Edit, Disp in one component.
 */
export class DefaultForm extends BaseForm {
  constructor({ entity, view, displayMode }) {
    super({ entity, view });
    // this.entityView = new ConstrainedEntityView({ entity, view });
    this.displayMode(displayMode);
  }

  displayMode = ko.observable();

  onSubmit() {}

  onCancel() {}

  onClear() {}

  params = this;
  componentName = componentName;
}

registerComponent({
  name: componentName,
  folder: "Forms/Default",
  // module: ConstrainedEntityModule,
  template: "DefaultFormTemplate",
});
