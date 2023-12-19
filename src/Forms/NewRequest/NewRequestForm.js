import { AuditOrganizations } from "../../Entities/AuditOrganizations.js";
import TextField from "../../Fields/TextField.js";
import DateField from "../../Fields/DateField.js";
import SelectField from "../../Fields/SelectField.js";
import CheckboxField from "../../Fields/CheckboxField.js";
import TextAreaField from "../../Fields/TextAreaField.js";
import BaseForm from "../BaseForm.js";

export default class NewRequestForm extends BaseForm {
  constructor(params) {
    super(params);
  }

  fieldMap = {
    ...this.fieldMap,
    Title: new TextField({
      displayName: "Request Number",
      isRequired: true,
    }),
    ReqSubject: new TextField({
      displayName: "Request Subject",
      isRequired: true,
    }),
    FiscalYear: new SelectField({
      displayName: "Fiscal Year",
      options: ["2024", "2025"],
      isRequired: true,
    }),
    InternalDueDate: new DateField({
      displayName: "Internal Due Date",
      type: dateFieldTypes.date,
      isRequired: true,
    }),
    ReqDueDate: new DateField({
      displayName: "Request Due Date",
      type: dateFieldTypes.date,
      isRequired: true,
    }),
    IsSample: new CheckboxField({
      displayName: "Is Sample",
    }),
    ReceiptDate: new DateField({
      displayName: "Receipt Date",
      type: dateFieldTypes.date,
      isRequired: false,
    }),
    MemoDate: new DateField({
      displayName: "Memo Date",
      type: dateFieldTypes.date,
      isRequired: false,
    }),
    RelatedAudit: new TextField({
      displayName: "Related Audit",
      isRequired: false,
      instructions:
        "The Audit Request number of the similar audit performed in the previous FY",
    }),
    ActionItems: new TextAreaField({
      displayName: "Action Items",
      instructions: "Items that have been requested by the Auditor",
    }),
    Comments: new TextAreaField({
      displayName: "Comments",
    }),
    Reminders: new SelectField({
      displayName: "Reminders",
      options: [
        "3 Days Before Due",
        "1 Day Before Due",
        "1 Day Past Due",
        "3 Days Past Due",
        "7 Days Past Due",
      ],
    }),
    Sensitivity: new SelectField({
      displayName: "Sensitivity",
      options: ["Official", "SBU", "PII_SBU"],
    }),
    // ActionOffice: new LookupField({
    //     displayName: "Action Offices",
    //     type: AuditOrganizations,
    //     lookupCol: "Title",
    //     multiple: true
    // })
  };
}
