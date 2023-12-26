import { AuditOrganization } from "./AuditOrganization.js";
import LookupField from "../fields/LookupField.js";
import PeopleField from "../fields/PeopleField.js";
import TextField from "../fields/TextField.js";
import DateField, { dateFieldTypes } from "../fields/DateField.js";
import SelectField from "../fields/SelectField.js";
import CheckboxField from "../fields/CheckboxField.js";
import TextAreaField from "../fields/TextAreaField.js";
import ConstrainedEntity from "../primitives/ConstrainedEntity.js";
// import { appContext } from "../infrastructure/ApplicationDbContext.js";

export class AuditBulkRequest extends AuditRequest {
  constructor(params) {
    super(params);
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
    name: "AuditBulkRequest",
    title: "AuditBulkRequest",
  };
}
