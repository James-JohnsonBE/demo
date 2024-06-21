import { html } from "../../../../sal/infrastructure/index.js";

export const confirmApproveResponseDocFormTemplate = html`
  <div id="approveResponseDocDlg" class="audit-form bg-dark">
    <div>
      Are you sure you would like to
      <span class="fw-bold success">Approve</span> the Response Document(s)?
      <ul>
        <!-- ko foreach: responseDocs -->
        <li class="fw-bold success" data-bind="text: fileName"></li>
        <!-- /ko -->
      </ul>
    </div>
    <div class="form-actions">
      <button
        type="button"
        class="btn btn-success"
        data-bind="click: clickSubmit, text: sendToText, 
      attr: {title: sendToText}"
      ></button>
    </div>
  </div>
`;
