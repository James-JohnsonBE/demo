var Audit = window.Audit || {};
Audit.Requests = Audit.Requests || {};

$(document).ready(function () {
  SP.SOD.executeFunc(
    "sp.js",
    "SP.ClientContext",
    ExecuteOrDelayUntilScriptLoaded(Init, "sp.js")
  );
});

function Init() {
  Audit.Requests.Form = new Audit.Requests.FormNew();
  Audit.Requests.Init();
}

Audit.Requests.Init = function () {};

Audit.Requests.FormNew = function () {
  var m_siteUrl = _spPageContextInfo.webServerRelativeUrl; //IE11 in sp 2013 does not recognize L_Menu_BaseUrl

  $("[title$=' Required Field']").each(function () {
    $(this).attr("title", $(this).attr("title").replace(" Required Field", ""));
  });

  $(".ms-RadioText").find("input[type='checkbox']").attr("Checked", "checked");

  var publicMembers = {
    GetSiteUrl: function () {
      return m_siteUrl;
    },
  };

  return publicMembers;
};

function PreSaveAction() {
  var requestNum = $("input[title='Request Number']").val();
  if (requestNum == null || $.trim(requestNum) == "") {
    SP.UI.Notify.addNotification("Please provide the Request Number");
    $("input[title='Request Number']").focus();
    return false;
  }

  var fy = $("select[title='Fiscal Year']").val();
  if (fy == null || $.trim(fy) == "") {
    SP.UI.Notify.addNotification("iscal Year");
    $("select[title='Fiscal Year']").focus();
    return false;
  }

  var requestSubject = $("input[title='Request Subject']").val();
  if (requestSubject == null || $.trim(requestSubject) == "") {
    SP.UI.Notify.addNotification("Please provide the Request Subject");
    $("input[title='Request Subject']").focus();
    return false;
  }

  var internalDueDate = $("input[title='Internal Due Date']").val();
  if (internalDueDate == null || $.trim(internalDueDate) == "") {
    SP.UI.Notify.addNotification("Please provide the Internal Due Date");
    $("input[title='Internal Due Date']").focus();
    return false;
  }

  var dueDate = $("input[title='Request Due Date']").val();
  if (dueDate == null || $.trim(dueDate) == "") {
    SP.UI.Notify.addNotification("Please provide the Request Due Date");
    $("input[title='Request Due Date']").focus();
    return false;
  }

  var dInternalDueDate = new Date(internalDueDate);
  var dDueDate = new Date(dueDate);

  if (dInternalDueDate > dDueDate) {
    SP.UI.Notify.addNotification(
      "The Internal Due Date must be before the Request Due Date"
    );
    $("input[title='Request Due Date']").focus();
    return false;
  }

  /*if( GetUrlKeyValue("IsDlg") == "1")
	{
		//if in dlg, commit and return the request number so tha the parent page can update the drop down
 		//	return true;
		WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions(saveButtonName, "", true, "", "", false, true));  

   		SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK, requestNum);
	}
	
	else */
  //	return true;

  if (!confirm("Are you sure you would like to create this request?"))
    return false;

  var currCtx = new SP.ClientContext.get_current();
  var web = currCtx.get_web();

  var requestList = web
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetListTitleRequests());
  var requestListQuery = new SP.CamlQuery();
  requestListQuery.set_viewXml(
    '<View><Query><OrderBy><FieldRef Name="ID" Ascending="FALSE"/></OrderBy><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' +
      requestNum +
      "</Value></Eq></Where></Query></View>"
  );
  requestItems = requestList.getItems(requestListQuery);
  currCtx.load(requestItems, "Include(ID, Title)");

  currCtx.executeQueryAsync(
    function () {
      var cnt = 0;
      var listItemEnumerator = requestItems.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        cnt++;
      }

      if (cnt > 0) {
        SP.UI.Notify.addNotification("Request with this name already exists. ");
      } else {
        //var newPostBackUrl = window.location.protocol + "//" + window.location.host + L_Menu_BaseUrl + "/Pages/IA_DB.aspx";
        var saveButtonName = $('input[name$="SaveItem"]').attr("name");
        WebForm_DoPostBackWithOptions(
          new WebForm_PostBackOptions(
            saveButtonName,
            "",
            true,
            "",
            "",
            false,
            true
          )
        );
      }
    },
    function (sender, args) {}
  );
  return true;
}
