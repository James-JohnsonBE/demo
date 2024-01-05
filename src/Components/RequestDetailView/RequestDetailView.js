import { getUrlParam } from "../../common/Router.js";
import { appContext } from "../../infrastructure/ApplicationDbContext.js";
import { registerComponent } from "../../infrastructure/RegisterComponents.js";
import {
  ensureRequestPermissions,
  ensureRequestInternalItem,
  getRequestCoversheets,
  getRequestResponses,
} from "../../services/AuditRequestService.js";
import { showBulkAddResponseModal } from "../../services/AuditResponseService.js";
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

    this.request(request);
    this.requestInternal(requestInternal);

    this.params({
      request: this.request(),
      requestInternal: this.requestInternal(),
      requestCoversheets: this.requestCoversheets,
      requestResponses: this.requestResponses,
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
  }) {
    this.request = request;
    this.requestInternal = requestInternal;
    this.requestCoversheets(
      requestCoversheets.map((cs) => new RequestDetailCoversheet(cs))
    );
    this.requestResponses(
      requestResponses.map((response) => new RequestDetailResponse(response))
    );
    console.log("recreating detail view component!", request);

    this.requestInternal.activeViewersComponent.pushCurrentUser();

    this.tabs = new TabsModule(
      Object.values(this.tabOpts),
      requestDetailUrlParam
    );

    this.init();
  }

  requestCoversheets = ko.observableArray();
  requestResponses = ko.observableArray();

  tabOpts = {
    Coversheets: new Tab("coversheets", "Coversheets", {
      id: "requestDetailCoversheetsTabTemplate",
      data: this,
    }),
    Responses: new Tab("responses", "Responses", {
      id: "requestDetailResponsesTabTemplate",
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

  addResponseHandler() {}

  async bulkAddResponsesHandler() {
    await showBulkAddResponseModal(this.request);
    this.reloadResponses();
  }

  async reloadResponses() {
    const responses = await getRequestResponses(this.request);
    this.requestResponses(
      responses.map((response) => new RequestDetailResponse(response))
    );
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
 * Hold information regarding our request detail response items
 */
class RequestDetailResponse {
  constructor(response) {
    Object.assign(this, response);
    this.init();
  }
  permissions = ko.observable();

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

  async init() {
    await this.getResponsePermissions();
  }

  async getResponsePermissions() {
    const perms = await appContext.AuditResponses.GetItemPermissions(this);
    this.permissions(perms);
  }
}
