/***************
Each Response creates a folder in the Response Document library. 
When a response is created, the action office specified gets permissions to the Response folder in the Response Document library
Status changes in the Edit form update the permissions of the Response folder
/*************/

var Audit = window.Audit || {};
Audit.Responses = Audit.Responses|| {};

$(document).ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', ExecuteOrDelayUntilScriptLoaded(Init, "sp.js"));

})	

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

	$("[title$=' Required Field']").each(function()
    {
        $(this).attr("title",$(this).attr("title").replace(" Required Field",""));
    });

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
		
		m_bSaveable = true;
		$("input[id$=_diidIOSaveItem]").removeAttr("disabled");
	}
			
	var publicMembers = 
	{
		GetSiteUrl: function(){ return m_siteUrl; },
		IsSaveable: function(){ return m_bSaveable; }
	}
	
	return publicMembers;
}

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
	
	
	var currCtx = new SP.ClientContext.get_current();
	var web = currCtx.get_web();

	var responseList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleResponses() );
	var responseQuery = new SP.CamlQuery();	
	responseQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID" Ascending="FALSE"/></OrderBy><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' + responseTitle + '</Value></Eq></Where></Query></View>');
	responseItems = responseList.getItems( responseQuery );
	currCtx.load( responseItems , 'Include(ID, Title)');
	
	currCtx.executeQueryAsync
	(
		function () 
		{	
			var cnt = 0;
			var listItemEnumerator = responseItems.getEnumerator();
			while(listItemEnumerator.moveNext())
			{
				cnt++;					
			}
			
			if( cnt > 0 )
			{
 				SP.UI.Notify.addNotification("Response with this name already exists. ");
			}
			else
			{
				Audit.Common.Utilities.GetLookupFormField( "Request Number" ).removeAttr("disabled");
				//var newPostBackUrl = window.location.protocol + "//" + window.location.host + L_Menu_BaseUrl + "/Pages/IA_DB.aspx";
				var saveButtonName = $('input[name$="SaveItem"]').attr('name');
		   		WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions(saveButtonName, "", true, "", "" , false, true));  
		
			}
		}, 
		function (sender, args) 
		{
		}
	);



	/*var def1 = $.Deferred();
	
	CreateResponseFolder(responseTitle, actionOfficeGroupObj, def1 );
	
	$.when( def1 ).done(function(){
		
		Audit.Common.Utilities.GetLookupFormField( "Request Number" ).removeAttr("disabled");
		//var newPostBackUrl = window.location.protocol + "//" + window.location.host + L_Menu_BaseUrl + "/Pages/IA_DB.aspx";
		var saveButtonName = $('input[name$="SaveItem"]').attr('name');
   		WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions(saveButtonName, "", true, "", "" , false, true));  
	});
	
	
	$.when( def1 ).fail(function(error){

 		SP.UI.Notify.addNotification("Error occured when creating the Response Folder: " + error);
	
	});*/
	
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