<link rel="stylesheet" type="text/css" href="../../SiteAssets/css/Audit_Styles_ListForms.css"/>
<script type="text/javascript" src="../../SiteAssets/js/jquery/1.7.2/jquery.min.js"></script>

<fieldset id="newFieldset" style="display:none">
	<legend>Request Details</legend>
	<div id="requestContainer"></div>
</fieldset>

<script>
SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function (){} ); 
SP.SOD.executeOrDelayUntilScriptLoaded(OnInit,"sp.js"); 

function OnInit()
{
	if( $(".ms-formtable").html() != null )
	{
   		$(".ms-formtable").appendTo("#requestContainer");
   		$("#newFieldset").show();
   	}
}

</script>