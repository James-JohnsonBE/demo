import { ConstrainedEntity } from "../sal/primitives/index.js";

export class AuditConfiguration extends ConstrainedEntity {
  constructor(params) {
    super(params);
  }

  key;
  value;

  FieldMap = {
    Title: {
      get: () => this.key,
      set: (val) => (this.key = val),
    },
    Value: {
      get: () => this.value,
      set: (val) => (this.value = val),
    },
  };
  static Views = {
    All: ["ID", "Title", "Value"],
  };

  static ListDef = {
    name: "Config",
    title: "Config",
  };
}
