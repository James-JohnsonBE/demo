import { ORGROLES } from "../entities/index.js";
import { People } from "../sal/entities/index.js";
import { appContext } from "../infrastructure/application_db_context.js";
import { auditOrganizationStore } from "../infrastructure/store.js";
import { ItemPermissions, Role, RoleDef } from "../sal/infrastructure/index.js";
import { getSiteGroups } from "./people_manager.js";
import { addTask, finishTask, taskDefs } from "./tasks.js";

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
  ensureDBPermissions();

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

export function ensureDBPermissions() {
  const aos = auditOrganizationStore().filter(
    (ao) => ao.Role != ORGROLES.REQUESTINGOFFICE
  );
  ensurePagePerms("AO_DB.aspx", aos);

  const ros = auditOrganizationStore().filter(
    (ao) => ao.Role == ORGROLES.REQUESTINGOFFICE
  );
  ensurePagePerms("RO_DB.aspx", ros);

  const qas = auditOrganizationStore().filter(
    (ao) => ao.Role == ORGROLES.QUALITYASSURANCE
  );
  ensurePagePerms("QA_DB.aspx", qas);

  const sps = auditOrganizationStore().filter(
    (ao) => ao.Role == ORGROLES.SPECIALPERMISSIONS
  );
  ensurePagePerms("SP_DB.aspx", sps);

  ensurePagePerms("IA_DB.aspx", []);
}

async function ensurePagePerms(pageTitle, orgs) {
  const ensurePageTask = addTask(taskDefs.ensurePagePermissions(pageTitle));
  const pageResults = await appContext.SitePages.FindByColumnValue(
    [{ column: "FileLeafRef", value: pageTitle }],
    {},
    { count: 1, includePermissions: true }
  );

  const page = pageResults.results[0] ?? null;

  if (!page) {
    console.warn(
      "Unable to ensure page permissions. Page not found: " + pageTitle,
      orgs
    );
    finishTask(ensurePageTask);
    return;
  }

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
    const resetPageTask = addTask(taskDefs.resetPagePermissions(pageTitle));
    const { owners, members, visitors } = getSiteGroups();

    const baseRoles = [
      new Role({
        principal: owners,
        roleDefs: [new RoleDef({ name: roleNames.FullControl })],
      }),
      new Role({
        principal: members,
        roleDefs: [new RoleDef({ name: roleNames.RestrictedRead })],
      }),
      new Role({
        principal: visitors,
        roleDefs: [new RoleDef({ name: roleNames.RestrictedRead })],
      }),
    ];

    const newRoles = orgs.map((org) => {
      return new Role({
        principal: org.UserGroup,
        roleDefs: [{ name: roleNames.RestrictedRead }],
      });
    });

    const newPerms = new ItemPermissions({
      hasUniqueRoleAssignments: true,
      roles: [...newRoles, ...baseRoles],
    });

    console.warn("Resetting Page Perms: ", pageTitle);
    await appContext.SitePages.SetItemPermissions(page, newPerms, true);
    finishTask(resetPageTask);
  }

  finishTask(ensurePageTask);
}

function getPeopleByOrgRole(orgType) {
  return auditOrganizationStore()
    .filter((ao) => ao.Role == orgType && ao.UserGroup)
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

  const qaRestrictedContributeRoles = getPeopleByOrgRole(
    ORGROLES.QUALITYASSURANCE
  ).map(
    (principal) =>
      new Role({
        principal,
        roleDefs: [new RoleDef({ name: roleNames.RestrictedContribute })],
      })
  );

  const qaRestrictedReadRoles = getPeopleByOrgRole(
    ORGROLES.QUALITYASSURANCE
  ).map(
    (principal) =>
      new Role({
        principal,
        roleDefs: [new RoleDef({ name: roleNames.RestrictedRead })],
      })
  );

  const roRestrictedReadRoles = getPeopleByOrgRole(
    ORGROLES.REQUESTINGOFFICE
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
      entitySet: appContext.AuditRequestsInternals,
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

  setPerms.map(async (setPerm) => {
    const ensureListTask = addTask(
      taskDefs.ensureListPermissions(setPerm.entitySet)
    );
    await ensureEntitySetPerms(setPerm);
    finishTask(ensureListTask);
  });
}

async function ensureEntitySetPerms({ entitySet, permissions }) {
  const curPerms = await entitySet.GetRootPermissions();

  if (!curPerms.hasUniqueRoleAssignments) {
    await resetEntitySetPerms(
      entitySet,
      permissions,
      true,
      "List Inherits Permissions"
    );

    return;
  }

  // Otherwise, verify that all roles match
  const missingPermission = permissions.roles.find((newRole) => {
    const existingRole = curPerms.roles.find(
      (curRole) => curRole.principal.ID == newRole.principal.ID
    );
    // If the principal doesn't have a role assignment
    if (!existingRole) return true;

    const curRoleDefNames = existingRole.roleDefs.map(
      (roleDef) => roleDef.name
    );

    // Else, if we find a roleDef that isn't already set
    return newRole.roleDefs.find(
      (roleDef) => !curRoleDefNames.includes(roleDef.name)
    );
  });

  if (!missingPermission) return;

  await resetEntitySetPerms(entitySet, permissions, false, {
    "Missing Permissions": missingPermission,
  });
}

async function resetEntitySetPerms(entitySet, permissions, reset, reason) {
  const resetEntitySetPermsTask = addTask(
    taskDefs.resetListPermissions(entitySet)
  );
  console.warn("Resetting EntitySet Permissions: " + entitySet.ListDef.title, {
    entitySet,
    permissions,
    reason,
  });
  await entitySet.SetRootPermissions(permissions, reset);
  finishTask(resetEntitySetPermsTask);
}
