import ConstrainedEntity from "../primitives/ConstrainedEntity.js";

export class AuditEmail extends ConstrainedEntity {
  constructor(params) {
    super(params);
  }

  static Views = {
    All: ["ID", "Title", "To", "Body", "NotificationType", "ReqNum", "ResID"],
  };
  static ListDef = {
    name: "AuditEmails",
    title: "AuditEmails",
  };
}
