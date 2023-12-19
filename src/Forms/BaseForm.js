import { registerComponent } from "../infrastructure/RegisterComponents.js";

export const defaultComponents = {
  view: "default-constrained-view",
  edit: "default-constrained-edit",
  new: "default-constrained-edit",
};

Object.keys(defaultComponents).map((key) =>
  registerComponent({
    name: defaultComponents[key],
    folder: "ConstrainedEntity",
    module: "ConstrainedEntityModule",
    template: "Default" + key,
  })
);

export default class BaseForm {
  constructor(params) {}

  FieldMap = {};

  toJSON = () => {
    const out = {};
    Object.keys(this.FieldMap).map(
      (key) => (out[key] = this.FieldMap[key]?.get())
    );
    return out;
  };

  fromJSON(inputObj) {
    if (window.DEBUG)
      console.log("Setting constrained entity from JSON", inputObj);
    Object.keys(inputObj).map((key) => this.FieldMap[key]?.set(inputObj[key]));
  }

  FormFields = ko.pureComputed(() => {
    return Object.values(this.FieldMap).filter((field) => field?.Visible());
  });

  FormFieldKeys = ko.pureComputed(() =>
    Object.keys(this.FieldMap).filter((key) => this.FieldMap[key]?.Visible())
  );

  validate = (showErrors = true) => {
    Object.values(this.FieldMap).map(
      (field) => field?.validate && field.validate(showErrors)
    );
    this.ShowErrors(showErrors);
    return this.Errors();
  };

  ShowErrors = ko.observable(false);
  Errors = ko.pureComputed(() => {
    // if (!this.ShowErrors()) return [];

    return Object.values(this.FieldMap)
      .filter((field) => field?.Errors && field.Errors())
      .flatMap((field) => field.Errors());
  });

  IsValid = ko.pureComputed(() => !this.Errors().length);

  components = defaultComponents;
}
