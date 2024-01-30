import { appContext } from "../../infrastructure/ApplicationDbContext.js";
import { registerComponent } from "../../infrastructure/RegisterComponents.js";
import { uploadRequestCoversheetFile } from "../../services/CoversheetManager.js";
import { EditCoverSheetForm } from "../Forms/CoverSheet/EditForm/EditCoversheetForm.js";
import * as ModalDialog from "../../infrastructure/ModalDialog.js";
import { getRequestByTitle } from "../../services/AuditRequestService.js";
import { Tab, TabsModule } from "../Tabs/TabsModule.js";
import { getUrlParam } from "../../common/Router.js";
import { ConfirmApproveResponseDocForm } from "../Forms/ResponseDoc/ConfirmApprove/ConfirmApproveResponseDocForm.js";
import { AuditResponseStates } from "../../entities/AuditResponse.js";
import { AuditResponseDocStates } from "../../entities/AuditResponseDocs.js";
import { AUDITREQUESTSTATES } from "../../entities/AuditRequest.js";
import { m_fnRequeryRequest } from "../../pages/IA_DB/IA_DB.js";

const componentName = "component-request-detail-view";

const requestDetailUrlParamKey = "request-detail-tab";

export class RequestDetailView {
  constructor({
    bDisplayClose,
    currentRequest,
    arrCurrentRequestCoverSheets,
    arrCurrentRequestResponses,
    cntResponseDocs,
    arrCurrentRequestResponseDocs,
    ModalDialog,
    ClickEditCoversheet,
  }) {
    // this.report = args;
    this.bDisplayClose = bDisplayClose; // This can be converted to an observable
    this.currentRequest = currentRequest;
    this.arrCurrentRequestCoverSheets = arrCurrentRequestCoverSheets;
    this.arrCurrentRequestResponses = arrCurrentRequestResponses;
    this.cntResponseDocs = cntResponseDocs;
    this.arrCurrentRequestResponseDocs = arrCurrentRequestResponseDocs;

    this.editCoversheet = ClickEditCoversheet;

    this.ModalDialog = ModalDialog;
    /*
    ROOT FUNCTIONS 
    ClickViewCoversheet
    ClickEditCoversheet
    ClickUploadCoverSheet

    ClickAddResponse
    ClickBulkAddResponse
    ClickBulkEditResponse
    ClickReOpenResponse

    ClickViewResponse
    ClickEditResponse
    ClickReviewingResponse
    ClickViewResponseDocFolder
    ClickUploadToResponseDocFolder


    ClickDeleteResponseDoc
    ClickCheckInResponseDocument
    ClickResendRejectedResponseDocToQA
    ClickViewResponseDoc
    ClickEditResponseDoc
    ApproveCheckedResponseDocs
    */
    this.coverSheetFiles.subscribeAdded(this.onCoverSheetFileAttachedHandler);

    this.tabs = new TabsModule(
      Object.values(this.tabOpts),
      requestDetailUrlParamKey
    );

    this.setInitialTab();
  }

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
    return this.arrCurrentRequestResponses().map(
      (response) => new ResponseItem(response, this)
    );
  });

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

  refreshRequest() {
    m_fnRequeryRequest(this.currentRequest());
  }

  // Coversheets
  onCoverSheetFileAttachedHandler = async (newFiles) => {
    if (!newFiles.length) return;
    const request = await appContext.AuditRequests.FindById(
      this.currentRequest().ID
    );

    // Only allow 1 coversheet at a time
    const file = newFiles[0];
    const coversheet = await uploadRequestCoversheetFile(file, request);
    this.editCoversheet({ ID: coversheet.ID });
  };

  // ResponseDocs
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
      this.refreshRequest();
    }
  }

  CheckResponseDocs = () => {
    const allDocs = this.arrCurrentRequestResponseDocs()
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
    const allDocs = this.arrCurrentRequestResponseDocs()
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
}

registerComponent({
  name: componentName,
  folder: "RequestDetailView",
  template: "RequestDetailViewTemplate",
});

class ResponseItem {
  constructor(response, report) {
    Object.assign(this, response);

    this.responseCoversheetFiles.subscribeAdded(
      this.onCoversheetFilesAttachedHandler
    );

    this.responseDocFiles.subscribeAdded(
      this.onResponseDocFilesAttachedHandler
    );
  }

  responseCoversheetFiles = ko.observableArray();
  responseDocFiles = ko.observableArray();

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
    window.location.reload();

    this.responseCoversheetFiles.removeAll();
  };

  onResponseDocFilesAttachedHandler = async (files) => {
    if (!files.length) return;
    // const request = await getRequestByTitle(this.number);
    const response = await appContext.AuditResponses.FindById(this.ID);

    const promises = [];

    for (let file of files) {
      promises.push(
        new Promise(async (resolve) => {
          const newSheet = await response.uploadResponseDocFile(file);
          resolve();
        })
      );
    }

    await Promise.all(promises);
    // TODO: need to requery responsedocs
    window.location.reload();
  };
}
