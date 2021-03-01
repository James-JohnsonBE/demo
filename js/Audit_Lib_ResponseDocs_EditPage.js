var Audit = window.Audit || {};
Audit.ResponseDocs = Audit.ResponseDocs || {};

document.body.style.cursor = 'wait';

$(document).ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', ExecuteOrDelayUntilScriptLoaded(Init, "sp.js"));

})

function Init() 
{    
	$("[title$=' Required Field']").each(function()
    {
        $(this).attr("title",$(this).attr("title").replace(" Required Field",""));
    });
    
    $("select[title='Document Status']").closest("tr").hide();
	$("textarea[title='Reject Reason']").closest("tr").hide();

	try{
		//Change modified/created by so that it passes in IsDlg as a param to hide the left nav
		$(".ms-formtoolbar").find("a").each(function(){
			var curHref = $(this).attr("href");			
			curHref += "&IsDlg=1";
			$(this).attr("href", curHref);
			$(this).attr("target", "_blank");
		});
	}catch( err ){}

	Audit.ResponseDocs.EditPage = new Audit.ResponseDocs.NewEditPage();
	Audit.ResponseDocs.Init();
}

Audit.ResponseDocs.Init = function()
{
}

Audit.ResponseDocs.NewEditPage = function ()
{	
	var m_siteUrl = _spPageContextInfo.webServerRelativeUrl; //IE11 in sp 2013 does not recognize L_Menu_BaseUrl
	var m_selectedRequestNumber = null;
	var m_bSaveable = false;
	
	Load();
	
	
	function Load()
	{
		document.body.style.cursor = 'default';

		var requestNum = GetUrlKeyValue("ReqNum");
		if( requestNum != null && requestNum != "" && requestNum != undefined)
		{		
	        Audit.Common.Utilities.SetLookupFromFieldNameByText("Request Number", requestNum );
	        
	        if( Audit.Common.Utilities.GetLookupDisplayText("Request Number" ) != "(None)")
		        Audit.Common.Utilities.GetLookupFormField( "Request Number" ).attr( "disabled", "disabled" );
		}
		
		var resId = GetUrlKeyValue("ResID");
		if( resId != null && resId != "" && resId != undefined )
		{		
	        Audit.Common.Utilities.SetLookupFromFieldNameByText("Response ID", resId);
	        
	        if( Audit.Common.Utilities.GetLookupDisplayText("Response ID" ) != "(None)")
		        Audit.Common.Utilities.GetLookupFormField( "Response ID" ).attr( "disabled", "disabled" );
		}
		
		if( requestNum == null || requestNum == "" || resId == null || resId == "" || requestNum == undefined || resId == undefined)
		{
			statusId = SP.UI.Status.addStatus("This Response Document can not be edited from this location.");
			SP.UI.Status.setStatusPriColor(statusId, 'yellow');
			m_bSaveable = false;
			$("input[id$=_diidIOSaveItem]").attr("disabled","disabled");
			
			return;
		}
				
		if( requestNum != null && requestNum != "" && resId != null && resId != "" )
		{	
			try{
				if( $("input[title='Title']").val() == "" )
				{
					var fileName = $("input[title='Name']").val();
					$("input[title='Title']").val( fileName );
				}
			}catch( err ){}



			$("input[id$=_diidIOSaveItem]").attr("disabled","disabled");			
			$("input[title='Name']").attr("disabled", "disabled");
	
			//var resID = $("select[title='Response ID']").val();
			//var resID = Audit.Common.Utilities.GetLookupFormField("Response ID").val();
			resID = Audit.Common.Utilities.GetLookupDisplayText( "Response ID" );
		  	m_selectedRequestNumber = Audit.Common.Utilities.GetLookupDisplayText( "Request Number" );
			
			//alert( resID );
			//alert( m_selectedRequestNumber );
			
		    var currCtx = new SP.ClientContext.get_current();
		  	var web = currCtx.get_web();		  	
		  	
			var requestList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleRequests() );
			var requestQuery = new SP.CamlQuery();	
			requestQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="Title" /><Value Type="Text">' + m_selectedRequestNumber + '</Value></Eq></Where></Query></View>');
			m_requestItems = requestList.getItems( requestQuery );
			currCtx.load( m_requestItems, 'Include(ID, Title, ReqStatus, ActionOffice, Modified)');

			var responseList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleResponses() );
			var responseQuery = new SP.CamlQuery();	
			responseQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="Title" /><Value Type="Text">' + resID  + '</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>');
			responseItems = responseList.getItems( responseQuery );
			currCtx.load( responseItems, 'Include(ID, Title, ResStatus)');
			
			/*var ob = new SP.BasePermissions();
        	ob.set(SP.PermissionKind.editListItems);
			userHasEditPermissionOnWeb = web.doesUserHavePermissions(ob);
			*/
			currCtx.executeQueryAsync
			(
				function () 
				{	
				
					var requestStatus = m_fnGetRequestStatus();
								
					if( requestStatus == null || requestStatus == "")
					{
						statusId = SP.UI.Status.addStatus("Unable to retrieve the Status of the Request associated with this document");
						SP.UI.Status.setStatusPriColor(statusId, 'yellow');
						m_bSaveable = false;
						return;
					}

					if( requestStatus != "Open" && requestStatus != "ReOpened")
					{
						statusId = SP.UI.Status.addStatus("The Request associated to this Document is not Open. It can only be re-opened from the IA Dashboard");
						SP.UI.Status.setStatusPriColor(statusId, 'yellow');
						m_bSaveable = false;
						return;
					}
				
					var listItemEnumerator = responseItems.getEnumerator(); //should only be one - getting the current item's response information
					while(listItemEnumerator.moveNext())
					{
						var oListItem = listItemEnumerator.get_current();
						
						var responseTitle = oListItem.get_item('Title');
						var responseStatus = oListItem.get_item('ResStatus');
						
						/* removed after testing... for what ever reason, AO gets access denied when renaming the document
						var documentTitle = $("input[title='Name']").val();
						if( documentTitle.indexOf( responseTitle ) < 0 )
						{						
							var curDate = new Date();
							documentTitle = responseTitle + "_" + curDate.format("yyyyMMddTHHmmss");
							//$("input[title='Name']").val( documentTitle );
						}*/
		
						if( responseStatus.indexOf("Closed") >= 0 )
						{
							statusId = SP.UI.Status.addStatus("The Response associated to this Document is Closed. It can only be re-opened from the IA Dashboard");
							SP.UI.Status.setStatusPriColor(statusId, 'yellow');
							m_bSaveable = false;
						}
						else
						{						
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
				function (sender, args) 
				{
					statusId = SP.UI.Status.addStatus("Request failed: "  + args.get_message() + "\n" + args.get_stackTrace());
		   			SP.UI.Status.setStatusPriColor(statusId, 'red');
				}
			);
		}
	}

	function m_fnGetRequestStatus()
	{
		var requestStatus = "";
		
		var listItemEnumerator = m_requestItems.getEnumerator();
		while(listItemEnumerator.moveNext())
		{
			var oListItem = listItemEnumerator.get_current();
			
			var id = oListItem.get_item('ID');
			var number = oListItem.get_item('Title');
			var status = oListItem.get_item('ReqStatus');

			if( m_selectedRequestNumber == number )
			{
				requestStatus = status;				
				break;
			}					
		}	
		return requestStatus;
	}

	var publicMembers = 
	{
		GetSiteUrl: function(){ return m_siteUrl; },
		IsSaveable: function(){ return m_bSaveable; }
	}
	
	return publicMembers;
}

function PreSaveAction()
{	
	if( !Audit.ResponseDocs.EditPage.IsSaveable() )
	{
		SP.UI.Notify.addNotification("Unable to save changes");
		return false;
	}

	var requestNum = Audit.Common.Utilities.GetLookupDisplayText( "Request Number" );
	if( $.trim(requestNum) == "" || requestNum == "(None)" )
	{
		SP.UI.Notify.addNotification("Please provide the Request Number");
		Audit.Common.Utilities.GetLookupFormField("Request Number").focus();
		return false;		
	}

	var resId = Audit.Common.Utilities.GetLookupDisplayText( "Response ID" );
	if( $.trim(resId) == "" || resId == "(None)" )
	{
		SP.UI.Notify.addNotification("Please provide the Response ID");
		Audit.Common.Utilities.GetLookupFormField("Response ID").focus();
		return false;		
	}
		
	Audit.Common.Utilities.GetLookupFormField("Request Number").removeAttr("disabled");
	Audit.Common.Utilities.GetLookupFormField("Response ID").removeAttr("disabled");
	$("input[title='Name']").removeAttr("disabled");
	
	return true;
}
	
	
	
	
