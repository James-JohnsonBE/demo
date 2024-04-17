import { registerFieldComponent } from "../infrastructure/register_components.js";
import BaseField from "./base_field.js";
import BaseFieldModule from "../components/fields/base_field_module.js";
// import ValidationError from "../primitives/validation_error.js";

const components = {
  view: "text-view",
  edit: "text-edit",
  new: "text-edit",
};

registerFieldComponent({
  name: "text",
  components,
  viewModel: BaseFieldModule,
  folder: "text",
});

export default class TextField extends BaseField {
  constructor(params) {
    super(params);
    this.attr = params.attr ?? {};
    this.options = params.options ?? null;
  }

  options;

  components = components;
}
