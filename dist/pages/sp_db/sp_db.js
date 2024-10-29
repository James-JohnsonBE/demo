(() => {
  // src/pages/sp_db/SP_DB_Template.js
  var html = String.raw;
  var spDbTemplate = html`
  <div class="audit">
    <iframe id="CsvExpFrame" style="display: none"></iframe>

    <div
      id="divCounter"
      style="display: none"
      title="used to auto refresh the page"
    >
      600
    </div>

    <div style="padding-bottom: 10px; display: none" id="divRefresh">
      <a
        title="Refresh this page"
        href="javascript:void(0)"
        onclick="Audit.SPReport.Report.Refresh()"
        ><span class="ui-icon ui-icon-refresh"></span>Refresh</a
      >
    </div>

    <div id="divLoading" style="color: green; padding-bottom: 10px">
      Please Wait... Loading
    </div>

    <div id="tabs" style="display: none; margin-top: 20px">
      <ul>
        <li><a href="#tabs-0">Status Report</a></li>
        <li><a href="#tabs-1">Responses</a></li>
      </ul>
      <div id="tabs-0">
        <div
          id="lblStatusReportResponsesMsg"
          style="padding-top: 5px; color: green"
          data-bind="visible: arrResponses().length == 0"
        >
          <span class="ui-icon ui-icon-info"></span>There are 0 responses for
          your review
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
            data-bind="visible: arrFilteredResponsesCount() < arrResponses().length, click: ClearFilters"
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
                <th class="sorter-false" nowrap="nowrap">
                  <select
                    id="ddlResponseRequestID"
                    data-bind="options: GetDistinctResponsesDDVals('reqNumber'), value: filterRequestID, optionsCaption: '-Select-', event:{ change: FilterChanged}"
                  ></select>
                </th>
                <th class="sorter-false" nowrap="nowrap">
                  <select
                    id="ddlResponseRequestStatus"
                    data-bind="options: GetDistinctResponsesDDVals('requestStatus'), value: filterRequestStatus, optionsCaption: '-Select-', event:{ change: FilterChanged}"
                  ></select>
                </th>
                <th class="sorter-false" nowrap="nowrap">
                  <select
                    id="ddlResponseRequestInternalDueDate"
                    data-bind="options: GetDistinctResponsesDDVals('internalDueDate'), value: filterRequestIntDueDate, optionsCaption: '-Select-', event:{ change: FilterChanged}"
                  ></select>
                </th>
                <th class="sorter-false" nowrap="nowrap">
                  <select
                    id="ddlResponseSampleNum"
                    data-bind="options: GetDistinctResponsesDDVals('sample'), value: filterSampleNum, optionsCaption: '-Select-', event:{ change: FilterChanged}"
                  ></select>
                </th>
                <th class="sorter-false" nowrap="nowrap">
                  <select
                    id="ddlResponseName"
                    data-bind="options: GetDistinctResponsesDDVals('title'), value: filterResponseName, optionsCaption: '-Select-', event:{ change: FilterChanged}"
                  ></select>
                </th>
                <th class="sorter-false" nowrap="nowrap">
                  <select
                    id="ddlResponseStatus"
                    data-bind="options: GetDistinctResponsesDDVals('status'), value: filterResponseStatus, optionsCaption: '-Select-', event:{ change: FilterChanged}"
                  ></select>
                </th>
                <th class="sorter-false" nowrap="nowrap"></th>
                <th class="sorter-false" nowrap="nowrap"></th>
              </tr>
              <tr valign="top">
                <th class="sorter-true" nowrap="nowrap">Request #</th>
                <th class="sorter-true" nowrap="nowrap">Request Status</th>
                <th class="sorter-true" nowrap="nowrap">Internal Due Date</th>
                <th class="sorter-true" nowrap="nowrap">Sample #</th>
                <th class="sorter-true" nowrap="nowrap">Response Name</th>
                <th class="sorter-true" nowrap="nowrap">Status</th>
                <th class="sorter-true" nowrap="nowrap"># of Documents</th>
                <th class="sorter-true" nowrap="nowrap">Modified</th>
              </tr>
            </thead>
            <tbody id="fbody" data-bind="foreach: arrResponses">
              <tr class="sr-response-item" data-bind="visible: visibleRow">
                <td class="sr-response-requestNum">
                  <span data-bind="text: reqNumber"></span>
                </td>
                <td class="sr-response-requestStatus">
                  <span data-bind="text: requestStatus"></span>
                </td>
                <td class="sr-response-internalDueDate">
                  <span data-bind="text: internalDueDate"></span>
                </td>
                <td class="sr-response-sample">
                  <span data-bind="text: sample"></span>
                </td>
                <td class="sr-response-title">
                  <a
                    href="javascript:void(0);"
                    title="Go to Response Details"
                    data-bind="click: $parent.GoToResponse"
                    ><span data-bind="text: title"></span
                  ></a>
                </td>
                <td class="sr-response-status">
                  <span data-bind="text: status"></span>
                </td>
                <td class="sr-response-docCount">
                  <span data-bind="text: docCount"></span>
                </td>
                <td class="sr-response-modified">
                  <span data-bind="text: modified"></span>
                </td>
              </tr>
            </tbody>
            <tfoot class="footer">
              <tr>
                <th colspan="8">
                  Displaying
                  <span
                    id="spanResponsesDisplayedTotal"
                    style="color: green"
                    data-bind="text: arrFilteredResponsesCount()"
                    >0</span
                  >
                  out of
                  <span
                    style="color: green"
                    data-bind="text: arrResponses().length"
                  ></span>
                  Responses
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div id="tabs-1">
        <div style="padding-bottom: 15px">
          <table>
            <tr>
              <td><span>Responses:</span></td>
              <td>
                <select
                  id="ddlResponses"
                  data-bind="options: GetDistinctResponsesDDVals('title'), value: filterResponseName2, optionsCaption: '-Select-'"
                ></select>
              </td>
            </tr>
          </table>
        </div>

        <div id="divResponseInfo" data-bind="with: currentResponse">
          <fieldset>
            <legend>Response Information</legend>
            <table id="tblResponseInfo" class="tablesorter">
              <tbody>
                <tr>
                  <td>Request #</td>
                  <td>
                    <span id="requestInfoNum" data-bind="text: number"></span>
                  </td>
                </tr>
                <tr>
                  <td>Request Status</td>
                  <td>
                    <span
                      id="requestInfoStatus"
                      data-bind="text: $parent.currentResponseRequestStatus, style: { color: $parent.currentResponseRequestStatusStyle }"
                    ></span>
                  </td>
                </tr>
                <tr>
                  <td>Subject</td>
                  <td>
                    <span
                      id="requestInfoSub"
                      data-bind="text: request.subject"
                    ></span>
                  </td>
                </tr>
                <tr>
                  <td>Due Date</td>
                  <td>
                    <span
                      id="requestInfoInternalDueDate"
                      data-bind="text: request.internalDueDate"
                    ></span>
                  </td>
                </tr>
                <tr>
                  <td>Sample?</td>
                  <td>
                    <span
                      id="requestInfoSample"
                      data-bind="text: request.sample, css: request.sample == true ? 'ui-icon ui-icon-check' : 'ui-icon ui-icon-close'"
                    ></span>
                  </td>
                </tr>
                <tr>
                  <td>Response</td>
                  <td>
                    <span id="responseInfoName" data-bind="text: title"></span>
                  </td>
                </tr>
                <tr>
                  <td>Response Status</td>
                  <td>
                    <span
                      id="responseInfoStatus"
                      data-bind="text: $parent.currentResponseStatus, style: { color:  resStatus == '7-Closed' ? 'red' : 'green' }"
                    ></span>
                  </td>
                </tr>
                <tr>
                  <td>Sample #</td>
                  <td>
                    <span
                      id="responseInfoSampleNum"
                      data-bind="text: sample"
                    ></span>
                  </td>
                </tr>
                <tr>
                  <td>Action Office</td>
                  <td>
                    <span
                      id="responseInfoAO"
                      data-bind="text: actionOffice"
                    ></span>
                  </td>
                </tr>
                <tr>
                  <td>Related Audit</td>
                  <td>
                    <span
                      id="requestInfoRelatedAudit"
                      data-bind="text: request.relatedAudit"
                    ></span>
                  </td>
                </tr>
                <tr>
                  <td>Action Items</td>
                  <td>
                    <span
                      id="requestInfoActionItems"
                      data-bind="html: request.actionItems "
                    ></span>
                  </td>
                </tr>
                <tr>
                  <td>Comments</td>
                  <td>
                    <span
                      id="responseInfoComments"
                      data-bind="html: comments"
                    ></span>
                  </td>
                </tr>
              </tbody>
            </table>
          </fieldset>
        </div>

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

        <div id="divResponseDocs" data-bind="visible: currentResponse">
          <fieldset>
            <legend>Response Documents</legend>
            <div
              id="divEmptyResponseDocsMsg"
              style="border: 0px !important; font-style: italic"
              data-bind="visible: arrResponseDocs().length <= 0"
            >
              There are 0 response documents
            </div>
            <table
              id="tblResponseDocs"
              class="tablesorter report"
              data-bind="visible: arrResponseDocs().length > 0"
            >
              <thead>
                <tr valign="top">
                  <th class="sorter-false" nowrap="nowrap">Type</th>
                  <th class="sorter-false" nowrap="nowrap">Name</th>
                  <th class="sorter-false" nowrap="nowrap">Receipt Date</th>
                  <th class="sorter-false" nowrap="nowrap">File Size</th>
                  <th class="sorter-false" nowrap="nowrap">Checked Out</th>
                  <th class="sorter-false" nowrap="nowrap">Status</th>
                  <th class="sorter-false" nowrap="nowrap">Reason</th>
                  <th class="sorter-false" nowrap="nowrap">Modified</th>
                  <th class="sorter-false" nowrap="nowrap">Modified By</th>
                </tr>
              </thead>
              <tbody
                data-bind="foreach: { data: arrResponseDocs, as: 'responseDocSummary'} "
              >
                <tr class="requestInfo-response-doc">
                  <td colspan="10">
                    <img
                      style="background-color: transparent"
                      src="/_layouts/images/minus.gif"
                      title="Expand/Collapse"
                    /><span
                      data-bind="text: responseDocSummary.responseTitle"
                    ></span>
                  </td>
                </tr>

                <!-- ko foreach: responseDocSummary.responseDocs-->

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
                      data-bind="attr: { href: 'javascript:void(0)', onclick: link}"
                      ><span data-bind="text: title"></span
                    ></a>
                  </td>
                  <td nowrap data-bind="text: receiptDate"></td>
                  <td nowrap data-bind="text: fileSize"></td>
                  <td nowrap data-bind="text: checkedOutBy"></td>
                  <td nowrap data-bind="text: documentStatus"></td>
                  <td nowrap data-bind="text: rejectReason"></td>
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
                  <th colspan="9" nowrap="nowrap">
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
          </fieldset>
        </div>
      </div>
    </div>

    <div id="divTest"></div>
  </div>
`;

  // src/sal/entities/People.js
  var People2 = class _People {
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

  // src/sal/components/fields/BaseFieldModule.js
  var html2 = String.raw;
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
  var BaseFieldModule = class {
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

  // src/sal/components/fields/BlobModule.js
  var editTemplate = html2`
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
  var viewTemplate = html2`
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
  var BlobModule = class extends BaseFieldModule {
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

  // src/sal/components/fields/CheckboxModule.js
  var editTemplate2 = html2`
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
  var viewTemplate2 = html2`
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
  var CheckboxModule = class extends BaseFieldModule {
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

  // src/sal/components/fields/DateModule.js
  var dateFieldTypes = {
    date: "date",
    datetime: "datetime-local"
  };
  var editTemplate3 = html2`
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
  var DateModule = class extends BaseFieldModule {
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

  // src/sal/components/fields/LookupModule.js
  var editTemplate4 = html2`
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
  var LookupModule = class extends BaseFieldModule {
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

  // src/sal/components/fields/PeopleModule.js
  var editTemplate5 = html2`
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
  var viewTemplate3 = html2`
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
  var PeopleModule = class extends BaseFieldModule {
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

  // src/sal/components/fields/SearchSelectModule.js
  var editTemplate6 = html2`
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
  var SearchSelectModule = class extends BaseFieldModule {
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

  // src/sal/components/fields/SelectModule.js
  var editTemplate7 = html2`
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
  var SelectModule = class extends BaseFieldModule {
    constructor(params) {
      super(params);
    }
    static editTemplate = editTemplate7;
    static view = "select-view";
    static edit = "select-edit";
    static new = "select-edit";
  };
  registerFieldComponents(SelectModule);

  // src/sal/components/fields/TextAreaModule.js
  var editTemplate8 = html2`
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
  var viewTemplate4 = html2`
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
  var TextAreaModule = class extends BaseFieldModule {
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

  // src/sal/components/fields/TextModule.js
  var editTemplate9 = html2`
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
  var TextModule = class extends BaseFieldModule {
    constructor(params) {
      super(params);
    }
    static editTemplate = editTemplate9;
    static view = "text-view";
    static edit = "text-edit";
    static new = "text-edit";
  };
  registerFieldComponents(TextModule);

  // src/sal/infrastructure/sal.js
  window.console = window.console || { log: function() {
  } };
  window.sal = window.sal ?? {};
  var sal = window.sal;
  var serverRelativeUrl = _spPageContextInfo.webServerRelativeUrl == "/" ? "" : _spPageContextInfo.webServerRelativeUrl;
  sal.globalConfig = sal.globalConfig || {
    siteGroups: [],
    siteUrl: serverRelativeUrl,
    listServices: serverRelativeUrl + "/_vti_bin/ListData.svc/",
    defaultGroups: {}
  };
  sal.site = sal.site || {};
  window.DEBUG = true;
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
  var webRoot = _spPageContextInfo.webAbsoluteUrl == "/" ? "" : _spPageContextInfo.webAbsoluteUrl;
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
    var siteGroups = {
      groups: {
        Owners: "workorder Owners",
        Members: "workorder Members",
        Visitors: "workorder Visitors",
        RestrictedReaders: "Restricted Readers"
      }
    };
    var publicMembers = {
      siteRoles,
      siteGroups
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
  refreshDigestValue();
  window.fetchSharePointData = fetchSharePointData;
  var JobProcessor = class {
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
  var uploadQueue = new JobProcessor(5);

  // src/env.js
  var assetsPath = `${_spPageContextInfo.siteServerRelativeUrl}/Style Library/apps/audit/src`;

  // src/sal/infrastructure/knockout_extensions.js
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
  var fromPathTemplateLoader = {
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
  var fromPathViewModelLoader = {
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

  // src/sal/infrastructure/register_components.js
  var html3 = String.raw;

  // src/services/legacy_helpers.js
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
    position.set_pagingInfo("Paged=TRUE");
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
      const currentUser = web.get_currentUser();
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

  // src/pages/sp_db/sp_db.js
  document.getElementById("app").innerHTML = spDbTemplate;
  window.Audit = window.Audit || {};
  Audit.SPReport = Audit.SPReport || {};
  var paramShowSiteActionsToAnyone = GetUrlKeyValue("ShowSiteActions");
  if (paramShowSiteActionsToAnyone != true) {
    $("#RibbonContainer-TabRowLeft").hide();
    $(".ms-siteactionsmenu").hide();
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
  function InitReport2() {
    Audit.SPReport.Report = new Audit.SPReport.NewReportPage();
    Audit.SPReport.Init();
  }
  Audit.SPReport.Init = function() {
    var paramShowSiteActionsToAnyone2 = GetUrlKeyValue("ShowSiteActions");
    if (paramShowSiteActionsToAnyone2 != true) {
      $("#RibbonContainer-TabRowLeft").hide();
      $(".ms-siteactionsmenu").hide();
    }
    setInterval(function() {
      var divVal = $("#divCounter").text();
      var count = divVal * 1 - 1;
      $("#divCounter").text(count);
      if (count <= 0) {
        Audit.Common.Utilities.Refresh();
      }
    }, 1e3);
  };
  Audit.SPReport.NewReportPage = function() {
    var m_bigMap = new Object();
    var m_arrRequests = new Array();
    var m_arrResponses = new Array();
    var m_requestItems;
    var m_responseItems;
    var m_ResponseDocsItems;
    var statusId2;
    var m_bHasAccessToViewPerms = false;
    ko.extenders.logChangeInArr = function(target, option) {
      target.subscribe(function(newValue) {
        console.log(option + ": " + JSON.stringify(newValue));
        console.log(newValue.length);
      });
      return target;
    };
    function ViewModel() {
      var self = this;
      self.siteUrl = Audit.Common.Utilities.GetSiteUrl();
      self.arrResponses = ko.observableArray(null);
      self.arrFilteredResponsesCount = ko.observable(0);
      self.filterRequestID = ko.observable();
      self.filterRequestStatus = ko.observable();
      self.filterRequestIntDueDate = ko.observable();
      self.filterSampleNum = ko.observable();
      self.filterResponseName = ko.observable();
      self.filterResponseStatus = ko.observable();
      self.filterResponseName2 = ko.observable();
      self.currentResponse = ko.observable();
      self.arrCoverSheets = ko.observableArray(null);
      self.arrResponseDocs = ko.observableArray(null);
      self.cntResponseDocs = ko.observable(0);
      self.doSort = ko.observable(false);
      self.currentResponseStatus = ko.computed(function() {
        if (self.currentResponse()) {
          if (self.currentResponse().resStatus == "7-Closed")
            return self.currentResponse().resStatus + " on " + self.currentResponse().closedDate + " by " + self.currentResponse().closedBy;
          return self.currentResponse().resStatus;
        }
        return "";
      }, self).extend({ notify: "always" });
      self.currentResponseRequestStatus = ko.computed(function() {
        if (self.currentResponse()) {
          if (self.currentResponse().request.status == "Closed")
            return self.currentResponse().request.status + " on " + self.currentResponse().request.closedDate;
          return self.currentResponse().request.status;
        }
        return "";
      }, self);
      self.currentResponseRequestStatusStyle = ko.computed(function() {
        if (self.currentResponseStatus() != "") {
          if (self.currentResponse().request.status == "Closed" || self.currentResponse().request.status == "Canceled")
            return "red";
          else
            return "green";
        }
        return "";
      }, self);
      self.ClearFilters = function() {
        self.filterRequestID("");
        self.filterRequestStatus("");
        self.filterRequestIntDueDate("");
        self.filterSampleNum("");
        self.filterResponseName("");
        self.filterResponseStatus("");
      };
      self.GetDistinctResponsesDDVals = function(fieldName) {
        return ko.computed(
          {
            read: function() {
              var types = ko.utils.arrayMap(self.arrResponses(), function(item) {
                return item[fieldName];
              });
              var ddArr = ko.utils.arrayGetDistinctValues(types).sort();
              return ddArr;
            }
          },
          self
        );
      };
      self.GoToResponse = function(response) {
        $("#tabs").tabs({ active: 1 });
        self.filterResponseName2(response.title);
      };
      self.arrResponses.subscribe(function(newValue) {
        if (self.arrResponses().length > 0 && self.doSort()) {
          self.arrFilteredResponsesCount(self.arrResponses().length);
          setTimeout(function() {
            $("#tblStatusReportResponses").tablesorter({
              sortList: [[7, 1]],
              selectorHeaders: ".sorter-true"
            });
          }, 200);
        }
      });
      self.filterResponseName2.subscribe(function(newValue) {
        var oResponse = m_bigMap["response-" + self.filterResponseName2()];
        if (oResponse) {
          self.currentResponse(oResponse);
          LoadTabResponseInfoCoverSheets(oResponse);
          LoadTabResponseInfoResponseDocs(oResponse);
        } else {
          self.currentResponse(null);
          self.arrCoverSheets([]);
          self.arrResponseDocs([]);
          self.cntResponseDocs(0);
        }
      });
      self.FilterChanged = function() {
        setTimeout(function() {
          var requestID = self.filterRequestID();
          var requestStatus = self.filterRequestStatus();
          var requestIntDueDate = self.filterRequestIntDueDate();
          var sampleNum = self.filterSampleNum();
          var responseName = self.filterResponseName();
          var responseStatus = self.filterResponseStatus();
          if (!requestID && !requestStatus && !requestIntDueDate && !sampleNum && !responseName && !responseStatus) {
            ko.utils.arrayForEach(self.arrResponses(), function(item) {
              item.visibleRow(true);
            });
            self.arrFilteredResponsesCount(self.arrResponses().length);
          }
          var result = [];
          requestID = !requestID ? "" : requestID;
          requestStatus = !requestStatus ? "" : requestStatus;
          requestIntDueDate = !requestIntDueDate ? "" : requestIntDueDate;
          sampleNum = !sampleNum ? "" : sampleNum;
          responseName = !responseName ? "" : responseName;
          responseStatus = !responseStatus ? "" : responseStatus;
          var count = 0;
          ko.utils.arrayForEach(self.arrResponses(), function(item) {
            var hide = false;
            if (!hide && requestID != "" && item.reqNumber != requestID)
              hide = true;
            if (!hide && requestStatus != "" && item.requestStatus != requestStatus)
              hide = true;
            if (!hide && requestIntDueDate != "" && item.internalDueDate != requestIntDueDate)
              hide = true;
            if (!hide && sampleNum != "" && item.sample != sampleNum)
              hide = true;
            if (!hide && responseName != "" && item.title != responseName)
              hide = true;
            if (!hide && responseStatus != "" && item.status != responseStatus)
              hide = true;
            item.visibleRow(!hide);
            if (!hide)
              count++;
          });
          self.arrFilteredResponsesCount(count);
        }, 100);
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
      var requestList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleRequests());
      var requestQuery = new SP.CamlQuery();
      requestQuery.set_viewXml(
        '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'
      );
      m_requestItems = requestList.getItems(requestQuery);
      currCtx.load(
        m_requestItems,
        "Include(ID, Title, ReqSubject, ReqStatus, IsSample, InternalDueDate, ActionOffice, Comments, RelatedAudit, ActionItems, EmailSent, ClosedDate, Modified)"
      );
      await Promise.all([
        getAllItems(Audit.Common.Utilities.GetListTitleResponses(), [
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
        getAllItems(Audit.Common.Utilities.GetLibTitleResponseDocs(), [
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
      currCtx.executeQueryAsync(OnSuccess, OnFailure);
      function OnSuccess(sender, args) {
        var requestList2 = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleRequests());
        var requestQuery2 = new SP.CamlQuery();
        requestQuery2.set_viewXml(
          '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'
        );
        var m_requestItemsWithPerms = requestList2.getItems(requestQuery2);
        currCtx.load(
          m_requestItemsWithPerms,
          "Include(ID, Title, ReqSubject, ReqStatus, IsSample, InternalDueDate, ActionOffice, Comments, RelatedAudit, ActionItems, EmailSent, ClosedDate, Modified, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
        );
        function OnSuccess2(sender2, args2) {
          m_bHasAccessToViewPerms = true;
          m_requestItems = m_requestItemsWithPerms;
          $("#divRefresh").show();
          m_fnLoadData();
        }
        function OnFailure2(sender2, args2) {
          $("#divRefresh").show();
          m_fnLoadData();
        }
        currCtx.executeQueryAsync(OnSuccess2, OnFailure2);
      }
      function OnFailure(sender, args) {
        $("#divRefresh").hide();
        $("#divLoading").hide();
        statusId2 = SP.UI.Status.addStatus(
          "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
        );
        SP.UI.Status.setStatusPriColor(statusId2, "red");
      }
    }
    function m_fnLoadData() {
      LoadRequests();
      LoadResponses();
      LoadResponseDocs();
      $("#tabs").tabs().show();
      LoadTabStatusReport(m_arrResponses);
    }
    function OnLoadDisplayTabAndRequest() {
      var paramResponseNum = GetUrlKeyValue("ResNum");
      if (paramResponseNum != null && paramResponseNum != "") {
        _myViewModel.filterResponseName2(paramResponseNum);
      }
      var paramTabIndex = GetUrlKeyValue("Tab");
      if (paramTabIndex != null && paramTabIndex != "") {
        $("#tabs").tabs("option", "active", paramTabIndex);
      }
    }
    function LoadRequests() {
      m_bigMap = new Object();
      m_arrRequests = new Array();
      var cnt = 0;
      var listItemEnumerator = m_requestItems.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        var id2 = oListItem.get_item("ID");
        var number = oListItem.get_item("Title");
        var status = oListItem.get_item("ReqStatus");
        var sample = oListItem.get_item("IsSample");
        var emailSent = oListItem.get_item("EmailSent");
        var subject = oListItem.get_item("ReqSubject");
        if (subject == null)
          subject = "";
        var internalDueDate = oListItem.get_item("InternalDueDate");
        var closedDate = oListItem.get_item("ClosedDate");
        internalDueDate != null ? internalDueDate = internalDueDate.format("MM/dd/yyyy") : internalDueDate = "";
        closedDate != null ? closedDate = closedDate.format("MM/dd/yyyy") : closedDate = "";
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
        var requestObject = new Object();
        requestObject["ID"] = id2;
        requestObject["number"] = number;
        requestObject["subject"] = subject;
        requestObject["status"] = status;
        requestObject["internalDueDate"] = internalDueDate;
        requestObject["sample"] = sample;
        requestObject["responses"] = new Array();
        requestObject["actionOffice"] = actionOffice;
        requestObject["comments"] = comments;
        requestObject["emailSent"] = emailSent;
        requestObject["closedDate"] = closedDate;
        requestObject["relatedAudit"] = relatedAudit;
        requestObject["actionItems"] = actionItems;
        if (m_bHasAccessToViewPerms) {
          try {
            var permissionsToCheck = SP.PermissionKind.viewListItems;
            var match1 = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
              oListItem,
              Audit.Common.Utilities.GetGroupNameSpecialPerm1(),
              permissionsToCheck
            );
            var match2 = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
              oListItem,
              Audit.Common.Utilities.GetGroupNameSpecialPerm2(),
              permissionsToCheck
            );
            if (!match1 && !match2)
              continue;
          } catch (err) {
          }
        }
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
          responseObject["resStatus"] = oListItem.get_item("ResStatus");
          if (responseObject["resStatus"] != "4-Approved for QA" && responseObject["resStatus"] != "7-Closed" && responseObject["resStatus"] != "6-Reposted After Rejection")
            continue;
          responseObject["actionOffice"] = oListItem.get_item("ActionOffice");
          if (responseObject["actionOffice"] == null)
            responseObject["actionOffice"] = "";
          else
            responseObject["actionOffice"] = responseObject["actionOffice"].get_lookupValue();
          if (responseObject["actionOffice"] == "")
            continue;
          responseObject["ID"] = oListItem.get_item("ID");
          responseObject["number"] = number;
          var title = oListItem.get_item("Title");
          responseObject["title"] = title;
          var modified = oListItem.get_item("Modified");
          modified != null ? modified = modified.format("MM/dd/yyyy hh:mm tt") : modified = "";
          responseObject["modified"] = modified;
          var closedDate = oListItem.get_item("ClosedDate");
          closedDate != null ? closedDate = closedDate.format("MM/dd/yyyy") : closedDate = "";
          responseObject["closedDate"] = closedDate;
          var comments = oListItem.get_item("Comments");
          if (comments == null)
            comments = "";
          responseObject["comments"] = comments;
          responseObject["closedBy"] = Audit.Common.Utilities.GetFriendlyDisplayName(oListItem, "ClosedBy");
          responseObject["sample"] = oListItem.get_item("SampleNumber");
          if (responseObject["sample"] == null)
            responseObject["sample"] = "";
          responseObject["coversheets"] = new Array();
          responseObject["responseDocs"] = new Array();
          responseObject["arrIndex"] = cnt;
          m_arrResponses.push(responseObject);
          m_bigMap["response-" + title] = responseObject;
          cnt++;
        }
      }
    }
    function LoadResponseDocs() {
      for (var oListItem of m_ResponseDocsItems) {
        if (oListItem.get_item("DocumentStatus") == "Open" || oListItem.get_item("DocumentStatus") == "Marked for Deletion" || oListItem.get_item("DocumentStatus") == "Submitted")
          continue;
        var responseDocID = oListItem.get_item("ID");
        var requestNumber = oListItem.get_item("ReqNum");
        if (requestNumber != null)
          requestNumber = requestNumber.get_lookupValue();
        var responseID = oListItem.get_item("ResID");
        if (responseID != null)
          responseID = responseID.get_lookupValue();
        if (requestNumber == null || responseID == null)
          continue;
        try {
          var bigMapItem = m_bigMap["response-" + responseID];
          var indexOfArrResponses = bigMapItem.arrIndex;
          var oResponse = m_arrResponses[indexOfArrResponses];
          if (oResponse) {
            var responseDocObject = new Object();
            responseDocObject["ID"] = oListItem.get_item("ID");
            responseDocObject["title"] = oListItem.get_item("FileLeafRef");
            responseDocObject["folder"] = oListItem.get_item("FileDirRef");
            responseDocObject["documentStatus"] = oListItem.get_item("DocumentStatus");
            responseDocObject["rejectReason"] = oListItem.get_item("RejectReason");
            if (responseDocObject["rejectReason"] == null)
              responseDocObject["rejectReason"] = "";
            var fileSize = oListItem.get_item("File_x0020_Size");
            fileSize = Audit.Common.Utilities.GetFriendlyFileSize(fileSize);
            responseDocObject["fileSize"] = fileSize;
            var receiptDate = "";
            if (oListItem.get_item("ReceiptDate") != null && oListItem.get_item("ReceiptDate") != "")
              receiptDate = oListItem.get_item("ReceiptDate").format("MM/dd/yyyy");
            responseDocObject["receiptDate"] = receiptDate;
            var modifiedDate = "";
            if (oListItem.get_item("Modified") != null && oListItem.get_item("Modified") != "")
              modifiedDate = oListItem.get_item("Modified").format("MM/dd/yyyy hh:mm tt");
            responseDocObject["modifiedDate"] = modifiedDate;
            responseDocObject["modifiedBy"] = Audit.Common.Utilities.GetFriendlyDisplayName(oListItem, "Editor");
            responseDocObject["checkedOutBy"] = Audit.Common.Utilities.GetFriendlyDisplayName(
              oListItem,
              "CheckoutUser"
            );
            oResponse["responseDocs"].push(responseDocObject);
          }
        } catch (err) {
        }
      }
    }
    function LoadTabStatusReport(arr) {
      if (arr == null)
        return;
      var bLoadTest = GetUrlKeyValue("LoadTest");
      var responseArr = new Array();
      var arrLength = arr.length;
      while (arrLength--) {
        var oResponse = arr[arrLength];
        var responseTitle = oResponse.title;
        var requestStatus = oResponse.request.status;
        var responseStatus = oResponse.resStatus;
        var aResponse = {
          reqNumber: oResponse.request.number,
          requestStatus,
          internalDueDate: oResponse.request.internalDueDate,
          sample: oResponse.sample,
          title: responseTitle,
          status: responseStatus,
          docCount: oResponse.responseDocs.length,
          modified: oResponse.modified,
          visibleRow: ko.observable(true)
        };
        responseArr.push(aResponse);
        if (bLoadTest) {
          for (var x = 0; x < 299; x++) {
            responseArr.push(aResponse);
          }
        }
      }
      if (responseArr.length > 0) {
        DoUpdateModel(responseArr);
      } else {
        Audit.Common.Utilities.OnLoadDisplayTimeStamp();
      }
    }
    function DoUpdateModel(arrResponsesToAdd) {
      var subArr = [];
      var bContinue = true;
      var batchSize = 250;
      if (arrResponsesToAdd.length == 0) {
        bContinue = false;
        Audit.Common.Utilities.OnLoadDisplayTimeStamp();
        BindHandlersOnLoad();
        OnLoadDisplayTabAndRequest();
      } else if (arrResponsesToAdd.length >= batchSize) {
        subArr = arrResponsesToAdd.slice(0, batchSize);
        arrResponsesToAdd.splice(0, batchSize);
      } else if (arrResponsesToAdd.length > 0) {
        subArr = arrResponsesToAdd.slice(0, arrResponsesToAdd.length);
        arrResponsesToAdd.splice(0, arrResponsesToAdd.length);
      }
      if (bContinue) {
        ko.utils.arrayPushAll(_myViewModel.arrResponses(), subArr);
        if (arrResponsesToAdd.length == 0)
          _myViewModel.doSort(true);
        _myViewModel.arrResponses.valueHasMutated();
        setTimeout(function() {
          DoUpdateModel(arrResponsesToAdd);
        }, 100);
      }
    }
    function LoadTabResponseInfoCoverSheets(oResponse) {
      _myViewModel.arrCoverSheets([]);
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      var coverSheetLib = web.get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleCoverSheets());
      var coverSheetQuery = new SP.CamlQuery();
      coverSheetQuery.set_viewXml(
        '<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="ReqNum"/><Value Type="Text">' + oResponse.request.number + "</Value></Eq></Where></Query></View>"
      );
      var m_subsetCoverSheetItems = coverSheetLib.getItems(coverSheetQuery);
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
      _myViewModel.arrResponseDocs([]);
      _myViewModel.cntResponseDocs(0);
      if (oResponse == null || oResponse.responseDocs.length == 0) {
        return;
      }
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      for (var z = 0; z < oResponse.responseDocs.length; z++) {
        var oResponseDoc = oResponse.responseDocs[z];
        oResponseDoc["docIcon"] = web.mapToIcon(
          oResponseDoc.title,
          "",
          SP.Utilities.IconSize.Size16
        );
      }
      function OnSuccess(sender, args) {
        RenderResponses(oResponse);
      }
      function OnFailure(sender, args) {
        statusId2 = SP.UI.Status.addStatus(
          "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
        );
        SP.UI.Status.setStatusPriColor(statusId2, "red");
      }
      currCtx.executeQueryAsync(OnSuccess, OnFailure);
      function RenderResponses(oResponse2) {
        if (oResponse2 == null || oResponse2.responseDocs == null)
          return;
        var arrResponseSummary = new Array();
        for (var z2 = 0; z2 < oResponse2.responseDocs.length; z2++) {
          var oResponseDoc2 = oResponse2.responseDocs[z2];
          oResponseDoc2.docIcon = oResponseDoc2.docIcon.get_value();
          oResponseDoc2.styleTag = Audit.Common.Utilities.GetResponseDocStyleTag2(
            oResponseDoc2.documentStatus
          );
          oResponseDoc2.link = "STSNavigate('../_layouts/download.aspx?SourceUrl=" + oResponseDoc2.folder + "/" + oResponseDoc2.title + "')";
          var bFound = false;
          for (var b = 0; b < arrResponseSummary.length; b++) {
            if (arrResponseSummary[b].responseTitle == oResponse2.title) {
              bFound = true;
              arrResponseSummary[b].responseDocs.push(oResponseDoc2);
              break;
            }
          }
          if (!bFound) {
            var oObject = new Object();
            var arrResponseDocs = new Array();
            arrResponseDocs.push(oResponseDoc2);
            oObject["responseTitle"] = oResponse2.title;
            oObject["responseDocs"] = arrResponseDocs;
            oObject["response"] = oResponse2;
            arrResponseSummary.push(oObject);
          }
        }
        ko.utils.arrayPushAll(_myViewModel.arrResponseDocs(), arrResponseSummary);
        _myViewModel.arrResponseDocs.valueHasMutated();
        _myViewModel.cntResponseDocs(oResponse2.responseDocs.length);
        Audit.Common.Utilities.BindHandlerResponseDoc();
      }
    }
    function m_fnRefresh() {
      var curPath = location.pathname;
      var tabIndex = $("#tabs").tabs("option", "active");
      curPath += "?Tab=" + tabIndex;
      if (tabIndex == 1) {
        var responseNum = $("#ddlResponses").val();
        if (responseNum != "")
          curPath += "&ResNum=" + responseNum;
      }
      location.href = curPath;
    }
    function BindHandlersOnLoad() {
      BindPrintButton(
        "#btnPrint1",
        "#divStatusReportRespones",
        "Special Permissions Response Status Report"
      );
      BindExportButton(
        ".export1",
        "SPResponseStatusReport_",
        "tblStatusReportResponses"
      );
    }
    function BindPrintButton(btnPrint, divTbl, pageTitle) {
      $(btnPrint).on("click", function() {
        Audit.Common.Utilities.PrintStatusReport(pageTitle, divTbl);
      });
    }
    function BindExportButton(btnExport, fileNamePrefix, tbl) {
      $(btnExport).on("click", function(event) {
        var curDate = (/* @__PURE__ */ new Date()).format("yyyyMMdd_hhmmtt");
        Audit.Common.Utilities.ExportToCsv(fileNamePrefix + curDate, tbl);
      });
    }
    var publicMembers = {
      Load: m_fnLoadData,
      Refresh: m_fnRefresh
    };
    return publicMembers;
  };
})();
//# sourceMappingURL=sp_db.js.map
