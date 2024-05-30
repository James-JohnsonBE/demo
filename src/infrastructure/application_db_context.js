import {
  AuditOrganization,
  AuditRequest,
  AuditBulkRequest,
  AuditEmail,
  AuditRequestsInternal,
  AuditResponse,
  AuditResponseDoc,
  AuditCoversheet,
  AuditConfiguration,
  AuditResponseDocRO,
  AuditROEmailLog,
} from "../entities/index.js";
import { EntitySet, DbContext } from "../sal/index.js";

const DEBUG = false;

export class ApplicationDbContext extends DbContext {
  constructor() {
    super();
  }

  AuditBulkRequests = new EntitySet(AuditBulkRequest);

  AuditConfigurations = new EntitySet(AuditConfiguration);

  AuditCoversheets = new EntitySet(AuditCoversheet);

  AuditEmails = new EntitySet(AuditEmail);

  AuditOrganizations = new EntitySet(AuditOrganization);

  AuditResponses = new EntitySet(AuditResponse);

  AuditResponseDocs = new EntitySet(AuditResponseDoc);

  AuditResponseDocsRO = new EntitySet(AuditResponseDocRO);

  AuditRequests = new EntitySet(AuditRequest);

  AuditRequestsInternals = new EntitySet(AuditRequestsInternal);

  AuditROEmailsLog = new EntitySet(AuditROEmailLog);
}

export const appContext = new ApplicationDbContext();
