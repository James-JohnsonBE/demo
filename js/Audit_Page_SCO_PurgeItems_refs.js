<!-- CSS Files -->
<link rel="stylesheet" type="text/css" href="../../SiteAssets/css/jqueryui/1.11.3/themes/redmond/jquery-ui.min.css" />
<link rel="stylesheet" type="text/css" href="../../SiteAssets/css/tablesorter/style.css"  />
<link rel="stylesheet" type="text/css" href="../../SiteAssets/css/Audit_Styles.css"/>
<link rel="stylesheet" type="text/css" href="../../SiteAssets/css/Audit_Page_Reports.css"/>

<!-- Javascript Files -->
<script type="text/javascript" src="../../SiteAssets/js/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="../../SiteAssets/js/jquery.tablesorter.min.js" ></script>
<script type="text/javascript" src="../../SiteAssets/js/Audit_Page_SCO_PurgeItems.js"></script>

<div style="padding-bottom:10px">
	<a title="Refresh this page" href="javascript:void(0)" onclick="location.reload()"><span class="ui-icon ui-icon-refresh"></span>Refresh</a>
</div>

<div style='color:red; font-weight:bold; font-size:9pt'>This page loads the List or Library entered in the textbox below and enables PURGING items from it. 
<p>
	<ul>
		<li>This page should have restricted permissions</li>
		<li>Purging should only occur annually before the site goes live. </li>
		<li>This page should be disabled or removed before it goes live. </li>
	</ul>
	
	<div style="width:250px; color:#676767">
		<fieldset style="margin-top:10px;"><legend>Possible Lists and Libraries</legend>
			<ul>
				<li>AuditRequestDocs</li>
				<li>AuditCoversheets</li>
				<li>AuditResponseDocs</li>
				<li>AuditResponseDocsEA</li>
				<li>AuditEAEmailLog</li>
				<li>AuditBulkPermissions</li>
				<li>AuditBulkResponses</li>
				<li>AuditEmails</li>
				<li>AuditResponses</li>
				<li>AuditRequests</li>
				<li>NintexWorkflowHistory</li>
			</ul>
		</fieldset>
	</div>
</p>
</div>


<div id="divListName">
	<span>Provide the <b>list or library name</b> in this site that should be <b>Purged</b>:</span>
	<input id="tbLibName" value="testLibrary"></input>
	<input type="button" id="btnLoadLib" value="Load List or Library" style="cursor:pointer;" title="Click here to load the contents of the list/library"></input>
</div>
<div id="divMsgLoading" style="display:none">
	<span style="color:green">Please wait, Loading ...</span>
</div>
<div id="divTblOutput" style="width:300px; padding-bottom:10px;"></div>
<div id="divCntrOutput" style="width:300px; padding-bottom:10px;"></div>


