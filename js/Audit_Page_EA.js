var Audit = window.Audit || {};
Audit.EAReport = Audit.EAReport || {};

var paramShowSiteActionsToAnyone = GetUrlKeyValue("ShowSiteActions")
if( paramShowSiteActionsToAnyone != true ) //hide it even for owners unless this param is passed into the URL; pass in param if you want to change the page web parts/settings
{
	//Hide Site Actions (fail safe even though master page does it)
	$("#RibbonContainer-TabRowLeft").hide();
	$(".ms-siteactionsmenu").hide();
}

$(document).ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', ExecuteOrDelayUntilScriptLoaded(InitReport, "sp.js"));

})

function InitReport() 
{    
	Audit.EAReport.Report = new Audit.EAReport.NewReportPage();
	Audit.EAReport.Init();
}

Audit.EAReport.Init = function()
{
	var paramShowSiteActionsToAnyone = GetUrlKeyValue("ShowSiteActions")
	if( paramShowSiteActionsToAnyone != true ) //hide it even for owners unless this param is passed into the URL; pass in param if you want to change the page web parts/settings
	{
		$("#RibbonContainer-TabRowLeft").hide();
		$(".ms-siteactionsmenu").hide();
	}
}

Audit.EAReport.NewReportPage = function ()
{	
	var path = location.protocol + "//" + location.host + Audit.Common.Utilities.GetSiteUrl() + "/" + Audit.Common.Utilities.GetLibTitleResponseDocsEA();
	//$("#divExplorerView").html( '<a href="#" onClick="javascript:CoreInvoke(\'NavigateHttpFolder\', \'http://cgfsauditst.rm.state.gov/sites/itaudit/AuditResponseDocsEA/\', \'_blank\');">View In Explorer</a>');
	$("#divExplorerView").html( '<span class="ui-icon ui-icon-folder-open"></span><a title="Open documents in Explorer View" href="#" onClick="javascript:CoreInvoke(\'NavigateHttpFolder\', \'' + path + '\', \'_blank\');">View In Explorer</a>');
		
	var filterField = GetUrlKeyValue("FilterField1"	);
	var filterValue = GetUrlKeyValue("FilterValue1");
		
	if( filterField == "Modified" && filterValue != null && filterValue != "" )
	{	
		filterValue = filterValue.replace(/%2D/g, "/");
		filterValue = filterValue.replace(/-/g, "/");
		var modifiedDate = new Date( filterValue );
		modifiedDate = modifiedDate.format( "M/d/yyyy");
		
		$("#lblFilteredOn").html("Filtered Documents (<b>" + filterField + "</b> = <b>" + modifiedDate + "</b>)");
	}
	else if( filterField != null && filterField != "" && filterValue != null && filterValue != "" )
	{		
		$("#lblFilteredOn").html("Filtered Documents (<b>" + filterField + "</b> = <b>" + filterValue + "</b>)");
	}
	else
	{
		$("#lblFilteredOn").html("");
	}		
	var publicMembers = 
	{
		//Load: m_fnLoadData
	}
	
	return publicMembers;
}
