import { configurationsStore } from "../infrastructure/store.js";
import {
  AuditRequest,
  AUDITREQUESTSTATES,
  getRequestDefaultReminders,
} from "./audit_request.js";
// import { appContext } from "../infrastructure/application_db_context.js";

export class AuditBulkRequest extends AuditRequest {
  constructor(params) {
    super(params);
  }

  toNewRequest() {
    const newReq = new AuditRequest(this);

    newReq.fromJSON(this.toJSON());
    newReq.ReqStatus.Value(AUDITREQUESTSTATES.OPEN);
    const requestDefaultReminders = getRequestDefaultReminders();
    newReq.Reminders.Value(requestDefaultReminders);

    const requestDefaultType = configurationsStore["default-req-type"];

    if (requestDefaultType) newReq.ReqType.Value(requestDefaultType);

    const defaultFy = configurationsStore["current-fy"];

    if (defaultFy) newReq.FiscalYear.Value(defaultFy);

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
      "IsSample",
      "ReceiptDate",
      "RelatedAudit",
      "ActionItems",
      "Comments",
      "Reminders",
      "Sensitivity",
      "ActionOffice",
      "RequestingOffice",
    ],
  };
  static ListDef = {
    name: "AuditBulkRequests",
    title: "AuditBulkRequests",
  };
}
