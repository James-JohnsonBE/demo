import UploadDocModule from "../../Components/UploadDoc/UploadDocModule.js";
import { TabsModule, Tab } from "../../Components/Tabs/TabsModule.js";
import { setUrlParam } from "../../Common/Router.js";

var Audit = window.Audit || {};
Audit.AOReport = Audit.AOReport || {};

const responseParam = "ResNum";

$(document).ready(function () {
  SP.SOD.executeFunc(
    "sp.js",
    "SP.ClientContext",
    ExecuteOrDelayUntilScriptLoaded(InitReport, "sp.js")
  );
});

function InitReport() {
  Audit.AOReport.Report = new Audit.AOReport.NewReportPage();
  Audit.AOReport.Init();
}

Audit.AOReport.Init = function () {
  var paramShowSiteActionsToAnyone = GetUrlKeyValue("ShowSiteActions");
  if (paramShowSiteActionsToAnyone != true) {
    //hide it even for owners unless this param is passed into the URL; pass in param if you want to change the page web parts/settings
    $("#RibbonContainer-TabRowLeft").hide();
    $(".ms-siteactionsmenu").hide();
  }

  /*setInterval(function() {
	    var divVal = $("#divCounter").text();
	    var count = divVal * 1 - 1;
	    $("#divCounter").text(count);
	    if (count <= 0) {
	       // location.href="https://example.com";
	       Audit.Common.Utilities.Refresh();
	    }
	}, 1000);
	*/

  function SetTimer() {
    var intervalRefreshID = setInterval(function () {
      var divVal = $("#divCounter").text();
      var count = divVal * 1 - 1;
      $("#divCounter").text(count);
      if (count <= 0) {
        if (!Audit.AOReport.Report.IsTransactionExecuting())
          Audit.Common.Utilities.Refresh();
        else {
          clearInterval(intervalRefreshID);
          $("#divCounter").text("1200");
          SetTimer();
        }
      }
    }, 1000);
  }

  SetTimer();
};

Audit.AOReport.NewReportPage = function () {
  var m_bigMap = new Object();
  var m_arrRequests = new Array();
  var m_arrResponses = new Array();
  var m_arrPermissions = new Array();
  var m_IA_SPGroupName = null;

  var ownerGroup,
    memberGroup,
    visitorGroup = null;
  var m_groupColl = null;

  var m_requestItems = null;
  var m_responseItems = null;
  var m_ResponseDocsItems = null;
  var m_aoItems = null;

  var m_responseDocsLibrary = null;

  var m_statusToFilterOn = "";
  var m_curResponseSelectedIsEditableByAO = false;

  var m_bIsTransactionExecuting = false;

  var m_responseStatus1 = "1-Open";
  var m_responseStatus2 = "3-Returned to Action Office";

  ko.bindingHandlers.downloadLink = {
    update: function (
      element,
      valueAccessor,
      allBindings,
      viewModel,
      bindingContext
    ) {
      var path = valueAccessor();
      var replaced = path.replace(/:([A-Za-z_]+)/g, function (_, token) {
        return ko.unwrap(viewModel[token]);
      });
      element.href = replaced;
      //alert( replaced );
    },
  };

  ko.bindingHandlers.toggleClick = {
    init: function (element, valueAccessor, allBindings) {
      var value = valueAccessor();

      ko.utils.registerEventHandler(element, "click", function () {
        var classToToggle = allBindings.get("toggleClass");
        var classContainer = allBindings.get("classContainer");
        var containerType = allBindings.get("containerType");

        if (containerType && containerType == "sibling") {
          $(element)
            .nextUntil(classContainer)
            .each(function () {
              $(this).toggleClass(classToToggle);
            });
        } else if (containerType && containerType == "doc") {
          var curIcon = $(element).attr("src");
          if (curIcon == "/_layouts/images/minus.gif")
            $(element).attr("src", "/_layouts/images/plus.gif");
          else $(element).attr("src", "/_layouts/images/minus.gif");

          if ($(element).parent() && $(element).parent().parent()) {
            $(element)
              .parent()
              .parent()
              .nextUntil(classContainer)
              .each(function () {
                $(this).toggleClass(classToToggle);
              });
          }
        } else if (containerType && containerType == "any") {
          if ($("." + classToToggle).is(":visible"))
            $("." + classToToggle).hide();
          else $("." + classToToggle).show();
        } else $(element).find(classContainer).toggleClass(classToToggle);
      });
    },
  };

  function ViewModel() {
    var self = this;

    self.debugMode = ko.observable(false);
    self.siteUrl = Audit.Common.Utilities.GetSiteUrl();

    self.tabOpts = {
      Responses: new Tab("response-report", "Status Report", {
        id: "responseStatusReportTemplate",
        data: self,
      }),
      ResponseDetail: new Tab("response-detail", "Responses", {
        id: "responseDetailTemplate",
        data: self,
      }),
    };
    self.tabs = new TabsModule(Object.values(self.tabOpts));
    //cant add rate limit because it'll affect the refresh
    //self.arrResponses = ko.observableArray( null ).extend({ rateLimit: 500 });
    self.arrResponses = ko.observableArray(null);
    self.arrFilteredResponsesCount = ko.observable(0);
    self.cntPendingReview = ko.observable(0);

    self.ddOptionsResponseTabRequestID = ko.observableArray();
    self.ddOptionsResponseTabRequestStatus = ko.observableArray();
    self.ddOptionsResponseTabRequestInternalDueDate = ko.observableArray();
    self.ddOptionsResponseTabRequestSample = ko.observableArray();
    self.ddOptionsResponseTabResponseTitle = ko.observableArray();
    self.ddOptionsResponseTabResponseStatus = ko.observableArray();
    self.filterResponseTabRequestIntDueDate = ko.observable();
    self.filterResponseTabResponseName = ko.observable();
    self.filterResponseTabResponseStatus = ko.observable();
    self.doSort = ko.observable(false);

    self.ddOptionsResponseInfoTabResponseNameOpen2 = ko.observableArray();
    self.ddOptionsResponseInfoTabResponseNameProcessed2 = ko.observableArray();
    self.filterResponseInfoTabResponseNameOpen2 = ko.observable("");
    self.filterResponseInfoTabResponseNameProcessed2 = ko.observable("");

    self.currentResponse = ko.observable();
    self.arrCoverSheets = ko.observableArray(null);
    self.arrResponseDocs = ko.observable(null);
    self.cntResponseDocs = ko.observable(0);

    self.showUpload = ko.observable(false);
    self.showSubmit = ko.observable(false);

    self.onNewResponseDocCallback = Audit.Common.Utilities.Refresh;

    self.currentResponse.subscribe((newResponse) => {
      if (!newResponse) return;
      setUrlParam(responseParam, newResponse.title);
    });
    self.selectedFiltersResponseTab = ko.computed(function () {
      var requestIntDueDate = self.filterResponseTabRequestIntDueDate();
      var responseName = self.filterResponseTabResponseName();
      var responseStatus = self.filterResponseTabResponseStatus();

      return requestIntDueDate + " " + responseName + " " + responseStatus;
    });

    /** Behaviors **/

    self.ClearFiltersResponseTab = function () {
      self.filterResponseTabRequestIntDueDate("");
      self.filterResponseTabResponseName("");
      self.filterResponseTabResponseStatus("");
    };

    self.FilterChangedResponseTab = function () {
      document.body.style.cursor = "wait";
      setTimeout(function () {
        var requestIntDueDate = self.filterResponseTabRequestIntDueDate();
        var responseName = self.filterResponseTabResponseName();
        var responseStatus = self.filterResponseTabResponseStatus();

        if (!requestIntDueDate && !responseName && !responseStatus) {
          $(".sr-response-item").show();
          self.arrFilteredResponsesCount(self.arrResponses().length);
          document.body.style.cursor = "default";
          return;
        }

        requestIntDueDate = !requestIntDueDate ? "" : requestIntDueDate;
        responseName = !responseName ? "" : responseName;
        responseStatus = !responseStatus ? "" : responseStatus;

        var count = 0;
        var eacher = $(".sr-response-item");
        eacher.each(function () {
          var hide = false;

          if (
            !hide &&
            requestIntDueDate != "" &&
            $.trim($(this).find(".sr-response-internalDueDate").text()) !=
              requestIntDueDate
          )
            hide = true;
          if (
            !hide &&
            responseName != "" &&
            $.trim($(this).find(".sr-response-title").text()) != responseName
          )
            hide = true;
          if (
            !hide &&
            responseStatus != "" &&
            $.trim($(this).find(".sr-response-status").text()) != responseStatus
          )
            hide = true;

          if (hide) $(this).hide();
          else {
            $(this).show();
            count++;
          }
        });

        self.arrFilteredResponsesCount(count);
        document.body.style.cursor = "default";
      }, 100);
    };

    self.ClickSubmitResponse = function () {
      m_fnSubmitPackage();
    };

    self.ClickUploadResponseDoc = function () {
      var oResponse = self.currentResponse();
      if (oResponse && oResponse.number && oResponse.title)
        m_fnUploadResponseDoc(oResponse.number, oResponse.title);
    };

    self.ClickMarkForDeletionResponseDoc = function (oResponseDoc) {
      if (oResponseDoc && oResponseDoc.ID)
        m_fnMarkForDeletionResponseDoc(oResponseDoc.ID);
    };

    /** Subscriptions **/

    self.selectedFiltersResponseTab.subscribe(function (value) {
      self.FilterChangedResponseTab();
    });

    self.doSort.subscribe(function (newValue) {
      Audit.Common.Utilities.OnLoadDisplayTimeStamp();

      if (self.arrResponses().length > 0 && newValue) {
        //should trigger only once
        self.arrFilteredResponsesCount(self.arrResponses().length);

        //draw these first
        ko.utils.arrayPushAll(
          self.ddOptionsResponseTabResponseStatus(),
          self.GetDDVals("status")
        );
        self.ddOptionsResponseTabResponseStatus.valueHasMutated();

        ko.utils.arrayPushAll(
          self.ddOptionsResponseInfoTabResponseNameOpen2(),
          self.GetDDVals2("1", true)
        );
        self.ddOptionsResponseInfoTabResponseNameOpen2.valueHasMutated();

        ko.utils.arrayPushAll(
          self.ddOptionsResponseInfoTabResponseNameProcessed2(),
          self.GetDDVals2("0", true)
        );
        self.ddOptionsResponseInfoTabResponseNameProcessed2.valueHasMutated();

        //draw these next
        ko.utils.arrayPushAll(
          self.ddOptionsResponseTabRequestInternalDueDate(),
          self.GetDDVals("internalDueDate")
        );
        self.ddOptionsResponseTabRequestInternalDueDate.valueHasMutated();

        ko.utils.arrayPushAll(
          self.ddOptionsResponseTabResponseTitle(),
          self.GetDDVals("title", true)
        );
        self.ddOptionsResponseTabResponseTitle.valueHasMutated();

        setTimeout(function () {
          var paramTabIndex = GetUrlKeyValue("Tab");
          if (paramTabIndex != null && paramTabIndex != "") {
            // $("#tabs").tabs("option", "active", paramTabIndex);
            self.tabs.selectById(paramTabIndex);
          } else {
            self.tabs.selectById(self.tabOpts.Responses.id);
          }
          if (
            paramTabIndex == null ||
            paramTabIndex == "" ||
            paramTabIndex == 0
          ) {
            if (self.cntPendingReview() > 0) {
              SP.UI.Notify.addNotification(
                "<div style='text-align:left'>There are <b>" +
                  self.cntPendingReview() +
                  "</b> Responses pending your review/action. <br/> <br/> Please click on the links in the <b>Response Name</b> column of the <b>Status Report tab</b> <br/> to access each response and upload documents and submit the package.</div>",
                false
              );
            }
          }

          var paramResponseNum = GetUrlKeyValue("ResNum");
          if (paramResponseNum != null && paramResponseNum != "") {
            if (paramTabIndex == 0) {
              if (
                $("#ddlResponseName option[value='" + paramResponseNum + "']")
                  .length > 0
              )
                _myViewModel.filterResponseTabResponseName(paramResponseNum);
            } else {
              if (
                $("#ddlResponsesOpen option[value='" + paramResponseNum + "']")
                  .length > 0
              )
                _myViewModel.filterResponseInfoTabResponseNameOpen2(
                  paramResponseNum
                );
              else if (
                $(
                  "#ddlResponsesProcessed option[value='" +
                    paramResponseNum +
                    "']"
                ).length > 0
              )
                _myViewModel.filterResponseInfoTabResponseNameProcessed2(
                  paramResponseNum
                );
            }
          }

          BindHandlersOnLoad();

          self.filterResponseTabResponseStatus(m_statusToFilterOn);

          //$( "#tblStatusReportResponses" ).trigger("update");
          $("#tblStatusReportResponses").tablesorter({
            sortList: [[2, 0]],
            selectorHeaders: ".sorter-true",
          });
        }, 200);
      }
    });

    /**TODO: factor these below **/
    /* second tab */
    self.filterResponseInfoTabResponseNameOpen2.subscribe(function (newValue) {
      self.filterResponseInfoTabResponseName(newValue, true);
    });

    /* second tab */
    self.filterResponseInfoTabResponseNameProcessed2.subscribe(function (
      newValue
    ) {
      self.filterResponseInfoTabResponseName(newValue, false);
    });

    self.filterResponseInfoTabResponseName = function (
      newValue,
      bOpenResponses
    ) {
      self.currentResponse(null);
      self.arrCoverSheets([]);
      self.arrResponseDocs(null);
      self.cntResponseDocs(0);
      m_curResponseSelectedIsEditableByAO = false;

      var oResponse = m_bigMap["response-" + newValue];
      if (oResponse) {
        if (bOpenResponses)
          self.filterResponseInfoTabResponseNameProcessed2("");
        else self.filterResponseInfoTabResponseNameOpen2("");

        self.currentResponse(oResponse);

        LoadTabResponseInfoCoverSheets(oResponse);
        LoadTabResponseInfoResponseDocs(oResponse);

        if (bOpenResponses) m_curResponseSelectedIsEditableByAO = true;
      }
    };

    /**Other**/
    self.GetDDVals = function (fieldName, sortAsResponse) {
      var types = ko.utils.arrayMap(self.arrResponses(), function (item) {
        return item[fieldName];
      });

      var ddArr = ko.utils.arrayGetDistinctValues(types).sort();
      if (sortAsResponse) ddArr.sort(Audit.Common.Utilities.SortResponseTitles);

      if (ddArr[0] == "") ddArr.shift();

      return ddArr;
    };

    self.GetDDVals2 = function (responseStatusType, sortAsResponse) {
      var types = ko.utils.arrayMap(self.arrResponses(), function (item) {
        var requestStatus = item.requestStatus;
        var responseStatus = item.status;

        if (responseStatusType == 0) {
          //get the other responses
          if (
            responseStatus != m_responseStatus1 &&
            responseStatus != m_responseStatus2
          )
            return item["title"];
          else return "";
        } else if (responseStatusType == 1) {
          //get responses pending action
          if (
            (responseStatus == m_responseStatus1 ||
              responseStatus == m_responseStatus2) &&
            (requestStatus == "Open" || requestStatus == "ReOpened")
          )
            return item["title"];
          else return "";
        }
      });

      var ddArr = ko.utils.arrayGetDistinctValues(types).sort();
      if (sortAsResponse) ddArr.sort(Audit.Common.Utilities.SortResponseTitles);

      if (ddArr[0] == "") ddArr.shift();
      return ddArr;
    };
  }

  var _myViewModel = new ViewModel();
  ko.applyBindings(_myViewModel);

  LoadInfo();

  function LoadInfo() {
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    const m_currentUser = web.get_currentUser();
    currCtx.load(m_currentUser);

    var requestList = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetListTitleRequests());
    var requestQuery = new SP.CamlQuery();
    requestQuery.set_viewXml(
      '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'
    );
    m_requestItems = requestList.getItems(requestQuery);
    currCtx.load(
      m_requestItems,
      "Include(ID, Title, ReqSubject, ReqStatus, InternalDueDate, ActionOffice, RelatedAudit, ActionItems, Comments, EmailSent, ClosedDate)"
    );

    var responseList = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetListTitleResponses());
    var responseQuery = new SP.CamlQuery();
    responseQuery.set_viewXml(
      '<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="ReqNum"/></OrderBy></Query></View>'
    );
    m_responseItems = responseList.getItems(responseQuery);
    currCtx.load(
      m_responseItems,
      "Include(ID, Title, ReqNum, ActionOffice, ReturnReason, SampleNumber, ResStatus, Comments, Modified, ClosedDate, ClosedBy, POC)"
    );

    //make sure to only pull documents (fsobjtype = 0)
    var responseDocsLib = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
    var responseDocsQuery = new SP.CamlQuery();
    responseDocsQuery.set_viewXml(
      '<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">0</Value></Eq></Where></Query></View>'
    );
    m_ResponseDocsItems = responseDocsLib.getItems(responseDocsQuery);
    currCtx.load(
      m_ResponseDocsItems,
      "Include(ID, Title, ReqNum, ResID, DocumentStatus, ReceiptDate, FileLeafRef, FileDirRef, File_x0020_Size, Modified, Editor)"
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

    //Library GUIDS
    m_responseDocsLibrary = currCtx
      .get_web()
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
    currCtx.load(m_responseDocsLibrary, "Title", "Id");

    ownerGroup = web.get_associatedOwnerGroup();
    memberGroup = web.get_associatedMemberGroup();
    visitorGroup = web.get_associatedVisitorGroup();

    currCtx.load(ownerGroup);
    currCtx.load(memberGroup);
    currCtx.load(visitorGroup);

    //Site Users
    m_groupColl = web.get_siteGroups();
    currCtx.load(m_groupColl);

    currCtx.executeQueryAsync(OnSuccess, OnFailure);
    function OnSuccess(sender, args) {
      $("#divRefresh").show();
      m_fnLoadData();
    }
    function OnFailure(sender, args) {
      $("#divRefresh").hide();
      $("#divLoading").hide();

      const statusId = SP.UI.Status.addStatus(
        "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
      );
      SP.UI.Status.setStatusPriColor(statusId, "red");
    }
  }

  function m_fnLoadData() {
    Audit.Common.Utilities.LoadSiteGroups(m_groupColl);
    LoadLibGUIDS();
    Audit.Common.Utilities.LoadActionOffices(m_aoItems);

    if (memberGroup != null) m_IA_SPGroupName = memberGroup.get_title();
    if (m_IA_SPGroupName == null || m_IA_SPGroupName == "") {
      const statusId = SP.UI.Status.addStatus(
        "Unable to retrieve the IA SharePoint Group. Please contact the Administrator"
      );
      SP.UI.Status.setStatusPriColor(statusId, "red");
      return;
    }

    LoadRequests();
    LoadResponses();
    LoadResponseDocs();

    LoadTabStatusReport(m_arrResponses, "fbody");
  }

  function LoadLibGUIDS() {
    Audit.Common.Utilities.SetResponseDocLibGUID(
      m_responseDocsLibrary.get_id()
    );
  }

  function LoadRequests() {
    m_bigMap = new Object();
    m_arrRequests = new Array();

    var cnt = 0;
    var listItemEnumerator = m_requestItems.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      var oListItem = listItemEnumerator.get_current();

      var emailSent = oListItem.get_item("EmailSent");
      if (!emailSent) continue;

      var id = oListItem.get_item("ID");
      var number = oListItem.get_item("Title");
      var status = oListItem.get_item("ReqStatus");

      var subject = oListItem.get_item("ReqSubject");
      if (subject == null) subject = "";

      var arrActionOffice = oListItem.get_item("ActionOffice");
      var actionOffice = "";
      for (var x = 0; x < arrActionOffice.length; x++) {
        actionOffice +=
          "<div>" + arrActionOffice[x].get_lookupValue() + "</div>";
      }

      var comments = oListItem.get_item("Comments");
      var relatedAudit = oListItem.get_item("RelatedAudit");
      var actionItems = oListItem.get_item("ActionItems");

      if (comments == null) comments = "";
      if (relatedAudit == null) relatedAudit = "";
      if (actionItems == null) actionItems = "";

      var internalDueDate = oListItem.get_item("InternalDueDate");
      var closedDate = oListItem.get_item("ClosedDate");

      internalDueDate != null
        ? (internalDueDate = internalDueDate.format("MM/dd/yyyy"))
        : (internalDueDate = "");
      closedDate != null
        ? (closedDate = closedDate.format("MM/dd/yyyy"))
        : (closedDate = "");

      var requestObject = new Object();
      requestObject["ID"] = id;
      requestObject["number"] = number;
      requestObject["subject"] = subject;
      requestObject["status"] = status;
      requestObject["internalDueDate"] = internalDueDate;
      requestObject["actionOffice"] = actionOffice;
      requestObject["comments"] = comments;
      requestObject["relatedAudit"] = relatedAudit;
      requestObject["actionItems"] = actionItems;
      requestObject["emailSent"] = emailSent;
      requestObject["closedDate"] = closedDate;
      requestObject["responses"] = new Array();

      requestObject["arrIndex"] = cnt;

      m_arrRequests.push(requestObject);

      m_bigMap["request-" + number] = requestObject;
      cnt++;
    }
  }

  function LoadResponses() {
    m_arrResponses = new Array();
    var cnt = 0;

    var listItemEnumerator = m_responseItems.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      var oListItem = listItemEnumerator.get_current();

      var number = oListItem.get_item("ReqNum");
      if (number != null) {
        number = number.get_lookupValue();

        var responseObject = new Object();
        responseObject["request"] = m_bigMap["request-" + number]; //GetRequest( number );
        if (!responseObject.request || !responseObject.request.emailSent)
          //if request is null, then there's probably a permission issue
          continue;

        responseObject["actionOffice"] = oListItem.get_item("ActionOffice");
        if (responseObject["actionOffice"] == null)
          responseObject["actionOffice"] = "";
        else
          responseObject["actionOffice"] =
            responseObject["actionOffice"].get_lookupValue();
        if (responseObject["actionOffice"] == "") continue;

        responseObject["poc"] = oListItem.get_item("POC");
        if (responseObject["poc"] == null) responseObject["poc"] = "";
        else responseObject["poc"] = responseObject["poc"].get_lookupValue();

        responseObject["ID"] = oListItem.get_item("ID");
        responseObject["number"] = number;

        var title = oListItem.get_item("Title");
        responseObject["title"] = title;

        responseObject["resStatus"] = oListItem.get_item("ResStatus");
        if (
          responseObject.request.status == "Closed" ||
          responseObject.request.status == "Canceled"
        )
          //make it appear that it's closed so that it doesnt confuse AO
          responseObject["resStatus"] = "7-Closed";

        var modifiedDate = oListItem.get_item("Modified");
        var closedDate = oListItem.get_item("ClosedDate");

        modifiedDate != null
          ? (modifiedDate = modifiedDate.format("MM/dd/yyyy hh:mm tt"))
          : (modifiedDate = "");
        closedDate != null
          ? (closedDate = closedDate.format("MM/dd/yyyy"))
          : (closedDate = "");

        responseObject["modified"] = modifiedDate;
        responseObject["closedDate"] = closedDate;
        responseObject["closedBy"] =
          Audit.Common.Utilities.GetFriendlyDisplayName(oListItem, "ClosedBy");

        responseObject["sample"] = oListItem.get_item("SampleNumber");
        if (responseObject["sample"] == null) responseObject["sample"] = "";

        var comments = oListItem.get_item("Comments");
        if (comments == null) comments = "";
        responseObject["comments"] = comments;

        var returnReason = oListItem.get_item("ReturnReason");
        if (returnReason == null) returnReason = "";
        responseObject["returnReason"] = returnReason;

        responseObject["responseDocs"] = new Array();
        responseObject["coversheets"] = new Array();

        responseObject["arrIndex"] = cnt;
        m_arrResponses.push(responseObject);

        m_bigMap["response-" + title] = responseObject;
        cnt++;
      }
    }
  }

  function LoadResponseDocs() {
    var listItemEnumerator = m_ResponseDocsItems.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      var oListItem = listItemEnumerator.get_current();

      const responseDocID = oListItem.get_item("ID");

      var requestNumber = oListItem.get_item("ReqNum");
      if (requestNumber != null)
        requestNumber = requestNumber.get_lookupValue();

      var responseID = oListItem.get_item("ResID");
      if (responseID != null) responseID = responseID.get_lookupValue();

      if (requestNumber == null || responseID == null) continue;

      if (oListItem.get_item("DocumentStatus") == "Marked for Deletion") {
        //ao can mark a document for deletion, but their permissions do not have delete. IA will have to delete
        //do  nothing
      } else {
        try {
          var bigMapItem = m_bigMap["response-" + responseID];

          var indexOfArrResponses = bigMapItem.arrIndex;
          var oResponse = m_arrResponses[indexOfArrResponses];
          if (oResponse) {
            var responseDocObject = new Object();
            responseDocObject["ID"] = oListItem.get_item("ID");
            responseDocObject["title"] = oListItem.get_item("Title");
            if (responseDocObject["title"] == null)
              responseDocObject["title"] = "";
            responseDocObject["fileName"] = oListItem.get_item("FileLeafRef");
            responseDocObject["folder"] = oListItem.get_item("FileDirRef");
            responseDocObject["documentStatus"] =
              oListItem.get_item("DocumentStatus");

            var fileSize = oListItem.get_item("File_x0020_Size");
            fileSize = Audit.Common.Utilities.GetFriendlyFileSize(fileSize);
            responseDocObject["fileSize"] = fileSize;

            var receiptDate = "";
            if (
              oListItem.get_item("ReceiptDate") != null &&
              oListItem.get_item("ReceiptDate") != ""
            )
              receiptDate = oListItem
                .get_item("ReceiptDate")
                .format("MM/dd/yyyy");
            responseDocObject["receiptDate"] = receiptDate;

            var modifiedDate = "";
            if (
              oListItem.get_item("Modified") != null &&
              oListItem.get_item("Modified") != ""
            )
              modifiedDate = oListItem
                .get_item("Modified")
                .format("MM/dd/yyyy hh:mm tt");
            responseDocObject["modifiedDate"] = modifiedDate;

            responseDocObject["modifiedBy"] =
              Audit.Common.Utilities.GetFriendlyDisplayName(
                oListItem,
                "Editor"
              );

            oResponse["responseDocs"].push(responseDocObject);
          }
        } catch (err) {}
      }
    }
  }

  function LoadTabStatusReport(arr, fbody) {
    if (arr == null) return;

    //var bLoadTest = GetUrlKeyValue("LoadTest");

    var responseArr = new Array();

    var arrResponseTitle = new Array();
    var arrResponseInternalDueDate = new Array();
    var arrResponseStatus = new Array();

    var count = 0;
    var resStatus1 = 0;
    var resStatus2 = 0;

    var arrlength = arr.length;
    while (arrlength--) {
      var oResponse = arr[arrlength];

      var responseTitle = oResponse.title;

      var highlight = false;
      var responseStatus = oResponse.resStatus;
      if (
        responseStatus == m_responseStatus1 ||
        responseStatus == m_responseStatus2
      ) {
        count++;
        if (responseStatus == m_responseStatus1) resStatus1++;
        else resStatus2++;

        highlight = true;
      }

      var aResponse = {
        title: responseTitle,
        requestSubject: oResponse.request.subject,
        requestStatus: oResponse.request.status,
        internalDueDate: oResponse.request.internalDueDate,
        status: responseStatus,
        docCount: oResponse.responseDocs.length,
        modified: oResponse.modified,
        highlight: highlight,
        visibleRow: ko.observable(true),
      };

      responseArr.push(aResponse);

      /*if( bLoadTest )
			{
				for( var z = 0; z < 99; z++ )
				{
					responseArr.push( aResponse );
				}	
			}*/
    }

    //if( bLoadTest )
    //	_myViewModel.debugMode( true );

    if (responseArr.length > 0) {
      m_statusToFilterOn = "";
      if (resStatus1 > 0 && resStatus2 == 0)
        m_statusToFilterOn = m_responseStatus1;
      else if (resStatus2 > 0 && resStatus1 == 0)
        m_statusToFilterOn = m_responseStatus2;

      _myViewModel.cntPendingReview(count);
      // $("#tabs").tabs(); //.show();

      ko.utils.arrayPushAll(_myViewModel.arrResponses, responseArr);

      //do this after push all because this takes some time
      // var output = $("#responseTemplate").render(responseArr);
      // $("#" + fbody).html(output);
    }

    //aleways calls this even if 0 responses
    _myViewModel.doSort(true);
  }

  function LoadTabResponseInfoCoverSheets(oResponse) {
    _myViewModel.arrCoverSheets([]);

    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    var coverSheetLib = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetLibTitleCoverSheets());
    var coverSheetQuery = new SP.CamlQuery();
    coverSheetQuery.set_viewXml(
      '<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="ReqNum"/><Value Type="Text">' +
        oResponse.request.number +
        "</Value></Eq></Where></Query></View>"
    );
    const m_subsetCoverSheetItems = coverSheetLib.getItems(coverSheetQuery);
    currCtx.load(
      m_subsetCoverSheetItems,
      "Include(ID, Title, ReqNum, ActionOffice, FileLeafRef, FileDirRef)"
    );

    var data = { oResponse: oResponse };
    function OnSuccess(sender, args) {
      var arrCS = new Array();

      var listItemEnumerator = m_subsetCoverSheetItems.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();

        if (oListItem.get_item("ActionOffice") != null) {
          var arrActionOffice = oListItem.get_item("ActionOffice");
          if (arrActionOffice.length > 0) {
            for (var y = 0; y < arrActionOffice.length; y++) {
              var curActionOffice = arrActionOffice[y].get_lookupValue();

              if (curActionOffice == this.oResponse.actionOffice) {
                var csFolder = oListItem.get_item("FileDirRef");
                var csTitle = oListItem.get_item("FileLeafRef");

                var encodedTitle = csTitle.replace(/'/g, "&#39");
                arrCS.push({
                  folder: csFolder,
                  title: csTitle,
                  link:
                    "STSNavigate('../_layouts/download.aspx?SourceUrl=" +
                    csFolder +
                    "/" +
                    encodedTitle +
                    "')",
                });

                break;
              }
            }
          }
        }
      }

      ko.utils.arrayPushAll(_myViewModel.arrCoverSheets(), arrCS);
      _myViewModel.arrCoverSheets.valueHasMutated();
    }
    function OnFailure(sender, args) {}

    currCtx.executeQueryAsync(
      Function.createDelegate(data, OnSuccess),
      Function.createDelegate(data, OnFailure)
    );
  }

  function LoadTabResponseInfoResponseDocs(oResponse) {
    _myViewModel.arrResponseDocs(null);
    _myViewModel.cntResponseDocs(0);
    _myViewModel.showUpload(false);
    _myViewModel.showSubmit(false);

    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    for (var z = 0; z < oResponse.responseDocs.length; z++) {
      var oResponseDoc = oResponse.responseDocs[z];

      //this loads on execute
      oResponseDoc["docIcon"] = web.mapToIcon(
        oResponseDoc.fileName,
        "",
        SP.Utilities.IconSize.Size16
      ); // m_siteUrl + "/" + _spPageContextInfo.layoutsUrl + "/images/" + docIcon;
    }

    function OnSuccess(sender, args) {
      RenderResponses(oResponse);
    }
    function OnFailure(sender, args) {
      const statusId = SP.UI.Status.addStatus(
        "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
      );
      SP.UI.Status.setStatusPriColor(statusId, "red");
    }
    currCtx.executeQueryAsync(OnSuccess, OnFailure);

    function RenderResponses(oResponse) {
      var rowCount = 0;
      var cntAddedByAO = 0;

      var arrResponseDocs = new Array();
      for (var z = 0; z < oResponse.responseDocs.length; z++) {
        var oResponseDoc = oResponse.responseDocs[z];
        oResponseDoc.docIcon = oResponseDoc.docIcon.get_value();
        oResponseDoc.styleTag = Audit.Common.Utilities.GetResponseDocStyleTag2(
          oResponseDoc.documentStatus
        );
        oResponseDoc.responseTitle = oResponse.title;

        if (
          oResponseDoc.documentStatus == "Open" &&
          (oResponse.resStatus == m_responseStatus1 ||
            oResponse.resStatus == m_responseStatus2)
        )
          cntAddedByAO++;

        arrResponseDocs.push(oResponseDoc);
      }

      if (m_curResponseSelectedIsEditableByAO) {
        _myViewModel.showUpload(true);
        if (cntAddedByAO > 0) _myViewModel.showSubmit(true);
      }

      var arrResponseSummary = {
        responseTitle: oResponse.title,
        responseDocs: arrResponseDocs,
        responseStatus: oResponse.resStatus,
      };
      _myViewModel.arrResponseDocs(arrResponseSummary);
      _myViewModel.arrResponseDocs.valueHasMutated();
      _myViewModel.cntResponseDocs(oResponse.responseDocs.length);

      //display warning message
      if (
        oResponse.resStatus == m_responseStatus2 &&
        oResponse.returnReason != null &&
        oResponse.returnReason != ""
      ) {
        if (m_curResponseSelectedIsEditableByAO && cntAddedByAO == 0) {
          //notifyId = SP.UI.Notify.addNotification("Response Return Reason: " + oResponse.returnReason, false);
          var waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
            "Notice - Response Needs to be Updated",
            "<span style=''><span class='ui-icon ui-icon-alert'></span>Response Return Reason: <span style='font-weight:bold; color:red;'>" +
              oResponse.returnReason +
              "</span></span>",
            100,
            500
          );
          setTimeout(function () {
            waitDialog.close();
          }, 5000);
        }
      }

      if (
        oResponse.resStatus == "1-Open" ||
        oResponse.resStatus == "3-Returned to Action Office"
      ) {
        if (m_curResponseSelectedIsEditableByAO && cntAddedByAO > 0) {
          const notifyId = SP.UI.Notify.addNotification(
            "<div style='text-align:left'>Response documents have been added. <br/><br/>Your package <span style='font-weight:bold; color:red'>has not yet been submitted</span>. <br></br>Please review your documents and click on the link <b>SUBMIT this Response Package</b> below</div>",
            false
          );

          $(".btnSubmitPackage")
            .parent()
            .css({ "background-color": "yellow", "font-weight": "inherit" });
          $(".btnSubmitPackage").get(0).scrollIntoView();

          function resetColor() {
            $(".btnSubmitPackage")
              .parent()
              .css({ "background-color": "inherit", "font-weight": "inherit" });
          }
          setTimeout(function () {
            resetColor();
          }, 2000);
        } else if (m_curResponseSelectedIsEditableByAO && cntAddedByAO == 0) {
          const notifyId = SP.UI.Notify.addNotification(
            "<div style='text-align:left'>Please review the Response Information and any CoverSheets/Supplemental Documents. <br/><br/>Then, click the link to <span style='font-weight:bold; color:gree'>Upload Response Documents</span> pertaining to this Response</div>",
            false
          );
        }
      }
    }
  }

  function m_fnFormatEmailBodyToIAFromAO(oRequest, responseTitle) {
    var emailText =
      "<div>Audit Request Reference: <b>{REQUEST_NUMBER}</b></div>" +
      "<div>Audit Request Subject: <b>{REQUEST_SUBJECT}</b></div>" +
      "<div>Audit Request Due Date: <b>{REQUEST_DUEDATE}</b></div><br/>" +
      "<div>Below is the Response that was submitted: </div>" +
      "<div>{RESPONSE_TITLE}</div>";

    emailText = emailText.replace("{REQUEST_NUMBER}", oRequest.number);
    emailText = emailText.replace("{REQUEST_SUBJECT}", oRequest.subject);
    emailText = emailText.replace(
      "{REQUEST_DUEDATE}",
      oRequest.internalDueDate
    );

    var responseTitleBody = "<ul><li>" + responseTitle + "</li></ul>";
    emailText = emailText.replace("{RESPONSE_TITLE}", responseTitleBody);

    return emailText;
  }

  function m_fnUploadResponseDoc(requestID, responseID) {
    m_bIsTransactionExecuting = true;

    //		notifyId = SP.UI.Notify.addNotification("<span style='font-size:11pt'><span class='ui-icon ui-icon-info'></span>Please <span style='font-weight:bold; color:green'>zip</span> the documents you are uploading.</span>", false);
    var waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
      "Loading...",
      "<span style='font-size:11pt'><span class='ui-icon ui-icon-info'></span>If you are uploading <span style='font-weight:bold; color:green;text-decoration:underline'>multiple</span> documents, please <span style='font-weight:bold; color:green;text-decoration:underline'>zip </span> them.</span>",
      100,
      600
    );

    setTimeout(function () {
      waitDialog.close();

      var options = SP.UI.$create_DialogOptions();
      options.title = "Upload Response Document to: " + responseID;
      options.dialogReturnValueCallback = OnCallbackForm;

      //this subfolder should have been created when the response was created
      var rootFolder =
        Audit.Common.Utilities.GetSiteUrl() +
        "/" +
        Audit.Common.Utilities.GetLibNameResponseDocs() +
        "/" +
        responseID;
      options.url =
        Audit.Common.Utilities.GetSiteUrl() +
        "/_layouts/Upload.aspx?List={" +
        Audit.Common.Utilities.GetResponseDocLibGUID() +
        "}&RootFolder=" +
        rootFolder +
        "&ReqNum=" +
        requestID +
        "&ResID=" +
        responseID;
      //notifyId = SP.UI.Notify.addNotification("Uploading documents to: " + options.url, false)
      SP.UI.ModalDialog.showModalDialog(options);
    }, 3000);
  }

  function OnCallbackForm(result, value) {
    if (result === SP.UI.DialogResult.OK) {
      Audit.Common.Utilities.Refresh();
    } else m_bIsTransactionExecuting = false;
  }

  function m_fnSubmitPackage() {
    var responseToSubmit = $("#ddlResponsesOpen").val();
    if (
      confirm(
        "Are you sure you would like to submit these response documents? Note: You will NOT be able to make changes or upload any more documents after you submit this package."
      )
    ) {
      m_bIsTransactionExecuting = true;

      const m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
        "Submitting Response",
        "Please wait... Submitting Response",
        200,
        400
      );

      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();

      var folderPath =
        Audit.Common.Utilities.GetSiteUrl() +
        "/" +
        Audit.Common.Utilities.GetLibNameResponseDocs() +
        "/" +
        responseToSubmit;
      var responseDocLib = web
        .get_lists()
        .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
      var responseDocQuery = new SP.CamlQuery();
      responseDocQuery.set_viewXml(
        "<View Scope=\"RecursiveAll\"><Query><Where><And><Eq><FieldRef Name='FileDirRef'/><Value Type='Text'>" +
          folderPath +
          "</Value></Eq><Eq><FieldRef Name='DocumentStatus'/><Value Type='Text'>Open</Value></Eq></And></Where></Query></View>"
      );
      const responseDocOpenItems = responseDocLib.getItems(responseDocQuery);
      currCtx.load(
        responseDocOpenItems,
        "Include(ID, DocumentStatus, FileDirRef)"
      );

      var emailList = web
        .get_lists()
        .getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory());
      var emailListQuery = new SP.CamlQuery();
      emailListQuery.set_viewXml(
        '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>'
      );
      const emailListFolderItems = emailList.getItems(emailListQuery);
      currCtx.load(emailListFolderItems, "Include(ID, Title, DisplayName)");

      function OnSuccessLoadedResponseDocs(sender, args) {
        var ctOpenResponseDocs = 0;
        if (responseDocOpenItems != null) {
          var listItemEnumerator = responseDocOpenItems.getEnumerator();
          while (listItemEnumerator.moveNext()) {
            var oListItem = listItemEnumerator.get_current();
            oListItem.set_item("DocumentStatus", "Submitted");
            oListItem.update();
            ctOpenResponseDocs++;
          }
        }

        if (ctOpenResponseDocs == 0) {
          const notifyId = SP.UI.Notify.addNotification(
            "Please upload a Response document.",
            false
          );
          m_waitDialog.close();
          return;
        }

        var oRequest = null;
        try {
          var bigMapItem = m_bigMap["response-" + responseToSubmit];
          var indexOfArrResponses = bigMapItem.arrIndex;
          const oResponse = m_arrResponses[indexOfArrResponses];
          if (oResponse) {
            oRequest = oResponse.request;

            var responseList = currCtx
              .get_web()
              .get_lists()
              .getByTitle(Audit.Common.Utilities.GetListTitleResponses());
            const responseItem = responseList.getItemById(oResponse.ID);
            responseItem.set_item("ResStatus", "2-Submitted");
            responseItem.update();
          }
        } catch (err) {
          alert(err);
          Audit.Common.Utilities.Refresh();
        }

        if (oRequest == null) {
          m_waitDialog.close();
          return;
        }

        var emailSubject =
          "A Response has been Submitted by an Action Office: " +
          oRequest.number;
        var emailText = m_fnFormatEmailBodyToIAFromAO(
          oRequest,
          responseToSubmit
        );

        var itemCreateInfo = new SP.ListItemCreationInformation();
        itemCreateInfo.set_folderUrl(
          location.protocol +
            "//" +
            location.host +
            Audit.Common.Utilities.GetSiteUrl() +
            "/Lists/" +
            Audit.Common.Utilities.GetListNameEmailHistory() +
            "/" +
            oRequest.number
        );
        oListItem = emailList.addItem(itemCreateInfo);
        oListItem.set_item("Title", emailSubject);
        oListItem.set_item("Body", emailText);
        oListItem.set_item("To", m_IA_SPGroupName);
        oListItem.set_item("ReqNum", oRequest.number);
        oListItem.set_item("ResID", responseToSubmit);
        oListItem.set_item("NotificationType", "IA Notification");
        oListItem.update();

        function OnSuccessUpdateResponse(sender, args) {
          document.body.style.cursor = "default";
          m_waitDialog.close();
          Audit.Common.Utilities.Refresh();
        }
        function OnFailureUpdateResponse(sender, args) {
          m_waitDialog.close();
          const statusId = SP.UI.Status.addStatus(
            "Request failed: " +
              args.get_message() +
              "\n" +
              args.get_stackTrace()
          );
          SP.UI.Status.setStatusPriColor(statusId, "red");
        }

        currCtx.executeQueryAsync(
          OnSuccessUpdateResponse,
          OnFailureUpdateResponse
        );
      }

      function OnFailureLoadedResponseDocs(sender, args) {
        m_waitDialog.close();
        const statusId = SP.UI.Status.addStatus(
          "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
        );
        SP.UI.Status.setStatusPriColor(statusId, "red");
      }

      currCtx.executeQueryAsync(
        OnSuccessLoadedResponseDocs,
        OnFailureLoadedResponseDocs
      );
    }
  }

  function m_fnMarkForDeletionResponseDoc(itemID) {
    if (
      confirm("Are you sure you would like to Delete this Response Document?")
    ) {
      var currCtx = new SP.ClientContext();
      var responseDocsLib = currCtx
        .get_web()
        .get_lists()
        .getByTitle(Audit.Common.Utilities.GetLibNameResponseDocs());

      const oListItem = responseDocsLib.getItemById(itemID);
      oListItem.set_item("DocumentStatus", "Marked for Deletion");
      oListItem.update();

      function OnSuccess(sender, args) {
        Audit.Common.Utilities.Refresh();
      }
      function OnFailure(sender, args) {
        const statusId = SP.UI.Status.addStatus(
          "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
        );
        SP.UI.Status.setStatusPriColor(statusId, "red");
      }
      currCtx.executeQueryAsync(OnSuccess, OnFailure);
    }
  }

  function BindHandlersOnLoad() {
    BindPrintButton(
      "#btnPrint1",
      "#divStatusReportRespones",
      "Action Office Response Status Report"
    );
    //////////Note: for the export to work, make sure this is added to the html: <iframe id="CsvExpFrame" style="display: none"></iframe>
    BindExportButton(
      ".export1",
      "AOResponseStatusReport_",
      "tblStatusReportResponses"
    );
  }

  function BindPrintButton(btnPrint, divTbl, pageTitle) {
    $(btnPrint).on("click", function () {
      Audit.Common.Utilities.PrintStatusReport(pageTitle, divTbl);
    });
  }

  function BindExportButton(btnExport, fileNamePrefix, tbl) {
    $(btnExport).on("click", function (event) {
      var curDate = new Date().format("yyyyMMdd_hhmmtt");
      Audit.Common.Utilities.ExportToCsv(fileNamePrefix + curDate, tbl);
    });
  }

  function GoToResponse(response) {
    //$("#tabs").tabs({ active: 1 });
    _myViewModel.tabs.selectById(_myViewModel.tabOpts.ResponseDetail.id);

    if (response) {
      response = m_bigMap["response-" + response];

      var requestStatus = response.request.status;
      var responseStatus = response.resStatus;
      if (
        (responseStatus == m_responseStatus1 ||
          responseStatus == m_responseStatus2) &&
        (requestStatus == "Open" || requestStatus == "ReOpened")
      )
        _myViewModel.filterResponseInfoTabResponseNameOpen2(response.title);
      else
        _myViewModel.filterResponseInfoTabResponseNameProcessed2(
          response.title
        );
    }
  }

  var publicMembers = {
    GoToResponse: GoToResponse,
    IsTransactionExecuting: function () {
      return m_bIsTransactionExecuting;
    },
  };

  return publicMembers;
};
