import { registerFieldComponent } from "../infrastructure/index.js";
import { BaseField } from "./index.js";
import { BaseFieldModule } from "../components/fields/index.js";

const components = {
  view: "checkbox-view",
  edit: "checkbox-edit",
  new: "checkbox-edit",
};

registerFieldComponent({
  name: "checkbox",
  components,
  viewModel: BaseFieldModule,
});

export class CheckboxField extends BaseField {
  constructor(params) {
    super(params);
  }

  components = components;
}
