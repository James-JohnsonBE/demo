import { appContext } from "../infrastructure/ApplicationDbContext.js";
import {
  getSpecialPermGroups,
  getSiteGroups,
  getQAGroup,
  getPeopleByUsername,
} from "./PeopleManager.js";
import { ItemPermissions } from "../infrastructure/SAL.js";
import { roleNames } from "./PermissionManager.js";
import { People } from "../entities/People.js";

export async function uploadRequestCoversheetFile(
  file,
  request,
  actionOffices
) {
  let fileName = file.name;
  const reqNum = request.ReqNum.Value();
  if (!fileName.includes(reqNum)) fileName = reqNum + "_" + fileName;

  const newFileName = getNewFileNameForSensitivity(
    fileName,
    null,
    request.Sensitivity.Value()
  );
  const title = newFileName.substring(0, newFileName.lastIndexOf("."));

  const fileMetadata = {
    Title: title,
    ReqNumId: request.ID,
    ActionOfficeId: actionOffices.map((ao) => ao.ID),
  };

  const newCoversheet =
    await appContext.AuditCoversheets.UploadFileToFolderAndUpdateMetadata(
      file,
      newFileName,
      "",
      fileMetadata
    );

  await breakCoversheetPermissions(newCoversheet);
}

function getNewFileNameForSensitivity(
  fileName,
  oldSensitivity,
  requestSensitivity
) {
  let newFileName = "";
  var curDocFileNameAndExt = fileName;
  var curDocFileName = curDocFileNameAndExt.substring(
    0,
    curDocFileNameAndExt.lastIndexOf(".")
  );
  var curDocExt = curDocFileNameAndExt.replace(curDocFileName, "");

  newFileName = curDocFileName;
  if (oldSensitivity != null && oldSensitivity != "") {
    if (curDocFileName.endsWith("_" + oldSensitivity)) {
      newFileName = newFileName.replace("_" + oldSensitivity, "");
    }
  }
  if (
    requestSensitivity != null &&
    requestSensitivity != "" &&
    requestSensitivity != "None"
  ) {
    if (!curDocFileName.endsWith("_" + requestSensitivity))
      newFileName = newFileName + "_" + requestSensitivity;
  }

  return newFileName + curDocExt;
}

async function breakCoversheetPermissions(coversheet, grantQARead) {
  const curPerms = await appContext.AuditCoversheets.GetItemPermissions(
    coversheet
  );

  const defaultGroups = await getSiteGroups();

  const qaGroup = await getQAGroup();

  let qaHasRead = curPerms.principalHasPermissionKind(
    qaGroup,
    SP.PermissionKind.viewListItems
  );

  const { specialPermGroup1, specialPermGroup2 } = await getSpecialPermGroups();

  let special1HasRead = curPerms.principalHasPermissionKind(
    specialPermGroup1,
    SP.PermissionKind.viewListItems
  );
  let special2HasRead = curPerms.principalHasPermissionKind(
    specialPermGroup2,
    SP.PermissionKind.viewListItems
  );

  if (!curPerms.hasUniqueRoleAssignments) {
    special1HasRead = false;
    special2HasRead = false;
    qaHasRead = false;
  }

  const newPerms = new ItemPermissions({
    hasUniqueRoleAssignments: true,
    roles: [],
  });

  newPerms.addPrincipalRole(defaultGroups.owners, roleNames.FullControl);
  newPerms.addPrincipalRole(defaultGroups.members, roleNames.Contribute);
  newPerms.addPrincipalRole(defaultGroups.visitors, roleNames.RestrictedRead);

  if (qaHasRead || grantQARead) {
    newPerms.addPrincipalRole(qaGroup, roleNames.RestrictedRead);
  }

  if (special1HasRead) {
    newPerms.addPrincipalRole(specialPermGroup1, roleNames.RestrictedRead);
  }

  if (special2HasRead) {
    newPerms.addPrincipalRole(specialPermGroup2, roleNames.RestrictedRead);
  }

  const actionOffices = coversheet.ActionOffice.Value();

  actionOffices.map((ao) =>
    newPerms.addPrincipalRole(
      new People(ao.UserGroup),
      roleNames.RestrictedRead
    )
  );

  await appContext.AuditCoversheets.SetItemPermissions(
    coversheet,
    newPerms,
    true
  );
}
