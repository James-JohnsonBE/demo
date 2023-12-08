var Audit = window.Audit || {};
Audit.Responses = Audit.Responses || {};

$(document).ready(function () {
  SP.SOD.executeFunc(
    "sp.js",
    "SP.ClientContext",
    ExecuteOrDelayUntilScriptLoaded(Init, "sp.js")
  );
});

function Init() {
  /*** note: there are 3 people picker fields on this form. do not rearrange them. the script checks their order ***/

  Audit.Responses.Form = new Audit.Responses.FormEdit();
  Audit.Responses.Init();
}

Audit.Responses.Init = function () {
  Audit.Common.Utilities.GetLookupFormField("Request Number").attr(
    "disabled",
    "disabled"
  );
  $("input[title='Title']").attr("disabled", "disabled");
  $("input[title='Sample Number']").attr("disabled", "disabled");
};

Audit.Responses.FormEdit = function () {
  $("[title$=' Required Field']").each(function () {
    $(this).attr("title", $(this).attr("title").replace(" Required Field", ""));
  });

  //disable the save button until the site groups load
  $("input[id$=_diidIOSaveItem]").attr("disabled", "disabled");

  var m_siteUrl = _spPageContextInfo.webServerRelativeUrl; //IE11 in sp 2013 does not recognize L_Menu_BaseUrl

  var m_curActionOffice =
    Audit.Common.Utilities.GetLookupDisplayText("Action Office");
  var m_curResponseStatus = $("select[title='Response Status']").val();

  /************* FPRA CHECK also 1 other check in PreSaveAction ***********/
  if (m_curActionOffice.toLowerCase().indexOf("fpra") >= 0) {
    $(".pocFields").show();
  }

  var m_ResponseItem = null;
  var m_ResponseFolder = null;
  var m_RequestNumber = null;
  var m_RequestSensitivity = null;
  var m_RequestStatus = null;
  var m_RequestSubject = null;
  var m_RequestInternalDueDate = null;
  var m_arrSiteGroups = null;
  var m_arrAOs = null;
  var m_bSaveable = false;
  var m_currentUserEmail = null;

  var currCtx = new SP.ClientContext.get_current();
  var web = currCtx.get_web();

  var m_groupColl = web.get_siteGroups();
  currCtx.load(m_groupColl);

  var aoList = web
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetListTitleActionOffices());
  var aoQuery = new SP.CamlQuery();
  aoQuery.set_viewXml(
    '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'
  );
  m_aoItems = aoList.getItems(aoQuery);
  currCtx.load(m_aoItems, "Include(ID, Title, UserGroup)");

  var requestList = web
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetListTitleRequests());
  var requestQuery = new SP.CamlQuery();
  requestQuery.set_viewXml(
    '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'
  );
  m_requestItems = requestList.getItems(requestQuery);
  currCtx.load(
    m_requestItems,
    "Include(ID, Title, ReqStatus, ReqSubject, Sensitivity, InternalDueDate, ActionOffice, Modified)"
  );

  var responseTitle = $("input[title='Title']").val();
  var responseDocLib = web
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
  var responseDocQuery = new SP.CamlQuery();
  responseDocQuery.set_viewXml(
    "<View><Query><Where><Eq><FieldRef Name='FileLeafRef'/><Value Type='Text'>" +
      responseTitle +
      "</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>"
  );
  m_responseFolderItems = responseDocLib.getItems(responseDocQuery);
  currCtx.load(
    m_responseFolderItems,
    "Include( DisplayName, Id, EncodedAbsUrl, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
  );

  //get this current response item
  var curItemID = GetUrlKeyValue("ID");
  var responseList = web
    .get_lists()
    .getByTitle(Audit.Common.Utilities.GetListTitleResponses());
  var responseQuery = new SP.CamlQuery();
  responseQuery.set_viewXml(
    "<View Scope=\"RecursiveAll\"><Query><Where><Eq><FieldRef Name='ID'/><Value Type='Text'>" +
      curItemID +
      "</Value></Eq></Where></Query></View>"
  );
  m_responseItems = responseList.getItems(responseQuery);
  currCtx.load(
    m_responseItems,
    "Include(ID, Title, ReqNum, ActionOffice, ReturnReason, SampleNumber, ResStatus, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
  );

  m_currentUser = web.get_currentUser();
  currCtx.load(m_currentUser);

  currCtx.executeQueryAsync(OnSuccess, OnFailure);
  function OnSuccess(sender, args) {
    m_fnLoadData();
  }
  function OnFailure(sender, args) {
    statusId = SP.UI.Status.addStatus(
      "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
    );
    SP.UI.Status.setStatusPriColor(statusId, "red");
  }

  function m_fnLoadData() {
    Audit.Common.Utilities.LoadSiteGroups(m_groupColl);
    Audit.Common.Utilities.LoadActionOffices(m_aoItems);
    LoadResponse();
    LoadResponseFolder();
    LoadRequest();
    LoadUser();

    if (m_curResponseStatus == "7-Closed") {
      statusId = SP.UI.Status.addStatus(
        "This Response is Closed. It can only be re-opened from the IA Dashboard"
      );
      SP.UI.Status.setStatusPriColor(statusId, "yellow");
      m_bSaveable = false;
    } else if (m_RequestStatus != "Open" && m_RequestStatus != "ReOpened") {
      statusId = SP.UI.Status.addStatus(
        "The Request with this Response is not Open. It can only be re-opened from the IA Dashboard"
      );
      SP.UI.Status.setStatusPriColor(statusId, "yellow");
      m_bSaveable = false;
    } else if (
      m_ResponseItem &&
      m_ResponseFolder &&
      m_curResponseStatus != "7-Closed"
    ) {
      $("input[id$=_diidIOSaveItem]").removeAttr("disabled");
      m_bSaveable = true;
    } else {
      m_bSaveable = false;
    }

    if (!m_bSaveable) return;

    function m_fnUpdateClosedByFields(newStatus) {
      if (newStatus != m_curResponseStatus && newStatus == "7-Closed") {
        //update closed date
        var curDate = new Date();
        var dt = curDate.format("MM/dd/yyyy");
        var hours = curDate.format("h tt");
        var mins = curDate.format("mm");
        mins = mins - (mins % 5);
        mins = Audit.Common.Utilities.PadDigits(mins, 2);

        $("input[title='Closed Date']").val(dt);

        var dDateID = $(":input[title='Closed Date']").attr("id");
        $(":input[id='" + dDateID + "Hours" + "']").val(hours);
        $(":input[id='" + dDateID + "Minutes" + "']").val(mins);

        //update closed by
        if (m_currentUserEmail != null && m_currentUserEmail != "") {
          if ($("div[title^='People Picker']:eq(2):empty")) {
            $("div[title^='People Picker']:eq(2)").text(m_currentUserEmail);
            $("a[title^='Check Names']").click();
          }
        }
      } else {
        $("input[title='Closed Date']").val("");
        $("div[title^='People Picker']:eq(2)").text("");
        $("a[title^='Check Names']").click();
      }
    }

    $("select[title='Response Status']").change(function () {
      m_fnUpdateClosedByFields($(this).val());
    });
  }

  function LoadUser() {
    m_currentUserEmail = m_currentUser.get_email();
  }

  function LoadRequest() {
    if (m_ResponseItem == null) return;

    var requestNumber = m_ResponseItem.get_item("ReqNum");
    if (requestNumber == null) return;

    requestNumber = requestNumber.get_lookupValue();

    var listItemEnumerator = m_requestItems.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      var oListItem = listItemEnumerator.get_current();

      var id = oListItem.get_item("ID");
      var number = oListItem.get_item("Title");
      var status = oListItem.get_item("ReqStatus");
      var subject = oListItem.get_item("ReqSubject");
      var internalDueDate = oListItem.get_item("InternalDueDate");
      var sensitivity = oListItem.get_item("Sensitivity");

      if (requestNumber == number) {
        m_RequestStatus = status;
        m_RequestNumber = number;
        m_RequestSensitivity = sensitivity;

        m_RequestSubject = subject;
        if (m_RequestSubject == null) m_RequestSubject = "";

        m_RequestInternalDueDate = internalDueDate;
        if (internalDueDate != null && internalDueDate != "")
          m_RequestInternalDueDate = internalDueDate.format("MM/dd/yyyy");
        else m_RequestInternalDueDate = "";

        break;
      }
    }
  }

  function LoadResponse() {
    var listItemEnumerator = m_responseItems.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      var oListItem = listItemEnumerator.get_current();

      m_ResponseItem = oListItem;

      break;
    }
  }
  function LoadResponseFolder() {
    m_ResponseFolder = null;

    var listItemEnumerator = m_responseFolderItems.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      m_ResponseFolder = listItemEnumerator.get_current();
    }
    if (m_ResponseFolder == null) {
      statusID = SP.UI.Status.addStatus(
        "Error:",
        "Unable to Retrieve the Response Folder. Please contact Administrator."
      );
      SP.UI.Status.setStatusPriColor(statusID, "red");
    }
  }

  var publicMembers = {
    GetSiteUrl: function () {
      return m_siteUrl;
    },
    IsSaveable: function () {
      return m_bSaveable;
    },
    GetRequestNumber: function () {
      return m_RequestNumber;
    },
    GetRequestSubject: function () {
      return m_RequestSubject;
    },
    GetRequestSensitivity: function () {
      return m_RequestSensitivity;
    },
    GetRequestDueDate: function () {
      return m_RequestInternalDueDate;
    },
    GetResponseItem: function () {
      return m_ResponseItem;
    },
    GetCurrentAO: function () {
      return m_curActionOffice;
    },
    GetCurrentResponseStatus: function () {
      return m_curResponseStatus;
    },
  };

  return publicMembers;
};

//need to update here instead of IA dashboard in case the request/response number changes, we have to create a new response folder or update it. If it doesn't get created or updated, we don't want to save the response
function PreSaveAction() {
  if (!Audit.Responses.Form.IsSaveable()) {
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

  var sampleNumber = $("input[title='Sample Number']").val();
  if ($.trim(sampleNumber) == "") {
    SP.UI.Notify.addNotification("Please provide the Sample Number");
    $("input[title='Sample Number']").focus();
    return false;
  }

  var selectedResponseStatus = $("select[title='Response Status']").val();

  //var actionOffice = Audit.Common.Utilities.GetLookupFieldText( "Action Office" );
  var actionOffice =
    Audit.Common.Utilities.GetLookupDisplayText("Action Office");
  if ($.trim(actionOffice) == "" || actionOffice == "(None)") {
    SP.UI.Notify.addNotification("Please provide the Action Office");
    Audit.Common.Utilities.GetLookupFormField("Action Office").focus();
    return false;
  }

  var actionOfficeGroupName =
    Audit.Common.Utilities.GetAOSPGroupName(actionOffice);
  if (actionOfficeGroupName == null || actionOfficeGroupName == "") {
    SP.UI.Notify.addNotification(
      "The selected action office does not have an associated SharePoint user Group. Please contact Administrator"
    );
    Audit.Common.Utilities.GetLookupFormField("Action Office").focus();
    return false;
  }

  /************* FPRA CHECK ***********/
  if (actionOffice.toLowerCase().indexOf("fpra") < 0) {
    //clear the poc and cc field because it currently only applies to fpra
    var poc = $.trim($("div[title^='People Picker']:eq(0)").text());
    var pocCC = $.trim($("div[title^='People Picker']:eq(1)").text());

    if (poc != "" && pocCC != "") {
      SP.UI.Notify.addNotification("Please clear the POC and the CC field");
      return false;
    }
  }

  if (!confirm("Are you sure you would like to update this Response?"))
    return false;

  /************* Sensitivity CHECK ***********/

  var currentResponseSensitivity = Audit.Responses.Form.GetRequestSensitivity();
  if (
    selectedResponseStatus == "4-Approved for QA" &&
    currentResponseSensitivity == "None"
  ) {
    alert("Request Sensitivity not set; cannot submit to QA.");

    return false;
  }

  var curResponseTitle = $("input[title='Title']").val();
  var newResponseFolderTitle =
    requestNum + "-" + actionOffice + "-" + sampleNumber;
  //This is hidden in the form
  $("input[title='Title']").val(newResponseFolderTitle);

  var actionOfficeGroupObj = Audit.Common.Utilities.GetSPSiteGroup(
    actionOfficeGroupName
  );
  if (actionOfficeGroupObj == null) {
    alert("Action Office Group Not found");
    return false;
  }

  //alert("Check if it's not a duplicated response");

  //Reenable the disabled field to allow it to be submitted
  Audit.Common.Utilities.GetLookupFormField("Request Number").removeAttr(
    "disabled"
  );
  $("input[title='Title']").removeAttr("disabled");
  $("input[title='Sample Number']").removeAttr("disabled");

  return true;

  /*
	
	//if action office changed, update the permissions
	var currentAO = Audit.Responses.Form.GetCurrentAO();
	var currentResponseStatus = Audit.Responses.Form.GetCurrentResponseStatus();
	if( (currentAO != actionOffice) || (currentResponseStatus != selectedResponseStatus ) )
	{		
		//Get the promise from the function
	    var promise = null;
	    
		promise = UpdateResponse( actionOfficeGroupObj, newResponseFolderTitle, selectedResponseStatus );
	
	    //This is run when the promise is resolved
	    promise.done(function()
	    {
	    	//Reenable the disabled field to allow it to be submitted
			Audit.Common.Utilities.GetLookupFormField( "Request Number" ).removeAttr("disabled");
			$("input[title='Title']").removeAttr("disabled");
			$("input[title='Sample Number']").removeAttr("disabled");
			
			var saveButtonName = $('input[name$="SaveItem"]').attr('name');
	   		WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions(saveButtonName, "", true, "", "", false, true));  
	    });
	
	    //This is run when the promise is rejected
	    promise.fail(function(error){
	    	
	 		SP.UI.Notify.addNotification("Error occured when creating the Response Folder: " + error);
		});
	}	
	else
	{
	    //Reenable the disabled field to allow it to be submitted
		Audit.Common.Utilities.GetLookupFormField( "Request Number" ).removeAttr("disabled");
		$("input[title='Title']").removeAttr("disabled");
		$("input[title='Sample Number']").removeAttr("disabled");

    	return true;
    }
    */
}

/*
function UpdatePerms( clientContext, item, actionOfficeGroupObj, newResponseStatus, isFolder)
{
    web = clientContext.get_web();

	this.currentUser = web.get_currentUser();
	this.ownerGroup = web.get_associatedOwnerGroup();
 	this.memberGroup = web.get_associatedMemberGroup();
 	this.visitorGroup = web.get_associatedVisitorGroup();

	//check QA before resetting
	
	var permissionsToCheck = SP.PermissionKind.viewListItems;
	var qaHasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(item,  Audit.Common.Utilities.GetGroupNameQA() , permissionsToCheck );
	
	item.resetRoleInheritance();
	item.breakRoleInheritance( false, false );

	//Always add owner, member and visitor groups
	
	//add owner group
	var roleDefBindingColl = SP.RoleDefinitionBindingCollection.newObject( clientContext );
	roleDefBindingColl.add( clientContext.get_web().get_roleDefinitions().getByType( SP.RoleType.administrator ) );
	item.get_roleAssignments().add( ownerGroup, roleDefBindingColl );
	
	//add member group
	var roleDefBindingColl2 = SP.RoleDefinitionBindingCollection.newObject( clientContext );
	roleDefBindingColl2.add( clientContext.get_web().get_roleDefinitions().getByType( SP.RoleType.contributor ) );
	item.get_roleAssignments().add( memberGroup, roleDefBindingColl2 );
	
	//add visitor group
	var roleDefBindingColl3 = SP.RoleDefinitionBindingCollection.newObject( clientContext );
	roleDefBindingColl3.add( clientContext.get_web().get_roleDefinitions().getByName( "Restricted Read") );
	item.get_roleAssignments().add( visitorGroup, roleDefBindingColl3 );

	//add new action office
	var permissionName = "Restricted Read";
	if( newResponseStatus == "1-Open" || newResponseStatus == "3-Returned to Action Office" ) //QA should be able to update the response status and the response folder; Technically, this should be on email sent
		permissionName = "Restricted Contribute";
	if( actionOfficeGroupObj != null && actionOfficeGroupObj != null)
	{
		var roleDefBindingColl4 = SP.RoleDefinitionBindingCollection.newObject( clientContext );
		roleDefBindingColl4.add( clientContext.get_web().get_roleDefinitions().getByName( permissionName ) );
		item.get_roleAssignments().add( actionOfficeGroupObj , roleDefBindingColl4 );
	}		
	
	//check QA
	if( qaHasRead || newResponseStatus == "4-Approved for QA")
	{
		var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameQA() );
		
		var permissionName = "Restricted Read";
		if( newResponseStatus == "4-Approved for QA" )		
			permissionName = "Restricted Contribute"; //QA should be able to update the response status and the response folder
		
		var roleDefBindingColl5 = SP.RoleDefinitionBindingCollection.newObject( clientContext );
		roleDefBindingColl5.add( clientContext.get_web().get_roleDefinitions().getByName( permissionName ) );
		item.get_roleAssignments().add( spGroupQA, roleDefBindingColl5 );
	}
	
	//delete current logged in user from permissions because it gets added by default
	item.get_roleAssignments().getByPrincipal( currentUser ).deleteObject();
}

//http://stackoverflow.com/questions/29157842/create-multiple-sharepoint-items-using-javascript-on-new-form-but-delay-next-pag
//http://stackoverflow.com/questions/33803268/ecmascript-callback-method-executed-after-presaveaction-method

//always reset role inheritance on the response folder, then break it and add new action office; this will also take care of removing special permissions
function UpdateResponse( actionOfficeGroupObj, newResponseFolderTitle, newResponseStatus) 
{
    var d = $.Deferred();

    var clientContext = null;
    var web = null;
    var vID;

    clientContext = new SP.ClientContext.get_current();
    web = clientContext.get_web();
	
	clientContext.load(web); 
	    
	//Note: this will strip special permissions on response item and folders
	var responseItem = Audit.Responses.Form.GetResponseItem();
	var responseFolder = Audit.Responses.Form.GetResponseFolder();
	
	responseFolder.set_item("FileLeafRef", newResponseFolderTitle);
	responseFolder.set_item("Title", newResponseFolderTitle);
	responseFolder.update();

	UpdatePerms(clientContext, responseItem, actionOfficeGroupObj, newResponseStatus, 0 );
	UpdatePerms(clientContext, responseFolder, actionOfficeGroupObj, newResponseStatus, 1 );
		
	if( newResponseStatus == "4-Approved for QA")
	{
		if( m_responseDocSubmittedItems != null )
		{
			var listItemEnumerator = m_responseDocSubmittedItems.getEnumerator();
			while(listItemEnumerator.moveNext())
			{
				var oListItem = listItemEnumerator.get_current();
				oListItem.set_item("DocumentStatus", "Sent to QA");
				oListItem.update();		
			}
		}
		
		//these are the documents that are marked for deletion by the AO
		if( m_responseDocMarkedForDeletionItems != null )
		{
			arrItemsToRecyle = new Array();
			
			var listItemEnumerator = m_responseDocMarkedForDeletionItems.getEnumerator();
			while(listItemEnumerator.moveNext())
			{
				var oListItem = listItemEnumerator.get_current();
				arrItemsToRecyle.push( oListItem );
			}
			
			for( var x = 0; x < arrItemsToRecyle.length; x ++ )
			{
				arrItemsToRecyle[x].recycle();
			}
		}
		
		if( m_responseDocRejectedItems != null )
		{
			var listItemEnumerator = m_responseDocRejectedItems.getEnumerator();
			while(listItemEnumerator.moveNext())
			{
				var oListItem = listItemEnumerator.get_current();
				oListItem.set_item("DocumentStatus", "Archived");
				oListItem.update();		
			}
		}
		
		
		var emailList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleEmailHistory() );

		var emailListQuery = new SP.CamlQuery();	
		emailListQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>');
		emailListFolderItems = emailList.getItems( emailListQuery );
		clientContext.load( emailListFolderItems, 'Include(ID, FSObjType, Title, DisplayName)');
		
	}
	
    //var data = {d: d, list: listItems}
    
    //reqNum = $("select[title='Request Number']");    
	var data = {d: d, responseID: newResponseFolderTitle }
	
    //Execute the query and pass the data with our deferred object
    clientContext.executeQueryAsync(Function.createDelegate(data, onListItemsLoadSuccess), Function.createDelegate(data, onQueryFailed));//After this line "return true" in PreSaveAction() will execute and then CallBackMethods will run.
    
    //Return a promise that can either resolve or reject depending on if the async function is a success or failure
    return d.promise();    

}

function onListItemsLoadSuccess() 
{
    //Access the listItems
  	// var listItems = this.list;

	if ( typeof(emailListFolderItems ) == "undefined" || emailListFolderItems  == null )
	{
		this.d.resolve();
   	}
	else if( emailListFolderItems )
	{
		var requestNumber = Audit.Responses.Form.GetRequestNumber();
		
		//Check if folder exists in email library
    	var bFolderExists = false;
    	var listItemEnumerator = emailListFolderItems.getEnumerator();
		while(listItemEnumerator.moveNext())
		{
			var folderItem = listItemEnumerator.get_current();				
			var itemName = folderItem.get_displayName();					
			if( itemName == requestNumber )
			{
				var bFolderExists = true;
				break;
			}
		}
		
	    clientContext = new SP.ClientContext.get_current();
	    web = clientContext.get_web();
		var emailList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleEmailHistory() );
		//If folder doesn't exist, create it in email list
		if ( !bFolderExists )
		{					
			var itemCreateInfo = new SP.ListItemCreationInformation();
			itemCreateInfo.set_underlyingObjectType( SP.FileSystemObjectType.folder );
			itemCreateInfo.set_leafName( requestNumber );
			
			oNewEmailFolder = emailList.addItem( itemCreateInfo );								
			oNewEmailFolder.update();					
		}
		
		
		var emailSubject = "Your Approval Has Been Requested for Response Number: " + this.responseID;
		var emailText = "<div>Audit Request Reference: <b>" + requestNumber + "</b></div>" +
			"<div>Audit Request Subject: <b>"+ Audit.Responses.Form.GetRequestSubject() + "</b></div>" +		
			"<div>Audit Request Due Date: <b>"+ Audit.Responses.Form.GetRequestDueDate() + "</b></div><br/>";
			"<div>Response: <b><ul><li>" + this.responseID + "<li></ul></b></div><br/>";
		
		var itemCreateInfo = new SP.ListItemCreationInformation();
	    itemCreateInfo.set_folderUrl( location.protocol + "//" + location.host + Audit.Common.Utilities.GetSiteUrl() + "/Lists/" + Audit.Common.Utilities.GetListNameEmailHistory() + "/" + requestNumber );				    
	    oListItem = emailList.addItem( itemCreateInfo );
	    oListItem.set_item('Title', emailSubject);
	    oListItem.set_item('Body', emailText);
	    oListItem.set_item('To', Audit.Common.Utilities.GetGroupNameQA() );
	    oListItem.set_item('NotificationType', "QA Notification" );
	    oListItem.set_item('ReqNum', requestNumber );
	    oListItem.set_item('ResID', this.responseID);
	    oListItem.update();	
	    
	    clientContext.executeQueryAsync
		(
			function () 
			{	
			    //On success, resolve the promise
			}, 
			function (sender, args) 
			{
			}
		);		
	}
	
    this.d.resolve();
}

function onQueryFailed(sender, args) 
{
	//	alert ( args.get_message() );
	//On failure, reject the promise
    this.d.reject(args.get_message());
}

*/
/*	var sampleNumber = $( "input[title='SampleNumber']" ).text();
	var comments = "zz";
		
	var currCtx = new SP.ClientContext.get_current();
	var web = currCtx.get_web();
	
	var listName = Audit.Responses.EditPage.GetResponseList();
	var responseList = web.get_lists().getByTitle( listName );
	var itemCreateInfo = new SP.ListItemCreationInformation();
	this.oListItem = responseList.addItem(itemCreateInfo);
	oListItem.set_item("ReqNum", requestNum);
	oListItem.set_item("Title", title);
//	oListItem.set_item("ActionOffice", actionOffice);
	if( sampleNumber != "" ) //make sure it has a value
		oListItem.set_item("SampleNumber", sampleNumber);
	oListItem.set_item("Comments", comments);
	
	oListItem.update();
	
	return;
	
	currCtx.executeQueryAsync(OnSuccess, OnFailure);	
	function OnSuccess(sender, args)
	{	
		//window.location = 	
		alert("Asdfasdf");
	
		//m_fnLoadData();	
	}		
	function OnFailure(sender, args)
	{
		statusId = SP.UI.Status.addStatus("Request failed: "  + args.get_message() + "\n" + args.get_stackTrace());
		SP.UI.Status.setStatusPriColor(statusId, 'red');
	}
	
	return false;*/
