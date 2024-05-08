import { People } from "../entities/people.js";
import { registerFieldComponent } from "../infrastructure/register_components.js";
import BaseField from "./base_field.js";
import BaseFieldModule from "../components/fields/base_field_module.js";

const components = {
  view: "people-view",
  edit: "people-edit",
  new: "people-edit",
};

registerFieldComponent({
  name: "people",
  components,
  viewModel: BaseFieldModule,
});

export default class PeopleField extends BaseField {
  constructor(params) {
    super(params);
  }

  toString = ko.pureComputed(() => this.Value()?.Title);

  set = (val) => this.Value(People.Create(val));

  components = components;
}
