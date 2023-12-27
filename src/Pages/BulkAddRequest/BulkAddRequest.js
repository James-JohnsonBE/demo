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
    LoadInfo();
  }

  async clickSubmitRequests() {
    // 1. Query all AuditBulkRequests
    const bulkRequests = await appContext.AuditBulkRequests.ToList();

    console.log(bulkRequests[0].FieldMap.ActionOffice.Value());

    const failedInserts = [];
    // 2. Create new AuditRequests
    const insertPromises = bulkRequests.map(async (bulkRequest) => {
      // a. Insert new Request
      try {
        const newRequest = await AddNewRequest(bulkRequest);
        // await OnAddNewRequest()
      } catch (e) {
        failedInserts.push([e, bulkRequest]);
        return;
      }
      //  a. Run OnRequest Created Callback

      //  b. Delete successfully created AuditBulkRequests
      // await appContext.AuditBulkRequests.RemoveEntity(bulkRequest)
      await appContext.AuditRequests.RemoveEntity(bulkRequest);
    });
    // Reload Page
    const insertResults = await Promise.all(insertPromises);
    // If any failed, need to alert user!
  }
}

function LoadInfo() {
  $("#divTblOutput").html("");

  var currCtx = new SP.ClientContext.get_current();
  var web = currCtx.get_web();

  // var requestList = web
  //   .get_lists()
  //   .getByTitle(Audit.Common.Utilities.GetListTitleRequests());
  // var requestQuery = new SP.CamlQuery();
  // requestQuery.set_viewXml(
  //   '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'
  // );
  // m_requestItems = requestList.getItems(requestQuery);
  // //request status has internal name as response status in the request list
  // currCtx.load(
  //   m_requestItems,
  //   "Include(ID, Title, ReqSubject, ReqStatus, IsSample, ReqDueDate, InternalDueDate, ActionOffice)"
  // );

  // var responseList = web
  //   .get_lists()
  //   .getByTitle(Audit.Common.Utilities.GetListTitleResponses());
  // var responseQuery = new SP.CamlQuery();
  // responseQuery.set_viewXml(
  //   '<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="ReqNum"/></OrderBy></Query></View>'
  // );
  // m_responseItems = responseList.getItems(responseQuery);
  // currCtx.load(
  //   m_responseItems,
  //   "Include(ID, Title, ReqNum, ActionOffice, SampleNumber)"
  // );

  // var responseDocsLibFolderslist = web
  //   .get_lists()
  //   .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
  // var responseDocsLibFolderslistQuery = new SP.CamlQuery();
  // responseDocsLibFolderslistQuery.set_viewXml(
  //   '<View><Query><OrderBy><FieldRef Name="Name"/></OrderBy><Where><Eq><FieldRef Name="FSObjType" /><Value Type="Lookup">1</Value></Eq></Where></Query></View>'
  // );
  // responseDocsLibFolderslistQuery.set_folderServerRelativeUrl(
  //   Audit.Common.Utilities.GetSiteUrl() +
  //     "/" +
  //     Audit.Common.Utilities.GetLibNameResponseDocs()
  // );
  // m_ResponseDocsFoldersItems = responseDocsLibFolderslist.getItems(
  //   responseDocsLibFolderslistQuery
  // );
  // currCtx.load(
  //   m_ResponseDocsFoldersItems,
  //   "Include( DisplayName, Id, ContentType)"
  // );

  var aoList = web
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetListTitleActionOffices());
  var aoQuery = new SP.CamlQuery();
  aoQuery.set_viewXml(
    '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'
  );
  var m_aoItems = aoList.getItems(aoQuery);
  currCtx.load(m_aoItems, "Include(ID, Title, UserGroup)");

  //currCtx.load(m_bulkResponsesList , 'Title', 'Id', 'Views');

  var m_groupColl = web.get_siteGroups();
  currCtx.load(m_groupColl);

  var ownerGroup = web.get_associatedOwnerGroup();
  var memberGroup = web.get_associatedMemberGroup();
  var visitorGroup = web.get_associatedVisitorGroup();
  currCtx.load(ownerGroup);
  currCtx.load(memberGroup);
  currCtx.load(visitorGroup);

  currCtx.executeQueryAsync(OnSuccess, OnFailure);
  function OnSuccess(sender, args) {
    // $("#divLoadSettings").show();
    // $("#divLoading").hide();

    // m_listViewId = m_view.get_id();

    Audit.Common.Utilities.LoadSiteGroups(m_groupColl);
    Audit.Common.Utilities.LoadActionOffices(m_aoItems);

    // m_ownerGroupName = ownerGroup.get_title();
    // m_memberGroupName = memberGroup.get_title();
    // m_visitorGroupName = visitorGroup.get_title();

    // m_fnLoadRequests();
    // if( m_oRequest == null || m_oRequest.number == null )
    // {
    //   statusId = SP.UI.Status.addStatus("Error: Request Number does not exist in the Request List. Please verify the URL Parameters and that the Request Number already exists");
    //   SP.UI.Status.setStatusPriColor(statusId, 'red');
    //   $("#divLoadSettings").hide();

    //   return;
    // }

    // m_fnLoadResponses();
    // m_fnLoadResponseFolders();
    // m_fnBindHandlersOnLoad();

    // var isModalDlg = GetUrlKeyValue('IsDlg');
    // if( isModalDlg == null || isModalDlg ==  "" ||  isModalDlg == false)
    // {
    //   $("#btnRefresh").show();
    // }
  }
  function OnFailure(sender, args) {
    // $("#divLoading").hide();

    const statusId = SP.UI.Status.addStatus(
      "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
    );
    SP.UI.Status.setStatusPriColor(statusId, "red");
  }
}
