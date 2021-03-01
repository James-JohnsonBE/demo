$(document).ready(function()
{ 
	var m_siteUrl = _spPageContextInfo.webServerRelativeUrl; //IE11 in sp 2013 does not recognize L_Menu_BaseUrl

	$('a[href$=".pdf"], a[href$=".docx"], a[href$=".doc"], a[href$=".txt"]').each(function() 
	{
		var docURL = $(this).attr('href');
			  
	  	var newDocUrl = docURL.replace(m_siteUrl + "/", "" );
		var downloadUrl = "../_layouts/download.aspx?SourceUrl=" + newDocUrl ;
		
		//downloadUrl = "http://cgfsauditst.rm.state.gov/sites/itaudit/_layouts/download.aspx?SourceUrl=%2Fsites%2Fitaudit%2FDocuments%2FUserManuals%2FAudit%20Tool%20User%20Manual%2D%20Entire%2Epdf"	
		//	downloadUrl = "../_layouts/download.aspx?SourceUrl=Documents/UserManuals/Audit%20Tool%20User%20Manual-%20Entire.pdf";
		/*doing this instead of changing the href because it breaks with pdf*/
		$(this).attr('href', "javascript:void(0)");
		$(this).removeAttr("onmousedown");
		$(this).removeAttr("onclick");
		$(this).click(function()
		{
			STSNavigate(downloadUrl);
		});
	});
});
