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

  // src/infrastructure/store.js
  var auditOrganizationStore, allActionOfficesFilter, allRequestingOfficesFilter;
  var init_store = __esm({
    "src/infrastructure/store.js"() {
      init_entities2();
      auditOrganizationStore = ko.observableArray();
      allActionOfficesFilter = (org) => ORGROLES.ACTIONOFFICE == org.Role;
      allRequestingOfficesFilter = (org) => ORGROLES.REQUESTINGOFFICE == org.Role;
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

  // src/sal/primitives/index.js
  var init_primitives = __esm({
    "src/sal/primitives/index.js"() {
      init_validation_error();
      init_entity();
      init_constrained_entity();
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
  var html2, BaseFieldModule;
  var init_BaseFieldModule = __esm({
    "src/sal/components/fields/BaseFieldModule.js"() {
      html2 = String.raw;
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
        static viewTemplate = html2`
    <div class="fw-semibold" data-bind="text: displayName"></div>
    <div data-bind="text: toString()"></div>
  `;
        static editTemplate = html2`<div>Uh oh!</div>`;
      };
    }
  });

  // src/sal/components/fields/BlobModule.js
  var editTemplate, viewTemplate, BlobModule;
  var init_BlobModule = __esm({
    "src/sal/components/fields/BlobModule.js"() {
      init_BaseFieldModule();
      editTemplate = html2`
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
      viewTemplate = html2`
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
      editTemplate2 = html2`
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
      viewTemplate2 = html2`
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
  var dateFieldTypes, editTemplate3, DateModule;
  var init_DateModule = __esm({
    "src/sal/components/fields/DateModule.js"() {
      init_BaseFieldModule();
      dateFieldTypes = {
        date: "date",
        datetime: "datetime-local"
      };
      editTemplate3 = html2`
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
        toInputDateString = () => this.Value().format("yyyy-MM-dd");
        toInputDateTimeString = () => this.Value().format("yyyy-MM-ddThh:mm");
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
            if (this.type == dateFieldTypes.datetime) {
              this.Value(new Date(val));
              return;
            }
            this.Value(/* @__PURE__ */ new Date(val + "T00:00"));
          }
        });
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
      editTemplate4 = html2`
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
      editTemplate5 = html2`
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
      viewTemplate3 = html2`
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
      editTemplate6 = html2`
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
      editTemplate7 = html2`
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
      editTemplate8 = html2`
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
      viewTemplate4 = html2`
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
      editTemplate9 = html2`
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
  var DateField;
  var init_DateField = __esm({
    "src/sal/fields/DateField.js"() {
      init_fields();
      init_fields2();
      init_fields();
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

  // src/sal/entities/SitePage.js
  var SitePage;
  var init_SitePage = __esm({
    "src/sal/entities/SitePage.js"() {
      init_primitives();
      SitePage = class extends Entity {
        constructor(params) {
          super(params);
        }
        static Views = {
          All: ["ID", "Title", "Created", "Author", "Modified", "Editor"]
        };
        static ListDef = {
          name: "SitePages",
          title: "Site Pages"
        };
      };
    }
  });

  // src/sal/entities/index.js
  var init_entities = __esm({
    "src/sal/entities/index.js"() {
      init_People();
      init_SitePage();
    }
  });

  // src/env.js
  var assetsPath;
  var init_env = __esm({
    "src/env.js"() {
      assetsPath = `${_spPageContextInfo.siteServerRelativeUrl}/Style Library/apps/audit/src`;
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
            const selectedOpts = ko.unwrap(selectedOptions) ?? [];
            const optionElements = optionItems.map((option) => {
              const optionElement = document.createElement("option");
              ko.selectExtensions.writeValue(optionElement, ko.unwrap(option));
              optionElement.innerText = optionsText(option);
              if (selectedOpts?.find((selectedOption) => {
                if (option.ID && selectedOption.ID == option.ID)
                  return true;
                if (option == selectedOption)
                  return true;
                return false;
              })) {
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
          for (var i = 0; i < element.options.length; i++) {
            const o = element.options[i];
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
            }).catch((error) => {
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
  function directRegisterComponent(name, { template, viewModel = null }) {
    ko.components.register(name, {
      template,
      viewModel
    });
  }
  var html3;
  var init_register_components = __esm({
    "src/sal/infrastructure/register_components.js"() {
      html3 = String.raw;
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
      for (let i = 2; i < totalBlocks; i++) {
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
  async function getRequestDigest() {
    const response = await fetch(sal.globalConfig.siteUrl + "/_api/contextinfo", {
      method: "POST",
      headers: {
        Accept: "application/json; odata=verbose"
      }
    });
    if (!response.ok) {
      console.error("Cannot refresh token", response);
      return;
    }
    const result = await response.json();
    return result.d.GetContextWebInformation;
  }
  async function refreshDigestValue() {
    const result = await getRequestDigest();
    if (!result)
      return;
    document.getElementById("__REQUESTDIGEST").value = result.FormDigestValue;
    window.setTimeout(refreshDigestValue, result.FormDigestTimeoutSeconds * 900);
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
      refreshDigestValue();
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
              } catch (error) {
                reject2(error);
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
        REQUEST: "Request"
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
        isTasker = ko.pureComputed(() => {
          return this.ReqType.Value() == AUDITREQUESTTYPES.TASKER;
        });
        isRequest = ko.pureComputed(() => {
          return this.ReqType.Value() == AUDITREQUESTTYPES.REQUEST;
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
            "7 Days Past Due",
            "7 Days Recurring"
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
      commentChainTemplate = html3`
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
  var commentChainComponentName, CommentChainComponent, CommentChainModule;
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
  var User, currentUser;
  var init_people_manager = __esm({
    "src/services/people_manager.js"() {
      init_entities();
      init_infrastructure();
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
      currentUser = User.Create;
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
          this.ClosedBy.set(currentUser());
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
      init_fields2();
      init_primitives();
      init_entities2();
      init_application_db_context();
      init_entities2();
      init_store();
      AuditBulkResponse = class extends AuditResponse {
        constructor(params) {
          super(params);
        }
        // Title = new TextField({
        //   displayName: "Sample Number",
        // });
        // Comments = new TextAreaField({
        //   displayName: "Comments",
        // });
        // POC = new PeopleField({
        //   displayName: "POC",
        // });
        // POCCC = new PeopleField({
        //   displayName: "POCCC",
        // });
        // ActionOffice = new LookupField({
        //   displayName: "Action Office",
        //   type: AuditOrganization,
        //   options: auditOrganizationStore,
        //   entitySet: appContext.AuditOrganizations,
        // });
        toResponse(request2) {
          const response = new AuditResponse();
          response.fromJSON(this.toJSON());
          return response;
        }
        static Views = {
          All: [
            "ID",
            "Title",
            "SampleNumber",
            "Comments",
            "POC",
            "POCCC",
            "ActionOffice"
          ]
        };
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
        SitePages = new EntitySet(SitePage);
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

  // src/common/utilities.js
  window.Audit = window.Audit || {};
  Audit.Common = Audit.Common || {};
  var loadStart;
  function InitReport() {
    loadStart = /* @__PURE__ */ new Date();
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
    var m_libTitleResponseDocsEA = "AuditResponseDocsRO";
    var m_libNameResponseDocsEA = "AuditResponseDocsRO";
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
    var m_libResponseDocsLibraryGUID = null;
    var m_arrSiteGroups = null;
    var m_arrAOs = null;
    function m_fnRefresh(hard = false) {
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
      const loadTime = (curDate - loadStart) / 1e3;
      document.getElementById(
        "divLoading"
      ).innerHTML = `Loaded at ${curDate.format("MM/dd/yyyy hh:mm tt")}<br/>
    Load time: ${loadTime + "s"}
    `;
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
      const oNewEmailFolder = list.addItem(itemCreateInfo);
      oNewEmailFolder.set_item("Title", requestNumber);
      oNewEmailFolder.update();
      const currentUser2 = web.get_currentUser();
      const ownerGroup = web.get_associatedOwnerGroup();
      const memberGroup = web.get_associatedMemberGroup();
      const visitorGroup = web.get_associatedVisitorGroup();
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
      oNewEmailFolder.get_roleAssignments().getByPrincipal(currentUser2).deleteObject();
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
        for (let i = 0; i < totalDigits - n.length; i++) {
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
      for (var i = 0; i < optLength; i++) {
        if (opts[i].text == text) {
          select.selectedIndex = i;
          return true;
        }
      }
      return false;
    }
    function m_fnGetTagFromIdentifierAndTitle(tagName, identifier, title) {
      var idLength = identifier.length;
      var tags = document.getElementsByTagName(tagName);
      for (var i = 0; i < tags.length; i++) {
        var tagID = tags[i].id;
        if (tags[i].title == title && (identifier == "" || tagID.indexOf(identifier) == tagID.length - idLength)) {
          return tags[i];
        }
      }
      return null;
    }
    function m_fnViewUserManuals(docType) {
      var options = SP.UI.$create_DialogOptions();
      options.title = "User Manual";
      options.height = 250;
      if (docType != null)
        options.url = Audit.Common.Utilities.GetSiteUrl() + "/SitePages/AuditUserManuals.aspx?FilterField1=DocType&FilterValue1=" + docType;
      else
        options.url = Audit.Common.Utilities.GetSiteUrl() + "/SitePages/AuditUserManuals.aspx";
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
        var html4 = "<HTML>\n<HEAD>\n\n<Title>" + pageTitle + "</Title>\n" + cssFileText + "\n<style>.hideOnPrint, .rowFilters {display:none}</style>\n</HEAD>\n<BODY>\n" + divOutput + "\n</BODY>\n</HTML>";
        var printWP = window.open("", "printWebPart");
        printWP.document.open();
        printWP.document.write(html4);
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
      for (var i = 0; i < array.length; i++) {
        line = "";
        var array1 = array[i];
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
      Refresh: m_fnRefresh,
      OnLoadDisplayTimeStamp: m_fnOnLoadDisplayTimeStamp,
      OnLoadDisplayTabAndResponse: m_fnOnLoadDisplayTabAndResponse,
      OnLoadFilterResponses: function(responseStatus1, responseStatus2) {
        m_fnOnLoadFilterResponses(responseStatus1, responseStatus2);
      },
      SetResponseDocLibGUID: function(libGUID) {
        m_libResponseDocsLibraryGUID = libGUID;
      },
      GetResponseDocLibGUID: function() {
        return m_libResponseDocsLibraryGUID;
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

  // src/pages/ao_db/AO_DB_Template.js
  var html = String.raw;
  var _a;
  var aoDbTemplate = html(_a || (_a = __template([`
  <link
    rel="stylesheet"
    type="text/css"
    href="/sites/CGFS-Audits/Style Library/apps/audit/lib/jquery-ui-1.13.2/jquery-ui.theme.min.css"
  />
  <link
    rel="stylesheet"
    type="text/css"
    href="/sites/CGFS-Audits/Style Library/apps/audit/lib/tablesorter-2.31.3/css/theme.default.min.css"
  />
  <!--
  <script
    type="text/javascript"
    src="/sites/CGFS-Audits/Style Library/apps/audit/lib/jquery-3.7.1.min.js"
  ><\/script>
  <script
    type="text/javascript"
    src="/sites/CGFS-Audits/Style Library/apps/audit/lib/jquery-ui-1.13.2/jquery-ui.min.js"
  ><\/script>

  <script
    type="text/javascript"
    src="/sites/CGFS-Audits/Style Library/apps/audit/lib/tablesorter-2.31.3/js/jquery.tablesorter.min.js"
  ><\/script>
  <script
    type="text/javascript"
    src="/sites/CGFS-Audits/Style Library/apps/audit/lib/knockout-3.5.1.js"
  ><\/script>
  -->

  <iframe id="CsvExpFrame" style="display: none"></iframe>

  <div
    id="divCounter"
    style="display: none"
    title="used to auto refresh the page"
  >
    600
  </div>

  <div class="audit">
    <!-- ko with: blockingTasks -->
    <div
      class="tasks blocking dimmer"
      data-bind="css: {'active': $data.length}"
    >
      <span class="loader"></span>
      <ul class="" data-bind="foreach: $data">
        <li data-bind="text: msg + '... ' + Status()"></li>
      </ul>
    </div>
    <!-- /ko -->

    <!-- ko with: runningTasks -->
    <div class="tasks running">
      <ul class="" data-bind="foreach: $data">
        <li data-bind="text: msg + '... ' + Status()"></li>
      </ul>
    </div>
    <!-- /ko -->
    <div id="divLoading" style="color: green; padding-bottom: 10px">
      Please Wait... Loading
      <span
        data-bind="visible: arrResponses().length > 0 && debugMode, text: arrResponses().length"
      ></span>
    </div>
    <div id="divUsersGroups" style="color: green; padding-bottom: 10px"></div>
    <div class="audit-body">
      <div class="reports-container">
        <div id="divRefresh" class="quick-links" style="display: none">
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
              title="View User Manual"
              href="javascript:void(0)"
              onclick="Audit.Common.Utilities.ViewUserManuals('AO User Manual')"
              ><span class="ui-icon ui-icon-help"></span>User Manual</a
            >
          </div>
          <div>
            <a title="Help" href="mailto:cgfsauditrequests@state.gov"
              ><span class="ui-icon ui-icon-mail-closed"></span>Request Help</a
            >
          </div>
        </div>
        <div id="" style="margin-top: 20px">
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
  </div>

  <script type="text/html" id="responseStatusReportTemplate">
    <div id="tabs-0">
      <div
        id="lblStatusReportResponsesMsg"
        style="padding-top: 5px; color: green"
      >
        <span
          data-bind="css: (cntPendingReview() > 0 ? 'ui-icon ui-icon-alert' : 'ui-icon ui-icon-circle-check')"
        ></span
        >There are <span data-bind="text: cntPendingReview"></span> Responses
        pending your review
      </div>
      <div
        id="divButtons"
        style="padding-top: 3px"
        data-bind="visible: arrResponses().length > 0"
      >
        <a
          id="btnPrint1"
          title="Click here to Print"
          href="javascript:void(0)"
          class="hideOnPrint"
          ><span class="ui-icon ui-icon-print">Print</span></a
        >
        <a class="export1 hideOnPrint" title="Export to CSV" href="#"
          ><span class="ui-icon ui-icon-disk">Export to CSV</span></a
        >
        <a
          id="btnViewAll"
          title="View All"
          href="javascript:void(0)"
          data-bind="visible: arrFilteredResponsesCount() < arrResponses().length && doSort, click: ClearFiltersResponseTab"
          ><span class="ui-icon ui-icon-circle-zoomout"></span>View All
          Responses</a
        >
      </div>

      <div id="divStatusReportRespones">
        <table
          id="tblStatusReportResponses"
          class="tablesorter report"
          data-bind="visible: arrResponses().length > 0"
        >
          <thead>
            <tr
              valign="top"
              class="rowFilters"
              data-bind="visible: arrResponses().length > 0"
            >
              <th class="sorter-false filter" nowrap="nowrap">
                <select
                  id="ddlResponseName"
                  data-bind="options: $root.ddOptionsResponseTabResponseTitle, value: filterResponseTabResponseName, optionsCaption: '-Select-'"
                ></select>
              </th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false filter" nowrap="nowrap">
                <select
                  id="ddlResponseRequestInternalDueDate"
                  data-bind="options: $root.ddOptionsResponseTabRequestInternalDueDate, value: filterResponseTabRequestIntDueDate, optionsCaption: '-Select-'"
                ></select>
              </th>
              <th class="sorter-false filter" nowrap="nowrap">
                <select
                  id="ddlResponseStatus"
                  data-bind="options: $root.ddOptionsResponseTabResponseStatus, value: filterResponseTabResponseStatus, optionsCaption: '-Select-'"
                ></select>
              </th>
              <th class="sorter-false"></th>
              <th class="sorter-false"></th>
            </tr>
            <tr valign="top">
              <th class="sorter-true" nowrap="nowrap">Response Name</th>
              <th class="sorter-false" nowrap="nowrap">Response Subject</th>
              <th class="sorter-true" nowrap="nowrap">Due Date</th>
              <th class="sorter-true" nowrap="nowrap">Response Status</th>
              <th class="sorter-true" nowrap="nowrap"># of Documents</th>
              <th class="sorter-true" nowrap="nowrap">Modified</th>
            </tr>
          </thead>
          <tbody id="fbody">
            <!-- ko foreach: arrResponses -->
            <tr
              class="sr-response-item"
              data-bind="css: {'highlighted': highlight}"
            >
              <td class="sr-response-title">
                <a
                  href="javascript:void(0);"
                  title="Go to Response Details"
                  data-bind="text: title,
          click: () => Audit.AOReport.Report.GoToResponse(title)"
                >
                </a>
              </td>
              <td
                class="sr-response-requestSubject"
                data-bind="text: requestSubject"
              ></td>
              <td
                class="sr-response-internalDueDate"
                data-bind="text: internalDueDate"
              ></td>
              <td class="sr-response-status" data-bind="text: status"></td>
              <td class="sr-response-docCount" data-bind="text: docCount"></td>
              <td class="sr-response-modified" data-bind="text: modified"></td>
            </tr>
            <!-- /ko -->
          </tbody>
          <tfoot class="footer">
            <tr>
              <th colspan="6">
                Displaying
                <span
                  id="spanResponsesDisplayedTotal"
                  style="color: green"
                  data-bind="text: arrFilteredResponsesCount()"
                  >0</span
                >
                out of
                <span
                  id="spanResponsesTotal"
                  style="color: green"
                  data-bind="text: arrResponses().length"
                  >0</span
                >
                Responses
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  <\/script>

  <script type="text/html" id="responseDetailTemplate">
    <div id="tabs-1">
      <div style="padding-bottom: 15px">
        <table>
          <tr>
            <td><span>Responses Pending Action:</span></td>
            <td>
              <select
                id="ddlResponsesOpen"
                data-bind="options: $root.ddOptionsResponseInfoTabResponseNameOpen2, value: filterResponseInfoTabResponseNameOpen2, optionsCaption: '-Select-'"
              ></select>
            </td>
          </tr>
          <tr>
            <td><span>Other Responses:</span></td>
            <td>
              <select
                id="ddlResponsesProcessed"
                data-bind="options: $root.ddOptionsResponseInfoTabResponseNameProcessed2, value: filterResponseInfoTabResponseNameProcessed2, optionsCaption: '-Select-'"
              ></select>
            </td>
          </tr>
        </table>
      </div>
      <div class="response-detail-view">
        <div
          id="divResponseInfo"
          class="audit-form response-info-form"
          data-bind="with: currentResponse"
        >
          <div class="form-header">
            <h3 class="uppercase form-title">
              AUDIT RESPONSE DETAILS
              <div class="fw-semibold" data-bind="text: title"></div>
            </h3>
            <!-- <button
          type="button"
          class="btn btn-link form-title"
          data-bind="click: $parent.refreshRequest"
        >
          <i title="Refresh Request" class="fa-solid fa-arrows-rotate"></i>
        </button> -->
          </div>

          <div class="form-row uppercase">
            <dl>
              <dt>Subject</dt>
              <dd>
                <span
                  id="requestInfoSubject"
                  data-bind="text: request.subject"
                ></span>
              </dd>
              <dt>Due Date</dt>
              <dd>
                <span
                  id="requestInfoInternalDueDate"
                  data-bind="text: request.internalDueDate"
                ></span>
              </dd>
            </dl>
            <dl>
              <dt>Response Status</dt>
              <dd>
                <span
                  id="responseInfoStatus"
                  data-bind="style: { color:  resStatus == '7-Closed' ? 'red' : 'green' }"
                >
                  <span data-bind="text: resStatus"></span
                  ><span data-bind="visible: resStatus == '7-Closed'">
                    on <span data-bind="text: closedDate "></span> by
                    <span data-bind="text: closedBy"></span>
                  </span>
                </span>
              </dd>
              <dt>Action Office</dt>
              <dd>
                <span id="responseInfoAO" data-bind="text: actionOffice"></span>
                <span data-bind="visible: poc" style="color: green">POC: </span
                ><span data-bind="text: poc" style="color: green"></span>
              </dd>
              <dt>Related Audit</dt>
              <dd>
                <span
                  id="requestInfoRelatedAudit"
                  data-bind="text: request.relatedAudit"
                ></span>
              </dd>
            </dl>
          </div>
          <div class="form-row uppercase">
            <dl>
              <dt>Action Items</dt>
              <dd>
                <span
                  id="requestInfoActionItems"
                  data-bind="html: request.actionItems"
                ></span>
              </dd>
              <dt>Comments</dt>
              <dd>
                <span
                  id="responseInfoComments"
                  data-bind="html: comments"
                ></span>
              </dd>
            </dl>
          </div>
        </div>

        <div>
          <div id="divCoverSheets" data-bind="visible: currentResponse">
            <fieldset>
              <legend>Cover Sheets/Supplemental Documents</legend>

              <div
                id="divEmptyCoversheetsMsg"
                style="border: 0px !important; font-style: italic"
                data-bind="visible: arrCoverSheets().length <= 0"
              >
                There are 0 cover sheets or supplemental documents
              </div>
              <table
                id="tblCoverSheets"
                class="tablesorter report"
                data-bind="visible: arrCoverSheets().length > 0"
              >
                <thead>
                  <tr valign="top">
                    <th class="sorter-false" nowrap="nowrap">Name</th>
                  </tr>
                </thead>
                <tbody data-bind="foreach: arrCoverSheets">
                  <tr class="coversheet-item">
                    <td class="coversheet-title" title="Click to Download">
                      <a
                        data-bind="attr: { href: 'javascript:void(0)', onclick: link}"
                        ><span data-bind="text: title"></span
                      ></a>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr valign="top">
                    <th nowrap="nowrap">
                      Total:
                      <span
                        id="tblCoverSheetsTotal"
                        data-bind="text: arrCoverSheets().length"
                        >0</span
                      >
                    </th>
                  </tr>
                </tfoot>
              </table>
            </fieldset>
          </div>

          <div
            class="divSubmit"
            data-bind="visible: currentResponse && showSubmit"
          >
            <fieldset style="border-color: GreenYellow">
              <legend style="font-weight: bold; font-size: 11pt">
                SUBMIT RESPONSE
              </legend>
              <div style="padding-top: 15px; padding-bottom: 15px">
                <span class="ui-icon ui-icon-disk"></span
                ><a
                  class="btnSubmitPackage"
                  href="javascript:void(0)"
                  title="Click to Submit the Response Package"
                  data-bind="click: ClickSubmitResponse"
                  >Submit this Response Package</a
                >
              </div>
            </fieldset>
          </div>

          <div id="divResponseDocs" data-bind="visible: currentResponse">
            <fieldset>
              <legend>Response Documents</legend>

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
                    <th class="sorter-false" nowrap="nowrap">Modified</th>
                    <th class="sorter-false" nowrap="nowrap">Modified By</th>
                  </tr>
                </thead>
                <tbody data-bind="with: arrResponseDocs">
                  <tr class="requestInfo-response-doc">
                    <td colspan="10">
                      <img
                        style="background-color: transparent"
                        src="/_layouts/images/minus.gif"
                        title="Expand/Collapse"
                        data-bind="toggleClick: $data, toggleClass: 'collapsed', containerType: 'doc', classContainer: '.requestInfo-response-doc'"
                      /><span data-bind="text: responseTitle"></span>
                    </td>
                  </tr>

                  <!-- ko foreach: responseDocs-->

                  <tr
                    class="requestInfo-response-doc-item"
                    data-bind="style: styleTag"
                  >
                    <td>
                      <img
                        data-bind="attr:{ src: $parent.siteUrl + '/_layouts/images/' + docIcon}"
                      />
                    </td>
                    <td
                      class="requestInfo-response-doc-title"
                      title="Click to Download"
                    >
                      <a
                        data-bind="downloadLink: '../_layouts/download.aspx?SourceUrl=:folder/:fileName'"
                        ><span data-bind="text: fileName"></span
                      ></a>
                      <span
                        style="float: right"
                        data-bind="visible: ($parent.responseStatus == '1-Open' || $parent.responseStatus == '3-Returned to Action Office') && documentStatus == 'Open'"
                      >
                        <a
                          title="Delete Response Document"
                          href="javascript:void(0)"
                          data-bind="click:  $root.ClickMarkForDeletionResponseDoc"
                          ><span class="ui-icon ui-icon-trash"
                            >Delete Response Document</span
                          ></a
                        >
                      </span>
                    </td>
                    <td nowrap data-bind="text: title"></td>
                    <td nowrap data-bind="text: receiptDate"></td>
                    <td nowrap data-bind="text: fileSize"></td>
                    <td
                      class="requestInfo-response-doc-modified"
                      data-bind="text: modifiedDate"
                    ></td>
                    <td
                      class="requestInfo-response-doc-modifiedBy"
                      data-bind="text: modifiedBy"
                    ></td>
                  </tr>

                  <!-- /ko -->
                </tbody>
                <tfoot>
                  <tr valign="top">
                    <th colspan="7" nowrap="nowrap">
                      Total:
                      <span
                        id="tblResponseDocsTotal"
                        data-bind="text: cntResponseDocs"
                        >0</span
                      >
                    </th>
                  </tr>
                </tfoot>
              </table>
              <div class="divUpload" data-bind="visible: showUpload()">
                <label class="file-upload-field">
                  Upload Response Documents:
                  <div class="dropzone" data-bind="">Drop Files Here</div>
                  <input
                    class="file-upload"
                    type="file"
                    multiple
                    data-bind="files: responseDocFiles"
                  />
                </label>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  <\/script>

  <div id="divTest"></div>
`])));

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
    constructor(id2, linkText, template) {
      this.id = id2;
      this.linkText = linkText;
      this.template = template;
    }
  };

  // src/pages/ao_db/ao_db.js
  init_application_db_context();

  // src/services/approvals_service.js
  init_entities2();
  init_application_db_context();

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
        msg: "Ensuring Response Folder Item Permissions: " + responseTitle,
        blocking: true
      };
    },
    ensureResponseDocFolder: (folderName) => {
      return {
        msg: "Ensuring Response Folder: " + folderName,
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

  // src/services/audit_email_service.js
  init_people_manager();
  init_infrastructure();
  init_audit_ro_email_log();

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

  // src/services/audit_request_service.js
  init_store();

  // src/services/audit_response_service.js
  init_entities2();
  init_application_db_context();

  // src/sal/components/modal/modalDialog.js
  init_infrastructure();

  // src/sal/components/modal/ModalDialogTemplate.js
  init_infrastructure();
  var modalDialogTemplate = html3`
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

  // src/services/audit_response_service.js
  init_sal();
  init_validation_error();
  init_people_manager();
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

  // src/services/index.js
  init_people_manager();

  // src/services/legacy_helpers.js
  init_infrastructure();
  async function getAllItems(listTitle, fields = null) {
    let listItemsResults = [];
    let listItems;
    const currCtx = new SP.ClientContext.get_current();
    const web = currCtx.get_web();
    const list = web.get_lists().getByTitle(listTitle);
    const viewFields = viewFieldsStringBuilder(fields);
    const camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml(
      `<View Scope="RecursiveAll"><Query></Query><RowLimit>5000</RowLimit>${viewFields}</View>`
    );
    let position = new SP.ListItemCollectionPosition();
    position.set_pagingInfo("Paged=TRUE&p_ID=1");
    while (position != null) {
      console.log("Legacy Helper - getAllItems", listTitle, position);
      camlQuery.set_listItemCollectionPosition(position);
      listItems = list.getItems(camlQuery);
      currCtx.load(listItems);
      await executeQuery(currCtx).catch((sender, args) => {
        console.warn(sender);
      });
      const listEnumerator = listItems.getEnumerator();
      while (listEnumerator.moveNext()) {
        listItemsResults.push(listEnumerator.get_current());
      }
      position = listItems.get_listItemCollectionPosition();
    }
    return listItemsResults;
  }
  function viewFieldsStringBuilder(fields) {
    if (!fields)
      return "";
    return `
  <ViewFields>${fields.map(
      (field) => `<FieldRef Name="${field}"></FieldRef>`
    )}</ViewFields>
  `;
  }

  // src/pages/ao_db/ao_db.js
  init_knockout_extensions();
  var Audit2 = window.Audit || {};
  Audit2.AOReport = Audit2.AOReport || {};
  var responseParam = "ResNum";
  Audit2.AOReport.Init = function() {
    var paramShowSiteActionsToAnyone = GetUrlKeyValue("ShowSiteActions");
    if (paramShowSiteActionsToAnyone != true) {
      $("#RibbonContainer-TabRowLeft").hide();
      $(".ms-siteactionsmenu").hide();
    }
    function SetTimer() {
      var intervalRefreshID = setInterval(function() {
        var divVal = $("#divCounter").text();
        var count = divVal * 1 - 1;
        $("#divCounter").text(count);
        if (count <= 0) {
          if (!Audit2.AOReport.Report.IsTransactionExecuting())
            Audit2.Common.Utilities.Refresh();
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
  Audit2.AOReport.NewReportPage = function() {
    var m_bigMap = new Object();
    var m_arrRequests = new Array();
    var m_arrResponses = new Array();
    var m_arrPermissions = new Array();
    var m_IA_SPGroupName = null;
    var m_IA_ActionOffice = null;
    var ownerGroup, memberGroup, visitorGroup = null;
    var m_groupColl = null;
    var m_requestItems = null;
    var m_responseItems = null;
    var m_ResponseDocsItems = null;
    var m_aoItems = null;
    var m_responseDocsLibrary = null;
    var m_statusToFilterOn = "";
    var m_curResponseSelectedIsEditableByAO = false;
    var m_bIsTransactionExecuting = false;
    var m_responseStatus1 = "1-Open";
    var m_responseStatus2 = "3-Returned to Action Office";
    function ViewModel() {
      var self = this;
      self.debugMode = ko.observable(false);
      self.siteUrl = Audit2.Common.Utilities.GetSiteUrl();
      self.tabOpts = {
        Responses: new Tab("response-report", "Status Report", {
          id: "responseStatusReportTemplate",
          data: self
        }),
        ResponseDetail: new Tab("response-detail", "Responses", {
          id: "responseDetailTemplate",
          data: self
        })
      };
      self.tabs = new TabsModule(Object.values(self.tabOpts));
      self.runningTasks = runningTasks;
      self.blockingTasks = blockingTasks;
      self.arrResponses = ko.observableArray(null);
      self.arrFilteredResponsesCount = ko.observable(0);
      self.cntPendingReview = ko.observable(0);
      self.ddOptionsResponseTabRequestID = ko.observableArray();
      self.ddOptionsResponseTabRequestStatus = ko.observableArray();
      self.ddOptionsResponseTabRequestInternalDueDate = ko.observableArray();
      self.ddOptionsResponseTabRequestSample = ko.observableArray();
      self.ddOptionsResponseTabResponseTitle = ko.observableArray();
      self.ddOptionsResponseTabResponseStatus = ko.observableArray();
      self.filterResponseTabRequestIntDueDate = ko.observable();
      self.filterResponseTabResponseName = ko.observable();
      self.filterResponseTabResponseStatus = ko.observable();
      self.doSort = ko.observable(false);
      self.ddOptionsResponseInfoTabResponseNameOpen2 = ko.observableArray();
      self.ddOptionsResponseInfoTabResponseNameProcessed2 = ko.observableArray();
      self.filterResponseInfoTabResponseNameOpen2 = ko.observable("");
      self.filterResponseInfoTabResponseNameProcessed2 = ko.observable("");
      self.currentResponse = ko.observable();
      self.arrCoverSheets = ko.observableArray(null);
      self.arrResponseDocs = ko.observable(null);
      self.cntResponseDocs = ko.observable(0);
      self.responseDocFiles = ko.observableArray();
      self.showUpload = ko.observable(false);
      self.showSubmit = ko.observable(false);
      self.refresh = () => window.location.reload();
      self.onNewResponseDocCallback = self.refresh;
      self.currentResponse.subscribe((newResponse) => {
        if (!newResponse)
          return;
        setUrlParam(responseParam, newResponse.title);
      });
      self.selectedFiltersResponseTab = ko.computed(function() {
        var requestIntDueDate = self.filterResponseTabRequestIntDueDate();
        var responseName = self.filterResponseTabResponseName();
        var responseStatus = self.filterResponseTabResponseStatus();
        return requestIntDueDate + " " + responseName + " " + responseStatus;
      });
      self.ClearFiltersResponseTab = function() {
        self.filterResponseTabRequestIntDueDate("");
        self.filterResponseTabResponseName("");
        self.filterResponseTabResponseStatus("");
      };
      self.FilterChangedResponseTab = function() {
        document.body.style.cursor = "wait";
        setTimeout(function() {
          var requestIntDueDate = self.filterResponseTabRequestIntDueDate();
          var responseName = self.filterResponseTabResponseName();
          var responseStatus = self.filterResponseTabResponseStatus();
          if (!requestIntDueDate && !responseName && !responseStatus) {
            $(".sr-response-item").show();
            self.arrFilteredResponsesCount(self.arrResponses().length);
            document.body.style.cursor = "default";
            return;
          }
          requestIntDueDate = !requestIntDueDate ? "" : requestIntDueDate;
          responseName = !responseName ? "" : responseName;
          responseStatus = !responseStatus ? "" : responseStatus;
          var count = 0;
          var eacher = $(".sr-response-item");
          eacher.each(function() {
            var hide = false;
            if (!hide && requestIntDueDate != "" && $.trim($(this).find(".sr-response-internalDueDate").text()) != requestIntDueDate)
              hide = true;
            if (!hide && responseName != "" && $.trim($(this).find(".sr-response-title").text()) != responseName)
              hide = true;
            if (!hide && responseStatus != "" && $.trim($(this).find(".sr-response-status").text()) != responseStatus)
              hide = true;
            if (hide)
              $(this).hide();
            else {
              $(this).show();
              count++;
            }
          });
          self.arrFilteredResponsesCount(count);
          document.body.style.cursor = "default";
        }, 100);
      };
      self.ClickSubmitResponse = function() {
        m_fnSubmitPackage();
      };
      self.ClickUploadResponseDoc = function() {
        var oResponse = self.currentResponse();
        if (oResponse && oResponse.number && oResponse.title)
          m_fnUploadResponseDoc(oResponse.number, oResponse.title);
      };
      self.ClickMarkForDeletionResponseDoc = function(oResponseDoc) {
        if (oResponseDoc && oResponseDoc.ID)
          m_fnMarkForDeletionResponseDoc(oResponseDoc.ID);
      };
      self.selectedFiltersResponseTab.subscribe(function(value) {
        self.FilterChangedResponseTab();
      });
      self.doSort.subscribe(function(newValue) {
        Audit2.Common.Utilities.OnLoadDisplayTimeStamp();
        if (self.arrResponses().length > 0 && newValue) {
          self.arrFilteredResponsesCount(self.arrResponses().length);
          ko.utils.arrayPushAll(
            self.ddOptionsResponseTabResponseStatus(),
            self.GetDDVals("status")
          );
          self.ddOptionsResponseTabResponseStatus.valueHasMutated();
          ko.utils.arrayPushAll(
            self.ddOptionsResponseInfoTabResponseNameOpen2(),
            self.GetDDVals2("1", true)
          );
          self.ddOptionsResponseInfoTabResponseNameOpen2.valueHasMutated();
          ko.utils.arrayPushAll(
            self.ddOptionsResponseInfoTabResponseNameProcessed2(),
            self.GetDDVals2("0", true)
          );
          self.ddOptionsResponseInfoTabResponseNameProcessed2.valueHasMutated();
          ko.utils.arrayPushAll(
            self.ddOptionsResponseTabRequestInternalDueDate(),
            self.GetDDVals("internalDueDate")
          );
          self.ddOptionsResponseTabRequestInternalDueDate.valueHasMutated();
          ko.utils.arrayPushAll(
            self.ddOptionsResponseTabResponseTitle(),
            self.GetDDVals("title", true)
          );
          self.ddOptionsResponseTabResponseTitle.valueHasMutated();
          setTimeout(function() {
            var paramTabIndex = GetUrlKeyValue("Tab");
            if (paramTabIndex != null && paramTabIndex != "") {
              self.tabs.selectById(paramTabIndex);
            } else {
              self.tabs.selectById(self.tabOpts.Responses.id);
            }
            if (paramTabIndex == null || paramTabIndex == "" || paramTabIndex == 0) {
              if (self.cntPendingReview() > 0) {
                SP.UI.Notify.addNotification(
                  "<div style='text-align:left'>There are <b>" + self.cntPendingReview() + "</b> Responses pending your review/action. <br/> <br/> Please click on the links in the <b>Response Name</b> column of the <b>Status Report tab</b> <br/> to access each response and upload documents and submit the package.</div>",
                  false
                );
              }
            }
            var paramResponseNum = GetUrlKeyValue("ResNum");
            if (paramResponseNum != null && paramResponseNum != "") {
              if (paramTabIndex == 0) {
                if ($("#ddlResponseName option[value='" + paramResponseNum + "']").length > 0)
                  _myViewModel.filterResponseTabResponseName(paramResponseNum);
              } else {
                if ($("#ddlResponsesOpen option[value='" + paramResponseNum + "']").length > 0)
                  _myViewModel.filterResponseInfoTabResponseNameOpen2(
                    paramResponseNum
                  );
                else if ($(
                  "#ddlResponsesProcessed option[value='" + paramResponseNum + "']"
                ).length > 0)
                  _myViewModel.filterResponseInfoTabResponseNameProcessed2(
                    paramResponseNum
                  );
              }
            }
            BindHandlersOnLoad();
            self.filterResponseTabResponseStatus(m_statusToFilterOn);
            $("#tblStatusReportResponses").tablesorter({
              sortList: [[2, 0]],
              selectorHeaders: ".sorter-true"
            });
          }, 200);
        }
      });
      self.filterResponseInfoTabResponseNameOpen2.subscribe(function(newValue) {
        self.filterResponseInfoTabResponseName(newValue, true);
      });
      self.filterResponseInfoTabResponseNameProcessed2.subscribe(function(newValue) {
        self.filterResponseInfoTabResponseName(newValue, false);
      });
      self.filterResponseInfoTabResponseName = function(newValue, bOpenResponses) {
        self.currentResponse(null);
        self.arrCoverSheets([]);
        self.arrResponseDocs(null);
        self.cntResponseDocs(0);
        m_curResponseSelectedIsEditableByAO = false;
        var oResponse = m_bigMap["response-" + newValue];
        if (oResponse) {
          if (bOpenResponses)
            self.filterResponseInfoTabResponseNameProcessed2("");
          else
            self.filterResponseInfoTabResponseNameOpen2("");
          self.currentResponse(oResponse);
          LoadTabResponseInfoCoverSheets(oResponse);
          LoadTabResponseInfoResponseDocs(oResponse);
          if (bOpenResponses)
            m_curResponseSelectedIsEditableByAO = true;
        }
      };
      self.responseDocFiles.subscribe(async function(files) {
        if (!files.length)
          return;
        const resId = self.currentResponse()?.ID;
        if (!resId)
          return;
        const response = await appContext.AuditResponses.FindById(resId);
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
        self.responseDocFiles.removeAll();
        self.onNewResponseDocCallback();
      });
      self.GetDDVals = function(fieldName, sortAsResponse) {
        var types = ko.utils.arrayMap(self.arrResponses(), function(item) {
          return item[fieldName];
        });
        var ddArr = ko.utils.arrayGetDistinctValues(types).sort();
        if (sortAsResponse)
          ddArr.sort(Audit2.Common.Utilities.SortResponseTitles);
        if (ddArr[0] == "")
          ddArr.shift();
        return ddArr;
      };
      self.GetDDVals2 = function(responseStatusType, sortAsResponse) {
        var types = ko.utils.arrayMap(self.arrResponses(), function(item) {
          var requestStatus = item.requestStatus;
          var responseStatus = item.status;
          if (responseStatusType == 0) {
            if (responseStatus != m_responseStatus1 && responseStatus != m_responseStatus2)
              return item["title"];
            else
              return "";
          } else if (responseStatusType == 1) {
            if ((responseStatus == m_responseStatus1 || responseStatus == m_responseStatus2) && (requestStatus == "Open" || requestStatus == "ReOpened"))
              return item["title"];
            else
              return "";
          }
        });
        var ddArr = ko.utils.arrayGetDistinctValues(types).sort();
        if (sortAsResponse)
          ddArr.sort(Audit2.Common.Utilities.SortResponseTitles);
        if (ddArr[0] == "")
          ddArr.shift();
        return ddArr;
      };
    }
    var _myViewModel = new ViewModel();
    ko.applyBindings(_myViewModel);
    LoadInfo();
    async function LoadInfo() {
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      const m_currentUser = web.get_currentUser();
      currCtx.load(m_currentUser);
      var requestList = web.get_lists().getByTitle(Audit2.Common.Utilities.GetListTitleRequests());
      var requestQuery = new SP.CamlQuery();
      requestQuery.set_viewXml(
        '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'
      );
      m_requestItems = requestList.getItems(requestQuery);
      currCtx.load(
        m_requestItems,
        "Include(ID, Title, ReqSubject, ReqStatus, InternalDueDate, ActionOffice, RelatedAudit, ActionItems, Comments, EmailSent, ClosedDate)"
      );
      await Promise.all([
        getAllItems(Audit2.Common.Utilities.GetListTitleResponses(), [
          "ID",
          "Title",
          "ReqNum",
          "ActionOffice",
          "ReturnReason",
          "SampleNumber",
          "ResStatus",
          "Comments",
          "Modified",
          "ClosedDate",
          "ClosedBy",
          "POC"
        ]).then((result) => m_responseItems = result),
        getAllItems(Audit2.Common.Utilities.GetLibTitleResponseDocs(), [
          "ID",
          "Title",
          "ReqNum",
          "ResID",
          "DocumentStatus",
          "ReceiptDate",
          "FileLeafRef",
          "FileDirRef",
          "File_x0020_Size",
          "Modified",
          "Editor"
        ]).then((result) => m_ResponseDocsItems = result)
      ]);
      var aoList = web.get_lists().getByTitle(Audit2.Common.Utilities.GetListTitleActionOffices());
      var aoQuery = new SP.CamlQuery();
      aoQuery.set_viewXml(
        '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'
      );
      m_aoItems = aoList.getItems(aoQuery);
      currCtx.load(m_aoItems, "Include(ID, Title, UserGroup)");
      m_responseDocsLibrary = currCtx.get_web().get_lists().getByTitle(Audit2.Common.Utilities.GetLibTitleResponseDocs());
      currCtx.load(m_responseDocsLibrary, "Title", "Id");
      ownerGroup = web.get_associatedOwnerGroup();
      memberGroup = web.get_associatedMemberGroup();
      visitorGroup = web.get_associatedVisitorGroup();
      currCtx.load(ownerGroup);
      currCtx.load(memberGroup);
      currCtx.load(visitorGroup);
      m_groupColl = web.get_siteGroups();
      currCtx.load(m_groupColl);
      currCtx.executeQueryAsync(OnSuccess, OnFailure);
      function OnSuccess(sender, args) {
        $("#divRefresh").show();
        m_fnLoadData();
      }
      function OnFailure(sender, args) {
        $("#divRefresh").hide();
        $("#divLoading").hide();
        const statusId2 = SP.UI.Status.addStatus(
          "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
        );
        SP.UI.Status.setStatusPriColor(statusId2, "red");
      }
    }
    function m_fnLoadData() {
      Audit2.Common.Utilities.LoadSiteGroups(m_groupColl);
      LoadLibGUIDS();
      Audit2.Common.Utilities.LoadActionOffices(m_aoItems);
      if (memberGroup != null)
        m_IA_SPGroupName = memberGroup.get_title();
      if (m_IA_SPGroupName == null || m_IA_SPGroupName == "") {
        const statusId2 = SP.UI.Status.addStatus(
          "Unable to retrieve the IA SharePoint Group. Please contact the Administrator"
        );
        SP.UI.Status.setStatusPriColor(statusId2, "red");
        return;
      }
      m_IA_ActionOffice = Audit2.Common.Utilities.GetActionOffices()?.find(
        (ao) => ao.userGroup == m_IA_SPGroupName
      );
      LoadRequests();
      LoadResponses();
      LoadResponseDocs();
      LoadTabStatusReport(m_arrResponses, "fbody");
    }
    function LoadLibGUIDS() {
      Audit2.Common.Utilities.SetResponseDocLibGUID(
        m_responseDocsLibrary.get_id()
      );
    }
    function LoadRequests() {
      m_bigMap = new Object();
      m_arrRequests = new Array();
      var cnt = 0;
      var listItemEnumerator = m_requestItems.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        var emailSent = oListItem.get_item("EmailSent");
        if (!emailSent)
          continue;
        var id2 = oListItem.get_item("ID");
        var number = oListItem.get_item("Title");
        var status = oListItem.get_item("ReqStatus");
        var subject = oListItem.get_item("ReqSubject");
        if (subject == null)
          subject = "";
        var arrActionOffice = oListItem.get_item("ActionOffice");
        var actionOffice = "";
        for (var x = 0; x < arrActionOffice.length; x++) {
          actionOffice += "<div>" + arrActionOffice[x].get_lookupValue() + "</div>";
        }
        var comments = oListItem.get_item("Comments");
        var relatedAudit = oListItem.get_item("RelatedAudit");
        var actionItems = oListItem.get_item("ActionItems");
        if (comments == null)
          comments = "";
        if (relatedAudit == null)
          relatedAudit = "";
        if (actionItems == null)
          actionItems = "";
        var internalDueDate = oListItem.get_item("InternalDueDate");
        var closedDate = oListItem.get_item("ClosedDate");
        internalDueDate != null ? internalDueDate = internalDueDate.format("MM/dd/yyyy") : internalDueDate = "";
        closedDate != null ? closedDate = closedDate.format("MM/dd/yyyy") : closedDate = "";
        var requestObject = new Object();
        requestObject["ID"] = id2;
        requestObject["number"] = number;
        requestObject["subject"] = subject;
        requestObject["status"] = status;
        requestObject["internalDueDate"] = internalDueDate;
        requestObject["actionOffice"] = actionOffice;
        requestObject["comments"] = comments;
        requestObject["relatedAudit"] = relatedAudit;
        requestObject["actionItems"] = actionItems;
        requestObject["emailSent"] = emailSent;
        requestObject["closedDate"] = closedDate;
        requestObject["responses"] = new Array();
        requestObject["arrIndex"] = cnt;
        m_arrRequests.push(requestObject);
        m_bigMap["request-" + number] = requestObject;
        cnt++;
      }
    }
    function LoadResponses() {
      m_arrResponses = new Array();
      var cnt = 0;
      for (const oListItem of m_responseItems) {
        var number = oListItem.get_item("ReqNum");
        if (number != null) {
          number = number.get_lookupValue();
          var responseObject = new Object();
          responseObject["request"] = m_bigMap["request-" + number];
          if (!responseObject.request || !responseObject.request.emailSent)
            continue;
          responseObject["actionOffice"] = oListItem.get_item("ActionOffice");
          if (responseObject["actionOffice"] == null)
            responseObject["actionOffice"] = "";
          else
            responseObject["actionOffice"] = responseObject["actionOffice"].get_lookupValue();
          if (responseObject["actionOffice"] == "")
            continue;
          responseObject["poc"] = oListItem.get_item("POC");
          if (responseObject["poc"] == null)
            responseObject["poc"] = "";
          else
            responseObject["poc"] = responseObject["poc"].get_lookupValue();
          responseObject["ID"] = oListItem.get_item("ID");
          responseObject["number"] = number;
          var title = oListItem.get_item("Title");
          responseObject["title"] = title;
          responseObject["resStatus"] = oListItem.get_item("ResStatus");
          if (responseObject.request.status == "Closed" || responseObject.request.status == "Canceled")
            responseObject["resStatus"] = "7-Closed";
          var modifiedDate = oListItem.get_item("Modified");
          var closedDate = oListItem.get_item("ClosedDate");
          modifiedDate != null ? modifiedDate = modifiedDate.format("MM/dd/yyyy hh:mm tt") : modifiedDate = "";
          closedDate != null ? closedDate = closedDate.format("MM/dd/yyyy") : closedDate = "";
          responseObject["modified"] = modifiedDate;
          responseObject["closedDate"] = closedDate;
          responseObject["closedBy"] = Audit2.Common.Utilities.GetFriendlyDisplayName(oListItem, "ClosedBy");
          responseObject["sample"] = oListItem.get_item("SampleNumber");
          if (responseObject["sample"] == null)
            responseObject["sample"] = "";
          var comments = oListItem.get_item("Comments");
          if (comments == null)
            comments = "";
          responseObject["comments"] = comments;
          var returnReason = oListItem.get_item("ReturnReason");
          if (returnReason == null)
            returnReason = "";
          responseObject["returnReason"] = returnReason;
          responseObject["responseDocs"] = new Array();
          responseObject["coversheets"] = new Array();
          responseObject["arrIndex"] = cnt;
          m_arrResponses.push(responseObject);
          m_bigMap["response-" + title] = responseObject;
          cnt++;
        }
      }
    }
    function LoadResponseDocs() {
      for (var oListItem of m_ResponseDocsItems) {
        const responseDocID = oListItem.get_item("ID");
        var requestNumber = oListItem.get_item("ReqNum");
        if (requestNumber != null)
          requestNumber = requestNumber.get_lookupValue();
        var responseID = oListItem.get_item("ResID");
        if (responseID != null)
          responseID = responseID.get_lookupValue();
        if (requestNumber == null || responseID == null)
          continue;
        if (oListItem.get_item("DocumentStatus") == "Marked for Deletion") {
        } else {
          try {
            var bigMapItem = m_bigMap["response-" + responseID];
            var indexOfArrResponses = bigMapItem.arrIndex;
            var oResponse = m_arrResponses[indexOfArrResponses];
            if (oResponse) {
              var responseDocObject = new Object();
              responseDocObject["ID"] = oListItem.get_item("ID");
              responseDocObject["title"] = oListItem.get_item("Title");
              if (responseDocObject["title"] == null)
                responseDocObject["title"] = "";
              responseDocObject["fileName"] = oListItem.get_item("FileLeafRef");
              responseDocObject["folder"] = oListItem.get_item("FileDirRef");
              responseDocObject["documentStatus"] = oListItem.get_item("DocumentStatus");
              var fileSize = oListItem.get_item("File_x0020_Size");
              fileSize = Audit2.Common.Utilities.GetFriendlyFileSize(fileSize);
              responseDocObject["fileSize"] = fileSize;
              var receiptDate = "";
              if (oListItem.get_item("ReceiptDate") != null && oListItem.get_item("ReceiptDate") != "")
                receiptDate = oListItem.get_item("ReceiptDate").format("MM/dd/yyyy");
              responseDocObject["receiptDate"] = receiptDate;
              var modifiedDate = "";
              if (oListItem.get_item("Modified") != null && oListItem.get_item("Modified") != "")
                modifiedDate = oListItem.get_item("Modified").format("MM/dd/yyyy hh:mm tt");
              responseDocObject["modifiedDate"] = modifiedDate;
              responseDocObject["modifiedBy"] = Audit2.Common.Utilities.GetFriendlyDisplayName(
                oListItem,
                "Editor"
              );
              oResponse["responseDocs"].push(responseDocObject);
            }
          } catch (err) {
          }
        }
      }
    }
    function LoadTabStatusReport(arr, fbody) {
      if (arr == null)
        return;
      var responseArr = new Array();
      var arrResponseTitle = new Array();
      var arrResponseInternalDueDate = new Array();
      var arrResponseStatus = new Array();
      var count = 0;
      var resStatus1 = 0;
      var resStatus2 = 0;
      var arrlength = arr.length;
      while (arrlength--) {
        var oResponse = arr[arrlength];
        var responseTitle = oResponse.title;
        var highlight = false;
        var responseStatus = oResponse.resStatus;
        if (responseStatus == m_responseStatus1 || responseStatus == m_responseStatus2) {
          count++;
          if (responseStatus == m_responseStatus1)
            resStatus1++;
          else
            resStatus2++;
          highlight = true;
        }
        var aResponse = {
          title: responseTitle,
          requestSubject: oResponse.request.subject,
          requestStatus: oResponse.request.status,
          internalDueDate: oResponse.request.internalDueDate,
          status: responseStatus,
          docCount: oResponse.responseDocs.length,
          modified: oResponse.modified,
          highlight,
          visibleRow: ko.observable(true)
        };
        responseArr.push(aResponse);
      }
      if (responseArr.length > 0) {
        m_statusToFilterOn = "";
        if (resStatus1 > 0 && resStatus2 == 0)
          m_statusToFilterOn = m_responseStatus1;
        else if (resStatus2 > 0 && resStatus1 == 0)
          m_statusToFilterOn = m_responseStatus2;
        _myViewModel.cntPendingReview(count);
        ko.utils.arrayPushAll(_myViewModel.arrResponses, responseArr);
      }
      _myViewModel.doSort(true);
    }
    function LoadTabResponseInfoCoverSheets(oResponse) {
      _myViewModel.arrCoverSheets([]);
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      var coverSheetLib = web.get_lists().getByTitle(Audit2.Common.Utilities.GetLibTitleCoverSheets());
      var coverSheetQuery = new SP.CamlQuery();
      coverSheetQuery.set_viewXml(
        '<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="ReqNum"/><Value Type="Text">' + oResponse.request.number + "</Value></Eq></Where></Query></View>"
      );
      const m_subsetCoverSheetItems = coverSheetLib.getItems(coverSheetQuery);
      currCtx.load(
        m_subsetCoverSheetItems,
        "Include(ID, Title, ReqNum, ActionOffice, FileLeafRef, FileDirRef)"
      );
      var data2 = { oResponse };
      function OnSuccess(sender, args) {
        var arrCS = new Array();
        var listItemEnumerator = m_subsetCoverSheetItems.getEnumerator();
        while (listItemEnumerator.moveNext()) {
          var oListItem = listItemEnumerator.get_current();
          if (oListItem.get_item("ActionOffice") != null) {
            var arrActionOffice = oListItem.get_item("ActionOffice");
            if (arrActionOffice.length > 0) {
              for (var y = 0; y < arrActionOffice.length; y++) {
                var curActionOffice = arrActionOffice[y].get_lookupValue();
                if (curActionOffice == this.oResponse.actionOffice) {
                  var csFolder = oListItem.get_item("FileDirRef");
                  var csTitle = oListItem.get_item("FileLeafRef");
                  var encodedTitle = csTitle.replace(/'/g, "&#39");
                  arrCS.push({
                    folder: csFolder,
                    title: csTitle,
                    link: "STSNavigate('../_layouts/download.aspx?SourceUrl=" + csFolder + "/" + encodedTitle + "')"
                  });
                  break;
                }
              }
            }
          }
        }
        ko.utils.arrayPushAll(_myViewModel.arrCoverSheets(), arrCS);
        _myViewModel.arrCoverSheets.valueHasMutated();
      }
      function OnFailure(sender, args) {
      }
      currCtx.executeQueryAsync(
        Function.createDelegate(data2, OnSuccess),
        Function.createDelegate(data2, OnFailure)
      );
    }
    function LoadTabResponseInfoResponseDocs(oResponse) {
      _myViewModel.arrResponseDocs(null);
      _myViewModel.cntResponseDocs(0);
      _myViewModel.showUpload(false);
      _myViewModel.showSubmit(false);
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      for (var z = 0; z < oResponse.responseDocs.length; z++) {
        var oResponseDoc = oResponse.responseDocs[z];
        oResponseDoc["docIcon"] = web.mapToIcon(
          oResponseDoc.fileName,
          "",
          SP.Utilities.IconSize.Size16
        );
      }
      function OnSuccess(sender, args) {
        RenderResponses(oResponse);
      }
      function OnFailure(sender, args) {
        const statusId2 = SP.UI.Status.addStatus(
          "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
        );
        SP.UI.Status.setStatusPriColor(statusId2, "red");
      }
      currCtx.executeQueryAsync(OnSuccess, OnFailure);
      function RenderResponses(oResponse2) {
        var rowCount = 0;
        var cntAddedByAO = 0;
        var arrResponseDocs = new Array();
        for (var z2 = 0; z2 < oResponse2.responseDocs.length; z2++) {
          var oResponseDoc2 = oResponse2.responseDocs[z2];
          oResponseDoc2.docIcon = oResponseDoc2.docIcon.get_value();
          oResponseDoc2.styleTag = Audit2.Common.Utilities.GetResponseDocStyleTag2(
            oResponseDoc2.documentStatus
          );
          oResponseDoc2.responseTitle = oResponse2.title;
          if (oResponseDoc2.documentStatus == "Open" && (oResponse2.resStatus == m_responseStatus1 || oResponse2.resStatus == m_responseStatus2))
            cntAddedByAO++;
          arrResponseDocs.push(oResponseDoc2);
        }
        if (m_curResponseSelectedIsEditableByAO) {
          _myViewModel.showUpload(true);
          if (cntAddedByAO > 0)
            _myViewModel.showSubmit(true);
        }
        var arrResponseSummary = {
          responseTitle: oResponse2.title,
          responseDocs: arrResponseDocs,
          responseStatus: oResponse2.resStatus
        };
        _myViewModel.arrResponseDocs(arrResponseSummary);
        _myViewModel.arrResponseDocs.valueHasMutated();
        _myViewModel.cntResponseDocs(oResponse2.responseDocs.length);
        if (oResponse2.resStatus == m_responseStatus2 && oResponse2.returnReason != null && oResponse2.returnReason != "") {
          if (m_curResponseSelectedIsEditableByAO && cntAddedByAO == 0) {
            var waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
              "Notice - Response Needs to be Updated",
              "<span style=''><span class='ui-icon ui-icon-alert'></span>Response Return Reason: <span style='font-weight:bold; color:red;'>" + oResponse2.returnReason + "</span></span>",
              100,
              500
            );
            setTimeout(function() {
              waitDialog.close();
            }, 5e3);
          }
        }
        if (oResponse2.resStatus == "1-Open" || oResponse2.resStatus == "3-Returned to Action Office") {
          if (m_curResponseSelectedIsEditableByAO && cntAddedByAO > 0) {
            let resetColor = function() {
              $(".btnSubmitPackage").parent().css({ "background-color": "inherit", "font-weight": "inherit" });
            };
            const notifyId2 = SP.UI.Notify.addNotification(
              "<div style='text-align:left'>Response documents have been added. <br/><br/>Your package <span style='font-weight:bold; color:red'>has not yet been submitted</span>. <br></br>Please review your documents and click on the link <b>SUBMIT this Response Package</b> below</div>",
              false
            );
            $(".btnSubmitPackage").parent().css({ "background-color": "yellow", "font-weight": "inherit" });
            $(".btnSubmitPackage").get(0).scrollIntoView();
            setTimeout(function() {
              resetColor();
            }, 2e3);
          } else if (m_curResponseSelectedIsEditableByAO && cntAddedByAO == 0) {
            const notifyId2 = SP.UI.Notify.addNotification(
              "<div style='text-align:left'>Please review the Response Information and any CoverSheets/Supplemental Documents. <br/><br/>Then, click the link to <span style='font-weight:bold; color:gree'>Upload Response Documents</span> pertaining to this Response</div>",
              false
            );
          }
        }
      }
    }
    function m_fnFormatEmailBodyToIAFromAO(oRequest, responseTitle) {
      var emailText = "<div>Audit Request Reference: <b>{REQUEST_NUMBER}</b></div><div>Audit Request Subject: <b>{REQUEST_SUBJECT}</b></div><div>Audit Request Due Date: <b>{REQUEST_DUEDATE}</b></div><br/><div>Below is the Response that was submitted: </div><div>{RESPONSE_TITLE}</div>";
      emailText = emailText.replace("{REQUEST_NUMBER}", oRequest.number);
      emailText = emailText.replace("{REQUEST_SUBJECT}", oRequest.subject);
      emailText = emailText.replace(
        "{REQUEST_DUEDATE}",
        oRequest.internalDueDate
      );
      var responseTitleBody = "<ul><li>" + responseTitle + "</li></ul>";
      emailText = emailText.replace("{RESPONSE_TITLE}", responseTitleBody);
      return emailText;
    }
    function m_fnUploadResponseDoc(requestID, responseID) {
      m_bIsTransactionExecuting = true;
      var waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
        "Loading...",
        "<span style='font-size:11pt'><span class='ui-icon ui-icon-info'></span>If you are uploading <span style='font-weight:bold; color:green;text-decoration:underline'>multiple</span> documents, please <span style='font-weight:bold; color:green;text-decoration:underline'>zip </span> them.</span>",
        100,
        600
      );
      setTimeout(function() {
        waitDialog.close();
        var options = SP.UI.$create_DialogOptions();
        options.title = "Upload Response Document to: " + responseID;
        options.dialogReturnValueCallback = OnCallbackForm;
        var rootFolder = Audit2.Common.Utilities.GetSiteUrl() + "/" + Audit2.Common.Utilities.GetLibNameResponseDocs() + "/" + responseID;
        options.url = Audit2.Common.Utilities.GetSiteUrl() + "/_layouts/Upload.aspx?List={" + Audit2.Common.Utilities.GetResponseDocLibGUID() + "}&RootFolder=" + rootFolder + "&ReqNum=" + requestID + "&ResID=" + responseID;
        SP.UI.ModalDialog.showModalDialog(options);
      }, 3e3);
    }
    function OnCallbackForm(result, value) {
      if (result === SP.UI.DialogResult.OK) {
        Audit2.Common.Utilities.Refresh();
      } else
        m_bIsTransactionExecuting = false;
    }
    function m_fnSubmitPackage() {
      var responseToSubmit = $("#ddlResponsesOpen").val();
      if (confirm(
        "Are you sure you would like to submit these response documents? Note: You will NOT be able to make changes or upload any more documents after you submit this package."
      )) {
        let OnSuccessLoadedResponseDocs = function(sender, args) {
          var ctOpenResponseDocs = 0;
          if (responseDocOpenItems != null) {
            var listItemEnumerator = responseDocOpenItems.getEnumerator();
            while (listItemEnumerator.moveNext()) {
              var oListItem = listItemEnumerator.get_current();
              oListItem.set_item("DocumentStatus", "Submitted");
              oListItem.update();
              ctOpenResponseDocs++;
            }
          }
          if (ctOpenResponseDocs == 0) {
            const notifyId2 = SP.UI.Notify.addNotification(
              "Please upload a Response document.",
              false
            );
            m_waitDialog.close();
            return;
          }
          var oRequest = null;
          try {
            var bigMapItem = m_bigMap["response-" + responseToSubmit];
            var indexOfArrResponses = bigMapItem.arrIndex;
            const oResponse = m_arrResponses[indexOfArrResponses];
            if (oResponse) {
              oRequest = oResponse.request;
              var responseList = currCtx.get_web().get_lists().getByTitle(Audit2.Common.Utilities.GetListTitleResponses());
              const responseItem = responseList.getItemById(oResponse.ID);
              responseItem.set_item("ResStatus", "2-Submitted");
              responseItem.update();
            }
          } catch (err) {
            alert(err);
            Audit2.Common.Utilities.Refresh();
          }
          if (oRequest == null) {
            m_waitDialog.close();
            return;
          }
          var emailSubject = "A Response has been Submitted by an Action Office: " + oRequest.number;
          var emailText = m_fnFormatEmailBodyToIAFromAO(
            oRequest,
            responseToSubmit
          );
          var itemCreateInfo = new SP.ListItemCreationInformation();
          itemCreateInfo.set_folderUrl(
            location.protocol + "//" + location.host + Audit2.Common.Utilities.GetSiteUrl() + "/Lists/" + Audit2.Common.Utilities.GetListNameEmailHistory() + "/" + oRequest.number
          );
          oListItem = emailList.addItem(itemCreateInfo);
          oListItem.set_item("Title", emailSubject);
          oListItem.set_item("Body", emailText);
          oListItem.set_item("To", m_IA_ActionOffice.title);
          oListItem.set_item("ReqNum", oRequest.number);
          oListItem.set_item("ResID", responseToSubmit);
          oListItem.set_item("NotificationType", "IA Notification");
          oListItem.update();
          function OnSuccessUpdateResponse(sender2, args2) {
            document.body.style.cursor = "default";
            m_waitDialog.close();
            Audit2.Common.Utilities.Refresh();
          }
          function OnFailureUpdateResponse(sender2, args2) {
            m_waitDialog.close();
            const statusId2 = SP.UI.Status.addStatus(
              "Request failed: " + args2.get_message() + "\n" + args2.get_stackTrace()
            );
            SP.UI.Status.setStatusPriColor(statusId2, "red");
          }
          currCtx.executeQueryAsync(
            OnSuccessUpdateResponse,
            OnFailureUpdateResponse
          );
        }, OnFailureLoadedResponseDocs = function(sender, args) {
          m_waitDialog.close();
          const statusId2 = SP.UI.Status.addStatus(
            "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
          );
          SP.UI.Status.setStatusPriColor(statusId2, "red");
        };
        m_bIsTransactionExecuting = true;
        const m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
          "Submitting Response",
          "Please wait... Submitting Response",
          200,
          400
        );
        var currCtx = new SP.ClientContext.get_current();
        var web = currCtx.get_web();
        var folderPath = Audit2.Common.Utilities.GetSiteUrl() + "/" + Audit2.Common.Utilities.GetLibNameResponseDocs() + "/" + responseToSubmit;
        var responseDocLib = web.get_lists().getByTitle(Audit2.Common.Utilities.GetLibTitleResponseDocs());
        var responseDocQuery = new SP.CamlQuery();
        responseDocQuery.set_viewXml(
          `<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name='FileDirRef'/><Value Type='Text'>` + folderPath + "</Value></Eq><Eq><FieldRef Name='DocumentStatus'/><Value Type='Text'>Open</Value></Eq></And></Where></Query></View>"
        );
        const responseDocOpenItems = responseDocLib.getItems(responseDocQuery);
        currCtx.load(
          responseDocOpenItems,
          "Include(ID, DocumentStatus, FileDirRef)"
        );
        var emailList = web.get_lists().getByTitle(Audit2.Common.Utilities.GetListTitleEmailHistory());
        var emailListQuery = new SP.CamlQuery();
        emailListQuery.set_viewXml(
          '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>'
        );
        const emailListFolderItems = emailList.getItems(emailListQuery);
        currCtx.load(emailListFolderItems, "Include(ID, Title, DisplayName)");
        currCtx.executeQueryAsync(
          OnSuccessLoadedResponseDocs,
          OnFailureLoadedResponseDocs
        );
      }
    }
    function m_fnMarkForDeletionResponseDoc(itemID) {
      if (confirm("Are you sure you would like to Delete this Response Document?")) {
        let OnSuccess = function(sender, args) {
          Audit2.Common.Utilities.Refresh();
        }, OnFailure = function(sender, args) {
          const statusId2 = SP.UI.Status.addStatus(
            "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
          );
          SP.UI.Status.setStatusPriColor(statusId2, "red");
        };
        var currCtx = new SP.ClientContext();
        var responseDocsLib = currCtx.get_web().get_lists().getByTitle(Audit2.Common.Utilities.GetLibNameResponseDocs());
        const oListItem = responseDocsLib.getItemById(itemID);
        oListItem.set_item("DocumentStatus", "Marked for Deletion");
        oListItem.update();
        currCtx.executeQueryAsync(OnSuccess, OnFailure);
      }
    }
    function BindHandlersOnLoad() {
      BindPrintButton(
        "#btnPrint1",
        "#divStatusReportRespones",
        "Action Office Response Status Report"
      );
      BindExportButton(
        ".export1",
        "AOResponseStatusReport_",
        "tblStatusReportResponses"
      );
    }
    function BindPrintButton(btnPrint, divTbl, pageTitle) {
      $(btnPrint).on("click", function() {
        Audit2.Common.Utilities.PrintStatusReport(pageTitle, divTbl);
      });
    }
    function BindExportButton(btnExport, fileNamePrefix, tbl) {
      $(btnExport).on("click", function(event) {
        var curDate = (/* @__PURE__ */ new Date()).format("yyyyMMdd_hhmmtt");
        Audit2.Common.Utilities.ExportToCsv(fileNamePrefix + curDate, tbl);
      });
    }
    function GoToResponse(response) {
      _myViewModel.tabs.selectById(_myViewModel.tabOpts.ResponseDetail.id);
      if (response) {
        response = m_bigMap["response-" + response];
        var requestStatus = response.request.status;
        var responseStatus = response.resStatus;
        if ((responseStatus == m_responseStatus1 || responseStatus == m_responseStatus2) && (requestStatus == "Open" || requestStatus == "ReOpened"))
          _myViewModel.filterResponseInfoTabResponseNameOpen2(response.title);
        else
          _myViewModel.filterResponseInfoTabResponseNameProcessed2(
            response.title
          );
      }
    }
    var publicMembers = {
      GoToResponse,
      IsTransactionExecuting: function() {
        return m_bIsTransactionExecuting;
      }
    };
    return publicMembers;
  };
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
  function InitReport2() {
    document.getElementById("app").innerHTML = aoDbTemplate;
    Audit2.AOReport.Report = new Audit2.AOReport.NewReportPage();
    Audit2.AOReport.Init();
  }
})();
//# sourceMappingURL=ao_db.js.map
