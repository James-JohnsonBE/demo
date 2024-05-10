export class BaseFieldModule {
  constructor(params) {
    Object.assign(this, params);
  }

  _id;
  getUniqueId = () => {
    if (!this._id) {
      this._id = "field-" + new Date().getTime();
    }
    return this._id;
  };

  Errors = ko.pureComputed(() => {
    if (!this.ShowErrors()) return [];
    if (!this.isRequired) return [];
    return this.Value()
      ? []
      : [
          new ValidationError(
            "text-field",
            "required-field",
            this.displayName + ` is required!`
          ),
        ];
  });

  ShowErrors = ko.observable(false);

  ValidationClass = ko.pureComputed(() => {
    if (!this.ShowErrors()) return;
    return this.Errors().length ? "is-invalid" : "is-valid";
  });
}
