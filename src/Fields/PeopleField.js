import { People } from "../entities/People.js";
import { registerFieldComponent } from "../infrastructure/RegisterComponents.js";
import BaseField from "./BaseField.js";
import BaseFieldModule from "../components/Fields/BaseFieldModule.js";

const components = {
  view: "people-view",
  edit: "people-edit",
  new: "people-edit",
};

registerFieldComponent("people", components, BaseFieldModule);

export default class PeopleField extends BaseField {
  constructor(params) {
    super(params);
  }

  toString = ko.pureComputed(() => this.Value()?.Title);

  set = (val) => this.Value(People.Create(val));

  components = components;
}
