(() => {
  var __freeze = Object.freeze;
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));

  // src/sal/infrastructure/entity_utilities.js
  var sortByTitle;
  var init_entity_utilities = __esm({
    "src/sal/infrastructure/entity_utilities.js"() {
      sortByTitle = (a, b) => {
        if (a.Title > b.Title) {
          return 1;
        }
        if (a.Title < b.Title) {
          return -1;
        }
        return 0;
      };
    }
  });

  // src/sal/entities/People.js
  var People2;
  var init_People = __esm({
    "src/sal/entities/People.js"() {
      People2 = class _People {
        constructor({
          ID,
          Title,
          LoginName = null,
          IsGroup = null,
          IsEnsured = false
        }) {
          this.ID = ID;
          this.Title = Title;
          this.LookupValue = Title;
          this.LoginName = LoginName != "" ? LoginName : null;
          this.IsGroup = IsGroup;
          this.IsEnsured = IsEnsured;
        }
        ID = null;
        Title = null;
        LoginName = null;
        LookupValue = null;
        getKey = () => this.LoginName ?? this.Title;
        static Create = function(props) {
          if (!props || !props.ID && !(props.Title || props.LookupValue))
            return null;
          return new _People({
            ...props,
            Title: props.Title ?? props.LookupValue
          });
        };
      };
    }
  });

  // src/sal/primitives/validation_error.js
  var ValidationError2;
  var init_validation_error = __esm({
    "src/sal/primitives/validation_error.js"() {
      ValidationError2 = class {
        constructor(source, type, description) {
          this.source = source;
          this.type = type;
          this.description = description;
        }
      };
    }
  });

  // src/sal/primitives/entity.js
  var Entity;
  var init_entity = __esm({
    "src/sal/primitives/entity.js"() {
      Entity = class {
        constructor(params) {
          if (params?.ID)
            this.ID = params.ID;
          if (params?.Title)
            this.Title = params.Title;
        }
        ObservableID = ko.observable();
        ObservableTitle = ko.observable();
        get id() {
          return this.ObservableID();
        }
        set id(val) {
          this.ObservableID(val);
        }
        get Title() {
          return this.ObservableTitle();
        }
        set Title(val) {
          this.ObservableTitle(val);
        }
      };
    }
  });

  // src/sal/fields/BaseField.js
  function isRequiredValidationRequirement(field) {
    return {
      requirement: ko.pureComputed(() => {
        const isRequired = ko.unwrap(field.isRequired);
        if (!isRequired)
          return false;
        const value = ko.unwrap(field.Value);
        if (value?.constructor == Array)
          return !value.length;
        return value === null || value === void 0;
      }),
      error: new ValidationError2(
        "text-field",
        "required-field",
        `${ko.utils.unwrapObservable(field.displayName)} is required!`
      )
    };
  }
  var BaseField;
  var init_BaseField = __esm({
    "src/sal/fields/BaseField.js"() {
      init_validation_error();
      BaseField = class {
        constructor({
          displayName,
          systemName,
          instructions = null,
          isRequired = false,
          width,
          classList = [],
          Visible = ko.pureComputed(() => true)
        }) {
          this.displayName = displayName;
          this.systemName = systemName;
          this.instructions = instructions;
          this.isRequired = isRequired;
          this.Visible = Visible;
          this.width = width ? "col-md-" + width : "col-md-6";
          this.classList = classList;
          this.addFieldRequirement(isRequiredValidationRequirement(this));
        }
        Value = ko.observable();
        get = () => this.Value();
        set = (val) => this.Value(val);
        clear = () => {
          if (ko.isObservableArray(this.Value))
            this.Value([]);
          else
            this.Value(null);
        };
        toString = ko.pureComputed(() => this.Value());
        toJSON = () => this.Value();
        fromJSON = (val) => this.Value(val);
        validate = (showErrors = true) => {
          this.ShowErrors(showErrors);
          return this.Errors();
        };
        _fieldValidationRequirements = ko.observableArray();
        Errors = ko.pureComputed(() => {
          if (!this.Visible())
            return [];
          const errors = this._fieldValidationRequirements().filter((req) => req.requirement()).map((req) => req.error);
          return errors;
        });
        addFieldRequirement = (requirement) => this._fieldValidationRequirements.push(requirement);
        IsValid = ko.pureComputed(() => !this.Errors().length);
        ShowErrors = ko.observable(false);
        ValidationClass = ko.pureComputed(() => {
          if (!this.ShowErrors())
            return;
          return this.Errors().length ? "is-invalid" : "is-valid";
        });
      };
    }
  });

  // src/sal/components/fields/BaseFieldModule.js
  function registerFieldComponents(constructor) {
    ko.components.register(constructor.edit, {
      template: constructor.editTemplate,
      viewModel: constructor
    });
    ko.components.register(constructor.view, {
      template: constructor.viewTemplate,
      viewModel: constructor
    });
  }
  var html3, BaseFieldModule;
  var init_BaseFieldModule = __esm({
    "src/sal/components/fields/BaseFieldModule.js"() {
      html3 = String.raw;
      BaseFieldModule = class {
        constructor(params) {
          Object.assign(this, params);
        }
        _id;
        getUniqueId = () => {
          if (!this._id) {
            this._id = "field-" + Math.floor(Math.random() * 1e4);
          }
          return this._id;
        };
        Errors = ko.pureComputed(() => {
          if (!this.ShowErrors())
            return [];
          if (!this.isRequired)
            return [];
          return this.Value() ? [] : [
            new ValidationError(
              "text-field",
              "required-field",
              this.displayName + ` is required!`
            )
          ];
        });
        ShowErrors = ko.observable(false);
        ValidationClass = ko.pureComputed(() => {
          if (!this.ShowErrors())
            return;
          return this.Errors().length ? "is-invalid" : "is-valid";
        });
        static viewTemplate = html3`
    <div class="fw-semibold" data-bind="text: displayName"></div>
    <div data-bind="text: toString()"></div>
  `;
        static editTemplate = html3`<div>Uh oh!</div>`;
      };
    }
  });

  // src/sal/components/fields/BlobModule.js
  var editTemplate, viewTemplate, BlobModule;
  var init_BlobModule = __esm({
    "src/sal/components/fields/BlobModule.js"() {
      init_BaseFieldModule();
      editTemplate = html3`
  <h5>
    <span data-bind="text: displayName"></span
    ><span data-bind="if: isRequired" class="fw-bold text-danger">*</span>:
  </h5>
  <!-- ko ifnot: entityType -->
  <div class="alert alert-danger">Missing entity type</div>
  <!-- /ko -->
  <!-- ko if: entityType -->
  <!-- ko ifnot: multiple -->
  <div
    data-bind="component: {name: Value()?.components.edit, params: {Entity: Value()}}"
  ></div>
  <!-- /ko -->
  <!-- ko if: multiple -->
  <table class="table">
    <thead>
      <tr data-bind="">
        <!-- ko foreach: Cols -->
        <th data-bind="text: displayName"></th>
        <!-- /ko -->
        <th>Actions</th>
      </tr>
    </thead>
    <tbody data-bind="">
      <!-- ko foreach: {data: Value, as: 'row'} -->
      <tr data-bind="">
        <!-- ko foreach: {data: row.FormFields, as: 'col'} -->
        <td data-bind="text: col.toString"></td>
        <!-- /ko -->
        <td>
          <i
            title="remove item"
            class="fa-solid fa-trash pointer"
            data-bind="click: $parent.remove.bind(row)"
          ></i>
        </td>
      </tr>
      <!-- /ko -->
      <tr>
        <!-- ko foreach: NewItem()?.FormFields -->
        <td>
          <div
            data-bind="component: {name: components.edit, params: $data}"
          ></div>
        </td>
        <!-- /ko -->
        <td class="align-bottom">
          <button
            title="add and new"
            type="button"
            data-bind="click: submit"
            class="btn btn-success"
          >
            Add +
          </button>
        </td>
      </tr>
    </tbody>
  </table>
  <!-- /ko -->
  <!-- /ko -->
`;
      viewTemplate = html3`
  <h5>
    <span data-bind="text: displayName"></span
    ><span data-bind="if: isRequired" class="fw-bold text-danger">*</span>:
  </h5>
  <!-- ko ifnot: entityType -->
  <div class="alert alert-danger">Missing entity type</div>
  <!-- /ko -->
  <!-- ko if: entityType -->
  <!-- ko ifnot: multiple -->
  <!-- ko if: Value -->
  <div
    data-bind="component: {name: Value().components.view, params: {Entity: Value()}}"
  ></div>
  <!-- /ko -->
  <!-- /ko -->
  <!-- ko if: multiple -->
  <table class="table">
    <thead>
      <tr data-bind="">
        <!-- ko foreach: Cols -->
        <th data-bind="text: displayName"></th>
        <!-- /ko -->
      </tr>
    </thead>
    <tbody data-bind="">
      <!-- ko foreach: {data: Value, as: 'row'} -->
      <tr data-bind="">
        <!-- ko foreach: {data: row.FormFields, as: 'col'} -->
        <td data-bind="text: col.toString()"></td>
        <!-- /ko -->
      </tr>
      <!-- /ko -->
    </tbody>
  </table>
  <!-- /ko -->
  <!-- /ko -->
`;
      BlobModule = class extends BaseFieldModule {
        constructor(params) {
          super(params);
        }
        static viewTemplate = viewTemplate;
        static editTemplate = editTemplate;
        static view = "blob-view";
        static edit = "blob-edit";
        static new = "blob-edit";
      };
      registerFieldComponents(BlobModule);
    }
  });

  // src/sal/components/fields/CheckboxModule.js
  var editTemplate2, viewTemplate2, CheckboxModule;
  var init_CheckboxModule = __esm({
    "src/sal/components/fields/CheckboxModule.js"() {
      init_BaseFieldModule();
      editTemplate2 = html3`
  <div class="form-check form-switch">
    <label class="form-check-label"
      ><span class="fw-semibold" data-bind="text: displayName"></span>
      <input
        class="form-check-input"
        type="checkbox"
        role="switch"
        data-bind="checked: Value"
      />
      <!-- ko if: instructions -->
      <div
        class="fw-lighter fst-italic text-secondary"
        data-bind="html: instructions"
      ></div>
      <!-- /ko -->
    </label>
  </div>
`;
      viewTemplate2 = html3`
  <div class="form-check form-switch">
    <label class="form-check-label"
      ><span class="fw-semibold" data-bind="text: displayName"></span>
      <input
        class="form-check-input"
        type="checkbox"
        role="switch"
        data-bind="checked: Value"
        disabled
      />
    </label>
  </div>
`;
      CheckboxModule = class extends BaseFieldModule {
        constructor(params) {
          super(params);
        }
        static viewTemplate = viewTemplate2;
        static editTemplate = editTemplate2;
        static view = "checkbox-view";
        static edit = "checkbox-edit";
        static new = "checkbox-edit";
      };
      registerFieldComponents(CheckboxModule);
    }
  });

  // src/sal/components/fields/DateModule.js
  var editTemplate3, DateModule;
  var init_DateModule = __esm({
    "src/sal/components/fields/DateModule.js"() {
      init_BaseFieldModule();
      editTemplate3 = html3`
  <label class="fw-semibold"
    ><span data-bind="text: displayName"></span
    ><span data-bind="if: isRequired" class="fw-bold text-danger">*</span>:
    <input
      class="form-control"
      data-bind="value: inputBinding, class: ValidationClass, attr: {'type': type}"
    />
    <!-- ko if: instructions -->
    <div
      class="fw-lighter fst-italic text-secondary"
      data-bind="html: instructions"
    ></div>
    <!-- /ko -->
  </label>
  <!-- ko if: ShowErrors -->
  <!-- ko foreach: Errors -->
  <div class="fw-semibold text-danger" data-bind="text: description"></div>
  <!-- /ko -->
  <!-- /ko -->
`;
      DateModule = class extends BaseFieldModule {
        constructor(params) {
          super(params);
        }
        static editTemplate = editTemplate3;
        static view = "date-view";
        static edit = "date-edit";
        static new = "date-edit";
      };
      registerFieldComponents(DateModule);
    }
  });

  // src/sal/components/fields/LookupModule.js
  var editTemplate4, LookupModule;
  var init_LookupModule = __esm({
    "src/sal/components/fields/LookupModule.js"() {
      init_BaseFieldModule();
      editTemplate4 = html3`
  <label class="fw-semibold"
    ><span data-bind="text: displayName"></span
    ><span data-bind="if: isRequired" class="fw-bold text-danger">*</span>:
    <!-- ko if: isSearch -->
    <div data-bind="text: toString()"></div>
    <input class="form-control" data-bind="" />
    <!-- /ko -->
    <!-- ko ifnot: isSearch -->
    <!-- ko if: Options().length -->
    <!-- ko if: multiple -->
    <select
      class="form-select"
      name=""
      id=""
      multiple="true"
      data-bind="options: Options, 
  selectedOptions: Value,
  optionsText: optionsText,
  class: ValidationClass"
    ></select>
    <div class="fw-light flex justify-between">
      <p class="fst-italic">Hold ctrl to select multiple</p>
      <button type="button" class="btn btn-link h-1" data-bind="click: clear">
        CLEAR
      </button>
    </div>
    <!-- /ko -->
    <!-- ko ifnot: multiple -->
    <select
      class="form-select"
      name=""
      id=""
      data-bind="options: Options, 
    optionsCaption: 'Select...', 
    value: Value,
    optionsText: optionsText,
    class: ValidationClass"
    ></select>
    <!-- /ko -->
    <!-- /ko -->
    <!-- /ko -->
    <!-- ko if: instructions -->
    <div
      class="fw-lighter fst-italic text-secondary"
      data-bind="html: instructions"
    ></div>
    <!-- /ko -->
  </label>
  <!-- ko if: ShowErrors -->
  <!-- ko foreach: Errors -->
  <div class="fw-semibold text-danger" data-bind="text: description"></div>
  <!-- /ko -->
  <!-- /ko -->
`;
      LookupModule = class extends BaseFieldModule {
        constructor(field) {
          super(field);
          this.onSearchInput = field.onSearchInput;
          this.multiple = field.multiple ?? false;
        }
        // selectedOptions = ko.pureComputed({
        //   read: () => {
        //     if (this.multiple) return this.Value();
        //     return ko.unwrap(this.Value) ? [ko.unwrap(this.Value)] : [];
        //   },
        //   write: (val) => {
        //     if (this.multiple) {
        //       this.Value(val);
        //       return;
        //     }
        //     if (val.length) {
        //       this.Value(val[0]);
        //       return;
        //     }
        //     this.Value(null);
        //   },
        // });
        static editTemplate = editTemplate4;
        static view = "lookup-view";
        static edit = "lookup-edit";
        static new = "lookup-edit";
      };
      registerFieldComponents(LookupModule);
    }
  });

  // src/sal/components/fields/PeopleModule.js
  var editTemplate5, viewTemplate3, PeopleModule;
  var init_PeopleModule = __esm({
    "src/sal/components/fields/PeopleModule.js"() {
      init_BaseFieldModule();
      editTemplate5 = html3`
  <label class="fw-semibold w-100"
    ><span data-bind="text: displayName"></span
    ><span data-bind="if: isRequired" class="fw-bold text-danger">*</span>:
    <!-- ko ifnot: spGroupId -->
    <div
      data-bind="attr: {id: getUniqueId()}, 
      people: Value, 
      pickerOptions: pickerOptions,
      class: ValidationClass"
    ></div>
    <!-- /ko -->
    <!-- ko if: ShowUserSelect -->
    <select
      class="form-select"
      name=""
      id=""
      data-bind="options: userOpts, 
        optionsCaption: 'Select...', 
        optionsText: 'Title',
        value: ValueFunc,
        class: ValidationClass"
    ></select>
    <!-- /ko -->
    <!-- ko if: instructions -->
    <div
      class="fw-lighter fst-italic text-secondary"
      data-bind="html: instructions"
    ></div>
    <!-- /ko -->
  </label>
  <!-- ko if: ShowErrors -->
  <!-- ko foreach: Errors -->
  <div class="fw-semibold text-danger" data-bind="text: description"></div>
  <!-- /ko -->
  <!-- /ko -->
`;
      viewTemplate3 = html3`
  <div class="fw-semibold" data-bind="text: displayName"></div>
  <!-- ko if: toString -->
  <!-- ko ifnot: multiple -->
  <div
    data-bind="text: toString, 
      attr: {title: Value()?.LoginName}"
  ></div>
  <!-- /ko -->
  <!-- ko if: multiple -->
  <ul data-bind="foreach: Value">
    <li data-bind="attr: {title: LoginName}, text: Title"></li>
  </ul>
  <!-- /ko -->
  <!-- /ko -->
  <!-- ko ifnot: toString -->
  <div class="fst-italic">Not provided.</div>
  <!-- /ko -->
`;
      PeopleModule = class extends BaseFieldModule {
        constructor(params) {
          super(params);
        }
        ValueFunc = ko.pureComputed({
          read: () => {
            if (!this.Value())
              return;
            const userOpts = ko.unwrap(this.userOpts);
            return userOpts.find((opt) => opt.ID == this.Value().ID);
          },
          write: (opt) => {
            const userOpts = ko.unwrap(this.userOpts);
            if (!userOpts)
              return;
            this.Value(opt);
          }
        });
        ShowUserSelect = ko.pureComputed(() => {
          const groupName = this.spGroupName;
          if (!groupName)
            return false;
          const options = ko.unwrap(this.userOpts);
          return options.length;
        });
        static viewTemplate = viewTemplate3;
        static editTemplate = editTemplate5;
        static view = "people-view";
        static edit = "people-edit";
        static new = "people-edit";
      };
      registerFieldComponents(PeopleModule);
    }
  });

  // src/sal/components/fields/SearchSelectModule.js
  var editTemplate6, SearchSelectModule;
  var init_SearchSelectModule = __esm({
    "src/sal/components/fields/SearchSelectModule.js"() {
      init_BaseFieldModule();
      editTemplate6 = html3`
  <label class="fw-semibold"
    ><span data-bind="text: displayName"></span
    ><span data-bind="if: isRequired" class="fw-bold text-danger">*</span>:
  </label>
  <search-select
    class="form-select"
    data-bind="searchSelect: { 
      options: Options, 
      selectedOptions: Value,
      optionsText: optionsText,
      onSearchInput: onSearchInput
    }"
  >
  </search-select>
  <div class="fw-light flex justify-between">
    <p class="fst-italic"></p>
    <button type="button" class="btn btn-link h-1" data-bind="click: clear">
      CLEAR
    </button>
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
      SearchSelectModule = class extends BaseFieldModule {
        constructor(field) {
          super(field);
          this.Options = field.Options;
          this.Value = field.Value;
          this.optionsText = field.optionsText ?? ((val) => {
            return val;
          });
          this.multiple = field.multiple;
          this.OptionsCaption = field.OptionsCaption ?? "Select...";
          this.onSearchInput = field.onSearchInput;
        }
        GetSelectedOptions = ko.pureComputed(() => {
          if (this.multiple)
            return this.Value();
          return this.Value() ? [this.Value()] : [];
        });
        InputGroupFocused = ko.observable();
        setFocus = () => this.InputGroupFocused(true);
        FilterText = ko.observable();
        FilteredOptions = ko.pureComputed(
          () => this.Options().filter((option) => {
            if (this.GetSelectedOptions().indexOf(option) >= 0)
              return false;
            if (this.FilterText())
              return this.optionsText(option).toLowerCase().includes(this.FilterText().toLowerCase());
            return true;
          })
        );
        addSelection = (option, e) => {
          console.log("selected", option);
          if (e.target.nextElementSibling) {
            e.target.nextElementSibling.focus();
          }
          if (this.multiple) {
            this.Value.push(option);
          } else {
            this.Value(option);
          }
        };
        removeSelection = (option) => this.multiple ? this.Value.remove(option) : this.Value(null);
        setInputGroupFocus = () => {
          this.InputGroupFocused(true);
          clearTimeout(this.focusOutTimeout);
        };
        removeInputGroupFocus = (data2, e) => {
          this.focusOutTimeout = window.setTimeout(() => {
            this.InputGroupFocused(false);
          }, 0);
        };
        static editTemplate = editTemplate6;
        static view = "search-select-view";
        static edit = "search-select-edit";
        static new = "search-select-new";
      };
      registerFieldComponents(SearchSelectModule);
    }
  });

  // src/sal/components/fields/SelectModule.js
  var editTemplate7, SelectModule;
  var init_SelectModule = __esm({
    "src/sal/components/fields/SelectModule.js"() {
      init_BaseFieldModule();
      editTemplate7 = html3`
  <label class="fw-semibold"
    ><span data-bind="text: displayName"></span
    ><span data-bind="if: isRequired" class="fw-bold text-danger">*</span>:
    <!-- ko if: multiple -->
    <select
      class="form-select"
      name=""
      id=""
      multiple="true"
      data-bind="options: Options, 
        optionsCaption: 'Select...', 
        optionsText: optionsText,
        selectedOptions: Value,
        class: ValidationClass"
    ></select>
    <div class="fst-italic fw-light">Hold ctrl to select multiple.</div>
    <!-- /ko -->
    <!-- ko ifnot: multiple -->
    <select
      class="form-select"
      name=""
      id=""
      data-bind="options: Options, 
        optionsCaption: 'Select...', 
        optionsText: optionsText,
        value: Value,
        class: ValidationClass"
    ></select>
    <!-- /ko -->
    <!-- ko if: instructions -->
    <div
      class="fw-lighter fst-italic text-secondary"
      data-bind="html: instructions"
    ></div>
    <!-- /ko -->
  </label>
  <!-- ko if: ShowErrors -->
  <!-- ko foreach: Errors -->
  <div class="fw-semibold text-danger" data-bind="text: description"></div>
  <!-- /ko -->
  <!-- /ko -->
`;
      SelectModule = class extends BaseFieldModule {
        constructor(params) {
          super(params);
        }
        static editTemplate = editTemplate7;
        static view = "select-view";
        static edit = "select-edit";
        static new = "select-edit";
      };
      registerFieldComponents(SelectModule);
    }
  });

  // src/sal/components/fields/TextAreaModule.js
  var editTemplate8, viewTemplate4, TextAreaModule;
  var init_TextAreaModule = __esm({
    "src/sal/components/fields/TextAreaModule.js"() {
      init_BaseFieldModule();
      editTemplate8 = html3`
  <div class="component field">
    <!-- ko if: isRichText -->
    <label class="fw-semibold"
      ><span data-bind="text: displayName"></span
      ><span data-bind="if: isRequired" class="fw-bold text-danger">*</span
      >:</label
    >
    <!-- ko if: instructions -->
    <div
      class="fw-lighter fst-italic text-secondary"
      data-bind="html: instructions"
    ></div>
    <!-- /ko -->
    <div
      class="richtext-field"
      data-bind="childrenComplete: childrenHaveLoaded"
    >
      <!-- Create the editor container -->
      <div
        class="form-control"
        data-bind="attr: {'id': getUniqueId()}, class: ValidationClass"
        style="height: 150px"
      >
        <div data-bind="html: Value"></div>
      </div>
    </div>
    <!-- /ko -->
    <!-- ko ifnot: isRichText -->
    <label class="fw-semibold"
      ><span data-bind="text: displayName"></span
      ><span data-bind="if: isRequired" class="fw-bold text-danger">*</span>:
      <!-- ko if: instructions -->
      <div
        class="fw-lighter fst-italic text-secondary"
        data-bind="html: instructions"
      ></div>
      <!-- /ko -->
      <textarea
        name=""
        id=""
        cols="30"
        rows="10"
        class="form-control"
        data-bind="textInput: Value, class: ValidationClass, attr: attr"
      ></textarea>
    </label>
    <!-- /ko -->
    <!-- ko if: ShowErrors -->
    <!-- ko foreach: Errors -->
    <div class="fw-semibold text-danger" data-bind="text: description"></div>
    <!-- /ko -->
    <!-- /ko -->
  </div>
`;
      viewTemplate4 = html3`
  <div class="fw-semibold" data-bind="text: displayName"></div>
  <!-- ko if: Value -->
  <!-- ko if: isRichText -->
  <div data-bind="html: Value"></div>
  <!-- /ko -->
  <!-- ko ifnot: isRichText -->
  <div data-bind="text: Value"></div>
  <!-- /ko -->
  <!-- /ko -->
  <!-- ko ifnot: Value -->
  <div class="fst-italic">Not provided.</div>
  <!-- /ko -->
`;
      TextAreaModule = class extends BaseFieldModule {
        constructor(params) {
          super(params);
        }
        childrenHaveLoaded = (nodes) => {
          this.initializeEditor();
        };
        getToolbarId = () => "toolbar-" + this.getUniqueId();
        initializeEditor() {
          const toolbarOptions = [
            ["bold", "italic", "underline", "strike"],
            // toggled buttons
            ["link"],
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }],
            // custom button values
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            // superscript/subscript
            [{ indent: "-1" }, { indent: "+1" }],
            // outdent/indent
            [{ direction: "rtl" }],
            // text direction
            [{ size: ["small", false, "large", "huge"] }],
            // custom dropdown
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            // dropdown with defaults from theme
            [{ font: [] }],
            [{ align: [] }],
            ["clean"]
            // remove formatting button
          ];
          var editor = new Quill("#" + this.getUniqueId(), {
            modules: { toolbar: toolbarOptions },
            theme: "snow"
          });
          const Value = this.Value;
          Value.subscribe((val) => {
            if (val == "") {
              editor.setText("");
            }
          });
          editor.on("text-change", function(delta, oldDelta, source) {
            Value(editor.root.textContent ? editor.root.innerHTML : "");
          });
        }
        static viewTemplate = viewTemplate4;
        static editTemplate = editTemplate8;
        static view = "text-area-view";
        static edit = "text-area-edit";
        static new = "text-area-edit";
      };
      registerFieldComponents(TextAreaModule);
    }
  });

  // src/sal/components/fields/TextModule.js
  var editTemplate9, TextModule;
  var init_TextModule = __esm({
    "src/sal/components/fields/TextModule.js"() {
      init_BaseFieldModule();
      editTemplate9 = html3`
  <label class="fw-semibold"
    ><span data-bind="text: displayName"></span
    ><span data-bind="if: isRequired" class="fw-bold text-danger">*</span>:
    <input
      class="form-control"
      data-bind="textInput: Value, class: ValidationClass, attr: attr"
    />
    <!-- ko if: instructions -->
    <div
      class="fw-lighter fst-italic text-secondary"
      data-bind="html: instructions"
    ></div>
    <!-- /ko -->
  </label>
  <!-- ko if: ShowErrors -->
  <!-- ko foreach: Errors -->
  <div class="fw-semibold text-danger" data-bind="text: description"></div>
  <!-- /ko -->
  <!-- /ko -->
`;
      TextModule = class extends BaseFieldModule {
        constructor(params) {
          super(params);
        }
        static editTemplate = editTemplate9;
        static view = "text-view";
        static edit = "text-edit";
        static new = "text-edit";
      };
      registerFieldComponents(TextModule);
    }
  });

  // src/sal/components/fields/index.js
  var init_fields = __esm({
    "src/sal/components/fields/index.js"() {
      init_BaseFieldModule();
      init_BlobModule();
      init_CheckboxModule();
      init_DateModule();
      init_LookupModule();
      init_PeopleModule();
      init_SearchSelectModule();
      init_SelectModule();
      init_TextAreaModule();
      init_TextModule();
    }
  });

  // src/sal/fields/BlobField.js
  var BlobField;
  var init_BlobField = __esm({
    "src/sal/fields/BlobField.js"() {
      init_fields2();
      init_fields();
      BlobField = class _BlobField extends BaseField {
        constructor(params) {
          super(params);
          this.entityType = params.entityType;
          this.multiple = params.multiple;
          if (this.multiple) {
            this.Value = ko.observableArray();
          }
          if (ko.isObservable(this.entityType)) {
            this.entityType.subscribe(this.updateEntityTypeHandler);
          }
          this.updateEntityTypeHandler(ko.unwrap(this.entityType));
        }
        toString = ko.pureComputed(() => `${this.Value()?.length ?? "0"} items`);
        toJSON = ko.pureComputed(() => {
          if (!this.multiple)
            return this.Value()?.toJSON();
          return this.Value().map((value) => value.toJSON());
        });
        fromJSON = (input) => {
          if (!input)
            return;
          if (!this.multiple) {
            this.Value()?.fromJSON(input);
            return;
          }
          this.Value.removeAll();
          input.map((obj) => {
            const newEntity = new this.entityConstructor();
            newEntity.fromJSON(obj);
            this.Value.push(newEntity);
          });
        };
        // TypedValues = ko.observableArray();
        // TypedValue = ko.observable();
        // Value = ko.pureComputed(() =>
        //   this.multiple ? this.TypedValues() : this.TypedValue()
        // );
        get = () => {
          return JSON.stringify(this.toJSON());
        };
        blob;
        set = (val) => {
          if (window.DEBUG)
            console.log(val);
          this.blob = val;
          if (val?.constructor == _BlobField) {
            return;
          }
          this.fromJSON(JSON.parse(val));
        };
        get entityConstructor() {
          return ko.utils.unwrapObservable(this.entityType);
        }
        // use purecomputed for memoization, fields shouldn't change
        Cols = ko.pureComputed(() => {
          const entityType = ko.unwrap(this.entityType);
          if (!entityType)
            return [];
          const newEntity = new this.entityConstructor();
          return newEntity.FormFields();
        });
        // ColKeys = ko.pureComputed(() =>
        //   new this.entityConstructor()?.FormFieldKeys()
        // );
        // Support multiple items
        NewItem = ko.observable();
        submit = () => {
          const errors = this.NewItem()?.validate();
          if (errors.length)
            return;
          this.Value.push(this.NewItem());
          this.NewItem(new this.entityConstructor());
        };
        add = (item) => this.Value.push(item);
        remove = (item) => this.Value.remove(item);
        updateEntityTypeHandler = (newType) => {
          if (!newType)
            return;
          if (!this.multiple) {
            this.Value(new this.entityConstructor());
          } else {
            this.NewItem(new this.entityConstructor());
          }
          if (this.blob)
            this.fromJSON(JSON.parse(this.blob));
        };
        applyValueToTypedValues = () => {
        };
        // Errors = ko.pureComputed(() => {
        //   if (!this.Visible()) return [];
        //   // const isRequired = ko.unwrap(this.isRequired);
        //   const isRequired =
        //     typeof this.isRequired == "function"
        //       ? this.isRequired()
        //       : this.isRequired;
        //   if (!isRequired) return [];
        //   const currentValue = this.multiple ? this.TypedValues() : this.TypedValue();
        //   return currentValue
        //     ? []
        //     : [
        //         new ValidationError(
        //           "text-field",
        //           "required-field",
        //           (typeof this.displayName == "function"
        //             ? this.displayName()
        //             : this.displayName) + ` is required!`
        //         ),
        //       ];
        // });
        components = BlobModule;
      };
    }
  });

  // src/sal/fields/CheckboxField.js
  var CheckboxField;
  var init_CheckboxField = __esm({
    "src/sal/fields/CheckboxField.js"() {
      init_fields2();
      init_fields();
      CheckboxField = class extends BaseField {
        constructor(params) {
          super(params);
        }
        components = CheckboxModule;
      };
    }
  });

  // src/sal/fields/DateField.js
  var dateFieldTypes, DateField;
  var init_DateField = __esm({
    "src/sal/fields/DateField.js"() {
      init_fields();
      init_fields2();
      dateFieldTypes = {
        date: "date",
        datetime: "datetime-local"
      };
      DateField = class extends BaseField {
        constructor(params) {
          super(params);
          this.type = params.type ?? dateFieldTypes.date;
        }
        toString = ko.pureComputed(() => {
          switch (this.type) {
            case dateFieldTypes.date:
              return this.toLocaleDateString();
            case dateFieldTypes.datetime:
              return this.toLocaleString();
            default:
              return "";
          }
        });
        toSortableDateString = () => this.Value()?.format("yyyy-MM-dd");
        toLocaleDateString = () => this.Value()?.toLocaleDateString();
        toLocaleString = () => this.Value()?.toLocaleString();
        toInputDateString = () => {
          const d = this.Value();
          return [
            d.getUTCFullYear().toString().padStart(4, "0"),
            (d.getUTCMonth() + 1).toString().padStart(2, "0"),
            d.getUTCDate().toString().padStart(2, "0")
          ].join("-");
        };
        toInputDateTimeString = () => this.Value().format("yyyy-MM-ddThh:mm");
        get = ko.pureComputed(() => {
          if (!this.Value() || isNaN(this.Value().valueOf())) {
            return null;
          }
          return this.Value().toISOString();
        });
        set = (newDate) => {
          if (!newDate)
            return null;
          if (newDate.constructor.getName() != "Date") {
            newDate = new Date(newDate);
          }
          if (newDate.getTimezoneOffset()) {
          }
          this.Value(newDate);
        };
        inputBinding = ko.pureComputed({
          read: () => {
            if (!this.Value())
              return null;
            switch (this.type) {
              case dateFieldTypes.date:
                return this.toInputDateString();
              case dateFieldTypes.datetime:
                return this.toInputDateTimeString();
              default:
                return null;
            }
          },
          write: (val) => {
            if (!val)
              return;
            this.Value(new Date(val));
          }
        });
        components = DateModule;
      };
    }
  });

  // src/sal/fields/LookupField.js
  function getEntityPropertyAsString(entity, column) {
    if (entity.FieldMap && entity.FieldMap[column]) {
      const field = entity.FieldMap[column];
      if (typeof field == "function") {
        return field();
      }
      if (field.toString && typeof field.toString == "function") {
        return field.toString();
      }
      if (field.get && typeof field.get == "function") {
        return field.get();
      }
      if (field.obs) {
        return field.obs();
      }
      return field;
    }
    return entity[column] ?? "";
  }
  var LookupField;
  var init_LookupField = __esm({
    "src/sal/fields/LookupField.js"() {
      init_fields();
      init_fields2();
      LookupField = class extends BaseField {
        constructor({
          displayName,
          type: entityType,
          isRequired = false,
          Visible,
          entitySet,
          options = ko.observableArray(),
          optionsFilter = null,
          optionsText = null,
          multiple = false,
          lookupCol = null,
          instructions
        }) {
          super({ Visible, displayName, isRequired, instructions });
          if (!options) {
            this.isSearch = true;
          } else {
            this.isSearch = false;
            this.allOpts = options;
          }
          this.isSearch = !options;
          this.multiple = multiple;
          this.Value = multiple ? ko.observableArray() : ko.observable();
          this.entityType = entityType;
          this.entitySet = entitySet;
          this.lookupCol = lookupCol ?? "Title";
          this.optionsText = optionsText ?? ((item) => item[this.lookupCol]);
          if (optionsFilter)
            this.optionsFilter = optionsFilter;
          this.components = multiple ? SearchSelectModule : LookupModule;
        }
        isSearch = false;
        allOpts;
        optionsFilter = (val) => val;
        Options = ko.pureComputed(() => {
          const optsFilter = ko.unwrap(this.optionsFilter);
          const allOpts = ko.unwrap(this.allOpts);
          return allOpts.filter(optsFilter);
        });
        IsLoading = ko.observable(false);
        HasLoaded = ko.observable(false);
        // TODO: Started this, should really go in the entity base class if we're doing active record
        // create = async () => {
        //   const newItems = this.multiple ? this.Value() : [this.Value()]
        //   newItems.map(item => this.entitySet.AddEntity(newItems))
        // }
        refresh = async () => {
          if (!!!this.Value()) {
            return;
          }
          this.IsLoading(true);
          if (!this.multiple) {
            await this.entitySet.LoadEntity(this.Value());
            this.IsLoading(false);
            this.HasLoaded(true);
            return;
          }
          await Promise.all(
            this.Value().map(
              async (entity) => await this.entitySet.LoadEntity(entity)
            )
          );
          this.IsLoading(false);
          this.HasLoaded(true);
        };
        ensure = async () => {
          if (this.HasLoaded())
            return;
          if (this.IsLoading()) {
            return new Promise((resolve, reject2) => {
              const isLoadingSubscription = this.IsLoading.subscribe((isLoading) => {
                if (!isLoading) {
                  isLoadingSubscription.dispose();
                  resolve();
                }
              });
            });
          }
          await this.refresh();
        };
        toString = ko.pureComputed(() => {
          if (!!!this.Value()) {
            return "";
          }
          if (this.multiple) {
            return this.Value().map((val) => getEntityPropertyAsString(val, this.lookupCol)).join(", ");
          }
          return getEntityPropertyAsString(this.Value(), this.lookupCol);
        });
        get = () => {
          if (!this.Value())
            return;
          if (this.multiple) {
            return this.Value().map((entity2) => {
              return {
                ID: entity2.ID,
                LookupValue: entity2.LookupValue,
                Title: entity2.Title
              };
            });
          }
          const entity = this.Value();
          return {
            ID: entity.ID,
            LookupValue: entity.LookupValue,
            Title: entity.Title
          };
        };
        set = (val) => {
          if (!val) {
            this.Value(val);
            return;
          }
          if (this.multiple) {
            const valArr = Array.isArray(val) ? val : val.results ?? val.split("#;");
            this.Value(valArr.map((value) => this.findOrCreateNewEntity(value)));
            return;
          }
          this.Value(this.findOrCreateNewEntity(val));
          if (val && !this.toString()) {
          }
        };
        findOrCreateNewEntity = (val) => {
          if (this.entityType.FindInStore) {
            const foundEntity = this.entityType.FindInStore(val);
            if (foundEntity)
              return foundEntity;
            console.warn(
              `Could not find entity in store: ${this.entityType.name}`,
              val
            );
          }
          const optionEntity = this.allOpts().find((entity) => entity.ID == val.ID);
          if (optionEntity)
            return optionEntity;
          if (this.entityType.Create) {
            return this.entityType.Create(val);
          }
          const newEntity = new this.entityType();
          newEntity.ID = val.ID;
          this.entitySet.LoadEntity(newEntity);
          return newEntity;
        };
      };
    }
  });

  // src/sal/infrastructure/sal.js
  function executeQuery(currCtx) {
    return new Promise(
      (resolve, reject2) => currCtx.executeQueryAsync(resolve, (sender, args) => {
        reject2({ sender, args });
      })
    );
  }
  function principalToPeople(oPrincipal, isGroup = null) {
    return {
      ID: oPrincipal.get_id(),
      Title: oPrincipal.get_title(),
      LoginName: oPrincipal.get_loginName(),
      IsEnsured: true,
      IsGroup: isGroup != null ? isGroup : oPrincipal.constructor.getName() == "SP.Group",
      oPrincipal
    };
  }
  function getDefaultGroups() {
    const defaultGroups = sal.globalConfig.defaultGroups;
    const result = {};
    Object.keys(defaultGroups).forEach((key) => {
      result[key] = principalToPeople(defaultGroups[key], true);
    });
    return result;
  }
  async function getGroupUsers(groupName) {
    if (siteGroups[groupName]?.Users?.constructor == Array) {
      return siteGroups[groupName].Users;
    }
    const url = `/web/sitegroups/GetByName('${groupName}')?$expand=Users`;
    const groupResult = await fetchSharePointData(url);
    const group = groupResult.d;
    group.Users = group.Users?.results;
    siteGroups[groupName] = group;
    return group.Users;
  }
  async function InitSal() {
    if (sal.utilities)
      return;
    console.log("Init Sal");
    var currCtx = SP.ClientContext.get_current();
    var web = currCtx.get_web();
    sal.globalConfig.defaultGroups = {
      owners: web.get_associatedOwnerGroup(),
      members: web.get_associatedMemberGroup(),
      visitors: web.get_associatedVisitorGroup()
    };
    currCtx.load(sal.globalConfig.defaultGroups.owners);
    currCtx.load(sal.globalConfig.defaultGroups.members);
    currCtx.load(sal.globalConfig.defaultGroups.visitors);
    var user = web.get_currentUser();
    currCtx.load(user);
    var siteGroupCollection = web.get_siteGroups();
    currCtx.load(siteGroupCollection);
    sal.globalConfig.roles = [];
    var oRoleDefinitions2 = currCtx.get_web().get_roleDefinitions();
    currCtx.load(oRoleDefinitions2);
    return new Promise((resolve, reject2) => {
      currCtx.executeQueryAsync(
        function() {
          sal.globalConfig.currentUser = user;
          var listItemEnumerator = siteGroupCollection.getEnumerator();
          while (listItemEnumerator.moveNext()) {
            var oListItem = listItemEnumerator.get_current();
            sal.globalConfig.siteGroups.push(principalToPeople(oListItem));
          }
          var oEnumerator = oRoleDefinitions2.getEnumerator();
          while (oEnumerator.moveNext()) {
            var oRoleDefinition2 = oEnumerator.get_current();
            sal.globalConfig.roles.push(oRoleDefinition2.get_name());
          }
          sal.config = new sal.NewAppConfig();
          sal.utilities = new sal.NewUtilities();
          resolve();
        },
        function(sender, args) {
          alert("Error initializing SAL");
          reject2();
        }
      );
    });
  }
  async function getUserPropsAsync(userId = _spPageContextInfo.userId) {
    const userPropsUrl = `/sp.userprofiles.peoplemanager/getmyproperties`;
    const userInfoUrl = `/Web/GetUserById(${userId})/?$expand=Groups`;
    const userInfo = (await fetchSharePointData(userInfoUrl)).d;
    const userProps = (await fetchSharePointData(userPropsUrl))?.d.UserProfileProperties.results;
    function findPropValue(props, key) {
      return props.find((prop) => prop.Key == key)?.Value;
    }
    return {
      ID: userId,
      Title: userInfo.Title,
      LoginName: userInfo.LoginName,
      WorkPhone: findPropValue(userProps, "WorkPhone"),
      EMail: findPropValue(userProps, "WorkEmail"),
      // TODO: Do we still need this spelling?
      IsEnsured: true,
      IsGroup: false,
      Groups: userInfo.Groups?.results?.map((group) => {
        return {
          ...group,
          ID: group.Id,
          IsGroup: true,
          IsEnsured: true
        };
      })
    };
  }
  async function copyFileAsync(sourceFilePath, destFilePath) {
    const uri = `/web/getfilebyserverrelativeurl('${sourceFilePath}')/copyto('${destFilePath}')`;
    const result = await fetchSharePointData(uri, "POST");
    return result;
  }
  async function ensureUserByKeyAsync(userName) {
    return new Promise((resolve, reject2) => {
      var group = sal.globalConfig.siteGroups.find(function(group2) {
        return group2.LoginName == userName;
      });
      if (group) {
        resolve(group);
        return;
      }
      var context = new SP.ClientContext.get_current();
      var oUser = context.get_web().ensureUser(userName);
      function onEnsureUserSucceeded(sender, args) {
        const user = principalToPeople(oUser);
        resolve(user);
      }
      function onEnsureUserFailed(sender, args) {
        console.error(
          "Failed to ensure user :" + args.get_message() + "\n" + args.get_stackTrace()
        );
        reject2(args);
      }
      const data2 = { oUser, resolve, reject: reject2 };
      context.load(oUser);
      context.executeQueryAsync(
        Function.createDelegate(data2, onEnsureUserSucceeded),
        Function.createDelegate(data2, onEnsureUserFailed)
      );
    });
  }
  function getSPSiteGroupByName(groupName) {
    var userGroup = null;
    if (this.globalConfig.siteGroups != null) {
      userGroup = this.globalConfig.siteGroups.find(function(group) {
        return group.Title == groupName;
      });
    }
    return userGroup;
  }
  function SPList(listDef) {
    var self = this;
    self.config = {
      def: listDef
    };
    async function init() {
      if (!self.config.fieldSchema) {
        const listEndpoint = `/web/lists/GetByTitle('${self.config.def.title}')?$expand=Fields`;
        const list = await fetchSharePointData(listEndpoint);
        self.config.guid = list.d.Id;
        self.config.fieldSchema = list.d.Fields.results;
      }
    }
    init();
    async function setListPermissionsAsync(itemPermissions, reset) {
      const currCtx = new SP.ClientContext.get_current();
      const web = currCtx.get_web();
      const oList = web.get_lists().getByTitle(self.config.def.title);
      return setResourcePermissionsAsync(oList, itemPermissions, reset);
    }
    function setListPermissions(valuePairs, callback, reset) {
      reset = reset === void 0 ? false : reset;
      var users = new Array();
      var resolvedGroups = new Array();
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      var oList = web.get_lists().getByTitle(self.config.def.title);
      valuePairs.forEach(function(vp) {
        var resolvedGroup = getSPSiteGroupByName(vp[0]);
        if (resolvedGroup) {
          resolvedGroups.push([resolvedGroup, vp[1]]);
        } else {
          users.push([currCtx.get_web().ensureUser(vp[0]), vp[1]]);
        }
      });
      function onFindItemSucceeded() {
        console.log("Successfully found item");
        var currCtx2 = new SP.ClientContext.get_current();
        var web2 = currCtx2.get_web();
        if (reset) {
          oList.resetRoleInheritance();
          oList.breakRoleInheritance(false, false);
          oList.get_roleAssignments().getByPrincipal(sal.globalConfig.currentUser).deleteObject();
        } else {
          oList.breakRoleInheritance(false, false);
        }
        this.resolvedGroups.forEach(function(groupPairs) {
          var roleDefBindingColl = SP.RoleDefinitionBindingCollection.newObject(currCtx2);
          roleDefBindingColl.add(
            web2.get_roleDefinitions().getByName(groupPairs[1])
          );
          oList.get_roleAssignments().add(groupPairs[0], roleDefBindingColl);
        });
        this.users.forEach(function(userPairs) {
          var roleDefBindingColl = SP.RoleDefinitionBindingCollection.newObject(currCtx2);
          roleDefBindingColl.add(
            web2.get_roleDefinitions().getByName(userPairs[1])
          );
          oList.get_roleAssignments().add(userPairs[0], roleDefBindingColl);
        });
        var data3 = { oList, callback };
        function onSetListPermissionsSuccess() {
          console.log("Successfully set permissions");
          callback(oList);
        }
        function onSetListPermissionsFailure(sender, args) {
          console.error(
            "Failed to update permissions on List: " + this.oList.get_title() + args.get_message() + "\n",
            args.get_stackTrace()
          );
        }
        currCtx2.load(oList);
        currCtx2.executeQueryAsync(
          Function.createDelegate(data3, onSetListPermissionsSuccess),
          Function.createDelegate(data3, onSetListPermissionsFailure)
        );
      }
      function onFindItemFailed(sender, args) {
        console.error(
          "Failed to find List: " + this.oList.get_title + args.get_message(),
          args.get_stackTrace()
        );
      }
      var data2 = {
        oList,
        users,
        resolvedGroups,
        callback
      };
      currCtx.load(oList);
      users.map(function(user) {
        currCtx.load(user[0]);
      });
      currCtx.executeQueryAsync(
        Function.createDelegate(data2, onFindItemSucceeded),
        Function.createDelegate(data2, onFindItemFailed)
      );
    }
    function mapObjectToListItem(val) {
      if (!val) {
        return val;
      }
      if (!Array.isArray(val)) {
        return mapItemToListItem(val);
      }
      return val.map((item) => {
        return mapItemToListItem(item);
      }).join(";#");
    }
    function mapItemToListItem(item) {
      if (item.ID) {
        return `${item.ID};#${item.LookupValue ?? ""}`;
      }
      if (item.LookupValue) {
        return item.LookupValue;
      }
      if (item.constructor.getName() == "Date") {
        return item.toISOString();
      }
      return item;
    }
    function createListItemAsync(entity, folderPath = null) {
      return new Promise((resolve, reject2) => {
        const currCtx = new SP.ClientContext.get_current();
        const web = currCtx.get_web();
        const oList = web.get_lists().getByTitle(self.config.def.title);
        const itemCreateInfo = new SP.ListItemCreationInformation();
        if (folderPath) {
          var folderUrl = sal.globalConfig.siteUrl + "/Lists/" + self.config.def.name + "/" + folderPath;
          itemCreateInfo.set_folderUrl(folderUrl);
        }
        const oListItem = oList.addItem(itemCreateInfo);
        const restrictedFields = [
          "ID",
          "Author",
          "Created",
          "Editor",
          "Modified"
        ];
        Object.keys(entity).filter((key) => !restrictedFields.includes(key)).forEach((key) => {
          oListItem.set_item(key, mapObjectToListItem(entity[key]));
        });
        oListItem.update();
        function onCreateListItemSucceeded() {
          resolve(oListItem.get_id());
        }
        function onCreateListItemFailed(sender, args) {
          console.error("Create Item Failed - List: " + self.config.def.name);
          console.error("ValuePairs", entity);
          console.error(sender, args);
          reject2(sender);
        }
        const data2 = { entity, oListItem, resolve, reject: reject2 };
        currCtx.load(oListItem);
        currCtx.executeQueryAsync(
          Function.createDelegate(data2, onCreateListItemSucceeded),
          Function.createDelegate(data2, onCreateListItemFailed)
        );
      });
    }
    function mapListItemToObject(val) {
      if (!val) {
        return val;
      }
      let out = {};
      switch (val.constructor.getName()) {
        case "SP.FieldUserValue":
          out.LoginName = val.get_email();
        case "SP.FieldLookupValue":
          out.ID = val.get_lookupId();
          out.LookupValue = val.get_lookupValue();
          out.Title = val.get_lookupValue();
          break;
        default:
          out = val;
      }
      return out;
    }
    function getListItems(caml, fields, callback) {
      var camlQuery = new SP.CamlQuery.createAllItemsQuery();
      camlQuery.set_viewXml(caml);
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      var oList = web.get_lists().getByTitle(self.config.def.title);
      var collListItem = oList.getItems(camlQuery);
      function onGetListItemsSucceeded() {
        var self2 = this;
        var listItemEnumerator = self2.collListItem.getEnumerator();
        const foundObjects = [];
        while (listItemEnumerator.moveNext()) {
          var oListItem = listItemEnumerator.get_current();
          var listObj = {};
          fields.forEach((field) => {
            var colVal = oListItem.get_item(field);
            listObj[field] = Array.isArray(colVal) ? colVal.map((val) => mapListItemToObject(val)) : mapListItemToObject(colVal);
          });
          foundObjects.push(listObj);
        }
        callback(foundObjects);
      }
      function onGetListItemsFailed(sender, args) {
        console.log("unsuccessful read", sender);
        alert(
          "Request on list " + self.config.def.name + " failed, producing the following error: \n " + args.get_message() + "\nStackTrack: \n " + args.get_stackTrace()
        );
      }
      var data2 = {
        collListItem,
        callback,
        fields,
        camlQuery
      };
      currCtx.load(collListItem, `Include(${fields.join(", ")})`);
      currCtx.executeQueryAsync(
        Function.createDelegate(data2, onGetListItemsSucceeded),
        Function.createDelegate(data2, onGetListItemsFailed)
      );
    }
    function getListItemsAsync({ fields = null, caml = null }) {
      if (!caml) {
        var caml = '<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="FSObjType"/><Value Type="int">0</Value></Eq></Where></Query></View>';
      }
      return new Promise((resolve, reject2) => {
        getListItems(caml, fields, resolve);
      });
    }
    function findByIdAsync(id2, fields) {
      return new Promise((resolve, reject2) => {
        try {
          findById(id2, fields, resolve);
        } catch (e) {
          reject2(e);
        }
      });
    }
    async function getById(id2, fields) {
      const [queryFields, expandFields] = await getQueryFields(fields);
      const apiEndpoint = `/web/lists/GetByTitle('${self.config.def.title}')/items(${id2})?$Select=${queryFields}&$expand=${expandFields}`;
      const result = await fetchSharePointData(apiEndpoint);
      return result.d;
    }
    async function getListFields() {
      if (!self.config.fieldSchema) {
        const apiEndpoint = `/web/lists/GetByTitle('${self.config.def.title}')/Fields`;
        const fields = await fetchSharePointData(apiEndpoint);
        self.config.fieldSchema = fields.d.results;
      }
      return self.config.fieldSchema;
    }
    async function getQueryFields(fields) {
      const queryFields = [];
      const expandFields = [];
      const listFields = await getListFields();
      fields.map((f) => {
        if (f == "FileRef") {
          queryFields.push(f);
          return;
        }
        if (f.includes("/")) {
          queryFields.push(f);
          expandFields.push(f.split("/")[0]);
          return;
        }
        const fieldSchema = listFields.find((lf) => lf.StaticName == f);
        if (!fieldSchema) {
          alert(`Field '${f}' not found on list ${self.config.def.name}`);
          return;
        }
        const idString = f + "/ID";
        let titleString = f + "/Title";
        switch (fieldSchema.TypeAsString) {
          case "LookupMulti":
          case "Lookup":
            titleString = f + "/" + fieldSchema.LookupField;
          case "User":
            queryFields.push(idString);
            queryFields.push(titleString);
            expandFields.push(f);
            break;
          case "Choice":
          default:
            queryFields.push(f);
        }
      });
      return [queryFields, expandFields];
    }
    async function findByColumnValueAsync(columnFilters, { orderByColumn = null, sortAsc }, { count = null, includePermissions = false, includeFolders = false }, fields) {
      const [queryFields, expandFields] = await getQueryFields(fields);
      if (includePermissions) {
        queryFields.push("RoleAssignments");
        queryFields.push("HasUniqueRoleAssignments");
        expandFields.push("RoleAssignments");
      }
      const orderBy = orderByColumn ? `$orderby=${orderByColumn} ${sortAsc ? "asc" : "desc"}` : "";
      const colFilterArr = [];
      columnFilters.forEach(
        (colFilter) => colFilterArr.push(
          `${colFilter.column} ${colFilter.op ?? "eq"} '${colFilter.value}'`
        )
      );
      if (!includeFolders)
        colFilterArr.push(`FSObjType eq '0'`);
      const filter = "$filter=(" + colFilterArr.join(`) and (`) + ")";
      const include = "$select=" + queryFields;
      const expand = `$expand=` + expandFields;
      const page = count ? `$top=${count}` : "";
      const apiEndpoint = `/web/lists/GetByTitle('${self.config.def.title}')/items?${include}&${expand}&${orderBy}&${filter}&${page}`;
      const result = await fetchSharePointData(apiEndpoint);
      const cursor = {
        results: result?.d?.results,
        _next: result?.d?.__next
      };
      return cursor;
    }
    async function loadNextPage(cursor) {
      const result = await fetchSharePointData(cursor._next);
      return {
        results: result?.d?.results,
        _next: result?.d?.__next
      };
    }
    function findById(id2, fields, callback) {
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      var oList = web.get_lists().getByTitle(self.config.def.title);
      var oListItem = oList.getItemById(id2);
      function onGetListItemSucceeded() {
        const listObj = {};
        fields.forEach((field) => {
          var colVal = oListItem.get_item(field);
          listObj[field] = Array.isArray(colVal) ? colVal.map((val) => mapListItemToObject(val)) : mapListItemToObject(colVal);
        });
        callback(listObj);
      }
      function onGetListItemFailed(sender, args) {
        console.error("SAL: findById - List: " + self.config.def.name);
        console.error("Fields", this);
        console.error(sender, args);
      }
      var data2 = {
        oListItem,
        callback,
        fields
      };
      currCtx.load(oListItem);
      currCtx.executeQueryAsync(
        Function.createDelegate(data2, onGetListItemSucceeded),
        Function.createDelegate(data2, onGetListItemFailed)
      );
    }
    function updateListItemAsync(entity) {
      if (!entity?.ID) {
        return false;
      }
      return new Promise((resolve, reject2) => {
        const currCtx = new SP.ClientContext.get_current();
        const web = currCtx.get_web();
        const oList = web.get_lists().getByTitle(self.config.def.title);
        const oListItem = oList.getItemById(entity.ID);
        const restrictedFields = [
          "ID",
          "Author",
          "Created",
          "Editor",
          "Modified"
        ];
        Object.keys(entity).filter((key) => !restrictedFields.includes(key)).forEach((key) => {
          oListItem.set_item(key, mapObjectToListItem(entity[key]));
        });
        oListItem.update();
        function onUpdateListItemsSucceeded() {
          console.log("Successfully updated " + this.oListItem.get_item("Title"));
          resolve();
        }
        function onUpdateListItemFailed(sender, args) {
          console.error("Update Failed - List: " + self.config.def.name);
          console.error("Item Id", this.oListItem.get_id() ?? "N/A");
          console.error(entity);
          console.error(sender, args);
          reject2(args);
        }
        const data2 = { oListItem, entity, resolve, reject: reject2 };
        currCtx.load(oListItem);
        currCtx.executeQueryAsync(
          Function.createDelegate(data2, onUpdateListItemsSucceeded),
          Function.createDelegate(data2, onUpdateListItemFailed)
        );
      });
    }
    function deleteListItem(id2, callback) {
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      var oList = web.get_lists().getByTitle(self.config.def.title);
      var data2 = { callback };
      const oListItem = oList.getItemById(id2);
      oListItem.deleteObject();
      function onDeleteListItemsSucceeded(sender, args) {
        callback();
      }
      function onDeleteListItemsFailed(sender, args) {
        console.error(
          "sal.SPList.deleteListItem: Request on list " + self.config.def.name + " failed, producing the following error: \n " + args.get_message() + "\nStackTrack: \n " + args.get_stackTrace()
        );
      }
      currCtx.executeQueryAsync(
        Function.createDelegate(data2, onDeleteListItemsSucceeded),
        Function.createDelegate(data2, onDeleteListItemsFailed)
      );
    }
    async function deleteListItemAsync(id2) {
      const apiEndpoint = `/web/lists/GetByTitle('${self.config.def.title}')/items(${id2})`;
      return await fetchSharePointData(apiEndpoint, "DELETE", {
        "If-Match": "*"
      });
    }
    async function setItemPermissionsAsync(id2, itemPermissions, reset) {
      const currCtx = new SP.ClientContext.get_current();
      const web = currCtx.get_web();
      const oListItem = await getoListItemByIdAsync(id2);
      return setResourcePermissionsAsync(oListItem, itemPermissions, reset);
    }
    async function setResourcePermissionsAsync(oListItem, itemPermissions, reset) {
      if (reset) {
        oListItem.resetRoleInheritance();
        oListItem.breakRoleInheritance(false, false);
      }
      for (const role of itemPermissions.roles) {
        const ensuredPrincipalResult = await ensureUserByKeyAsync(
          role.principal.Title
        );
        if (!ensuredPrincipalResult)
          return;
        const currCtx2 = new SP.ClientContext.get_current();
        const web = currCtx2.get_web();
        const oPrincipal = ensuredPrincipalResult.oPrincipal;
        currCtx2.load(oPrincipal);
        role.roleDefs.map((roleDef) => {
          const roleDefBindingColl = SP.RoleDefinitionBindingCollection.newObject(currCtx2);
          roleDefBindingColl.add(
            web.get_roleDefinitions().getByName(roleDef.name)
          );
          oListItem.get_roleAssignments().add(oPrincipal, roleDefBindingColl);
        });
        const data2 = {};
        await executeQuery(currCtx2).catch(({ sender, args }) => {
          console.error(
            `Failed to set role permissions on item id ${id} for principal ${role.principal.Title} ` + args.get_message(),
            args
          );
        });
      }
      if (reset) {
        const currCtx = new SP.ClientContext.get_current();
        oListItem.get_roleAssignments().getByPrincipal(sal.globalConfig.currentUser).deleteObject();
        await executeQuery(currCtx).catch(({ sender, args }) => {
          console.error(
            `Failed to remove role permissions on item id ${id} for Current User ` + args.get_message(),
            args
          );
        });
      }
    }
    function getoListItemByIdAsync(id2) {
      return new Promise((resolve, reject2) => {
        const currCtx = new SP.ClientContext.get_current();
        const web = currCtx.get_web();
        const oList = web.get_lists().getByTitle(self.config.def.title);
        const oListItem = oList.getItemById(id2);
        currCtx.executeQueryAsync(
          () => {
            resolve(oListItem);
          },
          (sender, args) => {
            console.error(
              "Failed to find item: " + id2 + args.get_message(),
              args
            );
            reject2();
          }
        );
      });
    }
    function getItemPermissionsAsync(id2) {
      return new Promise((resolve, reject2) => {
        var currCtx = new SP.ClientContext.get_current();
        var web = currCtx.get_web();
        var oList = web.get_lists().getByTitle(self.config.def.title);
        var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml(
          '<View><Query><Where><Eq><FieldRef Name="ID"/><Value Type="Text">' + id2 + "</Value></Eq></Where></Query></View>"
        );
        var oListItems = oList.getItems(camlQuery);
        currCtx.load(
          oListItems,
          "Include(ID, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
        );
        function onQuerySuccess() {
          var listItemEnumerator = oListItems.getEnumerator();
          while (listItemEnumerator.moveNext()) {
            var oListItem = listItemEnumerator.get_current();
            var itemPermissions = new ItemPermissions({
              hasUniqueRoleAssignments: oListItem.get_hasUniqueRoleAssignments(),
              roles: []
            });
            var roleEnumerator = oListItem.get_roleAssignments().getEnumerator();
            while (roleEnumerator.moveNext()) {
              var roleColl = roleEnumerator.get_current();
              const role = Role.fromJsomRole(roleColl);
              itemPermissions.roles.push(role);
            }
            resolve(itemPermissions);
            break;
          }
        }
        function onQueryFailed(sender, args) {
          reject2(args.get_message());
        }
        const data2 = {
          oListItems,
          resolve,
          reject: reject2
        };
        currCtx.executeQueryAsync(
          Function.createDelegate(data2, onQuerySuccess),
          Function.createDelegate(data2, onQueryFailed)
        );
      });
    }
    async function getListPermissions() {
      const url = `/web/lists/getByTitle('${self.config.def.name}')?$select=HasUniqueRoleAssignments,RoleAssignments&$expand=RoleAssignments/Member,RoleAssignments/RoleDefinitionBindings`;
      const headers = {
        "Cache-Control": "no-cache"
      };
      const result = await fetchSharePointData(url, "GET", headers);
      if (!result)
        return;
      return ItemPermissions.fromRestResult(result.d);
    }
    function getServerRelativeFolderPath(relFolderPath) {
      let builtPath = sal.globalConfig.siteUrl;
      builtPath += self.config.def.isLib ? "/" + self.config.def.name : "/Lists/" + self.config.def.name;
      if (relFolderPath) {
        builtPath += "/" + relFolderPath;
      }
      return builtPath;
    }
    function upsertFolderPathAsync(folderPath) {
      if (self.config.def.isLib) {
        return new Promise(
          (resolve, reject2) => upsertLibFolderByPath(folderPath, resolve)
        );
      }
      return new Promise(
        (resolve, reject2) => upsertListFolderByPath(folderPath, resolve)
      );
    }
    async function setFolderReadonlyAsync(folderPath) {
      try {
        const currentPerms = await getFolderPermissionsAsync(folderPath);
        const targetPerms = currentPerms.map((user) => {
          return [user.LoginName, sal.config.siteRoles.roles.RestrictedRead];
        });
        await setFolderPermissionsAsync(folderPath, targetPerms, true);
      } catch (e) {
        console.warn(e);
      }
      return;
    }
    async function ensureFolderPermissionsAsync(relFolderPath, targetPerms) {
      const serverRelFolderPath = getServerRelativeFolderPath(relFolderPath);
      const apiEndpoint = sal.globalConfig.siteUrl + `/_api/web/GetFolderByServerRelativeUrl('${serverRelFolderPath}')/ListItemAllFields/RoleAssignments?$expand=Member,Member/Users,RoleDefinitionBindings`;
      const response = await fetch(apiEndpoint, {
        method: "GET",
        headers: {
          Accept: "application/json; odata=verbose"
        }
      });
      if (!response.ok) {
        if (response.status == 404) {
          return;
        }
        console.error(response);
      }
      const result = await response.json();
      const permissionResults = result?.d?.results;
      if (!permissionResults) {
        console.warn("No results found", result);
        return;
      }
      const missingPerms = targetPerms.filter((targetPermPair) => {
        const targetLoginName = targetPermPair[0];
        const targetPerm = targetPermPair[1];
        const permExists = permissionResults.find((curPerm) => {
          if (curPerm.Member.LoginName != targetLoginName) {
            if (!curPerm.Member.Users?.results.find(
              (curUser) => curUser.LoginName == targetLoginName
            )) {
              return false;
            }
          }
          if (curPerm.RoleDefinitionBindings.results?.find(
            (curBinding) => sal.config.siteRoles.fulfillsRole(curBinding.Name, targetPerm)
          )) {
            return true;
          }
          return false;
        });
        return !permExists;
      });
      console.log("Adding missing permissions", missingPerms);
      if (missingPerms.length)
        await setFolderPermissionsAsync(relFolderPath, missingPerms, false);
      return;
    }
    function getFolderContentsAsync(relFolderPath, fields) {
      return new Promise((resolve, reject2) => {
        const currCtx = new SP.ClientContext.get_current();
        const web = currCtx.get_web();
        const oList = web.get_lists().getByTitle(self.config.def.title);
        const serverRelFolderPath = getServerRelativeFolderPath(relFolderPath);
        const camlQuery = SP.CamlQuery.createAllItemsQuery();
        camlQuery.set_folderServerRelativeUrl(serverRelFolderPath);
        const allItems = oList.getItems(camlQuery);
        currCtx.load(allItems, `Include(${fields.join(", ")})`);
        currCtx.executeQueryAsync(
          function() {
            const foundObjects = [];
            var listItemEnumerator = allItems.getEnumerator();
            while (listItemEnumerator.moveNext()) {
              var oListItem = listItemEnumerator.get_current();
              var listObj = {};
              fields.forEach((field) => {
                var colVal = oListItem.get_item(field);
                listObj[field] = Array.isArray(colVal) ? colVal.map((val) => mapListItemToObject(val)) : mapListItemToObject(colVal);
              });
              listObj.oListItem = oListItem;
              foundObjects.push(listObj);
            }
            resolve(foundObjects);
          },
          function(sender, args) {
            console.warn("Unable load list folder contents:");
            console.error(sender);
            console.error(args);
            reject2(args);
          }
        );
      });
    }
    async function getFolderPermissionsAsync(relFolderPath) {
      return new Promise(async (resolve, reject2) => {
        const oListItem = await getFolderItemByPath(relFolderPath);
        if (!oListItem) {
          reject2("Folder item does not exist");
          return;
        }
        const roles = oListItem.get_roleAssignments();
        const currCtx = new SP.ClientContext.get_current();
        currCtx.load(oListItem);
        currCtx.load(roles);
        currCtx.executeQueryAsync(
          function() {
            const currCtx2 = new SP.ClientContext.get_current();
            console.log(oListItem);
            const principals = [];
            const bindings = [];
            const roleEnumerator = roles.getEnumerator();
            while (roleEnumerator.moveNext()) {
              const role = roleEnumerator.get_current();
              const principal = role.get_member();
              const bindings2 = role.get_roleDefinitionBindings();
              currCtx2.load(bindings2);
              currCtx2.load(principal);
              principals.push({ principal, bindings: bindings2 });
            }
            currCtx2.executeQueryAsync(
              // success
              function(sender, args) {
                const logins = principals.map(function({ principal, bindings: bindings2 }) {
                  const principalRoles = [];
                  const bindingEnumerator = bindings2.getEnumerator();
                  while (bindingEnumerator.moveNext()) {
                    const binding = bindingEnumerator.get_current();
                    principalRoles.push(binding.get_name());
                  }
                  return {
                    ID: principal.get_id(),
                    Title: principal.get_title(),
                    LoginName: principal.get_loginName(),
                    Roles: principalRoles
                  };
                });
                resolve(logins);
              },
              // failure
              function(sender, args) {
                console.warn("Unable load folder principals permissions:");
                console.error(sender);
                console.error(args);
                reject2(args);
              }
            );
          },
          function(sender, args) {
            console.warn("Unable load folder permissions:");
            console.error(sender);
            console.error(args);
            reject2(args);
          }
        );
      });
    }
    async function getFolderItemByPath(relFolderPath) {
      return new Promise((resolve, reject2) => {
        const currCtx = new SP.ClientContext.get_current();
        const web = currCtx.get_web();
        const oList = web.get_lists().getByTitle(self.config.def.title);
        const camlQuery = SP.CamlQuery.createAllItemsQuery();
        const serverRelFolderPath = getServerRelativeFolderPath(relFolderPath);
        var camlq = '<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name="FSObjType"/><Value Type="int">1</Value></Eq><Eq><FieldRef Name="FileRef"/><Value Type="Text">' + serverRelFolderPath + "</Value></Eq></And></Where></Query><RowLimit>1</RowLimit></View>";
        camlQuery.set_viewXml(camlq);
        const allFolders = oList.getItems(camlQuery);
        async function onFindItemSucceeded() {
          const foundObjects = [];
          var listItemEnumerator = allFolders.getEnumerator();
          while (listItemEnumerator.moveNext()) {
            const oListItem2 = listItemEnumerator.get_current();
            foundObjects.push(oListItem2);
          }
          if (!foundObjects) {
            console.warn("folder not found");
            resolve(foundObjects);
          }
          if (foundObjects.length > 1) {
            console.warn("Multiple folders found!");
            resolve(foundObjects);
          }
          const oListItem = foundObjects[0];
          resolve(oListItem);
        }
        function onFindItemFailed(sender, args) {
          console.warn("Unable load list folder contents:");
          console.error(sender);
          console.error(args);
          reject2(args);
        }
        const data2 = {
          allFolders,
          resolve,
          reject: reject2
        };
        currCtx.load(allFolders);
        currCtx.executeQueryAsync(
          Function.createDelegate(data2, onFindItemSucceeded),
          Function.createDelegate(data2, onFindItemFailed)
        );
      });
    }
    function upsertListFolderByPath(folderPath, callback) {
      var folderArr = folderPath.split("/");
      var idx = 0;
      var upsertListFolderInner = function(parentPath, folderArr2, idx2, success) {
        var folderName = folderArr2[idx2];
        idx2++;
        var curPath = folderArr2.slice(0, idx2).join("/");
        ensureListFolder(
          curPath,
          function(iFolder) {
            if (idx2 >= folderArr2.length) {
              success(iFolder.get_id());
            } else {
              upsertListFolderInner(curPath, folderArr2, idx2, success);
            }
          },
          function() {
            self.createListFolder(
              folderName,
              function(folderId) {
                if (idx2 >= folderArr2.length) {
                  success(folderId);
                } else {
                  upsertListFolderInner(curPath, folderArr2, idx2, success);
                }
              },
              parentPath
            );
          }
        );
      };
      upsertListFolderInner("", folderArr, idx, callback);
    }
    self.createListFolder = function(folderName, callback, path) {
      path = path === void 0 ? "" : path;
      const currCtx = new SP.ClientContext.get_current();
      const web = currCtx.get_web();
      const oList = web.get_lists().getByTitle(self.config.def.title);
      let folderUrl = "";
      const itemCreateInfo = new SP.ListItemCreationInformation();
      itemCreateInfo.set_underlyingObjectType(SP.FileSystemObjectType.folder);
      itemCreateInfo.set_leafName(folderName);
      if (path) {
        folderUrl = sal.globalConfig.siteUrl + "/Lists/" + self.config.def.name + "/" + path;
        itemCreateInfo.set_folderUrl(folderUrl);
      }
      const newItem = oList.addItem(itemCreateInfo);
      newItem.set_item("Title", folderName);
      newItem.update();
      function onCreateFolderSucceeded(sender, args) {
        callback(this.newItem.get_id());
      }
      function onCreateFolderFailed(sender, args) {
        alert(
          "Request on list " + self.config.def.name + " failed, producing the following error: \n" + args.get_message() + "\nStackTrack: \n" + args.get_stackTrace()
        );
      }
      const data2 = {
        folderName,
        callback,
        newItem
      };
      currCtx.load(newItem);
      currCtx.executeQueryAsync(
        Function.createDelegate(data2, onCreateFolderSucceeded),
        Function.createDelegate(data2, onCreateFolderFailed)
      );
    };
    function ensureListFolder(path, onExists, onNonExists) {
      var folderUrl = sal.globalConfig.siteUrl + "/Lists/" + self.config.def.name + "/" + path;
      var ctx = SP.ClientContext.get_current();
      var folder = ctx.get_web().getFolderByServerRelativeUrl(folderUrl);
      folder.get_listItemAllFields();
      var data2 = {
        folder,
        path,
        onExists,
        onNonExists
      };
      ctx.load(folder, "Exists", "Name");
      function onQueryFolderSucceeded() {
        if (folder.get_exists()) {
          let onQueryFolderItemSuccess = function() {
            onExists(folderItem);
          }, onQueryFolderItemFailure = function(sender, args) {
            console.error("Failed to find folder at " + path, args);
          };
          console.log(
            "Folder " + folder.get_name() + " exists in " + self.config.def.name
          );
          var currCtx = new SP.ClientContext.get_current();
          var folderItem = folder.get_listItemAllFields();
          data2 = { folderItem, path, onExists };
          currCtx.load(folderItem);
          currCtx.executeQueryAsync(
            Function.createDelegate(data2, onQueryFolderItemSuccess),
            Function.createDelegate(data2, onQueryFolderItemFailure)
          );
        } else {
          console.warn("Folder exists but is hidden (security-trimmed) for us.");
        }
      }
      function onQueryFolderFailed(sender, args) {
        if (args.get_errorTypeName() === "System.IO.FileNotFoundException") {
          console.log(
            "SAL.SPList.ensureListFolder:           Folder " + path + " does not exist in " + self.config.def.name
          );
          onNonExists();
        } else {
          console.error("Error: " + args.get_message());
        }
      }
      ctx.executeQueryAsync(
        Function.createDelegate(data2, onQueryFolderSucceeded),
        Function.createDelegate(data2, onQueryFolderFailed)
      );
    }
    function upsertLibFolderByPath(folderUrl, success) {
      const currCtx = new SP.ClientContext.get_current();
      const web = currCtx.get_web();
      const oList = web.get_lists().getByTitle(self.config.def.title);
      var createFolderInternal = function(parentFolder, folderUrl2, success2) {
        var ctx = parentFolder.get_context();
        var folderNames = folderUrl2.split("/");
        var folderName = folderNames[0];
        var curFolder = parentFolder.get_folders().add(folderName);
        ctx.load(curFolder);
        ctx.executeQueryAsync(
          function() {
            if (folderNames.length > 1) {
              var subFolderUrl = folderNames.slice(1, folderNames.length).join("/");
              createFolderInternal(curFolder, subFolderUrl, success2);
            } else {
              success2(curFolder);
            }
          },
          function(sender, args) {
            console.error("error creating new folder");
            console.error(sender);
            console.error(error);
          }
        );
      };
      createFolderInternal(oList.get_rootFolder(), folderUrl, success);
    }
    function setFolderPermissionsAsync(folderPath, valuePairs, reset) {
      return new Promise((resolve, reject2) => {
        setFolderPermissions(folderPath, valuePairs, resolve, reset);
      });
    }
    function setFolderPermissions(relFolderPath, valuePairs, callback, reset) {
      reset = reset === void 0 ? false : reset;
      var users = [];
      var resolvedGroups = [];
      const serverRelFolderPath = getServerRelativeFolderPath(relFolderPath);
      const currCtx = new SP.ClientContext.get_current();
      const web = currCtx.get_web();
      const folder = web.getFolderByServerRelativeUrl(serverRelFolderPath);
      valuePairs.forEach(function(vp) {
        var resolvedGroup = getSPSiteGroupByName(vp[0]);
        if (resolvedGroup?.oGroup) {
          resolvedGroups.push([resolvedGroup.oGroup, vp[1]]);
        } else {
          users.push([currCtx.get_web().ensureUser(vp[0]), vp[1]]);
        }
      });
      function onFindFolderSuccess() {
        var currCtx2 = new SP.ClientContext.get_current();
        var web2 = currCtx2.get_web();
        var folderItem = this.folder.get_listItemAllFields();
        if (reset) {
          folderItem.resetRoleInheritance();
          folderItem.breakRoleInheritance(false, false);
          folderItem.get_roleAssignments().getByPrincipal(sal.globalConfig.currentUser).deleteObject();
        } else {
          folderItem.breakRoleInheritance(false, false);
        }
        this.resolvedGroups.forEach(function(groupPairs) {
          var roleDefBindingColl = SP.RoleDefinitionBindingCollection.newObject(currCtx2);
          roleDefBindingColl.add(
            web2.get_roleDefinitions().getByName(groupPairs[1])
          );
          folderItem.get_roleAssignments().add(groupPairs[0], roleDefBindingColl);
        });
        this.users.forEach(function(userPairs) {
          var roleDefBindingColl = SP.RoleDefinitionBindingCollection.newObject(currCtx2);
          roleDefBindingColl.add(
            web2.get_roleDefinitions().getByName(userPairs[1])
          );
          folderItem.get_roleAssignments().add(userPairs[0], roleDefBindingColl);
        });
        var data3 = { folderItem, callback };
        function onSetFolderPermissionsSuccess() {
          console.log("Successfully set permissions");
          this.callback(folderItem);
        }
        function onSetFolderPermissionsFailure(sender, args) {
          console.error(
            "Failed to update permissions on item: " + this.folderItem.get_lookupValue() + args.get_message() + "\n" + args.get_stackTrace(),
            false
          );
        }
        currCtx2.load(folderItem);
        currCtx2.executeQueryAsync(
          Function.createDelegate(data3, onSetFolderPermissionsSuccess),
          Function.createDelegate(data3, onSetFolderPermissionsFailure)
        );
      }
      function onFindFolderFailure(sender, args) {
        console.error(
          "Something went wrong setting perms on library folder",
          args
        );
      }
      var data2 = {
        folder,
        users,
        callback,
        resolvedGroups,
        valuePairs,
        reset
      };
      users.map(function(user) {
        currCtx.load(user[0]);
      });
      currCtx.load(folder);
      currCtx.executeQueryAsync(
        Function.createDelegate(data2, onFindFolderSuccess),
        Function.createDelegate(data2, onFindFolderFailure)
      );
    }
    function showModal2(formName, title, args, callback) {
      var id2 = "";
      if (args.id) {
        id2 = args.id;
      }
      const options = SP.UI.$create_DialogOptions();
      var listPath = self.config.def.isLib ? "/" + self.config.def.name + "/" : "/Lists/" + self.config.def.name + "/";
      var rootFolder = "";
      if (args.rootFolder) {
        rootFolder = sal.globalConfig.siteUrl + listPath + args.rootFolder;
      }
      var formsPath = self.config.def.isLib ? "/" + self.config.def.name + "/forms/" : "/Lists/" + self.config.def.name + "/";
      Object.assign(options, {
        title,
        dialogReturnValueCallback: callback,
        args: JSON.stringify(args),
        height: 800,
        url: sal.globalConfig.siteUrl + formsPath + formName + "?ID=" + id2 + "&Source=" + location.pathname + "&RootFolder=" + rootFolder
      });
      SP.UI.ModalDialog.showModalDialog(options);
    }
    function showCheckinModal(fileRef, callback) {
      var options = SP.UI.$create_DialogOptions();
      options.title = "Check in Document";
      options.height = "600";
      options.dialogReturnValueCallback = callback;
      options.url = sal.globalConfig.siteUrl + "/_layouts/checkin.aspx?List={" + self.config.guid + "}&FileName=" + fileRef;
      SP.UI.ModalDialog.showModalDialog(options);
    }
    function checkinWithComment(fileRef, comment) {
      const url = `/web/GetFileByServerRelativeUrl('${fileRef}')/CheckIn(comment='${comment}',checkintype=0)`;
      return fetchSharePointData(url, "POST");
    }
    function showVersionHistoryModal(itemId) {
      return new Promise((resolve) => {
        var options = SP.UI.$create_DialogOptions();
        options.title = "Version History";
        options.height = "600";
        options.dialogReturnValueCallback = resolve;
        options.url = getVersionHistoryUrl(itemId);
        SP.UI.ModalDialog.showModalDialog(options);
      });
    }
    function getVersionHistoryUrl(itemId) {
      return sal.globalConfig.siteUrl + "/_layouts/15/versions.aspx?List={" + self.config.guid + "}&ID=" + itemId;
    }
    function uploadNewDocumentAsync(folderPath, title, args) {
      return new Promise((resolve, reject2) => {
        const currCtx = new SP.ClientContext.get_current();
        const web = currCtx.get_web();
        const oList = web.get_lists().getByTitle(self.config.def.title);
        currCtx.load(oList);
        currCtx.executeQueryAsync(
          function() {
            var siteString = sal.globalConfig.siteUrl == "/" ? "" : sal.globalConfig.siteUrl;
            const options = SP.UI.$create_DialogOptions();
            Object.assign(options, {
              title,
              dialogReturnValueCallback: resolve,
              args: JSON.stringify(args),
              url: siteString + "/_layouts/Upload.aspx?List=" + oList.get_id().toString() + "&RootFolder=" + siteString + "/" + self.config.def.name + "/" + encodeURI(folderPath) + "&Source=" + location.pathname + "&args=" + encodeURI(JSON.stringify(args))
            });
            SP.UI.ModalDialog.showModalDialog(options);
          },
          function(sender, args2) {
            console.error("Error showing file modal: ");
            console.error(sender);
            console.error(args2);
          }
        );
      });
    }
    const UPLOADCHUNKSIZE = 10485760;
    const uploadchunkActionTypes = {
      start: "startupload",
      continue: "continueupload",
      finish: "finishupload"
    };
    async function uploadFileRestChunking(file, relFolderPath, fileName, progress) {
      const blob = file;
      const chunkSize = UPLOADCHUNKSIZE;
      const fileSize = file.size;
      const totalBlocks = parseInt((fileSize / chunkSize).toString(), 10) + (fileSize % chunkSize === 0 ? 1 : 0);
      const fileRef = relFolderPath + "/" + fileName;
      const jobGuid = getGUID();
      let currentPointer;
      progress({ currentBlock: 0, totalBlocks });
      currentPointer = await startUpload(
        jobGuid,
        file.slice(0, chunkSize),
        fileRef,
        relFolderPath
      );
      for (i = 2; i < totalBlocks; i++) {
        progress({ currentBlock: i, totalBlocks });
        currentPointer = await continueUpload(
          jobGuid,
          file.slice(currentPointer, currentPointer + chunkSize),
          currentPointer,
          fileRef
        );
      }
      progress({ currentBlock: totalBlocks - 1, totalBlocks });
      const result = await finishUpload(
        jobGuid,
        file.slice(currentPointer),
        currentPointer,
        fileRef
      );
      progress({ currentBlock: totalBlocks, totalBlocks });
      return result;
    }
    async function startUpload(uploadId, chunk, fileRef, relFolderPath) {
      const url = `/web/getFolderByServerRelativeUrl(@folder)/files/getByUrlOrAddStub(@file)/StartUpload(guid'${uploadId}')?&@folder='${relFolderPath}'&@file='${fileRef}'`;
      const headers = {
        "Content-Type": "application/octet-stream"
      };
      const opts = {
        body: chunk
      };
      const result = await fetchSharePointData(url, "POST", headers, opts);
      if (!result) {
        console.error("Error starting upload!");
        return;
      }
      return parseFloat(result.d.StartUpload);
    }
    async function continueUpload(uploadId, chunk, fileOffset, fileRef) {
      const url = `/web/getFileByServerRelativeUrl(@file)/ContinueUpload(uploadId=guid'${uploadId}',fileOffset=${fileOffset})?&@file='${fileRef}'`;
      const headers = {
        "Content-Type": "application/octet-stream"
      };
      const opts = {
        body: chunk
      };
      const result = await fetchSharePointData(url, "POST", headers, opts);
      if (!result) {
        console.error("Error starting upload!");
        return;
      }
      return parseFloat(result.d.ContinueUpload);
    }
    async function finishUpload(uploadId, chunk, fileOffset, fileRef) {
      const url = `/web/getFileByServerRelativeUrl(@file)/FinishUpload(uploadId=guid'${uploadId}',fileOffset=${fileOffset})?&@file='${fileRef}'`;
      const headers = {
        "Content-Type": "application/octet-stream"
      };
      const opts = {
        body: chunk
      };
      const result = await fetchSharePointData(url, "POST", headers, opts);
      if (!result) {
        console.error("Error starting upload!");
        return;
      }
      return result;
    }
    async function uploadFileRest(file, relFolderPath, fileName) {
      return await fetch(
        _spPageContextInfo.webServerRelativeUrl + `/_api/web/GetFolderByServerRelativeUrl('${relFolderPath}')/Files/add(url='${fileName}',overwrite=true)`,
        {
          method: "POST",
          credentials: "same-origin",
          body: file,
          headers: {
            Accept: "application/json; odata=verbose",
            "Content-Type": "application/json;odata=nometadata",
            "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value
          }
        }
      ).then((response) => {
        if (!response.ok) {
          console.error("Error Uploading File", response);
          return;
        }
        return response.json();
      });
    }
    async function uploadFileToFolderAndUpdateMetadata(file, fileName, relFolderPath, payload, progress = null) {
      if (!progress) {
        progress = () => {
        };
      }
      const serverRelFolderPath = getServerRelativeFolderPath(relFolderPath);
      let result = null;
      if (file.size > UPLOADCHUNKSIZE) {
        const job = () => uploadFileRestChunking(file, serverRelFolderPath, fileName, progress);
        result = await uploadQueue.addJob(job);
      } else {
        progress({ currentBlock: 0, totalBlocks: 1 });
        result = await uploadFileRest(file, serverRelFolderPath, fileName);
        progress({ currentBlock: 1, totalBlocks: 1 });
      }
      await updateUploadedFileMetadata(result.d, payload);
      await checkinWithComment(serverRelFolderPath + "/" + fileName, "");
      let itemUri = result.d.ListItemAllFields.__deferred.uri + "?$select=ID";
      const listItem = await fetchSharePointData(itemUri);
      return listItem.d.ID;
    }
    async function updateUploadedFileMetadata(fileResult, payload) {
      var result = await fetch(fileResult.ListItemAllFields.__deferred.uri, {
        method: "POST",
        credentials: "same-origin",
        body: JSON.stringify(payload),
        headers: {
          Accept: "application/json; odata=nometadata",
          "Content-Type": "application/json;odata=nometadata",
          "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
          "X-HTTP-Method": "MERGE",
          "If-Match": "*"
        }
      }).then((response) => {
        if (!response.ok) {
          console.error("Error Updating File", response);
          return;
        }
        return response;
      });
      return result;
    }
    function copyFiles(sourceFolderPath, destFolderPath, callback, onError) {
      const sourcePath = getServerRelativeFolderPath(sourceFolderPath);
      const destPath = getServerRelativeFolderPath(destFolderPath);
      var context = new SP.ClientContext.get_current();
      var web = context.get_web();
      var folderSrc = web.getFolderByServerRelativeUrl(sourcePath);
      context.load(folderSrc, "Files");
      context.executeQueryAsync(
        function() {
          var files = folderSrc.get_files();
          var e = files.getEnumerator();
          var dest = [];
          while (e.moveNext()) {
            var file = e.get_current();
            var destLibUrl = destPath + "/" + file.get_name();
            dest.push(destLibUrl);
            file.copyTo(destLibUrl, true);
          }
          console.log(dest);
          context.executeQueryAsync(
            function() {
              console.log("Files moved successfully!");
              callback();
            },
            function(sender, args) {
              console.log("error: ") + args.get_message();
              onError;
            }
          );
        },
        function(sender, args) {
          console.error("Unable to copy files: ", args.get_message());
          console.error(sender);
          console.error(args);
          reject(args);
        }
      );
    }
    function copyFilesAsync(sourceFolder, destFolder) {
      return new Promise((resolve, reject2) => {
        copyFiles(sourceFolder, destFolder, resolve, reject2);
      });
    }
    async function ensureList() {
      const listInfo = await fetchSharePointData(
        `/web/lists/GetByTitle('${self.config.def.title}')`
      );
    }
    const publicMembers = {
      findByIdAsync,
      getById,
      findByColumnValueAsync,
      loadNextPage,
      getListItemsAsync,
      createListItemAsync,
      updateListItemAsync,
      deleteListItemAsync,
      setItemPermissionsAsync,
      getItemPermissionsAsync,
      getListPermissions,
      setListPermissionsAsync,
      getFolderContentsAsync,
      upsertFolderPathAsync,
      getServerRelativeFolderPath,
      setFolderReadonlyAsync,
      setFolderPermissionsAsync,
      ensureFolderPermissionsAsync,
      uploadFileToFolderAndUpdateMetadata,
      uploadNewDocumentAsync,
      copyFilesAsync,
      showModal: showModal2,
      showCheckinModal,
      showVersionHistoryModal,
      getVersionHistoryUrl
    };
    return publicMembers;
  }
  async function fetchSharePointData(uri, method = "GET", headers = {}, opts = {}) {
    const siteEndpoint = uri.startsWith("http") ? uri : sal.globalConfig.siteUrl + "/_api" + uri;
    const response = await fetch(siteEndpoint, {
      method,
      headers: {
        Accept: "application/json; odata=verbose",
        "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
        ...headers
      },
      ...opts
    });
    if (!response.ok) {
      if (response.status == 404) {
        return;
      }
      console.error(response);
    }
    try {
      const result = await response.json();
      return result;
    } catch (e) {
      return;
    }
  }
  function getGUID() {
    if (crypto.randomUUID)
      return crypto.randomUUID();
    let d = Date.now();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === "x" ? r : r & 3 | 8).toString(16);
    });
  }
  var sal, serverRelativeUrl, siteGroups, webRoot, ItemPermissions, Role, RoleDef, JobProcessor, uploadQueue;
  var init_sal = __esm({
    "src/sal/infrastructure/sal.js"() {
      window.console = window.console || { log: function() {
      } };
      window.sal = window.sal ?? {};
      sal = window.sal;
      serverRelativeUrl = _spPageContextInfo.webServerRelativeUrl == "/" ? "" : _spPageContextInfo.webServerRelativeUrl;
      sal.globalConfig = sal.globalConfig || {
        siteGroups: [],
        siteUrl: serverRelativeUrl,
        listServices: serverRelativeUrl + "/_vti_bin/ListData.svc/",
        defaultGroups: {}
      };
      sal.site = sal.site || {};
      window.DEBUG = true;
      siteGroups = {};
      webRoot = _spPageContextInfo.webAbsoluteUrl == "/" ? "" : _spPageContextInfo.webAbsoluteUrl;
      sal.NewAppConfig = function() {
        var siteRoles = {};
        siteRoles.roles = {
          FullControl: "Full Control",
          Design: "Design",
          Edit: "Edit",
          Contribute: "Contribute",
          RestrictedContribute: "Restricted Contribute",
          InitialCreate: "Initial Create",
          Read: "Read",
          RestrictedRead: "Restricted Read",
          LimitedAccess: "Limited Access"
        };
        siteRoles.fulfillsRole = function(inputRole, targetRole) {
          const roles = Object.values(siteRoles.roles);
          if (!roles.includes(inputRole) || !roles.includes(targetRole))
            return false;
          return roles.indexOf(inputRole) <= roles.indexOf(targetRole);
        };
        siteRoles.validate = function() {
          Object.keys(siteRoles.roles).forEach(function(role) {
            var roleName = siteRoles.roles[role];
            if (!sal.globalConfig.roles.includes(roleName)) {
              console.error(roleName + " is not in the global roles list");
            } else {
              console.log(roleName);
            }
          });
        };
        var siteGroups2 = {
          groups: {
            Owners: "workorder Owners",
            Members: "workorder Members",
            Visitors: "workorder Visitors",
            RestrictedReaders: "Restricted Readers"
          }
        };
        var publicMembers = {
          siteRoles,
          siteGroups: siteGroups2
        };
        return publicMembers;
      };
      sal.NewUtilities = function() {
        function createSiteGroup(groupName, permissions, callback) {
          callback = callback === void 0 ? null : callback;
          var currCtx = new SP.ClientContext.get_current();
          var web = currCtx.get_web();
          var groupCreationInfo = new SP.GroupCreationInformation();
          groupCreationInfo.set_title(groupName);
          this.oGroup = oWebsite.get_siteGroups().add(groupCreationInfo);
          oGroup.set_owner(oWebsite.get_associatedOwnerGroup());
          oGroup.update();
          var collRoleDefinitionBinding = SP.RoleDefinitionBindingCollection.newObject(clientContext);
          this.oRoleDefinitions = [];
          permissions.forEach(function(perm) {
            var oRoleDefinition2 = oWebsite.get_roleDefinitions().getByName(perm);
            this.oRoleDefinitions.push(oRoleDefinition2);
            collRoleDefinitionBinding.add(oRoleDefinition2);
          });
          var collRollAssignment = oWebsite.get_roleAssignments();
          collRollAssignment.add(oGroup, collRoleDefinitionBinding);
          function onCreateGroupSucceeded() {
            var roleInfo = oGroup.get_title() + " created and assigned to " + oRoleDefinitions.forEach(function(rd) {
              rd + ", ";
            });
            if (callback) {
              callback(oGroup.get_id());
            }
            console.log(roleInfo);
          }
          function onCreateGroupFailed(sender, args) {
            alert(
              groupnName + " - Create group failed. " + args.get_message() + "\n" + args.get_stackTrace()
            );
          }
          clientContext.load(oGroup, "Title");
          var data2 = {
            groupName,
            oGroup,
            oRoleDefinition,
            callback
          };
          clientContext.executeQueryAsync(
            Function.createDelegate(data2, onCreateGroupSucceeded),
            Function.createDelegate(data2, onCreateGroupFailed)
          );
        }
        function getUserGroups(user, callback) {
          var currCtx = new SP.ClientContext.get_current();
          var web = currCtx.get_web();
          var everyone = web.ensureUser(user);
          var oGroups = everyone.get_groups();
          function onQueryGroupsSucceeded() {
            var groups = new Array();
            var groupsInfo = new String();
            var groupsEnumerator = oGroups.getEnumerator();
            while (groupsEnumerator.moveNext()) {
              var oGroup2 = groupsEnumerator.get_current();
              var group = principalToPeople(oGroup2);
              groupsInfo += "\nGroup ID: " + oGroup2.get_id() + ", Title : " + oGroup2.get_title();
              groups.push(group);
            }
            console.log(groupsInfo.toString());
            callback(groups);
          }
          function onQueryGroupsFailed(sender, args) {
            console.error(
              " Everyone - Query Everyone group failed. " + args.get_message() + "\n" + args.get_stackTrace()
            );
          }
          currCtx.load(everyone);
          currCtx.load(oGroups);
          data = { everyone, oGroups, callback };
          currCtx.executeQueryAsync(
            Function.createDelegate(data, onQueryGroupsSucceeded),
            Function.createDelegate(data, onQueryGroupsFailed)
          );
        }
        function getUsersWithGroup(oGroup2, callback) {
          var context = new SP.ClientContext.get_current();
          var oUsers = oGroup2.get_users();
          function onGetUserSuccess() {
            var userObjs = [];
            var userEnumerator = oUsers.getEnumerator();
            while (userEnumerator.moveNext()) {
              var oUser = userEnumerator.get_current();
              var userObj = principalToPeople(oUser);
              userObjs.push(userObj);
            }
            callback(userObjs);
          }
          function onGetUserFailed(sender, args) {
          }
          var data2 = { oUsers, callback };
          context.load(oUsers);
          context.executeQueryAsync(
            Function.createDelegate(data2, onGetUserSuccess),
            Function.createDelegate(data2, onGetUserFailed)
          );
        }
        function copyFiles(sourceLib, destLib, callback, onError) {
          var context = new SP.ClientContext.get_current();
          var web = context.get_web();
          var folderSrc = web.getFolderByServerRelativeUrl(sourceLib);
          context.load(folderSrc, "Files");
          context.executeQueryAsync(
            function() {
              console.log("Got the source folder right here!");
              var files = folderSrc.get_files();
              var e = files.getEnumerator();
              var dest = [];
              while (e.moveNext()) {
                var file = e.get_current();
                var destLibUrl = destLib + "/" + file.get_name();
                dest.push(destLibUrl);
                file.copyTo(destLibUrl, true);
              }
              console.log(dest);
              context.executeQueryAsync(
                function() {
                  console.log("Files moved successfully!");
                  callback();
                },
                function(sender, args) {
                  console.log("error: ") + args.get_message();
                  onError;
                }
              );
            },
            function(sender, args) {
              console.log("Sorry, something messed up: " + args.get_message());
            }
          );
        }
        function copyFilesAsync(sourceFolder, destFolder) {
          return new Promise((resolve, reject2) => {
            copyFiles(sourceFolder, destFolder, resolve, reject2);
          });
        }
        var publicMembers = {
          copyFiles,
          copyFilesAsync,
          createSiteGroup,
          getUserGroups,
          getUsersWithGroup
        };
        return publicMembers;
      };
      ItemPermissions = class _ItemPermissions {
        constructor({ hasUniqueRoleAssignments, roles }) {
          this.hasUniqueRoleAssignments = hasUniqueRoleAssignments;
          this.roles = roles;
        }
        hasUniqueRoleAssignments;
        roles = [];
        addPrincipalRole(principal, roleName) {
          const newRoleDef = new RoleDef({ name: roleName });
          const principalRole = this.getPrincipalRole(principal);
          if (principalRole) {
            principalRole.addRoleDef(newRoleDef);
            return;
          }
          const newRole = new Role({ principal });
          newRole.addRoleDef(newRoleDef);
          this.roles.push(newRole);
        }
        getPrincipalRole(principal) {
          return this.roles.find((role) => role.principal.ID == principal.ID);
        }
        principalHasPermissionKind(principal, permission) {
          const role = this.getPrincipalRole(principal);
          return role?.roleDefs.find(
            (roleDef) => roleDef.basePermissions?.has(permission)
          ) ? true : false;
        }
        getValuePairs() {
          return this.roles.flatMap(
            (role) => role.roleDefs.map((roleDef) => [role.principal.Title, roleDef.name])
          );
        }
        static fromRestResult(result) {
          const roles = result.RoleAssignments.results.map(
            Role.fromRestRoleAssignment
          );
          return new _ItemPermissions({
            hasUniqueRoleAssignments: result.HasUniqueRoleAssignments,
            roles
          });
        }
      };
      Role = class _Role {
        constructor({ principal, roleDefs = [] }) {
          this.principal = principal;
          this.roleDefs = roleDefs;
        }
        principal;
        // People Entity
        roleDefs = [];
        addRoleDef(roleDef) {
          this.roleDefs.push(roleDef);
        }
        static fromRestRoleAssignment(role) {
          return new _Role({
            principal: { ...role.Member, ID: role.Member.Id },
            roleDefs: role.RoleDefinitionBindings.results.map(
              RoleDef.fromRestRoleDef
            )
          });
        }
        static fromJsomRole(role) {
          const newRole = new _Role({
            principal: principalToPeople(role.get_member())
          });
          var roleDefs = role.get_roleDefinitionBindings();
          if (roleDefs != null) {
            var roleDefsEnumerator = roleDefs.getEnumerator();
            while (roleDefsEnumerator.moveNext()) {
              var roleDef = roleDefsEnumerator.get_current();
              newRole.roleDefs.push(RoleDef.fromJsomRoleDef(roleDef));
            }
          }
          return newRole;
        }
      };
      RoleDef = class _RoleDef {
        constructor({ name, basePermissions = null }) {
          this.name = name;
          this.basePermissions = basePermissions;
        }
        name;
        basePermissions;
        static fromRestRoleDef(roleDef) {
          const newRoleDef = new _RoleDef({
            name: roleDef.Name,
            basePermissions: roleDef.BasePermissions
          });
          Object.assign(newRoleDef, roleDef);
          return newRoleDef;
        }
        static fromJsomRoleDef(roleDef) {
          const newRoleDef = new _RoleDef({ name: roleDef.get_name() });
          newRoleDef.basePermissions = roleDef.get_basePermissions();
          return newRoleDef;
        }
      };
      window.fetchSharePointData = fetchSharePointData;
      JobProcessor = class {
        constructor(maxConcurrency) {
          this.maxConcurrency = maxConcurrency;
          this.runningJobs = 0;
          this.queue = [];
        }
        addJob(asyncFunction) {
          return new Promise((resolve, reject2) => {
            const job = async () => {
              try {
                const result = await asyncFunction();
                resolve(result);
              } catch (error2) {
                reject2(error2);
              } finally {
                this.runningJobs--;
                this.processQueue();
              }
            };
            this.queue.push(job);
            this.processQueue();
          });
        }
        processQueue() {
          while (this.runningJobs < this.maxConcurrency && this.queue.length > 0) {
            const job = this.queue.shift();
            this.runningJobs++;
            job();
          }
        }
      };
      uploadQueue = new JobProcessor(5);
    }
  });

  // src/sal/fields/PeopleField.js
  var PeopleField;
  var init_PeopleField = __esm({
    "src/sal/fields/PeopleField.js"() {
      init_infrastructure();
      init_PeopleModule();
      init_People();
      init_infrastructure();
      init_sal();
      init_fields2();
      PeopleField = class extends BaseField {
        constructor(params) {
          super(params);
          this.spGroupName = params.spGroupName ?? null;
          this.multiple = params.multiple ?? false;
          this.Value = this.multiple ? ko.observableArray() : ko.observable();
          if (ko.isObservable(this.spGroupName)) {
            this.spGroupName.subscribe(this.spGroupNameChangedHandler);
          }
          if (ko.unwrap(this.spGroupName)) {
            this.spGroupNameChangedHandler(ko.unwrap(this.spGroupName));
          }
        }
        spGroupId = ko.observable();
        userOpts = ko.observableArray();
        expandUsers = ko.observable(false);
        spGroupNameChangedHandler = async (groupName) => {
          if (!groupName) {
            this.userOpts.removeAll();
            this.spGroupId(null);
          }
          const group = await ensureUserByKeyAsync(groupName);
          this.spGroupId(group.ID);
          const users = await getUsersByGroupName(groupName);
          this.userOpts(users.sort(sortByTitle));
        };
        pickerOptions = ko.pureComputed(() => {
          const groupId = ko.unwrap(this.spGroupId);
          const opts = {
            AllowMultipleValues: this.multiple
          };
          if (groupId)
            opts.SharePointGroupID = groupId;
          return opts;
        });
        toString = ko.pureComputed(() => {
          if (!this.multiple)
            return this.Value()?.Title;
          return this.Value()?.map((user) => user.Title);
        });
        set = (val) => {
          if (!this.multiple) {
            this.Value(People2.Create(val));
            return;
          }
          if (!val) {
            this.Value.removeAll();
            return;
          }
          const vals = val.results ?? val;
          if (!vals.length) {
            this.Value.removeAll();
            return;
          }
          this.Value(vals.map((u) => People2.Create(u)));
        };
        components = PeopleModule;
      };
    }
  });

  // src/sal/fields/SelectField.js
  var SelectField;
  var init_SelectField = __esm({
    "src/sal/fields/SelectField.js"() {
      init_fields();
      init_fields2();
      SelectField = class extends BaseField {
        constructor({
          displayName,
          isRequired = false,
          Visible,
          options,
          multiple = false,
          optionsText,
          instructions
        }) {
          super({ Visible, displayName, isRequired, instructions });
          this.Options(options);
          this.multiple = multiple;
          this.Value = multiple ? ko.observableArray() : ko.observable();
          this.optionsText = optionsText;
          this.components = this.multiple ? SearchSelectModule : SelectModule;
        }
        toString = ko.pureComputed(
          () => this.multiple ? this.Value().join(", ") : this.Value()
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
      };
    }
  });

  // src/sal/fields/TextAreaField.js
  var TextAreaField;
  var init_TextAreaField = __esm({
    "src/sal/fields/TextAreaField.js"() {
      init_fields();
      init_fields2();
      TextAreaField = class extends BaseField {
        constructor(params) {
          super(params);
          this.isRichText = params.isRichText;
          this.attr = params.attr ?? {};
        }
        components = TextAreaModule;
      };
    }
  });

  // src/sal/fields/TextField.js
  var TextField;
  var init_TextField = __esm({
    "src/sal/fields/TextField.js"() {
      init_fields();
      init_fields2();
      TextField = class extends BaseField {
        constructor(params) {
          super(params);
          this.attr = params.attr ?? {};
          this.options = params.options ?? null;
        }
        components = TextModule;
      };
    }
  });

  // src/sal/fields/index.js
  var init_fields2 = __esm({
    "src/sal/fields/index.js"() {
      init_BaseField();
      init_BlobField();
      init_CheckboxField();
      init_DateField();
      init_LookupField();
      init_PeopleField();
      init_SelectField();
      init_TextAreaField();
      init_TextField();
    }
  });

  // src/sal/primitives/constrained_entity.js
  var ConstrainedEntity;
  var init_constrained_entity = __esm({
    "src/sal/primitives/constrained_entity.js"() {
      init_primitives();
      init_fields2();
      ConstrainedEntity = class extends Entity {
        constructor(params) {
          super(params);
        }
        toJSON = () => {
          const out = {};
          Object.keys(this.FieldMap).map(
            (key) => out[key] = this.FieldMap[key]?.get()
          );
          return out;
        };
        fromJSON(inputObj) {
          if (window.DEBUG)
            console.log("Setting constrained entity from JSON", inputObj);
          Object.keys(inputObj).map((key) => this.FieldMap[key]?.set(inputObj[key]));
        }
        get FieldMap() {
          const fieldMap = {};
          Object.entries(this).filter(([key, val]) => val instanceof BaseField).map(([key, val]) => {
            key = val.systemName ?? key;
            fieldMap[key] = val;
          });
          return fieldMap;
        }
        FormFields = () => Object.values(this.FieldMap);
        // Validate the entire entity
        validate = (showErrors = true) => {
          Object.values(this.FieldMap).map(
            (field) => field?.validate && field.validate(showErrors)
          );
          return this.Errors();
        };
        Errors = ko.pureComputed(() => {
          return Object.values(this.FieldMap).filter((field) => field?.Errors && field.Errors()).flatMap((field) => field.Errors());
        });
        IsValid = ko.pureComputed(() => !this.Errors().length);
        /**
         * Expose methods to generate default new, edit, and view forms
         * for a constrained entity. Uses the constrained
         * entity components.
         *
         * This could be broken into a separate service, but since it's
         * tightly coupled leave it here?
         */
        // static components = {
        //   new: (entity, view = null) =>
        //     new ConstrainedEntityComponent({
        //       entityView: new ConstrainedEntityView({ entity, view }),
        //       displayMode: "edit",
        //     }),
        //   edit: (entity, view = null) =>
        //     new ConstrainedEntityComponent({
        //       entityView: new ConstrainedEntityView({ entity, view }),
        //       displayMode: "edit",
        //     }),
        //   view: (entity, view = null) =>
        //     new ConstrainedEntityComponent({
        //       entityView: new ConstrainedEntityView({ entity, view }),
        //       displayMode: "view",
        //     }),
        // };
      };
    }
  });

  // src/sal/primitives/index.js
  var init_primitives = __esm({
    "src/sal/primitives/index.js"() {
      init_validation_error();
      init_entity();
      init_constrained_entity();
    }
  });

  // src/sal/entities/Page.js
  var Page;
  var init_Page = __esm({
    "src/sal/entities/Page.js"() {
      init_primitives();
      Page = class extends Entity {
        constructor(params) {
          super(params);
        }
        static Views = {
          All: ["ID", "Title", "Created", "Author", "Modified", "Editor"]
        };
        static ListDef = {
          name: "Pages",
          title: "Pages"
        };
      };
    }
  });

  // src/sal/entities/index.js
  var init_entities = __esm({
    "src/sal/entities/index.js"() {
      init_People();
      init_Page();
    }
  });

  // src/env.js
  var assetsPath;
  var init_env = __esm({
    "src/env.js"() {
      assetsPath = "/sites/CGFS/Style Library/apps/audit/src";
    }
  });

  // src/sal/infrastructure/knockout_extensions.js
  var fromPathTemplateLoader, fromPathViewModelLoader;
  var init_knockout_extensions = __esm({
    "src/sal/infrastructure/knockout_extensions.js"() {
      init_entities();
      init_infrastructure();
      init_env();
      ko.subscribable.fn.subscribeChanged = function(callback) {
        var oldValue;
        this.subscribe(
          function(_oldValue) {
            oldValue = _oldValue;
          },
          this,
          "beforeChange"
        );
        this.subscribe(function(newValue) {
          callback(newValue, oldValue);
        });
      };
      ko.observableArray.fn.subscribeAdded = function(callback) {
        this.subscribe(
          function(arrayChanges) {
            const addedValues = arrayChanges.filter((value) => value.status == "added").map((value) => value.value);
            callback(addedValues);
          },
          this,
          "arrayChange"
        );
      };
      ko.bindingHandlers.searchSelect = {
        init: function(element, valueAccessor, allBindingsAccessor) {
          const { options, selectedOptions, optionsText, onSearchInput } = valueAccessor();
          function populateOpts() {
            const optionItems = ko.unwrap(options);
            const optionElements = optionItems.map((option) => {
              const optionElement = document.createElement("option");
              ko.selectExtensions.writeValue(optionElement, ko.unwrap(option));
              optionElement.innerText = optionsText(option);
              if (ko.unwrap(selectedOptions)?.find((selectedOption) => selectedOption.ID == option.ID)) {
                optionElement.setAttribute("selected", "");
              }
              return optionElement;
            });
            element.append(...optionElements);
          }
          populateOpts();
          if (ko.isObservable(options)) {
            options.subscribe(() => populateOpts(), this);
          }
          ko.utils.registerEventHandler(element, "change", (e) => {
            selectedOptions(
              element.selectedOptions.map((opt) => ko.selectExtensions.readValue(opt))
            );
          });
          if (onSearchInput) {
            ko.utils.registerEventHandler(element, "input", (e) => {
              onSearchInput(e.originalEvent.target.searchInputElement.value);
            });
          }
        },
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
          const { selectedOptions } = valueAccessor();
          const selectedUnwrapped = ko.unwrap(selectedOptions);
          for (var i2 = 0; i2 < element.options.length; i2++) {
            const o = element.options[i2];
            o.toggleAttribute(
              "selected",
              selectedUnwrapped.includes(ko.selectExtensions.readValue(o))
            );
          }
        }
      };
      ko.bindingHandlers.people = {
        init: function(element, valueAccessor, allBindingsAccessor) {
          var schema = {};
          schema["PrincipalAccountType"] = "User";
          schema["SearchPrincipalSource"] = 15;
          schema["ShowUserPresence"] = true;
          schema["ResolvePrincipalSource"] = 15;
          schema["AllowEmailAddresses"] = true;
          schema["AllowMultipleValues"] = false;
          schema["MaximumEntitySuggestions"] = 50;
          schema["OnUserResolvedClientScript"] = async function(elemId, userKeys) {
            var pickerControl = SPClientPeoplePicker.SPClientPeoplePickerDict[elemId];
            var observable = valueAccessor();
            var userJSObject = pickerControl.GetControlValueAsJSObject()[0];
            if (!userJSObject) {
              observable(null);
              return;
            }
            if (userJSObject.IsResolved) {
              if (userJSObject.Key == observable()?.LoginName)
                return;
              var user = await ensureUserByKeyAsync(userJSObject.Key);
              var person = new People2(user);
              observable(person);
            }
          };
          SPClientPeoplePicker_InitStandaloneControlWrapper(element.id, null, schema);
        },
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
          var pickerControl = SPClientPeoplePicker.SPClientPeoplePickerDict[element.id + "_TopSpan"];
          var userValue = ko.utils.unwrapObservable(valueAccessor());
          if (!userValue) {
            pickerControl?.DeleteProcessedUser();
            return;
          }
          if (userValue && !pickerControl.GetAllUserInfo().find((pickerUser) => pickerUser.DisplayText == userValue.LookupValue)) {
            pickerControl.AddUserKeys(
              userValue.LoginName ?? userValue.LookupValue ?? userValue.Title
            );
          }
        }
      };
      ko.bindingHandlers.dateField = {
        init: function(element, valueAccessor, allBindingsAccessor) {
        },
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        }
      };
      ko.bindingHandlers.downloadLink = {
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
          var path = valueAccessor();
          var replaced = path.replace(/:([A-Za-z_]+)/g, function(_, token) {
            return ko.unwrap(viewModel[token]);
          });
          element.href = replaced;
        }
      };
      ko.bindingHandlers.files = {
        init: function(element, valueAccessor) {
          function addFiles(fileList) {
            var value = valueAccessor();
            if (!fileList.length) {
              value.removeAll();
              return;
            }
            const existingFiles = ko.unwrap(value);
            const newFileList = [];
            for (let file of fileList) {
              if (!existingFiles.find((exFile) => exFile.name == file.name))
                newFileList.push(file);
            }
            ko.utils.arrayPushAll(value, newFileList);
            return;
          }
          ko.utils.registerEventHandler(element, "change", function() {
            addFiles(element.files);
          });
          const label = element.closest("label");
          if (!label)
            return;
          ko.utils.registerEventHandler(label, "dragover", function(event) {
            event.preventDefault();
            event.stopPropagation();
          });
          ko.utils.registerEventHandler(label, "dragenter", function(event) {
            event.preventDefault();
            event.stopPropagation();
            label.classList.add("dragging");
          });
          ko.utils.registerEventHandler(label, "dragleave", function(event) {
            event.preventDefault();
            event.stopPropagation();
            label.classList.remove("dragging");
          });
          ko.utils.registerEventHandler(label, "drop", function(event) {
            event.preventDefault();
            event.stopPropagation();
            let dt = event.originalEvent.dataTransfer;
            let files = dt.files;
            addFiles(files);
          });
        },
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
          const value = valueAccessor();
          if (!value().length && element.files.length) {
            element.value = null;
            return;
          }
          return;
        }
      };
      ko.bindingHandlers.toggleClick = {
        init: function(element, valueAccessor, allBindings) {
          var value = valueAccessor();
          ko.utils.registerEventHandler(element, "click", function() {
            var classToToggle = allBindings.get("toggleClass");
            var classContainer = allBindings.get("classContainer");
            var containerType = allBindings.get("containerType");
            if (containerType && containerType == "sibling") {
              $(element).nextUntil(classContainer).each(function() {
                $(this).toggleClass(classToToggle);
              });
            } else if (containerType && containerType == "doc") {
              var curIcon = $(element).attr("src");
              if (curIcon == "/_layouts/images/minus.gif")
                $(element).attr("src", "/_layouts/images/plus.gif");
              else
                $(element).attr("src", "/_layouts/images/minus.gif");
              if ($(element).parent() && $(element).parent().parent()) {
                $(element).parent().parent().nextUntil(classContainer).each(function() {
                  $(this).toggleClass(classToToggle);
                });
              }
            } else if (containerType && containerType == "any") {
              if ($("." + classToToggle).is(":visible"))
                $("." + classToToggle).hide();
              else
                $("." + classToToggle).show();
            } else
              $(element).find(classContainer).toggleClass(classToToggle);
          });
        }
      };
      ko.bindingHandlers.toggles = {
        init: function(element, valueAccessor) {
          var value = valueAccessor();
          ko.utils.registerEventHandler(element, "click", function() {
            value(!value());
          });
        }
      };
      fromPathTemplateLoader = {
        loadTemplate: function(name, templateConfig, callback) {
          if (templateConfig.fromPath) {
            fetch(assetsPath + templateConfig.fromPath).then((response) => {
              if (!response.ok) {
                throw new Error(
                  `Error Fetching HTML Template - ${response.statusText}`
                );
              }
              return response.text();
            }).catch((error2) => {
              if (!templateConfig.fallback)
                return;
              console.warn(
                "Primary template not found, attempting fallback",
                templateConfig
              );
              fetch(assetsPath + templateConfig.fallback).then((response) => {
                if (!response.ok) {
                  throw new Error(
                    `Error Fetching fallback HTML Template - ${response.statusText}`
                  );
                }
                return response.text();
              }).then(
                (text) => ko.components.defaultLoader.loadTemplate(name, text, callback)
              );
            }).then(
              (text) => text ? ko.components.defaultLoader.loadTemplate(name, text, callback) : null
            );
          } else {
            callback(null);
          }
        }
      };
      ko.components.loaders.unshift(fromPathTemplateLoader);
      fromPathViewModelLoader = {
        loadViewModel: function(name, viewModelConfig, callback) {
          if (viewModelConfig.viaLoader) {
            const module = import(assetsPath + viewModelConfig.viaLoader).then(
              (module2) => {
                const viewModelConstructor = module2.default;
                ko.components.defaultLoader.loadViewModel(
                  name,
                  viewModelConstructor,
                  callback
                );
              }
            );
          } else {
            callback(null);
          }
        }
      };
      ko.components.loaders.unshift(fromPathViewModelLoader);
    }
  });

  // src/sal/infrastructure/register_components.js
  function registerComponent({
    name,
    folder,
    module = null,
    moduleFilename = null,
    template: templateFilename
  }) {
    if (ko.components.isRegistered(name)) {
      return;
    }
    if (moduleFilename || module) {
      ko.components.register(name, {
        template: {
          fromPath: `/components/${folder}/${templateFilename}.html`
        },
        viewModel: module ?? {
          viaLoader: `/components/${folder}/${moduleFilename}.js`
        }
      });
    } else {
      ko.components.register(name, {
        template: {
          fromPath: `/components/${folder}/${templateFilename}.html`
        }
      });
    }
  }
  function directRegisterComponent(name, { template: template2, viewModel = null }) {
    ko.components.register(name, {
      template: template2,
      viewModel
    });
  }
  var html4;
  var init_register_components = __esm({
    "src/sal/infrastructure/register_components.js"() {
      html4 = String.raw;
    }
  });

  // src/sal/infrastructure/authorization.js
  async function getUsersByGroupName(groupName) {
    const users = await getGroupUsers(groupName);
    if (!users)
      return [];
    return users.map((userProps) => new People(userProps));
  }
  var init_authorization = __esm({
    "src/sal/infrastructure/authorization.js"() {
      init_sal();
    }
  });

  // src/sal/infrastructure/index.js
  var init_infrastructure = __esm({
    "src/sal/infrastructure/index.js"() {
      init_entity_utilities();
      init_knockout_extensions();
      init_register_components();
      init_sal();
      init_authorization();
    }
  });

  // src/infrastructure/store.js
  var configurationsStore, auditOrganizationStore, allActionOfficesFilter, allRequestingOfficesFilter;
  var init_store = __esm({
    "src/infrastructure/store.js"() {
      init_entities2();
      configurationsStore = {};
      auditOrganizationStore = ko.observableArray();
      allActionOfficesFilter = (org) => ORGROLES.ACTIONOFFICE == org.Role;
      allRequestingOfficesFilter = (org) => ORGROLES.REQUESTINGOFFICE == org.Role;
    }
  });

  // src/entities/audit_coversheet.js
  var AuditCoversheet;
  var init_audit_coversheet = __esm({
    "src/entities/audit_coversheet.js"() {
      init_entities2();
      init_store();
      init_constrained_entity();
      init_fields2();
      init_application_db_context();
      AuditCoversheet = class extends ConstrainedEntity {
        constructor(params) {
          super(params);
        }
        Title = new TextField({
          displayName: "Title",
          required: true
        });
        FileName = new TextField({
          displayName: "Name",
          systemName: "FileLeafRef",
          required: true
        });
        FileRef = new TextField({
          displayName: "File Link",
          systemName: "FileRef"
        });
        ReqNum = new LookupField({
          displayName: "Request Number",
          type: AuditRequest,
          lookupCol: "Title",
          required: true,
          entitySet: appContext.AuditRequests
        });
        ActionOffice = new LookupField({
          displayName: "Action Offices",
          type: AuditOrganization,
          options: auditOrganizationStore,
          optionsFilter: ko.pureComputed(() => {
            const request2 = ko.unwrap(this.ReqNum.Value);
            if (!request2)
              return (val) => val;
            const requestActionOffices = ko.unwrap(request2.ActionOffice.Value);
            return (opt) => requestActionOffices.includes(opt);
          }),
          lookupCol: "Title",
          multiple: true,
          entitySet: appContext.AuditOrganizations
        });
        static Views = {
          All: ["ID", "Title", "FileLeafRef", "FileRef", "ReqNum", "ActionOffice"],
          AOCanUpdate: ["Title", "FileLeafRef", "ActionOffice"]
        };
        static ListDef = {
          title: "AuditCoversheets",
          name: "AuditCoversheets",
          isLib: true
        };
      };
    }
  });

  // src/entities/audit_email.js
  var AuditEmail;
  var init_audit_email = __esm({
    "src/entities/audit_email.js"() {
      init_constrained_entity();
      AuditEmail = class extends ConstrainedEntity {
        constructor(params) {
          super(params);
        }
        static Views = {
          All: ["ID", "Title", "To", "Body", "NotificationType", "ReqNum", "ResID"]
        };
        static ListDef = {
          name: "AuditEmails",
          title: "AuditEmails"
        };
      };
    }
  });

  // src/entities/audit_organization.js
  var ORGROLES, AuditOrganization;
  var init_audit_organization = __esm({
    "src/entities/audit_organization.js"() {
      init_constrained_entity();
      ORGROLES = {
        ACTIONOFFICE: "Action Office",
        REQUESTINGOFFICE: "Requesting Office",
        QUALITYASSURANCE: "Quality Assurance",
        SPECIALPERMISSIONS: "Special Permissions",
        RESTRICTEDREADERS: "Restricted Readers"
      };
      AuditOrganization = class extends ConstrainedEntity {
        constructor(params) {
          super(params);
        }
        static Views = {
          All: [
            "ID",
            "Title",
            "Country",
            "Organization_x0020_Description",
            "EmailGroup",
            "Org_Type",
            "Post_x0020_Code",
            "UserGroup",
            "Role"
          ]
        };
        static ListDef = {
          name: "AuditOrganizations",
          title: "AuditOrganizations"
        };
      };
    }
  });

  // src/entities/audit_request.js
  var AUDITREQUESTSTATES, AUDITREQUESTTYPES, AuditRequest;
  var init_audit_request = __esm({
    "src/entities/audit_request.js"() {
      init_audit_organization();
      init_fields2();
      init_primitives();
      init_validation_error();
      init_store();
      init_application_db_context();
      AUDITREQUESTSTATES = {
        OPEN: "Open",
        CANCELLED: "Canceled",
        CLOSED: "Closed",
        REOPENED: "ReOpened"
      };
      AUDITREQUESTTYPES = {
        TASKER: "Tasker",
        REQUEST: "Request",
        NOTIFICATION: "Notification"
      };
      AuditRequest = class extends ConstrainedEntity {
        constructor(params) {
          super(params);
          this.InternalDueDate.addFieldRequirement({
            requirement: ko.pureComputed(() => {
              return this.InternalDueDate.Value() > this.ReqDueDate.Value();
            }),
            error: new ValidationError2(
              "text-field",
              "required-field",
              "The Internal Due Date must be before the Request Due Date!"
            )
          });
        }
        ReqType = new SelectField({
          displayName: "Request Type",
          options: Object.values(AUDITREQUESTTYPES),
          isRequired: true,
          instructions: ko.pureComputed(() => {
            switch (this.ReqType.Value()) {
              case AUDITREQUESTTYPES.TASKER:
                return "A request that doesn't require QA Approval.";
              case AUDITREQUESTTYPES.REQUEST:
                return "A request requiring QA Approval";
              case AUDITREQUESTTYPES.NOTIFICATION:
                return "A request that is closed after the email is sent";
              default:
            }
          })
        });
        ReqNum = new TextField({
          displayName: "Request Number",
          systemName: "Title",
          isRequired: true
        });
        ReqSubject = new TextField({
          displayName: "Request Subject",
          isRequired: true
        });
        RequestingOffice = new LookupField({
          displayName: "Requesting Office",
          type: AuditOrganization,
          options: auditOrganizationStore,
          optionsFilter: allRequestingOfficesFilter,
          lookupCol: "Title",
          entitySet: appContext.AuditOrganizations,
          isRequired: true
        });
        FiscalYear = new TextField({
          displayName: "Fiscal Year",
          isRequired: true
        });
        InternalDueDate = new DateField({
          displayName: "Internal Due Date",
          type: dateFieldTypes.date,
          isRequired: true
        });
        ReqDueDate = new DateField({
          displayName: "Request Due Date",
          type: dateFieldTypes.date,
          isRequired: true
        });
        ReqStatus = new SelectField({
          displayName: "Request Status",
          options: Object.values(AUDITREQUESTSTATES),
          isRequired: true
        });
        IsSample = new CheckboxField({
          displayName: "Is Sample?"
        });
        ReceiptDate = new DateField({
          displayName: "Receipt Date",
          type: dateFieldTypes.date,
          isRequired: false
        });
        RelatedAudit = new TextField({
          displayName: "Related Audit",
          isRequired: false,
          instructions: "The Audit Request number of the similar audit performed in the previous FY"
        });
        ActionItems = new TextAreaField({
          displayName: "Action Items",
          instructions: "Items that have been requested by the Auditor",
          isRichText: true,
          isMinimalEditor: true,
          classList: ["min-w-full"]
        });
        Comments = new TextAreaField({
          displayName: "Comments",
          isRichText: true,
          isMinimalEditor: true,
          classList: ["min-w-full"]
        });
        Reminders = new SelectField({
          displayName: "Reminders",
          options: [
            "3 Days Before Due",
            "1 Day Before Due",
            "1 Day Past Due",
            "3 Days Past Due",
            "7 Days Past Due"
          ],
          multiple: true
        });
        EmailSent = new CheckboxField({
          displayName: "Email has been sent"
        });
        Sensitivity = new SelectField({
          displayName: "Sensitivity",
          options: ["None", "Official", "SBU", "PII_SBU"]
        });
        ActionOffice = new LookupField({
          displayName: "Action Offices",
          type: AuditOrganization,
          options: auditOrganizationStore,
          optionsFilter: allActionOfficesFilter,
          lookupCol: "Title",
          multiple: true,
          entitySet: appContext.AuditOrganizations
        });
        EmailActionOffice = new LookupField({
          displayName: "Email Action Offices",
          type: AuditOrganization,
          options: auditOrganizationStore,
          optionsFilter: allActionOfficesFilter,
          lookupCol: "Title",
          multiple: true,
          entitySet: appContext.AuditOrganizations
        });
        ClosedDate = new DateField({
          displayName: "Closed Date",
          isRequired: false
        });
        ClosedBy = new PeopleField({
          displayName: "Closed By",
          isRequired: false
        });
        static Views = {
          All: [
            "ID",
            "Title",
            "ReqType",
            "ReqSubject",
            "FiscalYear",
            "InternalDueDate",
            "ReqDueDate",
            "ReqStatus",
            "IsSample",
            "ReceiptDate",
            "RelatedAudit",
            "ActionItems",
            "Comments",
            "Reminders",
            "EmailSent",
            "Sensitivity",
            "ActionOffice",
            "EmailActionOffice",
            "RequestingOffice",
            "ClosedDate",
            "ClosedBy"
          ],
          New: [
            "Title",
            "ReqType",
            "ReqSubject",
            "RequestingOffice",
            "FiscalYear",
            "InternalDueDate",
            "ReqDueDate",
            "ReqStatus",
            "IsSample",
            "ReceiptDate",
            "RelatedAudit",
            "ActionItems",
            "Comments",
            "Reminders",
            "Sensitivity",
            "ActionOffice"
          ],
          IACanUpdate: [
            "ReqType",
            "ReqSubject",
            "FiscalYear",
            "RequestingOffice",
            "InternalDueDate",
            "ReqDueDate",
            "ReqStatus",
            "IsSample",
            "ReceiptDate",
            "RelatedAudit",
            "ActionItems",
            "Comments",
            "Reminders",
            "Sensitivity",
            "ActionOffice",
            "EmailActionOffice",
            "ClosedBy",
            "ClosedDate"
          ]
        };
        static ListDef = {
          name: "AuditRequests",
          title: "AuditRequests"
        };
      };
    }
  });

  // src/entities/audit_bulk_request.js
  var AuditBulkRequest;
  var init_audit_bulk_request = __esm({
    "src/entities/audit_bulk_request.js"() {
      init_audit_request();
      AuditBulkRequest = class extends AuditRequest {
        constructor(params) {
          super(params);
        }
        toRequest() {
          const newReq = new AuditRequest(this);
          newReq.fromJSON(this.toJSON());
          return newReq;
        }
        static Views = {
          All: [
            "ID",
            "Title",
            "ReqSubject",
            "FiscalYear",
            "InternalDueDate",
            "ReqDueDate",
            "ReqStatus",
            "IsSample",
            "ReceiptDate",
            "RelatedAudit",
            "ActionItems",
            "Comments",
            "Reminders",
            "EmailSent",
            "Sensitivity",
            "ActionOffice",
            "EmailActionOffice",
            "EmailActionOffice",
            "ClosedDate",
            "ClosedBy"
          ],
          New: [
            "Title",
            "ReqSubject",
            "FiscalYear",
            "InternalDueDate",
            "ReqDueDate",
            "ReqStatus",
            "IsSample",
            "ReceiptDate",
            "RelatedAudit",
            "ActionItems",
            "Comments",
            "Reminders",
            "Sensitivity",
            "ActionOffice"
          ]
        };
        static ListDef = {
          name: "AuditBulkRequests",
          title: "AuditBulkRequests"
        };
      };
    }
  });

  // src/value_objects/comment.js
  var Comment;
  var init_comment = __esm({
    "src/value_objects/comment.js"() {
      init_primitives();
      init_fields2();
      Comment = class _Comment extends ConstrainedEntity {
        constructor(params) {
          super(params);
        }
        id = new TextField({
          displayName: "ID"
        });
        text = new TextField({
          displayName: "Comment"
        });
        author = new TextField({
          displayName: "author"
        });
        timestamp = new TextField({
          displayName: "timestamp"
        });
        FieldMap = {
          id: this.id,
          text: this.text,
          author: this.author,
          timestamp: this.timestamp
        };
        static Create({ id: id2, text, author, timestamp }) {
          const newComment = new _Comment();
          newComment.id.Value(id2);
          newComment.text.Value(text);
          newComment.author.Value(author);
          newComment.timestamp.Value(timestamp);
          return newComment;
        }
        static Views = {
          All: ["id", "text", "author", "timestamp"]
        };
      };
    }
  });

  // src/value_objects/active_viewer.js
  var ActiveViewer;
  var init_active_viewer = __esm({
    "src/value_objects/active_viewer.js"() {
      init_primitives();
      init_fields2();
      ActiveViewer = class extends ConstrainedEntity {
        id = new TextField({
          displayName: "ID"
        });
        viewer = new TextField({
          displayName: "Viewer"
        });
        timestamp = new DateField({
          displayName: "Timestamp",
          type: dateFieldTypes.datetime
        });
        FieldMap = {
          id: this.id,
          viewer: this.viewer,
          timestamp: this.timestamp
        };
        static Views = {
          All: ["id", "viewer", "timestamp"]
        };
      };
    }
  });

  // src/components/active_viewers/active_viewers_module.js
  function ActiveViewersModuleLegacy(requestId, props) {
    var requestListTitle = props.requestListTitle;
    var columnName = props.columnName;
    var initialValue = props.initialValue;
    var arrInitialViewers = [];
    if (initialValue) {
      try {
        arrInitialViewers = JSON.parse(initialValue);
        arrInitialViewers.forEach(function(viewer) {
          viewer.timestamp = new Date(viewer.timestamp);
        });
      } catch (e) {
        console.error("could not parse internal status comments.");
      }
    }
    var viewers = ko.observableArray(arrInitialViewers);
    function pushCurrentUser() {
      pushUser(_spPageContextInfo.userLoginName);
    }
    function pushUser(loginName) {
      var filteredViewers = viewers().filter(function(viewer2) {
        return viewer2.viewer != loginName;
      });
      viewers(filteredViewers);
      var viewer = {
        id: Math.ceil(Math.random() * 1e6).toString(16),
        viewer: loginName,
        timestamp: /* @__PURE__ */ new Date()
      };
      viewers.push(viewer);
      commitChanges();
    }
    function removeCurrentuser() {
      removeUserByLogin(_spPageContextInfo.userLoginName);
    }
    function removeUserByLogin(loginName) {
      var viewerToRemove = viewers().filter(function(viewer) {
        return viewer.viewer == loginName;
      });
      if (viewerToRemove.length) {
        removeUser(viewerToRemove[0]);
      }
    }
    function onRemove(viewerToRemove) {
      if (confirm("Are you sure you want to delete this item?")) {
        removeUser(viewerToRemove);
      }
    }
    function removeUser(viewerToRemove) {
      var viewerIndex = viewers.indexOf(viewerToRemove);
      viewers.splice(viewerIndex, 1);
      commitChanges();
    }
    function commitChanges() {
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      var requestList = web.get_lists().getByTitle(requestListTitle);
      const oListItem = requestList.getItemById(requestId);
      oListItem.set_item(columnName, JSON.stringify(viewers()));
      oListItem.update();
      currCtx.load(oListItem);
      currCtx.executeQueryAsync(
        function onSuccess() {
        },
        function onFailure(args, sender) {
          console.error("Failed to commit changes - " + columnName, args);
        }
      );
    }
    var publicMembers = {
      viewers,
      pushCurrentUser,
      pushUser,
      removeCurrentuser,
      removeUserByLogin,
      onRemove
    };
    return publicMembers;
  }
  var ActiveViewersComponent;
  var init_active_viewers_module = __esm({
    "src/components/active_viewers/active_viewers_module.js"() {
      init_active_viewer();
      init_application_db_context();
      ActiveViewersComponent = class {
        constructor({ entity, fieldName }) {
          this.entity = entity;
          this.blobField = entity[fieldName];
          this.fieldName = fieldName;
          this.viewers = this.blobField.TypedValues;
        }
        entity;
        blobField;
        fieldName;
        pushCurrentUser() {
          this.pushUser(_spPageContextInfo.userLoginName);
        }
        pushUser(loginName) {
          var filteredViewers = this.viewers().filter(function(viewer2) {
            return viewer2.viewer != loginName;
          });
          this.viewers(filteredViewers);
          var viewer = new ActiveViewer();
          viewer.fromJSON({
            id: Math.ceil(Math.random() * 1e6).toString(16),
            viewer: loginName,
            timestamp: (/* @__PURE__ */ new Date()).toLocaleString()
          });
          this.viewers.push(viewer);
          this.commitChanges();
        }
        removeUser(viewerToRemove) {
          this.viewers.remove(viewerToRemove);
          this.commitChanges();
        }
        removeCurrentuser() {
          this.removeUserByLogin(_spPageContextInfo.userLoginName);
        }
        removeUserByLogin(loginName) {
          var viewerToRemove = this.viewers().find(function(viewer) {
            return viewer.viewer == loginName;
          });
          if (viewerToRemove) {
            this.removeUser(viewerToRemove);
          }
        }
        onRemove = (viewerToRemove) => {
          if (confirm("Are you sure you want to delete this item?")) {
            this.removeUser(viewerToRemove);
          }
        };
        async commitChanges() {
          const set = appContext.Set(this.entity.constructor);
          if (!set) {
            alert("Cannot find entity set", this.entity);
            return;
          }
          await set.UpdateEntity(this.entity, [this.fieldName]);
        }
      };
    }
  });

  // src/components/comment_chain/CommentChainTemplate.js
  var commentChainTemplate;
  var init_CommentChainTemplate = __esm({
    "src/components/comment_chain/CommentChainTemplate.js"() {
      init_infrastructure();
      commentChainTemplate = html4`
  <div>
    <!-- ko if: showHistoryBool -->
    <!-- ko foreach: comments -->
    <div class="comment">
      <div data-bind="text: text.Value"></div>
      <div>
        <span
          data-bind="text: author.Value() + ' @ ' + timestamp.Value()"
        ></span
        ><span class="remove" data-bind="click: $parent.onRemove">x</span>
      </div>
    </div>
    <!-- /ko -->
    <!-- /ko -->
    <!-- ko ifnot: showHistoryBool -->
    <div class="comment" data-bind="with: comments()[comments().length - 1]">
      <div data-bind="text: text.Value"></div>
      <div>
        <span
          data-bind="text: author.Value() + ' @ ' + timestamp.Value()"
        ></span
        ><span class="remove" data-bind="click: $parent.onRemove">x</span>
      </div>
    </div>
    <!-- /ko -->
    <a
      title="Show hidden comments"
      href="javascript:void(0)"
      data-bind="click: toggleShowHistory"
    >
      <span class="ui-icon ui-icon-comment"></span>
      Toggle Comment History (<span data-bind="text: comments().length"></span>
      Total)
    </a>
    <div class="newComment">
      <textarea cols="50" data-bind="value: newCommentText"></textarea>
      <button type="button" data-bind="click: onSubmit">Submit</button>
    </div>
  </div>
`;
    }
  });

  // src/components/comment_chain/comment_chain_module.js
  var commentChainComponentName, CommentChainComponent, CommentChainModule, CommentChainModuleLegacy;
  var init_comment_chain_module = __esm({
    "src/components/comment_chain/comment_chain_module.js"() {
      init_application_db_context();
      init_infrastructure();
      init_comment();
      init_CommentChainTemplate();
      commentChainComponentName = "commentChain";
      CommentChainComponent = class {
        constructor({ entity, fieldName }) {
          this.entity = entity;
          this.blobField = entity[fieldName];
          this.fieldName = fieldName;
        }
        entity;
        blobField;
        fieldName;
        componentName = commentChainComponentName;
      };
      CommentChainModule = class {
        constructor({ entity, fieldName, blobField }) {
          this.entity = entity;
          this.fieldName = fieldName;
          this.blobField = blobField;
          this.comments = blobField.TypedValues;
        }
        // comments = ko.observableArray();
        newCommentText = ko.observable();
        showHistoryBool = ko.observable(false);
        toggleShowHistory = function() {
          this.showHistoryBool(!this.showHistoryBool());
        };
        async onSubmit() {
          var comment = Comment.Create({
            id: Math.ceil(Math.random() * 1e6).toString(16),
            text: this.newCommentText(),
            author: _spPageContextInfo.userLoginName,
            timestamp: (/* @__PURE__ */ new Date()).toLocaleString()
          });
          this.blobField.add(comment);
          await this.commitChanges();
          this.newCommentText("");
        }
        onRemove = (commentToRemove) => {
          if (confirm("Are you sure you want to delete this item?")) {
            this.blobField.remove(commentToRemove);
            this.commitChanges();
          }
        };
        async commitChanges() {
          const set = appContext.Set(this.entity.constructor);
          if (!set) {
            alert("Cannot find entity set", this.entity);
            return;
          }
          await set.UpdateEntity(this.entity, [this.fieldName]);
        }
      };
      directRegisterComponent(commentChainComponentName, {
        template: commentChainTemplate,
        viewModel: CommentChainModule
      });
      CommentChainModuleLegacy = class {
        constructor(requestId, props) {
          this.requestId = requestId;
          this.requestListTitle = props.requestListTitle;
          this.columnName = props.columnName;
          const initialValue = props.initialValue;
          if (initialValue) {
            try {
              const arrInitialComments = JSON.parse(initialValue);
              arrInitialComments.map(function(comment) {
                comment.timestamp = new Date(comment.timestamp);
              });
              this.comments(arrInitialComments);
            } catch (e) {
              console.error("could not parse internal status comments.");
            }
          }
        }
        comments = ko.observableArray();
        newCommentText = ko.observable();
        showHistoryBool = ko.observable(false);
        toggleShowHistory = function() {
          this.showHistoryBool(!this.showHistoryBool());
        };
        onSubmit = () => {
          var comment = {
            id: Math.ceil(Math.random() * 1e6).toString(16),
            text: this.newCommentText(),
            author: _spPageContextInfo.userLoginName,
            timestamp: /* @__PURE__ */ new Date()
          };
          this.comments.push(comment);
          this.commitChanges();
          this.newCommentText("");
        };
        onRemove = (commentToRemove) => {
          if (confirm("Are you sure you want to delete this item?")) {
            this.comments.remove(commentToRemove);
            this.commitChanges();
          }
        };
        commitChanges = () => {
          const currCtx = new SP.ClientContext.get_current();
          const web = currCtx.get_web();
          const requestList = web.get_lists().getByTitle(this.requestListTitle);
          const oListItem = requestList.getItemById(this.requestId);
          oListItem.set_item(this.columnName, JSON.stringify(this.comments()));
          oListItem.update();
          currCtx.load(oListItem);
          currCtx.executeQueryAsync(
            function onSuccess() {
            },
            function onFailure(args, sender) {
              console.error("Failed to commit changes.", args);
            }
          );
        };
      };
    }
  });

  // src/entities/audit_request_internal.js
  var AuditRequestsInternal;
  var init_audit_request_internal = __esm({
    "src/entities/audit_request_internal.js"() {
      init_fields2();
      init_constrained_entity();
      init_audit_request();
      init_comment();
      init_active_viewer();
      init_active_viewers_module();
      init_comment_chain_module();
      init_application_db_context();
      AuditRequestsInternal = class extends ConstrainedEntity {
        constructor(params) {
          super(params);
        }
        ActiveViewers = new BlobField({
          displayName: "Active Viewers",
          entityType: ActiveViewer,
          multiple: true
        });
        InternalStatus = new BlobField({
          displayName: "Internal Status",
          entityType: Comment,
          multiple: true
        });
        ReqNum = new LookupField({
          displayName: "Request",
          type: AuditRequest,
          lookupCol: "Title",
          entitySet: appContext.AuditRequests
        });
        commentChainComponent = new CommentChainComponent({
          entity: this,
          fieldName: "InternalStatus"
        });
        activeViewersComponent = new ActiveViewersComponent({
          entity: this,
          fieldName: "ActiveViewers"
        });
        static Views = {
          All: ["ID", "ActiveViewers", "InternalStatus", "ReqNum"]
        };
        static ListDef = {
          title: "AuditRequestsInternal",
          name: "AuditRequestsInternal"
        };
      };
    }
  });

  // src/services/people_manager.js
  function getSiteGroups() {
    const groups = getDefaultGroups();
    const mappedGroups = {};
    Object.entries(groups).map(
      ([key, group]) => mappedGroups[key] = new People2(group)
    );
    return mappedGroups;
  }
  async function getPeopleByUsername(userName) {
    const user = await ensureUserByKeyAsync(userName);
    if (!user)
      return null;
    return new People2(user);
  }
  async function getSpecialPermGroups() {
    if (specialGroups)
      return specialGroups;
    if (specialGroupsLoading()) {
      return new Promise((resolve) => {
        const subscriber = specialGroupsLoading.subscribe(() => {
          subscriber.dispose();
          resolve(specialGroups);
        });
      });
    }
    specialGroupsLoading(true);
    const specialPermGroup1 = await getPeopleByUsername(
      groupNameSpecialPermName1
    );
    const specialPermGroup2 = await getPeopleByUsername(
      groupNameSpecialPermName2
    );
    specialGroups = {
      specialPermGroup1,
      specialPermGroup2
    };
    specialGroupsLoading(false);
    return specialGroups;
  }
  async function getQAGroup() {
    if (qaGroup)
      return qaGroup;
    if (qaGroupLoading()) {
      return new Promise((resolve) => {
        const subscriber = qaGroupLoading.subscribe(() => {
          subscriber.dispose();
          resolve(qaGroup);
        });
      });
    }
    qaGroupLoading(true);
    qaGroup = await getPeopleByUsername(groupNameQA);
    qaGroupLoading(false);
    return qaGroup;
  }
  var groupNameSpecialPermName1, groupNameSpecialPermName2, groupNameQA, specialGroups, specialGroupsLoading, qaGroup, qaGroupLoading, User, currentUser2;
  var init_people_manager = __esm({
    "src/services/people_manager.js"() {
      init_entities();
      init_infrastructure();
      groupNameSpecialPermName1 = "CGFS Special Access1";
      groupNameSpecialPermName2 = "CGFS Special Access2";
      groupNameQA = "Quality Assurance";
      specialGroups = null;
      specialGroupsLoading = ko.observable(false);
      qaGroup = null;
      qaGroupLoading = ko.observable(false);
      User = class _User extends People2 {
        constructor({
          ID,
          Title,
          LoginName = null,
          LookupValue = null,
          WorkPhone = null,
          EMail = null,
          IsGroup = null,
          IsEnsured = false,
          Groups = null
        }) {
          super({ ID, Title, LookupValue, LoginName, IsGroup, IsEnsured });
          this.WorkPhone = WorkPhone;
          this.EMail = EMail;
          this.Groups = Groups;
        }
        Groups = [];
        isInGroup(group) {
          if (!group?.ID)
            return false;
          return this.getGroupIds().includes(group.ID);
        }
        getGroupIds() {
          return this.Groups.map((group) => group.ID);
        }
        IsSiteOwner = ko.pureComputed(
          () => this.isInGroup(getDefaultGroups().owners)
        );
        hasSystemRole = (systemRole) => {
          const userIsOwner = this.IsSiteOwner();
          switch (systemRole) {
            case systemRoles.Admin:
              return userIsOwner;
              break;
            case systemRoles.ActionOffice:
              return userIsOwner || this.ActionOffices().length;
            default:
          }
        };
        static _user = null;
        static Create = async function() {
          if (_User._user)
            return _User._user;
          const userProps = await getUserPropsAsync();
          _User._user = new _User(userProps);
          return _User._user;
        };
      };
      currentUser2 = User.Create;
    }
  });

  // src/entities/audit_response.js
  var AuditResponseStates, AuditResponse;
  var init_audit_response = __esm({
    "src/entities/audit_response.js"() {
      init_primitives();
      init_fields2();
      init_entities2();
      init_application_db_context();
      init_active_viewer();
      init_active_viewers_module();
      init_store();
      init_people_manager();
      AuditResponseStates = {
        Open: "1-Open",
        Submitted: "2-Submitted",
        ReturnedToAO: "3-Returned to Action Office",
        ApprovedForQA: "4-Approved for QA",
        ReturnedToGFS: "5-Returned to GFS",
        RepostedAfterRejection: "6-Reposted After Rejection",
        Closed: "7-Closed"
      };
      AuditResponse = class extends ConstrainedEntity {
        constructor(params) {
          super(params);
        }
        Title = new TextField({
          displayName: "Name"
        });
        ReqNum = new LookupField({
          displayName: "Request Number",
          type: AuditRequest,
          entitySet: appContext.AuditRequests
        });
        SampleNumber = new TextField({
          displayName: "Sample Number",
          isRequired: true
        });
        ResStatus = new SelectField({
          displayName: "Response Status",
          options: Object.values(AuditResponseStates)
        });
        ReturnReason = new TextField({
          displayName: "Return Reason",
          options: ["Incomplete Document", "Incorrect POC"]
        });
        Comments = new TextAreaField({
          displayName: "Comments",
          isRichText: true,
          isMinimalEditor: true,
          classList: ["min-w-full"]
        });
        ClosedDate = new DateField({
          displayName: "Closed Date",
          type: dateFieldTypes.date
        });
        ClosedBy = new PeopleField({
          displayName: "Closed By"
        });
        POC = new PeopleField({
          displayName: "POC"
        });
        POCCC = new PeopleField({
          displayName: "POCCC"
        });
        ActionOffice = new LookupField({
          displayName: "Action Office",
          type: AuditOrganization,
          options: auditOrganizationStore,
          optionsFilter: ko.pureComputed(() => {
            const request2 = ko.unwrap(this.ReqNum.Value);
            if (!request2)
              return (val) => val;
            const requestActionOffices = ko.unwrap(request2.ActionOffice.Value);
            return (opt) => requestActionOffices.includes(opt);
          }),
          entitySet: appContext.AuditOrganizations,
          lookupCol: "Title",
          isRequired: true
        });
        ActiveViewers = new BlobField({
          displayName: "Active Viewers",
          entityType: ActiveViewer,
          multiple: true
        });
        activeViewersComponent = new ActiveViewersComponent({
          entity: this,
          fieldName: "ActiveViewers"
        });
        async uploadResponseDocFile(file) {
          const fileMetadata = {
            Title: file.name,
            ReqNumId: this.ReqNum.Value().ID,
            ResIDId: this.ID
          };
          const { appContext: appContext2 } = await Promise.resolve().then(() => (init_application_db_context(), application_db_context_exports));
          return await appContext2.AuditResponseDocs.UploadFileToFolderAndUpdateMetadata(
            file,
            file.name,
            this.Title.Value(),
            fileMetadata
          );
        }
        markClosed() {
          this.ResStatus.Value(AuditResponseStates.Closed);
          this.ClosedDate.set(/* @__PURE__ */ new Date());
          this.ClosedBy.set(currentUser2());
        }
        static Views = {
          All: [
            "ID",
            "Title",
            "SampleNumber",
            "ResStatus",
            "ReturnReason",
            "Comments",
            "ClosedDate",
            "ClosedBy",
            "POC",
            "POCCC",
            "ReqNum",
            "ActionOffice",
            "ActiveViewers"
          ],
          NewForm: ["ReqNum", "ActionOffice", "SampleNumber", "Comments"],
          EditForm: [
            "ReqNum",
            "SampleNumber",
            "Title",
            "ActionOffice",
            "ResStatus",
            "ReturnReason",
            "Comments",
            "ClosedDate",
            "ClosedBy",
            "POC",
            "POCCC"
          ],
          IACanUpdate: [
            "Title",
            "ActionOffice",
            "ResStatus",
            "ReturnReason",
            "Comments",
            "ClosedDate",
            "ClosedBy",
            "POC",
            "POCCC"
          ],
          IAUpdateClosed: ["ResStatus", "ClosedDate", "ClosedBy"]
        };
        static ListDef = {
          name: "AuditResponses",
          title: "AuditResponses"
        };
      };
    }
  });

  // src/entities/audit_bulk_response.js
  var AuditBulkResponse;
  var init_audit_bulk_response = __esm({
    "src/entities/audit_bulk_response.js"() {
      init_entities2();
      AuditBulkResponse = class extends AuditResponse {
        constructor(params) {
          super(params);
        }
        static ListDef = {
          name: "AuditBulkResponses",
          title: "AuditBulkResponses"
        };
      };
    }
  });

  // src/entities/audit_response_doc.js
  var AuditResponseDocStates, AuditResponseDoc;
  var init_audit_response_doc = __esm({
    "src/entities/audit_response_doc.js"() {
      init_primitives();
      init_fields2();
      init_audit_response();
      init_audit_request();
      init_application_db_context();
      AuditResponseDocStates = {
        Open: "Open",
        Submitted: "Submitted",
        SentToQA: "Sent to QA",
        Approved: "Approved",
        Rejected: "Rejected",
        Archived: "Archived",
        MarkedForDeletion: "Marked for Deletion"
      };
      AuditResponseDoc = class extends ConstrainedEntity {
        constructor(params) {
          super(params);
        }
        Title = new TextField({
          displayName: "Name"
        });
        ReceiptDate = new DateField({
          displayName: "Receipt Date",
          type: dateFieldTypes.date
        });
        DocumentStatus = new SelectField({
          displayName: "Document Status",
          options: Object.values(AuditResponseDocStates)
        });
        RejectReason = new TextAreaField({
          displayName: "Reject Reason"
        });
        ReqNum = new LookupField({
          displayName: "Request Number",
          type: AuditRequest,
          entitySet: appContext.AuditRequests
        });
        ResID = new LookupField({
          displayName: "Response ID",
          type: AuditResponse,
          entitySet: appContext.AuditResponses
        });
        FileName = new TextField({
          displayName: "Name",
          systemName: "FileLeafRef"
        });
        FileRef = new TextField({
          displayName: "File Link",
          systemName: "FileRef"
        });
        Modified = new DateField({
          displayName: "Modified",
          type: dateFieldTypes.datetime
        });
        Editor = new PeopleField({
          displayName: "Modified By"
        });
        Created = new DateField({
          displayName: "Created",
          type: dateFieldTypes.datetime
        });
        FileSizeDisplay = new TextField({
          displayName: "File"
        });
        File_x0020_Type = new TextField({
          displayName: "File Type",
          systemName: "File_x0020_Type"
        });
        CheckoutUser = new PeopleField({
          displayName: "Checked Out To"
        });
        markApprovedForRO(newFileName) {
          this.DocumentStatus.Value(AuditResponseDocStates.Approved);
          this.RejectReason.Value("");
          if (this.FileName.Value() != newFileName)
            this.FileName.Value(newFileName);
        }
        static Views = {
          All: [
            "ID",
            "Title",
            "ReceiptDate",
            "DocumentStatus",
            "RejectReason",
            "ReqNum",
            "ResID",
            "FileLeafRef",
            "FileRef",
            "FileSizeDisplay",
            "File_x0020_Type",
            "CheckoutUser",
            "Modified",
            "Editor",
            "Created"
          ],
          EditForm: [
            "FileLeafRef",
            "Title",
            "ReceiptDate",
            "DocumentStatus",
            "RejectReason",
            "ReqNum",
            "ResID"
          ],
          AOCanUpdate: [
            "Title",
            "ReceiptDate",
            "DocumentStatus",
            "RejectReason",
            "FileLeafRef"
          ],
          UpdateDocStatus: ["Title", "FileLeafRef", "DocumentStatus"]
        };
        static ListDef = {
          name: "AuditResponseDocs",
          title: "AuditResponseDocs",
          isLib: true
        };
      };
    }
  });

  // src/entities/audit_response_doc_ro.js
  var AuditResponseDocRO;
  var init_audit_response_doc_ro = __esm({
    "src/entities/audit_response_doc_ro.js"() {
      init_primitives();
      AuditResponseDocRO = class extends ConstrainedEntity {
        constructor(params) {
          super(params);
        }
        markApprovedForRO(request2, response) {
          this.ReqNum = request2.Title;
          this.ResID = response.Title.toString();
          this.FiscalYear = request2.FiscalYear.toString();
          this.ReqSubject = request2.ReqSubject.toString();
          this.RequestingOffice = request2.RequestingOffice.Value()?.UserGroup?.Title;
        }
        static Views = {
          All: [
            "ID",
            "Title",
            "ReqNum",
            "ResID",
            "FiscalYear",
            "RequestingOffice",
            "ReqSubject",
            "FileLeafRef",
            "FileRef"
          ],
          ApprovedForROUpdate: [
            "ReqNum",
            "ResID",
            "FiscalYear",
            "ReqSubject",
            "RequestingOffice"
          ]
        };
        static ListDef = {
          name: "AuditResponseDocsRO",
          title: "AuditResponseDocsRO"
        };
      };
    }
  });

  // src/entities/audit_ro_email_log.js
  var AuditROEmailLog;
  var init_audit_ro_email_log = __esm({
    "src/entities/audit_ro_email_log.js"() {
      init_primitives();
      AuditROEmailLog = class _AuditROEmailLog extends ConstrainedEntity {
        constructor(params) {
          super(params);
        }
        Responses = "";
        ResponseCount = 0;
        static Views = {
          All: [
            "ID",
            "Title",
            "RequestingOffice",
            "Responses",
            "ResponseCount",
            "SentEmail"
          ]
        };
        static ListDef = {
          name: "AuditROEmailLog",
          title: "AuditROEmailLog",
          fields: _AuditROEmailLog.Views.All
        };
      };
    }
  });

  // src/entities/config.js
  var AuditConfiguration;
  var init_config = __esm({
    "src/entities/config.js"() {
      init_primitives();
      AuditConfiguration = class extends ConstrainedEntity {
        constructor(params) {
          super(params);
        }
        key;
        value;
        FieldMap = {
          Title: {
            get: () => this.key,
            set: (val) => this.key = val
          },
          Value: {
            get: () => this.value,
            set: (val) => this.value = val
          }
        };
        static Views = {
          All: ["ID", "Title", "Value"]
        };
        static ListDef = {
          name: "Config",
          title: "Config"
        };
      };
    }
  });

  // src/entities/index.js
  var init_entities2 = __esm({
    "src/entities/index.js"() {
      init_audit_coversheet();
      init_audit_email();
      init_audit_organization();
      init_audit_request();
      init_audit_bulk_request();
      init_audit_request_internal();
      init_audit_response();
      init_audit_bulk_response();
      init_audit_response_doc();
      init_audit_response_doc_ro();
      init_audit_ro_email_log();
      init_config();
    }
  });

  // src/sal/orm.js
  function mapObjectToEntity(inputObject, targetEntity) {
    if (DEBUG)
      console.log(
        `ApplicationDBContext: ${targetEntity.constructor.name}: `,
        inputObject
      );
    if (!inputObject || !targetEntity)
      return;
    Object.keys(inputObject).forEach((key) => {
      mapValueToEntityProperty(key, inputObject[key], targetEntity);
    });
  }
  function mapValueToEntityProperty(propertyName, inputValue, targetEntity) {
    if (DEBUG)
      console.log(
        `ApplicationDBContext: ${targetEntity.constructor.name}.${propertyName} to ${inputValue}`
      );
    if (targetEntity.FieldMap && targetEntity.FieldMap[propertyName]) {
      mapObjectToViewField(inputValue, targetEntity.FieldMap[propertyName]);
      return;
    }
    if (targetEntity[propertyName] && typeof targetEntity[propertyName] == "function") {
      targetEntity[propertyName](inputValue);
      return;
    }
    targetEntity[propertyName] = inputValue;
    return;
  }
  function mapObjectToViewField(inVal, fieldMapping) {
    if (typeof fieldMapping == "function") {
      fieldMapping(inVal);
      return;
    }
    if (typeof fieldMapping != "object") {
      fieldMapping = inVal;
      return;
    }
    if (fieldMapping.set && typeof fieldMapping.set == "function") {
      fieldMapping.set(inVal);
      return;
    }
    if (fieldMapping.obs) {
      if (!inVal) {
        fieldMapping.obs(null);
        return;
      }
      const outVal = Array.isArray(inVal) ? inVal.map((item) => generateObject(item, fieldMapping)) : generateObject(inVal, fieldMapping);
      fieldMapping.obs(outVal);
      return;
    }
    fieldMapping = inVal;
  }
  function generateObject(inVal, fieldMap) {
    return fieldMap.factory ? fieldMap.factory(inVal) : inVal;
  }
  function mapEntityToObject(input, selectedFields = null) {
    const entity = {};
    const allWriteableFieldsSet = /* @__PURE__ */ new Set([]);
    if (this?.ListDef?.fields) {
      this.ListDef.fields.forEach((field) => allWriteableFieldsSet.add(field));
    }
    if (this?.AllDeclaredFields) {
      this.AllDeclaredFields.map((field) => allWriteableFieldsSet.add(field));
    }
    if (input.FieldMap) {
      Object.keys(input.FieldMap).forEach(
        (field) => allWriteableFieldsSet.add(field)
      );
    }
    const allWriteableFields = [...allWriteableFieldsSet];
    const fields = selectedFields ?? (input.FieldMap ? Object.keys(input.FieldMap) : null) ?? Object.keys(input);
    fields.filter((field) => allWriteableFields.includes(field)).map((field) => {
      if (input.FieldMap && input.FieldMap[field]) {
        const storedFieldKey = input.FieldMap[field].systemName ?? field;
        entity[storedFieldKey] = mapViewFieldToValue(input.FieldMap[field]);
        return;
      }
      entity[field] = input[field];
    });
    return entity;
  }
  function mapViewFieldToValue(fieldMap) {
    if (typeof fieldMap == "function") {
      return fieldMap();
    }
    if (fieldMap.get && typeof fieldMap.get == "function") {
      return fieldMap.get();
    }
    if (fieldMap.obs) {
      return fieldMap.obs();
    }
    return fieldMap;
  }
  var DEBUG, DbContext, EntitySet;
  var init_orm = __esm({
    "src/sal/orm.js"() {
      init_entities();
      init_infrastructure();
      DEBUG = false;
      DbContext = class {
        constructor() {
        }
        Pages = new EntitySet(Page);
        utilities = {
          copyFileAsync
        };
        virtualSets = /* @__PURE__ */ new Map();
        Set = (entityType) => {
          const key = entityType.ListDef.name;
          const set = Object.values(this).filter((val) => val.constructor.name == EntitySet.name).find((set2) => set2.ListDef?.name == key);
          if (set)
            return set;
          if (!this.virtualSets.has(key)) {
            const newSet = new EntitySet(entityType);
            this.virtualSets.set(key, newSet);
            return newSet;
          }
          return this.virtualSets.get(key);
        };
      };
      EntitySet = class {
        constructor(entityType) {
          if (!entityType.ListDef) {
            console.error("Missing entityType listdef for", entityType);
            return;
          }
          this.entityType = entityType;
          try {
            const allFieldsSet = /* @__PURE__ */ new Set();
            entityType.Views?.All?.map((field) => allFieldsSet.add(field));
            this.AllDeclaredFields = [...allFieldsSet];
          } catch (e) {
            console.warn("Could not instantiate", entityType), console.warn(e);
            this.AllDeclaredFields = entityType.Views?.All ?? [];
          }
          this.ListDef = entityType.ListDef;
          this.Views = entityType.Views;
          this.Title = entityType.ListDef.title;
          this.Name = entityType.ListDef.name;
          this.ListRef = new SPList(entityType.ListDef);
          this.entityConstructor = this.entityType.FindInStore || this.entityType.Create || this.entityType;
        }
        // Queries
        FindById = async (id2, fields = this.AllDeclaredFields) => {
          const result = await this.ListRef.getById(id2, fields);
          if (!result)
            return null;
          const newEntity = new this.entityType(result);
          mapObjectToEntity(result, newEntity);
          return newEntity;
        };
        // TODO: Feature - Queries should return options to read e.g. toList, first, toCursor
        /**
         * Takes an array of columns and filter values with an optional comparison operator
         * @param {[{column, op?, value}]} columnFilters
         * @param {*} param1
         * @param {*} param2
         * @param {*} fields
         * @param {*} includeFolders
         * @returns
         */
        FindByColumnValue = async (columnFilters, { orderByColumn, sortAsc }, { count = null, includePermissions = false, includeFolders = false }, fields = this.AllDeclaredFields) => {
          const returnCursor = count != null;
          count = count ?? 5e3;
          const results = await this.ListRef.findByColumnValueAsync(
            columnFilters,
            { orderByColumn, sortAsc },
            { count, includePermissions, includeFolders },
            fields
          );
          let cursor = {
            _next: results._next,
            results: results.results.map((item) => {
              const newEntity = new this.entityConstructor(item);
              mapObjectToEntity(item, newEntity);
              return newEntity;
            })
          };
          if (returnCursor) {
            return cursor;
          }
          const resultObj = {
            results: cursor.results
          };
          while (cursor._next) {
            cursor = await this.LoadNextPage(cursor);
            resultObj.results = resultObj.results.concat(cursor.results);
          }
          return resultObj;
        };
        LoadNextPage = async (cursor) => {
          const results = await this.ListRef.loadNextPage(cursor);
          return {
            _next: results._next,
            results: results.results.map((item) => {
              const newEntity = new this.entityType(item);
              mapObjectToEntity(item, newEntity);
              return newEntity;
            })
          };
        };
        /**
         * Return all items in list
         */
        ToList = async (refresh = false) => {
          const fields = this.Views.All;
          const results = await this.ListRef.getListItemsAsync({ fields });
          const allItems = results.map((item) => {
            let entityToLoad = new this.entityType(item);
            mapObjectToEntity(item, entityToLoad);
            return entityToLoad;
          });
          return allItems;
        };
        LoadEntity = async function(entity, refresh = false) {
          if (!entity.ID) {
            console.error("entity missing Id", entity);
            return false;
          }
          const result = await this.ListRef.getById(
            entity.ID,
            this.AllDeclaredFields
          );
          if (!result)
            return null;
          mapObjectToEntity(result, entity);
          return entity;
        };
        // Mutators
        AddEntity = async function(entity, folderPath) {
          const creationfunc = mapEntityToObject.bind(this);
          const writeableEntity = creationfunc(entity, this.AllDeclaredFields);
          if (DEBUG)
            console.log(writeableEntity);
          const newId = await this.ListRef.createListItemAsync(
            writeableEntity,
            folderPath
          );
          mapObjectToEntity({ ID: newId }, entity);
          return;
        };
        UpdateEntity = async function(entity, fields = null) {
          const writeableEntity = mapEntityToObject.bind(this)(entity, fields);
          writeableEntity.ID = typeof entity.ID == "function" ? entity.ID() : entity.ID;
          if (DEBUG)
            console.log(writeableEntity);
          return this.ListRef.updateListItemAsync(writeableEntity);
        };
        RemoveEntity = async function(entity) {
          if (!entity.ID)
            return false;
          await this.ListRef.deleteListItemAsync(entity.ID);
          return true;
        };
        RemoveEntityById = function(entityId) {
          return this.ListRef.deleteListItemAsync(entityId);
        };
        // Permissions
        GetItemPermissions = function(entity) {
          return this.ListRef.getItemPermissionsAsync(entity.ID);
        };
        SetItemPermissions = async function(entity, valuePairs, reset = false) {
          return this.ListRef.setItemPermissionsAsync(entity.ID, valuePairs, reset);
        };
        GetRootPermissions = function() {
          return this.ListRef.getListPermissions();
        };
        SetRootPermissions = async function(itemPermissions, reset) {
          await this.ListRef.setListPermissionsAsync(itemPermissions, reset);
        };
        // Folder Methods
        GetFolderUrl = function(relFolderPath = "") {
          return this.ListRef.getServerRelativeFolderPath(relFolderPath);
        };
        GetItemsByFolderPath = async function(folderPath, fields = this.AllDeclaredFields) {
          const results = await this.ListRef.getFolderContentsAsync(
            folderPath,
            fields
          );
          return results.map((result) => {
            const newEntity = new this.entityType(result);
            mapObjectToEntity(result, newEntity);
            return newEntity;
          });
        };
        UpsertFolderPath = async function(folderPath) {
          return this.ListRef.upsertFolderPathAsync(folderPath);
        };
        RemoveFolderByPath = async function(folderPath) {
          const itemResults = await this.FindByColumnValue(
            [{ column: "FileLeafRef", value: folderPath }],
            {},
            {},
            ["ID", "Title", "FileLeafRef"],
            true
          );
          const entities = itemResults.results ?? [];
          for (const entity of entities) {
            await this.RemoveEntityById(entity.ID);
          }
        };
        // Permissions
        SetFolderReadOnly = async function(relFolderPath) {
          return this.ListRef.setFolderReadonlyAsync(relFolderPath);
        };
        SetFolderPermissions = async function(folderPath, valuePairs, reset = true) {
          const salValuePairs = valuePairs.filter((vp) => vp[0] && vp[1]).map((vp) => [vp[0].getKey(), vp[1]]);
          return this.ListRef.setFolderPermissionsAsync(
            folderPath,
            salValuePairs,
            reset
          );
        };
        EnsureFolderPermissions = async function(relFolderPath, valuePairs) {
          const salValuePairs = valuePairs.filter((vp) => vp[0] && vp[1]).map((vp) => [vp[0].LoginName ?? vp[0].Title, vp[1]]);
          return this.ListRef.ensureFolderPermissionsAsync(
            relFolderPath,
            salValuePairs
          );
        };
        // Other Functions
        // Upload file directly from browser "File" object e.g. from input field
        UploadFileToFolderAndUpdateMetadata = async function(file, filename, folderPath, updates, progress) {
          const itemId = await this.ListRef.uploadFileToFolderAndUpdateMetadata(
            file,
            filename,
            folderPath,
            updates,
            progress
          );
          const item = await this.ListRef.getById(itemId, this.AllDeclaredFields);
          const newEntity = new this.entityConstructor(item);
          mapObjectToEntity(item, newEntity);
          return newEntity;
        };
        // Open file upload Modal
        UploadNewDocument = async function(folderPath, args) {
          return this.ListRef.uploadNewDocumentAsync(
            folderPath,
            "Attach a New Document",
            args
          );
        };
        CopyFolderContents = async function(sourceFolder, targetFolder) {
          return this.ListRef.copyFilesAsync(sourceFolder, targetFolder);
        };
        // Form Methods
        ShowForm = async function(name, title, args) {
          return new Promise(
            (resolve, reject2) => this.ListRef.showModal(name, title, args, resolve)
          );
        };
        CheckInDocument = async function(fileRef) {
          return new Promise(
            (resolve) => this.ListRef.showCheckinModal(fileRef, resolve)
          );
        };
        EnsureList = async function() {
        };
      };
    }
  });

  // src/sal/index.js
  var init_sal2 = __esm({
    "src/sal/index.js"() {
      init_orm();
    }
  });

  // src/infrastructure/application_db_context.js
  var application_db_context_exports = {};
  __export(application_db_context_exports, {
    ApplicationDbContext: () => ApplicationDbContext,
    appContext: () => appContext
  });
  var ApplicationDbContext, appContext;
  var init_application_db_context = __esm({
    "src/infrastructure/application_db_context.js"() {
      init_entities2();
      init_sal2();
      ApplicationDbContext = class extends DbContext {
        constructor() {
          super();
        }
        AuditBulkRequests = new EntitySet(AuditBulkRequest);
        AuditBulkResponses = new EntitySet(AuditBulkResponse);
        AuditConfigurations = new EntitySet(AuditConfiguration);
        AuditCoversheets = new EntitySet(AuditCoversheet);
        AuditEmails = new EntitySet(AuditEmail);
        AuditOrganizations = new EntitySet(AuditOrganization);
        AuditResponses = new EntitySet(AuditResponse);
        AuditResponseDocs = new EntitySet(AuditResponseDoc);
        AuditResponseDocsRO = new EntitySet(AuditResponseDocRO);
        AuditRequests = new EntitySet(AuditRequest);
        AuditRequestsInternals = new EntitySet(AuditRequestsInternal);
        AuditROEmailsLog = new EntitySet(AuditROEmailLog);
      };
      appContext = new ApplicationDbContext();
    }
  });

  // src/pages/ia_db/IA_DB_Template.js
  var html = String.raw;
  var _a;
  var iaDbTemplate = html(_a || (_a = __template([`
  <link
    href="/sites/CGFS/Style Library/apps/audit/lib/quill@2.0.0-rc.2/dist/quill.snow.css"
    rel="stylesheet"
  />

  <link
    rel="stylesheet"
    href="/sites/CGFS/Style Library/apps/audit/lib/fontawesome-6.5.1/css/fontawesome.min.css"
  />
  <link
    rel="stylesheet"
    href="/sites/CGFS/Style Library/apps/audit/lib/fontawesome-6.5.1/css/solid.min.css"
  />
  <link
    rel="stylesheet"
    type="text/css"
    href="/sites/CGFS/Style Library/apps/audit/lib/jquery-ui-1.13.2/jquery-ui.theme.min.css"
  />
  <style>
    .o365cs-nav-leftAlign {
      display: revert !important;
    }

    #suiteBarDelta {
      display: revert !important;
    }

    #s4-ribbonrow {
      display: revert !important;
    }
  </style>
  <iframe id="CsvExpFrame" style="display: none"></iframe>

  <div id="divRequestID" style="display: none">
    not in use anymore. do not delete, this is used by the request edit list
    form
  </div>
  <div class="audit">
    <!-- ko foreach: currentDialogs -->
    <div
      data-bind="component: { name: 'modal-dialog-component', params: $data }"
    ></div>
    <!-- /ko -->
    <div
      id="divCounter"
      style="display: none"
      title="used to auto refresh the page"
    >
      1200
    </div>

    <div id="divIA" class="audit-body" style="display: none">
      <div
        class="quick-info-container"
        data-bind="css: {active: showQuickInfo}"
      >
        <div class="quick-info-toolbar">
          <button
            type="button"
            class="btn btn-toolbar"
            data-bind="toggles: showQuickInfo,
          css: {'warn': alertQuickInfo},
          attr: {title: showQuickInfo() ? 'Hide Alerts' : 'Show Pending Alerts'}"
          >
            <i class="fa-solid fa-xl fa-triangle-exclamation"></i>
            <i
              class="fa-solid"
              data-bind="class: showQuickInfo() ? 'fa-chevron-left' : 'fa-chevron-right'"
            ></i>
          </button>
        </div>
        <div class="quick-info">
          <div id="divLoading">Please Wait... Loading</div>
          <div
            id="divRequestsThatNeedToClose"
            class="status-set-container"
            data-bind="visible: arrRequestsThatNeedClosing().length > 0"
          >
            <fieldset>
              <legend>
                <span class="ui-icon ui-icon-alert"></span
                ><span
                  data-bind="text: arrRequestsThatNeedClosing().length"
                ></span>
                Requests Need Closing
              </legend>
              <table id="tblRequestsThatNeedToClose" class="tablesorter report">
                <thead>
                  <tr valign="top">
                    <th class="sorter-false" nowrap="nowrap">Request ID</th>
                    <th class="sorter-false" nowrap="nowrap">
                      Last Response Closed
                    </th>
                  </tr>
                </thead>
                <tbody data-bind="foreach: arrRequestsThatNeedClosing">
                  <tr>
                    <td>
                      <button
                        type="button"
                        class="btn btn-link primary fw-bold"
                        title="Click here to Go to this Request"
                        data-bind="click: $root.ClickGoToRequest, text: number"
                      ></button>
                    </td>
                    <td>
                      <b><span data-bind="text: lastResponseId"></span></b
                      >&nbsp;on&nbsp;<b
                        ><span data-bind="text: sLastClosedDate"></span></b
                      >&nbsp;by&nbsp;<b
                        ><span data-bind="text: lastClosedBy"></span
                      ></b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </fieldset>
          </div>
          <div
            id="divRequestsWithNoEmailSent"
            class="status-set-container"
            title="Click here to View"
            data-bind="visible: arrRequestsWithNoEmailSent().length > 0"
          >
            <details>
              <summary>
                <i class="fa-solid fa-triangle-exclamation"></i>
                <div>
                  <span
                    data-bind="text: arrRequestsWithNoEmailSent().length"
                  ></span>
                  Requests need Emails sent out
                </div>
              </summary>
              <div id="divRequestsWithNoEmailSentItems">
                <ul data-bind="foreach: arrRequestsWithNoEmailSent">
                  <li>
                    <a
                      href="javascript:void(0);"
                      title="Go to Request Details"
                      data-bind="click: $root.ClickGoToRequest"
                      ><span data-bind="text: title"></span
                    ></a>
                  </li>
                </ul>
              </div>
            </details>
          </div>
          <div
            id="divResponsesSubmitted"
            class="status-set-container"
            title="Click here to View"
            data-bind="visible: arrResponsesSubmittedByAO().length > 0"
          >
            <details>
              <summary class="warning">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <div>
                  <span
                    data-bind="text: arrResponsesSubmittedByAO().length"
                  ></span>
                  Responses have been Submitted by the Action Offices
                </div>
              </summary>
              <div id="divResponsesSubmittedItems">
                <ul data-bind="foreach: arrResponsesSubmittedByAO">
                  <li>
                    <a
                      href="javascript:void(0);"
                      title="Go to Request Details"
                      data-bind="click: $root.ClickGoToRequest"
                      ><span data-bind="text: title"></span
                    ></a>
                  </li>
                </ul>
              </div>
            </details>
          </div>
          <div
            id="divRequestsAlmostInternalDue"
            class="status-set-container"
            title="Click here to View"
            data-bind="visible: arrRequestsInternalAlmostDue().length > 0"
          >
            <details>
              <summary class="warning">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <div>
                  <span
                    data-bind="text: arrRequestsInternalAlmostDue().length"
                  ></span>
                  Requests are reaching their Internal Due Date
                </div>
              </summary>
              <div id="divRequestsAlmostInternalDueItems">
                <ul data-bind="foreach: arrRequestsInternalAlmostDue">
                  <li>
                    <a
                      href="javascript:void(0);"
                      title="Go to Request Details"
                      data-bind="click: $root.ClickGoToRequest"
                      ><span
                        data-bind="text: title + ' (' + internalDueDate + ')'"
                      ></span
                    ></a>
                  </li>
                </ul>
              </div>
            </details>
          </div>
          <div
            id="divRequestsPastInternalDue"
            class="status-set-container"
            title="Click here to View"
            data-bind="visible: arrRequestsInternalPastDue().length > 0"
          >
            <details>
              <summary class="warning">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <div>
                  <span
                    data-bind="text: arrRequestsInternalPastDue().length"
                  ></span>
                  Requests have PASSED their Internal Due Date
                </div>
              </summary>
              <div id="divRequestsPastInternalDueItems">
                <ul data-bind="foreach: arrRequestsInternalPastDue">
                  <li>
                    <a
                      href="javascript:void(0);"
                      title="Go to Request Details"
                      data-bind="click: $root.ClickGoToRequest"
                      ><span
                        data-bind="text: title + ' (' + internalDueDate + ')'"
                      ></span
                    ></a>
                  </li>
                </ul>
              </div>
            </details>
          </div>
          <div
            id="divRequestsAlmostDue"
            class="status-set-container"
            title="Click here to View"
            data-bind="visible: arrRequestsAlmostDue().length > 0"
          >
            <details>
              <summary class="warning">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <div>
                  <span data-bind="text: arrRequestsAlmostDue().length"></span>
                  Requests are reaching their Due Date
                </div>
              </summary>
              <div id="divRequestsAlmostDueItems">
                <ul data-bind="foreach: arrRequestsAlmostDue">
                  <li>
                    <a
                      href="javascript:void(0);"
                      title="Go to Request Details"
                      data-bind="click: $root.ClickGoToRequest"
                      ><span
                        data-bind="text: title + ' (' + dueDate + ')'"
                      ></span
                    ></a>
                  </li>
                </ul>
              </div>
            </details>
          </div>
          <div
            id="divRequestsPastDue"
            class="status-set-container"
            title="Click here to View"
            data-bind="visible: arrRequestsPastDue().length > 0"
          >
            <details>
              <summary class="warning">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <div>
                  <span data-bind="text: arrRequestsPastDue().length"></span>
                  Requests have PASSED their Due Date
                </div>
              </summary>
              <div id="divRequestsPastDueItems">
                <ul data-bind="foreach: arrRequestsPastDue">
                  <li>
                    <a
                      href="javascript:void(0);"
                      title="Go to Request Details"
                      data-bind="click: $root.ClickGoToRequest"
                      ><span
                        data-bind="text: title + ' (' + dueDate + ')'"
                      ></span
                    ></a>
                  </li>
                </ul>
              </div>
            </details>
          </div>
          <div
            id="divCheckedOutResponseDocs"
            class="status-set-container"
            title="Click here to View"
            data-bind="visible: arrResponseDocsCheckedOut().length > 0"
          >
            <details>
              <summary class="warning">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <div>
                  <span
                    data-bind="text: arrResponseDocsCheckedOut().length"
                  ></span>
                  Response Documents are Checked Out
                </div>
              </summary>
              <div id="divCheckedOutResponseDocsItems">
                <ul data-bind="foreach: arrResponseDocsCheckedOut">
                  <li>
                    <a
                      href="javascript:void(0);"
                      title="Go to Request Details"
                      data-bind="click: $root.ClickGoToRequest"
                      ><span data-bind="text: title"></span
                    ></a>
                  </li>
                </ul>
              </div>
            </details>
          </div>
          <div
            id="divResponsesReadyToClose"
            class="status-set-container"
            title="Click here to View"
            data-bind="visible: arrResponsesReadyToClose().length > 0"
          >
            <details>
              <summary class="warning">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <div>
                  <span
                    data-bind="text: arrResponsesReadyToClose().length"
                  ></span>
                  Responses are Ready to Close
                </div>
              </summary>
              <div id="divResponsesReadyToCloseItems">
                <ul data-bind="foreach: arrResponsesReadyToClose">
                  <li>
                    <a
                      href="javascript:void(0);"
                      title="Go to Request Details"
                      data-bind="click: $root.ClickGoToRequest"
                      ><span data-bind="text: title"></span
                    ></a>
                  </li>
                </ul>
              </div>
            </details>
          </div>
          <div
            id="divResponsesWithUnsubmittedResponsDocs"
            class="status-set-container"
            data-bind="visible: arrResponsesWithUnsubmittedResponseDocs().length > 0"
          >
            <details>
              <summary class="warning btn btn-link">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <div>
                  <span
                    data-bind="text: arrResponsesWithUnsubmittedResponseDocs().length"
                  ></span>
                  Responses have Unsubmitted Response Documents
                </div>
              </summary>
              <div id="divResponsesWithUnsubmittedResponseDocsItems">
                <table class="tablesorter">
                  <thead>
                    <tr>
                      <!-- <th>Response ID</th> -->
                      <th>Title</th>
                      <th>Modified</th>
                    </tr>
                  </thead>
                  <tbody
                    data-bind="foreach: arrResponsesWithUnsubmittedResponseDocs"
                  >
                    <tr>
                      <td colspan="2">
                        <span
                          title="Go to Response Details"
                          class="btn btn-link fw-semibold primary"
                          data-bind="text: title + ' (' + unsubmittedDocs.length + ' documents)', 
                        click: $root.ClickGoToRequest"
                        ></span>
                      </td>
                    </tr>
                    <!-- ko foreach: unsubmittedDocs -->
                    <tr>
                      <td>
                        <a
                          title="Click to Download"
                          data-bind="text: fileName, downloadLink: '../_layouts/download.aspx?SourceUrl=:folder/:fileName'"
                        ></a>
                      </td>
                      <td data-bind="text: modifiedDate"></td>
                    </tr>
                    <!-- /ko -->
                  </tbody>
                </table>
              </div>
            </details>
          </div>
          <div
            id="divRequestsWithNoResponse"
            class="status-set-container"
            title="Click here to View"
            data-bind="visible: arrRequestsWithNoResponses().length > 0"
          >
            <details>
              <summary class="warning btn btn-link">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <div>
                  <span
                    data-bind="text: arrRequestsWithNoResponses().length"
                  ></span>
                  Requests have 0 Responses
                </div>
              </summary>
              <div id="divRequestsWithNoResponseItems" class="">
                <ul data-bind="foreach: arrRequestsWithNoResponses">
                  <li>
                    <a
                      href="javascript:void(0);"
                      title="Go to Request Details"
                      data-bind="click: $root.ClickGoToRequest"
                      ><span data-bind="text: title"></span
                    ></a>
                  </li>
                </ul>
              </div>
            </details>
          </div>
        </div>
      </div>
      <div class="reports-container">
        <div class="quick-links">
          <div>
            <a
              title="Refresh this page"
              href="javascript:void(0)"
              data-bind="click: refresh"
              ><span class="ui-icon ui-icon-refresh"></span>Refresh</a
            >
          </div>
          <div>
            <a
              title="View User Manuals"
              href="javascript:void(0)"
              onclick="Audit.Common.Utilities.ViewUserManuals()"
              ><span class="ui-icon ui-icon-help"></span>User Manuals</a
            >
          </div>
          <div>
            <a
              title="View Response Documents Uploaded by Action Offices Today but not yet Submitted"
              href="javascript:void(0)"
              onclick="Audit.IAReport.Report.ViewResponseDocsToday()"
              ><span class="ui-icon ui-icon-search"></span>View Today's
              Un-submitted Response Documents</a
            >
          </div>
          <div>
            <a
              title="View Response Documents Returned to GFS"
              href="javascript:void(0)"
              onclick="Audit.IAReport.Report.ViewReturnedDocs()"
              ><span class="ui-icon ui-icon-search"></span>View Response
              Documents Returned to GFS</a
            >
          </div>
          <div>
            <a
              title="View Request, Response and Site Permissions"
              href="javascript:void(0)"
              onclick="Audit.IAReport.Report.ViewPermissions()"
              ><span class="ui-icon ui-icon-locked"></span>View Permissions</a
            >
          </div>
          <div>
            <a
              title="View Late Requests"
              href="javascript:void(0)"
              onclick="Audit.IAReport.Report.ViewLateRequests()"
              ><span class="ui-icon ui-icon-clock"></span>View Late Requests</a
            >
          </div>
          <div>
            <a
              id="linkSubmitBulkReq"
              href="javascript:void(0)"
              data-bind="click: ClickBulkAddRequest"
              ><span class="ui-icon ui-icon-plus"></span>Bulk Add Request</a
            >
          </div>
          <div>
            <a
              id="linkSubmitNewReq"
              href="javascript:void(0)"
              data-bind="click: ClickNewRequest"
              ><span class="ui-icon ui-icon-plus"></span>Create a New Request</a
            >
          </div>
          <div style="display: none">
            <a
              id="linkResetPerms"
              href="javascript:void(0)"
              data-bind="click: ClickResetPerms"
              ><span class="ui-icon ui-icon-locked"></span>Reset App
              Permissions</a
            >
          </div>
        </div>
        <div id="tabs" style="margin-top: 20px">
          <!-- ko using: tabs -->
          <ul class="ui-tabs-nav" data-bind="foreach: tabOpts">
            <li
              data-bind="text: linkText, 
            click: $parent.clickTabLink, 
            css: {active: $parent.isSelected($data)}"
            ></li>
          </ul>
          <!-- ko foreach: tabOpts -->
          <div
            data-bind="template: {
              name: template.id,
              data: template.data
            },
            visible: $parent.isSelected($data)"
          ></div>
          <!-- /ko -->
          <!-- /ko -->
        </div>
      </div>
    </div>
    <div
      id="divRanBulkUpdate"
      title="Do not delete Used for checking if bulk update ran"
      style="display: none"
    ></div>
  </div>

  <script id="requestStatusReportTemplate" type="text/html">
    <div id="divStatusReportRequests">
      <table
        is="data-table"
        id="tblStatusReportRequests"
        data-title="Request Status Report"
        data-file-prefix="RequestStatusReport_"
        class="tablesorter report"
      >
        <thead>
          <tr
            valign="top"
            class="rowFilters"
            data-bind="visible: arrRequests().length > 0"
          >
            <th
              class="sorter-false filter"
              data-filter="search"
              data-filter-prop="ID"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false"
              data-filter="search"
              data-filter-prop="subject"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false"
              data-filter="multiselect"
              data-filter-prop="requestingOffice"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false filter"
              data-filter="multiselect"
              data-filter-prop="sensitivity"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false filter"
              data-filter="multiselect"
              data-filter-value="Open"
              data-filter-prop="status"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false"
              data-filter="daterange"
              data-filter-prop="internalDueDate"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false filter"
              data-filter="daterange"
              data-filter-prop="dueDate"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false filter"
              data-filter="multiselect"
              data-filter-prop="sample"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false filter"
              data-filter="multiselect"
              data-filter-prop="sentEmail"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false filter"
              data-filter="search"
              data-filter-prop="(r) => r.actionOffices.map(ao => ao.ao)"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false"
              data-filter="multiselect"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false"
              data-filter="multiselect"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false"
              data-filter="multiselect"
              nowrap="nowrap"
            ></th>
          </tr>
          <tr valign="top">
            <th class="sorter-true" nowrap="nowrap">Request #</th>
            <th class="sorter-true" nowrap="nowrap">Subject</th>
            <th class="sorter-true" nowrap="nowrap">Requesting Office</th>
            <th class="sorter-true" nowrap="nowrap">Sensitivity</th>
            <th class="sorter-true" nowrap="nowrap">Status</th>
            <th class="sorter-true desc" nowrap="nowrap">Internal Due Date</th>
            <th class="sorter-true" nowrap="nowrap">Due Date</th>
            <th class="sorter-true" nowrap="nowrap">Sample?</th>
            <th class="sorter-true" nowrap="nowrap">Sent Email?</th>
            <th class="sorter-false" nowrap="nowrap">Action Office(s)</th>
            <th class="sorter-true" nowrap="nowrap"># of Responses</th>
            <th class="sorter-true" nowrap="nowrap"># of Open Responses</th>
            <th class="sorter-true" nowrap="nowrap"># of Documents</th>
          </tr>
        </thead>
        <tbody id="fbody1" data-bind="foreach: arrRequests">
          <tr class="sr1-request-item">
            <td class="sr1-request-requestNum">
              <a
                href="javascript:void(0);"
                title="Go to Request Details"
                data-bind="text: reqNumber,
                  click: () => Audit.IAReport.Report.GoToRequest(reqNumber, null)"
              ></a>
            </td>
            <td class="sr1-request-subject" data-bind="text: subject"></td>
            <td
              class="sr1-request-requestingOffice"
              data-bind="text: requestingOffice"
            ></td>
            <td
              class="sr1-request-sensitivity"
              data-bind="text: sensitivity"
            ></td>
            <td class="sr1-request-status" data-bind="text: status"></td>
            <td
              class="sr1-request-internalDueDate"
              data-bind="text: internalDueDate,
                class: internalDueDateStyle"
            ></td>
            <td
              class="sr1-request-dueDate"
              data-bind="text: dueDate,
                class: dueDateStyle"
            ></td>
            <td class="sr1-request-sample">
              <span
                class="ui-icon"
                data-bind="class: sample ? 'ui-icon-check' : 'ui-icon-close',
                text: sample ?? 'false'"
              ></span>
            </td>
            <td class="sr1-request-sentEmail">
              <span
                class="ui-icon"
                data-bind="class: sentEmail ? 'ui-icon-check' : 'ui-icon-close',
                text: sentEmail ?? 'false'"
              ></span>
            </td>
            <td class="sr1-request-actionOffice">
              <div
                style="cursor:pointer; white-space:nowrap"
                title="Click to view"
              >
                <span class="actionOfficeContainer">
                  <span class="ui-icon ui-icon-search"></span
                  ><a
                    href="javascript:void(0)"
                    data-bind="click: $parent.clickExpandActionOffices"
                    >View Action Offices</a
                  >
                  <ul class="sr1-request-actionOffice-items collapsed">
                    <!-- ko foreach: actionOffices -->
                    <li class="sr1-request-actionOffice-item">
                      <span data-bind="text: ao"></span>;
                    </li>
                    <!-- /ko -->
                  </ul>
                </span>
              </div>
            </td>
            <td
              class="sr1-request-responseCount"
              data-bind="text: responseCount"
            ></td>
            <td
              class="sr1-request-responsesOpenCount"
              data-bind="text: responsesOpenCount"
            ></td>
            <td
              class="sr1-request-responseDocCount"
              data-bind="text: responseDocCount"
            ></td>
          </tr>
        </tbody>
      </table>
    </div>
  <\/script>

  <script id="responseStatusReportTemplate" type="text/html">
    <div id="divStatusReportRespones">
      <table
        id="tblStatusReportResponses"
        is="data-table"
        data-title="Response Status Report"
        data-file-prefix="ResponseStatusReport_"
        class="tablesorter report"
        data-bind="visible: arrResponses().length > 0"
      >
        <thead>
          <tr
            valign="top"
            class="rowFilters"
            data-bind="visible: arrResponses().length > 0"
          >
            <th
              class="sorter-false"
              data-filter="multiselect"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false"
              data-filter="multiselect"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false"
              data-filter="multiselect"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false"
              data-filter="daterange"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false"
              data-filter="multiselect"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false"
              data-filter="multiselect"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false"
              data-filter="multiselect"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false"
              data-filter="daterange"
              nowrap="nowrap"
            ></th>
          </tr>
          <tr valign="top">
            <th class="sorter-true asc" nowrap="nowrap">Request #</th>
            <th class="sorter-true" nowrap="nowrap">Sample #</th>
            <th class="sorter-true" nowrap="nowrap">Response Name</th>
            <th class="sorter-true" nowrap="nowrap">Internal Due Date</th>
            <th class="sorter-true" nowrap="nowrap">Status</th>
            <th class="sorter-true" nowrap="nowrap">Action Office</th>
            <th class="sorter-true" nowrap="nowrap"># of Documents</th>
            <th class="sorter-true" nowrap="nowrap">Modified</th>
          </tr>
        </thead>
        <tbody id="fbody2" data-bind="foreach: arrResponses">
          <tr class="sr2-response-item">
            <td class="sr2-response-requestNum">
              <a
                href="javascript:void(0);"
                title="Go to Request Details"
                data-bind="click: () => Audit.IAReport.Report.GoToRequest(reqNumber, title),
          text: reqNumber"
              ></a>
            </td>
            <td class="sr2-response-sample" data-bind="text: sample"></td>
            <td class="sr2-response-title" data-bind="text: title"></td>
            <td
              class="sr2-response-internalDueDate"
              data-bind="text: internalDueDate"
            ></td>
            <td class="sr2-response-status" data-bind="text: status"></td>
            <td class="sr2-response-ao" data-bind="text: ao"></td>
            <td class="sr2-response-docCount" data-bind="text: docCount"></td>
            <td class="sr2-response-modified" data-bind="text: modified"></td>
          </tr>
        </tbody>
        <tfoot class="footer"></tfoot>
      </table>
    </div>
  <\/script>

  <script id="requestDetailTemplate" type="text/html">
    <div class="quick-links secondary">
      <span>Request: </span
      ><select
        id="ddlReqNum"
        title="Select a Request Number"
        data-bind="options: $root.ddOptionsRequestInfoTabRequestName, value: filterRequestInfoTabRequestName, optionsCaption: '-Select-'"
      ></select>
    </div>
    <div
      data-bind="component: {name: requestDetailViewComponent.componentName, params: requestDetailViewComponent}"
    ></div>
  <\/script>

  <script id="requestTemplate" type="text/html"><\/script>

  <!-- New Request Detail tab, uses the  -->
  <script id="newRequestTemplate" type="text/html">
    <div data-bind="component: {name: componentName, params: params}"></div>
  <\/script>

  <div id="divTest"></div>
`])));

  // src/common/utilities.js
  window.Audit = window.Audit || {};
  Audit.Common = Audit.Common || {};
  function InitReport() {
    Audit.Common.Utilities = new Audit.Common.NewUtilities();
    Audit.Common.Init();
  }
  Audit.Common.Init = function() {
  };
  Audit.Common.NewUtilities = function() {
    var m_siteUrl = _spPageContextInfo.webServerRelativeUrl;
    var m_listTitleRequests = "AuditRequests";
    var m_listNameRequests = "AuditRequests";
    var m_listTitleRequestsInternal = "AuditRequestsInternal";
    var m_listNameRequestsInternal = "AuditRequestsInternal";
    var m_listTitleResponses = "AuditResponses";
    var m_listNameResponses = "AuditResponses";
    var m_libTitleRequestDocs = "AuditRequestDocs";
    var m_libNameRequestDocs = "AuditRequestDocs";
    var m_libTitleCoverSheet = "AuditCoverSheets";
    var m_libNameCoverSheet = "AuditCoverSheets";
    var m_libTitleResponseDocs = "AuditResponseDocs";
    var m_libNameResponseDocs = "AuditResponseDocs";
    var m_libTitleResponseDocsEA = "AuditResponseDocsEA";
    var m_libNameResponseDocsEA = "AuditResponseDocsEA";
    var m_listTitleActionOffices = "AuditOrganizations";
    var m_listNameActionOffices = "AuditOrganizations";
    var m_listTitleEmailHistory = "AuditEmails";
    var m_listNameEmailHistory = "AuditEmails";
    var m_listTitleBulkResponses = "AuditBulkResponses";
    var m_listNameBulkResponses = "AuditBulkResponses";
    var m_listTitleBulkPermissions = "AuditBulkPermissions";
    var m_listNameBulkPermissions = "AuditBulkPermissions";
    var m_groupNameSpecialPermName1 = "CGFS Special Access1";
    var m_groupNameSpecialPermName2 = "CGFS Special Access2";
    var m_groupNameQA = "Quality Assurance";
    var m_groupNameEA = "External Auditors";
    var m_libResponseDocsLibraryGUID2 = null;
    var m_arrSiteGroups = null;
    var m_arrAOs = null;
    function m_fnRefresh2(hard = false) {
      if (hard) {
        location.href = location.pathname;
        return;
      }
      var curPath = location.pathname;
      if ($("#tabs").html() != null && $("#tabs").html() != "") {
        var tabIndex = 0;
        try {
          tabIndex = $("#tabs").tabs("option", "active");
        } catch (ex) {
        }
        curPath += "?Tab=" + tabIndex;
        if (tabIndex == 0 && $("#ddlResponseName").val() != "") {
          curPath += "&ResNum=" + $("#ddlResponseName").val();
        } else if (tabIndex == 1) {
          var responseNumOpen = $("#ddlResponsesOpen").val();
          var responseNumProcessed = $("#ddlResponsesProcessed").val();
          if (responseNumOpen != null && responseNumOpen != "")
            curPath += "&ResNum=" + responseNumOpen;
          else if (responseNumProcessed != null && responseNumProcessed != "")
            curPath += "&ResNum=" + responseNumProcessed;
        }
        location.href = curPath;
      } else {
        location.reload();
      }
    }
    function m_fnOnLoadDisplayTimeStamp() {
      var curDate = /* @__PURE__ */ new Date();
      $("#divLoading").text("Loaded at " + curDate.format("MM/dd/yyyy hh:mm tt"));
    }
    function m_fnOnLoadDisplayTabAndResponse() {
      var paramTabIndex = GetUrlKeyValue("Tab");
      if (paramTabIndex != null && paramTabIndex != "") {
        $("#tabs").tabs("option", "active", paramTabIndex);
      }
      var bFiltered = false;
      var paramResponseNum = GetUrlKeyValue("ResNum");
      if (paramResponseNum != null && paramResponseNum != "") {
        if (paramTabIndex == 0) {
          if ($("#ddlResponseName option[value='" + paramResponseNum + "']").length > 0) {
            $("#ddlResponseName").val(paramResponseNum).change();
            bFiltered = true;
          }
        } else {
          if ($("#ddlResponsesOpen option[value='" + paramResponseNum + "']").length > 0) {
            $("#ddlResponsesOpen").val(paramResponseNum).change();
          } else if ($("#ddlResponsesProcessed option[value='" + paramResponseNum + "']").length > 0) {
            $("#ddlResponsesProcessed").val(paramResponseNum).change();
          }
        }
      }
      if (!bFiltered) {
        $(".sr-response-item").show();
      }
    }
    function m_fnOnLoadFilterResponses(responseStatus1, responseStatus2) {
      var count = 0;
      var cntOpen = 0;
      var cntReOpened = 0;
      var resStatus1 = 0;
      var resStatus2 = 0;
      var eacher = $(".sr-response-item");
      eacher.each(function() {
        var reqStatus = $.trim($(this).find(".sr-response-requestStatus").text());
        var resStatus = $.trim($(this).find(".sr-response-status").text());
        if ((resStatus == responseStatus1 || resStatus == responseStatus2) && (reqStatus == "Open" || reqStatus == "ReOpened")) {
          $(this).addClass("highlighted");
          count++;
          if (resStatus == responseStatus1)
            resStatus1++;
          else if (resStatus == responseStatus2)
            resStatus2++;
          if (reqStatus == "Open")
            cntOpen++;
          else if (reqStatus == "ReOpened")
            cntReOpened++;
        }
      });
      if (count > 0) {
        $("#lblStatusReportResponsesMsg").html(
          "<span class='ui-icon ui-icon-alert'></span>There are " + count + " Responses pending your review"
        );
        if (resStatus1 > 0 && resStatus2 == 0)
          $("#ddlResponseStatus").val(responseStatus1).change();
        else if (resStatus2 > 0 && resStatus1 == 0)
          $("#ddlResponseStatus").val(responseStatus2).change();
      } else
        $("#lblStatusReportResponsesMsg").html(
          "<span class='ui-icon ui-icon-circle-check'></span>There are 0 Responses pending your review"
        );
    }
    function m_fnLoadSiteGroups(itemColl) {
      m_arrSiteGroups = new Array();
      var listItemEnumerator = itemColl.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        var id2 = oListItem.get_id();
        var loginName = oListItem.get_loginName();
        var title = oListItem.get_title();
        var groupObject = new Object();
        groupObject["ID"] = id2;
        groupObject["loginName"] = loginName;
        groupObject["title"] = title;
        groupObject["group"] = oListItem;
        m_arrSiteGroups.push(groupObject);
      }
    }
    function m_fnGetSPSiteGroup(groupName) {
      var userGroup = null;
      if (m_arrSiteGroups != null) {
        for (var x = 0; x < m_arrSiteGroups.length; x++) {
          if (m_arrSiteGroups[x].title == groupName) {
            userGroup = m_arrSiteGroups[x].group;
            break;
          }
        }
      }
      return userGroup;
    }
    function m_fnLoadActionOffices(itemColl) {
      m_arrAOs = new Array();
      var listItemEnumerator = itemColl.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        var id2 = oListItem.get_item("ID");
        var title = oListItem.get_item("Title");
        var userGroup = oListItem.get_item("UserGroup");
        if (userGroup != null) {
          userGroup = userGroup.get_lookupValue();
        } else
          userGroup = "";
        var aoObject = new Object();
        aoObject["ID"] = id2;
        aoObject["title"] = title;
        aoObject["userGroup"] = userGroup;
        m_arrAOs.push(aoObject);
      }
    }
    function m_fnGetAOSPGroupName(groupName) {
      var userGroup = null;
      if (m_arrAOs != null) {
        for (var x = 0; x < m_arrAOs.length; x++) {
          var oGroup2 = m_arrAOs[x];
          if (oGroup2.title == groupName) {
            userGroup = oGroup2.userGroup;
            break;
          }
        }
      }
      return userGroup;
    }
    function m_fnCheckSPItemHasGroupPermission(item, groupName, permissionLevel) {
      if (item == null || groupName == "" || groupName == null || permissionLevel == null)
        return false;
      var match = false;
      var roleAssignments = item.get_roleAssignments();
      if (roleAssignments == null) {
        alert("Error retrieving role assignments");
        return false;
      }
      var rolesEnumerator = roleAssignments.getEnumerator();
      while (rolesEnumerator.moveNext()) {
        var role = rolesEnumerator.get_current();
        if (role != null) {
          var roleMember = role.get_member();
          if (roleMember.isPropertyAvailable("Title")) {
            var memberTitleName = roleMember.get_title();
            var roleDefs = role.get_roleDefinitionBindings();
            if (roleDefs != null) {
              var roleDefsEnumerator = roleDefs.getEnumerator();
              while (roleDefsEnumerator.moveNext()) {
                var rd = roleDefsEnumerator.get_current();
                var rdName = rd.get_name();
                if (memberTitleName == groupName && rd.get_basePermissions().has(permissionLevel)) {
                  match = true;
                  break;
                }
              }
            }
          }
        }
      }
      return match;
    }
    function m_fnGoToResponse(responseTitle, isIA) {
      if (!isIA) {
        var bFound = false;
        $("#ddlResponsesOpen > option").each(function() {
          if ($(this).text() == responseTitle) {
            bFound = true;
            notifyId = SP.UI.Notify.addNotification(
              "Displaying Response (" + responseTitle + ")",
              false
            );
            $("#ddlResponsesOpen").val(responseTitle).change();
            return false;
          }
        });
        if (!bFound) {
          $("#ddlResponsesProcessed > option").each(function() {
            if ($(this).text() == responseTitle) {
              bFound = true;
              notifyId = SP.UI.Notify.addNotification(
                "Displaying Response (" + responseTitle + ")",
                false
              );
              $("#ddlResponsesProcessed").val(responseTitle).change();
              return false;
            }
          });
        }
        $("#tabs").tabs({ active: 1 });
      }
    }
    function m_fnGetResponseDocStyleTag2(documentStatus) {
      var styleTag = {};
      if (documentStatus == "Archived")
        styleTag = { "background-color": "Gainsboro" };
      else if (documentStatus == "Approved")
        styleTag = { "background-color": "PaleGreen" };
      else if (documentStatus == "Rejected")
        styleTag = { "background-color": "LightSalmon" };
      else if (documentStatus == "Sent to QA")
        styleTag = { "background-color": "LightCyan" };
      else if (documentStatus == "Submitted")
        styleTag = { "background-color": "LemonChiffon" };
      else if (documentStatus == "Marked for Deletion")
        styleTag = {
          "background-color": "Gainsboro",
          "font-style": "italic"
        };
      return styleTag;
    }
    function m_fnGetResponseDocStyleTag(documentStatus) {
      var styleTag = "";
      if (documentStatus == "Archived")
        styleTag = " style='background-color:Gainsboro;' ";
      else if (documentStatus == "Approved")
        styleTag = " style='background-color:PaleGreen;' ";
      else if (documentStatus == "Rejected")
        styleTag = " style='background-color:LightSalmon;' ";
      else if (documentStatus == "Sent to QA")
        styleTag = " style='background-color:LightCyan;' ";
      else if (documentStatus == "Submitted")
        styleTag = " style='background-color:LemonChiffon;' ";
      else if (documentStatus == "Marked for Deletion")
        styleTag = " style='background-color:Gainsboro; font-style:italic' title='Marked for Deletion by the Action Office' ";
      return styleTag;
    }
    function m_fnCheckIfEmailFolderExists(items, requestNumber) {
      var bFolderExists = false;
      var listItemEnumerator = items.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var folderItem = listItemEnumerator.get_current();
        var itemName = folderItem.get_displayName();
        if (itemName == requestNumber) {
          var bFolderExists = true;
          break;
        }
      }
      return bFolderExists;
    }
    var m_cntAddToEmailFolder = 0;
    var m_cntAddedToEmailFolder = 0;
    function m_fnCreateEmailFolder(list, requestNumber, requestItem, OnComplete) {
      m_cntAddToEmailFolder = 0;
      m_cntAddedToEmailFolder = 0;
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      var itemCreateInfo = new SP.ListItemCreationInformation();
      itemCreateInfo.set_underlyingObjectType(SP.FileSystemObjectType.folder);
      itemCreateInfo.set_leafName(requestNumber);
      oNewEmailFolder = list.addItem(itemCreateInfo);
      oNewEmailFolder.set_item("Title", requestNumber);
      oNewEmailFolder.update();
      this.currentUser = web.get_currentUser();
      this.ownerGroup = web.get_associatedOwnerGroup();
      this.memberGroup = web.get_associatedMemberGroup();
      this.visitorGroup = web.get_associatedVisitorGroup();
      oNewEmailFolder.resetRoleInheritance();
      oNewEmailFolder.breakRoleInheritance(false, false);
      var roleDefBindingCollAdmin = SP.RoleDefinitionBindingCollection.newObject(currCtx);
      roleDefBindingCollAdmin.add(
        web.get_roleDefinitions().getByType(SP.RoleType.administrator)
      );
      var roleDefBindingCollContribute = SP.RoleDefinitionBindingCollection.newObject(currCtx);
      roleDefBindingCollContribute.add(
        web.get_roleDefinitions().getByType(SP.RoleType.contributor)
      );
      var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject(currCtx);
      roleDefBindingCollRestrictedRead.add(
        web.get_roleDefinitions().getByName("Restricted Read")
      );
      var roleDefBindingCollRestrictedContribute = SP.RoleDefinitionBindingCollection.newObject(currCtx);
      roleDefBindingCollRestrictedContribute.add(
        web.get_roleDefinitions().getByName("Restricted Contribute")
      );
      oNewEmailFolder.get_roleAssignments().add(ownerGroup, roleDefBindingCollAdmin);
      oNewEmailFolder.get_roleAssignments().add(memberGroup, roleDefBindingCollContribute);
      oNewEmailFolder.get_roleAssignments().add(visitorGroup, roleDefBindingCollRestrictedRead);
      var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameQA()
      );
      if (spGroupQA != null)
        oNewEmailFolder.get_roleAssignments().add(spGroupQA, roleDefBindingCollRestrictedContribute);
      oNewEmailFolder.get_roleAssignments().getByPrincipal(currentUser).deleteObject();
      function onUpdatePermsSucceeded() {
        if (this.requestItem) {
          var arrActionOffice = this.requestItem.get_item("ActionOffice");
          if (arrActionOffice == null || arrActionOffice.length == 0) {
            if (this.OnComplete)
              this.OnComplete(true);
            return;
          }
          for (var x = 0; x < arrActionOffice.length; x++) {
            var actionOfficeName = arrActionOffice[x].get_lookupValue();
            var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName(actionOfficeName);
            var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup(
              actionOfficeGroupName
            );
            if (actionOfficeGroup != null) {
              let onUpdateAOPermsSucceeded2 = function() {
                m_cntAddedToEmailFolder++;
                if (m_cntAddedToEmailFolder == m_cntAddToEmailFolder) {
                  if (this.OnComplete)
                    this.OnComplete(true);
                }
              }, onUpdateAOPermsFailed2 = function(sender, args) {
                m_cntAddedToEmailFolder++;
                if (m_cntAddedToEmailFolder == m_cntAddToEmailFolder) {
                  if (this.OnComplete)
                    this.OnComplete(true);
                }
              };
              var onUpdateAOPermsSucceeded = onUpdateAOPermsSucceeded2, onUpdateAOPermsFailed = onUpdateAOPermsFailed2;
              m_cntAddToEmailFolder++;
              var currCtx2 = new SP.ClientContext.get_current();
              var web2 = currCtx2.get_web();
              var roleDefBindingCollRestrictedContribute2 = SP.RoleDefinitionBindingCollection.newObject(currCtx2);
              roleDefBindingCollRestrictedContribute2.add(
                web2.get_roleDefinitions().getByName("Restricted Contribute")
              );
              this.oNewEmailFolder.get_roleAssignments().add(actionOfficeGroup, roleDefBindingCollRestrictedContribute2);
              var data3 = { OnComplete: this.OnComplete };
              currCtx2.executeQueryAsync(
                Function.createDelegate(data3, onUpdateAOPermsSucceeded2),
                Function.createDelegate(data3, onUpdateAOPermsFailed2)
              );
            }
          }
        } else {
          if (this.OnComplete)
            this.OnComplete(true);
        }
      }
      function onUpdatePermsFailed(sender, args) {
        statusId = SP.UI.Status.addStatus(
          "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
        );
      }
      var data2 = {
        /*item: oListItem, */
        requestItem,
        oNewEmailFolder,
        OnComplete
      };
      currCtx.executeQueryAsync(
        Function.createDelegate(data2, onUpdatePermsSucceeded),
        Function.createDelegate(data2, onUpdatePermsFailed)
      );
    }
    function m_fnSortResponseTitleNoCase(a, b) {
      var aTitle = a;
      var bTitle = b;
      let newA, newB;
      if (aTitle == null)
        aTitle = "";
      if (bTitle == null)
        bTitle = "";
      var aIndex = aTitle.lastIndexOf("-");
      if (aIndex >= 0) {
        var subA = aTitle.substring(0, aIndex + 1);
        var lastA = aTitle.replace(subA, "");
        var intA = parseInt(lastA, 10);
        var newIntA = Audit.Common.Utilities.PadDigits(intA, 5);
        newA = subA + newIntA;
      } else
        newA = aTitle;
      var bIndex = bTitle.lastIndexOf("-");
      if (bIndex >= 0) {
        var subB = bTitle.substring(0, bIndex + 1);
        var lastB = bTitle.replace(subB, "");
        var intB = parseInt(lastB, 10);
        var newIntB = Audit.Common.Utilities.PadDigits(intB, 5);
        newB = subB + newIntB;
      } else
        newB = bTitle;
      return newA.toLowerCase().localeCompare(newB.toLowerCase());
    }
    function m_fnSortResponseObjectNoCase(a, b) {
      var aTitle = a.title;
      var bTitle = b.title;
      var newA;
      var newB;
      if (aTitle == null)
        aTitle = "";
      if (bTitle == null)
        bTitle = "";
      var aIndex = aTitle.lastIndexOf("-");
      if (aIndex >= 0) {
        var subA = aTitle.substring(0, aIndex + 1);
        var lastA = aTitle.replace(subA, "");
        var intA = parseInt(lastA, 10);
        var newIntA = Audit.Common.Utilities.PadDigits(intA, 5);
        newA = subA + newIntA;
      } else
        newA = aTitle;
      var bIndex = bTitle.lastIndexOf("-");
      if (bIndex >= 0) {
        var subB = bTitle.substring(0, bIndex + 1);
        var lastB = bTitle.replace(subB, "");
        var intB = parseInt(lastB, 10);
        var newIntB = Audit.Common.Utilities.PadDigits(intB, 5);
        newB = subB + newIntB;
      } else
        newB = bTitle;
      return newA.toLowerCase().localeCompare(newB.toLowerCase());
    }
    function m_fnSortNoCase(a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    }
    function m_fnSortDate(a, b) {
      if (a == "")
        return -1;
      if (b == "")
        return 1;
      return new Date(a).getTime() - new Date(b).getTime();
    }
    function m_fnAddOptions(arr, ddlID, dateSort, responseSort) {
      if (arr == null)
        return;
      if (responseSort)
        arr.sort(m_fnSortResponseTitleNoCase);
      else if (!dateSort)
        arr.sort(m_fnSortNoCase);
      else
        arr.sort(m_fnSortDate);
      var rOptions = new Array(), j = -1;
      rOptions[++j] = "<option value=''>-Select-</option>";
      var arrLength = arr.length;
      for (var x = 0; x < arrLength; x++) {
        var option = $.trim(arr[x]);
        rOptions[++j] = "<option value='" + option + "'>" + option + "</option>";
      }
      var thisDDL = $(ddlID);
      thisDDL.empty().append(rOptions.join(""));
    }
    function m_fnExistsInArr(arr, val) {
      if (arr == null)
        return false;
      var arrLength = arr.length;
      for (var x = 0; x < arrLength; x++) {
        if (arr[x] == val)
          return true;
      }
      return false;
    }
    function m_fnGetTrueFalseIcon(val) {
      if (val == true)
        return "<span class='ui-icon ui-icon-check'>" + val + "</span>";
      else
        return "<span class='ui-icon ui-icon-close'>" + val + "</span>";
    }
    function m_fnGetFriendlyDisplayName(oListItem, fieldName) {
      var user = oListItem.get_item(fieldName);
      if (user == null)
        return "";
      else
        return user.get_lookupValue();
    }
    function m_fnPadDigits(n, totalDigits) {
      n = n.toString();
      var pd = "";
      if (totalDigits > n.length) {
        for (let i2 = 0; i2 < totalDigits - n.length; i2++) {
          pd += "0";
        }
      }
      return pd + n.toString();
    }
    function m_fnPreciseRound(num, decimals) {
      var sign = num >= 0 ? 1 : -1;
      return (Math.round(num * Math.pow(10, decimals) + sign * 1e-3) / Math.pow(10, decimals)).toFixed(decimals);
    }
    function m_fnGetFriendlyFileSize(fileSize) {
      if (fileSize == null || fileSize == "")
        return "";
      if (fileSize > 1048576) {
        fileSize = Audit.Common.Utilities.PreciseRound(fileSize / 1048576, 2) + " MB";
      } else if (fileSize > 1024) {
        fileSize = Audit.Common.Utilities.PreciseRound(fileSize / 1024, 2) + " KB";
      } else {
        fileSize += " B";
      }
      return fileSize;
    }
    function m_fnISODateString(d) {
      function pad(n) {
        return n < 10 ? "0" + n : n;
      }
      return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()) + "T" + pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds()) + "Z";
    }
    function m_fnBindHandlerResponseDoc() {
      $(".requestInfo-response-doc img").click(function(event) {
        event.preventDefault();
        var curIcon = $(this).attr("src");
        if (curIcon == "/_layouts/images/minus.gif")
          $(this).attr("src", "/_layouts/images/plus.gif");
        else
          $(this).attr("src", "/_layouts/images/minus.gif");
        $(this).parent().parent().nextUntil("tr.requestInfo-response-doc").each(function() {
          $(this).toggleClass("collapsed");
        });
      });
    }
    function m_fnGetLookupFormField(fieldTitle) {
      if ($("select[title='" + fieldTitle + "']").html() !== null) {
        return $("select[title='" + fieldTitle + "']");
      } else {
        return $("input[title='" + fieldTitle + "']");
      }
    }
    function m_fnGetLookupDisplayText(fieldTitle) {
      if ($("select[title='" + fieldTitle + "']").html() !== null) {
        return $("select[title='" + fieldTitle + "'] option:selected").text();
      } else {
        return $("input[title='" + fieldTitle + "']").val();
      }
    }
    function m_fnSetLookupFromFieldNameByText(fieldName, text) {
      try {
        if (text == void 0)
          return;
        var theSelect = m_fnGetTagFromIdentifierAndTitle("select", "", fieldName);
        if (theSelect == null) {
          var theInput = m_fnGetTagFromIdentifierAndTitle("input", "", fieldName);
          ShowDropdown(theInput.id);
          var opt = document.getElementById(theInput.opt);
          m_fnSetSelectedOptionByText(opt, text);
          OptLoseFocus(opt);
        } else {
          m_fnSetSelectedOptionByText(theSelect, text);
        }
      } catch (ex) {
      }
    }
    function m_fnSetSelectedOptionByText(select, text) {
      var opts = select.options;
      var optLength = opts.length;
      if (select == null)
        return;
      for (var i2 = 0; i2 < optLength; i2++) {
        if (opts[i2].text == text) {
          select.selectedIndex = i2;
          return true;
        }
      }
      return false;
    }
    function m_fnGetTagFromIdentifierAndTitle(tagName, identifier, title) {
      var idLength = identifier.length;
      var tags = document.getElementsByTagName(tagName);
      for (var i2 = 0; i2 < tags.length; i2++) {
        var tagID = tags[i2].id;
        if (tags[i2].title == title && (identifier == "" || tagID.indexOf(identifier) == tagID.length - idLength)) {
          return tags[i2];
        }
      }
      return null;
    }
    function m_fnViewUserManuals(docType) {
      var options = SP.UI.$create_DialogOptions();
      options.title = "User Manual";
      options.height = 250;
      if (docType != null)
        options.url = Audit.Common.Utilities.GetSiteUrl() + "/pages/AuditUserManuals.aspx?FilterField1=DocType&FilterValue1=" + docType;
      else
        options.url = Audit.Common.Utilities.GetSiteUrl() + "/pages/AuditUserManuals.aspx";
      SP.UI.ModalDialog.showModalDialog(options);
    }
    function m_fnPrintPage(pageTitle, divTbl) {
      var curDate = /* @__PURE__ */ new Date();
      var siteUrl = Audit.Common.Utilities.GetSiteUrl();
      var cssLink1 = siteUrl + "/siteassets/css/tablesorter/style.css?v=" + curDate.format("MM_dd_yyyy");
      var cssLink2 = siteUrl + "/siteAssets/css/audit_styles.css?v=" + curDate.format("MM_dd_yyyy");
      var divOutput = $(divTbl).html();
      var updatedDivOutput = $("<div>").append(divOutput);
      updatedDivOutput.find(".sr-response-title a").each(function() {
        $(this).removeAttr("onclick");
        $(this).removeAttr("href");
      });
      divOutput = updatedDivOutput.html();
      var printDateString = curDate.format("MM/dd/yyyy hh:mm tt");
      printDateString = "<div style='padding-bottom:10px;'>" + printDateString + "</div>";
      divOutput = printDateString + divOutput;
      var cssFile1 = $("<div></div>");
      var cssFile2 = $("<div></div>");
      var def1 = $.Deferred();
      var def2 = $.Deferred();
      var cssFileText = "";
      cssFile1.load(cssLink1, function() {
        cssFileText += "<style>" + cssFile1.html() + "</style>";
        def1.resolve();
      });
      cssFile2.load(cssLink2, function() {
        cssFileText += "<style>" + cssFile2.html() + "</style>";
        def2.resolve();
      });
      $.when(def1, def2).done(function() {
        var html6 = "<HTML>\n<HEAD>\n\n<Title>" + pageTitle + "</Title>\n" + cssFileText + "\n<style>.hideOnPrint, .rowFilters {display:none}</style>\n</HEAD>\n<BODY>\n" + divOutput + "\n</BODY>\n</HTML>";
        var printWP = window.open("", "printWebPart");
        printWP.document.open();
        printWP.document.write(html6);
        printWP.document.close();
        printWP.print();
      });
    }
    function m_fnExportToCsv(fileName, tableName, removeHeader) {
      var data2 = m_fnGetCellValues(tableName);
      if (removeHeader == true)
        data2 = data2.slice(1);
      var csv = m_fnConvertToCsv(data2);
      if (navigator.userAgent.search("Trident") >= 0) {
        window.CsvExpFrame.document.open("text/html", "replace");
        window.CsvExpFrame.document.write(csv);
        window.CsvExpFrame.document.close();
        window.CsvExpFrame.focus();
        window.CsvExpFrame.document.execCommand(
          "SaveAs",
          true,
          fileName + ".csv"
        );
      } else {
        var uri = "data:text/csv;charset=utf-8," + escape(csv);
        var downloadLink = document.createElement("a");
        downloadLink.href = uri;
        downloadLink.download = fileName + ".csv";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    }
    function m_fnGetCellValues(tableName) {
      var table = document.getElementById(tableName);
      if (table.innerHTML.indexOf("rowFilters") >= 0) {
        var deets = $("<div>").append(table.outerHTML);
        deets.find(".rowFilters").each(function() {
          $(this).remove();
        });
        table = deets.find("table")[0];
      }
      if (table.innerHTML.indexOf("footer") >= 0) {
        var deets = $("<div>").append(table.outerHTML);
        deets.find(".footer").each(function() {
          $(this).remove();
        });
        table = deets.find("table")[0];
      }
      var tableArray = [];
      for (var r = 0, n = table.rows.length; r < n; r++) {
        tableArray[r] = [];
        for (var c = 0, m = table.rows[r].cells.length; c < m; c++) {
          var text = table.rows[r].cells[c].textContent || table.rows[r].cells[c].innerText;
          tableArray[r][c] = text.trim();
        }
      }
      return tableArray;
    }
    function m_fnConvertToCsv(objArray) {
      var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
      var str = "sep=,\r\n";
      var line = "";
      var index;
      var value;
      for (var i2 = 0; i2 < array.length; i2++) {
        line = "";
        var array1 = array[i2];
        for (index in array1) {
          if (array1.hasOwnProperty(index)) {
            value = array1[index] + "";
            line += '"' + value.replace(/"/g, '""') + '",';
          }
        }
        line = line.slice(0, -1);
        str += line + "\r\n";
      }
      return str;
    }
    var publicMembers = {
      GetSiteUrl: function() {
        if (m_siteUrl == "/")
          return "";
        else
          return m_siteUrl;
      },
      GetListTitleRequests: function() {
        return m_listTitleRequests;
      },
      GetListNameRequests: function() {
        return m_listNameRequests;
      },
      GetListTitleRequestsInternal: function() {
        return m_listTitleRequestsInternal;
      },
      GetListNameRequestsInternal: function() {
        return m_listNameRequestsInternal;
      },
      GetListTitleResponses: function() {
        return m_listTitleResponses;
      },
      GetListNameResponses: function() {
        return m_listNameResponses;
      },
      GetLibTitleRequestDocs: function() {
        return m_libTitleRequestDocs;
      },
      GetLibNameRequestDocs: function() {
        return m_libNameRequestDocs;
      },
      GetLibTitleCoverSheets: function() {
        return m_libTitleCoverSheet;
      },
      GetLibNameCoverSheets: function() {
        return m_libNameCoverSheet;
      },
      GetLibTitleResponseDocs: function() {
        return m_libTitleResponseDocs;
      },
      GetLibNameResponseDocs: function() {
        return m_libNameResponseDocs;
      },
      GetLibTitleResponseDocsEA: function() {
        return m_libTitleResponseDocsEA;
      },
      GetLibNameResponseDocsEA: function() {
        return m_libNameResponseDocsEA;
      },
      GetListTitleActionOffices: function() {
        return m_listTitleActionOffices;
      },
      GetListNameActionOffices: function() {
        return m_listNameActionOffices;
      },
      GetListTitleEmailHistory: function() {
        return m_listTitleEmailHistory;
      },
      GetListNameEmailHistory: function() {
        return m_listNameEmailHistory;
      },
      GetListTitleBulkResponses: function() {
        return m_listTitleBulkResponses;
      },
      GetListNameBulkResponses: function() {
        return m_listNameBulkResponses;
      },
      GetListTitleBulkPermissions: function() {
        return m_listTitleBulkPermissions;
      },
      GetListNameBulkPermissions: function() {
        return m_listNameBulkPermissions;
      },
      GetGroupNameSpecialPerm1: function() {
        return m_groupNameSpecialPermName1;
      },
      GetGroupNameSpecialPerm2: function() {
        return m_groupNameSpecialPermName2;
      },
      GetGroupNameQA: function() {
        return m_groupNameQA;
      },
      GetGroupNameEA: function() {
        return m_groupNameEA;
      },
      Refresh: m_fnRefresh2,
      OnLoadDisplayTimeStamp: m_fnOnLoadDisplayTimeStamp,
      OnLoadDisplayTabAndResponse: m_fnOnLoadDisplayTabAndResponse,
      OnLoadFilterResponses: function(responseStatus1, responseStatus2) {
        m_fnOnLoadFilterResponses(responseStatus1, responseStatus2);
      },
      SetResponseDocLibGUID: function(libGUID) {
        m_libResponseDocsLibraryGUID2 = libGUID;
      },
      GetResponseDocLibGUID: function() {
        return m_libResponseDocsLibraryGUID2;
      },
      LoadSiteGroups: function(itemColl) {
        m_fnLoadSiteGroups(itemColl);
      },
      GetSPSiteGroup: function(groupName) {
        return m_fnGetSPSiteGroup(groupName);
      },
      LoadActionOffices: function(itemColl) {
        m_fnLoadActionOffices(itemColl);
      },
      GetActionOffices: function() {
        return m_arrAOs;
      },
      GetAOSPGroupName: function(groupName) {
        return m_fnGetAOSPGroupName(groupName);
      },
      CheckSPItemHasGroupPermission: function(item, groupName, permissionLevel) {
        return m_fnCheckSPItemHasGroupPermission(
          item,
          groupName,
          permissionLevel
        );
      },
      GoToResponse: function(responseTitle, isIA) {
        m_fnGoToResponse(responseTitle, isIA);
      },
      GetResponseDocStyleTag: function(documentStatus) {
        return m_fnGetResponseDocStyleTag(documentStatus);
      },
      GetResponseDocStyleTag2: function(documentStatus) {
        return m_fnGetResponseDocStyleTag2(documentStatus);
      },
      CheckIfEmailFolderExists: function(items, requestNumber) {
        return m_fnCheckIfEmailFolderExists(items, requestNumber);
      },
      CreateEmailFolder: function(list, requestNumber, requestItem, OnComplete) {
        return m_fnCreateEmailFolder(
          list,
          requestNumber,
          requestItem,
          OnComplete
        );
      },
      AddOptions: function(arr, ddlID, dateSort, responseSort) {
        m_fnAddOptions(arr, ddlID, dateSort, responseSort);
      },
      ExistsInArr: function(arr, val) {
        return m_fnExistsInArr(arr, val);
      },
      GetTrueFalseIcon: function(val) {
        return m_fnGetTrueFalseIcon(val);
      },
      PadDigits: function(n, totalDigits) {
        return m_fnPadDigits(n, totalDigits);
      },
      PreciseRound: function(num, decimals) {
        return m_fnPreciseRound(num, decimals);
      },
      GetFriendlyFileSize: function(fileSize) {
        return m_fnGetFriendlyFileSize(fileSize);
      },
      GetISODateString: function(d) {
        return m_fnISODateString(d);
      },
      GetFriendlyDisplayName: function(oListItem, fieldName) {
        return m_fnGetFriendlyDisplayName(oListItem, fieldName);
      },
      BindHandlerResponseDoc: m_fnBindHandlerResponseDoc,
      PrintStatusReport: function(pageTitle, divTbl) {
        m_fnPrintPage(pageTitle, divTbl);
      },
      ExportToCsv: function(fileName, tableName, removeHeader) {
        m_fnExportToCsv(fileName, tableName, removeHeader);
      },
      ViewUserManuals: function(docType) {
        m_fnViewUserManuals(docType);
      },
      //GetLookupFieldText: function( fieldName ){ return m_fnGetLookupFieldText( fieldName); },
      GetLookupDisplayText: function(fieldName) {
        return m_fnGetLookupDisplayText(fieldName);
      },
      GetLookupFormField: function(fieldName) {
        return m_fnGetLookupFormField(fieldName);
      },
      SetLookupFromFieldNameByText: function(fieldName, text) {
        return m_fnSetLookupFromFieldNameByText(fieldName, text);
      },
      SortResponseObjects: function(a, b) {
        return m_fnSortResponseObjectNoCase(a, b);
      },
      SortResponseTitles: m_fnSortResponseTitleNoCase
    };
    return publicMembers;
  };
  InitReport();

  // lib/webcomponents/searchselect/SearchSelectTemplate.js
  var html2 = String.raw;
  var searchSelectTemplate = html2`
  <div>
    <!-- Hide the element, stylesheet overrides on load -->
    <style>
        .search-group {
        --font-sm: 0.75rem;
        }

        /* Testing Style HTML Elements */
        .elements-container {
        display: flex;
        column-gap: 20px;
        }
        .select-container {
        width: 150px;
        }

        /* Actual Elements */

        div.search-group {
        display: revert;
        position: relative;
        min-height: 1rem;
        }

        .search-input-group {
        display: flex;
        align-items: center;
        background-color: white;
        /* border: 1px solid lightgray; */
        border: none;
        border-radius: 4px;
        box-sizing: border-box;
        padding: 0;
        }

        .search-input-group input {
        border: none;
        border-radius: 4px;
        width: 100%;
        color: black;
        padding: 0.1rem 0.3rem;
        font-size: var(--font-sm);
        font-family: "Segoe UI";
        }

        /* .caret {
        content: "";
        display: inline-block;
        border: 4px solid transparent;
        border-top-color: transparent;
        border-top-color: black;
        margin-left: 12px;
        margin-top: 4px;
        } */

        .caret-bg {
        background-image: url("#svg-caret-down");
        background-repeat: no-repeat;
        min-width: 1rem;
        }

        .search-input-group::after {
        aspect-ratio: 1 / 1;
        height: 1rem;
        content: "\276F";
        color: darkgray;
        font-size: 0.7rem;
        font-weight: bold;
        text-align: center;
        display: flex;
        justify-content: center;
        transition: transform 0.4s ease-in-out;
        }

        .search-group.active .search-input-group::after {
        transform: rotate(90deg);
        }

        .search-input-group .vertical-spacer {
        height: 85%;
        min-height: 0.8rem;
        border-left: 1px solid lightGray;
        }
        .search-input-group svg {
        color: lightGray;
        height: 85%;
        transition-duration: 0.5s;
        }

        .search-group.active .search-input-group svg {
        border: none;
        transform: rotate(180deg);
        }

        .hidden {
        display: none;
        }

        .secondary {
        font-style: italic;
        }

        .test-toggle {
        background-color: green;
        }

        .selected.item {
        display: flex;
        align-items: center;
        width: fit-content;
        color: #212529;
        font-weight: normal;
        font-size: var(--font-sm);
        background-color: #f8f9fa;
        border-radius: 0.25rem;
        border: 1px solid #dee2e6;
        /* height: 1.5rem; */
        /* top right bottom left */
        /* padding: 0.1rem 0rem 0.1rem 0.5rem; */
        padding-left: 0.75rem;
        margin-bottom: 1px;
        }

        .selected.item div.remove {
        /* border-style: none;
        border-radius: 50%; */
        border-top-right-radius: 0.25rem;
        border-bottom-right-radius: 0.25rem;
        margin-left: 0.4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 1rem;
        color: rgb(108, 117, 125);
        aspect-ratio: 1/1;
        }

        .selected.item div.remove:hover {
        background-color: darkgrey;
        color: white;
        }

        .selected.item div.remove svg {
        height: 1.25rem;
        width: 1.25rem;
        }

        .filtered.item {
        background-color: white;
        padding: 0.1rem 1rem;
        font-weight: normal;
        }

        .filtered.item.even {
        background-color: rgb(233, 233, 233);
        }

        .filtered.item:hover {
        background-color: lightgray;
        }

        .filtered.item.active {
        background-color: lightblue;
        }

        #selected-items-text {
        display: flex;
        flex-wrap: wrap;
        }

        .filtered-items {
        color: black;
        list-style: none;
        padding-left: 0;
        margin-top: 3px;
        /* display: none; */
        position: absolute;
        min-width: 100%;
        max-height: 0px;
        overflow-y: auto;
        z-index: 1;
        border: 0px solid lightgray;
        box-sizing: border-box;
        transition: all 0.4s ease-in-out;
        }

        .filtered-items.active {
        /* display: block; */
        max-height: 200px;
        border: 1px solid lightgray;
        }

      .search-group {
        display: none;
      }
    </style>
    <div id="search-group" class="search-group" tabindex="-1">
      <div id="selected-items-text"></div>
      <div class="search-input-group" tabindex="-1">
        <input
          id="search-input"
          class="search-input"
          placeholder="Search..."
          type="text"
          autocomplete="off"
        />
        <div class="vertical-spacer"></div>
      </div>
      <ul id="filtered-items-text" class="filtered-items"></ul>
    </div>
    <div id="icons" class="hidden" style="display: none">
      <div id="icon-close" style="display: none; width: 0px; height: 0px">
        <svg
          style="display: none; max-width: 2rem; max-height: 2rem"
          class="position-absolute top-50 start-50 translate-middle"
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
      </div>
      <div id="icon-caret-down">
        <svg
          id="svg-caret-down"
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.1018 8C5.02785 8 4.45387 9.2649 5.16108 10.0731L10.6829 16.3838C11.3801 17.1806 12.6197 17.1806 13.3169 16.3838L18.8388 10.0731C19.5459 9.2649 18.972 8 17.898 8H6.1018Z"
            fill="#212121"
          />
        </svg>
      </div>
    </div>
  </div>
`;

  // lib/webcomponents/searchselect/searchselect.js
  customElements.define(
    "search-select",
    class extends HTMLElement {
      constructor() {
        super();
        this.selectableItems = [];
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = searchSelectTemplate;
        this.searchGroupElement = this.shadowRoot.getElementById("search-group");
        this.searchInputGroupElement = this.shadowRoot.querySelector(
          ".search-input-group"
        );
        this.searchInputElement = this.shadowRoot.getElementById("search-input");
        this.filteredItemsElement = this.shadowRoot.getElementById(
          "filtered-items-text"
        );
        this.selectedItemsElement = this.shadowRoot.getElementById(
          "selected-items-text"
        );
        this.options = this.querySelectorAll("option");
      }
      initializeFilteredItems = () => {
        this.options = this.querySelectorAll("option");
        this.filteredItemDivs = [...this.options].map((opt, index) => {
          opt.dataset.id = index;
          this.attributeChangeMutationObserver.observe(opt, {
            attributes: true
          });
          let li = document.createElement("li");
          li.classList.add("filtered", "item");
          li.classList.toggle("even", index % 2);
          li.innerHTML = opt.innerHTML;
          li.dataset.optionId = opt.dataset.id;
          return li;
        });
        this.filteredItemsElement.replaceChildren(...this.filteredItemDivs);
        this.updateFilteredItems();
        this.updateSelectedItems(true);
      };
      updateFilteredItems = () => {
        const searchText = this.searchInputElement.value;
        this.filteredItemDivs.forEach((opt) => {
          const optContainsText = opt.innerText.toLowerCase().search(searchText.toLowerCase()) >= 0;
          const shouldBeShown = !searchText || optContainsText;
          opt.classList.toggle("hidden", !shouldBeShown);
        });
        [...this.options].filter((opt) => opt.hasAttribute("selected")).map((opt) => {
          this.filteredItemDivs.find((div) => div.dataset.optionId === opt.dataset.id).classList.add("hidden");
        });
        var count = [
          ...this.filteredItemsElement.querySelectorAll("li:not(.hidden)")
        ].map((li, index) => li.classList.toggle("even", index % 2));
      };
      updateActiveFilteredItem = (keyDirection) => {
        const visibleItems = this.filteredItemDivs.find(
          (opt) => !opt.classList.contains("hidden")
        );
        if (!visibleItems) {
          return;
        }
        const activeItemIndex = this.filteredItemDivs.findIndex(
          (opt) => opt.classList.contains("active")
        );
        let index = activeItemIndex + keyDirection;
        let item;
        do {
          if (index >= this.filteredItemDivs.length) {
            index = 0;
          }
          item = this.filteredItemDivs.at(index);
          index += keyDirection;
        } while (item.classList.contains("hidden"));
        item.classList.add("active");
        if (activeItemIndex >= 0) {
          this.filteredItemDivs[activeItemIndex].classList.remove("active");
        }
      };
      selectActiveFilteredItem = () => {
        const activeItem = this.filteredItemDivs.find(
          (opt) => opt.classList.contains("active")
        );
        if (activeItem) {
          this.selectFilteredItem(activeItem);
          this.updateActiveFilteredItem(1);
        }
      };
      updateSelectedItems = (initial = false) => {
        this.selectedOptions = [...this.options].filter(
          (opt) => opt.hasAttribute("selected")
        );
        const closeCopy = this.shadowRoot.getElementById("icon-close").innerHTML;
        const selectedItemDivs = this.selectedOptions.map((opt) => {
          const itemGroup = document.createElement("div");
          itemGroup.classList.add("selected", "item");
          itemGroup.dataset.optionId = opt.dataset.id;
          const itemText = document.createElement("div");
          itemText.innerText = opt.innerHTML;
          const close = document.createElement("div");
          close.classList.add("remove");
          close.innerHTML = closeCopy;
          itemGroup.appendChild(itemText);
          itemGroup.appendChild(close);
          return itemGroup;
        });
        this.selectedItemsElement.replaceChildren(...selectedItemDivs);
        for (const svg of this.selectedItemsElement.getElementsByTagName("svg")) {
          svg.style.display = "revert";
        }
        if (!initial) {
          this.dispatchEvent(new Event("change"));
        }
      };
      selectFilteredItem = (item) => {
        if (!item)
          return;
        [...this.options].find((opt) => opt.dataset.id === item.dataset.optionId).setAttribute("selected", "");
      };
      removeSelectedItem = (item) => {
        if (!item)
          return;
        [...this.options].find((opt) => opt.dataset.id === item.dataset.optionId).removeAttribute("selected");
        this.updateSelectedItems();
        this.updateFilteredItems();
      };
      connectedCallback() {
        const mutationCallback = (mutationList, observer) => {
          for (const mutation of mutationList) {
            if (mutation.type === "childList") {
              this.initializeFilteredItems();
            }
          }
        };
        const attributeChangeMutationCallback = (mutationList, observer) => {
          for (const mutation of mutationList) {
            if (mutation.type === "attributes") {
              this.updateSelectedItems();
              this.updateFilteredItems();
            }
          }
        };
        this.attributeChangeMutationObserver = new MutationObserver(
          attributeChangeMutationCallback
        );
        this.mutationObserver = new MutationObserver(mutationCallback);
        this.mutationObserver.observe(this, {
          attributes: true,
          childList: true
        });
        this.filteredItemsElement.classList.toggle("active", false);
        this.initializeFilteredItems();
        this.searchGroupElement.addEventListener("focusin", (e) => {
          this.filteredItemsElement.classList.toggle("active", true);
          this.searchGroupElement.classList.toggle("active", true);
          clearTimeout(this.focusOutTimeout);
        });
        this.searchGroupElement.addEventListener("focusout", (e) => {
          this.focusOutTimeout = setTimeout(() => {
            this.filteredItemsElement.classList.remove("active");
            this.searchGroupElement.classList.remove("active");
          }, 0);
        });
        this.searchInputElement.addEventListener("input", (e) => {
          e.preventDefault();
          this.searchText = this.searchInputElement.value;
          this.updateFilteredItems();
        });
        this.searchInputElement.addEventListener("focusout", (e) => {
        });
        this.searchGroupElement.addEventListener("keydown", (e) => {
          switch (e.code) {
            case "Tab":
              this.filteredItemsElement.classList.remove("active");
              break;
            case "ArrowDown":
              this.updateActiveFilteredItem(1);
              break;
            case "ArrowUp":
              this.updateActiveFilteredItem(-1);
              break;
            case "Enter":
              this.handlingClick = true;
              this.selectActiveFilteredItem();
              break;
            default:
          }
        });
        this.filteredItemsElement.addEventListener("click", (e) => {
          this.selectFilteredItem(e.target);
        });
        this.selectedItemsElement.addEventListener("click", (e) => {
          this.removeSelectedItem(e.target.closest("div.item"));
        });
      }
      disconnectedCallback() {
        try {
          this.mutationObserver.disconnect();
          this.attributeChangeMutationObserver.disconnect();
        } catch (e) {
          console.warn("cannot remove event listeners");
        }
      }
    }
  );

  // lib/webcomponents/data-table/data-table.js
  customElements.define(
    "data-table",
    class DataTable extends HTMLTableElement {
      constructor() {
        const self = super();
        this.table = self;
        this.head = this.table.querySelector("thead");
        this.body = this.table.querySelector("tbody");
      }
      onFilterEventHandler = (e) => {
        [...this.table.querySelectorAll("tbody tr.hidden")].map(
          (row) => row.classList.remove("hidden")
        );
        [...this.table.querySelectorAll("tbody td.filtered")].map(
          (cell) => cell.closest("tr").classList.add("hidden")
        );
        this.filteredCntElement.innerText = this.table.querySelectorAll(
          "tbody tr:not(.hidden)"
        ).length;
      };
      onSearchEventHandler = (e) => {
        [...this.table.querySelectorAll("tbody tr:not(.hidden)")].map(
          (row) => row.classList.add("hidden")
        );
        [...this.table.querySelectorAll("tbody td.included")].map(
          (cell) => cell.closest("tr").classList.remove("hidden")
        );
      };
      onSortEventHandler = (e) => {
        const headerCells = this.table.querySelectorAll("thead th.sorter-true");
        let sortOrder = 0;
        let sortIndex = 0;
        for (const th of headerCells) {
          const cellIndex = th.cellIndex;
          const classList = th.classList;
          const i2 = th.querySelector("i");
          i2.classList.remove("fa-sort-down", "fa-sort-up", "fa-sort");
          if (classList.contains("desc")) {
            i2.classList.add("fa-sort-down");
            sortOrder = 1;
            sortIndex = cellIndex;
          } else if (classList.contains("asc")) {
            i2.classList.add("fa-sort-up");
            sortOrder = -1;
            sortIndex = cellIndex;
          } else {
            i2.classList.add("fa-sort");
          }
        }
        if (!sortOrder)
          return;
        var collator = new Intl.Collator([], { numeric: true });
        const rowsArr = [...this.table.querySelectorAll("tbody tr")];
        rowsArr.sort((tr1, tr2) => {
          const tr1Text = tr1.cells[sortIndex].textContent;
          const tr2Text = tr2.cells[sortIndex].textContent;
          const comp = collator.compare(tr1Text, tr2Text);
          return comp * sortOrder;
        });
        this.table.querySelector("tbody").append(...rowsArr);
      };
      createSortListeners = () => {
        const headerCells = this.table.querySelectorAll("thead th.sorter-true");
        for (const th of headerCells) {
          if (th.querySelector("i[class*=fa-sort"))
            return;
          let i2 = document.createElement("i");
          i2.classList.add("fa-solid", "fa-sort");
          th.append(i2);
          th.addEventListener("click", (e) => {
            const headerCells2 = this.table.querySelectorAll(
              "thead th.sorter-true"
            );
            const cellIndex = th.cellIndex;
            for (const otherTh of headerCells2) {
              if (!otherTh.classList.contains("sorter-true"))
                continue;
              if (otherTh != th) {
                otherTh.classList.remove("asc", "desc");
                otherTh.querySelector("i").classList.remove("fa-sort-up", "fa-sort-down");
                otherTh.querySelector("i").classList.add("fa-sort");
              }
            }
            th.querySelector("i").classList.remove("fa-sort");
            let sortOrder = 0;
            const classList = th.classList;
            if (classList.contains("desc")) {
              classList.replace("desc", "asc");
            } else if (classList.contains("asc")) {
              classList.replace("asc", "desc");
            } else {
              classList.add("desc");
            }
            const event = new Event("sort");
            this.table.dispatchEvent(event);
            return;
            var collator = new Intl.Collator([], { numeric: true });
            const rowsArr = [...this.rows];
            rowsArr.sort((tr1, tr2) => {
              const tr1Text = tr1.cells[cellIndex].textContent;
              const tr2Text = tr2.cells[cellIndex].textContent;
              const comp = collator.compare(tr1Text, tr2Text);
              return comp * sortOrder;
            });
            this.body.append(...rowsArr);
          });
        }
      };
      createFilters = () => {
        const filterTypes = {
          checkbox: checkboxElement,
          daterange: dateRangeElement,
          multiselect: multiselectElement,
          search: searchElement
        };
        let filters = [];
        this.table.querySelectorAll("[data-filter]").forEach((filterCell) => {
          const index = filterCell.cellIndex;
          const filterType = filterTypes[filterCell.dataset.filter];
          if (filterType) {
            const filter = new filterType(
              this.table,
              index,
              filterCell.dataset.filterText
            );
            filterCell.replaceChildren(filter.element);
            filters.push(filter);
            if (filterCell.dataset.filterValue) {
              filter.setFilter(filterCell.dataset.filterValue);
            }
          }
        });
        return filters;
      };
      filterByColIndex = (col, value) => {
        const th = this.table.querySelector(
          `tr.rowFilters th:nth-of-type(${col + 1})`
        );
        th.dataset.filterValue = value;
        this.update();
      };
      createExportOptions = () => {
        const div = document.createElement("div");
        div.classList.add("export-options", "quick-links", "secondary");
        const printButton = document.createElement("button");
        printButton.setAttribute("type", "button");
        printButton.setAttribute("title", "Click here to Print");
        printButton.classList.add("btn", "btn-link");
        printButton.innerHTML = `<i class="fa-solid fa-print"></i>`;
        printButton.addEventListener("click", () => {
          PrintPage(this.table.parentElement);
        });
        const exportButton = document.createElement("button");
        exportButton.setAttribute("type", "button");
        exportButton.setAttribute("title", "Export to CSV");
        exportButton.classList.add("btn", "btn-link");
        exportButton.innerHTML = `<i class="fa-solid fa-file-csv"></i>`;
        exportButton.addEventListener("click", () => {
          const fileName = this.table.dataset.filePrefix + (/* @__PURE__ */ new Date()).format("yyyyMMdd_hhmmtt");
          exportTableToCsv(fileName, this.table);
        });
        div.append(printButton, exportButton);
        this.table.before(div);
      };
      createRowCount = () => {
        const tr = document.createElement("tr");
        const cell = document.createElement("th");
        cell.setAttribute(
          "colspan",
          this.table.querySelector("tr").children.length
        );
        this.filteredCntElement = document.createElement("span");
        this.filteredCntElement.classList.add("table-count", "filtered-count");
        this.totalCntElement = document.createElement("span");
        this.totalCntElement.classList.add("table-count", "total-count");
        cell.append(
          "Displaying ",
          this.filteredCntElement,
          " out of ",
          this.totalCntElement,
          " items"
        );
        tr.append(cell);
        let tfoot = this.table.querySelector("tfoot");
        if (!tfoot) {
          tfoot = document.createElement("tfoot");
          this.table.append(tfoot);
        }
        tfoot.append(tr);
      };
      updateCounts = () => {
        const itemCount = this.table.querySelectorAll("tbody tr").length;
        this.totalCntElement.innerText = itemCount;
        this.rowCount = itemCount;
        this.colCount = this.table.querySelectorAll("thead > tr th").length;
      };
      //   search = (searchTerm) => {
      //     //remove our search designator from all items
      //     [...this.querySelectorAll(".included")].map((cell) =>
      //       cell.classList.remove("included")
      //     );
      //     let includedCells = [];
      //     this.filters.map(
      //       (filter) =>
      //         (includedCells = includedCells.concat(filter.search(searchTerm)))
      //     );
      //     includedCells.map((cell) => cell.classList.add("included"));
      //     const searchEvent = new Event("search");
      //     this.table.dispatchEvent(searchEvent);
      //   };
      update = () => {
        this.isUpdating = true;
        this.filters = this.createFilters();
        this.createSortListeners();
        this.onSortEventHandler();
        this.onFilterEventHandler();
        this.updateCounts();
      };
      init = () => {
        this.createExportOptions();
        this.createRowCount();
        this.update();
      };
      connectedCallback() {
        let tableSearchEventListener = this.table.addEventListener(
          "search",
          (e) => this.onSearchEventHandler(e)
        );
        let tableFilterEventListener = this.table.addEventListener(
          "filter",
          (e) => this.onFilterEventHandler(e)
        );
        let sortEventListener = this.table.addEventListener("sort", (e) => {
          this.isUpdating = true;
          this.onSortEventHandler(e);
        });
        this.init();
      }
      disconnectedCallback() {
        try {
          this.headerMutationObserver.disconnect();
        } catch (e) {
          console.warn("failed to disconnect data-table");
        }
      }
    },
    { extends: "table" }
  );
  var MAX_TIMESTAMP = 864e13;
  function dateRangeElement(tbl, colIndex, text) {
    const datesChangeHandler = (e) => {
      filter(dateStartElement.value, dateEndElement.value);
      const event = new Event("filter");
      tbl.dispatchEvent(event);
    };
    const dateStartElement = document.createElement("input");
    dateStartElement.setAttribute("type", "date");
    dateStartElement.classList.add("form-control", "small");
    const labelFrom = document.createElement("label");
    labelFrom.append("From: ", dateStartElement);
    labelFrom.setAttribute("title", "Filter Start Date");
    dateStartElement.addEventListener("change", datesChangeHandler);
    const dateEndElement = document.createElement("input");
    dateEndElement.setAttribute("type", "date");
    dateEndElement.classList.add("form-control", "small");
    const labelTo = document.createElement("label");
    labelTo.append("To: ", dateEndElement);
    labelTo.setAttribute("title", "Filter End Date");
    dateEndElement.addEventListener("change", datesChangeHandler);
    const clearButton = document.createElement("button");
    clearButton.setAttribute("title", "Clear Filter");
    clearButton.setAttribute("type", "button");
    clearButton.classList.add("btn", "btn-link");
    clearButton.append("clear filters");
    clearButton.addEventListener("click", clearDateInputs);
    function clearDateInputs() {
      dateStartElement.value = dateStartElement.defaultValue;
      dateEndElement.value = dateEndElement.defaultValue;
      datesChangeHandler();
    }
    const inputsContainer = document.createElement("div");
    inputsContainer.append(labelFrom, labelTo, clearButton);
    inputsContainer.classList.add("filter-inputs");
    const filtersContainer = document.createElement("div");
    const presetsSelect = document.createElement("select");
    presetsSelect.innerHTML = `
  <option value="">Select...</option>
  <option value="week">Last 7 Days</option>
  <option value="month">This Month</option>
  <option value="quarter">This Quarter</option>
  <option value="custom">Custom</option>
  `;
    presetsSelect.classList.add("form-select", "small");
    presetsSelect.addEventListener("change", (e) => {
      let ds = /* @__PURE__ */ new Date();
      ds.setHours(0, 0, 0, 0);
      const de = /* @__PURE__ */ new Date();
      de.setHours(0, 0, 0, 0);
      switch (e.target.value) {
        case "":
          clearDateInputs();
          inputsContainer.classList.remove("active");
          return;
        case "week":
          ds = new Date(ds.getTime() - 7 * 24 * 60 * 60 * 1e3);
          break;
        case "month":
          ds.setDate(1);
          de.setMonth(de.getMonth() + 1);
          de.setDate(0);
          break;
        case "quarter":
          ds.setDate(1);
          let dmonth = ds.getMonth();
          if (dmonth <= 2) {
            ds.setMonth(0);
            de.setMonth(3);
          } else if (dmonth <= 5) {
            ds.setMonth(3);
            de.setMonth(6);
          } else if (dmonth <= 8) {
            ds.setMonth(6);
            de.setMonth(9);
          } else if (dmonth <= 11) {
            ds.setMonth(9);
            de.setMonth(12);
          }
          de.setDate(0);
          break;
        default:
          inputsContainer.classList.add("active");
          return;
      }
      inputsContainer.classList.add("active");
      dateStartElement.value = ds.toISOString().split("T")[0];
      dateEndElement.value = de.toISOString().split("T")[0];
      datesChangeHandler();
    });
    filtersContainer.append(presetsSelect, inputsContainer);
    filtersContainer.classList.add("filter-date-range");
    const cells = [
      ...tbl.querySelectorAll(`tbody tr td:nth-of-type(${colIndex + 1})`)
    ];
    const filter = (dateStart, dateEnd = null) => {
      dateStart = dateStart ? new Date(dateStart) : /* @__PURE__ */ new Date(0);
      dateEnd = dateEnd ? new Date(dateEnd) : new Date(MAX_TIMESTAMP);
      cells.map((cell) => {
        const val = cell.innerText.trim();
        if (!val)
          return;
        const cellDate = new Date(val);
        cell.classList.toggle(
          "filtered",
          !(dateStart <= cellDate && cellDate <= dateEnd)
        );
      });
    };
    const search = (searchTerm) => searchCells(cells, searchTerm);
    return {
      element: filtersContainer,
      search,
      filter
    };
  }
  function searchElement(tbl, col, text) {
    const rows = tbl.querySelectorAll("tbody tr");
    const inputElem = document.createElement("input");
    inputElem.classList.add(
      "border",
      "border-lightGray",
      "rounded",
      "w-[90%]",
      "form-control",
      "small"
    );
    inputElem.setAttribute("placeholder", "Search...");
    const cells = [];
    for (let i2 = 0; i2 < rows.length; i2++) {
      const cell = rows[i2].getElementsByTagName("td")[col];
      cells.push(cell);
    }
    inputElem.addEventListener("keyup", (e) => {
      const searchTerm = e.target.value;
      filter(searchTerm);
      const event = new Event("filter");
      tbl.dispatchEvent(event);
    });
    const search = (searchTerm) => searchCells(cells, searchTerm);
    const filter = (filterTerm) => filterCells(cells, filterTerm);
    return {
      element: inputElem,
      search,
      filter
    };
  }
  function checkboxElement(tbl, colIndex, text) {
    const rows = tbl.querySelectorAll("tbody tr");
    const inputElem = document.createElement("input");
    inputElem.classList.add("form-check-input", "small");
    inputElem.setAttribute("type", "checkbox");
    inputElem.setAttribute("autocomplete", "off");
    inputElem.checked = "true";
    const cells = [];
    for (let i2 = 0; i2 < rows.length; i2++) {
      const cell = rows[i2].getElementsByTagName("td")[colIndex];
      cells.push(cell);
    }
    inputElem.addEventListener("change", (e) => {
      const searchTerm = e.target.checked ? "true" : "false";
      filter(e.target.checked);
      const event = new Event("filter");
      tbl.dispatchEvent(event);
    });
    const filter = (isChecked) => filterCheckBoxCells(cells, isChecked);
    const search = (searchTerm) => searchCells(cells, searchTerm);
    return {
      element: inputElem,
      search,
      filter
    };
  }
  function multiselectElement(tbl, colIndex, text) {
    const rows = tbl.querySelectorAll("tbody tr");
    const selectElem = document.createElement("search-select");
    selectElem.setAttribute("multiple", true);
    selectElem.classList.add("multiple");
    let cells = [
      ...tbl.querySelectorAll(`tbody tr td:nth-of-type(${colIndex + 1})`)
    ];
    const selectVals = /* @__PURE__ */ new Set();
    function populateOptions() {
      cells.map((cell) => {
        if (cell.innerText)
          selectVals.add(cell.innerText.trim());
      });
      const opts = [...selectVals].sort().map((val) => {
        const opt = document.createElement("option");
        opt.value = val;
        opt.innerText = val;
        return opt;
      });
      selectElem.replaceChildren(...opts);
    }
    function tblRowsUpdate() {
      console.log("Rows added to table");
      for (let i2 = 0; i2 < rows.length; i2++) {
        if (rows[i2].classList.contains("hidden")) {
          selectVals.delete(cells[i2].innerHTML);
        } else {
          selectVals.add(cells[i2].innerHTML);
        }
      }
      [...selectVals].sort().forEach((val) => {
        const opt = document.createElement("option");
        opt.value = val;
        opt.innerHTML = val;
        selectElem.appendChild(opt);
      });
    }
    function setFilter(value) {
      [...selectElem.options].find((opt) => opt.value == value)?.setAttribute("selected", "");
    }
    selectElem.addEventListener("change", (e) => {
      const selectedVals = [...selectElem.selectedOptions].map(
        (opt) => opt.value
      );
      const isClear = selectedVals[0] == "";
      filterArr(selectedVals);
      const event = new Event("filter");
      tbl.dispatchEvent(event);
    });
    const search = (searchTerm) => searchCells(cells, searchTerm);
    const filter = (filterTerm) => filterCells(cells, filterTerm);
    const filterArr = (filterTerms) => filterCellsArr(cells, filterTerms);
    populateOptions();
    return {
      setFilter,
      element: selectElem,
      search,
      filter
    };
  }
  function searchCells(cells, searchTerm) {
    searchTerm = searchTerm.toLowerCase();
    return cells.filter((cell) => {
      const val = cell.innerText.toString().trim().toLowerCase();
      return val.includes(searchTerm);
    });
  }
  function filterCells(cells, searchTerm) {
    searchTerm = searchTerm.toLowerCase();
    cells.map((cell) => {
      const val = cell.innerText.toString().trim().toLowerCase();
      cell.classList.toggle("filtered", !val.includes(searchTerm));
    });
  }
  function filterCheckBoxCells(cells, isChecked) {
    cells.map((cell) => {
      cell.classList.toggle(
        "filtered",
        cell.querySelector("input").checked != isChecked
      );
    });
  }
  function filterCellsArr(cells, searchTermsArr) {
    const isClear = searchTermsArr.flatMap((term) => term) == "";
    cells.map((cell) => {
      const val = cell.innerText?.trim();
      cell.classList.toggle(
        "filtered",
        !isClear && !searchTermsArr.includes(val)
      );
    });
  }
  function PrintPage(divTbl) {
    const pageTitle = divTbl.dataset.title;
    var curDate = /* @__PURE__ */ new Date();
    var siteUrl = Audit.Common.Utilities.GetSiteUrl();
    var cssLink1 = siteUrl + "/siteassets/css/tablesorter/style.css?v=" + curDate.format("MM_dd_yyyy");
    var cssLink2 = siteUrl + "/siteAssets/css/audit_styles.css?v=" + curDate.format("MM_dd_yyyy");
    var divOutput = $(divTbl).html();
    var updatedDivOutput = $("<div>").append(divOutput);
    updatedDivOutput.find(".sr1-request-requestNum a").each(function() {
      $(this).removeAttr("onclick");
      $(this).removeAttr("href");
    });
    updatedDivOutput.find(".sr2-response-requestNum a").each(function() {
      $(this).removeAttr("onclick");
      $(this).removeAttr("href");
    });
    divOutput = updatedDivOutput.html();
    var printDateString = curDate.format("MM/dd/yyyy hh:mm tt");
    printDateString = "<div style='padding-bottom:10px;'>" + printDateString + " - " + pageTitle + "</div>";
    divOutput = printDateString + divOutput;
    var cssFile1 = $("<div></div>");
    var cssFile2 = $("<div></div>");
    var def1 = $.Deferred();
    var def2 = $.Deferred();
    var cssFileText = "";
    cssFile1.load(cssLink1, function() {
      cssFileText += "<style>" + cssFile1.html() + "</style>";
      def1.resolve();
    });
    cssFile2.load(cssLink2, function() {
      cssFileText += "<style>" + cssFile2.html() + "</style>";
      def2.resolve();
    });
    $.when(def1, def2).done(function() {
      var html6 = "<HTML>\n<HEAD>\n\n<Title>" + pageTitle + "</Title>\n" + cssFileText + "\n<style>.hideOnPrint, .rowFilters, .actionOfficeContainer {display:none}</style>\n</HEAD>\n<BODY>\n" + divOutput + "\n</BODY>\n</HTML>";
      var printWP = window.open("", "Print Web Part");
      if (!printWP) {
        alert("No printWebPart!");
        return;
      }
      printWP.document.open();
      printWP.document.write(html6);
      printWP.document.close();
      printWP.print();
    });
  }
  function exportTableToCsv(fileName, table, removeHeader) {
    var data2 = getCellValues(table);
    if (!data2) {
      alert("No data!");
      return;
    }
    if (removeHeader == true)
      data2 = data2.slice(1);
    var csv = ConvertToCsv(data2);
    if (navigator.userAgent.search("Trident") >= 0) {
      window.CsvExpFrame.document.open("text/html", "replace");
      window.CsvExpFrame.document.write(csv);
      window.CsvExpFrame.document.close();
      window.CsvExpFrame.focus();
      window.CsvExpFrame.document.execCommand("SaveAs", true, fileName + ".csv");
    } else {
      var uri = "data:text/csv;charset=utf-8," + escape(csv);
      var downloadLink = document.createElement("a");
      downloadLink.href = uri;
      downloadLink.download = fileName + ".csv";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  }
  function getCellValues(table) {
    if (!table)
      return;
    if (table.innerHTML.indexOf("rowFilters") >= 0) {
      var deets = $("<div>").append(table.outerHTML);
      deets.find(".rowFilters").each(function() {
        $(this).remove();
      });
      table = deets.find("table")[0];
    }
    if (table.innerHTML.indexOf("footer") >= 0) {
      var deets = $("<div>").append(table.outerHTML);
      deets.find(".footer").each(function() {
        $(this).remove();
      });
      table = deets.find("table")[0];
    }
    if (table.innerHTML.indexOf("actionOfficeContainer") >= 0) {
      var deets = $("<div>").append(table.outerHTML);
      deets.find(".actionOfficeContainer").each(function() {
        $(this).remove();
      });
      deets.find(".sr1-request-actionOffice-item").each(function() {
        var curText = $(this).text() + ", ";
        $(this).text(curText);
      });
      table = deets.find("table")[0];
    }
    var tableArray = [];
    for (var r = 0, n = table.rows.length; r < n; r++) {
      tableArray[r] = [];
      for (var c = 0, m = table.rows[r].cells.length; c < m; c++) {
        var text = table.rows[r].cells[c].textContent || table.rows[r].cells[c].innerText;
        tableArray[r][c] = text.trim();
      }
    }
    return tableArray;
  }
  function ConvertToCsv(objArray) {
    var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    var str = "sep=,\r\n";
    var line = "";
    var index;
    var value;
    for (var i2 = 0; i2 < array.length; i2++) {
      line = "";
      var array1 = array[i2];
      for (index in array1) {
        if (array1.hasOwnProperty(index)) {
          value = array1[index] + "";
          line += '"' + value.replace(/"/g, '""') + '",';
        }
      }
      line = line.slice(0, -1);
      str += line + "\r\n";
    }
    return str;
  }

  // src/pages/ia_db/ia_db.js
  init_infrastructure();
  init_application_db_context();

  // src/common/router.js
  var state = {};
  window.history.replaceState({}, "", document.location.href);
  function setUrlParam(param, newVal) {
    if (getUrlParam(param) == newVal)
      return;
    const search = window.location.search;
    const regex = new RegExp("([?;&])" + param + "[^&;]*[;&]?");
    const query = search.replace(regex, "$1").replace(/&$/, "");
    const urlParams = (query.length > 2 ? query + "&" : "?") + (newVal ? param + "=" + newVal : "");
    state[param] = newVal;
    window.history.pushState(state, "", urlParams.toString());
  }
  function getUrlParam(param) {
    const results = new RegExp("[?&]" + param + "=([^&#]*)").exec(
      window.location.href
    );
    if (results == null) {
      return null;
    } else {
      return decodeURI(results[1]) || 0;
    }
  }

  // src/components/tabs/tabs_module.js
  var TabsModule = class {
    constructor(tabOpts, urlParam = "Tab") {
      this.urlParam = urlParam;
      ko.utils.arrayPushAll(this.tabOpts, tabOpts);
      this.selectedTab.subscribe(this.tabChangeHandler);
      window.addEventListener("popstate", this.popStateHandler);
    }
    tabOpts = ko.observableArray();
    selectedTab = ko.observable();
    isSelected = (tab) => {
      return tab.id == this.selectedTab()?.id;
    };
    clickTabLink = (tab) => {
      this.selectedTab(tab);
      console.log("selected: " + tab.id);
    };
    selectTab = (tab) => this.selectById(tab.id);
    selectById = (tabId) => {
      const tabById = this.tabOpts().find((tab) => tab.id == tabId) ?? this.getDefaultTab();
      this.selectedTab(tabById);
    };
    getDefaultTab = () => this.tabOpts()[0];
    tabChangeHandler = (newTab) => {
      if (newTab)
        setUrlParam(this.urlParam, newTab.id);
    };
    popStateHandler = (event) => {
      if (event.state) {
        if (event.state[this.urlParam])
          this.selectById(event.state[this.urlParam]);
      }
    };
  };
  var Tab = class {
    constructor(id2, linkText, template2) {
      this.id = id2;
      this.linkText = linkText;
      this.template = template2;
    }
  };

  // src/pages/ia_db/ia_db.js
  init_comment_chain_module();
  init_active_viewers_module();

  // src/sal/components/modal/modalDialog.js
  init_infrastructure();

  // src/sal/components/modal/ModalDialogTemplate.js
  init_infrastructure();
  var modalDialogTemplate = html4`
  <dialog
    id=""
    class="card bg-dark draggable modal-dialog"
    data-bind="attr: {id: getUniqueId() }"
  >
    <!-- Can't use 'with: currentDialog' since we need to register our 
      javascript event listeners for grabbing and resizing -->
    <div class="card-header bg-dark grabber">
      <h2 class="card-title" data-bind="text: title"></h2>
      <h2 class="card-title">
        <i class="fa-solid fa-xmark pointer" data-bind="click: clickClose"></i>
      </h2>
    </div>
    <div class="dimmer" data-bind="css: {'active': form.saving }">
      <span class="loader"></span>
      <ul class="" data-bind="foreach: $root.blockingTasks">
        <li data-bind="text: msg + '...'"></li>
      </ul>
    </div>
    <div
      class="card-body"
      data-bind="component: { name: form.componentName, params: form.params }"
    ></div>
    <div class="card-actions">
      <button
        style
        type="button"
        class="btn btn-danger"
        data-bind="click: clickClose"
      >
        Cancel
      </button>
    </div>
  </dialog>
`;

  // src/sal/components/modal/modalDialog.js
  var componentName = "modal-dialog-component";
  var currentDialogs = ko.observableArray();
  var toggle;
  function showModalDialog(dialogOptions) {
    currentDialogs.push(dialogOptions);
  }
  var ModalDialogModule = class {
    constructor(dialogOpts) {
      this.dialogOpts = dialogOpts;
      this.title = dialogOpts.title;
      this.dialogReturnValueCallback = dialogOpts.dialogReturnValueCallback;
      this.form = dialogOpts.form;
      if (this.form?.onComplete) {
        alert("Pass the form onComplete to the modal dialog!");
        return;
      }
      this.form.onComplete = this.close.bind(this);
      toggle = this.toggle;
    }
    toggle = (show = null) => {
      if (show == null)
        show = !this.dlgElement.hasAttribute("open");
      show ? this.showModal() : this.hide();
    };
    showModal = () => {
      this.dlgElement.showModal();
      this.dlgElement.classList.add("active");
    };
    clickClose = () => {
      this.close(false);
    };
    hide = () => {
      this.dlgElement.close();
      this.dlgElement.classList.remove("active");
    };
    close(result) {
      this.dlgElement.close();
      this.dlgElement.classList.remove("active");
      if (this.dialogReturnValueCallback)
        this.dialogReturnValueCallback(result);
      currentDialogs.remove(this.dialogOpts);
    }
    _id;
    getUniqueId = () => {
      if (!this._id) {
        this._id = "field-" + Math.floor(Math.random() * 1e4);
      }
      return this._id;
    };
    koDescendantsComplete = function(node) {
      this.dlgElement = node.querySelector("dialog");
      dragElement(this.dlgElement);
      resizeDialog(this.dlgElement);
      this.showModal();
    };
  };
  directRegisterComponent(componentName, {
    template: modalDialogTemplate,
    viewModel: ModalDialogModule
  });
  function resizeDialog(elmnt) {
    elmnt.style.width = "550px";
    elmnt.style.height = "";
    elmnt.style.top = "125px";
    elmnt.style.left = (window.GetViewportWidth() - 550) / 2 + "px";
  }
  function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const dragger = elmnt.querySelector(".grabber");
    if (dragger) {
      dragger.onmousedown = dragMouseDown;
    } else {
      elmnt.onmousedown = dragMouseDown;
    }
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      elmnt.style.top = elmnt.offsetTop - pos2 + "px";
      elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    }
    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  // src/sal/components/forms/baseForm.js
  var html5 = String.raw;
  var BaseForm = class {
    constructor({ entity = null, view = null }) {
      this.entity = entity;
      this.view = view ?? entity.constructor.Views.All;
    }
    saving = ko.observable(false);
    FormFields = ko.pureComputed(() => {
      const entity = ko.utils.unwrapObservable(this.entity);
      return Object.entries(entity.FieldMap).filter(([key, field]) => this.view.includes(key) && field?.Visible()).map(([key, field]) => field);
    });
    // Validate just the fields on this form
    validate = (showErrors = true) => {
      Object.values(this.FormFields()).map(
        (field) => field?.validate && field.validate(showErrors)
      );
      this.ShowErrors(showErrors);
      return this.Errors();
    };
    ShowErrors = ko.observable(false);
    Errors = ko.pureComputed(() => {
      return Object.values(this.FormFields()).filter((field) => field?.Errors && field.Errors()).flatMap((field) => field.Errors());
    });
    IsValid = ko.pureComputed(() => !this.Errors().length);
    params = this;
  };

  // src/sal/components/forms/default/defaultForm.js
  var componentName2 = "default-constrained-entity-form";
  var DefaultForm = class extends BaseForm {
    constructor({ entity, view, displayMode }) {
      super({ entity, view });
      this.displayMode(displayMode);
    }
    displayMode = ko.observable();
    clickSubmit() {
    }
    clickCancel() {
    }
    clickClear() {
    }
    params = this;
    componentName = componentName2;
  };
  var template = html5`
  <div class="audit-form bg-dark">
    <div class="form-fields vertical" data-bind="foreach: FormFields">
      <div
        class="form-field-component"
        data-bind="component: {
            name: components[$parent.displayMode()], params: $data}, 
            class: classList"
      ></div>
    </div>
  </div>
`;
  ko.components.register(componentName2, {
    template
  });

  // src/sal/enums/display_modes.js
  var FieldDisplayModes = {
    new: "new",
    edit: "edit",
    view: "view"
  };

  // src/sal/infrastructure/form_manager.js
  function DispForm(entity, view = null) {
    return new DefaultForm({ entity, view, displayMode: FieldDisplayModes.view });
  }

  // src/components/forms/request/new_form/new_request_form.js
  init_entities2();

  // src/services/approvals_service.js
  init_entities2();
  init_application_db_context();
  async function approveResponseDocsForRO(requestId, responseDocsToApproveIds) {
    const request2 = await getRequestById(requestId);
    const requestingOffice = request2.RequestingOffice.Value();
    if (!requestingOffice)
      return;
    const allRequestResponseDocs = await getRequestResponseDocs(request2);
    const allRequestResponses = await getRequestResponses(request2);
    const updatedResponses = allRequestResponseDocs.filter((responseDoc) => responseDocsToApproveIds.includes(responseDoc.ID)).map((responseDoc) => responseDoc.ResID.Value()).reduce((accumulator, responseDocResponse) => {
      if (!accumulator.find((response) => response?.ID == responseDocResponse.ID))
        accumulator.push(responseDocResponse);
      return accumulator;
    }, []);
    if (!updatedResponses.length)
      return;
    const roResponseDocROFolderPath = await ensureRequestAuditResponseDocsROFolder(
      request2.Title,
      requestingOffice.ID
    );
    const roEmailLogItem = await ensureRequestROEmailLogItem(requestingOffice);
    let cntApprovedResponseDocs = parseInt(roEmailLogItem.ResponseCount);
    if (!cntApprovedResponseDocs)
      cntApprovedResponseDocs = 0;
    let responseLogBody = "";
    await Promise.all(
      responseDocsToApproveIds.map(async (responseDocId) => {
        const responseDoc = allRequestResponseDocs.find(
          (responseDoc2) => responseDoc2.ID == responseDocId
        );
        if (responseDoc.DocumentStatus.Value() == AuditResponseDocStates.SentToQA)
          return;
        cntApprovedResponseDocs++;
        const response = allRequestResponses.find(
          (response2) => response2.ID == responseDoc.ResID.Value().ID
        );
        const newResponseDocFileName = getNewResponseDocTitle(
          request2,
          response,
          responseDoc
        );
        const source = responseDoc.FileRef.Value();
        const dest = roResponseDocROFolderPath + "/" + newResponseDocFileName;
        await appContext.utilities.copyFileAsync(source, dest);
        const newRoFileResults = await appContext.AuditResponseDocsRO.FindByColumnValue(
          [{ column: "FileRef", value: dest }],
          {},
          { count: 1 }
        );
        const newRoFile = newRoFileResults.results[0] ?? null;
        if (!newRoFile)
          return;
        newRoFile.markApprovedForRO(request2, response);
        await appContext.AuditResponseDocsRO.UpdateEntity(
          newRoFile,
          AuditResponseDocRO.Views.ApprovedForROUpdate
        );
        responseDoc.markApprovedForRO(newResponseDocFileName);
        await appContext.AuditResponseDocs.UpdateEntity(responseDoc, [
          "DocumentStatus",
          "RejectReason",
          "FileLeafRef"
        ]);
        responseLogBody += `<li><a href="${window.location.origin + newRoFile.FileRef}" target="_blank">${newResponseDocFileName}</a></li>`;
      })
    );
    roEmailLogItem.ResponseCount = cntApprovedResponseDocs;
    roEmailLogItem.Responses += responseLogBody;
    await appContext.AuditROEmailsLog.UpdateEntity(roEmailLogItem, [
      "Responses",
      "ResponseCount"
    ]);
    return true;
  }

  // src/services/audit_email_service.js
  init_application_db_context();

  // src/services/permission_manager.js
  init_entities2();
  init_entities();
  init_application_db_context();
  init_store();
  init_infrastructure();
  init_people_manager();

  // src/value_objects/task.js
  var taskStates = {
    pending: "Pending",
    aging: "Aging",
    completed: "Completed"
  };
  var Task = class {
    constructor({ msg, blocking }) {
      this.msg = msg;
      this.blocking = blocking;
      this.Status(taskStates.pending);
    }
    msg;
    blocking;
    Status = ko.observable();
    timeout = window.setTimeout(() => {
      console.warn("this task is aging:", this);
      this.Status(taskStates.aging);
    }, 5e3);
    markComplete = () => {
      window.clearTimeout(this.timeout);
      this.Status(taskStates.completed);
    };
    // Should this task block user input?
    IsBlocking = ko.pureComputed(
      () => this.blocking && this.Status() != taskStates.completed
    );
  };
  var ProgressTask = class _ProgressTask {
    constructor({ msg, blocking }) {
      this.msg = msg;
      this.blocking = blocking;
      this.Status(taskStates.pending);
    }
    msg;
    blocking;
    Status = ko.observable();
    updateProgress = ({ percentDone }) => {
      this.Status(`${parseInt(percentDone * 100)}%`);
    };
    setTimeout = () => window.setTimeout(() => {
      console.warn("this task is aging:", this);
      this.Status(`${this.Status()} (${taskStates.aging})`);
    }, 5e4);
    resetTimeout = () => {
      window.clearTimeout(this.timeout);
      this.timeout = this.setTimeout();
    };
    timeout = this.setTimeout();
    markComplete = () => {
      window.clearTimeout(this.timeout);
      this.Status(taskStates.completed);
    };
    // Should this task block user input?
    IsBlocking = ko.pureComputed(
      () => this.blocking && this.Status() != taskStates.completed
    );
    static Create(params) {
      return new _ProgressTask(params);
    }
  };

  // src/services/tasks.js
  var runningTasks = ko.observableArray();
  var blockingTasks = ko.pureComputed(() => {
    return runningTasks().filter((task) => task.IsBlocking()) ?? [];
  });
  var TaskDef = class {
    constructor(msg, blocking = false, type = null) {
      this.msg = msg;
      this.blocking = blocking;
      this.type = type;
    }
    msg;
    blocking;
    type;
  };
  var taskDefs = {
    init: { msg: "Initializing the Application", blocking: true },
    save: { msg: "Saving Request", blocking: true },
    newRequest: { msg: "Processing New Request", blocking: true },
    cancelAction: { msg: "Cancelling Action", blocking: true },
    view: { msg: "Viewing Request", blocking: false },
    refresh: { msg: "Refreshing Request", blocking: false },
    permissionsRequest: {
      msg: "Updating Request Item Permissions",
      blocking: true
    },
    permissionsResponse: (responseTitle) => {
      return {
        msg: "Updating Response Item Permissions: " + responseTitle,
        blocking: true
      };
    },
    permissionsResponseFolder: (responseTitle) => {
      return {
        msg: "Updating Response Folder Item Permissions: " + responseTitle,
        blocking: true
      };
    },
    permissionsResponseAndFolder: (responseTitle) => {
      return {
        msg: "Updating Response and Folder Item Permissions: " + responseTitle,
        blocking: true
      };
    },
    permissionsEmailFolder: {
      msg: "Updating Email Folder Permissions",
      blocking: true
    },
    permissionsCoversheet: (coversheetName) => {
      return {
        msg: "Updating Coversheet Permissions: " + coversheetName,
        blocking: true
      };
    },
    ensurePagePermissions: (page) => new TaskDef("Ensuring Page Permissions: " + page),
    resetPagePermissions: (page) => new TaskDef("Resetting Page Permissions: " + page, true),
    ensureListPermissions: (entitySet) => new TaskDef("Ensuring List Permissions: " + entitySet.ListDef.title),
    resetListPermissions: (entitySet) => new TaskDef("Resetting List Permissions: " + entitySet.ListDef.title, true),
    deleteEmailFolder: { msg: "Deleting Email Folder", blocking: true },
    newResponse: (responseTitle) => {
      return {
        msg: "Submitting new Response: " + responseTitle,
        blocking: true
      };
    },
    updateResponse: (responseTitle) => {
      return {
        msg: "Updating Response: " + responseTitle,
        blocking: true
      };
    },
    deleteResponse: (responseTitle) => {
      return {
        msg: "Deleting Response: " + responseTitle,
        blocking: true
      };
    },
    closeResponse: (responseTitle) => {
      return {
        msg: "Closing Response: " + responseTitle,
        blocking: true
      };
    },
    uploadResponseDoc: (responseDocTitle) => {
      return {
        msg: "Uploading Response Document: " + responseDocTitle,
        blocking: true,
        type: ProgressTask
      };
    },
    updateResponseDoc: (responseDocTitle) => {
      return {
        msg: "Updating Response Document: " + responseDocTitle,
        blocking: true
      };
    },
    approveResponseDoc: (responseDocTitle) => {
      return {
        msg: "Approving Response Document: " + responseDocTitle,
        blocking: true
      };
    },
    deleteResponseDocFolder: (responseTitle) => {
      return {
        msg: "Deleting Response Document Folder: " + responseTitle,
        blocking: true
      };
    },
    uploadCoversheet: (coversheetName) => {
      return {
        msg: "Uploading Coversheet: " + coversheetName,
        blocking: true,
        type: ProgressTask
      };
    },
    updateCoversheet: (coversheetName) => {
      return {
        msg: "Updating Coversheet: " + coversheetName,
        blocking: true
      };
    },
    deleteCoversheet: (coversheetName) => {
      return {
        msg: "Deleting Coversheet: " + coversheetName,
        blocking: true
      };
    },
    deleteRequestInternalItem: {
      msg: "Deleting Request Internal Item",
      blocking: true
    },
    newComment: { msg: "Submitting Comment", blocking: false },
    refreshComments: { msg: "Refreshing Comments", blocking: false },
    notifyComment: { msg: "Sending Comment Email", blocking: false },
    removeComment: { msg: "Removing Comment", blocking: false },
    newAction: { msg: "Submitting Action", blocking: false },
    refreshActions: { msg: "Refreshing Actions", blocking: false },
    newAttachment: { msg: "Submitting Attachment", blocking: false },
    refreshAttachments: { msg: "Refreshing Attachments", blocking: false },
    approve: { msg: "Approving Request", blocking: true },
    lock: { msg: "Locking Request", blocking: true },
    closing: { msg: "Closing Request", blocking: true }
  };
  var addTask = (taskDef) => {
    let newTask;
    if (taskDef.type) {
      newTask = taskDef.type.Create(taskDef);
    } else {
      newTask = new Task(taskDef);
    }
    runningTasks.push(newTask);
    return newTask;
  };
  var finishTask = function(activeTask) {
    if (activeTask) {
      activeTask.markComplete();
      window.setTimeout(() => removeTask(activeTask), 3e3);
    }
  };
  var removeTask = function(taskToRemove) {
    runningTasks.remove(taskToRemove);
  };

  // src/services/permission_manager.js
  var roleNames = {
    FullControl: "Full Control",
    Design: "Design",
    Edit: "Edit",
    Contribute: "Contribute",
    Read: "Read",
    LimitedAccess: "Limited Access",
    RestrictedRead: "Restricted Read",
    RestrictedContribute: "Restricted Contribute",
    InitialCreate: "Initial Create"
  };
  function ensureAllAppPerms() {
    ensureAllPagePerms();
    ensureAllListPermissions();
  }
  function ensureAllPagePerms() {
    ensureDBPermissions();
    [
      "AuditBulkAddResponse.aspx",
      "AuditBulkEditResponse.aspx",
      "AuditPermissions.aspx",
      "AuditReport_RequestsStatus.aspx",
      "AuditReturnedResponses.aspx",
      "AuditUnSubmittedResponseDocuments.aspx",
      "AuditUpdateSiteGroups.aspx"
    ].map((page) => ensurePagePerms(page, []));
  }
  function ensureDBPermissions() {
    const aos = auditOrganizationStore().filter(
      (ao) => ao.Role != ORGROLES.REQUESTINGOFFICE
    );
    ensurePagePerms("AO_DB.aspx", aos);
    const ros = auditOrganizationStore().filter(
      (ao) => ao.Role == ORGROLES.REQUESTINGOFFICE
    );
    ensurePagePerms("RO_DB.aspx", ros);
    const qas = auditOrganizationStore().filter(
      (ao) => ao.Role == ORGROLES.QUALITYASSURANCE
    );
    ensurePagePerms("QA_DB.aspx", qas);
    const sps = auditOrganizationStore().filter(
      (ao) => ao.Role == ORGROLES.SPECIALPERMISSIONS
    );
    ensurePagePerms("SP_DB.aspx", sps);
  }
  async function ensurePagePerms(pageTitle, orgs) {
    const ensurePageTask = addTask(taskDefs.ensurePagePermissions(pageTitle));
    const pageResults = await appContext.Pages.FindByColumnValue(
      [{ column: "FileLeafRef", value: pageTitle }],
      {},
      { count: 1, includePermissions: true }
    );
    const page = pageResults.results[0] ?? null;
    if (!page) {
      console.warn(
        "Unable to ensure page permissions. Page not found: " + pageTitle,
        orgs
      );
      finishTask(ensurePageTask);
      return;
    }
    let reset = false;
    if (!page.HasUniqueRoleAssignments) {
      reset = true;
    }
    if (!reset) {
      const principalIds = page.RoleAssignments.results.map(
        (role) => role.PrincipalId
      );
      reset = orgs.find((org) => {
        const orgId = org.UserGroup?.ID;
        return !principalIds.includes(orgId);
      }) ? true : false;
    }
    if (reset) {
      const resetPageTask = addTask(taskDefs.resetPagePermissions(pageTitle));
      const { owners, members, visitors } = getSiteGroups();
      const baseRoles = [
        new Role({
          principal: owners,
          roleDefs: [new RoleDef({ name: roleNames.FullControl })]
        }),
        new Role({
          principal: members,
          roleDefs: [new RoleDef({ name: roleNames.RestrictedRead })]
        }),
        new Role({
          principal: visitors,
          roleDefs: [new RoleDef({ name: roleNames.RestrictedRead })]
        })
      ];
      const newRoles = orgs.map((org) => {
        return new Role({
          principal: org.UserGroup,
          roleDefs: [{ name: roleNames.RestrictedRead }]
        });
      });
      const newPerms = new ItemPermissions({
        hasUniqueRoleAssignments: true,
        roles: [...newRoles, ...baseRoles]
      });
      console.warn("Resetting Page Perms: ", pageTitle);
      await appContext.Pages.SetItemPermissions(page, newPerms, true);
      finishTask(resetPageTask);
    }
    finishTask(ensurePageTask);
  }
  function getPeopleByOrgRole(orgType) {
    return auditOrganizationStore().filter((ao) => ao.Role == orgType && ao.UserGroup).map((ao) => new People2(ao.UserGroup));
  }
  function ensureAllListPermissions() {
    const { owners, members, visitors } = getSiteGroups();
    const baseRoles = [
      new Role({
        principal: owners,
        roleDefs: [new RoleDef({ name: roleNames.FullControl })]
      }),
      new Role({
        principal: members,
        roleDefs: [new RoleDef({ name: roleNames.Contribute })]
      }),
      new Role({
        principal: visitors,
        roleDefs: [new RoleDef({ name: roleNames.RestrictedRead })]
      })
    ];
    const qaRestrictedContributeRoles = getPeopleByOrgRole(
      ORGROLES.QUALITYASSURANCE
    ).map(
      (principal) => new Role({
        principal,
        roleDefs: [new RoleDef({ name: roleNames.RestrictedContribute })]
      })
    );
    const qaRestrictedReadRoles = getPeopleByOrgRole(
      ORGROLES.QUALITYASSURANCE
    ).map(
      (principal) => new Role({
        principal,
        roleDefs: [new RoleDef({ name: roleNames.RestrictedRead })]
      })
    );
    const roRestrictedReadRoles = getPeopleByOrgRole(
      ORGROLES.REQUESTINGOFFICE
    ).map(
      (principal) => new Role({
        principal,
        roleDefs: [new RoleDef({ name: roleNames.RestrictedRead })]
      })
    );
    const setPerms = [
      {
        entitySet: appContext.AuditBulkRequests,
        permissions: new ItemPermissions({
          hasUniqueRoleAssignments: true,
          roles: baseRoles
        })
      },
      {
        entitySet: appContext.AuditBulkResponses,
        permissions: new ItemPermissions({
          hasUniqueRoleAssignments: true,
          roles: baseRoles
        })
      },
      {
        entitySet: appContext.AuditResponseDocsRO,
        permissions: new ItemPermissions({
          hasUniqueRoleAssignments: true,
          roles: [...baseRoles, ...qaRestrictedContributeRoles]
        })
      },
      {
        entitySet: appContext.AuditRequests,
        permissions: new ItemPermissions({
          hasUniqueRoleAssignments: true,
          roles: baseRoles
        })
      },
      {
        entitySet: appContext.AuditRequestsInternals,
        permissions: new ItemPermissions({
          hasUniqueRoleAssignments: true,
          roles: [...baseRoles, ...qaRestrictedReadRoles]
        })
      },
      {
        entitySet: appContext.AuditROEmailsLog,
        permissions: new ItemPermissions({
          hasUniqueRoleAssignments: true,
          roles: [...baseRoles, ...qaRestrictedContributeRoles]
        })
      }
    ];
    setPerms.map(async (setPerm) => {
      const ensureListTask = addTask(
        taskDefs.ensureListPermissions(setPerm.entitySet)
      );
      await ensureEntitySetPerms(setPerm);
      finishTask(ensureListTask);
    });
  }
  async function ensureEntitySetPerms({ entitySet, permissions }) {
    const curPerms = await entitySet.GetRootPermissions();
    if (!curPerms.hasUniqueRoleAssignments) {
      await resetEntitySetPerms(
        entitySet,
        permissions,
        true,
        "List Inherits Permissions"
      );
      return;
    }
    const missingPermission = permissions.roles.find((newRole) => {
      const existingRole = curPerms.roles.find(
        (curRole) => curRole.principal.ID == newRole.principal.ID
      );
      if (!existingRole)
        return true;
      const curRoleDefNames = existingRole.roleDefs.map(
        (roleDef) => roleDef.name
      );
      return newRole.roleDefs.find(
        (roleDef) => !curRoleDefNames.includes(roleDef.name)
      );
    });
    if (!missingPermission)
      return;
    await resetEntitySetPerms(entitySet, permissions, false, {
      "Missing Permissions": missingPermission
    });
  }
  async function resetEntitySetPerms(entitySet, permissions, reset, reason) {
    const resetEntitySetPermsTask = addTask(
      taskDefs.resetListPermissions(entitySet)
    );
    console.warn("Resetting EntitySet Permissions: " + entitySet.ListDef.title, {
      entitySet,
      permissions,
      reason
    });
    await entitySet.SetRootPermissions(permissions, reset);
    finishTask(resetEntitySetPermsTask);
  }

  // src/services/audit_email_service.js
  init_people_manager();
  init_infrastructure();
  init_audit_ro_email_log();
  async function ensureROEmailFolder() {
    const folderResults = await appContext.AuditEmails.FindByColumnValue(
      [{ column: "Title", value: "RONotifications" }],
      {},
      { count: 1, includeFolders: true },
      ["ID", "Title"]
    );
    const folder = folderResults.results[0] ?? null;
    if (folder)
      return;
    const newFolderId = await appContext.AuditEmails.UpsertFolderPath(
      "RONotifications"
    );
    const { owners, members, visitors } = getSiteGroups();
    let qaGroup2 = await getQAGroup();
    const newPermissions = new ItemPermissions({
      hasUniqueRoleAssignments: true,
      roles: []
    });
    newPermissions.addPrincipalRole(owners, roleNames.FullControl);
    newPermissions.addPrincipalRole(members, roleNames.Contribute);
    newPermissions.addPrincipalRole(visitors, roleNames.RestrictedRead);
    newPermissions.addPrincipalRole(qaGroup2, roleNames.RestrictedContribute);
    await appContext.AuditEmails.SetItemPermissions(
      { ID: newFolderId },
      newPermissions,
      true
    );
  }
  async function ensureRequestROEmailLogItem(requestingOffice) {
    if (!requestingOffice?.ID)
      return;
    const logItemTitle = (/* @__PURE__ */ new Date()).format("MM/dd/yyyy");
    const emailLogResult = await appContext.AuditROEmailsLog.FindByColumnValue(
      [
        { column: "Title", value: logItemTitle },
        { column: "RequestingOfficeId", value: requestingOffice.ID }
      ],
      {},
      { count: 1, includeFolders: true }
    );
    const auditRoEmailLogItem = emailLogResult?.results[0] ?? null;
    if (auditRoEmailLogItem)
      return auditRoEmailLogItem;
    const newLogItem = new AuditROEmailLog();
    newLogItem.Title = logItemTitle;
    newLogItem.RequestingOffice = requestingOffice;
    await appContext.AuditROEmailsLog.AddEntity(newLogItem);
    return newLogItem;
  }

  // src/services/audit_request_service.js
  init_application_db_context();
  init_people_manager();
  init_infrastructure();
  init_entities2();
  init_entities();

  // src/services/coversheet_manager.js
  init_application_db_context();
  init_people_manager();
  init_infrastructure();
  init_entities();
  init_entities2();
  async function uploadRequestCoversheetFile(file, request2, actionOffices = []) {
    let fileName = file.name;
    const reqNum = request2.ReqNum.Value();
    if (!fileName.includes(reqNum))
      fileName = reqNum + "_" + fileName;
    const newFileName = getNewFileNameForSensitivity(
      fileName,
      null,
      request2.Sensitivity.Value()
    );
    const uploadCoversheetTask = addTask(taskDefs.uploadCoversheet(newFileName));
    const title = newFileName.substring(0, newFileName.lastIndexOf("."));
    const fileMetadata = {
      Title: title,
      ReqNumId: request2.ID,
      ActionOfficeId: actionOffices.map((ao) => ao.ID)
    };
    const newCoversheet = await appContext.AuditCoversheets.UploadFileToFolderAndUpdateMetadata(
      file,
      newFileName,
      "",
      fileMetadata,
      ({ currentBlock, totalBlocks }) => uploadCoversheetTask.updateProgress({
        percentDone: currentBlock / totalBlocks
      })
    );
    await breakCoversheetPermissions(newCoversheet);
    finishTask(uploadCoversheetTask);
    return newCoversheet;
  }
  async function deleteRequestCoversheetById(coversheetId) {
    const coversheet = await appContext.AuditCoversheets.FindById(coversheetId);
    return deleteRequestCoversheet(coversheet);
  }
  async function deleteRequestCoversheet(coversheet) {
    const deleteItemTask = addTask(
      taskDefs.deleteCoversheet(coversheet.FileName.toString())
    );
    await appContext.AuditCoversheets.RemoveEntityById(coversheet.ID);
    finishTask(deleteItemTask);
  }
  async function updateRequestCoverSheet(coverSheet) {
    const request2 = coverSheet.ReqNum.Value();
    if (!request2)
      throw new Error("ReqNum not set!");
    const updateCoversheetTask = addTask(
      taskDefs.updateCoversheet(coverSheet.FileName.Value())
    );
    let fileName = coverSheet.FileName.Value();
    if (!fileName.includes(request2.ReqNum.Value())) {
      fileName = request2.ReqNum.Value() + "_" + fileName;
      coverSheet.FileName.Value(fileName);
    }
    await appContext.AuditCoversheets.UpdateEntity(
      coverSheet,
      AuditCoversheet.Views.AOCanUpdate
    );
    finishTask(updateCoversheetTask);
  }
  function getNewFileNameForSensitivity(fileName, oldSensitivity, requestSensitivity) {
    let newFileName = "";
    var curDocFileNameAndExt = fileName;
    var curDocFileName = curDocFileNameAndExt.substring(
      0,
      curDocFileNameAndExt.lastIndexOf(".")
    );
    var curDocExt = curDocFileNameAndExt.replace(curDocFileName, "");
    newFileName = curDocFileName;
    if (oldSensitivity != null && oldSensitivity != "") {
      if (curDocFileName.endsWith("_" + oldSensitivity)) {
        newFileName = newFileName.replace("_" + oldSensitivity, "");
      }
    }
    if (requestSensitivity != null && requestSensitivity != "" && requestSensitivity != "None") {
      if (!curDocFileName.endsWith("_" + requestSensitivity))
        newFileName = newFileName + "_" + requestSensitivity;
    }
    return newFileName + curDocExt;
  }
  async function breakCoversheetPermissions(coversheet, grantQARead) {
    const breakCoversheetPermsTask = addTask(
      taskDefs.permissionsCoversheet(coversheet.FileName.Value())
    );
    const curPerms = await appContext.AuditCoversheets.GetItemPermissions(
      coversheet
    );
    const defaultGroups = await getSiteGroups();
    const qaGroup2 = await getQAGroup();
    let qaHasRead = curPerms.principalHasPermissionKind(
      qaGroup2,
      SP.PermissionKind.viewListItems
    );
    const { specialPermGroup1, specialPermGroup2 } = await getSpecialPermGroups();
    let special1HasRead = curPerms.principalHasPermissionKind(
      specialPermGroup1,
      SP.PermissionKind.viewListItems
    );
    let special2HasRead = curPerms.principalHasPermissionKind(
      specialPermGroup2,
      SP.PermissionKind.viewListItems
    );
    if (!curPerms.hasUniqueRoleAssignments) {
      special1HasRead = false;
      special2HasRead = false;
      qaHasRead = false;
    }
    const newPerms = new ItemPermissions({
      hasUniqueRoleAssignments: true,
      roles: []
    });
    newPerms.addPrincipalRole(defaultGroups.owners, roleNames.FullControl);
    newPerms.addPrincipalRole(defaultGroups.members, roleNames.Contribute);
    newPerms.addPrincipalRole(defaultGroups.visitors, roleNames.RestrictedRead);
    if (qaHasRead || grantQARead) {
      newPerms.addPrincipalRole(qaGroup2, roleNames.RestrictedRead);
    }
    if (special1HasRead) {
      newPerms.addPrincipalRole(specialPermGroup1, roleNames.RestrictedRead);
    }
    if (special2HasRead) {
      newPerms.addPrincipalRole(specialPermGroup2, roleNames.RestrictedRead);
    }
    const actionOffices = coversheet.ActionOffice.Value();
    actionOffices.map(
      (ao) => newPerms.addPrincipalRole(
        new People2(ao.UserGroup),
        roleNames.RestrictedRead
      )
    );
    await appContext.AuditCoversheets.SetItemPermissions(
      coversheet,
      newPerms,
      true
    );
    finishTask(breakCoversheetPermsTask);
  }

  // src/services/audit_request_service.js
  init_store();
  async function getRequestById(id2) {
    return await appContext.AuditRequests.FindById(id2);
  }
  async function getRequestByTitle(title) {
    const requestResults = await appContext.AuditRequests.FindByColumnValue(
      [{ column: "Title", value: title }],
      {},
      { count: 1 }
    );
    return requestResults.results[0] ?? null;
  }
  async function addNewRequest(request2) {
    const fields = request2.FieldMap;
    const existingRequests = await appContext.AuditRequests.FindByColumnValue(
      [{ column: "Title", value: fields.Title.Value() }],
      {},
      { count: 1 }
    );
    if (existingRequests.results.length) {
      throw new Error("Request with this name already exists!");
    }
    request2.FieldMap.EmailActionOffice.Value(
      request2.FieldMap.ActionOffice.Value()
    );
    await appContext.AuditRequests.AddEntity(request2);
  }
  async function updateRequest(request2) {
    await appContext.AuditRequests.UpdateEntity(
      request2,
      AuditRequest.Views.IACanUpdate
    );
  }
  async function deleteRequest(requestId) {
    const request2 = await appContext.AuditRequests.FindById(requestId);
    if (!request2) {
      alert("Could not find request: ", requestId);
    }
    const requestTitle = request2.ReqNum.Value();
    const promises = [];
    const coversheets = await getRequestCoversheets(request2);
    coversheets.map((coversheet) => {
      promises.push(deleteRequestCoversheet(coversheet));
    });
    promises.push(
      new Promise(async (resolve) => {
        const deleteItemTask = addTask(taskDefs.deleteEmailFolder);
        await appContext.AuditEmails.RemoveFolderByPath(requestTitle);
        finishTask(deleteItemTask);
        resolve();
      })
    );
    const responses = await getRequestResponses(request2);
    responses.map((response) => {
      promises.push(deleteResponseAndFolder(response));
    });
    const requestInternalItem = await getRequestInternalItem(requestId);
    if (requestInternalItem) {
      promises.push(
        new Promise(async (resolve) => {
          const deleteItemTask = addTask(taskDefs.deleteRequestInternalItem);
          await appContext.AuditRequestsInternals.RemoveEntityById(
            requestInternalItem.ID
          );
          finishTask(deleteItemTask);
          resolve();
        })
      );
    }
    await Promise.all(promises);
    await appContext.AuditRequests.RemoveEntityById(requestId);
    return true;
  }
  async function ensureRequestAuditResponseDocsROFolder(reqNum, requestingOfficeId) {
    const roFolderResults = await appContext.AuditResponseDocsRO.FindByColumnValue(
      [{ column: "FileLeafRef", value: reqNum }],
      {},
      { count: 1, includeFolders: true }
    );
    const roFolder = roFolderResults.results[0] ?? null;
    if (roFolder)
      return roFolder.FileRef;
    const requestingOffice = auditOrganizationStore().find(
      (ao) => ao.ID == requestingOfficeId
    );
    const newRoFolderId = await appContext.AuditResponseDocsRO.UpsertFolderPath(
      reqNum
    );
    const { owners, members, visitors } = getSiteGroups();
    const qaGroup2 = await getQAGroup();
    const newPermissions = new ItemPermissions({
      hasUniqueRoleAssignments: true,
      roles: []
    });
    newPermissions.addPrincipalRole(owners, roleNames.FullControl);
    newPermissions.addPrincipalRole(members, roleNames.Contribute);
    newPermissions.addPrincipalRole(visitors, roleNames.RestrictedRead);
    newPermissions.addPrincipalRole(qaGroup2, roleNames.RestrictedContribute);
    newPermissions.addPrincipalRole(
      requestingOffice.UserGroup,
      roleNames.RestrictedRead
    );
    await appContext.AuditResponseDocsRO.SetItemPermissions(
      { ID: newRoFolderId },
      newPermissions,
      true
    );
    const newFolderEntity = await appContext.AuditResponseDocsRO.FindById(
      newRoFolderId
    );
    return newFolderEntity.FileRef;
  }
  async function onAddNewRequest(request2) {
    await Promise.all([
      ensureRequestPermissions(request2),
      ensureAuditEmailFolder(request2),
      ensureRequestInternalItem(request2)
    ]);
  }
  async function ensureAuditEmailFolder(request2) {
    const newFolderId = await appContext.AuditEmails.UpsertFolderPath(
      request2.ReqNum.Value()
    );
    const newItemPermissions = new ItemPermissions({
      hasUniqueRoleAssignments: true,
      roles: []
    });
    const { owners, members, visitors } = await getSiteGroups();
    const qaGroup2 = await getPeopleByUsername(
      Audit.Common.Utilities.GetGroupNameQA()
    );
    newItemPermissions.addPrincipalRole(owners, roleNames.FullControl);
    newItemPermissions.addPrincipalRole(members, roleNames.RestrictedContribute);
    newItemPermissions.addPrincipalRole(visitors, roleNames.RestrictedRead);
    newItemPermissions.addPrincipalRole(qaGroup2, roleNames.RestrictedContribute);
    const actionOffices = request2.FieldMap.ActionOffice.Value();
    actionOffices.map((ao) => {
      newItemPermissions.addPrincipalRole(
        ao.UserGroup,
        roleNames.RestrictedContribute
      );
    });
    const result = await appContext.AuditEmails.SetItemPermissions(
      { ID: newFolderId },
      newItemPermissions,
      true
    );
  }
  async function ensureRequestPermissions(request2) {
    const perms = await appContext.AuditRequests.GetItemPermissions(request2);
    if (!perms.hasUniqueRoleAssignments) {
      if (window.DEBUG)
        console.log("Request does not have unique permissions");
      await breakRequestPermissions(request2);
    }
  }
  async function ensureRequestInternalItem(request2) {
    const requestInternalResult = getRequestInternalItem(request2);
    if (requestInternalResult)
      return requestInternalResult;
    const requestInternal = new AuditRequestsInternal();
    requestInternal.ReqNum.Value(request2);
    await appContext.AuditRequestsInternals.AddEntity(requestInternal);
    return requestInternal;
  }
  async function breakRequestPermissions(request2, responseStatus) {
    const curPerms = await appContext.AuditRequests.GetItemPermissions(request2);
    const defaultGroups = await getSiteGroups();
    const qaGroup2 = await getPeopleByUsername(
      Audit.Common.Utilities.GetGroupNameQA()
    );
    const qaHasRead = curPerms.principalHasPermissionKind(
      qaGroup2,
      SP.PermissionKind.viewListItems
    );
    const special1Group = await getPeopleByUsername(
      Audit.Common.Utilities.GetGroupNameSpecialPerm1()
    );
    const special2Group = await getPeopleByUsername(
      Audit.Common.Utilities.GetGroupNameSpecialPerm2()
    );
    const special1HasRead = curPerms.principalHasPermissionKind(
      special1Group,
      SP.PermissionKind.viewListItems
    );
    const special2HasRead = curPerms.principalHasPermissionKind(
      special2Group,
      SP.PermissionKind.viewListItems
    );
    const newRequestPermissions = new ItemPermissions({
      hasUniqueRoleAssignments: true,
      roles: []
    });
    newRequestPermissions.addPrincipalRole(
      defaultGroups.owners,
      roleNames.FullControl
    );
    newRequestPermissions.addPrincipalRole(
      defaultGroups.members,
      roleNames.Contribute
    );
    newRequestPermissions.addPrincipalRole(
      defaultGroups.visitors,
      roleNames.RestrictedRead
    );
    if (qaHasRead || responseStatus == AuditResponseStates.ApprovedForQA) {
      newRequestPermissions.addPrincipalRole(qaGroup2, roleNames.RestrictedRead);
    }
    if (special1HasRead) {
      newRequestPermissions.addPrincipalRole(
        special1Group,
        roleNames.RestrictedRead
      );
    }
    if (special2HasRead) {
      newRequestPermissions.addPrincipalRole(
        special2Group,
        roleNames.RestrictedRead
      );
    }
    const actionOffices = request2.FieldMap.ActionOffice.Value();
    actionOffices.map(
      (ao) => newRequestPermissions.addPrincipalRole(
        new People2(ao.UserGroup),
        roleNames.RestrictedRead
      )
    );
    await appContext.AuditRequests.SetItemPermissions(
      request2,
      newRequestPermissions,
      true
    );
  }
  async function getRequestInternalItem(request2) {
    const requestInternalResult = await appContext.AuditRequestsInternals.FindByColumnValue(
      [{ column: "ReqNum", op: "eq", value: request2.ID }],
      {},
      {}
    );
    if (requestInternalResult.results.length) {
      if (requestInternalResult.results.length > 1) {
        console.error(
          requestInternalResult.results.length + " internal items!",
          request2
        );
      }
      return requestInternalResult.results[0];
    }
    return;
  }
  async function getRequestCoversheets(request2) {
    const coversheetsResult = await appContext.AuditCoversheets.FindByColumnValue(
      [{ column: "ReqNum", value: request2.ID }],
      {},
      {}
    );
    return coversheetsResult.results;
  }
  async function getRequestResponses(request2) {
    const responsesResult = await appContext.AuditResponses.FindByColumnValue(
      [{ column: "ReqNum", value: request2.ID }],
      {},
      { includePermissions: true }
    );
    return responsesResult.results;
  }
  async function getRequestResponseDocs(request2) {
    const responsesResult = await appContext.AuditResponseDocs.FindByColumnValue(
      [{ column: "ReqNum", value: request2.ID }],
      {},
      { includePermissions: true }
    );
    return responsesResult.results;
  }

  // src/services/audit_response_service.js
  init_entities2();
  init_application_db_context();
  async function addResponse(request2, response) {
    const responseTitle = getResponseTitle(request2, response);
    const newResponseTask = addTask(taskDefs.newResponse(responseTitle));
    response.Title.Value(responseTitle);
    response.ResStatus.Value(AuditResponseStates.Open);
    try {
      const responseResult = await appContext.AuditResponses.FindByColumnValue(
        [
          {
            column: "Title",
            value: responseTitle
          }
        ],
        {},
        { count: 1 }
      );
      if (responseResult.results.length) {
        throw new Error(`Response with title ${responseTitle} already exists!`);
      }
      await appContext.AuditResponses.AddEntity(response);
    } catch (e) {
      console.error("Error adding Response: ", e);
      alert(e.message);
    } finally {
      finishTask(newResponseTask);
    }
  }
  async function updateResponse(request2, response) {
    const updateResponseTask = addTask(
      taskDefs.updateResponse(response.Title.Value())
    );
    try {
      const actionOfficeTitle = response.ActionOffice.Value()?.Title?.toLowerCase();
      if (!actionOfficeTitle.includes("fpra")) {
        if (response.POC.toString() || response.POCCC.toString()) {
          throw new Error(
            "Only FPRA Responses can have designated POC and POC CC fields."
          );
        }
      }
      const currentResponseSensitivity = request2.Sensitivity.Value();
      const selectedResponseStatus = response.ResStatus.Value();
      if (selectedResponseStatus == AuditResponseStates.ApprovedForQA && currentResponseSensitivity == "None") {
        throw new Error("Request Sensitivity not set; cannot submit to QA.");
      }
      const responseTitle = getResponseTitle(request2, response);
      if (response.Title.Value() != responseTitle)
        response.Title.Value(responseTitle);
      await appContext.AuditResponses.UpdateEntity(
        response,
        AuditResponse.Views.IACanUpdate
      );
    } catch (e) {
      console.error("Error Updating Response: ", e);
      alert(e.message);
    } finally {
      finishTask(updateResponseTask);
    }
  }
  async function deleteResponseAndFolder2(response) {
    const responseTitle = response.Title.Value();
    const deleteFolderTask = addTask(
      taskDefs.deleteResponseDocFolder(responseTitle)
    );
    await appContext.AuditResponseDocs.RemoveFolderByPath(responseTitle);
    finishTask(deleteFolderTask);
    const deleteItemTask = addTask(taskDefs.deleteResponse(responseTitle));
    await appContext.AuditResponses.RemoveEntityById(response.ID);
    finishTask(deleteItemTask);
    return;
  }
  async function updateResponseDoc(request2, response, responseDoc) {
    const updateResponseDocTask = addTask(
      taskDefs.updateResponseDoc(responseDoc.Title.Value())
    );
    await appContext.AuditResponseDocs.UpdateEntity(
      responseDoc,
      AuditResponseDoc.Views.AOCanUpdate
    );
    finishTask(updateResponseDocTask);
  }
  async function closeResponseById(responseId) {
    const response = await appContext.AuditResponses.FindById(responseId);
    if (!response)
      return;
    return closeResponse(response);
  }
  async function closeResponse(response) {
    const closeResponseTask = addTask(
      taskDefs.closeResponse(response.Title.Value())
    );
    response.markClosed();
    await appContext.AuditResponses.UpdateEntity(
      response,
      AuditResponse.Views.IAUpdateClosed
    );
    finishTask(closeResponseTask);
  }
  async function uploadResponseDocFile(response, file) {
    const uploadResponseDocTask = addTask(taskDefs.uploadResponseDoc(file.name));
    const fileMetadata = {
      Title: file.name,
      ReqNumId: response.ReqNum.Value().ID,
      ResIDId: response.ID
    };
    await appContext.AuditResponseDocs.UploadFileToFolderAndUpdateMetadata(
      file,
      file.name,
      response.Title.Value(),
      fileMetadata,
      ({ currentBlock, totalBlocks }) => uploadResponseDocTask.updateProgress({
        percentDone: currentBlock / totalBlocks
      })
    );
    finishTask(uploadResponseDocTask);
  }
  function getResponseTitle(request2, response) {
    return `${request2.ReqNum.Value()}-${response.ActionOffice.Value()?.Title}-${response.SampleNumber.Value()}`;
  }
  function getNewResponseDocTitle(request2, response, responseDoc) {
    const oldResponseDocTitle = responseDoc.FileName.Value();
    const createdDate = responseDoc.Created.Value().format("yyyyMMddTHHmmss");
    const responseName = response.Title.Value();
    const sensitivity = request2.Sensitivity.Value();
    let newResponseDocTitle = responseName + "_" + createdDate + "_" + Math.ceil(Math.random() * 1e4);
    if (sensitivity && sensitivity != "None")
      newResponseDocTitle += "_" + sensitivity;
    var docName = oldResponseDocTitle.substring(
      0,
      oldResponseDocTitle.lastIndexOf(".")
    );
    var docExt = oldResponseDocTitle.replace(docName, "");
    newResponseDocTitle += docExt;
    if (!oldResponseDocTitle.includes(responseName) || !oldResponseDocTitle.includes(createdDate) || sensitivity && !oldResponseDocTitle.includes(sensitivity))
      return newResponseDocTitle;
    return oldResponseDocTitle;
  }

  // src/services/index.js
  init_people_manager();

  // src/components/forms/request/new_form/new_request_form.js
  init_store();
  init_infrastructure();

  // src/components/forms/request/new_form/NewRequestFormTemplate.js
  init_infrastructure();
  var newRequestFormTemplate = html4`
  <div class="audit-form bg-dark new-request-form">
    <div class="form-fields" data-bind="foreach: FormFields">
      <div
        class="form-field-component"
        data-bind="component: 
        {name: components.edit, params: $data}, 
        class: classList"
      ></div>
    </div>
    <div class="form-actions">
      <button type="button" class="btn btn-warn" data-bind="click: clearForm">
        Clear Form
      </button>
      <button
        type="button"
        class="btn btn-success"
        data-bind="click: clickSubmit"
      >
        Create Request
      </button>
    </div>
  </div>
`;

  // src/components/forms/request/new_form/new_request_form.js
  var newRequestFormComponentName = "newRequestForm";
  var NewRequestFormComponent = class {
    constructor(params) {
      this.onComplete = params?.onComplete;
    }
    onComplete;
    newRequest = ko.observable(new AuditRequest());
    params = ko.pureComputed(() => {
      return {
        newRequest: this.newRequest,
        reset: this.reset,
        onComplete: this.onComplete
      };
    });
    componentName = newRequestFormComponentName;
  };
  var NewRequestFormModule = class extends BaseForm {
    constructor({ newRequest, onComplete }) {
      super({ entity: newRequest, view: AuditRequest.Views.New });
      this.onComplete = onComplete;
      this.prepopulateRequestFields();
    }
    saving = ko.observable(false);
    prepopulateRequestFields() {
      const request2 = ko.unwrap(this.entity);
      if (!request2)
        return;
      const fy = configurationsStore["current-fy"];
      request2.FiscalYear.Value(fy);
      const reqType = configurationsStore["default-req-type"];
      request2.ReqType.Value(reqType);
      request2.Reminders.Value(request2.Reminders.Options());
      request2.ReqStatus.Value(AUDITREQUESTSTATES.OPEN);
    }
    async clickSubmit() {
      this.saving(true);
      await this.submit();
      this.saving(false);
    }
    async submit() {
      const errors = this.validate();
      if (errors.length)
        return;
      const request2 = this.entity();
      try {
        await addNewRequest(request2);
        this.onComplete(SP.UI.DialogResult.OK);
      } catch (e) {
        alert(e);
      }
    }
    clearForm() {
      this.entity(new AuditRequest());
      this.prepopulateRequestFields();
    }
  };
  directRegisterComponent(newRequestFormComponentName, {
    template: newRequestFormTemplate,
    viewModel: NewRequestFormModule
  });

  // src/components/request_detail_view/request_detail_view.js
  init_application_db_context();
  init_infrastructure();
  init_entities2();

  // src/components/forms/response_doc/confirm_approve/confirm_approve_response_doc_form.js
  init_infrastructure();
  init_entities2();

  // src/components/forms/response_doc/confirm_approve/ConfirmApproveResponseDocFormTemplate.js
  init_infrastructure();
  var confirmApproveResponseDocFormTemplate = html4`
  <div id="approveResponseDocDlg" class="audit-form bg-dark">
    <div>
      Are you sure you would like to
      <span class="fw-bold success">Approve</span> the Response Document(s)?
      <ul>
        <!-- ko foreach: responseDocs -->
        <li class="fw-bold success" data-bind="text: fileName"></li>
        <!-- /ko -->
      </ul>
    </div>
    <div class="form-actions">
      <button
        type="button"
        class="btn btn-success"
        data-bind="click: clickSubmit, text: sendToText, 
      attr: {title: sendToText}"
      ></button>
    </div>
  </div>
`;

  // src/components/forms/response_doc/confirm_approve/confirm_approve_response_doc_form.js
  var componentName3 = "confirm-approve-response-doc";
  var ConfirmApproveResponseDocForm = class {
    constructor(request2, response, responseDocs) {
      this.request = request2;
      this.response = response;
      this.responseDocs(responseDocs);
      switch (request2.reqType) {
        case AUDITREQUESTTYPES.TASKER:
          this.sendToText("Send to " + request2.requestingOffice);
          break;
        case AUDITREQUESTTYPES.REQUEST:
          this.sendToText("Send to QA");
          break;
        default:
          this.sendToText("Uh Oh");
      }
    }
    sendToText = ko.observable();
    responseDocs = ko.observableArray();
    saving = ko.observable(false);
    async clickSubmit() {
      this.saving(true);
      await this.submit();
      this.saving(false);
    }
    async submit() {
      const responseDocIds = this.responseDocs().map((doc) => doc.ID);
      let result;
      switch (this.request.reqType) {
        case AUDITREQUESTTYPES.TASKER:
          result = await approveResponseDocsForRO(
            this.request.ID,
            responseDocIds
          );
          break;
        case AUDITREQUESTTYPES.REQUEST:
          result = await m_fnApproveResponseDocsForQA(
            this.request,
            this.responseDocs()
          );
          break;
        default:
          this.sendToText("Uh Oh");
      }
      if (result) {
        this.onComplete(true);
      }
    }
    componentName = componentName3;
    params = this;
  };
  directRegisterComponent(componentName3, {
    template: confirmApproveResponseDocFormTemplate
  });

  // src/components/forms/response_doc/confirm_reject/confirm_reject_response_doc_form.js
  init_infrastructure();

  // src/components/forms/response_doc/confirm_reject/ConfirmRejectResponseDocFormTemplate.js
  init_infrastructure();
  var confirmRejectResponseDocFormTemplate = html4`
  <div id="rejectResponseDocDlg" class="audit-form bg-dark">
    <div>
      Are you sure you would like to
      <span class="text-danger fw-bold">Reject</span> the Response Document(s)?
      <ul>
        <!-- ko foreach: responseDocs -->
        <li class="text-danger fw-bold" data-bind="text: fileName"></li>
        <!-- /ko -->
      </ul>
    </div>
    <div class="component field">
      <label class="fw-semibold"
        >If so, please specify the reason<span class="fw-bold text-danger"
          >*</span
        >:
        <textarea
          class="form-control w-full"
          rows="3"
          data-bind="textInput: rejectReason"
        ></textarea>
      </label>
    </div>
    <br />
    <div class="form-actions">
      <button
        type="button"
        class="btn btn-danger"
        value="Reject Documents"
        data-bind="click: clickSubmit, 
      enable: rejectReason"
      >
        Yes, Reject Document
      </button>
    </div>
  </div>
`;

  // src/components/forms/response_doc/confirm_reject/confirm_reject_response_doc_form.js
  var componentName4 = "confirm-reject-response-doc";
  var ConfirmRejectResponseDocForm = class {
    constructor(request2, response, responseDocs) {
      this.request = request2;
      this.response = response;
      this.responseDocs(responseDocs);
    }
    rejectReason = ko.observable();
    responseDocs = ko.observableArray();
    saving = ko.observable(false);
    async clickSubmit() {
      this.saving(true);
      await this.submit();
      this.saving(false);
    }
    async submit() {
      await Promise.all(
        this.responseDocs().map((responseDoc) => {
          return m_fnRejectResponseDoc(
            this.request,
            responseDoc,
            this.rejectReason()
          );
        })
      );
      this.onComplete(true);
    }
    componentName = componentName4;
    params = this;
  };
  directRegisterComponent(componentName4, {
    template: confirmRejectResponseDocFormTemplate
  });

  // src/components/forms/request/confirm_delete/confirm_delete_request_form.js
  init_infrastructure();

  // src/components/forms/request/confirm_delete/ConfirmDeleteRequestFormTemplate.js
  init_infrastructure();
  var confirmDeleteRequestFormTemplate = html4`
  <div id="deleteRequestDlg" class="audit-form bg-dark">
    <div>
      Are you sure you would like to
      <span class="text-danger fw-bold">Delete</span> the Request and associated
      files?
      <ul>
        <li class="text-danger fw-bold" data-bind="text: request.number"></li>
      </ul>
    </div>

    <div class="form-actions">
      <button
        type="button"
        class="btn btn-danger"
        value="Delete Request"
        data-bind="click: clickSubmit, enable: !saving()"
      >
        Yes, Delete Request
      </button>
    </div>
  </div>
`;

  // src/components/forms/request/confirm_delete/confirm_delete_request_form.js
  var componentName5 = "confirm-delete-request";
  var ConfirmDeleteRequestForm = class {
    constructor(request2) {
      this.request = request2;
    }
    saving = ko.observable();
    async clickSubmit() {
      this.saving(true);
      await this.submit();
      this.saving(false);
    }
    async submit() {
      const result = await deleteRequest(this.request.ID);
      if (result) {
        this.onComplete(true);
      }
    }
    componentName = componentName5;
    params = this;
  };
  directRegisterComponent(componentName5, {
    template: confirmDeleteRequestFormTemplate
  });
  registerComponent({
    name: componentName5,
    folder: "forms/request/confirm_delete",
    template: "ConfirmDeleteRequestFormTemplate"
  });

  // src/components/request_detail_view/RequestDetailViewTemplate.js
  init_infrastructure();
  var requestDetailViewTemplate = html4`
  <div class="request-detail-view" data-bind="visible: currentRequest">
    <div id="divRequestInfoContainer">
      <div
        id="divRequestClose"
        style="width: 300px"
        data-bind="visible: bDisplayClose"
      >
        <fieldset style="border-color: GreenYellow">
          <legend style="font-weight: bold; font-size: 12pt">Action</legend>
          <span class="fa-solid fa-lock"></span
          ><button
            type="button"
            class="btn btn-link"
            id="btnCloseRequest"
            title="Close this Request"
            data-bind="click: $root.ClickCloseRequest"
          >
            Close this Request
          </button>
        </fieldset>
      </div>

      <div data-bind="if: currentRequestResponsesReadyToClose().length">
        <fieldset class="emphasized-section">
          <legend>Responses Ready to Close</legend>
          <table class="tablesorter">
            <thead>
              <tr>
                <th>Response</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody data-bind="foreach: currentRequestResponsesReadyToClose">
              <tr>
                <td
                  class="response-title"
                  data-bind="attr: {'id': 'response-item-title-' + title}"
                >
                  <span
                    title="View Response Docs"
                    class="btn btn-link"
                    data-bind="text: title, click: $parent.viewResponseDocs"
                  ></span>
                </td>
                <td>
                  <button
                    type="button"
                    class="btn btn-link"
                    title="Close Response"
                    data-bind="click: clickCloseResponse"
                  >
                    <span class="fa-solid fa-circle-check"></span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <button
            type="button"
            class="btn btn-link"
            title="Close all Responses"
            data-bind="click: clickCloseReadyResponses"
          >
            <span class="fa-solid fa-check-double"></span> Close All Responses
          </button>
        </fieldset>
      </div>

      <div
        id="divRequestInfo"
        class="audit-form request-info-form"
        data-bind="with: currentRequest"
      >
        <div class="form-header">
          <h3 class="uppercase form-title">
            AUDIT REQUEST DETAILS
            <span class="fw-semibold" data-bind="text: number"></span> |
            <span class="text-primary"
              >FY-<span data-bind="text: fiscalYear"></span
            ></span>
          </h3>
          <button
            type="button"
            class="btn btn-link form-title"
            data-bind="click: $parent.refreshRequest"
          >
            <i title="Refresh Request" class="fa-solid fa-arrows-rotate"></i>
          </button>
        </div>
        <!-- ko if: typeof(activeViewers) != 'undefined' -->
        <div
          id="divRequestActiveViewers"
          data-bind="visible: activeViewers.viewers().length, with: activeViewers"
        >
          <fieldset>
            <legend>
              <span class="fa-solid fa-triangle-exclamation"></span
              ><span data-bind="text: viewers().length"></span> Active Viewers
            </legend>
            <ul data-bind="foreach: viewers">
              <li>
                <div class="active-viewer">
                  <div
                    data-bind="text: viewer + ' @ ' + timestamp.toLocaleString()"
                  ></div>
                  <div
                    style="cursor: pointer"
                    data-bind="click: $parent.onRemove"
                    class="fa-solid fa-xmark"
                  ></div>
                </div>
              </li>
            </ul>
          </fieldset>
        </div>
        <!-- /ko -->
        <div class="form-row uppercase">
          <dl class="">
            <dt>Request #</dt>
            <dd data-bind="text: number"></dd>
            <dt>Subject</dt>
            <dd data-bind="text: subject"></dd>
            <dt>Requesting Office</dt>
            <dd data-bind="text: requestingOffice"></dd>
            <dt>Sensitivity</dt>
            <dd data-bind="text: sensitivity"></dd>
            <dt>Internal Due Date</dt>
            <dd data-bind="text: internalDueDate"></dd>
            <dt>Due Date</dt>
            <dd data-bind="text: dueDate"></dd>
          </dl>
          <dl>
            <dt>Type</dt>
            <dd data-bind="text: reqType"></dd>
            <dt>Status</dt>
            <dd>
              <span
                id="requestInfoStatus"
                class="uppercase"
                data-bind="text: status, class: status == 'Closed' ? 'danger' : 'success' "
              ></span>
              <span class="danger" data-bind="visible: status == 'Closed'"
                >on
                <span data-bind="text: closedDate"></span>
              </span>
            </dd>
            <dt>Sample?</dt>
            <dd>
              <span id="requestInfoSample">
                <span data-bind="if: sample"
                  ><span class="fa-solid fa-check"></span> Yes</span
                >
                <span data-bind="if: !sample"
                  ><span class="fa-solid fa-xmark"></span> No</span
                >
              </span>
            </dd>
            <dt>Receipt Date</dt>
            <dd data-bind="text: receiptDate"></dd>
            <dt>Related Audit</dt>
            <dd data-bind="text: relatedAudit"></dd>
          </dl>
        </div>
        <div class="form-row">
          <dl>
            <dt>Action Items</dt>
            <dd data-bind="html: actionItems"></dd>
            <dt>Comments</dt>
            <dd data-bind="html: comments"></dd>
          </dl>
        </div>

        <div class="form-row">
          <div class="emphasized-section">
            <div class="fw-semibold">Internal Status Comments</div>
            <!-- ko if: typeof(internalStatus) != 'undefined' -->
            <div class="commentChain" data-bind="with: internalStatus">
              <div data-bind="if: comments().length">
                <!-- ko if: showHistoryBool -->
                <!-- ko foreach: comments -->
                <div class="comment card">
                  <div class="card-body">
                    <div class="text" data-bind="text: text"></div>
                    <div>
                      <span
                        class="info"
                        data-bind="text: author + ' @ ' + timestamp.toLocaleString()"
                      ></span>
                      <button
                        type="button"
                        title="Delete Comment"
                        class="remove btn btn-link danger"
                        data-bind="click: $parent.onRemove"
                      >
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <!-- /ko -->
                <!-- /ko -->
                <!-- ko ifnot: showHistoryBool -->
                <div
                  class="comment card"
                  data-bind="with: comments()[comments().length - 1]"
                >
                  <div class="card-body">
                    <div class="text" data-bind="text: text"></div>
                    <div>
                      <span
                        class="info"
                        data-bind="text: author + ' @ ' + timestamp.toLocaleString()"
                      ></span>
                      <button
                        type="button"
                        title="Delete Comment"
                        class="remove btn btn-link danger"
                        data-bind="click: $parent.onRemove"
                      >
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <!-- /ko -->
              </div>
              <button
                type="button"
                class="btn btn-link"
                title="Show hidden comments"
                data-bind="click: toggleShowHistory"
              >
                <span class="fa-solid fa-comments"></span>
                Toggle Comment History (<span
                  data-bind="text: comments().length"
                ></span>
                Total)
              </button>
              <div class="new-comment">
                <textarea
                  class="form-control w-full"
                  cols="50"
                  data-bind="textInput: newCommentText"
                  placeholder="Leave a new comment..."
                ></textarea>
                <button
                  type="button"
                  class="btn btn-primary"
                  data-bind="click: onSubmit, enable: newCommentText"
                >
                  Submit
                </button>
              </div>
            </div>
            <!-- /ko -->
          </div>
        </div>
        <div class="form-row">
          <dl>
            <dt>Action Office(s)</dt>
            <dd>
              <!-- ko ifnot: actionOffices.length -->
              0 Action Offices
              <!-- /ko -->
              <span
                id="requestInfoActionOffice"
                data-bind="if: actionOffices.length"
              >
                <div
                  style="cursor: pointer; white-space: nowrap"
                  title="Click to view"
                >
                  <span
                    class="actionOfficeContainerRequestInfo"
                    data-bind="toggleClick: $data, toggleClass: 'collapsed', classContainer: '.sr1-request-actionOfficeContainerRequestInfo-item'"
                  >
                    <span class="fa-solid fa-magnifying-glass"></span
                    ><button type="button" class="btn btn-link">
                      View
                      <span data-bind="text: actionOffices.length"></span>
                      Action Offices
                    </button>
                    <!-- ko foreach: actionOffices -->
                    <div
                      class="sr1-request-actionOfficeContainerRequestInfo-item collapsed"
                      data-bind="text: ao"
                    ></div>
                    <!-- /ko -->
                  </span>
                </div>
              </span>
            </dd>
          </dl>
          <dl>
            <dt>Email Action Office(s)</dt>
            <dd>
              <!-- ko ifnot: emailActionOffices.length -->
              0 Email Action Offices
              <!-- /ko -->
              <span
                id="requestInfoActionOffice"
                data-bind="if: emailActionOffices.length"
              >
                <div
                  style="cursor: pointer; white-space: nowrap"
                  title="Click to view"
                >
                  <span
                    class="actionOfficeContainerRequestInfo"
                    data-bind="toggleClick: $data, toggleClass: 'collapsed', classContainer: '.sr1-request-actionOfficeContainerRequestInfo-item'"
                  >
                    <span class="fa-solid fa-magnifying-glass"></span
                    ><button type="button" class="btn btn-link">
                      View
                      <span data-bind="text: emailActionOffices.length"></span>
                      Email Action Offices
                    </button>
                    <!-- ko foreach: emailActionOffices -->
                    <div
                      class="sr1-request-actionOfficeContainerRequestInfo-item collapsed"
                      data-bind="text: ao"
                    ></div>
                    <!-- /ko -->
                  </span>
                </div>
              </span>
            </dd>
          </dl>
        </div>
        <div class="form-row">
          <dl>
            <dt>Email Sent?</dt>
            <dd>
              <span data-bind="if: emailSent"
                ><span class="fa-solid fa-check"></span> Yes</span
              >
              <span data-bind="if: !emailSent"
                ><span class="fa-solid fa-xmark"></span> No</span
              >
            </dd>
          </dl>
          <fieldset
            class="emphasized-section"
            style="
            width: 225px;
            margin-top: 5px;
            margin-left: 10px;
            padding-left: 10px;
          "
          >
            <legend>Email Actions</legend>
            <div
              id="divSendEmailAction"
              style="padding-top: 5px"
              data-bind="visible: status == 'Open' || status == 'ReOpened'"
            >
              <span class="fa-solid fa-paper-plane"></span>
              <button
                type="button"
                class="btn btn-link"
                data-bind="visible: !emailSent, click: $root.ClickSendEmail, enable: emailActionOffices.length"
                title="Send Email to Action Offices"
              >
                Send Email to Action Offices
              </button>
              <button
                type="button"
                class="btn btn-link"
                data-bind="visible: emailSent, click: $root.ClickSendEmail, enable: emailActionOffices.length"
                title="ReSend Email to Action Offices"
              >
                Re-Send Email to Action Offices
              </button>
            </div>
            <div id="divEmailHistory" style="padding-top: 5px">
              <button
                type="button"
                class="btn btn-link"
                title="View Email History"
                data-bind="click: $root.ClickViewEmailHistoryFolder"
              >
                <span class="fa-solid fa-magnifying-glass"></span> View Email
                History
              </button>
            </div>
            <div id="divSyncEmailActionOffices" style="padding-top: 5px">
              <button
                type="button"
                class="btn btn-link"
                title="Synchronize Email Action Offices"
                data-bind="click: $root.ClickSyncEmailActionOffices"
              >
                <span class="fa-solid fa-right-left"></span> Synchronize Email
                Action Offices
              </button>
            </div>
          </fieldset>
        </div>
        <div class="form-row">
          <dl>
            <dt>Special Permissions?</dt>
            <dd>
              <span data-bind="if: specialPerms == true"
                ><span class="fa-solid fa-check"></span> Yes</span
              >
              <span data-bind="if: specialPerms == false"
                ><span class="fa-solid fa-xmark"></span> No</span
              >
            </dd>
          </dl>
          <fieldset
            class="emphasized-section"
            style="
            width: 200px;
            margin-top: 5px;
            margin-left: 10px;
            padding-left: 10px;
          "
          >
            <legend>Special Permission Actions</legend>
            <div
              id="divResponsesGrantSpecialPermissions"
              style="padding-top: 5px"
            >
              <button
                type="button"
                class="btn btn-link"
                title="Grant Special Permissions"
                data-bind="click: $root.ClickGrantSpecialPermissions"
              >
                <span class="fa-solid fa-unlock"></span> Grant Special
                Permissions
              </button>
            </div>
            <div
              id="divResponsesRemoveSpecialPermissions"
              style="padding-top: 5px"
            >
              <button
                type="button"
                class="btn btn-link"
                title="Remove Special Permissions"
                data-bind="click: $root.ClickRemoveSpecialPermissions"
              >
                <span class="fa-solid fa-lock"></span> Remove Special
                Permissions
              </button>
            </div>
          </fieldset>
        </div>
        <tr></tr>

        <div id="divRequestInfoActions" class="form-row">
          <fieldset class="form-actions emphasized-section">
            <legend>Request Actions</legend>
            <div>
              <button
                type="button"
                class="btn btn-primary"
                title="View Version History"
                data-bind="click: $parent.ClickViewRequestHistory"
              >
                <span class="fa-solid fa-clock-rotate-left"></span> View Version
                History
              </button>
            </div>
            <div>
              <button
                type="button"
                class="btn btn-primary"
                title="View Request"
                data-bind="click: $root.ClickViewRequest"
              >
                <span class="fa-solid fa-magnifying-glass"></span> View Request
              </button>
            </div>
            <div>
              <button
                type="button"
                class="btn btn-success"
                title="Edit Request"
                data-bind="click: $root.ClickEditRequest"
              >
                <span class="fa-solid fa-pencil"></span> Edit Request
              </button>
            </div>
            <!-- ko ifnot: emailSent  -->
            <div>
              <button
                type="button"
                class="btn btn-danger"
                title="Delete Request"
                data-bind="click: $parent.ClickDeleteRequest"
              >
                <span class="fa-solid fa-trash"></span> Delete Request
              </button>
            </div>
            <!-- /ko -->
          </fieldset>
        </div>
      </div>
    </div>

    <div class="ui-tabs-secondary request-detail-documents">
      <!-- ko using: tabs -->
      <ul class="ui-tabs-nav" data-bind="foreach: tabOpts">
        <li
          data-bind="text: linkText, 
          click: $parent.clickTabLink, 
          css: {active: $parent.isSelected($data)}"
        ></li>
      </ul>
      <!-- ko foreach: tabOpts -->
      <div
        data-bind="component: {
            name: template.id,
            params: template.data
          },
          visible: $parent.isSelected($data)"
      ></div>
      <!-- /ko -->
      <!-- /ko -->
    </div>
  </div>
`;

  // src/components/request_detail_view/RequestDetailCoversheetsTabTemplate.js
  init_infrastructure();
  var requestDetailCoversheetsTabTemplate = html4`
  <div id="divCoverSheets" data-bind="visible: currentRequest">
    <div id="divCoverSheetActions" class="w-fit">
      <div data-bind="visible: coverSheetFiles().length">
        Uploading Coversheet!
        <progress></progress>
      </div>
      <div class="quick-links secondary">
        <label data-bind="visible: !coverSheetFiles().length">
          <div
            class="btn btn-link"
            title="Upload Cover Sheet or Supplemental Document"
            data-bind=""
          >
            <span class="fa-solid fa-upload"></span> Upload Cover Sheet or
            Supplemental Document
          </div>
          <input
            style="display: none"
            type="file"
            data-bind="files: coverSheetFiles"
          />
        </label>
      </div>
    </div>
    <div
      id="divEmptyCoversheetsMsg"
      style="border: 0px !important; font-style: italic"
      data-bind="visible: arrCurrentRequestCoverSheets().length <= 0"
    >
      There are 0 coversheets
    </div>
    <table
      id="tblCoverSheets"
      class="tablesorter report"
      data-bind="visible: arrCurrentRequestCoverSheets().length > 0"
    >
      <thead>
        <tr valign="top">
          <th class="sorter-false" nowrap="nowrap">Name</th>
          <th class="sorter-false" nowrap="nowrap">Action Office</th>
          <th class="sorter-false" nowrap="nowrap">Action</th>
        </tr>
      </thead>
      <tbody data-bind="foreach: arrCurrentRequestCoverSheets">
        <tr class="coversheet-item">
          <td class="coversheet-title" title="Click to Download">
            <a
              class="btn btn-link"
              data-bind="downloadLink: '../_layouts/download.aspx?SourceUrl=:folder/:title'"
              ><span data-bind="text: title"></span
            ></a>
          </td>
          <td class="coversheet-ao">
            <div
              style="cursor: pointer"
              title="Click to view"
              data-bind="visible: $data.actionOffices.length > 0, toggleClick: $data, toggleClass: 'collapsed', classContainer: '.sr1-request-actionOfficeContainerRequestInfo-item'"
            >
              <span class="fa-solid fa-magnifying-glass"></span
              ><span class="actionOfficeContainerRequestInfo"
                ><button type="button" class="btn btn-link">
                  View Action Offices
                </button></span
              >
              <!-- ko foreach: actionOffices -->
              <div
                class="sr1-request-actionOfficeContainerRequestInfo-item collapsed"
              >
                <span data-bind="text: actionOffice"></span>
              </div>
              <!-- /ko -->
            </div>
          </td>
          <td class="coversheet-action">
            <button
              type="button"
              class="btn btn-link"
              title="View Coversheet"
              data-bind="click: $root.ClickViewCoversheet"
            >
              <span
                title="View Coversheet"
                class="fa-solid fa-magnifying-glass"
              ></span>
            </button>
            <button
              type="button"
              class="btn btn-link"
              title="Edit Coversheet"
              data-bind="visible: requestStatus != 'Closed' && requestStatus != 'Canceled', click: $root.ClickEditCoversheet"
            >
              <span title="Edit Coversheet" class="fa-solid fa-pencil"></span>
            </button>
            <button
              type="button"
              class="btn btn-link"
              title="Delete Coversheet"
              data-bind="visible: requestStatus != 'Closed' && requestStatus != 'Canceled',
                click: $parent.ClickDeleteCoversheet"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr valign="top">
          <th nowrap="nowrap" colspan="3">
            Total:
            <span
              id="tblCoverSheetsTotal"
              data-bind="text: arrCurrentRequestCoverSheets().length"
              >0</span
            >
          </th>
        </tr>
      </tfoot>
    </table>
  </div>
`;

  // src/components/request_detail_view/RequestDetailResponsesTabTemplate.js
  init_infrastructure();
  var requestDetailResponsesTabTemplate = html4`
  <div id="divResponses" data-bind="visible: currentRequest">
    <div data-bind="">
      <div id="divResponsesActions" class="quick-links secondary">
        <!-- ko if:  showResponseActions-->
        <div>
          <button
          type="button"
          class="btn btn-link"
            title="Add Response"
            data-bind="click: $root.ClickAddResponse"
            ><span class="fa-solid fa-plus"></span>Add Response</button
          >
        </div>
        <div>
          <button
            type="button"
            class="btn btn-link"
            title="Bulk Add Responses"

            data-bind="click: $root.ClickBulkAddResponse"
            ><span class="fa-solid fa-circle-plus"></span>Bulk Add Responses</a
          >
        </div>
        <div data-bind="visible: currentRequestResponseItems().length > 0">
          <button
            type="button"
            class="btn btn-link"
            title="Bulk Edit Responses"

            data-bind="click: $root.ClickBulkEditResponse"
            ><span class="fa-solid fa-pencil"></span>Bulk Edit Responses</a
          >
        </div>
        <!-- /ko -->
        <div
          id="divResponsesShowHideFolderPerms"
          data-bind="visible: currentRequestResponseItems().length > 0"
        >
          <button
            type="button"
            class="btn btn-link"
            title="Show/Hide Response Folder Permissions"
            data-bind="toggleClick: $data, toggleClass: 'response-permissions', containerType: 'any'"
            ><i class="fa-solid fa-gear"></i>Show/Hide Response Folder
            Permissions</a
          >
        </div>
      </div>
    </div>

    <table
      id="tblResponses"
      class="tablesorter report"
      data-bind="visible: currentRequestResponseItems().length > 0 "
    >
      <thead>
        <tr valign="top">
          <th class="sorter-true" nowrap="nowrap">Sample #</th>
          <th class="sorter-true" nowrap="nowrap" style="text-align: left">
            Name
          </th>
          <th class="sorter-true" nowrap="nowrap">Action Office</th>
          <th class="sorter-true" nowrap="nowrap"># Docs</th>
          <th class="sorter-true" nowrap="nowrap">Status</th>
          <th class="sorter-true" nowrap="nowrap">Return Reason</th>
          <th class="sorter-false" nowrap="nowrap">Special Permission?</th>
          <th class="sorter-false response-permissions" nowrap="nowrap">
            Response Folder Permissions
          </th>
          <th class="sorter-false" nowrap="nowrap">Active Viewers</th>
          <th class="sorter-false" nowrap="nowrap">Action</th>
          <th class="sorter-false" nowrap="nowrap">Documents</th>
        </tr>
      </thead>
      <tbody data-bind="foreach: currentRequestResponseItems">
        <tr class="response-item" data-bind="css: {'highlighted': highlight}">
          <td class="response-sample">
            <span data-bind="text: sample"></span>
          </td>
          <td
            class="response-title"
            data-bind="attr: {'id': 'response-item-title-' + title}, click: highlightResponse"
          >
            <span title="View Response Docs" class="btn btn-link" data-bind="text: title, click: $parent.viewResponseDocs"></span>
          </td>
          <td
            class="response-actionOffice"
            data-bind="attr: {'title': toolTip}, style: styleTag"
          >
            <span data-bind="text: actionOffice"></span
            ><span data-bind="visible: poc" style="color: green"
              >&nbsp;POC: </span
            ><span data-bind="text: poc" style="color: green"></span>
          </td>
          <td class="response-document-cnt" >
            <span title="View Response Docs"
              class="btn btn-link"
              data-bind="text: responseDocs.length, click: $parent.viewResponseDocs"></span>
          </td>
          <td class="response-resStatus">
            <span
              data-bind="visible: resStatus != '7-Closed'"
              style="color: green"
              ><span data-bind="text: resStatus"></span>
            </span>
            <span
              data-bind="visible: resStatus == '7-Closed'"
              style="color: red"
              ><span data-bind="text: resStatus"></span>&nbsp;on&nbsp;<span
                data-bind="text: closedDate"
              ></span
              >&nbsp;by&nbsp;<span data-bind="text: closedBy"></span
            ></span>
              <!-- ko if: isReadyToClose($data) -->
              <button type="button"
                class="btn btn-link"
                title="All response docs sent to RO. Click to Close."
                data-bind="click: clickCloseResponse">
                Ready to Close <span class="fa-solid fa-circle-check"></span>
              </button>
              <!-- /ko -->
            <div
              style="padding-top: 5px; padding-left: 20px"
              data-bind="visible: resStatus == '7-Closed'"
            >
              <i class="fa-solid fa-gear"></i
              ><button
            type="button"
            class="btn btn-link"
                title="Click to Open Response"

                data-bind="click: $root.ClickReOpenResponse"
                >Open Response?</a
              >
            </div>
          </td>
          <td class="response-returnReason" style="white-space: pre-line">
            <span data-bind="text: returnReason"></span>
          </td>
          <td class="response-specialPermissions">
            <span
              data-bind="css: (specialPerms ? 'fa-solid fa-check' : '')"
            ></span>
          </td>
          <td class="response-permissions">
            <span data-bind="html: groupPerms"></span>
          </td>
          <td class="response-viewers">
            <div
              data-bind="visible: activeViewers.viewers().length, with: activeViewers"
            >
              <fieldset>
                <legend>
                  <i class="fa-solid fa-triangle-exclamation"></i
                  ><span data-bind="text: viewers().length"></span>
                  Active Viewers
                </legend>
                <ul data-bind="foreach: viewers">
                  <li>
                    <div class="active-viewer">
                      <div
                        data-bind="text: viewer + ' @ ' + timestamp.toLocaleString()"
                      ></div>
                      <div
                        style="cursor: pointer"
                        data-bind="click: $parent.onRemove"
                      >
                        <i class="fa-solid fa-xmark"></i>
                      </div>
                    </div>
                  </li>
                </ul>
              </fieldset>
            </div>
          </td>
          <td class="response-action">
            <button
              type="button"
              class="btn btn-link"
              title="View Response"
              data-bind="click: $root.ClickViewResponse"
            >
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
            <button
              type="button"
              class="btn btn-link"
              title="Edit Response"
              data-bind="visible: resStatus != '7-Closed' && $parent.status != 'Closed' && $parent.status != 'Canceled', click: $root.ClickEditResponse"
            >
              <i class="fa-solid fa-pen"></i>
            </button>
            <button
              type="button"
              class="btn btn-link"
              title="View Version History"
              data-bind="click: ClickViewResponseHistory"
            >
              <span class="fa-solid fa-clock-rotate-left"></span>
            </button>
            <label
              title="Upload Coversheets for Action Office"
              class="btn btn-link"
              data-bind="visible: $parent.status != 'Closed' && $parent.status != 'Canceled' && ( resStatus == '1-Open' || resStatus == '2-Submitted' || resStatus == '3-Returned to Action Office' ||resStatus == '5-Returned to GFS' )"
            >
              <i
                title="Upload Coversheets"
                class="fa-solid fa-upload"
              ></i>
              <input
                type="file"
                multiple
                style="display: none"
                data-bind="files: responseCoversheetFiles"
              />
            </label>
            <button
              type="button"
              class="btn btn-link"
              title="Flag Response as Under Review"
              data-bind="visible: resStatus != '7-Closed' && $parent.status != 'Closed' && $parent.status != 'Canceled', click: $root.ClickReviewingResponse"
            >
              <i class="fa-solid fa-flag"></i>
            </button>
            <button
              type="button"
              class="btn btn-link"
              title="Delete Response"
              data-bind="visible: $parent.status != 'Closed' && $parent.status != 'Canceled' && ( resStatus == '1-Open' || resStatus == '2-Submitted' || resStatus == '3-Returned to Action Office' || resStatus == '5-Returned to GFS' ),
                click: ClickDeleteResponse"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
          <td class="response-responseDocs">
            <button
              type="button"
              class="btn btn-link"
              title="View Response Documents"
              data-bind="visible: resStatus != '7-Closed' && $parent.status != 'Closed' && $parent.status != 'Canceled', click: $root.ClickViewResponseDocFolder"
            >
              <i class="fa-solid fa-folder-open"></i>
            </button>
            <label
              class="btn btn-link"
              title="Upload Response Documents"
              data-bind="visible: $parent.status != 'Closed' && $parent.status != 'Canceled' && ( resStatus == '1-Open' || resStatus == '2-Submitted' || resStatus == '3-Returned to Action Office' ||resStatus == '5-Returned to GFS' )"
              ><i class="fa-solid fa-file-arrow-up"></i>
              <input
                type="file"
                multiple
                style="display: none"
                data-bind="files: responseDocFiles"
              />
            </label>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr valign="top">
          <th colspan="10" nowrap="nowrap">
            Total:
            <span
              id="tblResponsesTotal"
              data-bind="text: currentRequestResponseItems().length"
              >0</span
            >
          </th>
        </tr>
      </tfoot>
    </table>
  </div>
`;

  // src/components/request_detail_view/RequestDetailResponseDocsTabTemplate.js
  init_infrastructure();
  var requestDetailResponseDocsTabTemplate = html4`
  <div id="divResponseDocs" data-bind="visible: currentRequest">
    <div
      id="divEmptyResponseDocsMsg"
      style="border: 0px !important; font-style: italic"
      data-bind="visible: cntResponseDocs() == 0"
    >
      There are 0 response documents
    </div>

    <div
      class="quick-links secondary"
      data-bind="visible: cntResponseDocs() > 0"
    >
      <div>
        <button
            type="button"
            class="btn btn-link"
          class="btnApprovedCheckedResponseDocs"

          title="Approve Checked Response Documents"
          data-bind="click: ApproveCheckedResponseDocs, visible: currentRequest() && (currentRequest().status == 'Open' || currentRequest().status == 'ReOpened')"
        >
          <span class="fa-solid fa-circle-check"></span>
          Approve Checked Response Documents
        </button>
      </div>
      <div>
        <button
            type="button"
            class="btn btn-link"
          class="btnCheckResponseDocs"

          title="Check/Un-Check Response Documents"
          data-bind="click: CheckResponseDocs, visible: currentRequest() && (currentRequest().status == 'Open' || currentRequest().status == 'ReOpened')"
        >
          <span class="fa-solid fa-check-double"></span>
          Check Response Documents
        </button>
      </div>
      <div>
        <button
            type="button"
            class="btn btn-link"
          class="btnToggleExpand"

          title="Click to Expand/Collapse"
          data-bind="toggles: showCollapsed"
        >
          <span
            class="fa-solid"
            data-bind="class: showCollapsed() ? 'fa-expand' : 'fa-compress'"
          ></span>
          <span
            data-bind="text: showCollapsed() ? 'Expand Documents' : 'Collapse Documents'"
          ></span>
        </button>
      </div>
    </div>

    <table
      id="tblResponseDocs"
      class="tablesorter report"
      data-bind="visible: cntResponseDocs() > 0"
    >
      <thead>
        <tr valign="top">
          <th class="sorter-false" nowrap="nowrap">Type</th>
          <th class="sorter-false" nowrap="nowrap">Name</th>
          <th class="sorter-false" nowrap="nowrap">Title</th>
          <th class="sorter-false" nowrap="nowrap">Receipt Date</th>
          <th class="sorter-false" nowrap="nowrap">File Size</th>
          <th class="sorter-false" nowrap="nowrap">Checked Out</th>
          <th class="sorter-false" nowrap="nowrap">
            Status
            <span class="linkHelpResponseDocs"
              ><button
            type="button"
            class="btn btn-link"
                title="View Help"
                data-bind="click: clickHelpResponseDocs"
                style="color: #0072bc"
                ><i class="fa-solid fa-question"></i></a
            ></span>
          </th>
          <th class="sorter-false" nowrap="nowrap">Reason</th>
          <th class="sorter-false" nowrap="nowrap">Modified</th>
          <th class="sorter-false" nowrap="nowrap">Modified By</th>
          <th class="sorter-false" nowrap="nowrap">Actions</th>
        </tr>
      </thead>
      <tbody
        data-bind="foreach: { data: currentRequestResponseDocs, as: 'responseDocSummary'} "
      >
        <tr
          class="requestInfo-response-doc"
          data-bind="visible: responseDocSummary.responseDocs.length > 0,
            attr: {id: responseDocSummary.titleRowElementId() }"
        >
          <td colspan="11">
            <img
              style="background-color: transparent"
              title="Expand/Collapse"
              data-bind="
              attr: { src: (responseDocSummary.collapsed() ? '/_layouts/images/plus.gif' : '/_layouts/images/minus.gif') },
              toggles: responseDocSummary.collapsed"
            /><span>
              <button type="button"
                class="btn btn-link"
                title="View Response"
                data-bind="text: responseDocSummary.responseTitle,
                  click: $parent.ClickViewResponse">
              </button>
              </span>
              (<span data-bind="text: responseStatus"></span>)
          </td>
        </tr>

        <tr
          class="requestInfo-response-doc-item"
          data-bind="visible: responseDocSummary.showBulkApprove,
            css: (responseDocSummary.collapsed() ? 'collapsed' : '')"
        >
          <td colspan="11">
            <span class="divBulkApprove">
              <button
                type="button"
                class="btn btn-link"
                class="btnApproveAll"

                title="Click to Approve Remaining Documents"
                data-bind="click: $parent.ClickBulkApprove"
              >
                <span class="fa-solid fa-circle-check"></span>
                Approve 'Submitted' Documents for this Response below
              </button>
            </span>
          </td>
        </tr>

        <!-- ko foreach: responseDocSummary.responseDocs-->

        <tr
          class="requestInfo-response-doc-item"
          data-bind="style: styleTag,
          css: {'collapsed': responseDocSummary.collapsed(), 'highlighted': responseDocSummary.highlight}"
        >
          <td>
            <img
              data-bind="attr:{ src: $parent.siteUrl + '/_layouts/images/' + docIcon}"
            />
          </td>
          <td class="requestInfo-response-doc-title">
            <input
              type="checkbox"
              data-bind="attr: { id: ID }, visible: $parent.responseDocCanBeApproved($data), checked: chkApproveResDoc"
            />

            <a
              title="Click to Download"
              data-bind="visible: $parent.responseStatus == '7-Closed' || $parent.requestStatus == 'Closed' || $parent.requestStatus == 'Canceled', downloadLink: '../_layouts/download.aspx?SourceUrl=:folder/:fileName'"
              ><span data-bind="text: fileName"></span
            ></a>
            <span
              title="Click to Open"
              data-bind="visible: $parent.responseStatus != '7-Closed' && $parent.requestStatus != 'Closed' && $parent.requestStatus != 'Canceled', html: responseDocOpenInIELink "
            ></span>
            <span
              style="float: right"
              data-bind="visible: ( documentStatus == 'Open' || documentStatus == 'Marked for Deletion') && ($parent.requestStatus == 'Open' || $parent.requestStatus == 'ReOpened') "
              ><button
            type="button"
            class="btn btn-link"
                title="Delete Response Document"

                data-bind="click: $root.ClickDeleteResponseDoc"
                ><i class="fa-solid fa-trash"></i></a
            ></span>
          </td>
          <td nowrap data-bind="text: title"></td>
          <td nowrap data-bind="text: receiptDate"></td>
          <td nowrap data-bind="text: fileSize"></td>
          <td nowrap>
            <span data-bind="visible: checkedOutBy != ''"
              ><span data-bind="text: checkedOutBy"></span>&nbsp;<img
                style="background-color: transparent"
                src="/_layouts/images/checkin.gif"
                title="Check In Document"
              /><button
            type="button"
            class="btn btn-link"

                title="Check In Document"
                data-bind="click: $root.ClickCheckInResponseDocument"
                >Check In Document</a
              ></span
            >
          </td>
          <td nowrap>
            <span data-bind="text: documentStatus"></span>
            <span
              data-bind="visible: documentStatus == 'Rejected' && ( $parent.requestStatus == 'Open' || $parent.requestStatus == 'ReOpened' ) "
              ><button
            type="button"
            class="btn btn-link"
                title="Clear Rejected Status"

                data-bind="click: $root.ClickResendRejectedResponseDocToQA"
                ><i class="fa-solid fa-circle-check"></i></a
            ></span>
          </td>
          <td data-bind="html: rejectReason"></td>
          <td
            class="requestInfo-response-doc-modified"
            data-bind="text: modifiedDate"
          ></td>
          <td
            class="requestInfo-response-doc-modifiedBy"
            data-bind="text: modifiedBy"
          ></td>
          <td nowrap>
            <span
              data-bind="visible: $parent.responseDocCanBeApproved($data)"
            >
              <button
                type="button"
                class="btn btn-link"
                title="Approve this Document"

                data-bind="click: $parents[1].ClickApproveResponseDoc"
              >
                <span class="fa-solid fa-circle-check"
                  ></span
                >
              </button>
              <button
                type="button"
                class="btn btn-link"
                title="Reject this Document"

                data-bind="click: $parents[1].ClickRejectResponseDoc"
              >
                <span class="fa-solid fa-circle-xmark"
                  ></span
                >
              </button>
            </span>

            <a
              title="Click to Download"
              data-bind="downloadLink: '../_layouts/download.aspx?SourceUrl=:folder/:fileName'"
              ><i class="fa-solid fa-download"></i
            ></a>
            <button
              type="button"
              class="btn btn-link"
              title="View Response Document Properties"

              data-bind="click: $root.ClickViewResponseDoc"
              ><span class="fa-solid fa-magnifying-glass"
                ></span
              ></a
            >
            <button
              type="button"
              class="btn btn-link"
              title="Edit Response Document Properties"

              data-bind="visible: $parent.responseStatus != '7-Closed' && $parent.requestStatus != 'Closed' && $parent.requestStatus != 'Canceled' && ( documentStatus == 'Sent to QA' || documentStatus == 'Open' || documentStatus == 'Submitted' ), click: $root.ClickEditResponseDoc"
              ><span class="fa-solid fa-pencil"></span></a
            >
            <button
              type="button"
              class="btn btn-link"
              title="View Version History"
              data-bind="click: $parent.ClickViewResponseDocHistory"
            >
              <span class="fa-solid fa-clock-rotate-left"></span>
            </button>
          </td>
        </tr>

        <!-- /ko -->
      </tbody>
      <tfoot>
        <tr valign="top">
          <th colspan="11" nowrap="nowrap">
            Total:
            <span id="tblResponseDocsTotal" data-bind="text: cntResponseDocs()"
              >0</span
            >
          </th>
        </tr>
      </tfoot>
    </table>
  </div>
`;

  // src/components/request_detail_view/request_detail_view.js
  var componentName6 = "component-request-detail-view";
  var requestDetailUrlParamKey = "request-detail-tab";
  var RequestDetailView = class {
    constructor({
      bDisplayClose,
      currentRequest,
      arrCurrentRequestCoverSheets,
      // arrCurrentRequestResponses,
      // cntResponseDocs,
      // arrCurrentRequestResponseDocs,
      ModalDialog,
      ClickEditCoversheet
    }) {
      this.bDisplayClose = bDisplayClose;
      this.currentRequest = currentRequest;
      this.arrCurrentRequestCoverSheets = arrCurrentRequestCoverSheets;
      this.editCoversheet = ClickEditCoversheet;
      this.ModalDialog = ModalDialog;
      this.showCollapsed.subscribe(this.showCollapseToggledHandler);
      this.coverSheetFiles.subscribeAdded(this.onCoverSheetFileAttachedHandler);
      this.tabs = new TabsModule(
        Object.values(this.tabOpts),
        requestDetailUrlParamKey
      );
      this.setInitialTab();
      this.currentRequest.subscribe(this.onRequestChangeHandler);
    }
    request = ko.observable();
    onRequestChangeHandler = async (newRequest) => {
      if (!newRequest || !newRequest.ID)
        return;
      if (newRequest.ID == ko.unwrap(this.request)?.ID)
        return;
      const request2 = await getRequestById(newRequest.ID);
      this.request(request2);
    };
    // Fields
    componentName = componentName6;
    params = this;
    tabOpts = {
      Coversheets: new Tab("coversheets", "Coversheets", {
        id: "requestDetailCoversheetsTabTemplate",
        data: this
      }),
      Responses: new Tab("responses", "Responses", {
        id: "requestDetailResponsesTabTemplate",
        data: this
      }),
      ResponseDocs: new Tab("response-docs", "Response Docs", {
        id: "requestDetailResponseDocsTabTemplate",
        data: this
      })
    };
    checkResponseDoc = true;
    // Observables
    coverSheetFiles = ko.observableArray();
    showCollapsed = ko.observable(false);
    // Computed Observables
    currentRequestResponseItems = ko.pureComputed(() => {
      const request2 = ko.unwrap(this.currentRequest);
      return request2?.responses.map(
        (response) => new ResponseItem(request2, response, this)
      ) ?? [];
    });
    currentRequestResponsesReadyToClose = ko.pureComputed(() => {
      if (this.currentRequest()?.reqType != AUDITREQUESTTYPES.TASKER)
        return [];
      return this.currentRequestResponseItems().filter(
        (response) => response.isReadyToClose()
      );
    });
    currentRequestResponseDocs = ko.pureComputed(() => {
      const request2 = ko.unwrap(this.currentRequest);
      const responseSummaries = request2?.responses.map(
        (response) => new ResponseDocSummary(request2, response)
      ) ?? [];
      return responseSummaries;
    });
    cntResponseDocs = ko.pureComputed(() => {
      const cnt = this.currentRequestResponseDocs().reduce(
        (cnt2, responseSummary) => cnt2 + responseSummary.responseDocs.length,
        0
      );
      return cnt;
    });
    showResponseActions = ko.pureComputed(() => {
      return [AUDITREQUESTSTATES.OPEN, AUDITREQUESTSTATES.REOPENED].includes(
        this.currentRequest()?.status
      );
    });
    // Subscriptions
    showCollapseToggledHandler = (collapse) => {
      this.currentRequestResponseDocs().map(
        (responseDocSummary) => responseDocSummary.collapsed(collapse)
      );
    };
    // Behaviors
    setInitialTab() {
      if (getUrlParam(requestDetailUrlParamKey)) {
        this.tabs.selectById(getUrlParam(requestDetailUrlParamKey));
        return;
      }
      const defaultTab = this.currentRequest()?.EmailSent.Value() ? this.tabOpts.Responses : this.tabOpts.Coversheets;
      this.tabs.selectTab(defaultTab);
    }
    ClickViewRequestHistory = () => {
      appContext.AuditRequests.ListRef.showVersionHistoryModal(
        this.currentRequest()?.ID
      );
    };
    ClickDeleteRequest = async () => {
      const request2 = this.currentRequest();
      if (request2.emailSent) {
        alert("Email has been sent, cannot delete request.");
        return;
      }
      const newConfirmDeleteForm = new ConfirmDeleteRequestForm(request2);
      const options = {
        form: newConfirmDeleteForm,
        dialogReturnValueCallback: this.OnCallBackDeleteRequest.bind(this),
        title: "Delete Request?"
      };
      showModalDialog(options);
    };
    // collapseResponseDocs = (collapse) =>
    // Need to wrap this this m_fnRefreshData optionally takes a requestId param
    refreshRequest = async () => {
      m_fnRefreshData();
      const reqId = ko.unwrap(this.request)?.ID;
      if (!reqId)
        return;
      const request2 = await getRequestById(reqId);
      this.request(request2);
    };
    // Coversheets
    onCoverSheetFileAttachedHandler = async (newFiles) => {
      if (!newFiles.length)
        return;
      const request2 = await appContext.AuditRequests.FindById(
        this.currentRequest().ID
      );
      const file = newFiles[0];
      const coversheet = await uploadRequestCoversheetFile(file, request2);
      this.coverSheetFiles([]);
      this.editCoversheet({ ID: coversheet.ID });
    };
    ClickDeleteCoversheet = async (coversheet) => {
      if (confirm("Delete coversheet: " + coversheet.title)) {
        await deleteRequestCoversheetById(coversheet.ID);
        this.refreshRequest();
      }
    };
    // Responses
    clickCloseReadyResponses = async () => {
      await Promise.all(
        this.currentRequestResponsesReadyToClose().map(
          (response) => response.closeResponse()
        )
      );
      this.refreshRequest();
    };
    viewResponseDocs = (response) => {
      this.tabs.selectTab(this.tabOpts.ResponseDocs);
      this.showCollapsed(true);
      this.showCollapsed.valueHasMutated();
      const responseDocsSummary = this.currentRequestResponseDocs().find(
        (responseDocsSummary2) => responseDocsSummary2.responseTitle == response.title
      );
      if (!responseDocsSummary)
        return;
      responseDocsSummary.collapsed(false);
      responseDocsSummary.highlightResponse();
    };
    highlightResponse = (responseTitle) => {
      this.tabs.selectTab(this.tabOpts.Responses);
      this.currentRequestResponseItems().find((response) => response.title == responseTitle)?.highlightResponse();
    };
    // ResponseDocs
    clickHelpResponseDocs = () => {
      var helpDlg = "<div id='helpDlg' style='padding:20px; height:100px; width:700px'><div style='padding:20px;'><fieldset><legend>Response Document Status</legend> <ul style='padding-top:10px;'><li style='padding-top:5px;'><b>Open</b> - Uploaded by the Action Office but not yet submitted to the Internal Auditor</li><li style='padding-top:5px;'><b>Submitted</b> - Submitted to the Internal Auditor by the Action Office</li><li style='padding-top:5px;'><b>Sent to QA</b> - Submitted to the Quality Assurance team by the Internal Auditor</li><li style='padding-top:5px;'><b>Approved</b> - Approved by the Quality Assurance team and submitted to the External Auditor</li><li style='padding-top:5px;'><b>Rejected</b> - Rejected by the Quality Assurance team and returned to the Internal Auditor</li><li style='padding-top:5px;'><b>Archived</b> - Previously Rejected by the Quality Assurance team and is now read-only for record keeping</li></ul></fieldset></div><table style='padding-top:10px; width:200px; float:right;'><tr><td class='ms-separator'>&#160;</td><td><input id='btnCancel' type='button' class='ms-ButtonHeightWidth' value='Close' title='Close Help' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)'/></td></tr></table></div>";
      $("body").append(helpDlg);
      var options = SP.UI.$create_DialogOptions();
      options.title = "Response Documents Help";
      options.height = 300;
      options.html = document.getElementById("helpDlg");
      SP.UI.ModalDialog.showModalDialog(options);
    };
    ClickBulkApprove = (responseDocSummary) => {
      const oResponseDocsForApproval = responseDocSummary.responseDocs.filter(
        (responseDoc) => this.responseDocCanBeApproved(responseDocSummary, responseDoc)
      );
      const request2 = this.currentRequest();
      const newResponseDocForm = new ConfirmApproveResponseDocForm(
        request2,
        null,
        oResponseDocsForApproval
      );
      const options = {
        form: newResponseDocForm,
        dialogReturnValueCallback: this.OnCallBackApproveResponseDoc.bind(this),
        title: "Approve Response Docs?"
      };
      showModalDialog(options);
    };
    ClickApproveResponseDoc = (oResponseDoc) => {
      const request2 = this.currentRequest();
      const newResponseDocForm = new ConfirmApproveResponseDocForm(
        request2,
        null,
        [oResponseDoc]
      );
      const options = {
        form: newResponseDocForm,
        dialogReturnValueCallback: this.OnCallBackApproveResponseDoc.bind(this),
        title: "Approve Response Doc?"
      };
      showModalDialog(options);
    };
    CheckResponseDocs = () => {
      const allDocs = this.currentRequestResponseDocs().filter(
        (responseDocSummary) => responseDocSummary.responseStatus == "2-Submitted"
      ).flatMap((responseDocSummary) => {
        return responseDocSummary.responseDocs;
      }).filter((responseDoc) => responseDoc.documentStatus == "Submitted").map(
        (responseDoc) => responseDoc.chkApproveResDoc(this.checkResponseDoc)
      );
      this.checkResponseDoc = !this.checkResponseDoc;
    };
    ApproveCheckedResponseDocs = () => {
      const allDocs = this.currentRequestResponseDocs().flatMap((responseDocSummary) => {
        return responseDocSummary.responseDocs;
      }).filter((responseDoc) => responseDoc.chkApproveResDoc());
      const request2 = this.currentRequest();
      const newResponseDocForm = new ConfirmApproveResponseDocForm(
        request2,
        null,
        allDocs
      );
      const options = {
        form: newResponseDocForm,
        dialogReturnValueCallback: this.OnCallBackApproveResponseDoc.bind(this),
        title: "Approve Response Docs?"
      };
      showModalDialog(options);
    };
    responseDocCanBeApproved = (responseDocSummary, responseDoc) => {
      return responseDoc.documentStatus == AuditResponseDocStates.Submitted && (responseDocSummary.responseStatus == AuditResponseStates.Submitted || responseDocSummary.responseStatus == AuditResponseStates.ApprovedForQA) && (responseDocSummary.requestStatus == AUDITREQUESTSTATES.OPEN || responseDocSummary.requestStatus == AUDITREQUESTSTATES.REOPENED);
    };
    async OnCallBackApproveResponseDoc(result) {
      if (result) {
        await this.refreshRequest();
      }
    }
    async OnCallBackDeleteRequest(result) {
      if (result) {
        alert("request deleted!");
        Audit.Common.Utilities.Refresh(true);
      }
    }
    ClickRejectResponseDoc = (oResponseDoc) => {
      const request2 = this.currentRequest();
      const newResponseDocForm = new ConfirmRejectResponseDocForm(request2, null, [
        oResponseDoc
      ]);
      const options = {
        form: newResponseDocForm,
        dialogReturnValueCallback: this.OnCallbackRejectResponseDoc.bind(this),
        title: "Reject Response Doc?"
      };
      showModalDialog(options);
    };
    async OnCallbackRejectResponseDoc(result) {
      if (!result)
        return;
      this.refreshRequest();
    }
    ClickViewResponse = (responseDocSummary) => {
      this.highlightResponse(responseDocSummary.responseTitle);
    };
  };
  directRegisterComponent(componentName6, {
    template: requestDetailViewTemplate
  });
  directRegisterComponent("requestDetailCoversheetsTabTemplate", {
    template: requestDetailCoversheetsTabTemplate
  });
  directRegisterComponent("requestDetailResponsesTabTemplate", {
    template: requestDetailResponsesTabTemplate
  });
  directRegisterComponent("requestDetailResponseDocsTabTemplate", {
    template: requestDetailResponseDocsTabTemplate
  });
  var ResponseItem = class {
    constructor(request2, response, report) {
      Object.assign(this, response);
      this.request = request2;
      this.refreshData = report.refreshRequest;
      this.responseCoversheetFiles.subscribeAdded(
        this.onCoversheetFilesAttachedHandler
      );
      this.responseDocFiles.subscribeAdded(
        this.onResponseDocFilesAttachedHandler
      );
    }
    highlight = ko.observable(false);
    responseCoversheetFiles = ko.observableArray();
    responseDocFiles = ko.observableArray();
    isReadyToClose = () => this.request.reqType == AUDITREQUESTTYPES.TASKER && this.resStatus != AuditResponseStates.Closed && this.responseDocs.length && !this.responseDocs.find(
      (responseDoc) => [AuditResponseDocStates.Open, AuditResponseDocStates.Submitted].includes(
        responseDoc.documentStatus
      )
    );
    clickCloseResponse = async () => {
      await this.closeResponse();
      this.refreshData();
    };
    closeResponse = () => {
      return closeResponseById(this.ID);
    };
    ClickViewResponseHistory = () => {
      appContext.AuditResponses.ListRef.showVersionHistoryModal(this.ID);
    };
    ClickDeleteResponse = async () => {
      if (confirm("Delete Response: " + this.title)) {
        const response = await appContext.AuditResponses.FindById(this.ID);
        await deleteResponseAndFolder2(response);
        this.refreshData();
      }
    };
    onCoversheetFilesAttachedHandler = async (files) => {
      if (!files.length)
        return;
      const request2 = await getRequestByTitle(this.number);
      const actionOfficeId = this.item.get_item("ActionOffice")?.get_lookupId();
      const actionOfficeIds = [];
      if (actionOfficeId) {
        actionOfficeIds.push({ ID: actionOfficeId });
      }
      const promises = [];
      for (let file of files) {
        promises.push(
          new Promise(async (resolve) => {
            const newSheet = await uploadRequestCoversheetFile(
              file,
              request2,
              actionOfficeIds
            );
            resolve();
          })
        );
      }
      await Promise.all(promises);
      this.responseCoversheetFiles.removeAll();
      this.refreshData();
    };
    onResponseDocFilesAttachedHandler = async (files) => {
      if (!files.length)
        return;
      const response = await appContext.AuditResponses.FindById(this.ID);
      const promises = [];
      for (let file of files) {
        promises.push(
          new Promise(async (resolve) => {
            const newSheet = await uploadResponseDocFile(response, file);
            resolve();
          })
        );
      }
      await Promise.all(promises);
      this.responseDocFiles.removeAll();
      this.refreshData();
    };
    highlightResponse = () => {
      document.getElementById(`response-item-title-${this.title}`)?.scrollIntoView({ block: "center", behavior: "smooth" });
      this.highlight(true);
      setTimeout(() => this.highlight(false), 2e3);
    };
  };
  var onc = `onclick="return DispEx(this,event,'TRUE','FALSE','FALSE','SharePoint.OpenDocuments.3','1','SharePoint.OpenDocuments','','','','2','0','0','0x7fffffffffffffff','','')"`;
  var ResponseDocSummary = class {
    constructor(oRequest, oResponse) {
      var showBulkApprove = false;
      var arrResponseDocs = new Array();
      for (var z = 0; z < oResponse.responseDocs.length; z++) {
        var oResponseDoc = oResponse.responseDocs[z];
        oResponseDoc.chkApproveResDoc = ko.observable(false);
        if (oResponseDoc.documentStatus == "Marked for Deletion")
          continue;
        oResponseDoc.docIcon = oResponseDoc.docIcon.get_value();
        oResponseDoc.styleTag = Audit.Common.Utilities.GetResponseDocStyleTag2(
          oResponseDoc.documentStatus
        );
        oResponseDoc.requestID = oRequest.ID;
        oResponseDoc.responseID = oResponse.ID;
        oResponseDoc.responseTitle = oResponse.title;
        oResponseDoc.responseDocOpenInIELink = `<a class='btn btn-link' target='_blank' title='Click to Open the document' onmousedown="return VerifyHref(this,event,'1','SharePoint.OpenDocuments','')" ` + onc + ' href="' + oResponseDoc.folder + "/" + oResponseDoc.fileName + '">' + oResponseDoc.fileName + "</a>";
        arrResponseDocs.push(oResponseDoc);
        if ([
          AuditResponseStates.Submitted,
          AuditResponseStates.ApprovedForQA
        ].includes(oResponse.resStatus) && oResponseDoc.documentStatus == AuditResponseDocStates.Submitted) {
          showBulkApprove = true;
        }
      }
      this.responseId = oResponse.ID;
      this.responseTitle = oResponse.title;
      this.responseDocs = arrResponseDocs;
      this.responseStatus = oResponse.resStatus;
      this.requestStatus = oRequest.status;
      this.showBulkApprove = showBulkApprove;
    }
    responseTitle;
    collapsed = ko.observable(false);
    highlight = ko.observable(false);
    titleRowElementId = () => "response-doc-summary-" + this.responseTitle;
    highlightResponse = () => {
      document.getElementById(this.titleRowElementId()).scrollIntoView({ behavior: "smooth", block: "center" });
      this.highlight(true);
      setTimeout(() => this.highlight(false), 2e3);
    };
    ClickViewResponseDocHistory = (responseDoc) => {
      appContext.AuditResponseDocs.ListRef.showVersionHistoryModal(
        responseDoc.ID
      );
    };
    responseDocCanBeApproved = (oResponseDoc) => {
      if (oResponseDoc.documentStatus != AuditResponseDocStates.Submitted)
        return false;
      return (this.responseStatus == AuditResponseStates.Submitted || this.responseStatus == AuditResponseStates.ApprovedForQA) && (this.requestStatus == AUDITREQUESTSTATES.OPEN || this.requestStatus == AUDITREQUESTSTATES.REOPENED);
    };
  };

  // src/components/forms/request/edit_form/EditRequestFormTemplate.js
  init_infrastructure();
  var editRequestFormTemplate = html4`
  <div class="audit-form bg-dark">
    <div class="form-fields" data-bind="foreach: FormFields">
      <!-- ko if: $parent.fieldIsEditable($data) -->
      <div
        class="form-field-component"
        data-bind="component: {
              name: components.edit, params: $data}, 
              class: classList"
      ></div>
      <!-- /ko -->
      <!-- ko ifnot: $parent.fieldIsEditable($data) -->
      <div
        class="form-field-component"
        data-bind="component: {
                name: components.view, params: $data}, 
                class: classList"
      ></div>
      <!-- /ko -->
    </div>
    <div class="form-actions">
      <!-- <button type="button" class="btn btn-warn" data-bind="click: clearForm">
      Clear Form
    </button> -->
      <button
        type="button"
        class="btn btn-success"
        data-bind="click: clickSubmit"
      >
        Submit
      </button>
    </div>
  </div>
`;

  // src/components/forms/request/edit_form/edit_request_form.js
  init_infrastructure();
  var componentName7 = "custom-edit-request-form";
  var EditRequestForm = class extends BaseForm {
    constructor({ entity }) {
      super({ entity });
      this.init();
    }
    init() {
    }
    async clickSubmit() {
      this.saving(true);
      await this.submit();
      this.saving(false);
    }
    async submit() {
      const errors = this.validate();
      if (errors.length)
        return;
      const request2 = this.entity;
      try {
        await updateRequest(request2);
        this.onComplete(SP.UI.DialogResult.OK);
      } catch (e) {
        alert(e);
      }
    }
    fieldIsEditable(field) {
      const request2 = this.entity;
      const nonEditableFields = [request2.ReqNum, request2.EmailSent];
      return !nonEditableFields.includes(field);
    }
    params = this;
    componentName = componentName7;
  };
  directRegisterComponent(componentName7, {
    template: editRequestFormTemplate
  });

  // src/components/forms/cover_sheet/edit_form/edit_cover_sheet_form.js
  init_infrastructure();

  // src/components/forms/cover_sheet/edit_form/EditCoverSheetFormTemplate.js
  init_infrastructure();
  var editCoverSheetFormTemplate = html4`
  <div class="audit-form bg-dark">
    <div class="form-fields" data-bind="foreach: FormFields">
      <!-- ko if: $parent.fieldIsEditable($data) -->
      <div
        class="form-field-component"
        data-bind="component: {
                name: components.edit, params: $data}, 
                class: width"
      ></div>
      <!-- /ko -->
      <!-- ko ifnot: $parent.fieldIsEditable($data) -->
      <div
        class="form-field-component"
        data-bind="component: {
                  name: components.view, params: $data}, 
                  class: width"
      ></div>
      <!-- /ko -->
    </div>
    <div class="form-actions">
      <!-- <button type="button" class="btn btn-warn" data-bind="click: clearForm">
        Clear Form
      </button> -->
      <button
        type="button"
        class="btn btn-success"
        data-bind="click: clickSubmit"
      >
        Submit
      </button>
    </div>
  </div>
`;

  // src/components/forms/cover_sheet/edit_form/edit_cover_sheet_form.js
  var componentName8 = "custom-edit-coversheet-form";
  var EditCoverSheetForm = class extends BaseForm {
    constructor({ entity }) {
      super({ entity });
    }
    async clickSubmit() {
      this.saving(true);
      await this.submit();
      this.saving(false);
    }
    async submit() {
      const errors = this.validate();
      if (errors.length)
        return;
      const coverSheet = this.entity;
      try {
        await updateRequestCoverSheet(coverSheet);
        this.onComplete(SP.UI.DialogResult.OK);
      } catch (e) {
        alert(e);
      }
    }
    fieldIsEditable(field) {
      const entity = this.entity;
      const nonEditableFields = [entity.ReqNum, entity.FileRef];
      return !nonEditableFields.includes(field);
    }
    params = this;
    componentName = componentName8;
  };
  directRegisterComponent(componentName8, {
    template: editCoverSheetFormTemplate
  });

  // src/pages/ia_db/ia_db.js
  init_audit_response();

  // src/components/forms/response/new_form/new_response_form.js
  init_entities2();
  init_infrastructure();

  // src/components/forms/response/new_form/NewResponseFormTemplate.js
  init_infrastructure();
  var newResponseFormTemplate = html4`
  <div class="audit-form bg-dark new-request-form">
    <div class="form-fields" data-bind="foreach: FormFields">
      <!-- ko if: $parent.fieldIsEditable($data) -->
      <div
        class="form-field-component"
        data-bind="component: {
              name: components.edit, params: $data}, 
              class: classList"
      ></div>
      <!-- /ko -->
      <!-- ko ifnot: $parent.fieldIsEditable($data) -->
      <div
        class="form-field-component"
        data-bind="component: {
                name: components.view, params: $data}, 
                class: classList"
      ></div>
      <!-- /ko -->
    </div>
    <div class="form-actions">
      <button type="button" class="btn btn-warn" data-bind="click: clearForm">
        Clear Form
      </button>
      <button
        type="button"
        class="btn btn-success"
        data-bind="click: clickSubmit"
      >
        Create Response
      </button>
    </div>
  </div>
`;

  // src/components/forms/response/new_form/new_response_form.js
  var componentName9 = "custome-new-response-form";
  var NewResponseForm = class extends BaseForm {
    constructor({ entity }) {
      super({ entity, view: AuditResponse.Views.NewForm });
    }
    async clickSubmit() {
      this.saving(true);
      await this.submit();
      this.saving(false);
    }
    async submit() {
      const errors = this.validate();
      if (errors.length)
        return;
      const response = ko.unwrap(this.entity);
      try {
        await addResponse(response.ReqNum.Value(), response);
        this.onComplete(SP.UI.DialogResult.OK);
      } catch (e) {
        alert(e);
      }
    }
    clearForm() {
    }
    fieldIsEditable(field) {
      const entity = ko.unwrap(this.entity);
      const nonEditableFields = [entity.ReqNum];
      return !nonEditableFields.includes(field);
    }
    componentName = componentName9;
  };
  directRegisterComponent(componentName9, {
    template: newResponseFormTemplate
  });

  // src/components/forms/response/edit_form/edit_response_form.js
  init_entities2();
  init_infrastructure();

  // src/components/forms/response/edit_form/EditResponseFormTemplate.js
  init_infrastructure();
  var editResponseFormTemplate = html4`
  <div class="audit-form bg-dark">
    <div class="form-fields" data-bind="foreach: FormFields">
      <!-- ko if: $parent.fieldIsEditable($data) -->
      <div
        class="form-field-component"
        data-bind="component: {
                name: components.edit, params: $data}, 
                class: classList"
      ></div>
      <!-- /ko -->
      <!-- ko ifnot: $parent.fieldIsEditable($data) -->
      <div
        class="form-field-component"
        data-bind="component: {
                  name: components.view, params: $data}, 
                  class: classList"
      ></div>
      <!-- /ko -->
    </div>
    <div class="form-actions">
      <button
        type="button"
        class="btn btn-success"
        data-bind="click: clickSubmit"
      >
        Submit
      </button>
    </div>
  </div>
`;

  // src/components/forms/response/edit_form/edit_response_form.js
  var componentName10 = "custome-edit-response-form";
  var EditResponseForm = class extends BaseForm {
    constructor({ entity }) {
      super({ entity, view: AuditResponse.Views.EditForm });
      this.currentResponseStatus = entity.ResStatus.Value();
      entity.ResStatus.Value.subscribe(this.onStatusChangedHandler, this);
    }
    onStatusChangedHandler = async (newValue) => {
      if (newValue != this.currentResponseStatus && newValue == AuditResponseStates.Closed) {
        const response = ko.unwrap(this.entity);
        const curUser = await currentUser2();
        response.ClosedBy.Value(curUser);
        response.ClosedDate.Value(/* @__PURE__ */ new Date());
      }
    };
    async clickSubmit() {
      this.saving(true);
      await this.submit();
      this.saving(false);
    }
    async submit() {
      const errors = this.validate();
      if (errors.length)
        return;
      const response = ko.unwrap(this.entity);
      try {
        await updateResponse(response.ReqNum.Value(), response);
        this.onComplete(SP.UI.DialogResult.OK);
      } catch (e) {
        alert(e);
      }
    }
    fieldIsEditable(field) {
      const entity = ko.unwrap(this.entity);
      const nonEditableFields = [
        entity.ReqNum,
        entity.Title,
        entity.SampleNumber
      ];
      return !nonEditableFields.includes(field);
    }
    componentName = componentName10;
  };
  directRegisterComponent(componentName10, {
    template: editResponseFormTemplate
  });

  // src/components/forms/response_doc/edit_form/edit_response_doc_form.js
  init_infrastructure();
  init_entities2();

  // src/components/forms/response_doc/edit_form/EditResponseDocFormTemplate.js
  init_infrastructure();
  var editResponseDocFormTemplate = html4`
  <div class="audit-form bg-dark">
    <!-- ko foreach: StatusErrors -->
    <div class="alert alert-warning" data-bind="text: $data"></div>
    <!-- /ko -->
    <div class="form-fields" data-bind="foreach: FormFields">
      <!-- ko if: $parent.fieldIsEditable($data) -->
      <div
        class="form-field-component"
        data-bind="component: {
                name: components.edit, params: $data}, 
                class: width"
      ></div>
      <!-- /ko -->
      <!-- ko ifnot: $parent.fieldIsEditable($data) -->
      <div
        class="form-field-component"
        data-bind="component: {
                  name: components.view, params: $data}, 
                  class: width"
      ></div>
      <!-- /ko -->
    </div>
    <div class="form-actions">
      <button
        type="button"
        class="btn btn-success"
        data-bind="click: clickSubmit, disable: StatusErrors().length"
      >
        Submit
      </button>
    </div>
  </div>
`;

  // src/components/forms/response_doc/edit_form/edit_response_doc_form.js
  var componentName11 = "custome-edit-responsedoc-form";
  var EditResponseDocForm = class extends BaseForm {
    constructor({ entity }) {
      super({ entity, view: AuditResponseDoc.Views.EditForm });
      this.currentResponseDocStatus = entity.DocumentStatus.Value();
      entity.DocumentStatus.Value.subscribe(this.onStatusChangedHandler, this);
    }
    onStatusChangedHandler = (newValue) => {
      if (newValue != this.currentResponseDocStatus) {
      }
    };
    async clickSubmit() {
      this.saving(true);
      await this.submit();
      this.saving(false);
    }
    async submit() {
      const errors = this.validate();
      if (errors.length)
        return;
      const responseDoc = ko.unwrap(this.entity);
      const request2 = responseDoc.ReqNum.Value();
      const response = responseDoc.ResID.Value();
      try {
        await updateResponseDoc(request2, response, responseDoc);
        this.onComplete(SP.UI.DialogResult.OK);
      } catch (e) {
        alert(e);
      }
    }
    fieldIsEditable(field) {
      const entity = ko.unwrap(this.entity);
      const nonEditableFields = [entity.ReqNum, entity.ResID, entity.FileName];
      return !nonEditableFields.includes(field);
    }
    StatusErrors = ko.pureComputed(() => {
      const errors = [];
      const responseDoc = ko.unwrap(this.entity);
      if (!responseDoc)
        return errors;
      const requestStatus = responseDoc.ReqNum.Value()?.ReqStatus.Value();
      const responseStatus = responseDoc.ResID.Value()?.ResStatus.Value();
      if (requestStatus != AUDITREQUESTSTATES.OPEN && requestStatus != AUDITREQUESTSTATES.REOPENED) {
        errors.push(
          "The Request associated to this Document is not Open. It can only be re-opened from the IA Dashboard"
        );
      }
      if (responseStatus == AuditResponseStates.Closed) {
        errors.push(
          "The Response associated to this Document is Closed. It can only be re-opened from the IA Dashboard"
        );
      }
      return errors;
    });
    componentName = componentName11;
  };
  directRegisterComponent(componentName11, {
    template: editResponseDocFormTemplate
  });

  // src/pages/ia_db/ia_db.js
  init_store();
  init_entities2();
  init_infrastructure();

  // src/components/bulk_add_request/bulk_add_request.js
  init_application_db_context();
  init_infrastructure();

  // src/components/bulk_add_request/BulkAddRequestTemplate.js
  init_infrastructure();
  var bulkAddRequestTemplate = html4`
  <div id="bulkAddRequest" class="audit">
    <button
      class="btn btn-warn"
      type="button"
      data-bind="click: clickUploadResponses"
    >
      Add/Modify Requests
    </button>
    <div id="divBulkRequests" data-bind="if: bulkRequestItems">
      <table id="tblBulkRequests" class="tablesorter report">
        <thead>
          <tr>
            <th>Request Number</th>
            <th>Request Subject</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody data-bind="foreach: bulkRequestItems">
          <tr class="bulk-request-item" data-bind="class: status">
            <td data-bind="text: bulkRequest.Title"></td>
            <td data-bind="text: bulkRequest.FieldMap.ReqSubject.toString"></td>
            <td data-bind="text: message"></td>
          </tr>
        </tbody>
        <tfoot class="footer">
          <tr>
            <th colspan="3">
              Total: <span data-bind="text: bulkRequestItems().length"></span>
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
    <div class="">
      <button
        class="btn btn-success"
        type="button"
        data-bind="click: clickSubmitRequests, enable: bulkRequestItems().length"
        title="Click here to Create the Responses"
      >
        Create Requests
      </button>
    </div>
  </div>

  <style>
    #bulkAddRequest button {
      margin-bottom: 10px;
    }
    div#divBulkRequests {
      margin: 10px;
    }

    tr.bulk-request-item {
    }

    tr.bulk-request-item.pending td {
      color: white !important;
    }
    tr.bulk-request-item.pending {
      color: white !important;
      background-color: var(--warn-color);
    }

    tr.bulk-request-item.succeeded td {
      color: white !important;
    }
    tr.bulk-request-item.succeeded {
      color: white !important;
      background-color: var(--success-color);
    }

    tr.bulk-request-item.failed td {
      color: white !important;
    }
    tr.bulk-request-item.failed {
      color: white !important;
      background-color: var(--danger-color);
    }
  </style>
`;

  // src/components/bulk_add_request/bulk_add_request.js
  var componentName12 = "bulk-add-request-form";
  var BulkAddRequestForm = class {
    constructor() {
    }
    bulkRequestItems = ko.observableArray();
    working = ko.observable(false);
    async Init() {
      this.fetchBulkRequests();
    }
    async clickUploadResponses() {
      toggle(false);
      await appContext.AuditBulkRequests.ShowForm(
        "BulkAddRequest.aspx",
        "Bulk Add Requests",
        {}
      );
      toggle(true);
      this.fetchBulkRequests();
    }
    async fetchBulkRequests() {
      console.log("Request added callback");
      const bulkRequests = await appContext.AuditBulkRequests.ToList(true);
      this.bulkRequestItems(
        bulkRequests.map((bulkRequest) => {
          return {
            bulkRequest,
            status: ko.observable(""),
            message: ko.observable("")
          };
        })
      );
    }
    async clickSubmitRequests() {
      this.working(true);
      const bulkRequestItems = this.bulkRequestItems();
      const failedInserts = [];
      const insertPromises = bulkRequestItems.map(async (bulkRequestItem) => {
        bulkRequestItem.status("pending");
        const bulkRequest = bulkRequestItem.bulkRequest;
        const newRequest = bulkRequest.toRequest();
        newRequest.Reminders.Value(newRequest.Reminders.Options());
        try {
          await addNewRequest(newRequest);
          await onAddNewRequest(newRequest);
        } catch (e) {
          failedInserts.push([e, bulkRequest]);
          bulkRequestItem.status("failed");
          bulkRequestItem.message(e.message);
          return;
        }
        bulkRequestItem.status("succeeded");
        await appContext.AuditBulkRequests.RemoveEntity(bulkRequest);
      });
      const insertResults = await Promise.all(insertPromises);
      this.working(false);
    }
    componentName = componentName12;
    params = this;
  };
  directRegisterComponent(componentName12, {
    template: bulkAddRequestTemplate
  });

  // src/pages/ia_db/ia_db.js
  document.getElementById("app").innerHTML = iaDbTemplate;
  window.Audit = window.Audit || {};
  Audit.IAReport = Audit.IAReport || {};
  var requestParam = "ReqNum";
  async function InitReport2() {
    await InitSal();
    const configurationsPromise = appContext.AuditConfigurations.ToList().then(
      (configurations) => {
        configurations.map(
          (config) => configurationsStore[config.key] = config.value
        );
      }
    );
    const auditOrganizationsPromise = appContext.AuditOrganizations.ToList().then(
      (organizations) => {
        ko.utils.arrayPushAll(
          auditOrganizationStore,
          organizations.sort(sortByTitle)
        );
      }
    );
    await Promise.all([configurationsPromise, auditOrganizationsPromise]);
    ensureDBPermissions();
    Audit.IAReport.Report = new Audit.IAReport.NewReportPage();
    Audit.IAReport.Init();
  }
  Audit.IAReport.Init = function() {
    function SetTimer() {
      var intervalRefreshID = setInterval(function() {
        var divVal = $("#divCounter").text();
        var count = divVal * 1 - 1;
        $("#divCounter").text(count);
        if (count <= 0) {
          if (!Audit.IAReport.Report.IsTransactionExecuting())
            Audit.IAReport.Report.Refresh();
          else {
            clearInterval(intervalRefreshID);
            $("#divCounter").text("1200");
            SetTimer();
          }
        }
      }, 1e3);
    }
    SetTimer();
  };
  Audit.IAReport.NewReportPage = function() {
    _myViewModel = new ViewModel();
    ko.applyBindings(_myViewModel);
    LoadInfo();
    var publicMembers = {
      Load: m_fnLoadData,
      ViewPermissions: m_fnViewPermissions,
      ViewLateRequests: m_fnViewLateRequests,
      ViewResponseDocsToday: m_fnViewResponseDocsToday,
      ViewReturnedDocs: m_fnViewReturnedDocs,
      GoToRequest: function(requestNum, responseTitle) {
        m_fnGoToRequest(requestNum, responseTitle);
      },
      IsTransactionExecuting: function() {
        return m_bIsTransactionExecuting;
      },
      Refresh: m_fnRefresh,
      CreateInternalRequestItem: m_fnCreateRequestInternalItem
    };
    return publicMembers;
  };
  var m_libCoverSheetLibraryGUID = null;
  var m_libRequestDocsLibraryGUID = null;
  var m_libResponseDocsLibraryGUID = null;
  var m_coversheetDocsLibrary = null;
  var m_requestDocsLibrary = null;
  var m_responseDocsLibrary = null;
  var m_bigMap = {};
  function m_getArrRequests() {
    return Object.entries(m_bigMap).filter(([key, value]) => {
      return key.startsWith("request-");
    }).map(([key, value]) => value);
  }
  var m_arrRequestsToClose = new Array();
  var m_arrPermissionsResponseFolders = new Array();
  var m_userPermissionAccess = null;
  var m_PageItems = null;
  var m_itemID = null;
  var m_requestNum = null;
  var m_responseTitle = null;
  var m_responseStatus = null;
  var m_bIsTransactionExecuting = false;
  var notifyId2 = null;
  var m_bIsSiteOwner = true;
  var m_sGoToResponseTitle = null;
  var m_oRequestTitleAndDocCount = new Object();
  var m_oResponseTitleAndDocCount = new Object();
  var m_sResponseStatusToFilterOn = "1-Open";
  var _myViewModel = null;
  function ViewModel() {
    var self = this;
    self.refresh = () => window.location.reload();
    self.debugMode = ko.observable(false);
    self.siteUrl = Audit.Common.Utilities.GetSiteUrl();
    self.showQuickInfo = ko.observable(false);
    self.arrRequests = ko.observableArray(null);
    self.arrResponses = ko.observableArray(null);
    self.cntPendingReview = ko.observable(0);
    self.arrRequestsThatNeedClosing = ko.observableArray(null);
    self.arrResponseDocsCheckedOut = ko.observableArray(null);
    self.arrResponsesWithUnsubmittedResponseDocs = ko.observableArray();
    self.arrRequestsInternalAlmostDue = ko.observableArray(null);
    self.arrRequestsInternalPastDue = ko.observableArray(null);
    self.arrRequestsAlmostDue = ko.observableArray(null);
    self.arrRequestsPastDue = ko.observableArray(null);
    self.arrRequestsWithNoResponses = ko.observableArray(null);
    self.arrRequestsWithNoEmailSent = ko.observableArray(null);
    self.arrResponsesSubmittedByAO = ko.observableArray(null);
    self.arrResponsesReadyToClose = ko.observableArray();
    self.alertQuickInfo = ko.pureComputed(() => {
      return self.arrRequestsThatNeedClosing().length || self.arrResponseDocsCheckedOut().length || self.arrResponsesWithUnsubmittedResponseDocs().length || self.arrRequestsInternalAlmostDue().length || self.arrRequestsInternalPastDue().length || self.arrRequestsAlmostDue().length || self.arrRequestsPastDue().length || self.arrRequestsWithNoResponses().length || self.arrRequestsWithNoEmailSent().length || self.arrResponsesSubmittedByAO().length || self.arrResponsesReadyToClose().length;
    });
    self.clickExpandActionOffices = (item, e) => {
      e.target.parentElement.querySelector(".sr1-request-actionOffice-items").classList.toggle("collapsed");
    };
    self.ddOptionsRequestInfoTabRequestName = ko.pureComputed(() => {
      return self.arrRequests().map((req) => req.reqNumber).sort();
    });
    self.filterRequestInfoTabRequestName = ko.observableArray();
    self.currentRequest = ko.observable();
    self.arrCurrentRequestRequestDocs = ko.observableArray(null);
    self.arrCurrentRequestCoverSheets = ko.observableArray(null);
    self.bDisplayClose = ko.observable(false);
    self.showUpload = ko.observable(false);
    self.showSubmit = ko.observable(false);
    self.currentDialogs = currentDialogs;
    self.tabOpts = {
      Requests: new Tab("request-report", "Request Status Report", {
        id: "requestStatusReportTemplate",
        data: self
      }),
      Responses: new Tab("response-report", "Response Status Report", {
        id: "responseStatusReportTemplate",
        data: self
      }),
      // RequestDetail: new Tab("request-detail-dep", "Request Information", {
      //   id: "requestDetailTemplateDeprecated",
      //   data: self,
      // }),
      RequestDetail: new Tab("request-detail", "Request Information", {
        id: "requestDetailTemplate",
        data: self
      })
      // NewRequest: new Tab("new-request", "New Request", {
      //   id: "newRequestTemplate",
      //   data: new NewRequestFormComponent({
      //     onComplete: OnCallbackFormNewRequest,
      //   }),
      // }),
    };
    self.tabs = new TabsModule(Object.values(self.tabOpts));
    self.runningTasks = runningTasks;
    self.blockingTasks = blockingTasks;
    self.ClickNewRequest = () => {
      m_fnCreateRequest();
    };
    self.ClickResetPerms = () => {
      ensureAllAppPerms();
    };
    self.ClickBulkAddRequest = () => {
      m_fnBulkAddRequest();
    };
    self.ClickGoToRequest = function(oRequest) {
      if (oRequest && oRequest.number)
        m_fnGoToRequest(oRequest.number);
    };
    self.ClickViewRequest = function() {
      var oRequest = self.currentRequest();
      if (oRequest && oRequest.ID)
        m_fnViewRequest(oRequest.ID);
    };
    self.ClickEditRequest = function() {
      var oRequest = self.currentRequest();
      if (oRequest && oRequest.number)
        m_fnEditRequest(oRequest.ID, oRequest.number);
    };
    self.ClickViewRequestDoc = function(oRD) {
      if (oRD && oRD.ID)
        m_fnViewRequestDoc(oRD.ID);
    };
    self.ClickEditRequestDoc = function(oRD) {
      var oRequest = self.currentRequest();
      if (oRD && oRD.ID && oRequest && oRequest.number)
        m_fnEditRequestDoc(oRD.ID, oRequest.number);
    };
    self.ClickViewCoversheet = function(oCS) {
      if (oCS && oCS.ID)
        m_fnViewCoverSheet(oCS.ID);
    };
    self.ClickEditCoversheet = function(oCS) {
      var oRequest = self.currentRequest();
      if (oCS && oCS.ID && oRequest && oRequest.number)
        m_fnEditCoverSheet(oCS.ID, oRequest.number);
    };
    self.ClickCloseRequest = function() {
      m_fnCloseRequest();
    };
    self.ClickGrantSpecialPermissions = function() {
      var oRequest = self.currentRequest();
      if (oRequest && oRequest.number)
        m_fnGrantSpecialPermissions(oRequest.number);
    };
    self.ClickRemoveSpecialPermissions = function() {
      var oRequest = self.currentRequest();
      if (oRequest && oRequest.number)
        m_fnRemoveSpecialPermissions(oRequest.number);
    };
    self.ClickUploadRequestDoc = function() {
      var oRequest = self.currentRequest();
      if (oRequest && oRequest.number)
        m_fnUploadRequestDoc(oRequest.number);
    };
    self.ClickSendEmail = function() {
      var oRequest = self.currentRequest();
      if (oRequest && oRequest.ID)
        m_fnSendEmail(oRequest.ID);
    };
    self.ClickViewEmailHistoryFolder = function() {
      var oRequest = self.currentRequest();
      if (oRequest && oRequest.number)
        m_fnViewEmailHistoryFolder(oRequest.number);
    };
    self.ClickSyncEmailActionOffices = function() {
      var oRequest = self.currentRequest();
      if (oRequest && oRequest.ID)
        m_fnSyncEmailActionOffices(oRequest.ID);
    };
    self.ClickViewResponse = function(oResponse) {
      var oRequest = self.currentRequest();
      if (oRequest && oRequest.number && oResponse)
        m_fnViewResponse(
          oRequest.number,
          oResponse.ID,
          oResponse.title,
          oResponse.resStatus
        );
    };
    self.ClickEditResponse = function(oResponse) {
      var oRequest = self.currentRequest();
      if (oRequest && oRequest.number && oResponse)
        m_fnEditResponse(
          oRequest.number,
          oResponse.ID,
          oResponse.title,
          oResponse.resStatus
        );
    };
    self.ClickReviewingResponse = function(oResponse) {
      var oRequest = self.currentRequest();
      if (oRequest && oRequest.number && oResponse)
        m_fnReviewingResponse(oResponse.activeViewers);
    };
    self.ClickReOpenResponse = function(oResponse) {
      var oRequest = self.currentRequest();
      if (oRequest && oRequest.number && oResponse)
        m_fnReOpenResponse(oRequest.number, oResponse.title);
    };
    self.ClickAddResponse = function() {
      var oRequest = self.currentRequest();
      if (oRequest && oRequest.number)
        m_fnAddResponse(oRequest.ID, oRequest.number);
    };
    self.ClickBulkAddResponse = function() {
      var oRequest = self.currentRequest();
      if (oRequest && oRequest.number)
        m_fnBulkAddResponse(oRequest.number);
    };
    self.ClickBulkEditResponse = function() {
      var oRequest = self.currentRequest();
      if (oRequest && oRequest.number)
        m_fnBulkEditResponse(oRequest.number);
    };
    self.ClickCheckInResponseDocument = function(oResponseDoc) {
      if (oResponseDoc && oResponseDoc.folder && oResponseDoc.fileName)
        m_fnCheckInResponseDoc(oResponseDoc.folder, oResponseDoc.fileName);
    };
    self.ClickViewResponseDocFolder = function(oResponse) {
      if (oResponse && oResponse.title)
        m_fnViewResponseDocFolder(oResponse.title);
    };
    self.ClickViewResponseDoc = function(oResponseDoc) {
      if (oResponseDoc && oResponseDoc.requestID && oResponseDoc.responseTitle)
        m_fnViewResponseDoc(
          oResponseDoc.ID,
          oResponseDoc.requestID,
          oResponseDoc.responseTitle
        );
    };
    self.ClickEditResponseDoc = function(oResponseDoc) {
      if (oResponseDoc && oResponseDoc.requestID && oResponseDoc.responseTitle)
        m_fnEditResponseDoc(
          oResponseDoc.ID,
          oResponseDoc.requestID,
          oResponseDoc.responseTitle
        );
    };
    self.ClickDeleteResponseDoc = function(oResponseDoc) {
      if (oResponseDoc && oResponseDoc.ID)
        m_fnDeleteResponseDoc(oResponseDoc.ID);
    };
    self.ClickResendRejectedResponseDocToQA = function(oResponseDoc) {
      if (oResponseDoc && oResponseDoc.ID)
        m_fnResendRejectedResponseDocToQA(oResponseDoc.ID);
    };
    self.requestDetailViewComponent = new RequestDetailView(self);
    self.filterRequestInfoTable = (prop, value) => {
      const tbl = document.getElementById("tblStatusReportRequests");
      tbl.filterByColIndex();
    };
    self.arrRequests.subscribe((arrayChanges) => {
      document.getElementById("tblStatusReportRequests")?.update();
    }, "arrayChange");
    self.arrResponses.subscribe((arrayChanges) => {
      document.getElementById("tblStatusReportResponses")?.update();
    }, "arrayChange");
    self.filterStatusTables = (newValue) => {
      Audit.Common.Utilities.OnLoadDisplayTimeStamp();
      var paramTabIndex = GetUrlKeyValue("Tab");
      var paramRequestNum = GetUrlKeyValue("ReqNum");
      var paramResNum = GetUrlKeyValue("ResNum");
      if (paramTabIndex != null && paramTabIndex != "") {
        self.tabs.selectById(paramTabIndex);
      } else {
        self.tabs.selectTab(self.tabOpts.Requests);
      }
      if (paramRequestNum != null && paramRequestNum != "") {
        if (paramTabIndex == self.tabOpts.Responses.id)
          document.getElementById("tblStatusReportResponses").filterByColIndex(0, paramRequestNum);
        else
          self.filterRequestInfoTabRequestName(paramRequestNum);
      }
      if (paramResNum != null && paramResNum != "" && paramTabIndex == self.tabOpts.Responses.id) {
        document.getElementById("tblStatusReportResponses").filterByColIndex(2, paramResNum);
      } else
        document.getElementById("tblStatusReportResponses").filterByColIndex(4, m_sResponseStatusToFilterOn);
    };
    var requestUnloadEventHandler = function(oRequest) {
      return function(event) {
        oRequest.activeViewers.removeCurrentuser();
      };
    };
    var currentRequestUnloadEventHandler;
    self.filterRequestInfoTabRequestName.subscribe(
      function(oldValue) {
        var oRequest = m_bigMap["request-" + oldValue];
        if (oRequest && oRequest.activeViewers) {
          oRequest.activeViewers.removeCurrentuser();
          window.removeEventListener(
            "beforeunload",
            currentRequestUnloadEventHandler
          );
        }
      },
      null,
      "beforeChange"
    );
    self.filterRequestInfoTabRequestName.subscribe(function(newValue) {
      self.currentRequest(null);
      self.arrCurrentRequestRequestDocs([]);
      self.arrCurrentRequestCoverSheets([]);
      self.bDisplayClose(false);
      var oRequest = m_bigMap["request-" + newValue];
      if (oRequest) {
        if (oRequest.activeViewers) {
          oRequest.activeViewers.pushCurrentUser();
          currentRequestUnloadEventHandler = requestUnloadEventHandler(oRequest);
          window.addEventListener(
            "beforeunload",
            currentRequestUnloadEventHandler
          );
        }
        m_fnRequeryRequest(oRequest.ID);
      } else {
      }
    });
    window.addEventListener("popstate", (event) => {
      if (event.state && event.state[requestParam]) {
        self.filterRequestInfoTabRequestName(event.state[requestParam]);
      }
    });
    self.currentRequest.subscribe((request2) => {
      if (request2)
        setUrlParam(requestParam, request2.number);
    });
  }
  function LoadInfo() {
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();
    var requestList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleRequests());
    var requestQuery = new SP.CamlQuery();
    requestQuery.set_viewXml(
      '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'
    );
    const m_requestItems = requestList.getItems(requestQuery);
    currCtx.load(
      m_requestItems,
      "Include(ID, Title, ReqType, ReqSubject, ReqStatus, RequestingOffice, FiscalYear, IsSample, ReqDueDate, InternalDueDate, ActionOffice, EmailActionOffice, Reviewer, Owner, ReceiptDate, RelatedAudit, ActionItems, Comments, EmailSent, ClosedDate, ClosedBy, Modified, Sensitivity)"
    );
    var requestInternalList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleRequestsInternal());
    var requestInternalQuery = new SP.CamlQuery();
    requestInternalQuery.set_viewXml(
      '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'
    );
    const m_requestInternalItems = requestInternalList.getItems(requestInternalQuery);
    currCtx.load(
      m_requestInternalItems,
      "Include(ID, Title, ReqNum, InternalStatus, ActiveViewers)"
    );
    var responseList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleResponses());
    var responseQuery = new SP.CamlQuery();
    responseQuery.set_viewXml(
      '<View><Query><OrderBy><FieldRef Name="ReqNum"/></OrderBy></Query></View>'
    );
    const m_responseItems = responseList.getItems(responseQuery);
    currCtx.load(
      m_responseItems,
      "Include(ID, Title, ReqNum, ActionOffice, ReturnReason, SampleNumber, ResStatus, ActiveViewers, Comments, Modified, ClosedDate, ClosedBy, POC, POCCC)"
    );
    var responseDocsLib = web.get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
    var responseDocsQuery = new SP.CamlQuery();
    responseDocsQuery.set_viewXml(
      '<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="ReqNum"/><FieldRef Name="ResID"/></OrderBy><Where><Eq><FieldRef Name="ContentType"/><Value Type="Text">Document</Value></Eq></Where></Query></View>'
    );
    const m_ResponseDocsItems = responseDocsLib.getItems(responseDocsQuery);
    currCtx.load(
      m_ResponseDocsItems,
      "Include(ID, Title, ReqNum, ResID, DocumentStatus, RejectReason, ReceiptDate, FileLeafRef, FileDirRef, File_x0020_Size, CheckoutUser, Modified, Editor, Created)"
    );
    const m_groupColl = web.get_siteGroups();
    currCtx.load(m_groupColl);
    var aoList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleActionOffices());
    var aoQuery = new SP.CamlQuery();
    aoQuery.set_viewXml(
      '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'
    );
    const m_aoItems = aoList.getItems(aoQuery);
    currCtx.load(m_aoItems, "Include(ID, Title, UserGroup)");
    var ob = new SP.BasePermissions();
    ob.set(SP.PermissionKind.deleteListItems);
    m_userPermissionAccess = web.doesUserHavePermissions(ob);
    currCtx.executeQueryAsync(OnSuccess, OnFailure);
    function OnSuccess(sender, args) {
      m_bIsSiteOwner = m_userPermissionAccess.get_value();
      if (m_bIsSiteOwner) {
        let OnSuccessLoadPages = function(sender2, args2) {
          $("#divIA").show();
          m_fnLoadInitialData(
            m_aoItems,
            m_groupColl,
            m_requestItems,
            m_requestInternalItems,
            m_responseItems,
            m_ResponseDocsItems
          );
          ensureROEmailFolder();
        }, OnFailureLoadPages = function(sender2, args2) {
          $("#divIA").show();
          m_fnLoadInitialData(
            m_aoItems,
            m_groupColl,
            m_requestItems,
            m_requestInternalItems,
            m_responseItems,
            m_ResponseDocsItems
          );
        };
        var currCtx2 = new SP.ClientContext.get_current();
        var web2 = currCtx2.get_web();
        var pagesLib = web2.get_lists().getByTitle("Pages");
        var pagesQuery = new SP.CamlQuery();
        pagesQuery.set_viewXml(
          '<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Or><Eq><FieldRef Name="FileLeafRef"/><Value Type="Text">AO_DB.aspx</Value></Eq><Eq><FieldRef Name="FileLeafRef"/><Value Type="Text">RO_DB.aspx</Value></Eq></Or></Where></Query></View>'
        );
        m_PageItems = pagesLib.getItems(pagesQuery);
        currCtx2.load(
          m_PageItems,
          "Include(ID, Title, FileLeafRef, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
        );
        var emailList = web2.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory());
        var emailListQuery = new SP.CamlQuery();
        emailListQuery.set_viewXml(
          '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><And><Eq><FieldRef Name="Title"/><Value Type="Text">EANotifications</Value></Eq><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></And></Where></Query></View>'
        );
        var emailListFolderItemsEA = emailList.getItems(emailListQuery);
        currCtx2.load(emailListFolderItemsEA, "Include(ID, Title, DisplayName)");
        currCtx2.executeQueryAsync(OnSuccessLoadPages, OnFailureLoadPages);
      } else {
        $("#divIA").show();
        m_bIsSiteOwner = false;
        m_fnLoadInitialData(
          m_aoItems,
          m_groupColl,
          m_requestItems,
          m_requestInternalItems,
          m_responseItems,
          m_ResponseDocsItems
        );
      }
      setTimeout(function() {
        m_fnLoadRemainder();
      }, 100);
    }
    function OnFailure(sender, args) {
      $("#divLoading").hide();
      const statusId2 = SP.UI.Status.addStatus(
        "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
      );
      SP.UI.Status.setStatusPriColor(statusId2, "red");
      m_bIsSiteOwner = false;
    }
  }
  function m_fnRefresh(requestNumber) {
    window.location.reload();
  }
  function m_fnLoadInitialData(m_aoItems, m_groupColl, m_requestItems, m_requestInternalItems, m_responseItems, m_ResponseDocsItems) {
    Audit.Common.Utilities.LoadSiteGroups(m_groupColl);
    Audit.Common.Utilities.LoadActionOffices(m_aoItems);
    m_fnLoadData(
      m_requestItems,
      m_requestInternalItems,
      m_responseItems,
      m_ResponseDocsItems
    );
  }
  function m_fnLoadData(m_requestItems, m_requestInternalItems, m_responseItems, m_ResponseDocsItems) {
    LoadRequests(m_requestItems);
    LoadRequestsInternal(m_requestInternalItems);
    LoadResponses(m_responseItems);
    LoadResponseDocs(m_ResponseDocsItems);
    LoadResponseCounts();
    DisplayRequestsThatShouldClose();
    LoadTabStatusReport1();
    LoadTabStatusReport2();
  }
  async function m_fnRefreshData(requestId = null) {
    if (!requestId)
      requestId = _myViewModel.currentRequest()?.ID;
    await m_fnRequeryRequest(requestId);
    return;
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();
    var requestList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleRequests());
    var requestQuery = new SP.CamlQuery();
    requestQuery.set_viewXml(
      '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'
    );
    const m_requestItems = requestList.getItems(requestQuery);
    currCtx.load(
      m_requestItems,
      "Include(ID, Title, ReqType, ReqSubject, ReqStatus, RequestingOffice, FiscalYear, IsSample, ReqDueDate, InternalDueDate, ActionOffice, EmailActionOffice, Reviewer, Owner, ReceiptDate, RelatedAudit, ActionItems, Comments, EmailSent, ClosedDate, ClosedBy, Modified, Sensitivity)"
    );
    var requestInternalList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleRequestsInternal());
    var requestInternalQuery = new SP.CamlQuery();
    requestInternalQuery.set_viewXml(
      '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'
    );
    const m_requestInternalItems = requestInternalList.getItems(requestInternalQuery);
    currCtx.load(
      m_requestInternalItems,
      "Include(ID, Title, ReqNum, InternalStatus, ActiveViewers)"
    );
    var responseList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleResponses());
    var responseQuery = new SP.CamlQuery();
    responseQuery.set_viewXml(
      '<View><Query><OrderBy><FieldRef Name="ReqNum"/></OrderBy></Query></View>'
    );
    const m_responseItems = responseList.getItems(responseQuery);
    currCtx.load(
      m_responseItems,
      "Include(ID, Title, ReqNum, ActionOffice, ReturnReason, SampleNumber, ResStatus, ActiveViewers, Comments, Modified, ClosedDate, ClosedBy, POC, POCCC)"
    );
    var responseDocsLib = web.get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
    var responseDocsQuery = new SP.CamlQuery();
    responseDocsQuery.set_viewXml(
      '<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="ReqNum"/><FieldRef Name="ResID"/></OrderBy><Where><Eq><FieldRef Name="ContentType"/><Value Type="Text">Document</Value></Eq></Where></Query></View>'
    );
    const m_ResponseDocsItems = responseDocsLib.getItems(responseDocsQuery);
    currCtx.load(
      m_ResponseDocsItems,
      "Include(ID, Title, ReqNum, ResID, DocumentStatus, RejectReason, ReceiptDate, FileLeafRef, FileDirRef, File_x0020_Size, CheckoutUser, Modified, Editor, Created)"
    );
    await executeQuery(currCtx).catch(({ sender, args }) => {
      const statusId2 = SP.UI.Status.addStatus(
        "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
      );
      SP.UI.Status.setStatusPriColor(statusId2, "red");
    });
    m_fnLoadData(
      m_requestItems,
      m_requestInternalItems,
      m_responseItems,
      m_ResponseDocsItems
    );
  }
  async function m_fnRequeryRequest(requestId = null) {
    const refreshTask = addTask(taskDefs.refresh);
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();
    var requestList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleRequests());
    var requestQuery = new SP.CamlQuery();
    requestQuery.set_viewXml(
      '<View><Query><Where><Eq><FieldRef Name="ID"/><Value Type="Text">' + requestId + "</Value></Eq></Where></Query></View>"
    );
    var m_aRequestItem = requestList.getItems(requestQuery);
    if (m_bIsSiteOwner) {
      $(".response-permissions").hide();
      currCtx.load(
        m_aRequestItem,
        "Include(ID, Title, ReqType, ReqSubject, RequestingOffice, ReqStatus, FiscalYear, IsSample, ReqDueDate, InternalDueDate, ActionOffice, EmailActionOffice, Reviewer, Owner, ReceiptDate, RelatedAudit, ActionItems, Comments, EmailSent, ClosedDate, ClosedBy, Modified, Sensitivity, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
      );
    } else {
      currCtx.load(
        m_aRequestItem,
        "Include(ID, Title, ReqType, ReqSubject, RequestingOffice, ReqStatus, FiscalYear, IsSample, ReqDueDate, InternalDueDate, ActionOffice, EmailActionOffice, Reviewer, Owner, ReceiptDate, RelatedAudit, ActionItems, Comments, EmailSent, ClosedDate, ClosedBy, Modified, Sensitivity)"
      );
    }
    var requestInternalList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleRequestsInternal());
    var requestInternalQuery = new SP.CamlQuery();
    requestInternalQuery.set_viewXml(
      `<View><Query><Where><Eq><FieldRef Name="ReqNum" LookupId='TRUE'/><Value Type="Lookup">${requestId}</Value></Eq></Where><OrderBy><FieldRef Name="Title"/></OrderBy></Query><RowLimit>1</RowLimit></View>`
    );
    const m_requestInternalItems = requestInternalList.getItems(requestInternalQuery);
    currCtx.load(
      m_requestInternalItems,
      "Include(ID, Title, ReqNum, InternalStatus, ActiveViewers)"
    );
    await new Promise(
      (resolve, reject2) => currCtx.executeQueryAsync(
        resolve,
        (sender, args) => reject2({ sender, args })
      )
    ).catch(({ sender, args }) => {
      console.error("Unable to requery request: " + requestId);
      return;
    });
    LoadRequests(m_aRequestItem);
    LoadRequestsInternal(m_requestInternalItems);
    const oRequest = m_fnGetRequestByID(requestId);
    if (!oRequest) {
      alert("Request was not successfully reloaded!");
      return;
    }
    var listItemEnumerator = m_aRequestItem.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      var oListItem = listItemEnumerator.get_current();
      oRequest.item = oListItem;
      break;
    }
    if (m_bIsSiteOwner) {
      if (!oRequest.item.get_hasUniqueRoleAssignments()) {
        const m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
          "Information",
          "Please wait... Updating Request permissions",
          200,
          400
        );
        await m_fnBreakRequestPermissions(oRequest.item, false);
        m_fnRefresh();
        return;
      } else {
        var bUpdateRequestPermissions = false;
        for (var x = 0; x < oRequest.actionOffices.length; x++) {
          var sActionOfficeGroupNameTitle = oRequest.actionOffices[x].ao;
          var sActionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName(
            sActionOfficeGroupNameTitle
          );
          if (sActionOfficeGroupName != null && $.trim(sActionOfficeGroupName) != "") {
            var bAOHasAccess = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
              oRequest.item,
              sActionOfficeGroupName,
              SP.PermissionKind.viewListItems
            );
            if (!bAOHasAccess) {
              bUpdateRequestPermissions = true;
              break;
            }
          }
        }
        if (bUpdateRequestPermissions) {
          const m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
            "Information",
            "Please wait... Updating Request permissions",
            200,
            400
          );
          await m_fnBreakRequestPermissions(oRequest.item, false);
          m_fnRefresh();
          return;
        }
      }
    }
    var match1 = false;
    var match2 = false;
    if (m_bIsSiteOwner) {
      var permissionsToCheck = SP.PermissionKind.viewListItems;
      match1 = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
        oRequest.item,
        Audit.Common.Utilities.GetGroupNameSpecialPerm1(),
        permissionsToCheck
      );
      match2 = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
        oRequest.item,
        Audit.Common.Utilities.GetGroupNameSpecialPerm2(),
        permissionsToCheck
      );
      if (match1 && match2)
        oRequest.specialPerms = true;
      else
        oRequest.specialPerms = false;
    }
    _myViewModel.currentRequest(oRequest);
    _myViewModel.bDisplayClose(false);
    if (m_arrRequestsToClose && m_arrRequestsToClose.length > 0) {
      for (var x = 0; x < m_arrRequestsToClose.length; x++) {
        var oIt = m_arrRequestsToClose[x];
        if (oIt.number == oRequest.number) {
          _myViewModel.bDisplayClose(true);
          break;
        }
      }
    }
    await Promise.all([
      LoadTabRequestInfoCoverSheets(oRequest),
      LoadTabRequestInfoResponses(oRequest)
    ]);
    await LoadTabRequestInfoResponseDocs(oRequest);
    _myViewModel.currentRequest.valueHasMutated();
    finishTask(refreshTask);
  }
  function RequestFinishedLoading() {
    var paramSection = GetUrlKeyValue("Sect");
    if (paramSection) {
      document.getElementById(paramSection)?.scrollIntoView(true);
    }
  }
  function m_fnLoadRemainder() {
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();
    m_coversheetDocsLibrary = currCtx.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleCoverSheets());
    currCtx.load(m_coversheetDocsLibrary, "Title", "Id");
    m_requestDocsLibrary = currCtx.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleRequestDocs());
    currCtx.load(m_requestDocsLibrary, "Title", "Id");
    m_responseDocsLibrary = currCtx.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
    currCtx.load(m_responseDocsLibrary, "Title", "Id");
    function OnSuccess(sender, args) {
      m_libResponseDocsLibraryGUID = m_responseDocsLibrary.get_id();
      m_libCoverSheetLibraryGUID = m_coversheetDocsLibrary.get_id();
      m_libRequestDocsLibraryGUID = m_requestDocsLibrary.get_id();
    }
    function OnFailure(sender, args) {
      const statusId2 = SP.UI.Status.addStatus(
        "Failed loading: " + args.get_message() + "\n" + args.get_stackTrace()
      );
      SP.UI.Status.setStatusPriColor(statusId2, "red");
    }
    currCtx.executeQueryAsync(OnSuccess, OnFailure);
  }
  async function m_fnCheckIfResponsePermissionsNeedUpdating(requestStatus, title, OnCompletedChecking) {
    const oResponse = m_bigMap["response-" + title];
    if (!oResponse)
      return;
    await m_fnBreakResponseAndFolderPermissions(
      requestStatus,
      oResponse,
      false,
      true,
      false,
      false
    );
    return true;
  }
  function LoadRequests(m_requestItems) {
    const arrRequests = new Array();
    try {
      var listItemEnumerator = m_requestItems.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        var id2 = oListItem.get_item("ID");
        var number = oListItem.get_item("Title");
        var status = oListItem.get_item("ReqStatus");
        const reqType = oListItem.get_item("ReqType");
        var subject = oListItem.get_item("ReqSubject");
        if (subject == null)
          subject = "";
        var sensitivity = oListItem.get_item("Sensitivity");
        if (sensitivity == null)
          sensitivity = "None";
        var requestingOffice = oListItem.get_item("RequestingOffice");
        if (requestingOffice != null)
          requestingOffice = requestingOffice.get_lookupValue();
        else
          requestingOffice = "";
        var fiscalYear = oListItem.get_item("FiscalYear");
        var sample = oListItem.get_item("IsSample");
        var dueDate = oListItem.get_item("ReqDueDate");
        var internalDueDate = oListItem.get_item("InternalDueDate");
        var receiptDate = oListItem.get_item("ReceiptDate");
        var closedDate = oListItem.get_item("ClosedDate");
        dueDate != null ? dueDate = dueDate.format("yyyy-MM-dd") : dueDate = "";
        internalDueDate != null ? internalDueDate = internalDueDate.format("yyyy-MM-dd") : internalDueDate = "";
        receiptDate != null ? receiptDate = receiptDate.format("yyyy-MM-dd") : receiptDate = "";
        closedDate != null ? closedDate = closedDate.format("yyyy-MM-dd") : closedDate = "";
        var arrAOs = new Array();
        var arrActionOffice = oListItem.get_item("ActionOffice");
        if (arrActionOffice.length > 0) {
          var tempAOs = new Array();
          for (var x = 0; x < arrActionOffice.length; x++)
            tempAOs.push(arrActionOffice[x].get_lookupValue());
          tempAOs = tempAOs.sort();
          for (var x = 0; x < tempAOs.length; x++)
            arrAOs.push({ ao: tempAOs[x] });
        }
        var arrEmailAOs = new Array();
        var arrEmailActionOffice = oListItem.get_item("EmailActionOffice");
        if (arrEmailActionOffice.length > 0) {
          var tempAOs = new Array();
          for (var x = 0; x < arrEmailActionOffice.length; x++)
            tempAOs.push(arrEmailActionOffice[x].get_lookupValue());
          tempAOs = tempAOs.sort();
          for (var x = 0; x < tempAOs.length; x++)
            arrEmailAOs.push({ ao: tempAOs[x] });
        }
        var comments = oListItem.get_item("Comments");
        var emailSent = oListItem.get_item("EmailSent");
        var reviewer = oListItem.get_item("Reviewer");
        var owner = oListItem.get_item("Owner");
        var relatedAudit = oListItem.get_item("RelatedAudit");
        var actionItems = oListItem.get_item("ActionItems");
        if (comments == null)
          comments = "";
        if (reviewer == null)
          reviewer = "";
        if (owner == null)
          owner = "";
        if (relatedAudit == null)
          relatedAudit = "";
        if (actionItems == null)
          actionItems = "";
        var closedBy = Audit.Common.Utilities.GetFriendlyDisplayName(
          oListItem,
          "ClosedBy"
        );
        var requestObject = m_bigMap["request-" + number] ?? {};
        requestObject["ID"] = id2;
        requestObject["reqType"] = reqType;
        requestObject["number"] = number;
        requestObject["subject"] = subject;
        requestObject["sensitivity"] = sensitivity;
        requestObject["requestingOffice"] = requestingOffice;
        requestObject["fiscalYear"] = fiscalYear;
        requestObject["dueDate"] = dueDate;
        requestObject["status"] = status;
        requestObject["internalDueDate"] = internalDueDate;
        requestObject["sample"] = sample;
        requestObject["requestDocs"] = new Array();
        requestObject["coversheets"] = new Array();
        requestObject["responses"] = new Array();
        requestObject["responsesOpenCnt"] = 0;
        requestObject["actionOffices"] = arrAOs;
        requestObject["emailActionOffices"] = arrEmailAOs;
        requestObject["comments"] = comments;
        requestObject["emailSent"] = emailSent;
        requestObject["closedDate"] = closedDate;
        requestObject["closedBy"] = closedBy;
        requestObject["reviewer"] = reviewer;
        requestObject["owner"] = owner;
        requestObject["receiptDate"] = receiptDate;
        requestObject["relatedAudit"] = relatedAudit;
        requestObject["actionItems"] = actionItems;
        requestObject["specialPerms"] = null;
        requestObject["item"] = oListItem;
        arrRequests.push(requestObject);
        m_bigMap["request-" + number] = requestObject;
      }
    } catch (err) {
      alert(err);
    }
    return arrRequests;
  }
  function LoadRequestsInternal(m_requestInternalItems) {
    try {
      var listItemEnumerator = m_requestInternalItems.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        var id2 = oListItem.get_item("ID");
        var reqNum = oListItem.get_item("ReqNum");
        if (!reqNum || !reqNum.get_lookupValue()) {
          console.warn("Unaffiliated Internal Status ID:", id2);
          continue;
        }
        var requestObject = m_fnGetRequestByNumber(reqNum.get_lookupValue());
        if (!requestObject)
          continue;
        requestObject.internalStatus = new CommentChainModuleLegacy(id2, {
          requestListTitle: Audit.Common.Utilities.GetListTitleRequestsInternal(),
          columnName: "InternalStatus",
          initialValue: oListItem.get_item("InternalStatus")
        });
        requestObject.activeViewers = new ActiveViewersModuleLegacy(id2, {
          requestListTitle: Audit.Common.Utilities.GetListTitleRequestsInternal(),
          columnName: "ActiveViewers",
          initialValue: oListItem.get_item("ActiveViewers")
        });
      }
    } catch (err) {
      alert(err);
    }
  }
  function LoadResponses(responseItemsColl) {
    try {
      var listItemEnumerator = responseItemsColl.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        var number = oListItem.get_item("ReqNum");
        if (number != null) {
          number = number.get_lookupValue();
          if (number == null)
            continue;
          var oRequestBigMap = m_bigMap["request-" + number];
          var returnReason = oListItem.get_item("ReturnReason");
          if (returnReason == null)
            returnReason = "";
          var title = oListItem.get_item("Title");
          var responseObject = m_bigMap["response-" + title] ?? new Object();
          responseObject["ID"] = oListItem.get_item("ID");
          responseObject["number"] = number;
          responseObject["title"] = title;
          responseObject["item"] = oListItem;
          var comments = oListItem.get_item("Comments");
          try {
            comments = $(comments).html();
            if (comments == null || comments == "")
              responseObject["comments"] = "";
            else {
              comments = comments.replace(/[^a-z0-9\s]/gi, " ");
              responseObject["comments"] = comments;
            }
          } catch (commentsErr) {
            if (comments == null || comments == "")
              responseObject["comments"] = "";
            comments = comments.replace(/[^a-z0-9\s]/gi, " ");
            responseObject["comments"] = comments;
          }
          var modified = oListItem.get_item("Modified").format("yyyy-MM-dd hh:mm tt");
          responseObject["modified"] = modified;
          var closedDate = oListItem.get_item("ClosedDate");
          closedDate != null ? closedDate = closedDate.format("yyyy-MM-dd") : closedDate = "";
          responseObject["closedDate"] = closedDate;
          responseObject["closedBy"] = Audit.Common.Utilities.GetFriendlyDisplayName(oListItem, "ClosedBy");
          responseObject["sample"] = oListItem.get_item("SampleNumber");
          if (responseObject["sample"] == null)
            responseObject["sample"] = "";
          responseObject["actionOffice"] = oListItem.get_item("ActionOffice");
          if (responseObject["actionOffice"] == null)
            responseObject["actionOffice"] = "";
          else
            responseObject["actionOffice"] = responseObject["actionOffice"].get_lookupValue();
          responseObject["poc"] = oListItem.get_item("POC");
          if (responseObject["poc"] == null)
            responseObject["poc"] = "";
          else
            responseObject["poc"] = responseObject["poc"].get_email();
          responseObject["pocCC"] = oListItem.get_item("POCCC");
          if (responseObject["pocCC"] == null)
            responseObject["pocCC"] = "";
          else
            responseObject["pocCC"] = responseObject["pocCC"].get_email();
          responseObject["returnReason"] = returnReason;
          responseObject["resStatus"] = oListItem.get_item("ResStatus");
          if (responseObject["resStatus"] != "7-Closed")
            oRequestBigMap.responsesOpenCnt = oRequestBigMap.responsesOpenCnt + 1;
          responseObject["responseDocs"] = new Array();
          responseObject["responseFolderItem"] = null;
          oRequestBigMap.responses.push(responseObject);
          m_bigMap["response-" + title] = responseObject;
        }
      }
    } catch (err) {
      alert(err);
    }
  }
  function LoadResponseDocs(m_ResponseDocsItems) {
    _myViewModel.arrResponseDocsCheckedOut([]);
    _myViewModel.arrResponseDocsCheckedOut.valueHasMutated();
    var arrResponseDocsCheckedOut = new Array();
    m_fnMapResponseDocs(m_ResponseDocsItems, m_bigMap);
    var listItemEnumerator = m_ResponseDocsItems.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      var oListItem = listItemEnumerator.get_current();
      const checkedOutBy = Audit.Common.Utilities.GetFriendlyDisplayName(
        oListItem,
        "CheckoutUser"
      );
      if (checkedOutBy != "") {
        var requestNumber = oListItem.get_item("ReqNum");
        if (requestNumber != null)
          requestNumber = requestNumber.get_lookupValue();
        var oResponseDocCheckedOut = new Object();
        oResponseDocCheckedOut["number"] = requestNumber;
        oResponseDocCheckedOut["title"] = oListItem.get_item("Title");
        oResponseDocCheckedOut["checkedOutBy"] = checkedOutBy;
        arrResponseDocsCheckedOut.push(oResponseDocCheckedOut);
      }
    }
    ko.utils.arrayPushAll(
      _myViewModel.arrResponseDocsCheckedOut(),
      arrResponseDocsCheckedOut
    );
    _myViewModel.arrResponseDocsCheckedOut.valueHasMutated();
  }
  function m_fnMapResponseDocs(responseDocItemsColl, m_bigMap2) {
    try {
      var listItemEnumerator = responseDocItemsColl.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        var responseDocID = oListItem.get_item("ID");
        var requestNumber = oListItem.get_item("ReqNum");
        if (requestNumber != null)
          requestNumber = requestNumber.get_lookupValue();
        var responseID = oListItem.get_item("ResID");
        if (responseID != null)
          responseID = responseID.get_lookupValue();
        if (requestNumber == null || responseID == null)
          continue;
        var oRequest = m_bigMap2["request-" + requestNumber];
        if (!oRequest)
          continue;
        const oResponse = oRequest.responses.find(
          (response) => response.title == responseID
        );
        if (!oResponse)
          continue;
        var responseDocObject = new Object();
        responseDocObject["ID"] = oListItem.get_item("ID");
        responseDocObject["response"] = oResponse;
        responseDocObject["request"] = oRequest;
        responseDocObject["fileName"] = oListItem.get_item("FileLeafRef");
        responseDocObject["title"] = oListItem.get_item("Title");
        if (responseDocObject["title"] == null)
          responseDocObject["title"] = "";
        responseDocObject["folder"] = oListItem.get_item("FileDirRef");
        responseDocObject["documentStatus"] = oListItem.get_item("DocumentStatus");
        responseDocObject["rejectReason"] = oListItem.get_item("RejectReason");
        if (responseDocObject["rejectReason"] == null)
          responseDocObject["rejectReason"] = "";
        else
          responseDocObject["rejectReason"] = responseDocObject["rejectReason"].replace(/(\r\n|\n|\r)/gm, "<br/>");
        var fileSize = oListItem.get_item("File_x0020_Size");
        fileSize = Audit.Common.Utilities.GetFriendlyFileSize(fileSize);
        responseDocObject["fileSize"] = fileSize;
        var receiptDate = "";
        if (oListItem.get_item("ReceiptDate") != null && oListItem.get_item("ReceiptDate") != "")
          receiptDate = oListItem.get_item("ReceiptDate").format("yyyy-MM-dd");
        responseDocObject["receiptDate"] = receiptDate;
        var modifiedDate = "";
        if (oListItem.get_item("Modified") != null && oListItem.get_item("Modified") != "")
          modifiedDate = oListItem.get_item("Modified").format("yyyy-MM-dd hh:mm tt");
        responseDocObject["modifiedDate"] = modifiedDate;
        responseDocObject["modifiedBy"] = Audit.Common.Utilities.GetFriendlyDisplayName(oListItem, "Editor");
        responseDocObject["checkedOutBy"] = Audit.Common.Utilities.GetFriendlyDisplayName(
          oListItem,
          "CheckoutUser"
        );
        if (responseDocObject["checkedOutBy"] != "") {
        }
        responseDocObject["item"] = oListItem;
        oResponse["responseDocs"].push(responseDocObject);
      }
    } catch (err) {
      alert(err);
    }
  }
  function LoadResponseCounts() {
    const m_arrRequests = m_getArrRequests();
    m_oRequestTitleAndDocCount = new Object();
    m_oResponseTitleAndDocCount = new Object();
    var requestLength = m_arrRequests.length;
    for (var x = 0; x < requestLength; x++) {
      var oRequest = m_arrRequests[x];
      if (oRequest.responses.length > 0) {
        var responseLength = oRequest.responses.length;
        for (var y = 0; y < responseLength; y++) {
          var responseCount = oRequest.responses[y].responseDocs.length;
          m_oResponseTitleAndDocCount[oRequest.responses[y].title] = responseCount;
          var curCount = m_oRequestTitleAndDocCount[oRequest.number];
          if (curCount == null)
            m_oRequestTitleAndDocCount[oRequest.number] = responseCount;
          else
            m_oRequestTitleAndDocCount[oRequest.number] += responseCount;
        }
      }
    }
  }
  function LoadResponseDocFolders(m_ResponseDocsFoldersItems) {
    m_arrPermissionsResponseFolders = new Array();
    try {
      var cntToBreak = 0;
      var cntBroken = 0;
      if (m_ResponseDocsFoldersItems != null) {
        var listItemEnumerator = m_ResponseDocsFoldersItems.getEnumerator();
        while (listItemEnumerator.moveNext()) {
          var oListItem = listItemEnumerator.get_current();
          var itemName = oListItem.get_displayName();
          var itemId = oListItem.get_id();
          var itemUrl = oListItem.get_item("EncodedAbsUrl");
          if (oListItem.get_item("Title") == null) {
            let OnSuccessUpdateTitle = function(sender, args) {
            }, OnFailureUpdateTitle = function(sender, args) {
            };
            var currCtx = new SP.ClientContext.get_current();
            var web = currCtx.get_web();
            oListItem.set_item("Title", itemName);
            oListItem.update();
            currCtx.executeQueryAsync(OnSuccessUpdateTitle, OnFailureUpdateTitle);
          }
          var objFold = new Object();
          objFold["ID"] = itemId;
          objFold["ItemName"] = itemName;
          objFold["Item"] = oListItem;
          objFold["UserPermissions"] = new Array();
          objFold["GroupPermissions"] = new Array();
          if (m_bIsSiteOwner) {
            var roleAssignments = oListItem.get_roleAssignments();
            var rolesEnumerator = roleAssignments.getEnumerator();
            while (rolesEnumerator.moveNext()) {
              var role = rolesEnumerator.get_current();
              var roleMember = role.get_member();
              var memeberLoginName = roleMember.get_loginName();
              var memberTitleName = roleMember.get_title();
              var permissionType = "UserPermissions";
              var principalType = roleMember.get_principalType();
              if (principalType == SP.Utilities.PrincipalType.securityGroup || principalType == SP.Utilities.PrincipalType.sharePointGroup) {
                permissionType = "GroupPermissions";
              }
              var roleDefs = role.get_roleDefinitionBindings();
              var roleDefsEnumerator = roleDefs.getEnumerator();
              while (roleDefsEnumerator.moveNext()) {
                var rd = roleDefsEnumerator.get_current();
                var rdName = rd.get_name();
                objFold[permissionType].push(rdName + " - " + memberTitleName);
              }
            }
          }
          m_arrPermissionsResponseFolders.push(objFold);
          const oResponse = m_bigMap["response-" + itemName];
          if (!oResponse)
            continue;
          oResponse.responseFolderItem = oListItem;
        }
      }
    } catch (err) {
    }
  }
  async function LoadTabRequestInfoCoverSheets(oRequest) {
    _myViewModel.arrCurrentRequestCoverSheets([]);
    _myViewModel.arrCurrentRequestCoverSheets.valueHasMutated();
    oRequest.coversheets = new Array();
    var arrCS = new Array();
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();
    var coverSheetLib = web.get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleCoverSheets());
    var coverSheetQuery = new SP.CamlQuery();
    coverSheetQuery.set_viewXml(
      '<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="ReqNum"/><Value Type="Text">' + oRequest.number + "</Value></Eq></Where></Query></View>"
    );
    var m_CoverSheetItems = coverSheetLib.getItems(coverSheetQuery);
    if (m_bIsSiteOwner)
      currCtx.load(
        m_CoverSheetItems,
        "Include(ID, Title, ReqNum, ActionOffice, FileLeafRef, FileDirRef, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
      );
    else
      currCtx.load(
        m_CoverSheetItems,
        "Include(ID, Title, ReqNum, ActionOffice, FileLeafRef, FileDirRef)"
      );
    await new Promise((resolve, reject2) => {
      currCtx.executeQueryAsync(resolve, reject2);
    }).catch((e) => {
      console.error("Unable to load Coversheets.");
    });
    var listItemEnumerator = m_CoverSheetItems.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      var oListItem = listItemEnumerator.get_current();
      var number = oListItem.get_item("ReqNum");
      if (number != null) {
        number = number.get_lookupValue();
        if (number == oRequest.number) {
          var coversheetObject = new Object();
          coversheetObject["ID"] = oListItem.get_item("ID");
          coversheetObject["number"] = number;
          var arrActionOffice = new Array();
          var actionOffices = oListItem.get_item("ActionOffice");
          if (actionOffices && actionOffices.length > 0) {
            for (var y = 0; y < actionOffices.length; y++) {
              arrActionOffice.push({
                actionOffice: actionOffices[y].get_lookupValue()
              });
            }
          }
          coversheetObject["actionOffices"] = arrActionOffice;
          coversheetObject["title"] = oListItem.get_item("FileLeafRef");
          coversheetObject["folder"] = oListItem.get_item("FileDirRef");
          coversheetObject["item"] = oListItem;
          coversheetObject["requestStatus"] = oRequest.status;
          oRequest.coversheets.push(coversheetObject);
        }
      }
    }
    ko.utils.arrayPushAll(
      _myViewModel.arrCurrentRequestCoverSheets(),
      oRequest.coversheets
    );
    _myViewModel.arrCurrentRequestCoverSheets.valueHasMutated();
  }
  async function m_fnLoadResponseDocFolder(responseTitle, OnComplete) {
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();
    var responseList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleResponses());
    var responseQuery = new SP.CamlQuery();
    responseQuery.set_viewXml(
      '<View><Query><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' + responseTitle + "</Value></Eq></Where></Query></View>"
    );
    const m_aResponseItem = responseList.getItems(responseQuery);
    currCtx.load(
      m_aResponseItem,
      "Include(ID, Title, ReqNum, ActionOffice, ReturnReason, SampleNumber, ResStatus, Comments, Modified, ClosedDate, ClosedBy, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
    );
    var responseDocsLibFolderslist = currCtx.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
    var responseDocsLibFolderslistQuery = new SP.CamlQuery();
    responseDocsLibFolderslistQuery.set_viewXml(
      '<View><Query><Where><And><Eq><FieldRef Name="Title"/><Value Type="Text">' + responseTitle + '</Value></Eq><Eq><FieldRef Name="ContentType" /><Value Type="Text">Folder</Value></Eq></And></Where></Query></View>'
    );
    const m_ResponseDocsFoldersItems = responseDocsLibFolderslist.getItems(
      responseDocsLibFolderslistQuery
    );
    currCtx.load(
      m_ResponseDocsFoldersItems,
      "Include( DisplayName, Title, Id, EncodedAbsUrl, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
    );
    await new Promise(
      (resolve, reject2) => currCtx.executeQueryAsync(resolve, reject2)
    ).catch((sender, args) => {
      return false;
    });
    var oResponseItem = null;
    var listItemEnumerator = m_aResponseItem.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      var oListItem = listItemEnumerator.get_current();
      const oResponse = m_bigMap["response-" + responseTitle];
      if (!oResponse)
        continue;
      oResponse.item = oListItem;
      break;
    }
    LoadResponseDocFolders(m_ResponseDocsFoldersItems);
    return true;
  }
  async function LoadTabRequestInfoResponses(oRequest) {
    if (m_bIsSiteOwner) {
      if (m_sGoToResponseTitle != null && m_sGoToResponseTitle != "") {
        const doneLoadingThisResponseFolder = await m_fnLoadResponseDocFolder(
          m_sGoToResponseTitle
        );
        if (doneLoadingThisResponseFolder) {
          const doneCheckingResponseFolder = await m_fnCheckIfResponsePermissionsNeedUpdating(
            oRequest.status,
            m_sGoToResponseTitle
          );
        }
      }
    }
    document.body.style.cursor = "wait";
    var m_notifyIDLoadingResponses = SP.UI.Notify.addNotification(
      "Loading Responses...",
      true
    );
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();
    var responseList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleResponses());
    var responseQuery = new SP.CamlQuery();
    responseQuery.set_viewXml(
      '<View><Query><Where><Eq><FieldRef Name="ReqNum"/><Value Type="Text">' + oRequest.number + "</Value></Eq></Where></Query></View>"
    );
    var m_subsetResponseItems = responseList.getItems(responseQuery);
    if (m_bIsSiteOwner)
      currCtx.load(
        m_subsetResponseItems,
        "Include(ID, Title, ReqNum, ActionOffice, ReturnReason, SampleNumber, ResStatus, Comments, ActiveViewers, Modified, ClosedDate, ClosedBy, POC, POCCC, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
      );
    else
      currCtx.load(
        m_subsetResponseItems,
        "Include(ID, Title, ReqNum, ActionOffice, ReturnReason, SampleNumber, ResStatus, Comments, ActiveViewers, Modified, ClosedDate, ClosedBy, POC, POCCC)"
      );
    var responseDocsLibFolderslist = currCtx.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
    var responseDocsLibFolderslistQuery = new SP.CamlQuery();
    responseDocsLibFolderslistQuery.set_viewXml(
      '<View><Query><Where><And><BeginsWith><FieldRef Name="Title"/><Value Type="Text">' + oRequest.number + '-</Value></BeginsWith><Eq><FieldRef Name="ContentType" /><Value Type="Text">Folder</Value></Eq></And></Where></Query></View>'
    );
    const m_ResponseDocsFoldersItems = responseDocsLibFolderslist.getItems(
      responseDocsLibFolderslistQuery
    );
    if (m_bIsSiteOwner)
      currCtx.load(
        m_ResponseDocsFoldersItems,
        "Include( DisplayName, Title, Id, EncodedAbsUrl, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
      );
    else
      currCtx.load(
        m_ResponseDocsFoldersItems,
        "Include( DisplayName, Title, Id, EncodedAbsUrl)"
      );
    await new Promise(
      (resolve, reject2) => currCtx.executeQueryAsync(
        resolve,
        (sender, args) => reject2({ sender, args })
      )
    ).catch(({ sender, args }) => {
      const statusId2 = SP.UI.Status.addStatus(
        "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
      );
      SP.UI.Status.setStatusPriColor(statusId2, "red");
      return;
    });
    LoadResponses(m_subsetResponseItems);
    var listItemEnumerator = m_subsetResponseItems.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      var oListItem = listItemEnumerator.get_current();
      var responseTitle = oListItem.get_item("Title");
      if (m_bigMap["response-" + responseTitle])
        m_bigMap["response-" + responseTitle].item = oListItem;
      if (m_bIsSiteOwner) {
        if (!oListItem.get_hasUniqueRoleAssignments()) {
          m_fnBreakResponsePermissions(oListItem, false, true);
        }
      }
    }
    LoadResponseDocFolders(m_ResponseDocsFoldersItems);
    var sResponses = "";
    var responseCount = oRequest.responses.length;
    oRequest.responses.sort(function(a, b) {
      a = parseInt(a.sample, 10);
      b = parseInt(b.sample, 10);
      return a - b;
    });
    if (responseCount == 0)
      notifyId2 = SP.UI.Notify.addNotification(
        oRequest.number + " has 0 responses. Please create a Response",
        false
      );
    var arrResponses = new Array();
    for (var y = 0; y < responseCount; y++) {
      var oResponse = oRequest.responses[y];
      var groupPerms = "";
      for (var x = 0; x < m_arrPermissionsResponseFolders.length; x++) {
        if (m_arrPermissionsResponseFolders[x].ItemName == oResponse.title) {
          const arrGroupPerms = m_arrPermissionsResponseFolders[x].GroupPermissions;
          var grouppermissionsArr = arrGroupPerms.sort();
          grouppermissionsArr.sort(function(a, b) {
            return a.toLowerCase().localeCompare(b.toLowerCase());
          });
          for (var z = 0; z < grouppermissionsArr.length; z++) {
            groupPerms += "<div>" + grouppermissionsArr[z] + "</div>";
          }
          break;
        }
      }
      var specialPerms = false;
      if (groupPerms.indexOf(Audit.Common.Utilities.GetGroupNameSpecialPerm1()) >= 0 && groupPerms.indexOf(Audit.Common.Utilities.GetGroupNameSpecialPerm2()) >= 0) {
        specialPerms = true;
      }
      var arrRequestActionOffices = oRequest.item.get_item("ActionOffice");
      var responseActionOfficeIsInRequest = false;
      if (arrRequestActionOffices != null) {
        for (var x = 0; x < arrRequestActionOffices.length; x++) {
          if (arrRequestActionOffices[x].get_lookupValue() == oResponse.actionOffice) {
            responseActionOfficeIsInRequest = true;
          }
        }
      }
      var styleTag = new Object();
      var toolTip = "";
      if (!responseActionOfficeIsInRequest) {
        styleTag = {
          "background-color": "lightsalmon",
          "font-style": "italic",
          "font-weight": "bold",
          color: "red"
        };
        toolTip = "This Action Office is not found in the Action Office list for the Request";
      }
      oResponse["groupPerms"] = groupPerms;
      oResponse["specialPerms"] = specialPerms;
      oResponse["styleTag"] = styleTag;
      oResponse["toolTip"] = toolTip;
      oResponse["activeViewers"] = new ActiveViewersModuleLegacy(oResponse.ID, {
        requestListTitle: Audit.Common.Utilities.GetListTitleResponses(),
        columnName: "ActiveViewers",
        initialValue: oResponse.item.get_item("ActiveViewers")
      });
      arrResponses.push(oResponse);
    }
    SP.UI.Notify.removeNotification(m_notifyIDLoadingResponses);
    m_notifyIDLoadingResponses = null;
    document.body.style.cursor = "default";
    m_fnHighlightResponse();
  }
  function m_fnHighlightResponse() {
    if (m_sGoToResponseTitle != null && m_sGoToResponseTitle != "") {
      let resetColor = function(index) {
        $("[id='response-item-title-" + m_sGoToResponseTitle + "']").parent().css({ "background-color": "inherit", "font-weight": "inherit" });
        m_sGoToResponseTitle = null;
      };
      const requestDetailView = _myViewModel.requestDetailViewComponent;
      requestDetailView.highlightResponse(m_sGoToResponseTitle);
      return;
      $("[id='response-item-title-" + m_sGoToResponseTitle + "']").parent().css({ "background-color": "palegreen", "font-weight": "inherit" });
      $("[id='response-item-title-" + m_sGoToResponseTitle + "']").get(0).scrollIntoView();
      setTimeout(function() {
        resetColor(m_sGoToResponseTitle);
      }, 2e3);
    }
  }
  async function LoadTabRequestInfoResponseDocs(oRequest) {
    let currCtx = new SP.ClientContext.get_current();
    let web = currCtx.get_web();
    var responseDocsLib = web.get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
    var responseDocsQuery = new SP.CamlQuery();
    responseDocsQuery.set_viewXml(
      '<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="ReqNum"/><Value Type="Text">' + oRequest.number + '</Value></Eq></Where><OrderBy><FieldRef Name="ReqNum"/><FieldRef Name="ResID"/></OrderBy><Where><Eq><FieldRef Name="ContentType"/><Value Type="Text">Document</Value></Eq></Where></Query></View>'
    );
    const requestResponseDocsItems = responseDocsLib.getItems(responseDocsQuery);
    currCtx.load(
      requestResponseDocsItems,
      "Include(ID, Title, ReqNum, ResID, DocumentStatus, RejectReason, ReceiptDate, FileLeafRef, FileDirRef, File_x0020_Size, CheckoutUser, Modified, Editor, Created)"
    );
    await new Promise(
      (resolve, reject2) => currCtx.executeQueryAsync(resolve, reject2)
    );
    oRequest.responses.map((response) => response.responseDocs = []);
    m_fnMapResponseDocs(requestResponseDocsItems, m_bigMap);
    currCtx = new SP.ClientContext.get_current();
    web = currCtx.get_web();
    var bHasResponseDoc = false;
    if (oRequest && oRequest.responses && oRequest.responses.length > 0) {
      for (var y = 0; y < oRequest.responses.length; y++) {
        var oResponse = oRequest.responses[y];
        if (oResponse && oResponse.responseDocs && oResponse.responseDocs.length > 0) {
          for (var z = 0; z < oResponse.responseDocs.length; z++) {
            var oResponseDoc = oResponse.responseDocs[z];
            oResponseDoc["docIcon"] = web.mapToIcon(
              oResponseDoc.fileName,
              "",
              SP.Utilities.IconSize.Size16
            );
            bHasResponseDoc = true;
          }
        }
      }
    }
    if (!bHasResponseDoc) {
      RequestFinishedLoading();
      return;
    }
    await executeQuery(currCtx).catch(({ sender, args }) => {
      const statusId2 = SP.UI.Status.addStatus(
        "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
      );
      SP.UI.Status.setStatusPriColor(statusId2, "red");
    });
    oRequest.responses.sort(Audit.Common.Utilities.SortResponseObjects);
    RequestFinishedLoading();
  }
  function DisplayRequestsThatShouldClose() {
    _myViewModel.arrRequestsThatNeedClosing([]);
    _myViewModel.arrRequestsThatNeedClosing.valueHasMutated();
    const m_arrRequests = m_getArrRequests();
    if (m_arrRequests == null || m_arrRequests.length == 0)
      return;
    m_arrRequestsToClose = new Array();
    for (var x = 0; x < m_arrRequests.length; x++) {
      var oRequest = m_arrRequests[x];
      if (oRequest.status != "Closed") {
        var countClosed = 0;
        for (var y = 0; y < oRequest.responses.length; y++) {
          if (oRequest.responses[y].resStatus == "7-Closed")
            countClosed++;
        }
        if (oRequest.responses.length > 0 && oRequest.responses.length == countClosed) {
          var lastClosedDate = null;
          var lastClosedBy = null;
          var lastResponseId = null;
          var oResponse = null;
          var sLastClosedDate = "";
          for (var y = 0; y < oRequest.responses.length; y++) {
            var closedDate = oRequest.responses[y].item.get_item("ClosedDate");
            if (lastClosedDate == null || lastClosedDate < closedDate) {
              lastClosedDate = closedDate;
              lastClosedBy = oRequest.responses[y].closedBy;
              lastResponseId = oRequest.responses[y].title;
              oResponse = oRequest.responses[y];
              if (lastClosedDate != null && lastClosedDate != "")
                sLastClosedDate = lastClosedDate.format("yyyy-MM-dd hh:mm tt");
            }
          }
          m_arrRequestsToClose.push({
            number: oRequest.number,
            lastResponseId,
            lastClosedDate,
            lastClosedBy,
            sLastClosedDate,
            oResponse
          });
        }
      }
    }
    ko.utils.arrayPushAll(
      _myViewModel.arrRequestsThatNeedClosing(),
      m_arrRequestsToClose
    );
    _myViewModel.arrRequestsThatNeedClosing.valueHasMutated();
  }
  function LoadTabStatusReport1() {
    const arr = m_getArrRequests();
    _myViewModel.arrRequests([]);
    _myViewModel.arrRequests.valueHasMutated();
    _myViewModel.arrRequestsInternalAlmostDue([]);
    _myViewModel.arrRequestsInternalAlmostDue.valueHasMutated();
    _myViewModel.arrRequestsAlmostDue([]);
    _myViewModel.arrRequestsAlmostDue.valueHasMutated();
    _myViewModel.arrRequestsInternalPastDue([]);
    _myViewModel.arrRequestsInternalPastDue.valueHasMutated();
    _myViewModel.arrRequestsPastDue([]);
    _myViewModel.arrRequestsPastDue.valueHasMutated();
    _myViewModel.arrRequestsWithNoResponses([]);
    _myViewModel.arrRequestsWithNoResponses.valueHasMutated();
    _myViewModel.arrRequestsWithNoEmailSent([]);
    _myViewModel.arrRequestsWithNoEmailSent.valueHasMutated();
    if (arr == null)
      return;
    var requestArr = new Array();
    var arrInternalAlmostDue = new Array();
    var arrInternalPastDue = new Array();
    var arrAlmostDue = new Array();
    var arrPastDue = new Array();
    var arrRequestsWithNoResponses = new Array();
    var arrRequestsWithNoEmailSent = new Array();
    var arrLength = arr.length;
    while (arrLength--) {
      var oRequest = arr[arrLength];
      var internalDueDateStyle = "";
      var dueDateStyle = "";
      if (m_fnIsRequestPastDue(oRequest, oRequest.internalDueDate)) {
        internalDueDateStyle = "past-due";
        arrInternalPastDue.push({
          title: oRequest.number,
          number: oRequest.number,
          internalDueDate: oRequest.internalDueDate,
          dueDate: oRequest.dueDate
        });
      } else if (m_fnIsRequestAlmostDue(oRequest, oRequest.internalDueDate)) {
        internalDueDateStyle = "almost-due";
        arrInternalAlmostDue.push({
          title: oRequest.number,
          number: oRequest.number,
          internalDueDate: oRequest.internalDueDate,
          dueDate: oRequest.dueDate
        });
      }
      if (m_fnIsRequestPastDue(oRequest, oRequest.dueDate)) {
        dueDateStyle = "past-due";
        arrPastDue.push({
          title: oRequest.number,
          number: oRequest.number,
          internalDueDate: oRequest.internalDueDate,
          dueDate: oRequest.dueDate
        });
      } else if (m_fnIsRequestAlmostDue(oRequest, oRequest.dueDate)) {
        dueDateStyle = "almost-due";
        arrAlmostDue.push({
          title: oRequest.number,
          number: oRequest.number,
          internalDueDate: oRequest.internalDueDate,
          dueDate: oRequest.dueDate
        });
      }
      if (oRequest.responses.length == 0)
        arrRequestsWithNoResponses.push({
          title: oRequest.number,
          number: oRequest.number
        });
      if (!oRequest.emailSent)
        arrRequestsWithNoEmailSent.push({
          title: oRequest.number,
          number: oRequest.number
        });
      var resCount = m_oRequestTitleAndDocCount[oRequest.number];
      if (!resCount)
        resCount = 0;
      var aRequest = {
        reqNumber: oRequest.number,
        subject: oRequest.subject,
        sensitivity: oRequest.sensitivity,
        requestingOffice: oRequest.requestingOffice,
        status: oRequest.status,
        internalDueDate: oRequest.internalDueDate,
        dueDate: oRequest.dueDate,
        internalDueDateStyle,
        dueDateStyle,
        sample: oRequest.sample,
        sentEmail: oRequest.emailSent,
        actionOffices: oRequest.actionOffices,
        emailActionOffices: oRequest.emailActionOffices,
        responseCount: oRequest.responses.length,
        responsesOpenCount: oRequest.responsesOpenCnt,
        responseDocCount: resCount
      };
      requestArr.push(aRequest);
    }
    ko.utils.arrayPushAll(_myViewModel.arrRequests, requestArr);
    _myViewModel.arrRequests.valueHasMutated();
    ko.utils.arrayPushAll(
      _myViewModel.arrRequestsInternalAlmostDue(),
      arrInternalAlmostDue
    );
    _myViewModel.arrRequestsInternalAlmostDue.valueHasMutated();
    ko.utils.arrayPushAll(_myViewModel.arrRequestsAlmostDue(), arrAlmostDue);
    _myViewModel.arrRequestsAlmostDue.valueHasMutated();
    ko.utils.arrayPushAll(
      _myViewModel.arrRequestsInternalPastDue(),
      arrInternalPastDue
    );
    _myViewModel.arrRequestsInternalPastDue.valueHasMutated();
    ko.utils.arrayPushAll(_myViewModel.arrRequestsPastDue(), arrPastDue);
    _myViewModel.arrRequestsPastDue.valueHasMutated();
    ko.utils.arrayPushAll(
      _myViewModel.arrRequestsWithNoResponses(),
      arrRequestsWithNoResponses
    );
    _myViewModel.arrRequestsWithNoResponses.valueHasMutated();
    ko.utils.arrayPushAll(
      _myViewModel.arrRequestsWithNoEmailSent(),
      arrRequestsWithNoEmailSent
    );
    _myViewModel.arrRequestsWithNoEmailSent.valueHasMutated();
  }
  function LoadTabStatusReport2() {
    const arr = m_getArrRequests();
    if (arr == null)
      return;
    _myViewModel.arrResponsesWithUnsubmittedResponseDocs([]);
    var arrSubmittedResponsesByAO = new Array();
    var arrUnsubmittedResponseDocs = [];
    const arrResponsesReadyToClose = [];
    var responseArr = new Array();
    var requestLength = arr.length;
    function responseReadyToClose(response) {
      if (response.resStatus == AuditResponseStates.Closed)
        return false;
      return response.responseDocs.length && !response.responseDocs.find(
        (responseDoc) => [
          AuditResponseDocStates.Open,
          AuditResponseDocStates.Submitted
        ].includes(responseDoc.documentStatus)
      );
    }
    for (var x = 0; x < requestLength; x++) {
      var oRequest = arr[x];
      var responseLength = oRequest.responses.length;
      for (var y = 0; y < responseLength; y++) {
        var oResponse = oRequest.responses[y];
        var responseTitle = oResponse.title;
        var responseStatus = oResponse.resStatus;
        var resCount = m_oResponseTitleAndDocCount[oResponse.title];
        if (!resCount)
          resCount = 0;
        var responseUnsubmittedDocs = [];
        if (resCount && [AuditResponseStates.Open, AuditResponseStates.ReturnedToAO].includes(
          responseStatus
        )) {
          responseUnsubmittedDocs = oResponse.responseDocs.filter(
            (responseDoc) => responseDoc.documentStatus == AuditResponseDocStates.Open
          );
        }
        var aResponse = {
          visibleRow: ko.observable(true),
          reqNumber: oRequest.number,
          sample: oResponse.sample,
          title: responseTitle,
          internalDueDate: oRequest.internalDueDate,
          status: responseStatus,
          ao: oResponse.actionOffice,
          docCount: resCount,
          modified: oResponse.modified,
          request: ko.observable(oRequest)
        };
        responseArr.push(aResponse);
        if (oRequest.reqType == AUDITREQUESTTYPES.TASKER && responseReadyToClose(oResponse)) {
          arrResponsesReadyToClose.push(oResponse);
        }
        if (oResponse.resStatus == "2-Submitted")
          arrSubmittedResponsesByAO.push({
            title: oResponse.title,
            number: oRequest.number
          });
        if (responseUnsubmittedDocs.length) {
          arrUnsubmittedResponseDocs.push({
            title: oResponse.title,
            number: oRequest.number,
            unsubmittedDocs: responseUnsubmittedDocs
          });
        }
      }
    }
    if (responseArr.length > 0) {
      ko.utils.arrayPushAll(_myViewModel.arrResponses, responseArr);
      _myViewModel.arrResponses.valueHasMutated();
    }
    ko.utils.arrayPushAll(
      _myViewModel.arrResponsesSubmittedByAO(),
      arrSubmittedResponsesByAO
    );
    _myViewModel.arrResponsesSubmittedByAO.valueHasMutated();
    ko.utils.arrayPushAll(
      _myViewModel.arrResponsesReadyToClose,
      arrResponsesReadyToClose
    );
    ko.utils.arrayPushAll(
      _myViewModel.arrResponsesWithUnsubmittedResponseDocs,
      arrUnsubmittedResponseDocs
    );
    _myViewModel.filterStatusTables(true);
    _myViewModel.showQuickInfo(_myViewModel.alertQuickInfo());
  }
  function m_fnViewLateRequests() {
    window.open(
      Audit.Common.Utilities.GetSiteUrl() + "/pages/AuditReport_RequestsStatus.aspx",
      "_blank"
    );
  }
  function m_fnViewPermissions() {
    window.open(
      Audit.Common.Utilities.GetSiteUrl() + "/pages/AuditPermissions.aspx",
      "_blank"
    );
  }
  function m_fnViewResponseDocsToday() {
    window.open(
      Audit.Common.Utilities.GetSiteUrl() + "/pages/AuditUnSubmittedResponseDocuments.aspx",
      "_blank"
    );
  }
  function m_fnViewReturnedDocs() {
    window.open(
      Audit.Common.Utilities.GetSiteUrl() + "/pages/AuditReturnedResponses.aspx",
      "_blank"
    );
  }
  function m_fnIsRequestAlmostDue(oRequest, dueDate) {
    var todayDate = /* @__PURE__ */ new Date();
    if (dueDate == null || dueDate == "")
      return false;
    dueDate = new Date(dueDate);
    var one_day = 1e3 * 60 * 60 * 24;
    var difference = Math.ceil(
      (todayDate.getTime() - dueDate.getTime()) / one_day
    );
    if ((oRequest.status == "Open" || oRequest.status == "ReOpened") && difference >= 0 && difference <= 3)
      return true;
    return false;
  }
  function m_fnIsRequestPastDue(oRequest, dueDate = null) {
    var todayDate = /* @__PURE__ */ new Date();
    todayDate.setHours(0, 0, 0, 0);
    if (dueDate == null || dueDate == "")
      return false;
    const dueDateD = new Date(dueDate);
    if ((oRequest.status == "Open" || oRequest.status == "ReOpened") && todayDate.getTime() > dueDateD.getTime())
      return true;
    return false;
  }
  function m_fnCreateRequest() {
    if (!m_bIsSiteOwner) {
      SP.UI.Notify.addNotification(
        "You do not have access to perform this action...",
        false
      );
      return;
    }
    const newRequestForm = new NewRequestFormComponent();
    const options = {
      title: "Create a New Request",
      form: newRequestForm,
      dialogReturnValueCallback: OnCallbackFormNewRequest
    };
    showModalDialog(options);
  }
  function m_fnBulkAddRequest() {
    if (!m_bIsSiteOwner) {
      SP.UI.Notify.addNotification(
        "You do not have access to perform this action...",
        false
      );
      return;
    }
    const bulkAddRequestForm = new BulkAddRequestForm();
    const options = {
      title: "Bulk Add Request",
      form: bulkAddRequestForm,
      dialogReturnValueCallback: OnCallbackFormReload
    };
    showModalDialog(options);
  }
  async function m_fnViewRequest(id2) {
    m_bIsTransactionExecuting = true;
    const request2 = await appContext.AuditRequests.FindById(id2);
    const requestViewForm = DispForm(request2);
    const options = {
      title: "View Request (ID:" + id2 + ")",
      form: requestViewForm,
      dialogReturnValueCallback: OnCallbackForm
    };
    showModalDialog(options);
  }
  async function m_fnEditRequest(id2, requestNum) {
    if (!m_bIsSiteOwner) {
      SP.UI.Notify.addNotification(
        "You do not have access to perform this action...",
        false
      );
      return;
    }
    m_bIsTransactionExecuting = true;
    m_itemID = id2;
    m_requestNum = requestNum;
    const request2 = await appContext.AuditRequests.FindById(id2);
    const form = new EditRequestForm({ entity: request2 });
    const options = {
      title: "Edit Request (" + requestNum + ")",
      form,
      dialogReturnValueCallback: OnCallbackFormEditRequest
    };
    showModalDialog(options);
  }
  async function m_fnViewCoverSheet(id2) {
    m_bIsTransactionExecuting = true;
    const coverSheet = await appContext.AuditCoversheets.FindById(id2);
    const coverSheetViewForm = DispForm(coverSheet);
    const options = {
      title: "View Coversheet (ID:" + id2 + ")",
      form: coverSheetViewForm,
      dialogReturnValueCallback: OnCallbackForm
    };
    showModalDialog(options);
  }
  async function m_fnEditCoverSheet(id2, requestNum) {
    m_bIsTransactionExecuting = true;
    m_requestNum = requestNum;
    const coverSheet = await appContext.AuditCoversheets.FindById(id2);
    const coverSheetForm = new EditCoverSheetForm({ entity: coverSheet });
    const options = {
      form: coverSheetForm
    };
    options.title = "Edit Coversheet (ID:" + id2 + ")";
    options.dialogReturnValueCallback = OnCallbackFormCoverSheet;
    showModalDialog(options);
  }
  function m_fnBulkAddResponse(id2) {
    if (!m_bIsSiteOwner) {
      SP.UI.Notify.addNotification(
        "You do not have access to perform this action...",
        false
      );
      return;
    }
    m_bIsTransactionExecuting = true;
    var options = SP.UI.$create_DialogOptions();
    options.title = "Bulk Add Responses (" + id2 + ")";
    options.dialogReturnValueCallback = OnCallbackFormBulkAddResponse;
    options.height = 800;
    options.url = Audit.Common.Utilities.GetSiteUrl() + "/pages/AuditBulkAddResponse.aspx?ReqNum=" + id2 + GetSourceUrlForForms();
    SP.UI.ModalDialog.showModalDialog(options);
  }
  function m_fnBulkEditResponse(id2) {
    if (!m_bIsSiteOwner) {
      SP.UI.Notify.addNotification(
        "You do not have access to perform this action...",
        false
      );
      return;
    }
    m_bIsTransactionExecuting = true;
    var options = SP.UI.$create_DialogOptions();
    options.title = "Bulk Edit Responses (" + id2 + ")";
    options.dialogReturnValueCallback = OnCallbackFormBulkEditResponse;
    options.height = 850;
    options.width = 1100;
    options.allowMaximize = true;
    options.allowResize = true;
    options.args = {
      bigMap: m_bigMap,
      m_fnBreakCoversheetPermissions,
      m_fnBreakResponsePermissions,
      m_fnBreakResponseFolderPermissions
    };
    options.url = Audit.Common.Utilities.GetSiteUrl() + "/pages/AuditBulkEditResponse.aspx?ReqNum=" + id2 + GetSourceUrlForForms();
    SP.UI.ModalDialog.showModalDialog(options);
  }
  function m_fnGetNextSampleNumber(requestNumber) {
    var sampleNumber = 0;
    const oRequest = m_fnGetRequestByNumber(requestNumber);
    for (var y = 0; y < oRequest.responses.length; y++) {
      if (oRequest.responses[y].sample > sampleNumber)
        sampleNumber = oRequest.responses[y].sample;
    }
    if (oRequest.responses.length > 0)
      sampleNumber++;
    return sampleNumber;
  }
  async function m_fnAddResponse(id2, reqNum) {
    if (!m_bIsSiteOwner) {
      SP.UI.Notify.addNotification(
        "You do not have access to perform this action...",
        false
      );
      return;
    }
    m_bIsTransactionExecuting = true;
    var sampleNumber = m_fnGetNextSampleNumber(reqNum);
    const request2 = await appContext.AuditRequests.FindById(id2);
    const newResponse = new AuditResponse();
    newResponse.ReqNum.Value(request2);
    newResponse.SampleNumber.Value(sampleNumber);
    const newResponseForm = new NewResponseForm({ entity: newResponse });
    const options = {
      form: newResponseForm
    };
    options.title = "Add Response to (Request Number:" + id2 + ")";
    options.dialogReturnValueCallback = OnCallbackFormNewResponse;
    showModalDialog(options);
  }
  async function m_fnViewResponse(requestNumber, id2, responseTitle, responseStatus) {
    m_bIsTransactionExecuting = true;
    const response = await appContext.AuditResponses.FindById(id2);
    if (!response) {
      SP.UI.Notify.addNotification("Response not found! " + id2, false);
      alert();
      return;
    }
    const viewResponseForm = DispForm(response);
    var options = {
      form: viewResponseForm
    };
    options.title = "View Response (" + responseTitle + ")";
    options.height = 600;
    options.dialogReturnValueCallback = OnCallbackForm;
    showModalDialog(options);
  }
  async function m_fnEditResponse(requestNumber, id2, responseTitle, responseStatus) {
    if (!m_bIsSiteOwner) {
      SP.UI.Notify.addNotification(
        "You do not have access to perform this action...",
        false
      );
      return;
    }
    m_bIsTransactionExecuting = true;
    m_requestNum = requestNumber;
    m_itemID = id2;
    m_responseTitle = responseTitle;
    m_responseStatus = responseStatus;
    const response = await appContext.AuditResponses.FindById(id2);
    if (!response) {
      SP.UI.Notify.addNotification("Response not found! " + id2, false);
      alert();
      return;
    }
    const editReponseForm = new EditResponseForm({ entity: response });
    const options = {
      form: editReponseForm
    };
    options.title = "Edit Response (" + responseTitle + ")";
    options.dialogReturnValueCallback = OnCallbackFormEditResponse;
    showModalDialog(options);
  }
  function m_fnReviewingResponse(activeViewers) {
    SP.UI.Notify.addNotification("Reviewing Response...", false);
    activeViewers.pushCurrentUser();
  }
  async function m_fnViewResponseDoc(id2, requestID, responseID) {
    m_bIsTransactionExecuting = true;
    const responseDoc = await appContext.AuditResponseDocs.FindById(id2);
    const responseDocForm = DispForm(responseDoc);
    const options = {
      form: responseDocForm
    };
    options.title = "View Response Doc (ID:" + id2 + ")";
    options.height = "600";
    options.dialogReturnValueCallback = OnCallbackForm;
    showModalDialog(options);
  }
  async function m_fnEditResponseDoc(id2, requestID, responseID) {
    if (!m_bIsSiteOwner) {
      SP.UI.Notify.addNotification(
        "You do not have access to perform this action...",
        false
      );
      return;
    }
    m_bIsTransactionExecuting = true;
    const responseDoc = await appContext.AuditResponseDocs.FindById(id2);
    const responseDocForm = new EditResponseDocForm({ entity: responseDoc });
    const options = {
      form: responseDocForm
    };
    options.title = "Edit ResponseDoc (ID:" + id2 + ")";
    options.dialogReturnValueCallback = OnCallbackForm;
    showModalDialog(options);
  }
  async function m_fnApproveResponseDocsForQA(oRequest, oResponseDocs) {
    if (!oRequest.sensitivity) {
      alert("Request Sensitivity has not been set!");
      return false;
    }
    for (const oResponse of oRequest.responses) {
      const responseApprovedResponseDocs = oResponse.responseDocs.filter(
        (responseDoc) => oResponseDocs.includes(responseDoc)
      );
      if (!responseApprovedResponseDocs.length) {
        continue;
      }
      for (const oResponseDoc of responseApprovedResponseDocs) {
        var ctx2 = new SP.ClientContext.get_current();
        var oList = ctx2.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
        const newResponseDocFileName = m_fnGetNewResponseDocTitle(
          oResponseDoc.item,
          oResponseDoc.responseTitle,
          oRequest.sensitivity
        );
        const approveResponseDocTask = addTask(
          taskDefs.approveResponseDoc(newResponseDocFileName)
        );
        const oListItem = oList.getItemById(oResponseDoc.item.get_item("ID"));
        ctx2.load(oListItem);
        await new Promise((resolve, reject2) => {
          ctx2.executeQueryAsync(resolve, reject2);
        });
        oListItem.set_item("DocumentStatus", AuditResponseDocStates.SentToQA);
        oListItem.set_item("RejectReason", "");
        oListItem.set_item("FileLeafRef", newResponseDocFileName);
        oListItem.update();
        await new Promise((resolve, reject2) => {
          ctx2.executeQueryAsync(resolve, reject2);
        });
        finishTask(approveResponseDocTask);
      }
      if (oResponse.resStatus != AuditResponseStates.Submitted)
        continue;
      const ctx = new SP.ClientContext.get_current();
      ctx.load(oResponse.item);
      oResponse.item.set_item("ResStatus", AuditResponseStates.ApprovedForQA);
      oResponse.item.update();
      await executeQuery(ctx).catch(({ sender, args }) => {
        console.error("Unable to set response status approved for QA", oResponse);
      });
      await m_fnBreakResponseAndFolderPermissions(
        oRequest.status,
        oResponse,
        false,
        true
      );
    }
    await m_fnBreakRequestPermissions(
      oRequest.item,
      false,
      AuditResponseStates.ApprovedForQA
    );
    if (oRequest.coversheets?.length) {
      await Promise.all(
        oRequest.coversheets.map(
          (coversheet) => m_fnBreakCoversheetPermissions(coversheet.item, true)
        )
      );
    }
    await m_fnNotifyQAApprovalPending(oRequest, oResponseDocs);
    return true;
  }
  async function m_fnRejectResponseDoc(oRequest, oResponseDoc, rejectReason) {
    var clientContext2 = SP.ClientContext.get_current();
    var oList = clientContext2.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
    const oListItem = oList.getItemById(oResponseDoc.ID);
    clientContext2.load(oListItem);
    await new Promise(
      (resolve, reject2) => clientContext2.executeQueryAsync(
        resolve,
        (sender, args) => reject2({ sender, args })
      )
    ).catch(({ sender, args }) => {
      alert(
        "Request failed. " + args.get_message() + "\n" + args.get_stackTrace()
      );
    });
    var ctx2 = new SP.ClientContext.get_current();
    var oList = ctx2.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
    oListItem.set_item("DocumentStatus", "Rejected");
    oListItem.set_item("RejectReason", rejectReason);
    var sensitivity = "";
    if (oRequest)
      sensitivity = oRequest.sensitivity;
    var newResponseDocFileName = m_fnGetNewResponseDocTitle(
      oListItem,
      oResponseDoc.responseTitle,
      sensitivity
    );
    oListItem.set_item("FileLeafRef", newResponseDocFileName);
    oListItem.set_item("RejectReason", rejectReason);
    oListItem.update();
    var siteUrl = location.protocol + "//" + location.host + _spPageContextInfo.webServerRelativeUrl + "/";
    const filePath = oListItem.get_item("FileDirRef");
    var lastInd = filePath.lastIndexOf("/");
    var urlpath = filePath.substring(0, lastInd + 1);
    var responseTitle = filePath.replace(urlpath, "");
    var folderPath = Audit.Common.Utilities.GetSiteUrl() + "/" + Audit.Common.Utilities.GetLibNameResponseDocs() + "/" + responseTitle;
    var aresponseDocList = ctx2.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
    var aresponseDocQuery = new SP.CamlQuery();
    aresponseDocQuery.set_viewXml(
      '<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><And><Eq><FieldRef Name="FSObjType"/><Value Type="Text">0</Value></Eq><Eq><FieldRef Name="FileDirRef"/><Value Type="Text">' + folderPath + "</Value></Eq></And></Where></Query></View>"
    );
    const aresponseDocItems = aresponseDocList.getItems(aresponseDocQuery);
    ctx2.load(aresponseDocItems);
    var aresponseList = ctx2.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetListTitleResponses());
    var aresponseQuery = new SP.CamlQuery();
    aresponseQuery.set_viewXml(
      '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' + responseTitle + "</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>"
    );
    const aresponseItems = aresponseList.getItems(aresponseQuery);
    ctx2.load(aresponseItems);
    var emailList = ctx2.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory());
    var emailListQuery = new SP.CamlQuery();
    emailListQuery.set_viewXml(
      '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>'
    );
    const emailListFolderItems = emailList.getItems(emailListQuery);
    ctx2.load(emailListFolderItems, "Include(ID, FSObjType, Title, DisplayName)");
    await new Promise(
      (resolve, reject2) => ctx2.executeQueryAsync(resolve, (sender, args) => reject2({ sender, args }))
    ).catch(({ sender, args }) => {
      alert(
        "Request failed. " + args.get_message() + "\n" + args.get_stackTrace()
      );
      return;
    });
    const notifyId3 = SP.UI.Notify.addNotification(
      "Rejected Response Document",
      false
    );
  }
  function m_fnCheckInResponseDoc(folder, fileName) {
    if (!m_bIsSiteOwner) {
      SP.UI.Notify.addNotification(
        "You do not have access to perform this action...",
        false
      );
      return;
    }
    m_bIsTransactionExecuting = true;
    var options = SP.UI.$create_DialogOptions();
    options.title = "Check in Response Document";
    options.height = "600";
    options.dialogReturnValueCallback = OnCallbackForm;
    options.url = Audit.Common.Utilities.GetSiteUrl() + "/_layouts/checkin.aspx?List={" + m_libResponseDocsLibraryGUID + "}&FileName=" + folder + "/" + fileName;
    SP.UI.ModalDialog.showModalDialog(options);
  }
  function m_fnViewResponseDocFolder(title) {
    m_bIsTransactionExecuting = true;
    var options = SP.UI.$create_DialogOptions();
    options.title = "View Response Folder";
    options.height = "600";
    options.dialogReturnValueCallback = OnCallbackForm;
    options.url = Audit.Common.Utilities.GetSiteUrl() + "/pages/AuditResponseDocs.aspx?RootFolder=" + Audit.Common.Utilities.GetSiteUrl() + "/" + Audit.Common.Utilities.GetLibNameResponseDocs() + "/" + title;
    SP.UI.ModalDialog.showModalDialog(options);
  }
  function m_fnViewEmailHistoryFolder(reqNum) {
    m_bIsTransactionExecuting = true;
    var options = SP.UI.$create_DialogOptions();
    options.title = "View Email History";
    options.autoSize = true;
    options.dialogReturnValueCallback = OnCallbackForm;
    options.url = Audit.Common.Utilities.GetSiteUrl() + "/pages/AuditEmailHistory.aspx?RootFolder=" + Audit.Common.Utilities.GetSiteUrl() + "/Lists/" + Audit.Common.Utilities.GetListNameEmailHistory() + "/" + reqNum + GetSourceUrlForForms();
    SP.UI.ModalDialog.showModalDialog(options);
  }
  function m_fnDeleteResponseDoc(itemID) {
    if (!m_bIsSiteOwner) {
      SP.UI.Notify.addNotification(
        "You do not have access to perform this action...",
        false
      );
      return;
    }
    if (confirm("Are you sure you would like to Delete this Response Document?")) {
      let OnSuccess = function(sender, args) {
        m_fnRefresh();
      }, OnFailure = function(sender, args) {
        const statusId2 = SP.UI.Status.addStatus(
          "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
        );
        SP.UI.Status.setStatusPriColor(statusId2, "red");
      };
      m_bIsTransactionExecuting = true;
      var currCtx = new SP.ClientContext();
      var responseDocsLib = currCtx.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibNameResponseDocs());
      var oListItem = responseDocsLib.getItemById(itemID);
      oListItem.recycle();
      currCtx.executeQueryAsync(OnSuccess, OnFailure);
    }
  }
  function m_fnResendRejectedResponseDocToQA(itemID) {
    if (!m_bIsSiteOwner) {
      SP.UI.Notify.addNotification(
        "You do not have access to perform this action...",
        false
      );
      return;
    }
    if (confirm(
      "Are you sure you would like to Update the Response Document status by clearing the Rejected status marked by QA?"
    )) {
      let OnSuccess = function(sender, args) {
        m_fnRefreshData();
      }, OnFailure = function(sender, args) {
        const statusId2 = SP.UI.Status.addStatus(
          "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
        );
        SP.UI.Status.setStatusPriColor(statusId2, "red");
      };
      m_bIsTransactionExecuting = true;
      var currCtx = new SP.ClientContext();
      var responseDocsLib = currCtx.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibNameResponseDocs());
      var oListItem = responseDocsLib.getItemById(itemID);
      oListItem.set_item("DocumentStatus", "Submitted");
      oListItem.set_item("RejectReason", "");
      oListItem.update();
      currCtx.executeQueryAsync(OnSuccess, OnFailure);
    }
  }
  async function m_fnReOpenResponse(requestNumber, responseTitle) {
    if (!m_bIsSiteOwner) {
      SP.UI.Notify.addNotification(
        "You do not have access to perform this action...",
        false
      );
      return;
    }
    if (confirm(
      "Are you sure you would like to re-open this response (" + responseTitle + ")?"
    )) {
      m_bIsTransactionExecuting = true;
      document.body.style.cursor = "wait";
      var currCtx2 = new SP.ClientContext.get_current();
      var oRequestBigMap = m_bigMap["request-" + requestNumber];
      if (oRequestBigMap) {
        for (var z = 0; z < oRequestBigMap.responses.length; z++) {
          if (oRequestBigMap.responses[z].title == responseTitle) {
            oRequestBigMap.responses[z].item.set_item("ResStatus", "1-Open");
            oRequestBigMap.responses[z].item.update();
            await m_fnBreakResponseAndFolderPermissions(
              "ReOpened",
              oRequestBigMap.responses[z],
              false,
              true,
              false,
              false
            );
            break;
          }
        }
        var oListItem = oRequestBigMap.item;
        var curRequestStatus = oListItem.get_item("ReqStatus");
        if (curRequestStatus == "Closed") {
          oListItem.set_item("ReqStatus", "ReOpened");
          oListItem.update();
        } else if (curRequestStatus != "Open") {
          oListItem.set_item("ReqStatus", "Open");
          oListItem.update();
        }
        await m_fnBreakRequestPermissions(oListItem, false);
      }
      currCtx2.executeQueryAsync(
        function() {
          setTimeout(function() {
            m_fnRefresh();
          }, 1e3);
        },
        function(sender, args) {
          alert(
            "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
          );
          setTimeout(function() {
            m_fnRefresh();
          }, 1e3);
        }
      );
    }
  }
  async function m_fnCloseRequest() {
    if (!m_bIsSiteOwner) {
      SP.UI.Notify.addNotification(
        "You do not have access to perform this action...",
        false
      );
      return;
    }
    var requestNumberToClose = $("#ddlReqNum").val();
    if (confirm(
      "Are you sure you would like to Close this Request (" + requestNumberToClose + ")?"
    )) {
      m_bIsTransactionExecuting = true;
      for (var x = 0; x < m_arrRequestsToClose.length; x++) {
        var oIt = m_arrRequestsToClose[x];
        var requestNumber = oIt.number;
        if (requestNumberToClose != requestNumber)
          continue;
        var closedDate = oIt.lastClosedDate;
        var closedBy = oIt.lastClosedBy;
        var oRequest = m_fnGetRequestByNumber(requestNumber);
        oRequest.item.set_item(
          "ClosedDate",
          oIt.oResponse.item.get_item("ClosedDate")
        );
        oRequest.item.set_item(
          "ClosedBy",
          oIt.oResponse.item.get_item("ClosedBy")
        );
        oRequest.item.set_item("ReqStatus", "Closed");
        oRequest.item.update();
        const m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
          "Information",
          "Please wait... updating permissions on the Request",
          100,
          600
        );
        m_fnBreakRequestPermissions(oRequest.item, false);
        var doneUpdatingResponses = false;
        await m_fnUpdateAllResponsePermissions(
          "Closed",
          requestNumberToClose,
          true
        );
        setTimeout(function() {
          m_fnRefresh();
        }, 100);
        break;
      }
    }
  }
  function m_fnGetRequestByNumber(requestNumber) {
    var oRequest = null;
    oRequest = m_bigMap["request-" + requestNumber];
    return oRequest;
  }
  function m_fnGetRequestByID(requestID) {
    const oRequest = Object.entries(m_bigMap).find(([key, value]) => {
      return key.startsWith("request-") && value.ID == requestID;
    });
    if (!oRequest)
      return;
    return oRequest[1];
  }
  function m_fnFormatEmailBodyToAO(oRequest, responseTitles, poc) {
    var emailText = "<div>Audit Request Reference: <b>{REQUEST_NUMBER}</b></div><div>Audit Request Subject: <b>{REQUEST_SUBJECT}</b></div><div>Audit Request Due Date: <b>{REQUEST_DUEDATE}</b></div>{POC}{REQUEST_RELATEDAUDIT}<br/><div>Below are the listed action items that have been requested for the Audit: </div><div>{REQUEST_ACTIONITEMS}<br/></div><div>Please provide responses for the following Sample(s): </div><br/><div>{RESPONSE_TITLES}</div>";
    emailText = emailText.replace("{REQUEST_NUMBER}", oRequest.number);
    emailText = emailText.replace("{REQUEST_SUBJECT}", oRequest.subject);
    emailText = emailText.replace("{REQUEST_DUEDATE}", oRequest.internalDueDate);
    emailText = emailText.replace("{REQUEST_ACTIONITEMS}", oRequest.actionItems);
    if (poc == null || poc == "")
      emailText = emailText.replace("{POC}", "<br/>");
    else
      emailText = emailText.replace("{POC}", "<br/><b>POC: " + poc + "</b><br/>");
    if (responseTitles != null && responseTitles.length > 0) {
      let sortNumber = function(a, b) {
        a = parseInt(a.sample, 10);
        b = parseInt(b.sample, 10);
        return a - b;
      };
      responseTitles.sort(sortNumber);
      var responseTitleBody = "<ul>";
      for (var x = 0; x < responseTitles.length; x++) {
        responseTitleBody += "<li>" + responseTitles[x].title + "</li>";
      }
      responseTitleBody += "</ul>";
      emailText = emailText.replace("{RESPONSE_TITLES}", responseTitleBody);
    } else
      emailText = emailText.replace("{RESPONSE_TITLES}", "");
    if (oRequest.relatedAudit == null || oRequest.relatedAudit == "")
      emailText = emailText.replace(
        "{REQUEST_RELATEDAUDIT}",
        "<div>This is a new request, not similar to previous audit cycles.</div>"
      );
    else
      emailText = emailText.replace(
        "{REQUEST_RELATEDAUDIT}",
        "<div>This request is similar to this previous cycle audit: " + oRequest.relatedAudit + "</div>"
      );
    return emailText;
  }
  function m_fnSyncEmailActionOffices(requestID) {
    if (!m_bIsSiteOwner) {
      SP.UI.Notify.addNotification(
        "You do not have access to perform this action...",
        false
      );
      return;
    }
    if (confirm(
      "Are you sure you would like to replace all Email Action Offices with current Action Offices?"
    )) {
      m_bIsTransactionExecuting = true;
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      const oRequest = m_fnGetRequestByID(requestID);
      if (oRequest == null) {
        alert("Error occurred");
        return;
      }
      if (oRequest.status != "Open" && oRequest.status != "ReOpened") {
        SP.UI.Notify.addNotification("This request is not Open.", false);
        return;
      }
      var emailActionOffices = oRequest.item.get_item("ActionOffice");
      var requestList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleRequests());
      const oListItem = requestList.getItemById(requestID);
      oListItem.set_item("EmailActionOffice", emailActionOffices);
      oListItem.update();
      currCtx.executeQueryAsync(
        function() {
          SP.UI.Notify.addNotification("Email Action Offices Set. ", false);
          setTimeout(function() {
            m_fnRefreshData();
          }, 1e3);
        },
        function(sender, args) {
          alert(
            "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
          );
          m_fnRefresh();
        }
      );
    }
  }
  function m_fnSendEmail(requestID) {
    if (!m_bIsSiteOwner) {
      SP.UI.Notify.addNotification(
        "You do not have access to perform this action...",
        false
      );
      return;
    }
    if (!confirm(
      "Are you sure you would like to notify all Action Offices listed in the Email Action Offices field?"
    ))
      return;
    m_bIsTransactionExecuting = true;
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();
    const oRequest = m_fnGetRequestByID(requestID);
    if (oRequest == null) {
      alert("Error occurred");
      return;
    }
    if (oRequest.status != "Open" && oRequest.status != "ReOpened") {
      SP.UI.Notify.addNotification("This request is not Open.", false);
      return;
    }
    var responseCount = oRequest.responses.length;
    if (responseCount == 0) {
      SP.UI.Notify.addNotification(
        "There are no responses associated with this request.",
        false
      );
      return;
    }
    var arrEmailActionOffice = oRequest.item.get_item("EmailActionOffice")?.map((actionOffice) => actionOffice.get_lookupValue());
    if (arrEmailActionOffice.length == 0) {
      SP.UI.Notify.addNotification(
        "Unable to send an email. 0 Action Offices listed in the Email Action Office field",
        false
      );
      return;
    }
    var arrEmails = new Array();
    for (var y = 0; y < responseCount; y++) {
      var oResponse = oRequest.responses[y];
      if (oResponse.resStatus != "1-Open" && oResponse.resStatus != "3-Returned to Action Office") {
        SP.UI.Notify.addNotification(
          "Skipping Response (" + oResponse.title + "). It's not Open or Returned to Action Office",
          false
        );
        continue;
      }
      var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName(
        oResponse.actionOffice
      );
      var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup(
        actionOfficeGroupName
      );
      if (actionOfficeGroupName == "" || actionOfficeGroupName == null || actionOfficeGroup == null) {
        SP.UI.Notify.addNotification(
          "Unable to send an email. Action Office (" + oResponse.actionOffice + ") does not have a group associated with it",
          false
        );
        return;
      }
      if (!arrEmailActionOffice.includes(oResponse.actionOffice))
        continue;
      var ao = actionOfficeGroupName;
      if (oResponse.poc != null && oResponse.poc != "")
        ao = oResponse.poc + ";" + oResponse.pocCC;
      var emailTo = oResponse.poc ? oResponse.poc + ";" + oResponse.pocCC : oResponse.actionOffice;
      var bFound = false;
      for (var x = 0; x < arrEmails.length; x++) {
        if (arrEmails[x].actionOffice == ao) {
          var oResSample = new Object();
          oResSample["sample"] = oResponse.sample;
          oResSample["title"] = oResponse.title;
          arrEmails[x].responseTitles.push(oResSample);
          bFound = true;
        }
      }
      if (!bFound) {
        var emailObject = new Object();
        emailObject.actionOffice = ao;
        emailObject.emailTo = emailTo;
        emailObject.poc = oResponse.poc;
        emailObject.responseTitles = new Array();
        var oResSample = new Object();
        oResSample["sample"] = oResponse.sample;
        oResSample["title"] = oResponse.title;
        emailObject.responseTitles.push(oResSample);
        arrEmails.push(emailObject);
      }
    }
    if (arrEmails.length == 0) {
      SP.UI.Notify.addNotification(
        "Unable to send an email. 0 Action Offices in the Email Action Office field match the Responses",
        false
      );
      return;
    }
    const m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
      "Sending Emails",
      "Please wait... sending email notifications to Action Offices",
      100,
      400
    );
    document.body.style.cursor = "wait";
    var emailList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory());
    var emailListQuery = new SP.CamlQuery();
    emailListQuery.set_viewXml(
      '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>'
    );
    const emailListFolderItems = emailList.getItems(emailListQuery);
    currCtx.load(emailListFolderItems, "Include(ID, Title, DisplayName)");
    function OnSuccess(sender, args) {
      const m_emailCount = arrEmails.length;
      var cnt = 0;
      for (var y2 = 0; y2 < m_emailCount; y2++) {
        var emailSubject = "Your Response Has Been Requested for Request Number: " + oRequest.number;
        var emailText = m_fnFormatEmailBodyToAO(
          oRequest,
          arrEmails[y2].responseTitles,
          arrEmails[y2].poc
        );
        var itemCreateInfo = new SP.ListItemCreationInformation();
        itemCreateInfo.set_folderUrl(
          location.protocol + "//" + location.host + Audit.Common.Utilities.GetSiteUrl() + "/Lists/" + Audit.Common.Utilities.GetListNameEmailHistory() + "/" + oRequest.number
        );
        const oListItem = emailList.addItem(itemCreateInfo);
        oListItem.set_item("Title", emailSubject);
        oListItem.set_item("Body", emailText);
        oListItem.set_item("To", arrEmails[y2].emailTo);
        oListItem.set_item("ReqNum", oRequest.number);
        oListItem.set_item("NotificationType", "AO Notification");
        oListItem.update();
        currCtx.executeQueryAsync(
          function() {
            cnt++;
            if (cnt == m_emailCount) {
              document.body.style.cursor = "default";
              var requestList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleRequests());
              const oListItem2 = requestList.getItemById(requestID);
              oListItem2.set_item("EmailSent", 1);
              oListItem2.update();
              currCtx.executeQueryAsync(
                function() {
                  SP.UI.Notify.addNotification(
                    "Email Sent to Action Offices. ",
                    false
                  );
                  setTimeout(function() {
                    m_waitDialog.close();
                    m_fnRefreshData();
                  }, 1e3);
                },
                function(sender2, args2) {
                  alert(
                    "Request failed: " + args2.get_message() + "\n" + args2.get_stackTrace()
                  );
                  m_fnRefresh();
                }
              );
            }
          },
          function(sender2, args2) {
            document.body.style.cursor = "default";
            alert(
              "Request failed: " + args2.get_message() + "\n" + args2.get_stackTrace()
            );
            m_fnRefresh();
          }
        );
      }
    }
    function OnFailure(sender, args) {
      document.body.style.cursor = "default";
      alert(
        "Request failed. " + args.get_message() + "\n" + args.get_stackTrace()
      );
    }
    currCtx.executeQueryAsync(OnSuccess, OnFailure);
  }
  async function m_fnNotifyQAApprovalPending(oRequest, oResponseDocs) {
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();
    var emailList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory());
    const reqNum = oRequest.number;
    const emailSubject = "Your Approval Has Been Requested for Request Number: " + reqNum;
    var emailText = "<div>Audit Request Reference: <b>" + reqNum + "</b></div><div>Audit Request Subject: <b>" + oRequest.subject + "</b></div><div>Audit Request Due Date: <b>" + oRequest.internalDueDate + "</b></div><br/><div>Response(s): <ul>";
    emailText += oRequest.responses.map((oResponse) => {
      const responseApprovedResponseDocs = oResponse.responseDocs.filter(
        (responseDoc) => oResponseDocs.includes(responseDoc)
      );
      if (!responseApprovedResponseDocs.length) {
        return;
      }
      return `<li><b>${oResponse.title}:</b> ${responseApprovedResponseDocs.length} document(s)</li>`;
    }).join("");
    emailText += "</ul></div><br/>";
    var itemCreateInfo = new SP.ListItemCreationInformation();
    itemCreateInfo.set_folderUrl(
      location.protocol + "//" + location.host + Audit.Common.Utilities.GetSiteUrl() + "/Lists/" + Audit.Common.Utilities.GetListNameEmailHistory() + "/" + reqNum
    );
    const oListItemEmail = emailList.addItem(itemCreateInfo);
    oListItemEmail.set_item("Title", emailSubject);
    oListItemEmail.set_item("Body", emailText);
    oListItemEmail.set_item("To", Audit.Common.Utilities.GetGroupNameQA());
    oListItemEmail.set_item("NotificationType", "QA Notification");
    oListItemEmail.set_item("ReqNum", reqNum);
    oListItemEmail.update();
    return new Promise((resolve, reject2) => {
      currCtx.executeQueryAsync(resolve, reject2);
    });
  }
  async function m_fnUpdateSensitivityOnRequest(requestNumber, requestSensitivity, oldSensitivity, OnComplete) {
    let m_cntResponseDocsSensToUpdate = 0;
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();
    var responseDocsLib = web.get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
    var responseDocsQuery = new SP.CamlQuery();
    responseDocsQuery.set_viewXml(
      '<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name="ReqNum"/><Value Type="Text">' + requestNumber + '</Value></Eq><Eq><FieldRef Name="ContentType"/><Value Type="Text">Document</Value></Eq></And></Where></Query></View>'
    );
    const responseDocsItems = responseDocsLib.getItems(responseDocsQuery);
    currCtx.load(
      responseDocsItems,
      "Include(ID, ReqNum, ResID, DocumentStatus, FileLeafRef, Created )"
    );
    var earesponseDocsLib = web.get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocsEA());
    var earesponseDocsQuery = new SP.CamlQuery();
    earesponseDocsQuery.set_viewXml(
      '<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name="RequestNumber"/><Value Type="Text">' + requestNumber + '</Value></Eq><Eq><FieldRef Name="ContentType"/><Value Type="Text">Document</Value></Eq></And></Where></Query></View>'
    );
    const earesponseDocsItems = earesponseDocsLib.getItems(earesponseDocsQuery);
    currCtx.load(
      earesponseDocsItems,
      "Include(ID, RequestNumber, ResponseID, FileLeafRef)"
    );
    var requestDocLib = web.get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleRequestDocs());
    var requestDocQuery = new SP.CamlQuery();
    requestDocQuery.set_viewXml(
      '<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="ReqNum"/><Value Type="Text">' + requestNumber + "</Value></Eq></Where></Query></View>"
    );
    const requestDocItems = requestDocLib.getItems(requestDocQuery);
    currCtx.load(
      requestDocItems,
      "Include(ID, Title, ReqNum, FileLeafRef, FileDirRef)"
    );
    var coverSheetLib = web.get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleCoverSheets());
    var coverSheetQuery = new SP.CamlQuery();
    coverSheetQuery.set_viewXml(
      '<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="ReqNum"/><Value Type="Text">' + requestNumber + "</Value></Eq></Where></Query></View>"
    );
    const coverSheetItems = coverSheetLib.getItems(coverSheetQuery);
    currCtx.load(
      coverSheetItems,
      "Include(ID, Title, ReqNum, ActionOffice, FileLeafRef, FileDirRef)"
    );
    await new Promise(
      (resolve, reject2) => currCtx.executeQueryAsync(resolve, reject2)
    ).catch((sender, args) => {
      const statusId2 = SP.UI.Status.addStatus(
        "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
      );
      SP.UI.Status.setStatusPriColor(statusId2, "red");
    });
    var listItemEnumerator = responseDocsItems.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      var oListItem = listItemEnumerator.get_current();
      var docStatus = oListItem.get_item("DocumentStatus");
      if (docStatus != "Open" && docStatus != "Submitted") {
        m_cntResponseDocsSensToUpdate++;
      }
    }
    m_cntResponseDocsSensToUpdate += earesponseDocsItems.get_count();
    m_cntResponseDocsSensToUpdate += requestDocItems.get_count();
    m_cntResponseDocsSensToUpdate += coverSheetItems.get_count();
    if (m_cntResponseDocsSensToUpdate == 0) {
      return true;
    }
    const updateDocPromises = [];
    var listItemEnumerator = responseDocsItems.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      var oListItem = listItemEnumerator.get_current();
      var docStatus = oListItem.get_item("DocumentStatus");
      if (docStatus != "Open" && docStatus != "Submitted") {
        var responseTitle = oListItem.get_item("ResID");
        if (responseTitle)
          responseTitle = responseTitle.get_lookupValue();
        var curFileName = oListItem.get_item("FileLeafRef");
        var newFileName = m_fnGetNewResponseDocTitle(
          oListItem,
          responseTitle,
          requestSensitivity
        );
        oListItem.set_item("FileLeafRef", newFileName);
        oListItem.update();
        updateDocPromises.push(
          new Promise((resolve, reject2) => {
            currCtx.executeQueryAsync(resolve, reject2);
          }).catch((sender, args) => {
            alert(
              "Error occurred updating sensitivity title on Response document: " + curFileName + " to " + newFileName + " " + args.get_message() + "\n" + args.get_stackTrace()
            );
          })
        );
      }
    }
    var listItemEnumerator2 = earesponseDocsItems.getEnumerator();
    while (listItemEnumerator2.moveNext()) {
      var oListItem = listItemEnumerator2.get_current();
      var curDocFileNameAndExt = oListItem.get_item("FileLeafRef");
      var curDocFileName = curDocFileNameAndExt.substring(
        0,
        curDocFileNameAndExt.lastIndexOf(".")
      );
      var curDocExt = curDocFileNameAndExt.replace(curDocFileName, "");
      var curDocResponseTitle = oListItem.get_item("ResponseID");
      var dateStamp = curDocFileName.replace(curDocResponseTitle + "_", "");
      if (dateStamp.indexOf("_") >= 0) {
        dateStamp = dateStamp.substring(0, dateStamp.indexOf("_"));
      }
      var newFileName = "";
      if (requestSensitivity != null && requestSensitivity != "" && requestSensitivity != "None")
        newFileName = curDocResponseTitle + "_" + dateStamp + "_" + requestSensitivity + curDocExt;
      else
        newFileName = curDocResponseTitle + "_" + dateStamp + curDocExt;
      if (newFileName != "") {
        oListItem.set_item("FileLeafRef", newFileName);
        oListItem.update();
      }
      updateDocPromises.push(
        new Promise((resolve, reject2) => {
          currCtx.executeQueryAsync(resolve, reject2);
        }).catch((sender, args) => {
          alert(
            "Error occurred updating sensitivity title on External Auditor Response document: " + curFileName + " to " + newFileName + " " + args.get_message() + "\n" + args.get_stackTrace()
          );
        })
      );
    }
    if (oldSensitivity == null)
      oldSensitivity = "";
    var listItemEnumerator3 = requestDocItems.getEnumerator();
    while (listItemEnumerator3.moveNext()) {
      var oListItem = listItemEnumerator3.get_current();
      var curDocFileNameAndExt = oListItem.get_item("FileLeafRef");
      var newFileName = m_fnGetNewFileNameForSensitivity(
        oListItem,
        oldSensitivity,
        requestSensitivity
      );
      if (newFileName != "") {
        oListItem.set_item("FileLeafRef", newFileName);
        oListItem.update();
      }
      updateDocPromises.push(
        new Promise((resolve, reject2) => {
          currCtx.executeQueryAsync(resolve, reject2);
        }).catch((sender, args) => {
          alert(
            "Error occurred updating sensitivity title on Request document: " + curFileName + " to " + newFileName + " " + args.get_message() + "\n" + args.get_stackTrace()
          );
        })
      );
    }
    var listItemEnumerator4 = coverSheetItems.getEnumerator();
    while (listItemEnumerator4.moveNext()) {
      var oListItem = listItemEnumerator4.get_current();
      var curDocFileNameAndExt = oListItem.get_item("FileLeafRef");
      var newFileName = m_fnGetNewFileNameForSensitivity(
        oListItem,
        oldSensitivity,
        requestSensitivity
      );
      if (newFileName != "") {
        oListItem.set_item("FileLeafRef", newFileName);
        oListItem.update();
      }
      updateDocPromises.push(
        new Promise((resolve, reject2) => {
          currCtx.executeQueryAsync(resolve, reject2);
        }).catch((sender, args) => {
          alert(
            "Error occurred updating sensitivity title on Coversheet document: " + curFileName + " to " + newFileName + " " + args.get_message() + "\n" + args.get_stackTrace()
          );
        })
      );
    }
    await Promise.all(updateDocPromises);
    return true;
  }
  function m_fnGetNewFileNameForSensitivity(oListItem, oldSensitivity, requestSensitivity) {
    var newFileName = null;
    var curDocFileNameAndExt = oListItem.get_item("FileLeafRef");
    var curDocFileName = curDocFileNameAndExt.substring(
      0,
      curDocFileNameAndExt.lastIndexOf(".")
    );
    var curDocExt = curDocFileNameAndExt.replace(curDocFileName, "");
    newFileName = curDocFileName;
    if (oldSensitivity != null && oldSensitivity != "") {
      if (curDocFileName.endsWith("_" + oldSensitivity)) {
        newFileName = newFileName.replace("_" + oldSensitivity, "");
      }
    }
    if (requestSensitivity != null && requestSensitivity != "" && requestSensitivity != "None") {
      if (!curDocFileName.endsWith("_" + requestSensitivity))
        newFileName = newFileName + "_" + requestSensitivity;
    }
    return newFileName;
  }
  function m_fnGetNewResponseDocTitle(responseDocItem, responseName, sensitivity) {
    var createdDate = responseDocItem.get_item("Created");
    var newResponseDocTitle = responseName + "_" + createdDate.format("yyyyMMddTHHmmss") + "_" + Math.ceil(Math.random() * 1e4);
    if (sensitivity != null && sensitivity != "" && sensitivity != "None")
      newResponseDocTitle += "_" + sensitivity;
    var oldResponseDocTitle = responseDocItem.get_item("FileLeafRef");
    var docName = oldResponseDocTitle.substring(
      0,
      oldResponseDocTitle.lastIndexOf(".")
    );
    var docExt = oldResponseDocTitle.replace(docName, "");
    newResponseDocTitle += docExt;
    return newResponseDocTitle;
  }
  async function m_fnBreakRequestPermissions(oListItem, refreshPageOnUpdate = false, responseStatus, OnComplete) {
    if (refreshPageOnUpdate)
      alert("trying to refresh page!");
    if (!m_bIsSiteOwner) {
      return;
    }
    const breakRequestPermissionsTask = addTask(taskDefs.permissionsRequest);
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();
    const currentUser3 = web.get_currentUser();
    const ownerGroup2 = web.get_associatedOwnerGroup();
    const memberGroup2 = web.get_associatedMemberGroup();
    const visitorGroup2 = web.get_associatedVisitorGroup();
    var qaHasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
      oListItem,
      Audit.Common.Utilities.GetGroupNameQA(),
      SP.PermissionKind.viewListItems
    );
    var special1HasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
      oListItem,
      Audit.Common.Utilities.GetGroupNameSpecialPerm1(),
      SP.PermissionKind.viewListItems
    );
    var special2HasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
      oListItem,
      Audit.Common.Utilities.GetGroupNameSpecialPerm2(),
      SP.PermissionKind.viewListItems
    );
    oListItem.resetRoleInheritance();
    oListItem.breakRoleInheritance(false, false);
    var roleDefBindingCollAdmin = SP.RoleDefinitionBindingCollection.newObject(currCtx);
    roleDefBindingCollAdmin.add(
      web.get_roleDefinitions().getByType(SP.RoleType.administrator)
    );
    var roleDefBindingCollContribute = SP.RoleDefinitionBindingCollection.newObject(currCtx);
    roleDefBindingCollContribute.add(
      web.get_roleDefinitions().getByType(SP.RoleType.contributor)
    );
    var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject(currCtx);
    roleDefBindingCollRestrictedRead.add(
      web.get_roleDefinitions().getByName("Restricted Read")
    );
    var roleDefBindingCollRestrictedContribute = SP.RoleDefinitionBindingCollection.newObject(currCtx);
    roleDefBindingCollRestrictedContribute.add(
      web.get_roleDefinitions().getByName("Restricted Contribute")
    );
    oListItem.get_roleAssignments().add(ownerGroup2, roleDefBindingCollAdmin);
    oListItem.get_roleAssignments().add(memberGroup2, roleDefBindingCollContribute);
    oListItem.get_roleAssignments().add(visitorGroup2, roleDefBindingCollRestrictedRead);
    if (qaHasRead || responseStatus == "4-Approved for QA") {
      var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameQA()
      );
      if (spGroupQA != null)
        oListItem.get_roleAssignments().add(spGroupQA, roleDefBindingCollRestrictedRead);
    }
    if (special1HasRead) {
      var group1SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameSpecialPerm1()
      );
      if (group1SpecialPerm != null)
        oListItem.get_roleAssignments().add(group1SpecialPerm, roleDefBindingCollRestrictedRead);
    }
    if (special2HasRead) {
      var group2SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameSpecialPerm2()
      );
      if (group2SpecialPerm != null)
        oListItem.get_roleAssignments().add(group2SpecialPerm, roleDefBindingCollRestrictedRead);
    }
    oListItem.get_roleAssignments().getByPrincipal(currentUser3).deleteObject();
    await new Promise((resolve, reject2) => {
      function onUpdateReqPermsSucceeed() {
        let m_CntRequestAOsToAdd = 0;
        let m_CntRequestAOsAdded = 0;
        var arrActionOffice = oListItem.get_item("ActionOffice");
        if (arrActionOffice != null && arrActionOffice.length > 0) {
          for (var x = 0; x < arrActionOffice.length; x++) {
            var actionOfficeName = arrActionOffice[x].get_lookupValue();
            var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName(actionOfficeName);
            var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup(
              actionOfficeGroupName
            );
            if (actionOfficeGroup != null) {
              let onUpdatedReqAOSucceeded = function() {
                m_CntRequestAOsAdded++;
                if (m_CntRequestAOsAdded == m_CntRequestAOsToAdd) {
                  resolve(true);
                }
              }, onUpdatedReqAOFailed = function(sender, args) {
                m_CntRequestAOsAdded++;
                if (m_CntRequestAOsAdded == m_CntRequestAOsToAdd) {
                  resolve(true);
                }
              };
              m_CntRequestAOsToAdd++;
              var currCtx2 = new SP.ClientContext.get_current();
              var web2 = currCtx2.get_web();
              var roleDefBindingCollRestrictedRead2 = SP.RoleDefinitionBindingCollection.newObject(currCtx2);
              roleDefBindingCollRestrictedRead2.add(
                web2.get_roleDefinitions().getByName("Restricted Read")
              );
              this.oListItem.get_roleAssignments().add(actionOfficeGroup, roleDefBindingCollRestrictedRead2);
              var data3 = {
                refreshPage: this.refreshPage,
                resolve
              };
              currCtx2.executeQueryAsync(
                Function.createDelegate(data3, onUpdatedReqAOSucceeded),
                Function.createDelegate(data3, onUpdatedReqAOFailed)
              );
            }
          }
        } else {
          resolve(true);
        }
      }
      function onUpdateReqPermsFailed(sender, args) {
        SP.UI.Notify.addNotification(
          "Failed to update permissions on Request: " + this.title + args.get_message() + "\n" + args.get_stackTrace(),
          false
        );
        this.reject(sender, args);
      }
      var data2 = {
        title: oListItem.get_item("Title"),
        refreshPage: refreshPageOnUpdate,
        oListItem,
        resolve,
        reject: reject2,
        OnComplete
      };
      currCtx.executeQueryAsync(
        Function.createDelegate(data2, onUpdateReqPermsSucceeed),
        Function.createDelegate(data2, onUpdateReqPermsFailed)
      );
    });
    finishTask(breakRequestPermissionsTask);
  }
  var m_cntAOToAddToEmailFolder = 0;
  var m_cntAOAddedToEmailFolder = 0;
  async function m_fnBreakEmailFolderPermissions(oListItem, oRequestItem, refreshPageOnUpdate, OnComplete) {
    const breakEmailFolderPermissionsTask = addTask(
      taskDefs.permissionsEmailFolder
    );
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();
    const currentUser3 = web.get_currentUser();
    const ownerGroup2 = web.get_associatedOwnerGroup();
    const memberGroup2 = web.get_associatedMemberGroup();
    const visitorGroup2 = web.get_associatedVisitorGroup();
    oListItem.resetRoleInheritance();
    oListItem.breakRoleInheritance(false, false);
    var roleDefBindingCollAdmin = SP.RoleDefinitionBindingCollection.newObject(currCtx);
    roleDefBindingCollAdmin.add(
      web.get_roleDefinitions().getByType(SP.RoleType.administrator)
    );
    var roleDefBindingCollContribute = SP.RoleDefinitionBindingCollection.newObject(currCtx);
    roleDefBindingCollContribute.add(
      web.get_roleDefinitions().getByType(SP.RoleType.contributor)
    );
    var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject(currCtx);
    roleDefBindingCollRestrictedRead.add(
      web.get_roleDefinitions().getByName("Restricted Read")
    );
    var roleDefBindingCollRestrictedContribute = SP.RoleDefinitionBindingCollection.newObject(currCtx);
    roleDefBindingCollRestrictedContribute.add(
      web.get_roleDefinitions().getByName("Restricted Contribute")
    );
    oListItem.get_roleAssignments().add(ownerGroup2, roleDefBindingCollAdmin);
    oListItem.get_roleAssignments().add(memberGroup2, roleDefBindingCollContribute);
    oListItem.get_roleAssignments().add(visitorGroup2, roleDefBindingCollRestrictedRead);
    var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup(
      Audit.Common.Utilities.GetGroupNameQA()
    );
    if (spGroupQA != null)
      oListItem.get_roleAssignments().add(spGroupQA, roleDefBindingCollRestrictedContribute);
    oListItem.get_roleAssignments().getByPrincipal(currentUser3).deleteObject();
    await new Promise((resolve, reject2) => {
      function onUpdateEmailFolderPermsSucceeed() {
        if (!this.oRequestItem)
          resolve();
        var arrActionOffice = this.oRequestItem.get_item("ActionOffice");
        if (arrActionOffice != null && arrActionOffice.length > 0) {
          for (var x = 0; x < arrActionOffice.length; x++) {
            var actionOfficeName = arrActionOffice[x].get_lookupValue();
            var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName(actionOfficeName);
            var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup(
              actionOfficeGroupName
            );
            if (actionOfficeGroup != null) {
              let onAOAddedToEmailFolderSucceeded = function() {
                m_cntAOAddedToEmailFolder++;
                if (m_cntAOAddedToEmailFolder == m_cntAOToAddToEmailFolder) {
                  resolve();
                }
              }, onAOAddedToEmailFolderFailed = function(sender, args) {
                m_cntAOAddedToEmailFolder++;
                if (m_cntAOAddedToEmailFolder == m_cntAOToAddToEmailFolder) {
                  reject2({ sender, args });
                }
              };
              m_cntAOToAddToEmailFolder++;
              var currCtx2 = new SP.ClientContext.get_current();
              var web2 = currCtx.get_web();
              var roleDefBindingCollRestrictedContribute2 = SP.RoleDefinitionBindingCollection.newObject(currCtx2);
              roleDefBindingCollRestrictedContribute2.add(
                web2.get_roleDefinitions().getByName("Restricted Contribute")
              );
              this.oListItem.get_roleAssignments().add(actionOfficeGroup, roleDefBindingCollRestrictedContribute2);
              var data3 = {
                refreshPage: this.refreshPage,
                OnComplete: this.OnComplete
              };
              currCtx2.executeQueryAsync(
                Function.createDelegate(data3, onAOAddedToEmailFolderSucceeded),
                Function.createDelegate(data3, onAOAddedToEmailFolderFailed)
              );
            }
          }
        }
      }
      function onUpdateEmailFolderPermsFailed(sender, args) {
        reject2({ sender, args });
      }
      var data2 = {
        title: oListItem.get_item("Title"),
        refreshPage: refreshPageOnUpdate,
        oListItem,
        oRequestItem,
        OnComplete
      };
      currCtx.executeQueryAsync(
        Function.createDelegate(data2, onUpdateEmailFolderPermsSucceeed),
        Function.createDelegate(data2, onUpdateEmailFolderPermsFailed)
      );
    });
    finishTask(breakEmailFolderPermissionsTask);
  }
  var m_countCSToAdd = 0;
  var m_countCSAdded = 0;
  var oCntCSAOAdd = new Object();
  async function m_fnBreakCoversheetPermissions(oListItem, grantQARead) {
    if (oListItem == null)
      return;
    const breakCoversheetPermissionsTask = addTask(
      taskDefs.permissionsCoversheet
    );
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();
    var currentUser3 = currCtx.get_web().get_currentUser();
    var ownerGroup2 = web.get_associatedOwnerGroup();
    var memberGroup2 = web.get_associatedMemberGroup();
    var visitorGroup2 = web.get_associatedVisitorGroup();
    var qaHasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
      oListItem,
      Audit.Common.Utilities.GetGroupNameQA(),
      SP.PermissionKind.viewListItems
    );
    var special1HasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
      oListItem,
      Audit.Common.Utilities.GetGroupNameSpecialPerm1(),
      SP.PermissionKind.viewListItems
    );
    var special2HasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
      oListItem,
      Audit.Common.Utilities.GetGroupNameSpecialPerm2(),
      SP.PermissionKind.viewListItems
    );
    if (!oListItem.get_hasUniqueRoleAssignments()) {
      qaHasRead = false;
      special1HasRead = false;
      special2HasRead = false;
    }
    oListItem.resetRoleInheritance();
    oListItem.breakRoleInheritance(false, false);
    var roleDefBindingCollAdmin = SP.RoleDefinitionBindingCollection.newObject(currCtx);
    roleDefBindingCollAdmin.add(
      currCtx.get_web().get_roleDefinitions().getByType(SP.RoleType.administrator)
    );
    var roleDefBindingCollContribute = SP.RoleDefinitionBindingCollection.newObject(currCtx);
    roleDefBindingCollContribute.add(
      currCtx.get_web().get_roleDefinitions().getByType(SP.RoleType.contributor)
    );
    var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject(currCtx);
    roleDefBindingCollRestrictedRead.add(
      currCtx.get_web().get_roleDefinitions().getByName("Restricted Read")
    );
    var roleDefBindingCollRestrictedContribute = SP.RoleDefinitionBindingCollection.newObject(currCtx);
    roleDefBindingCollRestrictedContribute.add(
      currCtx.get_web().get_roleDefinitions().getByName("Restricted Contribute")
    );
    oListItem.get_roleAssignments().add(ownerGroup2, roleDefBindingCollAdmin);
    oListItem.get_roleAssignments().add(memberGroup2, roleDefBindingCollContribute);
    oListItem.get_roleAssignments().add(visitorGroup2, roleDefBindingCollRestrictedRead);
    if (qaHasRead || grantQARead) {
      var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameQA()
      );
      if (spGroupQA != null)
        oListItem.get_roleAssignments().add(spGroupQA, roleDefBindingCollRestrictedRead);
    }
    if (special1HasRead) {
      var group1SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameSpecialPerm1()
      );
      if (group1SpecialPerm != null)
        oListItem.get_roleAssignments().add(group1SpecialPerm, roleDefBindingCollRestrictedRead);
    }
    if (special2HasRead) {
      var group2SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameSpecialPerm2()
      );
      if (group2SpecialPerm != null)
        oListItem.get_roleAssignments().add(group2SpecialPerm, roleDefBindingCollRestrictedRead);
    }
    oListItem.get_roleAssignments().getByPrincipal(currentUser3).deleteObject();
    await new Promise((resolve, reject2) => {
      async function onUpdatedCSSucceeded() {
        var currCtx2 = new SP.ClientContext.get_current();
        var roleDefBindingCollRestrictedRead2 = SP.RoleDefinitionBindingCollection.newObject(currCtx2);
        roleDefBindingCollRestrictedRead2.add(
          currCtx2.get_web().get_roleDefinitions().getByName("Restricted Read")
        );
        var arrActionOffice = this.oListItem.get_item("ActionOffice");
        if (arrActionOffice == null || arrActionOffice.length == 0) {
          resolve();
        }
        await Promise.all(
          arrActionOffice.map((oActionOffice) => {
            var actionOfficeName = oActionOffice.get_lookupValue();
            var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName(actionOfficeName);
            var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup(
              actionOfficeGroupName
            );
            return actionOfficeGroup;
          }).filter((actionOfficeGroupName) => actionOfficeGroupName != null).map((actionOfficeGroup) => {
            var roleDefBindingCollRestrictedRead3 = SP.RoleDefinitionBindingCollection.newObject(currCtx2);
            roleDefBindingCollRestrictedRead3.add(
              currCtx2.get_web().get_roleDefinitions().getByName("Restricted Read")
            );
            this.oListItem.get_roleAssignments().add(actionOfficeGroup, roleDefBindingCollRestrictedRead3);
            return new Promise((resolve2, reject22) => {
              currCtx2.executeQueryAsync(resolve2, reject22);
            });
          })
        );
        resolve(true);
      }
      function onUpdatedCSFailed(sender, args) {
        SP.UI.Notify.addNotification(
          "Failed to update permissions on Coversheet" + args.get_message() + "\n" + args.get_stackTrace(),
          false
        );
        resolve(true);
      }
      var data2 = {
        oListItem
      };
      currCtx.executeQueryAsync(
        Function.createDelegate(data2, onUpdatedCSSucceeded),
        Function.createDelegate(data2, onUpdatedCSFailed)
      );
    });
    finishTask(breakCoversheetPermissionsTask);
  }
  async function m_fnBreakCoversheetPermissionsOnSpecialPerms(currCtx, oListItem, addSpecialPerms, refreshPageOnUpdate, OnComplete) {
    if (oListItem == null)
      return;
    const breakCoversheetPermissionsTask = addTask(
      taskDefs.permissionsCoversheet
    );
    var web = currCtx.get_web();
    const currentUser3 = currCtx.get_web().get_currentUser();
    const ownerGroup2 = web.get_associatedOwnerGroup();
    const memberGroup2 = web.get_associatedMemberGroup();
    const visitorGroup2 = web.get_associatedVisitorGroup();
    oListItem.resetRoleInheritance();
    oListItem.breakRoleInheritance(false, false);
    var qaHasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
      oListItem,
      Audit.Common.Utilities.GetGroupNameQA(),
      SP.PermissionKind.viewListItems
    );
    var roleDefBindingCollAdmin = SP.RoleDefinitionBindingCollection.newObject(currCtx);
    roleDefBindingCollAdmin.add(
      currCtx.get_web().get_roleDefinitions().getByType(SP.RoleType.administrator)
    );
    var roleDefBindingCollContribute = SP.RoleDefinitionBindingCollection.newObject(currCtx);
    roleDefBindingCollContribute.add(
      currCtx.get_web().get_roleDefinitions().getByType(SP.RoleType.contributor)
    );
    var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject(currCtx);
    roleDefBindingCollRestrictedRead.add(
      currCtx.get_web().get_roleDefinitions().getByName("Restricted Read")
    );
    var roleDefBindingCollRestrictedContribute = SP.RoleDefinitionBindingCollection.newObject(currCtx);
    roleDefBindingCollRestrictedContribute.add(
      currCtx.get_web().get_roleDefinitions().getByName("Restricted Contribute")
    );
    oListItem.get_roleAssignments().add(ownerGroup2, roleDefBindingCollAdmin);
    oListItem.get_roleAssignments().add(memberGroup2, roleDefBindingCollContribute);
    oListItem.get_roleAssignments().add(visitorGroup2, roleDefBindingCollRestrictedRead);
    if (qaHasRead) {
      var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameQA()
      );
      if (spGroupQA != null)
        oListItem.get_roleAssignments().add(spGroupQA, roleDefBindingCollRestrictedRead);
    }
    if (addSpecialPerms) {
      var group1SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameSpecialPerm1()
      );
      if (group1SpecialPerm != null)
        oListItem.get_roleAssignments().add(group1SpecialPerm, roleDefBindingCollRestrictedRead);
      var group2SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameSpecialPerm2()
      );
      if (group2SpecialPerm != null)
        oListItem.get_roleAssignments().add(group2SpecialPerm, roleDefBindingCollRestrictedRead);
    }
    oListItem.get_roleAssignments().getByPrincipal(currentUser3).deleteObject();
    await new Promise((resolve, reject2) => {
      currCtx.executeQueryAsync(
        resolve,
        (sender, args) => reject2({ sender, args })
      );
    }).catch((e) => {
      return;
    });
    var currCtx2 = new SP.ClientContext.get_current();
    var arrActionOffice = this.oListItem.get_item("ActionOffice");
    if (arrActionOffice == null || arrActionOffice.length == 0) {
      if (this.OnComplete)
        this.OnComplete(true);
      return;
    }
    var csID = this.oListItem.get_item("ID");
    oCntCSAOAdd[csID + "toAdd"] = 0;
    oCntCSAOAdd[csID + "added"] = 0;
    for (var x = 0; x < arrActionOffice.length; x++) {
      var actionOfficeName = arrActionOffice[x].get_lookupValue();
      var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName(actionOfficeName);
      var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup(
        actionOfficeGroupName
      );
      if (actionOfficeGroup != null) {
        oCntCSAOAdd[csID + "toAdd"] = oCntCSAOAdd[csID + "toAdd"] + 1;
        var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject(currCtx2);
        roleDefBindingCollRestrictedRead.add(
          currCtx2.get_web().get_roleDefinitions().getByName("Restricted Read")
        );
        this.oListItem.get_roleAssignments().add(actionOfficeGroup, roleDefBindingCollRestrictedRead);
        await new Promise((resolve, reject2) => {
          currCtx2.executeQueryAsync(resolve, reject2);
        }).catch((e) => {
          console.error("Error setting special perms: ", actionOfficeGroupName);
        });
      }
    }
    finishTask(breakCoversheetPermissionsTask);
  }
  async function m_fnBreakResponseAndFolderPermissions(requestStatus, oResponse, refreshPageOnUpdate = false, checkStatus = false, bForceGrantSP = false, bForceRemoveSP = false) {
    if (!m_bIsSiteOwner) {
      return;
    }
    const breakResponsePermissionsTask = addTask(
      taskDefs.permissionsResponseAndFolder(oResponse.title)
    );
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();
    const currentUser3 = currCtx.get_web().get_currentUser();
    const ownerGroup2 = web.get_associatedOwnerGroup();
    const memberGroup2 = web.get_associatedMemberGroup();
    const visitorGroup2 = web.get_associatedVisitorGroup();
    var qaHasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
      oResponse.item,
      Audit.Common.Utilities.GetGroupNameQA(),
      SP.PermissionKind.viewListItems
    );
    var special1HasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
      oResponse.item,
      Audit.Common.Utilities.GetGroupNameSpecialPerm1(),
      SP.PermissionKind.viewListItems
    );
    var special2HasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
      oResponse.item,
      Audit.Common.Utilities.GetGroupNameSpecialPerm2(),
      SP.PermissionKind.viewListItems
    );
    if (!oResponse.item.get_hasUniqueRoleAssignments()) {
      qaHasRead = false;
      special1HasRead = false;
      special2HasRead = false;
    }
    if (bForceGrantSP) {
      special1HasRead = true;
      special2HasRead = true;
    } else if (bForceRemoveSP) {
      special1HasRead = false;
      special2HasRead = false;
    }
    oResponse.item.resetRoleInheritance();
    oResponse.item.breakRoleInheritance(false, false);
    if (oResponse.responseFolderItem) {
      oResponse.responseFolderItem.resetRoleInheritance();
      oResponse.responseFolderItem.breakRoleInheritance(false, false);
    }
    var roleDefBindingCollAdmin = SP.RoleDefinitionBindingCollection.newObject(currCtx);
    roleDefBindingCollAdmin.add(
      currCtx.get_web().get_roleDefinitions().getByType(SP.RoleType.administrator)
    );
    var roleDefBindingCollContribute = SP.RoleDefinitionBindingCollection.newObject(currCtx);
    roleDefBindingCollContribute.add(
      currCtx.get_web().get_roleDefinitions().getByType(SP.RoleType.contributor)
    );
    var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject(currCtx);
    roleDefBindingCollRestrictedRead.add(
      currCtx.get_web().get_roleDefinitions().getByName("Restricted Read")
    );
    var roleDefBindingCollRestrictedContribute = SP.RoleDefinitionBindingCollection.newObject(currCtx);
    roleDefBindingCollRestrictedContribute.add(
      currCtx.get_web().get_roleDefinitions().getByName("Restricted Contribute")
    );
    oResponse.item.get_roleAssignments().add(ownerGroup2, roleDefBindingCollAdmin);
    oResponse.item.get_roleAssignments().add(memberGroup2, roleDefBindingCollContribute);
    oResponse.item.get_roleAssignments().add(visitorGroup2, roleDefBindingCollRestrictedRead);
    if (oResponse.responseFolderItem) {
      oResponse.responseFolderItem.get_roleAssignments().add(ownerGroup2, roleDefBindingCollAdmin);
      oResponse.responseFolderItem.get_roleAssignments().add(memberGroup2, roleDefBindingCollContribute);
      oResponse.responseFolderItem.get_roleAssignments().add(visitorGroup2, roleDefBindingCollRestrictedRead);
    }
    if (qaHasRead || oResponse.item.get_item("ResStatus") == "4-Approved for QA" || oResponse.item.get_item("ResStatus") == "6-Reposted After Rejection") {
      var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameQA()
      );
      if (spGroupQA != null) {
        if (checkStatus && (oResponse.item.get_item("ResStatus") == "4-Approved for QA" || oResponse.item.get_item("ResStatus") == "6-Reposted After Rejection") && (requestStatus == "Open" || requestStatus == "ReOpened")) {
          oResponse.item.get_roleAssignments().add(spGroupQA, roleDefBindingCollRestrictedContribute);
          if (oResponse.responseFolderItem) {
            oResponse.responseFolderItem.get_roleAssignments().add(spGroupQA, roleDefBindingCollRestrictedContribute);
          }
        } else {
          oResponse.item.get_roleAssignments().add(spGroupQA, roleDefBindingCollRestrictedRead);
          if (oResponse.responseFolderItem) {
            oResponse.responseFolderItem.get_roleAssignments().add(spGroupQA, roleDefBindingCollRestrictedRead);
          }
        }
      }
    }
    if (special1HasRead && (oResponse.item.get_item("ResStatus") == "4-Approved for QA" || oResponse.item.get_item("ResStatus") == "6-Reposted After Rejection" || oResponse.item.get_item("ResStatus") == "7-Closed")) {
      var group1SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameSpecialPerm1()
      );
      if (group1SpecialPerm != null) {
        oResponse.item.get_roleAssignments().add(group1SpecialPerm, roleDefBindingCollRestrictedRead);
        if (oResponse.responseFolderItem) {
          oResponse.responseFolderItem.get_roleAssignments().add(group1SpecialPerm, roleDefBindingCollRestrictedRead);
        }
      }
    }
    if (special2HasRead && (oResponse.item.get_item("ResStatus") == "4-Approved for QA" || oResponse.item.get_item("ResStatus") == "6-Reposted After Rejection" || oResponse.item.get_item("ResStatus") == "7-Closed")) {
      var group2SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameSpecialPerm2()
      );
      if (group2SpecialPerm != null) {
        oResponse.item.get_roleAssignments().add(group2SpecialPerm, roleDefBindingCollRestrictedRead);
        if (oResponse.responseFolderItem) {
          oResponse.responseFolderItem.get_roleAssignments().add(group2SpecialPerm, roleDefBindingCollRestrictedRead);
        }
      }
    }
    var actionOffice = oResponse.item.get_item("ActionOffice");
    if (actionOffice != null) {
      var actionOfficeName = actionOffice.get_lookupValue();
      var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName(actionOfficeName);
      var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup(
        actionOfficeGroupName
      );
      if (actionOfficeGroup != null) {
        if (checkStatus && (oResponse.item.get_item("ResStatus") == "1-Open" || oResponse.item.get_item("ResStatus") == "3-Returned to Action Office") && (requestStatus == "Open" || requestStatus == "ReOpened")) {
          oResponse.item.get_roleAssignments().add(actionOfficeGroup, roleDefBindingCollRestrictedContribute);
          if (oResponse.responseFolderItem)
            oResponse.responseFolderItem.get_roleAssignments().add(actionOfficeGroup, roleDefBindingCollRestrictedContribute);
        } else {
          oResponse.item.get_roleAssignments().add(actionOfficeGroup, roleDefBindingCollRestrictedRead);
          if (oResponse.responseFolderItem) {
            oResponse.responseFolderItem.get_roleAssignments().add(actionOfficeGroup, roleDefBindingCollRestrictedRead);
          }
        }
      }
    }
    oResponse.item.get_roleAssignments().getByPrincipal(currentUser3).deleteObject();
    if (oResponse.responseFolderItem)
      oResponse.responseFolderItem.get_roleAssignments().getByPrincipal(currentUser3).deleteObject();
    await new Promise((resolve, reject2) => {
      currCtx.executeQueryAsync(resolve, (sender, args) => {
        SP.UI.Notify.addNotification(
          "Failed to update permissions on Response: " + oResponse.item.get_item("Title") + args.get_message() + "\n" + args.get_stackTrace(),
          false
        );
        reject2({ sender, args });
      });
    });
    finishTask(breakResponsePermissionsTask);
  }
  async function m_fnBreakResponsePermissions(oListItem, refreshPageOnUpdate, checkStatus) {
    if (!m_bIsSiteOwner) {
      return;
    }
    const breakResponsePermissionsTask = addTask(
      taskDefs.permissionsResponse(oListItem.get_item("Title"))
    );
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();
    const currentUser3 = currCtx.get_web().get_currentUser();
    const ownerGroup2 = web.get_associatedOwnerGroup();
    const memberGroup2 = web.get_associatedMemberGroup();
    const visitorGroup2 = web.get_associatedVisitorGroup();
    var permissionsToCheck = SP.PermissionKind.viewListItems;
    var qaHasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
      oListItem,
      Audit.Common.Utilities.GetGroupNameQA(),
      permissionsToCheck
    );
    var special1HasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
      oListItem,
      Audit.Common.Utilities.GetGroupNameSpecialPerm1(),
      SP.PermissionKind.viewListItems
    );
    var special2HasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
      oListItem,
      Audit.Common.Utilities.GetGroupNameSpecialPerm2(),
      SP.PermissionKind.viewListItems
    );
    if (!oListItem.get_hasUniqueRoleAssignments()) {
      qaHasRead = false;
      special1HasRead = false;
      special2HasRead = false;
    }
    oListItem.resetRoleInheritance();
    oListItem.breakRoleInheritance(false, false);
    var roleDefBindingCollAdmin = SP.RoleDefinitionBindingCollection.newObject(currCtx);
    roleDefBindingCollAdmin.add(
      currCtx.get_web().get_roleDefinitions().getByType(SP.RoleType.administrator)
    );
    var roleDefBindingCollContribute = SP.RoleDefinitionBindingCollection.newObject(currCtx);
    roleDefBindingCollContribute.add(
      currCtx.get_web().get_roleDefinitions().getByType(SP.RoleType.contributor)
    );
    var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject(currCtx);
    roleDefBindingCollRestrictedRead.add(
      currCtx.get_web().get_roleDefinitions().getByName("Restricted Read")
    );
    var roleDefBindingCollRestrictedContribute = SP.RoleDefinitionBindingCollection.newObject(currCtx);
    roleDefBindingCollRestrictedContribute.add(
      currCtx.get_web().get_roleDefinitions().getByName("Restricted Contribute")
    );
    oListItem.get_roleAssignments().add(ownerGroup2, roleDefBindingCollAdmin);
    oListItem.get_roleAssignments().add(memberGroup2, roleDefBindingCollContribute);
    oListItem.get_roleAssignments().add(visitorGroup2, roleDefBindingCollRestrictedRead);
    var actionOffice = oListItem.get_item("ActionOffice");
    if (actionOffice != null) {
      var actionOfficeName = actionOffice.get_lookupValue();
      var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName(actionOfficeName);
      var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup(
        actionOfficeGroupName
      );
      if (actionOfficeGroup != null) {
        if (checkStatus && (oListItem.get_item("ResStatus") == "1-Open" || oListItem.get_item("ResStatus") == "3-Returned to Action Office"))
          oListItem.get_roleAssignments().add(actionOfficeGroup, roleDefBindingCollRestrictedContribute);
        else
          oListItem.get_roleAssignments().add(actionOfficeGroup, roleDefBindingCollRestrictedRead);
      }
    }
    if (qaHasRead || oListItem.get_item("ResStatus") == "4-Approved for QA" || oListItem.get_item("ResStatus") == "6-Reposted After Rejection") {
      var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameQA()
      );
      if (spGroupQA != null) {
        if ((oListItem.get_item("ResStatus") == "4-Approved for QA" || oListItem.get_item("ResStatus") == "6-Reposted After Rejection") && checkStatus)
          oListItem.get_roleAssignments().add(spGroupQA, roleDefBindingCollRestrictedContribute);
        else
          oListItem.get_roleAssignments().add(spGroupQA, roleDefBindingCollRestrictedRead);
      }
    }
    if (special1HasRead && (oListItem.get_item("ResStatus") == "4-Approved for QA" || oListItem.get_item("ResStatus") == "6-Reposted After Rejection" || oListItem.get_item("ResStatus") == "7-Closed")) {
      var group1SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameSpecialPerm1()
      );
      if (group1SpecialPerm != null)
        oListItem.get_roleAssignments().add(group1SpecialPerm, roleDefBindingCollRestrictedRead);
    }
    if (special2HasRead && (oListItem.get_item("ResStatus") == "4-Approved for QA" || oListItem.get_item("ResStatus") == "6-Reposted After Rejection" || oListItem.get_item("ResStatus") == "7-Closed")) {
      var group2SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameSpecialPerm2()
      );
      if (group2SpecialPerm != null)
        oListItem.get_roleAssignments().add(group2SpecialPerm, roleDefBindingCollRestrictedRead);
    }
    oListItem.get_roleAssignments().getByPrincipal(currentUser3).deleteObject();
    await new Promise(
      (resolve, reject2) => currCtx.executeQueryAsync(
        resolve,
        (sender, args) => reject2({ sender, args })
      )
    ).catch((e) => {
      console.error("Failed to update permissions on response: ", oListItem);
    });
    if (refreshPageOnUpdate)
      m_fnRefreshData();
    finishTask(breakResponsePermissionsTask);
  }
  async function m_fnBreakResponseFolderPermissions(oListItemFolder, oListItemResponse, refreshPageOnUpdate, bCheckStatus, OnComplete) {
    if (!m_bIsSiteOwner) {
      return;
    }
    const breakResponsePermissionsTask = addTask(
      taskDefs.permissionsResponseFolder(oListItemResponse.get_item("Title"))
    );
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();
    const currentUser3 = currCtx.get_web().get_currentUser();
    const ownerGroup2 = web.get_associatedOwnerGroup();
    const memberGroup2 = web.get_associatedMemberGroup();
    const visitorGroup2 = web.get_associatedVisitorGroup();
    var qaHasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
      oListItemFolder,
      Audit.Common.Utilities.GetGroupNameQA(),
      SP.PermissionKind.viewListItems
    );
    var special1HasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
      oListItemFolder,
      Audit.Common.Utilities.GetGroupNameSpecialPerm1(),
      SP.PermissionKind.viewListItems
    );
    var special2HasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
      oListItemFolder,
      Audit.Common.Utilities.GetGroupNameSpecialPerm2(),
      SP.PermissionKind.viewListItems
    );
    if (!oListItemFolder.get_hasUniqueRoleAssignments()) {
      qaHasRead = false;
      special1HasRead = false;
      special2HasRead = false;
    }
    oListItemFolder.resetRoleInheritance();
    oListItemFolder.breakRoleInheritance(false, false);
    var roleDefBindingCollAdmin = SP.RoleDefinitionBindingCollection.newObject(currCtx);
    roleDefBindingCollAdmin.add(
      currCtx.get_web().get_roleDefinitions().getByType(SP.RoleType.administrator)
    );
    var roleDefBindingCollContribute = SP.RoleDefinitionBindingCollection.newObject(currCtx);
    roleDefBindingCollContribute.add(
      currCtx.get_web().get_roleDefinitions().getByType(SP.RoleType.contributor)
    );
    var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject(currCtx);
    roleDefBindingCollRestrictedRead.add(
      currCtx.get_web().get_roleDefinitions().getByName("Restricted Read")
    );
    var roleDefBindingCollRestrictedContribute = SP.RoleDefinitionBindingCollection.newObject(currCtx);
    roleDefBindingCollRestrictedContribute.add(
      currCtx.get_web().get_roleDefinitions().getByName("Restricted Contribute")
    );
    oListItemFolder.get_roleAssignments().add(ownerGroup2, roleDefBindingCollAdmin);
    oListItemFolder.get_roleAssignments().add(memberGroup2, roleDefBindingCollContribute);
    oListItemFolder.get_roleAssignments().add(visitorGroup2, roleDefBindingCollRestrictedRead);
    var actionOffice = oListItemResponse.get_item("ActionOffice");
    if (actionOffice != null) {
      var actionOfficeName = actionOffice.get_lookupValue();
      var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName(actionOfficeName);
      var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup(
        actionOfficeGroupName
      );
      if (actionOfficeGroup != null) {
        if (bCheckStatus && (oListItemResponse.get_item("ResStatus") == "1-Open" || oListItemResponse.get_item("ResStatus") == "3-Returned to Action Office"))
          oListItemFolder.get_roleAssignments().add(actionOfficeGroup, roleDefBindingCollRestrictedContribute);
        else
          oListItemFolder.get_roleAssignments().add(actionOfficeGroup, roleDefBindingCollRestrictedRead);
      }
    }
    if (qaHasRead || oListItemResponse.get_item("ResStatus") == "4-Approved for QA" || oListItemResponse.get_item("ResStatus") == "6-Reposted After Rejection") {
      var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameQA()
      );
      if (spGroupQA != null) {
        if (bCheckStatus && (oListItemResponse.get_item("ResStatus") == "4-Approved for QA" || oListItemResponse.get_item("ResStatus") == "6-Reposted After Rejection"))
          oListItemFolder.get_roleAssignments().add(spGroupQA, roleDefBindingCollRestrictedContribute);
        else
          oListItemFolder.get_roleAssignments().add(spGroupQA, roleDefBindingCollRestrictedRead);
      }
    }
    if (special1HasRead && (oListItemResponse.get_item("ResStatus") == "4-Approved for QA" || oListItemResponse.get_item("ResStatus") == "6-Reposted After Rejection" || oListItemResponse.get_item("ResStatus") == "7-Closed")) {
      var group1SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameSpecialPerm1()
      );
      if (group1SpecialPerm != null)
        oListItemFolder.get_roleAssignments().add(group1SpecialPerm, roleDefBindingCollRestrictedRead);
    }
    if (special2HasRead && (oListItemResponse.get_item("ResStatus") == "4-Approved for QA" || oListItemResponse.get_item("ResStatus") == "6-Reposted After Rejection" || oListItemResponse.get_item("ResStatus") == "7-Closed")) {
      var group2SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameSpecialPerm2()
      );
      if (group2SpecialPerm != null)
        oListItemFolder.get_roleAssignments().add(group2SpecialPerm, roleDefBindingCollRestrictedRead);
    }
    oListItemFolder.get_roleAssignments().getByPrincipal(currentUser3).deleteObject();
    await executeQuery(currCtx).catch(
      (e) => console.error(
        "Failed to update permissions on Response Folder: ",
        oListItemResponse.get_item("Title")
      )
    );
    finishTask(breakResponsePermissionsTask);
  }
  var m_countAOSPToAdd = 0;
  var m_countAOSPAdded = 0;
  function m_fnGrantAOSpecialPermsOnRequest(oRequest, OnComplete) {
    if (oRequest == null) {
      if (OnComplete)
        OnComplete(true);
      return;
    }
    m_countAOSPToAdd = 0;
    m_countAOSPAdded = 0;
    var arrActionOffice = oRequest.item.get_item("ActionOffice");
    if (arrActionOffice == null || arrActionOffice.length == 0) {
      if (this.OnComplete)
        this.OnComplete(true);
      return;
    }
    for (var x = 0; x < arrActionOffice.length; x++) {
      var actionOfficeName = arrActionOffice[x].get_lookupValue();
      var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName(actionOfficeName);
      var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup(
        actionOfficeGroupName
      );
      if (actionOfficeGroup != null) {
        let onGrantAOSpecialPermsSucceeded = function() {
          m_countAOSPAdded++;
          $("#divGrantCntr").text(
            "Ensured " + m_countAOSPAdded + " of " + m_countAOSPToAdd + " Action Offices have permissions to Request"
          );
          if (m_countAOSPAdded == m_countAOSPToAdd) {
            if (this.OnComplete)
              this.OnComplete(true);
          }
        }, onGrantAOSpecialPermsFailed = function(sender, args) {
          m_countAOSPAdded++;
          $("#divGrantCntr").text(
            "Ensured " + m_countAOSPAdded + " of " + m_countAOSPToAdd + " Action Offices have permissions to Request"
          );
          if (m_countAOSPAdded == m_countAOSPToAdd) {
            if (this.OnComplete)
              this.OnComplete(true);
          }
        };
        m_countAOSPToAdd++;
        var currCtx2 = new SP.ClientContext.get_current();
        var web = currCtx2.get_web();
        var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject(currCtx2);
        roleDefBindingCollRestrictedRead.add(
          currCtx2.get_web().get_roleDefinitions().getByName("Restricted Read")
        );
        oRequest.item.get_roleAssignments().add(actionOfficeGroup, roleDefBindingCollRestrictedRead);
        var data2 = { OnComplete };
        currCtx2.executeQueryAsync(
          Function.createDelegate(data2, onGrantAOSpecialPermsSucceeded),
          Function.createDelegate(data2, onGrantAOSpecialPermsFailed)
        );
      }
    }
  }
  function m_fnGrantSpecialPermsOnCS(oRequest, currCtx, addSpecialPerms, OnComplete) {
    m_countCSToAdd = 0;
    m_countCSAdded = 0;
    if (oRequest == null || oRequest.coversheets == null || oRequest.coversheets.length == 0) {
      if (OnComplete)
        OnComplete(true);
      return;
    }
    oCntCSAOAdd = new Object();
    for (var x = 0; x < oRequest.coversheets.length; x++) {
      var coversheetItem = oRequest.coversheets[x].item;
      if (coversheetItem) {
        m_countCSToAdd++;
        var bDoneBreakingCSPermsOnSpecialPerms = false;
        m_fnBreakCoversheetPermissionsOnSpecialPerms(
          currCtx,
          coversheetItem,
          addSpecialPerms,
          false,
          function(bDoneBreakingCSPermsOnSpecialPerms2) {
            if (bDoneBreakingCSPermsOnSpecialPerms2) {
              m_countCSAdded++;
              $("#divGrantCntr").text(
                "Updated " + m_countCSAdded + " of " + m_countCSToAdd + " Coversheet permissions"
              );
            } else {
              m_countCSAdded++;
              $("#divGrantCntr").text(
                "Updated " + m_countCSAdded + " of " + m_countCSToAdd + " Coversheet permissions"
              );
            }
            if (m_countCSAdded == m_countCSToAdd) {
              if (OnComplete)
                OnComplete(true);
            }
          }
        );
      }
    }
  }
  var m_countSPResFolderToAdd = 0;
  var m_countSPResFolderAdded = 0;
  async function m_fnGrantSpecialPermsOnResponseAndFolder(oRequest, addSpecialPerms, OnComplete) {
    if (oRequest == null || oRequest.responses == null || oRequest.responses.length == 0) {
      if (OnComplete)
        OnComplete(true);
      return;
    }
    for (var y = 0; y < oRequest.responses.length; y++) {
      var oResponse = oRequest.responses[y];
      if (oResponse.resStatus == "4-Approved for QA" || oResponse.resStatus == "6-Reposted After Rejection" || oResponse.resStatus == "7-Closed") {
        m_countSPResFolderToAdd++;
        var bBrokeResponseAndFolderPermissions = false;
        var bForceAdd = false;
        var bForceRemove = false;
        if (addSpecialPerms)
          bForceAdd = true;
        else
          bForceRemove = true;
        await m_fnBreakResponseAndFolderPermissions(
          oRequest.status,
          oResponse,
          false,
          true,
          bForceAdd,
          bForceRemove
        );
        m_countSPResFolderAdded++;
        $("#divGrantCntr").text(
          "Updated " + m_countSPResFolderAdded + " of " + m_countSPResFolderToAdd + " Response permissions"
        );
        if (m_countSPResFolderAdded == m_countSPResFolderToAdd) {
          if (OnComplete)
            OnComplete(true);
        }
      }
    }
  }
  function m_fnGrantSpecialPermissions(requestNumber) {
    if (!m_bIsSiteOwner) {
      SP.UI.Notify.addNotification(
        "You do not have access to perform this action...",
        false
      );
      return;
    }
    var oRequest = m_fnGetRequestByNumber(requestNumber);
    if (oRequest == null)
      return;
    m_bIsTransactionExecuting = true;
    var cntGranted = 0;
    var cntToGrant = 0;
    var responseCount = oRequest.responses.length;
    for (var y = 0; y < responseCount; y++) {
      var oResponse = oRequest.responses[y];
      if (oResponse.resStatus == "4-Approved for QA" || oResponse.resStatus == "6-Reposted After Rejection" || oResponse.resStatus == "7-Closed") {
        cntToGrant++;
      }
    }
    if (confirm(
      "Are you sure you would like to grant special permissions on this Request and to (" + cntToGrant + ") Responses?"
    )) {
      let onUpdated1 = function() {
        var bDoneGrantingAOSpecialPerms = false;
        m_fnGrantAOSpecialPermsOnRequest(
          oRequest,
          function(bDoneGrantingAOSpecialPerms2) {
            if (bDoneGrantingAOSpecialPerms2) {
              var bDoneGrantingCSSpecialPerms = false;
              m_fnGrantSpecialPermsOnCS(
                oRequest,
                currCtx,
                true,
                function(bDoneGrantingCSSpecialPerms2) {
                  if (bDoneGrantingCSSpecialPerms2) {
                    var responseCount2 = oRequest.responses.length;
                    if (responseCount2 == 0 || cntToGrant == 0) {
                      currCtx.executeQueryAsync(
                        function() {
                          document.body.style.cursor = "default";
                          notifyId2 = SP.UI.Notify.addNotification(
                            "Completed granting Special Permissions",
                            false
                          );
                          setTimeout(function() {
                            m_waitDialog.close();
                            m_fnRefreshData();
                          }, 200);
                        },
                        function(sender, args) {
                          document.body.style.cursor = "default";
                          notifyId2 = SP.UI.Notify.addNotification(
                            "Request failed1: " + args.get_message() + "\n" + args.get_stackTrace(),
                            false
                          );
                          setTimeout(function() {
                            m_fnRefresh();
                          }, 200);
                        }
                      );
                      return;
                    } else {
                      var bDoneGrantingSpecialPermsOnResponsesAndFolders = false;
                      m_fnGrantSpecialPermsOnResponseAndFolder(
                        oRequest,
                        true,
                        function(bDoneGrantingSpecialPermsOnResponsesAndFolders2) {
                          if (bDoneGrantingSpecialPermsOnResponsesAndFolders2) {
                            document.body.style.cursor = "default";
                            notifyId2 = SP.UI.Notify.addNotification(
                              "Completed granting Special Permissions",
                              false
                            );
                            setTimeout(function() {
                              m_waitDialog();
                              m_fnRefreshData();
                            }, 200);
                          } else {
                            document.body.style.cursor = "default";
                            notifyId2 = SP.UI.Notify.addNotification(
                              "Unable to update all responses and folders",
                              false
                            );
                            setTimeout(function() {
                              m_fnRefresh();
                            }, 200);
                          }
                        }
                      );
                    }
                  }
                }
              );
            }
          }
        );
      }, onFailed1 = function(sender, args) {
      };
      const m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
        "Information",
        "Please wait... granting Special Permissions to Request and Responses <div id='divGrantCntr'></div>",
        200,
        600
      );
      var group1SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameSpecialPerm1()
      );
      var group2SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameSpecialPerm2()
      );
      var currCtx = SP.ClientContext.get_current();
      var web = currCtx.get_web();
      const currentUser3 = web.get_currentUser();
      const ownerGroup2 = web.get_associatedOwnerGroup();
      const memberGroup2 = web.get_associatedMemberGroup();
      const visitorGroup2 = web.get_associatedVisitorGroup();
      var qaHasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
        oRequest.item,
        Audit.Common.Utilities.GetGroupNameQA(),
        SP.PermissionKind.viewListItems
      );
      oRequest.item.resetRoleInheritance();
      oRequest.item.breakRoleInheritance(false, false);
      var roleDefBindingCollAdmin = SP.RoleDefinitionBindingCollection.newObject(currCtx);
      roleDefBindingCollAdmin.add(
        currCtx.get_web().get_roleDefinitions().getByType(SP.RoleType.administrator)
      );
      var roleDefBindingCollContribute = SP.RoleDefinitionBindingCollection.newObject(currCtx);
      roleDefBindingCollContribute.add(
        currCtx.get_web().get_roleDefinitions().getByType(SP.RoleType.contributor)
      );
      var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject(currCtx);
      roleDefBindingCollRestrictedRead.add(
        currCtx.get_web().get_roleDefinitions().getByName("Restricted Read")
      );
      var roleDefBindingCollRestrictedContribute = SP.RoleDefinitionBindingCollection.newObject(currCtx);
      roleDefBindingCollRestrictedContribute.add(
        currCtx.get_web().get_roleDefinitions().getByName("Restricted Contribute")
      );
      oRequest.item.get_roleAssignments().add(ownerGroup2, roleDefBindingCollAdmin);
      oRequest.item.get_roleAssignments().add(memberGroup2, roleDefBindingCollContribute);
      oRequest.item.get_roleAssignments().add(visitorGroup2, roleDefBindingCollRestrictedRead);
      if (group1SpecialPerm != null)
        oRequest.item.get_roleAssignments().add(group1SpecialPerm, roleDefBindingCollRestrictedRead);
      if (group2SpecialPerm != null)
        oRequest.item.get_roleAssignments().add(group2SpecialPerm, roleDefBindingCollRestrictedRead);
      if (qaHasRead) {
        var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup(
          Audit.Common.Utilities.GetGroupNameQA()
        );
        if (spGroupQA != null)
          oRequest.item.get_roleAssignments().add(spGroupQA, roleDefBindingCollRestrictedRead);
      }
      oRequest.item.get_roleAssignments().getByPrincipal(currentUser3).deleteObject();
      var data2 = { oRequest };
      currCtx.executeQueryAsync(
        Function.createDelegate(data2, onUpdated1),
        Function.createDelegate(data2, onFailed1)
      );
    } else
      m_bIsTransactionExecuting = false;
  }
  function m_fnRemoveSpecialPermissions(id2) {
    if (!m_bIsSiteOwner) {
      SP.UI.Notify.addNotification(
        "You do not have access to perform this action...",
        false
      );
      return;
    }
    var oRequest = m_fnGetRequestByNumber(id2);
    if (oRequest == null)
      return;
    m_bIsTransactionExecuting = true;
    var cntRemoved = 0;
    var cntToRemove = 0;
    var responseCount = oRequest.responses.length;
    for (var y = 0; y < responseCount; y++) {
      var oResponse = oRequest.responses[y];
      if (oResponse.resStatus == "4-Approved for QA" || oResponse.resStatus == "6-Reposted After Rejection" || oResponse.resStatus == "7-Closed") {
        cntToRemove++;
      }
    }
    if (confirm(
      "Are you sure you would like to remove special permissions on this Request and on (" + cntToRemove + ") Responses?"
    )) {
      let onUpdated1 = function() {
        var bDoneGrantingAOSpecialPerms = false;
        m_fnGrantAOSpecialPermsOnRequest(
          oRequest,
          function(bDoneGrantingAOSpecialPerms2) {
            if (bDoneGrantingAOSpecialPerms2) {
              var bDoneGrantingCSSpecialPerms = false;
              m_fnGrantSpecialPermsOnCS(
                oRequest,
                currCtx,
                false,
                function(bDoneGrantingCSSpecialPerms2) {
                  if (bDoneGrantingCSSpecialPerms2) {
                    var responseCount2 = oRequest.responses.length;
                    if (responseCount2 == 0 || cntToRemove == 0) {
                      currCtx.executeQueryAsync(
                        function() {
                          document.body.style.cursor = "default";
                          notifyId2 = SP.UI.Notify.addNotification(
                            "Completed removing Special Permissions",
                            false
                          );
                          setTimeout(function() {
                            m_fnRefresh();
                          }, 200);
                        },
                        function(sender, args) {
                          document.body.style.cursor = "default";
                          notifyId2 = SP.UI.Notify.addNotification(
                            "Request failed1: " + args.get_message() + "\n" + args.get_stackTrace(),
                            false
                          );
                          setTimeout(function() {
                            m_fnRefresh();
                          }, 200);
                        }
                      );
                      return;
                    } else {
                      var bDoneGrantingSpecialPermsOnResponsesAndFolders = false;
                      m_fnGrantSpecialPermsOnResponseAndFolder(
                        oRequest,
                        false,
                        function(bDoneGrantingSpecialPermsOnResponsesAndFolders2) {
                          if (bDoneGrantingSpecialPermsOnResponsesAndFolders2) {
                            document.body.style.cursor = "default";
                            notifyId2 = SP.UI.Notify.addNotification(
                              "Completed removing Special Permissions",
                              false
                            );
                            setTimeout(function() {
                              m_fnRefresh();
                            }, 200);
                          } else {
                            document.body.style.cursor = "default";
                            notifyId2 = SP.UI.Notify.addNotification(
                              "Unable to update all responses and folders",
                              false
                            );
                            setTimeout(function() {
                              m_fnRefresh();
                            }, 200);
                          }
                        }
                      );
                    }
                  }
                }
              );
            }
          }
        );
      }, onFailed1 = function(sender, args) {
      };
      const m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
        "Information",
        "Please wait... removing Special Permissions on Request and Responses <div id='divGrantCntr'></div>",
        200,
        600
      );
      var currCtx = SP.ClientContext.get_current();
      var web = currCtx.get_web();
      const currentUser3 = web.get_currentUser();
      const ownerGroup2 = web.get_associatedOwnerGroup();
      const memberGroup2 = web.get_associatedMemberGroup();
      const visitorGroup2 = web.get_associatedVisitorGroup();
      var qaHasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
        oRequest.item,
        Audit.Common.Utilities.GetGroupNameQA(),
        SP.PermissionKind.viewListItems
      );
      var group1SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameSpecialPerm1()
      );
      var group2SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameSpecialPerm2()
      );
      oRequest.item.resetRoleInheritance();
      oRequest.item.breakRoleInheritance(false, false);
      var roleDefBindingCollAdmin = SP.RoleDefinitionBindingCollection.newObject(currCtx);
      roleDefBindingCollAdmin.add(
        currCtx.get_web().get_roleDefinitions().getByType(SP.RoleType.administrator)
      );
      var roleDefBindingCollContribute = SP.RoleDefinitionBindingCollection.newObject(currCtx);
      roleDefBindingCollContribute.add(
        currCtx.get_web().get_roleDefinitions().getByType(SP.RoleType.contributor)
      );
      var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject(currCtx);
      roleDefBindingCollRestrictedRead.add(
        currCtx.get_web().get_roleDefinitions().getByName("Restricted Read")
      );
      var roleDefBindingCollRestrictedContribute = SP.RoleDefinitionBindingCollection.newObject(currCtx);
      roleDefBindingCollRestrictedContribute.add(
        currCtx.get_web().get_roleDefinitions().getByName("Restricted Contribute")
      );
      oRequest.item.get_roleAssignments().add(ownerGroup2, roleDefBindingCollAdmin);
      oRequest.item.get_roleAssignments().add(memberGroup2, roleDefBindingCollContribute);
      oRequest.item.get_roleAssignments().add(visitorGroup2, roleDefBindingCollRestrictedRead);
      if (qaHasRead) {
        var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup(
          Audit.Common.Utilities.GetGroupNameQA()
        );
        if (spGroupQA != null)
          oRequest.item.get_roleAssignments().add(spGroupQA, roleDefBindingCollRestrictedRead);
      }
      oRequest.item.get_roleAssignments().getByPrincipal(currentUser3).deleteObject();
      var data2 = { oRequest };
      currCtx.executeQueryAsync(
        Function.createDelegate(data2, onUpdated1),
        Function.createDelegate(data2, onFailed1)
      );
    } else
      m_bIsTransactionExecuting = false;
  }
  function GetSourceUrlForForms() {
    var curPath = location.pathname + "?";
    var requestNum = $("#ddlReqNum").val();
    if (requestNum != "")
      curPath += "%26ReqNum=" + requestNum;
    var source = "&Source=" + curPath;
    return source;
  }
  function OnCallbackForm(result, value) {
    if (result === SP.UI.DialogResult.OK) {
      m_fnRefreshData();
    } else
      m_bIsTransactionExecuting = false;
  }
  function OnCallbackFormReload(result, value) {
    if (result === SP.UI.DialogResult.OK) {
      m_fnRefresh();
    } else
      m_bIsTransactionExecuting = false;
  }
  function OnCallbackFormNewRequest(result, value) {
    if (result !== SP.UI.DialogResult.OK)
      return;
    const newRequestTask = addTask(taskDefs.newRequest);
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();
    var requestList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleRequests());
    var requestQuery = new SP.CamlQuery();
    requestQuery.set_viewXml(
      '<View><Query><OrderBy><FieldRef Name="ID" Ascending="FALSE"/></OrderBy></Query><RowLimit>1</RowLimit></View>'
    );
    const requestItems = requestList.getItems(requestQuery);
    currCtx.load(
      requestItems,
      "Include(ID, Title, ReqType, ActionOffice, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
    );
    const emailList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory());
    var emailListQuery = new SP.CamlQuery();
    emailListQuery.set_viewXml(
      '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>'
    );
    const emailListFolderItems = emailList.getItems(emailListQuery);
    currCtx.load(emailListFolderItems, "Include(ID, Title, DisplayName)");
    currCtx.executeQueryAsync(
      async function() {
        var oListItem = null;
        var listItemEnumerator = requestItems.getEnumerator();
        while (listItemEnumerator.moveNext()) {
          oListItem = listItemEnumerator.get_current();
          break;
        }
        if (oListItem) {
          m_fnCreateRequestInternalItem(oListItem.get_item("ID"));
          if (!oListItem.get_hasUniqueRoleAssignments()) {
            var bDoneBreakingReqPermisions = false;
            await m_fnBreakRequestPermissions(oListItem, false, null);
            var bDoneCreatingEmailFolder = false;
            Audit.Common.Utilities.CreateEmailFolder(
              emailList,
              oListItem.get_item("Title"),
              oListItem,
              function(bDoneCreatingEmailFolder2) {
                _myViewModel.tabs.selectTab(_myViewModel.tabOpts.RequestDetail);
                finishTask(newRequestTask);
                m_fnRefreshData(oListItem.get_item("ID"));
              }
            );
          } else {
            var bDoneCreatingEmailFolder = false;
            Audit.Common.Utilities.CreateEmailFolder(
              emailList,
              oListItem.get_item("Title"),
              oListItem,
              function(bDoneCreatingEmailFolder2) {
                _myViewModel.tabs.selectTab(_myViewModel.tabOpts.RequestDetail);
                finishTask(newRequestTask);
                m_fnRefreshData(oListItem.get_item("ID"));
              }
            );
          }
        }
      },
      function(sender, args) {
        m_fnRefresh();
      }
    );
  }
  function m_fnCreateRequestInternalItem(requestNumber) {
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();
    var requestInternalList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleRequestsInternal());
    var itemCreateInfo = new SP.ListItemCreationInformation();
    var newRequestInternalItem = requestInternalList.addItem(itemCreateInfo);
    newRequestInternalItem.set_item("ReqNum", requestNumber);
    newRequestInternalItem.update();
    currCtx.executeQueryAsync(
      function() {
      },
      function(sender, args) {
        alert("error creating internal request item");
        console.error(sender, args);
      }
    );
  }
  async function m_fnUpdateAllResponsePermissions(requestStatus, requestNum, bCheckStatus, OnCompleteUpdateResponsePerms) {
    var cntResponsesBroken = 0;
    var oRequestBigMap = m_bigMap["request-" + requestNum];
    if (!oRequestBigMap)
      return;
    var cntResponsesToBreak = oRequestBigMap.responses.length;
    for (const response of oRequestBigMap.responses) {
      await m_fnBreakResponseAndFolderPermissions(
        requestStatus,
        response,
        false,
        bCheckStatus,
        false,
        false
      );
      cntResponsesBroken++;
    }
  }
  function m_fnRenameResponses(oRequest, oldRrequestNumber, newRequestNumber) {
    for (var x = 0; x < oRequest.responses.length; x++) {
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      var title = oRequest.responses[x].title;
      var newTitle = title.replace(oldRrequestNumber, newRequestNumber);
      oRequest.responses[x].item.set_item("Title", newTitle);
      oRequest.responses[x].item.update();
      currCtx.executeQueryAsync(
        function() {
        },
        function(sender, args) {
        }
      );
    }
  }
  function m_fnRenameResponseFolders(responseDocsFoldersItems, oldRrequestNumber, newRequestNumber) {
    var listItemEnumerator = responseDocsFoldersItems.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      var oListItemResponseDocFolder = listItemEnumerator.get_current();
      var itemName = oListItemResponseDocFolder.get_displayName();
      var test = itemName.replace(oldRrequestNumber, "");
      if (test.charAt(0) == "-") {
        var newTitle = itemName.replace(oldRrequestNumber, newRequestNumber);
        oListItemResponseDocFolder.set_item("FileLeafRef", newTitle);
        oListItemResponseDocFolder.set_item("Title", newTitle);
        oListItemResponseDocFolder.update();
        currCtx.executeQueryAsync(
          function() {
          },
          function(sender, args) {
          }
        );
      }
    }
  }
  function m_fnRenameEmailFolder(emailListFolderItems, oldRrequestNumber, newRequestNumber) {
    var listItemEnumerator = emailListFolderItems.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      var oListItemEmailFolder = listItemEnumerator.get_current();
      var itemName = oListItemEmailFolder.get_displayName();
      if (oldRrequestNumber == itemName) {
        var newTitle = itemName.replace(oldRrequestNumber, newRequestNumber);
        oListItemEmailFolder.set_item("FileLeafRef", newTitle);
        oListItemEmailFolder.set_item("Title", newTitle);
        oListItemEmailFolder.update();
        currCtx.executeQueryAsync(
          function() {
          },
          function(sender, args) {
          }
        );
      }
    }
  }
  function m_fnRenameEAFolder(eaListFolderItems, oldRrequestNumber, newRequestNumber) {
    var listItemEnumerator = eaListFolderItems.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      var oListItemEAFolder = listItemEnumerator.get_current();
      var itemName = oListItemEAFolder.get_displayName();
      if (oldRrequestNumber == itemName) {
        var newTitle = itemName.replace(oldRrequestNumber, newRequestNumber);
        oListItemEAFolder.set_item("FileLeafRef", newTitle);
        oListItemEAFolder.set_item("Title", newTitle);
        oListItemEAFolder.update();
        currCtx.executeQueryAsync(
          function() {
          },
          function(sender, args) {
          }
        );
      }
    }
  }
  async function OnCallbackFormEditRequest(result, value) {
    if (result !== SP.UI.DialogResult.OK) {
      m_bIsTransactionExecuting = false;
      return;
    }
    m_bIsTransactionExecuting = true;
    const oRequest = _myViewModel.currentRequest();
    const notifyId3 = SP.UI.Notify.addNotification("Please wait...", false);
    document.body.style.cursor = "wait";
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();
    var requestList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleRequests());
    var requestQuery = new SP.CamlQuery();
    requestQuery.set_viewXml(
      '<View><Query><Where><Eq><FieldRef Name="ID"/><Value Type="Text">' + m_itemID + "</Value></Eq></Where></Query></View>"
    );
    const requestItems = requestList.getItems(requestQuery);
    currCtx.load(
      requestItems,
      "Include(ID, Title, ReqType, ActionOffice, ReqStatus, Sensitivity, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
    );
    var responseDocsLibFolderslist = currCtx.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
    var responseDocsLibFolderslistQuery = new SP.CamlQuery();
    responseDocsLibFolderslistQuery.set_viewXml(
      '<View><Query><Where><And><BeginsWith><FieldRef Name="Title"/><Value Type="Text">' + oRequest.number + '-</Value></BeginsWith><Eq><FieldRef Name="ContentType" /><Value Type="Text">Folder</Value></Eq></And></Where></Query></View>'
    );
    const m_ResponseDocsFoldersItems = responseDocsLibFolderslist.getItems(
      responseDocsLibFolderslistQuery
    );
    if (m_bIsSiteOwner)
      currCtx.load(
        m_ResponseDocsFoldersItems,
        "Include( DisplayName, Title, Id, EncodedAbsUrl, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
      );
    else
      currCtx.load(
        m_ResponseDocsFoldersItems,
        "Include( DisplayName, Title, Id, EncodedAbsUrl)"
      );
    var emailList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory());
    var emailListQuery = new SP.CamlQuery();
    emailListQuery.set_viewXml(
      '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><And><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq><Eq><FieldRef Name="Title"/><Value Type="Text">' + oRequest.number + "</Value></Eq></And></Where></Query></View>"
    );
    const emailListFolderItems = emailList.getItems(emailListQuery);
    currCtx.load(emailListFolderItems, "Include(ID, Title, DisplayName)");
    var eaList = web.get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocsEA());
    var eaListQuery = new SP.CamlQuery();
    eaListQuery.set_viewXml(
      '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>'
    );
    const eaListFolderItems = eaList.getItems(eaListQuery);
    currCtx.load(eaListFolderItems, "Include(ID, Title, DisplayName)");
    await new Promise((resolve, reject2) => {
      currCtx.executeQueryAsync(resolve, reject2);
    }).catch((e) => {
      m_fnRefresh();
      return;
    });
    const requestItemId = m_itemID;
    var listItemEnumerator = requestItems.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      var oListItem = listItemEnumerator.get_current();
      var curSensitivity = oListItem.get_item("Sensitivity");
      var bChangeSensitivity = false;
      if (m_bigMap["request-" + m_requestNum].sensitivity != curSensitivity) {
        bChangeSensitivity = true;
      }
      if (m_requestNum == oListItem.get_item("Title")) {
        var bDoneBreakingReqPermisions = false;
        await m_fnBreakRequestPermissions(oListItem, false, null);
        var doneUpdatingResponses = false;
        await m_fnUpdateAllResponsePermissions(
          oListItem.get_item("ReqStatus"),
          m_requestNum,
          true
        );
        if (bChangeSensitivity) {
          var oldSensitivity = m_bigMap["request-" + m_requestNum].sensitivity;
          const doneUpdatingSensitivity = await m_fnUpdateSensitivityOnRequest(
            m_requestNum,
            curSensitivity,
            oldSensitivity
          );
        }
        var listItemEnumerator1 = emailListFolderItems.getEnumerator();
        while (listItemEnumerator1.moveNext()) {
          var oEmailFolderItem = listItemEnumerator1.get_current();
          if (oEmailFolderItem.get_displayName() == m_requestNum) {
            await m_fnBreakEmailFolderPermissions(
              oEmailFolderItem,
              oListItem,
              false
            );
            break;
          }
        }
      } else {
        const m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
          "Renaming Responses",
          "Please wait... Renaming Responses",
          200,
          400
        );
        var bDoneBreakingReqPermisions = false;
        await m_fnBreakRequestPermissions(oListItem, false, null);
        var oRequest2 = m_fnGetRequestByNumber(m_requestNum);
        var newRequestNumber = oListItem.get_item("Title");
        m_fnRenameResponses(oRequest2, m_requestNum, newRequestNumber);
        m_fnRenameResponseFolders(
          m_ResponseDocsFoldersItems,
          m_requestNum,
          newRequestNumber
        );
        m_fnRenameEmailFolder(
          emailListFolderItems,
          m_requestNum,
          newRequestNumber
        );
        m_fnRenameEAFolder(eaListFolderItems, m_requestNum, newRequestNumber);
        setTimeout(function() {
          m_fnRefresh(newRequestNumber);
        }, 2e4);
      }
    }
    m_fnRefreshData();
  }
  function OnCallbackFormCoverSheet(result, value) {
    if (result === SP.UI.DialogResult.OK) {
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      var coversheetList = web.get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleCoverSheets());
      var coversheetQuery = new SP.CamlQuery();
      coversheetQuery.set_viewXml(
        '<View><Query><OrderBy><FieldRef Name="Modified" Ascending="FALSE"/></OrderBy></Query><RowLimit>1</RowLimit></View>'
      );
      const coversheetItems = coversheetList.getItems(coversheetQuery);
      currCtx.load(
        coversheetItems,
        "Include(ID, Title, ActionOffice, FileLeafRef, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
      );
      var requestSensitivity = m_bigMap["request-" + m_requestNum].sensitivity;
      currCtx.executeQueryAsync(
        async function() {
          var listItemEnumerator = coversheetItems.getEnumerator();
          var oListItem = null;
          while (listItemEnumerator.moveNext()) {
            oListItem = listItemEnumerator.get_current();
            break;
          }
          if (oListItem) {
            const m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
              "Information",
              "Please wait... Updating permissions on Coversheet",
              200,
              600
            );
            await m_fnBreakCoversheetPermissions(oListItem, false);
            if (requestSensitivity && requestSensitivity != "None") {
              var doneBreakingCS = false;
              await m_fnBreakCoversheetPermissions(oListItem, false);
              var newFileName = m_fnGetNewFileNameForSensitivity(
                oListItem,
                null,
                requestSensitivity
              );
              if (newFileName != "") {
                oListItem.set_item("FileLeafRef", newFileName);
                oListItem.update();
              }
              var data2 = { newFileName };
              await new Promise((resolve, reject2) => {
                currCtx.executeQueryAsync(resolve, reject2);
              }).catch((e) => {
                alert("Error updating coversheet name with sensitivity");
                m_fnRefresh();
                return;
              });
            }
            m_waitDialog.close();
            m_fnRefreshData();
          }
        },
        function(sender, args) {
          m_fnRefresh();
        }
      );
    } else
      m_bIsTransactionExecuting = false;
  }
  function OnCallbackFormBulkAddResponse(result, value) {
    if ($("#divRanBulkUpdate").text() == 1)
      m_fnRefreshData();
  }
  function OnCallbackFormBulkEditResponse(result, value) {
    if ($("#divRanBulkUpdate").text() == 1)
      m_fnRefreshData();
  }
  function OnCallbackFormNewResponse(result, value) {
    if (result === SP.UI.DialogResult.OK) {
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      var responseList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleResponses());
      var responseQuery = new SP.CamlQuery();
      responseQuery.set_viewXml(
        '<View><Query><OrderBy><FieldRef Name="ID" Ascending="FALSE"/></OrderBy></Query><RowLimit>1</RowLimit></View>'
      );
      const responseItems = responseList.getItems(responseQuery);
      currCtx.load(
        responseItems,
        "Include(ID, Title, ActionOffice, ReqNum, ResStatus, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
      );
      currCtx.executeQueryAsync(
        async function() {
          var oListItem = null;
          var listItemEnumerator = responseItems.getEnumerator();
          while (listItemEnumerator.moveNext()) {
            oListItem = listItemEnumerator.get_current();
            if (oListItem && !oListItem.get_hasUniqueRoleAssignments())
              await m_fnBreakResponsePermissions(oListItem, false, true);
            break;
          }
          if (oListItem == null)
            return;
          var responseTitle = oListItem.get_item("Title");
          var requestNum = oListItem.get_item("ReqNum").get_lookupValue();
          const currentUser3 = currCtx.get_web().get_currentUser();
          const ownerGroup2 = currCtx.get_web().get_associatedOwnerGroup();
          const memberGroup2 = currCtx.get_web().get_associatedMemberGroup();
          const visitorGroup2 = currCtx.get_web().get_associatedVisitorGroup();
          var responseDocLib = currCtx.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
          var itemCreateInfo = new SP.ListItemCreationInformation();
          itemCreateInfo.set_underlyingObjectType(SP.FileSystemObjectType.folder);
          itemCreateInfo.set_leafName(responseTitle);
          const oListFolderItem = responseDocLib.addItem(itemCreateInfo);
          oListFolderItem.set_item("Title", responseTitle);
          oListFolderItem.update();
          oListFolderItem.breakRoleInheritance(false, false);
          var roleDefBindingColl = SP.RoleDefinitionBindingCollection.newObject(currCtx);
          roleDefBindingColl.add(
            currCtx.get_web().get_roleDefinitions().getByType(SP.RoleType.administrator)
          );
          oListFolderItem.get_roleAssignments().add(ownerGroup2, roleDefBindingColl);
          var roleDefBindingColl2 = SP.RoleDefinitionBindingCollection.newObject(currCtx);
          roleDefBindingColl2.add(
            currCtx.get_web().get_roleDefinitions().getByType(SP.RoleType.contributor)
          );
          oListFolderItem.get_roleAssignments().add(memberGroup2, roleDefBindingColl2);
          var roleDefBindingColl3 = SP.RoleDefinitionBindingCollection.newObject(currCtx);
          roleDefBindingColl3.add(
            currCtx.get_web().get_roleDefinitions().getByName("Restricted Read")
          );
          oListFolderItem.get_roleAssignments().add(visitorGroup2, roleDefBindingColl3);
          var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName(
            oListItem.get_item("ActionOffice").get_lookupValue()
          );
          var actionOfficeGroupObj = Audit.Common.Utilities.GetSPSiteGroup(
            actionOfficeGroupName
          );
          if (actionOfficeGroupObj != null) {
            var roleDefBindingColl4 = SP.RoleDefinitionBindingCollection.newObject(currCtx);
            roleDefBindingColl4.add(
              currCtx.get_web().get_roleDefinitions().getByName("Restricted Contribute")
            );
            oListFolderItem.get_roleAssignments().add(actionOfficeGroupObj, roleDefBindingColl4);
          }
          oListFolderItem.get_roleAssignments().getByPrincipal(currentUser3).deleteObject();
          currCtx.executeQueryAsync(
            function() {
              m_fnRefreshData();
            },
            function(sender, args) {
              m_fnRefresh();
            }
          );
        },
        function(sender, args) {
          m_fnRefresh();
        }
      );
    } else
      m_bIsTransactionExecuting = false;
  }
  var m_countCSToUpdateOnEditResponse = 0;
  var m_countCSUpdatedOnEditResponse = 0;
  function OnCallbackFormEditResponse(result, value) {
    m_countCSToUpdateOnEditResponse = 0;
    m_countCSUpdatedOnEditResponse = 0;
    if (result === SP.UI.DialogResult.OK) {
      document.body.style.cursor = "wait";
      notifyId2 = SP.UI.Notify.addNotification("Please wait... ", false);
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      var responseList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleResponses());
      var responseQuery = new SP.CamlQuery();
      responseQuery.set_viewXml(
        `<View><Query><FieldRef Name="Modified" Ascending="FALSE"/><Where><Eq><FieldRef Name='ID'/><Value Type='Text'>` + m_itemID + "</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>"
      );
      const responseItems = responseList.getItems(responseQuery);
      currCtx.load(
        responseItems,
        "Include(ID, Title, ActionOffice, POC, POCCC, ReturnReason, ResStatus, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
      );
      var responseDocLib = web.get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
      var responseDocQuery = new SP.CamlQuery();
      responseDocQuery.set_viewXml(
        "<View><Query><Where><Eq><FieldRef Name='FileLeafRef'/><Value Type='Text'>" + m_responseTitle + "</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>"
      );
      const responseFolderItems = responseDocLib.getItems(responseDocQuery);
      currCtx.load(
        responseFolderItems,
        "Include( Title, DisplayName, Id, EncodedAbsUrl, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
      );
      var folderPath = Audit.Common.Utilities.GetSiteUrl() + "/" + Audit.Common.Utilities.GetLibNameResponseDocs() + "/" + m_responseTitle;
      var responseDocQuery2 = new SP.CamlQuery();
      responseDocQuery2.set_viewXml(
        `<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name='FileDirRef'/><Value Type='Text'>` + folderPath + "</Value></Eq><Eq><FieldRef Name='DocumentStatus'/><Value Type='Text'>Submitted</Value></Eq></And></Where></Query></View>"
      );
      const responseDocSubmittedItems = responseDocLib.getItems(responseDocQuery2);
      currCtx.load(
        responseDocSubmittedItems,
        "Include(ID, DocumentStatus, FileDirRef, Created, FileLeafRef)"
      );
      var responseDocQuery6 = new SP.CamlQuery();
      responseDocQuery6.set_viewXml(
        `<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name='FileDirRef'/><Value Type='Text'>` + folderPath + "</Value></Eq><Eq><FieldRef Name='DocumentStatus'/><Value Type='Text'>Open</Value></Eq></And></Where></Query></View>"
      );
      const responseDocOpenItems = responseDocLib.getItems(responseDocQuery6);
      currCtx.load(
        responseDocOpenItems,
        "Include(ID, DocumentStatus, FileDirRef, Created, FileLeafRef)"
      );
      var responseDocQuery3 = new SP.CamlQuery();
      responseDocQuery3.set_viewXml(
        `<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name='FileDirRef'/><Value Type='Text'>` + folderPath + "</Value></Eq><Eq><FieldRef Name='DocumentStatus'/><Value Type='Text'>Marked for Deletion</Value></Eq></And></Where></Query></View>"
      );
      const responseDocMarkedForDeletionItems = responseDocLib.getItems(responseDocQuery3);
      currCtx.load(
        responseDocMarkedForDeletionItems,
        "Include(ID, DocumentStatus, FileDirRef, Created, FileLeafRef)"
      );
      var responseDocQuery4 = new SP.CamlQuery();
      responseDocQuery4.set_viewXml(
        `<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name='FileDirRef'/><Value Type='Text'>` + folderPath + "</Value></Eq><Eq><FieldRef Name='DocumentStatus'/><Value Type='Text'>Rejected</Value></Eq></And></Where></Query></View>"
      );
      const responseDocRejectedItems = responseDocLib.getItems(responseDocQuery4);
      currCtx.load(
        responseDocRejectedItems,
        "Include(ID, DocumentStatus, FileDirRef, Created, FileLeafRef)"
      );
      var responseDocQuery8 = new SP.CamlQuery();
      responseDocQuery8.set_viewXml(
        `<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name='FileDirRef'/><Value Type='Text'>` + folderPath + "</Value></Eq><Eq><FieldRef Name='DocumentStatus'/><Value Type='Text'>Sent to QA</Value></Eq></And></Where></Query></View>"
      );
      const responseDocSentToQAItems = responseDocLib.getItems(responseDocQuery8);
      currCtx.load(
        responseDocSentToQAItems,
        "Include(ID, DocumentStatus, FileDirRef, Created, FileLeafRef)"
      );
      var emailList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory());
      var emailListQuery = new SP.CamlQuery();
      emailListQuery.set_viewXml(
        '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>'
      );
      const emailListFolderItems = emailList.getItems(emailListQuery);
      currCtx.load(emailListFolderItems, "Include(ID, Title, DisplayName)");
      currCtx.executeQueryAsync(
        async function() {
          var oListItem = null;
          var newResponseFolderTitle = null;
          var listItemEnumerator = responseItems.getEnumerator();
          while (listItemEnumerator.moveNext()) {
            oListItem = listItemEnumerator.get_current();
            newResponseFolderTitle = oListItem.get_item("Title");
            await m_fnBreakResponsePermissions(oListItem, false, true);
            break;
          }
          if (oListItem == null) {
            alert("Error");
            return;
          }
          var responseFolder = null;
          var listItemEnumerator = responseFolderItems.getEnumerator();
          while (listItemEnumerator.moveNext()) {
            responseFolder = listItemEnumerator.get_current();
            await m_fnBreakResponseFolderPermissions(
              responseFolder,
              oListItem,
              false,
              true
            );
            break;
          }
          if (m_responseTitle != newResponseFolderTitle) {
            responseFolder.set_item("FileLeafRef", newResponseFolderTitle);
            responseFolder.set_item("Title", newResponseFolderTitle);
            responseFolder.update();
          }
          async function onUpdated1Succeeded() {
            var currCtx2 = new SP.ClientContext.get_current();
            var web2 = currCtx2.get_web();
            if (this.oListItem.get_item("ResStatus") == "3-Returned to Action Office" && m_responseStatus != this.oListItem.get_item("ResStatus")) {
              var oRequest = m_fnGetRequestByNumber(m_requestNum);
              var emailSubject = "Please Update your Response for Request Number: " + m_requestNum;
              var emailText = "";
              if (this.oListItem.get_item("ResStatus") == "3-Returned to Action Office") {
                emailText = "<div>Audit Request Reference: <b>{REQUEST_NUMBER}</b></div><div>Audit Request Subject: <b>{REQUEST_SUBJECT}</b></div><div>Audit Request Due Date: <b>{REQUEST_DUEDATE}</b></div>{POC}<div>{RETURN_REASON}</div><br/><div>Please provide responses for the following Sample(s): </div><br/><div>{RESPONSE_TITLES}</div>";
                var returnReason = this.oListItem.get_item("ReturnReason");
                if (returnReason == null)
                  returnReason = "";
                else
                  returnReason = "Return Reason: " + returnReason;
                emailText = emailText.replace("{RETURN_REASON}", returnReason);
              } else {
                emailText = "<div>Audit Request Reference: <b>{REQUEST_NUMBER}</b></div><div>Audit Request Subject: <b>{REQUEST_SUBJECT}</b></div><div>Audit Request Due Date: <b>{REQUEST_DUEDATE}</b></div>{POC}{REQUEST_RELATEDAUDIT}<br/><div>Below are the listed action items that have been requested for the Audit: </div><div>{REQUEST_ACTIONITEMS}<br/></div><div>Please provide responses for the following Sample(s): </div><br/><div>{RESPONSE_TITLES}</div>";
                emailText = emailText.replace(
                  "{REQUEST_ACTIONITEMS}",
                  oRequest.actionItems
                );
                if (oRequest.relatedAudit == null || oRequest.relatedAudit == "")
                  emailText = emailText.replace(
                    "{REQUEST_RELATEDAUDIT}",
                    "<div>This is a new request, not similar to previous audit cycles.</div>"
                  );
                else
                  emailText = emailText.replace(
                    "{REQUEST_RELATEDAUDIT}",
                    "<div>This request is similar to this previous cycle audit: " + oRequest.relatedAudit + "</div>"
                  );
              }
              emailText = emailText.replace("{REQUEST_NUMBER}", m_requestNum);
              emailText = emailText.replace(
                "{REQUEST_SUBJECT}",
                oRequest.subject
              );
              emailText = emailText.replace(
                "{REQUEST_DUEDATE}",
                oRequest.internalDueDate
              );
              emailText = emailText.replace(
                "{RESPONSE_TITLES}",
                this.newResponseFolderTitle
              );
              var ao = this.oListItem.get_item("ActionOffice");
              if (ao != null)
                ao = ao.get_lookupValue();
              else
                ao = "";
              var emailTo = ao;
              var poc = this.oListItem.get_item("POC");
              if (poc != null) {
                poc = poc.get_email();
                emailTo = poc;
                var pocCC = this.oListItem.get_item("POCCC");
                if (pocCC != null) {
                  emailTo += ";" + pocCC.get_email();
                }
                emailText = emailText.replace(
                  "{POC}",
                  "<div><b>POC: " + poc + "</b></div><br/>"
                );
              } else {
                emailText = emailText.replace("{POC}", "<br/>");
              }
              var itemCreateInfo = new SP.ListItemCreationInformation();
              itemCreateInfo.set_folderUrl(
                location.protocol + "//" + location.host + Audit.Common.Utilities.GetSiteUrl() + "/Lists/" + Audit.Common.Utilities.GetListNameEmailHistory() + "/" + m_requestNum
              );
              const oListItemEmail = emailList.addItem(itemCreateInfo);
              oListItemEmail.set_item("Title", emailSubject);
              oListItemEmail.set_item("Body", emailText);
              oListItemEmail.set_item("To", emailTo);
              oListItemEmail.set_item(
                "NotificationType",
                "AO Returned Notification"
              );
              oListItemEmail.set_item("ReqNum", m_requestNum);
              oListItemEmail.set_item("ResID", this.newResponseFolderTitle);
              oListItemEmail.update();
              currCtx2.executeQueryAsync(
                function() {
                  document.body.style.cursor = "default";
                  setTimeout(function() {
                    m_fnRefreshData();
                  }, 1e3);
                },
                function(sender, args) {
                  alert(
                    "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
                  );
                  setTimeout(function() {
                    m_fnRefresh();
                  }, 200);
                }
              );
            } else if ((this.oListItem.get_item("ResStatus") == "4-Approved for QA" || this.oListItem.get_item("ResStatus") == "6-Reposted After Rejection") && m_responseStatus != this.oListItem.get_item("ResStatus")) {
              var oRequest = m_fnGetRequestByNumber(m_requestNum);
              var oResponse = oRequest.responses.find(
                (response) => response.ID == this.oListItem.get_item("ID")
              );
              var bDoneBreakingReqPermisions = false;
              await m_fnBreakRequestPermissions(
                oRequest.item,
                false,
                this.oListItem.get_item("ResStatus")
              );
              var cntForQA = 0;
              if (responseDocSubmittedItems != null) {
                var listItemEnumerator1 = responseDocSubmittedItems.getEnumerator();
                while (listItemEnumerator1.moveNext()) {
                  var oListItem1 = listItemEnumerator1.get_current();
                  oListItem1.set_item(
                    "FileLeafRef",
                    m_fnGetNewResponseDocTitle(
                      oListItem1,
                      newResponseFolderTitle,
                      oRequest.sensitivity
                    )
                  );
                  oListItem1.set_item("DocumentStatus", "Sent to QA");
                  oListItem1.update();
                  cntForQA++;
                }
              }
              if (responseDocOpenItems != null) {
                var listItemEnumerator1 = responseDocOpenItems.getEnumerator();
                while (listItemEnumerator1.moveNext()) {
                  var oListItem1 = listItemEnumerator1.get_current();
                  oListItem1.set_item(
                    "FileLeafRef",
                    m_fnGetNewResponseDocTitle(
                      oListItem1,
                      newResponseFolderTitle,
                      oRequest.sensitivity
                    )
                  );
                  oListItem1.set_item("DocumentStatus", "Sent to QA");
                  oListItem1.update();
                  cntForQA++;
                }
              }
              if (responseDocSentToQAItems != null) {
                var listItemEnumerator1 = responseDocSentToQAItems.getEnumerator();
                while (listItemEnumerator1.moveNext()) {
                  var oListItem1 = listItemEnumerator1.get_current();
                  cntForQA++;
                }
              }
              if (responseDocMarkedForDeletionItems != null) {
                const arrItemsToRecyle = new Array();
                var listItemEnumerator1 = responseDocMarkedForDeletionItems.getEnumerator();
                while (listItemEnumerator1.moveNext()) {
                  var oListItem1 = listItemEnumerator1.get_current();
                  arrItemsToRecyle.push(oListItem1);
                }
                for (var x = 0; x < arrItemsToRecyle.length; x++) {
                  arrItemsToRecyle[x].deleteObject();
                }
              }
              var cntRejected = 0;
              if (responseDocRejectedItems != null) {
                var listItemEnumerator1 = responseDocRejectedItems.getEnumerator();
                while (listItemEnumerator1.moveNext()) {
                  var oListItem1 = listItemEnumerator1.get_current();
                  oListItem1.set_item("DocumentStatus", "Archived");
                  oListItem1.update();
                  cntRejected++;
                }
              }
              const oResponseDocsForQA = oResponse.responseDocs.filter(
                (responseDoc) => {
                  return ["Sent to QA", "Submitted", "Open"].includes(
                    responseDoc.documentStatus
                  );
                }
              );
              await m_fnNotifyQAApprovalPending(oRequest, oResponseDocsForQA);
              currCtx2.executeQueryAsync(
                async function() {
                  if (oRequest.coversheets?.length) {
                    await Promise.all(
                      oRequest.coversheets.map(
                        (coversheet) => m_fnBreakCoversheetPermissions(coversheet.item, true)
                      )
                    );
                  }
                  setTimeout(function() {
                    m_fnRefreshData();
                  }, 200);
                },
                function(sender, args) {
                  alert(
                    "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
                  );
                  setTimeout(function() {
                    m_fnRefresh();
                  }, 200);
                }
              );
            } else {
              document.body.style.cursor = "default";
              setTimeout(function() {
                m_fnRefreshData();
              }, 1e3);
            }
          }
          function onUpdated1Failed(sender, args) {
            alert(
              "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
            );
            setTimeout(function() {
              m_fnRefresh();
            }, 200);
          }
          var data2 = {
            newResponseFolderTitle,
            oListItem
          };
          currCtx.executeQueryAsync(
            Function.createDelegate(data2, onUpdated1Succeeded),
            Function.createDelegate(data2, onUpdated1Failed)
          );
        },
        function(sender, args) {
          alert(
            "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
          );
          setTimeout(function() {
            m_fnRefresh();
          }, 200);
        }
      );
    } else {
      m_bIsTransactionExecuting = false;
    }
  }
  function m_fnGoToRequest(requestNumber, responseTitle) {
    const notifyId3 = SP.UI.Notify.addNotification(
      "Displaying Request (" + requestNumber + ")",
      false
    );
    m_sGoToResponseTitle = null;
    if (responseTitle != null && responseTitle != "")
      m_sGoToResponseTitle = responseTitle;
    _myViewModel.tabs.selectTab(_myViewModel.tabOpts.RequestDetail);
    if ($("#ddlReqNum").val() != requestNumber) {
      _myViewModel.filterRequestInfoTabRequestName(requestNumber);
    } else if (m_sGoToResponseTitle != null) {
      m_fnHighlightResponse();
    }
  }
  if (document.readyState === "ready" || document.readyState === "complete") {
    InitReport2();
  } else {
    document.onreadystatechange = () => {
      if (document.readyState === "complete" || document.readyState === "ready") {
        ExecuteOrDelayUntilScriptLoaded(function() {
          SP.SOD.executeFunc("sp.js", "SP.ClientContext", InitReport2);
        }, "sp.js");
      }
    };
  }
})();
//# sourceMappingURL=ia_db.js.map
