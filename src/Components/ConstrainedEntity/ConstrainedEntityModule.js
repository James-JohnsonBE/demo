import { registerComponent } from "../../infrastructure/RegisterComponents.js";

const componentName = "default-constrained-entity";

export class ConstrainedEntityComponent {
  constructor({ entityView, displayMode }) {
    Object.assign(this, entityView);
    this.displayMode = displayMode;
  }

  componentName = componentName;
}

class ConstrainedEntityModule {
  constructor({ FormFields, displayMode }) {
    this.FormFields = FormFields;
    this.displayMode = displayMode;
  }
}

registerComponent({
  name: componentName,
  folder: "ConstrainedEntity",
  module: ConstrainedEntityModule,
  template: "ConstrainedEntityTemplate",
});

// Object.keys(defaultComponents).map((key) =>
//   registerComponent({
//     name: defaultComponents[key],
//     folder: "ConstrainedEntity",
//     module: ConstrainedEntityModule,
//     template: "Default" + key,
//   })
// );
