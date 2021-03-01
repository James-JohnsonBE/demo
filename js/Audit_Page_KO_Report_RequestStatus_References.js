<iframe id="CsvExpFrame" style="display: none"></iframe>

<div id="divLoading" style="color:green; padding-bottom:10px">Please Wait... Loading</div>

<div id="tabs" style="display:none; margin-top:20px;">
	<ul>
		<li><a href="#tabs-0">Audit Status Report</a></li>
	</ul>
	
	<div id="tabs-0">
	
		<table>
			<tr>
				<td>
				 	<div id="piechart1" style="width: 600px; height: 200px;"></div>
				 </td>
				 <td>
				 	<div id="piechart2" style="width: 600px; height: 200px;"></div>
				 </td>
			</tr>
		</table>
	 
		<div style="padding-top:3px" data-bind="visible: arrRequests().length > 0">
			<a id="btnPrint1" title="Click here to Print" href="javascript:void(0)" class="hideOnPrint"><span class="ui-icon ui-icon-print">Print</span></a>
			<a class="export1 hideOnPrint" title="Export to CSV" href="#"><span class="ui-icon ui-icon-disk">Export to CSV</span></a>
			<a id="btnViewAllRequests" title="Clear All Filters and View All Requests" href="javascript:void(0)" data-bind="visible: arrFilteredRequestsCount() < arrRequests().length, click: ClearFilters"><span class="ui-icon ui-icon-circle-zoomout"></span>View All Requests</a>
		</div>
		<div id="divStatusReportRequests">
			<table id="tblStatusReportRequests" class="tablesorter report">
				<thead>
					<tr valign="top" class="rowFilters" data-bind="visible: arrRequests().length > 0">
						<th class="sorter-false" nowrap="nowrap"><select id="ddlRequestAuditStatus" data-bind="options: $root.ddOptionsRequestAuditStatus, value: filterRequestAuditStatus, optionsCaption: '-Select-'"></select></th>
						<th class="sorter-false" nowrap="nowrap"><select id="ddlRequestNum" data-bind="options: $root.ddOptionsRequestNum, value: filterRequestNum, optionsCaption: '-Select-'"></select></th>
						<th class="sorter-false" nowrap="nowrap"></th>
						<th class="sorter-false" nowrap="nowrap"><select id="ddlRequestStatus" data-bind="options: $root.ddOptionsRequestStatus, value: filterRequestStatus, optionsCaption: '-Select-'"></select></th>
						<th class="sorter-false"></th>
						<th class="sorter-false"></th>
						<th class="sorter-false"></th>
					</tr>
					<tr valign="top">
						<th class="sorter-true" nowrap="nowrap">Audit Status</th>
						<th class="sorter-true" nowrap="nowrap">Request #</th>
						<th class="sorter-true" nowrap="nowrap">Subject</th>
						<th class="sorter-true" nowrap="nowrap">Request Status</th>
						<th class="sorter-true" nowrap="nowrap">Due Date</th>
						<th class="sorter-true" nowrap="nowrap">Closed Date</th>
						<th class="sorter-true" nowrap="nowrap">Days Late</th>
					</tr>
				</thead>
				<tbody id="fbody1" style="display:none"></tbody>
				<tfoot class="footer">
					<tr>
						<th colspan="7">Displaying <span id="spanRequestsDisplayedTotal" style="color:green" data-bind="text: arrFilteredRequestsCount()">0</span> out of <span id="spanRequestsTotal" style="color:green" data-bind="text: arrRequests().length">0</span> Requests</th>
					</tr>
				</tfoot>
			</table>
		</div>
	</div>
</div>

<script id="requestTemplate" type="text/x-jsrender">
	<tr class="sr1-request-item">
		<td class="sr1-request-auditStatus">{{:requestAuditStatus}}</td>
		<td class="sr1-request-requestNum">{{:reqNumber}}</td>
		<td class="sr1-request-subject">{{:subject}}</td>
		<td class="sr1-request-status">{{:status}}</td>
		<td class="sr1-request-dueDate">{{:dueDate}}</td>
		<td class="sr1-request-closedDate">{{:closedDate}}</td>
		<td class="sr1-request-closedDate">{{:daysLate}}</td>
	</tr>
</script>



<link rel="stylesheet" type="text/css" href="../SiteAssets/css/jqueryui/1.11.3/themes/redmond/jquery-ui.min.css"  />
<link rel="stylesheet" type="text/css" href="../SiteAssets/css/tablesorter/style.css"  />
<link rel="stylesheet" type="text/css" href="../SiteAssets/css/Audit_Styles.css"/>
<link rel="stylesheet" type="text/css" href="../SiteAssets/css/Audit_Page_Reports.css"/>

<script type="text/javascript" src="../SiteAssets/js/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="../SiteAssets/js/jqueryui/1.11.3/jquery-ui.min.js"></script>
<script type="text/javascript" src="../SiteAssets/js/jquery.tablesorter.min.js" ></script>
<script type="text/javascript" src="../SiteAssets/js/jsrender.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.2/knockout-min.js"></script>
<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
   
<script type="text/javascript" src="../SiteAssets/js/Audit_Page_Common.js"></script>
<script type="text/javascript" src="../SiteAssets/js/Audit_Page_KO_Report_RequestStatus.js"></script>

