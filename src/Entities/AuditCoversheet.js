import LookupField from "../fields/LookupField.js";
import ConstrainedEntity from "../primitives/ConstrainedEntity.js";
import { AuditRequest } from "./AuditRequest.js";
import { AuditOrganization } from "./AuditOrganization.js";
import TextField from "../fields/TextField.js";

export class AuditCoversheet extends ConstrainedEntity {
  constructor(params) {
    super(params);
  }

  FileName = new TextField({
    displayName: "Name",
    systemName: "FileLeafRef",
  });

  FileRef = new TextField({
    displayName: "File Link",
    systemName: "FileRef",
  });

  ReqNum = new LookupField({
    displayName: "Request Number",
    type: AuditRequest,
    lookupCol: "Title",
  });

  ActionOffice = new LookupField({
    displayName: "Action Offices",
    type: AuditOrganization,
    lookupCol: "Title",
    multiple: true,
  });

  static Views = {
    All: ["ID", "Title", "FileLeafRef", "FileRef", "ReqNum", "ActionOffice"],
  };

  static ListDef = {
    title: "AuditCoversheets",
    name: "AuditCoversheets",
    isLib: true,
  };
}
