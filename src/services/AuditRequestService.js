import { appContext } from "../infrastructure/ApplicationDbContext.js";
import { getPeopleByUsername, getSiteGroups } from "./PeopleManager.js";
import { roleNames } from "./PermissionManager.js";
import { ItemPermissions } from "../infrastructure/SAL.js";
import { responseStates } from "../entities/AuditResponse.js";
import { People } from "../entities/People.js";

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

  await onAddNewRequest(request);
}

export async function onAddNewRequest(request) {
  await ensureRequestPermissions(request);
  await ensureAuditEmailFolder(request);
  await createRequestInternalItem(request.ID);
}

async function ensureAuditEmailFolder(request) {
  const newFolder = await appContext.AuditEmails.UpsertFolderPath(
    request.Title
  );

  const newItemPermissions = new ItemPermissions({
    hasUniqueRoleAssignments: true,
    roles: [],
  });

  const { owners, members, visitors } = await getSiteGroups();
  const qaGroup = await getPeopleByUsername(
    Audit.Common.Utilities.GetGroupNameQA()
  );

  newItemPermissions.addPrincipalRole(owners, roleNames.FullControl);
  newItemPermissions.addPrincipalRole(members, roleNames.RestrictedContribute);
  newItemPermissions.addPrincipalRole(visitors, roleNames.RestrictedRead);

  newItemPermissions.addPrincipalRole(qaGroup, roleNames.RestrictedContribute);

  const actionOffices = request.FieldMap.ActionOffice.Value();

  actionOffices.map((ao) => {
    newItemPermissions.addPrincipalRole(
      ao.UserGroup,
      roleNames.RestrictedContribute
    );
  });

  const result = await appContext.AuditEmails.SetItemPermissions(
    { ID: newFolder },
    newItemPermissions,
    true
  );
}

export async function ensureRequestPermissions(request) {
  const perms = await appContext.AuditRequests.GetItemPermissions(request);
  if (!perms.hasUniqueRoleAssignments) {
    if (window.DEBUG) console.warn("Request does not have unique permissions");
    await breakRequestPermissions(request);
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

async function breakRequestPermissions(request, responseStatus) {
  const curPerms = await appContext.AuditRequests.GetItemPermissions(request);

  const defaultGroups = await getSiteGroups();

  const qaGroup = await getPeopleByUsername(
    Audit.Common.Utilities.GetGroupNameQA()
  );

  const qaHasRead = curPerms.principalHasPermissionKind(
    qaGroup,
    SP.PermissionKind.viewListItems
  );

  const special1Group = await getPeopleByUsername(
    Audit.Common.Utilities.GetGroupNameSpecialPerm1()
  );
  const special2Group = await getPeopleByUsername(
    Audit.Common.Utilities.GetGroupNameSpecialPerm2()
  );

  const special1HasRead = curPerms.principalHasPermissionKind(
    special1Group,
    SP.PermissionKind.viewListItems
  );
  const special2HasRead = curPerms.principalHasPermissionKind(
    special2Group,
    SP.PermissionKind.viewListItems
  );

  const newRequestPermissions = new ItemPermissions({
    hasUniqueRoleAssignments: true,
    roles: [],
  });

  newRequestPermissions.addPrincipalRole(
    defaultGroups.owners,
    roleNames.FullControl
  );
  newRequestPermissions.addPrincipalRole(
    defaultGroups.members,
    roleNames.Contribute
  );
  newRequestPermissions.addPrincipalRole(
    defaultGroups.visitors,
    roleNames.RestrictedRead
  );

  if (qaHasRead || responseStatus == responseStates.ApprovedForQA) {
    newRequestPermissions.addPrincipalRole(qaGroup, roleNames.RestrictedRead);
  }

  if (special1HasRead) {
    newRequestPermissions.addPrincipalRole(
      special1Group,
      roleNames.RestrictedRead
    );
  }

  if (special2HasRead) {
    newRequestPermissions.addPrincipalRole(
      special2Group,
      roleNames.RestrictedRead
    );
  }

  const actionOffices = request.FieldMap.ActionOffice.Value();

  actionOffices.map((ao) =>
    newRequestPermissions.addPrincipalRole(
      new People(ao.UserGroup),
      roleNames.RestrictedRead
    )
  );

  await appContext.AuditRequests.SetItemPermissions(
    request,
    newRequestPermissions,
    true
  );
}

async function breakRequestPermissionsDep(
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
