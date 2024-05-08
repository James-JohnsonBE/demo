import { registerFieldComponent } from "../infrastructure/register_components.js";
import BaseField from "./base_field.js";
import SearchSelectModule from "../components/fields/search_select/search_select_module.js";
import BaseFieldModule from "../components/fields/base_field_module.js";

const components = {
  view: "select-view",
  edit: "select-edit",
  new: "select-edit",
};

const searchSelectComponents = {
  view: "search-select-view",
  edit: "search-select-edit",
  new: "search-select-edit",
};

registerFieldComponent({
  name: "select",
  components,
  viewModel: BaseFieldModule,
  folder: "select",
});

registerFieldComponent({
  name: "searchselect",
  components: searchSelectComponents,
  viewModel: SearchSelectModule,
  folder: "search_select",
});

export default class SelectField extends BaseField {
  constructor({
    displayName,
    isRequired = false,
    Visible,
    options,
    multiple = false,
    optionsText,
  }) {
    super({ Visible, displayName, isRequired });
    this.Options(options);
    this.multiple = multiple;
    this.Value = multiple ? ko.observableArray() : ko.observable();
    this.optionsText = optionsText;

    this.components = this.multiple ? searchSelectComponents : components;
  }

  toString = ko.pureComputed(() =>
    this.multiple ? this.Value().join(", ") : this.Value()
  );

  get = () => this.Value();

  set = (val) => {
    if (val && this.multiple) {
      if (Array.isArray(val)) {
        this.Value(val);
      } else {
        this.Value(val.results ?? val.split(";#"));
      }
      return;
    }
    this.Value(val);
  };

  Options = ko.observableArray();
}
