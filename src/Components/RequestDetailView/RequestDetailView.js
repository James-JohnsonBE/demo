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

  async loadRequest(requestId) {
    const request = await appContext.AuditRequests.FindById(requestId);
    await ensureRequestPermissions(request);
    this.request(request);
  }

  request = ko.observable();

  params = ko.pureComputed(() => {
    // By resolving this observable, we can force the component to re-render
    return {
      request: this.request(),
    };
  });

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
