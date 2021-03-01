var Audit = window.Audit || {};
Audit.BulkEditResponse = Audit.BulkEditResponse || {};

$(document).ready(function () {
  SP.SOD.executeFunc(
    "sp.js",
    "SP.ClientContext",
    ExecuteOrDelayUntilScriptLoaded(InitBulk, "sp.js")
  );
});

function InitBulk() {
  Audit.Common.Utilities = new Audit.Common.NewUtilities();
  Audit.Common.Init();
  Audit.BulkEditResponse.Report = new Audit.BulkEditResponse.Load();
  Audit.BulkEditResponse.Init();
}

Audit.BulkEditResponse.Init = function () {};
var vm = {};
Audit.BulkEditResponse.Load = function () {
  var commitStatusOpts = {
    staged: {
      text: "Staged",
      icon: "ui-icon ui-icon-pencil",
    },
    saving: {
      text: "Saving Changes",
      icon: "ui-icon ui-icon-disk",
    },
    permissions: {
      text: "Breaking Permissions",
      icon: "ui-icon ui-icon-key",
    },
    committed: {
      text: "Commited",
      icon: "ui-icon ui-icon-circle-check",
    },
    error: {
      text: "Commited",
      icon: "ui-icon ui-icon-alert",
    },
  };

  function ResponseItem() {
    var self = this;
    self.isMutated = false;
    self.ID = 0;
    self.number = "";
    self.title = "";
    self.item = {};
    self.sample = "";
    self.actionOffice = {};
    self.status = "";
    self.returnReason = "";
    self.comments = "";

    self.returnBool = ko.observable(false);
    self.newStatus = ko.observable();
    self.newActionOfficeTitle = ko.observable();
    self.newActionOffice = ko.pureComputed(function () {
      return vm.arrActionOffices().find(function (ao) {
        return ao.title == self.newActionOfficeTitle();
      });
    });
    self.newReturnReason = ko.observable();
    self.newReturnReasonFree = ko.observable();
    self.newComments = ko.observable();

    self.mutations = ko.observableArray([]);

    self.isMutated = ko.pureComputed(function () {
      self.mutations([]);
      if (self.newStatus() != self.status) {
        self.mutations.push("ResStatus");
      }
      if (self.newActionOfficeTitle() != self.actionOffice) {
        self.mutations.push("ActionOffice");
      }
      if (self.newReturnReason() != self.returnReason) {
        self.mutations.push("ReturnReason");
      }
      if (self.newComments() != self.comments) {
        self.mutations.push("Comments");
      }
      var isMutated = self.mutations().length ? true : false;
      if (isMutated) {
        self.commitStatus(commitStatusOpts.staged);
      } else {
        self.commitStatus("");
      }
      return isMutated;
    });

    self.mutationStatus = ko.pureComputed(function () {
      return self.isMutated() ? "mutated" : "";
    });

    self.commitStatusClass = ko.pureComputed(function () {
      return self.commitStatus() && self.commitStatus()["icon"];
    });

    self.commitStatus = ko.observable("");
  }

  function ViewModel() {
    var self = this;

    self.requestNum = ko.observable();
    self.arrActionOffices = ko.observable();
    self.arrResponses = ko.observableArray();

    self.arrMutatedResponses = ko.pureComputed(function () {
      return self.arrResponses().filter(function (response) {
        return response.isMutated();
      });
    });

    self.responseStatusOpts = ko.observableArray([
      "1-Open",
      "2-Submitted",
      "3-Returned to Action Office",
      "7-Closed",
    ]);

    self.returnReasonOpts = ko.observableArray([
      "",
      "Incomplete Document",
      "Incorrect POC",
    ]);
    self.responseDocs = ko.observableArray();

    self.responsesEdit = ko.observableArray();
  }

  // TODO: Move viewmodel into Load() for production
  vm = new ViewModel();
  ko.applyBindings(vm);

  var m_bigMap = SP.UI.ModalDialog.get_childDialog().get_args()["bigMap"];

  var m_reqNum = GetUrlKeyValue("ReqNum");

  if (m_reqNum == null || m_reqNum == "" || m_reqNum == undefined) {
    statusId = SP.UI.Status.addStatus(
      "Error: Request Number was not specified. Please verify the URL Parameters or Launch from the IA Dashboard"
    );
    SP.UI.Status.setStatusPriColor(statusId, "red");

    return;
  }

  var m_requestNum = m_reqNum;

  $("#divRequestNumber").text(m_reqNum);

  var m_oRequest = null;
  var m_arrResponses = new Array();
  var m_arrResponseFolders = new Array();
  var m_arrBulkResponses = new Array();
  var m_listViewId = null;

  var m_ownerGroupName = null;
  var m_memberGroupName = null;
  var m_visitorGroupName = null;

  function m_fnGetRequestByNumber(requestNumber) {
    //this can be stale...
    var oRequest = null;
    oRequest = m_bigMap["request-" + requestNumber];
    return oRequest;
  }

  LoadInfo();

  function LoadInfo() {
    $("#divTblOutput").html("");

    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    var requestList = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetListTitleRequests());
    var requestQuery = new SP.CamlQuery();
    requestQuery.set_viewXml(
      "<View><Query>" +
        '<OrderBy><FieldRef Name="Title"/></OrderBy> ' +
        '<Where><Eq><FieldRef Name="Title"/><Value Type="Text">' +
        m_reqNum +
        "</Value></Eq></Where>" +
        "</Query></View>"
    );
    m_requestItems = requestList.getItems(requestQuery);
    //request status has internal name as response status in the request list
    currCtx.load(
      m_requestItems,
      "Include(ID, Title, ReqSubject, ReqStatus, IsSample, ReqDueDate, InternalDueDate, ActionOffice)"
    );

    var responseList = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetListTitleResponses());
    var responseQuery = new SP.CamlQuery();
    responseQuery.set_viewXml(
      '<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="ReqNum"/></OrderBy>' +
        '<Where><Eq><FieldRef Name="ReqNum"/><Value Type="Text">' +
        m_reqNum +
        "</Value></Eq></Where>" +
        "</Query></View>"
    );
    m_responseItems = responseList.getItems(responseQuery);
    currCtx.load(
      m_responseItems,
      "Include(ID, Title, ReqNum, ActionOffice, SampleNumber, ResStatus, ReturnReason, Comments, ClosedDate, ClosedBy)"
    );

    var responseDocsLibFolderslist = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
    var responseDocsLibFolderslistQuery = new SP.CamlQuery();
    responseDocsLibFolderslistQuery.set_viewXml(
      '<View><Query><OrderBy><FieldRef Name="Name"/></OrderBy><Where><Eq><FieldRef Name="FSObjType" /><Value Type="Lookup">1</Value></Eq></Where></Query></View>'
    );
    responseDocsLibFolderslistQuery.set_folderServerRelativeUrl(
      Audit.Common.Utilities.GetSiteUrl() +
        "/" +
        Audit.Common.Utilities.GetLibNameResponseDocs()
    );
    m_ResponseDocsFoldersItems = responseDocsLibFolderslist.getItems(
      responseDocsLibFolderslistQuery
    );
    currCtx.load(
      m_ResponseDocsFoldersItems,
      "Include( DisplayName, Id, ContentType)"
    );

    var aoList = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetListTitleActionOffices());
    var aoQuery = new SP.CamlQuery();
    aoQuery.set_viewXml(
      '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'
    );
    m_aoItems = aoList.getItems(aoQuery);
    currCtx.load(m_aoItems, "Include(ID, Title, UserGroup)");

    m_bulkResponsesList = currCtx
      .get_web()
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetListNameBulkResponses());
    m_view = m_bulkResponsesList.get_views().getByTitle("All Items");
    currCtx.load(m_view);
    //currCtx.load(m_bulkResponsesList , 'Title', 'Id', 'Views');

    m_groupColl = web.get_siteGroups();
    currCtx.load(m_groupColl);

    this.ownerGroup = web.get_associatedOwnerGroup();
    this.memberGroup = web.get_associatedMemberGroup();
    this.visitorGroup = web.get_associatedVisitorGroup();
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
      vm.arrActionOffices(Audit.Common.Utilities.GetActionOffices());

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
      if (number != m_reqNum) continue;
      var status = oListItem.get_item("ReqStatus");

      var sample = oListItem.get_item("IsSample");
      var arrActionOffice = oListItem.get_item("ActionOffice");
      var actionOffice = "";
      for (var x = 0; x < arrActionOffice.length; x++) {
        actionOffice +=
          "<div>" + arrActionOffice[x].get_lookupValue() + "</div>";
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
    vm.arrResponses([]);

    var listItemEnumerator = m_responseItems.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      var oListItem = listItemEnumerator.get_current();

      var number = oListItem.get_item("ReqNum");
      if (number != null) {
        number = number.get_lookupValue();
        if (number != m_reqNum) continue;

        var responseObject = new ResponseItem();
        responseObject["ID"] = oListItem.get_item("ID");
        responseObject["number"] = number;
        responseObject["title"] = oListItem.get_item("Title");
        responseObject["item"] = oListItem;

        responseObject["sample"] = oListItem.get_item("SampleNumber");
        if (responseObject["sample"] == null) responseObject["sample"] = "";

        responseObject["actionOffice"] = oListItem.get_item("ActionOffice");
        if (responseObject["actionOffice"] == null)
          responseObject["actionOffice"] = "";
        else
          responseObject["actionOffice"] = responseObject[
            "actionOffice"
          ].get_lookupValue();

        responseObject["newActionOfficeTitle"](responseObject["actionOffice"]);

        responseObject["status"] = oListItem.get_item("ResStatus");
        responseObject["newStatus"](responseObject["status"]);

        var returnReason = oListItem.get_item("ReturnReason")
          ? oListItem.get_item("ReturnReason")
          : "";
        responseObject["returnReason"] = returnReason;
        responseObject["newReturnReason"](responseObject["returnReason"]);
        responseObject["returnBool"](returnReason ? true : false);

        var comments = oListItem.get_item("Comments")
          ? oListItem.get_item("Comments")
          : "";
        responseObject["comments"] = comments;
        responseObject["newComments"](responseObject["comments"]);

        m_arrResponses.push(responseObject);
        vm.arrResponses.push(responseObject);
      }
    }
  }

  function m_fnLoadResponseFolders() {
    var m_arrResponseFolders = new Array();

    var listItemEnumerator = m_ResponseDocsFoldersItems.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      var oListItem = listItemEnumerator.get_current();

      var folderName = oListItem.get_displayName();
      for (var x = 0; x < m_arrResponses.length; x++) {
        if (m_arrResponses[x].title == folderName) {
          var responseFolderObject = new Object();
          responseFolderObject["title"] = folderName;
          responseFolderObject["response"] = m_arrResponses[x];

          m_arrResponseFolders.push(responseFolderObject);
          break;
        }
      }
    }
  }

  function m_fnCommitResponses() {
    window.parent.document.getElementById("divRanBulkUpdate").innerText = 1;

    // 1. Update Responses
    vm.arrMutatedResponses().forEach(function (response) {
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      response.commitStatus(commitStatusOpts.saving);

      var oListItem = response.item;
      if (response.status != response.newStatus()) {
        oListItem.set_item("ResStatus", response.newStatus());
      }
      if (response.actionOffice != response.newActionOfficeTitle()) {
        var actionOffice = response.newActionOffice();
        if (actionOffice) {
          oListItem.set_item(
            "ActionOffice",
            actionOffice.ID + ";#" + actionOffice.title
          );
        } else {
          alert("Couldn't find Action Office");
        }
      }
      if (response.comments != response.newComments()) {
        oListItem.set_item("Comments", response.newComments());
      }
      if (response.returnReason != response.newReturnReason()) {
        oListItem.set_item("ReturnReason", response.newReturnReason());
      }
      oListItem.update();

      function onUpdateResponseSucceeded() {
        console.log("updated", oListItem);
        // response.status = oListItem.get_item("ResStatus");
        // response.comments = oListItem.get_item("Comments")
        //   ? oListItem.get_item("Comments")
        //   : "";
        // response.actionOffice = oListItem.get_item("ActionOffice")
        //   ? oListItem.get_item("ActionOffice").get_lookupValue()
        //   : "";
        response.commitStatus(commitStatusOpts.permissions);
        console.log("response", response);
        OnCallbackCommitResponse(response);
      }
      function onUpdateResponseFailed(sender, args) {
        alert(
          "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
        );
        response.commitStatus(commitStatusOpts.error);
      }

      var data = {
        response: response,
        oListItem: oListItem,
      };
      currCtx.executeQueryAsync(
        Function.createDelegate(data, onUpdateResponseSucceeded),
        Function.createDelegate(data, onUpdateResponseFailed)
      );
    });
    // 2. Modify associated docs
  }

  function OnCallbackCommitResponse(response) {
    var m_countCSToUpdateOnEditResponse = 0;
    var m_countCSUpdatedOnEditResponse = 0;

    var m_responseTitle = response.title;

    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    //get the response that was edited
    var responseList = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetListTitleResponses());
    var responseQuery = new SP.CamlQuery();
    responseQuery.set_viewXml(
      "<View><Query><FieldRef Name=\"Modified\" Ascending=\"FALSE\"/><Where><Eq><FieldRef Name='ID'/><Value Type='Text'>" +
        response.ID +
        "</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>"
    );
    var responseItems = responseList.getItems(responseQuery);
    currCtx.load(
      responseItems,
      "Include(ID, Title, ActionOffice, POC, POCCC, ReturnReason, Comments, ResStatus, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
    );

    //get the response folder of the response that was edited
    var responseDocLib = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
    var responseDocQuery = new SP.CamlQuery();
    responseDocQuery.set_viewXml(
      "<View><Query><Where><Eq><FieldRef Name='FileLeafRef'/><Value Type='Text'>" +
        m_responseTitle +
        "</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>"
    );
    var responseFolderItems = responseDocLib.getItems(responseDocQuery);
    currCtx.load(
      responseFolderItems,
      "Include( Title, DisplayName, Id, EncodedAbsUrl, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
    );

    currCtx.executeQueryAsync(
      function () {
        var m_responseStatus = response.status;
        var m_responseTitle = response.title;
        var oListItem = null;
        var newResponseFolderTitle = null;
        var listItemEnumerator = responseItems.getEnumerator();
        while (listItemEnumerator.moveNext()) {
          oListItem = listItemEnumerator.get_current();
          newResponseFolderTitle = oListItem.get_item("Title");
          m_fnBreakResponsePermissions(oListItem, false, true);
          break;
        }

        if (oListItem == null) {
          alert("Error");
          return;
        }

        var responseFolder = null;
        var listItemEnumerator = responseFolderItems.getEnumerator();
        while (listItemEnumerator.moveNext()) {
          responseFolder = listItemEnumerator.get_current();
          m_fnBreakResponseFolderPermissions(
            responseFolder,
            oListItem,
            false,
            true
          );
          break;
        }

        if (m_responseTitle != newResponseFolderTitle) {
          responseFolder.set_item("FileLeafRef", newResponseFolderTitle);
          responseFolder.set_item("Title", newResponseFolderTitle);
          responseFolder.update();
        }

        function onUpdated1Succeeded() {
          var currCtx2 = new SP.ClientContext.get_current();
          var web2 = currCtx2.get_web();
          var emailList = web2
            .get_lists()
            .getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory());

          if (
            this.oListItem.get_item("ResStatus") ==
              "3-Returned to Action Office" &&
            m_responseStatus != this.oListItem.get_item("ResStatus")
          ) {
            //status changed
            var oRequest = m_fnGetRequestByNumber(m_requestNum);

            var emailSubject =
              "Please Update your Response for Request Number: " + m_requestNum;
            var emailText = "";

            if (
              this.oListItem.get_item("ResStatus") ==
              "3-Returned to Action Office"
            ) {
              emailText =
                "<div>Audit Request Reference: <b>{REQUEST_NUMBER}</b></div>" +
                "<div>Audit Request Subject: <b>{REQUEST_SUBJECT}</b></div>" +
                "<div>Audit Request Due Date: <b>{REQUEST_DUEDATE}</b></div>" +
                "{POC}" +
                "<div>{RETURN_REASON}</div><br/>" +
                "<div>{RESPONSE_COMMENTS}</div><br/>" + // added by Sy Phan 9/5/2018
                "<div>Please provide responses for the following Sample(s): </div><br/>" +
                "<div>{RESPONSE_TITLES}</div>";

              var returnReason = this.oListItem.get_item("ReturnReason");
              if (returnReason == null) returnReason = "";
              else returnReason = "Return Reason: " + returnReason;

              emailText = emailText.replace("{RETURN_REASON}", returnReason);

              // RESPONSE_COMMENTS is added by Sy Phan 9/5/2018
              var comments = this.oListItem.get_item("Comments");
              if (comments == null) comments = "";
              else comments = "Comments: " + comments;

              // debug alert added by Sy Phan 9/5/2018
              //alert(comments);
              emailText = emailText.replace("{RESPONSE_COMMENTS}", comments);
            } else {
              emailText =
                "<div>Audit Request Reference: <b>{REQUEST_NUMBER}</b></div>" +
                "<div>Audit Request Subject: <b>{REQUEST_SUBJECT}</b></div>" +
                "<div>Audit Request Due Date: <b>{REQUEST_DUEDATE}</b></div>" +
                "{POC}" +
                "{REQUEST_RELATEDAUDIT}<br/>" +
                "<div>Below are the listed action items that have been requested for the Audit: </div>" +
                "<div>{REQUEST_ACTIONITEMS}<br/></div>" +
                "<div>Please provide responses for the following Sample(s): </div><br/>" +
                "<div>{RESPONSE_TITLES}</div>";

              emailText = emailText.replace(
                "{REQUEST_ACTIONITEMS}",
                oRequest.actionItems
              );

              if (oRequest.relatedAudit == null || oRequest.relatedAudit == "")
                emailText = emailText.replace(
                  "{REQUEST_RELATEDAUDIT}",
                  "<div>This is a new request, not similar to previous audit cycles.</div>"
                );
              else
                emailText = emailText.replace(
                  "{REQUEST_RELATEDAUDIT}",
                  "<div>This request is similar to this previous cycle audit: " +
                    oRequest.relatedAudit +
                    "</div>"
                );
            }

            emailText = emailText.replace("{REQUEST_NUMBER}", m_requestNum);
            emailText = emailText.replace(
              "{REQUEST_SUBJECT}",
              oRequest.subject
            );
            emailText = emailText.replace(
              "{REQUEST_DUEDATE}",
              oRequest.internalDueDate
            );

            emailText = emailText.replace(
              "{RESPONSE_TITLES}",
              this.newResponseFolderTitle
            );

            var ao = this.oListItem.get_item("ActionOffice");
            if (ao != null) ao = ao.get_lookupValue();
            else ao = "";
            var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName(
              ao
            );

            //if it has a poc, update the TO field and the poc in the email text
            var poc = this.oListItem.get_item("POC");
            if (poc != null) {
              poc = poc.get_lookupValue();
              actionOfficeGroupName = poc;
              var pocCC = this.oListItem.get_item("POCCC");
              if (pocCC != null) {
                actionOfficeGroupName += ";" + pocCC.get_lookupValue();
              }

              emailText = emailText.replace(
                "{POC}",
                "<div><b>POC: " + poc + "</b></div><br/>"
              );
            } else {
              emailText = emailText.replace("{POC}", "<br/>");
            }

            var itemCreateInfo = new SP.ListItemCreationInformation();
            itemCreateInfo.set_folderUrl(
              location.protocol +
                "//" +
                location.host +
                Audit.Common.Utilities.GetSiteUrl() +
                "/Lists/" +
                Audit.Common.Utilities.GetListNameEmailHistory() +
                "/" +
                m_requestNum
            );
            oListItemEmail = emailList.addItem(itemCreateInfo);
            oListItemEmail.set_item("Title", emailSubject);
            oListItemEmail.set_item("Body", emailText);
            oListItemEmail.set_item("To", actionOfficeGroupName);
            oListItemEmail.set_item(
              "NotificationType",
              "AO Returned Notification"
            );
            oListItemEmail.set_item("ReqNum", m_requestNum);
            oListItemEmail.set_item("ResID", this.newResponseFolderTitle);
            oListItemEmail.update();

            currCtx2.executeQueryAsync(
              function () {
                document.body.style.cursor = "default";
                response.commitStatus(commitStatusOpts.committed);
              },
              function (sender, args) {
                alert(
                  "Request failed: " +
                    args.get_message() +
                    "\n" +
                    args.get_stackTrace()
                );
                setTimeout(function () {
                  m_fnRefresh();
                }, 200);
              }
            );
          } else {
            //Nothing to change here.
            response.commitStatus(commitStatusOpts.committed);
          }
        }
        function onUpdated1Failed(sender, args) {
          alert(
            "Request failed: " +
              args.get_message() +
              "\n" +
              args.get_stackTrace()
          );
          setTimeout(function () {
            m_fnRefresh();
          }, 200);
        }

        var data = {
          newResponseFolderTitle: newResponseFolderTitle,
          oListItem: oListItem,
          m_responseStatus: m_responseStatus,
          m_responseTitle: m_responseTitle,
          response: response,
        };
        currCtx.executeQueryAsync(
          Function.createDelegate(data, onUpdated1Succeeded),
          Function.createDelegate(data, onUpdated1Failed)
        );
      },
      function (sender, args) {
        alert(
          "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
        );
        setTimeout(function () {
          m_fnRefresh();
        }, 200);
      }
    );
  }

  //This gets executed when on refresh if a response does not have broken permissions. When a new response is created from the list form, we
  //cant set the permissions until it's been created. So, on callback, refresh is called and checks for responses that don't have broken permissions
  function m_fnBreakResponsePermissions(
    oListItem,
    refreshPageOnUpdate,
    checkStatus
  ) {
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    this.currentUser = currCtx.get_web().get_currentUser();
    this.ownerGroup = web.get_associatedOwnerGroup();
    this.memberGroup = web.get_associatedMemberGroup();
    this.visitorGroup = web.get_associatedVisitorGroup();

    var permissionsToCheck = SP.PermissionKind.viewListItems;
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

    if (!oListItem.get_hasUniqueRoleAssignments()) {
      special1HasRead = false;
      special2HasRead = false;
    }

    oListItem.resetRoleInheritance();
    oListItem.breakRoleInheritance(false, false);

    var roleDefBindingCollAdmin = SP.RoleDefinitionBindingCollection.newObject(
      currCtx
    );
    roleDefBindingCollAdmin.add(
      currCtx
        .get_web()
        .get_roleDefinitions()
        .getByType(SP.RoleType.administrator)
    );

    var roleDefBindingCollContribute = SP.RoleDefinitionBindingCollection.newObject(
      currCtx
    );
    roleDefBindingCollContribute.add(
      currCtx.get_web().get_roleDefinitions().getByType(SP.RoleType.contributor)
    );

    var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject(
      currCtx
    );
    roleDefBindingCollRestrictedRead.add(
      currCtx.get_web().get_roleDefinitions().getByName("Restricted Read")
    );

    var roleDefBindingCollRestrictedContribute = SP.RoleDefinitionBindingCollection.newObject(
      currCtx
    );
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

    //add action offices
    var actionOffice = oListItem.get_item("ActionOffice");
    if (actionOffice != null) {
      var actionOfficeName = actionOffice.get_lookupValue();
      var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName(
        actionOfficeName
      );
      var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup(
        actionOfficeGroupName
      );

      if (actionOfficeGroup != null) {
        if (
          checkStatus &&
          (oListItem.get_item("ResStatus") == "1-Open" ||
            oListItem.get_item("ResStatus") == "3-Returned to Action Office")
        )
          oListItem
            .get_roleAssignments()
            .add(actionOfficeGroup, roleDefBindingCollRestrictedContribute);
        else
          oListItem
            .get_roleAssignments()
            .add(actionOfficeGroup, roleDefBindingCollRestrictedRead);
      }
    }

    if (special1HasRead && oListItem.get_item("ResStatus") == "7-Closed") {
      var group1SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameSpecialPerm1()
      );
      if (group1SpecialPerm != null)
        oListItem
          .get_roleAssignments()
          .add(group1SpecialPerm, roleDefBindingCollRestrictedRead);
    }

    if (special2HasRead && oListItem.get_item("ResStatus") == "7-Closed") {
      var group2SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameSpecialPerm2()
      );
      if (group2SpecialPerm != null)
        oListItem
          .get_roleAssignments()
          .add(group2SpecialPerm, roleDefBindingCollRestrictedRead);
    }

    oListItem.get_roleAssignments().getByPrincipal(currentUser).deleteObject();

    var data = {
      title: oListItem.get_item("Title"),
      refreshPage: refreshPageOnUpdate,
      item: oListItem,
    };
    function onUpdateResponsePermsSucceeed() {
      if (this.refreshPage) {
        SP.UI.Notify.addNotification(
          "Updated permissions on Response: " + this.title,
          false
        );
        m_fnRefresh();
      }
    }

    function onUpdateResponsePermsFailed(sender, args) {
      if (this.refreshPage) {
        SP.UI.Notify.addNotification(
          "Failed to update permissions on Response: " +
            this.title +
            args.get_message() +
            "\n" +
            args.get_stackTrace(),
          false
        );
        m_fnRefresh();
      }
    }

    currCtx.executeQueryAsync(
      Function.createDelegate(data, onUpdateResponsePermsSucceeed),
      Function.createDelegate(data, onUpdateResponsePermsFailed)
    );
  }

  function m_fnBreakResponseFolderPermissions(
    oListItemFolder,
    oListItemResponse,
    refreshPageOnUpdate,
    bCheckStatus,
    OnComplete
  ) {
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    this.currentUser = currCtx.get_web().get_currentUser();
    this.ownerGroup = web.get_associatedOwnerGroup();
    this.memberGroup = web.get_associatedMemberGroup();
    this.visitorGroup = web.get_associatedVisitorGroup();

    var special1HasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
      oListItemFolder,
      Audit.Common.Utilities.GetGroupNameSpecialPerm1(),
      SP.PermissionKind.viewListItems
    );
    var special2HasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
      oListItemFolder,
      Audit.Common.Utilities.GetGroupNameSpecialPerm2(),
      SP.PermissionKind.viewListItems
    );

    if (!oListItemFolder.get_hasUniqueRoleAssignments()) {
      special1HasRead = false;
      special2HasRead = false;
    }

    oListItemFolder.resetRoleInheritance();
    oListItemFolder.breakRoleInheritance(false, false);

    var roleDefBindingCollAdmin = SP.RoleDefinitionBindingCollection.newObject(
      currCtx
    );
    roleDefBindingCollAdmin.add(
      currCtx
        .get_web()
        .get_roleDefinitions()
        .getByType(SP.RoleType.administrator)
    );

    var roleDefBindingCollContribute = SP.RoleDefinitionBindingCollection.newObject(
      currCtx
    );
    roleDefBindingCollContribute.add(
      currCtx.get_web().get_roleDefinitions().getByType(SP.RoleType.contributor)
    );

    var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject(
      currCtx
    );
    roleDefBindingCollRestrictedRead.add(
      currCtx.get_web().get_roleDefinitions().getByName("Restricted Read")
    );

    var roleDefBindingCollRestrictedContribute = SP.RoleDefinitionBindingCollection.newObject(
      currCtx
    );
    roleDefBindingCollRestrictedContribute.add(
      currCtx.get_web().get_roleDefinitions().getByName("Restricted Contribute")
    );

    //add associated site groups
    oListItemFolder
      .get_roleAssignments()
      .add(ownerGroup, roleDefBindingCollAdmin);
    oListItemFolder
      .get_roleAssignments()
      .add(memberGroup, roleDefBindingCollContribute);
    oListItemFolder
      .get_roleAssignments()
      .add(visitorGroup, roleDefBindingCollRestrictedRead);

    //add action offices
    var actionOffice = oListItemResponse.get_item("ActionOffice");
    if (actionOffice != null) {
      var actionOfficeName = actionOffice.get_lookupValue();
      var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName(
        actionOfficeName
      );
      var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup(
        actionOfficeGroupName
      );

      if (actionOfficeGroup != null) {
        if (
          bCheckStatus &&
          (oListItemResponse.get_item("ResStatus") == "1-Open" ||
            oListItemResponse.get_item("ResStatus") ==
              "3-Returned to Action Office")
        )
          oListItemFolder
            .get_roleAssignments()
            .add(actionOfficeGroup, roleDefBindingCollRestrictedContribute);
        else
          oListItemFolder
            .get_roleAssignments()
            .add(actionOfficeGroup, roleDefBindingCollRestrictedRead);
      }
    }

    if (
      special1HasRead &&
      oListItemResponse.get_item("ResStatus") == "7-Closed"
    ) {
      var group1SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameSpecialPerm1()
      );
      if (group1SpecialPerm != null)
        oListItemFolder
          .get_roleAssignments()
          .add(group1SpecialPerm, roleDefBindingCollRestrictedRead);
    }

    if (
      special2HasRead &&
      oListItemResponse.get_item("ResStatus") == "7-Closed"
    ) {
      var group2SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameSpecialPerm2()
      );
      if (group2SpecialPerm != null)
        oListItemFolder
          .get_roleAssignments()
          .add(group2SpecialPerm, roleDefBindingCollRestrictedRead);
    }

    oListItemFolder
      .get_roleAssignments()
      .getByPrincipal(currentUser)
      .deleteObject();

    var data = {
      title: oListItemResponse.get_item("Title"),
      refreshPage: refreshPageOnUpdate,
      OnComplete: OnComplete,
    };
    function onUpdateResponseFolderPermsSucceeed() {
      if (this.refreshPage) {
        SP.UI.Notify.addNotification(
          "Updated permissions on Response Folder: " + this.title,
          false
        );
        setTimeout(function () {
          m_fnRefresh();
        }, 200);
      } else if (this.OnComplete) this.OnComplete(true);
    }

    function onUpdateResponseFolderPermsFailed(sender, args) {
      if (this.refreshPage) {
        SP.UI.Notify.addNotification(
          "Failed to update permissions on Response Folder: " +
            this.title +
            args.get_message() +
            "\n" +
            args.get_stackTrace(),
          false
        );
        setTimeout(function () {
          m_fnRefresh();
        }, 200);
      } else if (this.OnComplete) {
        this.OnComplete(true);
      }
    }

    currCtx.executeQueryAsync(
      Function.createDelegate(data, onUpdateResponseFolderPermsSucceeed),
      Function.createDelegate(data, onUpdateResponseFolderPermsFailed)
    );
  }

  var validation = {
    isNotEmpty: function (str) {
      var pattern = /\S+/;
      return pattern.test(str); // returns a boolean
    },
    isNumber: function (str) {
      var pattern = /^\d+$/;
      return pattern.test(str); // returns a boolean
    },
  };

  function m_fnBindHandlersOnLoad() {
    $("#btnUploadResponses").click(function () {
      m_fnUploadResponses();
    });
    $("#btnLoadResponses").click(function () {
      m_fnLoadResponses();
    });
    $("#btnCreateResponses").click(function () {
      m_fnCreateResponses();
    });
    $("#btnCommitResponses").click(function () {
      m_fnCommitResponses();
    });
  }

  function OnCallbackForm(result, value) {
    m_fnLoadBulkResponses();
  }

  var publicMembers = {
    Refresh: m_fnRefresh,
  };

  return publicMembers;
};
