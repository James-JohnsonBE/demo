<link rel="stylesheet" type="text/css" href="../../SiteAssets/css/Audit_Styles_ListForms.css"/>
<script type="text/javascript" src="../../SiteAssets/js/jquery/1.7.2/jquery.min.js"></script>

<fieldset id="newFieldset" style="display:none">
	<legend>Response Document Details</legend>
	<div id="responseDocsContainer"></div>
</fieldset>

<script>
SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function (){} ); 
SP.SOD.executeOrDelayUntilScriptLoaded(OnInit,"sp.js"); 

function OnInit()
{
	if( $(".ms-formtable").html() != null )
	{
   		$(".ms-formtable").appendTo("#responseDocsContainer");
   		$("#newFieldset").show();
   	}
   	
	var m_siteUrl = _spPageContextInfo.webServerRelativeUrl; //IE11 in sp 2013 does not recognize L_Menu_BaseUrl

	try{
		//Check here for the document status and if it's !Submitted, dont allow them to modify the document or open in client/browser. Force them to download
		var documentStatus = $("h3.ms-standardheader:contains('Document Status')").closest("tr").find(".ms-formbody").text();
		documentStatus = $.trim( documentStatus );
		if( documentStatus != "Submitted")
		{	
			var fileLink = $("h3.ms-standardheader:contains('Name')").closest("tr").find(".ms-formbody a");
			
			var docURL = fileLink.attr('href');
				  
		  	var newDocUrl = docURL.replace( m_siteUrl + "/", "" );
			var downloadUrl = "../../_layouts/download.aspx?SourceUrl=" + newDocUrl;
			
			fileLink.attr("Title", "The current document status has locked this document from edits. Cannot open this file in edit mode. Click to Download this file");
			//fileLink.attr('href', downloadUrl );//"javascript:void(0)");
			fileLink.attr('href',"javascript:void(0)");
			fileLink.removeAttr("onmousedown");
			fileLink.removeAttr("onclick");
			fileLink.click(function()
			{
				STSNavigate(downloadUrl);
			});
		} 
		
		//remove hyperlinks to request number and response
		var requestLink = $("h3.ms-standardheader:contains('Request Number')").closest("tr").find(".ms-formbody a");
		requestLink.removeAttr('href');
		requestLink.removeAttr("onmousedown");
		requestLink.removeAttr("onclick");
		
		var responseLink = $("h3.ms-standardheader:contains('Response ID')").closest("tr").find(".ms-formbody a");
		responseLink.removeAttr('href');
		responseLink.removeAttr("onmousedown");
		responseLink.removeAttr("onclick");
	}
	catch (err){}
	
	try{
		//Change modified/created by so that it passes in IsDlg as a param to hide the left nav
		$(".ms-formtoolbar").find("a").each(function(){
			var curHref = $(this).attr("href");			
			curHref += "&IsDlg=1";
			$(this).attr("href", curHref);
			$(this).attr("target", "_blank");
		});
	}catch( err ){}

}

</script>