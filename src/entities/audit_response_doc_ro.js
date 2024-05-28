import { ConstrainedEntity } from "../sal/primitives/index.js";

export class AuditResponseDocRO extends ConstrainedEntity {
  constructor(params) {
    super(params);
  }

  static Views = {
    All: [
      "ID",
      "Title",
      "ReqNum",
      "ResID",
      "FiscalYear",
      "RequestingOffice",
      "ReqSubject",
    ],
  };

  static ListDef = {
    name: "AuditResponseDocsRO",
    title: "AuditResponseDocsRO",
  };
}
