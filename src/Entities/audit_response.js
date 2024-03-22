import TextField from "../fields/text_field.js";
import TextAreaField from "../fields/text_area_field.js";
import SelectField from "../fields/select_field.js";
import ConstrainedEntity from "../primitives/constrained_entity.js";
import DateField, { dateFieldTypes } from "../fields/date_field.js";
import PeopleField from "../fields/people_field.js";
import LookupField from "../fields/lookup_field.js";
import BlobField from "../fields/blob_field.js";
import { AuditRequest } from "./audit_request.js";
import { AuditOrganization } from "./audit_organization.js";

import { ActiveViewer } from "../value_objects/active_viewer.js";
import { ActiveViewersComponent } from "../components/active_viewers/active_viewers_module.js";

import { auditOrganizationStore } from "../infrastructure/store.js";

// import { appContext } from "../infrastructure/ServiceContainer.js";

export const AuditResponseStates = {
  Open: "1-Open",
  Submitted: "2-Submitted",
  ReturnedToAO: "3-Returned to Action Office",
  ApprovedForQA: "4-Approved for QA",
  ReturnedToGFS: "5-Returned to GFS",
  RepostedAfterRejection: "6-Reposted After Rejection",
  Closed: "7-Closed",
};

export class AuditResponse extends ConstrainedEntity {
  constructor(params) {
    super(params);
  }

  Title = new TextField({
    displayName: "Name",
  });

  ReqNum = new LookupField({
    displayName: "Request Number",
    type: AuditRequest,
  });

  SampleNumber = new TextField({
    displayName: "Sample Number",
    isRequired: true,
  });

  ResStatus = new SelectField({
    displayName: "Response Status",
    options: Object.values(AuditResponseStates),
  });

  ReturnReason = new SelectField({
    displayName: "Return Reason",
    options: ["Incomplete Document", "Incorrect POC"],
  });

  Comments = new TextAreaField({
    displayName: "Comments",
    isRichText: true,
    isMinimalEditor: true,
    classList: ["min-w-full"],
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

  ActionOffice = new LookupField({
    displayName: "Action Office",
    type: AuditOrganization,
    options: auditOrganizationStore,
    optionsFilter: ko.pureComputed(() => {
      // Only allow action offices from this coversheets associated request
      const request = ko.unwrap(this.ReqNum.Value);
      if (!request) return (val) => val;

      const requestActionOffices = ko.unwrap(request.ActionOffice.Value);

      return (opt) => requestActionOffices.includes(opt);
    }),
    lookupCol: "Title",
    isRequired: true,
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

  async uploadResponseDocFile(file) {
    const fileMetadata = {
      Title: file.name,
      ReqNumId: this.ReqNum.Value().ID,
      ResIDId: this.ID,
    };

    const { appContext } = await import(
      "../infrastructure/application_db_context.js"
    );

    return await appContext.AuditResponseDocs.UploadFileToFolderAndUpdateMetadata(
      file,
      file.name,
      this.Title.Value(),
      fileMetadata
    );
  }

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
    NewForm: ["ReqNum", "ActionOffice", "SampleNumber", "Comments"],
    EditForm: [
      "ReqNum",
      "SampleNumber",
      "Title",
      "ActionOffice",
      "ResStatus",
      "ReturnReason",
      "Comments",
      "ClosedDate",
      "ClosedBy",
      "POC",
      "POCCC",
    ],
    IACanUpdate: [
      "Title",
      "ActionOffice",
      "ResStatus",
      "ReturnReason",
      "Comments",
      "ClosedDate",
      "ClosedBy",
      "POC",
      "POCCC",
    ],
  };

  static ListDef = {
    name: "AuditResponses",
    title: "AuditResponses",
  };
}
