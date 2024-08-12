import { html } from "../../sal/infrastructure/index.js";

export const requestDetailCoversheetsTabTemplate = html`
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
