const html = String.raw;

export const qaDbTemplate = html`
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
  </script>

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
  </script>

  <div id="divTest"></div>
`;
