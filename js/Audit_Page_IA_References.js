<iframe id="CsvExpFrame" style="display: none"></iframe>

<div id="divRequestID" style="display:none;">not in use anymore. do not delete, this is used by the request edit list form</div>

<div id="divCounter" style="display:none" title="used to auto refresh the page">1200</div>

<div id="divLoading" style="color:green; padding-bottom:10px">Please Wait... Loading</div>

<div style="padding-bottom:10px; width:900px; display:none" id="divIA">
	<table>
		<tr>
			<td valign="top">
				<fieldset style="width:300px">
					<legend>Actions</legend>
					<div>
						<a title="Refresh this page" href="javascript:void(0)" onclick="Audit.IAReport.Report.Refresh()"><span class="ui-icon ui-icon-refresh"></span>Refresh</a>
					</div>
					<div style="padding-top:3px">
						<a title="View User Manuals" href="javascript:void(0)" onclick="Audit.Common.Utilities.ViewUserManuals()"><span class="ui-icon ui-icon-help"></span>User Manuals</a>
					</div>
					<div style="padding-top:3px">
						<a title="View Response Documents Uploaded by Action Offices Today but not yet Submitted" href="javascript:void(0)" onclick="Audit.IAReport.Report.ViewResponseDocsToday()"><span class="ui-icon ui-icon-search"></span>View Today's Un-submitted Response Documents</a>
					</div>
					<div style="padding-top:3px">
						<a title="View Request, Response and Site Permissions" href="javascript:void(0)" onclick="Audit.IAReport.Report.ViewPermissions()"><span class="ui-icon ui-icon-locked"></span>View Permissions</a>
					</div>
					<div style="padding-top:3px">
						<a title="View Late Requests" href="javascript:void(0)" onclick="Audit.IAReport.Report.ViewLateRequests()"><span class="ui-icon ui-icon-clock"></span>View Late Requests</a>
					</div>
					<div style="padding-top:3px">
						<a id="linkSubmitNewReq" href="javascript:void(0)"><span class='ui-icon ui-icon-plus'></span>Create a New Request</a>
					</div>
				</fieldset>
			</td>
			<td valign="top" style="padding-left:100px">
				<div id="divRequestsThatNeedToClose" style="display:none; width:700px">
					<fieldset>
						<legend><span class='ui-icon ui-icon-alert'></span>Requests that Need Closing</legend>
						<table id="tblRequestsThatNeedToClose"  class="tablesorter report">
							<thead>
								<tr valign="top">
									<th class="sorter-false" nowrap="nowrap">Request ID</th>
									<th class="sorter-false" nowrap="nowrap">Last Response Closed</th>
									<th class="sorter-false" nowrap="nowrap"></th>
								</tr>
							</thead>
							<tbody></tbody>			
						</table>
					</fieldset>
				</div>
				<div id="divRequestsWithNoEmailSent" style="display:none; width:400px; cursor:pointer" title="Click here to View">
					<fieldset style="border: 0px solid white">
						<legend class="warning" style="color:red"><span class="ui-icon ui-icon-alert"></span><a href="javascript:void(0)">These Requests need Emails sent out</a></legend>
						<div id="divRequestsWithNoEmailSentItems" class="collapsed"></div>
					</fieldset>	
				</div>
				<div id="divResponsesSubmitted" style="display:none; width:400px; cursor:pointer" title="Click here to View">
					<fieldset style="border: 0px solid white">
						<legend class="warning" style="color:red"><span class="ui-icon ui-icon-alert"></span><a href="javascript:void(0)">These Responses have been Submitted by the Action Offices</a></legend>
						<div id="divResponsesSubmittedItems" class="collapsed"></div>
					</fieldset>	
				</div>
				<div id="divRequestsAlmostInternalDue" style="display:none; width:400px; cursor:pointer" title="Click here to View">
					<fieldset style="border: 0px solid white">
						<legend class="warning" style="color:red"><span class="ui-icon ui-icon-alert"></span><a href="javascript:void(0)">View Requests reaching their Internal Due Date</a></legend>
						<div id="divRequestsAlmostInternalDueItems" class="collapsed"></div>
					</fieldset>	
				</div>			
				<div id="divRequestsPastInternalDue" style="display:none; width:400px; cursor:pointer" title="Click here to View">
					<fieldset style="border: 0px solid white">
						<legend class="warning" style="color:red"><span class="ui-icon ui-icon-alert"></span><a href="javascript:void(0)">View Requests that have PASSED their Internal Due Date</a></legend>
						<div id="divRequestsPastInternalDueItems" class="collapsed"></div>
					</fieldset>	
				</div>			
				<div id="divRequestsAlmostDue" style="display:none; width:400px; cursor:pointer" title="Click here to View">
					<fieldset style="border: 0px solid white">
						<legend class="warning" style="color:red"><span class="ui-icon ui-icon-alert"></span><a href="javascript:void(0)">View Requests reaching their Due Date</a></legend>
						<div id="divRequestsAlmostDueItems" class="collapsed"></div>
					</fieldset>	
				</div>
				<div id="divRequestsPastDue" style="display:none; width:400px; cursor:pointer" title="Click here to View">
					<fieldset style="border: 0px solid white">
						<legend class="warning" style="color:red"><span class="ui-icon ui-icon-alert"></span><a href="javascript:void(0)">View Requests that have PASSED their Due Date</a></legend>
						<div id="divRequestsPastDueItems" class="collapsed"></div>
					</fieldset>	
				</div>
				<div id="divCheckedOutResponseDocs" style="display:none; width:400px; cursor:pointer" title="Click here to View">
					<fieldset style="border: 0px solid white">
						<legend class="warning" style="color:red"><span class="ui-icon ui-icon-alert"></span><a href="javascript:void(0)">These Response Documents are Checked Out</a></legend>
						<div id="divCheckedOutResponseDocsItems" class="collapsed"></div>
					</fieldset>	
				</div>
	
				<div id="divRequestsWithNoResponse" style="display:none; width:400px; cursor:pointer" title="Click here to View">
					<fieldset style="border: 0px solid white">
						<legend class="warning" style="color:red"><span class="ui-icon ui-icon-alert"></span><a href="javascript:void(0)">These Requests have 0 Responses</a></legend>
						<div id="divRequestsWithNoResponseItems" class="collapsed"></div>
					</fieldset>	
				</div>
			</td>		
		</tr>
	</table>
</div>

<div id="tabs" style="display:none; margin-top:20px;">
	<ul>
		<li><a href="#tabs-0">Request Status Report</a></li>
		<li><a href="#tabs-1">Response Status Report</a></li>
		<li><a href="#tabs-2">Request Information</a></li>
	</ul>
	
	<div id="tabs-0">
		<div style="padding-top:3px">
			<a id="btnPrint1" title="Click here to Print" href="javascript:void(0)" class="hideOnPrint"><span class="ui-icon ui-icon-print">Print</span></a>
			<a class="export1 hideOnPrint" title="Export to CSV" href="#"><span class="ui-icon ui-icon-disk">Export to CSV</span></a>
			<a id="btnViewAllRequests" title="Clear All Filters and View All Requests" href="javascript:void(0)" style="display:none"><span class="ui-icon ui-icon-circle-zoomout"></span>View All Requests</a>
		</div>
		<div id="divStatusReportRequests">
			<table id="tblStatusReportRequests" class="tablesorter report">
				<thead>
					<tr valign="top" class="rowFilters" style="display:none">
						<th class="sorter-false" nowrap="nowrap"><select id="ddlRequestRequestID"></select></th>
						<th class="sorter-false" nowrap="nowrap"></th>
						<th class="sorter-false" nowrap="nowrap"><select id="ddlRequestStatus"></select></th>
						<th class="sorter-false" nowrap="nowrap"><select id="ddlRequestInternalDueDate"></select></th>
						<th class="sorter-false" nowrap="nowrap"><select id="ddlRequestDueDate"></select></th>
						<th class="sorter-false" nowrap="nowrap"><select id="ddlRequestSample"><option value="">-Select-</option><option value="true">true</option><option value="false">false</option></select></th>
						<th class="sorter-false" nowrap="nowrap"><select id="ddlRequestSentEmail"><option value="">-Select-</option><option value="true">true</option><option value="false">false</option></select></th>
						<th class="sorter-false" nowrap="nowrap"><select id="ddlRequestAO"></select></th>
						<th class="sorter-false" nowrap="nowrap"></th>
						<th class="sorter-false" nowrap="nowrap"></th>
						<th class="sorter-false" nowrap="nowrap"></th>
					</tr>
					<tr valign="top">
						<th class="sorter-true" nowrap="nowrap">Request #</th>
						<th class="sorter-true" nowrap="nowrap">Subject</th>
						<th class="sorter-true" nowrap="nowrap">Status</th>
						<th class="sorter-true" nowrap="nowrap">Internal Due Date</th>
						<th class="sorter-true" nowrap="nowrap">Due Date</th>
						<th class="sorter-true" nowrap="nowrap">Sample?</th>
						<th class="sorter-true" nowrap="nowrap">Sent Email?</th>
						<th class="sorter-false" nowrap="nowrap">Action Office(s)</th>
						<th class="sorter-true" nowrap="nowrap"># of Responses</th>
						<th class="sorter-true" nowrap="nowrap"># of Open Responses</th>
						<th class="sorter-true" nowrap="nowrap"># of Documents</th>
					</tr>
				</thead>
				<tbody id="fbody1"></tbody>
				<tfoot class="footer">
					<tr>
						<th colspan="11">Displaying <span id="spanRequestsDisplayedTotal" style="color:green">0</span> out of <span id="spanRequestsTotal" style="color:green">0</span> Requests</th>
					</tr>
				</tfoot>
			</table>
		</div>
	</div>
	
	<div id="tabs-1">
		
		<div style="padding-top:3px">
			<a id="btnPrint2" title="Click here to Print" href="javascript:void(0)" class="hideOnPrint"><span class="ui-icon ui-icon-print">Print</span></a>
			<a class="export2 hideOnPrint" title="Export to CSV" href="#"><span class="ui-icon ui-icon-disk">Export to CSV</span></a>
			<a id="btnViewAllResponses" title="Clear All Filters and View All Responses" href="javascript:void(0)" style="display:none"><span class="ui-icon ui-icon-circle-zoomout"></span>View All Responses</a>
		</div>
		<div id="divStatusReportRespones">
			<table id="tblStatusReportResponses" class="tablesorter report">
				<thead>
					<tr valign="top" class="rowFilters" style="display:none">
						<th class="sorter-false" nowrap="nowrap"><select id="ddlResponseRequestID"></select></th>
						<th class="sorter-false" nowrap="nowrap"><select id="ddlResponseSampleNum"></select></th>
						<th class="sorter-false" nowrap="nowrap"><select id="ddlResponseName"></select></th>
						<th class="sorter-false" nowrap="nowrap"><select id="ddlResponseRequestInternalDueDate"></select></th>
						<th class="sorter-false" nowrap="nowrap"><select id="ddlResponseStatus"></select></th>
						<th class="sorter-false" nowrap="nowrap"><select id="ddlResponseAO"></select></th>
						<th class="sorter-false" nowrap="nowrap"></select></th>
						<th class="sorter-false" nowrap="nowrap"><select id="ddlResponseModified"></select></th>
					</tr>
					<tr valign="top">
						<th class="sorter-true" nowrap="nowrap">Request #</th>
						<th class="sorter-true" nowrap="nowrap">Sample #</th>
						<th class="sorter-true" nowrap="nowrap">Response Name</th>
						<th class="sorter-true" nowrap="nowrap">Internal Due Date</th>
						<th class="sorter-true" nowrap="nowrap">Status</th>
						<th class="sorter-true" nowrap="nowrap">Action Office</th>
						<th class="sorter-true" nowrap="nowrap"># of Documents</th>
						<th class="sorter-true" nowrap="nowrap">Modified</th>
					</tr>
				</thead>
				<tbody id="fbody2"></tbody>
				<tfoot class="footer">
					<tr>
						<th colspan="8">Displaying <span id="spanResponsesDisplayedTotal" style="color:green">0</span> out of <span id="spanResponsesTotal" style="color:green">0</span> Responses</th>
					</tr>
				</tfoot>
			</table>
		</div>
	</div>
	<div id="tabs-2">	
		
		<div style="padding-bottom:15px">
			<span>Request: </span><select id="ddlReqNum" title="Select a Request Number"></select>
		</div>
		
		<div id="divRequestClose" style="width:300px; display:none">
			<fieldset style="border-color:GreenYellow">
				<legend style="font-weight:bold; font-size:12pt;">Action</legend>
				<span class="ui-icon ui-icon-locked"></span><a id="btnCloseRequest" href="javascript:void(0)" title="Close this Request">Close this Request</a>
			</fielset>
		</div>
		
		<div id="divRequestInfo" style="display:none;">
			<fieldset>
				<legend>Request Information</legend>
				<table id="tblRequestInfo" class="tablesorter">
					<tbody>
						<tr>
							<td>Request #</td>
							<td><span id="requestInfoNum"></span></td>
						</tr>
						<tr>
							<td>Subject</td>
							<td><span id="requestInfoSub"></span></td>
						</tr>
						<tr>
							<td>Internal Due Date</td>
							<td><span id="requestInfoInternalDueDate"></span></td>
						</tr>
						<tr>
							<td>Due Date</td>
							<td><span id="requestInfoDueDate"></span></td>
						</tr>
						<tr>
							<td>Status</td>
							<td><span id="requestInfoStatus"></span></td>
						</tr>
						<tr>
							<td>Sample?</td>
							<td><span id="requestInfoSample"></span></td>
						</tr>
						<tr>
							<td>Reviewer</td>
							<td><span id="requestInfoReviewer"></span></td>
						</tr>
						<tr>
							<td>Owner</td>
							<td><span id="requestInfoOwner"></span></td>
						</tr>
						<tr>
							<td>Receipt Date</td>
							<td><span id="requestInfoReceiptDate"></span></td>
						</tr>
						<tr>
							<td>Memo Date</td>
							<td><span id="requestInfoMemoDate"></span></td>
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
							<td><span id="requestInfoComments"></span></td>
						</tr>
						<tr>
							<td>Action Office(s)</td>
							<td><span id="requestInfoActionOffice"></span></td>
						</tr>
						<tr>
							<td>Email Action Office(s)</td>
							<td><span id="requestInfoEmailActionOffice"></span></td>
						</tr>
						<tr>
							<td>Email Sent?</td>
							<td><span id="requestInfoEmailSent"></span>
								<fieldset style="width:200px; margin-top:5px; margin-left:10px; padding-left:10px;"><legend>Email Actions</legend>
									<div id="divSendEmailAction" style="padding-top:5px;"></div>
									<div id="divEmailHistory" style="padding-top:5px;"></div>
								</fieldset>
							</td>
						</tr>
						<tr>
							<td>Special Permissions?</td>
							<td><span id="requestInfoSpecialPermissions"></span>
								<fieldset style="width:200px; margin-top:5px; margin-left:10px; padding-left:10px;"><legend>Special Permission Actions</legend>
									<div id="divResponsesGrantSpecialPermissions" style="padding-top:5px;"></div>
									<div id="divResponsesRemoveSpecialPermissions" style="padding-top:5px;"></div>
								</fieldset>
							</td>
						</tr>
					</tbody>
				</table>
				<div id="divRequestInfoActions" style="padding-top:5px;"></div>
			</fieldset>
		</div>
		
		<div id="divRequestDocs" style="display:none" >
			<fieldset>
				<legend>Request Documents</legend>
				<div id="divEmptyRequestDocsMsg" style="border:0px !important; font-style:italic; display:none;">There are 0 Request Documents</div>
				<div id="divRequestDocsLoading" style="color:green; display:none">Loading...</div>
				<table id="tblRequestDocs" class="tablesorter">
					<thead>				
						<tr valign="top">
							<th class="sorter-false" nowrap="nowrap">Name</th>
							<th class="sorter-false" nowrap="nowrap">Action</th>
						</tr>
					</thead>
					<tbody></tbody>
					<tfoot>
						<tr valign="top">
							<th nowrap="nowrap" colspan="2">Total: <span id="tblRequestDocsTotal">0</span></th>
						</tr>
					</tfoot>
				</table>
				<div id="divRequestDocActions" style="padding-top:5px;"></div>
				<div id="divRequestResponsePermissions" style="padding-top:5px;"></div>
			</fieldset>
		</div>
		
		<div id="divCoverSheets" style="display:none" >
			<fieldset>
				<legend>Cover Sheets/Supplemental Documents</legend>

				<div id="divEmptyCoversheetsMsg" style="border:0px !important; font-style:italic; display:none;">There are 0 coversheets</div>
				<div id="divCoversheetsLoading" style="color:green; display:none">Loading...</div>
				<table id="tblCoverSheets" class="tablesorter report">
					<thead>				
						<tr valign="top">
							<th class="sorter-false" nowrap="nowrap">Name</th>
							<th class="sorter-false" nowrap="nowrap">Action Office</th>
							<th class="sorter-false" nowrap="nowrap">Action</th>
						</tr>
					</thead>
					<tbody></tbody>
					<tfoot>
						<tr valign="top">
							<th nowrap="nowrap" colspan="3">Total: <span id="tblCoverSheetsTotal">0</span></th>
						</tr>
					</tfoot>
				</table>
				<div id="divCoverSheetActions" style="padding-top:5px;"></div>
			</fieldset>
		</div>
		
		<div id="divResponses" style="display:none" >
			<fieldset>
				<legend>Responses</legend>			
				<div id="divResponsesActions" style="padding-top:5px;"></div>							
				<div id="divResponsesShowHideFolderPerms" style="display:none"><a title="Show/Hide Response Folder Permissions" style="color:#0072bc !important" href="javascript:void(0)" onclick="Audit.IAReport.Report.ToggleResFolderPerms()"><span class="ui-icon ui-icon-gear"></span>Show/Hide Response Folder Permissions</a></div>
				<div id="divResponsesLoading" style="padding-top:10px; color:green; display:none">Loading...</div>
				<table id="tblResponses" class="tablesorter report">
					<thead>				
						<tr valign="top">
							<th class="sorter-true" nowrap="nowrap">Sample #</th>
							<th class="sorter-true" nowrap="nowrap" style="text-align:left">Name</th>
							<th class="sorter-true" nowrap="nowrap">Action Office</th>
							<th class="sorter-true" nowrap="nowrap">Status</th>
							<th class="sorter-true" nowrap="nowrap">Return Reason</th>
							<th class="sorter-false" nowrap="nowrap">Special Permission?</th>
							<th class="sorter-false response-permissions" nowrap="nowrap">Response Folder Permissions</th>
							<th class="sorter-false" nowrap="nowrap">Action</th>
							<th class="sorter-false" nowrap="nowrap">Documents</th>
						</tr>
					</thead>
					<tbody></tbody>
					<tfoot>
						<tr valign="top">
							<th colspan="9" nowrap="nowrap">Total: <span id="tblResponsesTotal">0</span></th>
						</tr>
					</tfoot>
				</table>
			</fieldset>
		</div>

		<div id="divResponseDocs" style="display:none">
			<fieldset><legend>Response Documents</legend>
				<div id="divResponseDocsLoading" style="color:green; display:none">Loading...</div>
				<div id="divEmptyResponseDocsMsg" style="border:0px !important; font-style:italic; display:none;">There are 0 response documents</div>
				
				<table id="tblResponseDocs" class="tablesorter report">
					<thead>				
						<tr valign="top">
							<th class="sorter-false" nowrap="nowrap">Type</th>
							<th class="sorter-false" nowrap="nowrap">Name</th>
							<th class="sorter-false" nowrap="nowrap">Title</th>
							<th class="sorter-false" nowrap="nowrap">Receipt Date</th>
							<th class="sorter-false" nowrap="nowrap">File Size</th>
							<th class="sorter-false" nowrap="nowrap">Checked Out</th>
							<th class="sorter-false" nowrap="nowrap">Status <span class="linkHelpResponseDocs" style="float:right"><a title="View Help" href="javascript:void(0)" style="color:#0072bc"><span class="ui-icon ui-icon-help"></span></a></span></th>
							<th class="sorter-false" nowrap="nowrap">Reason</th>
							<th class="sorter-false" nowrap="nowrap">Modified</th>
							<th class="sorter-false" nowrap="nowrap">Modified By</th>
							<th class="sorter-false" nowrap="nowrap">Actions</th>
						</tr>
					</thead>
					<tbody></tbody>
					<tfoot>
						<tr valign="top">
							<th colspan="11" nowrap="nowrap">Total: <span id="tblResponseDocsTotal">0</span></th>
						</tr>
					</tfoot>
				</table>
				<div id="divResponseDocActions" style="padding-top:5px;"></div>
			</fieldset>
		</div>
		
	</div>
</div>

<div id="divRanBulkUpdate" title="Do not delete Used for checking if bulk update ran" style="display:none"></div>

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
<script type="text/javascript" src="../SiteAssets/js/Audit_Page_IA.js"></script>

