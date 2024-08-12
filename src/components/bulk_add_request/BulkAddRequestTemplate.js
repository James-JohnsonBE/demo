import { html } from "../../sal/infrastructure/index.js";

export const bulkAddRequestTemplate = html`
  <div id="bulkAddRequest" class="audit">
    <button
      class="btn btn-warn"
      type="button"
      data-bind="click: clickUploadResponses"
    >
      Add/Modify Requests
    </button>
    <div id="divBulkRequests" data-bind="if: bulkRequestItems">
      <table id="tblBulkRequests" class="tablesorter report">
        <thead>
          <tr>
            <th>Request Number</th>
            <th>Request Subject</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody data-bind="foreach: bulkRequestItems">
          <tr class="bulk-request-item" data-bind="class: status">
            <td data-bind="text: bulkRequest.Title"></td>
            <td data-bind="text: bulkRequest.FieldMap.ReqSubject.toString"></td>
            <td data-bind="text: message"></td>
          </tr>
        </tbody>
        <tfoot class="footer">
          <tr>
            <th colspan="3">
              Total: <span data-bind="text: bulkRequestItems().length"></span>
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
    <div class="">
      <button
        class="btn btn-success"
        type="button"
        data-bind="click: clickSubmitRequests, enable: bulkRequestItems().length"
        title="Click here to Create the Responses"
      >
        Create Requests
      </button>
    </div>
  </div>

  <style>
    #bulkAddRequest button {
      margin-bottom: 10px;
    }
    div#divBulkRequests {
      margin: 10px;
    }

    tr.bulk-request-item {
    }

    tr.bulk-request-item.pending td {
      color: white !important;
    }
    tr.bulk-request-item.pending {
      color: white !important;
      background-color: var(--warn-color);
    }

    tr.bulk-request-item.succeeded td {
      color: white !important;
    }
    tr.bulk-request-item.succeeded {
      color: white !important;
      background-color: var(--success-color);
    }

    tr.bulk-request-item.failed td {
      color: white !important;
    }
    tr.bulk-request-item.failed {
      color: white !important;
      background-color: var(--danger-color);
    }
  </style>
`;
