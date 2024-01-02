import { appContext } from "../infrastructure/ApplicationDbContext.js";

export async function AddNewRequest(request) {
  const fields = request.FieldMap;

  // See if we have a request with this title already
  const existingRequests = await appContext.AuditRequests.FindByColumnValue(
    [{ column: "Title", value: fields.Title.Value() }],
    {},
    { count: 1 }
  );

  // TODO: use addFieldRequirement?
  if (existingRequests.results.length) {
    throw new Error("Request with this name already exists!");
  }

  request.FieldMap.EmailActionOffice.Value(
    request.FieldMap.ActionOffice.Value()
  );

  await appContext.AuditRequests.AddEntity(request);

  await OnAddNewRequest(request);
}

export async function OnAddNewRequest(request) {
  return new Promise((resolve, reject) => {
    // var Audit = top.Audit || {};

    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    var requestList = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetListTitleRequests());
    var requestQuery = new SP.CamlQuery();
    requestQuery.set_viewXml(
      "<View><Query>" +
        '<Where><Eq><FieldRef Name="ID"/><Value Type="int">' +
        request.ID +
        "</Value></Eq></Where>" +
        '<OrderBy><FieldRef Name="ID" Ascending="FALSE"/></OrderBy></Query><RowLimit>1</RowLimit></View>'
    );
    const requestItems = requestList.getItems(requestQuery);
    //request status has internal name as response status in the request list
    currCtx.load(
      requestItems,
      "Include(ID, Title, ActionOffice, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
    );

    const emailList = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory());
    var emailListQuery = new SP.CamlQuery();
    emailListQuery.set_viewXml(
      '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>'
    );
    const emailListFolderItems = emailList.getItems(emailListQuery);
    currCtx.load(emailListFolderItems, "Include(ID, Title, DisplayName)");

    currCtx.executeQueryAsync(
      async function () {
        var oListItem = null;

        var listItemEnumerator = requestItems.getEnumerator();
        while (listItemEnumerator.moveNext()) {
          oListItem = listItemEnumerator.get_current();
          break;
        }

        if (oListItem) {
          createRequestInternalItem(oListItem.get_item("ID"));

          if (!oListItem.get_hasUniqueRoleAssignments()) {
            var bDoneBreakingReqPermisions = false;
            await breakRequestPermissions(oListItem, false, null);
          }
          Audit.Common.Utilities.CreateEmailFolder(
            emailList,
            oListItem.get_item("Title"),
            oListItem
          );
        }
        resolve();
      },
      function (sender, args) {
        //alert( "Request failed: "  + args.get_message() + "\n" + args.get_stackTrace() );
        reject(sender);
      }
    );
  });
}

export async function ensureRequestPermissions(request) {
  const perms = await appContext.AuditRequests.GetItemPermissions(request);
  if (!perms.hasUniqueRoleAssignments) {
    if (window.DEBUG) console.warn("Request does not have unique permissions");
    //TODO: Add UserManager service, modernize breakRequestPermissions below.
  }
}

async function createRequestInternalItem(requestNumber) {
  var currCtx = new SP.ClientContext.get_current();
  var web = currCtx.get_web();

  var requestInternalList = web
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetListTitleRequestsInternal());

  var itemCreateInfo = new SP.ListItemCreationInformation();
  var newRequestInternalItem = requestInternalList.addItem(itemCreateInfo);
  newRequestInternalItem.set_item("ReqNum", requestNumber);
  newRequestInternalItem.update();

  currCtx.executeQueryAsync(
    function () {},
    function (sender, args) {
      alert("error creating internal request item");
      console.error(sender, args);
    }
  );
}

async function breakRequestPermissions(
  oListItem,
  refreshPageOnUpdate,
  responseStatus,
  OnComplete
) {
  return new Promise((resolve, reject) => {
    // var Audit = top.Audit || {};
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

            currCtx2.load(actionOfficeGroup);
            // var actionOfficeGroup2 = web.getUserById(
            //   actionOfficeGroup.get_id()
            // );

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
                else if (this.OnComplete) this.OnComplete(true);
              }
            }
            function onUpdatedReqAOFailed(sender, args) {
              m_CntRequestAOsAdded++;

              if (m_CntRequestAOsAdded == m_CntRequestAOsToAdd) {
                if (this.refreshPage) m_fnRefresh();
                else if (this.OnComplete) this.OnComplete(true); //return true to continue executing
              }
            }

            var data = {
              refreshPage: this.refreshPage,
              OnComplete: this.OnComplete,
              // actionOfficeGroup2,
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
      if (this.OnComplete) {
        this.OnComplete(true); //continue execution
        SP.UI.Notify.addNotification(
          "Failed to update permissions on Request: " +
            this.title +
            args.get_message() +
            "\n" +
            args.get_stackTrace(),
          false
        );
      } else if (this.refreshPage) {
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
      }
    }

    var data = {
      title: oListItem.get_item("Title"),
      refreshPage: refreshPageOnUpdate,
      oListItem: oListItem,
      resolve,
      reject,
      OnComplete: resolve,
    };
    currCtx.executeQueryAsync(
      Function.createDelegate(data, onUpdateReqPermsSucceeed),
      Function.createDelegate(data, onUpdateReqPermsFailed)
    );
  });
}
