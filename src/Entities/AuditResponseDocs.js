import ConstrainedEntity from "../primitives/ConstrainedEntity.js";
import LookupField from "../fields/LookupField.js";
import TextField from "../fields/TextField.js";
import DateField from "../fields/DateField.js";
import SelectField from "../fields/SelectField.js";
import TextAreaField from "../fields/TextAreaField.js";
import { AuditResponse } from "./AuditResponse.js";
import { AuditRequest } from "./AuditRequest.js";

export class AuditResponseDoc extends ConstrainedEntity {
  constructor(params) {
    super(params);
  }

  Title = new TextField({
    displayName: "Name",
  });

  ReceiptDate = new DateField({
    displayName: "Receipt Date",
    type: dateFieldTypes.date,
  });

  DocumentStatus = new SelectField({
    displayName: "Document Status",
    options: [
      "Open",
      "Submitted",
      "Sent to QA",
      "Approved",
      "Rejected",
      "Archived",
      "Marked for Deletion",
    ],
  });

  RejectReason = TextAreaField({
    displayName: "Reject Reason",
  });

  ReqNum = new LookupField({
    displayName: "Request Number",
    type: AuditRequest,
  });

  ResID = new LookupField({
    displayName: "Response ID",
    type: AuditResponse,
  });

  static Views = {
    All: [
      "ID",
      "Title",
      "ReceiptDate",
      "DocumentStatus",
      "RejectReason",
      "ReqNum",
      "ResID",
    ],
  };

  static ListDef = {
    name: "AuditResponseDocs",
    title: "AuditResponseDocs",
    isLib: true,
  };
}
