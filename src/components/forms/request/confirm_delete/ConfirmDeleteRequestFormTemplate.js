import { html } from "../../../../sal/infrastructure/index.js";

export const confirmDeleteRequestFormTemplate = html`
  <div id="deleteRequestDlg" class="audit-form bg-dark">
    <div>
      Are you sure you would like to
      <span class="text-danger fw-bold">Delete</span> the Request and associated
      files?
      <ul>
        <li class="text-danger fw-bold" data-bind="text: request.number"></li>
      </ul>
    </div>

    <div class="form-actions">
      <button
        type="button"
        class="btn btn-danger"
        value="Delete Request"
        data-bind="click: clickSubmit, enable: !saving()"
      >
        Yes, Delete Request
      </button>
    </div>
  </div>
`;
