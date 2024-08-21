import { html } from "../../sal/infrastructure/index.js";

export const bulkAddResponseTemplate = html`
  <div id="bulkAddResponse" class="audit">
    <button
      class="btn btn-warn"
      type="button"
      data-bind="click: clickUploadResponses"
    >
      Add/Modify Responses
    </button>
    <div id="divBulkResponses" data-bind="if: bulkResponseItems">
      <table id="tblBulkResponses" class="tablesorter report">
        <thead>
          <tr>
            <th>Sample Number</th>
            <th>Comments</th>
            <th>POC</th>
            <th>POCCC</th>
            <th>Action Office</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody data-bind="foreach: bulkResponseItems">
          <tr class="bulk-item" data-bind="class: status">
            <td data-bind="text: bulkResponse.SampleNumber.toString"></td>
            <td data-bind="text: bulkResponse.Comments.toString"></td>
            <td data-bind="text: bulkResponse.POC.toString"></td>
            <td data-bind="text: bulkResponse.POCCC.toString"></td>
            <td data-bind="text: bulkResponse.ActionOffice.toString"></td>
            <td data-bind="text: message"></td>
          </tr>
        </tbody>
        <tfoot class="footer">
          <tr>
            <th colspan="6">
              Total: <span data-bind="text: bulkResponseItems().length"></span>
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
    <div class="">
      <button
        class="btn btn-success"
        type="button"
        data-bind="click: clickSubmitResponses, enable: bulkResponseItems().length"
        title="Click here to Create the Responses"
      >
        Create Responses
      </button>
    </div>
  </div>
  <style>
    #bulkAddResponse button {
      margin-bottom: 10px;
    }
    div#divBulkResponses {
      margin: 10px;
    }

    tr.bulk-item.pending td {
      color: white !important;
    }
    tr.bulk-item.pending {
      color: white !important;
      background-color: var(--warn-color);
    }

    tr.bulk-item.succeeded td {
      color: white !important;
    }
    tr.bulk-item.succeeded {
      color: white !important;
      background-color: var(--success-color);
    }

    tr.bulk-item.failed td {
      color: white !important;
    }
    tr.bulk-item.failed {
      color: white !important;
      background-color: var(--danger-color);
    }
  </style>
`;
