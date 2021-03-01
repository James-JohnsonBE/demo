<iframe id="CsvExpFrame" style="display: none"></iframe>

<div style="padding-bottom:10px">
	<a title="Refresh this page" href="javascript:void(0)" onclick="location.reload()"><span class="ui-icon ui-icon-refresh"></span>Refresh</a>
</div>

<div id="divMsgLoading" style="display:none">
	<span style="color:green">Please wait, Loading list of groups...</span>
</div>


<div>
	<div style="padding-bottom:5px">Please copy and paste from the spreadsheet:</div> 
	<div>
		<textarea id="inputRows" rows="10" cols="100"></textarea>
	</div>
	<div id="divValidateButtons" style="vertical-align:bottom; padding-top:5px; display:none;" >
		<input type="button" onclick="Audit.AuditSiteUpdateGroups.UpdateGroups.ValidateRows();" value="Validate Data"></input>
		<input type="button" onclick="Audit.AuditSiteUpdateGroups.UpdateGroups.ClearRows();" value="Clear Data"></input>
	</div>
</div>
<div id="divValidation" style="display:none">
	<div id="tblErrors"></div>
	<div id="tblRows"></div>
	<input id="btnSubmit" type="button" onclick="Audit.AuditSiteUpdateGroups.UpdateGroups.SubmitRows();" value="Update Groups" style="display:none"></input>	
	<span id="submittedRows"></span>
</div>



<!-- CSS Files -->
<link rel="stylesheet" type="text/css" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/themes/redmond/jquery-ui.css" />
<link rel="stylesheet" type="text/css" href="../SiteAssets/css/tablesorter/style.css"  />
<link rel="stylesheet" type="text/css" href="../SiteAssets/css/Audit_Styles.css"/>

<!-- Javascript Files -->
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="../SiteAssets/js/jquery.tablesorter.min.js" ></script>
<script type="text/javascript" src="../SiteAssets/js/Audit_Page_UpdateSiteGroups.js"></script>

<style type="text/css"> 
.error 
{
	background-color: PapayaWhip;
	color: red !important;    
	font-style: italic;
}
.error td
{
	color: gray;    
}

.duplicate td
{
	background-color: Gainsboro;
	font-style: italic;
	color: gray;    
}

.duplicate input
{
	background-color: Gainsboro;
	font-style: italic;
	color: gray;    
}

.normal td
{
	font-weight :bold;
	color: teal !important;    
}
.removed td
{
	background-color: Gainsboro;
	color: gray;    
	/*text-decoration: line-through*/; 
	font-style: italic;
}
.addValue
{
	background-color: palegreen !important;
}

.submitted
{
	background-color: yellow;
	text-decoration: none; 
	font-style: italic;
}

</style>