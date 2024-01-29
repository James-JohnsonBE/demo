import { AuditResponseStates } from "../../entities/AuditResponse.js";
import { AuditResponseDocStates } from "../../entities/AuditResponseDocs.js";

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

async function notifyQAApprovalPending(oRequest, oResponseDocs) {
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

export async function m_fnBreakRequestPermissions(
  oListItem,
  refreshPageOnUpdate = false,
  responseStatus,
  OnComplete
) {
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
                if (this.refreshPage) m_fnRefresh();
                else resolve(true);
              }
            }
            function onUpdatedReqAOFailed(sender, args) {
              m_CntRequestAOsAdded++;

              if (m_CntRequestAOsAdded == m_CntRequestAOsToAdd) {
                if (this.refreshPage) m_fnRefresh();
                else resolve(true); //return true to continue executing
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
        if (this.refreshPage) {
          setTimeout(function () {
            m_fnRefresh();
          }, 500);
        } else if (this.OnComplete) this.OnComplete(true);
      }
    }

    function onUpdateReqPermsFailed(sender, args) {
      if (this.refreshPage) {
        SP.UI.Notify.addNotification(
          "Failed to update Request: " +
            this.title +
            args.get_message() +
            "\n" +
            args.get_stackTrace(),
          false
        );
        setTimeout(function () {
          m_fnRefresh();
        }, 500);
      } else {
        SP.UI.Notify.addNotification(
          "Failed to update permissions on Request: " +
            this.title +
            args.get_message() +
            "\n" +
            args.get_stackTrace(),
          false
        );
        // Continue regardless of success?
        this.reject(true);
      }
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
        if (this.refreshPage) m_fnRefresh();
        else if (this.OnComplete) this.OnComplete(true);
        return;
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
        if (refreshPageOnUpdate) m_fnRefresh();
        else resolve();
      },
      (sender, args) => {
        if (refreshPageOnUpdate) {
          SP.UI.Notify.addNotification(
            "Failed to update permissions on Response: " +
              oResponse.item.get_item("Title") +
              args.get_message() +
              "\n" +
              args.get_stackTrace(),
            false
          );
          m_fnRefresh();
        } else reject();
      }
    );
  });
}

function m_fnRefresh(requestNumber) {
  window.location.reload();
}
