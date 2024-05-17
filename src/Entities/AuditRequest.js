import { AuditOrganization } from "../entities/AuditOrganization.js";
import LookupField from "../fields/LookupField.js";
import PeopleField from "../fields/PeopleField.js";
import TextField from "../fields/TextField.js";
import DateField, { dateFieldTypes } from "../fields/DateField.js";
import SelectField from "../fields/SelectField.js";
import CheckboxField from "../fields/CheckboxField.js";
import TextAreaField from "../fields/TextAreaField.js";
import ConstrainedEntity from "../primitives/ConstrainedEntity.js";
import BaseField from "../fields/BaseField.js";

import { ValidationError } from "../primitives/ValidationError.js";
import { auditOrganizationStore } from "../infrastructure/Store.js";
// import { appContext } from "../infrastructure/ApplicationDbContext.js";

export const AUDITREQUESTSTATES = {
  OPEN: "Open",
  CANCELLED: "Canceled",
  CLOSED: "Closed",
  REOPENED: "ReOpened",
};

export class AuditRequest extends ConstrainedEntity {
  constructor(params) {
    super(params);

    this.InternalDueDate.addFieldRequirement({
      requirement: ko.pureComputed(() => {
        return this.InternalDueDate.Value() > this.ReqDueDate.Value();
      }),
      error: new ValidationError(
        "text-field",
        "required-field",
        "The Internal Due Date must be before the Request Due Date!"
      ),
    });
  }

  ReqNum = new TextField({
    displayName: "Request Number",
    systemName: "Title",
    isRequired: true,
  });

  ReqSubject = new TextField({
    displayName: "Request Subject",
    isRequired: true,
  });

  FiscalYear = new TextField({
    displayName: "Fiscal Year",
    isRequired: true,
  });

  InternalDueDate = new DateField({
    displayName: "Internal Due Date",
    type: dateFieldTypes.date,
    isRequired: true,
  });

  ReqDueDate = new DateField({
    displayName: "Request Due Date",
    type: dateFieldTypes.date,
    isRequired: true,
  });

  ReqStatus = new SelectField({
    displayName: "Request Status",
    options: Object.values(AUDITREQUESTSTATES),
    isRequired: true,
  });

  IsSample = new CheckboxField({
    displayName: "Is Sample?",
  });

  ReceiptDate = new DateField({
    displayName: "Receipt Date",
    type: dateFieldTypes.date,
    isRequired: false,
  });

  RelatedAudit = new TextField({
    displayName: "Related Audit",
    isRequired: false,
    instructions:
      "The Audit Request number of the similar audit performed in the previous FY",
  });

  ActionItems = new TextAreaField({
    displayName: "Action Items",
    instructions: "Items that have been requested by the Auditor",
  });

  Comments = new TextAreaField({
    displayName: "Comments",
  });

  Reminders = new SelectField({
    displayName: "Reminders",
    options: [
      "3 Days Before Due",
      "1 Day Before Due",
      "1 Day Past Due",
      "3 Days Past Due",
      "7 Days Past Due",
    ],
    multiple: true,
  });

  EmailSent = new CheckboxField({
    displayName: "Email has been sent",
  });

  Sensitivity = new SelectField({
    displayName: "Sensitivity",
    options: ["None", "Official", "SBU", "PII_SBU"],
  });

  ActionOffice = new LookupField({
    displayName: "Action Offices",
    type: AuditOrganization,
    options: auditOrganizationStore,
    lookupCol: "Title",
    multiple: true,
  });

  EmailActionOffice = new LookupField({
    displayName: "Email Action Offices",
    type: AuditOrganization,
    options: auditOrganizationStore,
    lookupCol: "Title",
    multiple: true,
  });

  ClosedDate = new DateField({
    displayName: "Closed Date",
    isRequired: false,
  });

  ClosedBy = new PeopleField({
    displayName: "Closed By",
    isRequired: false,
  });

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
    IACanUpdate: [
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
      "EmailActionOffice",
      "ClosedBy",
      "ClosedDate",
    ],
  };

  static ListDef = {
    name: "AuditRequests",
    title: "AuditRequests",
  };
}
