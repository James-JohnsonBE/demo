window.Audit = window.Audit || {};
Audit.Common = Audit.Common || {};

function InitReport() {
  Audit.Common.Utilities = new Audit.Common.NewUtilities();
  Audit.Common.Init();
}

Audit.Common.Init = function () {};

Audit.Common.NewUtilities = function () {
  var m_siteUrl = _spPageContextInfo.webServerRelativeUrl; //IE11 in sp 2013 does not recognize L_Menu_BaseUrl

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
  /**
   * Reloads the page, trys to preserve current path
   * @param {bool} hard flag to remove all url params
   * @returns
   */
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
      } catch (ex) {}

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
    var curDate = new Date();
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
        if (
          $("#ddlResponseName option[value='" + paramResponseNum + "']")
            .length > 0
        ) {
          $("#ddlResponseName").val(paramResponseNum).change();
          bFiltered = true;
        }
      } else {
        if (
          $("#ddlResponsesOpen option[value='" + paramResponseNum + "']")
            .length > 0
        ) {
          $("#ddlResponsesOpen").val(paramResponseNum).change();
        } else if (
          $("#ddlResponsesProcessed option[value='" + paramResponseNum + "']")
            .length > 0
        ) {
          $("#ddlResponsesProcessed").val(paramResponseNum).change();
        }
      }
    }

    if (!bFiltered) {
      $(".sr-response-item").show(); //hiding rows by default
    }
  }

  function m_fnOnLoadFilterResponses(responseStatus1, responseStatus2) {
    var count = 0;
    var cntOpen = 0;
    var cntReOpened = 0;
    var resStatus1 = 0;
    var resStatus2 = 0;

    var eacher = $(".sr-response-item");

    eacher.each(function () {
      var reqStatus = $.trim($(this).find(".sr-response-requestStatus").text());
      var resStatus = $.trim($(this).find(".sr-response-status").text());

      if (
        (resStatus == responseStatus1 || resStatus == responseStatus2) &&
        (reqStatus == "Open" || reqStatus == "ReOpened")
      ) {
        $(this).addClass("highlighted");
        count++;

        if (resStatus == responseStatus1) resStatus1++;
        else if (resStatus == responseStatus2) resStatus2++;

        if (reqStatus == "Open") cntOpen++;
        else if (reqStatus == "ReOpened") cntReOpened++;
      }
    });

    if (count > 0) {
      $("#lblStatusReportResponsesMsg").html(
        "<span class='ui-icon ui-icon-alert'></span>There are " +
          count +
          " Responses pending your review"
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
      } else userGroup = "";

      var aoObject = new Object();
      aoObject["ID"] = id;
      aoObject["title"] = title;
      aoObject["userGroup"] = userGroup;

      m_arrAOs.push(aoObject);
    }
  }

  function m_fnGetAOSPGroupName(groupName) {
    //finds the group name corresponding to the lookup field selected
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
    if (
      item == null ||
      groupName == "" ||
      groupName == null ||
      permissionLevel == null
    )
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

              if (
                memberTitleName == groupName &&
                rd.get_basePermissions().has(permissionLevel)
              ) {
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
      $("#ddlResponsesOpen > option").each(function () {
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
        $("#ddlResponsesProcessed > option").each(function () {
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
        "font-style": "italic",
      };
    return styleTag;
    //			styleTag = " style='background-color:Gainsboro; font-style:italic' title='Marked for Deletion by the Action Office' ";
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
      styleTag =
        " style='background-color:Gainsboro; font-style:italic' title='Marked for Deletion by the Action Office' ";

    return styleTag;
  }

  function m_fnCheckIfEmailFolderExists(items, requestNumber) {
    //Check if folder exists in email library
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

    //add associated site groups
    oNewEmailFolder
      .get_roleAssignments()
      .add(ownerGroup, roleDefBindingCollAdmin);
    oNewEmailFolder
      .get_roleAssignments()
      .add(memberGroup, roleDefBindingCollContribute);
    oNewEmailFolder
      .get_roleAssignments()
      .add(visitorGroup, roleDefBindingCollRestrictedRead);

    var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup(
      Audit.Common.Utilities.GetGroupNameQA()
    );
    if (spGroupQA != null)
      oNewEmailFolder
        .get_roleAssignments()
        .add(spGroupQA, roleDefBindingCollRestrictedContribute);

    oNewEmailFolder
      .get_roleAssignments()
      .getByPrincipal(currentUser)
      .deleteObject();

    //Need to break up adding AOs because it exceeds the resource limit (request uses too many resources)
    function onUpdatePermsSucceeded() {
      if (this.requestItem) {
        //this will be null when sending from permissions page
        //add action offices
        var arrActionOffice = this.requestItem.get_item("ActionOffice");
        if (arrActionOffice == null || arrActionOffice.length == 0) {
          if (this.OnComplete) this.OnComplete(true);
          return;
        }

        for (var x = 0; x < arrActionOffice.length; x++) {
          var actionOfficeName = arrActionOffice[x].get_lookupValue();

          var actionOfficeGroupName =
            Audit.Common.Utilities.GetAOSPGroupName(actionOfficeName);
          var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup(
            actionOfficeGroupName
          );

          if (actionOfficeGroup != null) {
            m_cntAddToEmailFolder++;

            var currCtx2 = new SP.ClientContext.get_current();
            var web2 = currCtx2.get_web();

            var roleDefBindingCollRestrictedContribute =
              SP.RoleDefinitionBindingCollection.newObject(currCtx2);
            roleDefBindingCollRestrictedContribute.add(
              web2.get_roleDefinitions().getByName("Restricted Contribute")
            );

            this.oNewEmailFolder
              .get_roleAssignments()
              .add(actionOfficeGroup, roleDefBindingCollRestrictedContribute);

            function onUpdateAOPermsSucceeded() {
              m_cntAddedToEmailFolder++;
              if (m_cntAddedToEmailFolder == m_cntAddToEmailFolder) {
                if (this.OnComplete) this.OnComplete(true);
              }
            }
            function onUpdateAOPermsFailed(sender, args) {
              m_cntAddedToEmailFolder++;
              if (m_cntAddedToEmailFolder == m_cntAddToEmailFolder) {
                if (this.OnComplete) this.OnComplete(true);
              }
            }
            var data = { OnComplete: this.OnComplete };
            currCtx2.executeQueryAsync(
              Function.createDelegate(data, onUpdateAOPermsSucceeded),
              Function.createDelegate(data, onUpdateAOPermsFailed)
            );
          }
        }
      } else {
        if (this.OnComplete) this.OnComplete(true);
      }
    }

    function onUpdatePermsFailed(sender, args) {
      statusId = SP.UI.Status.addStatus(
        "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
      );
    }

    var data = {
      /*item: oListItem, */ requestItem: requestItem,
      oNewEmailFolder: oNewEmailFolder,
      OnComplete: OnComplete,
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

    if (aTitle == null) aTitle = "";
    if (bTitle == null) bTitle = "";

    var aIndex = aTitle.lastIndexOf("-");
    if (aIndex >= 0) {
      var subA = aTitle.substring(0, aIndex + 1);
      var lastA = aTitle.replace(subA, "");
      var intA = parseInt(lastA, 10);
      var newIntA = Audit.Common.Utilities.PadDigits(intA, 5);
      newA = subA + newIntA;
    } else newA = aTitle;

    var bIndex = bTitle.lastIndexOf("-");
    if (bIndex >= 0) {
      var subB = bTitle.substring(0, bIndex + 1);
      var lastB = bTitle.replace(subB, "");
      var intB = parseInt(lastB, 10);
      var newIntB = Audit.Common.Utilities.PadDigits(intB, 5);
      newB = subB + newIntB;
    } else newB = bTitle;

    return newA.toLowerCase().localeCompare(newB.toLowerCase());
  }

  function m_fnSortResponseObjectNoCase(a, b) {
    var aTitle = a.title;
    var bTitle = b.title;
    var newA;
    var newB;
    if (aTitle == null) aTitle = "";
    if (bTitle == null) bTitle = "";

    var aIndex = aTitle.lastIndexOf("-");
    if (aIndex >= 0) {
      var subA = aTitle.substring(0, aIndex + 1);
      var lastA = aTitle.replace(subA, "");
      var intA = parseInt(lastA, 10);
      var newIntA = Audit.Common.Utilities.PadDigits(intA, 5);
      newA = subA + newIntA;
    } else newA = aTitle;

    var bIndex = bTitle.lastIndexOf("-");
    if (bIndex >= 0) {
      var subB = bTitle.substring(0, bIndex + 1);
      var lastB = bTitle.replace(subB, "");
      var intB = parseInt(lastB, 10);
      var newIntB = Audit.Common.Utilities.PadDigits(intB, 5);
      newB = subB + newIntB;
    } else newB = bTitle;

    return newA.toLowerCase().localeCompare(newB.toLowerCase());
  }

  function m_fnSortNoCase(a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  }

  function m_fnSortDate(a, b) {
    if (a == "") return -1;
    if (b == "") return 1;
    return new Date(a).getTime() - new Date(b).getTime();
  }

  //Adds the values in the arr array to the drop down with the specified id
  function m_fnAddOptions(arr, ddlID, dateSort, responseSort) {
    if (arr == null) return;
    if (responseSort) arr.sort(m_fnSortResponseTitleNoCase);
    else if (!dateSort) arr.sort(m_fnSortNoCase);
    else arr.sort(m_fnSortDate);

    var rOptions = new Array(),
      j = -1;
    rOptions[++j] = "<option value=''>-Select-</option>";

    var arrLength = arr.length;

    /*	var fragment = document.createDocumentFragment();
			var choice = document.createElement('option');
			choice.value = "";
			choice.innerHTML = "-Select-";
			fragment.appendChild(choice);
		*/
    for (var x = 0; x < arrLength; x++) {
      var option = $.trim(arr[x]);

      rOptions[++j] = "<option value='" + option + "'>" + option + "</option>";

      /*	
			var choice = document.createElement('option');
	        choice.value = option;
	        choice.innerHTML = option;
	        fragment.appendChild(choice);*/
    }

    //ddlID = ddlID.replace("#", "");
    //document.getElementById(ddlID).innerHTML = rOptions.join('');

    var thisDDL = $(ddlID);
    thisDDL.empty().append(rOptions.join(""));
    /*var thisDDL = $(ddlID);
		thisDDL.empty().html( fragment );*/
  }

  function m_fnExistsInArr(arr, val) {
    if (arr == null) return false;

    var arrLength = arr.length;
    for (var x = 0; x < arrLength; x++) {
      if (arr[x] == val) return true;
    }
    return false;
  }

  function m_fnGetTrueFalseIcon(val) {
    if (val == true)
      return "<span class='ui-icon ui-icon-check'>" + val + "</span>";
    else return "<span class='ui-icon ui-icon-close'>" + val + "</span>";
  }

  function m_fnGetFriendlyDisplayName(oListItem, fieldName) {
    var user = oListItem.get_item(fieldName);
    if (user == null) return "";
    else return user.get_lookupValue();
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
    return (
      Math.round(num * Math.pow(10, decimals) + sign * 0.001) /
      Math.pow(10, decimals)
    ).toFixed(decimals);
  }

  function m_fnGetFriendlyFileSize(fileSize) {
    if (fileSize == null || fileSize == "") return "";

    if (fileSize > 1048576) {
      fileSize =
        Audit.Common.Utilities.PreciseRound(fileSize / 1048576, 2) + " MB";
    } else if (fileSize > 1024) {
      fileSize =
        Audit.Common.Utilities.PreciseRound(fileSize / 1024, 2) + " KB";
    } else {
      fileSize += " B";
    }
    return fileSize;
  }

  function m_fnISODateString(d) {
    function pad(n) {
      return n < 10 ? "0" + n : n;
    }

    return (
      d.getUTCFullYear() +
      "-" +
      pad(d.getUTCMonth() + 1) +
      "-" +
      pad(d.getUTCDate()) +
      "T" +
      pad(d.getUTCHours()) +
      ":" +
      pad(d.getUTCMinutes()) +
      ":" +
      pad(d.getUTCSeconds()) +
      "Z"
    );
  }

  function m_fnBindHandlerResponseDoc() {
    $(".requestInfo-response-doc img").click(function (event) {
      event.preventDefault();
      var curIcon = $(this).attr("src");
      if (curIcon == "/_layouts/images/minus.gif")
        $(this).attr("src", "/_layouts/images/plus.gif");
      else $(this).attr("src", "/_layouts/images/minus.gif");

      //$(this).nextUntil('tr.Grouping').slideToggle(200);
      $(this)
        .parent()
        .parent()
        .nextUntil("tr.requestInfo-response-doc")
        .each(function () {
          $(this).toggleClass("collapsed");
        });
    });
  }

  /************
	Notice - for some reason, when the list item opens in a dialog or not in the dialog, it renders differently causing the values to get back data differently
	********/
  /*
	function m_fnGetLookupFieldText( fieldName )
	{
		var field = $( "select[title='" + fieldName  + "']" );
		
		if( field == null || field.html() == null ) //more than 20 items in the lookup
		{
			field = $( "input[title='" + fieldName  + "']" );
			return field.val();
		}
		else return $("select[title='" + fieldName  + "'] option:selected").text();
	}

	*/

  function m_fnGetLookupFormField(fieldTitle) {
    if ($("select[title='" + fieldTitle + "']").html() !== null) {
      return $("select[title='" + fieldTitle + "']");
    } else {
      return $("input[title='" + fieldTitle + "']");
    }
  }

  function m_fnGetLookupDisplayText(fieldTitle) {
    //Set default value for lookups with less that 20 items
    if ($("select[title='" + fieldTitle + "']").html() !== null) {
      return $("select[title='" + fieldTitle + "'] option:selected").text();
    } else {
      return $("input[title='" + fieldTitle + "']").val();
    }
  }

  function m_fnSetLookupFromFieldNameByText(fieldName, text) {
    try {
      if (text == undefined) return;
      var theSelect = m_fnGetTagFromIdentifierAndTitle("select", "", fieldName);

      if (theSelect == null) {
        var theInput = m_fnGetTagFromIdentifierAndTitle("input", "", fieldName);
        //builtin
        ShowDropdown(theInput.id);
        var opt = document.getElementById(theInput.opt);
        m_fnSetSelectedOptionByText(opt, text);
        //builtin
        OptLoseFocus(opt);
      } else {
        m_fnSetSelectedOptionByText(theSelect, text);
      }
    } catch (ex) {}
  }

  function m_fnSetSelectedOptionByText(select, text) {
    var opts = select.options;
    var optLength = opts.length;
    if (select == null) return;

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
      if (
        tags[i].title == title &&
        (identifier == "" ||
          tagID.indexOf(identifier) == tagID.length - idLength)
      ) {
        return tags[i];
      }
    }
    return null;
  }

  function m_fnViewUserManuals(docType) {
    var options = SP.UI.$create_DialogOptions();
    options.title = "User Manual";
    options.height = 250;
    //options.dialogReturnValueCallback = OnCallbackForm;
    if (docType != null)
      options.url =
        Audit.Common.Utilities.GetSiteUrl() +
        "/SitePages/AuditUserManuals.aspx?FilterField1=DocType&FilterValue1=" +
        docType;
    else
      options.url =
        Audit.Common.Utilities.GetSiteUrl() +
        "/SitePages/AuditUserManuals.aspx";

    SP.UI.ModalDialog.showModalDialog(options);
  }

  function m_fnPrintPage(pageTitle, divTbl) {
    var curDate = new Date();
    var siteUrl = Audit.Common.Utilities.GetSiteUrl();
    var cssLink1 =
      siteUrl +
      "/siteassets/css/tablesorter/style.css?v=" +
      curDate.format("MM_dd_yyyy");
    var cssLink2 =
      siteUrl +
      "/siteAssets/css/audit_styles.css?v=" +
      curDate.format("MM_dd_yyyy");

    var divOutput = $(divTbl).html();

    //remove hyperlinks pointing to the job codes
    var updatedDivOutput = $("<div>").append(divOutput);
    updatedDivOutput.find(".sr-response-title a").each(function () {
      $(this).removeAttr("onclick");
      $(this).removeAttr("href");
    });

    divOutput = updatedDivOutput.html();

    var printDateString = curDate.format("MM/dd/yyyy hh:mm tt");
    printDateString =
      "<div style='padding-bottom:10px;'>" + printDateString + "</div>";
    divOutput = printDateString + divOutput;

    var cssFile1 = $("<div></div>");
    var cssFile2 = $("<div></div>");

    var def1 = $.Deferred();
    var def2 = $.Deferred();

    var cssFileText = "";
    cssFile1.load(cssLink1, function () {
      cssFileText += "<style>" + cssFile1.html() + "</style>";
      def1.resolve();
    });
    cssFile2.load(cssLink2, function () {
      cssFileText += "<style>" + cssFile2.html() + "</style>";
      def2.resolve();
    });

    //gets called asynchronously after the css files have been loaded
    $.when(def1, def2).done(function () {
      var html =
        "<HTML>\n" +
        "<HEAD>\n\n" +
        "<Title>" +
        pageTitle +
        "</Title>\n" +
        cssFileText +
        "\n" +
        "<style>" +
        ".hideOnPrint, .rowFilters {display:none}" +
        "</style>\n" +
        "</HEAD>\n" +
        "<BODY>\n" +
        divOutput +
        "\n" +
        "</BODY>\n" +
        "</HTML>";

      var printWP = window.open("", "printWebPart");
      printWP.document.open();
      //insert content
      printWP.document.write(html);

      printWP.document.close();
      //open print dialog
      printWP.print();
    });
  }

  //make sure iframe with id csvexprframe is added to page up top
  //http://stackoverflow.com/questions/18185660/javascript-jquery-exporting-data-in-csv-not-working-in-ie
  function m_fnExportToCsv(fileName, tableName, removeHeader) {
    var data = m_fnGetCellValues(tableName);

    if (removeHeader == true) data = data.slice(1);

    var csv = m_fnConvertToCsv(data);
    //	console.log( csv );
    if (navigator.userAgent.search("Trident") >= 0) {
      window.CsvExpFrame.document.open("text/html", "replace");
      //		window.CsvExpFrame.document.open("application/csv", "replace");
      //		window.CsvExpFrame.document.charset = "utf-8";
      //		window.CsvExpFrame.document.open("application/ms-excel", "replace");
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

    //remove headers and footers
    if (table.innerHTML.indexOf("rowFilters") >= 0) {
      var deets = $("<div>").append(table.outerHTML);
      deets.find(".rowFilters").each(function () {
        $(this).remove();
      });
      table = deets.find("table")[0];
    }
    if (table.innerHTML.indexOf("footer") >= 0) {
      var deets = $("<div>").append(table.outerHTML);
      deets.find(".footer").each(function () {
        $(this).remove();
      });
      table = deets.find("table")[0];
    }

    var tableArray = [];
    for (var r = 0, n = table.rows.length; r < n; r++) {
      tableArray[r] = [];
      for (var c = 0, m = table.rows[r].cells.length; c < m; c++) {
        var text =
          table.rows[r].cells[c].textContent ||
          table.rows[r].cells[c].innerText;
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
    GetSiteUrl: function () {
      if (m_siteUrl == "/") return "";
      else return m_siteUrl;
    },
    GetListTitleRequests: function () {
      return m_listTitleRequests;
    },
    GetListNameRequests: function () {
      return m_listNameRequests;
    },
    GetListTitleRequestsInternal: function () {
      return m_listTitleRequestsInternal;
    },
    GetListNameRequestsInternal: function () {
      return m_listNameRequestsInternal;
    },
    GetListTitleResponses: function () {
      return m_listTitleResponses;
    },
    GetListNameResponses: function () {
      return m_listNameResponses;
    },
    GetLibTitleRequestDocs: function () {
      return m_libTitleRequestDocs;
    },
    GetLibNameRequestDocs: function () {
      return m_libNameRequestDocs;
    },
    GetLibTitleCoverSheets: function () {
      return m_libTitleCoverSheet;
    },
    GetLibNameCoverSheets: function () {
      return m_libNameCoverSheet;
    },
    GetLibTitleResponseDocs: function () {
      return m_libTitleResponseDocs;
    },
    GetLibNameResponseDocs: function () {
      return m_libNameResponseDocs;
    },
    GetLibTitleResponseDocsEA: function () {
      return m_libTitleResponseDocsEA;
    },
    GetLibNameResponseDocsEA: function () {
      return m_libNameResponseDocsEA;
    },
    GetListTitleActionOffices: function () {
      return m_listTitleActionOffices;
    },
    GetListNameActionOffices: function () {
      return m_listNameActionOffices;
    },
    GetListTitleEmailHistory: function () {
      return m_listTitleEmailHistory;
    },
    GetListNameEmailHistory: function () {
      return m_listNameEmailHistory;
    },
    GetListTitleBulkResponses: function () {
      return m_listTitleBulkResponses;
    },
    GetListNameBulkResponses: function () {
      return m_listNameBulkResponses;
    },
    GetListTitleBulkPermissions: function () {
      return m_listTitleBulkPermissions;
    },
    GetListNameBulkPermissions: function () {
      return m_listNameBulkPermissions;
    },
    GetGroupNameSpecialPerm1: function () {
      return m_groupNameSpecialPermName1;
    },
    GetGroupNameSpecialPerm2: function () {
      return m_groupNameSpecialPermName2;
    },
    GetGroupNameQA: function () {
      return m_groupNameQA;
    },
    GetGroupNameEA: function () {
      return m_groupNameEA;
    },
    Refresh: m_fnRefresh,
    OnLoadDisplayTimeStamp: m_fnOnLoadDisplayTimeStamp,
    OnLoadDisplayTabAndResponse: m_fnOnLoadDisplayTabAndResponse,
    OnLoadFilterResponses: function (responseStatus1, responseStatus2) {
      m_fnOnLoadFilterResponses(responseStatus1, responseStatus2);
    },
    SetResponseDocLibGUID: function (libGUID) {
      m_libResponseDocsLibraryGUID = libGUID;
    },
    GetResponseDocLibGUID: function () {
      return m_libResponseDocsLibraryGUID;
    },
    LoadSiteGroups: function (itemColl) {
      m_fnLoadSiteGroups(itemColl);
    },
    GetSPSiteGroup: function (groupName) {
      return m_fnGetSPSiteGroup(groupName);
    },
    LoadActionOffices: function (itemColl) {
      m_fnLoadActionOffices(itemColl);
    },
    GetActionOffices: function () {
      return m_arrAOs;
    },
    GetAOSPGroupName: function (groupName) {
      return m_fnGetAOSPGroupName(groupName);
    },
    CheckSPItemHasGroupPermission: function (item, groupName, permissionLevel) {
      return m_fnCheckSPItemHasGroupPermission(
        item,
        groupName,
        permissionLevel
      );
    },
    GoToResponse: function (responseTitle, isIA) {
      m_fnGoToResponse(responseTitle, isIA);
    },
    GetResponseDocStyleTag: function (documentStatus) {
      return m_fnGetResponseDocStyleTag(documentStatus);
    },
    GetResponseDocStyleTag2: function (documentStatus) {
      return m_fnGetResponseDocStyleTag2(documentStatus);
    },
    CheckIfEmailFolderExists: function (items, requestNumber) {
      return m_fnCheckIfEmailFolderExists(items, requestNumber);
    },
    CreateEmailFolder: function (list, requestNumber, requestItem, OnComplete) {
      return m_fnCreateEmailFolder(
        list,
        requestNumber,
        requestItem,
        OnComplete
      );
    },
    AddOptions: function (arr, ddlID, dateSort, responseSort) {
      m_fnAddOptions(arr, ddlID, dateSort, responseSort);
    },
    ExistsInArr: function (arr, val) {
      return m_fnExistsInArr(arr, val);
    },
    GetTrueFalseIcon: function (val) {
      return m_fnGetTrueFalseIcon(val);
    },
    PadDigits: function (n, totalDigits) {
      return m_fnPadDigits(n, totalDigits);
    },
    PreciseRound: function (num, decimals) {
      return m_fnPreciseRound(num, decimals);
    },
    GetFriendlyFileSize: function (fileSize) {
      return m_fnGetFriendlyFileSize(fileSize);
    },
    GetISODateString: function (d) {
      return m_fnISODateString(d);
    },
    GetFriendlyDisplayName: function (oListItem, fieldName) {
      return m_fnGetFriendlyDisplayName(oListItem, fieldName);
    },
    BindHandlerResponseDoc: m_fnBindHandlerResponseDoc,
    PrintStatusReport: function (pageTitle, divTbl) {
      m_fnPrintPage(pageTitle, divTbl);
    },
    ExportToCsv: function (fileName, tableName, removeHeader) {
      m_fnExportToCsv(fileName, tableName, removeHeader);
    },
    ViewUserManuals: function (docType) {
      m_fnViewUserManuals(docType);
    },
    //GetLookupFieldText: function( fieldName ){ return m_fnGetLookupFieldText( fieldName); },
    GetLookupDisplayText: function (fieldName) {
      return m_fnGetLookupDisplayText(fieldName);
    },
    GetLookupFormField: function (fieldName) {
      return m_fnGetLookupFormField(fieldName);
    },
    SetLookupFromFieldNameByText: function (fieldName, text) {
      return m_fnSetLookupFromFieldNameByText(fieldName, text);
    },
    SortResponseObjects: function (a, b) {
      return m_fnSortResponseObjectNoCase(a, b);
    },
    SortResponseTitles: m_fnSortResponseTitleNoCase,
  };

  return publicMembers;
};

// ExecuteOrDelayUntilScriptLoaded(InitReport, "sp.js");
InitReport();
