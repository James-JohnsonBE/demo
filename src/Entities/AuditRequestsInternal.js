import LookupField from "../fields/LookupField.js";
import BlobField from "../fields/BlobField.js";
import ConstrainedEntity from "../primitives/ConstrainedEntity.js";
import { AuditRequest } from "./AuditRequest.js";
import { Comment } from "../valueObjects/Comment.js";
import { ActiveViewer } from "../valueObjects/ActiveViewer.js";

export class AuditRequestsInternal extends ConstrainedEntity {
  constructor(params) {
    super(params);
  }

  ActiveViewers = new BlobField({
    displayName: "Active Viewers",
    entityType: ActiveViewer,
    multiple: true,
  });

  InternalStatus = new BlobField({
    displayName: "Internal Status",
    entityType: Comment,
    multiple: true,
  });

  ReqNum = new LookupField({
    displayName: "Request",
    type: AuditRequest,
    lookupCol: "Title",
  });

  FieldMap = {
    ...this.FieldMap,
    ReqNum: this.ReqNum,
    ActiveViewers: this.ActiveViewers,
    InternalStatus: this.InternalStatus,
  };
  static Views = {
    All: ["ID", "ActiveViewers", "InternalStatus", "ReqNum"],
  };

  static ListDef = {
    title: "AuditRequestsInternal",
    name: "AuditRequestsInternal",
  };
}
