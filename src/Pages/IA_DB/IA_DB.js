import { InitSal } from "../../infrastructure/SAL.js";
import { appContext } from "../../infrastructure/ApplicationDbContext.js";
import { TabsModule, Tab } from "../../components/Tabs/TabsModule.js";
import { setUrlParam } from "../../common/Router.js";
import { CommentChainModuleDeprecated } from "../../components/CommentChain/CommentChainModule.js";
import { ActiveViewersModuleDeprecated } from "../../components/ActiveViewers/ActiveViewersModule.js";

import * as ModalDialog from "../../infrastructure/ModalDialog.js";
import * as FormManager from "../../services/FormManager.js";

import { AuditRequest } from "../../entities/AuditRequest.js";
import { NewRequestFormComponent } from "../../components/Forms/Request/NewForm/NewRequestForm.js";
import { RequestDetailView } from "../../components/RequestDetailView/RequestDetailView.js";
import { EditRequestForm } from "../../components/Forms/Request/EditForm/EditRequestForm.js";
import { EditCoverSheetForm } from "../../components/Forms/CoverSheet/EditForm/EditCoversheetForm.js";
import { AuditResponse } from "../../entities/AuditResponse.js";
import { NewResponseForm } from "../../components/Forms/Response/NewForm/NewResponseForm.js";
import { EditResponseForm } from "../../components/Forms/Response/EditForm/EditResponseForm.js";
import { EditResponseDocForm } from "../../components/Forms/ResponseDoc/EditForm/EditResponseDocForm.js";

import {
  m_fnGetNewResponseDocTitle,
  m_fnBreakRequestPermissions,
  m_fnBreakCoversheetPermissions,
  m_fnBreakResponseAndFolderPermissions,
  notifyQAApprovalPending,
  mapResponseDocs,
} from "./IA_DB_Services.js";

var Audit = window.Audit || {};
Audit.IAReport = Audit.IAReport || {};

const requestParam = "ReqNum";
const responseParam = "ResNum";

$(document).ready(function () {
  SP.SOD.executeFunc(
    "sp.js",
    "SP.ClientContext",
    ExecuteOrDelayUntilScriptLoaded(InitReport, "sp.js")
  );
});

async function InitReport() {
  /*********NOTE: the Contribute permission level needs to have manage permissions turned on ************/

  await InitSal();

  Audit.IAReport.Report = new Audit.IAReport.NewReportPage();
  Audit.IAReport.Init();
}

Audit.IAReport.Init = function () {
  function SetTimer() {
    var intervalRefreshID = setInterval(function () {
      var divVal = $("#divCounter").text();
      var count = divVal * 1 - 1;
      $("#divCounter").text(count);
      if (count <= 0) {
        if (!Audit.IAReport.Report.IsTransactionExecuting())
          Audit.IAReport.Report.Refresh();
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

Audit.IAReport.NewReportPage = function () {
  // Keep this for legacy reasons
  _myViewModel = new ViewModel();
  ko.applyBindings(_myViewModel);

  LoadInfo();

  var publicMembers = {
    Load: m_fnLoadData,
    ViewPermissions: m_fnViewPermissions,
    ViewLateRequests: m_fnViewLateRequests,
    ViewResponseDocsToday: m_fnViewResponseDocsToday,
    ViewReturnedDocs: m_fnViewReturnedDocs,
    GoToRequest: function (requestNum, responseTitle) {
      m_fnGoToRequest(requestNum, responseTitle);
    },
    IsTransactionExecuting: function () {
      return m_bIsTransactionExecuting;
    },
    Refresh: m_fnRefresh,
    CreateInternalRequestItem: m_fnCreateRequestInternalItem,
  };

  return publicMembers;
};

var m_libCoverSheetLibraryGUID = null; //set below
var m_libRequestDocsLibraryGUID = null; //set below
var m_libResponseDocsLibraryGUID = null; //set below

var m_coversheetDocsLibrary = null;
var m_requestDocsLibrary = null;
var m_responseDocsLibrary = null;

var m_bigMap = new Object();
var m_arrRequests = new Array();
var m_arrRequestsToClose = new Array();
var m_arrPermissionsResponseFolders = new Array();

var m_requestItems = null;
var m_requestInternalItems = null;

var m_responseItems = null;
var m_ResponseDocsItems = null;
var m_ResponseDocsFoldersItems = null;

var m_groupColl = null;
var m_aoItems = null;
var m_userPermissionAccess = null;
var m_PageItems = null;

var m_itemID = null;
var m_requestNum = null;
var m_responseTitle = null;
var m_responseStatus = null;

var m_bIsTransactionExecuting = false;
var m_statusId = null;
var notifyId = null;

var m_bIsSiteOwner = true;
var m_sGoToResponseTitle = null;

var m_oRequestTitleAndDocCount = new Object();
var m_oResponseTitleAndDocCount = new Object();

var m_sResponseStatusToFilterOn = "1-Open";
var m_sRequestStatusToFilterOn = "Open";
var _myViewModel = null;

function ViewModel() {
  var self = this;

  self.refresh = () => window.location.reload();

  self.debugMode = ko.observable(false);
  self.siteUrl = Audit.Common.Utilities.GetSiteUrl();

  //cant add rate limit because it'll affect the refresh
  //self.arrResponses = ko.observableArray( null ).extend({ rateLimit: 500 });
  self.arrRequests = ko.observableArray(null);
  self.arrResponses = ko.observableArray(null);
  self.arrFilteredRequestsCount = ko.observable(0);
  self.arrFilteredResponsesCount = ko.observable(0);
  self.cntPendingReview = ko.observable(0);

  /* alerts */
  self.arrRequestsThatNeedClosing = ko.observableArray(null);
  self.arrResponseDocsCheckedOut = ko.observableArray(null);
  self.arrResponsesSubmittedByAO = ko.observableArray(null);
  self.arrRequestsInternalAlmostDue = ko.observableArray(null);
  self.arrRequestsInternalPastDue = ko.observableArray(null);
  self.arrRequestsAlmostDue = ko.observableArray(null);
  self.arrRequestsPastDue = ko.observableArray(null);
  self.arrRequestsWithNoResponses = ko.observableArray(null);
  self.arrRequestsWithNoEmailSent = ko.observableArray(null);
  self.arrResponsesSubmittedByAO = ko.observableArray(null);

  /* request tab */
  self.ddOptionsRequestTabRequestID = ko.observableArray();
  self.ddOptionsRequestTabRequestStatus = ko.observableArray();
  self.ddOptionsRequestTabRequestSensitivity = ko.observableArray();
  self.ddOptionsRequestTabRequestInternalDueDate = ko.observableArray();
  self.ddOptionsRequestTabRequestDueDate = ko.observableArray();
  self.ddOptionsRequestTabRequestSample = ko.observableArray();
  self.ddOptionsRequestTabRequestSentEmail = ko.observableArray();
  self.ddOptionsRequestTabRequestAO = ko.observableArray();
  self.filterRequestTabRequestID = ko.observable();
  self.filterRequestTabRequestStatus = ko.observable();
  self.filterRequestTabRequestSensitivity = ko.observable();
  self.filterRequestTabRequestInternalDueDate = ko.observable();
  self.filterRequestTabRequestDueDate = ko.observable();
  self.filterRequestTabRequestSample = ko.observable();
  self.filterRequestTabRequestSentEmail = ko.observable();
  self.filterRequestTabRequestAO = ko.observable();

  /* response tab */
  self.ddOptionsResponseTabRequestID = ko.observableArray();
  self.ddOptionsResponseTabRequestStatus = ko.observableArray();
  self.ddOptionsResponseTabRequestInternalDueDate = ko.observableArray();
  self.ddOptionsResponseTabRequestSample = ko.observableArray();
  self.ddOptionsResponseTabResponseTitle = ko.observableArray();
  self.ddOptionsResponseTabResponseStatus = ko.observableArray();
  self.ddOptionsResponseTabResponseAO = ko.observableArray();
  self.ddOptionsResponseTabResponseModified = ko.observableArray();
  self.filterResponseTabRequestID = ko.observable();
  self.filterResponseTabSampleNum = ko.observable();
  self.filterResponseTabRequestIntDueDate = ko.observable();
  self.filterResponseTabResponseName = ko.observable();
  self.filterResponseTabResponseStatus = ko.observable();
  self.filterResponseTabResponseAO = ko.observable();
  self.filterResponseTabResponseModified = ko.observable();
  self.doSort = ko.observable(false).extend({ rateLimit: 1000 });

  self.ddOptionsRequestInfoTabRequestName = ko.observableArray();
  self.filterRequestInfoTabRequestName = ko.observableArray();

  self.currentRequest = ko.observable();
  self.arrCurrentRequestRequestDocs = ko.observableArray(null);
  self.arrCurrentRequestCoverSheets = ko.observableArray(null);
  self.arrCurrentRequestResponses = ko.observableArray(null);
  self.arrCurrentRequestResponseDocs = ko.observableArray(null);
  self.cntResponseDocs = ko.observable(0);
  self.bDisplayClose = ko.observable(false);

  self.showUpload = ko.observable(false);
  self.showSubmit = ko.observable(false);

  self.selectedFiltersRequestTab = ko.computed(function () {
    var requestID = self.filterRequestTabRequestID();
    var requestStatus = self.filterRequestTabRequestStatus();
    var requestSensitivity = self.filterRequestTabRequestSensitivity();
    var requestIntDueDate = self.filterRequestTabRequestInternalDueDate();
    var requestDueDate = self.filterRequestTabRequestDueDate();
    var requestSample = self.filterRequestTabRequestSample();
    var requestSentEmail = self.filterRequestTabRequestSentEmail();
    var requestAO = self.filterRequestTabRequestAO();

    return (
      requestID +
      " " +
      requestStatus +
      " " +
      requestSensitivity +
      " " +
      requestIntDueDate +
      " " +
      requestDueDate +
      " " +
      requestSample +
      " " +
      requestSentEmail +
      " " +
      requestAO
    );
  });

  self.selectedFiltersResponseTab = ko.computed(function () {
    var requestID = self.filterResponseTabRequestID();
    var sampleNum = self.filterResponseTabSampleNum();
    var responseName = self.filterResponseTabResponseName();
    var requestIntDueDate = self.filterResponseTabRequestIntDueDate();
    var responseStatus = self.filterResponseTabResponseStatus();
    var responseAO = self.filterResponseTabResponseAO();
    var responseModified = self.filterResponseTabResponseModified();

    return (
      requestID +
      " " +
      sampleNum +
      " " +
      responseName +
      " " +
      requestIntDueDate +
      " " +
      responseStatus +
      " " +
      responseAO +
      " " +
      responseModified
    );
  });

  self.currentDialog = ModalDialog.currentDialog;

  self.tabOpts = {
    Requests: new Tab("request-report", "Request Status Report", {
      id: "requestStatusReportTemplate",
      data: self,
    }),
    Responses: new Tab("response-report", "Response Status Report", {
      id: "responseStatusReportTemplate",
      data: self,
    }),
    // RequestDetail: new Tab("request-detail-dep", "Request Information", {
    //   id: "requestDetailTemplateDeprecated",
    //   data: self,
    // }),
    RequestDetail: new Tab("request-detail", "Request Information (V2)", {
      id: "requestDetailTemplate",
      data: self,
    }),
    // NewRequest: new Tab("new-request", "New Request", {
    //   id: "newRequestTemplate",
    //   data: new NewRequestFormComponent({
    //     onComplete: OnCallbackFormNewRequest,
    //   }),
    // }),
  };

  self.tabs = new TabsModule(Object.values(self.tabOpts));

  /** Behaviors **/

  self.ClearFiltersRequestTab = function () {
    self.filterRequestTabRequestID("");
    self.filterRequestTabRequestStatus("");
    self.filterRequestTabRequestSensitivity("");
    self.filterRequestTabRequestInternalDueDate("");
    self.filterRequestTabRequestDueDate("");
    self.filterRequestTabRequestSample("");
    self.filterRequestTabRequestSentEmail("");
    self.filterRequestTabRequestAO("");
  };

  self.ClearFiltersResponseTab = function () {
    self.filterResponseTabRequestID("");
    self.filterResponseTabSampleNum("");
    self.filterResponseTabResponseName("");
    self.filterResponseTabRequestIntDueDate("");
    self.filterResponseTabResponseStatus("");
    self.filterResponseTabResponseAO("");
    self.filterResponseTabResponseModified("");
  };

  self.FilterChangedRequestTab = function () {
    //	console.log("filter changed");
    setTimeout(function () {
      const timerStart = new Date();

      var requestID = self.filterRequestTabRequestID();
      var requestStatus = self.filterRequestTabRequestStatus();
      var requestSensitivity = self.filterRequestTabRequestSensitivity();
      var requestIntDueDate = self.filterRequestTabRequestInternalDueDate();
      var requestDueDate = self.filterRequestTabRequestDueDate();
      var requestSample = self.filterRequestTabRequestSample();
      var requestSentEmail = self.filterRequestTabRequestSentEmail();
      var requestAO = self.filterRequestTabRequestAO();

      if (
        !requestID &&
        !requestStatus &&
        !requestSensitivity &&
        !requestIntDueDate &&
        !requestDueDate &&
        !requestSample &&
        !requestSentEmail &&
        !requestAO
      ) {
        $(".sr1-request-item").show();

        self.arrFilteredRequestsCount(self.arrRequests().length);

        //SP.UI.Notify.removeNotification( notifyId );
        return;
      }

      requestID = !requestID ? "" : requestID;
      requestStatus = !requestStatus ? "" : requestStatus;
      requestSensitivity = !requestSensitivity ? "" : requestSensitivity;
      requestIntDueDate = !requestIntDueDate ? "" : requestIntDueDate;
      requestDueDate = !requestDueDate ? "" : requestDueDate;
      requestSample = !requestSample ? "" : requestSample.toString();
      requestSentEmail = !requestSentEmail ? "" : requestSentEmail.toString();
      requestAO = !requestAO ? "" : requestAO;

      var count = 0;
      var eacher = $(".sr1-request-item");
      eacher.each(function () {
        var hide = false;

        if (
          !hide &&
          requestID != "" &&
          $.trim($(this).find(".sr1-request-requestNum").text()) != requestID
        )
          hide = true;
        if (
          !hide &&
          requestStatus != "" &&
          $.trim($(this).find(".sr1-request-status").text()).indexOf(
            requestStatus
          ) < 0
        )
          hide = true;
        if (
          !hide &&
          requestSensitivity != "" &&
          $.trim($(this).find(".sr1-request-sensitivity").text()).indexOf(
            requestSensitivity
          ) < 0
        )
          hide = true;
        if (
          !hide &&
          requestIntDueDate != "" &&
          $.trim($(this).find(".sr1-request-internalDueDate").text()) !=
            requestIntDueDate
        )
          hide = true;
        if (
          !hide &&
          requestDueDate != "" &&
          $.trim($(this).find(".sr1-request-dueDate").text()) != requestDueDate
        )
          hide = true;
        if (
          !hide &&
          requestSample != "" &&
          $.trim($(this).find(".sr1-request-sample").text()) != requestSample
        )
          hide = true;
        if (
          !hide &&
          requestSentEmail != "" &&
          $.trim($(this).find(".sr1-request-sentEmail").text()) !=
            requestSentEmail
        )
          hide = true;
        if (!hide && requestAO != "") {
          var bFound = false;
          $(this)
            .find(".sr1-request-actionOffice-item")
            .each(function () {
              if ($(this).text() == requestAO) {
                bFound = true;
                return;
              }
            });
          if (!bFound) hide = true;
        }

        if (hide) $(this).hide();
        else {
          $(this).show();
          count++;
        }
      });

      self.arrFilteredRequestsCount(count);
      console.log("Requests Filtered in: ", (new Date() - timerStart) / 1000);
    }, 100);
  };

  self.FilterChangedResponseTab = function () {
    document.body.style.cursor = "wait";
    setTimeout(function () {
      const timerStart = new Date();
      var requestID = self.filterResponseTabRequestID();
      var sampleNum = self.filterResponseTabSampleNum();
      var responseName = self.filterResponseTabResponseName();
      var requestIntDueDate = self.filterResponseTabRequestIntDueDate();
      var responseStatus = self.filterResponseTabResponseStatus();
      var responseAO = self.filterResponseTabResponseAO();
      var responseModified = self.filterResponseTabResponseModified();

      if (
        !requestID &&
        !sampleNum &&
        !responseName &&
        !requestIntDueDate &&
        !responseStatus &&
        !responseAO &&
        !responseModified
      ) {
        $(".sr2-response-item").show();
        self.arrFilteredResponsesCount(self.arrResponses().length);
        document.body.style.cursor = "default";
        return;
      }

      requestID = !requestID ? "" : requestID;
      sampleNum = !sampleNum ? "" : sampleNum;
      responseName = !responseName ? "" : responseName;
      requestIntDueDate = !requestIntDueDate ? "" : requestIntDueDate;
      responseStatus = !responseStatus ? "" : responseStatus;
      responseAO = !responseAO ? "" : responseAO;
      responseModified = !responseModified ? "" : responseModified;

      var count = 0;
      var eacher = $(".sr2-response-item");
      eacher.each(function () {
        var hide = false;

        if (
          !hide &&
          requestID != "" &&
          $.trim($(this).find(".sr2-response-requestNum").text()) != requestID
        )
          hide = true;
        if (
          !hide &&
          sampleNum != "" &&
          $.trim($(this).find(".sr2-response-sample").text()) != sampleNum
        )
          hide = true;
        if (
          !hide &&
          responseName != "" &&
          $.trim($(this).find(".sr2-response-title").text()) != responseName
        )
          hide = true;
        if (
          !hide &&
          requestIntDueDate != "" &&
          $.trim($(this).find(".sr2-response-internalDueDate").text()) !=
            requestIntDueDate
        )
          hide = true;
        if (
          !hide &&
          responseStatus != "" &&
          $.trim($(this).find(".sr2-response-status").text()) != responseStatus
        )
          hide = true;
        if (
          !hide &&
          responseAO != "" &&
          $.trim($(this).find(".sr2-response-ao").text()) != responseAO
        )
          hide = true;
        if (!hide && responseModified != "") {
          var curDate = new Date();
          var responseModifiedDate = $(this)
            .find(".sr2-response-modified")
            .text();

          if (responseModified == "Last 7 Days") {
            var modifiedDate = new Date(responseModifiedDate);
            curDate.setDate(curDate.getDate() - 7);
            if (curDate > modifiedDate) hide = true;
          } else if (responseModified == "This Month") {
            var modifiedDate = new Date(responseModifiedDate);
            curDate.setDate(1);
            if (curDate > modifiedDate) hide = true;
          } else if (responseModified == "This Quarter") {
            var modifiedDate = new Date(responseModifiedDate);

            if (modifiedDate.getFullYear() != curDate.getFullYear()) {
              hide = true;
            } else {
              var modifiedMonth = modifiedDate.getMonth();
              var curMonth = curDate.getMonth();

              if (curMonth == 0 || curMonth == 1 || curMonth == 2) {
                if (
                  modifiedMonth != 0 &&
                  modifiedMonth != 1 &&
                  modifiedMonth != 2
                )
                  hide = true;
              } else if (curMonth == 3 || curMonth == 4 || curMonth == 5) {
                if (
                  modifiedMonth != 3 &&
                  modifiedMonth != 4 &&
                  modifiedMonth != 5
                )
                  hide = true;
              } else if (curMonth == 6 || curMonth == 7 || curMonth == 8) {
                if (
                  modifiedMonth != 6 &&
                  modifiedMonth != 7 &&
                  modifiedMonth != 8
                )
                  hide = true;
              } else if (curMonth == 9 || curMonth == 10 || curMonth == 11) {
                if (
                  modifiedMonth != 9 &&
                  modifiedMonth != 10 &&
                  modifiedMonth != 11
                )
                  hide = true;
              }
            }
          } else if ($.trim(responseModifiedDate).indexOf(responseModified) < 0)
            hide = true;
        }

        if (hide) $(this).hide();
        else {
          $(this).show();
          count++;
        }
      });

      self.arrFilteredResponsesCount(count);
      document.body.style.cursor = "default";
      console.log("Responses Filtered in: ", (new Date() - timerStart) / 1000);
    }, 200);
  };

  self.ClickNewRequest = () => {
    m_fnCreateRequest();
  };

  self.ClickBulkAddRequest = () => {
    m_fnBulkAddRequest();
  };

  self.ClickGoToRequest = function (oRequest) {
    if (oRequest && oRequest.number) m_fnGoToRequest(oRequest.number);
  };

  self.ClickViewRequest = function () {
    var oRequest = self.currentRequest();
    if (oRequest && oRequest.ID) m_fnViewRequest(oRequest.ID);
  };

  self.ClickEditRequest = function () {
    var oRequest = self.currentRequest();
    if (oRequest && oRequest.number)
      m_fnEditRequest(oRequest.ID, oRequest.number);
  };

  self.ClickViewRequestDoc = function (oRD) {
    if (oRD && oRD.ID) m_fnViewRequestDoc(oRD.ID);
  };

  self.ClickEditRequestDoc = function (oRD) {
    var oRequest = self.currentRequest();
    if (oRD && oRD.ID && oRequest && oRequest.number)
      m_fnEditRequestDoc(oRD.ID, oRequest.number);
  };

  self.ClickViewCoversheet = function (oCS) {
    if (oCS && oCS.ID) m_fnViewCoverSheet(oCS.ID);
  };

  self.ClickEditCoversheet = function (oCS) {
    var oRequest = self.currentRequest();
    if (oCS && oCS.ID && oRequest && oRequest.number)
      m_fnEditCoverSheet(oCS.ID, oRequest.number);
  };

  self.ClickCloseRequest = function () {
    m_fnCloseRequest();
  };

  self.ClickGrantSpecialPermissions = function () {
    var oRequest = self.currentRequest();
    if (oRequest && oRequest.number)
      m_fnGrantSpecialPermissions(oRequest.number);
  };

  self.ClickRemoveSpecialPermissions = function () {
    var oRequest = self.currentRequest();
    if (oRequest && oRequest.number)
      m_fnRemoveSpecialPermissions(oRequest.number);
  };

  self.ClickUploadRequestDoc = function () {
    var oRequest = self.currentRequest();
    if (oRequest && oRequest.number) m_fnUploadRequestDoc(oRequest.number);
  };

  self.ClickSendEmail = function () {
    var oRequest = self.currentRequest();
    if (oRequest && oRequest.ID) m_fnSendEmail(oRequest.ID);
  };

  self.ClickViewEmailHistoryFolder = function () {
    var oRequest = self.currentRequest();
    if (oRequest && oRequest.number)
      m_fnViewEmailHistoryFolder(oRequest.number);
  };

  self.ClickSyncEmailActionOffices = function () {
    var oRequest = self.currentRequest();
    if (oRequest && oRequest.ID) m_fnSyncEmailActionOffices(oRequest.ID);
  };

  self.ClickViewResponse = function (oResponse) {
    var oRequest = self.currentRequest();
    if (oRequest && oRequest.number && oResponse)
      m_fnViewResponse(
        oRequest.number,
        oResponse.ID,
        oResponse.title,
        oResponse.resStatus
      );
  };

  self.ClickEditResponse = function (oResponse) {
    var oRequest = self.currentRequest();
    if (oRequest && oRequest.number && oResponse)
      m_fnEditResponse(
        oRequest.number,
        oResponse.ID,
        oResponse.title,
        oResponse.resStatus
      );
  };

  self.ClickReviewingResponse = function (oResponse) {
    var oRequest = self.currentRequest();
    if (oRequest && oRequest.number && oResponse)
      m_fnReviewingResponse(oResponse.activeViewers);
  };

  self.ClickReOpenResponse = function (oResponse) {
    var oRequest = self.currentRequest();
    if (oRequest && oRequest.number && oResponse)
      m_fnReOpenResponse(oRequest.number, oResponse.title);
  };

  self.ClickAddResponse = function () {
    var oRequest = self.currentRequest();
    if (oRequest && oRequest.number)
      m_fnAddResponse(oRequest.ID, oRequest.number);
  };

  self.ClickBulkAddResponse = function () {
    var oRequest = self.currentRequest();
    if (oRequest && oRequest.number) m_fnBulkAddResponse(oRequest.number);
  };

  self.ClickBulkEditResponse = function () {
    var oRequest = self.currentRequest();
    if (oRequest && oRequest.number) m_fnBulkEditResponse(oRequest.number);
  };

  self.ClickCheckInResponseDocument = function (oResponseDoc) {
    if (oResponseDoc && oResponseDoc.folder && oResponseDoc.fileName)
      m_fnCheckInResponseDoc(oResponseDoc.folder, oResponseDoc.fileName);
  };

  self.ClickViewResponseDocFolder = function (oResponse) {
    if (oResponse && oResponse.title)
      m_fnViewResponseDocFolder(oResponse.title);
  };

  self.ClickViewResponseDoc = function (oResponseDoc) {
    if (oResponseDoc && oResponseDoc.requestID && oResponseDoc.responseTitle)
      m_fnViewResponseDoc(
        oResponseDoc.ID,
        oResponseDoc.requestID,
        oResponseDoc.responseTitle
      );
  };

  self.ClickEditResponseDoc = function (oResponseDoc) {
    if (oResponseDoc && oResponseDoc.requestID && oResponseDoc.responseTitle)
      m_fnEditResponseDoc(
        oResponseDoc.ID,
        oResponseDoc.requestID,
        oResponseDoc.responseTitle
      );
  };

  self.ClickDeleteResponseDoc = function (oResponseDoc) {
    if (oResponseDoc && oResponseDoc.ID) m_fnDeleteResponseDoc(oResponseDoc.ID);
  };

  self.ClickResendRejectedResponseDocToQA = function (oResponseDoc) {
    if (oResponseDoc && oResponseDoc.ID)
      m_fnResendRejectedResponseDocToQA(oResponseDoc.ID);
  };

  self.requestDetailViewComponent = new RequestDetailView(self);

  /** Subscriptions **/

  self.selectedFiltersRequestTab.subscribe(function (value) {
    self.FilterChangedRequestTab();
  });

  self.selectedFiltersResponseTab.subscribe(function (value) {
    self.FilterChangedResponseTab();
  });

  self.doSort.subscribe(function (newValue) {
    Audit.Common.Utilities.OnLoadDisplayTimeStamp();

    BindHandlersOnLoad();
    //alert("in dosort: " + self.arrResponses().length );
    if (self.arrRequests().length > 0 && newValue) {
      //should trigger only once
      self.arrFilteredRequestsCount(self.arrRequests().length);
      self.arrFilteredResponsesCount(self.arrResponses().length);

      //tab1
      ko.utils.arrayPushAll(
        self.ddOptionsRequestTabRequestID(),
        self.GetDDVals({ type: 0, field: "reqNumber" })
      );
      self.ddOptionsRequestTabRequestID.valueHasMutated();

      ko.utils.arrayPushAll(
        self.ddOptionsRequestTabRequestStatus(),
        self.GetDDVals({ type: 0, field: "status" })
      );
      self.ddOptionsRequestTabRequestStatus.valueHasMutated();

      ko.utils.arrayPushAll(
        self.ddOptionsRequestTabRequestInternalDueDate(),
        self.GetDDVals({ type: 0, field: "internalDueDate" })
      );
      self.ddOptionsRequestTabRequestInternalDueDate.valueHasMutated();

      ko.utils.arrayPushAll(
        self.ddOptionsRequestTabRequestSensitivity(),
        self.GetDDVals({ type: 0, field: "sensitivity" })
      );
      self.ddOptionsRequestTabRequestSensitivity.valueHasMutated();

      ko.utils.arrayPushAll(
        self.ddOptionsRequestTabRequestDueDate(),
        self.GetDDVals({ type: 0, field: "dueDate" })
      );
      self.ddOptionsRequestTabRequestDueDate.valueHasMutated();

      ko.utils.arrayPushAll(
        self.ddOptionsRequestTabRequestSample(),
        self.GetDDVals({ type: 0, field: "sample" })
      );
      self.ddOptionsRequestTabRequestSample.valueHasMutated();

      ko.utils.arrayPushAll(
        self.ddOptionsRequestTabRequestSentEmail(),
        self.GetDDVals({ type: 0, field: "sentEmail" })
      );
      self.ddOptionsRequestTabRequestSentEmail.valueHasMutated();

      ko.utils.arrayPushAll(
        self.ddOptionsRequestTabRequestAO(),
        self.GetDDVals({ type: 0, field: "actionOffices", isArr: true })
      );
      self.ddOptionsRequestTabRequestAO.valueHasMutated();

      //tab 2
      ko.utils.arrayPushAll(
        self.ddOptionsResponseTabRequestID(),
        self.GetDDVals({ type: 1, field: "reqNumber" })
      );
      self.ddOptionsResponseTabRequestID.valueHasMutated();

      ko.utils.arrayPushAll(
        self.ddOptionsResponseTabRequestSample(),
        self.GetDDVals({ type: 1, field: "sample" })
      );
      self.ddOptionsResponseTabRequestSample.valueHasMutated();

      ko.utils.arrayPushAll(
        self.ddOptionsResponseTabResponseTitle(),
        self.GetDDVals({ type: 1, field: "title", sort: true })
      );
      self.ddOptionsResponseTabResponseTitle.valueHasMutated();

      ko.utils.arrayPushAll(
        self.ddOptionsResponseTabRequestInternalDueDate(),
        self.GetDDVals({ type: 1, field: "internalDueDate" })
      );
      self.ddOptionsResponseTabRequestInternalDueDate.valueHasMutated();

      ko.utils.arrayPushAll(
        self.ddOptionsResponseTabResponseStatus(),
        self.GetDDVals({ type: 1, field: "status" })
      );
      self.ddOptionsResponseTabResponseStatus.valueHasMutated();

      ko.utils.arrayPushAll(
        self.ddOptionsResponseTabResponseAO(),
        self.GetDDVals({ type: 1, field: "ao" })
      );
      self.ddOptionsResponseTabResponseAO.valueHasMutated();

      //tab 3
      ko.utils.arrayPushAll(
        self.ddOptionsRequestInfoTabRequestName(),
        self.GetDDVals({ type: 0, field: "reqNumber" })
      );
      self.ddOptionsRequestInfoTabRequestName.valueHasMutated();

      var tempArrModifed = new Array();
      tempArrModifed.push("Last 7 Days");
      tempArrModifed.push("This Month");
      tempArrModifed.push("This Quarter");
      ko.utils.arrayPushAll(
        self.ddOptionsResponseTabResponseModified(),
        tempArrModifed
      );
      ko.utils.arrayPushAll(
        self.ddOptionsResponseTabResponseModified(),
        self.GetDDVals({ type: 1, field: "modified", isDate: true })
      );
      self.ddOptionsResponseTabResponseModified.valueHasMutated();

      setTimeout(function () {
        var paramTabIndex = GetUrlKeyValue("Tab");
        var paramRequestNum = GetUrlKeyValue("ReqNum");
        var paramResNum = GetUrlKeyValue("ResNum");

        if (paramTabIndex != null && paramTabIndex != "") {
          self.tabs.selectById(paramTabIndex);
        } else {
          self.tabs.selectTab(self.tabOpts.Requests);
        }

        if (paramRequestNum != null && paramRequestNum != "") {
          if (paramTabIndex == self.tabOpts.Responses.id)
            self.filterRequestTabRequestID(paramRequestNum);
          //if (paramTabIndex == self.tabOpts.RequestDetail.id)
          else self.filterRequestInfoTabRequestName(paramRequestNum);
        }
        /**Note: on the jsrender of the request/response tables, I set the rows to display none; the filters below show the rows I want **/
        self.filterRequestTabRequestStatus(m_sRequestStatusToFilterOn);

        if (
          paramResNum != null &&
          paramResNum != "" &&
          paramTabIndex == self.tabOpts.Responses.id
        ) {
          self.filterResponseTabResponseName(paramResNum);
        } else if (
          paramTabIndex != self.tabOpts.Responses.id ||
          (paramTabIndex == self.tabOpts.Responses.id &&
            (paramResNum == null || paramResNum == ""))
        )
          //dont filter here because IA has received a link to the response and we don't want the status to be filtered
          self.filterResponseTabResponseStatus(m_sResponseStatusToFilterOn);

        //$( "#tblStatusReportResponses" ).trigger("update");
        $("#tblStatusReportRequests").tablesorter({
          sortList: [[4, 0]],
          //showProcessing: true,
          selectorHeaders: ".sorter-true",
        });

        if (self.arrResponses().length > 0) {
          $("#tblStatusReportResponses").tablesorter({
            sortList: [[0, 0]],
            //showProcessing: true,
            selectorHeaders: ".sorter-true",
          });
        }
      }, 200);
    }
  });

  var requestUnloadEventHandler = function (oRequest) {
    return function (event) {
      // console.log("unloading", oRequest);
      oRequest.activeViewers.removeCurrentuser();
    };
  };
  var currentEventHandler;
  /* 3rd tab */
  // Before Change
  self.filterRequestInfoTabRequestName.subscribe(
    function (oldValue) {
      var oRequest = m_bigMap["request-" + oldValue];
      if (oRequest && oRequest.activeViewers) {
        oRequest.activeViewers.removeCurrentuser();
        window.removeEventListener("beforeunload", currentEventHandler);
      }
    },
    null,
    "beforeChange"
  );

  // After Change
  self.filterRequestInfoTabRequestName.subscribe(function (newValue) {
    self.currentRequest(null);
    self.arrCurrentRequestRequestDocs([]);
    self.arrCurrentRequestCoverSheets([]);
    self.arrCurrentRequestResponses([]);
    self.arrCurrentRequestResponseDocs([]);
    self.cntResponseDocs(0);
    self.bDisplayClose(false);

    self.currentRequest.valueHasMutated();
    self.arrCurrentRequestRequestDocs.valueHasMutated();
    self.arrCurrentRequestCoverSheets.valueHasMutated();
    self.arrCurrentRequestResponses.valueHasMutated();
    self.arrCurrentRequestResponseDocs.valueHasMutated();
    self.cntResponseDocs.valueHasMutated();
    self.bDisplayClose.valueHasMutated();

    var oRequest = m_bigMap["request-" + newValue];
    if (oRequest) {
      if (oRequest.activeViewers) {
        oRequest.activeViewers.pushCurrentUser();
        currentEventHandler = requestUnloadEventHandler(oRequest);
        window.addEventListener("beforeunload", currentEventHandler);
      }
      m_fnRequeryRequest(oRequest);
    } else {
    }
  });

  window.addEventListener("popstate", (event) => {
    // Handle our window history state change.
    if (event.state && event.state[requestParam]) {
      self.filterRequestInfoTabRequestName(event.state[requestParam]);
    }
  });
  self.currentRequest.subscribe((request) => {
    if (request) setUrlParam(requestParam, request.number);
  });

  /**Other**/
  self.GetDDVals = function (oObjectProperties) {
    var arr = self.arrRequests();
    if (oObjectProperties.type == 1) arr = self.arrResponses();

    var fieldName = oObjectProperties.field;
    var types = ko.utils.arrayMap(arr, function (item) {
      if (oObjectProperties.isArr) {
        var fieldArr = item[fieldName];

        var arrToReturn = new Array();
        //var arrToReturn = "";
        for (var x = 0; x < fieldArr.length; x++) {
          arrToReturn.push(fieldArr[x].ao);
          //	arrToReturn += fieldArr[x].ao  + ","
        }
        return arrToReturn;
      } else if (oObjectProperties.isDate) return item[fieldName].split(" ")[0];
      else {
        if (item[fieldName] == null) return "";
        else return item[fieldName].toString();
      }
    });

    var ddArr = null;
    if (oObjectProperties.isArr) {
      var tempArr = new Array();
      for (var x = 0; x < types.length; x++) {
        if (types[x].length > 0) {
          for (var y = 0; y < types[x].length; y++) {
            tempArr.push(types[x][y]);
          }
        }
      }
      ddArr = ko.utils.arrayGetDistinctValues(tempArr).sort();
    } else ddArr = ko.utils.arrayGetDistinctValues(types).sort();
    if (oObjectProperties.sort)
      ddArr.sort(Audit.Common.Utilities.SortResponseTitles);

    if (ddArr[0] == "") ddArr.shift();

    return ddArr;
  };
}

function LoadInfo() {
  var currCtx = new SP.ClientContext.get_current();
  var web = currCtx.get_web();

  var requestList = web
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetListTitleRequests());
  var requestQuery = new SP.CamlQuery();
  requestQuery.set_viewXml(
    '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'
  );
  m_requestItems = requestList.getItems(requestQuery);
  //need to check permissions because of displaying special perms and granting special perms
  //currCtx.load( m_requestItems, 'Include(ID, Title, ReqSubject, ReqStatus, IsSample, ReqDueDate, InternalDueDate, ActionOffice, EmailActionOffice, Reviewer, Owner, ReceiptDate, MemoDate, RelatedAudit, ActionItems, Comments, EmailSent, ClosedDate, ClosedBy, Modified, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))');
  currCtx.load(
    m_requestItems,
    "Include(ID, Title, ReqSubject, ReqStatus, IsSample, ReqDueDate, InternalDueDate, ActionOffice, EmailActionOffice, Reviewer, Owner, ReceiptDate, MemoDate, RelatedAudit, ActionItems, Comments, EmailSent, ClosedDate, ClosedBy, Modified, Sensitivity)"
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
    "Include(ID, Title, ReqNum, InternalStatus, ActiveViewers)"
  );

  var responseList = web
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetListTitleResponses());
  var responseQuery = new SP.CamlQuery();
  responseQuery.set_viewXml(
    '<View><Query><OrderBy><FieldRef Name="ReqNum"/></OrderBy></Query></View>'
  );
  m_responseItems = responseList.getItems(responseQuery);
  //need to check permissions because of granting/removing special perms
  //currCtx.load( m_responseItems, 'Include(ID, Title, ReqNum, ActionOffice, ReturnReason, SampleNumber, ResStatus, Comments, Modified, ClosedDate, ClosedBy, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))' );
  currCtx.load(
    m_responseItems,
    "Include(ID, Title, ReqNum, ActionOffice, ReturnReason, SampleNumber, ResStatus, ActiveViewers, Comments, Modified, ClosedDate, ClosedBy, POC, POCCC)"
  );

  //make sure to only pull documents (fsobjtype = 0)
  var responseDocsLib = web
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
  var responseDocsQuery = new SP.CamlQuery();
  responseDocsQuery.set_viewXml(
    '<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="ReqNum"/><FieldRef Name="ResID"/></OrderBy><Where><Eq><FieldRef Name="ContentType"/><Value Type="Text">Document</Value></Eq></Where></Query></View>'
  );
  m_ResponseDocsItems = responseDocsLib.getItems(responseDocsQuery);
  currCtx.load(
    m_ResponseDocsItems,
    "Include(ID, Title, ReqNum, ResID, DocumentStatus, RejectReason, ReceiptDate, FileLeafRef, FileDirRef, File_x0020_Size, CheckoutUser, Modified, Editor, Created)"
  );

  m_groupColl = web.get_siteGroups();
  currCtx.load(m_groupColl);

  var aoList = web
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetListTitleActionOffices());
  var aoQuery = new SP.CamlQuery();
  aoQuery.set_viewXml(
    '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'
  );
  m_aoItems = aoList.getItems(aoQuery);
  currCtx.load(m_aoItems, "Include(ID, Title, UserGroup)");

  var ob = new SP.BasePermissions();
  ob.set(SP.PermissionKind.deleteListItems); //site owners and members should have this
  m_userPermissionAccess = web.doesUserHavePermissions(ob);

  currCtx.executeQueryAsync(OnSuccess, OnFailure);
  function OnSuccess(sender, args) {
    m_bIsSiteOwner = m_userPermissionAccess.get_value();
    //alert( m_bIsSiteOwner );

    if (m_bIsSiteOwner) {
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();

      //make sure to only pull documents (fsobjtype = 0)
      var pagesLib = web.get_lists().getByTitle("Pages");
      var pagesQuery = new SP.CamlQuery();
      pagesQuery.set_viewXml(
        '<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="FileLeafRef"/><Value Type="Text">AO_DB.aspx</Value></Eq></Where></Query></View>'
      );
      m_PageItems = pagesLib.getItems(pagesQuery);
      currCtx.load(
        m_PageItems,
        "Include(ID, Title, FileLeafRef, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
      );

      var emailList = web
        .get_lists()
        .getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory());
      var emailListQuery = new SP.CamlQuery();
      emailListQuery.set_viewXml(
        '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><And><Eq><FieldRef Name="Title"/><Value Type="Text">EANotifications</Value></Eq><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></And></Where></Query></View>'
      );
      var emailListFolderItemsEA = emailList.getItems(emailListQuery);
      currCtx.load(emailListFolderItemsEA, "Include(ID, Title, DisplayName)");

      function OnSuccessLoadPages(sender, args) {
        $("#divIA").show();
        //if they can iterate the pages and the permissions on the pages, we'll consider them a site owner
        m_fnLoadData();
        m_fnResetAODBPerms(m_PageItems);

        m_fnCheckForEAEmailFolder(emailListFolderItemsEA);
      }
      function OnFailureLoadPages(sender, args) {
        $("#divIA").show();
        m_fnLoadData();
      }
      currCtx.executeQueryAsync(OnSuccessLoadPages, OnFailureLoadPages);
    } else {
      $("#divIA").show();
      m_bIsSiteOwner = false;
      m_fnLoadData();
    }

    setTimeout(function () {
      m_fnLoadRemainder();
    }, 100);
  }
  function OnFailure(sender, args) {
    $("#divLoading").hide();
    const statusId = SP.UI.Status.addStatus(
      "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
    );
    SP.UI.Status.setStatusPriColor(statusId, "red");
    m_bIsSiteOwner = false;
  }
}

function m_fnRefresh(requestNumber) {
  window.location.reload();
}

function m_fnLoadData() {
  Audit.Common.Utilities.LoadSiteGroups(m_groupColl);
  Audit.Common.Utilities.LoadActionOffices(m_aoItems);

  LoadRequests();
  LoadResponses();
  LoadResponseDocs();
  LoadResponseCounts();

  DisplayRequestsThatShouldClose();

  LoadTabStatusReport1(m_arrRequests, "fbody1");
  LoadTabStatusReport2(m_arrRequests, "fbody2");
}

export function m_fnRequeryRequest(oRequest) {
  var currCtx = new SP.ClientContext.get_current();
  var web = currCtx.get_web();

  var requestList = web
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetListTitleRequests());
  var requestQuery = new SP.CamlQuery();
  requestQuery.set_viewXml(
    '<View><Query><Where><Eq><FieldRef Name="ID"/><Value Type="Text">' +
      oRequest.ID +
      "</Value></Eq></Where></Query></View>"
  );
  var m_aRequestItem = requestList.getItems(requestQuery);
  if (m_bIsSiteOwner) {
    $(".response-permissions").hide(); //resets this in case it was toggled to show
    currCtx.load(
      m_aRequestItem,
      "Include(ID, Title, ReqSubject, ReqStatus, IsSample, ReqDueDate, InternalDueDate, ActionOffice, EmailActionOffice, Reviewer, Owner, ReceiptDate, MemoDate, RelatedAudit, ActionItems, Comments, EmailSent, ClosedDate, ClosedBy, Modified, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
    );
  } else
    currCtx.load(
      m_aRequestItem,
      "Include(ID, Title, ReqSubject, ReqStatus, IsSample, ReqDueDate, InternalDueDate, ActionOffice, EmailActionOffice, Reviewer, Owner, ReceiptDate, MemoDate, RelatedAudit, ActionItems, Comments, EmailSent, ClosedDate, ClosedBy, Modified)"
    );

  async function OnSuccess(sender, args) {
    //Update the item field on the request
    var listItemEnumerator = m_aRequestItem.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      var oListItem = listItemEnumerator.get_current();
      oRequest.item = oListItem;
      break;
    }

    if (m_bIsSiteOwner) {
      //07/06/2017 - if the permissions on the request are inheriting for any reason, then reset the permissions and refresh the page
      if (!oRequest.item.get_hasUniqueRoleAssignments()) {
        const m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
          "Information",
          "Please wait... Updating Request permissions",
          200,
          400
        );
        await m_fnBreakRequestPermissions(oRequest.item, false);
        m_fnRefresh();
        return;
      } //07/06/2017 - ensure each action office has access to the request
      else {
        var bUpdateRequestPermissions = false;
        for (var x = 0; x < oRequest.actionOffices.length; x++) {
          var sActionOfficeGroupNameTitle = oRequest.actionOffices[x].ao;
          var sActionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName(
            sActionOfficeGroupNameTitle
          );
          if (
            sActionOfficeGroupName != null &&
            $.trim(sActionOfficeGroupName) != ""
          ) {
            var bAOHasAccess =
              Audit.Common.Utilities.CheckSPItemHasGroupPermission(
                oRequest.item,
                sActionOfficeGroupName,
                SP.PermissionKind.viewListItems
              );
            if (!bAOHasAccess) {
              bUpdateRequestPermissions = true;
              break;
            }
          }
        }

        if (bUpdateRequestPermissions) {
          const m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
            "Information",
            "Please wait... Updating Request permissions",
            200,
            400
          );
          await m_fnBreakRequestPermissions(oRequest.item, false);
          m_fnRefresh();
          return;
        }
      }
    }

    var match1 = false;
    var match2 = false;

    if (m_bIsSiteOwner) {
      var permissionsToCheck = SP.PermissionKind.viewListItems;
      match1 = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
        oRequest.item,
        Audit.Common.Utilities.GetGroupNameSpecialPerm1(),
        permissionsToCheck
      );
      match2 = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
        oRequest.item,
        Audit.Common.Utilities.GetGroupNameSpecialPerm2(),
        permissionsToCheck
      );

      if (match1 && match2) oRequest.specialPerms = true;
      else oRequest.specialPerms = false;
    }

    _myViewModel.currentRequest(oRequest);

    _myViewModel.bDisplayClose(false);
    if (m_arrRequestsToClose && m_arrRequestsToClose.length > 0) {
      for (var x = 0; x < m_arrRequestsToClose.length; x++) {
        var oIt = m_arrRequestsToClose[x];
        if (oIt.number == oRequest.number) {
          _myViewModel.bDisplayClose(true);
          break;
        }
      }
    }

    LoadTabRequestInfoRequestDocs(oRequest);
    LoadTabRequestInfoCoverSheets(oRequest);
    LoadTabRequestInfoResponses(oRequest); // This call LoadTabRequestInfoResponseDocs
  }
  function OnFailure(sender, args) {
    console.error("Unable to requery request: " + oRequest.number);
  }
  currCtx.executeQueryAsync(OnSuccess, OnFailure);
}

function RequestFinishedLoading() {
  var paramSection = GetUrlKeyValue("Sect");
  if (paramSection) {
    document.getElementById(paramSection)?.scrollIntoView(true);
  }
}

function m_fnLoadRemainder() {
  var currCtx = new SP.ClientContext.get_current();
  var web = currCtx.get_web();

  m_coversheetDocsLibrary = currCtx
    .get_web()
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetLibTitleCoverSheets());
  currCtx.load(m_coversheetDocsLibrary, "Title", "Id");

  m_requestDocsLibrary = currCtx
    .get_web()
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetLibTitleRequestDocs());
  currCtx.load(m_requestDocsLibrary, "Title", "Id");

  m_responseDocsLibrary = currCtx
    .get_web()
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
  currCtx.load(m_responseDocsLibrary, "Title", "Id");

  function OnSuccess(sender, args) {
    m_libResponseDocsLibraryGUID = m_responseDocsLibrary.get_id();
    m_libCoverSheetLibraryGUID = m_coversheetDocsLibrary.get_id();
    m_libRequestDocsLibraryGUID = m_requestDocsLibrary.get_id();
  }
  function OnFailure(sender, args) {
    const statusId = SP.UI.Status.addStatus(
      "Failed loading: " + args.get_message() + "\n" + args.get_stackTrace()
    );
    SP.UI.Status.setStatusPriColor(statusId, "red");
  }
  currCtx.executeQueryAsync(OnSuccess, OnFailure);
}

//always check ao permissions and reset them
function m_fnResetAODBPerms(pageItems) {
  var listItemEnumerator = pageItems.getEnumerator();
  while (listItemEnumerator.moveNext()) {
    var oListItem = listItemEnumerator.get_current();

    var bReset = false;

    if (!oListItem.get_hasUniqueRoleAssignments()) bReset = true;

    var arrAOs = Audit.Common.Utilities.GetActionOffices();

    if (!bReset) {
      // check to see if all action offices have access to the AO_DB.aspx page
      if (arrAOs != null) {
        for (var x = 0; x < arrAOs.length; x++) {
          var bFound = false;

          var actionOfficeGroup = arrAOs[x].userGroup;
          if (actionOfficeGroup != null && actionOfficeGroup != "") {
            var roleAssignments = oListItem.get_roleAssignments();
            var rolesEnumerator = roleAssignments.getEnumerator();
            while (rolesEnumerator.moveNext()) {
              var role = rolesEnumerator.get_current();
              var roleMember = role.get_member();
              var memeberLoginName = roleMember.get_loginName();
              var memberTitleName = roleMember.get_title();

              if (memberTitleName == actionOfficeGroup) bFound = true;
            }

            if (!bFound) {
              bReset = true;
              break;
            }
          }
        }
      }
    }

    if (bReset) {
      //if at least one doesnt have access, reset the permissions on that page
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();

      this.currentUser = web.get_currentUser();
      this.ownerGroup = web.get_associatedOwnerGroup();
      this.memberGroup = web.get_associatedMemberGroup();
      this.visitorGroup = web.get_associatedVisitorGroup();

      oListItem.resetRoleInheritance();
      oListItem.breakRoleInheritance(false, false);

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

      //add site associated groups
      oListItem
        .get_roleAssignments()
        .add(this.ownerGroup, roleDefBindingCollContribute);
      oListItem
        .get_roleAssignments()
        .add(this.memberGroup, roleDefBindingCollContribute);
      oListItem
        .get_roleAssignments()
        .add(this.visitorGroup, roleDefBindingCollRestrictedRead);

      oListItem
        .get_roleAssignments()
        .getByPrincipal(this.currentUser)
        .deleteObject();

      //Need to break up adding AOs because it exceeds the resource limit (request uses too many resources)
      function onUpdatAOPageSucceeded() {
        //add action offices
        if (arrAOs != null && arrAOs.length > 0) {
          for (var x = 0; x < arrAOs.length; x++) {
            var actionOfficeGroupName = arrAOs[x].userGroup;
            var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup(
              actionOfficeGroupName
            );

            if (actionOfficeGroup != null && actionOfficeGroup != "") {
              var roleDefBindingCollRestrictedRead =
                SP.RoleDefinitionBindingCollection.newObject(currCtx);
              roleDefBindingCollRestrictedRead.add(
                web.get_roleDefinitions().getByName("Restricted Read")
              );

              this.item
                .get_roleAssignments()
                .add(actionOfficeGroup, roleDefBindingCollRestrictedRead);

              function onUpdatAOPageSucceeded2() {}
              function onUpdatAOPageFailed2(sender, args) {
                //statusId = SP.UI.Status.addStatus("Request failed: "  + args.get_message() + "\n" + args.get_stackTrace());
              }
              currCtx.executeQueryAsync(
                Function.createDelegate(data, onUpdatAOPageSucceeded2),
                Function.createDelegate(data, onUpdatAOPageFailed2)
              );
            }
          }
        }
      }

      function onUpdatAOPageFailed(sender, args) {
        const statusId = SP.UI.Status.addStatus(
          "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
        );
      }

      var data = { item: oListItem };
      currCtx.executeQueryAsync(
        Function.createDelegate(data, onUpdatAOPageSucceeded),
        Function.createDelegate(data, onUpdatAOPageFailed)
      );
    }
    break;
  }
}

//always check
function m_fnCheckForEAEmailFolder(emailListFolderItemsEA) {
  var bFound = false;
  var listItemEnumerator = emailListFolderItemsEA.getEnumerator();
  while (listItemEnumerator.moveNext()) {
    var oListItem = listItemEnumerator.get_current();
    bFound = true;
    break;
  }

  if (!bFound) {
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    var emailList = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory());

    var itemCreateInfo = new SP.ListItemCreationInformation();
    itemCreateInfo.set_underlyingObjectType(SP.FileSystemObjectType.folder);
    itemCreateInfo.set_leafName("EANotifications");
    const oNewEmailFolder = emailList.addItem(itemCreateInfo);
    oNewEmailFolder.set_item("Title", "EANotifications");
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
      .add(this.ownerGroup, roleDefBindingCollAdmin);
    oNewEmailFolder
      .get_roleAssignments()
      .add(this.memberGroup, roleDefBindingCollContribute);
    oNewEmailFolder
      .get_roleAssignments()
      .add(this.visitorGroup, roleDefBindingCollRestrictedRead);

    var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup(
      Audit.Common.Utilities.GetGroupNameQA()
    );
    if (spGroupQA != null)
      oNewEmailFolder
        .get_roleAssignments()
        .add(spGroupQA, roleDefBindingCollRestrictedContribute);

    oNewEmailFolder
      .get_roleAssignments()
      .getByPrincipal(this.currentUser)
      .deleteObject();

    //Need to break up adding AOs because it exceeds the resource limit (request uses too many resources)
    function onUpdatePermsSucceeded() {
      //alert("done");
    }

    function onUpdatePermsFailed(sender, args) {
      const statusId = SP.UI.Status.addStatus(
        "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
      );
    }

    var data = {};
    currCtx.executeQueryAsync(
      Function.createDelegate(data, onUpdatePermsSucceeded),
      Function.createDelegate(data, onUpdatePermsFailed)
    );
  }
}

//QA doesnt have edit permissions rights on the response/response folder
//Therefore, when IA gets alerted that the response has been updated by QA, check if response status is updated
//and then update the permissions
async function m_fnCheckIfResponsePermissionsNeedUpdating(
  requestStatus,
  title,
  OnCompletedChecking
) {
  for (var x = 0; x < m_arrRequests.length; x++) {
    var oRequest = m_arrRequests[x];
    for (var y = 0; y < oRequest.responses.length; y++) {
      if (oRequest.responses[y].title == title) {
        var doneBreakingResponse = false;
        await m_fnBreakResponseAndFolderPermissions(
          requestStatus,
          oRequest.responses[y],
          false,
          true,
          false,
          false
        );
        OnCompletedChecking(true);
        return true;
      }
    }
  }
}

function LoadRequests() {
  m_bigMap = new Object();
  m_arrRequests = new Array();

  try {
    var listItemEnumerator = m_requestItems.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      var oListItem = listItemEnumerator.get_current();

      var id = oListItem.get_item("ID");
      var number = oListItem.get_item("Title");
      var status = oListItem.get_item("ReqStatus");

      var subject = oListItem.get_item("ReqSubject");
      if (subject == null) subject = "";

      var sensitivity = oListItem.get_item("Sensitivity");
      if (sensitivity == null) sensitivity = "None";

      var sample = oListItem.get_item("IsSample");
      var dueDate = oListItem.get_item("ReqDueDate");
      var internalDueDate = oListItem.get_item("InternalDueDate");
      var receiptDate = oListItem.get_item("ReceiptDate");
      var memoDate = oListItem.get_item("MemoDate");
      var closedDate = oListItem.get_item("ClosedDate");

      dueDate != null
        ? (dueDate = dueDate.format("MM/dd/yyyy"))
        : (dueDate = "");
      internalDueDate != null
        ? (internalDueDate = internalDueDate.format("MM/dd/yyyy"))
        : (internalDueDate = "");
      receiptDate != null
        ? (receiptDate = receiptDate.format("MM/dd/yyyy"))
        : (receiptDate = "");
      memoDate != null
        ? (memoDate = memoDate.format("MM/dd/yyyy"))
        : (memoDate = "");
      closedDate != null
        ? (closedDate = closedDate.format("MM/dd/yyyy"))
        : (closedDate = "");

      var arrAOs = new Array();
      var arrActionOffice = oListItem.get_item("ActionOffice");
      if (arrActionOffice.length > 0) {
        var tempAOs = new Array();
        for (var x = 0; x < arrActionOffice.length; x++)
          tempAOs.push(arrActionOffice[x].get_lookupValue());
        tempAOs = tempAOs.sort();

        for (var x = 0; x < tempAOs.length; x++)
          arrAOs.push({ ao: tempAOs[x] });
      }

      var arrEmailAOs = new Array();
      var arrEmailActionOffice = oListItem.get_item("EmailActionOffice");
      if (arrEmailActionOffice.length > 0) {
        var tempAOs = new Array();
        for (var x = 0; x < arrEmailActionOffice.length; x++)
          tempAOs.push(arrEmailActionOffice[x].get_lookupValue());
        tempAOs = tempAOs.sort();

        for (var x = 0; x < tempAOs.length; x++)
          arrEmailAOs.push({ ao: tempAOs[x] });
      }

      var comments = oListItem.get_item("Comments");
      var emailSent = oListItem.get_item("EmailSent");
      var reviewer = oListItem.get_item("Reviewer");
      var owner = oListItem.get_item("Owner");
      var relatedAudit = oListItem.get_item("RelatedAudit");
      var actionItems = oListItem.get_item("ActionItems");

      if (comments == null) comments = "";
      if (reviewer == null) reviewer = "";
      if (owner == null) owner = "";
      if (relatedAudit == null) relatedAudit = "";
      if (actionItems == null) actionItems = "";

      var closedBy = Audit.Common.Utilities.GetFriendlyDisplayName(
        oListItem,
        "ClosedBy"
      );

      var requestObject = new Object();
      requestObject["ID"] = id;
      requestObject["number"] = number;
      requestObject["subject"] = subject;
      requestObject["sensitivity"] = sensitivity;
      requestObject["dueDate"] = dueDate;
      requestObject["status"] = status;
      requestObject["internalDueDate"] = internalDueDate;
      requestObject["sample"] = sample;
      requestObject["requestDocs"] = new Array();
      requestObject["coversheets"] = new Array();
      requestObject["responses"] = new Array();
      requestObject["responsesOpenCnt"] = 0;
      requestObject["actionOffices"] = arrAOs;
      requestObject["emailActionOffices"] = arrEmailAOs;
      requestObject["comments"] = comments;
      requestObject["emailSent"] = emailSent;
      requestObject["closedDate"] = closedDate;
      requestObject["closedBy"] = closedBy;
      requestObject["reviewer"] = reviewer;
      requestObject["owner"] = owner;
      requestObject["receiptDate"] = receiptDate;
      requestObject["memoDate"] = memoDate;
      requestObject["relatedAudit"] = relatedAudit;
      requestObject["actionItems"] = actionItems;
      requestObject["specialPerms"] = null;
      requestObject["item"] = oListItem;

      m_arrRequests.push(requestObject);

      m_bigMap["request-" + number] = requestObject;
    }
  } catch (err) {
    alert(err);
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

      var requestObject = m_bigMap["request-" + reqNum.get_lookupValue()];

      requestObject.internalStatus = new CommentChainModuleDeprecated(id, {
        requestListTitle: Audit.Common.Utilities.GetListTitleRequestsInternal(),
        columnName: "InternalStatus",
        initialValue: oListItem.get_item("InternalStatus"),
      });
      requestObject.activeViewers = new ActiveViewersModuleDeprecated(id, {
        requestListTitle: Audit.Common.Utilities.GetListTitleRequestsInternal(),
        columnName: "ActiveViewers",
        initialValue: oListItem.get_item("ActiveViewers"),
      });
      // break;
    }
  } catch (err) {
    alert(err);
  }
}

function LoadResponses() {
  try {
    var listItemEnumerator = m_responseItems.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      var oListItem = listItemEnumerator.get_current();

      var number = oListItem.get_item("ReqNum");
      if (number != null) {
        number = number.get_lookupValue();

        if (number == null)
          //this will happen if the request was deleted but the responses weren't
          continue;

        var oRequestBigMap = m_bigMap["request-" + number];

        var returnReason = oListItem.get_item("ReturnReason");
        if (returnReason == null) returnReason = "";

        var responseObject = new Object();
        responseObject["ID"] = oListItem.get_item("ID");
        responseObject["number"] = number;
        var title = oListItem.get_item("Title");
        responseObject["title"] = title;
        responseObject["item"] = oListItem;

        var comments = oListItem.get_item("Comments");
        try {
          comments = $(comments).html();
          if (comments == null || comments == "")
            responseObject["comments"] = "";
          else {
            comments = comments.replace(/[^a-z0-9\s]/gi, " ");
            responseObject["comments"] = comments;
          }
        } catch (commentsErr) {
          if (comments == null || comments == "")
            responseObject["comments"] = "";
          comments = comments.replace(/[^a-z0-9\s]/gi, " ");
          responseObject["comments"] = comments;
        }

        var modified = oListItem
          .get_item("Modified")
          .format("MM/dd/yyyy hh:mm tt");
        responseObject["modified"] = modified;

        var closedDate = oListItem.get_item("ClosedDate");
        closedDate != null
          ? (closedDate = closedDate.format("MM/dd/yyyy"))
          : (closedDate = "");
        responseObject["closedDate"] = closedDate;

        responseObject["closedBy"] =
          Audit.Common.Utilities.GetFriendlyDisplayName(oListItem, "ClosedBy");

        responseObject["sample"] = oListItem.get_item("SampleNumber");
        if (responseObject["sample"] == null) responseObject["sample"] = "";

        responseObject["actionOffice"] = oListItem.get_item("ActionOffice");
        if (responseObject["actionOffice"] == null)
          responseObject["actionOffice"] = "";
        else
          responseObject["actionOffice"] =
            responseObject["actionOffice"].get_lookupValue();

        responseObject["poc"] = oListItem.get_item("POC");
        if (responseObject["poc"] == null) responseObject["poc"] = "";
        else responseObject["poc"] = responseObject["poc"].get_lookupValue();

        responseObject["pocCC"] = oListItem.get_item("POCCC");
        if (responseObject["pocCC"] == null) responseObject["pocCC"] = "";
        else
          responseObject["pocCC"] = responseObject["pocCC"].get_lookupValue();

        responseObject["returnReason"] = returnReason;
        responseObject["resStatus"] = oListItem.get_item("ResStatus");

        if (responseObject["resStatus"] != "7-Closed")
          oRequestBigMap.responsesOpenCnt = oRequestBigMap.responsesOpenCnt + 1; //	m_arrRequests[x].responsesOpenCnt = m_arrRequests[x].responsesOpenCnt + 1;

        responseObject["responseDocs"] = new Array();
        responseObject["responseFolderItem"] = null;

        //m_arrRequests[x]["responses"].push( responseObject );
        oRequestBigMap.responses.push(responseObject);
        m_bigMap["response-" + title] = responseObject;
      }
    }
  } catch (err) {
    alert(err);
  }
}

function LoadResponseDocs() {
  _myViewModel.arrResponseDocsCheckedOut([]);
  _myViewModel.arrResponseDocsCheckedOut.valueHasMutated();
  var arrResponseDocsCheckedOut = new Array();

  mapResponseDocs(m_ResponseDocsItems, m_bigMap);

  var listItemEnumerator = m_ResponseDocsItems.getEnumerator();
  while (listItemEnumerator.moveNext()) {
    var oListItem = listItemEnumerator.get_current();

    const checkedOutBy = Audit.Common.Utilities.GetFriendlyDisplayName(
      oListItem,
      "CheckoutUser"
    );

    if (checkedOutBy != "") {
      var requestNumber = oListItem.get_item("ReqNum");
      if (requestNumber != null)
        requestNumber = requestNumber.get_lookupValue();

      var oResponseDocCheckedOut = new Object();
      oResponseDocCheckedOut["number"] = requestNumber;
      oResponseDocCheckedOut["title"] = oListItem.get_item("Title");
      oResponseDocCheckedOut["checkedOutBy"] = checkedOutBy;

      arrResponseDocsCheckedOut.push(oResponseDocCheckedOut);
    }
  }

  ko.utils.arrayPushAll(
    _myViewModel.arrResponseDocsCheckedOut(),
    arrResponseDocsCheckedOut
  );
  _myViewModel.arrResponseDocsCheckedOut.valueHasMutated();
}

function LoadResponseCounts() {
  m_oRequestTitleAndDocCount = new Object();
  m_oResponseTitleAndDocCount = new Object();

  var requestLength = m_arrRequests.length;
  for (var x = 0; x < requestLength; x++) {
    var oRequest = m_arrRequests[x];
    if (oRequest.responses.length > 0) {
      var responseLength = oRequest.responses.length;
      for (var y = 0; y < responseLength; y++) {
        var responseCount = oRequest.responses[y].responseDocs.length;
        m_oResponseTitleAndDocCount[oRequest.responses[y].title] =
          responseCount;

        var curCount = m_oRequestTitleAndDocCount[oRequest.number];
        if (curCount == null)
          m_oRequestTitleAndDocCount[oRequest.number] = responseCount;
        else m_oRequestTitleAndDocCount[oRequest.number] += responseCount;
      }
    }
  }
}

function LoadResponseDocFolders() {
  m_arrPermissionsResponseFolders = new Array();

  try {
    var cntToBreak = 0;
    var cntBroken = 0;

    if (m_ResponseDocsFoldersItems != null) {
      var listItemEnumerator = m_ResponseDocsFoldersItems.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();

        var itemName = oListItem.get_displayName();
        var itemId = oListItem.get_id();
        var itemUrl = oListItem.get_item("EncodedAbsUrl");

        //Set the title if for whatever reason the folder didnt have it's title set
        if (oListItem.get_item("Title") == null) {
          var currCtx = new SP.ClientContext.get_current();
          var web = currCtx.get_web();

          oListItem.set_item("Title", itemName);
          oListItem.update();

          function OnSuccessUpdateTitle(sender, args) {}
          function OnFailureUpdateTitle(sender, args) {}
          currCtx.executeQueryAsync(OnSuccessUpdateTitle, OnFailureUpdateTitle);
        }

        var objFold = new Object();
        objFold["ID"] = itemId;
        objFold["ItemName"] = itemName;
        objFold["Item"] = oListItem;
        objFold["UserPermissions"] = new Array();
        objFold["GroupPermissions"] = new Array();

        if (m_bIsSiteOwner) {
          var roleAssignments = oListItem.get_roleAssignments();
          var rolesEnumerator = roleAssignments.getEnumerator();
          while (rolesEnumerator.moveNext()) {
            var role = rolesEnumerator.get_current();
            var roleMember = role.get_member();
            var memeberLoginName = roleMember.get_loginName();
            var memberTitleName = roleMember.get_title();

            var permissionType = "UserPermissions";
            var principalType = roleMember.get_principalType();
            if (
              principalType == SP.Utilities.PrincipalType.securityGroup ||
              principalType == SP.Utilities.PrincipalType.sharePointGroup
            ) {
              permissionType = "GroupPermissions";
            }

            var roleDefs = role.get_roleDefinitionBindings();

            var roleDefsEnumerator = roleDefs.getEnumerator();
            while (roleDefsEnumerator.moveNext()) {
              var rd = roleDefsEnumerator.get_current();
              var rdName = rd.get_name();

              objFold[permissionType].push(rdName + " - " + memberTitleName);
            }
          }
        }

        m_arrPermissionsResponseFolders.push(objFold);

        for (var x = 0; x < m_arrRequests.length; x++) {
          var oRequest = m_arrRequests[x];
          for (var y = 0; y < oRequest.responses.length; y++) {
            if (oRequest.responses[y].title == itemName) {
              oRequest.responses[y].responseFolderItem = oListItem;
              m_bigMap["response-" + itemName].responseFolderItem = oListItem;
              break;
            }
          }
        }
      }
    }
  } catch (err) {}
}

function LoadTabRequestInfoRequestDocs(oRequest) {
  _myViewModel.arrCurrentRequestRequestDocs([]);
  _myViewModel.arrCurrentRequestRequestDocs.valueHasMutated();
  oRequest.requestDocs = new Array();

  var arrRD = new Array();

  var currCtx = new SP.ClientContext.get_current();
  var web = currCtx.get_web();

  var requestDocLib = web
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetLibTitleRequestDocs());
  var requestDocQuery = new SP.CamlQuery();
  requestDocQuery.set_viewXml(
    '<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="ReqNum"/><Value Type="Text">' +
      oRequest.number +
      "</Value></Eq></Where></Query></View>"
  );
  var m_RequestDocItems = requestDocLib.getItems(requestDocQuery);
  currCtx.load(
    m_RequestDocItems,
    "Include(ID, Title, ReqNum, FileLeafRef, FileDirRef)"
  );

  var data = { oRequest: oRequest };
  function OnSuccess(sender, args) {
    var listItemEnumerator = m_RequestDocItems.getEnumerator();

    while (listItemEnumerator.moveNext()) {
      var oListItem = listItemEnumerator.get_current();

      var number = oListItem.get_item("ReqNum");
      if (number != null) {
        number = number.get_lookupValue();
        if (number == oRequest.number) {
          var requestDocObject = new Object();
          requestDocObject["ID"] = oListItem.get_item("ID");
          requestDocObject["title"] = oListItem.get_item("FileLeafRef");
          requestDocObject["folder"] = oListItem.get_item("FileDirRef");
          requestDocObject["requestStatus"] = oRequest.status;
          oRequest.requestDocs.push(requestDocObject);
        }
      }
    }

    ko.utils.arrayPushAll(
      _myViewModel.arrCurrentRequestRequestDocs(),
      oRequest.requestDocs
    );
    _myViewModel.arrCurrentRequestRequestDocs.valueHasMutated();
  }
  function OnFailure(sender, args) {}

  currCtx.executeQueryAsync(
    Function.createDelegate(data, OnSuccess),
    Function.createDelegate(data, OnFailure)
  );
}

function LoadTabRequestInfoCoverSheets(oRequest) {
  _myViewModel.arrCurrentRequestCoverSheets([]);
  _myViewModel.arrCurrentRequestCoverSheets.valueHasMutated();
  oRequest.coversheets = new Array();

  var arrCS = new Array();

  var currCtx = new SP.ClientContext.get_current();
  var web = currCtx.get_web();

  var coverSheetLib = web
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetLibTitleCoverSheets());
  var coverSheetQuery = new SP.CamlQuery();
  coverSheetQuery.set_viewXml(
    '<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="ReqNum"/><Value Type="Text">' +
      oRequest.number +
      "</Value></Eq></Where></Query></View>"
  );
  var m_CoverSheetItems = coverSheetLib.getItems(coverSheetQuery);
  if (m_bIsSiteOwner)
    currCtx.load(
      m_CoverSheetItems,
      "Include(ID, Title, ReqNum, ActionOffice, FileLeafRef, FileDirRef, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
    );
  else
    currCtx.load(
      m_CoverSheetItems,
      "Include(ID, Title, ReqNum, ActionOffice, FileLeafRef, FileDirRef)"
    );

  var data = { oRequest: oRequest };
  function OnSuccess(sender, args) {
    var listItemEnumerator = m_CoverSheetItems.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      var oListItem = listItemEnumerator.get_current();

      var number = oListItem.get_item("ReqNum");
      if (number != null) {
        number = number.get_lookupValue();
        if (number == oRequest.number) {
          //just double checking here
          var coversheetObject = new Object();
          coversheetObject["ID"] = oListItem.get_item("ID");
          coversheetObject["number"] = number;

          var arrActionOffice = new Array();
          var actionOffices = oListItem.get_item("ActionOffice");

          if (actionOffices && actionOffices.length > 0) {
            for (var y = 0; y < actionOffices.length; y++) {
              arrActionOffice.push({
                actionOffice: actionOffices[y].get_lookupValue(),
              });
            }
          }

          coversheetObject["actionOffices"] = arrActionOffice;
          coversheetObject["title"] = oListItem.get_item("FileLeafRef");
          coversheetObject["folder"] = oListItem.get_item("FileDirRef");
          coversheetObject["item"] = oListItem;
          coversheetObject["requestStatus"] = oRequest.status;

          oRequest.coversheets.push(coversheetObject);
        }
      }
    }

    ko.utils.arrayPushAll(
      _myViewModel.arrCurrentRequestCoverSheets(),
      oRequest.coversheets
    );
    _myViewModel.arrCurrentRequestCoverSheets.valueHasMutated();
  }
  function OnFailure(sender, args) {}

  currCtx.executeQueryAsync(
    Function.createDelegate(data, OnSuccess),
    Function.createDelegate(data, OnFailure)
  );
}

//when action office or qa updates the response and it comes back to IA, IA gets emailed a link with the response number; When they open the link in the browser, it will ]
//take them to 2nd tab; When they click on the response (which is filtered), it will display tab 3 with the request details. At that point, it will try to check to see if the response permissions
//need to be updated
async function m_fnLoadResponseDocFolder(responseTitle, OnComplete) {
  var currCtx = new SP.ClientContext.get_current();
  var web = currCtx.get_web();

  var responseList = web
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetListTitleResponses());
  var responseQuery = new SP.CamlQuery();
  responseQuery.set_viewXml(
    '<View><Query><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' +
      responseTitle +
      "</Value></Eq></Where></Query></View>"
  );
  const m_aResponseItem = responseList.getItems(responseQuery);
  //need to check permissions because of granting/removing special perms
  currCtx.load(
    m_aResponseItem,
    "Include(ID, Title, ReqNum, ActionOffice, ReturnReason, SampleNumber, ResStatus, Comments, Modified, ClosedDate, ClosedBy, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
  );

  var responseDocsLibFolderslist = currCtx
    .get_web()
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
  var responseDocsLibFolderslistQuery = new SP.CamlQuery();
  //include the dash
  responseDocsLibFolderslistQuery.set_viewXml(
    '<View><Query><Where><And><Eq><FieldRef Name="Title"/><Value Type="Text">' +
      responseTitle +
      '</Value></Eq><Eq><FieldRef Name="ContentType" /><Value Type="Text">Folder</Value></Eq></And></Where></Query></View>'
  );
  m_ResponseDocsFoldersItems = responseDocsLibFolderslist.getItems(
    responseDocsLibFolderslistQuery
  );
  currCtx.load(
    m_ResponseDocsFoldersItems,
    "Include( DisplayName, Title, Id, EncodedAbsUrl, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
  );

  await new Promise((resolve, reject) =>
    currCtx.executeQueryAsync(resolve, reject)
  ).catch((sender, args) => {
    return false;
  });

  var oResponseItem = null;
  //Requery the response item to now have the permissions on the responses; Avoid doing it at the top because it impacts load time
  var listItemEnumerator = m_aResponseItem.getEnumerator();
  while (listItemEnumerator.moveNext()) {
    var oListItem = listItemEnumerator.get_current();

    for (var x = 0; x < m_arrRequests.length; x++) {
      var oRequest = m_arrRequests[x];
      for (var y = 0; y < oRequest.responses.length; y++) {
        if (oRequest.responses[y].title == responseTitle) {
          oRequest.responses[y].item = oListItem;
          break;
        }
      }
    }

    break;
  }

  LoadResponseDocFolders(); //really, this only runs through the one response and we're only doing this to set the response item's folder so that we can query the permissions on it
  return true;
}

async function LoadTabRequestInfoResponses(oRequest) {
  if (m_bIsSiteOwner) {
    /* for this specific response selected, check that the permissions don't need updating*/
    if (m_sGoToResponseTitle != null && m_sGoToResponseTitle != "") {
      const doneLoadingThisResponseFolder = await m_fnLoadResponseDocFolder(
        m_sGoToResponseTitle
      );
      if (doneLoadingThisResponseFolder) {
        const doneCheckingResponseFolder =
          await m_fnCheckIfResponsePermissionsNeedUpdating(
            oRequest.status,
            m_sGoToResponseTitle
          );
      }
    }
  }

  _myViewModel.arrCurrentRequestResponses([]);
  _myViewModel.arrCurrentRequestResponses.valueHasMutated();

  document.body.style.cursor = "wait";
  var m_notifyIDLoadingResponses = SP.UI.Notify.addNotification(
    "Loading Responses...",
    true
  );

  var currCtx = new SP.ClientContext.get_current();
  var web = currCtx.get_web();

  var responseList = web
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetListTitleResponses());
  var responseQuery = new SP.CamlQuery();
  responseQuery.set_viewXml(
    '<View><Query><Where><Eq><FieldRef Name="ReqNum"/><Value Type="Text">' +
      oRequest.number +
      "</Value></Eq></Where></Query></View>"
  );
  var m_subsetResponseItems = responseList.getItems(responseQuery);
  //need to check permissions because of granting/removing special perms
  if (m_bIsSiteOwner)
    currCtx.load(
      m_subsetResponseItems,
      "Include(ID, Title, ReqNum, ActionOffice, ReturnReason, SampleNumber, ResStatus, Comments, ActiveViewers, Modified, ClosedDate, ClosedBy, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
    );
  else
    currCtx.load(
      m_subsetResponseItems,
      "Include(ID, Title, ReqNum, ActionOffice, ReturnReason, SampleNumber, ResStatus, Comments, ActiveViewers, Modified, ClosedDate, ClosedBy)"
    );

  var responseDocsLibFolderslist = currCtx
    .get_web()
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
  var responseDocsLibFolderslistQuery = new SP.CamlQuery();
  //include the dash
  responseDocsLibFolderslistQuery.set_viewXml(
    '<View><Query><Where><And><BeginsWith><FieldRef Name="Title"/><Value Type="Text">' +
      oRequest.number +
      '-</Value></BeginsWith><Eq><FieldRef Name="ContentType" /><Value Type="Text">Folder</Value></Eq></And></Where></Query></View>'
  );
  m_ResponseDocsFoldersItems = responseDocsLibFolderslist.getItems(
    responseDocsLibFolderslistQuery
  );
  if (m_bIsSiteOwner)
    currCtx.load(
      m_ResponseDocsFoldersItems,
      "Include( DisplayName, Title, Id, EncodedAbsUrl, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
    );
  else
    currCtx.load(
      m_ResponseDocsFoldersItems,
      "Include( DisplayName, Title, Id, EncodedAbsUrl)"
    );

  function OnSuccess(sender, args) {
    var listItemEnumerator = m_subsetResponseItems.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      var oListItem = listItemEnumerator.get_current();
      var responseTitle = oListItem.get_item("Title");

      if (m_bigMap["response-" + responseTitle])
        m_bigMap["response-" + responseTitle].item = oListItem; //update the response item with an item that has the permission attributes

      if (m_bIsSiteOwner) {
        if (!oListItem.get_hasUniqueRoleAssignments()) {
          m_fnBreakResponsePermissions(oListItem, false, true);
        }
      }
    }

    LoadResponseDocFolders();

    var sResponses = "";
    var responseCount = oRequest.responses.length;

    oRequest.responses.sort(function (a, b) {
      a = parseInt(a.sample, 10);
      b = parseInt(b.sample, 10);
      return a - b;
    });

    if (responseCount == 0)
      notifyId = SP.UI.Notify.addNotification(
        oRequest.number + " has 0 responses. Please create a Response",
        false
      );

    var arrResponses = new Array();

    for (var y = 0; y < responseCount; y++) {
      var oResponse = oRequest.responses[y];

      var groupPerms = "";
      for (var x = 0; x < m_arrPermissionsResponseFolders.length; x++) {
        if (m_arrPermissionsResponseFolders[x].ItemName == oResponse.title) {
          const arrGroupPerms =
            m_arrPermissionsResponseFolders[x].GroupPermissions;

          var grouppermissionsArr = arrGroupPerms.sort();
          grouppermissionsArr.sort(function (a, b) {
            return a.toLowerCase().localeCompare(b.toLowerCase());
          });

          for (var z = 0; z < grouppermissionsArr.length; z++) {
            groupPerms += "<div>" + grouppermissionsArr[z] + "</div>";
          }
          break;
        }
      }
      var specialPerms = false;
      if (
        groupPerms.indexOf(Audit.Common.Utilities.GetGroupNameSpecialPerm1()) >=
          0 &&
        groupPerms.indexOf(Audit.Common.Utilities.GetGroupNameSpecialPerm2()) >=
          0
      ) {
        specialPerms = true;
      }

      var arrRequestActionOffices = oRequest.item.get_item("ActionOffice");
      var responseActionOfficeIsInRequest = false;
      if (arrRequestActionOffices != null) {
        for (var x = 0; x < arrRequestActionOffices.length; x++) {
          if (
            arrRequestActionOffices[x].get_lookupValue() ==
            oResponse.actionOffice
          ) {
            responseActionOfficeIsInRequest = true;
          }
        }
      }

      var styleTag = new Object();
      var toolTip = "";
      if (!responseActionOfficeIsInRequest) {
        styleTag = {
          "background-color": "lightsalmon",
          "font-style": "italic",
          "font-weight": "bold",
          color: "red",
        };

        toolTip =
          "This Action Office is not found in the Action Office list for the Request";
      }

      oResponse["groupPerms"] = groupPerms;
      oResponse["specialPerms"] = specialPerms;
      oResponse["styleTag"] = styleTag;
      oResponse["toolTip"] = toolTip;
      oResponse["activeViewers"] = new ActiveViewersModuleDeprecated(
        oResponse.ID,
        {
          requestListTitle: Audit.Common.Utilities.GetListTitleResponses(),
          columnName: "ActiveViewers",
          initialValue: oResponse.item.get_item("ActiveViewers"),
        }
      );

      arrResponses.push(oResponse);
    }

    SP.UI.Notify.removeNotification(m_notifyIDLoadingResponses);
    m_notifyIDLoadingResponses = null;

    ko.utils.arrayPushAll(
      _myViewModel.arrCurrentRequestResponses(),
      arrResponses
    );
    _myViewModel.arrCurrentRequestResponses.valueHasMutated();

    document.body.style.cursor = "default";

    m_fnHighlightResponse();

    LoadTabRequestInfoResponseDocs(oRequest);
  }
  function OnFailure(sender, args) {
    const statusId = SP.UI.Status.addStatus(
      "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
    );
    SP.UI.Status.setStatusPriColor(statusId, "red");
  }
  currCtx.executeQueryAsync(OnSuccess, OnFailure);
}

function m_fnHighlightResponse() {
  if (m_sGoToResponseTitle != null && m_sGoToResponseTitle != "") {
    $("[id='response-item-title-" + m_sGoToResponseTitle + "']")
      .parent()
      .css({ "background-color": "palegreen", "font-weight": "inherit" });
    $("[id='response-item-title-" + m_sGoToResponseTitle + "']")
      .get(0)
      .scrollIntoView();

    function resetColor(index) {
      $("[id='response-item-title-" + m_sGoToResponseTitle + "']")
        .parent()
        .css({ "background-color": "inherit", "font-weight": "inherit" });

      m_sGoToResponseTitle = null;
    }
    setTimeout(function () {
      resetColor(m_sGoToResponseTitle);
    }, 2000);
  }
}

async function LoadTabRequestInfoResponseDocs(oRequest) {
  _myViewModel.arrCurrentRequestResponseDocs([]);
  _myViewModel.arrCurrentRequestResponseDocs.valueHasMutated();

  _myViewModel.cntResponseDocs(0);
  _myViewModel.cntResponseDocs.valueHasMutated();

  let currCtx = new SP.ClientContext.get_current();
  let web = currCtx.get_web();

  var responseDocsLib = web
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());

  var responseDocsQuery = new SP.CamlQuery();
  responseDocsQuery.set_viewXml(
    '<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="ReqNum"/><Value Type="Text">' +
      oRequest.number +
      '</Value></Eq></Where><OrderBy><FieldRef Name="ReqNum"/><FieldRef Name="ResID"/></OrderBy><Where><Eq><FieldRef Name="ContentType"/><Value Type="Text">Document</Value></Eq></Where></Query></View>'
  );
  const requestResponseDocsItems = responseDocsLib.getItems(responseDocsQuery);
  currCtx.load(
    requestResponseDocsItems,
    "Include(ID, Title, ReqNum, ResID, DocumentStatus, RejectReason, ReceiptDate, FileLeafRef, FileDirRef, File_x0020_Size, CheckoutUser, Modified, Editor, Created)"
  );

  await new Promise((resolve, reject) =>
    currCtx.executeQueryAsync(resolve, reject)
  );

  oRequest.responses.map((response) => (response.responseDocs = []));
  mapResponseDocs(requestResponseDocsItems, m_bigMap);

  currCtx = new SP.ClientContext.get_current();
  web = currCtx.get_web();

  var bHasResponseDoc = false;
  if (oRequest && oRequest.responses && oRequest.responses.length > 0) {
    for (var y = 0; y < oRequest.responses.length; y++) {
      var oResponse = oRequest.responses[y];
      if (
        oResponse &&
        oResponse.responseDocs &&
        oResponse.responseDocs.length > 0
      ) {
        for (var z = 0; z < oResponse.responseDocs.length; z++) {
          var oResponseDoc = oResponse.responseDocs[z];

          //this loads on execute
          oResponseDoc["docIcon"] = web.mapToIcon(
            oResponseDoc.fileName,
            "",
            SP.Utilities.IconSize.Size16
          ); // m_siteUrl + "/" + _spPageContextInfo.layoutsUrl + "/images/" + docIcon;

          bHasResponseDoc = true;
        }
      }
    }
  }

  if (!bHasResponseDoc) {
    RequestFinishedLoading();
    return;
  }

  await new Promise((resolve, reject) =>
    currCtx.executeQueryAsync(resolve, reject)
  ).catch((sender, args) => {
    const statusId = SP.UI.Status.addStatus(
      "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
    );
    SP.UI.Status.setStatusPriColor(statusId, "red");
  });

  var sReponseDocs = "";
  var cnt = 0;

  oRequest.responses.sort(Audit.Common.Utilities.SortResponseObjects);

  var onc =
    "onclick=\"return DispEx(this,event,'TRUE','FALSE','FALSE','SharePoint.OpenDocuments.3','1','SharePoint.OpenDocuments','','','','2','0','0','0x7fffffffffffffff','','')\"";

  var arrResponseSummaries = new Array();
  for (var y = 0; y < oRequest.responses.length; y++) {
    var oResponse = oRequest.responses[y];

    var showBulkApprove = false;

    var arrResponseDocs = new Array();
    for (var z = 0; z < oResponse.responseDocs.length; z++) {
      var oResponseDoc = oResponse.responseDocs[z];

      oResponseDoc.chkApproveResDoc = ko.observable(false);

      if (oResponseDoc.documentStatus == "Marked for Deletion") continue;

      oResponseDoc.docIcon = oResponseDoc.docIcon.get_value();
      oResponseDoc.styleTag = Audit.Common.Utilities.GetResponseDocStyleTag2(
        oResponseDoc.documentStatus
      );
      oResponseDoc.requestID = oRequest.ID; //needed for view document
      oResponseDoc.responseID = oResponse.ID;
      oResponseDoc.responseTitle = oResponse.title; //needed for view document
      oResponseDoc.responseDocOpenInIELink =
        "<a target='_blank' title='Click to Open the document' onmousedown=\"return VerifyHref(this,event,'1','SharePoint.OpenDocuments','')\" " +
        onc +
        ' href="' +
        oResponseDoc.folder +
        "/" +
        oResponseDoc.fileName +
        '">' +
        oResponseDoc.fileName +
        "</a>";
      arrResponseDocs.push(oResponseDoc);
      cnt++;

      if (
        oResponse.resStatus == "2-Submitted" &&
        oResponseDoc.documentStatus == "Submitted"
      ) {
        showBulkApprove = true;
      }
    }
    arrResponseSummaries.push({
      responseId: oResponse.ID,
      responseTitle: oResponse.title,
      responseDocs: arrResponseDocs,
      responseStatus: oResponse.resStatus,
      requestStatus: oRequest.status,
      showBulkApprove,
    });
  }

  ko.utils.arrayPushAll(
    _myViewModel.arrCurrentRequestResponseDocs(),
    arrResponseSummaries
  );
  _myViewModel.arrCurrentRequestResponseDocs.valueHasMutated();
  _myViewModel.cntResponseDocs(cnt);
  RequestFinishedLoading();
}

function DisplayRequestsThatShouldClose() {
  _myViewModel.arrRequestsThatNeedClosing([]);
  _myViewModel.arrRequestsThatNeedClosing.valueHasMutated();

  if (m_arrRequests == null || m_arrRequests.length == 0) return;

  m_arrRequestsToClose = new Array();
  for (var x = 0; x < m_arrRequests.length; x++) {
    var oRequest = m_arrRequests[x];

    if (oRequest.status != "Closed") {
      //check if all responses are closed
      var countClosed = 0;
      for (var y = 0; y < oRequest.responses.length; y++) {
        if (oRequest.responses[y].resStatus == "7-Closed") countClosed++;
      }

      if (
        oRequest.responses.length > 0 &&
        oRequest.responses.length == countClosed
      ) {
        var lastClosedDate = null;
        var lastClosedBy = null;
        var lastResponseId = null;
        var oResponse = null;
        var sLastClosedDate = "";

        for (var y = 0; y < oRequest.responses.length; y++) {
          var closedDate = oRequest.responses[y].item.get_item("ClosedDate");
          if (lastClosedDate == null || lastClosedDate < closedDate) {
            lastClosedDate = closedDate;
            lastClosedBy = oRequest.responses[y].closedBy;
            lastResponseId = oRequest.responses[y].title;
            oResponse = oRequest.responses[y];

            //used in ko databinding
            if (lastClosedDate != null && lastClosedDate != "")
              sLastClosedDate = lastClosedDate.format("MM/dd/yyyy hh:mm tt");
          }
        }

        m_arrRequestsToClose.push({
          number: oRequest.number,
          lastResponseId: lastResponseId,
          lastClosedDate: lastClosedDate,
          lastClosedBy: lastClosedBy,
          sLastClosedDate: sLastClosedDate,
          oResponse: oResponse,
        });
      }
    }
  }

  ko.utils.arrayPushAll(
    _myViewModel.arrRequestsThatNeedClosing(),
    m_arrRequestsToClose
  );
  _myViewModel.arrRequestsThatNeedClosing.valueHasMutated();
}

function LoadTabStatusReport1(arr, fbody) {
  _myViewModel.arrRequests([]);
  _myViewModel.arrRequests.valueHasMutated();

  _myViewModel.arrRequestsInternalAlmostDue([]);
  _myViewModel.arrRequestsInternalAlmostDue.valueHasMutated();

  _myViewModel.arrRequestsAlmostDue([]);
  _myViewModel.arrRequestsAlmostDue.valueHasMutated();

  _myViewModel.arrRequestsInternalPastDue([]);
  _myViewModel.arrRequestsInternalPastDue.valueHasMutated();

  _myViewModel.arrRequestsPastDue([]);
  _myViewModel.arrRequestsPastDue.valueHasMutated();

  _myViewModel.arrRequestsWithNoResponses([]);
  _myViewModel.arrRequestsWithNoResponses.valueHasMutated();

  _myViewModel.arrRequestsWithNoEmailSent([]);
  _myViewModel.arrRequestsWithNoEmailSent.valueHasMutated();

  if (arr == null) return;

  //var bLoadTest = GetUrlKeyValue("LoadTest");

  var requestArr = new Array();
  var arrInternalAlmostDue = new Array();
  var arrInternalPastDue = new Array();
  var arrAlmostDue = new Array();
  var arrPastDue = new Array();
  var arrRequestsWithNoResponses = new Array();
  var arrRequestsWithNoEmailSent = new Array();

  var arrLength = arr.length;
  while (arrLength--) {
    var oRequest = arr[arrLength];

    var internalDueDateStyle = "";
    var dueDateStyle = "";
    if (m_fnIsRequestPastDue(oRequest, oRequest.internalDueDate)) {
      internalDueDateStyle = "past-due";
      arrInternalPastDue.push({
        title: oRequest.number,
        number: oRequest.number,
        internalDueDate: oRequest.internalDueDate,
        dueDate: oRequest.dueDate,
      });
    } else if (m_fnIsRequestAlmostDue(oRequest, oRequest.internalDueDate)) {
      internalDueDateStyle = "almost-due";
      arrInternalAlmostDue.push({
        title: oRequest.number,
        number: oRequest.number,
        internalDueDate: oRequest.internalDueDate,
        dueDate: oRequest.dueDate,
      });
    }

    if (m_fnIsRequestPastDue(oRequest, oRequest.dueDate)) {
      dueDateStyle = "past-due";
      arrPastDue.push({
        title: oRequest.number,
        number: oRequest.number,
        internalDueDate: oRequest.internalDueDate,
        dueDate: oRequest.dueDate,
      });
    } else if (m_fnIsRequestAlmostDue(oRequest, oRequest.dueDate)) {
      dueDateStyle = "almost-due";
      arrAlmostDue.push({
        title: oRequest.number,
        number: oRequest.number,
        internalDueDate: oRequest.internalDueDate,
        dueDate: oRequest.dueDate,
      });
    }

    if (oRequest.responses.length == 0)
      arrRequestsWithNoResponses.push({
        title: oRequest.number,
        number: oRequest.number,
      });

    if (!oRequest.emailSent)
      arrRequestsWithNoEmailSent.push({
        title: oRequest.number,
        number: oRequest.number,
      });

    var resCount = m_oRequestTitleAndDocCount[oRequest.number];
    if (!resCount) resCount = 0;

    var aRequest = {
      reqNumber: oRequest.number,
      subject: oRequest.subject,
      sensitivity: oRequest.sensitivity,
      status: oRequest.status,
      internalDueDate: oRequest.internalDueDate,
      dueDate: oRequest.dueDate,
      internalDueDateStyle: internalDueDateStyle,
      dueDateStyle: dueDateStyle,
      sample: oRequest.sample,
      sentEmail: oRequest.emailSent,
      actionOffices: oRequest.actionOffices,
      emailActionOffices: oRequest.emailActionOffices,
      responseCount: oRequest.responses.length,
      responsesOpenCount: oRequest.responsesOpenCnt,
      responseDocCount: resCount,
    };
    requestArr.push(aRequest);

    /*if( bLoadTest )
			{
				for( var z = 0; z < 99; z++)
				{
					requestArr.push( aRequest );
				}
			}*/
  }

  ko.utils.arrayPushAll(_myViewModel.arrRequests, requestArr);
  _myViewModel.arrRequests.valueHasMutated();

  ko.utils.arrayPushAll(
    _myViewModel.arrRequestsInternalAlmostDue(),
    arrInternalAlmostDue
  );
  _myViewModel.arrRequestsInternalAlmostDue.valueHasMutated();

  ko.utils.arrayPushAll(_myViewModel.arrRequestsAlmostDue(), arrAlmostDue);
  _myViewModel.arrRequestsAlmostDue.valueHasMutated();

  ko.utils.arrayPushAll(
    _myViewModel.arrRequestsInternalPastDue(),
    arrInternalPastDue
  );
  _myViewModel.arrRequestsInternalPastDue.valueHasMutated();

  ko.utils.arrayPushAll(_myViewModel.arrRequestsPastDue(), arrPastDue);
  _myViewModel.arrRequestsPastDue.valueHasMutated();

  ko.utils.arrayPushAll(
    _myViewModel.arrRequestsWithNoResponses(),
    arrRequestsWithNoResponses
  );
  _myViewModel.arrRequestsWithNoResponses.valueHasMutated();

  ko.utils.arrayPushAll(
    _myViewModel.arrRequestsWithNoEmailSent(),
    arrRequestsWithNoEmailSent
  );
  _myViewModel.arrRequestsWithNoEmailSent.valueHasMutated();
}

function LoadTabStatusReport2(arr, fbody) {
  if (arr == null) return;

  var arrSubmittedResponsesByAO = new Array();

  //var bLoadTest = GetUrlKeyValue("LoadTest");
  var responseArr = new Array();

  var requestLength = arr.length;
  for (var x = 0; x < requestLength; x++) {
    var oRequest = arr[x];

    var responseLength = oRequest.responses.length;
    for (var y = 0; y < responseLength; y++) {
      var oResponse = oRequest.responses[y];

      var responseTitle = oResponse.title;
      var responseStatus = oResponse.resStatus;

      var resCount = m_oResponseTitleAndDocCount[oResponse.title];
      if (!resCount) resCount = 0;

      var aResponse = {
        visibleRow: ko.observable(true),
        reqNumber: oRequest.number,
        sample: oResponse.sample,
        title: responseTitle,
        internalDueDate: oRequest.internalDueDate,
        status: responseStatus,
        ao: oResponse.actionOffice,
        docCount: resCount,
        modified: oResponse.modified,
        request: ko.observable(oRequest),
      };
      responseArr.push(aResponse);

      /*if( bLoadTest )
				{
					for( var z = 0; z < 99; z++ )
					{
						responseArr.push( aResponse );
					}	
				}*/

      if (oResponse.resStatus == "2-Submitted")
        arrSubmittedResponsesByAO.push({
          title: oResponse.title,
          number: oRequest.number,
        });
    }
  }

  //if( bLoadTest )
  //	_myViewModel.debugMode( true );

  if (responseArr.length > 0) {
    ko.utils.arrayPushAll(_myViewModel.arrResponses, responseArr);
    _myViewModel.arrResponses.valueHasMutated(); //not doing this because we're using jsrender

    //do this after push all because this takes some time
    // var responseOutput = $("#responseTemplate").render(responseArr);
    // $("#" + fbody)
    //   .html(responseOutput)
    //   .show();
  }
  _myViewModel.doSort(true);

  ko.utils.arrayPushAll(
    _myViewModel.arrResponsesSubmittedByAO(),
    arrSubmittedResponsesByAO
  );
  _myViewModel.arrResponsesSubmittedByAO.valueHasMutated();
}

function m_fnViewLateRequests() {
  window.open(
    Audit.Common.Utilities.GetSiteUrl() +
      "/pages/AuditReport_RequestsStatus.aspx",
    "_blank"
  );
}

function m_fnViewPermissions() {
  window.open(
    Audit.Common.Utilities.GetSiteUrl() + "/pages/AuditPermissions.aspx",
    "_blank"
  );
}

function m_fnViewResponseDocsToday() {
  window.open(
    Audit.Common.Utilities.GetSiteUrl() +
      "/pages/AuditUnSubmittedResponseDocuments.aspx",
    "_blank"
  );
}

function m_fnViewReturnedDocs() {
  window.open(
    Audit.Common.Utilities.GetSiteUrl() + "/Pages/AuditReturnedResponses.aspx",
    "_blank"
  );
}

function m_fnIsRequestAlmostDue(oRequest, dueDate) {
  var todayDate = new Date();

  if (dueDate == null || dueDate == "") return false;

  dueDate = new Date(dueDate);

  var one_day = 1000 * 60 * 60 * 24;
  var difference = Math.ceil(
    (todayDate.getTime() - dueDate.getTime()) / one_day
  );

  if (
    (oRequest.status == "Open" || oRequest.status == "ReOpened") &&
    difference >= 0 &&
    difference <= 3
  )
    return true;

  return false;
}

function m_fnIsRequestPastDue(oRequest, dueDate = null) {
  var todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  if (dueDate == null || dueDate == "") return false;

  const dueDateD = new Date(dueDate);

  if (
    (oRequest.status == "Open" || oRequest.status == "ReOpened") &&
    todayDate.getTime() > dueDateD.getTime()
  )
    return true;

  return false;
}

function m_fnCreateRequest() {
  if (!m_bIsSiteOwner) {
    SP.UI.Notify.addNotification(
      "You do not have access to perform this action...",
      false
    );
    return;
  }

  const newRequestForm = new NewRequestFormComponent();
  const options = {
    title: "Create a New Request",
    form: newRequestForm,
    dialogReturnValueCallback: OnCallbackFormNewRequest,
  };

  ModalDialog.showModalDialog(options);
}

function m_fnBulkAddRequest() {
  if (!m_bIsSiteOwner) {
    SP.UI.Notify.addNotification(
      "You do not have access to perform this action...",
      false
    );
    return;
  }

  m_bIsTransactionExecuting = true;

  var options = SP.UI.$create_DialogOptions();
  options.title = "Bulk Add Requests";
  // options.dialogReturnValueCallback = m_fnRefresh;
  options.height = 800;
  options.url =
    Audit.Common.Utilities.GetSiteUrl() + "/pages/AuditBulkAddRequest.aspx";

  SP.UI.ModalDialog.showModalDialog(options);
}

async function m_fnViewRequest(id) {
  m_bIsTransactionExecuting = true;

  const request = await appContext.AuditRequests.FindById(id);
  // const requestViewForm = AuditRequest.components.view(request);
  const requestViewForm = FormManager.DispForm(request);

  const options = {
    title: "View Request (ID:" + id + ")",
    form: requestViewForm,
    dialogReturnValueCallback: OnCallbackForm,
  };

  ModalDialog.showModalDialog(options);
}

async function m_fnEditRequest(id, requestNum) {
  if (!m_bIsSiteOwner) {
    SP.UI.Notify.addNotification(
      "You do not have access to perform this action...",
      false
    );
    return;
  }

  m_bIsTransactionExecuting = true;

  m_itemID = id;
  m_requestNum = requestNum;

  const request = await appContext.AuditRequests.FindById(id);
  const form = new EditRequestForm({ entity: request });
  const options = {
    title: "Edit Request (" + requestNum + ")",
    form,
    dialogReturnValueCallback: OnCallbackFormEditRequest,
  };
  ModalDialog.showModalDialog(options);
}

async function m_fnViewCoverSheet(id) {
  m_bIsTransactionExecuting = true;

  const coverSheet = await appContext.AuditCoversheets.FindById(id);

  const coverSheetViewForm = FormManager.DispForm(coverSheet);

  const options = {
    title: "View Coversheet (ID:" + id + ")",
    form: coverSheetViewForm,
    dialogReturnValueCallback: OnCallbackForm,
  };
  ModalDialog.showModalDialog(options);
}

async function m_fnEditCoverSheet(id, requestNum) {
  m_bIsTransactionExecuting = true;
  m_requestNum = requestNum;

  const coverSheet = await appContext.AuditCoversheets.FindById(id);
  const coverSheetForm = new EditCoverSheetForm({ entity: coverSheet });

  const options = {
    form: coverSheetForm,
  };
  options.title = "Edit Coversheet (ID:" + id + ")";
  options.dialogReturnValueCallback = OnCallbackFormCoverSheet;

  ModalDialog.showModalDialog(options);
}

function m_fnBulkAddResponse(id) {
  if (!m_bIsSiteOwner) {
    SP.UI.Notify.addNotification(
      "You do not have access to perform this action...",
      false
    );
    return;
  }

  m_bIsTransactionExecuting = true;

  var options = SP.UI.$create_DialogOptions();
  options.title = "Bulk Add Responses (" + id + ")";
  options.dialogReturnValueCallback = OnCallbackFormBulkAddResponse;
  options.height = 800;
  options.url =
    Audit.Common.Utilities.GetSiteUrl() +
    "/pages/AuditBulkAddResponse.aspx?ReqNum=" +
    id +
    GetSourceUrlForForms();

  SP.UI.ModalDialog.showModalDialog(options);
}

function m_fnBulkEditResponse(id) {
  if (!m_bIsSiteOwner) {
    SP.UI.Notify.addNotification(
      "You do not have access to perform this action...",
      false
    );
    return;
  }

  m_bIsTransactionExecuting = true;

  var options = SP.UI.$create_DialogOptions();
  options.title = "Bulk Edit Responses (" + id + ")";
  options.dialogReturnValueCallback = OnCallbackFormBulkEditResponse;
  options.height = 850;
  options.width = 1100;
  options.allowMaximize = true;
  options.allowResize = true;
  options.args = {
    bigMap: m_bigMap,
    m_fnBreakCoversheetPermissions: m_fnBreakCoversheetPermissions,
    m_fnBreakResponsePermissions: m_fnBreakResponsePermissions,
    m_fnBreakResponseFolderPermissions: m_fnBreakResponseFolderPermissions,
  };
  options.url =
    Audit.Common.Utilities.GetSiteUrl() +
    "/pages/AuditBulkEditResponse.aspx?ReqNum=" +
    id +
    GetSourceUrlForForms();

  SP.UI.ModalDialog.showModalDialog(options);
}

function m_fnGetNextSampleNumber(id) {
  var sampleNumber = 0;
  for (var x = 0; x < m_arrRequests.length; x++) {
    if (m_arrRequests[x].number == id) {
      for (var y = 0; y < m_arrRequests[x].responses.length; y++) {
        if (m_arrRequests[x].responses[y].sample > sampleNumber)
          sampleNumber = m_arrRequests[x].responses[y].sample;
      }

      if (m_arrRequests[x].responses.length > 0) sampleNumber++;

      break;
    }
  }
  return sampleNumber;
}

async function m_fnAddResponse(id, reqNum) {
  if (!m_bIsSiteOwner) {
    SP.UI.Notify.addNotification(
      "You do not have access to perform this action...",
      false
    );
    return;
  }

  m_bIsTransactionExecuting = true;

  var sampleNumber = m_fnGetNextSampleNumber(reqNum);

  const request = await appContext.AuditRequests.FindById(id);
  const newResponse = new AuditResponse();

  newResponse.ReqNum.Value(request);
  newResponse.SampleNumber.Value(sampleNumber);

  const newResponseForm = new NewResponseForm({ entity: newResponse });

  const options = {
    form: newResponseForm,
  };
  options.title = "Add Response to (Request Number:" + id + ")";
  options.dialogReturnValueCallback = OnCallbackFormNewResponse;

  ModalDialog.showModalDialog(options);
}

async function m_fnViewResponse(
  requestNumber,
  id,
  responseTitle,
  responseStatus
) {
  m_bIsTransactionExecuting = true;

  const response = await appContext.AuditResponses.FindById(id);

  if (!response) {
    SP.UI.Notify.addNotification("Response not found! " + id, false);
    alert();
    return;
  }
  const viewResponseForm = FormManager.DispForm(response);

  var options = {
    form: viewResponseForm,
  };

  options.title = "View Response (" + responseTitle + ")";
  options.height = 600;
  options.dialogReturnValueCallback = OnCallbackForm;

  ModalDialog.showModalDialog(options);
}

async function m_fnEditResponse(
  requestNumber,
  id,
  responseTitle,
  responseStatus
) {
  if (!m_bIsSiteOwner) {
    SP.UI.Notify.addNotification(
      "You do not have access to perform this action...",
      false
    );
    return;
  }

  m_bIsTransactionExecuting = true;

  m_requestNum = requestNumber;
  m_itemID = id;
  m_responseTitle = responseTitle;
  m_responseStatus = responseStatus;

  const response = await appContext.AuditResponses.FindById(id);

  if (!response) {
    SP.UI.Notify.addNotification("Response not found! " + id, false);
    alert();
    return;
  }

  const editReponseForm = new EditResponseForm({ entity: response });

  const options = {
    form: editReponseForm,
  };
  options.title = "Edit Response (" + responseTitle + ")";
  options.dialogReturnValueCallback = OnCallbackFormEditResponse;

  ModalDialog.showModalDialog(options);
}

function m_fnReviewingResponse(activeViewers) {
  if (!m_bIsSiteOwner) {
    SP.UI.Notify.addNotification(
      "You do not have access to perform this action...",
      false
    );
    return;
  }

  alert("Reviewing!");
  activeViewers.pushCurrentUser();
}

async function m_fnViewResponseDoc(id, requestID, responseID) {
  m_bIsTransactionExecuting = true;

  const responseDoc = await appContext.AuditResponseDocs.FindById(id);
  const responseDocForm = FormManager.DispForm(responseDoc);

  const options = {
    form: responseDocForm,
  };

  options.title = "View Response Doc (ID:" + id + ")";
  options.height = "600";
  options.dialogReturnValueCallback = OnCallbackForm;

  ModalDialog.showModalDialog(options);
}

async function m_fnEditResponseDoc(id, requestID, responseID) {
  if (!m_bIsSiteOwner) {
    SP.UI.Notify.addNotification(
      "You do not have access to perform this action...",
      false
    );
    return;
  }

  m_bIsTransactionExecuting = true;
  const responseDoc = await appContext.AuditResponseDocs.FindById(id);
  const responseDocForm = new EditResponseDocForm({ entity: responseDoc });

  const options = {
    form: responseDocForm,
  };
  options.title = "Edit ResponseDoc (ID:" + id + ")";
  options.dialogReturnValueCallback = OnCallbackForm;

  ModalDialog.showModalDialog(options);
}

function m_fnCheckInResponseDoc(folder, fileName) {
  if (!m_bIsSiteOwner) {
    SP.UI.Notify.addNotification(
      "You do not have access to perform this action...",
      false
    );
    return;
  }

  m_bIsTransactionExecuting = true;

  var options = SP.UI.$create_DialogOptions();
  options.title = "Check in Response Document";
  options.height = "600";
  options.dialogReturnValueCallback = OnCallbackForm;

  options.url =
    Audit.Common.Utilities.GetSiteUrl() +
    "/_layouts/checkin.aspx?List={" +
    m_libResponseDocsLibraryGUID +
    "}&FileName=" +
    folder +
    "/" +
    fileName;

  SP.UI.ModalDialog.showModalDialog(options);
}

function m_fnViewResponseDocFolder(title) {
  m_bIsTransactionExecuting = true;

  var options = SP.UI.$create_DialogOptions();
  options.title = "View Response Folder";
  options.height = "600";
  options.dialogReturnValueCallback = OnCallbackForm;

  //if they delete a document in this window, we want them to return to the current page
  options.url =
    Audit.Common.Utilities.GetSiteUrl() +
    "/pages/AuditResponseDocs.aspx?RootFolder=" +
    Audit.Common.Utilities.GetSiteUrl() +
    "/" +
    Audit.Common.Utilities.GetLibNameResponseDocs() +
    "/" +
    title;
  //options.url = Audit.Common.Utilities.GetSiteUrl() + "/pages/AuditResponseDocs.aspx?RootFolder=" + Audit.Common.Utilities.GetSiteUrl() + "/" + Audit.Common.Utilities.GetLibNameResponseDocs() + "/" + title + GetSourceUrlForForms();
  //options.url = m_siteUrl + "/"+ m_libNameResponseDocs + "/" + title;
  //options.url = m_siteUrl + "/"+ m_libNameResponseDocs + "?RootFolder=" + m_siteUrl + "/"+ m_libNameResponseDocs + "/" + title;
  SP.UI.ModalDialog.showModalDialog(options);
}

function m_fnViewEmailHistoryFolder(reqNum) {
  m_bIsTransactionExecuting = true;

  var options = SP.UI.$create_DialogOptions();
  options.title = "View Email History";
  options.autoSize = true;
  options.dialogReturnValueCallback = OnCallbackForm;

  options.url =
    Audit.Common.Utilities.GetSiteUrl() +
    "/pages/AuditEmailHistory.aspx?RootFolder=" +
    Audit.Common.Utilities.GetSiteUrl() +
    "/Lists/" +
    Audit.Common.Utilities.GetListNameEmailHistory() +
    "/" +
    reqNum +
    GetSourceUrlForForms();

  SP.UI.ModalDialog.showModalDialog(options);
}

function m_fnDeleteResponseDoc(itemID) {
  if (!m_bIsSiteOwner) {
    SP.UI.Notify.addNotification(
      "You do not have access to perform this action...",
      false
    );
    return;
  }

  if (
    confirm("Are you sure you would like to Delete this Response Document?")
  ) {
    m_bIsTransactionExecuting = true;

    var currCtx = new SP.ClientContext();
    var responseDocsLib = currCtx
      .get_web()
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetLibNameResponseDocs());

    var oListItem = responseDocsLib.getItemById(itemID);
    oListItem.recycle();

    function OnSuccess(sender, args) {
      m_fnRefresh();
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

function m_fnResendRejectedResponseDocToQA(itemID) {
  if (!m_bIsSiteOwner) {
    SP.UI.Notify.addNotification(
      "You do not have access to perform this action...",
      false
    );
    return;
  }

  if (
    confirm(
      "Are you sure you would like to Update the Response Document status by clearing the Rejected status marked by QA?"
    )
  ) {
    m_bIsTransactionExecuting = true;

    var currCtx = new SP.ClientContext();
    var responseDocsLib = currCtx
      .get_web()
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetLibNameResponseDocs());

    var oListItem = responseDocsLib.getItemById(itemID);
    oListItem.set_item("DocumentStatus", "Submitted");
    oListItem.set_item("RejectReason", "");
    oListItem.update();

    function OnSuccess(sender, args) {
      m_fnRefresh();
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

//if request is closed, re-open request and reset perms
//reset perms on response
async function m_fnReOpenResponse(requestNumber, responseTitle) {
  if (!m_bIsSiteOwner) {
    SP.UI.Notify.addNotification(
      "You do not have access to perform this action...",
      false
    );
    return;
  }

  if (
    confirm(
      "Are you sure you would like to re-open this response (" +
        responseTitle +
        ")?"
    )
  ) {
    m_bIsTransactionExecuting = true;

    document.body.style.cursor = "wait";

    var currCtx2 = new SP.ClientContext.get_current();

    var oRequestBigMap = m_bigMap["request-" + requestNumber];
    if (oRequestBigMap) {
      for (var z = 0; z < oRequestBigMap.responses.length; z++) {
        //update the status of the response to open
        if (oRequestBigMap.responses[z].title == responseTitle) {
          oRequestBigMap.responses[z].item.set_item("ResStatus", "1-Open");
          oRequestBigMap.responses[z].item.update();
          await m_fnBreakResponseAndFolderPermissions(
            "ReOpened",
            oRequestBigMap.responses[z],
            false,
            true,
            false,
            false
          );

          break;
        }
      }

      //make sure the status of the request is open
      //Todo: check here if request was closed, that it's now Reopened. If it was closed or canceled, open it. if it was open, do nothing to request
      var oListItem = oRequestBigMap.item;
      var curRequestStatus = oListItem.get_item("ReqStatus");
      if (curRequestStatus == "Closed") {
        oListItem.set_item("ReqStatus", "ReOpened");
        oListItem.update();
      } else if (curRequestStatus != "Open") {
        oListItem.set_item("ReqStatus", "Open");
        oListItem.update();
      }

      await m_fnBreakRequestPermissions(oListItem, false);
    }

    currCtx2.executeQueryAsync(
      function () {
        setTimeout(function () {
          m_fnRefresh();
        }, 1000); //add delay on this so that the other requests can refresh permissions and it will display properly
      },
      function (sender, args) {
        alert(
          "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
        );
        setTimeout(function () {
          m_fnRefresh();
        }, 1000); //add delay on this so that the other requests can refresh permissions and it will display properly
      }
    );
  }
}

function m_fnCloseRequest() {
  if (!m_bIsSiteOwner) {
    SP.UI.Notify.addNotification(
      "You do not have access to perform this action...",
      false
    );
    return;
  }

  var requestNumberToClose = $("#ddlReqNum").val();

  if (
    confirm(
      "Are you sure you would like to Close this Request (" +
        requestNumberToClose +
        ")?"
    )
  ) {
    m_bIsTransactionExecuting = true;

    for (var x = 0; x < m_arrRequestsToClose.length; x++) {
      var oIt = m_arrRequestsToClose[x];
      var requestNumber = oIt.number;

      if (requestNumberToClose != requestNumber) continue;

      var closedDate = oIt.lastClosedDate;
      var closedBy = oIt.lastClosedBy;

      var oRequest = m_fnGetRequestByNumber(requestNumber);

      oRequest.item.set_item(
        "ClosedDate",
        oIt.oResponse.item.get_item("ClosedDate")
      );
      oRequest.item.set_item(
        "ClosedBy",
        oIt.oResponse.item.get_item("ClosedBy")
      );
      oRequest.item.set_item("ReqStatus", "Closed");

      oRequest.item.update();

      const m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
        "Information",
        "Please wait... updating permissions on the Request",
        100,
        600
      );
      //Removed 06/05/2017 m_fnBreakRequestPermissions( oRequest.item, true );
      m_fnBreakRequestPermissions(oRequest.item, false);

      //Added 06/05/2017
      //ensure this will always update the permissions
      var doneUpdatingResponses = false;
      m_fnUpdateAllResponsePermissions(
        "Closed",
        requestNumberToClose,
        true,
        function (doneUpdatingResponses) {
          if (doneUpdatingResponses) {
            setTimeout(function () {
              m_fnRefresh();
            }, 100);

            //defined in another function
            //m_fnUpdateEmailFolderPerms( requestNumberToClose, true );
          }
        }
      );

      break;
    }
  }
}

function m_fnDisplayHelpResponseDocs() {
  var helpDlg =
    "<div id='helpDlg' style='padding:20px; height:100px; width:700px'>" +
    "<div style='padding:20px;'><fieldset><legend>Response Document Status</legend> <ul style='padding-top:10px;'>" +
    "<li style='padding-top:5px;'><b>Open</b> - Uploaded by the Action Office but not yet submitted to the Internal Auditor</li>" +
    "<li style='padding-top:5px;'><b>Submitted</b> - Submitted to the Internal Auditor by the Action Office</li>" +
    "<li style='padding-top:5px;'><b>Sent to QA</b> - Submitted to the Quality Assurance team by the Internal Auditor</li>" +
    "<li style='padding-top:5px;'><b>Approved</b> - Approved by the Quality Assurance team and submitted to the External Auditor</li>" +
    "<li style='padding-top:5px;'><b>Rejected</b> - Rejected by the Quality Assurance team and returned to the Internal Auditor</li>" +
    "<li style='padding-top:5px;'><b>Archived</b> - Previously Rejected by the Quality Assurance team and is now read-only for record keeping</li>" +
    "</ul></fieldset></div>" +
    "<table style='padding-top:10px; width:200px; float:right;'>" +
    "<tr><td class='ms-separator'>&#160;</td><td><input id='btnCancel' type='button' class='ms-ButtonHeightWidth' value='Close' title='Close Help' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)'/></td></tr>" +
    "</table></div>";

  $("body").append(helpDlg);

  var options = SP.UI.$create_DialogOptions();
  options.title = "Response Documents Help";
  options.height = 300;
  options.dialogReturnValueCallback = OnCallbackForm;
  options.html = document.getElementById("helpDlg");
  SP.UI.ModalDialog.showModalDialog(options);
}

function m_fnGetRequestByNumber(requestNumber) {
  //this can be stale...
  var oRequest = null;
  oRequest = m_bigMap["request-" + requestNumber];
  return oRequest;
}

function m_fnGetRequestByID(requestID) {
  var oRequest = null;
  for (var y = 0; y < m_arrRequests.length; y++) {
    if (m_arrRequests[y].ID == requestID) {
      oRequest = m_arrRequests[y];
      break;
    }
  }

  return oRequest;
}

function m_fnFormatEmailBodyToAO(oRequest, responseTitles, poc) {
  var emailText =
    "<div>Audit Request Reference: <b>{REQUEST_NUMBER}</b></div>" +
    "<div>Audit Request Subject: <b>{REQUEST_SUBJECT}</b></div>" +
    "<div>Audit Request Due Date: <b>{REQUEST_DUEDATE}</b></div>" +
    "{POC}" +
    "{REQUEST_RELATEDAUDIT}<br/>" +
    "<div>Below are the listed action items that have been requested for the Audit: </div>" +
    "<div>{REQUEST_ACTIONITEMS}<br/></div>" +
    "<div>Please provide responses for the following Sample(s): </div><br/>" +
    "<div>{RESPONSE_TITLES}</div>";

  emailText = emailText.replace("{REQUEST_NUMBER}", oRequest.number);
  emailText = emailText.replace("{REQUEST_SUBJECT}", oRequest.subject);
  emailText = emailText.replace("{REQUEST_DUEDATE}", oRequest.internalDueDate);
  emailText = emailText.replace("{REQUEST_ACTIONITEMS}", oRequest.actionItems);

  if (poc == null || poc == "") emailText = emailText.replace("{POC}", "<br/>");
  else
    emailText = emailText.replace("{POC}", "<br/><b>POC: " + poc + "</b><br/>");

  if (responseTitles != null && responseTitles.length > 0) {
    function sortNumber(a, b) {
      a = parseInt(a.sample, 10);
      b = parseInt(b.sample, 10);

      return a - b;
    }
    responseTitles.sort(sortNumber);

    var responseTitleBody = "<ul>";
    for (var x = 0; x < responseTitles.length; x++) {
      responseTitleBody += "<li>" + responseTitles[x].title + "</li>";
    }
    responseTitleBody += "</ul>";
    emailText = emailText.replace("{RESPONSE_TITLES}", responseTitleBody);
  } else emailText = emailText.replace("{RESPONSE_TITLES}", "");

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
  return emailText;
}

// Synchronize email action offices with AO's
function m_fnSyncEmailActionOffices(requestID) {
  if (!m_bIsSiteOwner) {
    SP.UI.Notify.addNotification(
      "You do not have access to perform this action...",
      false
    );
    return;
  }

  if (
    confirm(
      "Are you sure you would like to replace all Email Action Offices with current Action Offices?"
    )
  ) {
    m_bIsTransactionExecuting = true;

    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    const oRequest = m_fnGetRequestByID(requestID);

    if (oRequest == null) {
      alert("Error occurred");
      return;
    }

    if (oRequest.status != "Open" && oRequest.status != "ReOpened") {
      SP.UI.Notify.addNotification("This request is not Open.", false);
      return;
    }

    //var arrActionOffice = new Array();
    var emailActionOffices = oRequest.item.get_item("ActionOffice");

    var requestList = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetListTitleRequests());
    const oListItem = requestList.getItemById(requestID);

    oListItem.set_item("EmailActionOffice", emailActionOffices);
    oListItem.update();

    currCtx.executeQueryAsync(
      function () {
        SP.UI.Notify.addNotification("Email Action Offices Set. ", false);
        setTimeout(function () {
          m_fnRefresh();
        }, 1000);
      },
      function (sender, args) {
        alert(
          "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
        );
        m_fnRefresh();
      }
    );
  }
}

function m_fnSendEmail(requestID) {
  if (!m_bIsSiteOwner) {
    SP.UI.Notify.addNotification(
      "You do not have access to perform this action...",
      false
    );
    return;
  }

  if (
    confirm(
      "Are you sure you would like to notify all Action Offices listed in the Email Action Offices field?"
    )
  ) {
    m_bIsTransactionExecuting = true;

    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    const oRequest = m_fnGetRequestByID(requestID);

    if (oRequest == null) {
      alert("Error occurred");
      return;
    }

    if (oRequest.status != "Open" && oRequest.status != "ReOpened") {
      SP.UI.Notify.addNotification("This request is not Open.", false);
      return;
    }

    var responseCount = oRequest.responses.length;
    if (responseCount == 0) {
      SP.UI.Notify.addNotification(
        "There are no responses associated with this request.",
        false
      );
      return;
    }

    var arrEmailActionOffice = new Array();
    var emailActionOffices = oRequest.item.get_item("EmailActionOffice");
    for (var x = 0; x < emailActionOffices.length; x++) {
      arrEmailActionOffice.push(emailActionOffices[x].get_lookupValue());
    }

    if (arrEmailActionOffice.length == 0) {
      SP.UI.Notify.addNotification(
        "Unable to send an email. 0 Action Offices listed in the Email Action Office field",
        false
      );
      return;
    }

    var arrEmails = new Array();

    for (var y = 0; y < responseCount; y++) {
      var oResponse = oRequest.responses[y];
      if (
        oResponse.resStatus != "1-Open" &&
        oResponse.resStatus != "3-Returned to Action Office"
      ) {
        SP.UI.Notify.addNotification(
          "Skipping Response (" +
            oResponse.title +
            "). It's not Open or Returned to Action Office",
          false
        );
        continue;
      }

      var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName(
        oResponse.actionOffice
      );
      var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup(
        actionOfficeGroupName
      );

      if (
        actionOfficeGroupName == "" ||
        actionOfficeGroupName == null ||
        actionOfficeGroup == null
      ) {
        SP.UI.Notify.addNotification(
          "Unable to send an email. Action Office (" +
            oResponse.actionOffice +
            ") does not have a group associated with it",
          false
        );
        return;
      }

      //Iterate through the aos listed in the email action office field and if it matches this AO, then continue to create email for this AO
      var bAddThisAO = false;
      for (var x = 0; x < arrEmailActionOffice.length; x++) {
        if (arrEmailActionOffice[x] == oResponse.actionOffice) {
          bAddThisAO = true;
          break;
        }
      }

      if (bAddThisAO) {
        //this means that this response's ao is in the email action offices field for this request and this ao should get a unique email with all the open responses
        var ao = actionOfficeGroupName;
        if (oResponse.poc != null && oResponse.poc != "")
          //if poc field is provided, email the poc and poccc, not the Action office group
          ao = oResponse.poc + ";" + oResponse.pocCC;

        var bFound = false;
        for (var x = 0; x < arrEmails.length; x++) {
          if (arrEmails[x].actionOffice == ao) {
            var oResSample = new Object();
            oResSample["sample"] = oResponse.sample;
            oResSample["title"] = oResponse.title;
            arrEmails[x].responseTitles.push(oResSample);
            bFound = true;
          }
        }

        if (!bFound) {
          var emailObject = new Object();
          emailObject.actionOffice = ao;
          emailObject.poc = oResponse.poc;
          emailObject.responseTitles = new Array();

          var oResSample = new Object();
          oResSample["sample"] = oResponse.sample;
          oResSample["title"] = oResponse.title;

          emailObject.responseTitles.push(oResSample);
          arrEmails.push(emailObject);
        }
      }
    }

    if (arrEmails.length == 0) {
      SP.UI.Notify.addNotification(
        "Unable to send an email. 0 Action Offices in the Email Action Office field match the Responses",
        false
      );
      return;
    }

    const m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
      "Sending Emails",
      "Please wait... sending email notifications to Action Offices",
      100,
      400
    );

    document.body.style.cursor = "wait";

    var emailList = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory());

    var emailListQuery = new SP.CamlQuery();
    emailListQuery.set_viewXml(
      '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>'
    );
    const emailListFolderItems = emailList.getItems(emailListQuery);
    currCtx.load(emailListFolderItems, "Include(ID, Title, DisplayName)");

    function OnSuccess(sender, args) {
      const m_emailCount = arrEmails.length;
      var cnt = 0;
      for (var y = 0; y < m_emailCount; y++) {
        var emailSubject =
          "Your Response Has Been Requested for Request Number: " +
          oRequest.number;
        var emailText = m_fnFormatEmailBodyToAO(
          oRequest,
          arrEmails[y].responseTitles,
          arrEmails[y].poc
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
        const oListItem = emailList.addItem(itemCreateInfo);
        oListItem.set_item("Title", emailSubject);
        oListItem.set_item("Body", emailText);
        oListItem.set_item("To", arrEmails[y].actionOffice);
        oListItem.set_item("ReqNum", oRequest.number);
        oListItem.set_item("NotificationType", "AO Notification");
        oListItem.update();

        currCtx.executeQueryAsync(
          function () {
            cnt++;
            if (cnt == m_emailCount) {
              document.body.style.cursor = "default";

              var requestList = web
                .get_lists()
                .getByTitle(Audit.Common.Utilities.GetListTitleRequests());
              const oListItem = requestList.getItemById(requestID);
              oListItem.set_item("EmailSent", 1);
              oListItem.update();

              currCtx.executeQueryAsync(
                function () {
                  SP.UI.Notify.addNotification(
                    "Email Sent to Action Offices. ",
                    false
                  );
                  setTimeout(function () {
                    m_fnRefresh();
                  }, 1000);
                },
                function (sender, args) {
                  alert(
                    "Request failed: " +
                      args.get_message() +
                      "\n" +
                      args.get_stackTrace()
                  );
                  m_fnRefresh();
                }
              );
            }
          },
          function (sender, args) {
            document.body.style.cursor = "default";

            alert(
              "Request failed: " +
                args.get_message() +
                "\n" +
                args.get_stackTrace()
            );
            m_fnRefresh();
          }
        );
      }
    }
    function OnFailure(sender, args) {
      document.body.style.cursor = "default";
      alert(
        "Request failed. " + args.get_message() + "\n" + args.get_stackTrace()
      );
    }

    currCtx.executeQueryAsync(OnSuccess, OnFailure);
  }
}

var m_cntResponseDocsSensToUpdate = 0;
var m_cntResponseDocsSensUpdated = 0;
function m_fnUpdateSensitivityOnRequest(
  requestNumber,
  requestSensitivity,
  oldSensitivity,
  OnComplete
) {
  m_cntResponseDocsSensToUpdate = 0;
  m_cntResponseDocsSensUpdated = 0;

  var currCtx = new SP.ClientContext.get_current();
  var web = currCtx.get_web();

  var responseDocsLib = web
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
  var responseDocsQuery = new SP.CamlQuery();
  responseDocsQuery.set_viewXml(
    '<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name="ReqNum"/><Value Type="Text">' +
      requestNumber +
      '</Value></Eq><Eq><FieldRef Name="ContentType"/><Value Type="Text">Document</Value></Eq></And></Where></Query></View>'
  );
  const responseDocsItems = responseDocsLib.getItems(responseDocsQuery);
  currCtx.load(
    responseDocsItems,
    "Include(ID, ReqNum, ResID, DocumentStatus, FileLeafRef, Created )"
  );

  var earesponseDocsLib = web
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocsEA());
  var earesponseDocsQuery = new SP.CamlQuery();
  earesponseDocsQuery.set_viewXml(
    '<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name="RequestNumber"/><Value Type="Text">' +
      requestNumber +
      '</Value></Eq><Eq><FieldRef Name="ContentType"/><Value Type="Text">Document</Value></Eq></And></Where></Query></View>'
  );
  const earesponseDocsItems = earesponseDocsLib.getItems(earesponseDocsQuery);
  currCtx.load(
    earesponseDocsItems,
    "Include(ID, RequestNumber, ResponseID, FileLeafRef)"
  );

  var requestDocLib = web
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetLibTitleRequestDocs());
  var requestDocQuery = new SP.CamlQuery();
  requestDocQuery.set_viewXml(
    '<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="ReqNum"/><Value Type="Text">' +
      requestNumber +
      "</Value></Eq></Where></Query></View>"
  );
  const requestDocItems = requestDocLib.getItems(requestDocQuery);
  currCtx.load(
    requestDocItems,
    "Include(ID, Title, ReqNum, FileLeafRef, FileDirRef)"
  );

  var coverSheetLib = web
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetLibTitleCoverSheets());
  var coverSheetQuery = new SP.CamlQuery();
  coverSheetQuery.set_viewXml(
    '<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="ReqNum"/><Value Type="Text">' +
      requestNumber +
      "</Value></Eq></Where></Query></View>"
  );
  const coverSheetItems = coverSheetLib.getItems(coverSheetQuery);
  currCtx.load(
    coverSheetItems,
    "Include(ID, Title, ReqNum, ActionOffice, FileLeafRef, FileDirRef)"
  );

  function OnSuccessUpdateSensiLoadDocs(sender, args) {
    var listItemEnumerator = responseDocsItems.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      var oListItem = listItemEnumerator.get_current();
      var docStatus = oListItem.get_item("DocumentStatus");
      if (docStatus != "Open" && docStatus != "Submitted") {
        m_cntResponseDocsSensToUpdate++;
      }
    }

    var listItemEnumerator = earesponseDocsItems.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      m_cntResponseDocsSensToUpdate++;
    }

    var listItemEnumerator = requestDocItems.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      m_cntResponseDocsSensToUpdate++;
    }

    var listItemEnumerator = coverSheetItems.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      m_cntResponseDocsSensToUpdate++;
    }

    if (m_cntResponseDocsSensToUpdate == 0) {
      this.OnComplete(true);
    } else {
      //update the names in the response document folders
      var listItemEnumerator = responseDocsItems.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        var docStatus = oListItem.get_item("DocumentStatus");
        if (docStatus != "Open" && docStatus != "Submitted") {
          var responseTitle = oListItem.get_item("ResID");
          if (responseTitle) responseTitle = responseTitle.get_lookupValue();

          var curFileName = oListItem.get_item("FileLeafRef");
          var newFileName = m_fnGetNewResponseDocTitle(
            oListItem,
            responseTitle,
            requestSensitivity
          );
          oListItem.set_item("FileLeafRef", newFileName);
          oListItem.update();

          function OnSuccessUpdateSensitivityResponseDoc(sender, args) {
            m_cntResponseDocsSensUpdated++;
            if (m_cntResponseDocsSensUpdated == m_cntResponseDocsSensToUpdate) {
              this.OnComplete(true);
            }
          }
          function OnFailureUpdateSensitivityResponseDoc(sender, args) {
            alert(
              "Error occurred updating sensitivity title on Response document: " +
                this.curFileName +
                " to " +
                this.newFileName +
                " " +
                args.get_message() +
                "\n" +
                args.get_stackTrace()
            );
            m_cntResponseDocsSensUpdated++;
            if (m_cntResponseDocsSensUpdated == m_cntResponseDocsSensToUpdate) {
              this.OnComplete(true);
            }
          }

          var data = {
            OnComplete: this.OnComplete,
            curFileName: curFileName,
            newFileName: newFileName,
          };
          currCtx.executeQueryAsync(
            Function.createDelegate(
              data,
              OnSuccessUpdateSensitivityResponseDoc
            ),
            Function.createDelegate(data, OnFailureUpdateSensitivityResponseDoc)
          );
        }
      }

      //update the names in the external auditors folders
      var listItemEnumerator2 = earesponseDocsItems.getEnumerator();
      while (listItemEnumerator2.moveNext()) {
        var oListItem = listItemEnumerator2.get_current();

        var curDocFileNameAndExt = oListItem.get_item("FileLeafRef");
        var curDocFileName = curDocFileNameAndExt.substring(
          0,
          curDocFileNameAndExt.lastIndexOf(".")
        );
        var curDocExt = curDocFileNameAndExt.replace(curDocFileName, "");

        //var curDocRequest = oListItem.get_item("RequestNumber");
        var curDocResponseTitle = oListItem.get_item("ResponseID");
        var dateStamp = curDocFileName.replace(curDocResponseTitle + "_", "");
        if (dateStamp.indexOf("_") >= 0) {
          //then it had some sensitivity
          dateStamp = dateStamp.substring(0, dateStamp.indexOf("_"));
        }

        var newFileName = "";

        if (
          requestSensitivity != null &&
          requestSensitivity != "" &&
          requestSensitivity != "None"
        )
          newFileName =
            curDocResponseTitle +
            "_" +
            dateStamp +
            "_" +
            requestSensitivity +
            curDocExt;
        else newFileName = curDocResponseTitle + "_" + dateStamp + curDocExt;

        if (newFileName != "") {
          oListItem.set_item("FileLeafRef", newFileName);
          oListItem.update();
        }

        function OnSuccessUpdateSensitivityEAResponseDoc(sender, args) {
          m_cntResponseDocsSensUpdated++;
          if (m_cntResponseDocsSensUpdated == m_cntResponseDocsSensToUpdate) {
            this.OnComplete(true);
          }
        }
        function OnFailureUpdateSensitivityEAResponseDoc(sender, args) {
          alert(
            "Error occurred updating sensitivity title on External Auditor Response document: " +
              this.curFileName +
              " to " +
              this.newFileName +
              " " +
              args.get_message() +
              "\n" +
              args.get_stackTrace()
          );

          m_cntResponseDocsSensUpdated++;
          if (m_cntResponseDocsSensUpdated == m_cntResponseDocsSensToUpdate) {
            this.OnComplete(true);
          }
        }

        var data = {
          OnComplete: this.OnComplete,
          curFileName: curDocFileNameAndExt,
          newFileName: newFileName,
        };
        currCtx.executeQueryAsync(
          Function.createDelegate(
            data,
            OnSuccessUpdateSensitivityEAResponseDoc
          ),
          Function.createDelegate(data, OnFailureUpdateSensitivityEAResponseDoc)
        );
      }

      if (oldSensitivity == null) oldSensitivity = "";

      //update the names in the request docs
      var listItemEnumerator3 = requestDocItems.getEnumerator();
      while (listItemEnumerator3.moveNext()) {
        var oListItem = listItemEnumerator3.get_current();
        var curDocFileNameAndExt = oListItem.get_item("FileLeafRef");
        var newFileName = m_fnGetNewFileNameForSensitivity(
          oListItem,
          oldSensitivity,
          requestSensitivity
        );
        if (newFileName != "") {
          oListItem.set_item("FileLeafRef", newFileName);
          oListItem.update();
        }

        function OnSuccessUpdateSensitivityRequestDoc(sender, args) {
          m_cntResponseDocsSensUpdated++;
          if (m_cntResponseDocsSensUpdated == m_cntResponseDocsSensToUpdate) {
            this.OnComplete(true);
          }
        }
        function OnFailureUpdateSensitivityRequestDoc(sender, args) {
          alert(
            "Error occurred updating sensitivity title on Request document: " +
              this.curFileName +
              " to " +
              this.newFileName +
              " " +
              args.get_message() +
              "\n" +
              args.get_stackTrace()
          );

          m_cntResponseDocsSensUpdated++;
          if (m_cntResponseDocsSensUpdated == m_cntResponseDocsSensToUpdate) {
            this.OnComplete(true);
          }
        }

        var data = {
          OnComplete: this.OnComplete,
          curFileName: curDocFileNameAndExt,
          newFileName: newFileName,
        };
        currCtx.executeQueryAsync(
          Function.createDelegate(data, OnSuccessUpdateSensitivityRequestDoc),
          Function.createDelegate(data, OnFailureUpdateSensitivityRequestDoc)
        );
      }

      //update the names in the coversheets docs
      var listItemEnumerator4 = coverSheetItems.getEnumerator();
      while (listItemEnumerator4.moveNext()) {
        var oListItem = listItemEnumerator4.get_current();
        var curDocFileNameAndExt = oListItem.get_item("FileLeafRef");
        var newFileName = m_fnGetNewFileNameForSensitivity(
          oListItem,
          oldSensitivity,
          requestSensitivity
        );
        if (newFileName != "") {
          oListItem.set_item("FileLeafRef", newFileName);
          oListItem.update();
        }

        function OnSuccessUpdateSensitivityCSDoc(sender, args) {
          m_cntResponseDocsSensUpdated++;
          if (m_cntResponseDocsSensUpdated == m_cntResponseDocsSensToUpdate) {
            this.OnComplete(true);
          }
        }
        function OnFailureUpdateSensitivityCSDoc(sender, args) {
          alert(
            "Error occurred updating sensitivity title on Coversheet document: " +
              this.curFileName +
              " to " +
              this.newFileName +
              " " +
              args.get_message() +
              "\n" +
              args.get_stackTrace()
          );

          m_cntResponseDocsSensUpdated++;
          if (m_cntResponseDocsSensUpdated == m_cntResponseDocsSensToUpdate) {
            this.OnComplete(true);
          }
        }

        var data = {
          OnComplete: this.OnComplete,
          curFileName: curDocFileNameAndExt,
          newFileName: newFileName,
        };
        currCtx.executeQueryAsync(
          Function.createDelegate(data, OnSuccessUpdateSensitivityCSDoc),
          Function.createDelegate(data, OnFailureUpdateSensitivityCSDoc)
        );
      }
    }
  }
  function OnFailureUpdateSensiLoadDocs(sender, args) {
    const statusId = SP.UI.Status.addStatus(
      "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
    );
    SP.UI.Status.setStatusPriColor(statusId, "red");
  }

  var data = { requestNumber: requestNumber, OnComplete: OnComplete };
  currCtx.executeQueryAsync(
    Function.createDelegate(data, OnSuccessUpdateSensiLoadDocs),
    Function.createDelegate(data, OnFailureUpdateSensiLoadDocs)
  );
}

function m_fnGetNewFileNameForSensitivity(
  oListItem,
  oldSensitivity,
  requestSensitivity
) {
  var newFileName = null;

  var curDocFileNameAndExt = oListItem.get_item("FileLeafRef");
  var curDocFileName = curDocFileNameAndExt.substring(
    0,
    curDocFileNameAndExt.lastIndexOf(".")
  );
  var curDocExt = curDocFileNameAndExt.replace(curDocFileName, "");

  newFileName = curDocFileName;
  if (oldSensitivity != null && oldSensitivity != "") {
    if (curDocFileName.endsWith("_" + oldSensitivity)) {
      newFileName = newFileName.replace("_" + oldSensitivity, "");
    }
  }

  if (
    requestSensitivity != null &&
    requestSensitivity != "" &&
    requestSensitivity != "None"
  ) {
    if (!curDocFileName.endsWith("_" + requestSensitivity))
      newFileName = newFileName + "_" + requestSensitivity;
  }

  return newFileName;
}

var m_cntAOToAddToEmailFolder = 0;
var m_cntAOAddedToEmailFolder = 0;
function m_fnBreakEmailFolderPermissions(
  oListItem,
  oRequestItem,
  refreshPageOnUpdate,
  OnComplete
) {
  var currCtx = new SP.ClientContext.get_current();
  var web = currCtx.get_web();

  const currentUser = web.get_currentUser();
  const ownerGroup = web.get_associatedOwnerGroup();
  const memberGroup = web.get_associatedMemberGroup();
  const visitorGroup = web.get_associatedVisitorGroup();

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

  var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup(
    Audit.Common.Utilities.GetGroupNameQA()
  );
  if (spGroupQA != null)
    oListItem
      .get_roleAssignments()
      .add(spGroupQA, roleDefBindingCollRestrictedContribute);

  oListItem.get_roleAssignments().getByPrincipal(currentUser).deleteObject();

  function onUpdateEmailFolderPermsSucceeed() {
    if (this.oRequestItem) {
      //add action offices
      var arrActionOffice = this.oRequestItem.get_item("ActionOffice");
      if (arrActionOffice != null && arrActionOffice.length > 0) {
        for (var x = 0; x < arrActionOffice.length; x++) {
          var actionOfficeName = arrActionOffice[x].get_lookupValue();

          var actionOfficeGroupName =
            Audit.Common.Utilities.GetAOSPGroupName(actionOfficeName);
          var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup(
            actionOfficeGroupName
          );

          if (actionOfficeGroup != null) {
            m_cntAOToAddToEmailFolder++;

            var currCtx2 = new SP.ClientContext.get_current();
            var web2 = currCtx.get_web();

            var roleDefBindingCollRestrictedContribute =
              SP.RoleDefinitionBindingCollection.newObject(currCtx2);
            roleDefBindingCollRestrictedContribute.add(
              web2.get_roleDefinitions().getByName("Restricted Contribute")
            );

            this.oListItem
              .get_roleAssignments()
              .add(actionOfficeGroup, roleDefBindingCollRestrictedContribute);

            function onAOAddedToEmailFolderSucceeded() {
              m_cntAOAddedToEmailFolder++;

              if (m_cntAOAddedToEmailFolder == m_cntAOToAddToEmailFolder) {
                if (this.refreshPage) m_fnRefresh();
                else if (this.OnComplete) this.OnComplete(true);
              }
            }
            function onAOAddedToEmailFolderFailed(sender, args) {
              m_cntAOAddedToEmailFolder++;

              if (m_cntAOAddedToEmailFolder == m_cntAOToAddToEmailFolder) {
                if (this.refreshPage) m_fnRefresh();
                else if (this.OnComplete) this.OnComplete(true); //log and continue execution
              }
            }

            var data = {
              refreshPage: this.refreshPage,
              OnComplete: this.OnComplete,
            };
            currCtx2.executeQueryAsync(
              Function.createDelegate(data, onAOAddedToEmailFolderSucceeded),
              Function.createDelegate(data, onAOAddedToEmailFolderFailed)
            );
          }
        }
      } else {
        if (this.refreshPage) m_fnRefresh();
        else if (this.OnComplete) this.OnComplete(true);
      }
    }
  }

  function onUpdateEmailFolderPermsFailed(sender, args) {
    if (this.refreshPage) {
      setTimeout(function () {
        m_fnRefresh();
      }, 500);
    } else if (this.OnComplete) {
      OnComplete(false);
    }
  }

  var data = {
    title: oListItem.get_item("Title"),
    refreshPage: refreshPageOnUpdate,
    oListItem: oListItem,
    oRequestItem: oRequestItem,
    OnComplete: OnComplete,
  };
  currCtx.executeQueryAsync(
    Function.createDelegate(data, onUpdateEmailFolderPermsSucceeed),
    Function.createDelegate(data, onUpdateEmailFolderPermsFailed)
  );
}

var m_countCSToAdd = 0;
var m_countCSAdded = 0;

var oCntCSAOAdd = new Object();

function m_fnBreakCoversheetPermissionsOnSpecialPerms(
  currCtx,
  oListItem,
  addSpecialPerms,
  refreshPageOnUpdate,
  OnComplete
) {
  if (oListItem == null) return;

  var web = currCtx.get_web();

  this.currentUser = currCtx.get_web().get_currentUser();
  this.ownerGroup = web.get_associatedOwnerGroup();
  this.memberGroup = web.get_associatedMemberGroup();
  this.visitorGroup = web.get_associatedVisitorGroup();

  oListItem.resetRoleInheritance();
  oListItem.breakRoleInheritance(false, false);

  var qaHasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
    oListItem,
    Audit.Common.Utilities.GetGroupNameQA(),
    SP.PermissionKind.viewListItems
  );

  var roleDefBindingCollAdmin =
    SP.RoleDefinitionBindingCollection.newObject(currCtx);
  roleDefBindingCollAdmin.add(
    currCtx.get_web().get_roleDefinitions().getByType(SP.RoleType.administrator)
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
  oListItem.get_roleAssignments().add(this.ownerGroup, roleDefBindingCollAdmin);
  oListItem
    .get_roleAssignments()
    .add(this.memberGroup, roleDefBindingCollContribute);
  oListItem
    .get_roleAssignments()
    .add(this.visitorGroup, roleDefBindingCollRestrictedRead);

  if (qaHasRead) {
    //make sure qa gets read if it had access
    var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup(
      Audit.Common.Utilities.GetGroupNameQA()
    );
    if (spGroupQA != null)
      oListItem
        .get_roleAssignments()
        .add(spGroupQA, roleDefBindingCollRestrictedRead);
  }

  if (addSpecialPerms) {
    //make sure qa gets read if it had access
    var group1SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
      Audit.Common.Utilities.GetGroupNameSpecialPerm1()
    );
    if (group1SpecialPerm != null)
      oListItem
        .get_roleAssignments()
        .add(group1SpecialPerm, roleDefBindingCollRestrictedRead);

    var group2SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
      Audit.Common.Utilities.GetGroupNameSpecialPerm2()
    );
    if (group2SpecialPerm != null)
      oListItem
        .get_roleAssignments()
        .add(group2SpecialPerm, roleDefBindingCollRestrictedRead);
  }

  oListItem
    .get_roleAssignments()
    .getByPrincipal(this.currentUser)
    .deleteObject();

  function onUpdatedCSSPSucceeded() {
    var currCtx2 = new SP.ClientContext.get_current();

    //add action offices
    var arrActionOffice = this.oListItem.get_item("ActionOffice");

    if (arrActionOffice == null || arrActionOffice.length == 0) {
      if (this.OnComplete) this.OnComplete(true);
      return;
    }

    var csID = this.oListItem.get_item("ID");
    oCntCSAOAdd[csID + "toAdd"] = 0;
    oCntCSAOAdd[csID + "added"] = 0;

    for (var x = 0; x < arrActionOffice.length; x++) {
      var actionOfficeName = arrActionOffice[x].get_lookupValue();
      var actionOfficeGroupName =
        Audit.Common.Utilities.GetAOSPGroupName(actionOfficeName);
      var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup(
        actionOfficeGroupName
      );
      if (actionOfficeGroup != null) {
        oCntCSAOAdd[csID + "toAdd"] = oCntCSAOAdd[csID + "toAdd"] + 1;

        var roleDefBindingCollRestrictedRead =
          SP.RoleDefinitionBindingCollection.newObject(currCtx2);
        roleDefBindingCollRestrictedRead.add(
          currCtx2.get_web().get_roleDefinitions().getByName("Restricted Read")
        );

        this.oListItem
          .get_roleAssignments()
          .add(actionOfficeGroup, roleDefBindingCollRestrictedRead);

        function onUpdatedCSSPAOSucceeded() {
          oCntCSAOAdd[this.csID + "added"] =
            oCntCSAOAdd[this.csID + "added"] + 1;

          if (
            oCntCSAOAdd[this.csID + "added"] == oCntCSAOAdd[this.csID + "toAdd"]
          ) {
            if (this.OnComplete) this.OnComplete(true);
          }
        }
        function onUpdatedCSSPAOFailed(sender, args) {
          oCntCSAOAdd[this.csID + "added"] =
            oCntCSAOAdd[this.csID + "added"] + 1;

          if (
            oCntCSAOAdd[this.csID + "added"] == oCntCSAOAdd[this.csID + "toAdd"]
          ) {
            if (this.OnComplete) this.OnComplete(true);
          }
        }

        var data = {
          refreshPage: this.refreshPage,
          OnComplete: this.OnComplete,
          csID: csID,
        };
        currCtx2.executeQueryAsync(
          Function.createDelegate(data, onUpdatedCSSPAOSucceeded),
          Function.createDelegate(data, onUpdatedCSSPAOFailed)
        );
      }
    }
  }
  function onUpdatedCSSPFailed(sender, args) {
    if (this.OnComplete)
      //return true to continue execution
      this.OnComplete(true);
  }

  var data = { oListItem: oListItem, OnComplete: OnComplete };
  currCtx.executeQueryAsync(
    Function.createDelegate(data, onUpdatedCSSPSucceeded),
    Function.createDelegate(data, onUpdatedCSSPFailed)
  );
}

//This gets executed when on refresh if a response does not have broken permissions. When a new response is created from the list form, we
//cant set the permissions until it's been created. So, on callback, refresh is called and checks for responses that don't have broken permissions

//This gets executed when on refresh if a response does not have broken permissions. When a new response is created from the list form, we
//cant set the permissions until it's been created. So, on callback, refresh is called and checks for responses that don't have broken permissions
function m_fnBreakResponsePermissions(
  oListItem,
  refreshPageOnUpdate,
  checkStatus
) {
  if (!m_bIsSiteOwner) {
    return;
  }

  var currCtx = new SP.ClientContext.get_current();
  var web = currCtx.get_web();

  const currentUser = currCtx.get_web().get_currentUser();
  const ownerGroup = web.get_associatedOwnerGroup();
  const memberGroup = web.get_associatedMemberGroup();
  const visitorGroup = web.get_associatedVisitorGroup();

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
    currCtx.get_web().get_roleDefinitions().getByType(SP.RoleType.administrator)
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
  if (!m_bIsSiteOwner) {
    OnComplete(true);
    return;
  }

  var currCtx = new SP.ClientContext.get_current();
  var web = currCtx.get_web();

  const currentUser = currCtx.get_web().get_currentUser();
  const ownerGroup = web.get_associatedOwnerGroup();
  const memberGroup = web.get_associatedMemberGroup();
  const visitorGroup = web.get_associatedVisitorGroup();

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
    qaHasRead = false;
    special1HasRead = false;
    special2HasRead = false;
  }

  oListItemFolder.resetRoleInheritance();
  oListItemFolder.breakRoleInheritance(false, false);

  var roleDefBindingCollAdmin =
    SP.RoleDefinitionBindingCollection.newObject(currCtx);
  roleDefBindingCollAdmin.add(
    currCtx.get_web().get_roleDefinitions().getByType(SP.RoleType.administrator)
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
    (oListItemResponse.get_item("ResStatus") == "4-Approved for QA" ||
      oListItemResponse.get_item("ResStatus") == "6-Reposted After Rejection" ||
      oListItemResponse.get_item("ResStatus") == "7-Closed")
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
    (oListItemResponse.get_item("ResStatus") == "4-Approved for QA" ||
      oListItemResponse.get_item("ResStatus") == "6-Reposted After Rejection" ||
      oListItemResponse.get_item("ResStatus") == "7-Closed")
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

var m_countAOSPToAdd = 0;
var m_countAOSPAdded = 0;
function m_fnGrantAOSpecialPermsOnRequest(oRequest, OnComplete) {
  if (oRequest == null) {
    if (OnComplete) OnComplete(true);
    return;
  }

  m_countAOSPToAdd = 0;
  m_countAOSPAdded = 0;

  //add action offices to request
  var arrActionOffice = oRequest.item.get_item("ActionOffice");

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
      m_countAOSPToAdd++;

      var currCtx2 = new SP.ClientContext.get_current();
      var web = currCtx2.get_web();

      var roleDefBindingCollRestrictedRead =
        SP.RoleDefinitionBindingCollection.newObject(currCtx2);
      roleDefBindingCollRestrictedRead.add(
        currCtx2.get_web().get_roleDefinitions().getByName("Restricted Read")
      );

      oRequest.item
        .get_roleAssignments()
        .add(actionOfficeGroup, roleDefBindingCollRestrictedRead);

      function onGrantAOSpecialPermsSucceeded() {
        m_countAOSPAdded++;

        $("#divGrantCntr").text(
          "Ensured " +
            m_countAOSPAdded +
            " of " +
            m_countAOSPToAdd +
            " Action Offices have permissions to Request"
        );
        if (m_countAOSPAdded == m_countAOSPToAdd) {
          if (this.OnComplete) this.OnComplete(true);
        }
      }
      function onGrantAOSpecialPermsFailed(sender, args) {
        m_countAOSPAdded++;

        $("#divGrantCntr").text(
          "Ensured " +
            m_countAOSPAdded +
            " of " +
            m_countAOSPToAdd +
            " Action Offices have permissions to Request"
        );
        if (m_countAOSPAdded == m_countAOSPToAdd) {
          if (this.OnComplete) this.OnComplete(true);
        }
      }

      var data = { OnComplete: OnComplete };
      currCtx2.executeQueryAsync(
        Function.createDelegate(data, onGrantAOSpecialPermsSucceeded),
        Function.createDelegate(data, onGrantAOSpecialPermsFailed)
      );
    }
  }
}

function m_fnGrantSpecialPermsOnCS(
  oRequest,
  currCtx,
  addSpecialPerms,
  OnComplete
) {
  m_countCSToAdd = 0;
  m_countCSAdded = 0;

  if (
    oRequest == null ||
    oRequest.coversheets == null ||
    oRequest.coversheets.length == 0
  ) {
    if (OnComplete) OnComplete(true);
    return;
  }

  oCntCSAOAdd = new Object();

  //Update coversheets to give special permissions access
  for (var x = 0; x < oRequest.coversheets.length; x++) {
    var coversheetItem = oRequest.coversheets[x].item;
    if (coversheetItem) {
      m_countCSToAdd++;

      var bDoneBreakingCSPermsOnSpecialPerms = false;
      m_fnBreakCoversheetPermissionsOnSpecialPerms(
        currCtx,
        coversheetItem,
        addSpecialPerms,
        false,
        function (bDoneBreakingCSPermsOnSpecialPerms) {
          if (bDoneBreakingCSPermsOnSpecialPerms) {
            m_countCSAdded++;
            $("#divGrantCntr").text(
              "Updated " +
                m_countCSAdded +
                " of " +
                m_countCSToAdd +
                " Coversheet permissions"
            );
          } else {
            m_countCSAdded++; //log here, but continue executing
            $("#divGrantCntr").text(
              "Updated " +
                m_countCSAdded +
                " of " +
                m_countCSToAdd +
                " Coversheet permissions"
            );
          }

          if (m_countCSAdded == m_countCSToAdd) {
            if (OnComplete) OnComplete(true);
          }
        }
      );
    }
  }
}

var m_countSPResFolderToAdd = 0;
var m_countSPResFolderAdded = 0;
async function m_fnGrantSpecialPermsOnResponseAndFolder(
  oRequest,
  addSpecialPerms,
  OnComplete
) {
  if (
    oRequest == null ||
    oRequest.responses == null ||
    oRequest.responses.length == 0
  ) {
    if (OnComplete) OnComplete(true);

    return;
  }

  for (var y = 0; y < oRequest.responses.length; y++) {
    var oResponse = oRequest.responses[y];
    if (
      oResponse.resStatus == "4-Approved for QA" ||
      oResponse.resStatus == "6-Reposted After Rejection" ||
      oResponse.resStatus == "7-Closed"
    ) {
      m_countSPResFolderToAdd++;

      var bBrokeResponseAndFolderPermissions = false;

      var bForceAdd = false;
      var bForceRemove = false;
      if (addSpecialPerms) bForceAdd = true;
      else bForceRemove = true;

      await m_fnBreakResponseAndFolderPermissions(
        oRequest.status,
        oResponse,
        false,
        true,
        bForceAdd,
        bForceRemove
      );

      m_countSPResFolderAdded++; //log here, but continue executing

      $("#divGrantCntr").text(
        "Updated " +
          m_countSPResFolderAdded +
          " of " +
          m_countSPResFolderToAdd +
          " Response permissions"
      );

      if (m_countSPResFolderAdded == m_countSPResFolderToAdd) {
        if (OnComplete) OnComplete(true);
      }
    }
  }
}

function m_fnGrantSpecialPermissions(requestNumber) {
  if (!m_bIsSiteOwner) {
    SP.UI.Notify.addNotification(
      "You do not have access to perform this action...",
      false
    );
    return;
  }

  //this can be stale...
  var oRequest = m_fnGetRequestByNumber(requestNumber);
  if (oRequest == null) return;

  m_bIsTransactionExecuting = true;

  var cntGranted = 0;
  var cntToGrant = 0;
  var responseCount = oRequest.responses.length;
  for (var y = 0; y < responseCount; y++) {
    var oResponse = oRequest.responses[y];

    if (
      oResponse.resStatus == "4-Approved for QA" ||
      oResponse.resStatus == "6-Reposted After Rejection" ||
      oResponse.resStatus == "7-Closed"
    ) {
      cntToGrant++;
    }
  }

  if (
    confirm(
      "Are you sure you would like to grant special permissions on this Request and to (" +
        cntToGrant +
        ") Responses?"
    )
  ) {
    const m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
      "Information",
      "Please wait... granting Special Permissions to Request and Responses <div id='divGrantCntr'></div>",
      200,
      600
    );

    var group1SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
      Audit.Common.Utilities.GetGroupNameSpecialPerm1()
    );
    var group2SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
      Audit.Common.Utilities.GetGroupNameSpecialPerm2()
    );

    var currCtx = SP.ClientContext.get_current();
    var web = currCtx.get_web();

    const currentUser = web.get_currentUser();
    const ownerGroup = web.get_associatedOwnerGroup();
    const memberGroup = web.get_associatedMemberGroup();
    const visitorGroup = web.get_associatedVisitorGroup();

    var qaHasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
      oRequest.item,
      Audit.Common.Utilities.GetGroupNameQA(),
      SP.PermissionKind.viewListItems
    );

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Update permissions to Request. everyone should get restricted read except for the associated member groups
    oRequest.item.resetRoleInheritance();
    oRequest.item.breakRoleInheritance(false, false);

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

    //add associated site groups to request
    oRequest.item
      .get_roleAssignments()
      .add(ownerGroup, roleDefBindingCollAdmin);
    oRequest.item
      .get_roleAssignments()
      .add(memberGroup, roleDefBindingCollContribute);
    oRequest.item
      .get_roleAssignments()
      .add(visitorGroup, roleDefBindingCollRestrictedRead);

    //add special permissions to request
    if (group1SpecialPerm != null)
      oRequest.item
        .get_roleAssignments()
        .add(group1SpecialPerm, roleDefBindingCollRestrictedRead);
    if (group2SpecialPerm != null)
      oRequest.item
        .get_roleAssignments()
        .add(group2SpecialPerm, roleDefBindingCollRestrictedRead);

    //make sure qa gets read on request if it previously had access
    if (qaHasRead) {
      var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameQA()
      );
      if (spGroupQA != null)
        oRequest.item
          .get_roleAssignments()
          .add(spGroupQA, roleDefBindingCollRestrictedRead);
    }

    oRequest.item
      .get_roleAssignments()
      .getByPrincipal(currentUser)
      .deleteObject();

    //on success, the request permissions will be updated, but now we have to update the ao permissions on the request one by one
    //do this to avoid resource exceeded error
    function onUpdated1() {
      var bDoneGrantingAOSpecialPerms = false;
      m_fnGrantAOSpecialPermsOnRequest(
        oRequest,
        function (bDoneGrantingAOSpecialPerms) {
          if (bDoneGrantingAOSpecialPerms) {
            var bDoneGrantingCSSpecialPerms = false;
            m_fnGrantSpecialPermsOnCS(
              oRequest,
              currCtx,
              true,
              function (bDoneGrantingCSSpecialPerms) {
                if (bDoneGrantingCSSpecialPerms) {
                  var responseCount = oRequest.responses.length;

                  if (responseCount == 0 || cntToGrant == 0) {
                    currCtx.executeQueryAsync(
                      function () {
                        document.body.style.cursor = "default";

                        notifyId = SP.UI.Notify.addNotification(
                          "Completed granting Special Permissions",
                          false
                        );
                        setTimeout(function () {
                          m_fnRefresh();
                        }, 200);
                      },
                      function (sender, args) {
                        document.body.style.cursor = "default";

                        notifyId = SP.UI.Notify.addNotification(
                          "Request failed1: " +
                            args.get_message() +
                            "\n" +
                            args.get_stackTrace(),
                          false
                        );
                        setTimeout(function () {
                          m_fnRefresh();
                        }, 200);
                      }
                    );
                    return;
                  } else {
                    //Update permissions responses - everyone should get restricted read, except for the associated member groups. action offices get contribute if open or returned to action office
                    var bDoneGrantingSpecialPermsOnResponsesAndFolders = false;
                    m_fnGrantSpecialPermsOnResponseAndFolder(
                      oRequest,
                      true,
                      function (
                        bDoneGrantingSpecialPermsOnResponsesAndFolders
                      ) {
                        if (bDoneGrantingSpecialPermsOnResponsesAndFolders) {
                          document.body.style.cursor = "default";

                          notifyId = SP.UI.Notify.addNotification(
                            "Completed granting Special Permissions",
                            false
                          );
                          setTimeout(function () {
                            m_fnRefresh();
                          }, 200);
                        } else {
                          document.body.style.cursor = "default";

                          notifyId = SP.UI.Notify.addNotification(
                            "Unable to update all responses and folders",
                            false
                          );
                          setTimeout(function () {
                            m_fnRefresh();
                          }, 200);
                        }
                      }
                    );
                  }
                }
              }
            );
          }
        }
      );
    }
    function onFailed1(sender, args) {}

    var data = { oRequest: oRequest };
    currCtx.executeQueryAsync(
      Function.createDelegate(data, onUpdated1),
      Function.createDelegate(data, onFailed1)
    );
  } else m_bIsTransactionExecuting = false;
}

function m_fnRemoveSpecialPermissions(id) {
  if (!m_bIsSiteOwner) {
    SP.UI.Notify.addNotification(
      "You do not have access to perform this action...",
      false
    );
    return;
  }

  //this can be stale...
  var oRequest = m_fnGetRequestByNumber(id);
  if (oRequest == null) return;

  m_bIsTransactionExecuting = true;

  var cntRemoved = 0;
  var cntToRemove = 0;
  var responseCount = oRequest.responses.length;
  for (var y = 0; y < responseCount; y++) {
    var oResponse = oRequest.responses[y];

    if (
      oResponse.resStatus == "4-Approved for QA" ||
      oResponse.resStatus == "6-Reposted After Rejection" ||
      oResponse.resStatus == "7-Closed"
    ) {
      cntToRemove++;
    }
  }

  if (
    confirm(
      "Are you sure you would like to remove special permissions on this Request and on (" +
        cntToRemove +
        ") Responses?"
    )
  ) {
    const m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
      "Information",
      "Please wait... removing Special Permissions on Request and Responses <div id='divGrantCntr'></div>",
      200,
      600
    );

    var currCtx = SP.ClientContext.get_current();
    var web = currCtx.get_web();

    const currentUser = web.get_currentUser();
    const ownerGroup = web.get_associatedOwnerGroup();
    const memberGroup = web.get_associatedMemberGroup();
    const visitorGroup = web.get_associatedVisitorGroup();

    var qaHasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
      oRequest.item,
      Audit.Common.Utilities.GetGroupNameQA(),
      SP.PermissionKind.viewListItems
    );

    var group1SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
      Audit.Common.Utilities.GetGroupNameSpecialPerm1()
    );
    var group2SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup(
      Audit.Common.Utilities.GetGroupNameSpecialPerm2()
    );

    oRequest.item.resetRoleInheritance();
    oRequest.item.breakRoleInheritance(false, false);

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

    //add site groups
    oRequest.item
      .get_roleAssignments()
      .add(ownerGroup, roleDefBindingCollAdmin);
    oRequest.item
      .get_roleAssignments()
      .add(memberGroup, roleDefBindingCollContribute);
    oRequest.item
      .get_roleAssignments()
      .add(visitorGroup, roleDefBindingCollRestrictedRead);

    if (qaHasRead) {
      //make sure qa gets read if it had access
      var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameQA()
      );
      if (spGroupQA != null)
        oRequest.item
          .get_roleAssignments()
          .add(spGroupQA, roleDefBindingCollRestrictedRead);
    }
    oRequest.item
      .get_roleAssignments()
      .getByPrincipal(currentUser)
      .deleteObject();

    //on success, the request permissions will be updated, but now we have to update the ao permissions on the request one by one
    //do this to avoid resource exceeded error
    function onUpdated1() {
      var bDoneGrantingAOSpecialPerms = false;
      m_fnGrantAOSpecialPermsOnRequest(
        oRequest,
        function (bDoneGrantingAOSpecialPerms) {
          if (bDoneGrantingAOSpecialPerms) {
            var bDoneGrantingCSSpecialPerms = false;
            m_fnGrantSpecialPermsOnCS(
              oRequest,
              currCtx,
              false,
              function (bDoneGrantingCSSpecialPerms) {
                if (bDoneGrantingCSSpecialPerms) {
                  var responseCount = oRequest.responses.length;

                  if (responseCount == 0 || cntToRemove == 0) {
                    currCtx.executeQueryAsync(
                      function () {
                        document.body.style.cursor = "default";

                        notifyId = SP.UI.Notify.addNotification(
                          "Completed removing Special Permissions",
                          false
                        );
                        setTimeout(function () {
                          m_fnRefresh();
                        }, 200);
                      },
                      function (sender, args) {
                        document.body.style.cursor = "default";

                        notifyId = SP.UI.Notify.addNotification(
                          "Request failed1: " +
                            args.get_message() +
                            "\n" +
                            args.get_stackTrace(),
                          false
                        );
                        setTimeout(function () {
                          m_fnRefresh();
                        }, 200);
                      }
                    );
                    return;
                  } else {
                    //Update permissions responses - everyone should get restricted read, except for the associated member groups. action offices get contribute if open or returned to action office
                    var bDoneGrantingSpecialPermsOnResponsesAndFolders = false;
                    m_fnGrantSpecialPermsOnResponseAndFolder(
                      oRequest,
                      false,
                      function (
                        bDoneGrantingSpecialPermsOnResponsesAndFolders
                      ) {
                        if (bDoneGrantingSpecialPermsOnResponsesAndFolders) {
                          document.body.style.cursor = "default";

                          notifyId = SP.UI.Notify.addNotification(
                            "Completed removing Special Permissions",
                            false
                          );
                          setTimeout(function () {
                            m_fnRefresh();
                          }, 200);
                        } else {
                          document.body.style.cursor = "default";

                          notifyId = SP.UI.Notify.addNotification(
                            "Unable to update all responses and folders",
                            false
                          );
                          setTimeout(function () {
                            m_fnRefresh();
                          }, 200);
                        }
                      }
                    );
                  }
                }
              }
            );
          }
        }
      );
    }
    function onFailed1(sender, args) {}

    var data = { oRequest: oRequest };
    currCtx.executeQueryAsync(
      Function.createDelegate(data, onUpdated1),
      Function.createDelegate(data, onFailed1)
    );
  } else m_bIsTransactionExecuting = false;
}

function GetSourceUrlForForms() {
  var curPath = location.pathname + "?";

  // var tabIndex = _myViewModel.tabs.selectedTab()?.id;

  // curPath += "?Tab=" + tabIndex;

  var requestNum = $("#ddlReqNum").val();
  if (requestNum != "") curPath += "%26ReqNum=" + requestNum;

  var source = "&Source=" + curPath;
  return source;
}

function OnCallbackForm(result, value) {
  if (result === SP.UI.DialogResult.OK) {
    //alert( value );
    m_fnRefresh();
  } else m_bIsTransactionExecuting = false;
}

function OnCallbackFormNewRequest(result, value) {
  if (result === SP.UI.DialogResult.OK) {
    const m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
      "Information",
      "Please wait... Updating Request Permissions",
      200,
      400
    );

    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    var requestList = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetListTitleRequests());
    var requestQuery = new SP.CamlQuery();
    requestQuery.set_viewXml(
      '<View><Query><OrderBy><FieldRef Name="ID" Ascending="FALSE"/></OrderBy></Query><RowLimit>1</RowLimit></View>'
    );
    const requestItems = requestList.getItems(requestQuery);
    //request status has internal name as response status in the request list
    currCtx.load(
      requestItems,
      "Include(ID, Title, ActionOffice, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
    );

    const emailList = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory());
    var emailListQuery = new SP.CamlQuery();
    emailListQuery.set_viewXml(
      '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>'
    );
    const emailListFolderItems = emailList.getItems(emailListQuery);
    currCtx.load(emailListFolderItems, "Include(ID, Title, DisplayName)");

    currCtx.executeQueryAsync(
      async function () {
        var oListItem = null;

        var listItemEnumerator = requestItems.getEnumerator();
        while (listItemEnumerator.moveNext()) {
          oListItem = listItemEnumerator.get_current();
          break;
        }

        if (oListItem) {
          m_fnCreateRequestInternalItem(oListItem.get_item("ID"));

          if (!oListItem.get_hasUniqueRoleAssignments()) {
            var bDoneBreakingReqPermisions = false;
            await m_fnBreakRequestPermissions(oListItem, false, null);
            var bDoneCreatingEmailFolder = false;
            Audit.Common.Utilities.CreateEmailFolder(
              emailList,
              oListItem.get_item("Title"),
              oListItem,
              function (bDoneCreatingEmailFolder) {
                _myViewModel.tabs.selectTab(_myViewModel.tabOpts.RequestDetail);
                m_fnRefresh(oListItem.get_item("Title"));
              }
            );
          } else {
            var bDoneCreatingEmailFolder = false;
            Audit.Common.Utilities.CreateEmailFolder(
              emailList,
              oListItem.get_item("Title"),
              oListItem,
              function (bDoneCreatingEmailFolder) {
                _myViewModel.tabs.selectTab(_myViewModel.tabOpts.RequestDetail);
                m_fnRefresh(oListItem.get_item("Title"));
              }
            );
          }
        }
      },
      function (sender, args) {
        //alert( "Request failed: "  + args.get_message() + "\n" + args.get_stackTrace() );
        m_fnRefresh();
      }
    );
  }
}

function m_fnCreateRequestInternalItem(requestNumber) {
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

async function m_fnUpdateAllResponsePermissions(
  requestStatus,
  requestNum,
  bCheckStatus,
  OnCompleteUpdateResponsePerms
) {
  var cntResponsesToBreak = 0;
  var cntResponsesBroken = 0;

  var oRequestBigMap = m_bigMap["request-" + requestNum];
  if (oRequestBigMap) {
    for (var z = 0; z < oRequestBigMap.responses.length; z++) {
      cntResponsesToBreak++;
      var doneBreakingResponse = false;
      await m_fnBreakResponseAndFolderPermissions(
        requestStatus,
        oRequestBigMap.responses[z],
        false,
        bCheckStatus,
        false,
        false
      );

      cntResponsesBroken++;
      $("#divMsgEditRequest").text(
        "Updated " +
          cntResponsesBroken +
          " of " +
          cntResponsesToBreak +
          " Response permissions"
      );
      if (cntResponsesBroken == cntResponsesToBreak) {
        OnCompleteUpdateResponsePerms(true);
      }
    }
  }

  if (cntResponsesToBreak == 0) {
    OnCompleteUpdateResponsePerms(true);
  }
}

//reset permissions on EA folder here
//rename all ea items
//rename all response docs
//rename all ea folders
//rename all ea docs

/*var folderPath = Audit.Common.Utilities.GetSiteUrl() + "/" + Audit.Common.Utilities.GetLibNameResponseDocs() + "/" + m_responseTitle;
var responseDocQuery2 = new SP.CamlQuery();
responseDocQuery2.set_viewXml('<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name=\'FileDirRef\'/><Value Type=\'Text\'>' + folderPath + '</Value></Eq><Eq><FieldRef Name=\'DocumentStatus\'/><Value Type=\'Text\'>Submitted</Value></Eq></And></Where></Query></View>');
responseDocSubmittedItems = responseDocLib.getItems( responseDocQuery2 );
currCtx.load(responseDocSubmittedItems, "Include(ID, DocumentStatus, FileDirRef)");
*/

function m_fnRenameResponses(oRequest, oldRrequestNumber, newRequestNumber) {
  for (var x = 0; x < oRequest.responses.length; x++) {
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    var title = oRequest.responses[x].title;
    var newTitle = title.replace(oldRrequestNumber, newRequestNumber);
    oRequest.responses[x].item.set_item("Title", newTitle);
    oRequest.responses[x].item.update();

    currCtx.executeQueryAsync(
      function () {},
      function (sender, args) {}
    );
  }
}

function m_fnRenameResponseFolders(
  responseDocsFoldersItems,
  oldRrequestNumber,
  newRequestNumber
) {
  var listItemEnumerator = responseDocsFoldersItems.getEnumerator();
  while (listItemEnumerator.moveNext()) {
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    var oListItemResponseDocFolder = listItemEnumerator.get_current();

    var itemName = oListItemResponseDocFolder.get_displayName();

    var test = itemName.replace(oldRrequestNumber, ""); //cant do an index test because there could be hyphens in the request number
    if (test.charAt(0) == "-") {
      var newTitle = itemName.replace(oldRrequestNumber, newRequestNumber);
      oListItemResponseDocFolder.set_item("FileLeafRef", newTitle);
      oListItemResponseDocFolder.set_item("Title", newTitle);
      oListItemResponseDocFolder.update();

      currCtx.executeQueryAsync(
        function () {},
        function (sender, args) {}
      );
    }
  }
}

function m_fnRenameEmailFolder(
  emailListFolderItems,
  oldRrequestNumber,
  newRequestNumber
) {
  //rename the EMail Folder
  var listItemEnumerator = emailListFolderItems.getEnumerator();
  while (listItemEnumerator.moveNext()) {
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    var oListItemEmailFolder = listItemEnumerator.get_current();

    var itemName = oListItemEmailFolder.get_displayName();
    if (oldRrequestNumber == itemName) {
      var newTitle = itemName.replace(oldRrequestNumber, newRequestNumber);
      oListItemEmailFolder.set_item("FileLeafRef", newTitle);
      oListItemEmailFolder.set_item("Title", newTitle);
      oListItemEmailFolder.update();

      currCtx.executeQueryAsync(
        function () {},
        function (sender, args) {}
      );
    }
  }
}

//rename the External Auditor response folder
function m_fnRenameEAFolder(
  eaListFolderItems,
  oldRrequestNumber,
  newRequestNumber
) {
  //rename the EA folder
  var listItemEnumerator = eaListFolderItems.getEnumerator();
  while (listItemEnumerator.moveNext()) {
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    var oListItemEAFolder = listItemEnumerator.get_current();

    var itemName = oListItemEAFolder.get_displayName();
    if (oldRrequestNumber == itemName) {
      var newTitle = itemName.replace(oldRrequestNumber, newRequestNumber);
      oListItemEAFolder.set_item("FileLeafRef", newTitle);
      oListItemEAFolder.set_item("Title", newTitle);
      oListItemEAFolder.update();

      currCtx.executeQueryAsync(
        function () {},
        function (sender, args) {}
      );
    }
  }
}

function OnCallbackFormEditRequest(result, value) {
  if (result === SP.UI.DialogResult.OK) {
    m_bIsTransactionExecuting = true;

    notifyId = SP.UI.Notify.addNotification("Please wait...", false);
    document.body.style.cursor = "wait";

    //alert( "must grant the new updated action offices permissions to this request");

    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    var requestList = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetListTitleRequests());
    var requestQuery = new SP.CamlQuery();
    requestQuery.set_viewXml(
      '<View><Query><Where><Eq><FieldRef Name="ID"/><Value Type="Text">' +
        m_itemID +
        "</Value></Eq></Where></Query></View>"
    );
    const requestItems = requestList.getItems(requestQuery);
    //request status has internal name as response status in the request list
    currCtx.load(
      requestItems,
      "Include(ID, Title, ActionOffice, ReqStatus, Sensitivity, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
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

    var eaList = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocsEA());
    var eaListQuery = new SP.CamlQuery();
    eaListQuery.set_viewXml(
      '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>'
    );
    const eaListFolderItems = eaList.getItems(eaListQuery);
    currCtx.load(eaListFolderItems, "Include(ID, Title, DisplayName)");

    async function onSuccess() {
      function m_fnUpdateEmailFolderPerms(requestNum, bRefresh) {
        var listItemEnumerator1 = emailListFolderItems.getEnumerator();
        while (listItemEnumerator1.moveNext()) {
          //reset action offices if they were changes in the request form
          var oEmailFolderItem = listItemEnumerator1.get_current();

          if (oEmailFolderItem.get_displayName() == requestNum) {
            m_fnBreakEmailFolderPermissions(
              oEmailFolderItem,
              oListItem,
              bRefresh
            );
            break;
          }
        }
      }

      var listItemEnumerator = requestItems.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        //reset action offices if they were changes in the request form
        var oListItem = listItemEnumerator.get_current();

        var curSensitivity = oListItem.get_item("Sensitivity");
        var bChangeSensitivity = false;
        if (m_bigMap["request-" + m_requestNum].sensitivity != curSensitivity) {
          bChangeSensitivity = true;
        }

        if (m_requestNum == oListItem.get_item("Title")) {
          //if request number hasn't changed
          const m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
            "Information",
            "Please wait... Updating Request and Response permissions <div id='divMsgEditRequest'></div>",
            200,
            400
          );

          var bDoneBreakingReqPermisions = false;
          await m_fnBreakRequestPermissions(oListItem, false, null);

          //should always be true even if an error occurred
          $("#divMsgEditRequest").text("Updated Request permissions");

          var doneUpdatingResponses = false;
          //m_fnUpdateAllResponsePermissions( oListItem.get_item("ReqStatus"), m_requestNum, this.responseDocsFoldersItems,  true, function( doneUpdatingResponses )
          m_fnUpdateAllResponsePermissions(
            oListItem.get_item("ReqStatus"),
            m_requestNum,
            true,
            function (doneUpdatingResponses) {
              if (doneUpdatingResponses) {
                if (!bChangeSensitivity)
                  m_fnUpdateEmailFolderPerms(m_requestNum, true);
                else {
                  $("#divMsgEditRequest").text(
                    "Updating Response document names"
                  );
                  var doneUpdatingSensitivity = false;
                  var oldSensitivity =
                    m_bigMap["request-" + m_requestNum].sensitivity;
                  m_fnUpdateSensitivityOnRequest(
                    m_requestNum,
                    curSensitivity,
                    oldSensitivity,
                    function (doneUpdatingSensitivity) {
                      if (doneUpdatingSensitivity) {
                        m_fnUpdateEmailFolderPerms(m_requestNum, true);
                      }
                    }
                  );
                }
              }
            }
          );
        } //if request number changed, update responses; otherwise it will refresh and not hit this
        else {
          const m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
            "Renaming Responses",
            "Please wait... Renaming Responses",
            200,
            400
          );

          var bDoneBreakingReqPermisions = false;
          await m_fnBreakRequestPermissions(oListItem, false, null);

          //should always be true even if an error occurred
          var oRequest = m_fnGetRequestByNumber(m_requestNum);

          var newRequestNumber = oListItem.get_item("Title");
          //TODO: break these up - may cause errors
          m_fnRenameResponses(oRequest, m_requestNum, newRequestNumber);
          m_fnRenameResponseFolders(
            m_ResponseDocsFoldersItems,
            m_requestNum,
            newRequestNumber
          );
          m_fnRenameEmailFolder(
            emailListFolderItems,
            m_requestNum,
            newRequestNumber
          );
          m_fnRenameEAFolder(eaListFolderItems, m_requestNum, newRequestNumber);

          setTimeout(function () {
            m_fnRefresh(newRequestNumber);
          }, 20000);
        }
      }
    }
    function onFail(sender, args) {
      m_fnRefresh();
    }

    var data = { requestItemId: m_itemID };
    currCtx.executeQueryAsync(
      Function.createDelegate(data, onSuccess),
      Function.createDelegate(data, onFail)
    );
  } else m_bIsTransactionExecuting = false;
}

function OnCallbackFormCoverSheet(result, value) {
  if (result === SP.UI.DialogResult.OK) {
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    var coversheetList = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetLibTitleCoverSheets());
    var coversheetQuery = new SP.CamlQuery();
    coversheetQuery.set_viewXml(
      '<View><Query><OrderBy><FieldRef Name="Modified" Ascending="FALSE"/></OrderBy></Query><RowLimit>1</RowLimit></View>'
    );
    const coversheetItems = coversheetList.getItems(coversheetQuery);
    currCtx.load(
      coversheetItems,
      "Include(ID, Title, ActionOffice, FileLeafRef, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
    );

    var requestSensitivity = m_bigMap["request-" + m_requestNum].sensitivity;

    currCtx.executeQueryAsync(
      async function () {
        var listItemEnumerator = coversheetItems.getEnumerator();
        var oListItem = null;
        while (listItemEnumerator.moveNext()) {
          oListItem = listItemEnumerator.get_current();
          break;
        }

        if (oListItem) {
          const m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(
            "Information",
            "Please wait... Updating permissions on Coversheet",
            200,
            600
          );

          if (
            requestSensitivity == null ||
            requestSensitivity == "" ||
            requestSensitivity == "None"
          ) {
            await m_fnBreakCoversheetPermissions(oListItem, false);
            m_fnRefresh();
          } else {
            var doneBreakingCS = false;
            await m_fnBreakCoversheetPermissions(oListItem, false);

            var newFileName = m_fnGetNewFileNameForSensitivity(
              oListItem,
              null,
              requestSensitivity
            );
            if (newFileName != "") {
              oListItem.set_item("FileLeafRef", newFileName);
              oListItem.update();
            }

            function OnSuccessUpdateSensitivityCS(sender, args) {
              m_fnRefresh();
            }
            function OnFailureUpdateSensitivityCS(sender, args) {
              alert("Error updating coversheet name with sensitivity");
              m_fnRefresh();
            }

            var data = { newFileName: newFileName };
            currCtx.executeQueryAsync(
              Function.createDelegate(data, OnSuccessUpdateSensitivityCS),
              Function.createDelegate(data, OnFailureUpdateSensitivityCS)
            );
          }
        }
      },
      function (sender, args) {
        //alert( "Request failed: "  + args.get_message() + "\n" + args.get_stackTrace() );
        m_fnRefresh();
      }
    );
  } else m_bIsTransactionExecuting = false;
}

function OnCallbackFormBulkAddResponse(result, value) {
  //this is a field on this page that gets updated by the bulkupdate page if a bulk update operation has run
  if ($("#divRanBulkUpdate").text() == 1) m_fnRefresh();
}

function OnCallbackFormBulkEditResponse(result, value) {
  //this is a field on this page that gets updated by the bulkupdate page if a bulk update operation has run
  if ($("#divRanBulkUpdate").text() == 1) m_fnRefresh();
}

function OnCallbackFormNewResponse(result, value) {
  if (result === SP.UI.DialogResult.OK) {
    //get last item inserted
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    var responseList = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetListTitleResponses());
    var responseQuery = new SP.CamlQuery();
    responseQuery.set_viewXml(
      '<View><Query><OrderBy><FieldRef Name="ID" Ascending="FALSE"/></OrderBy></Query><RowLimit>1</RowLimit></View>'
    );
    const responseItems = responseList.getItems(responseQuery);
    currCtx.load(
      responseItems,
      "Include(ID, Title, ActionOffice, ReqNum, ResStatus, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
    );

    currCtx.executeQueryAsync(
      function () {
        var oListItem = null;

        var listItemEnumerator = responseItems.getEnumerator();
        while (listItemEnumerator.moveNext()) {
          oListItem = listItemEnumerator.get_current();
          if (oListItem && !oListItem.get_hasUniqueRoleAssignments())
            m_fnBreakResponsePermissions(oListItem, false, true);

          break;
        }

        if (oListItem == null) return;

        var responseTitle = oListItem.get_item("Title");
        var requestNum = oListItem.get_item("ReqNum").get_lookupValue();

        const currentUser = currCtx.get_web().get_currentUser();
        const ownerGroup = currCtx.get_web().get_associatedOwnerGroup();
        const memberGroup = currCtx.get_web().get_associatedMemberGroup();
        const visitorGroup = currCtx.get_web().get_associatedVisitorGroup();

        var responseDocLib = currCtx
          .get_web()
          .get_lists()
          .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
        var itemCreateInfo = new SP.ListItemCreationInformation();
        itemCreateInfo.set_underlyingObjectType(SP.FileSystemObjectType.folder);
        itemCreateInfo.set_leafName(responseTitle);
        const oListFolderItem = responseDocLib.addItem(itemCreateInfo);
        oListFolderItem.set_item("Title", responseTitle);
        oListFolderItem.update();

        oListFolderItem.breakRoleInheritance(false, false);

        //add owner group
        var roleDefBindingColl =
          SP.RoleDefinitionBindingCollection.newObject(currCtx);
        roleDefBindingColl.add(
          currCtx
            .get_web()
            .get_roleDefinitions()
            .getByType(SP.RoleType.administrator)
        );
        oListFolderItem
          .get_roleAssignments()
          .add(ownerGroup, roleDefBindingColl);

        //add member group
        var roleDefBindingColl2 =
          SP.RoleDefinitionBindingCollection.newObject(currCtx);
        roleDefBindingColl2.add(
          currCtx
            .get_web()
            .get_roleDefinitions()
            .getByType(SP.RoleType.contributor)
        );
        oListFolderItem
          .get_roleAssignments()
          .add(memberGroup, roleDefBindingColl2);

        //add visitor group
        var roleDefBindingColl3 =
          SP.RoleDefinitionBindingCollection.newObject(currCtx);
        roleDefBindingColl3.add(
          currCtx.get_web().get_roleDefinitions().getByName("Restricted Read")
        );
        oListFolderItem
          .get_roleAssignments()
          .add(visitorGroup, roleDefBindingColl3);

        //add action office
        var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName(
          oListItem.get_item("ActionOffice").get_lookupValue()
        );
        var actionOfficeGroupObj = Audit.Common.Utilities.GetSPSiteGroup(
          actionOfficeGroupName
        );
        if (actionOfficeGroupObj != null) {
          var roleDefBindingColl4 =
            SP.RoleDefinitionBindingCollection.newObject(currCtx);
          roleDefBindingColl4.add(
            currCtx
              .get_web()
              .get_roleDefinitions()
              .getByName("Restricted Contribute")
          );
          oListFolderItem
            .get_roleAssignments()
            .add(actionOfficeGroupObj, roleDefBindingColl4);
        }

        //delete current logged in user from permissions because it gets added by default
        oListFolderItem
          .get_roleAssignments()
          .getByPrincipal(currentUser)
          .deleteObject();

        currCtx.executeQueryAsync(
          function () {
            m_fnRefresh();
          },
          function (sender, args) {
            //alert( "Request failed: "  + args.get_message() + "\n" + args.get_stackTrace() );
            m_fnRefresh();
          }
        );
      },
      function (sender, args) {
        //alert( "Request failed: "  + args.get_message() + "\n" + args.get_stackTrace() );
        m_fnRefresh();
      }
    );
  } else m_bIsTransactionExecuting = false;
}

var m_countCSToUpdateOnEditResponse = 0;
var m_countCSUpdatedOnEditResponse = 0;

function OnCallbackFormEditResponse(result, value) {
  m_countCSToUpdateOnEditResponse = 0;
  m_countCSUpdatedOnEditResponse = 0;

  if (result === SP.UI.DialogResult.OK) {
    document.body.style.cursor = "wait";
    notifyId = SP.UI.Notify.addNotification("Please wait... ", false);

    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    //get the response that was edited
    var responseList = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetListTitleResponses());
    var responseQuery = new SP.CamlQuery();
    responseQuery.set_viewXml(
      "<View><Query><FieldRef Name=\"Modified\" Ascending=\"FALSE\"/><Where><Eq><FieldRef Name='ID'/><Value Type='Text'>" +
        m_itemID +
        "</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>"
    );
    const responseItems = responseList.getItems(responseQuery);
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
    const responseFolderItems = responseDocLib.getItems(responseDocQuery);
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
    const responseDocSubmittedItems =
      responseDocLib.getItems(responseDocQuery2);
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
    const responseDocOpenItems = responseDocLib.getItems(responseDocQuery6);
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
    const responseDocMarkedForDeletionItems =
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
    const responseDocRejectedItems = responseDocLib.getItems(responseDocQuery4);
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
    const responseDocSentToQAItems = responseDocLib.getItems(responseDocQuery8);
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
    const emailListFolderItems = emailList.getItems(emailListQuery);
    currCtx.load(emailListFolderItems, "Include(ID, Title, DisplayName)");

    currCtx.executeQueryAsync(
      function () {
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

        async function onUpdated1Succeeded() {
          var currCtx2 = new SP.ClientContext.get_current();
          var web2 = currCtx2.get_web();

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
                "<div>Please provide responses for the following Sample(s): </div><br/>" +
                "<div>{RESPONSE_TITLES}</div>";

              var returnReason = this.oListItem.get_item("ReturnReason");
              if (returnReason == null) returnReason = "";
              else returnReason = "Return Reason: " + returnReason;

              emailText = emailText.replace("{RETURN_REASON}", returnReason);
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
            const oListItemEmail = emailList.addItem(itemCreateInfo);
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
                setTimeout(function () {
                  m_fnRefresh();
                }, 1000);
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
            //status changed
            var oRequest = m_fnGetRequestByNumber(m_requestNum);

            var oResponse = oRequest.responses.find(
              (response) => response.ID == this.oListItem.get_item("ID")
            );

            var bDoneBreakingReqPermisions = false;
            await m_fnBreakRequestPermissions(
              oRequest.item,
              false,
              this.oListItem.get_item("ResStatus")
            );

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
              const arrItemsToRecyle = new Array();

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

            const oResponseDocsForQA = oResponse.responseDocs.filter(
              (responseDoc) => {
                return ["Sent to QA", "Submitted", "Open"].includes(
                  responseDoc.documentStatus
                );
              }
            );

            await notifyQAApprovalPending(oRequest, oResponseDocsForQA);
            currCtx2.executeQueryAsync(
              async function () {
                // Break Coversheet permissions
                if (oRequest.coversheets?.length) {
                  await Promise.all(
                    oRequest.coversheets.map((coversheet) =>
                      m_fnBreakCoversheetPermissions(coversheet.item, true)
                    )
                  );
                }
                setTimeout(function () {
                  m_fnRefresh();
                }, 200);
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
            document.body.style.cursor = "default";
            setTimeout(function () {
              m_fnRefresh();
            }, 1000);
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
  } else {
    m_bIsTransactionExecuting = false;
  }
}

function m_fnGoToRequest(requestNumber, responseTitle) {
  const notifyId = SP.UI.Notify.addNotification(
    "Displaying Request (" + requestNumber + ")",
    false
  );

  m_sGoToResponseTitle = null;
  if (responseTitle != null && responseTitle != "")
    m_sGoToResponseTitle = responseTitle;

  _myViewModel.tabs.selectTab(_myViewModel.tabOpts.RequestDetail);

  if ($("#ddlReqNum").val() != requestNumber) {
    _myViewModel.filterRequestInfoTabRequestName(requestNumber);
  } else if (m_sGoToResponseTitle != null) {
    //need to navigate to tab 2 for this to work
    m_fnHighlightResponse();
  }
}

function BindActionOfficeHandler() {
  // Toggle 'View Action Offices' on requests table
  $(".actionOfficeContainer").click(function () {
    $(this)
      .parent()
      .find(".sr1-request-actionOffice-item")
      .toggleClass("collapsed");
  });
}

function BindHandlersOnLoad() {
  $(".warning").click(function () {
    $(this).parent().find("div").toggleClass("collapsed");
    $(this).parent().toggleClass("colorRedLegend");
  });
  BindActionOfficeHandler();

  // $("#linkSubmitNewReq").click(function () {
  //   m_fnCreateRequest();
  // });

  $(".linkHelpResponseDocs").click(function () {
    m_fnDisplayHelpResponseDocs();
  });

  BindPrintButton(
    "#btnPrint1",
    "#divStatusReportRequests",
    "Request Status Report"
  );
  BindPrintButton(
    "#btnPrint2",
    "#divStatusReportRespones",
    "Response Status Report"
  );

  //////////Note: for the export to work, make sure this is added to the html: <iframe id="CsvExpFrame" style="display: none"></iframe>
  BindExportButton(
    ".export1",
    "RequestStatusReport_",
    "tblStatusReportRequests"
  );
  BindExportButton(
    ".export2",
    "ResponseStatusReport_",
    "tblStatusReportResponses"
  );
}

function BindPrintButton(btnPrint, divTbl, pageTitle) {
  $(btnPrint).on("click", function () {
    PrintPage(pageTitle, divTbl);
  });
}

function BindExportButton(btnExport, fileNamePrefix, tbl) {
  $(btnExport).on("click", function (event) {
    var curDate = new Date().format("yyyyMMdd_hhmmtt");
    ExportToCsv(fileNamePrefix + curDate, tbl);
  });
}

function PrintPage(pageTitle, divTbl) {
  var curDate = new Date();
  var siteUrl = Audit.Common.Utilities.GetSiteUrl();
  var cssLink1 =
    siteUrl +
    "/siteassets/css/tablesorter/style.css?v=" +
    curDate.format("MM_dd_yyyy");
  var cssLink2 =
    siteUrl +
    "/siteAssets/css/Audit_Styles.css?v=" +
    curDate.format("MM_dd_yyyy");

  var divOutput = $(divTbl).html();

  //remove hyperlinks pointing to the job codes
  var updatedDivOutput = $("<div>").append(divOutput);
  updatedDivOutput.find(".sr1-request-requestNum a").each(function () {
    $(this).removeAttr("onclick");
    $(this).removeAttr("href");
  });

  updatedDivOutput.find(".sr2-response-requestNum a").each(function () {
    $(this).removeAttr("onclick");
    $(this).removeAttr("href");
  });

  divOutput = updatedDivOutput.html();

  var printDateString = curDate.format("MM/dd/yyyy hh:mm tt");
  printDateString =
    "<div style='padding-bottom:10px;'>" +
    printDateString +
    " - " +
    pageTitle +
    "</div>";

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
      ".hideOnPrint, .rowFilters, .actionOfficeContainer {display:none}" +
      "</style>\n" +
      "</HEAD>\n" +
      "<BODY>\n" +
      divOutput +
      "\n" +
      "</BODY>\n" +
      "</HTML>";

    var printWP = window.open("", "printWebPart");
    if (!printWP) {
      alert("No printWebPart!");
      return;
    }
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
function ExportToCsv(fileName, tableName, removeHeader) {
  var data = GetCellValues(tableName);

  if (!data) {
    alert("No data!");
    return;
  }

  if (removeHeader == true) data = data.slice(1);

  var csv = ConvertToCsv(data);
  //	console.log( csv );
  if (navigator.userAgent.search("Trident") >= 0) {
    window.CsvExpFrame.document.open("text/html", "replace");
    //		window.CsvExpFrame.document.open("application/csv", "replace");
    //		window.CsvExpFrame.document.charset = "utf-8";
    //		window.CsvExpFrame.document.open("application/ms-excel", "replace");
    window.CsvExpFrame.document.write(csv);
    window.CsvExpFrame.document.close();
    window.CsvExpFrame.focus();
    window.CsvExpFrame.document.execCommand("SaveAs", true, fileName + ".csv");
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

  if (!table) return;
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

  if (table.innerHTML.indexOf("actionOfficeContainer") >= 0) {
    var deets = $("<div>").append(table.outerHTML);
    deets.find(".actionOfficeContainer").each(function () {
      $(this).remove();
    });

    deets.find(".sr1-request-actionOffice-item").each(function () {
      var curText = $(this).text() + ", ";

      $(this).text(curText);
    });

    table = deets.find("table")[0];
  }

  var tableArray = [];
  for (var r = 0, n = table.rows.length; r < n; r++) {
    tableArray[r] = [];
    for (var c = 0, m = table.rows[r].cells.length; c < m; c++) {
      var text =
        table.rows[r].cells[c].textContent || table.rows[r].cells[c].innerText;
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
