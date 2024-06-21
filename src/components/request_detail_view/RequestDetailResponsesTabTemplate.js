import { html } from "../../sal/infrastructure/index.js";

export const requestDetailResponsesTabTemplate = html`
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
