(() => {
  // src/pages/permissions/Permissions_Template.js
  var html = String.raw;
  var permissionsTemplate = html`
  <div class="audit">
    <iframe id="CsvExpFrame" style="display: none"></iframe>

    <div style="padding-bottom: 10px">
      <a
        id="btnRefresh"
        title="Refresh this page"
        style="display: none"
        href="javascript:void(0)"
        onclick="Audit.Permissions.Report.Refresh()"
        ><span class="ui-icon ui-icon-refresh"></span>Refresh</a
      >
    </div>

    <div id="divLoading" style="color: green; padding-bottom: 10px">
      Please Wait... Loading
    </div>

    <div id="divErrorMsg" style="color: red; padding-bottom: 10px"></div>

    <div id="tabs" style="display: none; margin-top: 20px">
      <ul>
        <li><a href="#tabs-0">Action Office Groups and Users</a></li>
        <li><a href="#tabs-1">Site Groups and Users</a></li>
        <li style="display: none"><a href="#tabs-2">Request Permissions</a></li>
        <li style="display: none">
          <a href="#tabs-3">Response Permissions</a>
        </li>
        <li style="display: none">
          <a href="#tabs-4">Response Folder Permissions</a>
        </li>
      </ul>

      <div id="tabs-0">
        <fieldset style="width: 300px">
          <legend>Actions</legend>
          <a
            style="display: none"
            id="btnPrint"
            title="Click here to Print"
            href="javascript:void(0)"
            class="hideOnPrint"
            ><span class="ui-icon ui-icon-print">Print</span></a
          >
          <a
            style="display: none"
            class="export hideOnPrint"
            title="Export to CSV"
            href="#"
            ><span class="ui-icon ui-icon-disk">Export to CSV</span></a
          >

          <div>
            <a
              id="linkGetVerification"
              title="Select Action Office(s) to Obtain Verification of User"
              disabled="disabled"
              href="javascript:void(0)"
              ><span class="ui-icon ui-icon-gear"></span>Obtain Action Office
              Verification</a
            >
          </div>
          <div>
            <a
              id="linkEmailHistory"
              title="View Email History"
              href="javascript:void(0)"
              ><span class="ui-icon ui-icon-search"></span>View Email History</a
            >
          </div>
          <div>
            <a
              id="linkUploadPermissions"
              title="Import Users to SharePoint Groups"
              href="javascript:void(0)"
              ><span class="ui-icon ui-icon-person"></span>Import Users into
              Groups</a
            >
          </div>
          <div>
            <a
              id="linkViewAO"
              title="View Action Offices"
              href="javascript:void(0)"
              ><span class="ui-icon ui-icon-search"></span>View Action Office
              Details</a
            >
          </div>
          <div>
            <a
              title="Add Action Office"
              href="#"
              id="linkAddAO"
              title="Add Action Office"
              ><span class="ui-icon ui-icon-circle-plus"></span>Add Action
              Office</a
            >
          </div>
        </fieldset>
        <div id="divTblOutput" style="width: 100%; padding-bottom: 10px">
          <table id="table_Groups" class="tablesorter">
            <thead>
              <tr>
                <th class="removeOnExport">
                  <input
                    class="cbAOAll"
                    id="cbAOAll"
                    type="checkbox"
                    style="cursor: pointer"
                  />
                  Check All?
                </th>
                <th>Action Office</th>
                <th>SharePoint Group Name</th>
                <th>
                  Users<a
                    id="linkViewExportFriendly"
                    style="float: right"
                    title="View Export Friendly"
                    href="javascript:void(0)"
                    ><span class="ui-icon ui-icon-gear"></span>View Export
                    Friendly</a
                  >
                </th>
              </tr>
            </thead>
            <tbody id="fbody"></tbody>
            <tfoot>
              <tr>
                <th colspan="4" style="text-align: left; white-space: nowrap">
                  Total: <span id="spanTotalAOS">0</span>
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div id="tabs-1">
        <div
          id="divTblSiteUsersOutput"
          style="width: 100%; padding-bottom: 10px"
        >
          <table id="table_SiteGroups" class="tablesorter">
            <thead>
              <tr>
                <th>SharePoint Group Name</th>
                <th>Users</th>
              </tr>
            </thead>
            <tbody id="fbodySPGroups"></tbody>
          </table>
        </div>
      </div>

      <div id="tabs-2">
        <table id="tblRequestsPermissions" class="tablesorter">
          <thead>
            <tr valign="top">
              <th class="sorter-false" nowrap="nowrap">
                <select id="ddlRequestID"></select>
              </th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
            </tr>
            <tr valign="top">
              <th class="sorter-false" nowrap="nowrap">Request Number</th>
              <th class="sorter-false" nowrap="nowrap">Status</th>
              <th class="sorter-false" nowrap="nowrap">Action Offices(s)</th>
              <th class="sorter-false" nowrap="nowrap">Special Perms?</th>
              <th class="sorter-false" nowrap="nowrap">Permissions</th>
            </tr>
          </thead>
          <tbody></tbody>
          <tfoot>
            <tr valign="top">
              <th nowrap="nowrap" colspan="5">
                Total: <span id="tblRequestsPermsTotal">0</span>
              </th>
            </tr>
          </tfoot>
        </table>
      </div>

      <div id="tabs-3" style="display: none">
        <table id="tblResponsePermissions" class="tablesorter">
          <thead>
            <tr valign="top">
              <th class="sorter-false" nowrap="nowrap">
                <select id="ddlResponseRequestID"></select>
              </th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
            </tr>
            <tr valign="top">
              <th class="sorter-false" nowrap="nowrap">Request Number</th>
              <th class="sorter-false" nowrap="nowrap">Response ID</th>
              <th class="sorter-false" nowrap="nowrap">Status</th>
              <th class="sorter-false" nowrap="nowrap">
                Request Action Offices(s)
              </th>
              <th class="sorter-false" nowrap="nowrap">
                Response Action Office
              </th>
              <th class="sorter-false" nowrap="nowrap">
                Request Special Perms?
              </th>
              <th class="sorter-false" nowrap="nowrap">
                Response Special Perms?
              </th>
              <th class="sorter-false" nowrap="nowrap">Permissions</th>
            </tr>
          </thead>
          <tbody></tbody>
          <tfoot>
            <tr valign="top">
              <th nowrap="nowrap" colspan="8">
                Total: <span id="tblResponsePermsTotal">0</span>
              </th>
            </tr>
          </tfoot>
        </table>
      </div>

      <div id="tabs-4" style="display: none">
        <table id="tblResponseFolderPermissions" class="tablesorter">
          <thead>
            <tr valign="top">
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap">
                <select id="ddlResponseFolderResponseID"></select>
              </th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
            </tr>
            <tr valign="top">
              <th class="sorter-false" nowrap="nowrap">Request Number</th>
              <th class="sorter-false" nowrap="nowrap">Response ID</th>
              <th class="sorter-false" nowrap="nowrap">Folder Name</th>
              <th class="sorter-false" nowrap="nowrap">Response Status</th>
              <th class="sorter-false" nowrap="nowrap">
                Request Action Offices(s)
              </th>
              <th class="sorter-false" nowrap="nowrap">
                Response Action Office
              </th>
              <th class="sorter-false" nowrap="nowrap">
                Request Special Perms?
              </th>
              <th class="sorter-false" nowrap="nowrap">
                Response Special Perms?
              </th>
              <th class="sorter-false" nowrap="nowrap">
                Folder Special Perms?
              </th>
              <th class="sorter-false" nowrap="nowrap">Permissions</th>
            </tr>
          </thead>
          <tbody></tbody>
          <tfoot>
            <tr valign="top">
              <th nowrap="nowrap" colspan="10">
                Total: <span id="tblResponseFolderPermsTotal">0</span>
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
`;

  // src/common/utilities.js
  window.Audit = window.Audit || {};
  Audit.Common = Audit.Common || {};
  var loadStart;
  function InitReport() {
    loadStart = /* @__PURE__ */ new Date();
    Audit.Common.Utilities = new Audit.Common.NewUtilities();
    Audit.Common.Init();
  }
  Audit.Common.Init = function() {
  };
  Audit.Common.NewUtilities = function() {
    var m_siteUrl = _spPageContextInfo.webServerRelativeUrl;
    var m_listTitleRequests = "AuditRequests";
    var m_listNameRequests = "AuditRequests";
    var m_listTitleRequestsInternal = "AuditRequestsInternal";
    var m_listNameRequestsInternal = "AuditRequestsInternal";
    var m_listTitleResponses = "AuditResponses";
    var m_listNameResponses = "AuditResponses";
    var m_libTitleRequestDocs = "AuditRequestDocs";
    var m_libNameRequestDocs = "AuditRequestDocs";
    var m_libTitleCoverSheet = "AuditCoverSheets";
    var m_libNameCoverSheet = "AuditCoverSheets";
    var m_libTitleResponseDocs = "AuditResponseDocs";
    var m_libNameResponseDocs = "AuditResponseDocs";
    var m_libTitleResponseDocsEA = "AuditResponseDocsRO";
    var m_libNameResponseDocsEA = "AuditResponseDocsRO";
    var m_listTitleActionOffices = "AuditOrganizations";
    var m_listNameActionOffices = "AuditOrganizations";
    var m_listTitleEmailHistory = "AuditEmails";
    var m_listNameEmailHistory = "AuditEmails";
    var m_listTitleBulkResponses = "AuditBulkResponses";
    var m_listNameBulkResponses = "AuditBulkResponses";
    var m_listTitleBulkPermissions = "AuditBulkPermissions";
    var m_listNameBulkPermissions = "AuditBulkPermissions";
    var m_groupNameSpecialPermName1 = "CGFS Special Access1";
    var m_groupNameSpecialPermName2 = "CGFS Special Access2";
    var m_groupNameQA = "Quality Assurance";
    var m_groupNameEA = "External Auditors";
    var m_libResponseDocsLibraryGUID = null;
    var m_arrSiteGroups = null;
    var m_arrAOs = null;
    function m_fnRefresh(hard = false) {
      if (hard) {
        location.href = location.pathname;
        return;
      }
      var curPath = location.pathname;
      if ($("#tabs").html() != null && $("#tabs").html() != "") {
        var tabIndex = 0;
        try {
          tabIndex = $("#tabs").tabs("option", "active");
        } catch (ex) {
        }
        curPath += "?Tab=" + tabIndex;
        if (tabIndex == 0 && $("#ddlResponseName").val() != "") {
          curPath += "&ResNum=" + $("#ddlResponseName").val();
        } else if (tabIndex == 1) {
          var responseNumOpen = $("#ddlResponsesOpen").val();
          var responseNumProcessed = $("#ddlResponsesProcessed").val();
          if (responseNumOpen != null && responseNumOpen != "")
            curPath += "&ResNum=" + responseNumOpen;
          else if (responseNumProcessed != null && responseNumProcessed != "")
            curPath += "&ResNum=" + responseNumProcessed;
        }
        location.href = curPath;
      } else {
        location.reload();
      }
    }
    function m_fnOnLoadDisplayTimeStamp() {
      var curDate = /* @__PURE__ */ new Date();
      const loadTime = (curDate - loadStart) / 1e3;
      document.getElementById(
        "divLoading"
      ).innerHTML = `Loaded at ${curDate.format("MM/dd/yyyy hh:mm tt")}<br/>
    Load time: ${loadTime + "s"}
    `;
    }
    function m_fnOnLoadDisplayTabAndResponse() {
      var paramTabIndex = GetUrlKeyValue("Tab");
      if (paramTabIndex != null && paramTabIndex != "") {
        $("#tabs").tabs("option", "active", paramTabIndex);
      }
      var bFiltered = false;
      var paramResponseNum = GetUrlKeyValue("ResNum");
      if (paramResponseNum != null && paramResponseNum != "") {
        if (paramTabIndex == 0) {
          if ($("#ddlResponseName option[value='" + paramResponseNum + "']").length > 0) {
            $("#ddlResponseName").val(paramResponseNum).change();
            bFiltered = true;
          }
        } else {
          if ($("#ddlResponsesOpen option[value='" + paramResponseNum + "']").length > 0) {
            $("#ddlResponsesOpen").val(paramResponseNum).change();
          } else if ($("#ddlResponsesProcessed option[value='" + paramResponseNum + "']").length > 0) {
            $("#ddlResponsesProcessed").val(paramResponseNum).change();
          }
        }
      }
      if (!bFiltered) {
        $(".sr-response-item").show();
      }
    }
    function m_fnOnLoadFilterResponses(responseStatus1, responseStatus2) {
      var count = 0;
      var cntOpen = 0;
      var cntReOpened = 0;
      var resStatus1 = 0;
      var resStatus2 = 0;
      var eacher = $(".sr-response-item");
      eacher.each(function() {
        var reqStatus = $.trim($(this).find(".sr-response-requestStatus").text());
        var resStatus = $.trim($(this).find(".sr-response-status").text());
        if ((resStatus == responseStatus1 || resStatus == responseStatus2) && (reqStatus == "Open" || reqStatus == "ReOpened")) {
          $(this).addClass("highlighted");
          count++;
          if (resStatus == responseStatus1)
            resStatus1++;
          else if (resStatus == responseStatus2)
            resStatus2++;
          if (reqStatus == "Open")
            cntOpen++;
          else if (reqStatus == "ReOpened")
            cntReOpened++;
        }
      });
      if (count > 0) {
        $("#lblStatusReportResponsesMsg").html(
          "<span class='ui-icon ui-icon-alert'></span>There are " + count + " Responses pending your review"
        );
        if (resStatus1 > 0 && resStatus2 == 0)
          $("#ddlResponseStatus").val(responseStatus1).change();
        else if (resStatus2 > 0 && resStatus1 == 0)
          $("#ddlResponseStatus").val(responseStatus2).change();
      } else
        $("#lblStatusReportResponsesMsg").html(
          "<span class='ui-icon ui-icon-circle-check'></span>There are 0 Responses pending your review"
        );
    }
    function m_fnLoadSiteGroups(itemColl) {
      m_arrSiteGroups = new Array();
      var listItemEnumerator = itemColl.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        var id = oListItem.get_id();
        var loginName = oListItem.get_loginName();
        var title = oListItem.get_title();
        var groupObject = new Object();
        groupObject["ID"] = id;
        groupObject["loginName"] = loginName;
        groupObject["title"] = title;
        groupObject["group"] = oListItem;
        m_arrSiteGroups.push(groupObject);
      }
    }
    function m_fnGetSPSiteGroup(groupName) {
      var userGroup = null;
      if (m_arrSiteGroups != null) {
        for (var x = 0; x < m_arrSiteGroups.length; x++) {
          if (m_arrSiteGroups[x].title == groupName) {
            userGroup = m_arrSiteGroups[x].group;
            break;
          }
        }
      }
      return userGroup;
    }
    function m_fnLoadActionOffices(itemColl) {
      m_arrAOs = new Array();
      var listItemEnumerator = itemColl.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        var id = oListItem.get_item("ID");
        var title = oListItem.get_item("Title");
        var userGroup = oListItem.get_item("UserGroup");
        if (userGroup != null) {
          userGroup = userGroup.get_lookupValue();
        } else
          userGroup = "";
        var aoObject = new Object();
        aoObject["ID"] = id;
        aoObject["title"] = title;
        aoObject["userGroup"] = userGroup;
        m_arrAOs.push(aoObject);
      }
    }
    function m_fnGetAOSPGroupName(groupName) {
      var userGroup = null;
      if (m_arrAOs != null) {
        for (var x = 0; x < m_arrAOs.length; x++) {
          var oGroup = m_arrAOs[x];
          if (oGroup.title == groupName) {
            userGroup = oGroup.userGroup;
            break;
          }
        }
      }
      return userGroup;
    }
    function m_fnCheckSPItemHasGroupPermission(item, groupName, permissionLevel) {
      if (item == null || groupName == "" || groupName == null || permissionLevel == null)
        return false;
      var match = false;
      var roleAssignments = item.get_roleAssignments();
      if (roleAssignments == null) {
        alert("Error retrieving role assignments");
        return false;
      }
      var rolesEnumerator = roleAssignments.getEnumerator();
      while (rolesEnumerator.moveNext()) {
        var role = rolesEnumerator.get_current();
        if (role != null) {
          var roleMember = role.get_member();
          if (roleMember.isPropertyAvailable("Title")) {
            var memberTitleName = roleMember.get_title();
            var roleDefs = role.get_roleDefinitionBindings();
            if (roleDefs != null) {
              var roleDefsEnumerator = roleDefs.getEnumerator();
              while (roleDefsEnumerator.moveNext()) {
                var rd = roleDefsEnumerator.get_current();
                var rdName = rd.get_name();
                if (memberTitleName == groupName && rd.get_basePermissions().has(permissionLevel)) {
                  match = true;
                  break;
                }
              }
            }
          }
        }
      }
      return match;
    }
    function m_fnGoToResponse(responseTitle, isIA) {
      if (!isIA) {
        var bFound = false;
        $("#ddlResponsesOpen > option").each(function() {
          if ($(this).text() == responseTitle) {
            bFound = true;
            notifyId = SP.UI.Notify.addNotification(
              "Displaying Response (" + responseTitle + ")",
              false
            );
            $("#ddlResponsesOpen").val(responseTitle).change();
            return false;
          }
        });
        if (!bFound) {
          $("#ddlResponsesProcessed > option").each(function() {
            if ($(this).text() == responseTitle) {
              bFound = true;
              notifyId = SP.UI.Notify.addNotification(
                "Displaying Response (" + responseTitle + ")",
                false
              );
              $("#ddlResponsesProcessed").val(responseTitle).change();
              return false;
            }
          });
        }
        $("#tabs").tabs({ active: 1 });
      }
    }
    function m_fnGetResponseDocStyleTag2(documentStatus) {
      var styleTag = {};
      if (documentStatus == "Archived")
        styleTag = { "background-color": "Gainsboro" };
      else if (documentStatus == "Approved")
        styleTag = { "background-color": "PaleGreen" };
      else if (documentStatus == "Rejected")
        styleTag = { "background-color": "LightSalmon" };
      else if (documentStatus == "Sent to QA")
        styleTag = { "background-color": "LightCyan" };
      else if (documentStatus == "Submitted")
        styleTag = { "background-color": "LemonChiffon" };
      else if (documentStatus == "Marked for Deletion")
        styleTag = {
          "background-color": "Gainsboro",
          "font-style": "italic"
        };
      return styleTag;
    }
    function m_fnGetResponseDocStyleTag(documentStatus) {
      var styleTag = "";
      if (documentStatus == "Archived")
        styleTag = " style='background-color:Gainsboro;' ";
      else if (documentStatus == "Approved")
        styleTag = " style='background-color:PaleGreen;' ";
      else if (documentStatus == "Rejected")
        styleTag = " style='background-color:LightSalmon;' ";
      else if (documentStatus == "Sent to QA")
        styleTag = " style='background-color:LightCyan;' ";
      else if (documentStatus == "Submitted")
        styleTag = " style='background-color:LemonChiffon;' ";
      else if (documentStatus == "Marked for Deletion")
        styleTag = " style='background-color:Gainsboro; font-style:italic' title='Marked for Deletion by the Action Office' ";
      return styleTag;
    }
    function m_fnCheckIfEmailFolderExists(items, requestNumber) {
      var bFolderExists = false;
      var listItemEnumerator = items.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var folderItem = listItemEnumerator.get_current();
        var itemName = folderItem.get_displayName();
        if (itemName == requestNumber) {
          var bFolderExists = true;
          break;
        }
      }
      return bFolderExists;
    }
    var m_cntAddToEmailFolder = 0;
    var m_cntAddedToEmailFolder = 0;
    function m_fnCreateEmailFolder(list, requestNumber, requestItem, OnComplete) {
      m_cntAddToEmailFolder = 0;
      m_cntAddedToEmailFolder = 0;
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      var itemCreateInfo = new SP.ListItemCreationInformation();
      itemCreateInfo.set_underlyingObjectType(SP.FileSystemObjectType.folder);
      itemCreateInfo.set_leafName(requestNumber);
      const oNewEmailFolder = list.addItem(itemCreateInfo);
      oNewEmailFolder.set_item("Title", requestNumber);
      oNewEmailFolder.update();
      const currentUser = web.get_currentUser();
      const ownerGroup = web.get_associatedOwnerGroup();
      const memberGroup = web.get_associatedMemberGroup();
      const visitorGroup = web.get_associatedVisitorGroup();
      oNewEmailFolder.resetRoleInheritance();
      oNewEmailFolder.breakRoleInheritance(false, false);
      var roleDefBindingCollAdmin = SP.RoleDefinitionBindingCollection.newObject(currCtx);
      roleDefBindingCollAdmin.add(
        web.get_roleDefinitions().getByType(SP.RoleType.administrator)
      );
      var roleDefBindingCollContribute = SP.RoleDefinitionBindingCollection.newObject(currCtx);
      roleDefBindingCollContribute.add(
        web.get_roleDefinitions().getByType(SP.RoleType.contributor)
      );
      var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject(currCtx);
      roleDefBindingCollRestrictedRead.add(
        web.get_roleDefinitions().getByName("Restricted Read")
      );
      var roleDefBindingCollRestrictedContribute = SP.RoleDefinitionBindingCollection.newObject(currCtx);
      roleDefBindingCollRestrictedContribute.add(
        web.get_roleDefinitions().getByName("Restricted Contribute")
      );
      oNewEmailFolder.get_roleAssignments().add(ownerGroup, roleDefBindingCollAdmin);
      oNewEmailFolder.get_roleAssignments().add(memberGroup, roleDefBindingCollContribute);
      oNewEmailFolder.get_roleAssignments().add(visitorGroup, roleDefBindingCollRestrictedRead);
      var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameQA()
      );
      if (spGroupQA != null)
        oNewEmailFolder.get_roleAssignments().add(spGroupQA, roleDefBindingCollRestrictedContribute);
      oNewEmailFolder.get_roleAssignments().getByPrincipal(currentUser).deleteObject();
      function onUpdatePermsSucceeded() {
        if (this.requestItem) {
          var arrActionOffice = this.requestItem.get_item("ActionOffice");
          if (arrActionOffice == null || arrActionOffice.length == 0) {
            if (this.OnComplete)
              this.OnComplete(true);
            return;
          }
          for (var x = 0; x < arrActionOffice.length; x++) {
            var actionOfficeName = arrActionOffice[x].get_lookupValue();
            var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName(actionOfficeName);
            var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup(
              actionOfficeGroupName
            );
            if (actionOfficeGroup != null) {
              let onUpdateAOPermsSucceeded2 = function() {
                m_cntAddedToEmailFolder++;
                if (m_cntAddedToEmailFolder == m_cntAddToEmailFolder) {
                  if (this.OnComplete)
                    this.OnComplete(true);
                }
              }, onUpdateAOPermsFailed2 = function(sender, args) {
                m_cntAddedToEmailFolder++;
                if (m_cntAddedToEmailFolder == m_cntAddToEmailFolder) {
                  if (this.OnComplete)
                    this.OnComplete(true);
                }
              };
              var onUpdateAOPermsSucceeded = onUpdateAOPermsSucceeded2, onUpdateAOPermsFailed = onUpdateAOPermsFailed2;
              m_cntAddToEmailFolder++;
              var currCtx2 = new SP.ClientContext.get_current();
              var web2 = currCtx2.get_web();
              var roleDefBindingCollRestrictedContribute2 = SP.RoleDefinitionBindingCollection.newObject(currCtx2);
              roleDefBindingCollRestrictedContribute2.add(
                web2.get_roleDefinitions().getByName("Restricted Contribute")
              );
              this.oNewEmailFolder.get_roleAssignments().add(actionOfficeGroup, roleDefBindingCollRestrictedContribute2);
              var data2 = { OnComplete: this.OnComplete };
              currCtx2.executeQueryAsync(
                Function.createDelegate(data2, onUpdateAOPermsSucceeded2),
                Function.createDelegate(data2, onUpdateAOPermsFailed2)
              );
            }
          }
        } else {
          if (this.OnComplete)
            this.OnComplete(true);
        }
      }
      function onUpdatePermsFailed(sender, args) {
        statusId = SP.UI.Status.addStatus(
          "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
        );
      }
      var data = {
        /*item: oListItem, */
        requestItem,
        oNewEmailFolder,
        OnComplete
      };
      currCtx.executeQueryAsync(
        Function.createDelegate(data, onUpdatePermsSucceeded),
        Function.createDelegate(data, onUpdatePermsFailed)
      );
    }
    function m_fnSortResponseTitleNoCase(a, b) {
      var aTitle = a;
      var bTitle = b;
      let newA, newB;
      if (aTitle == null)
        aTitle = "";
      if (bTitle == null)
        bTitle = "";
      var aIndex = aTitle.lastIndexOf("-");
      if (aIndex >= 0) {
        var subA = aTitle.substring(0, aIndex + 1);
        var lastA = aTitle.replace(subA, "");
        var intA = parseInt(lastA, 10);
        var newIntA = Audit.Common.Utilities.PadDigits(intA, 5);
        newA = subA + newIntA;
      } else
        newA = aTitle;
      var bIndex = bTitle.lastIndexOf("-");
      if (bIndex >= 0) {
        var subB = bTitle.substring(0, bIndex + 1);
        var lastB = bTitle.replace(subB, "");
        var intB = parseInt(lastB, 10);
        var newIntB = Audit.Common.Utilities.PadDigits(intB, 5);
        newB = subB + newIntB;
      } else
        newB = bTitle;
      return newA.toLowerCase().localeCompare(newB.toLowerCase());
    }
    function m_fnSortResponseObjectNoCase(a, b) {
      var aTitle = a.title;
      var bTitle = b.title;
      var newA;
      var newB;
      if (aTitle == null)
        aTitle = "";
      if (bTitle == null)
        bTitle = "";
      var aIndex = aTitle.lastIndexOf("-");
      if (aIndex >= 0) {
        var subA = aTitle.substring(0, aIndex + 1);
        var lastA = aTitle.replace(subA, "");
        var intA = parseInt(lastA, 10);
        var newIntA = Audit.Common.Utilities.PadDigits(intA, 5);
        newA = subA + newIntA;
      } else
        newA = aTitle;
      var bIndex = bTitle.lastIndexOf("-");
      if (bIndex >= 0) {
        var subB = bTitle.substring(0, bIndex + 1);
        var lastB = bTitle.replace(subB, "");
        var intB = parseInt(lastB, 10);
        var newIntB = Audit.Common.Utilities.PadDigits(intB, 5);
        newB = subB + newIntB;
      } else
        newB = bTitle;
      return newA.toLowerCase().localeCompare(newB.toLowerCase());
    }
    function m_fnSortNoCase(a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    }
    function m_fnSortDate(a, b) {
      if (a == "")
        return -1;
      if (b == "")
        return 1;
      return new Date(a).getTime() - new Date(b).getTime();
    }
    function m_fnAddOptions(arr, ddlID, dateSort, responseSort) {
      if (arr == null)
        return;
      if (responseSort)
        arr.sort(m_fnSortResponseTitleNoCase);
      else if (!dateSort)
        arr.sort(m_fnSortNoCase);
      else
        arr.sort(m_fnSortDate);
      var rOptions = new Array(), j = -1;
      rOptions[++j] = "<option value=''>-Select-</option>";
      var arrLength = arr.length;
      for (var x = 0; x < arrLength; x++) {
        var option = $.trim(arr[x]);
        rOptions[++j] = "<option value='" + option + "'>" + option + "</option>";
      }
      var thisDDL = $(ddlID);
      thisDDL.empty().append(rOptions.join(""));
    }
    function m_fnExistsInArr(arr, val) {
      if (arr == null)
        return false;
      var arrLength = arr.length;
      for (var x = 0; x < arrLength; x++) {
        if (arr[x] == val)
          return true;
      }
      return false;
    }
    function m_fnGetTrueFalseIcon(val) {
      if (val == true)
        return "<span class='ui-icon ui-icon-check'>" + val + "</span>";
      else
        return "<span class='ui-icon ui-icon-close'>" + val + "</span>";
    }
    function m_fnGetFriendlyDisplayName(oListItem, fieldName) {
      var user = oListItem.get_item(fieldName);
      if (user == null)
        return "";
      else
        return user.get_lookupValue();
    }
    function m_fnPadDigits(n, totalDigits) {
      n = n.toString();
      var pd = "";
      if (totalDigits > n.length) {
        for (let i = 0; i < totalDigits - n.length; i++) {
          pd += "0";
        }
      }
      return pd + n.toString();
    }
    function m_fnPreciseRound(num, decimals) {
      var sign = num >= 0 ? 1 : -1;
      return (Math.round(num * Math.pow(10, decimals) + sign * 1e-3) / Math.pow(10, decimals)).toFixed(decimals);
    }
    function m_fnGetFriendlyFileSize(fileSize) {
      if (fileSize == null || fileSize == "")
        return "";
      if (fileSize > 1048576) {
        fileSize = Audit.Common.Utilities.PreciseRound(fileSize / 1048576, 2) + " MB";
      } else if (fileSize > 1024) {
        fileSize = Audit.Common.Utilities.PreciseRound(fileSize / 1024, 2) + " KB";
      } else {
        fileSize += " B";
      }
      return fileSize;
    }
    function m_fnISODateString(d) {
      function pad(n) {
        return n < 10 ? "0" + n : n;
      }
      return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()) + "T" + pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds()) + "Z";
    }
    function m_fnBindHandlerResponseDoc() {
      $(".requestInfo-response-doc img").click(function(event) {
        event.preventDefault();
        var curIcon = $(this).attr("src");
        if (curIcon == "/_layouts/images/minus.gif")
          $(this).attr("src", "/_layouts/images/plus.gif");
        else
          $(this).attr("src", "/_layouts/images/minus.gif");
        $(this).parent().parent().nextUntil("tr.requestInfo-response-doc").each(function() {
          $(this).toggleClass("collapsed");
        });
      });
    }
    function m_fnGetLookupFormField(fieldTitle) {
      if ($("select[title='" + fieldTitle + "']").html() !== null) {
        return $("select[title='" + fieldTitle + "']");
      } else {
        return $("input[title='" + fieldTitle + "']");
      }
    }
    function m_fnGetLookupDisplayText(fieldTitle) {
      if ($("select[title='" + fieldTitle + "']").html() !== null) {
        return $("select[title='" + fieldTitle + "'] option:selected").text();
      } else {
        return $("input[title='" + fieldTitle + "']").val();
      }
    }
    function m_fnSetLookupFromFieldNameByText(fieldName, text) {
      try {
        if (text == void 0)
          return;
        var theSelect = m_fnGetTagFromIdentifierAndTitle("select", "", fieldName);
        if (theSelect == null) {
          var theInput = m_fnGetTagFromIdentifierAndTitle("input", "", fieldName);
          ShowDropdown(theInput.id);
          var opt = document.getElementById(theInput.opt);
          m_fnSetSelectedOptionByText(opt, text);
          OptLoseFocus(opt);
        } else {
          m_fnSetSelectedOptionByText(theSelect, text);
        }
      } catch (ex) {
      }
    }
    function m_fnSetSelectedOptionByText(select, text) {
      var opts = select.options;
      var optLength = opts.length;
      if (select == null)
        return;
      for (var i = 0; i < optLength; i++) {
        if (opts[i].text == text) {
          select.selectedIndex = i;
          return true;
        }
      }
      return false;
    }
    function m_fnGetTagFromIdentifierAndTitle(tagName, identifier, title) {
      var idLength = identifier.length;
      var tags = document.getElementsByTagName(tagName);
      for (var i = 0; i < tags.length; i++) {
        var tagID = tags[i].id;
        if (tags[i].title == title && (identifier == "" || tagID.indexOf(identifier) == tagID.length - idLength)) {
          return tags[i];
        }
      }
      return null;
    }
    function m_fnViewUserManuals(docType) {
      var options = SP.UI.$create_DialogOptions();
      options.title = "User Manual";
      options.height = 250;
      if (docType != null)
        options.url = Audit.Common.Utilities.GetSiteUrl() + "/SitePages/AuditUserManuals.aspx?FilterField1=DocType&FilterValue1=" + docType;
      else
        options.url = Audit.Common.Utilities.GetSiteUrl() + "/SitePages/AuditUserManuals.aspx";
      SP.UI.ModalDialog.showModalDialog(options);
    }
    function m_fnPrintPage(pageTitle, divTbl) {
      var curDate = /* @__PURE__ */ new Date();
      var siteUrl = Audit.Common.Utilities.GetSiteUrl();
      var cssLink1 = siteUrl + "/siteassets/css/tablesorter/style.css?v=" + curDate.format("MM_dd_yyyy");
      var cssLink2 = siteUrl + "/siteAssets/css/audit_styles.css?v=" + curDate.format("MM_dd_yyyy");
      var divOutput = $(divTbl).html();
      var updatedDivOutput = $("<div>").append(divOutput);
      updatedDivOutput.find(".sr-response-title a").each(function() {
        $(this).removeAttr("onclick");
        $(this).removeAttr("href");
      });
      divOutput = updatedDivOutput.html();
      var printDateString = curDate.format("MM/dd/yyyy hh:mm tt");
      printDateString = "<div style='padding-bottom:10px;'>" + printDateString + "</div>";
      divOutput = printDateString + divOutput;
      var cssFile1 = $("<div></div>");
      var cssFile2 = $("<div></div>");
      var def1 = $.Deferred();
      var def2 = $.Deferred();
      var cssFileText = "";
      cssFile1.load(cssLink1, function() {
        cssFileText += "<style>" + cssFile1.html() + "</style>";
        def1.resolve();
      });
      cssFile2.load(cssLink2, function() {
        cssFileText += "<style>" + cssFile2.html() + "</style>";
        def2.resolve();
      });
      $.when(def1, def2).done(function() {
        var html2 = "<HTML>\n<HEAD>\n\n<Title>" + pageTitle + "</Title>\n" + cssFileText + "\n<style>.hideOnPrint, .rowFilters {display:none}</style>\n</HEAD>\n<BODY>\n" + divOutput + "\n</BODY>\n</HTML>";
        var printWP = window.open("", "printWebPart");
        printWP.document.open();
        printWP.document.write(html2);
        printWP.document.close();
        printWP.print();
      });
    }
    function m_fnExportToCsv(fileName, tableName, removeHeader) {
      var data = m_fnGetCellValues(tableName);
      if (removeHeader == true)
        data = data.slice(1);
      var csv = m_fnConvertToCsv(data);
      if (navigator.userAgent.search("Trident") >= 0) {
        window.CsvExpFrame.document.open("text/html", "replace");
        window.CsvExpFrame.document.write(csv);
        window.CsvExpFrame.document.close();
        window.CsvExpFrame.focus();
        window.CsvExpFrame.document.execCommand(
          "SaveAs",
          true,
          fileName + ".csv"
        );
      } else {
        var uri = "data:text/csv;charset=utf-8," + escape(csv);
        var downloadLink = document.createElement("a");
        downloadLink.href = uri;
        downloadLink.download = fileName + ".csv";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    }
    function m_fnGetCellValues(tableName) {
      var table = document.getElementById(tableName);
      if (table.innerHTML.indexOf("rowFilters") >= 0) {
        var deets = $("<div>").append(table.outerHTML);
        deets.find(".rowFilters").each(function() {
          $(this).remove();
        });
        table = deets.find("table")[0];
      }
      if (table.innerHTML.indexOf("footer") >= 0) {
        var deets = $("<div>").append(table.outerHTML);
        deets.find(".footer").each(function() {
          $(this).remove();
        });
        table = deets.find("table")[0];
      }
      var tableArray = [];
      for (var r = 0, n = table.rows.length; r < n; r++) {
        tableArray[r] = [];
        for (var c = 0, m = table.rows[r].cells.length; c < m; c++) {
          var text = table.rows[r].cells[c].textContent || table.rows[r].cells[c].innerText;
          tableArray[r][c] = text.trim();
        }
      }
      return tableArray;
    }
    function m_fnConvertToCsv(objArray) {
      var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
      var str = "sep=,\r\n";
      var line = "";
      var index;
      var value;
      for (var i = 0; i < array.length; i++) {
        line = "";
        var array1 = array[i];
        for (index in array1) {
          if (array1.hasOwnProperty(index)) {
            value = array1[index] + "";
            line += '"' + value.replace(/"/g, '""') + '",';
          }
        }
        line = line.slice(0, -1);
        str += line + "\r\n";
      }
      return str;
    }
    var publicMembers = {
      GetSiteUrl: function() {
        if (m_siteUrl == "/")
          return "";
        else
          return m_siteUrl;
      },
      GetListTitleRequests: function() {
        return m_listTitleRequests;
      },
      GetListNameRequests: function() {
        return m_listNameRequests;
      },
      GetListTitleRequestsInternal: function() {
        return m_listTitleRequestsInternal;
      },
      GetListNameRequestsInternal: function() {
        return m_listNameRequestsInternal;
      },
      GetListTitleResponses: function() {
        return m_listTitleResponses;
      },
      GetListNameResponses: function() {
        return m_listNameResponses;
      },
      GetLibTitleRequestDocs: function() {
        return m_libTitleRequestDocs;
      },
      GetLibNameRequestDocs: function() {
        return m_libNameRequestDocs;
      },
      GetLibTitleCoverSheets: function() {
        return m_libTitleCoverSheet;
      },
      GetLibNameCoverSheets: function() {
        return m_libNameCoverSheet;
      },
      GetLibTitleResponseDocs: function() {
        return m_libTitleResponseDocs;
      },
      GetLibNameResponseDocs: function() {
        return m_libNameResponseDocs;
      },
      GetLibTitleResponseDocsEA: function() {
        return m_libTitleResponseDocsEA;
      },
      GetLibNameResponseDocsEA: function() {
        return m_libNameResponseDocsEA;
      },
      GetListTitleActionOffices: function() {
        return m_listTitleActionOffices;
      },
      GetListNameActionOffices: function() {
        return m_listNameActionOffices;
      },
      GetListTitleEmailHistory: function() {
        return m_listTitleEmailHistory;
      },
      GetListNameEmailHistory: function() {
        return m_listNameEmailHistory;
      },
      GetListTitleBulkResponses: function() {
        return m_listTitleBulkResponses;
      },
      GetListNameBulkResponses: function() {
        return m_listNameBulkResponses;
      },
      GetListTitleBulkPermissions: function() {
        return m_listTitleBulkPermissions;
      },
      GetListNameBulkPermissions: function() {
        return m_listNameBulkPermissions;
      },
      GetGroupNameSpecialPerm1: function() {
        return m_groupNameSpecialPermName1;
      },
      GetGroupNameSpecialPerm2: function() {
        return m_groupNameSpecialPermName2;
      },
      GetGroupNameQA: function() {
        return m_groupNameQA;
      },
      GetGroupNameEA: function() {
        return m_groupNameEA;
      },
      Refresh: m_fnRefresh,
      OnLoadDisplayTimeStamp: m_fnOnLoadDisplayTimeStamp,
      OnLoadDisplayTabAndResponse: m_fnOnLoadDisplayTabAndResponse,
      OnLoadFilterResponses: function(responseStatus1, responseStatus2) {
        m_fnOnLoadFilterResponses(responseStatus1, responseStatus2);
      },
      SetResponseDocLibGUID: function(libGUID) {
        m_libResponseDocsLibraryGUID = libGUID;
      },
      GetResponseDocLibGUID: function() {
        return m_libResponseDocsLibraryGUID;
      },
      LoadSiteGroups: function(itemColl) {
        m_fnLoadSiteGroups(itemColl);
      },
      GetSPSiteGroup: function(groupName) {
        return m_fnGetSPSiteGroup(groupName);
      },
      LoadActionOffices: function(itemColl) {
        m_fnLoadActionOffices(itemColl);
      },
      GetActionOffices: function() {
        return m_arrAOs;
      },
      GetAOSPGroupName: function(groupName) {
        return m_fnGetAOSPGroupName(groupName);
      },
      CheckSPItemHasGroupPermission: function(item, groupName, permissionLevel) {
        return m_fnCheckSPItemHasGroupPermission(
          item,
          groupName,
          permissionLevel
        );
      },
      GoToResponse: function(responseTitle, isIA) {
        m_fnGoToResponse(responseTitle, isIA);
      },
      GetResponseDocStyleTag: function(documentStatus) {
        return m_fnGetResponseDocStyleTag(documentStatus);
      },
      GetResponseDocStyleTag2: function(documentStatus) {
        return m_fnGetResponseDocStyleTag2(documentStatus);
      },
      CheckIfEmailFolderExists: function(items, requestNumber) {
        return m_fnCheckIfEmailFolderExists(items, requestNumber);
      },
      CreateEmailFolder: function(list, requestNumber, requestItem, OnComplete) {
        return m_fnCreateEmailFolder(
          list,
          requestNumber,
          requestItem,
          OnComplete
        );
      },
      AddOptions: function(arr, ddlID, dateSort, responseSort) {
        m_fnAddOptions(arr, ddlID, dateSort, responseSort);
      },
      ExistsInArr: function(arr, val) {
        return m_fnExistsInArr(arr, val);
      },
      GetTrueFalseIcon: function(val) {
        return m_fnGetTrueFalseIcon(val);
      },
      PadDigits: function(n, totalDigits) {
        return m_fnPadDigits(n, totalDigits);
      },
      PreciseRound: function(num, decimals) {
        return m_fnPreciseRound(num, decimals);
      },
      GetFriendlyFileSize: function(fileSize) {
        return m_fnGetFriendlyFileSize(fileSize);
      },
      GetISODateString: function(d) {
        return m_fnISODateString(d);
      },
      GetFriendlyDisplayName: function(oListItem, fieldName) {
        return m_fnGetFriendlyDisplayName(oListItem, fieldName);
      },
      BindHandlerResponseDoc: m_fnBindHandlerResponseDoc,
      PrintStatusReport: function(pageTitle, divTbl) {
        m_fnPrintPage(pageTitle, divTbl);
      },
      ExportToCsv: function(fileName, tableName, removeHeader) {
        m_fnExportToCsv(fileName, tableName, removeHeader);
      },
      ViewUserManuals: function(docType) {
        m_fnViewUserManuals(docType);
      },
      //GetLookupFieldText: function( fieldName ){ return m_fnGetLookupFieldText( fieldName); },
      GetLookupDisplayText: function(fieldName) {
        return m_fnGetLookupDisplayText(fieldName);
      },
      GetLookupFormField: function(fieldName) {
        return m_fnGetLookupFormField(fieldName);
      },
      SetLookupFromFieldNameByText: function(fieldName, text) {
        return m_fnSetLookupFromFieldNameByText(fieldName, text);
      },
      SortResponseObjects: function(a, b) {
        return m_fnSortResponseObjectNoCase(a, b);
      },
      SortResponseTitles: m_fnSortResponseTitleNoCase
    };
    return publicMembers;
  };
  InitReport();

  // src/pages/permissions/permissions.js
  window.Audit = window.Audit || {};
  Audit.Permissions = Audit.Permissions || {};
  document.getElementById("app").innerHTML = permissionsTemplate;
  if (document.readyState === "ready" || document.readyState === "complete") {
    InitPermissions();
  } else {
    document.onreadystatechange = () => {
      if (document.readyState === "complete" || document.readyState === "ready") {
        ExecuteOrDelayUntilScriptLoaded(function() {
          SP.SOD.executeFunc("sp.js", "SP.ClientContext", InitPermissions);
        }, "sp.js");
      }
    };
  }
  function InitPermissions() {
    Audit.Permissions.Report = new Audit.Permissions.Load();
    Audit.Permissions.Init();
  }
  Audit.Permissions.Init = function() {
  };
  Audit.Permissions.Load = function() {
    var m_arrRequests = new Array();
    var m_arrResponses = new Array();
    var m_arrResponseFolders = new Array();
    var m_arrGroups = null;
    var m_collGroup = null;
    var m_ownerGroupName = null;
    var m_memberGroupName = null;
    var m_visitorGroupName = null;
    var notifyId2;
    var m_waitDialog;
    var m_txtOutgoingEmailText = null;
    var m_emailFolderName = "AOVerifications";
    var m_oAOGroupUsers = new Object();
    LoadInfo();
    function LoadInfo() {
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      var aoList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleActionOffices());
      var aoQuery = new SP.CamlQuery();
      aoQuery.set_viewXml(
        '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'
      );
      var m_aoItems = aoList.getItems(aoQuery);
      currCtx.load(m_aoItems, "Include(ID, Title, UserGroup)");
      var ownerGroup = web.get_associatedOwnerGroup();
      var memberGroup = web.get_associatedMemberGroup();
      var visitorGroup = web.get_associatedVisitorGroup();
      currCtx.load(ownerGroup);
      currCtx.load(memberGroup);
      currCtx.load(visitorGroup);
      currCtx.executeQueryAsync(OnSuccess, OnFailure);
      function OnSuccess(sender, args) {
        Audit.Common.Utilities.LoadActionOffices(m_aoItems);
        m_ownerGroupName = ownerGroup.get_title();
        m_memberGroupName = memberGroup.get_title();
        m_visitorGroupName = visitorGroup.get_title();
        $("#tabs").tabs().show();
        m_fnBindHandlersOnLoad();
        Audit.Common.Utilities.OnLoadDisplayTimeStamp();
        m_fnOnLoadDisplayTab();
        var isModalDlg = GetUrlKeyValue("IsDlg");
        if (isModalDlg == null || isModalDlg == "" || isModalDlg == false) {
          $("#btnRefresh").show();
        }
        var doneLoadingSPGroupPermissions = false;
        m_fnLoadSPGroupPermissions(function(doneLoadingSPGroupPermissions2) {
          if (doneLoadingSPGroupPermissions2) {
            m_fnDisplaySPGroupPermissions();
            m_fnDisplaySPGroupPermissions2();
          }
        });
      }
      function OnFailure(sender, args) {
        $("#divLoading").hide();
        statusId = SP.UI.Status.addStatus(
          "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
        );
        SP.UI.Status.setStatusPriColor(statusId, "red");
      }
    }
    function m_fnRefresh() {
      var curPath = location.pathname;
      var tabIndex = $("#tabs").tabs("option", "active");
      curPath += "?Tab=" + tabIndex;
      location.href = curPath;
    }
    function m_fnOnLoadDisplayTab() {
      var paramTabIndex = GetUrlKeyValue("Tab");
      if (paramTabIndex != null && paramTabIndex != "") {
        $("#tabs").tabs("option", "active", paramTabIndex);
      }
    }
    function m_fnLoadRequestPermissions() {
      m_arrRequests = new Array();
      var currCtx = SP.ClientContext.get_current();
      var web = currCtx.get_web();
      this.ownerGroup = web.get_associatedOwnerGroup();
      this.memberGroup = web.get_associatedMemberGroup();
      this.visitorGroup = web.get_associatedVisitorGroup();
      var listItemEnumerator = m_requestItems.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        var id = oListItem.get_item("ID");
        var number = oListItem.get_item("Title");
        var status = oListItem.get_item("ReqStatus");
        var sample = oListItem.get_item("IsSample");
        var arrActionOffice = oListItem.get_item("ActionOffice");
        var actionOffice = "";
        for (var x = 0; x < arrActionOffice.length; x++) {
          actionOffice += "<div>" + arrActionOffice[x].get_lookupValue() + "</div>";
        }
        var requestObject = new Object();
        requestObject["ID"] = id;
        requestObject["number"] = number;
        requestObject["status"] = status;
        requestObject["sample"] = sample;
        requestObject["responses"] = new Array();
        requestObject["actionOffice"] = actionOffice;
        requestObject["item"] = oListItem;
        m_fnLoadPermsOnItem(requestObject, oListItem);
        m_arrRequests.push(requestObject);
      }
      var arrRequestIDs = new Array();
      var errorCount = 0;
      var sTablePermissionsBody = "";
      var r = new Array(), j = -1;
      var reqLength = m_arrRequests.length;
      for (var x = 0; x < reqLength; x++) {
        var oRequest = m_arrRequests[x];
        var number = oRequest.number;
        arrRequestIDs.push(number);
        var status = oRequest.status;
        var actionOffices = oRequest.actionOffice;
        var permsDisplay = oRequest.permissionsDisplay;
        var hasSecialPerms = Audit.Common.Utilities.GetTrueFalseIcon(
          oRequest.hasSpecialPermissions
        );
        var flagItem = false;
        var errToolTip = "";
        for (var y = 0; y < oRequest.item.get_item("ActionOffice").length; y++) {
          var actionOfficeName = oRequest.item.get_item("ActionOffice")[y].get_lookupValue();
          var groupNameActionOffice = Audit.Common.Utilities.GetAOSPGroupName(actionOfficeName);
          var bFoundPermission = false;
          for (var z = 0; z < oRequest.arrUserPermissions.length; z++)
            if (oRequest.arrUserPermissions[z].name == groupNameActionOffice)
              bFoundPermission = true;
          for (var z = 0; z < oRequest.arrGroupPermissions.length; z++)
            if (oRequest.arrGroupPermissions[z].name == groupNameActionOffice)
              bFoundPermission = true;
          if (!bFoundPermission) {
            errToolTip = ' title="Missing Action Office in this set of Permissions" ';
            flagItem = true;
          }
        }
        if (!flagItem) {
          var bError = false;
          for (var z = 0; z < oRequest.arrUserPermissions.length; z++) {
            var bFound = false;
            var name = oRequest.arrUserPermissions[z].name;
            for (var y = 0; y < oRequest.item.get_item("ActionOffice").length; y++) {
              var actionOfficeName = oRequest.item.get_item("ActionOffice")[y].get_lookupValue();
              var groupNameActionOffice = Audit.Common.Utilities.GetAOSPGroupName(actionOfficeName);
              if (name == groupNameActionOffice) {
                bFound = true;
              }
            }
            if (!bFound) {
              if (name == m_ownerGroupName || name == m_memberGroupName || name == m_visitorGroupName || name == Audit.Common.Utilities.GetGroupNameQA() || name == Audit.Common.Utilities.GetGroupNameSpecialPerm1() || name == Audit.Common.Utilities.GetGroupNameSpecialPerm2()) {
                bFound = true;
              } else {
                bFound = false;
              }
            }
            if (!bFound) {
              bError = true;
              break;
            }
          }
          for (var z = 0; z < oRequest.arrGroupPermissions.length; z++) {
            var bFound = false;
            var name = oRequest.arrGroupPermissions[z].name;
            for (var y = 0; y < oRequest.item.get_item("ActionOffice").length; y++) {
              var actionOfficeName = oRequest.item.get_item("ActionOffice")[y].get_lookupValue();
              var groupNameActionOffice = Audit.Common.Utilities.GetAOSPGroupName(actionOfficeName);
              if (name == groupNameActionOffice) {
                bFound = true;
              }
            }
            if (!bFound) {
              if (name == m_ownerGroupName || name == m_memberGroupName || name == m_visitorGroupName || name == Audit.Common.Utilities.GetGroupNameQA() || name == Audit.Common.Utilities.GetGroupNameSpecialPerm1() || name == Audit.Common.Utilities.GetGroupNameSpecialPerm2()) {
                bFound = true;
              } else {
                bFound = false;
              }
            }
            if (!bFound) {
              bError = true;
              break;
            }
          }
          if (bError) {
            errToolTip = ' title="User or Group found in this set of Permissions that does not belong" ';
            flagItem = true;
          }
        }
        var styleTag = "";
        if (flagItem) {
          styleTag = ' style="background-color:lightsalmon" ' + errToolTip;
          errorCount++;
        }
        var link = `<a href="javascript:void(0);" onclick='Audit.Permissions.Report.GoToRequest("` + oRequest.number + `")'>` + oRequest.number + "</a>";
        r[++j] = '<tr class="request-perm-item" ';
        r[++j] = styleTag;
        r[++j] = ">";
        r[++j] = '<td class="request-perm-item-number" title="Request number">';
        r[++j] = link;
        r[++j] = "</td>";
        r[++j] = '<td class="request-perm-item-status" title="Request status">';
        r[++j] = status;
        r[++j] = "</td>";
        r[++j] = '<td class="request-perm-item-actionOffices" title="Request action offices">';
        r[++j] = actionOffices;
        r[++j] = "</td>";
        r[++j] = '<td class="request-perm-item-specialPerms" title="Request special permissions?">';
        r[++j] = hasSecialPerms;
        r[++j] = "</td>";
        r[++j] = '<td class="request-perm-item-perms" title="Request permissions">';
        r[++j] = permsDisplay;
        r[++j] = "</td>";
        r[++j] = "</tr>";
      }
      $("#tblRequestsPermissions tbody").append(r.join(""));
      $("#tblRequestsPermsTotal").text(m_arrRequests.length);
      if (errorCount > 0) {
        $("#divErrorMsg").html(
          $("#divErrorMsg").html() + "<div><fieldset><legend>Request Permissions</legend><span class='ui-icon ui-icon-alert'></span>There are (" + errorCount + ") Requests with Permission issues detected</fielset></div>"
        );
      }
      Audit.Common.Utilities.AddOptions(arrRequestIDs, "#ddlRequestID", false);
    }
    function m_fnLoadResponsePermissions() {
      m_arrResponses = new Array();
      var listItemEnumerator = m_responseItems.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        var number = oListItem.get_item("ReqNum");
        if (number != null) {
          number = number.get_lookupValue();
          var responseObject = new Object();
          responseObject["ID"] = oListItem.get_item("ID");
          responseObject["number"] = number;
          responseObject["title"] = oListItem.get_item("Title");
          responseObject["item"] = oListItem;
          responseObject["sample"] = oListItem.get_item("SampleNumber");
          if (responseObject["sample"] == null)
            responseObject["sample"] = "";
          responseObject["actionOffice"] = oListItem.get_item("ActionOffice");
          if (responseObject["actionOffice"] == null)
            responseObject["actionOffice"] = "";
          else
            responseObject["actionOffice"] = responseObject["actionOffice"].get_lookupValue();
          responseObject["resStatus"] = oListItem.get_item("ResStatus");
          m_fnLoadPermsOnItem(responseObject, oListItem);
          m_arrResponses.push(responseObject);
        }
      }
      var arrErrorRequestNoSpecialPerms = new Array();
      var arrErrorResponseHasSpecialPerms = new Array();
      var arrErrorResponseActionOfficeNotInRequest = new Array();
      var errorCount = 0;
      var sTablePermissionsBody = "";
      var r = new Array(), j = -1;
      var responseLength = m_arrResponses.length;
      for (var x = 0; x < responseLength; x++) {
        var oResponse = m_arrResponses[x];
        var number = oResponse.number;
        var title = oResponse.title;
        var status = oResponse.resStatus;
        var actionOffice = oResponse.actionOffice;
        var perms = oResponse.permissionsDisplay;
        var hasSpecialPerms = Audit.Common.Utilities.GetTrueFalseIcon(
          oResponse.hasSpecialPermissions
        );
        var bRequestSpecialPerms = false;
        var requestSpecialPerms = "";
        var arrRequestActionOffices = null;
        var requestActionOffices = "";
        for (var y = 0; y < m_arrRequests.length; y++) {
          if (m_arrRequests[y].number == number) {
            bRequestSpecialPerms = m_arrRequests[y].hasSpecialPermissions;
            requestSpecialPerms = Audit.Common.Utilities.GetTrueFalseIcon(
              m_arrRequests[y].hasSpecialPermissions
            );
            arrRequestActionOffices = m_arrRequests[y].item.get_item("ActionOffice");
            requestActionOffices = m_arrRequests[y].actionOffice;
            break;
          }
        }
        var flagItem = false;
        if (!bRequestSpecialPerms && oResponse.hasSpecialPermissions) {
          flagItem = true;
          arrErrorRequestNoSpecialPerms.push(title);
        }
        if (oResponse.hasSpecialPermissions && status != "4-Approved for QA" && status != "7-Closed") {
          flagItem = true;
          arrErrorResponseHasSpecialPerms.push(title);
        }
        var responseActionOfficeIsInRequest = false;
        for (var y = 0; y < arrRequestActionOffices.length; y++) {
          if (arrRequestActionOffices[y].get_lookupValue() == actionOffice) {
            responseActionOfficeIsInRequest = true;
          }
        }
        if (!responseActionOfficeIsInRequest) {
          flagItem = true;
          arrErrorResponseActionOfficeNotInRequest.push(title);
        }
        var styleTag = "";
        if (flagItem) {
          styleTag = ' style="background-color:lightsalmon" ';
          errorCount++;
        }
        var link = `<a href="javascript:void(0);" onclick='Audit.Permissions.Report.GoToResponse("` + title + `")'>` + title + "</a>";
        requestActionOffices = requestActionOffices.replace(
          actionOffice,
          "<b>" + actionOffice + "</b>"
        );
        r[++j] = '<tr class="response-perm-item" ';
        r[++j] = styleTag;
        r[++j] = ">";
        r[++j] = '<td class="response-perm-item-number" title="Request number" nowrap>';
        r[++j] = number;
        r[++j] = "</td>";
        r[++j] = '<td class="response-perm-item-title" title="Response title" nowrap>';
        r[++j] = link;
        r[++j] = "</td>";
        r[++j] = '<td class="response-perm-item-status" title="Response status" nowrap>';
        r[++j] = status;
        r[++j] = "</td>";
        r[++j] = '<td class="response-perm-item-requestActionOffices" title="Request action offices" nowrap>';
        r[++j] = requestActionOffices;
        r[++j] = "</td>";
        r[++j] = '<td class="response-perm-item-actionOffice" title="Response action office">';
        r[++j] = actionOffice;
        r[++j] = "</td>";
        r[++j] = '<td class="response-perm-item-requestSpecialPerms" title="Special permissions?">';
        r[++j] = requestSpecialPerms;
        r[++j] = "</td>";
        r[++j] = '<td class="response-perm-item-specialPerms" title="Special permissions">';
        r[++j] = hasSpecialPerms;
        r[++j] = "</td>";
        r[++j] = '<td class="response-perm-item-perms" title="Response permissions" nowrap>';
        r[++j] = perms;
        r[++j] = "</td></tr>";
      }
      $("#tblResponsePermissions tbody").append(r.join(""));
      $("#tblResponsePermsTotal").text(m_arrResponses.length);
      if (errorCount > 0) {
        var errorMsg1 = m_fnGetErrorMsg(
          arrErrorRequestNoSpecialPerms,
          "These Responses have Special Permisions, but their Requests do not"
        );
        var errorMsg2 = m_fnGetErrorMsg(
          arrErrorResponseHasSpecialPerms,
          "These Responses have Special Permisions, but their Response Status is NOT '4-Approved for QA' or '7-Closed'"
        );
        var errorMsg3 = m_fnGetErrorMsg(
          arrErrorResponseActionOfficeNotInRequest,
          "These Responses have an Action Office that is not specified in the Request's Action Offices"
        );
        $("#divErrorMsg").html(
          $("#divErrorMsg").html() + "<div style='padding-bottom:5px;'><fieldset><legend>Response Permissions</legend><span class='ui-icon ui-icon-alert'></span>There are (" + errorCount + ") Responses with Permission issues detected." + errorMsg1 + errorMsg2 + errorMsg3 + "</fielset></div>"
        );
      }
    }
    function m_fnLoadResponseFolderPermissions() {
      var m_arrResponseFolders2 = new Array();
      var listItemEnumerator = m_ResponseDocsFoldersItems.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        var folderName = oListItem.get_displayName();
        for (var x = 0; x < m_arrResponses.length; x++) {
          if (m_arrResponses[x].title == folderName) {
            var responseFolderObject = new Object();
            responseFolderObject["title"] = folderName;
            responseFolderObject["response"] = m_arrResponses[x];
            m_fnLoadPermsOnItem(responseFolderObject, oListItem);
            m_arrResponseFolders2.push(responseFolderObject);
            break;
          }
        }
      }
      var arrErrorRequestNoSpecialPerms = new Array();
      var arrErrorResponseHasSpecialPerms = new Array();
      var arrErrorResponseActionOfficeNotInRequest = new Array();
      var errorCount = 0;
      var sTablePermissionsBody = "";
      var r = new Array(), j = -1;
      var resFolderLength = m_arrResponseFolders2.length;
      for (var x = 0; x < resFolderLength; x++) {
        var oResponseFolder = m_arrResponseFolders2[x];
        var number = oResponseFolder.response.number;
        var title = oResponseFolder.response.title;
        var folderName = oResponseFolder.title;
        var status = oResponseFolder.response.resStatus;
        var responseActionOffice = oResponseFolder.response.actionOffice;
        var perms = oResponseFolder.response.permissionsDisplay;
        var hasSpecialPerms = Audit.Common.Utilities.GetTrueFalseIcon(
          oResponseFolder.hasSpecialPermissions
        );
        var responseSpecialPerms = Audit.Common.Utilities.GetTrueFalseIcon(
          oResponseFolder.response.hasSpecialPermissions
        );
        var bRequestSpecialPerms = false;
        var requestSpecialPerms = "";
        var arrRequestActionOffices = null;
        var requestActionOffices = "";
        for (var y = 0; y < m_arrRequests.length; y++) {
          if (m_arrRequests[y].number == number) {
            bRequestSpecialPerms = m_arrRequests[y].hasSpecialPermissions;
            requestSpecialPerms = Audit.Common.Utilities.GetTrueFalseIcon(
              m_arrRequests[y].hasSpecialPermissions
            );
            arrRequestActionOffices = m_arrRequests[y].item.get_item("ActionOffice");
            requestActionOffices = m_arrRequests[y].actionOffice;
            break;
          }
        }
        var flagItem = false;
        if (!bRequestSpecialPerms && oResponseFolder.response.hasSpecialPermissions) {
          flagItem = true;
          arrErrorRequestNoSpecialPerms.push(title);
        }
        if (oResponseFolder.response.hasSpecialPermissions && status != "4-Approved for QA" && status != "7-Closed") {
          flagItem = true;
          arrErrorResponseHasSpecialPerms.push(title);
        }
        var responseActionOfficeIsInRequest = false;
        for (var y = 0; y < arrRequestActionOffices.length; y++) {
          if (arrRequestActionOffices[y].get_lookupValue() == responseActionOffice) {
            responseActionOfficeIsInRequest = true;
          }
        }
        if (!responseActionOfficeIsInRequest) {
          flagItem = true;
          arrErrorResponseActionOfficeNotInRequest.push(title);
        }
        var styleTag = "";
        if (flagItem) {
          styleTag = ' style="background-color:lightsalmon" ';
          errorCount++;
        }
        requestActionOffices = requestActionOffices.replace(
          responseActionOffice,
          "<b>" + responseActionOffice + "</b>"
        );
        r[++j] = '<tr class="responseFolder-perm-item" ';
        r[++j] = styleTag;
        r[++j] = ">";
        r[++j] = '<td class="responseFolder-perm-item-number" title="Request number" nowrap>';
        r[++j] = number;
        r[++j] = "</td>";
        r[++j] = '<td class="responseFolder-perm-item-responseTitle" title="Response title">';
        r[++j] = title;
        r[++j] = "</td>";
        r[++j] = '<td class="responseFolder-perm-item-title" title="Response folder" nowrap>';
        r[++j] = folderName;
        r[++j] = "</td>";
        r[++j] = '<td class="responseFolder-perm-item-status" title="Response status" nowrap>';
        r[++j] = status;
        r[++j] = "</td>";
        r[++j] = '<td class="responseFolder-perm-item-requestActionOffices" title="Request action offices" nowrap>';
        r[++j] = requestActionOffices;
        r[++j] = "</td>";
        r[++j] = '<td class="responseFolder-perm-item-responseActionOffice" title="Response action office" nowrap>';
        r[++j] = responseActionOffice;
        r[++j] = "</td>";
        r[++j] = '<td class="responseFolder-perm-item-requestSpecialPerms" title="Request special permissions?" nowrap>';
        r[++j] = requestSpecialPerms;
        r[++j] = "</td>";
        r[++j] = '<td class="responseFolder-perm-item-responseSpecialPerms" title="Response special permissions?" nowrap>';
        r[++j] = hasSpecialPerms;
        r[++j] = "</td>";
        r[++j] = '<td class="responseFolder-perm-item-specialPerms" title="Response folder special permissions" nowrap>';
        r[++j] = responseSpecialPerms;
        r[++j] = "</td>";
        r[++j] = '<td class="responseFolder-perm-item-perms" title="Folder permissions" nowrap>';
        r[++j] = perms;
        r[++j] = "</td></tr>";
      }
      $("#tblResponseFolderPermissions tbody").append(r.join(""));
      $("#tblResponseFolderPermsTotal").text(m_arrResponseFolders2.length);
      if (errorCount > 0) {
        var errorMsg1 = m_fnGetErrorMsg(
          arrErrorRequestNoSpecialPerms,
          "These Response Folders have Special Permisions, but their Requests do not"
        );
        var errorMsg2 = m_fnGetErrorMsg(
          arrErrorResponseHasSpecialPerms,
          "These Response Folders have Special Permisions, but their Reponse Status is NOT '4-Approved for QA' or '7-Closed'"
        );
        var errorMsg3 = m_fnGetErrorMsg(
          arrErrorResponseActionOfficeNotInRequest,
          "These Response Folders have an Action Office that is not specified in the Request's Action Offices"
        );
        $("#divErrorMsg").html(
          $("#divErrorMsg").html() + "<div style='padding-bottom:5px;'><fieldset><legend>Response Folder Permissions</legend><span class='ui-icon ui-icon-alert'></span>There are (" + errorCount + ") Response Folders with Permission issues detected." + errorMsg1 + errorMsg2 + errorMsg3 + "</fieldset></div>"
        );
      }
    }
    function m_fnGetErrorMsg(arr, msgTitle) {
      var errorMsg = "";
      if (arr.length > 0) {
        errorMsg = "<div style='padding-bottom:5px;'>" + msgTitle + "<ul>";
        for (var x = 0; x < arr.length; x++) {
          errorMsg += "<li>" + arr + "</li>";
        }
        errorMsg += "</ul></div>";
      }
      return errorMsg;
    }
    function m_fnLoadPermsOnItem(item, oListItem) {
      item["UserPermissions"] = new Array();
      item["GroupPermissions"] = new Array();
      item["arrUserPermissions"] = new Array();
      item["arrGroupPermissions"] = new Array();
      var roleAssignments = oListItem.get_roleAssignments();
      var rolesEnumerator = roleAssignments.getEnumerator();
      while (rolesEnumerator.moveNext()) {
        var role = rolesEnumerator.get_current();
        var roleMember = role.get_member();
        var memeberLoginName = roleMember.get_loginName();
        var memberTitleName = roleMember.get_title();
        var permissionType = "UserPermissions";
        var principalType = roleMember.get_principalType();
        if (principalType == SP.Utilities.PrincipalType.securityGroup || principalType == SP.Utilities.PrincipalType.sharePointGroup) {
          permissionType = "GroupPermissions";
        }
        var roleDefs = role.get_roleDefinitionBindings();
        var roleDefsEnumerator = roleDefs.getEnumerator();
        while (roleDefsEnumerator.moveNext()) {
          var rd = roleDefsEnumerator.get_current();
          var rdName = rd.get_name();
          item[permissionType].push(rdName + " - " + memberTitleName);
          var pmObject = new Object();
          pmObject.name = memberTitleName;
          pmObject.permissionLevel = rdName;
          item["arr" + permissionType].push(pmObject);
        }
      }
      var perms = "";
      for (var z = 0; z < item.UserPermissions.length; z++)
        perms += "<div style='white-space:nowrap'>" + item.UserPermissions[z] + "</div>";
      for (var z = 0; z < item.GroupPermissions.length; z++)
        perms += "<div style='white-space:nowrap'>" + item.GroupPermissions[z] + "</div>";
      var specialPerms = false;
      if (perms.indexOf(Audit.Common.Utilities.GetGroupNameSpecialPerm1()) >= 0 && perms.indexOf(Audit.Common.Utilities.GetGroupNameSpecialPerm2()) >= 0) {
        specialPerms = true;
      }
      if (perms != "")
        perms = "<div class='permsLink' style='cursor:pointer' title='Click to view' ><a href='javascript:void(0)'>View</a><div class='permsInfo collapsed'>" + perms + "</div></div>";
      item["permissionsDisplay"] = perms;
      item["hasSpecialPermissions"] = specialPerms;
    }
    function m_fnBindHandlerPermissionLinks() {
      $(".permsLink").click(function() {
        $(this).find(".permsInfo").toggleClass("collapsed");
      });
    }
    function m_fnLoadSPGroupPermissions(OnCompleteLoading) {
      m_arrGroups = new Array();
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      m_collGroup = currCtx.get_web().get_siteGroups();
      currCtx.load(m_collGroup);
      function OnSuccess1(sender, args) {
        m_arrGroups = new Array();
        var listEnumerator = m_collGroup.getEnumerator();
        while (listEnumerator.moveNext()) {
          var item = listEnumerator.get_current();
          var groupName = item.get_title();
          groupName = $.trim(groupName);
          var groupID = item.get_id();
          var oGroup = new Object();
          oGroup["Title"] = groupName;
          oGroup["ID"] = groupID;
          oGroup["Users"] = null;
          m_arrGroups.push(oGroup);
        }
        OnCompleteLoading(true);
      }
      function OnFailure1(sender, args) {
        OnCompleteLoading(true);
      }
      currCtx.executeQueryAsync(OnSuccess1, OnFailure1);
    }
    function m_fnDisplaySPGroupPermissions(itemCollection) {
      m_oAOGroupUsers = new Object();
      $("#linkGetVerification").prop("disabled", true);
      var aos = Audit.Common.Utilities.GetActionOffices();
      var output = "";
      var aoCnt = 0;
      for (var x = 0; x < aos.length; x++) {
        var actionOfficeName = aos[x].title;
        if (actionOfficeName.indexOf("Select Action") > 0)
          continue;
        aoCnt++;
        var groupName = aos[x].userGroup;
        var groupId = "";
        var perms = "";
        if (groupName != null && groupName != "") {
          for (var y = 0; y < m_arrGroups.length; y++) {
            if (m_arrGroups[y].Title == groupName) {
              groupId = m_arrGroups[y].ID;
              break;
            }
          }
        }
        if (groupId != "")
          output += "<tr class='trGroup'><td class='removeOnExport'><input class='cbAO' id='cbAO" + x + "' type='checkbox' style='cursor: pointer;'></td><td class='actionOfficeName'>" + actionOfficeName + `</td><td class='groupName' style='white-space:nowrap'><a href='javascript:void(0)' onclick='Audit.Permissions.Report.ViewSitePermissionsGroup("` + groupId + '","' + groupName + `")'>` + groupName + "</a></td><td class='groupPerms' id='groupPerms" + x + "' ></td></tr>";
        else
          output += "<tr class='trGroup'><td class='removeOnExport'><input class='cbAO' id='cbAO" + x + "' type='checkbox' style='cursor: pointer;'></td><td class='actionOfficeName'>" + actionOfficeName + "</td><td class='groupName' style='white-space:nowrap'></td><td class='groupPerms' id='groupPerms" + x + "' ></td></tr>";
      }
      if (aos.length == 0) {
        output = "<div>0 Action Groups found</div>";
      } else {
        $("#fbody").html(output);
        $("#spanTotalAOS").text(aoCnt);
      }
      $(".cbAO").click(function() {
        var count = 0;
        $(".cbAO").each(function() {
          if ($(this).is(":checked")) {
            count++;
            return;
          }
        });
        if (count > 0)
          $("#linkGetVerification").prop("disabled", false);
        else
          $("#linkGetVerification").prop("disabled", true);
      });
      var cntGroupsToLoad = 0;
      for (var x = 0; x < aos.length; x++) {
        var actionOfficeName = aos[x].title;
        if (actionOfficeName.indexOf("Select Action") > 0)
          continue;
        var groupName = aos[x].userGroup;
        var groupId = null;
        for (var y = 0; y < m_arrGroups.length; y++) {
          if (m_arrGroups[y].Title == groupName) {
            groupId = m_arrGroups[y].ID;
            break;
          }
        }
        if (groupId != null) {
          let onLoadGroupSucceeded = function() {
            var arrPerms = new Array();
            var listEnumerator1 = this.collUser.getEnumerator();
            while (listEnumerator1.moveNext()) {
              var item1 = listEnumerator1.get_current();
              var displayName = item1.get_loginName() + " (" + item1.get_title() + ")";
              arrPerms.push(displayName);
            }
            arrPerms = arrPerms.sort();
            var users = "";
            for (var g = 0; g < arrPerms.length; g++) {
              users += arrPerms[g] + "; ";
            }
            $("#groupPerms" + this.x).html(m_fnGetFriendlyUsers(users));
            m_oAOGroupUsers[this.groupName] = users;
          }, onLoadGroupFailed = function(sender, args) {
          };
          cntGroupsToLoad++;
          var currCtx = new SP.ClientContext.get_current();
          var web = currCtx.get_web();
          var collGroup = web.get_siteGroups();
          var oGroup = collGroup.getById(groupId);
          var collUser = oGroup.get_users();
          currCtx.load(collUser);
          var data = { x, groupName, collUser };
          currCtx.executeQueryAsync(
            Function.createDelegate(data, onLoadGroupSucceeded),
            Function.createDelegate(data, onLoadGroupFailed)
          );
        }
      }
    }
    function m_fnDisplaySPGroupPermissions2(itemCollection) {
      var aos = Audit.Common.Utilities.GetActionOffices();
      var output = "";
      var arrSPGroups = new Array();
      arrSPGroups.push(m_ownerGroupName);
      arrSPGroups.push(m_memberGroupName);
      arrSPGroups.push(m_visitorGroupName);
      arrSPGroups.push(Audit.Common.Utilities.GetGroupNameQA());
      arrSPGroups.push(Audit.Common.Utilities.GetGroupNameEA());
      arrSPGroups.push(Audit.Common.Utilities.GetGroupNameSpecialPerm1());
      arrSPGroups.push(Audit.Common.Utilities.GetGroupNameSpecialPerm2());
      var spGroupCnt = 0;
      for (var x = 0; x < arrSPGroups.length; x++) {
        spGroupCnt++;
        var groupName = arrSPGroups[x];
        var groupId = "";
        var perms = "";
        for (var y = 0; y < m_arrGroups.length; y++) {
          if (m_arrGroups[y].Title == groupName) {
            groupId = m_arrGroups[y].ID;
            break;
          }
        }
        output += `<tr class='trSPGroup'><td class='spgroupName' style='white-space:nowrap'><a href='javascript:void(0)' onclick='Audit.Permissions.Report.ViewSitePermissionsGroup("` + groupId + '","' + groupName + `")'>` + groupName + "</a></td><td class='spgroupPerms' id='spgroupPerms" + x + "' ></td></tr>";
      }
      $("#fbodySPGroups").html(output);
      var cntSPGroupsToLoad = 0;
      for (var x = 0; x < arrSPGroups.length; x++) {
        var groupName = arrSPGroups[x];
        var groupId = null;
        for (var y = 0; y < m_arrGroups.length; y++) {
          if (m_arrGroups[y].Title == groupName) {
            groupId = m_arrGroups[y].ID;
            break;
          }
        }
        if (groupId != null) {
          let onLoadSPGroupSucceeded = function() {
            var arrPerms = new Array();
            var listEnumerator1 = this.collUser.getEnumerator();
            while (listEnumerator1.moveNext()) {
              var item1 = listEnumerator1.get_current();
              var displayName = item1.get_loginName() + " (" + item1.get_title() + ")";
              arrPerms.push(displayName);
            }
            arrPerms = arrPerms.sort();
            var users = "";
            for (var g = 0; g < arrPerms.length; g++) {
              users += arrPerms[g] + "; ";
            }
            $("#spgroupPerms" + this.x).html(m_fnGetFriendlyUsers(users));
          }, onLoadSPGroupFailed = function(sender, args) {
          };
          cntSPGroupsToLoad++;
          var currCtx = new SP.ClientContext.get_current();
          var web = currCtx.get_web();
          var collGroup = web.get_siteGroups();
          var oGroup = collGroup.getById(groupId);
          var collUser = oGroup.get_users();
          currCtx.load(collUser);
          var data = { x, collUser };
          currCtx.executeQueryAsync(
            Function.createDelegate(data, onLoadSPGroupSucceeded),
            Function.createDelegate(data, onLoadSPGroupFailed)
          );
        }
      }
    }
    function m_fnFormatEmailBodyToAOForVerification(m_txtOutgoingEmailText2, group, users) {
      var emailText = m_txtOutgoingEmailText2 + "<br/>Please verify the following users for <b>" + group + "</b><br/><div>" + users + "</div>";
      return emailText;
    }
    var m_emailCount = 0;
    function m_fnGetVerification() {
      m_txtOutgoingEmailText = "";
      var aos = "";
      $(".trGroup").each(function() {
        var cb = $(this).find("input");
        if (cb && cb.is(":checked")) {
          var group = $.trim($(this).find(".groupName").text());
          if (group != null && group != "")
            aos += "<li>" + group + "</li>";
        }
      });
      if (aos == "") {
        notifyId2 = SP.UI.Notify.addNotification(
          "Please select an Action Office",
          false
        );
        return;
      } else {
        aos = "<ul style='color:green'>" + aos + "</ul>";
      }
      var verificationDocDlg = "<div id='verificationDocDlg' style='padding:20px; height:100px'><div style='padding:20px; width:600px'>Are you sure you would like to Email the following Action Offices for Verification?<p style='padding-top:10px'>" + aos + "</p> <p style='padding-top:10px'>If so, please specify any Custom Message to Append to the Outgoing Email Text: </p><p><input id='txtOutgoingEmailText' maxlength='300' size='100' onkeyup='Audit.Permissions.Report.GetEmailText()'></input></p></span></div><table style='padding-top:10px; width:400px; margin:0px auto'><tr><td><input id='btnClientOk1' type='button' class='ms-ButtonHeightWidth' value='Yes Send Email' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK)'/></td><td class='ms-separator'>&#160;</td><td><input id='btnCancel' type='button' class='ms-ButtonHeightWidth' value='Close' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)'/></td></tr></table></div>";
      $("body").append(verificationDocDlg);
      var options = SP.UI.$create_DialogOptions();
      options.title = "Email Action Office for User Verification";
      options.dialogReturnValueCallback = OnCallbackSendVerification;
      options.html = document.getElementById("verificationDocDlg");
      SP.UI.ModalDialog.showModalDialog(options);
    }
    function OnCallbackSendVerification(result, value) {
      if (result === SP.UI.DialogResult.OK) {
        m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
          "Sending Emails",
          "Please wait... Sending Emails",
          200,
          400
        );
        setTimeout(function() {
          m_fnSendVerificationEmails();
        }, 1e3);
      }
    }
    function m_fnSendVerificationEmails() {
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      var emailList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory());
      var emailListQuery = new SP.CamlQuery();
      emailListQuery.set_viewXml(
        '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>'
      );
      var emailListFolderItems = emailList.getItems(emailListQuery);
      currCtx.load(
        emailListFolderItems,
        "Include(ID, FSObjType, Title, DisplayName)"
      );
      function OnSuccess(sender, args) {
        if (!Audit.Common.Utilities.CheckIfEmailFolderExists(
          emailListFolderItems,
          m_emailFolderName
        )) {
          Audit.Common.Utilities.CreateEmailFolder(
            emailList,
            m_emailFolderName,
            null
          );
        }
        m_emailCount = 0;
        $(".trGroup").each(function() {
          var cb = $(this).find("input");
          if (cb && cb.is(":checked")) {
            var group = $.trim($(this).find(".groupName").text());
            if (group != null && group != "")
              m_emailCount++;
          }
        });
        if (m_emailCount == 0) {
          notifyId2 = SP.UI.Notify.addNotification(
            "Please select an Action Office",
            false
          );
          m_waitDialog.close();
        }
        var cnt = 0;
        $(".trGroup").each(function() {
          var cb = $(this).find("input");
          var group = $.trim($(this).find(".groupName").text());
          if (cb && cb.is(":checked") && group != null && group != "") {
            var users = m_oAOGroupUsers[group];
            users = m_fnGetFriendlyUsers(users);
            var emailSubject = "Please review the Audit Tool users for (" + group + ")";
            var emailText = m_fnFormatEmailBodyToAOForVerification(
              m_txtOutgoingEmailText,
              group,
              users
            );
            var itemCreateInfo = new SP.ListItemCreationInformation();
            itemCreateInfo.set_folderUrl(
              location.protocol + "//" + location.host + Audit.Common.Utilities.GetSiteUrl() + "/Lists/" + Audit.Common.Utilities.GetListNameEmailHistory() + "/" + m_emailFolderName
            );
            var oListItemEmail = emailList.addItem(itemCreateInfo);
            oListItemEmail.set_item("Title", emailSubject);
            oListItemEmail.set_item("Body", emailText);
            oListItemEmail.set_item("To", group);
            oListItemEmail.set_item("NotificationType", "AO Verification");
            oListItemEmail.update();
            currCtx.executeQueryAsync(
              function() {
                cnt++;
                if (cnt == m_emailCount) {
                  m_waitDialog.close();
                  notifyId2 = SP.UI.Notify.addNotification(
                    "Completed Sending Email Verifications",
                    false
                  );
                  m_fnUncheckCheckboxes();
                }
              },
              function(sender2, args2) {
                m_waitDialog.close();
                alert(
                  "Request failed: " + args2.get_message() + "\n" + args2.get_stackTrace()
                );
                m_fnRefresh();
              }
            );
          }
        });
      }
      function OnFailure(sender, args) {
        m_waitDialog.close();
      }
      currCtx.executeQueryAsync(OnSuccess, OnFailure);
    }
    function m_fnCheckCheckboxes() {
      $("#linkGetVerification").prop("disabled", false);
      $(".trGroup").each(function() {
        var cb = $(this).find("input");
        if (cb && !cb.is(":checked")) {
          cb.prop("checked", true);
        }
      });
    }
    function m_fnUncheckCheckboxes() {
      $("#linkGetVerification").prop("disabled", true);
      $(".trGroup").each(function() {
        var cb = $(this).find("input");
        if (cb && cb.is(":checked")) {
          cb.prop("checked", false);
        }
      });
    }
    function m_fnGetFriendlyUsers(perms) {
      if (perms == null || perms == "")
        return "";
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
    function LoadDDOptions() {
      var arrResponseRequestID = new Array();
      var arrResponseTitle = new Array();
      $(".request-perm-item-number").each(function() {
        var val = $(this).text();
        if (!Audit.Common.Utilities.ExistsInArr(arrResponseRequestID, val))
          arrResponseRequestID.push(val);
      });
      $(".response-perm-item-title").each(function() {
        var val = $(this).text();
        if (!Audit.Common.Utilities.ExistsInArr(arrResponseTitle, val))
          arrResponseTitle.push(val);
      });
      Audit.Common.Utilities.AddOptions(
        arrResponseRequestID,
        "#ddlResponseRequestID",
        false
      );
      Audit.Common.Utilities.AddOptions(
        arrResponseTitle,
        "#ddlResponseFolderResponseID",
        false
      );
    }
    function m_fnGoToRequest(requestNumber) {
      notifyId2 = SP.UI.Notify.addNotification(
        "Displaying Request (" + requestNumber + ")",
        false
      );
      $("#ddlResponseRequestID").val(requestNumber).change();
      $("#tabs").tabs({ active: 1 });
    }
    function m_fnGoToResponse(responseTitle) {
      notifyId2 = SP.UI.Notify.addNotification(
        "Displaying Response (" + responseTitle + ")",
        false
      );
      $("#ddlResponseFolderResponseID").val(responseTitle).change();
      $("#tabs").tabs({ active: 2 });
    }
    function m_fnBindHandlersOnLoad() {
      m_fnBindPrintButton("#btnPrint", "#divTblOutput");
      m_fnBindExportButton(".export", "GroupPermissions_", "table_Groups");
      m_fnBindHandlerPermissionLinks();
      $("#ddlRequestID").change(function() {
        $("#ddlResponseRequestID").val($(this).val());
        setTimeout(function() {
          FilterRequests();
        }, 10);
      });
      $("#ddlResponseRequestID").change(function() {
        $("#ddlRequestID").val($(this).val());
        setTimeout(function() {
          FilterRequests();
        }, 10);
      });
      $("#ddlResponseFolderResponseID").change(function() {
        setTimeout(function() {
          FilterResponses();
        }, 10);
      });
      $("#linkViewAO").click(function() {
        m_fnViewAOs();
      });
      $("#linkAddAO").click(function() {
        m_fnAddAO();
      });
      $("#linkUploadPermissions").click(function() {
        m_fnUploadPermissions();
      });
      $("#linkGetVerification").click(function() {
        m_fnGetVerification();
      });
      $("#linkEmailHistory").click(function() {
        m_fnViewEmailHistoryFolder();
      });
      $("#linkViewExportFriendly").click(function() {
        $(".removeOnExport").toggle();
        $(".groupPerms").each(function() {
          if ($(this).html().toLowerCase().indexOf("<ul>") >= 0) {
            var friendlyNames = "";
            $(this).find("LI").each(function() {
              var curText = $(this).text();
              var index = curText.indexOf("(");
              if (index >= 0)
                curText = curText.substring(0, index);
              curText = $.trim(curText);
              friendlyNames += curText + ";";
            });
            $(this).html(friendlyNames);
          }
        });
      });
      $("#cbAOAll").click(function() {
        if ($(this).is(":checked"))
          m_fnCheckCheckboxes();
        else
          m_fnUncheckCheckboxes();
      });
    }
    function m_fnViewAOs() {
      var options = SP.UI.$create_DialogOptions();
      options.title = "View Action Office Details";
      options.autoSize = true;
      options.dialogReturnValueCallback = OnCallbackForm;
      options.url = Audit.Common.Utilities.GetSiteUrl() + "/lists/" + Audit.Common.Utilities.GetListNameActionOffices();
      SP.UI.ModalDialog.showModalDialog(options);
    }
    function m_fnAddAO() {
      var formName = "NewForm.aspx";
      var options = SP.UI.$create_DialogOptions();
      options.title = "Add Action Office";
      options.autoSize = true;
      options.dialogReturnValueCallback = OnCallbackForm;
      options.url = Audit.Common.Utilities.GetSiteUrl() + "/lists/" + Audit.Common.Utilities.GetListNameActionOffices() + "/" + formName;
      SP.UI.ModalDialog.showModalDialog(options);
    }
    function FilterRequests() {
      var requestID = $("#ddlRequestID").val();
      $(".request-perm-item").each(function() {
        var hide = false;
        if (!hide && requestID != "" && $.trim($(this).find(".request-perm-item-number").text()) != requestID) {
          hide = true;
        }
        if (hide)
          $(this).hide();
        else
          $(this).show();
      });
      $(".response-perm-item").each(function() {
        var hide = false;
        if (!hide && requestID != "" && $.trim($(this).find(".response-perm-item-number").text()) != requestID) {
          hide = true;
        }
        if (hide)
          $(this).hide();
        else
          $(this).show();
      });
    }
    function FilterResponses() {
      var responseTitle = $("#ddlResponseFolderResponseID").val();
      $(".responseFolder-perm-item").each(function() {
        var hide = false;
        if (!hide && responseTitle != "" && $.trim($(this).find(".responseFolder-perm-item-title").text()) != responseTitle) {
          hide = true;
        }
        if (hide)
          $(this).hide();
        else
          $(this).show();
      });
    }
    function m_fnBindPrintButton(btnPrint, divTbl) {
      var pageTitle = "Audit Site Group Permissions (SharePoint Site)";
      $(btnPrint).on("click", function() {
        PrintPage(pageTitle, divTbl);
      });
    }
    function m_fnBindExportButton(btnExport, fileNamePrefix, tbl) {
      $(btnExport).on("click", function(event) {
        var curDate = (/* @__PURE__ */ new Date()).format("yyyyMMdd");
        ExportToCsv(fileNamePrefix + curDate, tbl);
      });
    }
    function PrintPage(title, container) {
      var curDate = /* @__PURE__ */ new Date();
      var cssLink1 = Audit.Common.Utilities.GetSiteUrl() + "/siteassets/css/tablesorter/style.css?v=" + curDate.format("MM_dd_yyyy");
      var cssLink2 = Audit.Common.Utilities.GetSiteUrl() + "/siteassets/css/audit_styles.css?v=" + curDate.format("MM_dd_yyyy");
      var cssLink3 = Audit.Common.Utilities.GetSiteUrl() + "/siteassets/css/audit_page_reports.css?v=" + curDate.format("MM_dd_yyyy");
      var divOutput = $(container).html();
      var printDateString = curDate.format("MM/dd/yyyy hh:mm tt");
      printDateString = "<div style='padding-bottom:10px;'>" + printDateString + "</div>";
      divOutput = printDateString + divOutput;
      var cssFile1 = $("<div></div>");
      var cssFile2 = $("<div></div>");
      var cssFile3 = $("<div></div>");
      var def1 = $.Deferred();
      var def2 = $.Deferred();
      var def3 = $.Deferred();
      var cssFileText = "";
      cssFile1.load(cssLink1, function() {
        cssFileText += "<style>" + cssFile1.html() + "</style>";
        def1.resolve();
      });
      cssFile2.load(cssLink2, function() {
        cssFileText += "<style>" + cssFile2.html() + "</style>";
        def2.resolve();
      });
      cssFile3.load(cssLink3, function() {
        cssFileText += "<style>" + cssFile3.html() + "</style>";
        def3.resolve();
      });
      $.when(def1, def2, def3).done(function() {
        var html2 = "<HTML>\n<HEAD>\n\n<Title>" + title + "</Title>\n" + cssFileText + "\n<style>.hideOnPrint {display:none}</style>\n</HEAD>\n<BODY>\n" + divOutput + "\n</BODY>\n</HTML>";
        var printWP = window.open("", "printWebPart");
        printWP.document.open();
        printWP.document.write(html2);
        printWP.document.close();
        printWP.print();
      });
    }
    function ExportToCsv(fileName, tableName, removeHeader) {
      var data = GetCellValues(tableName);
      if (removeHeader == true)
        data = data.slice(1);
      var csv = ConvertToCsv(data);
      if (navigator.userAgent.search("Trident") >= 0) {
        window.CsvExpFrame.document.open("text/html", "replace");
        window.CsvExpFrame.document.write(csv);
        window.CsvExpFrame.document.close();
        window.CsvExpFrame.focus();
        window.CsvExpFrame.document.execCommand(
          "SaveAs",
          true,
          fileName + ".csv"
        );
      } else {
        var uri = "data:text/csv;charset=utf-8," + escape(csv);
        var downloadLink = document.createElement("a");
        downloadLink.href = uri;
        downloadLink.download = fileName + ".csv";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    }
    function GetCellValues(tableName) {
      var table = document.getElementById(tableName);
      var tableArray = [];
      for (var r = 0, n = table.rows.length; r < n; r++) {
        tableArray[r] = [];
        for (var c = 0, m = table.rows[r].cells.length; c < m; c++) {
          var text = table.rows[r].cells[c].textContent || table.rows[r].cells[c].innerText;
          tableArray[r][c] = text.trim();
        }
      }
      return tableArray;
    }
    function ConvertToCsv(objArray) {
      var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
      var str = "sep=,\r\n";
      var line = "";
      var index;
      var value;
      for (var i = 0; i < array.length; i++) {
        line = "";
        var array1 = array[i];
        for (index in array1) {
          if (array1.hasOwnProperty(index)) {
            value = array1[index] + "";
            line += '"' + value.replace(/"/g, '""') + '",';
          }
        }
        line = line.slice(0, -1);
        str += line + "\r\n";
      }
      return str;
    }
    function m_fnViewSitePermissionsGroup(groupID, groupName) {
      var vPermGroup = window.open(
        location.protocol + "//" + location.host + Audit.Common.Utilities.GetSiteUrl() + "/_layouts/people.aspx?MembershipGroupId=" + groupID + "&IsDlg=1"
      );
      setTimeout(function() {
        vPermGroup.document.title = "Group: " + groupName;
      }, 2e3);
    }
    function m_fnViewEmailHistoryFolder() {
      var options = SP.UI.$create_DialogOptions();
      options.title = "View Email History";
      options.autoSize = true;
      options.dialogReturnValueCallback = OnCallbackForm;
      options.url = Audit.Common.Utilities.GetSiteUrl() + "/SitePages/AuditEmailHistory.aspx?RootFolder=" + Audit.Common.Utilities.GetSiteUrl() + "/Lists/" + Audit.Common.Utilities.GetListNameEmailHistory() + "/" + m_emailFolderName;
      SP.UI.ModalDialog.showModalDialog(options);
    }
    function m_fnUploadPermissions() {
      var options = SP.UI.$create_DialogOptions();
      options.title = "Upload Permissions";
      options.height = "800";
      options.autoSize = true;
      options.dialogReturnValueCallback = OnCallbackForm;
      options.url = Audit.Common.Utilities.GetSiteUrl() + "/SitePages/AuditUpdateSiteGroups.aspx";
      SP.UI.ModalDialog.showModalDialog(options);
    }
    function OnCallbackFormNoRefresh(result, value) {
    }
    function OnCallbackFormAutoRefresh(result, value) {
      m_fnRefresh();
    }
    function OnCallbackForm(result, value) {
      if (result === SP.UI.DialogResult.OK) {
        m_fnRefresh();
      }
    }
    var publicMembers = {
      GoToRequest: function(requestNum) {
        m_fnGoToRequest(requestNum);
      },
      GoToResponse: function(responseTitle) {
        m_fnGoToResponse(responseTitle);
      },
      ViewSitePermissionsGroup: function(groupID, groupName) {
        m_fnViewSitePermissionsGroup(groupID, groupName);
      },
      GetEmailText: function() {
        m_txtOutgoingEmailText = $("#txtOutgoingEmailText").val();
        return m_txtOutgoingEmailText;
      },
      Refresh: m_fnRefresh
    };
    return publicMembers;
  };
})();
//# sourceMappingURL=permissions.js.map
