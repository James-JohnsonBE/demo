import { AuditOrganization } from "../entities/audit_organization.js";
import { AuditRequest } from "../entities/audit_request.js";
import { AuditBulkRequest } from "../entities/audit_bulk_request.js";
import { AuditEmail } from "../entities/audit_email.js";
import { AuditRequestsInternal } from "../entities/audit_request_internal.js";
import { AuditResponse } from "../entities/audit_response.js";
import { AuditResponseDoc } from "../entities/audit_response_doc.js";
import { AuditCoversheet } from "../entities/audit_coversheet.js";
import { AuditConfiguration } from "../entities/config.js";
import { EntitySet } from "../common/orm.js";

const DEBUG = false;

export class ApplicationDbContext {
  constructor() {}

  AuditBulkRequests = new EntitySet(AuditBulkRequest);

  AuditConfigurations = new EntitySet(AuditConfiguration);

  AuditCoversheets = new EntitySet(AuditCoversheet);

  AuditEmails = new EntitySet(AuditEmail);

  AuditOrganizations = new EntitySet(AuditOrganization);

  AuditResponses = new EntitySet(AuditResponse);

  AuditResponseDocs = new EntitySet(AuditResponseDoc);

  AuditRequests = new EntitySet(AuditRequest);

  AuditRequestsInternals = new EntitySet(AuditRequestsInternal);

  virtualSets = new Map();

  Set = (entityType) => {
    const key = entityType.ListDef.name;

    // If we have a defined entityset, return that
    const set = Object.values(this)
      .filter((val) => val.constructor.name == EntitySet.name)
      .find((set) => set.ListDef?.name == key);
    if (set) return set;

    if (!this.virtualSets.has(key)) {
      const newSet = new EntitySet(listDef);
      this.virtualSets.set(key, newSet);
      return newSet;
    }
    return this.virtualSets.get(key);
  };
}

export const appContext = new ApplicationDbContext();
