import { People } from "../entities/index.js";
import { registerFieldComponent } from "../infrastructure/index.js";
import { BaseField } from "./index.js";
import { BaseFieldModule } from "../components/fields/index.js";

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

export class PeopleField extends BaseField {
  constructor(params) {
    super(params);
  }

  toString = ko.pureComputed(() => this.Value()?.Title);

  set = (val) => this.Value(People.Create(val));

  components = components;
}
