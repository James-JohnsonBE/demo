import { appContext } from "../infrastructure/ApplicationDbContext.js";

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

export async function breakCoversheetPermissions(coversheet) {}
