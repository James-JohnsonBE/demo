var Audit = window.Audit || {};
Audit.EAReport = Audit.EAReport || {};

//Hide Site Actions (fail safe even though master page does it)
$("#RibbonContainer-TabRowLeft").hide();
$(".ms-siteactionsmenu").hide();

ExecuteOrDelayUntilScriptLoaded(InitReport, "sp.js");	

function InitReport() 
{    
	Audit.EAReport.Report = new Audit.EAReport.NewReportPage();
	Audit.EAReport.Init();
}

Audit.EAReport.Init = function()
{
	$("#RibbonContainer-TabRowLeft").hide();
	$(".ms-siteactionsmenu").hide();

	$(".ms-gb a").click(function()
	{	
		setTimeout( function()
		{
	
			UpdateToDownloadLinks();
		}, 1000 );
	});
	setTimeout( function()
	{
		UpdateToDownloadLinks();
	}, 2000);
}

function UpdateToDownloadLinks()
{
	var m_siteUrl = _spPageContextInfo.webServerRelativeUrl; //IE11 in sp 2013 does not recognize L_Menu_BaseUrl

	//$('a[href$=".pdf"], a[href$=".docx"], a[href$=".doc"], a[href$=".txt"]').each(function() 
	$('.ms-vb2 a').each(function() 
	{
		var docURL = $(this).attr('href');
			  
	  	var newDocUrl = docURL.replace(m_siteUrl + "/", "" );
		var downloadUrl = "../_layouts/download.aspx?SourceUrl=" + newDocUrl ;
		
		//downloadUrl = "http://cgfsauditst.rm.state.gov/sites/itaudit/_layouts/download.aspx?SourceUrl=%2Fsites%2Fitaudit%2FDocuments%2FUserManuals%2FAudit%20Tool%20User%20Manual%2D%20Entire%2Epdf"	
		//	downloadUrl = "../_layouts/download.aspx?SourceUrl=Documents/UserManuals/Audit%20Tool%20User%20Manual-%20Entire.pdf";
		/*doing this instead of changing the href because it breaks with pdf*/
		$(this).removeAttr("onmousedown");
		$(this).removeAttr("onclick");
		$(this).attr('href', "javascript:void(0)");
		$(this).click(function()
		{
			STSNavigate(downloadUrl);
		});
	});

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
