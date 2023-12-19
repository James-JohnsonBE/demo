import { ValidationError } from "../primitives/ValidationError.js";

export default class BaseField {
  constructor({
    displayName,
    instructions = null,
    isRequired = false,
    width,
    Visible = ko.pureComputed(() => true),
  }) {
    this.displayName = displayName;
    this.instructions = instructions;
    this.isRequired = isRequired;
    this.Visible = Visible;
    this.width = width ? "col-md-" + width : "col-md-6";
  }

  Value = ko.observable();

  get = () => this.Value();
  set = (val) => this.Value(val);

  toString = ko.pureComputed(() => this.Value());

  toJSON = () => this.Value();
  fromJSON = (val) => this.Value(val);

  validate = (showErrors = true) => {
    this.ShowErrors(showErrors);
    return this.Errors();
  };

  Errors = ko.pureComputed(() => {
    if (!this.Visible()) return [];
    const isRequired =
      typeof this.isRequired == "function"
        ? this.isRequired()
        : this.isRequired;
    if (!isRequired) return [];
    return this.Value()
      ? []
      : [
          new ValidationError(
            "text-field",
            "required-field",
            (typeof this.displayName == "function"
              ? this.displayName()
              : this.displayName) + ` is required!`
          ),
        ];
  });

  IsValid = ko.pureComputed(() => !this.Errors().length);

  ShowErrors = ko.observable(false);

  ValidationClass = ko.pureComputed(() => {
    if (!this.ShowErrors()) return;
    return this.Errors().length ? "is-invalid" : "is-valid";
  });
}
