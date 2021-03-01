/***************
Each Response creates a folder in the Response Document library. 
When a response is created, the action office specified gets permissions to the Response folder in the Response Document library
Status changes in the Edit form update the permissions of the Response folder
/*************/

var Audit = window.Audit || {};
Audit.Responses = Audit.Responses|| {};

ExecuteOrDelayUntilScriptLoaded(Init, "sp.js");	

function Init() 
{    
	Audit.Responses.Form = new Audit.Responses.FormNew();
	Audit.Responses.Init();
}

Audit.Responses.Init = function()
{
}

Audit.Responses.FormNew = function ()
{	
	var m_bSaveable = false;
	//disable the save button until the site groups load
	$("input[id$=_diidIOSaveItem]").attr("disabled","disabled");
	
	var m_siteUrl = _spPageContextInfo.webServerRelativeUrl; //IE11 in sp 2013 does not recognize L_Menu_BaseUrl

	var sampleNum = GetUrlKeyValue("Sample");
	if( sampleNum != null && sampleNum!= "" )
	{
		$("input[title='Sample Number']").val( sampleNum );
	}

	//auto select the request number based on the url parameter passed in
	var requestNum = GetUrlKeyValue("ReqNum");
	if( requestNum != null && requestNum != "" )
	{		
		Audit.Common.Utilities.GetLookupFormField( "Request Number" ).hide();
		
		Audit.Common.Utilities.SetLookupFromFieldNameByText("Request Number", requestNum );
        
        if( Audit.Common.Utilities.GetLookupDisplayText("Request Number" ) != "(None)")
	        Audit.Common.Utilities.GetLookupFormField( "Request Number" ).attr( "disabled", "disabled" );
	        
		Audit.Common.Utilities.GetLookupFormField( "Request Number" ).show();
		
		var currCtx = new SP.ClientContext.get_current();
	  	var web = currCtx.get_web();
	  	
		var m_groupColl = web.get_siteGroups();
		currCtx.load( m_groupColl );
		
		var aoList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleActionOffices() );
		var aoQuery = new SP.CamlQuery();	
		aoQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>');
		m_aoItems = aoList.getItems( aoQuery );
		currCtx.load( m_aoItems, 'Include(ID, Title, UserGroup)');
	
		currCtx.executeQueryAsync(OnSuccess, OnFailure);	
		function OnSuccess(sender, args)
		{		
			m_fnLoadData();	
		}		
		function OnFailure(sender, args)
		{
			statusId = SP.UI.Status.addStatus("Request failed: "  + args.get_message() + "\n" + args.get_stackTrace());
			SP.UI.Status.setStatusPriColor(statusId, 'red');
		}
	}
	else
	{
		statusId = SP.UI.Status.addStatus("This Response Document can not be edited from this location.");
		SP.UI.Status.setStatusPriColor(statusId, 'yellow');
		m_bSaveable = false;		
	}

	function m_fnLoadData()
	{
		Audit.Common.Utilities.LoadSiteGroups( m_groupColl );
		Audit.Common.Utilities.LoadActionOffices( m_aoItems );
		
		$("input[id$=_diidIOSaveItem]").removeAttr("disabled");
	}
			
	var publicMembers = 
	{
		GetSiteUrl: function(){ return m_siteUrl; },
		IsSaveable: function(){ return m_bSaveable; }
	}
	
	return publicMembers;
}

/*
function Action2()
{
	var saveButton = $("[name$='diidIOSaveItem']") //gets form save button and ribbon save button
	if (saveButton.length > 0) 
	{
		originalSaveButtonClickHandler = saveButton[0].onclick;  //save original function
	}
	$(saveButton).attr("onclick", "ValidateForm()");
}

*/

//Need to save and make changes here instead of the IA dashboard because we need to create the response folder here. If it doesn't get created, we shouldn't save the response. 
function PreSaveAction()
{	
	if( !Audit.Responses.Form.IsSaveable() )
	{
		SP.UI.Notify.addNotification("Unable to save changes");
		return false;
	}

	var requestNum = Audit.Common.Utilities.GetLookupDisplayText( "Request Number" );
	if( $.trim(requestNum) == "" || requestNum == "(None)" )
	{
		SP.UI.Notify.addNotification("Please provide the Request Number");
 		Audit.Common.Utilities.GetLookupFormField( "Request Number" ).focus();
		return false;		
	}
	
	//var actionOffice = Audit.Common.Utilities.GetLookupFieldText( "Action Office" );
	var actionOffice= Audit.Common.Utilities.GetLookupDisplayText( "Action Office" );	
	if( $.trim(actionOffice) == "" || actionOffice == "(None)" )
	{
		SP.UI.Notify.addNotification("Please provide the Action Office");
 		Audit.Common.Utilities.GetLookupFormField( "Action Office" ).focus();
		return false;		
	}
	
	var sampleNumber = $("input[title='Sample Number']").val();
	if( $.trim(sampleNumber) == "" )
	{
		SP.UI.Notify.addNotification("Please provide the Sample Number");
		$("input[title='Sample Number']").focus();
		return false;		
	}
	
	if( !$.isNumeric( sampleNumber ) )
	{
		SP.UI.Notify.addNotification("Please provide an integer value for Sample Number");
		$("input[title='Sample Number']").focus();
		return false;		
	}	

	var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName(actionOffice);	
	if( actionOfficeGroupName == null || actionOfficeGroupName == "" )
	{
		SP.UI.Notify.addNotification("The selected action office does not have an associated SharePoint user Group. Please contact Administrator");
 		Audit.Common.Utilities.GetLookupFormField( "Action Office" ).focus();
		return false;		
	}
	
	if( !confirm("Are you sure you would like to create this Response?") )
		return false;

	var responseTitle = requestNum + "-" + actionOffice + "-" + sampleNumber;	
	//Note: This is hidden in the form, but it should get set here
	$("input[title='Title']").val( responseTitle );

	var actionOfficeGroupObj = Audit.Common.Utilities.GetSPSiteGroup( actionOfficeGroupName );
	if( actionOfficeGroupObj == null )
	{
		alert("Action Office Group Not found");
		return false;
	}
	
	var def1 = $.Deferred();
	
	CreateResponseFolder(responseTitle, actionOfficeGroupObj, def1 );
	
	$.when( def1 ).done(function(){
		
		Audit.Common.Utilities.GetLookupFormField( "Request Number" ).removeAttr("disabled");
		//var newPostBackUrl = window.location.protocol + "//" + window.location.host + L_Menu_BaseUrl + "/Pages/IA_DB.aspx";
		var saveButtonName = $('input[name$="SaveItem"]').attr('name');
   		WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions(saveButtonName, "", true, "", "" , false, true));  
		
		/*var saveButton = $("[name$='diidIOSaveItem']") //gets form save button and ribbon save button
		if (saveButton.length > 0) 
		{
			originalSaveButtonClickHandler = saveButton[0].onclick;  //save original function
		}
		$(saveButton).attr("onclick", "ValidateForm()");
		*/

		//SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK, "Dunzo");
		
		//return true;
	});
	
	
	$.when( def1 ).fail(function(error){

 		SP.UI.Notify.addNotification("Error occured when creating the Response Folder: " + error);
	
	});

	/*var clientContext = null;
    var web = null;
    var vID;

    clientContext = new SP.ClientContext.get_current();
    web = clientContext.get_web();
	
	this.currentUser = clientContext.get_web().get_currentUser();
	this.ownerGroup = web.get_associatedOwnerGroup();
 	this.memberGroup = web.get_associatedMemberGroup();
 	this.visitorGroup = web.get_associatedVisitorGroup();
	clientContext.load(web); 
    //clientContext.load(ownerGroup); 
	function OnSuccess(sender, args)
	{		
		$("select[title='ReqNum']").removeAttr("disabled");
		
		alert("Done");
		
		var newPostBackUrl = window.location.protocol + "//" + window.location.host + L_Menu_BaseUrl + "/Lists/AuditResponses/CustomNewForm.aspx";
		alert( newPostBackUrl );
		
		var saveButtonName = $('input[name$="SaveItem"]').attr('name');
   		WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions(saveButtonName, "", true, "", newPostBackUrl , false, true));  
	}		
	function OnFailure(sender, args)
	{
		alert("Failure");
	}
	clientContext.executeQueryAsync(OnSuccess, OnFailure);	

	*/
	
	//Get the promise from the function
  /*  var promise = CreateResponseFolder(responseTitle, actionOfficeGroupObj );

    //This is run when the promise is resolved
    promise.done(function(){
   
		$("select[title='ReqNum']").removeAttr("disabled");
		
		var saveButtonName = $('input[name$="SaveItem"]').attr('name');
   		WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions(saveButtonName, "", true, "", "", false, true));  


    	//var button = $("input[id$=SaveItem]");
		//var elementName = button.attr("name");		
		//var newPostbackUrl = window.location.protocol + '//' + window.location.host + "/" + Audit.Responses.EditPage.GetSiteUrl() + "/Lists/AuditResponses" ;
		//WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions(elementName, "", true, "", newPostbackUrl , false, true));
					
      //  return true;
    });

    //This is run when the promise is rejected
    promise.fail(function(error){
    	
 		SP.UI.Notify.addNotification("Error occured when creating the Response Folder: " + error);
	});
    */
    //return true;
}

function CreateResponseFolder( title, actionOfficeGroupObj, def1) 
{
    var clientContext = null;
    var web = null;
    var vID;

    clientContext = new SP.ClientContext.get_current();
    web = clientContext.get_web();
	
	this.currentUser = clientContext.get_web().get_currentUser();
	this.ownerGroup = web.get_associatedOwnerGroup();
 	this.memberGroup = web.get_associatedMemberGroup();
 	this.visitorGroup = web.get_associatedVisitorGroup();
	clientContext.load(web); 
    //clientContext.load(ownerGroup); 
    
	var responseDocLib = web.get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleResponseDocs() );
	var itemCreateInfo = new SP.ListItemCreationInformation();
	itemCreateInfo.set_underlyingObjectType( SP.FileSystemObjectType.folder );
	itemCreateInfo.set_leafName( title );
	this.oListItem = responseDocLib.addItem( itemCreateInfo );			
	oListItem.update();
	
	oListItem.breakRoleInheritance(false, false);

	//add owner group
	var roleDefBindingColl = SP.RoleDefinitionBindingCollection.newObject( clientContext );
	roleDefBindingColl.add( clientContext.get_web().get_roleDefinitions().getByType( SP.RoleType.administrator) );
	oListItem.get_roleAssignments().add( ownerGroup, roleDefBindingColl );
	
	//add member group
	var roleDefBindingColl2 = SP.RoleDefinitionBindingCollection.newObject( clientContext );
	roleDefBindingColl2.add( clientContext.get_web().get_roleDefinitions().getByType( SP.RoleType.contributor) );
	oListItem.get_roleAssignments().add( memberGroup, roleDefBindingColl2 );
	
	//add visitor group
	var roleDefBindingColl3 = SP.RoleDefinitionBindingCollection.newObject( clientContext );
	roleDefBindingColl3.add( clientContext.get_web().get_roleDefinitions().getByName( "Restricted Read") );
	oListItem.get_roleAssignments().add( visitorGroup, roleDefBindingColl3 );

	//add action office
	var roleDefBindingColl4 = SP.RoleDefinitionBindingCollection.newObject( clientContext );
	roleDefBindingColl4.add( clientContext.get_web().get_roleDefinitions().getByName( "Restricted Contribute" ) );
	oListItem.get_roleAssignments().add( actionOfficeGroupObj, roleDefBindingColl4 );
				
	//delete current logged in user from permissions because it gets added by default
	oListItem.get_roleAssignments().getByPrincipal( currentUser ).deleteObject();
		
	function OnSuccess(sender, args)
	{		
		def1.resolve();
	}		
	function OnFailure(sender, args)
	{
  	  def1.reject(args.get_message());
	}
	clientContext.executeQueryAsync(OnSuccess, OnFailure);	
}


//http://stackoverflow.com/questions/29157842/create-multiple-sharepoint-items-using-javascript-on-new-form-but-delay-next-pag
//http://stackoverflow.com/questions/33803268/ecmascript-callback-method-executed-after-presaveaction-method
function CreateResponseFolderzz( title, actionOfficeGroupObj ) 
{
    var d = $.Deferred();

    var clientContext = null;
    var web = null;
    var vID;

    clientContext = new SP.ClientContext.get_current();
    web = clientContext.get_web();
	
	this.currentUser = clientContext.get_web().get_currentUser();
	this.ownerGroup = web.get_associatedOwnerGroup();
 	this.memberGroup = web.get_associatedMemberGroup();
 	this.visitorGroup = web.get_associatedVisitorGroup();
	clientContext.load(web); 
    //clientContext.load(ownerGroup); 
    
	var responseDocLib = web.get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleResponseDocs() );
	var itemCreateInfo = new SP.ListItemCreationInformation();
	itemCreateInfo.set_underlyingObjectType( SP.FileSystemObjectType.folder );
	itemCreateInfo.set_leafName( title );
	this.oListItem = responseDocLib.addItem( itemCreateInfo );			
	oListItem.update();
	
	oListItem.breakRoleInheritance(false, false);

	//add owner group
	var roleDefBindingColl = SP.RoleDefinitionBindingCollection.newObject( clientContext );
	roleDefBindingColl.add( clientContext.get_web().get_roleDefinitions().getByType( SP.RoleType.administrator) );
	oListItem.get_roleAssignments().add( ownerGroup, roleDefBindingColl );
	
	//add member group
	var roleDefBindingColl2 = SP.RoleDefinitionBindingCollection.newObject( clientContext );
	roleDefBindingColl2.add( clientContext.get_web().get_roleDefinitions().getByType( SP.RoleType.contributor) );
	oListItem.get_roleAssignments().add( memberGroup, roleDefBindingColl2 );
	
	//add visitor group
	var roleDefBindingColl3 = SP.RoleDefinitionBindingCollection.newObject( clientContext );
	roleDefBindingColl3.add( clientContext.get_web().get_roleDefinitions().getByName( "Restricted Read") );
	oListItem.get_roleAssignments().add( visitorGroup, roleDefBindingColl3 );

	//add action office
	var roleDefBindingColl4 = SP.RoleDefinitionBindingCollection.newObject( clientContext );
	roleDefBindingColl4.add( clientContext.get_web().get_roleDefinitions().getByName( "Restricted Contribute" ) );
	oListItem.get_roleAssignments().add( actionOfficeGroupObj, roleDefBindingColl4 );
				
	//delete current logged in user from permissions because it gets added by default
	oListItem.get_roleAssignments().getByPrincipal( currentUser ).deleteObject();
		
    //var data = {d: d, list: listItems}
	var data = {d: d}
    //Execute the query and pass the data with our deferred object
    
    clientContext.executeQueryAsync(Function.createDelegate(data, onListItemsLoadSuccess), Function.createDelegate(data, onQueryFailed));//After this line "return true" in PreSaveAction() will execute and then CallBackMethods will run.
    
    //Return a promise that can either resolve or reject depending on if the async function is a success or failure
    return d.promise();    

}

function onListItemsLoadSuccess() 
{
    //Access the listItems
   // var listItems = this.list;

    //Do something with the list items

    //On success, resolve the promise
    this.d.resolve();
}

function onQueryFailed(sender, args) 
{
	//	alert ( args.get_message() );
	//On failure, reject the promise
    this.d.reject(args.get_message());
}

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


