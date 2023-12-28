import { AuditRequest } from "./AuditRequest.js";
// import { appContext } from "../infrastructure/ApplicationDbContext.js";

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
      "MemoDate",
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
      "MemoDate",
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
