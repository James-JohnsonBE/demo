import { ORGTYPES } from "../entities/index.js";
export const configurationsStore = {};

export const auditOrganizationStore = ko.observableArray();

export const allActionOfficesFilter = (org) =>
  ![ORGTYPES.INTERNAL, ORGTYPES.REQUESTINGOFFICE].includes(org.Org_Type);

export const allRequestingOfficesFilter = (org) =>
  ORGTYPES.REQUESTINGOFFICE == org.Org_Type;
