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
    pendingClose: {
      text: "Pending Close - Date, Closed By Required",
      icon: "ui-icon ui-icon-notice",
      class: "pending",
    },
    pendingReturnToAO: {
      text: "Pending Return to AO, Reject Reason Required",
      icon: "ui-icon ui-icon-notice",
      class: "pending",
    },
    pendingApproveForQA: {
      text: "Pending Approval for QA, No Sensitivity Set",
      icon: "ui-icon ui-icon-notice",
      class: "pending",
    },
    staged: {
      text: "Staged - Ready to Commit",
      icon: "ui-icon ui-icon-pencil",
    },
    saving: {
      text: "Saving Changes",
      icon: "ui-icon ui-icon-transfer-e-w",
    },
    permissions: {
      text: "Breaking Permissions",
      icon: "ui-icon ui-icon-key",
    },
    folderPermissions: {
      text: "Breaking Folder Permissions",
      icon: "ui-icon ui-icon-key",
    },
    coversheetPermissions: {
      text: "Breaking Coversheet Permissions",
      icon: "ui-icon ui-icon-key",
    },
    returningToAO: {
      text: "Returning to AO",
      icon: "ui-icon ui-icon-arrowreturn-1-w",
    },
    approvingForQA: {
      text: "Approving for QA",
      icon: "ui-icon ui-icon-transferthick-e-w",
    },
    sendingEmail: {
      text: "Sending Email",
      icon: "ui-icon ui-icon-mail-open",
    },
    committed: {
      text: "Changes Committed",
      icon: "ui-icon ui-icon-circle-check",
      class: "committed",
    },
    error: {
      text: "Error",
      icon: "ui-icon ui-icon-alert",
      class: "error",
    },
  };

  var responseStatusOptKeys = {
    open: "1-Open",
    submitted: "2-Submitted",
    returnedToAO: "3-Returned to Action Office",
    approvedForQA: "4-Approved for QA",
    returnedToGFS: "5-Returned to GFS",
    reposted: "6-Reposted After Rejection",
    closed: "7-Closed",
  };

  ko.bindingHandlers.jqueryDateField = {
    init: function (element, valueAccessor, allBindingsAccessor) {
      var dateFieldObj = valueAccessor();

      try {
        $(element).datepicker();
        $(element).change(function (event) {
          var value = valueAccessor();
          value($(element).val());
        });
      } catch (e) {
        console.warn("error", e);
      }
    },
    update: function (
      element,
      valueAccessor,
      allBindings,
      viewModel,
      bindingContext
    ) {
      var value = valueAccessor();
      var valueUnwrapped = ko.unwrap(value);
      // var formattedDate = new Date(valueUnwrapped).format("MM/dd/yyyy"); //.format("yyyy-MM-dd");
      $(element).val(valueUnwrapped);
    },
  };

  ko.bindingHandlers.people = {
    init: function (element, valueAccessor, allBindingsAccessor) {
      var schema = {};
      schema["PrincipalAccountType"] = "User";
      schema["SearchPrincipalSource"] = 15;
      schema["ShowUserPresence"] = true;
      schema["ResolvePrincipalSource"] = 15;
      schema["AllowEmailAddresses"] = true;
      schema["AllowMultipleValues"] = false;
      schema["MaximumEntitySuggestions"] = 50;
      schema["Width"] = "280px";
      schema["OnUserResolvedClientScript"] = function (elemId, userKeys) {
        //  get reference of People Picker Control
        var pickerElement =
          SPClientPeoplePicker.SPClientPeoplePickerDict[elemId];
        var observable = valueAccessor();
        var userJSObject = pickerElement.GetControlValueAsJSObject()[0];
        if (userJSObject) {
          ensureUser(userJSObject.Key, function (user) {
            var userObj = new Object();
            userObj["ID"] = user.get_id();
            userObj["userName"] = user.get_loginName();
            userObj["isEnsured"] = true;
            userObj["ensuredUser"] = user;
            userObj["title"] = user.get_title();
            observable(userObj);
          });
        } else {
          observable(null);
        }
        //observable(pickerElement.GetControlValueAsJSObject()[0]);
        //console.log(JSON.stringify(pickerElement.GetControlValueAsJSObject()[0]));
      };

      //  TODO: You can provide schema settings as options
      var mergedOptions = allBindingsAccessor().options || schema;

      //  Initialize the Control, MS enforces to pass the Element ID hence we need to provide
      //  ID to our element, no other options
      this.SPClientPeoplePicker_InitStandaloneControlWrapper(
        element.id,
        null,
        mergedOptions
      );
    },
    update: function (
      element,
      valueAccessor,
      allBindings,
      viewModel,
      bindingContext
    ) {
      //debugger;
      //  Force to Ensure User
      var userValue = ko.utils.unwrapObservable(valueAccessor());
      if (userValue && !userValue.isEnsured) {
        var pickerControl =
          SPClientPeoplePicker.SPClientPeoplePickerDict[
            element.id + "_TopSpan"
          ];
        var editId = "#" + pickerControl.EditorElementId;
        jQuery(editId).val(userValue.userName);

        // Resolve the User
        pickerControl.AddUnresolvedUserFromEditor(true);
      }
    },
  };

  function ensureUser(userName, callback) {
    var context = new SP.ClientContext.get_current();
    var user = context.get_web().ensureUser(userName);

    function onEnsureUserSucceeded(sender, args) {
      var self = this;
      self.callback(user);
    }

    function onEnsureUserFailed(sender, args) {
      console.error(
        "Failed to ensure user :" +
          args.get_message() +
          "\n" +
          args.get_stackTrace()
      );
    }
    data = { user: user, callback: callback };

    context.load(user);
    context.executeQueryAsync(
      Function.createDelegate(data, onEnsureUserSucceeded),
      Function.createDelegate(data, onEnsureUserFailed)
    );
  }

  function ensureUserById(userId, callback) {
    var context = new SP.ClientContext.get_current();
    var user = context.get_web().getUserById(userId);

    function onRequestSuccess() {
      callback(user);
    }

    function onRequestFail(sender, args) {
      alert("error msg");
    }
    data = { user: user, callback: callback };

    context.load(user);
    context.executeQueryAsync(
      Function.createDelegate(data, onRequestSuccess),
      Function.createDelegate(data, onRequestFail)
    );
  }

  function PeopleField() {
    var self = this;
    self.loading = ko.observable(false);
    this.user = ko.observable();
    this.userName = ko.pureComputed({
      read: function () {
        return self.user() ? self.user().userName : "";
      },
    });
    this.title = ko.pureComputed(function () {
      return self.user() ? self.user().title : "";
    });
    this.setItemFormat = ko.pureComputed(function () {
      return self.user()
        ? self.user().ID + ";#" + self.user().userName + ";#"
        : "";
    });
    this.userId = ko.pureComputed(
      {
        read: function () {
          if (self.user()) {
            return self.user().ID;
          }
          return "";
        },
        write: function (value) {
          self.loading(true);
          if (value) {
            var user = {};
            switch (value.constructor.getName()) {
              case "SP.FieldUserValue":
                ensureUserById(value.get_lookupId(), function (ensuredUser) {
                  user.ID = ensuredUser.get_id();
                  user.userName = ensuredUser.get_loginName();
                  user.title = ensuredUser.get_title();
                  user.isEnsured = false;
                  self.user(user);
                  self.lookupUser(value);
                  self.loading(false);
                });
                break;
              case "SP.User":
                user.ID = value.get_id();
                user.userName = value.get_loginName();
                user.title = value.get_title();
                user.isEnsured = false;
                self.user(user);
                self.lookupUser(value);
                self.loading(false);
                break;
              default:
                break;
            }
          } else {
            self.user(null);
            self.lookupUser(null);
            self.loading(false);
          }
        },
      },
      this
    );
    this.lookupUser = ko.observable();
    this.ensuredUser = ko.observable();
  }

  function JqueryDateTimeField(newDate) {
    var newDate = newDate === undefined ? "" : newDate;

    var self = this;

    self.datetime = ko.observable(newDate);

    self.isDate = ko.pureComputed(function () {
      return typeof self.datetime().getMonth === "function";
    });

    self.formatted = ko.pureComputed(function () {
      return self.isDate() ? self.datetime().format("yyyy-MM-dd HH:mm") : "";
    });

    // Hold the date/year portion of our template
    self.date = ko.pureComputed({
      write: function (newDate) {
        var parsedDate = new Date(newDate);
        if (!newDate) {
          // User cleared the date field
          self.datetime("");
        } else if (!isNaN(parsedDate.getTime())) {
          if (typeof self.datetime().getMonth === "function") {
            var day = parsedDate.getDate();
            var month = parsedDate.getMonth();
            var year = parsedDate.getFullYear();
            self.datetime().setDate(day);
            self.datetime().setMonth(month);
            self.datetime().setYear(year);
          } else {
            //new Date, initialize
            self.datetime(parsedDate);
          }
        }
      },
      read: function () {
        if (typeof self.datetime().getMonth === "function") {
          return self.datetime().format("MM/dd/yyyy");
        } else {
          return "";
        }
      },
    });
    // Hold the hour of our template
    self.HH = ko.pureComputed({
      write: function (newHH) {
        if (typeof self.datetime().getMonth === "function") {
          self.datetime().setHours(newHH);
        }
      },
      read: function () {
        if (self.isDate()) {
          return self.datetime().getHours();
        }
      },
    });
    // Hold the minutes of our template
    self.mm = ko.pureComputed({
      write: function (newMm) {
        if (typeof self.datetime().getMonth === "function") {
          self.datetime().setMinutes(newMm);
        }
      },
      read: function () {
        if (self.isDate()) {
          return self.datetime().getMinutes();
        }
      },
    });
  }

  function ResponseItem() {
    var self = this;
    self.isMutated = false;
    // We need to track if all these fields have been initialized
    // Otherwise we'll trigger a mutation on the first peoplefield
    self.isLoaded = ko.observable(false);
    self.ID = 0;
    self.number = "";
    self.title = "";
    self.item = {};
    self.sample = "";
    self.actionOffice = {};
    self.status = "";
    self.returnReason = "";
    self.comments = "";
    self.closedDate = "";
    self.closedBy = new PeopleField();
    self.POC = new PeopleField();
    self.POCCC = new PeopleField();

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
    self.newClosedDate = new JqueryDateTimeField();
    self.newClosedBy = new PeopleField();
    self.newPOC = new PeopleField();
    self.newPOCCC = new PeopleField();

    self.mutations = ko.observableArray([]);

    self.isMutated = ko.pureComputed(function () {
      if (self.isLoaded()) {
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
        if (self.newClosedDate.datetime() != self.closedDate) {
          self.mutations.push("ClosedDate");
        }
        if (!comparePeople(self.newClosedBy, self.closedBy)) {
          self.mutations.push("ClosedBy");
        }
        if (!comparePeople(self.newPOC, self.POC)) {
          self.mutations.push("POC");
        }
        if (!comparePeople(self.newPOCCC, self.POCCC)) {
          self.mutations.push("POCCC");
        }

        var isMutated = self.mutations().length ? true : false;
        if (isMutated) {
          // Now check our conditionals
          // if closed, we need date + closedby
          switch (self.newStatus()) {
            case responseStatusOptKeys.closed:
              if (
                !self.newClosedDate.datetime() ||
                !self.newClosedBy.userId()
              ) {
                self.commitStatus(commitStatusOpts.pendingClose);
              } else {
                self.commitStatus(commitStatusOpts.staged);
              }
              break;
            case responseStatusOptKeys.returnedToAO:
              if (!self.newReturnReason()) {
                self.commitStatus(commitStatusOpts.pendingReturnToAO);
              } else {
                self.commitStatus(commitStatusOpts.staged);
              }
              break;
            case responseStatusOptKeys.approvedForQA:
              if (m_oRequest.sensitivity == "None") {
                self.commitStatus(commitStatusOpts.pendingApproveForQA);
              } else {
                self.commitStatus(commitStatusOpts.staged);
              }
              break;
            default:
              self.commitStatus(commitStatusOpts.staged);
          }
        } else {
          self.commitStatus("");
        }
        return isMutated;
      }
    });

    self.mutationStatusClass = ko.pureComputed(function () {
      if (!self.commitStatus()) {
        return "";
      }
      var commitClass = self.commitStatus()["class"];

      return commitClass ? commitClass : "mutated";
    });

    self.commitStatusIcon = ko.pureComputed(function () {
      return self.commitStatus() && self.commitStatus()["icon"];
    });

    self.commitStatus = ko.observable("");

    self.commitStatus.subscribe(function (status) {
      if (status === commitStatusOpts.staged) {
        //m_fnCommitResponse(self);
      }
    });

    self.isEditable = ko.pureComputed(function () {
      // Check if we're closed
      if (self.status === responseStatusOptKeys.closed) {
        return false;
      }

      return self.commitStatus() !== commitStatusOpts.committed;
    });
  }

  function comparePeople(person1, person2) {
    if (person1.loading() || person2.loading()) {
      // Still loading, assume these are equivalent
      return true;
    }

    if (person1.userId() == person2.userId()) {
      return true;
    }

    return false;
  }
  function ViewModel() {
    var self = this;

    self.requestNum = ko.observable();
    self.arrActionOffices = ko.observable();
    self.arrResponses = ko.observableArray();

    self.arrMutatedResponses = ko.pureComputed(function () {
      return self.arrResponses().filter(function (response) {
        return response.isMutated();
        // return response.commitStatus() === commitStatusOpts.committed;
      });
    });

    self.arrStagedResponses = ko.pureComputed(function () {
      return self.arrResponses().filter(function (response) {
        return (
          response.isMutated() &&
          response.commitStatus() == commitStatusOpts.staged
        );
        // return response.commitStatus() === commitStatusOpts.committed;
      });
    });

    self.responseStatusOpts = ko.pureComputed(function () {
      keys = Object.keys(responseStatusOptKeys);
      return keys.map(function (key) {
        return responseStatusOptKeys[key];
      });
    });

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
  var liftedFunctions = SP.UI.ModalDialog.get_childDialog().get_args();
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
      "Include(ID, Title, ReqSubject, ReqStatus, IsSample, Sensitivity, ReqDueDate, InternalDueDate, ActionOffice, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
    );

    var responseList = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetListTitleResponses());
    var responseQuery = new SP.CamlQuery();
    responseQuery.set_viewXml(
      '<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="SampleNumber"/></OrderBy>' +
        '<Where><Eq><FieldRef Name="ReqNum"/><Value Type="Text">' +
        m_reqNum +
        "</Value></Eq></Where>" +
        "</Query></View>"
    );
    m_responseItems = responseList.getItems(responseQuery);
    currCtx.load(
      m_responseItems,
      "Include(ID, Title, ReqNum, ActionOffice, SampleNumber, ResStatus, ReturnReason, Comments, ClosedDate, ClosedBy, POC, POCCC)"
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
      $("#divLoadBulkResponsesOutput").show();
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
      var sensitivity = oListItem.get_item("Sensitivity");

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
      requestObject["sensitivity"] = sensitivity;
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
          responseObject["actionOffice"] =
            responseObject["actionOffice"].get_lookupValue();

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

        var closedDate = oListItem.get_item("ClosedDate");
        responseObject["closedDate"] = closedDate;
        if (closedDate && typeof closedDate.getMonth === "function") {
          responseObject["closedDate"] = closedDate;
          responseObject["newClosedDate"].datetime(closedDate);
        } else {
          responseObject["closedDate"] = "";
          responseObject["newClosedDate"].datetime("");
        }

        var closedBy = oListItem.get_item("ClosedBy");
        responseObject["closedBy"].userId(closedBy);
        responseObject["newClosedBy"].userId(closedBy);

        var POC = oListItem.get_item("POC");
        responseObject["POC"].userId(POC);
        responseObject["newPOC"].userId(POC);

        var POCCC = oListItem.get_item("POCCC");
        responseObject["POCCC"].userId(POCCC);
        responseObject["newPOCCC"].userId(POCCC);

        responseObject["isLoaded"](true);
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

    // If any of our responses are destined for QA, break the permissions on the request
    // first.
    var responsesForQA = vm.arrStagedResponses().filter(function (response) {
      return response.newStatus() == responseStatusOptKeys.approvedForQA;
    });

    if (responsesForQA.length) {
      var oRequest = m_fnGetRequestByNumber(m_requestNum);
      m_fnBreakRequestPermissions(
        m_oRequest.item,
        false,
        responseStatusOptKeys.approvedForQA,
        m_fnRunCommitLoop
      );
    } else {
      // go ahead and commit all.
      m_fnRunCommitLoop(true);
    }
  }

  function m_fnRunCommitLoop(bDoneBreakingPermissions) {
    if (!bDoneBreakingPermissions) {
      alert("error breaking request permissions");
      setTimeout(function () {
        m_fnRefresh();
      }, 500);
      return;
    }
    vm.arrStagedResponses().forEach(function (response) {
      m_fnCommitResponse(response);
    });
  }

  function m_fnCommitResponse(response) {
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
    if (
      response.closedDate != response.newClosedDate.datetime() &&
      response.newClosedDate.datetime()
    ) {
      oListItem.set_item(
        "ClosedDate",
        response.newClosedDate.datetime().toISOString()
      );
    }
    if (!comparePeople(response.closedBy, response.newClosedBy)) {
      oListItem.set_item("ClosedBy", response.newClosedBy.setItemFormat());
    }
    if (!comparePeople(response.POC, response.newPOC)) {
      oListItem.set_item("POC", response.newPOC.setItemFormat());
    }
    if (!comparePeople(response.POCCC, response.newPOCCC)) {
      oListItem.set_item("POCCC", response.newPOCCC.setItemFormat());
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
      OnCallbackCommitResponseAudit(response);
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
  }

  // var m_countCSToUpdateOnEditResponse = 0;
  // var m_countCSUpdatedOnEditResponse = 0;

  function OnCallbackCommitResponseAudit(response) {
    response.m_countCSToUpdateOnEditResponse = 0;
    response.m_countCSUpdatedOnEditResponse = 0;

    document.body.style.cursor = "wait";
    var notifyId = SP.UI.Notify.addNotification("Please wait... ", false);

    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    var m_responseTitle = response.title;

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
      "Include(ID, Title, ActionOffice, POC, POCCC, ReturnReason, ResStatus, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
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

    var folderPath =
      Audit.Common.Utilities.GetSiteUrl() +
      "/" +
      Audit.Common.Utilities.GetLibNameResponseDocs() +
      "/" +
      m_responseTitle;
    var responseDocQuery2 = new SP.CamlQuery();
    responseDocQuery2.set_viewXml(
      "<View Scope=\"RecursiveAll\"><Query><Where><And><Eq><FieldRef Name='FileDirRef'/><Value Type='Text'>" +
        folderPath +
        "</Value></Eq><Eq><FieldRef Name='DocumentStatus'/><Value Type='Text'>Submitted</Value></Eq></And></Where></Query></View>"
    );
    var responseDocSubmittedItems = responseDocLib.getItems(responseDocQuery2);
    currCtx.load(
      responseDocSubmittedItems,
      "Include(ID, DocumentStatus, FileDirRef, Created, FileLeafRef)"
    );

    var responseDocQuery6 = new SP.CamlQuery();
    responseDocQuery6.set_viewXml(
      "<View Scope=\"RecursiveAll\"><Query><Where><And><Eq><FieldRef Name='FileDirRef'/><Value Type='Text'>" +
        folderPath +
        "</Value></Eq><Eq><FieldRef Name='DocumentStatus'/><Value Type='Text'>Open</Value></Eq></And></Where></Query></View>"
    );
    var responseDocOpenItems = responseDocLib.getItems(responseDocQuery6);
    currCtx.load(
      responseDocOpenItems,
      "Include(ID, DocumentStatus, FileDirRef, Created, FileLeafRef)"
    );

    var responseDocQuery3 = new SP.CamlQuery();
    responseDocQuery3.set_viewXml(
      "<View Scope=\"RecursiveAll\"><Query><Where><And><Eq><FieldRef Name='FileDirRef'/><Value Type='Text'>" +
        folderPath +
        "</Value></Eq><Eq><FieldRef Name='DocumentStatus'/><Value Type='Text'>Marked for Deletion</Value></Eq></And></Where></Query></View>"
    );
    var responseDocMarkedForDeletionItems =
      responseDocLib.getItems(responseDocQuery3);
    currCtx.load(
      responseDocMarkedForDeletionItems,
      "Include(ID, DocumentStatus, FileDirRef, Created, FileLeafRef)"
    );

    var responseDocQuery4 = new SP.CamlQuery();
    responseDocQuery4.set_viewXml(
      "<View Scope=\"RecursiveAll\"><Query><Where><And><Eq><FieldRef Name='FileDirRef'/><Value Type='Text'>" +
        folderPath +
        "</Value></Eq><Eq><FieldRef Name='DocumentStatus'/><Value Type='Text'>Rejected</Value></Eq></And></Where></Query></View>"
    );
    var responseDocRejectedItems = responseDocLib.getItems(responseDocQuery4);
    currCtx.load(
      responseDocRejectedItems,
      "Include(ID, DocumentStatus, FileDirRef, Created, FileLeafRef)"
    );

    var responseDocQuery8 = new SP.CamlQuery();
    responseDocQuery8.set_viewXml(
      "<View Scope=\"RecursiveAll\"><Query><Where><And><Eq><FieldRef Name='FileDirRef'/><Value Type='Text'>" +
        folderPath +
        "</Value></Eq><Eq><FieldRef Name='DocumentStatus'/><Value Type='Text'>Sent to QA</Value></Eq></And></Where></Query></View>"
    );
    var responseDocSentToQAItems = responseDocLib.getItems(responseDocQuery8);
    currCtx.load(
      responseDocSentToQAItems,
      "Include(ID, DocumentStatus, FileDirRef, Created, FileLeafRef)"
    );

    var emailList = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory());
    var emailListQuery = new SP.CamlQuery();
    emailListQuery.set_viewXml(
      '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>'
    );
    var emailListFolderItems = emailList.getItems(emailListQuery);
    currCtx.load(emailListFolderItems, "Include(ID, Title, DisplayName)");

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
        response.commitStatus(commitStatusOpts.folderPermissions);
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

          if (
            this.oListItem.get_item("ResStatus") ==
              "3-Returned to Action Office" &&
            m_responseStatus != this.oListItem.get_item("ResStatus")
          ) {
            response.commitStatus(commitStatusOpts.returningToAO);
            //status changed
            var oRequest = m_fnGetRequestByNumber(m_requestNum);

            var emailSubject =
              "Please Update your Response for Request Number: " + m_requestNum;
            var emailText = "";

            emailText =
              "<div>Audit Request Reference: <b>{REQUEST_NUMBER}</b></div>" +
              "<div>Audit Request Subject: <b>{REQUEST_SUBJECT}</b></div>" +
              "<div>Audit Request Due Date: <b>{REQUEST_DUEDATE}</b></div>" +
              "{POC}" +
              "<div>{RETURN_REASON}</div><br/>" +
              "<div>Please provide responses for the following Sample(s): </div><br/>" +
              "<div>{RESPONSE_TITLES}</div>";

            var returnReason = this.oListItem.get_item("ReturnReason");
            if (returnReason == null) returnReason = "";
            else returnReason = "Return Reason: " + returnReason;

            emailText = emailText.replace("{RETURN_REASON}", returnReason);

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
            var actionOfficeGroupName =
              Audit.Common.Utilities.GetAOSPGroupName(ao);

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
          } else if (
            (this.oListItem.get_item("ResStatus") == "4-Approved for QA" ||
              this.oListItem.get_item("ResStatus") ==
                "6-Reposted After Rejection") &&
            m_responseStatus != this.oListItem.get_item("ResStatus")
          ) {
            response.commitStatus(commitStatusOpts.approvingForQA);

            //status changed
            var oRequest = m_fnGetRequestByNumber(m_requestNum);

            var bDoneBreakingReqPermisions = false;

            var cntForQA = 0;
            if (responseDocSubmittedItems != null) {
              var listItemEnumerator1 =
                responseDocSubmittedItems.getEnumerator();
              while (listItemEnumerator1.moveNext()) {
                var oListItem1 = listItemEnumerator1.get_current();

                oListItem1.set_item(
                  "FileLeafRef",
                  m_fnGetNewResponseDocTitle(
                    oListItem1,
                    newResponseFolderTitle,
                    oRequest.sensitivity
                  )
                );
                oListItem1.set_item("DocumentStatus", "Sent to QA");
                oListItem1.update();
                cntForQA++;
              }
            }
            if (responseDocOpenItems != null) {
              var listItemEnumerator1 = responseDocOpenItems.getEnumerator();
              while (listItemEnumerator1.moveNext()) {
                var oListItem1 = listItemEnumerator1.get_current();

                oListItem1.set_item(
                  "FileLeafRef",
                  m_fnGetNewResponseDocTitle(
                    oListItem1,
                    newResponseFolderTitle,
                    oRequest.sensitivity
                  )
                );
                oListItem1.set_item("DocumentStatus", "Sent to QA");
                oListItem1.update();
                cntForQA++;
              }
            }
            if (responseDocSentToQAItems != null) {
              var listItemEnumerator1 =
                responseDocSentToQAItems.getEnumerator();
              while (listItemEnumerator1.moveNext()) {
                var oListItem1 = listItemEnumerator1.get_current();
                cntForQA++;
              }
            }

            //these are the documents that are marked for deletion by the AO
            if (responseDocMarkedForDeletionItems != null) {
              var arrItemsToRecyle = new Array();

              var listItemEnumerator1 =
                responseDocMarkedForDeletionItems.getEnumerator();
              while (listItemEnumerator1.moveNext()) {
                var oListItem1 = listItemEnumerator1.get_current();
                arrItemsToRecyle.push(oListItem1);
              }

              for (var x = 0; x < arrItemsToRecyle.length; x++) {
                arrItemsToRecyle[x].deleteObject(); //change this to delete to remove from recycle bin
              }
            }

            var cntRejected = 0;
            if (responseDocRejectedItems != null) {
              var listItemEnumerator1 =
                responseDocRejectedItems.getEnumerator();
              while (listItemEnumerator1.moveNext()) {
                var oListItem1 = listItemEnumerator1.get_current();
                oListItem1.set_item("DocumentStatus", "Archived");
                oListItem1.update();
                cntRejected++;
              }
            }

            response.commitStatus(commitStatusOpts.sendingEmail);
            {
              var requestNumber = oRequest.number;
              var requestSubject = oRequest.subject;
              var internalDueDate = oRequest.internalDueDate;

              var emailSubject =
                "Your Approval Has Been Requested for Response Number: " +
                newResponseFolderTitle;
              var emailText =
                "<div>Audit Request Reference: <b>" +
                m_requestNum +
                "</b></div>" +
                "<div>Audit Request Subject: <b>" +
                requestSubject +
                "</b></div>" +
                "<div>Audit Request Due Date: <b>" +
                internalDueDate +
                "</b></div><br/>" +
                "<div>Response: <b><ul><li>" +
                newResponseFolderTitle +
                "</li></ul></b></div><br/>" +
                "<div>Please review: <b>" +
                cntForQA +
                "</b> documents.</div><br/>";

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
              oListItemEmail.set_item(
                "To",
                Audit.Common.Utilities.GetGroupNameQA()
              );
              oListItemEmail.set_item("NotificationType", "QA Notification");
              oListItemEmail.set_item("ReqNum", m_requestNum);
              oListItemEmail.set_item("ResID", newResponseFolderTitle);
              oListItemEmail.update();
            }
            currCtx2.executeQueryAsync(
              function () {
                if (
                  oRequest.coversheets == null ||
                  oRequest.coversheets.length == 0
                ) {
                  document.body.style.cursor = "default";
                  response.commitStatus(commitStatusOpts.committed);
                } else {
                  for (var x = 0; x < oRequest.coversheets.length; x++) {
                    response.m_countCSToUpdateOnEditResponse++;
                    response.commitStatus(
                      commitStatusOpts.coversheetPermissions
                    );
                    //give QA access to the coversheet
                    var bDoneBreakingCSOnEditResponse = false;
                    liftedFunctions.m_fnBreakCoversheetPermissions(
                      oRequest.coversheets[x].item,
                      true,
                      false,
                      function () {
                        response.m_countCSUpdatedOnEditResponse++;

                        if (
                          response.m_countCSToUpdateOnEditResponse ==
                          response.m_countCSUpdatedOnEditResponse
                        ) {
                          document.body.style.cursor = "default";
                          response.commitStatus(commitStatusOpts.committed);
                        }
                      }
                    );
                  }
                }
              },
              function (sender, args) {
                alert(
                  "Request failed: " +
                    args.get_message() +
                    "\n" +
                    args.get_stackTrace()
                );
                response.commitStatus(commitStatusOpts.error);
                document.body.style.cursor = "default";
              }
            );
          } else {
            document.body.style.cursor = "default";
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

  function m_fnGetNewResponseDocTitle(
    responseDocItem,
    responseName,
    sensitivity
  ) {
    var createdDate = responseDocItem.get_item("Created");
    var newResponseDocTitle =
      responseName + "_" + createdDate.format("yyyyMMddTHHmmss");

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
  //This gets executed when on refresh if a response does not have broken permissions. When a new response is created from the list form, we
  //cant set the permissions until it's been created. So, on callback, refresh is called and checks for responses that don't have broken permissions
  function m_fnBreakResponsePermissions(
    oListItem,
    refreshPageOnUpdate,
    checkStatus
  ) {
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    var currentUser = currCtx.get_web().get_currentUser();
    var ownerGroup = web.get_associatedOwnerGroup();
    var memberGroup = web.get_associatedMemberGroup();
    var visitorGroup = web.get_associatedVisitorGroup();

    //check QA before resetting
    var permissionsToCheck = SP.PermissionKind.viewListItems;
    var qaHasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
      oListItem,
      Audit.Common.Utilities.GetGroupNameQA(),
      permissionsToCheck
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
      currCtx
        .get_web()
        .get_roleDefinitions()
        .getByType(SP.RoleType.administrator)
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

    //add action offices
    var actionOffice = oListItem.get_item("ActionOffice");
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

    if (
      qaHasRead ||
      oListItem.get_item("ResStatus") == "4-Approved for QA" ||
      oListItem.get_item("ResStatus") == "6-Reposted After Rejection"
    ) {
      //make sure qa gets read if it had access
      var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameQA()
      );
      if (spGroupQA != null) {
        if (
          (oListItem.get_item("ResStatus") == "4-Approved for QA" ||
            oListItem.get_item("ResStatus") == "6-Reposted After Rejection") &&
          checkStatus
        )
          oListItem
            .get_roleAssignments()
            .add(spGroupQA, roleDefBindingCollRestrictedContribute);
        else
          oListItem
            .get_roleAssignments()
            .add(spGroupQA, roleDefBindingCollRestrictedRead);
      }
    }

    if (
      special1HasRead &&
      (oListItem.get_item("ResStatus") == "4-Approved for QA" ||
        oListItem.get_item("ResStatus") == "6-Reposted After Rejection" ||
        oListItem.get_item("ResStatus") == "7-Closed")
    ) {
      var group1SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameSpecialPerm1()
      );
      if (group1SpecialPerm != null)
        oListItem
          .get_roleAssignments()
          .add(group1SpecialPerm, roleDefBindingCollRestrictedRead);
    }

    if (
      special2HasRead &&
      (oListItem.get_item("ResStatus") == "4-Approved for QA" ||
        oListItem.get_item("ResStatus") == "6-Reposted After Rejection" ||
        oListItem.get_item("ResStatus") == "7-Closed")
    ) {
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

    var qaHasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
      oListItemFolder,
      Audit.Common.Utilities.GetGroupNameQA(),
      SP.PermissionKind.viewListItems
    );
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

    var roleDefBindingCollAdmin =
      SP.RoleDefinitionBindingCollection.newObject(currCtx);
    roleDefBindingCollAdmin.add(
      currCtx
        .get_web()
        .get_roleDefinitions()
        .getByType(SP.RoleType.administrator)
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
      var actionOfficeGroupName =
        Audit.Common.Utilities.GetAOSPGroupName(actionOfficeName);
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
      qaHasRead ||
      oListItemResponse.get_item("ResStatus") == "4-Approved for QA" ||
      oListItemResponse.get_item("ResStatus") == "6-Reposted After Rejection"
    ) {
      //make sure qa gets read if it had access
      var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameQA()
      );
      if (spGroupQA != null) {
        if (
          bCheckStatus &&
          (oListItemResponse.get_item("ResStatus") == "4-Approved for QA" ||
            oListItemResponse.get_item("ResStatus") ==
              "6-Reposted After Rejection")
        )
          oListItemFolder
            .get_roleAssignments()
            .add(spGroupQA, roleDefBindingCollRestrictedContribute);
        else
          oListItemFolder
            .get_roleAssignments()
            .add(spGroupQA, roleDefBindingCollRestrictedRead);
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

  function m_fnBreakRequestPermissions(
    oListItem,
    refreshPageOnUpdate,
    responseStatus,
    OnComplete
  ) {
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    var currentUser = web.get_currentUser();
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

    // add site associated groups
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
      m_CntRequestAOsToAdd = 0;
      m_CntRequestAOsAdded = 0;

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
      OnComplete: OnComplete,
    };

    currCtx.executeQueryAsync(
      Function.createDelegate(data, onUpdateReqPermsSucceeed),
      Function.createDelegate(data, onUpdateReqPermsFailed)
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
