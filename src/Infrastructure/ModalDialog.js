const dialogElementId = "dlgModalDialog";
const dlgElement = document.getElementById(dialogElementId);

export const currentDialog = ko.observable();

export function showModalDialog(dialogOptions) {
  const newDialog = new ModalDialog(dialogOptions);
  currentDialog(newDialog);
  dlgElement.showModal();
}

class ModalDialog {
  constructor(dialogOpts) {
    this.title = dialogOpts.title;
    this.dialogReturnValueCallback = dialogOpts.dialogReturnValueCallback;

    this.form = dialogOpts.form;

    if (this.form?.onComplete) {
      alert("Pass the form onComplete to the modal dialog!");
      return;
    }
    this.form.onComplete = this.close.bind(this);
  }

  close(result) {
    dlgElement.close();
    if (this.dialogReturnValueCallback) this.dialogReturnValueCallback(result);
  }
}
