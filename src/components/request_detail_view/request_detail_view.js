import { appContext } from "../../infrastructure/application_db_context.js";
import {
  directRegisterComponent,
  registerComponent,
} from "../../sal/infrastructure/index.js";

import * as ModalDialog from "../../sal/components/modal/index.js";

import {
  deleteRequestCoversheetById,
  uploadRequestCoversheetFile,
} from "../../services/coversheet_manager.js";
import {
  getRequestById,
  getRequestByTitle,
} from "../../services/audit_request_service.js";
import {
  closeResponseById,
  deleteResponseAndFolder,
  uploadResponseDocFile,
} from "../../services/audit_response_service.js";
import { Tab, TabsModule } from "../tabs/tabs_module.js";
import { getUrlParam } from "../../common/router.js";

import {
  AUDITREQUESTSTATES,
  AuditResponseStates,
  AuditResponseDocStates,
  AUDITREQUESTTYPES,
} from "../../entities/index.js";

import { m_fnRefreshData } from "../../pages/ia_db/ia_db.js";
import { ConfirmApproveResponseDocForm } from "../forms/response_doc/confirm_approve/confirm_approve_response_doc_form.js";
import { ConfirmRejectResponseDocForm } from "../forms/response_doc/confirm_reject/confirm_reject_response_doc_form.js";
import { ConfirmDeleteRequestForm } from "../forms/request/confirm_delete/confirm_delete_request_form.js";

import { requestDetailViewTemplate } from "./RequestDetailViewTemplate.js";
import { requestDetailCoversheetsTabTemplate } from "./RequestDetailCoversheetsTabTemplate.js";
import { requestDetailResponsesTabTemplate } from "./RequestDetailResponsesTabTemplate.js";
import { requestDetailResponseDocsTabTemplate } from "./RequestDetailResponseDocsTabTemplate.js";

const componentName = "component-request-detail-view";

const requestDetailUrlParamKey = "request-detail-tab";

export class RequestDetailView {
  constructor({
    bDisplayClose,
    currentRequest,
    arrCurrentRequestCoverSheets,
    // arrCurrentRequestResponses,
    // cntResponseDocs,
    // arrCurrentRequestResponseDocs,
    ModalDialog,
    ClickEditCoversheet,
  }) {
    // this.report = args;
    this.bDisplayClose = bDisplayClose; // This can be converted to an observable
    this.currentRequest = currentRequest;
    this.arrCurrentRequestCoverSheets = arrCurrentRequestCoverSheets;
    // this.arrCurrentRequestResponses = arrCurrentRequestResponses;
    // this.cntResponseDocs = cntResponseDocs;
    // this.arrCurrentRequestResponseDocs = arrCurrentRequestResponseDocs;

    this.editCoversheet = ClickEditCoversheet;

    this.ModalDialog = ModalDialog;

    this.showCollapsed.subscribe(this.showCollapseToggledHandler);
    this.coverSheetFiles.subscribeAdded(this.onCoverSheetFileAttachedHandler);

    this.tabs = new TabsModule(
      Object.values(this.tabOpts),
      requestDetailUrlParamKey
    );

    this.setInitialTab();
    this.currentRequest.subscribe(this.onRequestChangeHandler);
  }

  request = ko.observable();

  onRequestChangeHandler = async (newRequest) => {
    if (!newRequest || !newRequest.ID) return;
    if (newRequest.ID == ko.unwrap(this.request)?.ID) return;

    const request = await getRequestById(newRequest.ID);
    this.request(request);
  };

  // Fields
  componentName = componentName;
  params = this;
  tabOpts = {
    Coversheets: new Tab("coversheets", "Coversheets", {
      id: "requestDetailCoversheetsTabTemplate",
      data: this,
    }),
    Responses: new Tab("responses", "Responses", {
      id: "requestDetailResponsesTabTemplate",
      data: this,
    }),
    ResponseDocs: new Tab("response-docs", "Response Docs", {
      id: "requestDetailResponseDocsTabTemplate",
      data: this,
    }),
  };
  checkResponseDoc = true;

  // Observables
  coverSheetFiles = ko.observableArray();
  showCollapsed = ko.observable(false);

  // Computed Observables
  currentRequestResponseItems = ko.pureComputed(() => {
    const request = ko.unwrap(this.currentRequest);
    return (
      request?.responses.map(
        (response) => new ResponseItem(request, response, this)
      ) ?? []
    );
  });

  currentRequestResponsesReadyToClose = ko.pureComputed(() => {
    if (this.currentRequest()?.reqType != AUDITREQUESTTYPES.TASKER) return [];
    return this.currentRequestResponseItems().filter((response) =>
      response.isReadyToClose()
    );
  });

  currentRequestResponseDocs = ko.pureComputed(() => {
    const request = ko.unwrap(this.currentRequest);
    const responseSummaries =
      request?.responses.map(
        (response) => new ResponseDocSummary(request, response)
      ) ?? [];
    return responseSummaries;
  });

  cntResponseDocs = ko.pureComputed(() => {
    const cnt = this.currentRequestResponseDocs().reduce(
      (cnt, responseSummary) => cnt + responseSummary.responseDocs.length,
      0
    );
    return cnt;
  });

  showResponseActions = ko.pureComputed(() => {
    return [AUDITREQUESTSTATES.OPEN, AUDITREQUESTSTATES.REOPENED].includes(
      this.currentRequest()?.status
    );
  });

  // Subscriptions
  showCollapseToggledHandler = (collapse) => {
    this.currentRequestResponseDocs().map((responseDocSummary) =>
      responseDocSummary.collapsed(collapse)
    );
  };

  // Behaviors
  setInitialTab() {
    if (getUrlParam(requestDetailUrlParamKey)) {
      this.tabs.selectById(getUrlParam(requestDetailUrlParamKey));
      return;
    }

    const defaultTab = this.currentRequest()?.EmailSent.Value()
      ? this.tabOpts.Responses
      : this.tabOpts.Coversheets;

    this.tabs.selectTab(defaultTab);
  }

  ClickViewRequestHistory = () => {
    appContext.AuditRequests.ListRef.showVersionHistoryModal(
      this.currentRequest()?.ID
    );
  };

  ClickDeleteRequest = async () => {
    const request = this.currentRequest();

    if (request.emailSent) {
      alert("Email has been sent, cannot delete request.");
      return;
    }

    const newConfirmDeleteForm = new ConfirmDeleteRequestForm(request);

    const options = {
      form: newConfirmDeleteForm,
      dialogReturnValueCallback: this.OnCallBackDeleteRequest.bind(this),
      title: "Delete Request?",
    };

    ModalDialog.showModalDialog(options);
  };

  // collapseResponseDocs = (collapse) =>

  // Need to wrap this this m_fnRefreshData optionally takes a requestId param
  refreshRequest = async () => {
    m_fnRefreshData();
    const reqId = ko.unwrap(this.request)?.ID;
    if (!reqId) return;
    const request = await getRequestById(reqId);
    this.request(request);
  };

  // Coversheets
  onCoverSheetFileAttachedHandler = async (newFiles) => {
    if (!newFiles.length) return;
    const request = await appContext.AuditRequests.FindById(
      this.currentRequest().ID
    );

    // Only allow 1 coversheet at a time
    const file = newFiles[0];
    const coversheet = await uploadRequestCoversheetFile(file, request);
    this.coverSheetFiles([]);
    this.editCoversheet({ ID: coversheet.ID });
  };

  ClickDeleteCoversheet = async (coversheet) => {
    if (confirm("Delete coversheet: " + coversheet.title)) {
      await deleteRequestCoversheetById(coversheet.ID);
      this.refreshRequest();
    }
  };
  // Responses
  clickCloseReadyResponses = async () => {
    await Promise.all(
      this.currentRequestResponsesReadyToClose().map((response) =>
        response.closeResponse()
      )
    );

    this.refreshRequest();
  };

  viewResponseDocs = (response) => {
    this.tabs.selectTab(this.tabOpts.ResponseDocs);
    // Manually invoke the handler so we don't have to wait for the sub
    this.showCollapsed(true);
    this.showCollapsed.valueHasMutated();

    // this.showCollapseToggledHandler(true);
    const responseDocsSummary = this.currentRequestResponseDocs().find(
      (responseDocsSummary) =>
        responseDocsSummary.responseTitle == response.title
    );

    if (!responseDocsSummary) return;
    responseDocsSummary.collapsed(false);
    responseDocsSummary.highlightResponse();
  };

  highlightResponse = (responseTitle) => {
    this.tabs.selectTab(this.tabOpts.Responses);
    this.currentRequestResponseItems()
      .find((response) => response.title == responseTitle)
      ?.highlightResponse();
  };

  // ResponseDocs
  clickHelpResponseDocs = () => {
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
    // options.dialogReturnValueCallback = OnCallbackForm;
    options.html = document.getElementById("helpDlg");
    SP.UI.ModalDialog.showModalDialog(options);
  };

  ClickBulkApprove = (responseDocSummary) => {
    const oResponseDocsForApproval = responseDocSummary.responseDocs.filter(
      (responseDoc) =>
        this.responseDocCanBeApproved(responseDocSummary, responseDoc)
    );
    const request = this.currentRequest();

    const newResponseDocForm = new ConfirmApproveResponseDocForm(
      request,
      null,
      oResponseDocsForApproval
    );

    const options = {
      form: newResponseDocForm,
      dialogReturnValueCallback: this.OnCallBackApproveResponseDoc.bind(this),
      title: "Approve Response Docs?",
    };

    ModalDialog.showModalDialog(options);
  };

  ClickApproveResponseDoc = (oResponseDoc) => {
    const request = this.currentRequest();

    const newResponseDocForm = new ConfirmApproveResponseDocForm(
      request,
      null,
      [oResponseDoc]
    );

    const options = {
      form: newResponseDocForm,
      dialogReturnValueCallback: this.OnCallBackApproveResponseDoc.bind(this),
      title: "Approve Response Doc?",
    };

    ModalDialog.showModalDialog(options);
  };

  CheckResponseDocs = () => {
    const allDocs = this.currentRequestResponseDocs()
      .filter(
        (responseDocSummary) =>
          responseDocSummary.responseStatus == "2-Submitted"
      )
      .flatMap((responseDocSummary) => {
        return responseDocSummary.responseDocs;
      })
      .filter((responseDoc) => responseDoc.documentStatus == "Submitted")
      .map((responseDoc) =>
        responseDoc.chkApproveResDoc(this.checkResponseDoc)
      );

    this.checkResponseDoc = !this.checkResponseDoc;
  };

  ApproveCheckedResponseDocs = () => {
    const allDocs = this.currentRequestResponseDocs()
      .flatMap((responseDocSummary) => {
        return responseDocSummary.responseDocs;
      })
      .filter((responseDoc) => responseDoc.chkApproveResDoc());

    const request = this.currentRequest();

    const newResponseDocForm = new ConfirmApproveResponseDocForm(
      request,
      null,
      allDocs
    );

    const options = {
      form: newResponseDocForm,
      dialogReturnValueCallback: this.OnCallBackApproveResponseDoc.bind(this),
      title: "Approve Response Docs?",
    };

    ModalDialog.showModalDialog(options);
  };

  responseDocCanBeApproved = (responseDocSummary, responseDoc) => {
    return (
      responseDoc.documentStatus == AuditResponseDocStates.Submitted &&
      (responseDocSummary.responseStatus == AuditResponseStates.Submitted ||
        responseDocSummary.responseStatus ==
          AuditResponseStates.ApprovedForQA) &&
      (responseDocSummary.requestStatus == AUDITREQUESTSTATES.OPEN ||
        responseDocSummary.requestStatus == AUDITREQUESTSTATES.REOPENED)
    );
  };

  async OnCallBackApproveResponseDoc(result) {
    if (result) {
      // Update is handled in the form, just need to refresh page/data
      await this.refreshRequest();
    }
  }

  async OnCallBackDeleteRequest(result) {
    if (result) {
      alert("request deleted!");
      // Todo: Hard reload, clear window params
      Audit.Common.Utilities.Refresh(true);
    }
  }

  ClickRejectResponseDoc = (oResponseDoc) => {
    const request = this.currentRequest();

    const newResponseDocForm = new ConfirmRejectResponseDocForm(request, null, [
      oResponseDoc,
    ]);

    const options = {
      form: newResponseDocForm,
      dialogReturnValueCallback: this.OnCallbackRejectResponseDoc.bind(this),
      title: "Reject Response Doc?",
    };

    ModalDialog.showModalDialog(options);
  };

  async OnCallbackRejectResponseDoc(result) {
    if (!result) return;
    this.refreshRequest();
  }

  ClickViewResponse = (responseDocSummary) => {
    this.highlightResponse(responseDocSummary.responseTitle);
  };
}

directRegisterComponent(componentName, {
  template: requestDetailViewTemplate,
});

directRegisterComponent("requestDetailCoversheetsTabTemplate", {
  template: requestDetailCoversheetsTabTemplate,
});

directRegisterComponent("requestDetailResponsesTabTemplate", {
  template: requestDetailResponsesTabTemplate,
});

directRegisterComponent("requestDetailResponseDocsTabTemplate", {
  template: requestDetailResponseDocsTabTemplate,
});

// registerComponentByPath({
//   name: componentName,
//   folder: "request_detail_view",
//   template: "RequestDetailViewTemplate",
// });

class ResponseItem {
  constructor(request, response, report) {
    Object.assign(this, response);
    this.request = request;

    this.refreshData = report.refreshRequest;

    this.responseCoversheetFiles.subscribeAdded(
      this.onCoversheetFilesAttachedHandler
    );

    this.responseDocFiles.subscribeAdded(
      this.onResponseDocFilesAttachedHandler
    );
  }

  highlight = ko.observable(false);

  responseCoversheetFiles = ko.observableArray();
  responseDocFiles = ko.observableArray();

  isReadyToClose = () =>
    this.request.reqType == AUDITREQUESTTYPES.TASKER &&
    this.resStatus != AuditResponseStates.Closed &&
    this.responseDocs.length &&
    !this.responseDocs.find((responseDoc) =>
      [AuditResponseDocStates.Open, AuditResponseDocStates.Submitted].includes(
        responseDoc.documentStatus
      )
    );

  clickCloseResponse = async () => {
    await this.closeResponse();
    this.refreshData();
  };

  closeResponse = () => {
    return closeResponseById(this.ID);
  };

  ClickViewResponseHistory = () => {
    appContext.AuditResponses.ListRef.showVersionHistoryModal(this.ID);
  };

  ClickDeleteResponse = async () => {
    if (confirm("Delete Response: " + this.title)) {
      const response = await appContext.AuditResponses.FindById(this.ID);
      await deleteResponseAndFolder(response);
      this.refreshData();
    }
  };

  onCoversheetFilesAttachedHandler = async (files) => {
    if (!files.length) return;
    const request = await getRequestByTitle(this.number);
    // const response = await appContext.AuditResponses.FindById(this.ID);
    const actionOfficeId = this.item.get_item("ActionOffice")?.get_lookupId();
    const actionOfficeIds = [];
    if (actionOfficeId) {
      actionOfficeIds.push({ ID: actionOfficeId });
    }
    const promises = [];

    for (let file of files) {
      promises.push(
        new Promise(async (resolve) => {
          const newSheet = await uploadRequestCoversheetFile(
            file,
            request,
            actionOfficeIds
          );
          //   this.requestCoversheets.push(new RequestDetailCoversheet(newSheet));
          resolve();
        })
      );
    }

    await Promise.all(promises);
    // TODO: need to requery coversheets
    this.responseCoversheetFiles.removeAll();
    this.refreshData();
  };

  onResponseDocFilesAttachedHandler = async (files) => {
    if (!files.length) return;
    // const request = await getRequestByTitle(this.number);
    const response = await appContext.AuditResponses.FindById(this.ID);

    const promises = [];

    for (let file of files) {
      promises.push(
        new Promise(async (resolve) => {
          const newSheet = await uploadResponseDocFile(response, file);
          resolve();
        })
      );
    }

    await Promise.all(promises);
    // TODO: need to requery responsedocs
    this.responseDocFiles.removeAll();
    this.refreshData();
  };

  highlightResponse = () => {
    document
      .getElementById(`response-item-title-${this.title}`)
      ?.scrollIntoView({ block: "center", behavior: "smooth" });

    this.highlight(true);
    setTimeout(() => this.highlight(false), 2000);
  };
}

const onc =
  "onclick=\"return DispEx(this,event,'TRUE','FALSE','FALSE','SharePoint.OpenDocuments.3','1','SharePoint.OpenDocuments','','','','2','0','0','0x7fffffffffffffff','','')\"";

class ResponseDocSummary {
  constructor(oRequest, oResponse) {
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
        "<a class='btn btn-link' target='_blank' title='Click to Open the document' onmousedown=\"return VerifyHref(this,event,'1','SharePoint.OpenDocuments','')\" " +
        onc +
        ' href="' +
        oResponseDoc.folder +
        "/" +
        oResponseDoc.fileName +
        '">' +
        oResponseDoc.fileName +
        "</a>";

      // oResponseDoc.responseDocCanBeApproved = (oResponseDoc) => {
      //   if (oResponseDoc.documentStatus != AuditResponseDocStates.Submitted)
      //     return false;
      //   return (
      //     (this.responseStatus == AuditResponseStates.Submitted ||
      //       this.responseStatus == AuditResponseStates.ApprovedForQA) &&
      //     (this.requestStatus == AUDITREQUESTSTATES.OPEN ||
      //       this.requestStatus == AUDITREQUESTSTATES.REOPENED)
      //   );
      // };
      arrResponseDocs.push(oResponseDoc);
      // cnt++;

      if (
        [
          AuditResponseStates.Submitted,
          AuditResponseStates.ApprovedForQA,
        ].includes(oResponse.resStatus) &&
        oResponseDoc.documentStatus == AuditResponseDocStates.Submitted
      ) {
        showBulkApprove = true;
      }
    }
    this.responseId = oResponse.ID;
    this.responseTitle = oResponse.title;
    this.responseDocs = arrResponseDocs;
    this.responseStatus = oResponse.resStatus;
    this.requestStatus = oRequest.status;
    this.showBulkApprove = showBulkApprove;
  }
  responseTitle;

  collapsed = ko.observable(false);
  highlight = ko.observable(false);

  titleRowElementId = () => "response-doc-summary-" + this.responseTitle;

  highlightResponse = () => {
    document
      .getElementById(this.titleRowElementId())
      .scrollIntoView({ behavior: "smooth", block: "center" });
    this.highlight(true);
    setTimeout(() => this.highlight(false), 2000);
  };

  ClickViewResponseDocHistory = (responseDoc) => {
    appContext.AuditResponseDocs.ListRef.showVersionHistoryModal(
      responseDoc.ID
    );
  };

  responseDocCanBeApproved = (oResponseDoc) => {
    if (oResponseDoc.documentStatus != AuditResponseDocStates.Submitted)
      return false;
    return (
      (this.responseStatus == AuditResponseStates.Submitted ||
        this.responseStatus == AuditResponseStates.ApprovedForQA) &&
      (this.requestStatus == AUDITREQUESTSTATES.OPEN ||
        this.requestStatus == AUDITREQUESTSTATES.REOPENED)
    );
  };
}
