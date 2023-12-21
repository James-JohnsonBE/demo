import { ConstrainedEntityComponent } from "../components/ConstrainedEntity/ConstrainedEntityModule.js";
import { ConstrainedEntityView } from "./ConstrainedEntityView.js";
import Entity from "./Entity.js";

/**
 * Constrained Entity's are validated based on their declared fields.
 * We are expecting user input, so need to validate each input field.
 */

export default class ConstrainedEntity extends Entity {
  constructor(params) {
    super(params);
  }

  toJSON = () => {
    const out = {};
    Object.keys(this.FieldMap).map(
      (key) => (out[key] = this.FieldMap[key]?.get())
    );
    return out;
  };

  fromJSON(inputObj) {
    if (window.DEBUG)
      console.log("Setting constrained entity from JSON", inputObj);
    Object.keys(inputObj).map((key) => this.FieldMap[key]?.set(inputObj[key]));
  }

  // FormFields = Object.values(this.FieldMap);

  // Validate the entire entity
  validate = (showErrors = true) => {
    Object.values(this.FieldMap).map(
      (field) => field?.validate && field.validate(showErrors)
    );
    return this.Errors();
  };

  Errors = ko.pureComputed(() => {
    return Object.values(this.FieldMap)
      .filter((field) => field?.Errors && field.Errors())
      .flatMap((field) => field.Errors());
  });

  IsValid = ko.pureComputed(() => !this.Errors().length);

  static components = {
    new: (entity, view = null) =>
      new ConstrainedEntityComponent({
        entityView: new ConstrainedEntityView({ entity, view }),
        displayMode: "edit",
      }),
    edit: (entity, view = null) =>
      new ConstrainedEntityComponent({
        entityView: new ConstrainedEntityView({ entity, view }),
        displayMode: "edit",
      }),
    view: (entity, view = null) =>
      new ConstrainedEntityComponent({
        entityView: new ConstrainedEntityView({ entity, view }),
        displayMode: "view",
      }),
  };
}
