import "../../common/knockout_extensions.js";

var Audit = window.Audit || {};
Audit.SPReport = Audit.SPReport || {};

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
  Audit.SPReport.Report = new Audit.SPReport.NewReportPage();
  Audit.SPReport.Init();
}

Audit.SPReport.Init = function () {
  var paramShowSiteActionsToAnyone = GetUrlKeyValue("ShowSiteActions");
  if (paramShowSiteActionsToAnyone != true) {
    //hide it even for owners unless this param is passed into the URL; pass in param if you want to change the page web parts/settings
    $("#RibbonContainer-TabRowLeft").hide();
    $(".ms-siteactionsmenu").hide();
  }

  setInterval(function () {
    var divVal = $("#divCounter").text();
    var count = divVal * 1 - 1;
    $("#divCounter").text(count);
    if (count <= 0) {
      Audit.Common.Utilities.Refresh();
    }
  }, 1000);
};

Audit.SPReport.NewReportPage = function () {
  var m_bigMap = new Object();
  var m_arrRequests = new Array();
  var m_arrResponses = new Array();

  var m_bHasAccessToViewPerms = false;

  ko.extenders.logChangeInArr = function (target, option) {
    target.subscribe(function (newValue) {
      console.log(option + ": " + JSON.stringify(newValue));

      console.log(newValue.length);
    });
    return target;
  };

  function ViewModel() {
    var self = this;

    self.siteUrl = Audit.Common.Utilities.GetSiteUrl();

    self.arrResponses = ko.observableArray(null);

    self.arrFilteredResponsesCount = ko.observable(0);

    self.filterRequestID = ko.observable();
    self.filterRequestStatus = ko.observable();
    self.filterRequestIntDueDate = ko.observable();
    self.filterSampleNum = ko.observable();
    self.filterResponseName = ko.observable();
    self.filterResponseStatus = ko.observable();

    self.filterResponseName2 = ko.observable();
    self.currentResponse = ko.observable();
    self.arrCoverSheets = ko.observableArray(null);
    self.arrResponseDocs = ko.observableArray(null);
    self.cntResponseDocs = ko.observable(0);

    self.doSort = ko.observable(false);

    self.currentResponseStatus = ko
      .computed(function () {
        if (self.currentResponse()) {
          if (self.currentResponse().resStatus == "7-Closed")
            return (
              self.currentResponse().resStatus +
              " on " +
              self.currentResponse().closedDate +
              " by " +
              self.currentResponse().closedBy
            );

          return self.currentResponse().resStatus;
        }
        return "";
      }, self)
      .extend({ notify: "always" });

    self.currentResponseRequestStatus = ko.computed(function () {
      if (self.currentResponse()) {
        if (self.currentResponse().request.status == "Closed")
          return (
            self.currentResponse().request.status +
            " on " +
            self.currentResponse().request.closedDate
          );

        return self.currentResponse().request.status;
      }
      return "";
    }, self);

    self.currentResponseRequestStatusStyle = ko.computed(function () {
      if (self.currentResponseStatus() != "") {
        if (
          self.currentResponse().request.status == "Closed" ||
          self.currentResponse().request.status == "Canceled"
        )
          return "red";
        else return "green";
      }
      return "";
    }, self);

    /** Behaviors **/

    self.ClearFilters = function () {
      self.filterRequestID("");
      self.filterRequestStatus("");
      self.filterRequestIntDueDate("");
      self.filterSampleNum("");
      self.filterResponseName("");
      self.filterResponseStatus("");
    };

    self.GetDistinctResponsesDDVals = function (fieldName) {
      return ko.computed(
        {
          read: function () {
            var types = ko.utils.arrayMap(self.arrResponses(), function (item) {
              return item[fieldName];
            });

            var ddArr = ko.utils.arrayGetDistinctValues(types).sort();
            return ddArr;
          },
        },
        self
      );
    };

    self.GoToResponse = function (response) {
      $("#tabs").tabs({ active: 1 });
      self.filterResponseName2(response.title);
    };

    /** Subscriptions **/

    self.arrResponses.subscribe(function (newValue) {
      if (self.arrResponses().length > 0 && self.doSort()) {
        //should trigger only once
        self.arrFilteredResponsesCount(self.arrResponses().length);

        setTimeout(function () {
          $("#tblStatusReportResponses").tablesorter({
            sortList: [[7, 1]],
            selectorHeaders: ".sorter-true",
          });
        }, 200);
      }
    });

    /* second tab */
    self.filterResponseName2.subscribe(function (newValue) {
      var oResponse = m_bigMap["response-" + self.filterResponseName2()];
      if (oResponse) {
        self.currentResponse(oResponse);

        LoadTabResponseInfoCoverSheets(oResponse);
        LoadTabResponseInfoResponseDocs(oResponse);
      } else {
        self.currentResponse(null);
        self.arrCoverSheets([]);
        self.arrResponseDocs([]);
        self.cntResponseDocs(0);
      }
    });

    /*var Item = function(reqNumber, requestStatus, internalDueDate, sample, title, status, docCount, modified, visibleRow) {
		    this.reqNumber= ko.observable(reqNumber);
		    this.requestStatus= ko.observable(requestStatus);    
		    this.internalDueDate= ko.observable(internalDueDate);    
		    this.sample= ko.observable(sample);    
		    this.title= ko.observable(title);    
		    this.status= ko.observable(status);    
		    this.docCount= ko.observable(docCount);    
		    this.modified= ko.observable(modified);    
		    this.visibleRow = ko.observable(visibleRow);    
		};*/

    /*	self.addNewData = function(newData) {
  		  var newItems = ko.utils.arrayMap(newData, function(item) {
       		return {
       			reqNumber: item.reqNumber,
       			requestStatus: item.requestStatus,
       			internalDueDate: item.internalDueDate,
       			sample: item.sample,
       			title: item.title,
       			status: item.status,
       			docCount: item.docCount,
       			modified: item.modified,
       			visibleRow: item.visibleRow,
		 };
   		 });
	    //take advantage of push accepting variable arguments
	    self.arrResponses.push.apply(self.arrResponses, newItems);
	};*/

    /*

	self.addNewData = function(newData) {
  		  var newItems = ko.utils.arrayMap(newData, function(item) {
       		return {
       			reqNumber: item.reqNumber,
       			requestStatus: item.requestStatus,
       			internalDueDate: item.internalDueDate,
       			sample: item.sample,
       			title: item.title,
       			status: item.status,
       			docCount: item.docCount,
       			modified: item.modified,
       			visibleRow: item.visibleRow,
		 };
   		 });
	    //take advantage of push accepting variable arguments
	    self.arrResponses.push.apply(self.arrResponses, newItems);
	};*/

    self.FilterChanged = function () {
      setTimeout(function () {
        var requestID = self.filterRequestID();
        var requestStatus = self.filterRequestStatus();
        var requestIntDueDate = self.filterRequestIntDueDate();
        var sampleNum = self.filterSampleNum();
        var responseName = self.filterResponseName();
        var responseStatus = self.filterResponseStatus();

        if (
          !requestID &&
          !requestStatus &&
          !requestIntDueDate &&
          !sampleNum &&
          !responseName &&
          !responseStatus
        ) {
          ko.utils.arrayForEach(self.arrResponses(), function (item) {
            item.visibleRow(true);
          });

          self.arrFilteredResponsesCount(self.arrResponses().length);
        }

        var result = [];

        requestID = !requestID ? "" : requestID;
        requestStatus = !requestStatus ? "" : requestStatus;
        requestIntDueDate = !requestIntDueDate ? "" : requestIntDueDate;
        sampleNum = !sampleNum ? "" : sampleNum;
        responseName = !responseName ? "" : responseName;
        responseStatus = !responseStatus ? "" : responseStatus;

        var count = 0;
        ko.utils.arrayForEach(self.arrResponses(), function (item) {
          var hide = false;
          if (!hide && requestID != "" && item.reqNumber != requestID)
            hide = true;
          if (
            !hide &&
            requestStatus != "" &&
            item.requestStatus != requestStatus
          )
            hide = true;
          if (
            !hide &&
            requestIntDueDate != "" &&
            item.internalDueDate != requestIntDueDate
          )
            hide = true;
          if (!hide && sampleNum != "" && item.sample != sampleNum) hide = true;
          if (!hide && responseName != "" && item.title != responseName)
            hide = true;
          if (!hide && responseStatus != "" && item.status != responseStatus)
            hide = true;

          item.visibleRow(!hide);

          if (!hide) count++;
        });

        self.arrFilteredResponsesCount(count);
      }, 100);
    };
  }

  var _myViewModel = new ViewModel();
  ko.applyBindings(_myViewModel);

  LoadInfo();

  function LoadInfo() {
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    m_currentUser = web.get_currentUser();
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
      '<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="ReqNum"/><FieldRef Name="ResID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">0</Value></Eq></Where></Query></View>'
    );
    m_ResponseDocsItems = responseDocsLib.getItems(responseDocsQuery);
    currCtx.load(
      m_ResponseDocsItems,
      "Include(ID, FSObjType, Title, ReqNum, ResID, DocumentStatus, RejectReason, ReceiptDate, FileLeafRef, FileDirRef, File_x0020_Size, CheckoutUser, Modified, Editor)"
    );

    currCtx.executeQueryAsync(OnSuccess, OnFailure);
    function OnSuccess(sender, args) {
      var requestList = web
        .get_lists()
        .getByTitle(Audit.Common.Utilities.GetListTitleRequests());
      var requestQuery = new SP.CamlQuery();
      requestQuery.set_viewXml(
        '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'
      );
      m_requestItemsWithPerms = requestList.getItems(requestQuery);
      currCtx.load(
        m_requestItemsWithPerms,
        "Include(ID, Title, ReqSubject, ReqStatus, IsSample, InternalDueDate, ActionOffice, Comments, RelatedAudit, ActionItems, EmailSent, ClosedDate, Modified, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
      );

      function OnSuccess2(sender, args) {
        m_bHasAccessToViewPerms = true;
        m_requestItems = m_requestItemsWithPerms;
        $("#divRefresh").show();
        m_fnLoadData();
      }
      function OnFailure2(sender, args) {
        $("#divRefresh").show();
        m_fnLoadData();
      }

      currCtx.executeQueryAsync(OnSuccess2, OnFailure2);
    }
    function OnFailure(sender, args) {
      $("#divRefresh").hide();
      $("#divLoading").hide();

      statusId = SP.UI.Status.addStatus(
        "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
      );
      SP.UI.Status.setStatusPriColor(statusId, "red");
    }
  }

  function m_fnLoadData() {
    LoadRequests();
    LoadResponses();
    LoadResponseDocs();

    $("#tabs").tabs().show();

    LoadTabStatusReport(m_arrResponses);
  }

  function OnLoadDisplayTabAndRequest() {
    var paramResponseNum = GetUrlKeyValue("ResNum");
    if (paramResponseNum != null && paramResponseNum != "") {
      _myViewModel.filterResponseName2(paramResponseNum);
    }

    var paramTabIndex = GetUrlKeyValue("Tab");
    if (paramTabIndex != null && paramTabIndex != "") {
      $("#tabs").tabs("option", "active", paramTabIndex);
    }
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

      var internalDueDate = oListItem.get_item("InternalDueDate");
      var closedDate = oListItem.get_item("ClosedDate");

      internalDueDate != null
        ? (internalDueDate = internalDueDate.format("MM/dd/yyyy"))
        : (internalDueDate = "");
      closedDate != null
        ? (closedDate = closedDate.format("MM/dd/yyyy"))
        : (closedDate = "");

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

      var requestObject = new Object();
      requestObject["ID"] = id;
      requestObject["number"] = number;
      requestObject["subject"] = subject;
      requestObject["status"] = status;
      requestObject["internalDueDate"] = internalDueDate;
      requestObject["sample"] = sample;
      requestObject["responses"] = new Array();
      requestObject["actionOffice"] = actionOffice;
      requestObject["comments"] = comments;
      requestObject["emailSent"] = emailSent;
      requestObject["closedDate"] = closedDate;
      requestObject["relatedAudit"] = relatedAudit;
      requestObject["actionItems"] = actionItems;

      //if logged in user is a site owner, we want to see if the request has special perms so that the site owner only sees a filtered set of requests that have been specifically given special perms.
      //otherwise, if it's a user in the special perms group, this check is skipped and they'll see whatever they have access to
      if (m_bHasAccessToViewPerms) {
        try {
          var permissionsToCheck = SP.PermissionKind.viewListItems;
          match1 = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
            oListItem,
            Audit.Common.Utilities.GetGroupNameSpecialPerm1(),
            permissionsToCheck
          );
          match2 = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
            oListItem,
            Audit.Common.Utilities.GetGroupNameSpecialPerm2(),
            permissionsToCheck
          );

          if (!match1 && !match2) continue;
        } catch (err) {}
      }

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
          //they should see it if they have access; then there's probably a permissions issue
          continue;

        //Special permissions users should only see responses that have been approved for QA or closed. The permissions should take care of this, but this is an extra safety measure
        responseObject["resStatus"] = oListItem.get_item("ResStatus");
        if (
          responseObject["resStatus"] != "4-Approved for QA" &&
          responseObject["resStatus"] != "7-Closed" &&
          responseObject["resStatus"] != "6-Reposted After Rejection"
        )
          continue;

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

        var modified = oListItem.get_item("Modified");
        modified != null
          ? (modified = modified.format("MM/dd/yyyy hh:mm tt"))
          : (modified = "");
        responseObject["modified"] = modified;

        var closedDate = oListItem.get_item("ClosedDate");
        closedDate != null
          ? (closedDate = closedDate.format("MM/dd/yyyy"))
          : (closedDate = "");
        responseObject["closedDate"] = closedDate;

        var comments = oListItem.get_item("Comments");
        if (comments == null) comments = "";
        responseObject["comments"] = comments;

        responseObject["closedBy"] =
          Audit.Common.Utilities.GetFriendlyDisplayName(oListItem, "ClosedBy");

        responseObject["sample"] = oListItem.get_item("SampleNumber");
        if (responseObject["sample"] == null) responseObject["sample"] = "";

        responseObject["coversheets"] = new Array();
        responseObject["responseDocs"] = new Array();

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
      if (
        oListItem.get_item("DocumentStatus") == "Open" ||
        oListItem.get_item("DocumentStatus") == "Marked for Deletion" ||
        oListItem.get_item("DocumentStatus") == "Submitted"
      )
        //shouldn't see any documents that have been uploaded by AO but not sent to them by IA
        continue;

      responseDocID = oListItem.get_item("ID");

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
          responseDocObject["title"] = oListItem.get_item("FileLeafRef");
          responseDocObject["folder"] = oListItem.get_item("FileDirRef");
          responseDocObject["documentStatus"] =
            oListItem.get_item("DocumentStatus");

          responseDocObject["rejectReason"] =
            oListItem.get_item("RejectReason");
          if (responseDocObject["rejectReason"] == null)
            responseDocObject["rejectReason"] = "";

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
          responseDocObject["checkedOutBy"] =
            Audit.Common.Utilities.GetFriendlyDisplayName(
              oListItem,
              "CheckoutUser"
            );

          oResponse["responseDocs"].push(responseDocObject);
          //bigMapItem["responseDocs"].push( responseDocObject );
        }
      } catch (err) {}
    }
  }

  function LoadTabStatusReport(arr) {
    if (arr == null) return;

    var bLoadTest = GetUrlKeyValue("LoadTest");

    var responseArr = new Array();

    var arrLength = arr.length;
    while (arrLength--) {
      var oResponse = arr[arrLength];

      var responseTitle = oResponse.title;
      var requestStatus = oResponse.request.status;
      var responseStatus = oResponse.resStatus;

      var aResponse = {
        reqNumber: oResponse.request.number,
        requestStatus: requestStatus,
        internalDueDate: oResponse.request.internalDueDate,
        sample: oResponse.sample,
        title: responseTitle,
        status: responseStatus,
        docCount: oResponse.responseDocs.length,
        modified: oResponse.modified,
        visibleRow: ko.observable(true),
      };

      responseArr.push(aResponse);

      if (bLoadTest) {
        for (var x = 0; x < 299; x++) {
          responseArr.push(aResponse);
        }
      }
    }

    if (responseArr.length > 0) {
      DoUpdateModel(responseArr);
    } else {
      Audit.Common.Utilities.OnLoadDisplayTimeStamp();
    }

    //_myViewModel.addNewData( responseArr );
    //ko.utils.arrayPushAll( _myViewModel.arrResponses(), responseArr );
    //_myViewModel.arrResponses.valueHasMutated();
  }

  function DoUpdateModel(arrResponsesToAdd) {
    var subArr = [];

    var bContinue = true;
    var batchSize = 250;

    if (arrResponsesToAdd.length == 0) {
      //_myViewModel.doSort ( true );
      //_myViewModel.arrResponses.valueHasMutated();
      bContinue = false;

      //setTimeout( function()
      //{
      Audit.Common.Utilities.OnLoadDisplayTimeStamp();
      BindHandlersOnLoad();
      OnLoadDisplayTabAndRequest();

      //}, 100 );
    } else if (arrResponsesToAdd.length >= batchSize) {
      subArr = arrResponsesToAdd.slice(0, batchSize);
      arrResponsesToAdd.splice(0, batchSize);
    } else if (arrResponsesToAdd.length > 0) {
      subArr = arrResponsesToAdd.slice(0, arrResponsesToAdd.length);
      arrResponsesToAdd.splice(0, arrResponsesToAdd.length);
    }

    if (bContinue) {
      ko.utils.arrayPushAll(_myViewModel.arrResponses(), subArr);
      if (arrResponsesToAdd.length == 0) _myViewModel.doSort(true);

      _myViewModel.arrResponses.valueHasMutated();

      setTimeout(function () {
        DoUpdateModel(arrResponsesToAdd);
      }, 100);
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
    m_subsetCoverSheetItems = coverSheetLib.getItems(coverSheetQuery);
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
    _myViewModel.arrResponseDocs([]);
    _myViewModel.cntResponseDocs(0);

    if (oResponse == null || oResponse.responseDocs.length == 0) {
      //an open response is selected and there are no documents
      return;
    }

    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    for (var z = 0; z < oResponse.responseDocs.length; z++) {
      var oResponseDoc = oResponse.responseDocs[z];

      //this loads on execute
      oResponseDoc["docIcon"] = web.mapToIcon(
        oResponseDoc.title,
        "",
        SP.Utilities.IconSize.Size16
      );
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
      if (oResponse == null || oResponse.responseDocs == null) return;

      var arrResponseSummary = new Array();
      for (var z = 0; z < oResponse.responseDocs.length; z++) {
        var oResponseDoc = oResponse.responseDocs[z];

        oResponseDoc.docIcon = oResponseDoc.docIcon.get_value();
        oResponseDoc.styleTag = Audit.Common.Utilities.GetResponseDocStyleTag2(
          oResponseDoc.documentStatus
        );
        oResponseDoc.link =
          "STSNavigate('../_layouts/download.aspx?SourceUrl=" +
          oResponseDoc.folder +
          "/" +
          oResponseDoc.title +
          "')";

        var bFound = false;
        for (var b = 0; b < arrResponseSummary.length; b++) {
          if (arrResponseSummary[b].responseTitle == oResponse.title) {
            bFound = true;
            arrResponseSummary[b].responseDocs.push(oResponseDoc);
            break;
          }
        }
        if (!bFound) {
          var oObject = new Object();

          var arrResponseDocs = new Array();
          arrResponseDocs.push(oResponseDoc);

          oObject["responseTitle"] = oResponse.title;
          oObject["responseDocs"] = arrResponseDocs;
          oObject["response"] = oResponse;

          arrResponseSummary.push(oObject);
        }
      }

      ko.utils.arrayPushAll(_myViewModel.arrResponseDocs(), arrResponseSummary);
      _myViewModel.arrResponseDocs.valueHasMutated();
      _myViewModel.cntResponseDocs(oResponse.responseDocs.length);

      Audit.Common.Utilities.BindHandlerResponseDoc();
    }
  }

  function m_fnRefresh() {
    var curPath = location.pathname;

    var tabIndex = $("#tabs").tabs("option", "active");
    curPath += "?Tab=" + tabIndex;

    if (tabIndex == 1) {
      var responseNum = $("#ddlResponses").val();
      if (responseNum != "") curPath += "&ResNum=" + responseNum;
    }

    location.href = curPath;
  }

  function BindHandlersOnLoad() {
    BindPrintButton(
      "#btnPrint1",
      "#divStatusReportRespones",
      "Special Permissions Response Status Report"
    );
    //////////Note: for the export to work, make sure this is added to the html: <iframe id="CsvExpFrame" style="display: none"></iframe>
    BindExportButton(
      ".export1",
      "SPResponseStatusReport_",
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

  var publicMembers = {
    Load: m_fnLoadData,
    Refresh: m_fnRefresh,
  };

  return publicMembers;
};
