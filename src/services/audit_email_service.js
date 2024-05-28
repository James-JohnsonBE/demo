import { appContext } from "../infrastructure/application_db_context.js";
import { roleNames } from "./permission_manager.js";
import { getQAGroup, getSiteGroups } from "./people_manager.js";

export async function ensureROEmailFolder() {
  const folderResults = await appContext.AuditEmails.FindByColumnValue(
    [{ column: "Title", value: "RONotifications" }],
    {},
    { count: 1, includeFolders: true },
    ["ID", "Title"]
  );

  const folder = folderResults.results[0] ?? null;

  if (folder) return;

  const newFolderId = await appContext.AuditEmails.UpsertFolderPath(
    "RONotifications"
  );

  const siteGroups = getSiteGroups();
  const newRoles = [];
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

  let qaGroup = getQAGroup();
  newRoles.push({
    principal: qaGroup,
    roleDefs: [{ name: roleNames.RestrictedContribute }],
  });

  const newPerms = {
    roles: newRoles,
  };

  await appContext.AuditEmails.SetItemPermissions(
    { ID: newFolderId },
    newPerms,
    true
  );
}
