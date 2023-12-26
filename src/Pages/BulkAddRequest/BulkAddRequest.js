import { InitSal } from "../../infrastructure/SAL.js";

$(document).ready(function () {
  SP.SOD.executeFunc(
    "sp.js",
    "SP.ClientContext",
    ExecuteOrDelayUntilScriptLoaded(InitBulk, "sp.js")
  );
});

async function InitBulk() {
  await InitSal();
  const report = new BulkAddRequestPage();
  ko.applyBindings(report);
}

class BulkAddRequestPage {
  constructor() {
    console.log("Bulk Add Request");
  }

  clickSubmitRequests() {
    // 1. Query all AuditBulkRequests
    // 2. Create new AuditRequests
    //  a. Run OnRequest Created Callback
    //  b. Delete successfully created AuditBulkRequests
    // Reload Page
  }
}
