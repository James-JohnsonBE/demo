<iframe id="CsvExpFrame" style="display: none"></iframe>

<div style="padding-bottom:10px">
	<a title="Refresh this page" href="javascript:void(0)" onclick="location.reload()"><span class="ui-icon ui-icon-refresh"></span>Refresh</a>
</div>

<div id="divLoading" style="color:green; padding-bottom:10px">Please Wait... Loading</div>


<div id="divTbl" style="display:none">
	<table id="tblRequests" class="tablesorter report">
		<thead>
			<tr valign="top">
				<th class="sorter-true" nowrap="nowrap" style="text-align:left">Request #</th>
				<th class="sorter-true" nowrap="nowrap">Subject</th>
				<th class="sorter-true" nowrap="nowrap">Internal Due Date</th>
				<th class="sorter-true" nowrap="nowrap">Internal Status</th>
				<th class="sorter-true" nowrap="nowrap">Due Date</th>
				<th class="sorter-true" nowrap="nowrap">Status</th>
				<th class="sorter-true" nowrap="nowrap">Escalated?</th>
				<th class="sorter-true" nowrap="nowrap">Sample?</th>
				<th class="sorter-false" nowrap="nowrap">Action</th>
			</tr>
		</thead>
		<tbody id="fbody"></tbody>
		<tfoot>
			<tr>
				<th colspan="9" style="text-align:left">Total</th>
			</tr>
		</tfoot>
	</table>
</div>

<div id="divTest">
</div>

<link rel="stylesheet" type="text/css" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/themes/redmond/jquery-ui.css"  />
<link rel="stylesheet" type="text/css" href="../SiteAssets/css/tablesorter/style.css"  />
<link rel="stylesheet" type="text/css" href="../SiteAssets/css/Audit_Styles.css"/>
<link rel="stylesheet" type="text/css" href="../SiteAssets/css/Audit_Page_Reports.css"/>

<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/jquery-ui.min.js"></script>
<script type="text/javascript" src="../SiteAssets/js/jquery.tablesorter.min.js" ></script>
<script type="text/javascript" src="../SiteAssets/js/Audit_Page_IA.js"></script>

