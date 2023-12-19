import BaseFieldModule from "../BaseFieldModule.js";

export default class TextAreaModule extends BaseFieldModule {
  constructor(params) {
    super(params);
  }

  childrenHaveLoaded = (nodes) => {
    this.initializeEditor();
  };

  getToolbarId = () => "toolbar-" + this.getUniqueId();

  initializeEditor() {
    const toolbarOptions = [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction

      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ["clean"], // remove formatting button
    ];

    // debugger;
    var editor = new Quill("#" + this.getUniqueId(), {
      modules: { toolbar: toolbarOptions },
      theme: "snow",
    });

    const Value = this.Value;

    Value.subscribe((val) => {
      if (val == "") {
        editor.setText("");
      }
    });

    editor.on("text-change", function (delta, oldDelta, source) {
      Value(editor.root.textContent ? editor.root.innerHTML : "");
    });
  }
}
