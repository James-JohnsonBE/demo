import { showModal } from "../infrastructure/SPModalService.js";

export async function showBulkAddResponseModal(request) {
  const options = {
    title: "Bulk Add Responses (" + request.ReqNum.Value() + ")",
    height: 800,
    url:
      Audit.Common.Utilities.GetSiteUrl() +
      "/pages/AuditBulkAddResponse.aspx?ReqNum=" +
      request.ReqNum.Value(),
  };

  await showModal(options);
}
