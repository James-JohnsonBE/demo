import ConstrainedEntity from "../primitives/constrained_entity.js";
import LookupField from "../fields/lookup_field.js";
import TextField from "../fields/text_field.js";
import DateField, { dateFieldTypes } from "../fields/date_field.js";
import SelectField from "../fields/select_field.js";
import TextAreaField from "../fields/text_area_field.js";
import { AuditResponse } from "./audit_response.js";
import { AuditRequest } from "./audit_request.js";
import PeopleField from "../fields/people_field.js";

export const AuditResponseDocStates = {
  Open: "Open",
  Submitted: "Submitted",
  SentToQA: "Sent to QA",
  Approved: "Approved",
  Rejected: "Rejected",
  Archived: "Archived",
  MarkedForDeletion: "Marked for Deletion",
};

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
    options: Object.values(AuditResponseDocStates),
  });

  RejectReason = new TextAreaField({
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

  FileName = new TextField({
    displayName: "Name",
    systemName: "FileLeafRef",
  });

  FileRef = new TextField({
    displayName: "File Link",
    systemName: "FileRef",
  });

  Modified = new DateField({
    displayName: "Modified",
    type: dateFieldTypes.datetime,
  });

  Editor = new PeopleField({
    displayName: "Modified By",
  });

  Created = new DateField({
    displayName: "Created",
    type: dateFieldTypes.datetime,
  });

  FileSizeDisplay = new TextField({
    displayName: "File",
  });

  File_x0020_Type = new TextField({
    displayName: "File Type",
    systemName: "File_x0020_Type",
  });

  CheckoutUser = new PeopleField({
    displayName: "Checked Out To",
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
      "FileLeafRef",
      "FileRef",
      "FileSizeDisplay",
      "File_x0020_Type",
      "CheckoutUser",
      "Modified",
      "Editor",
      "Created",
    ],
    EditForm: [
      "FileLeafRef",
      "Title",
      "ReceiptDate",
      "DocumentStatus",
      "RejectReason",
      "ReqNum",
      "ResID",
    ],
    AOCanUpdate: [
      "Title",
      "ReceiptDate",
      "DocumentStatus",
      "RejectReason",
      "FileLeafRef",
    ],
    UpdateDocStatus: ["Title", "FileLeafRef", "DocumentStatus"],
  };

  static ListDef = {
    name: "AuditResponseDocs",
    title: "AuditResponseDocs",
    isLib: true,
  };
}
