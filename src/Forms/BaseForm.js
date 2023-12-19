export default class BaseForm {
  constructor(params) {}

  fieldMap = {};

  toJSON = () => {
    const out = {};
    Object.keys(this.fieldMap).map(
      (key) => (out[key] = this.fieldMap[key]?.get())
    );
    return out;
  };

  fromJSON(inputObj) {
    if (window.DEBUG)
      console.log("Setting constrained entity from JSON", inputObj);
    Object.keys(inputObj).map((key) => this.fieldMap[key]?.set(inputObj[key]));
  }
}
