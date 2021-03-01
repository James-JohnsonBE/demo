<iframe id="CsvExpFrame" style="display: none"></iframe>

<div style="padding-bottom:10px">
	<a title="Refresh this page" href="javascript:void(0)" onclick="location.reload()"><span class="ui-icon ui-icon-refresh"></span>Refresh</a>
</div>

<div id="divListNameContainingGroups" style="display:none; width:600px; padding-top:10px; padding-bottom:10px;">
	Loaded Groups names to check from List: <span id="listNameOfGoups" style="color:green"></span>
</div>
<div id="divMsgLoading" style="display:none">
	<span style="color:green">Please wait, Loading list of groups...</span>
</div>

<a id="btnPrint" title="Click here to Print" href="javascript:void(0)" class="hideOnPrint"><span class="ui-icon ui-icon-print">Print</span></a>
<a class="export hideOnPrint" title="Export to CSV" href="#"><span class="ui-icon ui-icon-disk">Export to CSV</span></a>

<div id="divTblOutput" style="width:300px; padding-bottom:10px;"></div>
<div id="divCntrOutput" style="width:300px; padding-bottom:10px;"></div>
<div id="divMsgGroupsLoaded" style="color:green">
</div>

<!-- CSS Files -->
<link rel="stylesheet" type="text/css" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/themes/redmond/jquery-ui.css" />
<link rel="stylesheet" type="text/css" href="../SiteAssets/css/tablesorter/style.css"  />
<link rel="stylesheet" type="text/css" href="../SiteAssets/css/Audit_Styles.css"/>
<link rel="stylesheet" type="text/css" href="../SiteAssets/css/Audit_Page_Reports.css"/>

<!-- Javascript Files -->
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="../SiteAssets/js/jquery.tablesorter.min.js" ></script>
<script type="text/javascript" src="../SiteAssets/js/Audit_Page_Permissions_GetSiteGroupUsers.js"></script>

