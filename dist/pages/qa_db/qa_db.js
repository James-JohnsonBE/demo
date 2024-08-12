(()=>{var kt=Object.freeze,Vt=Object.defineProperty;var Ft=(d,r)=>kt(Vt(d,"raw",{value:kt(r||d.slice())}));var Bt=String.raw,Pt,Et=Bt(Pt||(Pt=Ft([`
  <link
    rel="stylesheet"
    type="text/css"
    href="/sites/CGFS/Style Library/apps/audit/lib/jquery-ui-1.13.2/jquery-ui.theme.min.css"
  />
  <link
    rel="stylesheet"
    type="text/css"
    href="/sites/CGFS/Style Library/apps/audit/lib/tablesorter-2.31.3/css/theme.default.min.css"
  />

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
`])));var Nt={};window.history.replaceState({},"",document.location.href);function je(d,r){if(Lt(d)==r)return;let f=window.location.search,m=new RegExp("([?;&])"+d+"[^&;]*[;&]?"),y=f.replace(m,"$1").replace(/&$/,""),C=(y.length>2?y+"&":"?")+(r?d+"="+r:"");Nt[d]=r,window.history.pushState(Nt,"",C.toString())}function Lt(d){let r=new RegExp("[?&]"+d+"=([^&#]*)").exec(window.location.href);return r==null?null:decodeURI(r[1])||0}var He=class{constructor(r,f="Tab"){this.urlParam=f,ko.utils.arrayPushAll(this.tabOpts,r),this.selectedTab.subscribe(this.tabChangeHandler),window.addEventListener("popstate",this.popStateHandler)}tabOpts=ko.observableArray();selectedTab=ko.observable();isSelected=r=>r.id==this.selectedTab()?.id;clickTabLink=r=>{this.selectedTab(r),console.log("selected: "+r.id)};selectTab=r=>this.selectById(r.id);selectById=r=>{let f=this.tabOpts().find(m=>m.id==r)??this.getDefaultTab();this.selectedTab(f)};getDefaultTab=()=>this.tabOpts()[0];tabChangeHandler=r=>{r&&je(this.urlParam,r.id)};popStateHandler=r=>{r.state&&r.state[this.urlParam]&&this.selectById(r.state[this.urlParam])}},Pe=class{constructor(r,f,m){this.id=r,this.linkText=f,this.template=m}};var Ee=class d{constructor({ID:r,Title:f,LoginName:m=null,IsGroup:y=null,IsEnsured:C=!1}){this.ID=r,this.Title=f,this.LookupValue=f,this.LoginName=m!=""?m:null,this.IsGroup=y,this.IsEnsured=C}ID=null;Title=null;LoginName=null;LookupValue=null;getKey=()=>this.LoginName??this.Title;static Create=function(r){return!r||!r.ID&&!(r.Title||r.LookupValue)?null:new d({...r,Title:r.Title??r.LookupValue})}};var V=String.raw;function K(d){ko.components.register(d.edit,{template:d.editTemplate,viewModel:d}),ko.components.register(d.view,{template:d.viewTemplate,viewModel:d})}var H=class{constructor(r){Object.assign(this,r)}_id;getUniqueId=()=>(this._id||(this._id="field-"+Math.floor(Math.random()*1e4)),this._id);Errors=ko.pureComputed(()=>this.ShowErrors()?this.isRequired?this.Value()?[]:[new ValidationError("text-field","required-field",this.displayName+" is required!")]:[]:[]);ShowErrors=ko.observable(!1);ValidationClass=ko.pureComputed(()=>{if(this.ShowErrors())return this.Errors().length?"is-invalid":"is-valid"});static viewTemplate=V`
    <div class="fw-semibold" data-bind="text: displayName"></div>
    <div data-bind="text: toString()"></div>
  `;static editTemplate=V`<div>Uh oh!</div>`};var qt=V`
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
`,$t=V`
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
`,We=class extends H{constructor(r){super(r)}static viewTemplate=$t;static editTemplate=qt;static view="blob-view";static edit="blob-edit";static new="blob-edit"};K(We);var Mt=V`
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
`,Qt=V`
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
`,Je=class extends H{constructor(r){super(r)}static viewTemplate=Qt;static editTemplate=Mt;static view="checkbox-view";static edit="checkbox-edit";static new="checkbox-edit"};K(Je);var jt=V`
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
`,Xe=class extends H{constructor(r){super(r)}static editTemplate=jt;static view="date-view";static edit="date-edit";static new="date-edit"};K(Xe);var Ht=V`
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
`,Ke=class extends H{constructor(r){super(r),this.onSearchInput=r.onSearchInput,this.multiple=r.multiple??!1}static editTemplate=Ht;static view="lookup-view";static edit="lookup-edit";static new="lookup-edit"};K(Ke);var Wt=V`
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
`,Jt=V`
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
`,Ze=class extends H{constructor(r){super(r)}ValueFunc=ko.pureComputed({read:()=>this.Value()?ko.unwrap(this.userOpts).find(f=>f.ID==this.Value().ID):void 0,write:r=>{ko.unwrap(this.userOpts)&&this.Value(r)}});ShowUserSelect=ko.pureComputed(()=>this.spGroupName?ko.unwrap(this.userOpts).length:!1);static viewTemplate=Jt;static editTemplate=Wt;static view="people-view";static edit="people-edit";static new="people-edit"};K(Ze);var Xt=V`
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
`,Ne=class extends H{constructor(r){super(r),this.Options=r.Options,this.Value=r.Value,this.optionsText=r.optionsText??(f=>f),this.multiple=r.multiple,this.OptionsCaption=r.OptionsCaption??"Select...",this.onSearchInput=r.onSearchInput}GetSelectedOptions=ko.pureComputed(()=>this.multiple?this.Value():this.Value()?[this.Value()]:[]);InputGroupFocused=ko.observable();setFocus=()=>this.InputGroupFocused(!0);FilterText=ko.observable();FilteredOptions=ko.pureComputed(()=>this.Options().filter(r=>this.GetSelectedOptions().indexOf(r)>=0?!1:this.FilterText()?this.optionsText(r).toLowerCase().includes(this.FilterText().toLowerCase()):!0));addSelection=(r,f)=>{console.log("selected",r),f.target.nextElementSibling&&f.target.nextElementSibling.focus(),this.multiple?this.Value.push(r):this.Value(r)};removeSelection=r=>this.multiple?this.Value.remove(r):this.Value(null);setInputGroupFocus=()=>{this.InputGroupFocused(!0),clearTimeout(this.focusOutTimeout)};removeInputGroupFocus=(r,f)=>{this.focusOutTimeout=window.setTimeout(()=>{this.InputGroupFocused(!1)},0)};static editTemplate=Xt;static view="search-select-view";static edit="search-select-edit";static new="search-select-new"};K(Ne);var Kt=V`
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
`,ze=class extends H{constructor(r){super(r)}static editTemplate=Kt;static view="select-view";static edit="select-edit";static new="select-edit"};K(ze);var Zt=V`
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
`,zt=V`
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
`,Ye=class extends H{constructor(r){super(r)}childrenHaveLoaded=r=>{this.initializeEditor()};getToolbarId=()=>"toolbar-"+this.getUniqueId();initializeEditor(){let r=[["bold","italic","underline","strike"],["link"],["blockquote","code-block"],[{header:1},{header:2}],[{list:"ordered"},{list:"bullet"}],[{script:"sub"},{script:"super"}],[{indent:"-1"},{indent:"+1"}],[{direction:"rtl"}],[{size:["small",!1,"large","huge"]}],[{header:[1,2,3,4,5,6,!1]}],[{color:[]},{background:[]}],[{font:[]}],[{align:[]}],["clean"]];var f=new Quill("#"+this.getUniqueId(),{modules:{toolbar:r},theme:"snow"});let m=this.Value;m.subscribe(y=>{y==""&&f.setText("")}),f.on("text-change",function(y,C,_){m(f.root.textContent?f.root.innerHTML:"")})}static viewTemplate=zt;static editTemplate=Zt;static view="text-area-view";static edit="text-area-edit";static new="text-area-edit"};K(Ye);var Yt=V`
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
`,et=class extends H{constructor(r){super(r)}static editTemplate=Yt;static view="text-view";static edit="text-edit";static new="text-edit"};K(et);var ui=String.raw;window.console=window.console||{log:function(){}};window.sal=window.sal??{};var fe=window.sal,Ut=_spPageContextInfo.webServerRelativeUrl=="/"?"":_spPageContextInfo.webServerRelativeUrl;fe.globalConfig=fe.globalConfig||{siteGroups:[],siteUrl:Ut,listServices:Ut+"/_vti_bin/ListData.svc/",defaultGroups:{}};fe.site=fe.site||{};window.DEBUG=!0;function Dt(d,r=null){return{ID:d.get_id(),Title:d.get_title(),LoginName:d.get_loginName(),IsEnsured:!0,IsGroup:r??d.constructor.getName()=="SP.Group",oPrincipal:d}}var ci=_spPageContextInfo.webAbsoluteUrl=="/"?"":_spPageContextInfo.webAbsoluteUrl;fe.NewAppConfig=function(){var d={};d.roles={FullControl:"Full Control",Design:"Design",Edit:"Edit",Contribute:"Contribute",RestrictedContribute:"Restricted Contribute",InitialCreate:"Initial Create",Read:"Read",RestrictedRead:"Restricted Read",LimitedAccess:"Limited Access"},d.fulfillsRole=function(m,y){let C=Object.values(d.roles);return!C.includes(m)||!C.includes(y)?!1:C.indexOf(m)<=C.indexOf(y)},d.validate=function(){Object.keys(d.roles).forEach(function(m){var y=d.roles[m];fe.globalConfig.roles.includes(y)?console.log(y):console.error(y+" is not in the global roles list")})};var r={groups:{Owners:"workorder Owners",Members:"workorder Members",Visitors:"workorder Visitors",RestrictedReaders:"Restricted Readers"}},f={siteRoles:d,siteGroups:r};return f};fe.NewUtilities=function(){function d(_,A,T){T=T===void 0?null:T;var E=new SP.ClientContext.get_current,O=E.get_web(),G=new SP.GroupCreationInformation;G.set_title(_),this.oGroup=oWebsite.get_siteGroups().add(G),oGroup.set_owner(oWebsite.get_associatedOwnerGroup()),oGroup.update();var x=SP.RoleDefinitionBindingCollection.newObject(clientContext);this.oRoleDefinitions=[],A.forEach(function(Z){var X=oWebsite.get_roleDefinitions().getByName(Z);this.oRoleDefinitions.push(X),x.add(X)});var Y=oWebsite.get_roleAssignments();Y.add(oGroup,x);function Q(){var Z=oGroup.get_title()+" created and assigned to "+oRoleDefinitions.forEach(function(X){X+""});T&&T(oGroup.get_id()),console.log(Z)}function J(Z,X){alert(groupnName+" - Create group failed. "+X.get_message()+`
`+X.get_stackTrace())}clientContext.load(oGroup,"Title");var ee={groupName:_,oGroup,oRoleDefinition,callback:T};clientContext.executeQueryAsync(Function.createDelegate(ee,Q),Function.createDelegate(ee,J))}function r(_,A){var T=new SP.ClientContext.get_current,E=T.get_web(),O=E.ensureUser(_),G=O.get_groups();function x(){for(var Q=new Array,J=new String,ee=G.getEnumerator();ee.moveNext();){var Z=ee.get_current(),X=Dt(Z);J+=`
Group ID: `+Z.get_id()+", Title : "+Z.get_title(),Q.push(X)}console.log(J.toString()),A(Q)}function Y(Q,J){console.error(" Everyone - Query Everyone group failed. "+J.get_message()+`
`+J.get_stackTrace())}T.load(O),T.load(G),data={everyone:O,oGroups:G,callback:A},T.executeQueryAsync(Function.createDelegate(data,x),Function.createDelegate(data,Y))}function f(_,A){var T=new SP.ClientContext.get_current,E=_.get_users();function O(){for(var Y=[],Q=E.getEnumerator();Q.moveNext();){var J=Q.get_current(),ee=Dt(J);Y.push(ee)}A(Y)}function G(Y,Q){}var x={oUsers:E,callback:A};T.load(E),T.executeQueryAsync(Function.createDelegate(x,O),Function.createDelegate(x,G))}function m(_,A,T,E){var O=new SP.ClientContext.get_current,G=O.get_web(),x=G.getFolderByServerRelativeUrl(_);O.load(x,"Files"),O.executeQueryAsync(function(){console.log("Got the source folder right here!");for(var Y=x.get_files(),Q=Y.getEnumerator(),J=[];Q.moveNext();){var ee=Q.get_current(),Z=A+"/"+ee.get_name();J.push(Z),ee.copyTo(Z,!0)}console.log(J),O.executeQueryAsync(function(){console.log("Files moved successfully!"),T()},function(X,le){console.log("error: ")+le.get_message()})},function(Y,Q){console.log("Sorry, something messed up: "+Q.get_message())})}function y(_,A){return new Promise((T,E)=>{m(_,A,T,E)})}var C={copyFiles:m,copyFilesAsync:y,createSiteGroup:d,getUserGroups:r,getUsersWithGroup:f};return C};async function It(d){return new Promise((r,f)=>{var m=fe.globalConfig.siteGroups.find(function(E){return E.LoginName==d});if(m){r(m);return}var y=new SP.ClientContext.get_current,C=y.get_web().ensureUser(d);function _(E,O){let G=Dt(C);r(G)}function A(E,O){console.error("Failed to ensure user :"+O.get_message()+`
`+O.get_stackTrace()),f(O)}let T={oUser:C,resolve:r,reject:f};y.load(C),y.executeQueryAsync(Function.createDelegate(T,_),Function.createDelegate(T,A))})}async function es(d,r="GET",f={},m={}){let y=d.startsWith("http")?d:fe.globalConfig.siteUrl+"/_api"+d,C=await fetch(y,{method:r,headers:{Accept:"application/json; odata=verbose","X-RequestDigest":document.getElementById("__REQUESTDIGEST").value,...f},...m});if(!C.ok){if(C.status==404)return;console.error(C)}try{return await C.json()}catch{return}}window.fetchSharePointData=es;var At=class{constructor(r){this.maxConcurrency=r,this.runningJobs=0,this.queue=[]}addJob(r){return new Promise((f,m)=>{let y=async()=>{try{let C=await r();f(C)}catch(C){m(C)}finally{this.runningJobs--,this.processQueue()}};this.queue.push(y),this.processQueue()})}processQueue(){for(;this.runningJobs<this.maxConcurrency&&this.queue.length>0;){let r=this.queue.shift();this.runningJobs++,r()}}},pi=new At(5);var tt="/sites/CGFS/Style Library/apps/audit/src";ko.subscribable.fn.subscribeChanged=function(d){var r;this.subscribe(function(f){r=f},this,"beforeChange"),this.subscribe(function(f){d(f,r)})};ko.observableArray.fn.subscribeAdded=function(d){this.subscribe(function(r){let f=r.filter(m=>m.status=="added").map(m=>m.value);d(f)},this,"arrayChange")};ko.bindingHandlers.searchSelect={init:function(d,r,f){let{options:m,selectedOptions:y,optionsText:C,onSearchInput:_}=r();function A(){let E=ko.unwrap(m).map(O=>{let G=document.createElement("option");return ko.selectExtensions.writeValue(G,ko.unwrap(O)),G.innerText=C(O),ko.unwrap(y)?.find(x=>x.ID==O.ID)&&G.setAttribute("selected",""),G});d.append(...E)}A(),ko.isObservable(m)&&m.subscribe(()=>A(),this),ko.utils.registerEventHandler(d,"change",T=>{y(d.selectedOptions.map(E=>ko.selectExtensions.readValue(E)))}),_&&ko.utils.registerEventHandler(d,"input",T=>{_(T.originalEvent.target.searchInputElement.value)})},update:function(d,r,f,m,y){let{selectedOptions:C}=r(),_=ko.unwrap(C);for(var A=0;A<d.options.length;A++){let T=d.options[A];T.toggleAttribute("selected",_.includes(ko.selectExtensions.readValue(T)))}}};ko.bindingHandlers.people={init:function(d,r,f){var m={};m.PrincipalAccountType="User",m.SearchPrincipalSource=15,m.ShowUserPresence=!0,m.ResolvePrincipalSource=15,m.AllowEmailAddresses=!0,m.AllowMultipleValues=!1,m.MaximumEntitySuggestions=50,m.OnUserResolvedClientScript=async function(y,C){var _=SPClientPeoplePicker.SPClientPeoplePickerDict[y],A=r(),T=_.GetControlValueAsJSObject()[0];if(!T){A(null);return}if(T.IsResolved){if(T.Key==A()?.LoginName)return;var E=await It(T.Key),O=new Ee(E);A(O)}},SPClientPeoplePicker_InitStandaloneControlWrapper(d.id,null,m)},update:function(d,r,f,m,y){var C=SPClientPeoplePicker.SPClientPeoplePickerDict[d.id+"_TopSpan"],_=ko.utils.unwrapObservable(r());if(!_){C?.DeleteProcessedUser();return}_&&!C.GetAllUserInfo().find(A=>A.DisplayText==_.LookupValue)&&C.AddUserKeys(_.LoginName??_.LookupValue??_.Title)}};ko.bindingHandlers.dateField={init:function(d,r,f){},update:function(d,r,f,m,y){}};ko.bindingHandlers.downloadLink={update:function(d,r,f,m,y){var C=r(),_=C.replace(/:([A-Za-z_]+)/g,function(A,T){return ko.unwrap(m[T])});d.href=_}};ko.bindingHandlers.files={init:function(d,r){function f(y){var C=r();if(!y.length){C.removeAll();return}let _=ko.unwrap(C),A=[];for(let T of y)_.find(E=>E.name==T.name)||A.push(T);ko.utils.arrayPushAll(C,A)}ko.utils.registerEventHandler(d,"change",function(){f(d.files)});let m=d.closest("label");m&&(ko.utils.registerEventHandler(m,"dragover",function(y){y.preventDefault(),y.stopPropagation()}),ko.utils.registerEventHandler(m,"dragenter",function(y){y.preventDefault(),y.stopPropagation(),m.classList.add("dragging")}),ko.utils.registerEventHandler(m,"dragleave",function(y){y.preventDefault(),y.stopPropagation(),m.classList.remove("dragging")}),ko.utils.registerEventHandler(m,"drop",function(y){y.preventDefault(),y.stopPropagation();let _=y.originalEvent.dataTransfer.files;f(_)}))},update:function(d,r,f,m,y){if(!r()().length&&d.files.length){d.value=null;return}}};ko.bindingHandlers.toggleClick={init:function(d,r,f){var m=r();ko.utils.registerEventHandler(d,"click",function(){var y=f.get("toggleClass"),C=f.get("classContainer"),_=f.get("containerType");if(_&&_=="sibling")$(d).nextUntil(C).each(function(){$(this).toggleClass(y)});else if(_&&_=="doc"){var A=$(d).attr("src");A=="/_layouts/images/minus.gif"?$(d).attr("src","/_layouts/images/plus.gif"):$(d).attr("src","/_layouts/images/minus.gif"),$(d).parent()&&$(d).parent().parent()&&$(d).parent().parent().nextUntil(C).each(function(){$(this).toggleClass(y)})}else _&&_=="any"?$("."+y).is(":visible")?$("."+y).hide():$("."+y).show():$(d).find(C).toggleClass(y)})}};ko.bindingHandlers.toggles={init:function(d,r){var f=r();ko.utils.registerEventHandler(d,"click",function(){f(!f())})}};var ss={loadTemplate:function(d,r,f){r.fromPath?fetch(tt+r.fromPath).then(m=>{if(!m.ok)throw new Error(`Error Fetching HTML Template - ${m.statusText}`);return m.text()}).catch(m=>{r.fallback&&(console.warn("Primary template not found, attempting fallback",r),fetch(tt+r.fallback).then(y=>{if(!y.ok)throw new Error(`Error Fetching fallback HTML Template - ${y.statusText}`);return y.text()}).then(y=>ko.components.defaultLoader.loadTemplate(d,y,f)))}).then(m=>m?ko.components.defaultLoader.loadTemplate(d,m,f):null):f(null)}};ko.components.loaders.unshift(ss);var is={loadViewModel:function(d,r,f){if(r.viaLoader){let m=import(tt+r.viaLoader).then(y=>{let C=y.default;ko.components.defaultLoader.loadViewModel(d,C,f)})}else f(null)}};ko.components.loaders.unshift(is);window.Audit=window.Audit||{};Audit.Common=Audit.Common||{};function ns(){Audit.Common.Utilities=new Audit.Common.NewUtilities,Audit.Common.Init()}Audit.Common.Init=function(){};Audit.Common.NewUtilities=function(){var d=_spPageContextInfo.webServerRelativeUrl,r="AuditRequests",f="AuditRequests",m="AuditRequestsInternal",y="AuditRequestsInternal",C="AuditResponses",_="AuditResponses",A="AuditRequestDocs",T="AuditRequestDocs",E="AuditCoverSheets",O="AuditCoverSheets",G="AuditResponseDocs",x="AuditResponseDocs",Y="AuditResponseDocsEA",Q="AuditResponseDocsEA",J="AuditOrganizations",ee="AuditOrganizations",Z="AuditEmails",X="AuditEmails",le="AuditBulkResponses",st="AuditBulkResponses",it="AuditBulkPermissions",k="AuditBulkPermissions",nt="CGFS Special Access1",Ue="CGFS Special Access2",ot="Quality Assurance",rt="External Auditors",Oe=null,me=null,ge=null;function at(e=!1){if(e){location.href=location.pathname;return}var s=location.pathname;if($("#tabs").html()!=null&&$("#tabs").html()!=""){var o=0;try{o=$("#tabs").tabs("option","active")}catch{}if(s+="?Tab="+o,o==0&&$("#ddlResponseName").val()!="")s+="&ResNum="+$("#ddlResponseName").val();else if(o==1){var c=$("#ddlResponsesOpen").val(),u=$("#ddlResponsesProcessed").val();c!=null&&c!=""?s+="&ResNum="+c:u!=null&&u!=""&&(s+="&ResNum="+u)}location.href=s}else location.reload()}function lt(){var e=new Date;$("#divLoading").text("Loaded at "+e.format("MM/dd/yyyy hh:mm tt"))}function ut(){var e=GetUrlKeyValue("Tab");e!=null&&e!=""&&$("#tabs").tabs("option","active",e);var s=!1,o=GetUrlKeyValue("ResNum");o!=null&&o!=""&&(e==0?$("#ddlResponseName option[value='"+o+"']").length>0&&($("#ddlResponseName").val(o).change(),s=!0):$("#ddlResponsesOpen option[value='"+o+"']").length>0?$("#ddlResponsesOpen").val(o).change():$("#ddlResponsesProcessed option[value='"+o+"']").length>0&&$("#ddlResponsesProcessed").val(o).change()),s||$(".sr-response-item").show()}function xe(e,s){var o=0,c=0,u=0,v=0,h=0,I=$(".sr-response-item");I.each(function(){var N=$.trim($(this).find(".sr-response-requestStatus").text()),U=$.trim($(this).find(".sr-response-status").text());(U==e||U==s)&&(N=="Open"||N=="ReOpened")&&($(this).addClass("highlighted"),o++,U==e?v++:U==s&&h++,N=="Open"?c++:N=="ReOpened"&&u++)}),o>0?($("#lblStatusReportResponsesMsg").html("<span class='ui-icon ui-icon-alert'></span>There are "+o+" Responses pending your review"),v>0&&h==0?$("#ddlResponseStatus").val(e).change():h>0&&v==0&&$("#ddlResponseStatus").val(s).change()):$("#lblStatusReportResponsesMsg").html("<span class='ui-icon ui-icon-circle-check'></span>There are 0 Responses pending your review")}function De(e){me=new Array;for(var s=e.getEnumerator();s.moveNext();){var o=s.get_current(),c=o.get_id(),u=o.get_loginName(),v=o.get_title(),h=new Object;h.ID=c,h.loginName=u,h.title=v,h.group=o,me.push(h)}}function dt(e){var s=null;if(me!=null){for(var o=0;o<me.length;o++)if(me[o].title==e){s=me[o].group;break}}return s}function ct(e){ge=new Array;for(var s=e.getEnumerator();s.moveNext();){var o=s.get_current(),c=o.get_item("ID"),u=o.get_item("Title"),v=o.get_item("UserGroup");v!=null?v=v.get_lookupValue():v="";var h=new Object;h.ID=c,h.title=u,h.userGroup=v,ge.push(h)}}function pt(e){var s=null;if(ge!=null)for(var o=0;o<ge.length;o++){var c=ge[o];if(c.title==e){s=c.userGroup;break}}return s}function ft(e,s,o){if(e==null||s==""||s==null||o==null)return!1;var c=!1,u=e.get_roleAssignments();if(u==null)return alert("Error retrieving role assignments"),!1;for(var v=u.getEnumerator();v.moveNext();){var h=v.get_current();if(h!=null){var I=h.get_member();if(I.isPropertyAvailable("Title")){var N=I.get_title(),U=h.get_roleDefinitionBindings();if(U!=null)for(var L=U.getEnumerator();L.moveNext();){var q=L.get_current(),W=q.get_name();if(N==s&&q.get_basePermissions().has(o)){c=!0;break}}}}}return c}function mt(e,s){if(!s){var o=!1;$("#ddlResponsesOpen > option").each(function(){if($(this).text()==e)return o=!0,notifyId=SP.UI.Notify.addNotification("Displaying Response ("+e+")",!1),$("#ddlResponsesOpen").val(e).change(),!1}),o||$("#ddlResponsesProcessed > option").each(function(){if($(this).text()==e)return o=!0,notifyId=SP.UI.Notify.addNotification("Displaying Response ("+e+")",!1),$("#ddlResponsesProcessed").val(e).change(),!1}),$("#tabs").tabs({active:1})}}function gt(e){var s={};return e=="Archived"?s={"background-color":"Gainsboro"}:e=="Approved"?s={"background-color":"PaleGreen"}:e=="Rejected"?s={"background-color":"LightSalmon"}:e=="Sent to QA"?s={"background-color":"LightCyan"}:e=="Submitted"?s={"background-color":"LemonChiffon"}:e=="Marked for Deletion"&&(s={"background-color":"Gainsboro","font-style":"italic"}),s}function Ge(e){var s="";return e=="Archived"?s=" style='background-color:Gainsboro;' ":e=="Approved"?s=" style='background-color:PaleGreen;' ":e=="Rejected"?s=" style='background-color:LightSalmon;' ":e=="Sent to QA"?s=" style='background-color:LightCyan;' ":e=="Submitted"?s=" style='background-color:LemonChiffon;' ":e=="Marked for Deletion"&&(s=" style='background-color:Gainsboro; font-style:italic' title='Marked for Deletion by the Action Office' "),s}function Ve(e,s){for(var o=!1,c=e.getEnumerator();c.moveNext();){var u=c.get_current(),v=u.get_displayName();if(v==s){var o=!0;break}}return o}var ye=0,ue=0;function de(e,s,o,c){ye=0,ue=0;var u=new SP.ClientContext.get_current,v=u.get_web(),h=new SP.ListItemCreationInformation;h.set_underlyingObjectType(SP.FileSystemObjectType.folder),h.set_leafName(s),oNewEmailFolder=e.addItem(h),oNewEmailFolder.set_item("Title",s),oNewEmailFolder.update(),this.currentUser=v.get_currentUser(),this.ownerGroup=v.get_associatedOwnerGroup(),this.memberGroup=v.get_associatedMemberGroup(),this.visitorGroup=v.get_associatedVisitorGroup(),oNewEmailFolder.resetRoleInheritance(),oNewEmailFolder.breakRoleInheritance(!1,!1);var I=SP.RoleDefinitionBindingCollection.newObject(u);I.add(v.get_roleDefinitions().getByType(SP.RoleType.administrator));var N=SP.RoleDefinitionBindingCollection.newObject(u);N.add(v.get_roleDefinitions().getByType(SP.RoleType.contributor));var U=SP.RoleDefinitionBindingCollection.newObject(u);U.add(v.get_roleDefinitions().getByName("Restricted Read"));var L=SP.RoleDefinitionBindingCollection.newObject(u);L.add(v.get_roleDefinitions().getByName("Restricted Contribute")),oNewEmailFolder.get_roleAssignments().add(ownerGroup,I),oNewEmailFolder.get_roleAssignments().add(memberGroup,N),oNewEmailFolder.get_roleAssignments().add(visitorGroup,U);var q=Audit.Common.Utilities.GetSPSiteGroup(Audit.Common.Utilities.GetGroupNameQA());q!=null&&oNewEmailFolder.get_roleAssignments().add(q,L),oNewEmailFolder.get_roleAssignments().getByPrincipal(currentUser).deleteObject();function W(){if(this.requestItem){var M=this.requestItem.get_item("ActionOffice");if(M==null||M.length==0){this.OnComplete&&this.OnComplete(!0);return}for(var se=0;se<M.length;se++){var z=M[se].get_lookupValue(),j=Audit.Common.Utilities.GetAOSPGroupName(z),ie=Audit.Common.Utilities.GetSPSiteGroup(j);if(ie!=null){let we=function(){ue++,ue==ye&&this.OnComplete&&this.OnComplete(!0)},ve=function(Re,Te){ue++,ue==ye&&this.OnComplete&&this.OnComplete(!0)};var Ce=we,Le=ve;ye++;var ne=new SP.ClientContext.get_current,ce=ne.get_web(),ae=SP.RoleDefinitionBindingCollection.newObject(ne);ae.add(ce.get_roleDefinitions().getByName("Restricted Contribute")),this.oNewEmailFolder.get_roleAssignments().add(ie,ae);var re={OnComplete:this.OnComplete};ne.executeQueryAsync(Function.createDelegate(re,we),Function.createDelegate(re,ve))}}}else this.OnComplete&&this.OnComplete(!0)}function B(M,se){statusId=SP.UI.Status.addStatus("Request failed: "+se.get_message()+`
`+se.get_stackTrace())}var te={requestItem:o,oNewEmailFolder,OnComplete:c};u.executeQueryAsync(Function.createDelegate(te,W),Function.createDelegate(te,B))}function Be(e,s){var o=e,c=s;let u,v;o==null&&(o=""),c==null&&(c="");var h=o.lastIndexOf("-");if(h>=0){var I=o.substring(0,h+1),N=o.replace(I,""),U=parseInt(N,10),L=Audit.Common.Utilities.PadDigits(U,5);u=I+L}else u=o;var q=c.lastIndexOf("-");if(q>=0){var W=c.substring(0,q+1),B=c.replace(W,""),te=parseInt(B,10),M=Audit.Common.Utilities.PadDigits(te,5);v=W+M}else v=c;return u.toLowerCase().localeCompare(v.toLowerCase())}function vt(e,s){var o=e.title,c=s.title,u,v;o==null&&(o=""),c==null&&(c="");var h=o.lastIndexOf("-");if(h>=0){var I=o.substring(0,h+1),N=o.replace(I,""),U=parseInt(N,10),L=Audit.Common.Utilities.PadDigits(U,5);u=I+L}else u=o;var q=c.lastIndexOf("-");if(q>=0){var W=c.substring(0,q+1),B=c.replace(W,""),te=parseInt(B,10),M=Audit.Common.Utilities.PadDigits(te,5);v=W+M}else v=c;return u.toLowerCase().localeCompare(v.toLowerCase())}function ht(e,s){return e.toLowerCase().localeCompare(s.toLowerCase())}function bt(e,s){return e==""?-1:s==""?1:new Date(e).getTime()-new Date(s).getTime()}function yt(e,s,o,c){if(e!=null){c?e.sort(Be):o?e.sort(bt):e.sort(ht);var u=new Array,v=-1;u[++v]="<option value=''>-Select-</option>";for(var h=e.length,I=0;I<h;I++){var N=$.trim(e[I]);u[++v]="<option value='"+N+"'>"+N+"</option>"}var U=$(s);U.empty().append(u.join(""))}}function wt(e,s){if(e==null)return!1;for(var o=e.length,c=0;c<o;c++)if(e[c]==s)return!0;return!1}function Rt(e){return e==!0?"<span class='ui-icon ui-icon-check'>"+e+"</span>":"<span class='ui-icon ui-icon-close'>"+e+"</span>"}function St(e,s){var o=e.get_item(s);return o==null?"":o.get_lookupValue()}function Ct(e,s){e=e.toString();var o="";if(s>e.length)for(let c=0;c<s-e.length;c++)o+="0";return o+e.toString()}function Tt(e,s){var o=e>=0?1:-1;return(Math.round(e*Math.pow(10,s)+o*.001)/Math.pow(10,s)).toFixed(s)}function _t(e){return e==null||e==""?"":(e>1048576?e=Audit.Common.Utilities.PreciseRound(e/1048576,2)+" MB":e>1024?e=Audit.Common.Utilities.PreciseRound(e/1024,2)+" KB":e+=" B",e)}function t(e){function s(o){return o<10?"0"+o:o}return e.getUTCFullYear()+"-"+s(e.getUTCMonth()+1)+"-"+s(e.getUTCDate())+"T"+s(e.getUTCHours())+":"+s(e.getUTCMinutes())+":"+s(e.getUTCSeconds())+"Z"}function n(){$(".requestInfo-response-doc img").click(function(e){e.preventDefault();var s=$(this).attr("src");s=="/_layouts/images/minus.gif"?$(this).attr("src","/_layouts/images/plus.gif"):$(this).attr("src","/_layouts/images/minus.gif"),$(this).parent().parent().nextUntil("tr.requestInfo-response-doc").each(function(){$(this).toggleClass("collapsed")})})}function a(e){return $("select[title='"+e+"']").html()!==null?$("select[title='"+e+"']"):$("input[title='"+e+"']")}function l(e){return $("select[title='"+e+"']").html()!==null?$("select[title='"+e+"'] option:selected").text():$("input[title='"+e+"']").val()}function p(e,s){try{if(s==null)return;var o=R("select","",e);if(o==null){var c=R("input","",e);ShowDropdown(c.id);var u=document.getElementById(c.opt);S(u,s),OptLoseFocus(u)}else S(o,s)}catch{}}function S(e,s){var o=e.options,c=o.length;if(e!=null){for(var u=0;u<c;u++)if(o[u].text==s)return e.selectedIndex=u,!0;return!1}}function R(e,s,o){for(var c=s.length,u=document.getElementsByTagName(e),v=0;v<u.length;v++){var h=u[v].id;if(u[v].title==o&&(s==""||h.indexOf(s)==h.length-c))return u[v]}return null}function b(e){var s=SP.UI.$create_DialogOptions();s.title="User Manual",s.height=250,e!=null?s.url=Audit.Common.Utilities.GetSiteUrl()+"/pages/AuditUserManuals.aspx?FilterField1=DocType&FilterValue1="+e:s.url=Audit.Common.Utilities.GetSiteUrl()+"/pages/AuditUserManuals.aspx",SP.UI.ModalDialog.showModalDialog(s)}function w(e,s){var o=new Date,c=Audit.Common.Utilities.GetSiteUrl(),u=c+"/siteassets/css/tablesorter/style.css?v="+o.format("MM_dd_yyyy"),v=c+"/siteAssets/css/audit_styles.css?v="+o.format("MM_dd_yyyy"),h=$(s).html(),I=$("<div>").append(h);I.find(".sr-response-title a").each(function(){$(this).removeAttr("onclick"),$(this).removeAttr("href")}),h=I.html();var N=o.format("MM/dd/yyyy hh:mm tt");N="<div style='padding-bottom:10px;'>"+N+"</div>",h=N+h;var U=$("<div></div>"),L=$("<div></div>"),q=$.Deferred(),W=$.Deferred(),B="";U.load(u,function(){B+="<style>"+U.html()+"</style>",q.resolve()}),L.load(v,function(){B+="<style>"+L.html()+"</style>",W.resolve()}),$.when(q,W).done(function(){var te=`<HTML>
<HEAD>

<Title>`+e+`</Title>
`+B+`
<style>.hideOnPrint, .rowFilters {display:none}</style>
</HEAD>
<BODY>
`+h+`
</BODY>
</HTML>`,M=window.open("","printWebPart");M.document.open(),M.document.write(te),M.document.close(),M.print()})}function g(e,s,o){var c=F(s);o==!0&&(c=c.slice(1));var u=P(c);if(navigator.userAgent.search("Trident")>=0)window.CsvExpFrame.document.open("text/html","replace"),window.CsvExpFrame.document.write(u),window.CsvExpFrame.document.close(),window.CsvExpFrame.focus(),window.CsvExpFrame.document.execCommand("SaveAs",!0,e+".csv");else{var v="data:text/csv;charset=utf-8,"+escape(u),h=document.createElement("a");h.href=v,h.download=e+".csv",document.body.appendChild(h),h.click(),document.body.removeChild(h)}}function F(e){var s=document.getElementById(e);if(s.innerHTML.indexOf("rowFilters")>=0){var o=$("<div>").append(s.outerHTML);o.find(".rowFilters").each(function(){$(this).remove()}),s=o.find("table")[0]}if(s.innerHTML.indexOf("footer")>=0){var o=$("<div>").append(s.outerHTML);o.find(".footer").each(function(){$(this).remove()}),s=o.find("table")[0]}for(var c=[],u=0,v=s.rows.length;u<v;u++){c[u]=[];for(var h=0,I=s.rows[u].cells.length;h<I;h++){var N=s.rows[u].cells[h].textContent||s.rows[u].cells[h].innerText;c[u][h]=N.trim()}}return c}function P(e){for(var s=typeof e!="object"?JSON.parse(e):e,o=`sep=,\r
`,c="",u,v,h=0;h<s.length;h++){c="";var I=s[h];for(u in I)I.hasOwnProperty(u)&&(v=I[u]+"",c+='"'+v.replace(/"/g,'""')+'",');c=c.slice(0,-1),o+=c+`\r
`}return o}var D={GetSiteUrl:function(){return d=="/"?"":d},GetListTitleRequests:function(){return r},GetListNameRequests:function(){return f},GetListTitleRequestsInternal:function(){return m},GetListNameRequestsInternal:function(){return y},GetListTitleResponses:function(){return C},GetListNameResponses:function(){return _},GetLibTitleRequestDocs:function(){return A},GetLibNameRequestDocs:function(){return T},GetLibTitleCoverSheets:function(){return E},GetLibNameCoverSheets:function(){return O},GetLibTitleResponseDocs:function(){return G},GetLibNameResponseDocs:function(){return x},GetLibTitleResponseDocsEA:function(){return Y},GetLibNameResponseDocsEA:function(){return Q},GetListTitleActionOffices:function(){return J},GetListNameActionOffices:function(){return ee},GetListTitleEmailHistory:function(){return Z},GetListNameEmailHistory:function(){return X},GetListTitleBulkResponses:function(){return le},GetListNameBulkResponses:function(){return st},GetListTitleBulkPermissions:function(){return it},GetListNameBulkPermissions:function(){return k},GetGroupNameSpecialPerm1:function(){return nt},GetGroupNameSpecialPerm2:function(){return Ue},GetGroupNameQA:function(){return ot},GetGroupNameEA:function(){return rt},Refresh:at,OnLoadDisplayTimeStamp:lt,OnLoadDisplayTabAndResponse:ut,OnLoadFilterResponses:function(e,s){xe(e,s)},SetResponseDocLibGUID:function(e){Oe=e},GetResponseDocLibGUID:function(){return Oe},LoadSiteGroups:function(e){De(e)},GetSPSiteGroup:function(e){return dt(e)},LoadActionOffices:function(e){ct(e)},GetActionOffices:function(){return ge},GetAOSPGroupName:function(e){return pt(e)},CheckSPItemHasGroupPermission:function(e,s,o){return ft(e,s,o)},GoToResponse:function(e,s){mt(e,s)},GetResponseDocStyleTag:function(e){return Ge(e)},GetResponseDocStyleTag2:function(e){return gt(e)},CheckIfEmailFolderExists:function(e,s){return Ve(e,s)},CreateEmailFolder:function(e,s,o,c){return de(e,s,o,c)},AddOptions:function(e,s,o,c){yt(e,s,o,c)},ExistsInArr:function(e,s){return wt(e,s)},GetTrueFalseIcon:function(e){return Rt(e)},PadDigits:function(e,s){return Ct(e,s)},PreciseRound:function(e,s){return Tt(e,s)},GetFriendlyFileSize:function(e){return _t(e)},GetISODateString:function(e){return t(e)},GetFriendlyDisplayName:function(e,s){return St(e,s)},BindHandlerResponseDoc:n,PrintStatusReport:function(e,s){w(e,s)},ExportToCsv:function(e,s,o){g(e,s,o)},ViewUserManuals:function(e){b(e)},GetLookupDisplayText:function(e){return l(e)},GetLookupFormField:function(e){return a(e)},SetLookupFromFieldNameByText:function(e,s){return p(e,s)},SortResponseObjects:function(e,s){return vt(e,s)},SortResponseTitles:Be};return D};ns();document.getElementById("app").innerHTML=Et;window.Audit=window.Audit||{};Audit.QAReport=Audit.QAReport||{};var os="ResNum",rs=GetUrlKeyValue("ShowSiteActions");rs!=!0&&($("#RibbonContainer-TabRowLeft").hide(),$(".ms-siteactionsmenu").hide());document.readyState==="ready"||document.readyState==="complete"?Ot():document.onreadystatechange=()=>{(document.readyState==="complete"||document.readyState==="ready")&&ExecuteOrDelayUntilScriptLoaded(function(){SP.SOD.executeFunc("sp.js","SP.ClientContext",Ot)},"sp.js")};function Ot(){Audit.QAReport.Report=new Audit.QAReport.NewReportPage,Audit.QAReport.Init()}Audit.QAReport.Init=function(){var d=GetUrlKeyValue("ShowSiteActions");d!=!0&&($("#RibbonContainer-TabRowLeft").hide(),$(".ms-siteactionsmenu").hide());function r(){var f=setInterval(function(){var m=$("#divCounter").text(),y=m*1-1;$("#divCounter").text(y),y<=0&&(Audit.QAReport.Report.IsTransactionExecuting()?(clearInterval(f),$("#divCounter").text("1200"),r()):Audit.Common.Utilities.Refresh())},1e3)}r()};Audit.QAReport.NewReportPage=function(){var d=new Array,r=new Array,f=new Object,m=null,y=null,C=null,_="",A="",T=!1,E=null,O=null,G=null;let x=null;var Y=null,Q=null,J=null,ee=null,Z=null;let X=null,le=null;function st(t,n){var a=n.requestListTitle,l=n.columnName,p=n.initialValue,S=ko.observable(!1),R=function(){S(!S())},b=[];if(p)try{b=JSON.parse(p),b.forEach(function(s){s.timestamp=new Date(s.timestamp)})}catch{console.error("could not parse internal status comments.")}var w=ko.observableArray(b),g=ko.observable();function F(){var s={id:Math.ceil(Math.random()*1e6).toString(16),text:g(),author:_spPageContextInfo.userLoginName,timestamp:new Date};w.push(s),D()}function P(s){if(confirm("Are you sure you want to delete this item?")){var o=w.indexOf(s);w.splice(o,1),D()}}function D(){var s=new SP.ClientContext.get_current,o=s.get_web(),c=o.get_lists().getByTitle(a);let u=c.getItemById(t);u.set_item(l,JSON.stringify(w())),u.update(),s.load(u),s.executeQueryAsync(function(){g("")},function(h,I){console.error("Failed to commit changes.",h)})}var e={comments:w,newCommentText:g,onSubmit:F,onRemove:P,toggleShowHistory:R,showHistoryBool:S};return e}function it(){var t=this;t.debugMode=ko.observable(!1),t.siteUrl=Audit.Common.Utilities.GetSiteUrl(),t.arrResponses=ko.observableArray(null),t.cntPendingReview=ko.observable(0),t.ddOptionsResponseTabRequestID=ko.observableArray(),t.ddOptionsResponseTabRequestStatus=ko.observableArray(),t.ddOptionsResponseTabRequestInternalDueDate=ko.observableArray(),t.ddOptionsResponseTabRequestSample=ko.observableArray(),t.ddOptionsResponseTabResponseTitle=ko.observableArray(),t.ddOptionsResponseTabResponseStatus=ko.observableArray(),t.filterResponseTabRequestID=ko.observable(),t.filterResponseTabRequestStatus=ko.observable(),t.filterResponseTabRequestIntDueDate=ko.observable(),t.filterResponseTabSampleNum=ko.observable(),t.filterResponseTabResponseName=ko.observable(),t.filterResponseTabResponseStatus=ko.observable(),t.doSort=ko.observable(!1),t.ddOptionsResponseInfoTabResponseNameOpen2=ko.observableArray(),t.ddOptionsResponseInfoTabResponseNameProcessed2=ko.observableArray(),t.filterResponseInfoTabResponseNameOpen2=ko.observable(""),t.filterResponseInfoTabResponseNameProcessed2=ko.observable(""),t.currentResponse=ko.observable(),t.arrCoverSheets=ko.observableArray(null),t.arrResponseDocs=ko.observable(),t.cntResponseDocs=ko.observable(0),t.showBulkApprove=ko.observable(!1),t.showCloseResponse=ko.observable(!1),t.showReturnToCGFS=ko.observable(!1),t.tabOpts={Responses:new Pe("response-report","Status Report",{id:"responseStatusReportTemplate",data:t}),ResponseDetail:new Pe("response-detail","Responses",{id:"responseDetailTemplate",data:t})},t.tabs=new He(Object.values(t.tabOpts)),t.ClearFiltersResponseTab=function(){t.filterResponseTabRequestID(""),t.filterResponseTabRequestStatus(""),t.filterResponseTabRequestIntDueDate(""),t.filterResponseTabSampleNum(""),t.filterResponseTabResponseName(""),t.filterResponseTabResponseStatus("")},t.filteredResponses=ko.pureComputed(()=>{let n=ko.unwrap(t.arrResponses);var a=t.filterResponseTabRequestID(),l=t.filterResponseTabRequestStatus(),p=t.filterResponseTabRequestIntDueDate(),S=t.filterResponseTabSampleNum(),R=t.filterResponseTabResponseName(),b=t.filterResponseTabResponseStatus();return!a&&!l&&!p&&!S&&!R&&!b?(document.body.style.cursor="default",n):n.filter(g=>!(b&&g.status!=b||a&&g.reqNumber!=a||l&&g.requestStatus!=l||p&&g.internalDueDate!=p||R&&g.title!=R||S&&g.sample!=S))}),t.arrFilteredResponsesCount=ko.pureComputed(()=>t.filteredResponses().length),t.FilterChangedResponseTab=function(){document.body.style.cursor="wait",setTimeout(function(){var n=t.filterResponseTabRequestID(),a=t.filterResponseTabRequestStatus(),l=t.filterResponseTabRequestIntDueDate(),p=t.filterResponseTabSampleNum(),S=t.filterResponseTabResponseName(),R=t.filterResponseTabResponseStatus();if(!n&&!a&&!l&&!p&&!S&&!R){$(".sr-response-item").show(),document.body.style.cursor="default";return}n=n||"",a=a||"",l=l||"",p=p||"",S=S||"",R=R||"";var b=0,w=$(".sr-response-item");w.each(function(){var g=!1;!g&&n!=""&&$.trim($(this).find(".sr-response-requestNum").text())!=n&&(g=!0),!g&&a!=""&&$.trim($(this).find(".sr-response-requestStatus").text())!=a&&(g=!0),!g&&l!=""&&$.trim($(this).find(".sr-response-internalDueDate").text())!=l&&(g=!0),!g&&S!=""&&$.trim($(this).find(".sr-response-title").text())!=S&&(g=!0),!g&&p!=""&&$.trim($(this).find(".sr-response-sample").text())!=p&&(g=!0),!g&&R!=""&&$.trim($(this).find(".sr-response-status").text())!=R&&(g=!0),g?$(this).hide():($(this).show(),b++)}),document.body.style.cursor="default"},100)},t.ClickHelpResponseDocs=function(){ut()},t.ClickCloseResponse=function(){ft()},t.ClickReturnToCGFS=function(){mt()},t.ClickBulkApprove=function(){dt()},t.ClickApproveResponseDoc=function(n){n&&n.ID&&n.fileName&&ct(n.ID,n.fileName)},t.ClickRejectResponseDoc=function(n){n&&n.ID&&n.fileName&&pt(n.ID,n.fileName)},t.currentResponse.subscribe(n=>{n&&je(os,n.title)}),t.doSort.subscribe(function(n){Audit.Common.Utilities.OnLoadDisplayTimeStamp(),t.arrResponses().length>0&&n&&(ko.utils.arrayPushAll(t.ddOptionsResponseTabResponseStatus(),t.GetDDVals("status")),t.ddOptionsResponseTabResponseStatus.valueHasMutated(),ko.utils.arrayPushAll(t.ddOptionsResponseInfoTabResponseNameOpen2(),t.GetDDVals2("1",!0)),t.ddOptionsResponseInfoTabResponseNameOpen2.valueHasMutated(),ko.utils.arrayPushAll(t.ddOptionsResponseInfoTabResponseNameProcessed2(),t.GetDDVals2("0",!0)),t.ddOptionsResponseInfoTabResponseNameProcessed2.valueHasMutated(),ko.utils.arrayPushAll(t.ddOptionsResponseTabRequestID(),t.GetDDVals("reqNumber")),t.ddOptionsResponseTabRequestID.valueHasMutated(),ko.utils.arrayPushAll(t.ddOptionsResponseTabRequestStatus(),t.GetDDVals("requestStatus")),t.ddOptionsResponseTabRequestStatus.valueHasMutated(),ko.utils.arrayPushAll(t.ddOptionsResponseTabRequestInternalDueDate(),t.GetDDVals("internalDueDate")),t.ddOptionsResponseTabRequestInternalDueDate.valueHasMutated(),ko.utils.arrayPushAll(t.ddOptionsResponseTabRequestSample(),t.GetDDVals("sample")),t.ddOptionsResponseTabRequestSample.valueHasMutated(),ko.utils.arrayPushAll(t.ddOptionsResponseTabResponseTitle(),t.GetDDVals("title",!0)),t.ddOptionsResponseTabResponseTitle.valueHasMutated(),setTimeout(function(){var a=GetUrlKeyValue("Tab");a!=null&&a!=""?k.tabs.selectById(a):k.tabs.selectTab(k.tabOpts.Responses);var l=GetUrlKeyValue("ResNum");l!=null&&l!=""&&(a==k.tabOpts.Responses.id?$("#ddlResponseName option[value='"+l+"']").length>0&&k.filterResponseTabResponseName(l):$("#ddlResponsesOpen option[value='"+l+"']").length>0?k.filterResponseInfoTabResponseNameOpen2(l):$("#ddlResponsesProcessed option[value='"+l+"']").length>0&&k.filterResponseInfoTabResponseNameProcessed2(l)),Rt(),A!=""?t.filterResponseTabResponseStatus(A):t.filterResponseTabRequestStatus("Open"),$("#tblStatusReportResponses").tablesorter({sortList:[[3,0]],selectorHeaders:".sorter-true"})},200))}),t.filterResponseInfoTabResponseNameOpen2.subscribe(function(n){t.filterResponseInfoTabResponseName(n,!0)}),t.filterResponseInfoTabResponseNameProcessed2.subscribe(function(n){t.filterResponseInfoTabResponseName(n,!1)}),t.filterResponseInfoTabResponseName=function(n,a){t.currentResponse(null),t.arrCoverSheets([]),t.arrResponseDocs(null),t.cntResponseDocs(0),t.showBulkApprove(!1),t.showCloseResponse(!1),t.showReturnToCGFS(!1);var l=f["response-"+n];l&&(a?t.filterResponseInfoTabResponseNameProcessed2(""):t.filterResponseInfoTabResponseNameOpen2(""),t.currentResponse(l),at(l),lt(l),setTimeout(function(){let p=SP.UI.Notify.addNotification("Displaying Response ("+l.title+")",!1)}))},t.GetDDVals=function(n,a){var l=ko.utils.arrayMap(t.arrResponses(),function(S){return S[n]}),p=ko.utils.arrayGetDistinctValues(l).sort();return a&&p.sort(Audit.Common.Utilities.SortResponseTitles),p[0]==""&&p.shift(),p},t.GetDDVals2=function(n,a){var l=ko.utils.arrayMap(t.arrResponses(),function(S){var R=S.requestStatus,b=S.status;if(n==0)return b!="4-Approved for QA"&&b!="6-Reposted After Rejection"?S.title:"";if(n==1)return(b=="4-Approved for QA"||b=="6-Reposted After Rejection")&&(R=="Open"||R=="ReOpened")?S.title:""}),p=ko.utils.arrayGetDistinctValues(l).sort();return a&&p.sort(Audit.Common.Utilities.SortResponseTitles),p[0]==""&&p.shift(),p}}var k=new it;ko.applyBindings(k),nt();function nt(){var t=new SP.ClientContext.get_current,n=t.get_web();let a=n.get_currentUser();t.load(a);var l=n.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleRequests()),p=new SP.CamlQuery;p.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'),Y=l.getItems(p),t.load(Y,"Include(ID, Title, ReqSubject, ReqStatus, IsSample, InternalDueDate, ActionOffice, Comments, RelatedAudit, ActionItems, EmailSent, ClosedDate, Modified)");var S=n.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleRequestsInternal()),R=new SP.CamlQuery;R.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'),Q=S.getItems(R),t.load(Q,"Include(ID, Title, ReqNum, InternalStatus)");var b=n.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleResponses()),w=new SP.CamlQuery;w.set_viewXml('<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="ReqNum"/></OrderBy></Query></View>'),J=b.getItems(w),t.load(J,"Include(ID, Title, ReqNum, ActionOffice, SampleNumber, ResStatus, Comments, Modified, ClosedDate, ClosedBy)");var g=n.get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs()),F=new SP.CamlQuery;F.set_viewXml('<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="ContentType"/><Value Type="Text">Document</Value></Eq></Where></Query></View>'),ee=g.getItems(F),t.load(ee,"Include(ID, Title, ReqNum, ResID, DocumentStatus, RejectReason, ReceiptDate, FileLeafRef, FileDirRef, File_x0020_Size, Modified, Editor)");var P=n.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleActionOffices()),D=new SP.CamlQuery;D.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'),Z=P.getItems(D),t.load(Z,"Include(ID, Title, UserGroup)"),E=n.get_associatedMemberGroup(),t.load(E),t.executeQueryAsync(e,s);function e(o,c){$("#divRefresh").show(),Ue()}function s(o,c){$("#divRefresh").hide(),$("#divLoading").hide();let u=SP.UI.Status.addStatus("Request failed: "+c.get_message()+`
`+c.get_stackTrace());SP.UI.Status.setStatusPriColor(u,"red")}}function Ue(){if(Audit.Common.Utilities.LoadActionOffices(Z),E!=null&&(m=E.get_title()),m==null||m==""){let t=SP.UI.Status.addStatus("Unable to retrieve the IA SharePoint Group. Please contact the Administrator");SP.UI.Status.setStatusPriColor(t,"red");return}y=Audit.Common.Utilities.GetActionOffices()?.find(t=>t.userGroup==m),ot(),rt(),Oe(),me(r,"fbody")}function ot(){f=new Object,d=new Array;for(var t=0,n=Y.getEnumerator();n.moveNext();){var a=n.get_current(),l=a.get_item("ID"),p=a.get_item("Title"),S=a.get_item("ReqStatus"),R=a.get_item("IsSample"),b=a.get_item("EmailSent"),w=a.get_item("ReqSubject");w==null&&(w="");for(var g=a.get_item("ActionOffice"),F="",P=0;P<g.length;P++)F+="<div>"+g[P].get_lookupValue()+"</div>";var D=a.get_item("InternalDueDate"),e=a.get_item("ClosedDate");D!=null?D=D.format("MM/dd/yyyy"):D="",e!=null?e=e.format("MM/dd/yyyy"):e="";var s=a.get_item("Comments"),o=a.get_item("RelatedAudit"),c=a.get_item("ActionItems");s==null&&(s=""),o==null&&(o=""),c==null&&(c="");var u=new Object;u.ID=l,u.number=p,u.subject=w,u.status=S,u.internalDueDate=D,u.sample=R,u.actionOffice=F,u.comments=s,u.emailSent=b,u.closedDate=e,u.relatedAudit=o,u.actionItems=c,u.arrIndex=t,d.push(u),f[p]=u,t++}try{for(var n=Q.getEnumerator();n.moveNext();){var a=n.get_current(),l=a.get_item("ID"),v=a.get_item("ReqNum");if(!v||!v.get_lookupValue()){console.warn("Unaffiliated Internal Status ID:",l);continue}var u=f[v.get_lookupValue()];u.internalStatus=new st(l,{requestListTitle:Audit.Common.Utilities.GetListTitleRequestsInternal(),columnName:"InternalStatus",initialValue:a.get_item("InternalStatus")})}}catch(h){alert(h)}}function rt(){r=new Array;for(var t=0,n=J.getEnumerator();n.moveNext();){var a=n.get_current(),l=a.get_item("ReqNum");if(l!=null){l=l.get_lookupValue();var p=new Object;if(p.request=f[l],!p.request||!p.request.emailSent||(p.item=a,p.resStatus=a.get_item("ResStatus"),p.actionOffice=a.get_item("ActionOffice"),p.actionOffice==null?p.actionOffice="":p.actionOffice=p.actionOffice.get_lookupValue(),p.actionOffice==""))continue;p.ID=a.get_item("ID"),p.number=l;var S=a.get_item("Title");p.title=S;var R=a.get_item("Modified");R!=null?R=R.format("MM/dd/yyyy hh:mm tt"):R="",p.modified=R;var b=a.get_item("ClosedDate");b!=null?b=b.format("MM/dd/yyyy"):b="",p.closedDate=b,p.sample=a.get_item("SampleNumber"),p.sample==null&&(p.sample=""),p.coversheets=new Array,p.responseDocs=new Array;var w=a.get_item("Comments");w==null&&(w=""),p.comments=w,p.closedBy=Audit.Common.Utilities.GetFriendlyDisplayName(a,"ClosedBy"),p.arrIndex=t,r.push(p),f["response-"+S]=p,t++}}}function Oe(){for(var t=ee.getEnumerator();t.moveNext();){var n=t.get_current();if(!(n.get_item("DocumentStatus")=="Open"||n.get_item("DocumentStatus")=="Marked for Deletion"||n.get_item("DocumentStatus")=="Submitted")){var a=n.get_item("ReqNum");a!=null&&(a=a.get_lookupValue());var l=n.get_item("ResID");if(l!=null&&(l=l.get_lookupValue()),!(a==null||l==null))try{var p=f["response-"+l],S=p.arrIndex,R=r[S];if(R){var b=new Object;b.ID=n.get_item("ID"),b.title=n.get_item("Title"),b.title==null&&(b.title=""),b.fileName=n.get_item("FileLeafRef"),b.title=n.get_item("FileLeafRef"),b.folder=n.get_item("FileDirRef"),b.documentStatus=n.get_item("DocumentStatus"),b.rejectReason=n.get_item("RejectReason"),b.rejectReason==null?b.rejectReason="":b.rejectReason=b.rejectReason.replace(/(\r\n|\n|\r)/gm,"<br/>");var w=n.get_item("File_x0020_Size");w=Audit.Common.Utilities.GetFriendlyFileSize(w),b.fileSize=w;var g="";n.get_item("ReceiptDate")!=null&&n.get_item("ReceiptDate")!=""&&(g=n.get_item("ReceiptDate").format("MM/dd/yyyy")),b.receiptDate=g;var F="";n.get_item("Modified")!=null&&n.get_item("Modified")!=""&&(F=n.get_item("Modified").format("MM/dd/yyyy hh:mm tt")),b.modifiedDate=F,b.modifiedBy=Audit.Common.Utilities.GetFriendlyDisplayName(n,"Editor"),b.item=n,R.responseDocs.push(b)}}catch{}}}}function me(t,n){if(t!=null){for(var a=new Array,l="4-Approved for QA",p="6-Reposted After Rejection",S=0,R=0,b=0,w=t.length;w--;){var g=t[w],P=g.title,D=g.request.status,e=g.resStatus,F=!1;(e==l||e==p)&&(D=="Open"||D=="ReOpened")&&(S++,e==l?R++:b++,F=!0);var P=g.title,D=g.request.status,e=g.resStatus,s={reqNumber:g.request.number,requestSubject:g.request.subject,requestStatus:D,internalDueDate:g.request.internalDueDate,sample:g.sample,title:P,status:e,docCount:g.responseDocs.length,modified:g.modified,comments:g.comments,highlight:F,visibleRow:ko.observable(!0)};a.push(s)}a.length>0&&(A="",R>0&&b==0?A=l:b>0&&R==0&&(A=p),k.cntPendingReview(S),ko.utils.arrayPushAll(k.arrResponses,a)),k.doSort(!0)}}function ge(t,n){var a=[],l=!0,p=100;if(n&&(p=100),t.length>=p?(a=t.slice(0,p),t.splice(0,p)):t.length>0&&(a=t.slice(0,t.length),t.splice(0,t.length)),l){ko.utils.arrayPushAll(k.arrResponses(),a);var S=!1;n&&(S=!0),k.arrResponses.valueHasMutated(),t.length==0&&k.doSort(!0),t.length>0&&setTimeout(function(){ge(t,!1)},100)}}function at(t){k.arrCoverSheets([]);var n=new SP.ClientContext.get_current,a=n.get_web(),l=a.get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleCoverSheets()),p=new SP.CamlQuery;p.set_viewXml('<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="ReqNum"/><Value Type="Text">'+t.request.number+"</Value></Eq></Where></Query></View>");let S=l.getItems(p);n.load(S,"Include(ID, Title, ReqNum, ActionOffice, FileLeafRef, FileDirRef)");var R={oResponse:t};function b(g,F){for(var P=new Array,D=S.getEnumerator();D.moveNext();){var e=D.get_current();if(e.get_item("ActionOffice")!=null){var s=e.get_item("ActionOffice");if(s.length>0)for(var o=0;o<s.length;o++){var c=s[o].get_lookupValue();if(c==this.oResponse.actionOffice){var u=e.get_item("FileDirRef"),v=e.get_item("FileLeafRef");P.push({folder:u,fileName:v});break}}}}ko.utils.arrayPushAll(k.arrCoverSheets(),P),k.arrCoverSheets.valueHasMutated()}function w(g,F){$("#tblCoverSheets").hide(),$("#divEmptyCoversheetsMsg").show()}n.executeQueryAsync(Function.createDelegate(R,b),Function.createDelegate(R,w))}function lt(t){if(k.arrResponseDocs(null),k.cntResponseDocs(0),k.showBulkApprove(!1),k.showCloseResponse(!1),k.showReturnToCGFS(!1),(t==null||t.responseDocs.length==0)&&$("#ddlResponsesOpen").val()!=""){G=SP.UI.Notify.addNotification("There are 0 documents to review for "+$("#ddlResponsesOpen").val(),!1),k.showReturnToCGFS(!0);return}for(var n=new SP.ClientContext.get_current,a=n.get_web(),l=0;l<t.responseDocs.length;l++){var p=t.responseDocs[l];p.docIcon=a.mapToIcon(p.fileName,"",SP.Utilities.IconSize.Size16)}function S(w,g){b(t)}function R(w,g){O=SP.UI.Status.addStatus("Request failed: "+g.get_message()+`
`+g.get_stackTrace()),SP.UI.Status.setStatusPriColor(O,"red")}n.executeQueryAsync(S,R);function b(w){if(w!=null){for(var g=0,F=0,P=0,D=!1,e=new Array,s=0;s<w.responseDocs.length;s++){var o=w.responseDocs[s];o.docIcon=o.docIcon.get_value(),o.styleTag=Audit.Common.Utilities.GetResponseDocStyleTag2(o.documentStatus),o.responseTitle=w.title,(w.resStatus=="4-Approved for QA"||w.resStatus=="6-Reposted After Rejection")&&o.documentStatus=="Sent to QA"?(F++,k.showBulkApprove(!0)):(w.resStatus=="4-Approved for QA"||w.resStatus=="6-Reposted After Rejection")&&o.documentStatus=="Rejected"?k.showReturnToCGFS(!0):(w.resStatus=="4-Approved for QA"||w.resStatus=="6-Reposted After Rejection")&&(o.documentStatus=="Archived"||o.documentStatus=="Approved")&&P++,e.push(o)}var c={responseTitle:w.title,responseDocs:e,responseStatus:w.resStatus};P==e.length&&$("#ddlResponsesOpen").val()!=""&&(k.showCloseResponse(!0),SP.UI.Notify.addNotification("This Response did not automatically close. Please close this response.",!1)),!D&&F==0&&$("#ddlResponsesOpen").val()!=""&&k.showReturnToCGFS(!0),k.arrResponseDocs(c),k.arrResponseDocs.valueHasMutated(),k.cntResponseDocs(w.responseDocs.length)}}}function ut(){var t="<div id='helpDlg' style='padding:20px; height:100px; width:700px'><div style='padding:20px;'><fieldset><legend>Response Document Status</legend> <ul style='padding-top:10px;'><li style='padding-top:5px;'><b>Submitted</b> - Submitted to the Internal Auditor by the Action Office</li><li style='padding-top:5px;'><b>Sent to QA</b> - Submitted to the Quality Assurance team by the Internal Auditor</li><li style='padding-top:5px;'><b>Approved</b> - Approved by the Quality Assurance team and submitted to the External Auditor</li><li style='padding-top:5px;'><b>Rejected</b> - Rejected by the Quality Assurance team and returned to the Internal Auditor</li><li style='padding-top:5px;'><b>Archived</b> - Previously Rejected by the Quality Assurance team and is now read-only for record keeping</li></ul></fieldset></div><div style='padding:20px; padding-top:10px;'><fieldset style='padding-top:10px;'><legend>Actions</legend> If the Response Status is <b>4-Approved for QA</b> or <b>6-Reposted After Rejection</b>, then the documents can be <b>Approved</b> or <b>Rejected</b><ul style='padding-top:10px;'><li style='padding-top:5px;'><b>Approve</b> - Submit the document to the External Auditor</li><li style='padding-top:5px;'><b>Reject</b> - Reject the document and return to the Internal Auditor</li></ul></fieldset></div><table style='padding-top:10px; width:200px; float:right'><tr><td class='ms-separator'>&#160;</td><td><input id='btnCancel' type='button' class='ms-ButtonHeightWidth' value='Close' title='Close Help' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)'/></td></tr></table></div>";$("body").append(t);var n=SP.UI.$create_DialogOptions();n.title="Response Documents Help",n.dialogReturnValueCallback=Be,n.html=document.getElementById("helpDlg"),n.height=450,SP.UI.ModalDialog.showModalDialog(n)}let xe=0,De=0;function dt(){T=!0;var t="<div id='approveResponseDocDlg' style='padding:20px; height:100px'><div style='padding:20px;'>Are you sure you would like to <span style='font-weight:bold; color:green'>Approve</span> all remaining documents?</span></div><table style='padding-top:10px; width:200px; margin:0px auto'><tr><td><input id='btnClientOk1' type='button' class='ms-ButtonHeightWidth' value='Send to Auditor' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK)'/></td><td class='ms-separator'>&#160;</td><td><input id='btnCancel' type='button' class='ms-ButtonHeightWidth' value='Close' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)'/></td></tr></table></div>";$("body").append(t);var n=SP.UI.$create_DialogOptions();n.title="Approve Response Documents",n.dialogReturnValueCallback=wt,n.html=document.getElementById("approveResponseDocDlg"),SP.UI.ModalDialog.showModalDialog(n)}function ct(t,n){T=!0,C=t,_="";var a="<div id='approveResponseDocDlg' style='padding:20px; height:100px'><div style='padding:20px;'>Are you sure you would like to <span style='font-weight:bold; color:green'>Approve</span> the Response Document? <p style='padding-top:10px; font-weight:bold; color:green'>"+n+"</p></span></div><table style='padding-top:10px; width:200px; margin:0px auto'><tr><td><input id='btnClientOk1' type='button' class='ms-ButtonHeightWidth' value='Send to Auditor' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK)'/></td><td class='ms-separator'>&#160;</td><td><input id='btnCancel' type='button' class='ms-ButtonHeightWidth' value='Close' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)'/></td></tr></table></div>";$("body").append(a);var l=SP.UI.$create_DialogOptions();l.title="Approve Response Document",l.dialogReturnValueCallback=bt,l.html=document.getElementById("approveResponseDocDlg"),SP.UI.ModalDialog.showModalDialog(l)}function pt(t,n){T=!0,C=t,_="";var a="<div id='rejectResponseDocDlg' style='padding:20px; height:100px'><div style='padding:20px;'>Are you sure you would like to <span style='font-weight:bold; color:DarkRed'>Reject</span> the Response Document? <p style='padding-top:10px; font-weight:bold; color:DarkRed'>"+n+"</p><p style='padding-top:10px'>If so, please specify the reason: </p><p><textarea id='txtRejectReason' cols='50' rows='3' onkeyup='Audit.QAReport.Report.GetCancelReason()'></textarea></p></span></div><table style='padding-top:10px; width:200px; margin:0px auto'><tr><td><input id='btnClientOk1' type='button' class='ms-ButtonHeightWidth' value='Yes, Reject Document' disabled='disabled' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK)'/></td><td class='ms-separator'>&#160;</td><td><input id='btnCancel' type='button' class='ms-ButtonHeightWidth' value='Close' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)'/></td></tr></table></div>";$("body").append(a);var l=SP.UI.$create_DialogOptions();l.title="Reject Response Document",l.dialogReturnValueCallback=yt,l.html=document.getElementById("rejectResponseDocDlg"),SP.UI.ModalDialog.showModalDialog(l),$("#txtRejectReason").focus()}function ft(){T=!0;var t="<div id='responseDocDlg' style='padding:20px; height:100px'><div style='padding:20px;'>All documents in this response are Approved. Are you sure you would like to <span style='font-weight:bold; color:green'>Close this Response</span>? </span></div><table style='padding-top:10px; width:200px; margin:0px auto'><tr><td><input id='btnClientOk1' type='button' class='ms-ButtonHeightWidth' value='Close Response' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK)'/></td><td class='ms-separator'>&#160;</td><td><input id='btnCancel' type='button' class='ms-ButtonHeightWidth' value='Close' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)'/></td></tr></table></div>";$("body").append(t);var n=SP.UI.$create_DialogOptions();n.title="Close Response",n.dialogReturnValueCallback=vt,n.html=document.getElementById("responseDocDlg"),SP.UI.ModalDialog.showModalDialog(n)}function mt(){T=!0;var t="<div id='responseDocDlg' style='padding:20px; height:100px'><div style='padding:20px;'>Are you sure you would like to <span style='font-weight:bold; color:darkred'>Return this Response to CGFS</span>? <p style='padding-top:10px;'><b>Note</b>: If you return it, you will no longer be able to Approve or Reject the Remaining Response Documents</p></span></div><table style='padding-top:10px; width:200px; margin:0px auto'><tr><td><input id='btnClientOk1' type='button' class='ms-ButtonHeightWidth' value='Return to CGFS' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK)'/></td><td class='ms-separator'>&#160;</td><td><input id='btnCancel' type='button' class='ms-ButtonHeightWidth' value='Close' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)'/></td></tr></table></div>";$("body").append(t);var n=SP.UI.$create_DialogOptions();n.title="Return to CGFS",n.dialogReturnValueCallback=ht,n.html=document.getElementById("responseDocDlg"),SP.UI.ModalDialog.showModalDialog(n)}function gt(t,n){var a="<div>Audit Request Reference: <b>REQUEST_NUMBER</b></div><div>Audit Request Subject: <b>REQUEST_SUBJECT</b></div><div>Audit Request Due Date: <b>REQUEST_DUEDATE</b></div><br/><div>Below is the Response that was updated: </div><div>RESPONSE_TITLE</div>";a=a.replace("REQUEST_NUMBER",t.number),a=a.replace("REQUEST_SUBJECT",t.subject),a=a.replace("REQUEST_DUEDATE",t.internalDueDate),a=a.replace("REQUEST_ACTIONITEMS",t.actionItems);var l="<ul><li>"+n+"</li></ul>";return a=a.replace("RESPONSE_TITLE",l),a}function Ge(t){var n=null;try{n=f["response-"+t]}catch{}return n}function Ve(t){for(var n=new SP.ClientContext.get_current,a=!1,l=X.getEnumerator();l.moveNext();){var p=l.get_current(),S=p.get_displayName();if(S==t){a=!0;break}}if(!a){let g=function(P,D){},F=function(P,D){};var R=n.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocsEA()),b=new SP.ListItemCreationInformation;b.set_underlyingObjectType(SP.FileSystemObjectType.folder),b.set_leafName(t);let w=R.addItem(b);w.set_item("Title",t),w.update(),n.executeQueryAsync(g,F)}}function ye(){for(var t=new SP.ClientContext.get_current,n=!1,a=le.getEnumerator();a.moveNext();){var l=a.get_current(),n=!0;break}if(!n){let g=function(P,D){},F=function(P,D){};var p=t.get_web().get_lists().getByTitle("AuditEAEmailLog"),S=new Date,R=S.format("MM/dd/yyyy"),b=new SP.ListItemCreationInformation;let w=p.addItem(b);w.set_item("Title",R),w.update(),t.executeQueryAsync(g,F)}}function ue(t){var n=null;try{var a=f["response-"+t];a&&(n=a.request)}catch{}return n}function de(t,n,a,l){if(!n||!t)return;var p=gt(n,a),S=new SP.ListItemCreationInformation;S.set_folderUrl(location.protocol+"//"+location.host+Audit.Common.Utilities.GetSiteUrl()+"/Lists/"+Audit.Common.Utilities.GetListNameEmailHistory()+"/"+n.number);let R=t.addItem(S);R.set_item("Title",l),R.set_item("Body",p),R.set_item("To",y.title),R.set_item("ReqNum",n.number),R.set_item("ResID",a),R.set_item("NotificationType","IA Notification"),R.update()}function Be(t,n){SP.UI.DialogResult.OK}function vt(t,n){if(t===SP.UI.DialogResult.OK){let F=function(D,e){for(var s=w.getEnumerator();s.moveNext();){var o=s.get_current(),c=o.get_item("Title"),u=new Date;o.set_item("ResStatus","7-Closed");var v=new Date(u.getFullYear(),u.getMonth(),u.getDate(),u.getHours(),u.getMinutes(),u.getSeconds(),u.getMilliseconds());o.set_item("ClosedDate",v),o.set_item("ClosedBy",_spPageContextInfo.userId),o.update();var h=null;try{var I=f["response-"+c];I&&(h=I.request)}catch{}h?de(R,h,c,"An Audit Response has been Closed by the Quality Assurance Team: "+c):x.close(),l.executeQueryAsync(function(){x.close(),Audit.Common.Utilities.Refresh()},function(){x.close(),Audit.Common.Utilities.Refresh()});break}},P=function(D,e){x.close(),alert("Request failed. "+e.get_message()+`
`+e.get_stackTrace())};x=SP.UI.ModalDialog.showWaitScreenWithNoClose("Closing Response","Please wait... Closing Response",200,400);var a=$("#ddlResponsesOpen").val(),l=SP.ClientContext.get_current(),p=l.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetListTitleResponses()),S=new SP.CamlQuery;S.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="Title"/><Value Type="Text">'+a+"</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>");let w=p.getItems(S);l.load(w);var R=l.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory()),b=new SP.CamlQuery;b.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>');let g=R.getItems(b);l.load(g,"Include(ID, FSObjType, Title, DisplayName)"),l.executeQueryAsync(F,P)}else T=!1}function ht(t,n){if(t===SP.UI.DialogResult.OK){let F=function(D,e){for(var s=w.getEnumerator();s.moveNext();){var o=s.get_current(),c=o.get_item("Title"),u=new Date;o.set_item("ResStatus","5-Returned to GFS"),o.update();var v=null;try{var h=f["response-"+c];h&&(v=h.request)}catch{}v?de(R,v,c,"An Audit Response has been Returned by the Quality Assurance Team: "+c):x.close(),l.executeQueryAsync(function(){x.close(),Audit.Common.Utilities.Refresh()},function(){x.close(),Audit.Common.Utilities.Refresh()});break}},P=function(D,e){x.close(),alert("Request failed. "+e.get_message()+`
`+e.get_stackTrace())};x=SP.UI.ModalDialog.showWaitScreenWithNoClose("Returning to CGFS","Please wait... Returning to CGFS",200,400);var a=$("#ddlResponsesOpen").val(),l=SP.ClientContext.get_current(),p=l.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetListTitleResponses()),S=new SP.CamlQuery;S.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="Title"/><Value Type="Text">'+a+"</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>");let w=p.getItems(S);l.load(w);var R=l.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory()),b=new SP.CamlQuery;b.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>');let g=R.getItems(b);l.load(g,"Include(ID, FSObjType, Title, DisplayName)"),l.executeQueryAsync(F,P)}else T=!1}function bt(t,n){if(t===SP.UI.DialogResult.OK){let g=function(P,D){var e=Ge($("#ddlResponsesOpen").val());if(e==null||e.request==null){x.close();return}let s=e.request,o=s.number;Ve(o),ye();var c=s.number,u=e.title,v=w.get_item("FileLeafRef"),h=new SP.ClientContext.get_current,I=h.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());w=I.getItemById(C);var N=w.get_file(),U=location.protocol+"//"+location.host+_spPageContextInfo.webServerRelativeUrl+"/",L=U+Audit.Common.Utilities.GetLibTitleResponseDocsEA()+"/"+o+"/"+v;N.copyTo(L,1),w.set_item("DocumentStatus","Approved"),w.set_item("RejectReason",""),w.update();var q=location.protocol+"//"+location.host,W=L.replace(q,"");let B=h.get_web().getFileByServerRelativeUrl(W);h.load(B,"ListItemAllFields");var te={responseTitle:u,copiedFileName:L,requestId:c,responseNumber:u};function M(){if(this.responseTitle==null||this.responseTitle==null||this.responseTitle==""){x.close(),alert("Error: empty response title ");return}var z=SP.ClientContext.get_current(),j=B.get_listItemAllFields().get_id(),ie=z.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocsEA());let ne=ie.getItemById(j);ne.set_item("RequestNumber",this.requestId),ne.set_item("ResponseID",this.responseNumber),ne.update();var ce=z.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetListTitleResponses()),ae=new SP.CamlQuery;ae.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="Title"/><Value Type="Text">'+this.responseTitle+"</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>");let re=ce.getItems(ae);z.load(re);var Ce=Audit.Common.Utilities.GetSiteUrl()+"/"+Audit.Common.Utilities.GetLibNameResponseDocs()+"/"+this.responseTitle,Le=z.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs()),we=new SP.CamlQuery;we.set_viewXml('<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><And><Eq><FieldRef Name="FSObjType"/><Value Type="Text">0</Value></Eq><Eq><FieldRef Name="FileDirRef"/><Value Type="Text">'+Ce+"</Value></Eq></And></Where></Query></View>");let ve=Le.getItems(we);z.load(ve);var Re=z.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory()),Te=new SP.CamlQuery;Te.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>');let qe=Re.getItems(Te);z.load(qe,"Include(ID, FSObjType, Title, DisplayName)");function $e(){G=SP.UI.Notify.addNotification("Approved Response Document",!1);let Ae=!0;for(var Ie=ve.getEnumerator(),ke=!1;Ie.moveNext();){var Qe=Ie.get_current(),_e=Qe.get_item("DocumentStatus");_e=="Open"||_e=="Submitted"||_e=="Sent to QA"?Ae=!1:_e=="Rejected"&&(ke=!0)}if(Ae)for(var Se=ue(this.responseTitle),Fe=re.getEnumerator();Fe.moveNext();){var he=Fe.get_current();if(ke)he.set_item("ResStatus","5-Returned to GFS"),de(Re,Se,this.responseTitle,"An Audit Response has been Returned by the Quality Assurance Team: "+this.responseTitle);else{var oe=new Date;he.set_item("ResStatus","7-Closed");var pe=new Date(oe.getFullYear(),oe.getMonth(),oe.getDate(),oe.getHours(),oe.getMinutes(),oe.getSeconds(),oe.getMilliseconds());he.set_item("ClosedDate",pe),he.set_item("ClosedBy",_spPageContextInfo.userId),de(Re,Se,this.responseTitle,"An Audit Response has been Closed by the Quality Assurance Team: "+this.responseTitle)}he.update(),z.executeQueryAsync(function(){x.close(),Audit.Common.Utilities.Refresh()});break}else x.close(),Audit.Common.Utilities.Refresh()}function xt(){x.close()}var Me={responseTitle:this.responseTitle};z.executeQueryAsync(Function.createDelegate(Me,$e),Function.createDelegate(Me,xt))}function se(z,j){x.close(),alert("Request failed. "+j.get_message()+`
`+j.get_stackTrace()),Audit.Common.Utilities.Refresh()}h.executeQueryAsync(Function.createDelegate(te,M),Function.createDelegate(te,se))},F=function(P,D){x.close(),alert("Request failed. "+D.get_message()+`
`+D.get_stackTrace())};x=SP.UI.ModalDialog.showWaitScreenWithNoClose("Approving Response Document","Please wait... Approving Response Document",200,400);var a=SP.ClientContext.get_current(),l=a.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());let w=l.getItemById(C);a.load(w);var p=a.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocsEA()),S=new SP.CamlQuery;S.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>'),X=p.getItems(S),a.load(X,"Include(ID, FSObjType, Title, DisplayName)");var R=a.get_web().get_lists().getByTitle("AuditEAEmailLog"),b=new SP.CamlQuery;b.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="Created"/><Value IncludeTimeValue="FALSE" Type="DateTime"><Today/></Value></Eq></Where></Query></View>'),le=R.getItems(b),a.load(le,"Include(ID)"),a.executeQueryAsync(g,F)}else T=!1}function yt(t,n){if(t===SP.UI.DialogResult.OK){let S=function(b,w){var g=new SP.ClientContext.get_current,F=g.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());p=F.getItemById(C),p.set_item("DocumentStatus","Rejected"),p.set_item("RejectReason",_),p.update();var P=location.protocol+"//"+location.host+_spPageContextInfo.webServerRelativeUrl+"/";let D=p.get_item("FileDirRef"),e=p.get_item("FileLeafRef");var s=D.lastIndexOf("/"),o=D.substring(0,s+1),c=D.replace(o,""),u=Audit.Common.Utilities.GetSiteUrl()+"/"+Audit.Common.Utilities.GetLibNameResponseDocs()+"/"+c,v=g.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs()),h=new SP.CamlQuery;h.set_viewXml('<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><And><Eq><FieldRef Name="FSObjType"/><Value Type="Text">0</Value></Eq><Eq><FieldRef Name="FileDirRef"/><Value Type="Text">'+u+"</Value></Eq></And></Where></Query></View>");let I=v.getItems(h);g.load(I);var N=g.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetListTitleResponses()),U=new SP.CamlQuery;U.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="Title"/><Value Type="Text">'+c+"</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>");let L=N.getItems(U);g.load(L);var q=g.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory()),W=new SP.CamlQuery;W.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>');let B=q.getItems(W);g.load(B,"Include(ID, FSObjType, Title, DisplayName)");function te(){G=SP.UI.Notify.addNotification("Rejected Response Document",!1);let z=!0;for(var j=I.getEnumerator();j.moveNext();){var ie=j.get_current(),ne=ie.get_item("DocumentStatus");(ne=="Open"||ne=="Submitted"||ne=="Sent to QA")&&(z=!1)}if(z)for(var ce=ue(this.responseTitle),ae=L.getEnumerator();ae.moveNext();){var re=ae.get_current(),Ce=new Date;re.set_item("ResStatus","5-Returned to GFS"),re.update(),de(q,ce,this.responseTitle,"An Audit Response has been Returned by the Quality Assurance Team: "+this.responseTitle),g.executeQueryAsync(function(){x.close(),Audit.Common.Utilities.Refresh()});break}else x.close(),Audit.Common.Utilities.Refresh()}function M(){x.close()}var se={responseTitle:c};g.executeQueryAsync(Function.createDelegate(se,te),Function.createDelegate(se,M))},R=function(b,w){x.close(),alert("Request failed. "+w.get_message()+`
`+w.get_stackTrace())};x=SP.UI.ModalDialog.showWaitScreenWithNoClose("Rejecting Response Document","Please wait... Rejecting Response Document",200,400);var a=SP.ClientContext.get_current(),l=a.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());let p=l.getItemById(C);a.load(p),a.executeQueryAsync(S,R)}else T=!1}function wt(t,n){if(t===SP.UI.DialogResult.OK){let w=function(F,P){var D=null,e=null;if(e=Ge($("#ddlResponsesOpen").val()),e==null||e.request==null)return;D=e.request;let s=D.number;Ve(D.number),ye();var o=D.number,c=e.title;xe=0,De=0;for(var u=0;u<e.responseDocs.length;u++){let se=function(){if(this.responseTitle==null||this.responseTitle==null||this.responseTitle==""){document.body.style.cursor="default",G=SP.UI.Notify.addNotification("Error: empty response title ",!1),x.close();return}var j=SP.ClientContext.get_current(),ie=this.newFile.get_listItemAllFields().get_id(),ne=j.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocsEA());let ce=ne.getItemById(ie);ce.set_item("RequestNumber",this.requestId),ce.set_item("ResponseID",this.responseNumber),ce.update();var ae=j.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetListTitleResponses()),re=new SP.CamlQuery;re.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="Title"/><Value Type="Text">'+this.responseTitle+"</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>");let Ce=ae.getItems(re);j.load(Ce);var Le=Audit.Common.Utilities.GetSiteUrl()+"/"+Audit.Common.Utilities.GetLibNameResponseDocs()+"/"+this.responseTitle,we=j.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs()),ve=new SP.CamlQuery;ve.set_viewXml('<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><And><Eq><FieldRef Name="FSObjType"/><Value Type="Text">0</Value></Eq><Eq><FieldRef Name="FileDirRef"/><Value Type="Text">'+Le+"</Value></Eq></And></Where></Query></View>");let Re=we.getItems(ve);j.load(Re);var Te=j.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory()),qe=new SP.CamlQuery;qe.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>');let $e=Te.getItems(qe);j.load($e,"Include(ID, FSObjType, Title, DisplayName)");function xt(){if(De++,De!=xe)return;G=SP.UI.Notify.addNotification("Approved Response Documents",!1);let Ie=!0;for(var ke=this.aresponseDocItems.getEnumerator(),Qe=!1;ke.moveNext();){var _e=ke.get_current(),Se=_e.get_item("DocumentStatus");Se=="Open"||Se=="Submitted"||Se=="Sent to QA"?Ie=!1:Se=="Rejected"&&(Qe=!0)}if(Ie)for(var Fe=ue(this.responseTitle),he=this.aresponseItems.getEnumerator();he.moveNext();){var oe=he.get_current();if(Qe)oe.set_item("ResStatus","5-Returned to GFS"),de(this.emailList,Fe,this.responseTitle,"An Audit Response has been Returned by the Quality Assurance Team: "+this.responseTitle);else{var pe=new Date;oe.set_item("ResStatus","7-Closed");var Gt=new Date(pe.getFullYear(),pe.getMonth(),pe.getDate(),pe.getHours(),pe.getMinutes(),pe.getSeconds(),pe.getMilliseconds());oe.set_item("ClosedDate",Gt),oe.set_item("ClosedBy",_spPageContextInfo.userId),de(this.emailList,Fe,this.responseTitle,"An Audit Response has been Closed by the Quality Assurance Team: "+this.responseTitle)}oe.update(),j.executeQueryAsync(function(){x.close(),Audit.Common.Utilities.Refresh()});break}else x.close(),Audit.Common.Utilities.Refresh()}function Me(){x.close()}var Ae={responseTitle:this.responseTitle,emailList:Te,aresponseItems:Ce,aresponseDocItems:Re,emailListFolderItems:$e};j.executeQueryAsync(Function.createDelegate(Ae,xt),Function.createDelegate(Ae,Me))},z=function(j,ie){x.close(),G=SP.UI.Notify.addNotification("Request failed. "+ie.get_message()+`
`+ie.get_stackTrace(),!1),alert("Request failed. "+ie.get_message()+`
`+ie.get_stackTrace()),Audit.Common.Utilities.Refresh()};if(e.responseDocs[u].documentStatus!="Sent to QA")continue;xe++;var v=new SP.ClientContext.get_current,h=v.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());let B=e.responseDocs[u].item,te=B.get_item("FileLeafRef");B=h.getItemById(B.get_item("ID"));var I=B.get_file(),N=location.protocol+"//"+location.host+_spPageContextInfo.webServerRelativeUrl+"/",U=N+Audit.Common.Utilities.GetLibTitleResponseDocsEA()+"/"+s+"/"+te;I.copyTo(U,1),B.set_item("DocumentStatus","Approved"),B.set_item("RejectReason",""),B.update();var L=location.protocol+"//"+location.host,q=U.replace(L,"");let M=v.get_web().getFileByServerRelativeUrl(q);v.load(M,"ListItemAllFields");var W={responseTitle:c,copiedFileName:U,requestId:o,responseNumber:c,newFile:M};v.executeQueryAsync(Function.createDelegate(W,se),Function.createDelegate(W,z))}},g=function(F,P){x.close(),alert("Request failed. "+P.get_message()+`
`+P.get_stackTrace())};x=SP.UI.ModalDialog.showWaitScreenWithNoClose("Approving Response Documents","Please wait... Approving Response Documents",200,400);var a=$("#ddlResponsesOpen").val(),l=SP.ClientContext.get_current(),p=l.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocsEA()),S=new SP.CamlQuery;S.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>'),X=p.getItems(S),l.load(X,"Include(ID, FSObjType, Title, DisplayName)");var R=l.get_web().get_lists().getByTitle("AuditEAEmailLog"),b=new SP.CamlQuery;b.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="Created"/><Value IncludeTimeValue="FALSE" Type="DateTime"><Today/></Value></Eq></Where></Query></View>'),le=R.getItems(b),l.load(le,"Include(ID)"),l.executeQueryAsync(w,g)}else T=!1}function Rt(){St("#btnPrint1","#divStatusReportRespones","QA Response Status Report"),Ct(".export1","QAResponseStatusReport_","tblStatusReportResponses")}function St(t,n,a){$(t).on("click",function(){Audit.Common.Utilities.PrintStatusReport(a,n)})}function Ct(t,n,a){$(t).on("click",function(l){var p=new Date().format("yyyyMMdd_hhmmtt");Audit.Common.Utilities.ExportToCsv(n+p,a)})}function Tt(t){if(k.tabs.selectTab(k.tabOpts.ResponseDetail),t){t=f["response-"+t];var n=t.request.status,a=t.resStatus;(a=="4-Approved for QA"||a=="6-Reposted After Rejection")&&(n=="Open"||n=="ReOpened")?k.filterResponseInfoTabResponseNameOpen2(t.title):k.filterResponseInfoTabResponseNameProcessed2(t.title)}}var _t={Load:Ue,IsTransactionExecuting:function(){return T},GoToResponse:Tt,GetCancelReason:function(){return _=$("#txtRejectReason").val(),$.trim(_)==""?$("#btnClientOk1").attr("disabled","disabled"):$("#btnClientOk1").removeAttr("disabled"),_}};return _t};})();
//# sourceMappingURL=qa_db.js.map
