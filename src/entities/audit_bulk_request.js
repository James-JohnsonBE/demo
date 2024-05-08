import { AuditRequest } from "./audit_request.js";
// import { appContext } from "../infrastructure/application_db_context.js";

export class AuditBulkRequest extends AuditRequest {
  constructor(params) {
    super(params);
  }

  toRequest() {
    const newReq = new AuditRequest(this);

    newReq.fromJSON(this.toJSON());
    return newReq;
  }

  static Views = {
    All: [
      "ID",
      "Title",
      "ReqSubject",
      "FiscalYear",
      "InternalDueDate",
      "ReqDueDate",
      "ReqStatus",
      "IsSample",
      "ReceiptDate",
      "RelatedAudit",
      "ActionItems",
      "Comments",
      "Reminders",
      "EmailSent",
      "Sensitivity",
      "ActionOffice",
      "EmailActionOffice",
      "EmailActionOffice",
      "ClosedDate",
      "ClosedBy",
    ],
    New: [
      "Title",
      "ReqSubject",
      "FiscalYear",
      "InternalDueDate",
      "ReqDueDate",
      "ReqStatus",
      "IsSample",
      "ReceiptDate",
      "RelatedAudit",
      "ActionItems",
      "Comments",
      "Reminders",
      "Sensitivity",
      "ActionOffice",
    ],
  };
  static ListDef = {
    name: "AuditBulkRequests",
    title: "AuditBulkRequests",
  };
}
