import { html } from "../../sal/infrastructure/index.js";

export const requestDetailResponseDocsTabTemplate = html`
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
