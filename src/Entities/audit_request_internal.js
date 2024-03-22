import LookupField from "../fields/lookup_field.js";
import BlobField from "../fields/blob_field.js";
import ConstrainedEntity from "../primitives/constrained_entity.js";
import { AuditRequest } from "./audit_request.js";
import { Comment } from "../value_objects/comment.js";
import { ActiveViewer } from "../value_objects/active_viewer.js";

import { ActiveViewersComponent } from "../components/active_viewers/active_viewers_module.js";
import { CommentChainComponent } from "../components/comment_chain/comment_chain_module.js";

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

  commentChainComponent = new CommentChainComponent({
    entity: this,
    fieldName: "InternalStatus",
  });

  activeViewersComponent = new ActiveViewersComponent({
    entity: this,
    fieldName: "ActiveViewers",
  });

  static Views = {
    All: ["ID", "ActiveViewers", "InternalStatus", "ReqNum"],
  };

  static ListDef = {
    title: "AuditRequestsInternal",
    name: "AuditRequestsInternal",
  };
}
