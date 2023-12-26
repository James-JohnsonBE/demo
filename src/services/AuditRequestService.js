import { appContext } from "../infrastructure/ApplicationDbContext.js";

export async function AddNewRequest(request) {
  const fields = request.FieldMap;

  // See if we have a request with this title already
  const existingRequests = await appContext.AuditRequests.FindByColumnValue(
    [{ column: "Title", value: fields.Title.Value() }],
    {},
    { count: 1 }
  );

  // TODO: use addFieldRequirement?
  if (existingRequests.results.length) {
    throw new Error("Request with this name already exists!");
  }

  request.FieldMap.EmailActionOffice.Value(
    request.FieldMap.ActionOffice.Value()
  );

  await appContext.AuditRequests.AddEntity(request);
}

export async function OnNewRequest() {
  var currCtx = new SP.ClientContext.get_current();
  var web = currCtx.get_web();

  var requestList = web
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetListTitleRequests());
  var requestQuery = new SP.CamlQuery();
  requestQuery.set_viewXml(
    '<View><Query><OrderBy><FieldRef Name="ID" Ascending="FALSE"/></OrderBy></Query><RowLimit>1</RowLimit></View>'
  );
  const requestItems = requestList.getItems(requestQuery);
  //request status has internal name as response status in the request list
  currCtx.load(
    requestItems,
    "Include(ID, Title, ActionOffice, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
  );

  const emailList = web
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory());
  var emailListQuery = new SP.CamlQuery();
  emailListQuery.set_viewXml(
    '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>'
  );
  const emailListFolderItems = emailList.getItems(emailListQuery);
  currCtx.load(emailListFolderItems, "Include(ID, Title, DisplayName)");

  currCtx.executeQueryAsync(
    function () {
      var oListItem = null;

      var listItemEnumerator = requestItems.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        oListItem = listItemEnumerator.get_current();
        break;
      }

      if (oListItem) {
        m_fnCreateRequestInternalItem(oListItem.get_item("ID"));

        if (!oListItem.get_hasUniqueRoleAssignments()) {
          var bDoneBreakingReqPermisions = false;
          m_fnBreakRequestPermissions(
            oListItem,
            false,
            null,
            function (bDoneBreakingReqPermisions) {
              var bDoneCreatingEmailFolder = false;
              Audit.Common.Utilities.CreateEmailFolder(
                emailList,
                oListItem.get_item("Title"),
                oListItem,
                function (bDoneCreatingEmailFolder) {
                  _myViewModel.tabs.selectTab(
                    _myViewModel.tabOpts.RequestDetail
                  );
                  m_fnRefresh(oListItem.get_item("Title"));
                }
              );
            }
          );
        } else {
          var bDoneCreatingEmailFolder = false;
          Audit.Common.Utilities.CreateEmailFolder(
            emailList,
            oListItem.get_item("Title"),
            oListItem,
            function (bDoneCreatingEmailFolder) {
              _myViewModel.tabs.selectTab(_myViewModel.tabOpts.RequestDetail);
              m_fnRefresh(oListItem.get_item("Title"));
            }
          );
        }
      }
    },
    function (sender, args) {
      //alert( "Request failed: "  + args.get_message() + "\n" + args.get_stackTrace() );
      m_fnRefresh();
    }
  );
}

function CreateRequestInternalItem(requestNumber) {
  var currCtx = new SP.ClientContext.get_current();
  var web = currCtx.get_web();

  var requestInternalList = web
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetListTitleRequestsInternal());

  var itemCreateInfo = new SP.ListItemCreationInformation();
  var newRequestInternalItem = requestInternalList.addItem(itemCreateInfo);
  newRequestInternalItem.set_item("ReqNum", requestNumber);
  newRequestInternalItem.update();

  currCtx.executeQueryAsync(
    function () {},
    function (sender, args) {
      alert("error creating internal request item");
      console.error(sender, args);
    }
  );
}
