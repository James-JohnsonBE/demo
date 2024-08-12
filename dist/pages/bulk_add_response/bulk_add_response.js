(() => {
  // src/pages/bulk_add_response/BulkAddResponse_Template.js
  var html = String.raw;
  var bulkAddResponseTemplate = html`
  <div class="audit">
    <div id="divLoading" style="color: green">Loading...</div>
    <div id="divLoadSettings" style="display: none">
      <fieldset>
        <legend>
          Add Responses to Request Number:
          <span id="divRequestNumber" style="font-weight: bold"></span>
        </legend>
        <div style="padding-top: 10px">
          <a href="javascript:void" id="btnUploadResponses"
            ><span class="ui-icon ui-icon-gear"></span>Upload Responses to be
            Created</a
          >
        </div>
        <div style="padding-top: 10px">
          <a href="javascript:void" id="btnLoadResponses" style="display: none"
            >Click Here to Display Uploaded Responses</a
          >
        </div>
      </fieldset>
    </div>
    <div id="divLoadBulkResponsesOutput" style="padding-top: 15px"></div>
    <div style="padding-top: 15px">
      <a
        href="javascript:void"
        id="btnCreateResponses"
        style="display: none"
        title="Click here to Create the Responses"
        ><span class="ui-icon ui-icon-disk"></span>Create Responses</a
      >
      <div style="padding-top: 15px">
        <input
          id="btnCancel"
          type="button"
          class="ms-ButtonHeightWidth"
          value="Close"
          title="Close"
          onclick="SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)"
        />
      </div>
    </div>
  </div>
`;

  // src/pages/bulk_add_response/bulk_add_response.js
  var Audit = window.Audit || {};
  Audit.BulkAddResponse = Audit.BulkAddResponse || {};
  if (document.readyState === "ready" || document.readyState === "complete") {
    InitBulk();
  } else {
    document.onreadystatechange = () => {
      if (document.readyState === "complete" || document.readyState === "ready") {
        ExecuteOrDelayUntilScriptLoaded(function() {
          SP.SOD.executeFunc("sp.js", "SP.ClientContext", InitBulk);
        }, "sp.js");
      }
    };
  }
  function InitBulk() {
    document.getElementById("app").innerHTML = bulkAddResponseTemplate;
    Audit.BulkAddResponse.Report = new Audit.BulkAddResponse.Load();
    Audit.BulkAddResponse.Init();
  }
  Audit.BulkAddResponse.Init = function() {
  };
  Audit.BulkAddResponse.Load = function() {
    var m_reqNum = GetUrlKeyValue("ReqNum");
    if (m_reqNum == null || m_reqNum == "" || m_reqNum == void 0) {
      var statusId = SP.UI.Status.addStatus(
        "Error: Request Number was not specified. Please verify the URL Parameters or Launch from the IA Dashboard"
      );
      SP.UI.Status.setStatusPriColor(statusId, "red");
      return;
    }
    $("#divRequestNumber").text(m_reqNum);
    var m_oRequest = null;
    var m_arrResponses = new Array();
    var m_arrResponseFolders = new Array();
    var m_arrBulkResponses = new Array();
    var m_listViewId = null;
    var m_requestItems;
    var m_responseItems;
    var m_ResponseDocsFoldersItems;
    var m_aoItems;
    var m_view;
    var m_groupColl;
    var m_ownerGroupName = null;
    var m_memberGroupName = null;
    var m_visitorGroupName = null;
    LoadInfo();
    function LoadInfo() {
      $("#divTblOutput").html("");
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      var requestList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleRequests());
      var requestQuery = new SP.CamlQuery();
      requestQuery.set_viewXml(
        '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'
      );
      m_requestItems = requestList.getItems(requestQuery);
      currCtx.load(
        m_requestItems,
        "Include(ID, Title, ReqSubject, ReqStatus, IsSample, ReqDueDate, InternalDueDate, ActionOffice)"
      );
      var responseList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleResponses());
      var responseQuery = new SP.CamlQuery();
      responseQuery.set_viewXml(
        '<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="ReqNum"/></OrderBy></Query></View>'
      );
      m_responseItems = responseList.getItems(responseQuery);
      currCtx.load(
        m_responseItems,
        "Include(ID, Title, ReqNum, ActionOffice, SampleNumber)"
      );
      var responseDocsLibFolderslist = web.get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
      var responseDocsLibFolderslistQuery = new SP.CamlQuery();
      responseDocsLibFolderslistQuery.set_viewXml(
        '<View><Query><OrderBy><FieldRef Name="Name"/></OrderBy><Where><Eq><FieldRef Name="FSObjType" /><Value Type="Lookup">1</Value></Eq></Where></Query></View>'
      );
      responseDocsLibFolderslistQuery.set_folderServerRelativeUrl(
        Audit.Common.Utilities.GetSiteUrl() + "/" + Audit.Common.Utilities.GetLibNameResponseDocs()
      );
      m_ResponseDocsFoldersItems = responseDocsLibFolderslist.getItems(
        responseDocsLibFolderslistQuery
      );
      currCtx.load(
        m_ResponseDocsFoldersItems,
        "Include( DisplayName, Id, ContentType)"
      );
      var aoList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleActionOffices());
      var aoQuery = new SP.CamlQuery();
      aoQuery.set_viewXml(
        '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'
      );
      m_aoItems = aoList.getItems(aoQuery);
      currCtx.load(m_aoItems, "Include(ID, Title, UserGroup)");
      var m_bulkResponsesList = currCtx.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetListNameBulkResponses());
      m_view = m_bulkResponsesList.get_views().getByTitle("All Items");
      currCtx.load(m_view);
      m_groupColl = web.get_siteGroups();
      currCtx.load(m_groupColl);
      var ownerGroup = web.get_associatedOwnerGroup();
      var memberGroup = web.get_associatedMemberGroup();
      var visitorGroup = web.get_associatedVisitorGroup();
      currCtx.load(ownerGroup);
      currCtx.load(memberGroup);
      currCtx.load(visitorGroup);
      currCtx.executeQueryAsync(OnSuccess, OnFailure);
      function OnSuccess(sender, args) {
        $("#divLoadSettings").show();
        $("#divLoading").hide();
        m_listViewId = m_view.get_id();
        Audit.Common.Utilities.LoadSiteGroups(m_groupColl);
        Audit.Common.Utilities.LoadActionOffices(m_aoItems);
        m_ownerGroupName = ownerGroup.get_title();
        m_memberGroupName = memberGroup.get_title();
        m_visitorGroupName = visitorGroup.get_title();
        m_fnLoadRequests();
        if (m_oRequest == null || m_oRequest.number == null) {
          statusId = SP.UI.Status.addStatus(
            "Error: Request Number does not exist in the Request List. Please verify the URL Parameters and that the Request Number already exists"
          );
          SP.UI.Status.setStatusPriColor(statusId, "red");
          $("#divLoadSettings").hide();
          return;
        }
        m_fnLoadResponses();
        m_fnLoadResponseFolders();
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
    function m_fnRefresh() {
      var curPath = location.pathname;
      var tabIndex = $("#tabs").tabs("option", "active");
      curPath += "?Tab=" + tabIndex;
      location.href = curPath;
    }
    function m_fnLoadRequests() {
      var currCtx = SP.ClientContext.get_current();
      var web = currCtx.get_web();
      var listItemEnumerator = m_requestItems.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        var id = oListItem.get_item("ID");
        var number = oListItem.get_item("Title");
        if (number != m_reqNum)
          continue;
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
        m_oRequest = requestObject;
      }
    }
    function m_fnLoadResponses() {
      m_arrResponses = new Array();
      var listItemEnumerator = m_responseItems.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        var number = oListItem.get_item("ReqNum");
        if (number != null) {
          number = number.get_lookupValue();
          if (number != m_reqNum)
            continue;
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
          m_arrResponses.push(responseObject);
        }
      }
    }
    function m_fnLoadResponseFolders() {
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
            m_arrResponseFolders2.push(responseFolderObject);
            break;
          }
        }
      }
    }
    function m_fnUploadResponses() {
      var formName = "DispForm.aspx";
      var options = SP.UI.$create_DialogOptions();
      options.title = "Upload Responses (" + m_reqNum + ")";
      options.dialogReturnValueCallback = OnCallbackForm;
      var guid = m_listViewId.toString();
      guid = guid.replace(/-/g, "%2D");
      guid = guid.toUpperCase();
      options.url = Audit.Common.Utilities.GetSiteUrl() + "/Lists/" + Audit.Common.Utilities.GetListNameBulkResponses() + "/AllItems.aspx?ShowInGrid=True&View=%7B" + guid + "%7D";
      options.height = 700;
      SP.UI.ModalDialog.showModalDialog(options);
    }
    var validation = {
      isNotEmpty: function(str) {
        var pattern = /\S+/;
        return pattern.test(str);
      },
      isNumber: function(str) {
        var pattern = /^\d+$/;
        return pattern.test(str);
      }
    };
    function m_fnLoadBulkResponses() {
      m_arrBulkResponses = new Array();
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      var bulkResponesList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleBulkResponses());
      var bulkResponseQuery = new SP.CamlQuery();
      bulkResponseQuery.set_viewXml(
        '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy></Query></View>'
      );
      var bulkResponseItems = bulkResponesList.getItems(bulkResponseQuery);
      currCtx.load(
        bulkResponseItems,
        "Include(ID, Title, ActionOffice, Comments, POC, POCCC)"
      );
      function OnSuccess(sender, args) {
        var listItemEnumerator = bulkResponseItems.getEnumerator();
        while (listItemEnumerator.moveNext()) {
          var oListItem = listItemEnumerator.get_current();
          var id = oListItem.get_item("ID");
          var sampleNumber = oListItem.get_item("Title");
          var actionOffice = oListItem.get_item("ActionOffice").get_lookupValue();
          var comments = oListItem.get_item("Comments");
          if (comments == null)
            comments = "";
          var bulkResponseObject = new Object();
          bulkResponseObject["ID"] = id;
          bulkResponseObject["sampleNumber"] = sampleNumber;
          bulkResponseObject["actionOffice"] = actionOffice;
          bulkResponseObject["comments"] = comments;
          var newResponseTitle = m_reqNum + "-" + actionOffice + "-" + sampleNumber;
          bulkResponseObject["responseTitle"] = newResponseTitle;
          bulkResponseObject["item"] = oListItem;
          if (actionOffice && actionOffice.toLowerCase().indexOf("fpra") < 0) {
            bulkResponseObject["poc"] = "";
            bulkResponseObject["poccc"] = "";
            bulkResponseObject["pocID"] = "";
            bulkResponseObject["pocccID"] = "";
          } else {
            bulkResponseObject["poc"] = "";
            bulkResponseObject["poccc"] = "";
            bulkResponseObject["pocID"] = "";
            bulkResponseObject["pocccID"] = "";
            if (oListItem.get_item("POC") != null && oListItem.get_item("POC").get_lookupValue() != null) {
              bulkResponseObject["poc"] = oListItem.get_item("POC").get_lookupValue();
              bulkResponseObject["pocID"] = oListItem.get_item("POC").get_lookupId();
            }
            if (oListItem.get_item("POCCC") != null && oListItem.get_item("POCCC").get_lookupValue() != null) {
              bulkResponseObject["poccc"] = oListItem.get_item("POCCC").get_lookupValue();
              bulkResponseObject["pocccID"] = oListItem.get_item("POCCC").get_lookupId();
            }
          }
          var bIsValid = true;
          var sInvalidReason = null;
          if (!validation.isNotEmpty(sampleNumber) || !validation.isNumber(sampleNumber)) {
            bIsValid = false;
            sInvalidReason = "Invalid sample number";
          }
          if (bIsValid) {
            for (var x = 0; x < m_arrResponses.length; x++) {
              if (m_arrResponses[x].title == newResponseTitle) {
                bIsValid = false;
                sInvalidReason = "Response with this name exists";
                break;
              }
            }
          }
          if (bIsValid) {
            for (var x = 0; x < m_arrResponseFolders.length; x++) {
              if (m_arrResponseFolders[x].title == newResponseTitle) {
                bIsValid = false;
                sInvalidReason = "Response Folder with this name exists";
                break;
              }
            }
          }
          if (bIsValid) {
            var bFound = false;
            for (var x = 0; x < Audit.Common.Utilities.GetActionOffices().length; x++) {
              if (Audit.Common.Utilities.GetActionOffices()[x].title == actionOffice) {
                bulkResponseObject["actionOfficeID"] = Audit.Common.Utilities.GetActionOffices()[x].ID;
                bFound = true;
              }
            }
            if (!bFound) {
              bIsValid = false;
              sInvalidReason = "Action Office not found";
            }
          }
          bulkResponseObject["isValid"] = bIsValid;
          bulkResponseObject["invalidReason"] = sInvalidReason;
          m_arrBulkResponses.push(bulkResponseObject);
        }
        var hasOneValid = false;
        m_arrBulkResponses.sort(function(a, b) {
          a = parseInt(a.sampleNumber, 10);
          b = parseInt(b.sampleNumber, 10);
          return a - b;
        });
        var output = "<table class='tablesorter report'><tr><thead><th>Request Number</th><th>Action Office</th><th>Sample Number</th><th>Response Title</th><th>Comments</th><th>POC</th><th>POC CC</th></thead></tr>";
        for (var x = 0; x < m_arrBulkResponses.length; x++) {
          var oBulkItem = m_arrBulkResponses[x];
          if (oBulkItem.isValid) {
            output += "<tr id='tableRow" + x + "'><td id='tdReq" + x + "'>" + m_reqNum + "</td><td>" + oBulkItem.actionOffice + "</td><td>" + oBulkItem.sampleNumber + "</td><td>" + oBulkItem.responseTitle + "</td><td>" + oBulkItem.comments + "</td><td>" + oBulkItem.poc + "</td><td>" + oBulkItem.poccc + "</td></tr>";
            hasOneValid = true;
          } else {
            output += "<tr style='background-color:lightsalmon; font-style:italic;' title='" + oBulkItem.invalidReason + "'><td>" + m_reqNum + "</td><td>" + oBulkItem.actionOffice + "</td><td>" + oBulkItem.sampleNumber + "</td><td>" + oBulkItem.responseTitle + " - " + oBulkItem.invalidReason + "</td><td>" + oBulkItem.comments + "</td><td>" + oBulkItem.poc + "</td><td>" + oBulkItem.poccc + "</td></tr>";
          }
        }
        $("#divLoadBulkResponsesOutput").html(
          output += "<tfoot><tr><th colspan='7'>Total: " + m_arrBulkResponses.length + "</tr></tfoot></table>"
        );
        if (m_arrBulkResponses.length == 0) {
          $("#divLoadBulkResponsesOutput").html("");
        }
        if (hasOneValid) {
          $("#btnCreateResponses").show().focus();
        } else {
          $("#btnCreateResponses").hide();
        }
      }
      function OnFailure(sender, args) {
        statusId = SP.UI.Status.addStatus(
          "Unable to load from the Bulk Response List: " + args.get_message() + "\n" + args.get_stackTrace()
        );
        SP.UI.Status.setStatusPriColor(statusId, "red");
      }
      currCtx.executeQueryAsync(OnSuccess, OnFailure);
    }
    var m_countToCreate = 0;
    var m_countCreated = 0;
    var m_waitDialog = null;
    var m_bCreateRequestFolder = true;
    function m_fnCreateResponses() {
      m_bCreateRequestFolder = true;
      if (confirm("Are you sure you would like to Create the Responses?")) {
        $("#btnUploadResponses").hide();
        $("#btnCreateResponses").hide();
        $("#divLoadSettings").hide();
        $("#btnCancel").hide();
        document.body.style.cursor = "wait";
        if (window.parent != null && window.parent.document.getElementById("divRanBulkUpdate") != null)
          window.parent.document.getElementById("divRanBulkUpdate").innerText = 1;
        m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
          "Creating Responses",
          "Please wait... Creating Responses",
          200,
          400
        );
        for (var x = 0; x < m_arrBulkResponses.length; x++) {
          var oBulkItem = m_arrBulkResponses[x];
          if (oBulkItem.isValid) {
            let OnSuccess = function(sender, args) {
              if (m_bCreateRequestFolder) {
                if (!Audit.Common.Utilities.CheckIfEmailFolderExists(
                  this.emailListFolderItems,
                  this.requestNumber
                )) {
                  Audit.Common.Utilities.CreateEmailFolder(
                    this.emailList,
                    this.requestNumber
                  );
                }
                m_bCreateRequestFolder = false;
              }
              $("#tableRow" + this.tableRowId).attr(
                "style",
                "background-color:palegreen"
              );
              $("#tableRow" + this.tableRowId).attr("title", "Created");
              $("#tdReq" + this.tableRowId).html(
                "<span class='ui-icon ui-icon-check'></span> " + $("#tdReq" + this.tableRowId).text()
              );
              var currCtx2 = new SP.ClientContext.get_current();
              var itemId = m_arrBulkResponses[this.tableRowId].ID;
              if (itemId != null && itemId >= 0) {
                var targetList = currCtx2.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetListTitleBulkResponses());
                var targetListItem = targetList.getItemById(itemId);
                targetListItem.deleteObject();
              }
              currCtx2.executeQueryAsync(
                function() {
                  m_countCreated++;
                  if (m_countToCreate == m_countCreated) {
                    document.body.style.cursor = "default";
                    m_waitDialog.close();
                    var notifyId2 = SP.UI.Notify.addNotification(
                      "Completed",
                      false
                    );
                    $("#btnCancel").show();
                  }
                },
                function() {
                  m_countCreated++;
                  if (m_countToCreate == m_countCreated) {
                    document.body.style.cursor = "default";
                    m_waitDialog.close();
                    var notifyId2 = SP.UI.Notify.addNotification(
                      "Completed",
                      false
                    );
                    $("#btnCancel").show();
                  }
                }
              );
            }, OnFailure = function(sender, args) {
              $("#tableRow" + this.tableRowId).attr(
                "style",
                "background-color:salmon"
              );
              $("#tableRow" + this.tableRowId).attr("title", args.get_message());
              m_countCreated++;
              if (m_countToCreate == m_countCreated) {
                document.body.style.cursor = "default";
                m_waitDialog.close();
                notifyId = SP.UI.Notify.addNotification("Completed", false);
                $("#btnCancel").show();
              }
            };
            m_countToCreate++;
            var currCtx = new SP.ClientContext.get_current();
            var currentUser = currCtx.get_web().get_currentUser();
            var ownerGroup = currCtx.get_web().get_associatedOwnerGroup();
            var memberGroup = currCtx.get_web().get_associatedMemberGroup();
            var visitorGroup = currCtx.get_web().get_associatedVisitorGroup();
            var responseTitle = oBulkItem.responseTitle;
            var responseList = currCtx.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetListTitleResponses());
            var itemCreateInfo = new SP.ListItemCreationInformation();
            var oListItem = responseList.addItem(itemCreateInfo);
            oListItem.set_item("Title", responseTitle);
            oListItem.set_item("ReqNum", m_oRequest.ID);
            oListItem.set_item("SampleNumber", oBulkItem.sampleNumber);
            oListItem.set_item("ActionOffice", oBulkItem.actionOfficeID);
            if (oBulkItem.poc != "") {
              var assignedToVal = new SP.FieldUserValue();
              assignedToVal.set_lookupId(oBulkItem.pocID);
              oListItem.set_item("POC", assignedToVal);
            }
            if (oBulkItem.poccc != "") {
              var assignedToVal = new SP.FieldUserValue();
              assignedToVal.set_lookupId(oBulkItem.pocccID);
              oListItem.set_item("POCCC", assignedToVal);
            }
            oListItem.update();
            oListItem.breakRoleInheritance(false, false);
            var roleDefBindingCollAdmin = SP.RoleDefinitionBindingCollection.newObject(currCtx);
            roleDefBindingCollAdmin.add(
              currCtx.get_web().get_roleDefinitions().getByType(SP.RoleType.administrator)
            );
            var roleDefBindingCollContribute = SP.RoleDefinitionBindingCollection.newObject(currCtx);
            roleDefBindingCollContribute.add(
              currCtx.get_web().get_roleDefinitions().getByType(SP.RoleType.contributor)
            );
            var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject(currCtx);
            roleDefBindingCollRestrictedRead.add(
              currCtx.get_web().get_roleDefinitions().getByName("Restricted Read")
            );
            var roleDefBindingCollRestrictedContribute = SP.RoleDefinitionBindingCollection.newObject(currCtx);
            roleDefBindingCollRestrictedContribute.add(
              currCtx.get_web().get_roleDefinitions().getByName("Restricted Contribute")
            );
            oListItem.get_roleAssignments().add(ownerGroup, roleDefBindingCollAdmin);
            oListItem.get_roleAssignments().add(memberGroup, roleDefBindingCollContribute);
            oListItem.get_roleAssignments().add(visitorGroup, roleDefBindingCollRestrictedRead);
            var actionOffice = oListItem.get_item("ActionOffice");
            if (actionOffice != null) {
              var actionOfficeName = oBulkItem.actionOffice;
              var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName(actionOfficeName);
              var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup(
                actionOfficeGroupName
              );
              if (actionOfficeGroup != null) {
                oListItem.get_roleAssignments().add(actionOfficeGroup, roleDefBindingCollRestrictedContribute);
              } else
                return;
            }
            oListItem.get_roleAssignments().getByPrincipal(currentUser).deleteObject();
            var responseDocLib = currCtx.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
            var itemCreateInfo = new SP.ListItemCreationInformation();
            itemCreateInfo.set_underlyingObjectType(
              SP.FileSystemObjectType.folder
            );
            itemCreateInfo.set_leafName(responseTitle);
            var oListFolderItem = responseDocLib.addItem(itemCreateInfo);
            oListFolderItem.set_item("Title", responseTitle);
            oListFolderItem.update();
            oListFolderItem.breakRoleInheritance(false, false);
            var roleDefBindingColl = SP.RoleDefinitionBindingCollection.newObject(currCtx);
            roleDefBindingColl.add(
              currCtx.get_web().get_roleDefinitions().getByType(SP.RoleType.administrator)
            );
            oListFolderItem.get_roleAssignments().add(ownerGroup, roleDefBindingColl);
            var roleDefBindingColl2 = SP.RoleDefinitionBindingCollection.newObject(currCtx);
            roleDefBindingColl2.add(
              currCtx.get_web().get_roleDefinitions().getByType(SP.RoleType.contributor)
            );
            oListFolderItem.get_roleAssignments().add(memberGroup, roleDefBindingColl2);
            var roleDefBindingColl3 = SP.RoleDefinitionBindingCollection.newObject(currCtx);
            roleDefBindingColl3.add(
              currCtx.get_web().get_roleDefinitions().getByName("Restricted Read")
            );
            oListFolderItem.get_roleAssignments().add(visitorGroup, roleDefBindingColl3);
            var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName(
              oBulkItem.actionOffice
            );
            var actionOfficeGroupObj = Audit.Common.Utilities.GetSPSiteGroup(
              actionOfficeGroupName
            );
            if (actionOfficeGroupObj != null) {
              var roleDefBindingColl4 = SP.RoleDefinitionBindingCollection.newObject(currCtx);
              roleDefBindingColl4.add(
                currCtx.get_web().get_roleDefinitions().getByName("Restricted Contribute")
              );
              oListFolderItem.get_roleAssignments().add(actionOfficeGroupObj, roleDefBindingColl4);
            }
            oListFolderItem.get_roleAssignments().getByPrincipal(currentUser).deleteObject();
            var emailList = currCtx.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory());
            var emailListQuery = new SP.CamlQuery();
            emailListQuery.set_viewXml(
              '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>'
            );
            var emailListFolderItems = emailList.getItems(emailListQuery);
            currCtx.load(
              emailListFolderItems,
              "Include(ID, FSObjType, Title, DisplayName)"
            );
            var data = {
              responseTitle,
              requestNumber: m_oRequest.number,
              tableRowId: x,
              emailList,
              emailListFolderItems
            };
            currCtx.executeQueryAsync(
              Function.createDelegate(data, OnSuccess),
              Function.createDelegate(data, OnFailure)
            );
          }
        }
      }
    }
    function m_fnBindHandlersOnLoad() {
      $("#btnUploadResponses").click(function() {
        m_fnUploadResponses();
      });
      $("#btnLoadResponses").click(function() {
        m_fnLoadBulkResponses();
      });
      $("#btnCreateResponses").click(function() {
        m_fnCreateResponses();
      });
    }
    function OnCallbackForm(result, value) {
      m_fnLoadBulkResponses();
    }
    var publicMembers = {
      Refresh: m_fnRefresh
    };
    return publicMembers;
  };
})();
//# sourceMappingURL=bulk_add_response.js.map
