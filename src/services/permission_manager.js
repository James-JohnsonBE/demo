import { ORGTYPES } from "../entities/index.js";
import { appContext } from "../infrastructure/application_db_context.js";
import { auditOrganizationStore } from "../infrastructure/store.js";
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

export function resetAllDBPerms() {
  const aos = auditOrganizationStore().filter(
    (ao) => ao.Org_Type != ORGTYPES.REQUESTINGOFFICE
  );
  resetPagePerms("AO_DB.aspx", aos);

  const ros = auditOrganizationStore().filter(
    (ao) => ao.Org_Type == ORGTYPES.REQUESTINGOFFICE
  );
  resetPagePerms("RO_DB.aspx", ros);
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
      roleDefs: [{ name: roleNames.Contribute }],
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
    await appContext.Pages.SetItemPermissions(page, newPerms, true);
  }
}
