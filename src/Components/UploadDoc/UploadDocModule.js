var result = {
  CheckInComment: "",
  CheckOutType: 2,
  ContentTag: "{907815CE-5AC6-49BE-A98D-E809AB879CC0},2,3",
  CustomizedPageStatus: 0,
  ETag: '"{907815CE-5AC6-49BE-A98D-E809AB879CC0},2"',
  Exists: true,
  IrmEnabled: false,
  Length: "40969",
  Level: 1,
  LinkingUrl: "",
  MajorVersion: 2,
  MinorVersion: 0,
  Name: "testupload1.png",
  ServerRelativeUrl:
    "/sites/audit/AuditResponseDocs/TEST-001-Data_Act-3/testupload1.png",
  TimeCreated: "2023-12-15T20:28:07Z",
  TimeLastModified: "2023-12-15T20:36:20Z",
  Title: null,
  UIVersion: 1024,
  UIVersionLabel: "2.0",
  UniqueId: "907815ce-5ac6-49be-a98d-e809ab879cc0",
};

export default class UploadDocModule {
  constructor({ response }) {
    this.response = response;
    console.log("hello from response", response());
    response.subscribe(this.responseChangeHandler);

    this.files.subscribe(this.filesChangeHandler);
  }

  files = ko.observable();

  folderPath = ko.pureComputed(() => {
    return (
      Audit.Common.Utilities.GetLibNameResponseDocs() +
      "/" +
      this.response()?.title
    );
  });

  responseChangeHandler = (newResponse) => {
    console.log("hello from response", this.response());
  };

  filesChangeHandler = (newFiles) => {
    this.uploadResponseDocs(newFiles);
  };

  submit = () => {
    console.log("Submitting to Response:", this.response()?.title);
    const files = this.files();
    this.uploadResponseDocs(files);
  };

  uploadResponseDocs = async (files) => {
    for (let file of files) {
      const result = await this.uploadFile(file, file.name, this.folderPath());
      await this.updateFileMetadata(result, {
        Title: "Still Working 3",
        ReqNumId: this.response().request.ID,
        ResIDId: this.response().ID,
      });

      // TODO: Clear uploaded files from control
      // TODO: Show uploading bar
      // TODO: Let host know that upload has completed/push to relevent host array?
    }
  };

  uploadFile = async (file, fileName, relFolderPath) => {
    var result = await fetch(
      Audit.Common.Utilities.GetSiteUrl() +
        `/_api/web/GetFolderByServerRelativeUrl('${relFolderPath}')/Files/add(url='${fileName}',overwrite=true)`,
      {
        method: "POST",
        credentials: "same-origin",
        body: file,
        headers: {
          Accept: "application/json; odata=verbose",
          "Content-Type": "application/json;odata=nometadata",
          "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
        },
      }
    ).then((response) => {
      if (!response.ok) {
        console.error("Error Uploading File", response);
        return;
      }

      return response.json();
    });

    return result.d;
  };

  updateFileMetadata = async (fileResult, payload) => {
    var result = await fetch(fileResult.ListItemAllFields.__deferred.uri, {
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify(payload),
      headers: {
        Accept: "application/json; odata=nometadata",
        "Content-Type": "application/json;odata=nometadata",
        "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
        "X-HTTP-Method": "MERGE",
        "If-Match": "*",
      },
    }).then((response) => {
      if (!response.ok) {
        console.error("Error Updating File", response);
        return;
      }

      return response;
    });

    return result;
  };

  readFile = (file) => {
    var reader = new FileReader();

    reader.onload = function (e) {
      var value = valueAccessor();
      value(e.target.result);
    };

    reader.readAsDataURL(file);
  };

  static componentName = "upload-doc-component";
}

ko.components.register(UploadDocModule.componentName, {
  viewModel: UploadDocModule,
  template: { element: "componentUploadDoc" },
});

ko.bindingHandlers.files = {
  init: function (element, valueAccessor) {
    ko.utils.registerEventHandler(element, "change", function () {
      var value = valueAccessor();
      value(element.files);
      return;
    });
  },
};

var m_siteUrl = _spPageContextInfo.webServerRelativeUrl; //IE11 in sp 2013 does not recognize L_Menu_BaseUrl
var m_selectedRequestNumber = null;
var m_bSaveable = false;

// Load();

function Load() {
  document.body.style.cursor = "default";

  var requestNum = GetUrlKeyValue("ReqNum");
  if (requestNum != null && requestNum != "" && requestNum != undefined) {
    Audit.Common.Utilities.SetLookupFromFieldNameByText(
      "Request Number",
      requestNum
    );

    if (
      Audit.Common.Utilities.GetLookupDisplayText("Request Number") != "(None)"
    )
      Audit.Common.Utilities.GetLookupFormField("Request Number").attr(
        "disabled",
        "disabled"
      );
  }

  var resId = GetUrlKeyValue("ResID");
  if (resId != null && resId != "" && resId != undefined) {
    Audit.Common.Utilities.SetLookupFromFieldNameByText("Response ID", resId);

    if (Audit.Common.Utilities.GetLookupDisplayText("Response ID") != "(None)")
      Audit.Common.Utilities.GetLookupFormField("Response ID").attr(
        "disabled",
        "disabled"
      );
  }

  if (
    requestNum == null ||
    requestNum == "" ||
    resId == null ||
    resId == "" ||
    requestNum == undefined ||
    resId == undefined
  ) {
    statusId = SP.UI.Status.addStatus(
      "This Response Document can not be edited from this location."
    );
    SP.UI.Status.setStatusPriColor(statusId, "yellow");
    m_bSaveable = false;
    $("input[id$=_diidIOSaveItem]").attr("disabled", "disabled");

    return;
  }

  if (requestNum != null && requestNum != "" && resId != null && resId != "") {
    try {
      if ($("input[title='Title']").val() == "") {
        var fileName = $("input[title='Name']").val();
        $("input[title='Title']").val(fileName);
      }
    } catch (err) {}

    $("input[id$=_diidIOSaveItem]").attr("disabled", "disabled");
    $("input[title='Name']").attr("disabled", "disabled");

    //var resID = $("select[title='Response ID']").val();
    //var resID = Audit.Common.Utilities.GetLookupFormField("Response ID").val();
    resID = Audit.Common.Utilities.GetLookupDisplayText("Response ID");
    m_selectedRequestNumber =
      Audit.Common.Utilities.GetLookupDisplayText("Request Number");

    //alert( resID );
    //alert( m_selectedRequestNumber );

    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    var requestList = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetListTitleRequests());
    var requestQuery = new SP.CamlQuery();
    requestQuery.set_viewXml(
      '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="Title" /><Value Type="Text">' +
        m_selectedRequestNumber +
        "</Value></Eq></Where></Query></View>"
    );
    m_requestItems = requestList.getItems(requestQuery);
    currCtx.load(
      m_requestItems,
      "Include(ID, Title, ReqStatus, ActionOffice, Modified)"
    );

    var responseList = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetListTitleResponses());
    var responseQuery = new SP.CamlQuery();
    responseQuery.set_viewXml(
      '<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="Title" /><Value Type="Text">' +
        resID +
        "</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>"
    );
    responseItems = responseList.getItems(responseQuery);
    currCtx.load(responseItems, "Include(ID, Title, ResStatus)");

    /*var ob = new SP.BasePermissions();
        ob.set(SP.PermissionKind.editListItems);
        userHasEditPermissionOnWeb = web.doesUserHavePermissions(ob);
        */
    currCtx.executeQueryAsync(
      function () {
        var requestStatus = m_fnGetRequestStatus();

        if (requestStatus == null || requestStatus == "") {
          statusId = SP.UI.Status.addStatus(
            "Unable to retrieve the Status of the Request associated with this document"
          );
          SP.UI.Status.setStatusPriColor(statusId, "yellow");
          m_bSaveable = false;
          return;
        }

        if (requestStatus != "Open" && requestStatus != "ReOpened") {
          statusId = SP.UI.Status.addStatus(
            "The Request associated to this Document is not Open. It can only be re-opened from the IA Dashboard"
          );
          SP.UI.Status.setStatusPriColor(statusId, "yellow");
          m_bSaveable = false;
          return;
        }

        var listItemEnumerator = responseItems.getEnumerator(); //should only be one - getting the current item's response information
        while (listItemEnumerator.moveNext()) {
          var oListItem = listItemEnumerator.get_current();

          var responseTitle = oListItem.get_item("Title");
          var responseStatus = oListItem.get_item("ResStatus");

          /* removed after testing... for what ever reason, AO gets access denied when renaming the document
                    var documentTitle = $("input[title='Name']").val();
                    if( documentTitle.indexOf( responseTitle ) < 0 )
                    {						
                        var curDate = new Date();
                        documentTitle = responseTitle + "_" + curDate.format("yyyyMMddTHHmmss");
                        //$("input[title='Name']").val( documentTitle );
                    }*/

          if (responseStatus.indexOf("Closed") >= 0) {
            statusId = SP.UI.Status.addStatus(
              "The Response associated to this Document is Closed. It can only be re-opened from the IA Dashboard"
            );
            SP.UI.Status.setStatusPriColor(statusId, "yellow");
            m_bSaveable = false;
          } else {
            $("input[id$=_diidIOSaveItem]").removeAttr("disabled").focus();
            $("select[title='Document Status']").val("Open"); //do this in case the AO deletes an item (which just hides it), but re-add the same named document

            /*if( userHasEditPermissionOnWeb ) 
                        {
                            if($('.ms-informationbar').is(':visible')) //if it's visible then disable cancel button to force them to save
                            {
                                $("input[id$=_diidIOGoBack]").attr("disabled","disabled");
                                setTimeout(function() { 
                                    $("#Ribbon\\.DocLibListForm\\.Edit\\.Commit\\.Cancel-Large").hide(); 
                                }, 500);
                            }
                        }
                        else //do this to force AO to press save button
                        {
                            $("input[id$=_diidIOGoBack]").attr("disabled","disabled");
                            setTimeout(function() { 
                                $("#Ribbon\\.DocLibListForm\\.Edit\\.Commit\\.Cancel-Large").hide(); 
                                $("#Ribbon\\.DocLibListForm\\.Edit\\.Actions\\.DeleteItem-Large").hide(); 
                            }, 500);
                                                            
                            //$("#RibbonContainer").hide();
                        }*/

            m_bSaveable = true;
          }
          //break;
        }
      },
      function (sender, args) {
        statusId = SP.UI.Status.addStatus(
          "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
        );
        SP.UI.Status.setStatusPriColor(statusId, "red");
      }
    );
  }
}

function m_fnGetRequestStatus() {
  var requestStatus = "";

  var listItemEnumerator = m_requestItems.getEnumerator();
  while (listItemEnumerator.moveNext()) {
    var oListItem = listItemEnumerator.get_current();

    var id = oListItem.get_item("ID");
    var number = oListItem.get_item("Title");
    var status = oListItem.get_item("ReqStatus");

    if (m_selectedRequestNumber == number) {
      requestStatus = status;
      break;
    }
  }
  return requestStatus;
}

var publicMembers = {
  GetSiteUrl: function () {
    return m_siteUrl;
  },
  IsSaveable: function () {
    return m_bSaveable;
  },
};

function PreSaveAction() {
  if (!Audit.ResponseDocs.EditPage.IsSaveable()) {
    SP.UI.Notify.addNotification("Unable to save changes");
    return false;
  }

  var requestNum =
    Audit.Common.Utilities.GetLookupDisplayText("Request Number");
  if ($.trim(requestNum) == "" || requestNum == "(None)") {
    SP.UI.Notify.addNotification("Please provide the Request Number");
    Audit.Common.Utilities.GetLookupFormField("Request Number").focus();
    return false;
  }

  var resId = Audit.Common.Utilities.GetLookupDisplayText("Response ID");
  if ($.trim(resId) == "" || resId == "(None)") {
    SP.UI.Notify.addNotification("Please provide the Response ID");
    Audit.Common.Utilities.GetLookupFormField("Response ID").focus();
    return false;
  }

  Audit.Common.Utilities.GetLookupFormField("Request Number").removeAttr(
    "disabled"
  );
  Audit.Common.Utilities.GetLookupFormField("Response ID").removeAttr(
    "disabled"
  );
  $("input[title='Name']").removeAttr("disabled");

  return true;
}
