import { appContext } from "../infrastructure/application_db_context.js";
import { roleNames } from "./permission_manager.js";
import { getQAGroup, getSiteGroups } from "./people_manager.js";
import { ItemPermissions } from "../sal/infrastructure/index.js";
import { AuditROEmailLog } from "../entities/audit_ro_email_log.js";

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

  const { owners, members, visitors } = getSiteGroups();
  let qaGroup = await getQAGroup();

  const newPermissions = new ItemPermissions({
    hasUniqueRoleAssignments: true,
    roles: [],
  });

  newPermissions.addPrincipalRole(owners, roleNames.FullControl);
  newPermissions.addPrincipalRole(members, roleNames.Contribute);
  newPermissions.addPrincipalRole(visitors, roleNames.RestrictedRead);
  newPermissions.addPrincipalRole(qaGroup, roleNames.RestrictedContribute);

  await appContext.AuditEmails.SetItemPermissions(
    { ID: newFolderId },
    newPermissions,
    true
  );
}

export async function ensureRequestROEmailLogItem(requestingOffice) {
  const roGroupName = requestingOffice?.UserGroup?.Title;
  if (!roGroupName) return;

  const logItemTitle = new Date().format("MM/dd/yyyy");

  const emailLogResult = await appContext.AuditROEmailsLog.FindByColumnValue(
    [
      { column: "Title", value: logItemTitle },
      { column: "RO", value: roGroupName },
    ],
    {},
    { count: 1, includeFolders: true }
  );

  const auditRoEmailLogItem = emailLogResult?.results[0] ?? null;
  if (auditRoEmailLogItem) return auditRoEmailLogItem;

  const newLogItem = new AuditROEmailLog();

  newLogItem.Title = logItemTitle;
  newLogItem.RequestingOffice = roGroupName;

  await appContext.AuditROEmailsLog.AddEntity(newLogItem);

  return newLogItem;
}
