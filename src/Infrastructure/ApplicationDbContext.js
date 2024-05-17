import { AuditOrganization } from "../entities/AuditOrganization.js";
import { AuditRequest } from "../entities/AuditRequest.js";
import { AuditBulkRequest } from "../entities/AuditBulkRequest.js";
import { AuditEmail } from "../entities/AuditEmail.js";
import { AuditRequestsInternal } from "../entities/AuditRequestsInternal.js";
import { AuditResponse } from "../entities/AuditResponse.js";
import { AuditResponseDoc } from "../entities/AuditResponseDocs.js";
import { AuditCoversheet } from "../entities/AuditCoversheet.js";
import { AuditConfiguration } from "../entities/Config.js";
import { EntitySet } from "../common/ORM.js";

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
