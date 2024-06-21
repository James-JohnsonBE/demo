import {
  html,
  BaseFieldModule,
  registerFieldComponents,
} from "./BaseFieldModule.js";

const editTemplate = html`
  <label class="fw-semibold"
    ><span data-bind="text: displayName"></span
    ><span data-bind="if: isRequired" class="fw-bold text-danger">*</span>:
  </label>
  <div class="row row-cols-auto" data-bind="foreach: GetSelectedOptions">
    <div class="col pb-1">
      <div class="input-group input-group-sm">
        <div
          class="input-group-text"
          data-bind="text: $parent.optionsText($data)"
        ></div>
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          style="min-width: 1.5rem"
          data-bind="click: $parent.removeSelection"
        >
          <svg
            class="position-absolute top-50 start-50 translate-middle"
            style="width: 1rem; height: 1rem"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
  <div
    tabindex="-1"
    data-bind="event: {
  focusin: setInputGroupFocus,
  focusout: removeInputGroupFocus,
  }"
    class="position-relative"
  >
    <input
      placehold="Search to select..."
      class="form-control form-control-sm"
      data-bind="textInput: FilterText"
    />
    <div
      data-bind="foreach: FilteredOptions, visible: InputGroupFocused"
      class="list-group overflow-y-scroll position-absolute w-100"
      style="max-height: 200px"
    >
      <button
        type="button"
        class="list-group-item list-group-item-action z-3"
        data-bind="click: $parent.addSelection, 
      text: $parent.optionsText($data)"
      ></button>
    </div>
  </div>
  <!-- ko if: instructions -->
  <div
    class="fw-lighter fst-italic text-secondary"
    data-bind="html: instructions"
  ></div>
  <!-- /ko -->
  <!-- ko if: ShowErrors -->
  <!-- ko foreach: Errors -->
  <div class="fw-semibold text-danger" data-bind="text: description"></div>
  <!-- /ko -->
  <!-- /ko -->
`;

export class SearchSelectModule extends BaseFieldModule {
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

  static editTemplate = editTemplate;

  static view = "search-select-view";
  static edit = "search-select-edit";
  static new = "search-select-new";
}

registerFieldComponents(SearchSelectModule);
