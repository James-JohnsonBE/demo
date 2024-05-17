var Audit = window.Audit || {};
Audit.BulkUpdateUsers = Audit.BulkUpdateUsers || {};

if (document.readyState === "ready" || document.readyState === "complete") {
  InitReport();
} else {
  document.onreadystatechange = () => {
    if (document.readyState === "complete" || document.readyState === "ready") {
      ExecuteOrDelayUntilScriptLoaded(function () {
        SP.SOD.executeFunc("sp.js", "SP.ClientContext", InitReport);
      }, "sp.js");
    }
  };
}

function InitReport() {
  Audit.BulkUpdateUsers.Report = new Audit.BulkUpdateUsers.Load();
  Audit.BulkUpdateUsers.Init();
}

Audit.BulkUpdateUsers.Init = function () {};

Audit.BulkUpdateUsers.Load = function () {
  var m_listViewId = null;

  var m_arrGroups = new Array();
  var m_ownerGroupName = null;
  var m_memberGroupName = null;
  var m_visitorGroupName = null;

  LoadInfo();

  function LoadInfo() {
    $("#divTblOutput").html("");

    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    collGroup = currCtx.get_web().get_siteGroups();
    currCtx.load(collGroup);
    currCtx.load(collGroup, "Include(Users)");

    m_bulkPermissionsList = currCtx
      .get_web()
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetListNameBulkPermissions());
    m_view = m_bulkPermissionsList.get_views().getByTitle("All Items");
    currCtx.load(m_view);

    currCtx.executeQueryAsync(OnSuccess, OnFailure);
    function OnSuccess(sender, args) {
      m_listViewId = m_view.get_id();

      m_fnLoadSiteGroups(collGroup);

      $("#divLoadSettings").show();
      m_fnBindHandlersOnLoad();

      var isModalDlg = GetUrlKeyValue("IsDlg");
      if (isModalDlg == null || isModalDlg == "" || isModalDlg == false) {
        $("#btnRefresh").show();
      }
    }
    function OnFailure(sender, args) {
      $("#divLoading").hide();

      statusId = SP.UI.Status.addStatus(
        "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
      );
      SP.UI.Status.setStatusPriColor(statusId, "red");
    }
  }

  function m_fnLoadSiteGroups(collGroup) {
    m_arrGroups = new Array();
    var listEnumerator = collGroup.getEnumerator();
    while (listEnumerator.moveNext()) {
      var item = listEnumerator.get_current();
      groupName = item.get_title();
      groupName = $.trim(groupName);
      groupID = item.get_id();

      var arrPerms = new Array();
      var listEnumerator1 = item.get_users().getEnumerator();
      while (listEnumerator1.moveNext()) {
        var item1 = listEnumerator1.get_current();
        var displayName = item1.get_loginName();
        arrPerms.push(displayName);
      }

      arrPerms.sort();
      var users = "";
      for (var g = 0; g < arrPerms.length; g++) {
        users += arrPerms[g] + ";";
      }

      var oGroup = new Object();
      oGroup["Title"] = groupName.toLowerCase();
      oGroup["Users"] = users;
      oGroup["SPGroupID"] = groupID;
      m_arrGroups.push(oGroup);
    }
  }

  function m_fnRefresh() {
    var curPath = location.pathname;

    var tabIndex = $("#tabs").tabs("option", "active");
    curPath += "?Tab=" + tabIndex;

    location.href = curPath;
  }

  function m_fnUploadUsers() {
    var options = SP.UI.$create_DialogOptions();
    options.title = "Upload Users";
    options.dialogReturnValueCallback = OnCallbackForm;

    var guid = m_listViewId.toString();
    guid = guid.replace(/-/g, "%2D");
    guid = guid.toUpperCase();
    options.url =
      Audit.Common.Utilities.GetSiteUrl() +
      "/Lists/" +
      Audit.Common.Utilities.GetListNameBulkPermissions() +
      "/AllItems.aspx" +
      "?ShowInGrid=True&View=%7B" +
      guid +
      "%7D";
    options.height = 700;
    SP.UI.ModalDialog.showModalDialog(options);
  }

  var m_countToRun = 0;
  var m_countRan = 0;
  var m_curOutput = "";
  var m_arrUnfoundUsers = null;

  function m_fnLoadBulkUsers() {
    m_arrBulkUsers = new Array();

    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    var bulkPermissionsList = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetListTitleBulkPermissions());
    var bulkPermissionsQuery = new SP.CamlQuery();
    bulkPermissionsQuery.set_viewXml(
      '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'
    );
    bulkPermissionsItems = bulkPermissionsList.getItems(bulkPermissionsQuery);
    currCtx.load(bulkPermissionsItems, "Include(ID, Title, UserNames)");

    function OnSuccess(sender, args) {
      var listItemEnumerator = bulkPermissionsItems.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();

        var id = oListItem.get_item("ID");
        var groupName = oListItem.get_item("Title");
        if (groupName != null) groupName = $.trim(groupName);
        var userNames = oListItem.get_item("UserNames");

        var bulkObject = new Object();
        bulkObject["ID"] = id;
        bulkObject["groupName"] = groupName;
        bulkObject["newUserNames"] = userNames;
        bulkObject["existingUserNames"] = null;

        var bIsValid = true;
        var sInvalidReason = null;

        if (bIsValid) {
          var bFound = false;
          for (var x = 0; x < m_arrGroups.length; x++) {
            if (m_arrGroups[x].Title == groupName.toLowerCase()) {
              bulkObject["existingUserNames"] = m_arrGroups[x].Users;
              bulkObject["SPGroupID"] = m_arrGroups[x].SPGroupID;
              bFound = true;
              break;
            }
          }
          if (!bFound) {
            bIsValid = false;
            sInvalidReason =
              "SharePoint Group not found. An attempt to create it will be made when clicking save below";
          }
        }

        bulkObject["isValid"] = bIsValid;
        bulkObject["invalidReason"] = sInvalidReason;
        m_arrBulkUsers.push(bulkObject);
      }

      var hasOneValid = false;
      var output =
        "<table class='tablesorter report' id='outputTable'><tr><thead><th>SharePoint Group</th><th>Current User Names</th><th>Replace Users with</th></thead></tr>";
      for (var x = 0; x < m_arrBulkUsers.length; x++) {
        var oBulkItem = m_arrBulkUsers[x];
        if (oBulkItem.isValid) {
          output +=
            "<tr id='tableRow" +
            x +
            "'><td id='tdGroup" +
            x +
            "'>" +
            oBulkItem.groupName +
            "</td><td>" +
            m_fnGetFriendlyUsers(oBulkItem.existingUserNames) +
            "</td><td>" +
            m_fnGetFriendlyUsers(oBulkItem.newUserNames) +
            "</td></tr>";
          hasOneValid = true;
        } else {
          output +=
            "<tr id='tableRow" +
            x +
            "' style='background-color:lemonchiffon; font-style:italic;' title='" +
            oBulkItem.invalidReason +
            "'><td>" +
            oBulkItem.groupName +
            " - " +
            oBulkItem.invalidReason +
            "</td><td>" +
            m_fnGetFriendlyUsers(oBulkItem.existingUserNames) +
            "</td><td>" +
            m_fnGetFriendlyUsers(oBulkItem.newUserNames) +
            "</td></tr>";
        }
      }
      $("#divLoadBulkUsersOutput").html((output += "</table>"));

      if (m_arrBulkUsers.length == 0) {
        $("#divLoadBulkUsersOutput").html("");
        return;
      }

      $("#btnCreateUsers").show();
      $("#tblUnfoundUsers").html("");

      m_fnCheckUsersAreValid();

      /*if( hasOneValid )
			{
				$("#btnCreateUsers").show();
			}
			else
			{
				$("#btnCreateUsers").hide();
			}*/
    }
    function OnFailure(sender, args) {
      statusId = SP.UI.Status.addStatus(
        "Unable to load from the Bulk Upload List: " +
          args.get_message() +
          "\n" +
          args.get_stackTrace()
      );
      SP.UI.Status.setStatusPriColor(statusId, "red");
    }

    currCtx.executeQueryAsync(OnSuccess, OnFailure);
  }

  function m_fnCheckUsersAreValid() {
    m_countToRun = 0;
    m_countRan = 0;
    m_curOutput = $("#divLoadBulkUsersOutput").html();
    m_arrUnfoundUsers = new Array();

    for (var x = 0; x < m_arrBulkUsers.length; x++) {
      var oBulkItem = m_arrBulkUsers[x];
      if (oBulkItem.isValid) {
        var newPermsArr = null;
        if (oBulkItem.newUserNames)
          newPermsArr = oBulkItem.newUserNames.split(";");

        if (newPermsArr) {
          for (var y = 0; y < newPermsArr.length; y++) {
            m_countToRun++;
            var currCtx = new SP.ClientContext.get_current();
            var web = currCtx.get_web();

            var userDisplayName = newPermsArr[y];
            userDisplayName = $.trim(userDisplayName);
            result = SP.Utilities.Utility.resolvePrincipal(
              currCtx,
              web,
              userDisplayName,
              SP.Utilities.PrincipalType.user,
              SP.Utilities.PrincipalSource.all,
              null,
              false
            );

            function OnSuccess(sender, args) {
              m_countRan++;
              if (
                this.result &&
                this.result.get_loginName() != null &&
                this.result.get_loginName() != ""
              ) {
                var loginName = this.result.get_loginName();
                var userDisplayName = this.userDisplayName;
                //m_curOutput = m_curOutput.split( userDisplayName ).join( loginName );
              } else {
                var userDisplayName = this.userDisplayName;

                var curunfound = $("#tblUnfoundUsers").html();
                curunfound += "<div>" + userDisplayName + "</div>";
                if ($("#tblUnfoundUsers").html() == "") {
                  $("#tblUnfoundUsers").html(
                    "<div>These users were not found and will be skipped:</div>" +
                      curunfound
                  );
                } else $("#tblUnfoundUsers").html(curunfound);

                //remove this from new users output
                m_curOutput = m_curOutput
                  .split("<LI>" + userDisplayName + "</LI>")
                  .join("");

                m_arrUnfoundUsers.push(userDisplayName);
              }

              if (m_countToRun == m_countRan) {
                //m_waitDialog.close();
                $("#divLoadBulkUsersOutput").html(m_curOutput);

                m_fnUpdatePermsToAdd();
              }
            }

            function OnFailure(sender, args) {
              var userDisplayName = this.userDisplayName;

              var curunfound = $("#tblUnfoundUsers").html();
              curunfound += "<div>" + userDisplayName + "</div>";
              $("#tblUnfoundUsers").html(curunfound);

              //remove this from new users output
              m_curOutput = m_curOutput
                .split("<LI>" + userDisplayName + "</LI>")
                .join("");
              m_arrUnfoundUsers.push(userDisplayName);

              m_countRan++;
              if (m_countToRun == m_countRan) {
                //m_waitDialog.close();
                $("#divLoadBulkUsersOutput").html(m_curOutput);
                m_fnUpdatePermsToAdd();
              }

              alert(error);
            }

            var data = { userDisplayName: userDisplayName, result: result };
            currCtx.executeQueryAsync(
              Function.createDelegate(data, OnSuccess),
              Function.createDelegate(data, OnFailure)
            );
          }
        }
      }
    }
  }

  function m_fnUpdatePermsToAdd() {
    for (var x = 0; x < m_arrUnfoundUsers.length; x++) {
      var username = m_arrUnfoundUsers[x];
      username = $.trim(username);
      if (username != null && username != "") {
        for (var z = 0; z < m_arrBulkUsers.length; z++) {
          var oBulkItem = m_arrBulkUsers[z];
          if (oBulkItem.isValid) {
            oBulkItem.newUserNames = oBulkItem.newUserNames
              .split(username + ";")
              .join("");
            oBulkItem.newUserNames = oBulkItem.newUserNames
              .split(username)
              .join(""); //for the ones that don't end in semi
          }
        }
      }
    }
  }

  function m_fnGetFriendlyUsers(perms) {
    if (perms == null || perms == "") return "";

    perms = perms.replace(/; /gi, ";");
    var permArr = perms.split(";");
    permArr = permArr.sort();
    var output = "<ul>";
    for (var x = 0; x < permArr.length; x++) {
      if (permArr[x] != null && $.trim(permArr[x])) {
        output += "<li>" + permArr[x] + "</li>";
      }
    }
    output += "</ul>";
    return output;
  }

  var m_countToCreate = 0;
  var m_countCreated = 0;

  function m_fnCreateUsers() {
    if (
      confirm(
        "Are you sure you would like to Create or Update the SharePoint Groups? If Creating a Group, please re-run after the operation completed. If updating a Group, this action will replace ALL existing users in the Groups"
      )
    ) {
      $("#btnCreateUsers").hide();
      document.body.style.cursor = "wait";
      notifyId = SP.UI.Notify.addNotification("Please wait... ", false);

      for (var x = 0; x < m_arrBulkUsers.length; x++) {
        var oBulkItem = m_arrBulkUsers[x];

        if (!oBulkItem.isValid) {
          //create the sharepoint group
          m_countToCreate++;
          var currCtx = new SP.ClientContext.get_current();
          var web = currCtx.get_web();

          collGroup = currCtx.get_web().get_siteGroups();

          var newGRP = new SP.GroupCreationInformation();
          newGRP.set_title(oBulkItem.groupName);

          function OnSuccessCreateGroup(sender, args) {
            var currCtx = new SP.ClientContext.get_current();
            var newCreateGroup = collGroup.add(this.group);
            //Role Definition
            var rolDef = web.get_roleDefinitions().getByName("Restricted Read");
            var rolDefColl =
              SP.RoleDefinitionBindingCollection.newObject(currCtx);
            rolDefColl.add(rolDef);

            // Get the RoleAssignmentCollection for the target web.
            var roleAssignments = web.get_roleAssignments();
            // assign the group to the new RoleDefinitionBindingCollection.
            roleAssignments.add(newCreateGroup, rolDefColl);
            //Set group properties
            newCreateGroup.set_allowMembersEditMembership(false);
            newCreateGroup.set_onlyAllowMembersViewMembership(false);
            newCreateGroup.set_owner(
              currCtx.get_web().get_associatedOwnerGroup()
            );

            newCreateGroup.update();

            collGroup = currCtx.get_web().get_siteGroups();
            currCtx.load(collGroup);
            currCtx.load(collGroup, "Include(Users)");

            function OnSuccessUpdateGroupProps(sender, args) {
              m_countCreated++;

              $("#tableRow" + this.tableRowId).attr(
                "style",
                "background-color:palegreen"
              );
              $("#tableRow" + this.tableRowId).attr(
                "title",
                "Created SharePoint Group. Please run again to add users"
              );
              $("#tdGroup" + this.tableRowId).html(
                "<span class='ui-icon ui-icon-check'></span> " +
                  $("#tdGroup" + this.tableRowId).text()
              );

              if (m_countToCreate == m_countCreated) {
                document.body.style.cursor = "default";
                notifyId = SP.UI.Notify.addNotification("Completed", false);

                m_fnLoadSiteGroups(this.collGroup);
              }
            }

            function OnFailureUpdateGroupProps(sender, args) {
              m_countCreated++;

              $("#tableRow" + this.tableRowId).attr(
                "style",
                "background-color:salmon"
              );
              $("#tableRow" + this.tableRowId).attr(
                "title",
                args.get_message()
              );
              $("#tdGroup" + this.tableRowId).html(
                $("#tdGroup" + this.tableRowId).text() +
                  " - " +
                  args.get_message()
              );

              if (m_countToCreate == m_countCreated) {
                document.body.style.cursor = "default";
                notifyId = SP.UI.Notify.addNotification(
                  "Error occurred",
                  false
                );
              }
            }
            var data = { tableRowId: this.tableRowId, collGroup: collGroup };
            currCtx.executeQueryAsync(
              Function.createDelegate(data, OnSuccessUpdateGroupProps),
              Function.createDelegate(data, OnFailureUpdateGroupProps)
            );
          }

          function OnFailureCreateGroup(sender, args) {
            $("#tableRow" + this.tableRowId).attr(
              "style",
              "background-color:salmon"
            );
            $("#tableRow" + this.tableRowId).attr("title", args.get_message());
            $("#tdGroup" + this.tableRowId).html(
              $("#tdGroup" + this.tableRowId).text() +
                " - " +
                args.get_message()
            );

            //statusId = SP.UI.Status.addStatus("Unable to : "  + args.get_message() + "\n" + args.get_stackTrace());
            m_countCreated++;
            if (m_countToCreate == m_countCreated) {
              document.body.style.cursor = "default";
              notifyId = SP.UI.Notify.addNotification("Completed", false);
            }
          }

          var data = { tableRowId: x, group: newGRP };
          currCtx.executeQueryAsync(
            Function.createDelegate(data, OnSuccessCreateGroup),
            Function.createDelegate(data, OnFailureCreateGroup)
          );
        }

        if (oBulkItem.isValid) {
          m_countToCreate++;

          var currCtx = new SP.ClientContext.get_current();
          var web = currCtx.get_web();

          var collGroup = web.get_siteGroups();
          var oGroup = collGroup.getById(oBulkItem.SPGroupID);
          oGroup.set_allowMembersEditMembership(false);
          oGroup.set_onlyAllowMembersViewMembership(false);
          oGroup.set_owner(currCtx.get_web().get_associatedOwnerGroup());
          oGroup.update();

          /** Delete existing permissions in group */
          var curPerms = oBulkItem.existingUserNames;
          var arrPerm = curPerms.split(";");
          for (var y = 0; y < arrPerm.length; y++) {
            var accountName = arrPerm[y];
            if (accountName != null && $.trim(accountName) != "") {
              accountName = $.trim(accountName);
              var oUser = web.ensureUser(accountName);
              if (oUser) {
                oGroup.get_users().remove(oUser);
              }
            }
          }

          /** Add new users to permissions in group */
          var newPerms = oBulkItem.newUserNames;
          if (newPerms != null) {
            var arrPerm = newPerms.split(";");
            for (var y = 0; y < arrPerm.length; y++) {
              var accountName = arrPerm[y];
              if (accountName != null && $.trim(accountName) != "") {
                accountName = $.trim(accountName);
                var oUser = web.ensureUser(accountName);
                if (oUser) {
                  oGroup.get_users().addUser(oUser);
                }
              }
            }
          }

          function OnSuccess(sender, args) {
            $("#tableRow" + this.tableRowId).attr(
              "style",
              "background-color:palegreen"
            );
            $("#tableRow" + this.tableRowId).attr("title", "Created");
            $("#tdGroup" + this.tableRowId).html(
              "<span class='ui-icon ui-icon-check'></span> " +
                $("#tdGroup" + this.tableRowId).text()
            );

            var currCtx2 = new SP.ClientContext.get_current();
            var itemId = m_arrBulkUsers[this.tableRowId].ID;
            var targetList = currCtx2
              .get_web()
              .get_lists()
              .getByTitle(Audit.Common.Utilities.GetListNameBulkPermissions());
            targetListItem = targetList.getItemById(itemId);
            targetListItem.deleteObject();

            currCtx2.executeQueryAsync(
              function () {},
              function () {}
            );

            m_countCreated++;
            if (m_countToCreate == m_countCreated) {
              document.body.style.cursor = "default";
              notifyId = SP.UI.Notify.addNotification("Completed", false);
            }
          }
          function OnFailure(sender, args) {
            $("#tableRow" + this.tableRowId).attr(
              "style",
              "background-color:salmon"
            );
            $("#tableRow" + this.tableRowId).attr("title", args.get_message());
            $("#tdGroup" + this.tableRowId).html(
              $("#tdGroup" + this.tableRowId).text() +
                " - " +
                args.get_message()
            );

            //statusId = SP.UI.Status.addStatus("Unable to : "  + args.get_message() + "\n" + args.get_stackTrace());
            m_countCreated++;
            if (m_countToCreate == m_countCreated) {
              document.body.style.cursor = "default";
              notifyId = SP.UI.Notify.addNotification("Completed", false);
            }
          }

          var data = { tableRowId: x };
          currCtx.executeQueryAsync(
            Function.createDelegate(data, OnSuccess),
            Function.createDelegate(data, OnFailure)
          );
        }
      }
    }
  }

  function m_fnBindHandlersOnLoad() {
    $("#btnUploadUsers").click(function () {
      m_fnUploadUsers();
    });
    $("#btnLoadUsers").click(function () {
      m_fnLoadBulkUsers();
    });
    $("#btnCreateUsers").click(function () {
      m_fnCreateUsers();
    });
  }

  function OnCallbackForm(result, value) {
    m_fnLoadBulkUsers();
  }

  var publicMembers = {
    Refresh: m_fnRefresh,
  };

  return publicMembers;
};
