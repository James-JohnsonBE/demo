<link rel="stylesheet" type="text/css" href="../../SiteAssets/css/Audit_Styles_ListForms.css"/>
<script type="text/javascript" src="../../SiteAssets/js/jquery/1.7.2/jquery.min.js"></script>

<fieldset id="newFieldset" style="display:none">
	<legend>Response Details</legend>
	<div id="responseContainer"></div>
</fieldset>

<script>
SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function (){} ); 
SP.SOD.executeOrDelayUntilScriptLoaded(OnInit,"sp.js"); 

function OnInit()
{
	if( $(".ms-formtable").html() != null )
	{
   		$(".ms-formtable").appendTo("#responseContainer");
   		$("#newFieldset").show();
   	}
   	
   	try{
   			//remove hyperlinks to request number and response
		var requestLink = $("h3.ms-standardheader:contains('Request Number')").closest("tr").find(".ms-formbody a");
		requestLink.removeAttr('href');
		requestLink.removeAttr("onmousedown");
		requestLink.removeAttr("onclick");

		var aoLink = $("h3.ms-standardheader:contains('Action Office')").closest("tr").find(".ms-formbody a");
		aoLink.removeAttr('href');
		aoLink.removeAttr("onmousedown");
		aoLink.removeAttr("onclick");

		var closedByLink = $("h3.ms-standardheader:contains('Closed By')").closest("tr").find(".ms-formbody a");
		closedByLink.removeAttr('href');
		closedByLink.removeAttr("onmousedown");
		closedByLink.removeAttr("onclick");

	}catch( err ){}
	
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