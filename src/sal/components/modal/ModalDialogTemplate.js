import { html } from "../../infrastructure";

export const modalDialogTemplate = html`
  <dialog id="dlgModalDialog" class="card bg-dark draggable" data-bind="">
    <!-- Can't use 'with: currentDialog' since we need to register our 
      javascript event listeners for grabbing and resizing -->
    <div class="card-header bg-dark grabber">
      <h2 class="card-title" data-bind="text: currentDialog()?.title"></h2>
      <h2 class="card-title">
        <i
          class="fa-solid fa-xmark pointer"
          data-bind="click: currentDialog()?.close"
        ></i>
      </h2>
    </div>
    <!-- ko with: currentDialog -->
    <div class="dimmer" data-bind="css: {'active': form.saving }">
      <span class="loader"></span>
      <ul class="" data-bind="foreach: $root.blockingTasks">
        <li data-bind="text: msg + '...'"></li>
      </ul>
    </div>
    <div
      class="card-body"
      data-bind="component: { name: form.componentName, params: form.params }"
    ></div>
    <div class="card-actions">
      <button
        style
        type="button"
        class="btn btn-danger"
        data-bind="click: clickClose"
      >
        Cancel
      </button>
    </div>
    <!-- /ko -->
  </dialog>
`;
