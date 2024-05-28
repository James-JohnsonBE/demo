import { ConstrainedEntity } from "../sal/primitives/constrained_entity.js";

export const ORGTYPES = {
  BUREAU: "Bureau",
  EXTERNAL: "External",
  INTERNAL: "Internal",
  POST: "Post",
  REQUESTINGOFFICE: "Requesting Office",
};
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
