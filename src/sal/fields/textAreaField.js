import { registerFieldComponent } from "../infrastructure/index.js";
import { BaseField } from "./index.js";
import { TextAreaModule } from "../components/fields/index.js";

const components = {
  view: "text-area-view",
  edit: "text-area-edit",
  new: "text-area-edit",
};

registerFieldComponent({
  name: "textarea",
  components,
  viewModel: TextAreaModule,
  folder: "textarea",
});

export class TextAreaField extends BaseField {
  constructor(params) {
    super(params);
    this.isRichText = params.isRichText;
    this.isMinimalEditor = params.isMinimalEditor;
    this.attr = params.attr ?? {};
  }

  components = components;
}
