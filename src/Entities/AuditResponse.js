import TextField from "../fields/TextField.js";
import TextAreaField from "../fields/TextAreaField.js";
import SelectField from "../fields/SelectField.js";
import ConstrainedEntity from "../primitives/ConstrainedEntity.js";
import DateField, { dateFieldTypes } from "../fields/DateField.js";
import PeopleField from "../fields/PeopleField.js";
import LookupField from "../fields/LookupField.js";
import BlobField from "../fields/BlobField.js";
import { AuditRequest } from "./AuditRequest.js";
import { AuditOrganization } from "./AuditOrganization.js";

import { ActiveViewer } from "../valueObjects/ActiveViewer.js";
import { ActiveViewersComponent } from "../components/ActiveViewers/ActiveViewersModule.js";

export const responseStates = {
  ApprovedForQA: "4-Approved for QA",
};

export class AuditResponse extends ConstrainedEntity {
  constructor(params) {
    super(params);
  }

  Title = new TextField({
    displayName: "Name",
  });

  SampleNumber = new TextField({
    displayName: "Sample Number",
  });

  ResStatus = new SelectField({
    displayName: "Response Status",
    options: [
      "1-Open",
      "2-Submitted",
      "3-Returned to Action Office",
      "4-Approved for QA",
      "5-Returned to GFS",
      "6-Reposted After Rejection",
      "7-Closed",
    ],
  });

  ReturnReason = new SelectField({
    displayName: "Return Reason",
    options: ["Incomplete Document", "Incorrect POC"],
  });

  Comments = new TextAreaField({
    displayName: "Comments",
  });

  ClosedDate = new DateField({
    displayName: "Closed Date",
    type: dateFieldTypes.date,
  });

  ClosedBy = new PeopleField({
    displayName: "Closed By",
  });

  POC = new PeopleField({
    displayName: "POC",
  });

  POCCC = new PeopleField({
    displayName: "POCCC",
  });

  ReqNum = new LookupField({
    displayName: "Request Number",
    type: AuditRequest,
  });

  ActionOffice = new LookupField({
    displayName: "Action Office",
    type: AuditOrganization,
  });

  ActiveViewers = new BlobField({
    displayName: "Active Viewers",
    entityType: ActiveViewer,
    multiple: true,
  });

  activeViewersComponent = new ActiveViewersComponent({
    entity: this,
    fieldName: "ActiveViewers",
  });

  static Views = {
    All: [
      "ID",
      "Title",
      "SampleNumber",
      "ResStatus",
      "ReturnReason",
      "Comments",
      "ClosedDate",
      "ClosedBy",
      "POC",
      "POCCC",
      "ReqNum",
      "ActionOffice",
      "ActiveViewers",
    ],
  };

  static ListDef = {
    name: "AuditResponses",
    title: "AuditResponses",
  };
}
