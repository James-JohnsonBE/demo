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

resetListPermissions;

export function resetAllDBPerms() {
  const aos = auditOrganizationStore().filter(
    (ao) => ao.Org_Type != ORGTYPES.REQUESTINGOFFICE
  );
  resetPagePerms("AO_DB.aspx", aos);

  const ros = auditOrganizationStore().filter(
    (ao) => ao.Org_Type == ORGTYPES.REQUESTINGOFFICE
  );
  resetPagePerms("RO_DB.aspx", ros);

  // Internal Auditor Access
  [
    "AuditBulkAddResponse.aspx",
    "AuditBulkEditResponse.aspx",
    "AuditPermissions.aspx",
    "AuditReport_RequestsStatus.aspx",
    "AuditReturnedResponses.aspx",
    "AuditUnSubmittedResponseDocuments.aspx",
    "AuditUpdateSiteGroups.aspx",
  ].map((page) => resetPagePerms(page, []));

  const qas = auditOrganizationStore().filter(
    (ao) => ao.Org_Type == ORGTYPES.QUALITYASSURANCE
  );
  resetPagePerms("QA_DB.aspx", qas);

  const sps = auditOrganizationStore().filter(
    (ao) => ao.Org_Type == ORGTYPES.SPECIALPERMISSIONS
  );
  resetPagePerms("SP_DB.aspx", sps);
}

async function resetPagePerms(pageTitle, orgs) {
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

function resetAllListPermissions() {
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

  [
    {
      list: appContext.AuditBulkRequests,
      permissions: new ItemPermissions({
        hasUniqueRoleAssignments: true,
        roles: baseRoles,
      }),
    },
    {
      list: appContext.AuditBulkResponses,
      permissions: new ItemPermissions({
        hasUniqueRoleAssignments: true,
        roles: baseRoles,
      }),
    },
    {
      list: appContext.AuditResponseDocsRO,
      permissions: new ItemPermissions({
        hasUniqueRoleAssignments: true,
        roles: [...baseRoles, ...qaRestrictedContributeRoles],
      }),
    },
    {
      list: appContext.AuditRequests,
      permissions: new ItemPermissions({
        hasUniqueRoleAssignments: true,
        roles: baseRoles,
      }),
    },
    {
      list: appContext.AuditRequestsInternal,
      permissions: new ItemPermissions({
        hasUniqueRoleAssignments: true,
        roles: [...baseRoles, ...qaRestrictedReadRoles],
      }),
    },
    {
      list: appContext.AuditROEmailsLog,
      permissions: new ItemPermissions({
        hasUniqueRoleAssignments: true,
        roles: [...baseRoles, ...qaRestrictedContributeRoles],
      }),
    },
  ];
}

function resetListPerms(list, orgs) {}
