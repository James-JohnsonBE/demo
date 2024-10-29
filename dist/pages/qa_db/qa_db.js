(() => {
  var __freeze = Object.freeze;
  var __defProp = Object.defineProperty;
  var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));

  // src/pages/qa_db/QA_DB_Template.js
  var html = String.raw;
  var _a;
  var qaDbTemplate = html(_a || (_a = __template([`
  <iframe id="CsvExpFrame" style="display: none"></iframe>

  <div
    id="divCounter"
    style="display: none"
    title="used to auto refresh the page"
  >
    1200
  </div>

  <div class="audit">
    <div id="divLoading" style="color: green; padding-bottom: 10px">
      Please Wait... Loading
      <span
        data-bind="visible: arrResponses().length > 0 && debugMode, text: arrResponses().length"
      ></span>
    </div>

    <div class="audit-body">
      <div class="reports-container">
        <div id="divRefresh" style="display: none">
          <div>
            <a
              title="Refresh this page"
              href="javascript:void(0)"
              onclick="Audit.Common.Utilities.Refresh()"
              ><span class="ui-icon ui-icon-refresh"></span>Refresh</a
            >
          </div>
          <div style="padding-bottom: 10px">
            <a
              title="View User Manual"
              href="javascript:void(0)"
              onclick="Audit.Common.Utilities.ViewUserManuals('QA User Manual')"
              ><span class="ui-icon ui-icon-help"></span>User Manual</a
            >
          </div>
        </div>

        <div>
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

  <script id="responseStatusReportTemplate" type="text/html">
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
              <th class="sorter-false" nowrap="nowrap">
                <select
                  id="ddlResponseRequestID"
                  data-bind="options: $root.ddOptionsResponseTabRequestID, value: filterResponseTabRequestID, optionsCaption: '-Select-'"
                ></select>
              </th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap">
                <select
                  id="ddlResponseRequestStatus"
                  data-bind="options: $root.ddOptionsResponseTabRequestStatus, value: filterResponseTabRequestStatus, optionsCaption: '-Select-'"
                ></select>
              </th>
              <th class="sorter-false" nowrap="nowrap">
                <select
                  id="ddlResponseRequestInternalDueDate"
                  data-bind="options: $root.ddOptionsResponseTabRequestInternalDueDate, value: filterResponseTabRequestIntDueDate, optionsCaption: '-Select-'"
                ></select>
              </th>
              <th class="sorter-false" nowrap="nowrap">
                <select
                  id="ddlResponseSampleNum"
                  data-bind="options: $root.ddOptionsResponseTabRequestSample, value: filterResponseTabSampleNum, optionsCaption: '-Select-'"
                ></select>
              </th>
              <th class="sorter-false" nowrap="nowrap">
                <select
                  id="ddlResponseName"
                  data-bind="options: $root.ddOptionsResponseTabResponseTitle, value: filterResponseTabResponseName, optionsCaption: '-Select-'"
                ></select>
              </th>
              <th class="sorter-false" nowrap="nowrap">
                <select
                  id="ddlResponseStatus"
                  data-bind="options: $root.ddOptionsResponseTabResponseStatus, value: filterResponseTabResponseStatus, optionsCaption: '-Select-'"
                ></select>
              </th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
            </tr>
            <tr valign="top">
              <th class="sorter-true" nowrap="nowrap">Request #</th>
              <th class="sorter-false" nowrap="nowrap">Subject</th>
              <th class="sorter-true" nowrap="nowrap">Request Status</th>
              <th class="sorter-true" nowrap="nowrap">Due Date</th>
              <th class="sorter-true" nowrap="nowrap">Sample #</th>
              <th class="sorter-true" nowrap="nowrap">Response Name</th>
              <th class="sorter-true" nowrap="nowrap">Status</th>
              <th class="sorter-true" nowrap="nowrap"># of Documents</th>
              <th class="sorter-true" nowrap="nowrap">Modified</th>
            </tr>
          </thead>
          <tbody id="fbody">
            <!-- ko foreach: arrResponses -->
            <tr
              class="sr-response-item"
              data-bind="css: { 'highlighted': highlight},
            visible: $root.filteredResponses().includes($data)"
            >
              <td
                class="sr-response-requestNum"
                data-bind="text: reqNumber"
              ></td>
              <td
                class="sr-response-requestSubject"
                data-bind="text: requestSubject"
              ></td>
              <td
                class="sr-response-requestStatus"
                data-bind="text: requestStatus "
              ></td>
              <td
                class="sr-response-internalDueDate"
                data-bind="text: internalDueDate"
              ></td>
              <td class="sr-response-sample" data-bind="text: sample"></td>
              <td class="sr-response-title">
                <a
                  href="javascript:void(0);"
                  title="Go to Response Details"
                  data-bind="text: title,
                click: () => Audit.QAReport.Report.GoToResponse($data.title)"
                ></a>
              </td>
              <td class="sr-response-status" data-bind="text: status"></td>
              <td class="sr-response-docCount" data-bind="text: docCount"></td>
              <td class="sr-response-modified" data-bind="text: modified"></td>
            </tr>
            <!-- /ko -->
          </tbody>
          <tfoot class="footer">
            <tr>
              <th colspan="9">
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

  <script id="responseDetailTemplate" type="text/html">
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
          </div>
          <div class="form-row">
            <dl>
              <dt>Request #</dt>
              <dd>
                <span id="requestInfoNum" data-bind="text: number"></span>
              </dd>
              <dt>Request Status</dt>
              <dd>
                <span
                  id="requestInfoStatus"
                  data-bind="text: request.status, style: { color:   request.status == 'Closed' ? 'red' : 'green' }"
                ></span>
                <span
                  data-bind="visible: request.status == 'Closed', style: { color: 'red'}"
                  >on
                  <span
                    data-bind="text: closedDate, style: { color: 'red'}"
                  ></span>
                </span>
              </dd>
              <dt>Subject</dt>
              <dd>
                <span
                  id="requestInfoSub"
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
              <dt>Sample?</dt>
              <dd>
                <span
                  id="requestInfoSample"
                  data-bind="text: request.sample, css: request.sample == true ? 'ui-icon ui-icon-check' : 'ui-icon ui-icon-close'"
                ></span>
              </dd>
              <dt>Response</dt>
              <dd>
                <span id="responseInfoName" data-bind="text: title"></span>
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

              <dt>Sample #</dt>
              <dd>
                <span
                  id="responseInfoSampleNum"
                  data-bind="text: sample"
                ></span>
              </dd>

              <dt>Action Office</dt>
              <dd>
                <span id="responseInfoAO" data-bind="text: actionOffice"></span>
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
          <div class="form-row">
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
          <div class="form-row">
            <div class="emphasized-section">
              <div class="fw-semibold">Internal Status Comments</div>
              <!-- ko if: typeof(request.internalStatus) != 'undefined' -->
              <div
                class="commentChain"
                data-bind="with: request.internalStatus"
              >
                <!-- ko if: showHistoryBool -->
                <!-- ko foreach: comments -->
                <div class="comment">
                  <div class="text" data-bind="text: text"></div>
                  <span
                    data-bind="text: author + ' @ ' + timestamp.toLocaleString()"
                  ></span>
                </div>
                <!-- /ko -->
                <!-- /ko -->
                <!-- ko ifnot: showHistoryBool -->
                <div
                  class="comment"
                  data-bind="with: comments()[comments().length - 1]"
                >
                  <div class="text" data-bind="text: text"></div>
                  <span
                    data-bind="text: author + ' @ ' + timestamp.toLocaleString()"
                  ></span>
                </div>
                <!-- /ko -->
                <a
                  title="Show hidden comments"
                  href="javascript:void(0)"
                  data-bind="click: toggleShowHistory"
                >
                  <span class="ui-icon ui-icon-comment"></span>
                  Toggle Comment History (<span
                    data-bind="text: comments().length"
                  ></span>
                  Total)
                </a>
              </div>
              <!-- /ko -->
            </div>
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
                        data-bind="downloadLink: '../_layouts/download.aspx?SourceUrl=:folder/:fileName'"
                        ><span data-bind="text: fileName"></span
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

          <div>
            <fieldset
              class="divCloseResponse"
              style="border-color: GreenYellow"
              data-bind="visible: currentResponse && showCloseResponse"
            >
              <legend style="font-weight: bold; font-size: 10pt">Action</legend>
              <a
                class="btnCloseResponse"
                href="javascript:void(0)"
                title="Click to Close Response"
                style="font-size: 11pt"
                data-bind="click: ClickCloseResponse"
                ><span class="ui-icon ui-icon-gear"></span>Close Response</a
              >
            </fieldset>
            <fieldset
              class="divReturnToCGFS"
              style="border-color: GreenYellow"
              data-bind="visible: currentResponse && showReturnToCGFS"
            >
              <legend style="font-weight: bold; font-size: 10pt">Action</legend>
              <a
                class="btnReturnToCGFS"
                href="javascript:void(0)"
                title="Click to Return to CGFS"
                data-bind="click: ClickReturnToCGFS"
                ><span class="ui-icon ui-icon-gear"></span>Return to CGFS</a
              >
            </fieldset>
            <fieldset
              class="divBulkApprove"
              data-bind="visible: currentResponse && showBulkApprove"
            >
              <legend>Action</legend>
              <a
                class="btnApproveAll"
                href="javascript:void(0)"
                title="Click to Approve Remaining Documents"
                data-bind="click: ClickBulkApprove"
                ><span class="ui-icon ui-icon-circle-check"></span>Approve All
                Documents</a
              >
            </fieldset>
          </div>

          <div id="divResponseDocs" data-bind="visible: currentResponse">
            <fieldset>
              <legend>Response Documents</legend>
              <div
                id="divEmptyResponseDocsMsg"
                style="border: 0px !important; font-style: italic"
                data-bind="visible: cntResponseDocs() == 0"
              >
                There are 0 response documents
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
                    <th class="sorter-false" nowrap="nowrap">Receipt Date</th>
                    <th class="sorter-false" nowrap="nowrap">File Size</th>
                    <th class="sorter-false" nowrap="nowrap">
                      Status
                      <span
                        ><a
                          title="View Help"
                          href="javascript:void(0)"
                          style="color: #0072bc"
                          data-bind="click: ClickHelpResponseDocs"
                          ><span class="ui-icon ui-icon-help"></span></a
                      ></span>
                    </th>
                    <th class="sorter-false" nowrap="nowrap">Reason</th>
                    <th class="sorter-false" nowrap="nowrap">
                      Action
                      <span
                        ><a
                          title="View Help"
                          href="javascript:void(0)"
                          style="color: #0072bc"
                          data-bind="click: ClickHelpResponseDocs"
                          ><span class="ui-icon ui-icon-help"></span></a
                      ></span>
                    </th>
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
                    </td>
                    <td nowrap data-bind="text: receiptDate"></td>
                    <td nowrap data-bind="text: fileSize"></td>
                    <td nowrap data-bind="text: documentStatus"></td>
                    <td data-bind="html: rejectReason"></td>
                    <td nowrap>
                      <span
                        data-bind="visible: ($parent.responseStatus == '4-Approved for QA' || $parent.responseStatus == '6-Reposted After Rejection') && documentStatus == 'Sent to QA'"
                      >
                        <a
                          title="Approve this Document"
                          href="javascript:void(0)"
                          data-bind="click: $root.ClickApproveResponseDoc"
                          ><span class="ui-icon ui-icon-circle-check"
                            >Approve Response Doc</span
                          ></a
                        >
                        <a
                          title="Reject this Document"
                          href="javascript:void(0)"
                          data-bind="click: $root.ClickRejectResponseDoc"
                          ><span class="ui-icon ui-icon-circle-close"
                            >Reject Response Doc</span
                          ></a
                        >
                      </span>
                    </td>
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

          <div
            class="divReturnToCGFS"
            data-bind="visible: currentResponse && showReturnToCGFS"
          >
            <fieldset style="border-color: GreenYellow">
              <legend style="font-weight: bold; font-size: 10pt">Action</legend>
              <span class="ui-icon ui-icon-gear"></span
              ><a
                class="btnReturnToCGFS"
                href="javascript:void(0)"
                title="Click to Return to CGFS"
                data-bind="click: ClickReturnToCGFS"
                >Return to CGFS</a
              >
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

  // src/pages/qa_db/qa_db.js
  document.getElementById("app").innerHTML = qaDbTemplate;
  window.Audit = window.Audit || {};
  Audit.QAReport = Audit.QAReport || {};
  var responseParam = "ResNum";
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
    Audit.QAReport.Report = new Audit.QAReport.NewReportPage();
    Audit.QAReport.Init();
  }
  Audit.QAReport.Init = function() {
    var paramShowSiteActionsToAnyone2 = GetUrlKeyValue("ShowSiteActions");
    if (paramShowSiteActionsToAnyone2 != true) {
      $("#RibbonContainer-TabRowLeft").hide();
      $(".ms-siteactionsmenu").hide();
    }
    function SetTimer() {
      var intervalRefreshID = setInterval(function() {
        var divVal = $("#divCounter").text();
        var count = divVal * 1 - 1;
        $("#divCounter").text(count);
        if (count <= 0) {
          if (!Audit.QAReport.Report.IsTransactionExecuting())
            Audit.Common.Utilities.Refresh();
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
  Audit.QAReport.NewReportPage = function() {
    var m_arrRequests = new Array();
    var m_arrResponses = new Array();
    var m_bigMap = new Object();
    var m_IA_SPGroupName = null;
    var m_IA_ActionOffice = null;
    var m_itemID = null;
    var m_RejectReason = "";
    var m_resStatusToFilterOn = "";
    var m_bIsTransactionExecuting = false;
    var memberGroup = null;
    var statusId2 = null;
    var notifyId2 = null;
    let m_waitDialog = null;
    var m_requestItems = null;
    var m_requestInternalItems = null;
    var m_responseItems = null;
    var m_ResponseDocsItems = null;
    var m_aoItems = null;
    let eaReponseDocsFolderItems = null;
    let eaEmailLogListItems = null;
    function CommentChainField(requestId, props) {
      var requestListTitle = props.requestListTitle;
      var columnName = props.columnName;
      var initialValue = props.initialValue;
      var showHistoryBool = ko.observable(false);
      var toggleShowHistory = function() {
        showHistoryBool(!showHistoryBool());
      };
      var arrInitialComments = [];
      if (initialValue) {
        try {
          arrInitialComments = JSON.parse(initialValue);
          arrInitialComments.forEach(function(comment) {
            comment.timestamp = new Date(comment.timestamp);
          });
        } catch (e) {
          console.error("could not parse internal status comments.");
        }
      }
      var comments = ko.observableArray(arrInitialComments);
      var newCommentText = ko.observable();
      function onSubmit() {
        var comment = {
          id: Math.ceil(Math.random() * 1e6).toString(16),
          text: newCommentText(),
          author: _spPageContextInfo.userLoginName,
          timestamp: /* @__PURE__ */ new Date()
        };
        comments.push(comment);
        commitChanges();
      }
      function onRemove(commentToRemove) {
        if (confirm("Are you sure you want to delete this item?")) {
          var commentIndex = comments.indexOf(commentToRemove);
          comments.splice(commentIndex, 1);
          commitChanges();
        }
      }
      function commitChanges() {
        var currCtx = new SP.ClientContext.get_current();
        var web = currCtx.get_web();
        var requestList = web.get_lists().getByTitle(requestListTitle);
        const oListItem = requestList.getItemById(requestId);
        oListItem.set_item(columnName, JSON.stringify(comments()));
        oListItem.update();
        currCtx.load(oListItem);
        currCtx.executeQueryAsync(
          function onSuccess() {
            newCommentText("");
          },
          function onFailure(args, sender) {
            console.error("Failed to commit changes.", args);
          }
        );
      }
      var publicMembers2 = {
        comments,
        newCommentText,
        onSubmit,
        onRemove,
        toggleShowHistory,
        showHistoryBool
      };
      return publicMembers2;
    }
    function ViewModel() {
      var self = this;
      self.debugMode = ko.observable(false);
      self.siteUrl = Audit.Common.Utilities.GetSiteUrl();
      self.arrResponses = ko.observableArray(null);
      self.cntPendingReview = ko.observable(0);
      self.ddOptionsResponseTabRequestID = ko.observableArray();
      self.ddOptionsResponseTabRequestStatus = ko.observableArray();
      self.ddOptionsResponseTabRequestInternalDueDate = ko.observableArray();
      self.ddOptionsResponseTabRequestSample = ko.observableArray();
      self.ddOptionsResponseTabResponseTitle = ko.observableArray();
      self.ddOptionsResponseTabResponseStatus = ko.observableArray();
      self.filterResponseTabRequestID = ko.observable();
      self.filterResponseTabRequestStatus = ko.observable();
      self.filterResponseTabRequestIntDueDate = ko.observable();
      self.filterResponseTabSampleNum = ko.observable();
      self.filterResponseTabResponseName = ko.observable();
      self.filterResponseTabResponseStatus = ko.observable();
      self.doSort = ko.observable(false);
      self.ddOptionsResponseInfoTabResponseNameOpen2 = ko.observableArray();
      self.ddOptionsResponseInfoTabResponseNameProcessed2 = ko.observableArray();
      self.filterResponseInfoTabResponseNameOpen2 = ko.observable("");
      self.filterResponseInfoTabResponseNameProcessed2 = ko.observable("");
      self.currentResponse = ko.observable();
      self.arrCoverSheets = ko.observableArray(null);
      self.arrResponseDocs = ko.observable();
      self.cntResponseDocs = ko.observable(0);
      self.showBulkApprove = ko.observable(false);
      self.showCloseResponse = ko.observable(false);
      self.showReturnToCGFS = ko.observable(false);
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
      self.ClearFiltersResponseTab = function() {
        self.filterResponseTabRequestID("");
        self.filterResponseTabRequestStatus("");
        self.filterResponseTabRequestIntDueDate("");
        self.filterResponseTabSampleNum("");
        self.filterResponseTabResponseName("");
        self.filterResponseTabResponseStatus("");
      };
      self.filteredResponses = ko.pureComputed(() => {
        const responses = ko.unwrap(self.arrResponses);
        var requestID = self.filterResponseTabRequestID();
        var requestStatus = self.filterResponseTabRequestStatus();
        var requestIntDueDate = self.filterResponseTabRequestIntDueDate();
        var sampleNum = self.filterResponseTabSampleNum();
        var responseName = self.filterResponseTabResponseName();
        var responseStatus = self.filterResponseTabResponseStatus();
        if (!requestID && !requestStatus && !requestIntDueDate && !sampleNum && !responseName && !responseStatus) {
          document.body.style.cursor = "default";
          return responses;
        }
        const filteredResponses = responses.filter((response) => {
          if (responseStatus && response.status != responseStatus)
            return false;
          if (requestID && response.reqNumber != requestID)
            return false;
          if (requestStatus && response.requestStatus != requestStatus)
            return false;
          if (requestIntDueDate && response.internalDueDate != requestIntDueDate)
            return false;
          if (responseName && response.title != responseName)
            return false;
          if (sampleNum && response.sample != sampleNum)
            return false;
          return true;
        });
        return filteredResponses;
      });
      self.arrFilteredResponsesCount = ko.pureComputed(() => {
        return self.filteredResponses().length;
      });
      self.FilterChangedResponseTab = function() {
        document.body.style.cursor = "wait";
        setTimeout(function() {
          var requestID = self.filterResponseTabRequestID();
          var requestStatus = self.filterResponseTabRequestStatus();
          var requestIntDueDate = self.filterResponseTabRequestIntDueDate();
          var sampleNum = self.filterResponseTabSampleNum();
          var responseName = self.filterResponseTabResponseName();
          var responseStatus = self.filterResponseTabResponseStatus();
          if (!requestID && !requestStatus && !requestIntDueDate && !sampleNum && !responseName && !responseStatus) {
            $(".sr-response-item").show();
            document.body.style.cursor = "default";
            return;
          }
          requestID = !requestID ? "" : requestID;
          requestStatus = !requestStatus ? "" : requestStatus;
          requestIntDueDate = !requestIntDueDate ? "" : requestIntDueDate;
          sampleNum = !sampleNum ? "" : sampleNum;
          responseName = !responseName ? "" : responseName;
          responseStatus = !responseStatus ? "" : responseStatus;
          var count = 0;
          var eacher = $(".sr-response-item");
          eacher.each(function() {
            var hide = false;
            if (!hide && requestID != "" && $.trim($(this).find(".sr-response-requestNum").text()) != requestID)
              hide = true;
            if (!hide && requestStatus != "" && $.trim($(this).find(".sr-response-requestStatus").text()) != requestStatus)
              hide = true;
            if (!hide && requestIntDueDate != "" && $.trim($(this).find(".sr-response-internalDueDate").text()) != requestIntDueDate)
              hide = true;
            if (!hide && responseName != "" && $.trim($(this).find(".sr-response-title").text()) != responseName)
              hide = true;
            if (!hide && sampleNum != "" && $.trim($(this).find(".sr-response-sample").text()) != sampleNum)
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
          document.body.style.cursor = "default";
        }, 100);
      };
      self.ClickHelpResponseDocs = function() {
        m_fnDisplayHelpResponseDocs();
      };
      self.ClickCloseResponse = function() {
        m_fnCloseResponse();
      };
      self.ClickReturnToCGFS = function() {
        m_fnReturnToCGFS();
      };
      self.ClickBulkApprove = function() {
        m_fnApproveAll();
      };
      self.ClickApproveResponseDoc = function(oResponseDoc) {
        if (oResponseDoc && oResponseDoc.ID && oResponseDoc.fileName)
          m_fnApproveResponseDoc(oResponseDoc.ID, oResponseDoc.fileName);
      };
      self.ClickRejectResponseDoc = function(oResponseDoc) {
        if (oResponseDoc && oResponseDoc.ID && oResponseDoc.fileName)
          m_fnRejectResponseDoc(oResponseDoc.ID, oResponseDoc.fileName);
      };
      self.currentResponse.subscribe((response) => {
        if (response)
          setUrlParam(responseParam, response.title);
      });
      self.doSort.subscribe(function(newValue) {
        Audit.Common.Utilities.OnLoadDisplayTimeStamp();
        if (self.arrResponses().length > 0 && newValue) {
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
            self.ddOptionsResponseTabRequestID(),
            self.GetDDVals("reqNumber")
          );
          self.ddOptionsResponseTabRequestID.valueHasMutated();
          ko.utils.arrayPushAll(
            self.ddOptionsResponseTabRequestStatus(),
            self.GetDDVals("requestStatus")
          );
          self.ddOptionsResponseTabRequestStatus.valueHasMutated();
          ko.utils.arrayPushAll(
            self.ddOptionsResponseTabRequestInternalDueDate(),
            self.GetDDVals("internalDueDate")
          );
          self.ddOptionsResponseTabRequestInternalDueDate.valueHasMutated();
          ko.utils.arrayPushAll(
            self.ddOptionsResponseTabRequestSample(),
            self.GetDDVals("sample")
          );
          self.ddOptionsResponseTabRequestSample.valueHasMutated();
          ko.utils.arrayPushAll(
            self.ddOptionsResponseTabResponseTitle(),
            self.GetDDVals("title", true)
          );
          self.ddOptionsResponseTabResponseTitle.valueHasMutated();
          setTimeout(function() {
            var paramTabIndex = GetUrlKeyValue("Tab");
            if (paramTabIndex != null && paramTabIndex != "") {
              _myViewModel.tabs.selectById(paramTabIndex);
            } else {
              _myViewModel.tabs.selectTab(_myViewModel.tabOpts.Responses);
            }
            var paramResponseNum = GetUrlKeyValue("ResNum");
            if (paramResponseNum != null && paramResponseNum != "") {
              if (paramTabIndex == _myViewModel.tabOpts.Responses.id) {
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
            if (m_resStatusToFilterOn != "")
              self.filterResponseTabResponseStatus(m_resStatusToFilterOn);
            else
              self.filterResponseTabRequestStatus("Open");
            $("#tblStatusReportResponses").tablesorter({
              sortList: [[3, 0]],
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
        self.showBulkApprove(false);
        self.showCloseResponse(false);
        self.showReturnToCGFS(false);
        var oResponse = m_bigMap["response-" + newValue];
        if (oResponse) {
          if (bOpenResponses)
            self.filterResponseInfoTabResponseNameProcessed2("");
          else
            self.filterResponseInfoTabResponseNameOpen2("");
          self.currentResponse(oResponse);
          LoadTabResponseInfoCoverSheets(oResponse);
          LoadTabResponseInfoResponseDocs(oResponse);
          setTimeout(function() {
            const notifyId3 = SP.UI.Notify.addNotification(
              "Displaying Response (" + oResponse.title + ")",
              false
            );
          });
        }
      };
      self.GetDDVals = function(fieldName, sortAsResponse) {
        var types = ko.utils.arrayMap(self.arrResponses(), function(item) {
          return item[fieldName];
        });
        var ddArr = ko.utils.arrayGetDistinctValues(types).sort();
        if (sortAsResponse)
          ddArr.sort(Audit.Common.Utilities.SortResponseTitles);
        if (ddArr[0] == "")
          ddArr.shift();
        return ddArr;
      };
      self.GetDDVals2 = function(responseStatusType, sortAsResponse) {
        var types = ko.utils.arrayMap(self.arrResponses(), function(item) {
          var requestStatus = item.requestStatus;
          var responseStatus = item.status;
          if (responseStatusType == 0) {
            if (responseStatus != "4-Approved for QA" && responseStatus != "6-Reposted After Rejection")
              return item["title"];
            else
              return "";
          } else if (responseStatusType == 1) {
            if ((responseStatus == "4-Approved for QA" || responseStatus == "6-Reposted After Rejection") && (requestStatus == "Open" || requestStatus == "ReOpened"))
              return item["title"];
            else
              return "";
          }
        });
        var ddArr = ko.utils.arrayGetDistinctValues(types).sort();
        if (sortAsResponse)
          ddArr.sort(Audit.Common.Utilities.SortResponseTitles);
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
      var requestInternalList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleRequestsInternal());
      var requestInternalQuery = new SP.CamlQuery();
      requestInternalQuery.set_viewXml(
        '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'
      );
      m_requestInternalItems = requestInternalList.getItems(requestInternalQuery);
      currCtx.load(
        m_requestInternalItems,
        "Include(ID, Title, ReqNum, InternalStatus)"
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
      var aoList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleActionOffices());
      var aoQuery = new SP.CamlQuery();
      aoQuery.set_viewXml(
        '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'
      );
      m_aoItems = aoList.getItems(aoQuery);
      currCtx.load(m_aoItems, "Include(ID, Title, UserGroup)");
      memberGroup = web.get_associatedMemberGroup();
      currCtx.load(memberGroup);
      currCtx.executeQueryAsync(OnSuccess, OnFailure);
      function OnSuccess(sender, args) {
        $("#divRefresh").show();
        m_fnLoadData();
      }
      function OnFailure(sender, args) {
        $("#divRefresh").hide();
        $("#divLoading").hide();
        const statusId3 = SP.UI.Status.addStatus(
          "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
        );
        SP.UI.Status.setStatusPriColor(statusId3, "red");
      }
    }
    function m_fnLoadData() {
      Audit.Common.Utilities.LoadActionOffices(m_aoItems);
      if (memberGroup != null)
        m_IA_SPGroupName = memberGroup.get_title();
      if (m_IA_SPGroupName == null || m_IA_SPGroupName == "") {
        const statusId3 = SP.UI.Status.addStatus(
          "Unable to retrieve the IA SharePoint Group. Please contact the Administrator"
        );
        SP.UI.Status.setStatusPriColor(statusId3, "red");
        return;
      }
      m_IA_ActionOffice = Audit.Common.Utilities.GetActionOffices()?.find(
        (ao) => ao.userGroup == m_IA_SPGroupName
      );
      LoadRequests();
      LoadResponses();
      LoadResponseDocs();
      LoadTabStatusReport(m_arrResponses, "fbody");
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
        var arrActionOffice = oListItem.get_item("ActionOffice");
        var actionOffice = "";
        for (var x = 0; x < arrActionOffice.length; x++) {
          actionOffice += "<div>" + arrActionOffice[x].get_lookupValue() + "</div>";
        }
        var internalDueDate = oListItem.get_item("InternalDueDate");
        var closedDate = oListItem.get_item("ClosedDate");
        internalDueDate != null ? internalDueDate = internalDueDate.format("MM/dd/yyyy") : internalDueDate = "";
        closedDate != null ? closedDate = closedDate.format("MM/dd/yyyy") : closedDate = "";
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
        requestObject["actionOffice"] = actionOffice;
        requestObject["comments"] = comments;
        requestObject["emailSent"] = emailSent;
        requestObject["closedDate"] = closedDate;
        requestObject["relatedAudit"] = relatedAudit;
        requestObject["actionItems"] = actionItems;
        requestObject["arrIndex"] = cnt;
        m_arrRequests.push(requestObject);
        m_bigMap[number] = requestObject;
        cnt++;
      }
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
          var requestObject = m_bigMap[reqNum.get_lookupValue()];
          requestObject.internalStatus = new CommentChainField(id2, {
            requestListTitle: Audit.Common.Utilities.GetListTitleRequestsInternal(),
            columnName: "InternalStatus",
            initialValue: oListItem.get_item("InternalStatus")
          });
        }
      } catch (err) {
        alert(err);
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
          responseObject["request"] = m_bigMap[number];
          if (!responseObject.request || !responseObject.request.emailSent)
            continue;
          responseObject["item"] = oListItem;
          responseObject["resStatus"] = oListItem.get_item("ResStatus");
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
          var modifiedDate = oListItem.get_item("Modified");
          modifiedDate != null ? modifiedDate = modifiedDate.format("MM/dd/yyyy hh:mm tt") : modifiedDate = "";
          responseObject["modified"] = modifiedDate;
          var closedDate = oListItem.get_item("ClosedDate");
          closedDate != null ? closedDate = closedDate.format("MM/dd/yyyy") : closedDate = "";
          responseObject["closedDate"] = closedDate;
          responseObject["sample"] = oListItem.get_item("SampleNumber");
          if (responseObject["sample"] == null)
            responseObject["sample"] = "";
          responseObject["coversheets"] = new Array();
          responseObject["responseDocs"] = new Array();
          var responseComments = oListItem.get_item("Comments");
          if (responseComments == null)
            responseComments = "";
          responseObject["comments"] = responseComments;
          responseObject["closedBy"] = Audit.Common.Utilities.GetFriendlyDisplayName(oListItem, "ClosedBy");
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
            responseDocObject["title"] = oListItem.get_item("Title");
            if (responseDocObject["title"] == null)
              responseDocObject["title"] = "";
            responseDocObject["fileName"] = oListItem.get_item("FileLeafRef");
            responseDocObject["title"] = oListItem.get_item("FileLeafRef");
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
              receiptDate = oListItem.get_item("ReceiptDate").format("MM/dd/yyyy");
            responseDocObject["receiptDate"] = receiptDate;
            var modifiedDate = "";
            if (oListItem.get_item("Modified") != null && oListItem.get_item("Modified") != "")
              modifiedDate = oListItem.get_item("Modified").format("MM/dd/yyyy hh:mm tt");
            responseDocObject["modifiedDate"] = modifiedDate;
            responseDocObject["modifiedBy"] = Audit.Common.Utilities.GetFriendlyDisplayName(oListItem, "Editor");
            responseDocObject["item"] = oListItem;
            oResponse["responseDocs"].push(responseDocObject);
          }
        } catch (err) {
        }
      }
    }
    function LoadTabStatusReport(arr, fbody) {
      if (arr == null)
        return;
      var responseArr = new Array();
      var responseStatus1 = "4-Approved for QA";
      var responseStatus2 = "6-Reposted After Rejection";
      var count = 0;
      var resStatus1 = 0;
      var resStatus2 = 0;
      var arrlength = arr.length;
      while (arrlength--) {
        var oResponse = arr[arrlength];
        var responseTitle = oResponse.title;
        var requestStatus = oResponse.request.status;
        var responseStatus = oResponse.resStatus;
        var highlight = false;
        if ((responseStatus == responseStatus1 || responseStatus == responseStatus2) && (requestStatus == "Open" || requestStatus == "ReOpened")) {
          count++;
          if (responseStatus == responseStatus1)
            resStatus1++;
          else
            resStatus2++;
          highlight = true;
        }
        var responseTitle = oResponse.title;
        var requestStatus = oResponse.request.status;
        var responseStatus = oResponse.resStatus;
        var aResponse = {
          reqNumber: oResponse.request.number,
          requestSubject: oResponse.request.subject,
          requestStatus,
          internalDueDate: oResponse.request.internalDueDate,
          sample: oResponse.sample,
          title: responseTitle,
          status: responseStatus,
          docCount: oResponse.responseDocs.length,
          modified: oResponse.modified,
          comments: oResponse.comments,
          highlight,
          visibleRow: ko.observable(true)
        };
        responseArr.push(aResponse);
      }
      if (responseArr.length > 0) {
        m_resStatusToFilterOn = "";
        if (resStatus1 > 0 && resStatus2 == 0)
          m_resStatusToFilterOn = responseStatus1;
        else if (resStatus2 > 0 && resStatus1 == 0)
          m_resStatusToFilterOn = responseStatus2;
        _myViewModel.cntPendingReview(count);
        ko.utils.arrayPushAll(_myViewModel.arrResponses, responseArr);
      }
      _myViewModel.doSort(true);
    }
    function DoUpdateModel(arrResponsesToAdd, initialTrip) {
      var subArr = [];
      var bContinue = true;
      var batchSize = 100;
      if (initialTrip)
        batchSize = 100;
      if (arrResponsesToAdd.length >= batchSize) {
        subArr = arrResponsesToAdd.slice(0, batchSize);
        arrResponsesToAdd.splice(0, batchSize);
      } else if (arrResponsesToAdd.length > 0) {
        subArr = arrResponsesToAdd.slice(0, arrResponsesToAdd.length);
        arrResponsesToAdd.splice(0, arrResponsesToAdd.length);
      }
      if (bContinue) {
        ko.utils.arrayPushAll(_myViewModel.arrResponses(), subArr);
        var updatedMutated = false;
        if (initialTrip) {
          updatedMutated = true;
        }
        _myViewModel.arrResponses.valueHasMutated();
        if (arrResponsesToAdd.length == 0) {
          _myViewModel.doSort(true);
        }
        if (arrResponsesToAdd.length > 0) {
          setTimeout(function() {
            DoUpdateModel(arrResponsesToAdd, false);
          }, 100);
        }
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
                  arrCS.push({
                    folder: csFolder,
                    fileName: csTitle
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
        $("#tblCoverSheets").hide();
        $("#divEmptyCoversheetsMsg").show();
      }
      currCtx.executeQueryAsync(
        Function.createDelegate(data2, OnSuccess),
        Function.createDelegate(data2, OnFailure)
      );
    }
    function LoadTabResponseInfoResponseDocs(oResponse) {
      _myViewModel.arrResponseDocs(null);
      _myViewModel.cntResponseDocs(0);
      _myViewModel.showBulkApprove(false);
      _myViewModel.showCloseResponse(false);
      _myViewModel.showReturnToCGFS(false);
      if ((oResponse == null || oResponse.responseDocs.length == 0) && $("#ddlResponsesOpen").val() != "") {
        notifyId2 = SP.UI.Notify.addNotification(
          "There are 0 documents to review for " + $("#ddlResponsesOpen").val(),
          false
        );
        _myViewModel.showReturnToCGFS(true);
        return;
      }
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
        statusId2 = SP.UI.Status.addStatus(
          "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
        );
        SP.UI.Status.setStatusPriColor(statusId2, "red");
      }
      currCtx.executeQueryAsync(OnSuccess, OnFailure);
      function RenderResponses(oResponse2) {
        if (oResponse2 == null)
          return;
        var rowCount = 0;
        var cntCanBeApprovedOrRejected = 0;
        var cntApprovedOrArchived = 0;
        var bDisplayingCloseBtn = false;
        var arrResponseDocs = new Array();
        for (var z2 = 0; z2 < oResponse2.responseDocs.length; z2++) {
          var oResponseDoc2 = oResponse2.responseDocs[z2];
          oResponseDoc2.docIcon = oResponseDoc2.docIcon.get_value();
          oResponseDoc2.styleTag = Audit.Common.Utilities.GetResponseDocStyleTag2(
            oResponseDoc2.documentStatus
          );
          oResponseDoc2.responseTitle = oResponse2.title;
          if ((oResponse2.resStatus == "4-Approved for QA" || oResponse2.resStatus == "6-Reposted After Rejection") && oResponseDoc2.documentStatus == "Sent to QA") {
            cntCanBeApprovedOrRejected++;
            _myViewModel.showBulkApprove(true);
          } else if ((oResponse2.resStatus == "4-Approved for QA" || oResponse2.resStatus == "6-Reposted After Rejection") && oResponseDoc2.documentStatus == "Rejected") {
            _myViewModel.showReturnToCGFS(true);
          } else if ((oResponse2.resStatus == "4-Approved for QA" || oResponse2.resStatus == "6-Reposted After Rejection") && (oResponseDoc2.documentStatus == "Archived" || oResponseDoc2.documentStatus == "Approved")) {
            cntApprovedOrArchived++;
          }
          arrResponseDocs.push(oResponseDoc2);
        }
        var arrResponseSummary = {
          responseTitle: oResponse2.title,
          responseDocs: arrResponseDocs,
          responseStatus: oResponse2.resStatus
        };
        if (cntApprovedOrArchived == arrResponseDocs.length && $("#ddlResponsesOpen").val() != "") {
          _myViewModel.showCloseResponse(true);
          SP.UI.Notify.addNotification(
            "This Response did not automatically close. Please close this response.",
            false
          );
        }
        if (!bDisplayingCloseBtn && cntCanBeApprovedOrRejected == 0 && $("#ddlResponsesOpen").val() != "") {
          _myViewModel.showReturnToCGFS(true);
        }
        _myViewModel.arrResponseDocs(arrResponseSummary);
        _myViewModel.arrResponseDocs.valueHasMutated();
        _myViewModel.cntResponseDocs(oResponse2.responseDocs.length);
      }
    }
    function m_fnDisplayHelpResponseDocs() {
      var helpDlg = "<div id='helpDlg' style='padding:20px; height:100px; width:700px'><div style='padding:20px;'><fieldset><legend>Response Document Status</legend> <ul style='padding-top:10px;'><li style='padding-top:5px;'><b>Submitted</b> - Submitted to the Internal Auditor by the Action Office</li><li style='padding-top:5px;'><b>Sent to QA</b> - Submitted to the Quality Assurance team by the Internal Auditor</li><li style='padding-top:5px;'><b>Approved</b> - Approved by the Quality Assurance team and submitted to the External Auditor</li><li style='padding-top:5px;'><b>Rejected</b> - Rejected by the Quality Assurance team and returned to the Internal Auditor</li><li style='padding-top:5px;'><b>Archived</b> - Previously Rejected by the Quality Assurance team and is now read-only for record keeping</li></ul></fieldset></div><div style='padding:20px; padding-top:10px;'><fieldset style='padding-top:10px;'><legend>Actions</legend> If the Response Status is <b>4-Approved for QA</b> or <b>6-Reposted After Rejection</b>, then the documents can be <b>Approved</b> or <b>Rejected</b><ul style='padding-top:10px;'><li style='padding-top:5px;'><b>Approve</b> - Submit the document to the External Auditor</li><li style='padding-top:5px;'><b>Reject</b> - Reject the document and return to the Internal Auditor</li></ul></fieldset></div><table style='padding-top:10px; width:200px; float:right'><tr><td class='ms-separator'>&#160;</td><td><input id='btnCancel' type='button' class='ms-ButtonHeightWidth' value='Close' title='Close Help' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)'/></td></tr></table></div>";
      $("body").append(helpDlg);
      var options = SP.UI.$create_DialogOptions();
      options.title = "Response Documents Help";
      options.dialogReturnValueCallback = OnCallbackForm;
      options.html = document.getElementById("helpDlg");
      options.height = 450;
      SP.UI.ModalDialog.showModalDialog(options);
    }
    let m_cntToApprove = 0;
    let m_cntApproved = 0;
    function m_fnApproveAll() {
      m_bIsTransactionExecuting = true;
      var approveResponseDocDlg = "<div id='approveResponseDocDlg' style='padding:20px; height:100px'><div style='padding:20px;'>Are you sure you would like to <span style='font-weight:bold; color:green'>Approve</span> all remaining documents?</span></div><table style='padding-top:10px; width:200px; margin:0px auto'><tr><td><input id='btnClientOk1' type='button' class='ms-ButtonHeightWidth' value='Send to Auditor' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK)'/></td><td class='ms-separator'>&#160;</td><td><input id='btnCancel' type='button' class='ms-ButtonHeightWidth' value='Close' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)'/></td></tr></table></div>";
      $("body").append(approveResponseDocDlg);
      var options = SP.UI.$create_DialogOptions();
      options.title = "Approve Response Documents";
      options.dialogReturnValueCallback = OnCallbackApproveAllResponseDoc;
      options.html = document.getElementById("approveResponseDocDlg");
      SP.UI.ModalDialog.showModalDialog(options);
    }
    function m_fnApproveResponseDoc(id2, responseDocFileName) {
      m_bIsTransactionExecuting = true;
      m_itemID = id2;
      m_RejectReason = "";
      var approveResponseDocDlg = "<div id='approveResponseDocDlg' style='padding:20px; height:100px'><div style='padding:20px;'>Are you sure you would like to <span style='font-weight:bold; color:green'>Approve</span> the Response Document? <p style='padding-top:10px; font-weight:bold; color:green'>" + responseDocFileName + "</p></span></div><table style='padding-top:10px; width:200px; margin:0px auto'><tr><td><input id='btnClientOk1' type='button' class='ms-ButtonHeightWidth' value='Send to Auditor' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK)'/></td><td class='ms-separator'>&#160;</td><td><input id='btnCancel' type='button' class='ms-ButtonHeightWidth' value='Close' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)'/></td></tr></table></div>";
      $("body").append(approveResponseDocDlg);
      var options = SP.UI.$create_DialogOptions();
      options.title = "Approve Response Document";
      options.dialogReturnValueCallback = OnCallbackApproveResponseDoc;
      options.html = document.getElementById("approveResponseDocDlg");
      SP.UI.ModalDialog.showModalDialog(options);
    }
    function m_fnRejectResponseDoc(id2, responseDocFileName) {
      m_bIsTransactionExecuting = true;
      m_itemID = id2;
      m_RejectReason = "";
      var rejectResponseDocDlg = "<div id='rejectResponseDocDlg' style='padding:20px; height:100px'><div style='padding:20px;'>Are you sure you would like to <span style='font-weight:bold; color:DarkRed'>Reject</span> the Response Document? <p style='padding-top:10px; font-weight:bold; color:DarkRed'>" + responseDocFileName + "</p><p style='padding-top:10px'>If so, please specify the reason: </p><p><textarea id='txtRejectReason' cols='50' rows='3' onkeyup='Audit.QAReport.Report.GetCancelReason()'></textarea></p></span></div><table style='padding-top:10px; width:200px; margin:0px auto'><tr><td><input id='btnClientOk1' type='button' class='ms-ButtonHeightWidth' value='Yes, Reject Document' disabled='disabled' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK)'/></td><td class='ms-separator'>&#160;</td><td><input id='btnCancel' type='button' class='ms-ButtonHeightWidth' value='Close' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)'/></td></tr></table></div>";
      $("body").append(rejectResponseDocDlg);
      var options = SP.UI.$create_DialogOptions();
      options.title = "Reject Response Document";
      options.dialogReturnValueCallback = OnCallbackRejectResponseDoc;
      options.html = document.getElementById("rejectResponseDocDlg");
      SP.UI.ModalDialog.showModalDialog(options);
      $("#txtRejectReason").focus();
    }
    function m_fnCloseResponse() {
      m_bIsTransactionExecuting = true;
      var responseDocDlg = "<div id='responseDocDlg' style='padding:20px; height:100px'><div style='padding:20px;'>All documents in this response are Approved. Are you sure you would like to <span style='font-weight:bold; color:green'>Close this Response</span>? </span></div><table style='padding-top:10px; width:200px; margin:0px auto'><tr><td><input id='btnClientOk1' type='button' class='ms-ButtonHeightWidth' value='Close Response' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK)'/></td><td class='ms-separator'>&#160;</td><td><input id='btnCancel' type='button' class='ms-ButtonHeightWidth' value='Close' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)'/></td></tr></table></div>";
      $("body").append(responseDocDlg);
      var options = SP.UI.$create_DialogOptions();
      options.title = "Close Response";
      options.dialogReturnValueCallback = OnCallbackCloseResponse;
      options.html = document.getElementById("responseDocDlg");
      SP.UI.ModalDialog.showModalDialog(options);
    }
    function m_fnReturnToCGFS() {
      m_bIsTransactionExecuting = true;
      var responseDocDlg = "<div id='responseDocDlg' style='padding:20px; height:100px'><div style='padding:20px;'>Are you sure you would like to <span style='font-weight:bold; color:darkred'>Return this Response to CGFS</span>? <p style='padding-top:10px;'><b>Note</b>: If you return it, you will no longer be able to Approve or Reject the Remaining Response Documents</p></span></div><table style='padding-top:10px; width:200px; margin:0px auto'><tr><td><input id='btnClientOk1' type='button' class='ms-ButtonHeightWidth' value='Return to CGFS' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK)'/></td><td class='ms-separator'>&#160;</td><td><input id='btnCancel' type='button' class='ms-ButtonHeightWidth' value='Close' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)'/></td></tr></table></div>";
      $("body").append(responseDocDlg);
      var options = SP.UI.$create_DialogOptions();
      options.title = "Return to CGFS";
      options.dialogReturnValueCallback = OnCallbackReturnToCGFS;
      options.html = document.getElementById("responseDocDlg");
      SP.UI.ModalDialog.showModalDialog(options);
    }
    function m_fnFormatEmailBodyToIAFromQA(oRequest, responseTitle) {
      var emailText = "<div>Audit Request Reference: <b>REQUEST_NUMBER</b></div><div>Audit Request Subject: <b>REQUEST_SUBJECT</b></div><div>Audit Request Due Date: <b>REQUEST_DUEDATE</b></div><br/><div>Below is the Response that was updated: </div><div>RESPONSE_TITLE</div>";
      emailText = emailText.replace("REQUEST_NUMBER", oRequest.number);
      emailText = emailText.replace("REQUEST_SUBJECT", oRequest.subject);
      emailText = emailText.replace("REQUEST_DUEDATE", oRequest.internalDueDate);
      emailText = emailText.replace("REQUEST_ACTIONITEMS", oRequest.actionItems);
      var responseTitleBody = "<ul><li>" + responseTitle + "</li></ul>";
      emailText = emailText.replace("RESPONSE_TITLE", responseTitleBody);
      return emailText;
    }
    function m_fnGetResponseByTitle(title) {
      var oResponse = null;
      try {
        oResponse = m_bigMap["response-" + title];
      } catch (err) {
      }
      return oResponse;
    }
    function m_fnCreateEAFolder(requestNumber) {
      var ctx2 = new SP.ClientContext.get_current();
      var bFolderExists = false;
      var listItemEnumerator = eaReponseDocsFolderItems.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var folderItem = listItemEnumerator.get_current();
        var itemName = folderItem.get_displayName();
        if (itemName == requestNumber) {
          bFolderExists = true;
          break;
        }
      }
      if (!bFolderExists) {
        let OnSuccess = function(sender, args) {
        }, OnFailure = function(sender, args) {
        };
        var earesponseDocLib = ctx2.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocsEA());
        var itemCreateInfo = new SP.ListItemCreationInformation();
        itemCreateInfo.set_underlyingObjectType(SP.FileSystemObjectType.folder);
        itemCreateInfo.set_leafName(requestNumber);
        const oNewEAFolder = earesponseDocLib.addItem(itemCreateInfo);
        oNewEAFolder.set_item("Title", requestNumber);
        oNewEAFolder.update();
        ctx2.executeQueryAsync(OnSuccess, OnFailure);
      }
    }
    function m_fnCreateEAEmailLogItem() {
      var ctx2 = new SP.ClientContext.get_current();
      var bExists = false;
      var listItemEnumerator = eaEmailLogListItems.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var emailLogItems = listItemEnumerator.get_current();
        var bExists = true;
        break;
      }
      if (!bExists) {
        let OnSuccess = function(sender, args) {
        }, OnFailure = function(sender, args) {
        };
        var eaEmailLogList = ctx2.get_web().get_lists().getByTitle("AuditEAEmailLog");
        var date = /* @__PURE__ */ new Date();
        var friendlyName = date.format("MM/dd/yyyy");
        var itemCreateInfo = new SP.ListItemCreationInformation();
        const oNewEmailLogItem = eaEmailLogList.addItem(itemCreateInfo);
        oNewEmailLogItem.set_item("Title", friendlyName);
        oNewEmailLogItem.update();
        ctx2.executeQueryAsync(OnSuccess, OnFailure);
      }
    }
    function m_fnGetRequestByResponseTitle(responseTitle) {
      var oRequest = null;
      try {
        var response = m_bigMap["response-" + responseTitle];
        if (response)
          oRequest = response.request;
      } catch (err) {
      }
      return oRequest;
    }
    function m_fnCreateEmailToIAFromQA(emailList, oRequest, responseTitle, emailSubject) {
      if (!oRequest || !emailList)
        return;
      var emailText = m_fnFormatEmailBodyToIAFromQA(oRequest, responseTitle);
      var itemCreateInfo = new SP.ListItemCreationInformation();
      itemCreateInfo.set_folderUrl(
        location.protocol + "//" + location.host + Audit.Common.Utilities.GetSiteUrl() + "/Lists/" + Audit.Common.Utilities.GetListNameEmailHistory() + "/" + oRequest.number
      );
      const oListItem = emailList.addItem(itemCreateInfo);
      oListItem.set_item("Title", emailSubject);
      oListItem.set_item("Body", emailText);
      oListItem.set_item("To", m_IA_ActionOffice.title);
      oListItem.set_item("ReqNum", oRequest.number);
      oListItem.set_item("ResID", responseTitle);
      oListItem.set_item("NotificationType", "IA Notification");
      oListItem.update();
    }
    function OnCallbackForm(result, value) {
      if (result === SP.UI.DialogResult.OK) {
      }
    }
    function OnCallbackCloseResponse(result, value) {
      if (result === SP.UI.DialogResult.OK) {
        let OnSuccess = function(sender, args) {
          var listItemEnumerator = aresponseItems.getEnumerator();
          while (listItemEnumerator.moveNext()) {
            var oListItemResponse = listItemEnumerator.get_current();
            var responseTitle2 = oListItemResponse.get_item("Title");
            var curDate = /* @__PURE__ */ new Date();
            oListItemResponse.set_item("ResStatus", "7-Closed");
            var newClosedTime = new Date(
              curDate.getFullYear(),
              curDate.getMonth(),
              curDate.getDate(),
              curDate.getHours(),
              curDate.getMinutes(),
              curDate.getSeconds(),
              curDate.getMilliseconds()
            );
            oListItemResponse.set_item("ClosedDate", newClosedTime);
            oListItemResponse.set_item("ClosedBy", _spPageContextInfo.userId);
            oListItemResponse.update();
            var oRequest = null;
            try {
              var mapResponse = m_bigMap["response-" + responseTitle2];
              if (mapResponse)
                oRequest = mapResponse.request;
            } catch (err) {
            }
            if (oRequest) {
              m_fnCreateEmailToIAFromQA(
                emailList,
                oRequest,
                responseTitle2,
                "An Audit Response has been Closed by the Quality Assurance Team: " + responseTitle2
              );
            } else
              m_waitDialog.close();
            ctx2.executeQueryAsync(
              function() {
                m_waitDialog.close();
                Audit.Common.Utilities.Refresh();
              },
              function() {
                m_waitDialog.close();
                Audit.Common.Utilities.Refresh();
              }
            );
            break;
          }
        }, OnFailure = function(sender, args) {
          m_waitDialog.close();
          alert(
            "Request failed. " + args.get_message() + "\n" + args.get_stackTrace()
          );
        };
        m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
          "Closing Response",
          "Please wait... Closing Response",
          200,
          400
        );
        var responseTitle = $("#ddlResponsesOpen").val();
        var ctx2 = SP.ClientContext.get_current();
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
        ctx2.load(
          emailListFolderItems,
          "Include(ID, FSObjType, Title, DisplayName)"
        );
        ctx2.executeQueryAsync(OnSuccess, OnFailure);
      } else
        m_bIsTransactionExecuting = false;
    }
    function OnCallbackReturnToCGFS(result, value) {
      if (result === SP.UI.DialogResult.OK) {
        let OnSuccess = function(sender, args) {
          var listItemEnumerator = aresponseItems.getEnumerator();
          while (listItemEnumerator.moveNext()) {
            var oListItemResponse = listItemEnumerator.get_current();
            var responseTitle2 = oListItemResponse.get_item("Title");
            var curDate = /* @__PURE__ */ new Date();
            oListItemResponse.set_item("ResStatus", "5-Returned to GFS");
            oListItemResponse.update();
            var oRequest = null;
            try {
              var mapResponse = m_bigMap["response-" + responseTitle2];
              if (mapResponse)
                oRequest = mapResponse.request;
            } catch (err) {
            }
            if (oRequest) {
              m_fnCreateEmailToIAFromQA(
                emailList,
                oRequest,
                responseTitle2,
                "An Audit Response has been Returned by the Quality Assurance Team: " + responseTitle2
              );
            } else
              m_waitDialog.close();
            ctx2.executeQueryAsync(
              function() {
                m_waitDialog.close();
                Audit.Common.Utilities.Refresh();
              },
              function() {
                m_waitDialog.close();
                Audit.Common.Utilities.Refresh();
              }
            );
            break;
          }
        }, OnFailure = function(sender, args) {
          m_waitDialog.close();
          alert(
            "Request failed. " + args.get_message() + "\n" + args.get_stackTrace()
          );
        };
        m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
          "Returning to CGFS",
          "Please wait... Returning to CGFS",
          200,
          400
        );
        var responseTitle = $("#ddlResponsesOpen").val();
        var ctx2 = SP.ClientContext.get_current();
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
        let emailListFolderItems = emailList.getItems(emailListQuery);
        ctx2.load(
          emailListFolderItems,
          "Include(ID, FSObjType, Title, DisplayName)"
        );
        ctx2.executeQueryAsync(OnSuccess, OnFailure);
      } else
        m_bIsTransactionExecuting = false;
    }
    function OnCallbackApproveResponseDoc(result, value) {
      if (result === SP.UI.DialogResult.OK) {
        let OnSuccess = function(sender, args) {
          var oResponse = m_fnGetResponseByTitle($("#ddlResponsesOpen").val());
          if (oResponse == null || oResponse.request == null) {
            m_waitDialog.close();
            return;
          }
          const oRequest = oResponse.request;
          const folderPath = oRequest.number;
          m_fnCreateEAFolder(folderPath);
          m_fnCreateEAEmailLogItem();
          var requestId = oRequest.number;
          var responseNumber = oResponse.title;
          var fileName = oListItem.get_item("FileLeafRef");
          var ctx2 = new SP.ClientContext.get_current();
          var oList2 = ctx2.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
          oListItem = oList2.getItemById(m_itemID);
          var file = oListItem.get_file();
          var absoluteSiteUrl = location.protocol + "//" + location.host + _spPageContextInfo.webServerRelativeUrl + "/";
          var destinationFileNameUrl = absoluteSiteUrl + Audit.Common.Utilities.GetLibTitleResponseDocsEA() + "/" + folderPath + "/" + fileName;
          file.copyTo(destinationFileNameUrl, 1);
          oListItem.set_item("DocumentStatus", "Approved");
          oListItem.set_item("RejectReason", "");
          oListItem.update();
          var siteUrl = location.protocol + "//" + location.host;
          var urlOfNewFile = destinationFileNameUrl.replace(siteUrl, "");
          const newFile = ctx2.get_web().getFileByServerRelativeUrl(urlOfNewFile);
          ctx2.load(newFile, "ListItemAllFields");
          var data2 = {
            responseTitle: responseNumber,
            copiedFileName: destinationFileNameUrl,
            requestId,
            responseNumber
          };
          function onUpdateResFolderSuccess() {
            if (this.responseTitle == null || this.responseTitle == void 0 || this.responseTitle == "") {
              m_waitDialog.close();
              alert("Error: empty response title ");
              return;
            }
            var ctx3 = SP.ClientContext.get_current();
            var idOfCopiedFile = newFile.get_listItemAllFields().get_id();
            var oEADocLib = ctx3.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocsEA());
            const oListFileItem = oEADocLib.getItemById(idOfCopiedFile);
            oListFileItem.set_item("RequestNumber", this.requestId);
            oListFileItem.set_item("ResponseID", this.responseNumber);
            oListFileItem.update();
            var aresponseList = ctx3.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetListTitleResponses());
            var aresponseQuery = new SP.CamlQuery();
            aresponseQuery.set_viewXml(
              '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' + this.responseTitle + "</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>"
            );
            const aresponseItems = aresponseList.getItems(aresponseQuery);
            ctx3.load(aresponseItems);
            var folderPath2 = Audit.Common.Utilities.GetSiteUrl() + "/" + Audit.Common.Utilities.GetLibNameResponseDocs() + "/" + this.responseTitle;
            var aresponseDocList = ctx3.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
            var aresponseDocQuery = new SP.CamlQuery();
            aresponseDocQuery.set_viewXml(
              '<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><And><Eq><FieldRef Name="FSObjType"/><Value Type="Text">0</Value></Eq><Eq><FieldRef Name="FileDirRef"/><Value Type="Text">' + folderPath2 + "</Value></Eq></And></Where></Query></View>"
            );
            const aresponseDocItems = aresponseDocList.getItems(aresponseDocQuery);
            ctx3.load(aresponseDocItems);
            var emailList = ctx3.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory());
            var emailListQuery = new SP.CamlQuery();
            emailListQuery.set_viewXml(
              '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>'
            );
            let emailListFolderItems = emailList.getItems(emailListQuery);
            ctx3.load(
              emailListFolderItems,
              "Include(ID, FSObjType, Title, DisplayName)"
            );
            function onUpdateSucceededZZ() {
              notifyId2 = SP.UI.Notify.addNotification(
                "Approved Response Document",
                false
              );
              let bUpdateResponseStatus = true;
              var listxItemEnumerator = aresponseDocItems.getEnumerator();
              var bRejected = false;
              while (listxItemEnumerator.moveNext()) {
                var oListItemResponseDoc = listxItemEnumerator.get_current();
                var oListItemResponseDocStatus = oListItemResponseDoc.get_item("DocumentStatus");
                if (oListItemResponseDocStatus == "Open" || oListItemResponseDocStatus == "Submitted" || oListItemResponseDocStatus == "Sent to QA") {
                  bUpdateResponseStatus = false;
                } else if (oListItemResponseDocStatus == "Rejected") {
                  bRejected = true;
                }
              }
              if (bUpdateResponseStatus) {
                var oRequest2 = m_fnGetRequestByResponseTitle(this.responseTitle);
                var listxxItemEnumerator = aresponseItems.getEnumerator();
                while (listxxItemEnumerator.moveNext()) {
                  var oListItemResponse = listxxItemEnumerator.get_current();
                  if (!bRejected) {
                    var curDate = /* @__PURE__ */ new Date();
                    oListItemResponse.set_item("ResStatus", "7-Closed");
                    var newClosedTime = new Date(
                      curDate.getFullYear(),
                      curDate.getMonth(),
                      curDate.getDate(),
                      curDate.getHours(),
                      curDate.getMinutes(),
                      curDate.getSeconds(),
                      curDate.getMilliseconds()
                    );
                    oListItemResponse.set_item("ClosedDate", newClosedTime);
                    oListItemResponse.set_item(
                      "ClosedBy",
                      _spPageContextInfo.userId
                    );
                    m_fnCreateEmailToIAFromQA(
                      emailList,
                      oRequest2,
                      this.responseTitle,
                      "An Audit Response has been Closed by the Quality Assurance Team: " + this.responseTitle
                    );
                  } else {
                    oListItemResponse.set_item("ResStatus", "5-Returned to GFS");
                    m_fnCreateEmailToIAFromQA(
                      emailList,
                      oRequest2,
                      this.responseTitle,
                      "An Audit Response has been Returned by the Quality Assurance Team: " + this.responseTitle
                    );
                  }
                  oListItemResponse.update();
                  ctx3.executeQueryAsync(function() {
                    m_waitDialog.close();
                    Audit.Common.Utilities.Refresh();
                  });
                  break;
                }
              } else {
                m_waitDialog.close();
                Audit.Common.Utilities.Refresh();
              }
            }
            function onUpdateFailedZZ() {
              m_waitDialog.close();
            }
            var data3 = { responseTitle: this.responseTitle };
            ctx3.executeQueryAsync(
              Function.createDelegate(data3, onUpdateSucceededZZ),
              Function.createDelegate(data3, onUpdateFailedZZ)
            );
          }
          function onUpdateResFolderFail(sender2, args2) {
            m_waitDialog.close();
            alert(
              "Request failed. " + args2.get_message() + "\n" + args2.get_stackTrace()
            );
            Audit.Common.Utilities.Refresh();
          }
          ctx2.executeQueryAsync(
            Function.createDelegate(data2, onUpdateResFolderSuccess),
            Function.createDelegate(data2, onUpdateResFolderFail)
          );
        }, OnFailure = function(sender, args) {
          m_waitDialog.close();
          alert(
            "Request failed. " + args.get_message() + "\n" + args.get_stackTrace()
          );
        };
        m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
          "Approving Response Document",
          "Please wait... Approving Response Document",
          200,
          400
        );
        var clientContext2 = SP.ClientContext.get_current();
        var oList = clientContext2.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
        let oListItem = oList.getItemById(m_itemID);
        clientContext2.load(oListItem);
        var eaResponseDocsLib = clientContext2.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocsEA());
        var earesponseDocsQuery = new SP.CamlQuery();
        earesponseDocsQuery.set_viewXml(
          '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>'
        );
        eaReponseDocsFolderItems = eaResponseDocsLib.getItems(earesponseDocsQuery);
        clientContext2.load(
          eaReponseDocsFolderItems,
          "Include(ID, FSObjType, Title, DisplayName)"
        );
        var eaEmailLogList = clientContext2.get_web().get_lists().getByTitle("AuditEAEmailLog");
        var eaEmailLogListQuery = new SP.CamlQuery();
        eaEmailLogListQuery.set_viewXml(
          '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="Created"/><Value IncludeTimeValue="FALSE" Type="DateTime"><Today/></Value></Eq></Where></Query></View>'
        );
        eaEmailLogListItems = eaEmailLogList.getItems(eaEmailLogListQuery);
        clientContext2.load(eaEmailLogListItems, "Include(ID)");
        clientContext2.executeQueryAsync(OnSuccess, OnFailure);
      } else
        m_bIsTransactionExecuting = false;
    }
    function OnCallbackRejectResponseDoc(result, value) {
      if (result === SP.UI.DialogResult.OK) {
        let OnSuccess = function(sender, args) {
          var ctx2 = new SP.ClientContext.get_current();
          var oList2 = ctx2.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
          oListItem = oList2.getItemById(m_itemID);
          oListItem.set_item("DocumentStatus", "Rejected");
          oListItem.set_item("RejectReason", m_RejectReason);
          oListItem.update();
          var siteUrl = location.protocol + "//" + location.host + _spPageContextInfo.webServerRelativeUrl + "/";
          const filePath = oListItem.get_item("FileDirRef");
          const fileName = oListItem.get_item("FileLeafRef");
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
          ctx2.load(
            emailListFolderItems,
            "Include(ID, FSObjType, Title, DisplayName)"
          );
          function onUpdateSucceededZZ() {
            notifyId2 = SP.UI.Notify.addNotification(
              "Rejected Response Document",
              false
            );
            let bUpdateResponseStatus = true;
            var listxItemEnumerator = aresponseDocItems.getEnumerator();
            while (listxItemEnumerator.moveNext()) {
              var oListItemResponseDoc = listxItemEnumerator.get_current();
              var oListItemResponseDocStatus = oListItemResponseDoc.get_item("DocumentStatus");
              if (oListItemResponseDocStatus == "Open" || oListItemResponseDocStatus == "Submitted" || oListItemResponseDocStatus == "Sent to QA") {
                bUpdateResponseStatus = false;
              }
            }
            if (bUpdateResponseStatus) {
              var oRequest = m_fnGetRequestByResponseTitle(this.responseTitle);
              var listxxItemEnumerator = aresponseItems.getEnumerator();
              while (listxxItemEnumerator.moveNext()) {
                var oListItemResponse = listxxItemEnumerator.get_current();
                var curDate = /* @__PURE__ */ new Date();
                oListItemResponse.set_item("ResStatus", "5-Returned to GFS");
                oListItemResponse.update();
                m_fnCreateEmailToIAFromQA(
                  emailList,
                  oRequest,
                  this.responseTitle,
                  "An Audit Response has been Returned by the Quality Assurance Team: " + this.responseTitle
                );
                ctx2.executeQueryAsync(function() {
                  m_waitDialog.close();
                  Audit.Common.Utilities.Refresh();
                });
                break;
              }
            } else {
              m_waitDialog.close();
              Audit.Common.Utilities.Refresh();
            }
          }
          function onUpdateFailedZZ() {
            m_waitDialog.close();
          }
          var data2 = { responseTitle };
          ctx2.executeQueryAsync(
            Function.createDelegate(data2, onUpdateSucceededZZ),
            Function.createDelegate(data2, onUpdateFailedZZ)
          );
        }, OnFailure = function(sender, args) {
          m_waitDialog.close();
          alert(
            "Request failed. " + args.get_message() + "\n" + args.get_stackTrace()
          );
        };
        m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
          "Rejecting Response Document",
          "Please wait... Rejecting Response Document",
          200,
          400
        );
        var clientContext2 = SP.ClientContext.get_current();
        var oList = clientContext2.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
        let oListItem = oList.getItemById(m_itemID);
        clientContext2.load(oListItem);
        clientContext2.executeQueryAsync(OnSuccess, OnFailure);
      } else
        m_bIsTransactionExecuting = false;
    }
    function OnCallbackApproveAllResponseDoc(result, value) {
      if (result === SP.UI.DialogResult.OK) {
        let OnSuccess = function(sender, args) {
          var oRequest = null;
          var oResponse = null;
          oResponse = m_fnGetResponseByTitle($("#ddlResponsesOpen").val());
          if (oResponse == null || oResponse.request == null)
            return;
          oRequest = oResponse.request;
          const folderPath = oRequest.number;
          m_fnCreateEAFolder(oRequest.number);
          m_fnCreateEAEmailLogItem();
          var requestId = oRequest.number;
          var responseNumber = oResponse.title;
          m_cntToApprove = 0;
          m_cntApproved = 0;
          for (var x = 0; x < oResponse.responseDocs.length; x++) {
            let onUpdateResFolderSuccess = function() {
              if (this.responseTitle == null || this.responseTitle == void 0 || this.responseTitle == "") {
                document.body.style.cursor = "default";
                notifyId2 = SP.UI.Notify.addNotification(
                  "Error: empty response title ",
                  false
                );
                m_waitDialog.close();
                return;
              }
              var ctx3 = SP.ClientContext.get_current();
              var idOfCopiedFile = this.newFile.get_listItemAllFields().get_id();
              var oEADocLib = ctx3.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocsEA());
              const oListFileItem = oEADocLib.getItemById(idOfCopiedFile);
              oListFileItem.set_item("RequestNumber", this.requestId);
              oListFileItem.set_item("ResponseID", this.responseNumber);
              oListFileItem.update();
              var aresponseList = ctx3.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetListTitleResponses());
              var aresponseQuery = new SP.CamlQuery();
              aresponseQuery.set_viewXml(
                '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' + this.responseTitle + "</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>"
              );
              const aresponseItems = aresponseList.getItems(aresponseQuery);
              ctx3.load(aresponseItems);
              var folderPath2 = Audit.Common.Utilities.GetSiteUrl() + "/" + Audit.Common.Utilities.GetLibNameResponseDocs() + "/" + this.responseTitle;
              var aresponseDocList = ctx3.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
              var aresponseDocQuery = new SP.CamlQuery();
              aresponseDocQuery.set_viewXml(
                '<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><And><Eq><FieldRef Name="FSObjType"/><Value Type="Text">0</Value></Eq><Eq><FieldRef Name="FileDirRef"/><Value Type="Text">' + folderPath2 + "</Value></Eq></And></Where></Query></View>"
              );
              const aresponseDocItems = aresponseDocList.getItems(aresponseDocQuery);
              ctx3.load(aresponseDocItems);
              var emailList = ctx3.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory());
              var emailListQuery = new SP.CamlQuery();
              emailListQuery.set_viewXml(
                '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>'
              );
              const emailListFolderItems = emailList.getItems(emailListQuery);
              ctx3.load(
                emailListFolderItems,
                "Include(ID, FSObjType, Title, DisplayName)"
              );
              function onUpdateSucceededZZ() {
                m_cntApproved++;
                if (m_cntApproved != m_cntToApprove) {
                  return;
                }
                notifyId2 = SP.UI.Notify.addNotification(
                  "Approved Response Documents",
                  false
                );
                let bUpdateResponseStatus = true;
                var listxItemEnumerator = this.aresponseDocItems.getEnumerator();
                var bRejected = false;
                while (listxItemEnumerator.moveNext()) {
                  var oListItemResponseDoc = listxItemEnumerator.get_current();
                  var oListItemResponseDocStatus = oListItemResponseDoc.get_item("DocumentStatus");
                  if (oListItemResponseDocStatus == "Open" || oListItemResponseDocStatus == "Submitted" || oListItemResponseDocStatus == "Sent to QA") {
                    bUpdateResponseStatus = false;
                  } else if (oListItemResponseDocStatus == "Rejected") {
                    bRejected = true;
                  }
                }
                if (bUpdateResponseStatus) {
                  var oRequest2 = m_fnGetRequestByResponseTitle(
                    this.responseTitle
                  );
                  var listxxItemEnumerator = this.aresponseItems.getEnumerator();
                  while (listxxItemEnumerator.moveNext()) {
                    var oListItemResponse = listxxItemEnumerator.get_current();
                    if (!bRejected) {
                      var curDate = /* @__PURE__ */ new Date();
                      oListItemResponse.set_item("ResStatus", "7-Closed");
                      var newClosedTime = new Date(
                        curDate.getFullYear(),
                        curDate.getMonth(),
                        curDate.getDate(),
                        curDate.getHours(),
                        curDate.getMinutes(),
                        curDate.getSeconds(),
                        curDate.getMilliseconds()
                      );
                      oListItemResponse.set_item("ClosedDate", newClosedTime);
                      oListItemResponse.set_item(
                        "ClosedBy",
                        _spPageContextInfo.userId
                      );
                      m_fnCreateEmailToIAFromQA(
                        this.emailList,
                        oRequest2,
                        this.responseTitle,
                        "An Audit Response has been Closed by the Quality Assurance Team: " + this.responseTitle
                      );
                    } else {
                      oListItemResponse.set_item(
                        "ResStatus",
                        "5-Returned to GFS"
                      );
                      m_fnCreateEmailToIAFromQA(
                        this.emailList,
                        oRequest2,
                        this.responseTitle,
                        "An Audit Response has been Returned by the Quality Assurance Team: " + this.responseTitle
                      );
                    }
                    oListItemResponse.update();
                    ctx3.executeQueryAsync(function() {
                      m_waitDialog.close();
                      Audit.Common.Utilities.Refresh();
                    });
                    break;
                  }
                } else {
                  m_waitDialog.close();
                  Audit.Common.Utilities.Refresh();
                }
              }
              function onUpdateFailedZZ() {
                m_waitDialog.close();
              }
              var data3 = {
                responseTitle: this.responseTitle,
                emailList,
                aresponseItems,
                aresponseDocItems,
                emailListFolderItems
              };
              ctx3.executeQueryAsync(
                Function.createDelegate(data3, onUpdateSucceededZZ),
                Function.createDelegate(data3, onUpdateFailedZZ)
              );
            }, onUpdateResFolderFail = function(sender2, args2) {
              m_waitDialog.close();
              notifyId2 = SP.UI.Notify.addNotification(
                "Request failed. " + args2.get_message() + "\n" + args2.get_stackTrace(),
                false
              );
              alert(
                "Request failed. " + args2.get_message() + "\n" + args2.get_stackTrace()
              );
              Audit.Common.Utilities.Refresh();
            };
            if (oResponse.responseDocs[x].documentStatus != "Sent to QA")
              continue;
            m_cntToApprove++;
            var ctx2 = new SP.ClientContext.get_current();
            var oList = ctx2.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
            let oListItem = oResponse.responseDocs[x].item;
            const fileName = oListItem.get_item("FileLeafRef");
            oListItem = oList.getItemById(oListItem.get_item("ID"));
            var file = oListItem.get_file();
            var absoluteSiteUrl = location.protocol + "//" + location.host + _spPageContextInfo.webServerRelativeUrl + "/";
            var destinationFileNameUrl = absoluteSiteUrl + Audit.Common.Utilities.GetLibTitleResponseDocsEA() + "/" + folderPath + "/" + fileName;
            file.copyTo(destinationFileNameUrl, 1);
            oListItem.set_item("DocumentStatus", "Approved");
            oListItem.set_item("RejectReason", "");
            oListItem.update();
            var siteUrl = location.protocol + "//" + location.host;
            var urlOfNewFile = destinationFileNameUrl.replace(siteUrl, "");
            const newFile = ctx2.get_web().getFileByServerRelativeUrl(urlOfNewFile);
            ctx2.load(newFile, "ListItemAllFields");
            var data2 = {
              responseTitle: responseNumber,
              copiedFileName: destinationFileNameUrl,
              requestId,
              responseNumber,
              newFile
            };
            ctx2.executeQueryAsync(
              Function.createDelegate(data2, onUpdateResFolderSuccess),
              Function.createDelegate(data2, onUpdateResFolderFail)
            );
          }
        }, OnFailure = function(sender, args) {
          m_waitDialog.close();
          alert(
            "Request failed. " + args.get_message() + "\n" + args.get_stackTrace()
          );
        };
        m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
          "Approving Response Documents",
          "Please wait... Approving Response Documents",
          200,
          400
        );
        var responseTitle = $("#ddlResponsesOpen").val();
        var clientContext2 = SP.ClientContext.get_current();
        var eaResponseDocsLib = clientContext2.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocsEA());
        var earesponseDocsQuery = new SP.CamlQuery();
        earesponseDocsQuery.set_viewXml(
          '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>'
        );
        eaReponseDocsFolderItems = eaResponseDocsLib.getItems(earesponseDocsQuery);
        clientContext2.load(
          eaReponseDocsFolderItems,
          "Include(ID, FSObjType, Title, DisplayName)"
        );
        var eaEmailLogList = clientContext2.get_web().get_lists().getByTitle("AuditEAEmailLog");
        var eaEmailLogListQuery = new SP.CamlQuery();
        eaEmailLogListQuery.set_viewXml(
          '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="Created"/><Value IncludeTimeValue="FALSE" Type="DateTime"><Today/></Value></Eq></Where></Query></View>'
        );
        eaEmailLogListItems = eaEmailLogList.getItems(eaEmailLogListQuery);
        clientContext2.load(eaEmailLogListItems, "Include(ID)");
        clientContext2.executeQueryAsync(OnSuccess, OnFailure);
      } else
        m_bIsTransactionExecuting = false;
    }
    function BindHandlersOnLoad() {
      BindPrintButton(
        "#btnPrint1",
        "#divStatusReportRespones",
        "QA Response Status Report"
      );
      BindExportButton(
        ".export1",
        "QAResponseStatusReport_",
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
    function GoToResponse(response) {
      _myViewModel.tabs.selectTab(_myViewModel.tabOpts.ResponseDetail);
      if (response) {
        response = m_bigMap["response-" + response];
        var requestStatus = response.request.status;
        var responseStatus = response.resStatus;
        if ((responseStatus == "4-Approved for QA" || responseStatus == "6-Reposted After Rejection") && (requestStatus == "Open" || requestStatus == "ReOpened"))
          _myViewModel.filterResponseInfoTabResponseNameOpen2(response.title);
        else
          _myViewModel.filterResponseInfoTabResponseNameProcessed2(
            response.title
          );
      }
    }
    var publicMembers = {
      Load: m_fnLoadData,
      IsTransactionExecuting: function() {
        return m_bIsTransactionExecuting;
      },
      GoToResponse,
      GetCancelReason: function() {
        m_RejectReason = $("#txtRejectReason").val();
        if ($.trim(m_RejectReason) == "")
          $("#btnClientOk1").attr("disabled", "disabled");
        else
          $("#btnClientOk1").removeAttr("disabled");
        return m_RejectReason;
      }
    };
    return publicMembers;
  };
})();
//# sourceMappingURL=qa_db.js.map
