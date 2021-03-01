<iframe id="CsvExpFrame" style="display: none"></iframe>

<div id="divCounter" style="display:none" title="used to auto refresh the page">600</div>

<div style="padding-bottom:10px;display:none" id="divRefresh">
	<a title="Refresh this page" href="javascript:void(0)" onclick="Audit.SPReport.Report.Refresh()"><span class="ui-icon ui-icon-refresh"></span>Refresh</a>
</div>

<div id="divLoading" style="color:green; padding-bottom:10px">Please Wait... Loading</div>

<div id="tabs" style="display:none; margin-top:20px;">
	<ul>
		<li><a href="#tabs-0">Status Report</a></li>
		<li><a href="#tabs-1">Responses</a></li>
	</ul>
	<div id="tabs-0">
		<div id="lblStatusReportResponsesMsg" style="padding-top:5px;color:green; display:none"><span class='ui-icon ui-icon-info'></span>There are 0 responses for your review</div>
		<div id="divButtons" style="padding-top:3px">
			<a id="btnPrint1" title="Click here to Print" href="javascript:void(0)" class="hideOnPrint"><span class="ui-icon ui-icon-print">Print</span></a>
			<a class="export1 hideOnPrint" title="Export to CSV" href="#"><span class="ui-icon ui-icon-disk">Export to CSV</span></a>
			<a id="btnViewAll" title="View All" href="javascript:void(0)" style="display:none"><span class="ui-icon ui-icon-circle-zoomout"></span>View All Responses</a>
		</div>
		<div id="divStatusReportRespones">
			<table id="tblStatusReportResponses" class="tablesorter report">
				<thead>
					<tr valign="top" class="rowFilters" style="display:none">
						<th class="sorter-false" nowrap="nowrap"><select id="ddlResponseRequestID"></select></th>
						<th class="sorter-false" nowrap="nowrap"><select id="ddlResponseRequestStatus"></select></th>
						<th class="sorter-false" nowrap="nowrap"><select id="ddlResponseRequestInternalDueDate"></select></th>
						<th class="sorter-false" nowrap="nowrap"><select id="ddlResponseSampleNum"></select></th>
						<th class="sorter-false" nowrap="nowrap"><select id="ddlResponseName"></select></th>
						<th class="sorter-false" nowrap="nowrap"><select id="ddlResponseStatus"></select></th>
						<th class="sorter-false" nowrap="nowrap"></th>
						<th class="sorter-false" nowrap="nowrap"></th>
					</tr>
					<tr valign="top">
						<th class="sorter-true" nowrap="nowrap">Request #</th>
						<th class="sorter-true" nowrap="nowrap">Request Status</th>
						<th class="sorter-true" nowrap="nowrap">Internal Due Date</th>
						<th class="sorter-true" nowrap="nowrap">Sample #</th>
						<th class="sorter-true" nowrap="nowrap">Response Name</th>
						<th class="sorter-true" nowrap="nowrap">Status</th>
						<th class="sorter-true" nowrap="nowrap"># of Documents</th>
						<th class="sorter-true" nowrap="nowrap">Modified</th>
					</tr>
				</thead>
				<tbody id="fbody"></tbody>
				<tfoot class="footer">
					<tr>
						<th colspan="9">Displaying <span id="spanResponsesDisplayedTotal" style="color:green">0</span> out of <span id="spanResponsesTotal" style="color:green">0</span> Responses</th>
					</tr>
				</tfoot>
			</table>
		</div>
	</div>
	
	<div id="tabs-1">			
		<div style="padding-bottom:15px">
			<table>
				<tr>
					<td><span>Responses:</span></td>
					<td><select id="ddlResponses"></select></td>
				</tr>
			</table>
		</div>
				
		<div id="divResponseInfo" style="display:none;">
			<fieldset>
				<legend>Response Information</legend>
				<table id="tblResponseInfo" class="tablesorter">
					<tbody>
						<tr>
							<td>Request #</td>
							<td><span id="requestInfoNum"></span></td>
						</tr>
						<tr>
							<td>Request Status</td>
							<td><span id="requestInfoStatus"></span></td>
						</tr>
						<tr>
							<td>Subject</td>
							<td><span id="requestInfoSub"></span></td>
						</tr>
						<tr>
							<td>Due Date</td>
							<td><span id="requestInfoInternalDueDate"></span></td>
						</tr>
						<tr>
							<td>Sample?</td>
							<td><span id="requestInfoSample"></span></td>
						</tr>
						<tr>
							<td>Response</td>
							<td><span id="responseInfoName"></span></td>
						</tr>
						<tr>
							<td>Response Status</td>
							<td><span id="responseInfoStatus"></span></td>
						</tr>
						<tr>
							<td>Sample #</td>
							<td><span id="responseInfoSampleNum"></span></td>
						</tr>
						<tr>
							<td>Action Office</td>
							<td><span id="responseInfoAO"></span></td>
						</tr>
						<tr>
							<td>Related Audit</td>
							<td><span id="requestInfoRelatedAudit"></span></td>
						</tr>
						<tr>
							<td>Action Items</td>
							<td><span id="requestInfoActionItems"></span></td>
						</tr>
						<tr>
							<td>Comments</td>
							<td><span id="responseInfoComments"></span></td>
						</tr>
					</tbody>
				</table>
			</fieldset>
		</div>

				
		<div id="divCoverSheets" style="display:none" >
			<fieldset><legend>Cover Sheets/Supplemental Documents</legend>

			<div id="divEmptyCoversheetsMsg" style="border:0px !important; font-style:italic; display:none;">There are 0 cover sheets or supplemental documents</div>

			<table id="tblCoverSheets" class="tablesorter report">
				<thead>				
					<tr valign="top">
						<th class="sorter-false" nowrap="nowrap">Name</th>
					</tr>
				</thead>
				<tbody></tbody>
				<tfoot>
					<tr valign="top">
						<th nowrap="nowrap">Total: <span id="tblCoverSheetsTotal">0</span></th>
					</tr>
				</tfoot>
			</table>
			</fieldset>
		</div>
		
		<div id="divResponses" style="display:none" >
			<fieldset><legend>Response Information</legend>
			<table id="tblResponses" class="tablesorter report">
				<thead>				
					<tr valign="top">
						<th class="sorter-true" nowrap="nowrap" style="text-align:left">Name</th>
						<th class="sorter-true" nowrap="nowrap">Sample #</th>
						<th class="sorter-true" nowrap="nowrap">Action Office</th>
						<th class="sorter-true" nowrap="nowrap">Status</th>
					</tr>
				</thead>
				<tbody></tbody>
			</table>
			</fieldset>
		</div>

		<div id="divResponseDocs" style="display:none" >
			
			<fieldset><legend>Response Documents</legend>

			<div id="divEmptyResponseDocsMsg" style="border:0px !important; font-style:italic; display:none;">There are 0 response documents</div>

			<table id="tblResponseDocs" class="tablesorter report">
				<thead>				
					<tr valign="top">
						<th class="sorter-false" nowrap="nowrap">Type</th>
						<th class="sorter-false" nowrap="nowrap">Name</th>
						<th class="sorter-false" nowrap="nowrap">Receipt Date</th>
						<th class="sorter-false" nowrap="nowrap">File Size</th>
						<th class="sorter-false" nowrap="nowrap">Checked Out</th>
						<th class="sorter-false" nowrap="nowrap">Status</th>
						<th class="sorter-false" nowrap="nowrap">Reason</th>
						<th class="sorter-false" nowrap="nowrap">Modified</th>
						<th class="sorter-false" nowrap="nowrap">Modified By</th>
					</tr>
				</thead>
				<tbody></tbody>
				<tfoot>
					<tr valign="top">
						<th colspan="9" nowrap="nowrap">Total: <span id="tblResponseDocsTotal">0</span></th>
					</tr>
				</tfoot>
			</table>
			</fieldset>
		</div>
		
	</div>
</div>


<div id="divTest"></div>

<link rel="stylesheet" type="text/css" href="../SiteAssets/css/jqueryui/1.11.3/themes/redmond/jquery-ui.min.css"  />
<link rel="stylesheet" type="text/css" href="../SiteAssets/css/tablesorter/style.css"  />
<link rel="stylesheet" type="text/css" href="../SiteAssets/css/Audit_Styles.css"/>
<link rel="stylesheet" type="text/css" href="../SiteAssets/css/Audit_Page_Reports.css"/>

<script type="text/javascript" src="../SiteAssets/js/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="../SiteAssets/js/jqueryui/1.11.3/jquery-ui.min.js"></script>
<script type="text/javascript" src="../SiteAssets/js/jquery.tablesorter.min.js" ></script>
<script type="text/javascript" src="../SiteAssets/js/jsrender.min.js"></script>
<script type="text/javascript" src="../SiteAssets/js/Audit_Page_Common.js"></script>
<script type="text/javascript" src="../SiteAssets/js/Audit_Page_SP.js"></script>

