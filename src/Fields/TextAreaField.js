import { registerFieldComponent } from "../infrastructure/RegisterComponents.js";
import BaseField from "./BaseField.js";

const components = {
  view: "text-area-view",
  edit: "text-area-edit",
  new: "text-area-edit",
};

registerFieldComponent("textarea", components);

export default class TextAreaField extends BaseField {
  constructor(params) {
    super(params);
    this.isRichText = params.isRichText;
    this.attr = params.attr ?? {};
  }

  components = components;
}
