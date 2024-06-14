import { ConstrainedEntity } from "../sal/primitives/index.js";

export class AuditResponseDocRO extends ConstrainedEntity {
  constructor(params) {
    super(params);
  }

  markApprovedForRO(request, response) {
    this.ReqNum = request.Title;
    this.ResID = response.Title.toString();
    this.FiscalYear = request.FiscalYear.toString();
    this.ReqSubject = request.ReqSubject.toString();
    this.RequestingOffice = request.RequestingOffice.Value()?.UserGroup?.Title;
  }

  static Views = {
    All: [
      "ID",
      "Title",
      "ReqNum",
      "ResID",
      "FiscalYear",
      "RequestingOffice",
      "ReqSubject",
      "FileLeafRef",
      "FileRef",
    ],
    ApprovedForROUpdate: [
      "ReqNum",
      "ResID",
      "FiscalYear",
      "ReqSubject",
      "RequestingOffice",
    ],
  };

  static ListDef = {
    name: "AuditResponseDocsRO",
    title: "AuditResponseDocsRO",
  };
}
