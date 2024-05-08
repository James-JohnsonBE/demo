import { BaseForm } from "../base_form.js";
import { registerComponent } from "../../../infrastructure/register_components.js";

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

  clickSubmit() {}

  clickCancel() {}

  clickClear() {}

  params = this;
  componentName = componentName;
}

registerComponent({
  name: componentName,
  folder: "forms/default",
  // module: ConstrainedEntityModule,
  template: "DefaultFormTemplate",
});
