(() => {
  // src/common/utilities.js
  window.Audit = window.Audit || {};
  Audit.Common = Audit.Common || {};
  function InitReport() {
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
    var m_libTitleResponseDocsEA = "AuditResponseDocsEA";
    var m_libNameResponseDocsEA = "AuditResponseDocsEA";
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
      $("#divLoading").text("Loaded at " + curDate.format("MM/dd/yyyy hh:mm tt"));
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
      oNewEmailFolder = list.addItem(itemCreateInfo);
      oNewEmailFolder.set_item("Title", requestNumber);
      oNewEmailFolder.update();
      this.currentUser = web.get_currentUser();
      this.ownerGroup = web.get_associatedOwnerGroup();
      this.memberGroup = web.get_associatedMemberGroup();
      this.visitorGroup = web.get_associatedVisitorGroup();
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
        options.url = Audit.Common.Utilities.GetSiteUrl() + "/pages/AuditUserManuals.aspx?FilterField1=DocType&FilterValue1=" + docType;
      else
        options.url = Audit.Common.Utilities.GetSiteUrl() + "/pages/AuditUserManuals.aspx";
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

  // src/pages/update_site_groups/update_site_groups.js
  window.Audit = window.Audit || {};
  Audit.BulkUpdateUsers = Audit.BulkUpdateUsers || {};
  var html = String.raw;
  document.getElementById("app").innerHTML = html`
  <div class="audit">
    <div id="divLoadSettings" style="display: none">
      <fieldset>
        <legend>Update SharePoint Group Users</legend>
        <div style="padding-top: 10px">
          <a href="javascript:void" id="btnUploadUsers"
            ><span class="ui-icon ui-icon-gear"></span>Click Here to Upload
            Users</a
          >
        </div>
        <div style="padding-top: 10px">
          <a href="javascript:void" id="btnLoadUsers" style="display: none"
            >Click Here to Display Uploaded Users</a
          >
        </div>
      </fieldset>
    </div>
    <div id="tblUnfoundUsers" style="padding-top: 15px; color: red"></div>
    <div id="divLoadBulkUsersOutput" style="padding-top: 15px"></div>
    <div style="padding-top: 15px">
      <a
        href="javascript:void"
        id="btnCreateUsers"
        style="display: none"
        title="Click here to Update Site Groups"
        ><span class="ui-icon ui-icon-disk"></span>Click Here to Create
        SharePoint Groups or Update the SharePoint Groups with the Users
        Listed</a
      >
    </div>
  </div>
`;
  if (document.readyState === "ready" || document.readyState === "complete") {
    InitReport2();
  } else {
    document.onreadystatechange = () => {
      if (document.readyState === "complete" || document.readyState === "ready") {
        ExecuteOrDelayUntilScriptLoaded(function() {
          SP.SOD.executeFunc("sp.js", "SP.ClientContext", InitReport2);
        }, "sp.js");
      }
    };
  }
  function InitReport2() {
    Audit.BulkUpdateUsers.Report = new Audit.BulkUpdateUsers.Load();
    Audit.BulkUpdateUsers.Init();
  }
  Audit.BulkUpdateUsers.Init = function() {
  };
  Audit.BulkUpdateUsers.Load = function() {
    var m_listViewId = null;
    var m_arrGroups = new Array();
    var m_ownerGroupName = null;
    var m_memberGroupName = null;
    var m_visitorGroupName = null;
    var m_arrBulkUsers;
    var collGroup;
    var notifyId2;
    LoadInfo();
    function LoadInfo() {
      $("#divTblOutput").html("");
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      collGroup = currCtx.get_web().get_siteGroups();
      currCtx.load(collGroup);
      currCtx.load(collGroup, "Include(Users)");
      var m_bulkPermissionsList = currCtx.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetListNameBulkPermissions());
      var m_view = m_bulkPermissionsList.get_views().getByTitle("All Items");
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
    function m_fnLoadSiteGroups(collGroup2) {
      m_arrGroups = new Array();
      var listEnumerator = collGroup2.getEnumerator();
      while (listEnumerator.moveNext()) {
        var item = listEnumerator.get_current();
        var groupName = item.get_title();
        groupName = $.trim(groupName);
        var groupID = item.get_id();
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
      options.url = Audit.Common.Utilities.GetSiteUrl() + "/Lists/" + Audit.Common.Utilities.GetListNameBulkPermissions() + "/AllItems.aspx?ShowInGrid=True&View=%7B" + guid + "%7D";
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
      var bulkPermissionsList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleBulkPermissions());
      var bulkPermissionsQuery = new SP.CamlQuery();
      bulkPermissionsQuery.set_viewXml(
        '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'
      );
      var bulkPermissionsItems = bulkPermissionsList.getItems(bulkPermissionsQuery);
      currCtx.load(bulkPermissionsItems, "Include(ID, Title, UserNames)");
      function OnSuccess(sender, args) {
        var listItemEnumerator = bulkPermissionsItems.getEnumerator();
        while (listItemEnumerator.moveNext()) {
          var oListItem = listItemEnumerator.get_current();
          var id = oListItem.get_item("ID");
          var groupName = oListItem.get_item("Title");
          if (groupName != null)
            groupName = $.trim(groupName);
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
              sInvalidReason = "SharePoint Group not found. An attempt to create it will be made when clicking save below";
            }
          }
          bulkObject["isValid"] = bIsValid;
          bulkObject["invalidReason"] = sInvalidReason;
          m_arrBulkUsers.push(bulkObject);
        }
        var hasOneValid = false;
        var output = "<table class='tablesorter report' id='outputTable'><tr><thead><th>SharePoint Group</th><th>Current User Names</th><th>Replace Users with</th></thead></tr>";
        for (var x = 0; x < m_arrBulkUsers.length; x++) {
          var oBulkItem = m_arrBulkUsers[x];
          if (oBulkItem.isValid) {
            output += "<tr id='tableRow" + x + "'><td id='tdGroup" + x + "'>" + oBulkItem.groupName + "</td><td>" + m_fnGetFriendlyUsers(oBulkItem.existingUserNames) + "</td><td>" + m_fnGetFriendlyUsers(oBulkItem.newUserNames) + "</td></tr>";
            hasOneValid = true;
          } else {
            output += "<tr id='tableRow" + x + "' style='background-color:lemonchiffon; font-style:italic;' title='" + oBulkItem.invalidReason + "'><td>" + oBulkItem.groupName + " - " + oBulkItem.invalidReason + "</td><td>" + m_fnGetFriendlyUsers(oBulkItem.existingUserNames) + "</td><td>" + m_fnGetFriendlyUsers(oBulkItem.newUserNames) + "</td></tr>";
          }
        }
        $("#divLoadBulkUsersOutput").html(output += "</table>");
        if (m_arrBulkUsers.length == 0) {
          $("#divLoadBulkUsersOutput").html("");
          return;
        }
        $("#btnCreateUsers").show();
        $("#tblUnfoundUsers").html("");
        m_fnCheckUsersAreValid();
      }
      function OnFailure(sender, args) {
        statusId = SP.UI.Status.addStatus(
          "Unable to load from the Bulk Upload List: " + args.get_message() + "\n" + args.get_stackTrace()
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
              let OnSuccess = function(sender, args) {
                m_countRan++;
                if (this.result && this.result.get_loginName() != null && this.result.get_loginName() != "") {
                  var loginName = this.result.get_loginName();
                  var userDisplayName2 = this.userDisplayName;
                } else {
                  var userDisplayName2 = this.userDisplayName;
                  var curunfound = $("#tblUnfoundUsers").html();
                  curunfound += "<div>" + userDisplayName2 + "</div>";
                  if ($("#tblUnfoundUsers").html() == "") {
                    $("#tblUnfoundUsers").html(
                      "<div>These users were not found and will be skipped:</div>" + curunfound
                    );
                  } else
                    $("#tblUnfoundUsers").html(curunfound);
                  m_curOutput = m_curOutput.split("<LI>" + userDisplayName2 + "</LI>").join("");
                  m_arrUnfoundUsers.push(userDisplayName2);
                }
                if (m_countToRun == m_countRan) {
                  $("#divLoadBulkUsersOutput").html(m_curOutput);
                  m_fnUpdatePermsToAdd();
                }
              }, OnFailure = function(sender, args) {
                var userDisplayName2 = this.userDisplayName;
                var curunfound = $("#tblUnfoundUsers").html();
                curunfound += "<div>" + userDisplayName2 + "</div>";
                $("#tblUnfoundUsers").html(curunfound);
                m_curOutput = m_curOutput.split("<LI>" + userDisplayName2 + "</LI>").join("");
                m_arrUnfoundUsers.push(userDisplayName2);
                m_countRan++;
                if (m_countToRun == m_countRan) {
                  $("#divLoadBulkUsersOutput").html(m_curOutput);
                  m_fnUpdatePermsToAdd();
                }
                alert(error);
              };
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
              var data = { userDisplayName, result };
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
              oBulkItem.newUserNames = oBulkItem.newUserNames.split(username + ";").join("");
              oBulkItem.newUserNames = oBulkItem.newUserNames.split(username).join("");
            }
          }
        }
      }
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
    var m_countToCreate = 0;
    var m_countCreated = 0;
    function m_fnCreateUsers() {
      if (confirm(
        "Are you sure you would like to Create or Update the SharePoint Groups? If Creating a Group, please re-run after the operation completed. If updating a Group, this action will replace ALL existing users in the Groups"
      )) {
        $("#btnCreateUsers").hide();
        document.body.style.cursor = "wait";
        notifyId2 = SP.UI.Notify.addNotification("Please wait... ", false);
        for (var x = 0; x < m_arrBulkUsers.length; x++) {
          var oBulkItem = m_arrBulkUsers[x];
          if (!oBulkItem.isValid) {
            let OnSuccessCreateGroup = function(sender, args) {
              var currCtx2 = new SP.ClientContext.get_current();
              var newCreateGroup = collGroup2.add(this.group);
              var rolDef = web.get_roleDefinitions().getByName("Restricted Read");
              var rolDefColl = SP.RoleDefinitionBindingCollection.newObject(currCtx2);
              rolDefColl.add(rolDef);
              var roleAssignments = web.get_roleAssignments();
              roleAssignments.add(newCreateGroup, rolDefColl);
              newCreateGroup.set_allowMembersEditMembership(false);
              newCreateGroup.set_onlyAllowMembersViewMembership(false);
              newCreateGroup.set_owner(
                currCtx2.get_web().get_associatedOwnerGroup()
              );
              newCreateGroup.update();
              collGroup2 = currCtx2.get_web().get_siteGroups();
              currCtx2.load(collGroup2);
              currCtx2.load(collGroup2, "Include(Users)");
              function OnSuccessUpdateGroupProps(sender2, args2) {
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
                  "<span class='ui-icon ui-icon-check'></span> " + $("#tdGroup" + this.tableRowId).text()
                );
                if (m_countToCreate == m_countCreated) {
                  document.body.style.cursor = "default";
                  notifyId2 = SP.UI.Notify.addNotification("Completed", false);
                  m_fnLoadSiteGroups(this.collGroup);
                }
              }
              function OnFailureUpdateGroupProps(sender2, args2) {
                m_countCreated++;
                $("#tableRow" + this.tableRowId).attr(
                  "style",
                  "background-color:salmon"
                );
                $("#tableRow" + this.tableRowId).attr(
                  "title",
                  args2.get_message()
                );
                $("#tdGroup" + this.tableRowId).html(
                  $("#tdGroup" + this.tableRowId).text() + " - " + args2.get_message()
                );
                if (m_countToCreate == m_countCreated) {
                  document.body.style.cursor = "default";
                  notifyId2 = SP.UI.Notify.addNotification(
                    "Error occurred",
                    false
                  );
                }
              }
              var data2 = { tableRowId: this.tableRowId, collGroup: collGroup2 };
              currCtx2.executeQueryAsync(
                Function.createDelegate(data2, OnSuccessUpdateGroupProps),
                Function.createDelegate(data2, OnFailureUpdateGroupProps)
              );
            }, OnFailureCreateGroup = function(sender, args) {
              $("#tableRow" + this.tableRowId).attr(
                "style",
                "background-color:salmon"
              );
              $("#tableRow" + this.tableRowId).attr("title", args.get_message());
              $("#tdGroup" + this.tableRowId).html(
                $("#tdGroup" + this.tableRowId).text() + " - " + args.get_message()
              );
              m_countCreated++;
              if (m_countToCreate == m_countCreated) {
                document.body.style.cursor = "default";
                notifyId2 = SP.UI.Notify.addNotification("Completed", false);
              }
            };
            m_countToCreate++;
            var currCtx = new SP.ClientContext.get_current();
            var web = currCtx.get_web();
            var collGroup2 = currCtx.get_web().get_siteGroups();
            var newGRP = new SP.GroupCreationInformation();
            newGRP.set_title(oBulkItem.groupName);
            var data = { tableRowId: x, group: newGRP };
            currCtx.executeQueryAsync(
              Function.createDelegate(data, OnSuccessCreateGroup),
              Function.createDelegate(data, OnFailureCreateGroup)
            );
          }
          if (oBulkItem.isValid) {
            let OnSuccess = function(sender, args) {
              $("#tableRow" + this.tableRowId).attr(
                "style",
                "background-color:palegreen"
              );
              $("#tableRow" + this.tableRowId).attr("title", "Created");
              $("#tdGroup" + this.tableRowId).html(
                "<span class='ui-icon ui-icon-check'></span> " + $("#tdGroup" + this.tableRowId).text()
              );
              var currCtx2 = new SP.ClientContext.get_current();
              var itemId = m_arrBulkUsers[this.tableRowId].ID;
              var targetList = currCtx2.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetListNameBulkPermissions());
              var targetListItem = targetList.getItemById(itemId);
              targetListItem.deleteObject();
              currCtx2.executeQueryAsync(
                function() {
                },
                function() {
                }
              );
              m_countCreated++;
              if (m_countToCreate == m_countCreated) {
                document.body.style.cursor = "default";
                notifyId2 = SP.UI.Notify.addNotification("Completed", false);
              }
            }, OnFailure = function(sender, args) {
              $("#tableRow" + this.tableRowId).attr(
                "style",
                "background-color:salmon"
              );
              $("#tableRow" + this.tableRowId).attr("title", args.get_message());
              $("#tdGroup" + this.tableRowId).html(
                $("#tdGroup" + this.tableRowId).text() + " - " + args.get_message()
              );
              m_countCreated++;
              if (m_countToCreate == m_countCreated) {
                document.body.style.cursor = "default";
                notifyId2 = SP.UI.Notify.addNotification("Completed", false);
              }
            };
            m_countToCreate++;
            var currCtx = new SP.ClientContext.get_current();
            var web = currCtx.get_web();
            var collGroup2 = web.get_siteGroups();
            var oGroup = collGroup2.getById(oBulkItem.SPGroupID);
            oGroup.set_allowMembersEditMembership(false);
            oGroup.set_onlyAllowMembersViewMembership(false);
            oGroup.set_owner(currCtx.get_web().get_associatedOwnerGroup());
            oGroup.update();
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
      $("#btnUploadUsers").click(function() {
        m_fnUploadUsers();
      });
      $("#btnLoadUsers").click(function() {
        m_fnLoadBulkUsers();
      });
      $("#btnCreateUsers").click(function() {
        m_fnCreateUsers();
      });
    }
    function OnCallbackForm(result2, value) {
      m_fnLoadBulkUsers();
    }
    var publicMembers = {
      Refresh: m_fnRefresh
    };
    return publicMembers;
  };
})();
//# sourceMappingURL=update_site_groups.js.map
