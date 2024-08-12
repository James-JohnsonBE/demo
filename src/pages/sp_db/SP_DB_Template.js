const html = String.raw;

export const spDbTemplate = html`
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
