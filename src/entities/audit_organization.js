import ConstrainedEntity from "../primitives/constrained_entity.js";

export class AuditOrganization extends ConstrainedEntity {
  constructor(params) {
    super(params);
  }

  static Views = {
    All: [
      "ID",
      "Title",
      "Country",
      "Organization_x0020_Description",
      "EmailGroup",
      "Org_Type",
      "Post_x0020_Code",
      "UserGroup",
    ],
  };

  static ListDef = {
    name: "AuditOrganizations",
    title: "AuditOrganizations",
  };
}
