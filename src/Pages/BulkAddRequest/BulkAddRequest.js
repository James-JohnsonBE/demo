import { appContext } from "../../infrastructure/ApplicationDbContext.js";
import { InitSal } from "../../infrastructure/SAL.js";
import {
  onAddNewRequest,
  AddNewRequest,
} from "../../services/AuditRequestService.js";

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

  bulkRequestItems = ko.observableArray();
  working = ko.observable(false);

  async Init() {
    // TODO: need to initialize audit organizations store
    await appContext.AuditOrganizations.ToList();
    // await LoadInfo();
    this.fetchBulkRequests();
  }

  async clickUploadResponses() {
    await appContext.AuditBulkRequests.ShowForm(
      "BulkAddRequest.aspx",
      "Bulk Add Requests",
      {}
    );

    this.fetchBulkRequests();
  }

  async fetchBulkRequests() {
    console.log("Request added callback");
    const bulkRequests = await appContext.AuditBulkRequests.ToList(true);

    // Decorate our bulk requests with an object to keep track of view specific stuff
    this.bulkRequestItems(
      bulkRequests.map((bulkRequest) => {
        return {
          bulkRequest,
          status: ko.observable(""),
          message: ko.observable(""),
        };
      })
    );
  }

  async clickSubmitRequests() {
    this.working(true);
    // 1. Query all AuditBulkRequests
    const bulkRequestItems = this.bulkRequestItems();

    const failedInserts = [];
    // 2. Create new AuditRequests
    const insertPromises = bulkRequestItems.map(async (bulkRequestItem) => {
      bulkRequestItem.status("pending");
      // Map the bulk request to a an AuditRequest
      const bulkRequest = bulkRequestItem.bulkRequest;

      const newRequest = bulkRequest.toRequest();
      newRequest.Reminders.Value(newRequest.Reminders.Options());

      // a. Insert new Request
      try {
        await AddNewRequest(newRequest);
        await onAddNewRequest(newRequest);
      } catch (e) {
        failedInserts.push([e, bulkRequest]);
        bulkRequestItem.status("failed");
        bulkRequestItem.message(e.message);
        return;
      }
      //  a. Update bulkRequests view
      bulkRequestItem.status("succeeded");

      //  b. Delete successfully created AuditBulkRequests
      await appContext.AuditBulkRequests.RemoveEntity(bulkRequest);
    });
    // Reload Page
    const insertResults = await Promise.all(insertPromises);
    // If any failed, need to alert user!
    this.working(false);
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
