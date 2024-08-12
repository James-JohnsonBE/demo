import { html } from "../../../../sal/infrastructure/index.js";

export const confirmRejectResponseDocFormTemplate = html`
  <div id="rejectResponseDocDlg" class="audit-form bg-dark">
    <div>
      Are you sure you would like to
      <span class="text-danger fw-bold">Reject</span> the Response Document(s)?
      <ul>
        <!-- ko foreach: responseDocs -->
        <li class="text-danger fw-bold" data-bind="text: fileName"></li>
        <!-- /ko -->
      </ul>
    </div>
    <div class="component field">
      <label class="fw-semibold"
        >If so, please specify the reason<span class="fw-bold text-danger"
          >*</span
        >:
        <textarea
          class="form-control w-full"
          rows="3"
          data-bind="textInput: rejectReason"
        ></textarea>
      </label>
    </div>
    <br />
    <div class="form-actions">
      <button
        type="button"
        class="btn btn-danger"
        value="Reject Documents"
        data-bind="click: clickSubmit, 
      enable: rejectReason"
      >
        Yes, Reject Document
      </button>
    </div>
  </div>
`;
