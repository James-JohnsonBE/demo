import { ConstrainedEntity } from "../sal/primitives/index.js";

export class AuditROEmailLog extends ConstrainedEntity {
  constructor(params) {
    super(params);
  }

  static Views = {
    All: [
      "ID",
      "Title",
      "RequestingOffice",
      "Responses",
      "ResponseCount",
      "SentEmail",
    ],
  };

  static ListDef = {
    name: "AuditROEmailLog",
    title: "AuditROEmailLog",
  };
}
