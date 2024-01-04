import { appContext } from "../../infrastructure/ApplicationDbContext.js";
import { registerComponent } from "../../infrastructure/RegisterComponents.js";
import { ensureRequestPermissions } from "../../services/AuditRequestService.js";

const requestDetailViewComponentName = "requestDetailView";

export class RequestDetailViewComponent {
  constructor({ currentRequest }) {
    currentRequest.subscribe((request) => {
      if (request) this.loadRequest(request.ID);
    });
  }

  request = ko.observable();

  params = ko.pureComputed(() => {
    // By observing the request observable, we can force the component to re-render
    return {
      request: this.request(),
    };
  });

  async loadRequest(requestId) {
    // All resource heavy initialization should be done in the component reference class
    // since it persists past the component lifecycle
    const request = await appContext.AuditRequests.FindById(requestId);
    await ensureRequestPermissions(request);
    this.request(request);
  }

  componentName = requestDetailViewComponentName;
}

export default class RequestDetailViewModule {
  constructor({ request }) {
    this.request = request;
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
