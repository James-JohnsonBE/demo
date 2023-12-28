import { appContext } from "../../infrastructure/ApplicationDbContext.js";
import { InitSal } from "../../infrastructure/SAL.js";
import { AddNewRequest } from "../../services/AuditRequestService.js";

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
  await report.Init();
  ko.applyBindings(report);
}

class BulkAddRequestPage {
  constructor() {
    console.log("Bulk Add Request");
  }

  async Init() {
    // TODO: need to initialize audit organizations store
    await appContext.AuditOrganizations.ToList();
    await LoadInfo();
  }

  clickUploadResponses() {}

  async clickSubmitRequests() {
    // 1. Query all AuditBulkRequests
    const bulkRequests = await appContext.AuditBulkRequests.ToList(true);

    console.log(bulkRequests[0].FieldMap.ActionOffice.Value());

    const failedInserts = [];
    // 2. Create new AuditRequests
    const insertPromises = bulkRequests.map(async (bulkRequest) => {
      // TODO: For clarity we should map the bulk request to a regular request
      // before inserting
      const newRequest = bulkRequest.toRequest();
      // a. Insert new Request
      try {
        await AddNewRequest(newRequest);
        // await OnAddNewRequest()
      } catch (e) {
        failedInserts.push([e, bulkRequest]);
        return;
      }
      //  a. Run OnRequest Created Callback

      //  b. Delete successfully created AuditBulkRequests
      await appContext.AuditBulkRequests.RemoveEntity(bulkRequest);
    });
    // Reload Page
    const insertResults = await Promise.all(insertPromises);
    // If any failed, need to alert user!
  }
}

function LoadInfo() {
  return new Promise((resolve, reject) => {
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    var aoList = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetListTitleActionOffices());
    var aoQuery = new SP.CamlQuery();
    aoQuery.set_viewXml(
      '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'
    );
    var m_aoItems = aoList.getItems(aoQuery);
    currCtx.load(m_aoItems, "Include(ID, Title, UserGroup)");

    var m_groupColl = web.get_siteGroups();
    currCtx.load(m_groupColl);

    var ownerGroup = web.get_associatedOwnerGroup();
    var memberGroup = web.get_associatedMemberGroup();
    var visitorGroup = web.get_associatedVisitorGroup();
    currCtx.load(ownerGroup);
    currCtx.load(memberGroup);
    currCtx.load(visitorGroup);

    var data = {
      resolve,
      reject,
    };

    currCtx.executeQueryAsync(
      Function.createDelegate(data, OnSuccess),
      Function.createDelegate(data, OnFailure)
    );
    function OnSuccess(sender, args) {
      Audit.Common.Utilities.LoadSiteGroups(m_groupColl);
      Audit.Common.Utilities.LoadActionOffices(m_aoItems);
      resolve();
    }
    function OnFailure(sender, args) {
      // $("#divLoading").hide();

      const statusId = SP.UI.Status.addStatus(
        "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
      );
      SP.UI.Status.setStatusPriColor(statusId, "red");
      reject(args);
    }
  });
}
