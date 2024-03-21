import { registerFieldComponent } from "../infrastructure/RegisterComponents.js";
import BaseField from "./BaseField.js";
import BaseFieldModule from "../components/Fields/BaseFieldModule.js";

const components = {
  view: "checkbox-view",
  edit: "checkbox-edit",
  new: "checkbox-edit",
};

registerFieldComponent("checkbox", components, BaseFieldModule);

export default class CheckboxField extends BaseField {
  constructor(params) {
    super(params);
  }

  components = components;
}
