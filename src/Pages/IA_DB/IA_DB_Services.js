import { AuditResponseStates } from "../../entities/AuditResponse.js";
import { AuditResponseDocStates } from "../../entities/AuditResponseDocs.js";

export const m_bigMap = {};
/**
 * Approves all response docs for a given request, updates permissions for
 * response, request, response doc folder, and coversheets.
 * Notifies QA of approved response docs.
 * @param {oRequest} oRequest The request item from big map
 * @param {Array<oResponseDoc>} oResponseDocs the response docs to be approved
 */
export async function approveResponseDocsForQA(oRequest, oResponseDocs) {
  await Promise.all(
    oRequest.responses.map(async (oResponse) => {
      const responseApprovedResponseDocs = oResponse.responseDocs.filter(
        (responseDoc) => oResponseDocs.includes(responseDoc)
      );

      // Only proceed if this response has approved response docs
      if (!responseApprovedResponseDocs.length) {
        return;
      }

      // Update Response Doc Status
      await Promise.all(
        responseApprovedResponseDocs.map(async (oResponseDoc) => {
          var ctx2 = new SP.ClientContext.get_current();
          var oList = ctx2
            .get_web()
            .get_lists()
            .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());

          const newResponseDocFileName = m_fnGetNewResponseDocTitle(
            oResponseDoc.item,
            oResponseDoc.responseTitle,
            oRequest.sensitivity
          );

          const oListItem = oList.getItemById(oResponseDoc.item.get_item("ID"));
          ctx2.load(oListItem);
          await new Promise((resolve, reject) => {
            ctx2.executeQueryAsync(resolve, reject);
          });

          oListItem.set_item("DocumentStatus", AuditResponseDocStates.SentToQA);
          oListItem.set_item("RejectReason", "");
          oListItem.set_item("FileLeafRef", newResponseDocFileName);
          oListItem.update();
          return new Promise((resolve, reject) => {
            ctx2.executeQueryAsync(resolve, reject);
          });
        })
      );

      // Update Response Status
      if (oResponse.resStatus != AuditResponseStates.Submitted) return;

      const ctx = new SP.ClientContext.get_current();

      ctx.load(oResponse.item);
      oResponse.item.set_item("ResStatus", AuditResponseStates.ApprovedForQA);
      oResponse.item.update();

      await new Promise((resolve, reject) => {
        ctx.executeQueryAsync(resolve, reject);
      }).catch((e) => {
        return;
      });

      // Break Response Permissions
      await m_fnBreakResponseAndFolderPermissions(oRequest.status, oResponse);
    })
  );

  // Break Request Permissions
  await m_fnBreakRequestPermissions(
    oRequest.item,
    false,
    AuditResponseStates.ApprovedForQA
  );

  // Break Coversheet permissions
  if (oRequest.coversheets?.length) {
    await Promise.all(
      oRequest.coversheets.map((coversheet) =>
        m_fnBreakCoversheetPermissions(coversheet.item, true)
      )
    );
  }

  // Finally, notify QA
  await notifyQAApprovalPending(oRequest, oResponseDocs);
}

export async function rejectResponseDoc(oRequest, oResponseDoc, rejectReason) {
  // const m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
  //   "Rejecting Response Document",
  //   "Please wait... Rejecting Response Document",
  //   200,
  //   400
  // );

  var clientContext = SP.ClientContext.get_current();
  var oList = clientContext
    .get_web()
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());

  const oListItem = oList.getItemById(oResponseDoc.ID);
  clientContext.load(oListItem);

  await new Promise((resolve, reject) =>
    clientContext.executeQueryAsync(resolve, (sender, args) =>
      reject({ sender, args })
    )
  ).catch(({ sender, args }) => {
    alert(
      "Request failed. " + args.get_message() + "\n" + args.get_stackTrace()
    );
  });

  var ctx2 = new SP.ClientContext.get_current();

  var oList = ctx2
    .get_web()
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());

  //refetch to avoid version conflict
  // oListItem = oList.getItemById(m_itemID);
  oListItem.set_item("DocumentStatus", "Rejected");
  oListItem.set_item("RejectReason", rejectReason);
  //changed - updating response doc file name here

  var sensitivity = "";
  if (oRequest) sensitivity = oRequest.sensitivity;
  var newResponseDocFileName = m_fnGetNewResponseDocTitle(
    oListItem,
    oResponseDoc.responseTitle,
    sensitivity
  );

  oListItem.set_item("FileLeafRef", newResponseDocFileName);
  oListItem.set_item("RejectReason", rejectReason);

  oListItem.update();

  var siteUrl =
    location.protocol +
    "//" +
    location.host +
    _spPageContextInfo.webServerRelativeUrl +
    "/";
  const filePath = oListItem.get_item("FileDirRef");
  // fileName = oListItem.get_item("FileLeafRef");
  var lastInd = filePath.lastIndexOf("/");
  var urlpath = filePath.substring(0, lastInd + 1);
  var responseTitle = filePath.replace(urlpath, "");

  var folderPath =
    Audit.Common.Utilities.GetSiteUrl() +
    "/" +
    Audit.Common.Utilities.GetLibNameResponseDocs() +
    "/" +
    responseTitle;
  var aresponseDocList = ctx2
    .get_web()
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
  var aresponseDocQuery = new SP.CamlQuery();
  aresponseDocQuery.set_viewXml(
    '<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><And><Eq><FieldRef Name="FSObjType"/><Value Type="Text">0</Value></Eq><Eq><FieldRef Name="FileDirRef"/><Value Type="Text">' +
      folderPath +
      "</Value></Eq></And></Where></Query></View>"
  );
  const aresponseDocItems = aresponseDocList.getItems(aresponseDocQuery);
  ctx2.load(aresponseDocItems);

  var aresponseList = ctx2
    .get_web()
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetListTitleResponses());
  var aresponseQuery = new SP.CamlQuery();
  aresponseQuery.set_viewXml(
    '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' +
      responseTitle +
      "</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>"
  );
  const aresponseItems = aresponseList.getItems(aresponseQuery);
  ctx2.load(aresponseItems);

  var emailList = ctx2
    .get_web()
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory());
  var emailListQuery = new SP.CamlQuery();
  emailListQuery.set_viewXml(
    '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>'
  );
  const emailListFolderItems = emailList.getItems(emailListQuery);
  ctx2.load(emailListFolderItems, "Include(ID, FSObjType, Title, DisplayName)");

  await new Promise((resolve, reject) =>
    ctx2.executeQueryAsync(resolve, (sender, args) => reject({ sender, args }))
  ).catch(({ sender, args }) => {
    alert(
      "Request failed. " + args.get_message() + "\n" + args.get_stackTrace()
    );
    return;
  });

  // TODO: Notify Action Office? If all docs rejected, Reject Response?
  const notifyId = SP.UI.Notify.addNotification(
    "Rejected Response Document",
    false
  );

  //added
  // m_waitDialog.close();
}

export async function notifyQAApprovalPending(oRequest, oResponseDocs) {
  var currCtx = new SP.ClientContext.get_current();
  var web = currCtx.get_web();

  var emailList = web
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory());

  const reqNum = oRequest.number;
  const emailSubject =
    "Your Approval Has Been Requested for Request Number: " + reqNum;

  var emailText =
    "<div>Audit Request Reference: <b>" +
    reqNum +
    "</b></div>" +
    "<div>Audit Request Subject: <b>" +
    oRequest.subject +
    "</b></div>" +
    "<div>Audit Request Due Date: <b>" +
    oRequest.internalDueDate +
    "</b></div><br/>" +
    "<div>Response(s): <ul>";

  emailText += oRequest.responses
    .map((oResponse) => {
      const responseApprovedResponseDocs = oResponse.responseDocs.filter(
        (responseDoc) => oResponseDocs.includes(responseDoc)
      );

      // Only proceed if this response has approved response docs
      if (!responseApprovedResponseDocs.length) {
        return;
      }

      return `<li><b>${oResponse.title}:</b> ${responseApprovedResponseDocs.length} document(s)</li>`;
    })
    .join("");

  emailText += "</ul></div><br/>";

  var itemCreateInfo = new SP.ListItemCreationInformation();
  itemCreateInfo.set_folderUrl(
    location.protocol +
      "//" +
      location.host +
      Audit.Common.Utilities.GetSiteUrl() +
      "/Lists/" +
      Audit.Common.Utilities.GetListNameEmailHistory() +
      "/" +
      reqNum
  );
  const oListItemEmail = emailList.addItem(itemCreateInfo);
  oListItemEmail.set_item("Title", emailSubject);
  oListItemEmail.set_item("Body", emailText);
  oListItemEmail.set_item("To", Audit.Common.Utilities.GetGroupNameQA());
  oListItemEmail.set_item("NotificationType", "QA Notification");
  oListItemEmail.set_item("ReqNum", reqNum);
  oListItemEmail.update();

  return new Promise((resolve, reject) => {
    currCtx.executeQueryAsync(resolve, reject);
  });
}

export function mapResponseDocs(responseDocItemsColl, m_bigMap) {
  try {
    var listItemEnumerator = responseDocItemsColl.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      var oListItem = listItemEnumerator.get_current();

      var responseDocID = oListItem.get_item("ID");

      var requestNumber = oListItem.get_item("ReqNum");
      if (requestNumber != null)
        requestNumber = requestNumber.get_lookupValue();

      var responseID = oListItem.get_item("ResID");
      if (responseID != null) responseID = responseID.get_lookupValue();

      if (requestNumber == null || responseID == null) continue;

      var oRequest = m_bigMap["request-" + requestNumber];
      if (!oRequest) continue;

      const oResponse = oRequest.responses.find(
        (response) => response.title == responseID
      );
      if (!oResponse) continue;

      var responseDocObject = new Object();
      responseDocObject["ID"] = oListItem.get_item("ID");
      responseDocObject["response"] = oResponse;
      responseDocObject["request"] = oRequest;
      responseDocObject["fileName"] = oListItem.get_item("FileLeafRef");
      responseDocObject["title"] = oListItem.get_item("Title");
      if (responseDocObject["title"] == null) responseDocObject["title"] = "";
      responseDocObject["folder"] = oListItem.get_item("FileDirRef");
      responseDocObject["documentStatus"] =
        oListItem.get_item("DocumentStatus");
      responseDocObject["rejectReason"] = oListItem.get_item("RejectReason");
      if (responseDocObject["rejectReason"] == null)
        responseDocObject["rejectReason"] = "";
      else
        responseDocObject["rejectReason"] = responseDocObject[
          "rejectReason"
        ].replace(/(\r\n|\n|\r)/gm, "<br/>");

      var fileSize = oListItem.get_item("File_x0020_Size");
      fileSize = Audit.Common.Utilities.GetFriendlyFileSize(fileSize);
      responseDocObject["fileSize"] = fileSize;

      var receiptDate = "";
      if (
        oListItem.get_item("ReceiptDate") != null &&
        oListItem.get_item("ReceiptDate") != ""
      )
        receiptDate = oListItem.get_item("ReceiptDate").format("MM/dd/yyyy");
      responseDocObject["receiptDate"] = receiptDate;

      var modifiedDate = "";
      if (
        oListItem.get_item("Modified") != null &&
        oListItem.get_item("Modified") != ""
      )
        modifiedDate = oListItem
          .get_item("Modified")
          .format("MM/dd/yyyy hh:mm tt");
      responseDocObject["modifiedDate"] = modifiedDate;

      responseDocObject["modifiedBy"] =
        Audit.Common.Utilities.GetFriendlyDisplayName(oListItem, "Editor");
      responseDocObject["checkedOutBy"] =
        Audit.Common.Utilities.GetFriendlyDisplayName(
          oListItem,
          "CheckoutUser"
        );

      if (responseDocObject["checkedOutBy"] != "") {
        // arrResponseDocsCheckedOut.push(oResponseDocCheckedOut);
      }
      responseDocObject["item"] = oListItem;

      oResponse["responseDocs"].push(responseDocObject);
    }
  } catch (err) {
    alert(err);
  }
}

export function m_fnGetNewResponseDocTitle(
  responseDocItem,
  responseName,
  sensitivity
) {
  var createdDate = responseDocItem.get_item("Created");
  var newResponseDocTitle =
    responseName +
    "_" +
    createdDate.format("yyyyMMddTHHmmss") +
    "_" +
    Math.ceil(Math.random() * 10000);

  if (sensitivity != null && sensitivity != "" && sensitivity != "None")
    newResponseDocTitle += "_" + sensitivity;

  var oldResponseDocTitle = responseDocItem.get_item("FileLeafRef");
  var docName = oldResponseDocTitle.substring(
    0,
    oldResponseDocTitle.lastIndexOf(".")
  );
  var docExt = oldResponseDocTitle.replace(docName, "");
  newResponseDocTitle += docExt;
  return newResponseDocTitle;
}

function m_fnGetResponseByTitle(title) {
  var oResponse = null;
  try {
    oResponse = m_bigMap["response-" + title];
  } catch (err) {}

  return oResponse;
}

export async function m_fnBreakRequestPermissions(
  oListItem,
  refreshPageOnUpdate = false,
  responseStatus,
  OnComplete
) {
  if (refreshPageOnUpdate) alert("trying to refresh page!");
  // if (!m_bIsSiteOwner) {
  //   return;
  // }

  var currCtx = new SP.ClientContext.get_current();
  var web = currCtx.get_web();

  const currentUser = web.get_currentUser();
  const ownerGroup = web.get_associatedOwnerGroup();
  const memberGroup = web.get_associatedMemberGroup();
  const visitorGroup = web.get_associatedVisitorGroup();

  var qaHasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
    oListItem,
    Audit.Common.Utilities.GetGroupNameQA(),
    SP.PermissionKind.viewListItems
  );
  var special1HasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
    oListItem,
    Audit.Common.Utilities.GetGroupNameSpecialPerm1(),
    SP.PermissionKind.viewListItems
  );
  var special2HasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
    oListItem,
    Audit.Common.Utilities.GetGroupNameSpecialPerm2(),
    SP.PermissionKind.viewListItems
  );

  oListItem.resetRoleInheritance();
  oListItem.breakRoleInheritance(false, false);

  var roleDefBindingCollAdmin =
    SP.RoleDefinitionBindingCollection.newObject(currCtx);
  roleDefBindingCollAdmin.add(
    web.get_roleDefinitions().getByType(SP.RoleType.administrator)
  );

  var roleDefBindingCollContribute =
    SP.RoleDefinitionBindingCollection.newObject(currCtx);
  roleDefBindingCollContribute.add(
    web.get_roleDefinitions().getByType(SP.RoleType.contributor)
  );

  var roleDefBindingCollRestrictedRead =
    SP.RoleDefinitionBindingCollection.newObject(currCtx);
  roleDefBindingCollRestrictedRead.add(
    web.get_roleDefinitions().getByName("Restricted Read")
  );

  var roleDefBindingCollRestrictedContribute =
    SP.RoleDefinitionBindingCollection.newObject(currCtx);
  roleDefBindingCollRestrictedContribute.add(
    web.get_roleDefinitions().getByName("Restricted Contribute")
  );

  //add site associated groups
  oListItem.get_roleAssignments().add(ownerGroup, roleDefBindingCollAdmin);
  oListItem
    .get_roleAssignments()
    .add(memberGroup, roleDefBindingCollContribute);
  oListItem
    .get_roleAssignments()
    .add(visitorGroup, roleDefBindingCollRestrictedRead);

  if (qaHasRead || responseStatus == "4-Approved for QA") {
    //make sure qa gets read if it had access
    var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup(
      Audit.Common.Utilities.GetGroupNameQA()
    );
    if (spGroupQA != null)
      oListItem
        .get_roleAssignments()
        .add(spGroupQA, roleDefBindingCollRestrictedRead);
  }

  if (special1HasRead) {
    //make sure qa gets read if it had access
    var group1SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
      Audit.Common.Utilities.GetGroupNameSpecialPerm1()
    );
    if (group1SpecialPerm != null)
      oListItem
        .get_roleAssignments()
        .add(group1SpecialPerm, roleDefBindingCollRestrictedRead);
  }

  if (special2HasRead) {
    //make sure qa gets read if it had access
    var group2SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
      Audit.Common.Utilities.GetGroupNameSpecialPerm2()
    );
    if (group2SpecialPerm != null)
      oListItem
        .get_roleAssignments()
        .add(group2SpecialPerm, roleDefBindingCollRestrictedRead);
  }

  oListItem.get_roleAssignments().getByPrincipal(currentUser).deleteObject();

  return new Promise((resolve, reject) => {
    function onUpdateReqPermsSucceeed() {
      let m_CntRequestAOsToAdd = 0;
      let m_CntRequestAOsAdded = 0;

      //add action offices
      var arrActionOffice = oListItem.get_item("ActionOffice");
      if (arrActionOffice != null && arrActionOffice.length > 0) {
        for (var x = 0; x < arrActionOffice.length; x++) {
          var actionOfficeName = arrActionOffice[x].get_lookupValue();

          var actionOfficeGroupName =
            Audit.Common.Utilities.GetAOSPGroupName(actionOfficeName);
          var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup(
            actionOfficeGroupName
          );

          if (actionOfficeGroup != null) {
            m_CntRequestAOsToAdd++;

            var currCtx2 = new SP.ClientContext.get_current();
            var web2 = currCtx2.get_web();

            var roleDefBindingCollRestrictedRead =
              SP.RoleDefinitionBindingCollection.newObject(currCtx2);
            roleDefBindingCollRestrictedRead.add(
              web2.get_roleDefinitions().getByName("Restricted Read")
            );

            this.oListItem
              .get_roleAssignments()
              .add(actionOfficeGroup, roleDefBindingCollRestrictedRead);

            function onUpdatedReqAOSucceeded() {
              m_CntRequestAOsAdded++;

              if (m_CntRequestAOsAdded == m_CntRequestAOsToAdd) {
                resolve(true);
              }
            }
            function onUpdatedReqAOFailed(sender, args) {
              m_CntRequestAOsAdded++;

              if (m_CntRequestAOsAdded == m_CntRequestAOsToAdd) {
                resolve(true); //return true to continue executing
              }
            }

            var data = {
              refreshPage: this.refreshPage,
              resolve,
            };
            currCtx2.executeQueryAsync(
              Function.createDelegate(data, onUpdatedReqAOSucceeded),
              Function.createDelegate(data, onUpdatedReqAOFailed)
            );
          }
        }
      } else {
        resolve(true);
      }
    }

    function onUpdateReqPermsFailed(sender, args) {
      SP.UI.Notify.addNotification(
        "Failed to update permissions on Request: " +
          this.title +
          args.get_message() +
          "\n" +
          args.get_stackTrace(),
        false
      );
      // Continue regardless of success?
      this.reject(sender, args);
    }

    var data = {
      title: oListItem.get_item("Title"),
      refreshPage: refreshPageOnUpdate,
      oListItem: oListItem,
      resolve,
      reject,
      OnComplete: OnComplete,
    };
    currCtx.executeQueryAsync(
      Function.createDelegate(data, onUpdateReqPermsSucceeed),
      Function.createDelegate(data, onUpdateReqPermsFailed)
    );
  });
}

export async function m_fnBreakCoversheetPermissions(oListItem, grantQARead) {
  if (oListItem == null) return;

  var currCtx = new SP.ClientContext.get_current();
  var web = currCtx.get_web();

  var currentUser = currCtx.get_web().get_currentUser();
  var ownerGroup = web.get_associatedOwnerGroup();
  var memberGroup = web.get_associatedMemberGroup();
  var visitorGroup = web.get_associatedVisitorGroup();

  var qaHasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
    oListItem,
    Audit.Common.Utilities.GetGroupNameQA(),
    SP.PermissionKind.viewListItems
  );
  var special1HasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
    oListItem,
    Audit.Common.Utilities.GetGroupNameSpecialPerm1(),
    SP.PermissionKind.viewListItems
  );
  var special2HasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
    oListItem,
    Audit.Common.Utilities.GetGroupNameSpecialPerm2(),
    SP.PermissionKind.viewListItems
  );

  //check this because if it's inheriting, they'll have access
  if (!oListItem.get_hasUniqueRoleAssignments()) {
    qaHasRead = false;
    special1HasRead = false;
    special2HasRead = false;
  }

  oListItem.resetRoleInheritance();
  oListItem.breakRoleInheritance(false, false);

  var roleDefBindingCollAdmin =
    SP.RoleDefinitionBindingCollection.newObject(currCtx);
  roleDefBindingCollAdmin.add(
    currCtx.get_web().get_roleDefinitions().getByType(SP.RoleType.administrator)
  );

  var roleDefBindingCollContribute =
    SP.RoleDefinitionBindingCollection.newObject(currCtx);
  roleDefBindingCollContribute.add(
    currCtx.get_web().get_roleDefinitions().getByType(SP.RoleType.contributor)
  );

  var roleDefBindingCollRestrictedRead =
    SP.RoleDefinitionBindingCollection.newObject(currCtx);
  roleDefBindingCollRestrictedRead.add(
    currCtx.get_web().get_roleDefinitions().getByName("Restricted Read")
  );

  var roleDefBindingCollRestrictedContribute =
    SP.RoleDefinitionBindingCollection.newObject(currCtx);
  roleDefBindingCollRestrictedContribute.add(
    currCtx.get_web().get_roleDefinitions().getByName("Restricted Contribute")
  );

  //add associated site groups
  oListItem.get_roleAssignments().add(ownerGroup, roleDefBindingCollAdmin);
  oListItem
    .get_roleAssignments()
    .add(memberGroup, roleDefBindingCollContribute);
  oListItem
    .get_roleAssignments()
    .add(visitorGroup, roleDefBindingCollRestrictedRead);

  if (qaHasRead || grantQARead) {
    //make sure qa gets read if it had access
    var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup(
      Audit.Common.Utilities.GetGroupNameQA()
    );
    if (spGroupQA != null)
      oListItem
        .get_roleAssignments()
        .add(spGroupQA, roleDefBindingCollRestrictedRead);
  }

  if (special1HasRead) {
    //make sure qa gets read if it had access
    var group1SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
      Audit.Common.Utilities.GetGroupNameSpecialPerm1()
    );
    if (group1SpecialPerm != null)
      oListItem
        .get_roleAssignments()
        .add(group1SpecialPerm, roleDefBindingCollRestrictedRead);
  }

  if (special2HasRead) {
    //make sure qa gets read if it had access
    var group2SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
      Audit.Common.Utilities.GetGroupNameSpecialPerm2()
    );
    if (group2SpecialPerm != null)
      oListItem
        .get_roleAssignments()
        .add(group2SpecialPerm, roleDefBindingCollRestrictedRead);
  }

  oListItem.get_roleAssignments().getByPrincipal(currentUser).deleteObject();

  return new Promise((resolve, reject) => {
    async function onUpdatedCSSucceeded() {
      var currCtx2 = new SP.ClientContext.get_current();

      var roleDefBindingCollRestrictedRead =
        SP.RoleDefinitionBindingCollection.newObject(currCtx2);
      roleDefBindingCollRestrictedRead.add(
        currCtx2.get_web().get_roleDefinitions().getByName("Restricted Read")
      );

      //add action offices
      var arrActionOffice = this.oListItem.get_item("ActionOffice");
      if (arrActionOffice == null || arrActionOffice.length == 0) {
        resolve();
      }

      // Map Action Office to sp groups,
      // filter null,
      // return a new promise to update the coversheets permissions for the group
      await Promise.all(
        arrActionOffice
          .map((oActionOffice) => {
            var actionOfficeName = oActionOffice.get_lookupValue();
            var actionOfficeGroupName =
              Audit.Common.Utilities.GetAOSPGroupName(actionOfficeName);
            var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup(
              actionOfficeGroupName
            );
            return actionOfficeGroup;
          })
          .filter((actionOfficeGroupName) => actionOfficeGroupName != null)
          .map((actionOfficeGroup) => {
            var roleDefBindingCollRestrictedRead =
              SP.RoleDefinitionBindingCollection.newObject(currCtx2);
            roleDefBindingCollRestrictedRead.add(
              currCtx2
                .get_web()
                .get_roleDefinitions()
                .getByName("Restricted Read")
            );
            this.oListItem
              .get_roleAssignments()
              .add(actionOfficeGroup, roleDefBindingCollRestrictedRead);

            return new Promise((resolve2, reject2) => {
              currCtx2.executeQueryAsync(resolve2, reject2);
            });
          })
      );

      resolve(true);
    }

    function onUpdatedCSFailed(sender, args) {
      SP.UI.Notify.addNotification(
        "Failed to update permissions on Coversheet" +
          args.get_message() +
          "\n" +
          args.get_stackTrace(),
        false
      );

      resolve(true); //return true to continue executing(?)
    }

    var data = {
      oListItem: oListItem,
    };
    currCtx.executeQueryAsync(
      Function.createDelegate(data, onUpdatedCSSucceeded),
      Function.createDelegate(data, onUpdatedCSFailed)
    );
  });
}

export async function m_fnBreakResponseAndFolderPermissions(
  requestStatus,
  oResponse,
  refreshPageOnUpdate = false,
  checkStatus = false,
  bForceGrantSP = false,
  bForceRemoveSP = false
) {
  // if (!m_bIsSiteOwner) {
  //   return;
  // }

  var currCtx = new SP.ClientContext.get_current();
  var web = currCtx.get_web();

  const currentUser = currCtx.get_web().get_currentUser();
  const ownerGroup = web.get_associatedOwnerGroup();
  const memberGroup = web.get_associatedMemberGroup();
  const visitorGroup = web.get_associatedVisitorGroup();

  var qaHasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
    oResponse.item,
    Audit.Common.Utilities.GetGroupNameQA(),
    SP.PermissionKind.viewListItems
  );
  var special1HasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
    oResponse.item,
    Audit.Common.Utilities.GetGroupNameSpecialPerm1(),
    SP.PermissionKind.viewListItems
  );
  var special2HasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
    oResponse.item,
    Audit.Common.Utilities.GetGroupNameSpecialPerm2(),
    SP.PermissionKind.viewListItems
  );

  if (!oResponse.item.get_hasUniqueRoleAssignments()) {
    qaHasRead = false;
    special1HasRead = false;
    special2HasRead = false;
  }
  if (bForceGrantSP) {
    special1HasRead = true;
    special2HasRead = true;
  } else if (bForceRemoveSP) {
    special1HasRead = false;
    special2HasRead = false;
  }

  oResponse.item.resetRoleInheritance();
  oResponse.item.breakRoleInheritance(false, false);

  if (oResponse.responseFolderItem) {
    oResponse.responseFolderItem.resetRoleInheritance();
    oResponse.responseFolderItem.breakRoleInheritance(false, false);
  }

  var roleDefBindingCollAdmin =
    SP.RoleDefinitionBindingCollection.newObject(currCtx);
  roleDefBindingCollAdmin.add(
    currCtx.get_web().get_roleDefinitions().getByType(SP.RoleType.administrator)
  );

  var roleDefBindingCollContribute =
    SP.RoleDefinitionBindingCollection.newObject(currCtx);
  roleDefBindingCollContribute.add(
    currCtx.get_web().get_roleDefinitions().getByType(SP.RoleType.contributor)
  );

  var roleDefBindingCollRestrictedRead =
    SP.RoleDefinitionBindingCollection.newObject(currCtx);
  roleDefBindingCollRestrictedRead.add(
    currCtx.get_web().get_roleDefinitions().getByName("Restricted Read")
  );

  var roleDefBindingCollRestrictedContribute =
    SP.RoleDefinitionBindingCollection.newObject(currCtx);
  roleDefBindingCollRestrictedContribute.add(
    currCtx.get_web().get_roleDefinitions().getByName("Restricted Contribute")
  );

  //add associated site groups
  oResponse.item.get_roleAssignments().add(ownerGroup, roleDefBindingCollAdmin);
  oResponse.item
    .get_roleAssignments()
    .add(memberGroup, roleDefBindingCollContribute);
  oResponse.item
    .get_roleAssignments()
    .add(visitorGroup, roleDefBindingCollRestrictedRead);

  if (oResponse.responseFolderItem) {
    //add associated site groups
    oResponse.responseFolderItem
      .get_roleAssignments()
      .add(ownerGroup, roleDefBindingCollAdmin);
    oResponse.responseFolderItem
      .get_roleAssignments()
      .add(memberGroup, roleDefBindingCollContribute);
    oResponse.responseFolderItem
      .get_roleAssignments()
      .add(visitorGroup, roleDefBindingCollRestrictedRead);
  }

  if (
    qaHasRead ||
    oResponse.item.get_item("ResStatus") == "4-Approved for QA" ||
    oResponse.item.get_item("ResStatus") == "6-Reposted After Rejection"
  ) {
    //make sure qa gets read if it had access
    var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup(
      Audit.Common.Utilities.GetGroupNameQA()
    );
    if (spGroupQA != null) {
      if (
        checkStatus &&
        (oResponse.item.get_item("ResStatus") == "4-Approved for QA" ||
          oResponse.item.get_item("ResStatus") ==
            "6-Reposted After Rejection") &&
        (requestStatus == "Open" || requestStatus == "ReOpened")
      ) {
        oResponse.item
          .get_roleAssignments()
          .add(spGroupQA, roleDefBindingCollRestrictedContribute);
        if (oResponse.responseFolderItem) {
          oResponse.responseFolderItem
            .get_roleAssignments()
            .add(spGroupQA, roleDefBindingCollRestrictedContribute);
        }
      } else {
        oResponse.item
          .get_roleAssignments()
          .add(spGroupQA, roleDefBindingCollRestrictedRead);
        if (oResponse.responseFolderItem) {
          oResponse.responseFolderItem
            .get_roleAssignments()
            .add(spGroupQA, roleDefBindingCollRestrictedRead);
        }
      }
    }
  }

  if (
    special1HasRead &&
    (oResponse.item.get_item("ResStatus") == "4-Approved for QA" ||
      oResponse.item.get_item("ResStatus") == "6-Reposted After Rejection" ||
      oResponse.item.get_item("ResStatus") == "7-Closed")
  ) {
    var group1SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
      Audit.Common.Utilities.GetGroupNameSpecialPerm1()
    );
    if (group1SpecialPerm != null) {
      oResponse.item
        .get_roleAssignments()
        .add(group1SpecialPerm, roleDefBindingCollRestrictedRead);
      if (oResponse.responseFolderItem) {
        oResponse.responseFolderItem
          .get_roleAssignments()
          .add(group1SpecialPerm, roleDefBindingCollRestrictedRead);
      }
    }
  }

  if (
    special2HasRead &&
    (oResponse.item.get_item("ResStatus") == "4-Approved for QA" ||
      oResponse.item.get_item("ResStatus") == "6-Reposted After Rejection" ||
      oResponse.item.get_item("ResStatus") == "7-Closed")
  ) {
    var group2SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
      Audit.Common.Utilities.GetGroupNameSpecialPerm2()
    );
    if (group2SpecialPerm != null) {
      oResponse.item
        .get_roleAssignments()
        .add(group2SpecialPerm, roleDefBindingCollRestrictedRead);
      if (oResponse.responseFolderItem) {
        oResponse.responseFolderItem
          .get_roleAssignments()
          .add(group2SpecialPerm, roleDefBindingCollRestrictedRead);
      }
    }
  }

  //add action offices
  var actionOffice = oResponse.item.get_item("ActionOffice");
  if (actionOffice != null) {
    var actionOfficeName = actionOffice.get_lookupValue();
    var actionOfficeGroupName =
      Audit.Common.Utilities.GetAOSPGroupName(actionOfficeName);
    var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup(
      actionOfficeGroupName
    );

    if (actionOfficeGroup != null) {
      if (
        checkStatus &&
        (oResponse.item.get_item("ResStatus") == "1-Open" ||
          oResponse.item.get_item("ResStatus") ==
            "3-Returned to Action Office") &&
        (requestStatus == "Open" || requestStatus == "ReOpened")
      ) {
        oResponse.item
          .get_roleAssignments()
          .add(actionOfficeGroup, roleDefBindingCollRestrictedContribute);
        if (oResponse.responseFolderItem)
          oResponse.responseFolderItem
            .get_roleAssignments()
            .add(actionOfficeGroup, roleDefBindingCollRestrictedContribute);
      } else {
        oResponse.item
          .get_roleAssignments()
          .add(actionOfficeGroup, roleDefBindingCollRestrictedRead);
        if (oResponse.responseFolderItem) {
          oResponse.responseFolderItem
            .get_roleAssignments()
            .add(actionOfficeGroup, roleDefBindingCollRestrictedRead);
        }
      }
    }
  }

  oResponse.item
    .get_roleAssignments()
    .getByPrincipal(currentUser)
    .deleteObject();
  if (oResponse.responseFolderItem)
    oResponse.responseFolderItem
      .get_roleAssignments()
      .getByPrincipal(currentUser)
      .deleteObject();

  return new Promise((resolve, reject) => {
    currCtx.executeQueryAsync(
      () => {
        resolve();
      },
      (sender, args) => {
        SP.UI.Notify.addNotification(
          "Failed to update permissions on Response: " +
            oResponse.item.get_item("Title") +
            args.get_message() +
            "\n" +
            args.get_stackTrace(),
          false
        );
        reject();
      }
    );
  });
}
