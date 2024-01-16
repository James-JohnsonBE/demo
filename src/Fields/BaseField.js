import { ValidationError } from "../primitives/ValidationError.js";

export default class BaseField {
  constructor({
    displayName,
    systemName,
    instructions = null,
    isRequired = false,
    width,
    Visible = ko.pureComputed(() => true),
  }) {
    // The name that will be displayed on components etc.
    this.displayName = displayName;
    // The column name this should be mapped to when persisting
    this.systemName = systemName;
    this.instructions = instructions;
    this.isRequired = isRequired;
    this.Visible = Visible;
    this.width = width ? "col-md-" + width : "col-md-6";

    this.addFieldRequirement(isRequiredValidationRequirement(this));
  }

  Value = ko.observable();

  get = () => this.Value();
  set = (val) => this.Value(val);
  clear = () => {
    if (ko.isObservableArray(this.Value)) this.Value([]);
    else this.Value(null);
  };

  toString = ko.pureComputed(() => this.Value());

  toJSON = () => this.Value();
  fromJSON = (val) => this.Value(val);

  validate = (showErrors = true) => {
    this.ShowErrors(showErrors);
    return this.Errors();
  };

  Errors = ko.pureComputed(() => {
    if (!this.Visible()) return [];
    const errors = this._fieldValidationRequirements()
      .filter((req) => req.requirement())
      .map((req) => req.error);

    return errors;
  });

  _fieldValidationRequirements = ko.observableArray();

  addFieldRequirement = (requirement) =>
    this._fieldValidationRequirements.push(requirement);

  IsValid = ko.pureComputed(() => !this.Errors().length);

  ShowErrors = ko.observable(false);

  // TODO: this should go in the field component base class since it's purely UI.
  ValidationClass = ko.pureComputed(() => {
    if (!this.ShowErrors()) return;
    return this.Errors().length ? "is-invalid" : "is-valid";
  });
}

function isRequiredValidationRequirement(field) {
  return {
    requirement: ko.pureComputed(() => {
      const isRequired = ko.utils.unwrapObservable(field.isRequired);
      if (!isRequired || field.Value()) return false;
      return true;
    }),
    error: new ValidationError(
      "text-field",
      "required-field",
      `${ko.utils.unwrapObservable(field.displayName)} is required!`
    ),
  };
}
