var Audit = window.Audit || {};
Audit.Organizations = Audit.Organizations || {};

$(document).ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', ExecuteOrDelayUntilScriptLoaded(Init, "sp.js"));

})

function Init() 
{    
	$("[title$=' Required Field']").each(function()
    {
        $(this).attr("title", $(this).attr("title").replace(" Required Field", ""));
    });
    
	Audit.Organizations.Form = new Audit.Organizations.FormEdit();
	Audit.Organizations.Init();
}

Audit.Organizations.Init = function()
{
}

Audit.Organizations.FormEdit = function ()
{		
	$("div.ms-inputuserfield").change(function()
	{
		//$("input[title='Title']").val( "" );
		$("img[Title='Check Names']").click();
	});
	$("div.ms-inputuserfield").blur(function()
	{
		//$("input[title='Title']").val( "" );
		$("img[Title='Check Names']").click();
	});
}


function PreSaveAction()
{
	//the group name can be blank; Title can't be blank (ex - the default -select- option )
	var pplPickerVal = $("textarea[title='People Picker']").val();
	if( pplPickerVal == null || pplPickerVal == "" || pplPickerVal.indexOf("span") < 0 )
	{
		SP.UI.Notify.addNotification("Please specify the account name");
		return false;
	}
	
	var outerDiv = $("<div></div>").append( pplPickerVal );
	if( outerDiv.find("span").find("div").attr("isresolved") == "False")
	{
		SP.UI.Notify.addNotification("Please resolve the account name");
		return false;
	}
	
	var displayText = outerDiv.find("span").find("div").attr("displaytext");
	if( displayText != "" )
		$("input[title='Title']").val( displayText );
		
	return true;
}