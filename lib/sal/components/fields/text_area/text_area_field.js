import { registerFieldComponent } from "../infrastructure/register_components.js";
import BaseField from "./base_field.js";
import TextAreaModule from "../components/fields/text_area/text_area_module.js";

const components = {
  view: "text-area-view",
  edit: "text-area-edit",
  new: "text-area-edit",
};

registerFieldComponent({
  name: "textarea",
  components,
  viewModel: TextAreaModule,
  folder: "text_area",
});

export default class TextAreaField extends BaseField {
  constructor(params) {
    super(params);
    this.isRichText = params.isRichText;
    this.isMinimalEditor = params.isMinimalEditor;
    this.attr = params.attr ?? {};
  }

  components = components;
}
