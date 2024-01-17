const dialogElementId = "dlgModalDialog";
const dlgElement = document.getElementById(dialogElementId);
dragElement(dlgElement);

export const currentDialog = ko.observable();

export function showModalDialog(dialogOptions) {
  const newDialog = new ModalDialog(dialogOptions);
  currentDialog(newDialog);
  resizeDialog(dlgElement);
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

function resizeDialog(elmnt) {
  elmnt.style.width = "550px";
  elmnt.style.height = "";
  elmnt.style.top = "125px";
  elmnt.style.left = (window.GetViewportWidth() - 550) / 2 + "px";
}

// TODO: this should be in a utility class or something
function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  // elmnt.style.top = elmnt.style.top

  const dragger = elmnt.querySelector(".grabber");
  if (dragger) {
    // if present, the header is where you move the DIV from:
    dragger.onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
