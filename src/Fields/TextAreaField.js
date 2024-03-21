import { registerFieldComponent } from "../infrastructure/RegisterComponents.js";
import BaseField from "./BaseField.js";
import TextAreaModule from "../components/Fields/TextArea/TextAreaModule.js";

const components = {
  view: "text-area-view",
  edit: "text-area-edit",
  new: "text-area-edit",
};

registerFieldComponent("textarea", components, TextAreaModule);

export default class TextAreaField extends BaseField {
  constructor(params) {
    super(params);
    this.isRichText = params.isRichText;
    this.isMinimalEditor = params.isMinimalEditor;
    this.attr = params.attr ?? {};
  }

  components = components;
}
