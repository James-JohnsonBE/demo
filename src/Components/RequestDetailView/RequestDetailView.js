import { getUrlParam } from "../../common/Router.js";
import { AuditResponseStates } from "../../entities/AuditResponse.js";
import { AuditResponseDocStates } from "../../entities/AuditResponseDocs.js";
import { appContext } from "../../infrastructure/ApplicationDbContext.js";
import { registerComponent } from "../../infrastructure/RegisterComponents.js";
import {
  ensureRequestPermissions,
  ensureRequestInternalItem,
  getRequestCoversheets,
  getRequestResponses,
  getRequestResponseDocs,
} from "../../services/AuditRequestService.js";
import { showBulkAddResponseModal } from "../../services/AuditResponseService.js";
import { uploadRequestCoversheetFile } from "../../services/CoversheetManager.js";
import { getSpecialPermGroups } from "../../services/PeopleManager.js";

import { TabsModule, Tab } from "../Tabs/TabsModule.js";

const requestDetailViewComponentName = "requestDetailView";

let specialGroups;

export class RequestDetailViewComponent {
  constructor({ currentRequest }) {
    currentRequest.subscribe((request) => {
      if (request) this.loadRequest(request.ID);
    });

    this.init();
  }

  async init() {
    specialGroups = await getSpecialPermGroups();
  }

  request = ko.observable();
  requestInternal = ko.observable();
  requestCoversheets;
  requestResponses;
  requestResponseDocs;

  // By making the params observable, we can force the component to re-render when they change
  params = ko.observable();

  async loadRequest(requestId) {
    // All resource heavy initialization should be done in the component reference class
    // since it persists past the component lifecycle
    const request = await appContext.AuditRequests.FindById(requestId);
    await ensureRequestPermissions(request);

    const requestInternal = await ensureRequestInternalItem(request);

    this.requestCoversheets = await getRequestCoversheets(request);
    this.requestResponses = await getRequestResponses(request);
    this.requestResponseDocs = await getRequestResponseDocs(request);

    this.request(request);
    this.requestInternal(requestInternal);

    this.params({
      request: this.request(),
      requestInternal: this.requestInternal(),
      requestCoversheets: this.requestCoversheets,
      requestResponses: this.requestResponses,
      requestResponseDocs: this.requestResponseDocs,
    });
  }

  componentName = requestDetailViewComponentName;
}

const requestDetailUrlParam = "request-detail-tab";
export default class RequestDetailViewModule {
  constructor({
    request,
    requestInternal,
    requestCoversheets,
    requestResponses,
    requestResponseDocs,
  }) {
    this.request = request;
    this.requestInternal = requestInternal;
    this.requestCoversheets(
      requestCoversheets.map((cs) => new RequestDetailCoversheet(cs))
    );
    this.requestResponses(
      requestResponses.map(
        (response) =>
          new RequestDetailResponse(this.request, response, this.responseDocs)
      )
    );

    this.responseDocs(
      requestResponseDocs.map(
        (responseDoc) => new RequestDetailResponseDoc(this.request, responseDoc)
      )
    );
    console.log("recreating detail view component!", request);

    this.requestInternal.activeViewersComponent.pushCurrentUser();

    this.tabs = new TabsModule(
      Object.values(this.tabOpts),
      requestDetailUrlParam
    );

    this.init();
  }

  showDocuments = ko.observable(false);

  requestCoversheets = ko.observableArray();
  requestResponses = ko.observableArray();
  responseDocs = ko.observableArray();

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

  async init() {
    this.setInitialTab();
  }

  setInitialTab() {
    if (getUrlParam(requestDetailUrlParam)) {
      this.tabs.selectById(getUrlParam(requestDetailUrlParam));
      return;
    }

    const defaultTab = this.request.EmailSent.Value()
      ? this.tabOpts.Responses
      : this.tabOpts.Coversheets;

    this.tabs.selectTab(defaultTab);
  }

  addCoversheetFile(file, actionOffices) {}

  addResponseHandler() {}

  async bulkAddResponsesHandler() {
    await showBulkAddResponseModal(this.request);
    this.reloadResponses();
  }

  async reloadResponses() {
    const responses = await getRequestResponses(this.request);
    this.requestResponses(
      responses.map(
        (response) => new RequestDetailResponse(this.request, response)
      )
    );
  }

  _checkResponseDocs = true;
  /* ResponseDocTab */
  checkResponseDocsHandler() {
    this.requestResponses().forEach((response) => {
      if (
        response.response.ResStatus.Value() == AuditResponseStates.Submitted
      ) {
        response.checkResponseDocs(this._checkResponseDocs);
      }
    });
    this._checkResponseDocs = !this._checkResponseDocs;
  }

  dispose() {
    this.requestInternal.activeViewersComponent.removeCurrentuser();
  }
}

registerComponent({
  name: requestDetailViewComponentName,
  folder: "RequestDetailView",
  module: RequestDetailViewModule,
  template: "RequestDetailViewTemplate",
});

class RequestDetailCoversheet {
  constructor(coversheet) {
    Object.assign(this, coversheet);
  }

  showActionOffices = ko.observable(false);

  toggleShowActionOffices() {
    this.showActionOffices(!this.showActionOffices());
  }
}

/***
 * Hold information regarding our request detail response items.
 * This class is composed on top of the AuditResponse entity
 */
class RequestDetailResponse {
  constructor(request, response, requestResponseDocs) {
    // Object.assign(this, response);
    (this.request = request), (this.response = response);
    this.requestResponseDocs = requestResponseDocs;
    this.init();

    this.responseDocFiles.subscribe(
      this.responseDocFilesChangeHandler,
      this,
      "arrayChange"
    );

    this.responseCoversheetFiles.subscribe(
      this.responseCoversheetFilesChangeHandler,
      this,
      "arrayChange"
    );
  }
  requestResponses = [this];
  requestResponseDocs;

  responseDocs = ko.pureComputed(() => {
    return this.requestResponseDocs().filter(
      (responseDoc) =>
        responseDoc.responseDoc.ResID.Value()?.ID == this.response.ID
    );
  });

  permissions = ko.observable();
  responseDocFiles = ko.observableArray();
  responseCoversheetFiles = ko.observableArray();

  responseDocFilesChangeHandler = (fileChanges) => {
    const newFiles = fileChanges
      .filter((file) => file.status == "added")
      .map((file) => file.value);

    if (newFiles.length) this.uploadResponseDocFiles(newFiles);
  };

  responseCoversheetFilesChangeHandler = (fileChanges) => {
    const newFiles = fileChanges
      .filter((file) => file.status == "added")
      .map((file) => file.value);

    if (newFiles.length) this.uploadResponseCoversheetFiles(newFiles);
  };

  uploadResponseDocFiles = async (files) => {
    const promises = [];

    for (let file of files) {
      promises.push(this.response.uploadResponseDocFile(file));
    }
    await Promise.all(promises);

    this.responseDocFiles.removeAll();
  };

  uploadResponseCoversheetFiles = async (files) => {
    const promises = [];

    for (let file of files) {
      promises.push(
        uploadRequestCoversheetFile(file, this.request, [
          this.response.ActionOffice.Value(),
        ])
      );
    }

    await Promise.all(promises);

    this.responseCoversheetFiles.removeAll();
  };

  responseHasSpecialPerms = ko.pureComputed(() => {
    const perms = this.permissions();
    if (!perms) {
      return;
    }
    return (
      perms.principalHasPermissionKind(
        specialGroups.specialPermGroup1,
        SP.PermissionKind.viewListItems
      ) &&
      perms.principalHasPermissionKind(
        specialGroups.specialPermGroup2,
        SP.PermissionKind.viewListItems
      )
    );
  });

  checkResponseDocs = (checkResponses) => {
    this.responseDocs().forEach((responseDoc) => {
      if (
        responseDoc.responseDoc.DocumentStatus.Value() ==
          AuditResponseDocStates.Submitted &&
        responseDoc.chkApproveResDoc() != checkResponses
      ) {
        responseDoc.chkApproveResDoc(checkResponses);
      }
    });
  };

  //Response Docs View
  showResponseDocs = ko.observable(false);

  toggleShowResponseDocs() {
    this.showResponseDocs(!this.showResponseDocs());
  }

  async init() {
    await this.getResponsePermissions();
  }

  async getResponsePermissions() {
    const perms = await appContext.AuditResponses.GetItemPermissions(
      this.response
    );
    this.permissions(perms);
  }
}

class RequestDetailResponseDoc {
  constructor(request, responseDoc) {
    this.request = request;
    this.responseDoc = responseDoc;
  }

  chkApproveResDoc = ko.observable();

  request;
  response;

  checkInResponseDoc = async () => {
    const result = await appContext.AuditResponseDocs.CheckInDocument(
      this.responseDoc.FileRef.Value()
    );

    if (result) {
      await appContext.AuditResponseDocs.LoadEntity(this.responseDoc, true);
    }
  };
}
