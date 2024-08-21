import {
  LookupField,
  PeopleField,
  TextAreaField,
  TextField,
} from "../sal/fields/index.js";
import { ConstrainedEntity } from "../sal/primitives/index.js";
import { AuditResponse } from "./index.js";
import { appContext } from "../infrastructure/application_db_context.js";
import { AuditOrganization } from "./index.js";
import { auditOrganizationStore } from "../infrastructure/store.js";

export class AuditBulkResponse extends AuditResponse {
  constructor(params) {
    super(params);
  }

  // Title = new TextField({
  //   displayName: "Sample Number",
  // });

  // Comments = new TextAreaField({
  //   displayName: "Comments",
  // });

  // POC = new PeopleField({
  //   displayName: "POC",
  // });

  // POCCC = new PeopleField({
  //   displayName: "POCCC",
  // });

  // ActionOffice = new LookupField({
  //   displayName: "Action Office",
  //   type: AuditOrganization,
  //   options: auditOrganizationStore,
  //   entitySet: appContext.AuditOrganizations,
  // });

  toResponse(request) {
    const response = new AuditResponse();
    // response.ReqNum.Value(request);
    // response.SampleNumber.set(this.Title.get());
    // response.Comments.set(this.Comments.get());
    // response.POC.set(this.POC.get());
    // response.POCCC.set(this.POCCC.get());
    // response.ActionOffice.Value(this.ActionOffice.Value());

    response.fromJSON(this.toJSON());
    // response.ReqNum.Value(request);
    return response;
  }

  static Views = {
    All: [
      "ID",
      "Title",
      "SampleNumber",
      "Comments",
      "POC",
      "POCCC",
      "ActionOffice",
    ],
  };

  static ListDef = {
    name: "AuditBulkResponses",
    title: "AuditBulkResponses",
  };
}
