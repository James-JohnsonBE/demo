import { ORGTYPES } from "../entities/index.js";
import { People } from "../sal/entities/index.js";
import { appContext } from "../infrastructure/application_db_context.js";
import { auditOrganizationStore } from "../infrastructure/store.js";
import { ItemPermissions, Role, RoleDef } from "../sal/infrastructure/index.js";
import { getSiteGroups } from "./people_manager.js";

export const roleNames = {
  FullControl: "Full Control",
  Design: "Design",
  Edit: "Edit",
  Contribute: "Contribute",
  Read: "Read",
  LimitedAccess: "Limited Access",
  RestrictedRead: "Restricted Read",
  RestrictedContribute: "Restricted Contribute",
  InitialCreate: "Initial Create",
};

export function ensureAllAppPerms() {
  ensureAllPagePerms();
  ensureAllListPermissions();
}

function ensureAllPagePerms() {
  const aos = auditOrganizationStore().filter(
    (ao) => ao.Org_Type != ORGTYPES.REQUESTINGOFFICE
  );
  ensurePagePerms("AO_DB.aspx", aos);

  const ros = auditOrganizationStore().filter(
    (ao) => ao.Org_Type == ORGTYPES.REQUESTINGOFFICE
  );
  ensurePagePerms("RO_DB.aspx", ros);

  const qas = auditOrganizationStore().filter(
    (ao) => ao.Org_Type == ORGTYPES.QUALITYASSURANCE
  );
  ensurePagePerms("QA_DB.aspx", qas);

  const sps = auditOrganizationStore().filter(
    (ao) => ao.Org_Type == ORGTYPES.SPECIALPERMISSIONS
  );
  ensurePagePerms("SP_DB.aspx", sps);

  // Reset Other Pages
  [
    "AuditBulkAddResponse.aspx",
    "AuditBulkEditResponse.aspx",
    "AuditPermissions.aspx",
    "AuditReport_RequestsStatus.aspx",
    "AuditReturnedResponses.aspx",
    "AuditUnSubmittedResponseDocuments.aspx",
    "AuditUpdateSiteGroups.aspx",
  ].map((page) => ensurePagePerms(page, []));
}

async function ensurePagePerms(pageTitle, orgs) {
  const pageResults = await appContext.Pages.FindByColumnValue(
    [{ column: "FileLeafRef", value: pageTitle }],
    {},
    { count: 1, includePermissions: true }
  );

  const page = pageResults.results[0] ?? null;

  if (!page) return;

  let reset = false;
  if (!page.HasUniqueRoleAssignments) {
    reset = true;
  }

  if (!reset) {
    const principalIds = page.RoleAssignments.results.map(
      (role) => role.PrincipalId
    );

    reset = orgs.find((org) => {
      const orgId = org.UserGroup?.ID;
      return !principalIds.includes(orgId);
    })
      ? true
      : false;
  }

  if (reset) {
    const newRoles = orgs.map((org) => {
      return {
        principal: org.UserGroup,
        roleDefs: [{ name: roleNames.RestrictedRead }],
      };
    });

    const siteGroups = getSiteGroups();
    newRoles.push({
      principal: siteGroups.owners,
      roleDefs: [{ name: roleNames.FullControl }],
    });
    newRoles.push({
      principal: siteGroups.members,
      roleDefs: [{ name: roleNames.Contribute }],
    });
    newRoles.push({
      principal: siteGroups.visitors,
      roleDefs: [{ name: roleNames.RestrictedRead }],
    });
    const newPerms = {
      roles: newRoles,
    };
    console.warn("Resetting Page Perms: ", pageTitle);
    await appContext.Pages.SetItemPermissions(page, newPerms, true);
  }
}

function getPeopleByOrgType(orgType) {
  return auditOrganizationStore()
    .filter((ao) => ao.Org_Type == orgType && ao.UserGroup)
    .map((ao) => new People(ao.UserGroup));
}

function ensureAllListPermissions() {
  const { owners, members, visitors } = getSiteGroups();

  const baseRoles = [
    new Role({
      principal: owners,
      roleDefs: [new RoleDef({ name: roleNames.FullControl })],
    }),
    new Role({
      principal: members,
      roleDefs: [new RoleDef({ name: roleNames.Contribute })],
    }),
    new Role({
      principal: visitors,
      roleDefs: [new RoleDef({ name: roleNames.RestrictedRead })],
    }),
  ];

  const qaRestrictedContributeRoles = getPeopleByOrgType(
    ORGTYPES.QUALITYASSURANCE
  ).map(
    (principal) =>
      new Role({
        principal,
        roleDefs: [new RoleDef({ name: roleNames.RestrictedContribute })],
      })
  );

  const qaRestrictedReadRoles = getPeopleByOrgType(
    ORGTYPES.QUALITYASSURANCE
  ).map(
    (principal) =>
      new Role({
        principal,
        roleDefs: [new RoleDef({ name: roleNames.RestrictedRead })],
      })
  );

  const roRestrictedReadRoles = getPeopleByOrgType(
    ORGTYPES.REQUESTINGOFFICE
  ).map(
    (principal) =>
      new Role({
        principal,
        roleDefs: [new RoleDef({ name: roleNames.RestrictedRead })],
      })
  );

  const setPerms = [
    {
      entitySet: appContext.AuditBulkRequests,
      permissions: new ItemPermissions({
        hasUniqueRoleAssignments: true,
        roles: baseRoles,
      }),
    },
    {
      entitySet: appContext.AuditBulkResponses,
      permissions: new ItemPermissions({
        hasUniqueRoleAssignments: true,
        roles: baseRoles,
      }),
    },
    {
      entitySet: appContext.AuditResponseDocsRO,
      permissions: new ItemPermissions({
        hasUniqueRoleAssignments: true,
        roles: [...baseRoles, ...qaRestrictedContributeRoles],
      }),
    },
    {
      entitySet: appContext.AuditRequests,
      permissions: new ItemPermissions({
        hasUniqueRoleAssignments: true,
        roles: baseRoles,
      }),
    },
    {
      entitySet: appContext.AuditRequestsInternal,
      permissions: new ItemPermissions({
        hasUniqueRoleAssignments: true,
        roles: [...baseRoles, ...qaRestrictedReadRoles],
      }),
    },
    {
      entitySet: appContext.AuditROEmailsLog,
      permissions: new ItemPermissions({
        hasUniqueRoleAssignments: true,
        roles: [...baseRoles, ...qaRestrictedContributeRoles],
      }),
    },
  ];
  ensureEntitySetPerms(setPerms[0]);

  return;
  setPerms.map(ensureEntitySetPerms);
}

async function ensureEntitySetPerms({ entitySet, permissions }) {
  const curPerms = await entitySet.GetRootPermissions();

  if (curPerms.hasUniqueRoleAssignments) {
    entitySet.SetRootPermissions(permissions);
    return;
  }

  // Otherwise, verify that all roles match
  const missingPermission = permissions.roles.find((role) => {
    const curRole = curPerms.roles.find(
      (curRole) => curRole.principal.ID == role.principal.ID
    );
    // If the principal doesn't have a role assignment
    if (!curRole) return true;
    const curRoleDefNames = curRole.roleDefs.map((roleDef) => roleDef.name);

    // Else, if we find a roleDef that isn't already set
    return role.roleDefs.find(
      (roleDef) => !curRoleDefNames.includes(roleDef.name)
    );
  });

  if (missingPermission) entitySet.SetRootPermissions(itemPermissions);
}
