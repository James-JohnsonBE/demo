import { registerFieldComponent } from "../infrastructure/index.js";
import { BaseField } from "./index.js";
import {
  BaseFieldModule,
  SearchSelectModule,
} from "../components/fields/index.js";

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
  folder: "searchselect",
});

export class SelectField extends BaseField {
  constructor(params) {
    super(params);
    const { options, multiple, optionsText } = params;
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
