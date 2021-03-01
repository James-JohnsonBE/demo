var Audit = window.Audit || {};
Audit.CoverSheets = Audit.CoverSheets || {};

$(document).ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', ExecuteOrDelayUntilScriptLoaded(Init, "sp.js"));

})

function Init() 
{    
	Audit.CoverSheets.Form = new Audit.CoverSheets.FormEdit();
	Audit.CoverSheets.Init();
}

Audit.CoverSheets.Init = function()
{

}

Audit.CoverSheets.FormEdit = function ()
{	
	var m_siteUrl = _spPageContextInfo.webServerRelativeUrl; //IE11 in sp 2013 does not recognize L_Menu_BaseUrl
	var m_bSaveable = false;
	
	$("[title$=' Required Field']").each(function()
    {
        $(this).attr("title", $(this).attr("title").replace(" Required Field",""));
    });
    
	var m_requestNum = GetUrlKeyValue("ReqNum");
	if( m_requestNum != null && m_requestNum != "" )
	{		
        Audit.Common.Utilities.SetLookupFromFieldNameByText("Request Number", m_requestNum );
        
        if( Audit.Common.Utilities.GetLookupDisplayText("Request Number" ) != "(None)")
	        Audit.Common.Utilities.GetLookupFormField( "Request Number" ).attr( "disabled", "disabled" );
	        
	    var documentTitle = $("input[title='Name']").val();
		if( documentTitle.indexOf( m_requestNum ) < 0 )
		{						
			documentTitle = m_requestNum + "_" + documentTitle;
			$("input[title='Name']").val( documentTitle );
		}
		
		m_bSaveable = true;
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
	if( !Audit.CoverSheets.Form.IsSaveable() )
	{
		SP.UI.Notify.addNotification("Unable to save changes");
		return false;
	}

	var requestNum = Audit.Common.Utilities.GetLookupDisplayText( "Request Number" );
	if( $.trim(requestNum) == "" || requestNum == "(None)" )
	{
		SP.UI.Notify.addNotification("Please provide the Request Number");
		//$("select[title='Request Number']").focus();
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
	
	var documentTitle = $("input[title='Name']").val();
	if( documentTitle.indexOf( requestNum ) < 0 )
	{						
		documentTitle = requestNum + "_" + documentTitle;
		$("input[title='Name']").val( documentTitle );
	}
		
    $("select[title='Request Number']").removeAttr("disabled");
	return true;
}


/*
function SetLookupDisplayText( fieldTitle, lookupVal)
{
    //Set default value for lookups with less that 20 items
    if ( $("select[title='" + fieldTitle + "']").html() !== null)
    {
    	//$("select[title='"+ fieldTitle +"']").val(lookupVal); 
    	$("select[title='" + fieldTitle + "'] option").each(function (a, b) {
            if ($(this).html() == lookupVal ) $(this).attr("selected", "selected");
        });
    }
    else
    {
    	//$("input[title='" + fieldTitle +"']").text( lookupVal );
        choices = $("input[title='" + fieldTitle +"']").attr("choices");
        hiddenInput = $("input[title='" + fieldTitle +"']").attr("optHid");
        $("input[id='" + hiddenInput + "']").attr("value", lookupVal)
        
        choiceArray = choices.split("|");
        for (index = 1; index < choiceArray.length; index = index + 2)
        {
            if (choiceArray[index] == lookupVal){
                $("input[title='" + fieldTitle + "']").val(choiceArray[index - 1]);    
            }
        }
    }
}	
*/
	
