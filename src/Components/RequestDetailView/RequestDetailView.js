import { appContext } from "../../infrastructure/ApplicationDbContext.js";
import { registerComponent } from "../../infrastructure/RegisterComponents.js";
import {
  ensureRequestPermissions,
  ensureRequestInternalItem,
} from "../../services/AuditRequestService.js";

const requestDetailViewComponentName = "requestDetailView";

export class RequestDetailViewComponent {
  constructor({ currentRequest }) {
    currentRequest.subscribe((request) => {
      if (request) this.loadRequest(request.ID);
    });
  }

  request = ko.observable();
  requestInternal = ko.observable();

  // By making the params observable, we can force the component to re-render when they change
  params = ko.observable();

  async loadRequest(requestId) {
    // All resource heavy initialization should be done in the component reference class
    // since it persists past the component lifecycle
    const request = await appContext.AuditRequests.FindById(requestId);
    await ensureRequestPermissions(request);

    const requestInternal = await ensureRequestInternalItem(request);

    this.request(request);
    this.requestInternal(requestInternal);

    this.params({
      request: this.request(),
      requestInternal: this.requestInternal(),
    });
  }

  componentName = requestDetailViewComponentName;
}

export default class RequestDetailViewModule {
  constructor({ request, requestInternal }) {
    this.request = request;
    this.requestInternal = requestInternal;
    console.log("recreating detail view component!", request);
  }

  init() {}
}

registerComponent({
  name: requestDetailViewComponentName,
  folder: "RequestDetailView",
  module: RequestDetailViewModule,
  template: "RequestDetailViewTemplate",
});
