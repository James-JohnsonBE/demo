import AuditRequest from "../../entities/AuditRequest.js";
export default class NewRequestFormModule {
  constructor(params) {}

  newRequest = new AuditRequest();

  submitRequest() {
    const request = this.newRequest;
    const errors = request.validate();
  }
}
