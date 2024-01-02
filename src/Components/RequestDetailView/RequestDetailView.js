const requestDetailViewComponentName = "requestDetailView";

export class RequestDetailViewComponent {
  constructor({ currentRequest }) {}

  request = ko.observable();

  params = {
    request: this.request,
  };

  componentName = requestDetailViewComponentName;
}

export default class RequestDetailViewModule {
  constructor({ request }) {
    this.request = requestId;
  }

  init() {}
}
