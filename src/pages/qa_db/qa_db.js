import { qaDbTemplate } from "./QA_DB_Template.js";
import { setUrlParam } from "../../common/router.js";
import { TabsModule, Tab } from "../../components/tabs/tabs_module.js";
import { getAllItems } from "../../services/legacy_helpers.js";

import "../../sal/infrastructure/knockout_extensions.js";
import "../../common/utilities.js";

document.getElementById("app").innerHTML = qaDbTemplate;
// var SP = window.SP;
// var ko = window.ko;

window.Audit = window.Audit || {};
Audit.QAReport = Audit.QAReport || {};

const responseParam = "ResNum";

var paramShowSiteActionsToAnyone = GetUrlKeyValue("ShowSiteActions");
if (paramShowSiteActionsToAnyone != true) {
  //hide it even for owners unless this param is passed into the URL; pass in param if you want to change the page web parts/settings
  $("#RibbonContainer-TabRowLeft").hide();
  $(".ms-siteactionsmenu").hide();
}

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
  Audit.QAReport.Report = new Audit.QAReport.NewReportPage();
  Audit.QAReport.Init();
}

Audit.QAReport.Init = function () {
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
	       Audit.Common.Utilities.Refresh();
	    }
	}, 1000);*/

  function SetTimer() {
    var intervalRefreshID = setInterval(function () {
      var divVal = $("#divCounter").text();
      var count = divVal * 1 - 1;
      $("#divCounter").text(count);
      if (count <= 0) {
        if (!Audit.QAReport.Report.IsTransactionExecuting())
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

Audit.QAReport.NewReportPage = function () {
  var m_arrRequests = new Array();
  var m_arrResponses = new Array();

  var m_bigMap = new Object();

  var m_IA_SPGroupName = null;
  var m_IA_ActionOffice = null;

  var m_itemID = null;
  var m_RejectReason = "";

  var m_resStatusToFilterOn = "";
  //ko.options.deferUpdates = true;

  var m_bIsTransactionExecuting = false;

  var memberGroup = null;

  var statusId = null;
  var notifyId = null;
  let m_waitDialog = null;

  var m_requestItems = null;
  var m_requestInternalItems = null;

  var m_responseItems = null;

  var m_ResponseDocsItems = null;
  var m_aoItems = null;

  let eaReponseDocsFolderItems = null;
  let eaEmailLogListItems = null;

  function CommentChainField(requestId, props) {
    var requestListTitle = props.requestListTitle;
    var columnName = props.columnName;
    var initialValue = props.initialValue;

    var showHistoryBool = ko.observable(false);

    var toggleShowHistory = function () {
      showHistoryBool(!showHistoryBool());
    };

    var arrInitialComments = [];
    // If we have comments here, try to parse them.
    if (initialValue) {
      try {
        arrInitialComments = JSON.parse(initialValue);
        arrInitialComments.forEach(function (comment) {
          comment.timestamp = new Date(comment.timestamp);
        });
      } catch (e) {
        console.error("could not parse internal status comments.");
      }
    }
    var comments = ko.observableArray(arrInitialComments);
    var newCommentText = ko.observable();
    // var requestId = requestId;

    function onSubmit() {
      var comment = {
        id: Math.ceil(Math.random() * 1000000).toString(16),
        text: newCommentText(),
        author: _spPageContextInfo.userLoginName,
        timestamp: new Date(),
      };
      comments.push(comment);
      commitChanges();
    }

    function onRemove(commentToRemove) {
      if (confirm("Are you sure you want to delete this item?")) {
        var commentIndex = comments.indexOf(commentToRemove);
        comments.splice(commentIndex, 1);
        commitChanges();
      }
    }

    function commitChanges() {
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      //Now push to the request item:
      var requestList = web.get_lists().getByTitle(requestListTitle);
      const oListItem = requestList.getItemById(requestId);
      oListItem.set_item(columnName, JSON.stringify(comments()));
      oListItem.update();

      currCtx.load(oListItem);

      currCtx.executeQueryAsync(
        function onSuccess() {
          // console.log("Updated comments");
          newCommentText("");
        },
        function onFailure(args, sender) {
          console.error("Failed to commit changes.", args);
        }
      );
    }

    var publicMembers = {
      comments: comments,
      newCommentText: newCommentText,
      onSubmit: onSubmit,
      onRemove: onRemove,
      toggleShowHistory: toggleShowHistory,
      showHistoryBool: showHistoryBool,
    };

    return publicMembers;
  }

  function ViewModel() {
    var self = this;

    self.debugMode = ko.observable(false);

    self.siteUrl = Audit.Common.Utilities.GetSiteUrl();

    //cant add rate limit because it'll affect the refresh
    //self.arrResponses = ko.observableArray( null ).extend({ rateLimit: 500 });
    self.arrResponses = ko.observableArray(null);

    // self.arrFilteredResponsesCount = ko.observable(0);

    self.cntPendingReview = ko.observable(0);

    self.ddOptionsResponseTabRequestID = ko.observableArray();
    self.ddOptionsResponseTabRequestStatus = ko.observableArray();
    self.ddOptionsResponseTabRequestInternalDueDate = ko.observableArray();
    self.ddOptionsResponseTabRequestSample = ko.observableArray();
    self.ddOptionsResponseTabResponseTitle = ko.observableArray();
    self.ddOptionsResponseTabResponseStatus = ko.observableArray();
    self.filterResponseTabRequestID = ko.observable();
    self.filterResponseTabRequestStatus = ko.observable();
    self.filterResponseTabRequestIntDueDate = ko.observable();
    self.filterResponseTabSampleNum = ko.observable();
    self.filterResponseTabResponseName = ko.observable();
    self.filterResponseTabResponseStatus = ko.observable();
    self.doSort = ko.observable(false);

    self.ddOptionsResponseInfoTabResponseNameOpen2 = ko.observableArray();
    self.ddOptionsResponseInfoTabResponseNameProcessed2 = ko.observableArray();
    self.filterResponseInfoTabResponseNameOpen2 = ko.observable("");
    self.filterResponseInfoTabResponseNameProcessed2 = ko.observable("");

    self.currentResponse = ko.observable();
    self.arrCoverSheets = ko.observableArray(null);
    self.arrResponseDocs = ko.observable();
    self.cntResponseDocs = ko.observable(0);

    self.showBulkApprove = ko.observable(false);
    self.showCloseResponse = ko.observable(false);
    self.showReturnToCGFS = ko.observable(false);

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

    /** Behaviors **/

    self.ClearFiltersResponseTab = function () {
      self.filterResponseTabRequestID("");
      self.filterResponseTabRequestStatus("");
      self.filterResponseTabRequestIntDueDate("");
      self.filterResponseTabSampleNum("");
      self.filterResponseTabResponseName("");
      self.filterResponseTabResponseStatus("");
    };

    /*self.GoToResponse = function( response )
		{
			$('#tabs').tabs({ active: 1 });			
			
			var requestStatus = response.requestStatus;
			var responseStatus = response.status;
			if( (responseStatus == "4-Approved for QA" || responseStatus == "6-Reposted After Rejection" ) && ( requestStatus  == "Open" || requestStatus == "ReOpened") )  
				self.filterResponseNameOpen2 ( response.title );
			else
				self.filterResponseNameProcessed2 ( response.title );
		};	*/

    self.filteredResponses = ko.pureComputed(() => {
      const responses = ko.unwrap(self.arrResponses);
      var requestID = self.filterResponseTabRequestID();
      var requestStatus = self.filterResponseTabRequestStatus();
      var requestIntDueDate = self.filterResponseTabRequestIntDueDate();
      var sampleNum = self.filterResponseTabSampleNum();
      var responseName = self.filterResponseTabResponseName();
      var responseStatus = self.filterResponseTabResponseStatus();

      if (
        !requestID &&
        !requestStatus &&
        !requestIntDueDate &&
        !sampleNum &&
        !responseName &&
        !responseStatus
      ) {
        // self.arrFilteredResponsesCount(responses.length);
        document.body.style.cursor = "default";
        return responses;
      }

      const filteredResponses = responses.filter((response) => {
        if (responseStatus && response.status != responseStatus) return false;
        if (requestID && response.reqNumber != requestID) return false;
        if (requestStatus && response.requestStatus != requestStatus)
          return false;
        if (requestIntDueDate && response.internalDueDate != requestIntDueDate)
          return false;
        if (responseName && response.title != responseName) return false;
        if (sampleNum && response.sample != sampleNum) return false;

        return true;
      });
      // self.arrFilteredResponsesCount(filteredResponses.length);

      return filteredResponses;
    });
    self.arrFilteredResponsesCount = ko.pureComputed(() => {
      return self.filteredResponses().length;
    });

    // self.responseIsFiltered = function () {};

    self.FilterChangedResponseTab = function () {
      document.body.style.cursor = "wait";
      setTimeout(function () {
        var requestID = self.filterResponseTabRequestID();
        var requestStatus = self.filterResponseTabRequestStatus();
        var requestIntDueDate = self.filterResponseTabRequestIntDueDate();
        var sampleNum = self.filterResponseTabSampleNum();
        var responseName = self.filterResponseTabResponseName();
        var responseStatus = self.filterResponseTabResponseStatus();

        if (
          !requestID &&
          !requestStatus &&
          !requestIntDueDate &&
          !sampleNum &&
          !responseName &&
          !responseStatus
        ) {
          $(".sr-response-item").show();
          // self.arrFilteredResponsesCount(self.arrResponses().length);
          document.body.style.cursor = "default";
          return;
        }

        requestID = !requestID ? "" : requestID;
        requestStatus = !requestStatus ? "" : requestStatus;
        requestIntDueDate = !requestIntDueDate ? "" : requestIntDueDate;
        sampleNum = !sampleNum ? "" : sampleNum;
        responseName = !responseName ? "" : responseName;
        responseStatus = !responseStatus ? "" : responseStatus;

        var count = 0;
        var eacher = $(".sr-response-item");
        eacher.each(function () {
          var hide = false;

          if (
            !hide &&
            requestID != "" &&
            $.trim($(this).find(".sr-response-requestNum").text()) != requestID
          )
            hide = true;
          if (
            !hide &&
            requestStatus != "" &&
            $.trim($(this).find(".sr-response-requestStatus").text()) !=
              requestStatus
          )
            hide = true;
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
            sampleNum != "" &&
            $.trim($(this).find(".sr-response-sample").text()) != sampleNum
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

        // self.arrFilteredResponsesCount(count);
        document.body.style.cursor = "default";
      }, 100);
    };

    self.ClickHelpResponseDocs = function () {
      m_fnDisplayHelpResponseDocs();
    };

    self.ClickCloseResponse = function () {
      m_fnCloseResponse();
    };

    self.ClickReturnToCGFS = function () {
      m_fnReturnToCGFS();
    };

    self.ClickBulkApprove = function () {
      m_fnApproveAll();
    };

    self.ClickApproveResponseDoc = function (oResponseDoc) {
      if (oResponseDoc && oResponseDoc.ID && oResponseDoc.fileName)
        m_fnApproveResponseDoc(oResponseDoc.ID, oResponseDoc.fileName);
    };

    self.ClickRejectResponseDoc = function (oResponseDoc) {
      if (oResponseDoc && oResponseDoc.ID && oResponseDoc.fileName)
        m_fnRejectResponseDoc(oResponseDoc.ID, oResponseDoc.fileName);
    };

    /** Subscriptions **/

    self.currentResponse.subscribe((response) => {
      if (response) setUrlParam(responseParam, response.title);
    });

    self.doSort.subscribe(function (newValue) {
      Audit.Common.Utilities.OnLoadDisplayTimeStamp();

      //alert("in dosort: " + self.arrResponses().length );
      if (self.arrResponses().length > 0 && newValue) {
        //should trigger only once
        // self.arrFilteredResponsesCount(self.arrResponses().length);

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
          self.ddOptionsResponseTabRequestID(),
          self.GetDDVals("reqNumber")
        );
        self.ddOptionsResponseTabRequestID.valueHasMutated();

        ko.utils.arrayPushAll(
          self.ddOptionsResponseTabRequestStatus(),
          self.GetDDVals("requestStatus")
        );
        self.ddOptionsResponseTabRequestStatus.valueHasMutated();

        ko.utils.arrayPushAll(
          self.ddOptionsResponseTabRequestInternalDueDate(),
          self.GetDDVals("internalDueDate")
        );
        self.ddOptionsResponseTabRequestInternalDueDate.valueHasMutated();

        ko.utils.arrayPushAll(
          self.ddOptionsResponseTabRequestSample(),
          self.GetDDVals("sample")
        );
        self.ddOptionsResponseTabRequestSample.valueHasMutated();

        ko.utils.arrayPushAll(
          self.ddOptionsResponseTabResponseTitle(),
          self.GetDDVals("title", true)
        );
        self.ddOptionsResponseTabResponseTitle.valueHasMutated();

        setTimeout(function () {
          var paramTabIndex = GetUrlKeyValue("Tab");
          if (paramTabIndex != null && paramTabIndex != "") {
            _myViewModel.tabs.selectById(paramTabIndex);
          } else {
            _myViewModel.tabs.selectTab(_myViewModel.tabOpts.Responses);
          }
          var paramResponseNum = GetUrlKeyValue("ResNum");
          if (paramResponseNum != null && paramResponseNum != "") {
            if (paramTabIndex == _myViewModel.tabOpts.Responses.id) {
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

          if (m_resStatusToFilterOn != "")
            self.filterResponseTabResponseStatus(m_resStatusToFilterOn);
          else self.filterResponseTabRequestStatus("Open");

          //$( "#tblStatusReportResponses" ).trigger("update");
          $("#tblStatusReportResponses").tablesorter({
            sortList: [[3, 0]],
            selectorHeaders: ".sorter-true",
          });
        }, 200);
      }
    });

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

    /* second tab */
    self.filterResponseInfoTabResponseName = function (
      newValue,
      bOpenResponses
    ) {
      self.currentResponse(null);
      self.arrCoverSheets([]);
      self.arrResponseDocs(null);
      self.cntResponseDocs(0);
      self.showBulkApprove(false);
      self.showCloseResponse(false);
      self.showReturnToCGFS(false);

      var oResponse = m_bigMap["response-" + newValue];
      if (oResponse) {
        if (bOpenResponses)
          self.filterResponseInfoTabResponseNameProcessed2("");
        else self.filterResponseInfoTabResponseNameOpen2("");

        self.currentResponse(oResponse);

        LoadTabResponseInfoCoverSheets(oResponse);
        LoadTabResponseInfoResponseDocs(oResponse);

        setTimeout(function () {
          const notifyId = SP.UI.Notify.addNotification(
            "Displaying Response (" + oResponse.title + ")",
            false
          );
        });
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
            responseStatus != "4-Approved for QA" &&
            responseStatus != "6-Reposted After Rejection"
          )
            return item["title"];
          else return "";
        } else if (responseStatusType == 1) {
          //get responses pending action
          if (
            (responseStatus == "4-Approved for QA" ||
              responseStatus == "6-Reposted After Rejection") &&
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

  async function LoadInfo() {
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
      "Include(ID, Title, ReqSubject, ReqStatus, IsSample, InternalDueDate, ActionOffice, Comments, RelatedAudit, ActionItems, EmailSent, ClosedDate, Modified)"
    );

    var requestInternalList = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetListTitleRequestsInternal());
    var requestInternalQuery = new SP.CamlQuery();
    requestInternalQuery.set_viewXml(
      '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'
    );
    m_requestInternalItems = requestInternalList.getItems(requestInternalQuery);
    currCtx.load(
      m_requestInternalItems,
      "Include(ID, Title, ReqNum, InternalStatus)"
    );
    /*
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
      "Include(ID, Title, ReqNum, ActionOffice, SampleNumber, ResStatus, Comments, Modified, ClosedDate, ClosedBy)"
    );

    //make sure to only pull documents (fsobjtype = 0)
    var responseDocsLib = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
    var responseDocsQuery = new SP.CamlQuery();
    responseDocsQuery.set_viewXml(
      '<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="ContentType"/><Value Type="Text">Document</Value></Eq></Where></Query></View>'
    );
    m_ResponseDocsItems = responseDocsLib.getItems(responseDocsQuery);
    currCtx.load(
      m_ResponseDocsItems,
      "Include(ID, Title, ReqNum, ResID, DocumentStatus, RejectReason, ReceiptDate, FileLeafRef, FileDirRef, File_x0020_Size, Modified, Editor)"
    );
*/
    await Promise.all([
      getAllItems(Audit.Common.Utilities.GetListTitleResponses(), [
        "ID",
        "Title",
        "ReqNum",
        "ActionOffice",
        "ReturnReason",
        "SampleNumber",
        "ResStatus",
        "Comments",
        "Modified",
        "ClosedDate",
        "ClosedBy",
        "POC",
      ]).then((result) => (m_responseItems = result)),
      getAllItems(Audit.Common.Utilities.GetLibTitleResponseDocs(), [
        "ID",
        "Title",
        "ReqNum",
        "ResID",
        "DocumentStatus",
        "ReceiptDate",
        "FileLeafRef",
        "FileDirRef",
        "File_x0020_Size",
        "Modified",
        "Editor",
      ]).then((result) => (m_ResponseDocsItems = result)),
    ]);

    var aoList = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetListTitleActionOffices());
    var aoQuery = new SP.CamlQuery();
    aoQuery.set_viewXml(
      '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'
    );
    m_aoItems = aoList.getItems(aoQuery);
    currCtx.load(m_aoItems, "Include(ID, Title, UserGroup)");

    memberGroup = web.get_associatedMemberGroup();
    currCtx.load(memberGroup);

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
    Audit.Common.Utilities.LoadActionOffices(m_aoItems);

    if (memberGroup != null) m_IA_SPGroupName = memberGroup.get_title();
    if (m_IA_SPGroupName == null || m_IA_SPGroupName == "") {
      const statusId = SP.UI.Status.addStatus(
        "Unable to retrieve the IA SharePoint Group. Please contact the Administrator"
      );
      SP.UI.Status.setStatusPriColor(statusId, "red");
      return;
    }

    m_IA_ActionOffice = Audit.Common.Utilities.GetActionOffices()?.find(
      (ao) => ao.userGroup == m_IA_SPGroupName
    );

    LoadRequests();
    LoadResponses();
    LoadResponseDocs();

    LoadTabStatusReport(m_arrResponses, "fbody");
  }

  function LoadRequests() {
    m_bigMap = new Object();
    m_arrRequests = new Array();

    var cnt = 0;
    var listItemEnumerator = m_requestItems.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      var oListItem = listItemEnumerator.get_current();

      var id = oListItem.get_item("ID");
      var number = oListItem.get_item("Title");
      var status = oListItem.get_item("ReqStatus");
      var sample = oListItem.get_item("IsSample");
      var emailSent = oListItem.get_item("EmailSent");

      var subject = oListItem.get_item("ReqSubject");
      if (subject == null) subject = "";

      var arrActionOffice = oListItem.get_item("ActionOffice");
      var actionOffice = "";
      for (var x = 0; x < arrActionOffice.length; x++) {
        actionOffice +=
          "<div>" + arrActionOffice[x].get_lookupValue() + "</div>";
      }

      var internalDueDate = oListItem.get_item("InternalDueDate");
      var closedDate = oListItem.get_item("ClosedDate");

      internalDueDate != null
        ? (internalDueDate = internalDueDate.format("MM/dd/yyyy"))
        : (internalDueDate = "");
      closedDate != null
        ? (closedDate = closedDate.format("MM/dd/yyyy"))
        : (closedDate = "");

      var comments = oListItem.get_item("Comments");
      var relatedAudit = oListItem.get_item("RelatedAudit");
      var actionItems = oListItem.get_item("ActionItems");

      if (comments == null) comments = "";
      if (relatedAudit == null) relatedAudit = "";
      if (actionItems == null) actionItems = "";

      var requestObject = new Object();
      requestObject["ID"] = id;
      requestObject["number"] = number;
      requestObject["subject"] = subject;
      requestObject["status"] = status;
      requestObject["internalDueDate"] = internalDueDate;
      requestObject["sample"] = sample;
      requestObject["actionOffice"] = actionOffice;
      requestObject["comments"] = comments;
      requestObject["emailSent"] = emailSent;
      requestObject["closedDate"] = closedDate;
      requestObject["relatedAudit"] = relatedAudit;
      requestObject["actionItems"] = actionItems;

      requestObject["arrIndex"] = cnt;
      m_arrRequests.push(requestObject);

      m_bigMap[number] = requestObject;
      cnt++;
    }

    // Also load our Internal Request Status here and bolt these objects onto the requests
    try {
      var listItemEnumerator = m_requestInternalItems.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();

        var id = oListItem.get_item("ID");
        var reqNum = oListItem.get_item("ReqNum");

        if (!reqNum || !reqNum.get_lookupValue()) {
          console.warn("Unaffiliated Internal Status ID:", id);
          continue;
        }

        var requestObject = m_bigMap[reqNum.get_lookupValue()];

        requestObject.internalStatus = new CommentChainField(id, {
          requestListTitle:
            Audit.Common.Utilities.GetListTitleRequestsInternal(),
          columnName: "InternalStatus",
          initialValue: oListItem.get_item("InternalStatus"),
        });
      }
    } catch (err) {
      alert(err);
    }
  }

  function LoadResponses() {
    m_arrResponses = new Array();

    var cnt = 0;

    for (const oListItem of m_responseItems) {
      var number = oListItem.get_item("ReqNum");
      if (number != null) {
        number = number.get_lookupValue();

        var responseObject = new Object();
        responseObject["request"] = m_bigMap[number]; //GetRequest( number );
        if (!responseObject.request || !responseObject.request.emailSent)
          //they should see it if they have access; then there's probably a permissions issue
          continue;

        responseObject["item"] = oListItem;

        responseObject["resStatus"] = oListItem.get_item("ResStatus");

        responseObject["actionOffice"] = oListItem.get_item("ActionOffice");
        if (responseObject["actionOffice"] == null)
          responseObject["actionOffice"] = "";
        else
          responseObject["actionOffice"] =
            responseObject["actionOffice"].get_lookupValue();
        if (responseObject["actionOffice"] == "") continue;

        responseObject["ID"] = oListItem.get_item("ID");
        responseObject["number"] = number;

        var title = oListItem.get_item("Title");
        responseObject["title"] = title;

        var modifiedDate = oListItem.get_item("Modified");
        modifiedDate != null
          ? (modifiedDate = modifiedDate.format("MM/dd/yyyy hh:mm tt"))
          : (modifiedDate = "");
        responseObject["modified"] = modifiedDate;

        var closedDate = oListItem.get_item("ClosedDate");
        closedDate != null
          ? (closedDate = closedDate.format("MM/dd/yyyy"))
          : (closedDate = "");
        responseObject["closedDate"] = closedDate;

        responseObject["sample"] = oListItem.get_item("SampleNumber");
        if (responseObject["sample"] == null) responseObject["sample"] = "";

        responseObject["coversheets"] = new Array();
        responseObject["responseDocs"] = new Array();

        var responseComments = oListItem.get_item("Comments");
        if (responseComments == null) responseComments = "";
        responseObject["comments"] = responseComments;

        responseObject["closedBy"] =
          Audit.Common.Utilities.GetFriendlyDisplayName(oListItem, "ClosedBy");

        responseObject["arrIndex"] = cnt;
        m_arrResponses.push(responseObject);

        m_bigMap["response-" + title] = responseObject;
        cnt++;
      }
    }
  }

  function LoadResponseDocs() {
    for (var oListItem of m_ResponseDocsItems) {
      if (
        oListItem.get_item("DocumentStatus") == "Open" ||
        oListItem.get_item("DocumentStatus") == "Marked for Deletion" ||
        oListItem.get_item("DocumentStatus") == "Submitted"
      )
        //QA shouldn't see any documents that have been uploaded by AO but not sent to them by IA
        continue;

      var requestNumber = oListItem.get_item("ReqNum");
      if (requestNumber != null)
        requestNumber = requestNumber.get_lookupValue();

      var responseID = oListItem.get_item("ResID");
      if (responseID != null) responseID = responseID.get_lookupValue();

      if (requestNumber == null || responseID == null) continue;

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
          responseDocObject["title"] = oListItem.get_item("FileLeafRef");
          responseDocObject["folder"] = oListItem.get_item("FileDirRef");
          responseDocObject["documentStatus"] =
            oListItem.get_item("DocumentStatus");

          //if( responseDocObject ["documentStatus"] == "Marked for Deletion" || responseDocObject ["documentStatus"] == "Open" || responseDocObject ["documentStatus"] == "Submitted") //this should never be the case
          //	continue;

          responseDocObject["rejectReason"] =
            oListItem.get_item("RejectReason");
          if (responseDocObject["rejectReason"] == null)
            responseDocObject["rejectReason"] = "";
          else
            responseDocObject["rejectReason"] = responseDocObject[
              "rejectReason"
            ].replace(/(\r\n|\n|\r)/gm, "<br/>");
          //console.log( responseDocObject ["rejectReason"] );

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
            Audit.Common.Utilities.GetFriendlyDisplayName(oListItem, "Editor");

          responseDocObject["item"] = oListItem;

          oResponse["responseDocs"].push(responseDocObject);
          //bigMapItem["responseDocs"].push( responseDocObject );
        }
      } catch (err) {}
    }
  }

  function LoadTabStatusReport(arr, fbody) {
    if (arr == null) return;

    //var bLoadTest = GetUrlKeyValue("LoadTest");
    var responseArr = new Array();

    var responseStatus1 = "4-Approved for QA";
    var responseStatus2 = "6-Reposted After Rejection";

    var count = 0;
    var resStatus1 = 0;
    var resStatus2 = 0;

    var arrlength = arr.length;
    while (arrlength--) {
      var oResponse = arr[arrlength];
      var responseTitle = oResponse.title;
      var requestStatus = oResponse.request.status;
      var responseStatus = oResponse.resStatus;

      var highlight = false;
      if (
        (responseStatus == responseStatus1 ||
          responseStatus == responseStatus2) &&
        (requestStatus == "Open" || requestStatus == "ReOpened")
      ) {
        count++;

        if (responseStatus == responseStatus1) resStatus1++;
        else resStatus2++;

        highlight = true;
      }

      var responseTitle = oResponse.title;
      var requestStatus = oResponse.request.status;
      var responseStatus = oResponse.resStatus;

      var aResponse = {
        reqNumber: oResponse.request.number,
        requestSubject: oResponse.request.subject,
        requestStatus: requestStatus,
        internalDueDate: oResponse.request.internalDueDate,
        sample: oResponse.sample,
        title: responseTitle,
        status: responseStatus,
        docCount: oResponse.responseDocs.length,
        modified: oResponse.modified,
        comments: oResponse.comments,
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
      m_resStatusToFilterOn = "";
      if (resStatus1 > 0 && resStatus2 == 0)
        m_resStatusToFilterOn = responseStatus1;
      else if (resStatus2 > 0 && resStatus1 == 0)
        m_resStatusToFilterOn = responseStatus2;

      _myViewModel.cntPendingReview(count);

      ko.utils.arrayPushAll(_myViewModel.arrResponses, responseArr);

      //do this after push all because this takes some time
      // var output = $("#responseTemplate").render(responseArr);
      // $("#" + fbody).html(output);

      //DoUpdateModel( responseArr, true);
    }

    //always do this even if 0 responses
    _myViewModel.doSort(true);
  }

  /////////OBSOLETE
  //recursive function
  function DoUpdateModel(arrResponsesToAdd, initialTrip) {
    /*
		ko.utils.arrayPushAll( _myViewModel.arrResponses, arrResponsesToAdd);
		_myViewModel.arrResponses.valueHasMutated();
		_myViewModel.doSort ( true );
		return;
		*/

    var subArr = [];

    var bContinue = true;
    var batchSize = 100;
    if (initialTrip) batchSize = 100;

    if (arrResponsesToAdd.length >= batchSize) {
      subArr = arrResponsesToAdd.slice(0, batchSize);
      arrResponsesToAdd.splice(0, batchSize);
    } else if (arrResponsesToAdd.length > 0) {
      subArr = arrResponsesToAdd.slice(0, arrResponsesToAdd.length);
      arrResponsesToAdd.splice(0, arrResponsesToAdd.length);
    }

    if (bContinue) {
      ////////////// Not sure if I should be doing .arrResponses or .arrResponses()
      ko.utils.arrayPushAll(_myViewModel.arrResponses(), subArr);

      var updatedMutated = false;
      if (initialTrip) {
        //	_myViewModel.arrResponses.valueHasMutated();
        updatedMutated = true;
      }

      _myViewModel.arrResponses.valueHasMutated();

      if (arrResponsesToAdd.length == 0) {
        //		if( !initialTrip && !updatedMutated ) //only mutate at the end after initial trip
        //			_myViewModel.arrResponses.valueHasMutated();

        _myViewModel.doSort(true);
      }

      //DoUpdateModel( arrResponsesToAdd, false );
      if (arrResponsesToAdd.length > 0) {
        //DoUpdateModel( arrResponsesToAdd, false);
        setTimeout(function () {
          DoUpdateModel(arrResponsesToAdd, false);
        }, 100);

        /*
				if( initialTrip )
			    	setTimeout( function(){ DoUpdateModel( arrResponsesToAdd, false); }, 100);
			    else
			    	DoUpdateModel( arrResponsesToAdd, false );*/
      }
    }
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

                arrCS.push({
                  folder: csFolder,
                  fileName: csTitle,
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
    function OnFailure(sender, args) {
      $("#tblCoverSheets").hide();
      $("#divEmptyCoversheetsMsg").show();
    }
    currCtx.executeQueryAsync(
      Function.createDelegate(data, OnSuccess),
      Function.createDelegate(data, OnFailure)
    );
  }

  function LoadTabResponseInfoResponseDocs(oResponse) {
    _myViewModel.arrResponseDocs(null);
    _myViewModel.cntResponseDocs(0);

    _myViewModel.showBulkApprove(false);
    _myViewModel.showCloseResponse(false);
    _myViewModel.showReturnToCGFS(false);

    if (
      (oResponse == null || oResponse.responseDocs.length == 0) &&
      $("#ddlResponsesOpen").val() != ""
    ) {
      //an open response is selected and there are no documents
      notifyId = SP.UI.Notify.addNotification(
        "There are 0 documents to review for " + $("#ddlResponsesOpen").val(),
        false
      );
      _myViewModel.showReturnToCGFS(true);
      return;
    }

    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    for (var z = 0; z < oResponse.responseDocs.length; z++) {
      var oResponseDoc = oResponse.responseDocs[z];

      //this loads on execute
      oResponseDoc["docIcon"] = web.mapToIcon(
        oResponseDoc.fileName,
        "",
        SP.Utilities.IconSize.Size16
      ); // Audit.Common.Utilities.GetSiteUrl() + "/" + _spPageContextInfo.layoutsUrl + "/images/" + docIcon;
    }

    function OnSuccess(sender, args) {
      RenderResponses(oResponse);
    }
    function OnFailure(sender, args) {
      statusId = SP.UI.Status.addStatus(
        "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
      );
      SP.UI.Status.setStatusPriColor(statusId, "red");
    }
    currCtx.executeQueryAsync(OnSuccess, OnFailure);

    function RenderResponses(oResponse) {
      if (oResponse == null) return;

      var rowCount = 0;
      var cntCanBeApprovedOrRejected = 0;
      var cntApprovedOrArchived = 0;
      var bDisplayingCloseBtn = false;

      var arrResponseDocs = new Array();
      for (var z = 0; z < oResponse.responseDocs.length; z++) {
        var oResponseDoc = oResponse.responseDocs[z];
        oResponseDoc.docIcon = oResponseDoc.docIcon.get_value();
        oResponseDoc.styleTag = Audit.Common.Utilities.GetResponseDocStyleTag2(
          oResponseDoc.documentStatus
        );
        oResponseDoc.responseTitle = oResponse.title;

        if (
          (oResponse.resStatus == "4-Approved for QA" ||
            oResponse.resStatus == "6-Reposted After Rejection") &&
          oResponseDoc.documentStatus == "Sent to QA"
        ) {
          cntCanBeApprovedOrRejected++;
          _myViewModel.showBulkApprove(true);
        } else if (
          (oResponse.resStatus == "4-Approved for QA" ||
            oResponse.resStatus == "6-Reposted After Rejection") &&
          oResponseDoc.documentStatus == "Rejected"
        ) {
          _myViewModel.showReturnToCGFS(true);
        } else if (
          (oResponse.resStatus == "4-Approved for QA" ||
            oResponse.resStatus == "6-Reposted After Rejection") &&
          (oResponseDoc.documentStatus == "Archived" ||
            oResponseDoc.documentStatus == "Approved")
        ) {
          cntApprovedOrArchived++;
        }
        arrResponseDocs.push(oResponseDoc);
      }

      var arrResponseSummary = {
        responseTitle: oResponse.title,
        responseDocs: arrResponseDocs,
        responseStatus: oResponse.resStatus,
      };

      //this is a fail safe check in case the response didnt close for some reason but all of the documents are approved or archived
      if (
        cntApprovedOrArchived == arrResponseDocs.length &&
        $("#ddlResponsesOpen").val() != ""
      ) {
        //check if all documents are complete for QA and that if the response is still open
        _myViewModel.showCloseResponse(true);
        SP.UI.Notify.addNotification(
          "This Response did not automatically close. Please close this response.",
          false
        );
      }

      if (
        !bDisplayingCloseBtn &&
        cntCanBeApprovedOrRejected == 0 &&
        $("#ddlResponsesOpen").val() != ""
      ) {
        //make sure an open response is selected
        _myViewModel.showReturnToCGFS(true);
      }

      _myViewModel.arrResponseDocs(arrResponseSummary);
      _myViewModel.arrResponseDocs.valueHasMutated();
      _myViewModel.cntResponseDocs(oResponse.responseDocs.length);
    }
  }

  function m_fnDisplayHelpResponseDocs() {
    var helpDlg =
      "<div id='helpDlg' style='padding:20px; height:100px; width:700px'>" +
      "<div style='padding:20px;'><fieldset><legend>Response Document Status</legend> <ul style='padding-top:10px;'>" +
      "<li style='padding-top:5px;'><b>Submitted</b> - Submitted to the Internal Auditor by the Action Office</li>" +
      "<li style='padding-top:5px;'><b>Sent to QA</b> - Submitted to the Quality Assurance team by the Internal Auditor</li>" +
      "<li style='padding-top:5px;'><b>Approved</b> - Approved by the Quality Assurance team and submitted to the External Auditor</li>" +
      "<li style='padding-top:5px;'><b>Rejected</b> - Rejected by the Quality Assurance team and returned to the Internal Auditor</li>" +
      "<li style='padding-top:5px;'><b>Archived</b> - Previously Rejected by the Quality Assurance team and is now read-only for record keeping</li>" +
      "</ul></fieldset></div>" +
      "<div style='padding:20px; padding-top:10px;'><fieldset style='padding-top:10px;'><legend>Actions</legend> If the Response Status is <b>4-Approved for QA</b> or <b>6-Reposted After Rejection</b>, then the documents can be <b>Approved</b> or <b>Rejected</b><ul style='padding-top:10px;'>" +
      "<li style='padding-top:5px;'><b>Approve</b> - Submit the document to the External Auditor</li>" +
      "<li style='padding-top:5px;'><b>Reject</b> - Reject the document and return to the Internal Auditor</li>" +
      "</ul></fieldset></div>" +
      "<table style='padding-top:10px; width:200px; float:right'>" +
      "<tr><td class='ms-separator'>&#160;</td><td><input id='btnCancel' type='button' class='ms-ButtonHeightWidth' value='Close' title='Close Help' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)'/></td></tr>" +
      "</table></div>";

    $("body").append(helpDlg);

    var options = SP.UI.$create_DialogOptions();
    options.title = "Response Documents Help";
    options.dialogReturnValueCallback = OnCallbackForm;
    options.html = document.getElementById("helpDlg");
    options.height = 450;
    SP.UI.ModalDialog.showModalDialog(options);
  }

  let m_cntToApprove = 0;
  let m_cntApproved = 0;
  function m_fnApproveAll() {
    m_bIsTransactionExecuting = true;

    var approveResponseDocDlg =
      "<div id='approveResponseDocDlg' style='padding:20px; height:100px'><div style='padding:20px;'>Are you sure you would like to <span style='font-weight:bold; color:green'>Approve</span> all remaining documents?</span></div>" +
      "<table style='padding-top:10px; width:200px; margin:0px auto'>" +
      "<tr><td><input id='btnClientOk1' type='button' class='ms-ButtonHeightWidth' value='Send to Auditor' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK)'/></td>" +
      "<td class='ms-separator'>&#160;</td><td><input id='btnCancel' type='button' class='ms-ButtonHeightWidth' value='Close' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)'/></td></tr>" +
      "</table></div>";

    $("body").append(approveResponseDocDlg);

    var options = SP.UI.$create_DialogOptions();
    options.title = "Approve Response Documents";
    options.dialogReturnValueCallback = OnCallbackApproveAllResponseDoc;
    options.html = document.getElementById("approveResponseDocDlg");
    SP.UI.ModalDialog.showModalDialog(options);
  }

  function m_fnApproveResponseDoc(id, responseDocFileName) {
    m_bIsTransactionExecuting = true;
    //used in callback
    m_itemID = id;
    m_RejectReason = "";

    var approveResponseDocDlg =
      "<div id='approveResponseDocDlg' style='padding:20px; height:100px'><div style='padding:20px;'>Are you sure you would like to <span style='font-weight:bold; color:green'>Approve</span> the Response Document? <p style='padding-top:10px; font-weight:bold; color:green'>" +
      responseDocFileName +
      "</p></span></div>" +
      "<table style='padding-top:10px; width:200px; margin:0px auto'>" +
      "<tr><td><input id='btnClientOk1' type='button' class='ms-ButtonHeightWidth' value='Send to Auditor' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK)'/></td>" +
      "<td class='ms-separator'>&#160;</td><td><input id='btnCancel' type='button' class='ms-ButtonHeightWidth' value='Close' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)'/></td></tr>" +
      "</table></div>";

    $("body").append(approveResponseDocDlg);

    var options = SP.UI.$create_DialogOptions();
    options.title = "Approve Response Document";
    options.dialogReturnValueCallback = OnCallbackApproveResponseDoc;
    options.html = document.getElementById("approveResponseDocDlg");
    SP.UI.ModalDialog.showModalDialog(options);
  }

  function m_fnRejectResponseDoc(id, responseDocFileName) {
    m_bIsTransactionExecuting = true;
    //used in callback
    m_itemID = id;
    m_RejectReason = "";

    var rejectResponseDocDlg =
      "<div id='rejectResponseDocDlg' style='padding:20px; height:100px'><div style='padding:20px;'>Are you sure you would like to <span style='font-weight:bold; color:DarkRed'>Reject</span> the Response Document? <p style='padding-top:10px; font-weight:bold; color:DarkRed'>" +
      responseDocFileName +
      "</p><p style='padding-top:10px'>If so, please specify the reason: </p><p><textarea id='txtRejectReason' cols='50' rows='3' onkeyup='Audit.QAReport.Report.GetCancelReason()'></textarea></p></span></div>" +
      "<table style='padding-top:10px; width:200px; margin:0px auto'>" +
      "<tr><td><input id='btnClientOk1' type='button' class='ms-ButtonHeightWidth' value='Yes, Reject Document' disabled='disabled' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK)'/></td>" +
      "<td class='ms-separator'>&#160;</td><td><input id='btnCancel' type='button' class='ms-ButtonHeightWidth' value='Close' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)'/></td></tr>" +
      "</table></div>";

    $("body").append(rejectResponseDocDlg);

    var options = SP.UI.$create_DialogOptions();
    options.title = "Reject Response Document";
    options.dialogReturnValueCallback = OnCallbackRejectResponseDoc;
    options.html = document.getElementById("rejectResponseDocDlg");
    SP.UI.ModalDialog.showModalDialog(options);
    $("#txtRejectReason").focus();
  }

  function m_fnCloseResponse() {
    m_bIsTransactionExecuting = true;

    var responseDocDlg =
      "<div id='responseDocDlg' style='padding:20px; height:100px'><div style='padding:20px;'>All documents in this response are Approved. Are you sure you would like to <span style='font-weight:bold; color:green'>Close this Response</span>? </span></div>" +
      "<table style='padding-top:10px; width:200px; margin:0px auto'>" +
      "<tr><td><input id='btnClientOk1' type='button' class='ms-ButtonHeightWidth' value='Close Response' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK)'/></td>" +
      "<td class='ms-separator'>&#160;</td><td><input id='btnCancel' type='button' class='ms-ButtonHeightWidth' value='Close' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)'/></td></tr>" +
      "</table></div>";

    $("body").append(responseDocDlg);

    var options = SP.UI.$create_DialogOptions();
    options.title = "Close Response";
    options.dialogReturnValueCallback = OnCallbackCloseResponse;
    options.html = document.getElementById("responseDocDlg");
    SP.UI.ModalDialog.showModalDialog(options);
  }

  function m_fnReturnToCGFS() {
    m_bIsTransactionExecuting = true;

    var responseDocDlg =
      "<div id='responseDocDlg' style='padding:20px; height:100px'><div style='padding:20px;'>Are you sure you would like to <span style='font-weight:bold; color:darkred'>Return this Response to CGFS</span>? <p style='padding-top:10px;'><b>Note</b>: If you return it, you will no longer be able to Approve or Reject the Remaining Response Documents</p></span></div>" +
      "<table style='padding-top:10px; width:200px; margin:0px auto'>" +
      "<tr><td><input id='btnClientOk1' type='button' class='ms-ButtonHeightWidth' value='Return to CGFS' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK)'/></td>" +
      "<td class='ms-separator'>&#160;</td><td><input id='btnCancel' type='button' class='ms-ButtonHeightWidth' value='Close' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)'/></td></tr>" +
      "</table></div>";

    $("body").append(responseDocDlg);

    var options = SP.UI.$create_DialogOptions();
    options.title = "Return to CGFS";
    options.dialogReturnValueCallback = OnCallbackReturnToCGFS;
    options.html = document.getElementById("responseDocDlg");
    SP.UI.ModalDialog.showModalDialog(options);
  }

  function m_fnFormatEmailBodyToIAFromQA(oRequest, responseTitle) {
    var emailText =
      "<div>Audit Request Reference: <b>REQUEST_NUMBER</b></div>" +
      "<div>Audit Request Subject: <b>REQUEST_SUBJECT</b></div>" +
      "<div>Audit Request Due Date: <b>REQUEST_DUEDATE</b></div><br/>" +
      "<div>Below is the Response that was updated: </div>" +
      "<div>RESPONSE_TITLE</div>";

    emailText = emailText.replace("REQUEST_NUMBER", oRequest.number);
    emailText = emailText.replace("REQUEST_SUBJECT", oRequest.subject);
    emailText = emailText.replace("REQUEST_DUEDATE", oRequest.internalDueDate);
    emailText = emailText.replace("REQUEST_ACTIONITEMS", oRequest.actionItems);

    var responseTitleBody = "<ul><li>" + responseTitle + "</li></ul>";
    emailText = emailText.replace("RESPONSE_TITLE", responseTitleBody);

    return emailText;
  }

  function m_fnGetResponseByTitle(title) {
    var oResponse = null;
    try {
      oResponse = m_bigMap["response-" + title];
    } catch (err) {}

    return oResponse;
  }

  function m_fnCreateEAFolder(requestNumber) {
    var ctx2 = new SP.ClientContext.get_current();

    //Check if folder exists in EA library
    var bFolderExists = false;
    var listItemEnumerator = eaReponseDocsFolderItems.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      var folderItem = listItemEnumerator.get_current();

      var itemName = folderItem.get_displayName();
      if (itemName == requestNumber) {
        bFolderExists = true;
        break;
      }
    }

    //If folder doesn't exist, create it in EA library
    if (!bFolderExists) {
      var earesponseDocLib = ctx2
        .get_web()
        .get_lists()
        .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocsEA());

      var itemCreateInfo = new SP.ListItemCreationInformation();
      itemCreateInfo.set_underlyingObjectType(SP.FileSystemObjectType.folder);
      itemCreateInfo.set_leafName(requestNumber);

      const oNewEAFolder = earesponseDocLib.addItem(itemCreateInfo);
      oNewEAFolder.set_item("Title", requestNumber);
      oNewEAFolder.update();

      function OnSuccess(sender, args) {}
      function OnFailure(sender, args) {}

      ctx2.executeQueryAsync(OnSuccess, OnFailure);
    }
  }

  function m_fnCreateEAEmailLogItem() {
    var ctx2 = new SP.ClientContext.get_current();

    //Check if an item exists in EA Email log list library
    var bExists = false;
    var listItemEnumerator = eaEmailLogListItems.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      var emailLogItems = listItemEnumerator.get_current();

      var bExists = true;
      break;
    }

    //If folder doesn't exist, create it in EA library
    if (!bExists) {
      //this should never come here
      var eaEmailLogList = ctx2
        .get_web()
        .get_lists()
        .getByTitle("AuditEAEmailLog");
      var date = new Date();
      var friendlyName = date.format("MM/dd/yyyy");

      var itemCreateInfo = new SP.ListItemCreationInformation();
      const oNewEmailLogItem = eaEmailLogList.addItem(itemCreateInfo);
      oNewEmailLogItem.set_item("Title", friendlyName);
      oNewEmailLogItem.update();

      function OnSuccess(sender, args) {}
      function OnFailure(sender, args) {}

      ctx2.executeQueryAsync(OnSuccess, OnFailure);
    }
  }

  function m_fnGetRequestByResponseTitle(responseTitle) {
    var oRequest = null;

    try {
      var response = m_bigMap["response-" + responseTitle];
      if (response) oRequest = response.request;
    } catch (err) {}

    return oRequest;
  }

  function m_fnCreateEmailToIAFromQA(
    emailList,
    oRequest,
    responseTitle,
    emailSubject
  ) {
    if (!oRequest || !emailList) return;

    var emailText = m_fnFormatEmailBodyToIAFromQA(oRequest, responseTitle);

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
    const oListItem = emailList.addItem(itemCreateInfo);
    oListItem.set_item("Title", emailSubject);
    oListItem.set_item("Body", emailText);
    oListItem.set_item("To", m_IA_ActionOffice.title);
    oListItem.set_item("ReqNum", oRequest.number);
    oListItem.set_item("ResID", responseTitle);
    oListItem.set_item("NotificationType", "IA Notification");
    oListItem.update();
  }

  function OnCallbackForm(result, value) {
    if (result === SP.UI.DialogResult.OK) {
    }
  }

  function OnCallbackCloseResponse(result, value) {
    if (result === SP.UI.DialogResult.OK) {
      m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
        "Closing Response",
        "Please wait... Closing Response",
        200,
        400
      );

      var responseTitle = $("#ddlResponsesOpen").val();

      var ctx2 = SP.ClientContext.get_current();

      var aresponseList = ctx2
        .get_web()
        .get_lists()
        .getByTitle(Audit.Common.Utilities.GetListTitleResponses());
      var aresponseQuery = new SP.CamlQuery();
      aresponseQuery.set_viewXml(
        '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' +
          responseTitle +
          "</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>"
      );
      const aresponseItems = aresponseList.getItems(aresponseQuery);
      ctx2.load(aresponseItems);

      var emailList = ctx2
        .get_web()
        .get_lists()
        .getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory());
      var emailListQuery = new SP.CamlQuery();
      emailListQuery.set_viewXml(
        '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>'
      );
      const emailListFolderItems = emailList.getItems(emailListQuery);
      ctx2.load(
        emailListFolderItems,
        "Include(ID, FSObjType, Title, DisplayName)"
      );

      function OnSuccess(sender, args) {
        var listItemEnumerator = aresponseItems.getEnumerator();
        while (listItemEnumerator.moveNext()) {
          var oListItemResponse = listItemEnumerator.get_current();

          var responseTitle = oListItemResponse.get_item("Title");

          var curDate = new Date();
          oListItemResponse.set_item("ResStatus", "7-Closed");
          //oListItemResponse.set_item( "ClosedDate", Audit.Common.Utilities.GetISODateString( curDate) );
          var newClosedTime = new Date(
            curDate.getFullYear(),
            curDate.getMonth(),
            curDate.getDate(),
            curDate.getHours(),
            curDate.getMinutes(),
            curDate.getSeconds(),
            curDate.getMilliseconds()
          );
          oListItemResponse.set_item("ClosedDate", newClosedTime);
          oListItemResponse.set_item("ClosedBy", _spPageContextInfo.userId);
          oListItemResponse.update();

          var oRequest = null;
          try {
            var mapResponse = m_bigMap["response-" + responseTitle];
            if (mapResponse) oRequest = mapResponse.request;
          } catch (err) {}

          if (oRequest) {
            m_fnCreateEmailToIAFromQA(
              emailList,
              oRequest,
              responseTitle,
              "An Audit Response has been Closed by the Quality Assurance Team: " +
                responseTitle
            );
          } else m_waitDialog.close();

          ctx2.executeQueryAsync(
            function () {
              m_waitDialog.close();

              Audit.Common.Utilities.Refresh();
            },
            function () {
              m_waitDialog.close();
              Audit.Common.Utilities.Refresh();
            }
          );

          break; //should only be once
        }
      }
      function OnFailure(sender, args) {
        m_waitDialog.close();
        alert(
          "Request failed. " + args.get_message() + "\n" + args.get_stackTrace()
        );
      }

      ctx2.executeQueryAsync(OnSuccess, OnFailure);
    } else m_bIsTransactionExecuting = false;
  }

  function OnCallbackReturnToCGFS(result, value) {
    if (result === SP.UI.DialogResult.OK) {
      m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
        "Returning to CGFS",
        "Please wait... Returning to CGFS",
        200,
        400
      );

      var responseTitle = $("#ddlResponsesOpen").val();

      var ctx2 = SP.ClientContext.get_current();

      var aresponseList = ctx2
        .get_web()
        .get_lists()
        .getByTitle(Audit.Common.Utilities.GetListTitleResponses());
      var aresponseQuery = new SP.CamlQuery();
      aresponseQuery.set_viewXml(
        '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' +
          responseTitle +
          "</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>"
      );
      const aresponseItems = aresponseList.getItems(aresponseQuery);
      ctx2.load(aresponseItems);

      var emailList = ctx2
        .get_web()
        .get_lists()
        .getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory());
      var emailListQuery = new SP.CamlQuery();
      emailListQuery.set_viewXml(
        '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>'
      );
      let emailListFolderItems = emailList.getItems(emailListQuery);
      ctx2.load(
        emailListFolderItems,
        "Include(ID, FSObjType, Title, DisplayName)"
      );

      function OnSuccess(sender, args) {
        var listItemEnumerator = aresponseItems.getEnumerator();
        while (listItemEnumerator.moveNext()) {
          var oListItemResponse = listItemEnumerator.get_current();

          var responseTitle = oListItemResponse.get_item("Title");

          var curDate = new Date();
          oListItemResponse.set_item("ResStatus", "5-Returned to GFS");
          oListItemResponse.update();

          var oRequest = null;
          try {
            var mapResponse = m_bigMap["response-" + responseTitle];
            if (mapResponse) oRequest = mapResponse.request;
          } catch (err) {}

          if (oRequest) {
            m_fnCreateEmailToIAFromQA(
              emailList,
              oRequest,
              responseTitle,
              "An Audit Response has been Returned by the Quality Assurance Team: " +
                responseTitle
            );
          } else m_waitDialog.close();

          ctx2.executeQueryAsync(
            function () {
              m_waitDialog.close();

              Audit.Common.Utilities.Refresh();
            },
            function () {
              m_waitDialog.close();
              Audit.Common.Utilities.Refresh();
            }
          );

          break; //should only be once
        }
      }
      function OnFailure(sender, args) {
        m_waitDialog.close();
        alert(
          "Request failed. " + args.get_message() + "\n" + args.get_stackTrace()
        );
      }

      ctx2.executeQueryAsync(OnSuccess, OnFailure);
    } else m_bIsTransactionExecuting = false;
  }

  function OnCallbackApproveResponseDoc(result, value) {
    if (result === SP.UI.DialogResult.OK) {
      m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
        "Approving Response Document",
        "Please wait... Approving Response Document",
        200,
        400
      );

      var clientContext = SP.ClientContext.get_current();
      var oList = clientContext
        .get_web()
        .get_lists()
        .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());

      let oListItem = oList.getItemById(m_itemID);
      clientContext.load(oListItem);

      var eaResponseDocsLib = clientContext
        .get_web()
        .get_lists()
        .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocsEA());
      var earesponseDocsQuery = new SP.CamlQuery();
      earesponseDocsQuery.set_viewXml(
        '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>'
      );
      eaReponseDocsFolderItems =
        eaResponseDocsLib.getItems(earesponseDocsQuery);
      clientContext.load(
        eaReponseDocsFolderItems,
        "Include(ID, FSObjType, Title, DisplayName)"
      );

      //make sure ea email folder exists
      var eaEmailLogList = clientContext
        .get_web()
        .get_lists()
        .getByTitle("AuditEAEmailLog");
      var eaEmailLogListQuery = new SP.CamlQuery();
      eaEmailLogListQuery.set_viewXml(
        '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="Created"/><Value IncludeTimeValue="FALSE" Type="DateTime"><Today/></Value></Eq></Where></Query></View>'
      );
      eaEmailLogListItems = eaEmailLogList.getItems(eaEmailLogListQuery);
      clientContext.load(eaEmailLogListItems, "Include(ID)");

      function OnSuccess(sender, args) {
        var oResponse = m_fnGetResponseByTitle($("#ddlResponsesOpen").val());

        if (oResponse == null || oResponse.request == null) {
          m_waitDialog.close();
          return;
        }
        const oRequest = oResponse.request;
        const folderPath = oRequest.number;

        m_fnCreateEAFolder(folderPath);
        m_fnCreateEAEmailLogItem();

        var requestId = oRequest.number;
        var responseNumber = oResponse.title;
        var fileName = oListItem.get_item("FileLeafRef");

        var ctx2 = new SP.ClientContext.get_current();
        var oList = ctx2
          .get_web()
          .get_lists()
          .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());

        //refetch to avoid version conflict
        oListItem = oList.getItemById(m_itemID);

        var file = oListItem.get_file();
        var absoluteSiteUrl =
          location.protocol +
          "//" +
          location.host +
          _spPageContextInfo.webServerRelativeUrl +
          "/";
        var destinationFileNameUrl =
          absoluteSiteUrl +
          Audit.Common.Utilities.GetLibTitleResponseDocsEA() +
          "/" +
          folderPath +
          "/" +
          fileName;
        file.copyTo(destinationFileNameUrl, 1);

        oListItem.set_item("DocumentStatus", "Approved");
        oListItem.set_item("RejectReason", "");
        oListItem.update();

        var siteUrl = location.protocol + "//" + location.host;
        var urlOfNewFile = destinationFileNameUrl.replace(siteUrl, "");
        const newFile = ctx2.get_web().getFileByServerRelativeUrl(urlOfNewFile);
        ctx2.load(newFile, "ListItemAllFields");
        //ctx2.load(newFile, 'Include(ID)');

        //alert( "folderPath: " + folderPath );
        var data = {
          responseTitle: responseNumber,
          copiedFileName: destinationFileNameUrl,
          requestId: requestId,
          responseNumber: responseNumber,
        };
        //Execute the query and pass the data with our deferred object

        //Check for all response docs statuses, if there are no more pending actions, close the response and set the closed date of the response
        function onUpdateResFolderSuccess() {
          if (
            this.responseTitle == null ||
            this.responseTitle == undefined ||
            this.responseTitle == ""
          ) {
            m_waitDialog.close();
            alert("Error: empty response title ");
            return;
          }

          var ctx3 = SP.ClientContext.get_current();

          //update the file in the EA document library with the request/response properties
          var idOfCopiedFile = newFile.get_listItemAllFields().get_id();
          var oEADocLib = ctx3
            .get_web()
            .get_lists()
            .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocsEA());
          const oListFileItem = oEADocLib.getItemById(idOfCopiedFile);
          oListFileItem.set_item("RequestNumber", this.requestId);
          oListFileItem.set_item("ResponseID", this.responseNumber);
          oListFileItem.update();

          var aresponseList = ctx3
            .get_web()
            .get_lists()
            .getByTitle(Audit.Common.Utilities.GetListTitleResponses());
          var aresponseQuery = new SP.CamlQuery();
          aresponseQuery.set_viewXml(
            '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' +
              this.responseTitle +
              "</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>"
          );
          const aresponseItems = aresponseList.getItems(aresponseQuery);
          ctx3.load(aresponseItems);

          var folderPath =
            Audit.Common.Utilities.GetSiteUrl() +
            "/" +
            Audit.Common.Utilities.GetLibNameResponseDocs() +
            "/" +
            this.responseTitle;
          var aresponseDocList = ctx3
            .get_web()
            .get_lists()
            .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
          var aresponseDocQuery = new SP.CamlQuery();
          aresponseDocQuery.set_viewXml(
            '<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><And><Eq><FieldRef Name="FSObjType"/><Value Type="Text">0</Value></Eq><Eq><FieldRef Name="FileDirRef"/><Value Type="Text">' +
              folderPath +
              "</Value></Eq></And></Where></Query></View>"
          );
          const aresponseDocItems =
            aresponseDocList.getItems(aresponseDocQuery);
          ctx3.load(aresponseDocItems);

          var emailList = ctx3
            .get_web()
            .get_lists()
            .getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory());
          var emailListQuery = new SP.CamlQuery();
          emailListQuery.set_viewXml(
            '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>'
          );
          let emailListFolderItems = emailList.getItems(emailListQuery);
          ctx3.load(
            emailListFolderItems,
            "Include(ID, FSObjType, Title, DisplayName)"
          );

          function onUpdateSucceededZZ() {
            notifyId = SP.UI.Notify.addNotification(
              "Approved Response Document",
              false
            );

            let bUpdateResponseStatus = true;
            var listxItemEnumerator = aresponseDocItems.getEnumerator();

            var bRejected = false;
            while (listxItemEnumerator.moveNext()) {
              var oListItemResponseDoc = listxItemEnumerator.get_current();
              var oListItemResponseDocStatus =
                oListItemResponseDoc.get_item("DocumentStatus");

              if (
                oListItemResponseDocStatus == "Open" ||
                oListItemResponseDocStatus == "Submitted" ||
                oListItemResponseDocStatus == "Sent to QA"
              ) {
                //there should never be one that's open, but checking anyway
                bUpdateResponseStatus = false;
              } else if (oListItemResponseDocStatus == "Rejected") {
                bRejected = true;
              }
            }

            //Update the Response status
            //if all items have completed (none are open or sent to QA), then update the status
            //If one is rejected, then returned to gfs. otherwise, close the response
            if (bUpdateResponseStatus) {
              var oRequest = m_fnGetRequestByResponseTitle(this.responseTitle);

              var listxxItemEnumerator = aresponseItems.getEnumerator();
              while (listxxItemEnumerator.moveNext()) {
                var oListItemResponse = listxxItemEnumerator.get_current();

                if (!bRejected) {
                  var curDate = new Date();
                  oListItemResponse.set_item("ResStatus", "7-Closed");
                  //oListItemResponse.set_item( "ClosedDate", Audit.Common.Utilities.GetISODateString( curDate) );
                  var newClosedTime = new Date(
                    curDate.getFullYear(),
                    curDate.getMonth(),
                    curDate.getDate(),
                    curDate.getHours(),
                    curDate.getMinutes(),
                    curDate.getSeconds(),
                    curDate.getMilliseconds()
                  );
                  oListItemResponse.set_item("ClosedDate", newClosedTime);

                  oListItemResponse.set_item(
                    "ClosedBy",
                    _spPageContextInfo.userId
                  );

                  m_fnCreateEmailToIAFromQA(
                    emailList,
                    oRequest,
                    this.responseTitle,
                    "An Audit Response has been Closed by the Quality Assurance Team: " +
                      this.responseTitle
                  );
                } else {
                  oListItemResponse.set_item("ResStatus", "5-Returned to GFS");

                  m_fnCreateEmailToIAFromQA(
                    emailList,
                    oRequest,
                    this.responseTitle,
                    "An Audit Response has been Returned by the Quality Assurance Team: " +
                      this.responseTitle
                  );
                }

                oListItemResponse.update();

                ctx3.executeQueryAsync(function () {
                  m_waitDialog.close();
                  Audit.Common.Utilities.Refresh();
                });

                break; //should only be once
              }
            } else {
              m_waitDialog.close();
              Audit.Common.Utilities.Refresh();
            }
          }
          function onUpdateFailedZZ() {
            m_waitDialog.close();
          }

          var data = { responseTitle: this.responseTitle };
          ctx3.executeQueryAsync(
            Function.createDelegate(data, onUpdateSucceededZZ),
            Function.createDelegate(data, onUpdateFailedZZ)
          ); //After this line "return true" in PreSaveAction() will execute and then CallBackMethods will run.
        }

        function onUpdateResFolderFail(sender, args) {
          m_waitDialog.close();

          alert(
            "Request failed. " +
              args.get_message() +
              "\n" +
              args.get_stackTrace()
          );
          Audit.Common.Utilities.Refresh();
        }

        ctx2.executeQueryAsync(
          Function.createDelegate(data, onUpdateResFolderSuccess),
          Function.createDelegate(data, onUpdateResFolderFail)
        ); //After this line "return true" in PreSaveAction() will execute and then CallBackMethods will run.
      }
      function OnFailure(sender, args) {
        m_waitDialog.close();
        alert(
          "Request failed. " + args.get_message() + "\n" + args.get_stackTrace()
        );
      }

      clientContext.executeQueryAsync(OnSuccess, OnFailure);
    } else m_bIsTransactionExecuting = false;
  }

  function OnCallbackRejectResponseDoc(result, value) {
    if (result === SP.UI.DialogResult.OK) {
      m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
        "Rejecting Response Document",
        "Please wait... Rejecting Response Document",
        200,
        400
      );

      var clientContext = SP.ClientContext.get_current();
      var oList = clientContext
        .get_web()
        .get_lists()
        .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());

      let oListItem = oList.getItemById(m_itemID);
      clientContext.load(oListItem);

      function OnSuccess(sender, args) {
        var ctx2 = new SP.ClientContext.get_current();
        var oList = ctx2
          .get_web()
          .get_lists()
          .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());

        //refetch to avoid version conflict
        oListItem = oList.getItemById(m_itemID);
        oListItem.set_item("DocumentStatus", "Rejected");
        oListItem.set_item("RejectReason", m_RejectReason);

        oListItem.update();

        var siteUrl =
          location.protocol +
          "//" +
          location.host +
          _spPageContextInfo.webServerRelativeUrl +
          "/";
        const filePath = oListItem.get_item("FileDirRef");
        const fileName = oListItem.get_item("FileLeafRef");
        var lastInd = filePath.lastIndexOf("/");
        var urlpath = filePath.substring(0, lastInd + 1);
        var responseTitle = filePath.replace(urlpath, "");

        var folderPath =
          Audit.Common.Utilities.GetSiteUrl() +
          "/" +
          Audit.Common.Utilities.GetLibNameResponseDocs() +
          "/" +
          responseTitle;
        var aresponseDocList = ctx2
          .get_web()
          .get_lists()
          .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
        var aresponseDocQuery = new SP.CamlQuery();
        aresponseDocQuery.set_viewXml(
          '<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><And><Eq><FieldRef Name="FSObjType"/><Value Type="Text">0</Value></Eq><Eq><FieldRef Name="FileDirRef"/><Value Type="Text">' +
            folderPath +
            "</Value></Eq></And></Where></Query></View>"
        );
        const aresponseDocItems = aresponseDocList.getItems(aresponseDocQuery);
        ctx2.load(aresponseDocItems);

        var aresponseList = ctx2
          .get_web()
          .get_lists()
          .getByTitle(Audit.Common.Utilities.GetListTitleResponses());
        var aresponseQuery = new SP.CamlQuery();
        aresponseQuery.set_viewXml(
          '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' +
            responseTitle +
            "</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>"
        );
        const aresponseItems = aresponseList.getItems(aresponseQuery);
        ctx2.load(aresponseItems);

        var emailList = ctx2
          .get_web()
          .get_lists()
          .getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory());
        var emailListQuery = new SP.CamlQuery();
        emailListQuery.set_viewXml(
          '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>'
        );
        const emailListFolderItems = emailList.getItems(emailListQuery);
        ctx2.load(
          emailListFolderItems,
          "Include(ID, FSObjType, Title, DisplayName)"
        );

        function onUpdateSucceededZZ() {
          notifyId = SP.UI.Notify.addNotification(
            "Rejected Response Document",
            false
          );

          let bUpdateResponseStatus = true;
          var listxItemEnumerator = aresponseDocItems.getEnumerator();

          while (listxItemEnumerator.moveNext()) {
            var oListItemResponseDoc = listxItemEnumerator.get_current();
            var oListItemResponseDocStatus =
              oListItemResponseDoc.get_item("DocumentStatus");

            if (
              oListItemResponseDocStatus == "Open" ||
              oListItemResponseDocStatus == "Submitted" ||
              oListItemResponseDocStatus == "Sent to QA"
            ) {
              //there should never be one that's open, but checking anyway
              bUpdateResponseStatus = false;
            }
          }

          //Update the Response status
          //if all items have completed (none are open or sent to QA), then update the status to returned to gfs because we know
          //at least 1 was rejected
          if (bUpdateResponseStatus) {
            var oRequest = m_fnGetRequestByResponseTitle(this.responseTitle);

            var listxxItemEnumerator = aresponseItems.getEnumerator();
            while (listxxItemEnumerator.moveNext()) {
              var oListItemResponse = listxxItemEnumerator.get_current();

              var curDate = new Date();
              oListItemResponse.set_item("ResStatus", "5-Returned to GFS");
              oListItemResponse.update();

              m_fnCreateEmailToIAFromQA(
                emailList,
                oRequest,
                this.responseTitle,
                "An Audit Response has been Returned by the Quality Assurance Team: " +
                  this.responseTitle
              );

              ctx2.executeQueryAsync(function () {
                m_waitDialog.close();
                Audit.Common.Utilities.Refresh();
              });

              break; //should only be once
            }
          } else {
            m_waitDialog.close();
            Audit.Common.Utilities.Refresh();
          }
        }
        function onUpdateFailedZZ() {
          m_waitDialog.close();
        }

        var data = { responseTitle: responseTitle };
        ctx2.executeQueryAsync(
          Function.createDelegate(data, onUpdateSucceededZZ),
          Function.createDelegate(data, onUpdateFailedZZ)
        ); //After this line "return true" in PreSaveAction() will execute and then CallBackMethods will run.
      }
      function OnFailure(sender, args) {
        m_waitDialog.close();
        alert(
          "Request failed. " + args.get_message() + "\n" + args.get_stackTrace()
        );
      }

      clientContext.executeQueryAsync(OnSuccess, OnFailure);
    } else m_bIsTransactionExecuting = false;
  }

  function OnCallbackApproveAllResponseDoc(result, value) {
    if (result === SP.UI.DialogResult.OK) {
      m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
        "Approving Response Documents",
        "Please wait... Approving Response Documents",
        200,
        400
      );

      var responseTitle = $("#ddlResponsesOpen").val();

      var clientContext = SP.ClientContext.get_current();

      //make sure ea folder exists
      var eaResponseDocsLib = clientContext
        .get_web()
        .get_lists()
        .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocsEA());
      var earesponseDocsQuery = new SP.CamlQuery();
      earesponseDocsQuery.set_viewXml(
        '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>'
      );
      eaReponseDocsFolderItems =
        eaResponseDocsLib.getItems(earesponseDocsQuery);
      clientContext.load(
        eaReponseDocsFolderItems,
        "Include(ID, FSObjType, Title, DisplayName)"
      );

      //make sure ea email folder exists
      var eaEmailLogList = clientContext
        .get_web()
        .get_lists()
        .getByTitle("AuditEAEmailLog");
      var eaEmailLogListQuery = new SP.CamlQuery();
      eaEmailLogListQuery.set_viewXml(
        '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="Created"/><Value IncludeTimeValue="FALSE" Type="DateTime"><Today/></Value></Eq></Where></Query></View>'
      );
      eaEmailLogListItems = eaEmailLogList.getItems(eaEmailLogListQuery);
      clientContext.load(eaEmailLogListItems, "Include(ID)");

      function OnSuccess(sender, args) {
        var oRequest = null;
        var oResponse = null;
        oResponse = m_fnGetResponseByTitle($("#ddlResponsesOpen").val());

        if (oResponse == null || oResponse.request == null) return;

        oRequest = oResponse.request;
        const folderPath = oRequest.number;

        m_fnCreateEAFolder(oRequest.number);
        m_fnCreateEAEmailLogItem();

        var requestId = oRequest.number;
        var responseNumber = oResponse.title;

        m_cntToApprove = 0;
        m_cntApproved = 0;

        for (var x = 0; x < oResponse.responseDocs.length; x++) {
          if (oResponse.responseDocs[x].documentStatus != "Sent to QA")
            continue;

          m_cntToApprove++;

          var ctx2 = new SP.ClientContext.get_current();
          var oList = ctx2
            .get_web()
            .get_lists()
            .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());

          //refetch to avoid version conflict
          let oListItem = oResponse.responseDocs[x].item;
          const fileName = oListItem.get_item("FileLeafRef");
          oListItem = oList.getItemById(oListItem.get_item("ID"));

          //copy the file to the EA library
          var file = oListItem.get_file();
          var absoluteSiteUrl =
            location.protocol +
            "//" +
            location.host +
            _spPageContextInfo.webServerRelativeUrl +
            "/";
          var destinationFileNameUrl =
            absoluteSiteUrl +
            Audit.Common.Utilities.GetLibTitleResponseDocsEA() +
            "/" +
            folderPath +
            "/" +
            fileName;
          file.copyTo(destinationFileNameUrl, 1);

          //update the reponse
          oListItem.set_item("DocumentStatus", "Approved");
          oListItem.set_item("RejectReason", "");
          oListItem.update();

          //load the file
          var siteUrl = location.protocol + "//" + location.host;
          var urlOfNewFile = destinationFileNameUrl.replace(siteUrl, "");
          const newFile = ctx2
            .get_web()
            .getFileByServerRelativeUrl(urlOfNewFile);
          ctx2.load(newFile, "ListItemAllFields");

          var data = {
            responseTitle: responseNumber,
            copiedFileName: destinationFileNameUrl,
            requestId: requestId,
            responseNumber: responseNumber,
            newFile: newFile,
          };

          function onUpdateResFolderSuccess() {
            if (
              this.responseTitle == null ||
              this.responseTitle == undefined ||
              this.responseTitle == ""
            ) {
              document.body.style.cursor = "default";
              //alert( "Error: empty response title ");
              notifyId = SP.UI.Notify.addNotification(
                "Error: empty response title ",
                false
              );

              m_waitDialog.close();
              return;
            }

            var ctx3 = SP.ClientContext.get_current();

            //update the file in the EA document library with the request/response properties
            var idOfCopiedFile = this.newFile.get_listItemAllFields().get_id();
            var oEADocLib = ctx3
              .get_web()
              .get_lists()
              .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocsEA());
            const oListFileItem = oEADocLib.getItemById(idOfCopiedFile);
            oListFileItem.set_item("RequestNumber", this.requestId);
            oListFileItem.set_item("ResponseID", this.responseNumber);
            oListFileItem.update();

            var aresponseList = ctx3
              .get_web()
              .get_lists()
              .getByTitle(Audit.Common.Utilities.GetListTitleResponses());
            var aresponseQuery = new SP.CamlQuery();
            aresponseQuery.set_viewXml(
              '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' +
                this.responseTitle +
                "</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>"
            );
            const aresponseItems = aresponseList.getItems(aresponseQuery);
            ctx3.load(aresponseItems);

            var folderPath =
              Audit.Common.Utilities.GetSiteUrl() +
              "/" +
              Audit.Common.Utilities.GetLibNameResponseDocs() +
              "/" +
              this.responseTitle;
            var aresponseDocList = ctx3
              .get_web()
              .get_lists()
              .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
            var aresponseDocQuery = new SP.CamlQuery();
            aresponseDocQuery.set_viewXml(
              '<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><And><Eq><FieldRef Name="FSObjType"/><Value Type="Text">0</Value></Eq><Eq><FieldRef Name="FileDirRef"/><Value Type="Text">' +
                folderPath +
                "</Value></Eq></And></Where></Query></View>"
            );
            const aresponseDocItems =
              aresponseDocList.getItems(aresponseDocQuery);
            ctx3.load(aresponseDocItems);

            var emailList = ctx3
              .get_web()
              .get_lists()
              .getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory());
            var emailListQuery = new SP.CamlQuery();
            emailListQuery.set_viewXml(
              '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>'
            );
            const emailListFolderItems = emailList.getItems(emailListQuery);
            ctx3.load(
              emailListFolderItems,
              "Include(ID, FSObjType, Title, DisplayName)"
            );

            function onUpdateSucceededZZ() {
              m_cntApproved++;

              if (m_cntApproved != m_cntToApprove) {
                //skip the code below if all of the expected documents that were to be approved haven't yet approved
                return;
              }

              notifyId = SP.UI.Notify.addNotification(
                "Approved Response Documents",
                false
              );

              let bUpdateResponseStatus = true;
              var listxItemEnumerator = this.aresponseDocItems.getEnumerator();

              var bRejected = false;
              while (listxItemEnumerator.moveNext()) {
                var oListItemResponseDoc = listxItemEnumerator.get_current();
                var oListItemResponseDocStatus =
                  oListItemResponseDoc.get_item("DocumentStatus");

                if (
                  oListItemResponseDocStatus == "Open" ||
                  oListItemResponseDocStatus == "Submitted" ||
                  oListItemResponseDocStatus == "Sent to QA"
                ) {
                  //there should never be one that's open, but checking anyway
                  bUpdateResponseStatus = false;
                } else if (oListItemResponseDocStatus == "Rejected") {
                  bRejected = true;
                }
              }

              //Update the Response status
              //if all items have completed (none are open or sent to QA), then update the status
              //If one is rejected, then returned to gfs. otherwise, close the response
              if (bUpdateResponseStatus) {
                var oRequest = m_fnGetRequestByResponseTitle(
                  this.responseTitle
                );

                var listxxItemEnumerator = this.aresponseItems.getEnumerator();
                while (listxxItemEnumerator.moveNext()) {
                  var oListItemResponse = listxxItemEnumerator.get_current();

                  if (!bRejected) {
                    var curDate = new Date();
                    oListItemResponse.set_item("ResStatus", "7-Closed");
                    //oListItemResponse.set_item( "ClosedDate", Audit.Common.Utilities.GetISODateString( curDate) );
                    var newClosedTime = new Date(
                      curDate.getFullYear(),
                      curDate.getMonth(),
                      curDate.getDate(),
                      curDate.getHours(),
                      curDate.getMinutes(),
                      curDate.getSeconds(),
                      curDate.getMilliseconds()
                    );
                    oListItemResponse.set_item("ClosedDate", newClosedTime);

                    oListItemResponse.set_item(
                      "ClosedBy",
                      _spPageContextInfo.userId
                    );

                    m_fnCreateEmailToIAFromQA(
                      this.emailList,
                      oRequest,
                      this.responseTitle,
                      "An Audit Response has been Closed by the Quality Assurance Team: " +
                        this.responseTitle
                    );
                  } else {
                    oListItemResponse.set_item(
                      "ResStatus",
                      "5-Returned to GFS"
                    );

                    m_fnCreateEmailToIAFromQA(
                      this.emailList,
                      oRequest,
                      this.responseTitle,
                      "An Audit Response has been Returned by the Quality Assurance Team: " +
                        this.responseTitle
                    );
                  }

                  oListItemResponse.update();

                  ctx3.executeQueryAsync(function () {
                    m_waitDialog.close();
                    Audit.Common.Utilities.Refresh();
                  });

                  break; //should only be once
                }
              } else {
                m_waitDialog.close();
                Audit.Common.Utilities.Refresh();
              }
            }
            function onUpdateFailedZZ() {
              m_waitDialog.close();
            }

            var data = {
              responseTitle: this.responseTitle,
              emailList: emailList,
              aresponseItems: aresponseItems,
              aresponseDocItems: aresponseDocItems,
              emailListFolderItems: emailListFolderItems,
            };
            ctx3.executeQueryAsync(
              Function.createDelegate(data, onUpdateSucceededZZ),
              Function.createDelegate(data, onUpdateFailedZZ)
            ); //After this line "return true" in PreSaveAction() will execute and then CallBackMethods will run.
          }
          function onUpdateResFolderFail(sender, args) {
            m_waitDialog.close();

            notifyId = SP.UI.Notify.addNotification(
              "Request failed. " +
                args.get_message() +
                "\n" +
                args.get_stackTrace(),
              false
            );

            alert(
              "Request failed. " +
                args.get_message() +
                "\n" +
                args.get_stackTrace()
            );
            Audit.Common.Utilities.Refresh();
          }
          ctx2.executeQueryAsync(
            Function.createDelegate(data, onUpdateResFolderSuccess),
            Function.createDelegate(data, onUpdateResFolderFail)
          ); //After this line "return true" in PreSaveAction() will execute and then CallBackMethods will run.
        }
      }
      function OnFailure(sender, args) {
        m_waitDialog.close();
        alert(
          "Request failed. " + args.get_message() + "\n" + args.get_stackTrace()
        );
      }

      clientContext.executeQueryAsync(OnSuccess, OnFailure);
    } else m_bIsTransactionExecuting = false;
  }

  function BindHandlersOnLoad() {
    BindPrintButton(
      "#btnPrint1",
      "#divStatusReportRespones",
      "QA Response Status Report"
    );
    //////////Note: for the export to work, make sure this is added to the html: <iframe id="CsvExpFrame" style="display: none"></iframe>
    BindExportButton(
      ".export1",
      "QAResponseStatusReport_",
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
    _myViewModel.tabs.selectTab(_myViewModel.tabOpts.ResponseDetail);

    if (response) {
      response = m_bigMap["response-" + response];

      var requestStatus = response.request.status;
      var responseStatus = response.resStatus;
      if (
        (responseStatus == "4-Approved for QA" ||
          responseStatus == "6-Reposted After Rejection") &&
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
    Load: m_fnLoadData,
    IsTransactionExecuting: function () {
      return m_bIsTransactionExecuting;
    },
    GoToResponse: GoToResponse,
    GetCancelReason: function () {
      m_RejectReason = $("#txtRejectReason").val();
      if ($.trim(m_RejectReason) == "")
        $("#btnClientOk1").attr("disabled", "disabled");
      else $("#btnClientOk1").removeAttr("disabled");
      return m_RejectReason;
    },
  };

  return publicMembers;
};
