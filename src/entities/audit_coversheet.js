import { AuditRequest, AuditOrganization } from "./index.js";
import { auditOrganizationStore } from "../infrastructure/store.js";

import { ConstrainedEntity } from "../sal/primitives/constrained_entity.js";
import { LookupField, TextField } from "../sal/fields/index.js";

import { appContext } from "../infrastructure/application_db_context.js";

export class AuditCoversheet extends ConstrainedEntity {
  constructor(params) {
    super(params);
  }

  Title = new TextField({
    displayName: "Title",
    required: true,
  });

  FileName = new TextField({
    displayName: "Name",
    systemName: "FileLeafRef",
    required: true,
  });

  FileRef = new TextField({
    displayName: "File Link",
    systemName: "FileRef",
  });

  ReqNum = new LookupField({
    displayName: "Request Number",
    type: AuditRequest,
    lookupCol: "Title",
    required: true,
    entitySet: appContext.AuditRequests,
  });

  ActionOffice = new LookupField({
    displayName: "Action Offices",
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
    multiple: true,
    entitySet: appContext.AuditOrganizations,
  });

  static Views = {
    All: ["ID", "Title", "FileLeafRef", "FileRef", "ReqNum", "ActionOffice"],
    AOCanUpdate: ["Title", "FileLeafRef", "ActionOffice"],
  };

  static ListDef = {
    title: "AuditCoversheets",
    name: "AuditCoversheets",
    isLib: true,
  };
}
