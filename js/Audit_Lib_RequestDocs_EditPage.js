var Audit = window.Audit || {};
Audit.RequestDocs = Audit.RequestDocs|| {};

$(document).ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', ExecuteOrDelayUntilScriptLoaded(Init, "sp.js"));

})

function Init() 
{    
	Audit.RequestDocs.EditPage = new Audit.RequestDocs.NewEditPage();
	Audit.RequestDocs.Init();
}

Audit.RequestDocs.Init = function()
{    
	var requestNum = GetUrlKeyValue("ReqNum");
	if( requestNum != null && requestNum != "" )
	{		
		/*
		this doesn't work if requests > 20

		$("select[title='Request Number'] option").each(function (a, b) {
            if ($(this).html() == requestNum ) $(this).attr("selected", "selected");
        });
        
        $("select[title='Request Number']").attr("disabled", "disabled");*/
        
		Audit.Common.Utilities.SetLookupFromFieldNameByText("Request Number", requestNum );
        if( Audit.Common.Utilities.GetLookupDisplayText("Request Number" ) != "(None)")
	        Audit.Common.Utilities.GetLookupFormField( "Request Number" ).attr( "disabled", "disabled" );

	}
}

Audit.RequestDocs.NewEditPage = function ()
{	
	var m_siteUrl = _spPageContextInfo.webServerRelativeUrl; //IE11 in sp 2013 does not recognize L_Menu_BaseUrl

	$("[title$=' Required Field']").each(function()
    {
        $(this).attr("title",$(this).attr("title").replace(" Required Field",""));
    });
			
	var publicMembers = 
	{
		GetSiteUrl: function(){ return m_siteUrl; }
	}
	
	return publicMembers;
}

function PreSaveAction()
{
	var requestNum = Audit.Common.Utilities.GetLookupDisplayText( "Request Number" );
	if( $.trim(requestNum) == "" || requestNum == "(None)" )
	{
		SP.UI.Notify.addNotification("Please provide the Request Number");
 		Audit.Common.Utilities.GetLookupFormField( "Request Number" ).focus();
 		return false;		
	}

	var name = $("input[title='Name']").val();
	if( $.trim(name) == "" )
	{
		SP.UI.Notify.addNotification("Please provide the Name");
		$("input[title='Name']").focus();
		return false;		
	}
	
		
    $("select[title='Request Number']").removeAttr("disabled");
	return true;
}
	
	
	
	
