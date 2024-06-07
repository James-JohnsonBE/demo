import { AuditResponse } from "./index.js";

export class AuditBulkResponse extends AuditResponse {
  constructor(params) {
    super(params);
  }

  static ListDef = {
    name: "AuditBulkResponses",
    title: "AuditBulkResponses",
  };
}
