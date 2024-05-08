import { registerFieldComponent } from "../infrastructure/register_components.js";
import BaseField from "./base_field.js";
import BaseFieldModule from "../components/fields/base_field_module.js";

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

export default class CheckboxField extends BaseField {
  constructor(params) {
    super(params);
  }

  components = components;
}
