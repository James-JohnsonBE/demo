var Audit = window.Audit || {};
Audit.Requests = Audit.Requests || {};

$(document).ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', ExecuteOrDelayUntilScriptLoaded(Init, "sp.js"));

})

function Init() 
{    
	$("[title$=' Required Field']").each(function()
    {
        $(this).attr("title",$(this).attr("title").replace(" Required Field",""));
    });
    
	$('nobr:contains("Reminders")').closest('tr').hide();
	$('nobr:contains("Email Sent")').closest('tr').hide();

	Audit.Requests.Form = new Audit.Requests.FormEdit();
	Audit.Requests.Init();
}

Audit.Requests.Init = function()
{
	
}

Audit.Requests.FormEdit = function ()
{		
	//var m_siteUrl = _spPageContextInfo.webServerRelativeUrl; //IE11 in sp 2013 does not recognize L_Menu_BaseUrl
	var m_currentUserEmail = null;
	var m_curRequestStatus = $("select[title='Request Status']").val();
	var m_curInternalDueDate = $("input[title='Internal Due Date']").val();
	var m_bSaveable = false;

//changed - added
	var m_curRequestNumber = $("input[title='Request Number']").val();

	document.body.style.cursor = 'default';

	//this is used to ensure that this form is only opened from the IA dashboard
	var requestNum = GetUrlKeyValue("ReqNum");
	if( requestNum == null || requestNum == "" || requestNum == undefined)
	{		
		statusId = SP.UI.Status.addStatus("This Request can not be edited from this location.");
		SP.UI.Status.setStatusPriColor(statusId, 'yellow');
		m_bSaveable = false;
		$("input[id$=_diidIOSaveItem]").attr("disabled","disabled");
		return;
	}	


	var currCtx = new SP.ClientContext.get_current();
	var web = currCtx.get_web();
	
	m_currentUser = web.get_currentUser();
	currCtx.load( m_currentUser );
	
	currCtx.executeQueryAsync(OnSuccess, OnFailure);	
	function OnSuccess(sender, args)
	{
		LoadUser();
	}
	function OnFailure(sender, args)
	{
		alert("Request failed"  + args.get_message() + "\n" + args.get_stackTrace() );		
	}		

	function LoadUser()
	{
		m_currentUserEmail = m_currentUser.get_email();		
		m_bSaveable = true;
	}
	
	function m_fnUpdateClosedByFields( newStatus )
	{
		if( newStatus != m_curRequestStatus && newStatus == "Closed")
		{
			//update closed date
			var curDate = new Date();
			var dt = curDate.format("MM/dd/yyyy");
			var hours = curDate.format("h tt");
			var mins = curDate.format("mm");
			mins = mins - ( mins % 5 );
			mins = Audit.Common.Utilities.PadDigits(mins, 2)

			$("input[title='Closed Date']").val( dt );
			
			var dDateID = $(":input[title='Closed Date']").attr("id");
			$(":input[id='"+ dDateID + "Hours" +"']").val( hours );
			$(":input[id='"+ dDateID + "Minutes" +"']").val( mins );

			//update closed by
			if( m_currentUserEmail != null && m_currentUserEmail != "")
			{
				if( $("div[title^='People Picker']:empty") )
				{
					$("div[title^='People Picker']").text( m_currentUserEmail);
					$("a[title^='Check Names']").click();
				}
			}
		}
	}

	$("select[title='Request Status']").change(function()
	{		
		m_fnUpdateClosedByFields( $(this).val() );	
	});
	
	$("input[title='Internal Due Date']").change(function()
	{		
		if( $(this).val() != m_curInternalDueDate )
		{
			SP.UI.Notify.addNotification("The Internal Due Date has changed, this will reset the Reminders");
		}
		else
			SP.UI.Notify.addNotification("The Internal Due Date has not changed and it will not impact the current Reminders");
	});
	
	function m_fnRescheduleReminders()
	{
		var i = window.location.href.indexOf( Audit.Common.Utilities.GetListTitleRequests() );
		var absItemPathUrl = window.location.href.substring( 0, i ) + Audit.Common.Utilities.GetListTitleRequests() + "/" + GetUrlKeyValue("ID") + "_.000";

		if( absItemPathUrl == null || absItemPathUrl == "" )
			return;
			
	  	var wfGuidSendSummaryEmail = null;
	  	try
	  	{
			SP.UI.Notify.addNotification("Rescheduling Reminders... ");
	  		   
			$().SPServices({
				operation: "GetTemplatesForItem",
				  item: absItemPathUrl,
				  async: false,
				  completefunc: function (xData, Status) 
				  {
				  	$(xData.responseXML).find("WorkflowTemplates > WorkflowTemplate").each(function(i,e) {
		      				// hard coded workflow name
						if ( $(this).attr("Name") == "Schedule Reminders" )
						{              
							var guid = $(this).find("WorkflowTemplateIdSet").attr("TemplateId");        
						    if ( guid != null )
						    {
						        wfGuidSendSummaryEmail = "{" + guid + "}";
						    }
						}
		      		});
		  		}
			});
		
			if( wfGuidSendSummaryEmail )
			{
				$().SPServices({
					operation: "StartWorkflow",
				  	item: absItemPathUrl,
				  	templateId: wfGuidSendSummaryEmail,
				  	workflowParameters: "<root />",
				  	completefunc: function() 
				  	{
	 					SP.UI.Notify.addNotification("Reset Reminders.");		
				  	}
				});
			}
			else
			{
				//return false;
			}
			return true;
		}
		catch(err)
		{
			alert( "Error restarting reminders:" + err );
			return false;
		}
	}

	var publicMembers = 
	{
		//GetSiteUrl: function(){ return m_siteUrl; },
		GetCurrentRequestStatus: function(){ return m_curRequestStatus; },
		GetCurrentRequestInternalDueDate: function(){ return m_curInternalDueDate; },
		GetCurrentRequestNumber: function(){ return m_curRequestNumber; },
		RescheduleReminders: m_fnRescheduleReminders,
		IsSaveable: function(){ return m_bSaveable; }
	}
	
	return publicMembers;
}

function PreSaveAction()
{
	if( !Audit.Requests.Form.IsSaveable() )
	{
		SP.UI.Notify.addNotification("Unable to save changes");
		return false;
	}
	
	var requestNum = $("input[title='Request Number']").val();
	if( requestNum == null || $.trim(requestNum) == "" )
	{
		SP.UI.Notify.addNotification("Please provide the Request Number");
 		$("input[title='Request Number']").focus();
		return false;		
	}
	
//added
	if( Audit.Requests.Form.GetCurrentRequestNumber() != requestNum )
	{
		SP.UI.Notify.addNotification("The original Request Number can not change");
 		$("input[title='Request Number']").focus();
		return false;		
	}

	var fy = $("select[title='Fiscal Year']").val();
	if( fy == null || $.trim(fy) == "" )
	{
		SP.UI.Notify.addNotification("iscal Year");
 		$("select[title='Fiscal Year']").focus();
		return false;		
	}
	
	var requestSubject = $("input[title='Request Subject']").val();
	if( requestSubject == null || $.trim(requestSubject) == "" )
	{
		SP.UI.Notify.addNotification("Please provide the Request Subject");
 		$("input[title='Request Subject']").focus();
		return false;		
	}
	
	var internalDueDate = $("input[title='Internal Due Date']").val();
	if( internalDueDate == null || $.trim(internalDueDate) == "" )
	{
		SP.UI.Notify.addNotification("Please provide the Internal Due Date");
 		$("input[title='Internal Due Date']").focus();
		return false;		
	}
	
	var dueDate = $("input[title='Request Due Date']").val();
	if( dueDate == null || $.trim(dueDate) == "" )
	{
		SP.UI.Notify.addNotification("Please provide the Request Due Date");
 		$("input[title='Request Due Date']").focus();
		return false;		
	}

	var dInternalDueDate = new Date( internalDueDate );
	var dDueDate = new Date( dueDate );
	
	if( dInternalDueDate > dDueDate )
	{
		SP.UI.Notify.addNotification("The Internal Due Date must be before the Request Due Date");
 		$("input[title='Request Due Date']").focus();
		return false;		
	}
		
		
	/*var currentRequestStatus = Audit.Requests.Form.GetCurrentRequestStatus();
	var selectedRequestStatus = $("select[title='ReqStatus']").val();

	if( currentRequestStatus != selectedRequestStatus && selectedRequestStatus == "Closed" )
	{	
	}					

	//This is setting the parent (IA Dashboard) element to the current item id 
	//var itemID = GetUrlKeyValue("ID");
	//window.parent.document.getElementById("divRequestID").innerText = itemID;
	//SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK, "done");
	
	*/
	
	//if( confirm("Are you sure you would like to save your changes?" ) )
	//	return true;
	
	var confirmMessage = "Are you sure you would like to save your changes?";
	if( Audit.Requests.Form.GetCurrentRequestInternalDueDate() != internalDueDate )
	{
		confirmMessage += " Note: The Reminders will be Reset";
	}
	if( !confirm( confirmMessage ) )
		return false;
		
	var currCtx = new SP.ClientContext.get_current();
	var web = currCtx.get_web();

	var requestList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleRequests() );
	var requestListQuery = new SP.CamlQuery();	
	requestListQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID" Ascending="FALSE"/></OrderBy><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' + requestNum + '</Value></Eq></Where></Query></View>');
	requestItems = requestList.getItems( requestListQuery);
	currCtx.load( requestItems, 'Include(ID, Title)');
	
	currCtx.executeQueryAsync
	(
		function () 
		{	
			var cnt = 0;
			var listItemEnumerator = requestItems.getEnumerator();
			while(listItemEnumerator.moveNext())
			{
				cnt++;					
			}
			
			if( cnt > 1 ) //dont include itself
			{
 				SP.UI.Notify.addNotification("Request with this name already exists. ");
			}
			else
			{
				var bSave = true;
				if( Audit.Requests.Form.GetCurrentRequestInternalDueDate() != $("input[title='Internal Due Date']").val() )
				{
					bSave = Audit.Requests.Form.RescheduleReminders();
				}
				if ( !bSave )
					return;
				
				//var newPostBackUrl = window.location.protocol + "//" + window.location.host + L_Menu_BaseUrl + "/Pages/IA_DB.aspx";
				var saveButtonName = $('input[name$="SaveItem"]').attr('name');
		   		WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions(saveButtonName, "", true, "", "" , false, true));  
		
			}
		}, 
		function (sender, args) 
		{
		}
	);

}

