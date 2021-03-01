var Audit = window.Audit || {};
Audit.HomeReport = Audit.HomeReport || {};

//Hide Site Actions
$("#RibbonContainer-TabRowLeft").hide();
$(".ms-siteactionsmenu").hide();

$(document).ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', ExecuteOrDelayUntilScriptLoaded(InitReport, "sp.js"));

})

function InitReport() 
{    
	Audit.HomeReport.Report = new Audit.HomeReport.NewReportPage();
	Audit.HomeReport.Init();
}

Audit.HomeReport.Init = function()
{
	//Hide Site Actions
	$("#RibbonContainer-TabRowLeft").hide();
	$(".ms-siteactionsmenu").hide();
	
	
	
	//SP.Utilities.HttpUtility.navigateTo(_spPageContextInfo.webServerRelativeUrl + "/pages/ao_db.aspx");
	
}

Audit.HomeReport.NewReportPage = function ()
{	
			
	var publicMembers = 
	{
		//Load: m_fnLoadData
	}
	
	return publicMembers;
}
