         
<link rel="stylesheet" type="text/css" href="../SiteAssets/css/jqueryui/1.11.3/themes/redmond/jquery-ui.min.css"  />
<link rel="stylesheet" type="text/css" href="../SiteAssets/css/tablesorter/style.css"  />
<link rel="stylesheet" type="text/css" href="../SiteAssets/js/rateit.js-master/scripts/rateit.css"  />
<link rel="stylesheet" type="text/css" href="../SiteAssets/css/Audit_Styles.css"/>
<link rel="stylesheet" type="text/css" href="../SiteAssets/css/Audit_Page_Reports.css"/>

<script type="text/javascript" src="../SiteAssets/js/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="../SiteAssets/js/jqueryui/1.11.3/jquery-ui.min.js"></script>
<script type="text/javascript" src="../SiteAssets/js/jquery.tablesorter.min.js" ></script>
<script type="text/javascript" src="../SiteAssets/js/rateit.js-master/scripts/jquery.rateit.min.js"></script>
<script type="text/javascript" src="../SiteAssets/js/Audit_Page_Common.js"></script>
<script type="text/javascript" src="../SiteAssets/js/Audit_Page_Rating.js"></script>


<div style="width:150px">
	<fieldset><legend>Rate this Application</legend>
		<div class="rateit" id="rateit1" data-rateit-min="0" data-rateit-max="5" data-rateit-resetable="false"></div><span id="hoverValue" style="padding-left:5px"></span>	
		<div>
			<span id="rateValue" style="display:none"></span>
			<div style="padding-top:10px;">
				<input id="btnSubmitRating" type="button" value="Submit"></input>
			</div>
		</div>
	</fieldset>
</div>

<script type="text/javascript">
    $("#rateit1").bind('rated', function (event, value) { $('#rateValue').text( value ); });
    $("#rateit1").bind('reset', function () { $('#rateValue').text('0'); });
    $("#rateit1").bind('over', function (event, value) { 
    	if( value != null )
    	{
    		$('#hoverValue').text( value );
    	} 
    	else { 
    		$('#hoverValue').text( "" ); 
    	} 
    });
    
</script>  