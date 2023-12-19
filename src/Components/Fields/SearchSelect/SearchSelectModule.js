import BaseFieldModule from "../BaseFieldModule.js";

export default class SearchSelectModule extends BaseFieldModule {
  constructor(field) {
    super(field);
    this.Options = field.Options;
    this.Value = field.Value;
    this.optionsText =
      field.optionsText ??
      ((val) => {
        return val;
      });
    this.multiple = field.multiple;
    this.OptionsCaption = field.OptionsCaption ?? "Select...";
  }

  GetSelectedOptions = ko.pureComputed(() => {
    if (this.multiple) return this.Value();

    return this.Value() ? [this.Value()] : [];
  });

  InputGroupFocused = ko.observable();
  setFocus = () => this.InputGroupFocused(true);

  FilterText = ko.observable();
  FilteredOptions = ko.pureComputed(() =>
    this.Options().filter((option) => {
      if (this.GetSelectedOptions().indexOf(option) >= 0) return false;
      if (this.FilterText())
        return this.optionsText(option)
          .toLowerCase()
          .includes(this.FilterText().toLowerCase());
      return true;
    })
  );

  addSelection = (option, e) => {
    console.log("selected", option);
    if (e.target.nextElementSibling) {
      //e.stopPropagation();
      e.target.nextElementSibling.focus();
    }
    if (this.multiple) {
      this.Value.push(option);
    } else {
      this.Value(option);
    }
  };

  removeSelection = (option) =>
    this.multiple ? this.Value.remove(option) : this.Value(null);

  setInputGroupFocus = () => {
    this.InputGroupFocused(true);
    clearTimeout(this.focusOutTimeout);
  };

  removeInputGroupFocus = (data, e) => {
    this.focusOutTimeout = window.setTimeout(() => {
      this.InputGroupFocused(false);
    }, 0);
  };
}
