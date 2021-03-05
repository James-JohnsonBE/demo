﻿<iframe id="CsvExpFrame" style="display: none"></iframe>

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
				<div id="divRequestsThatNeedToClose" style="width:700px" data-bind="visible: arrRequestsThatNeedClosing().length > 0">
					<fieldset>
						<legend><span class='ui-icon ui-icon-alert'></span><span data-bind="text: arrRequestsThatNeedClosing().length"></span> Requests Need Closing</legend>
						<table id="tblRequestsThatNeedToClose"  class="tablesorter report">
							<thead>
								<tr valign="top">
									<th class="sorter-false" nowrap="nowrap">Request ID</th>
									<th class="sorter-false" nowrap="nowrap">Last Response Closed</th>
									<th class="sorter-false" nowrap="nowrap"></th>
								</tr>
							</thead>
							<tbody data-bind="foreach: arrRequestsThatNeedClosing">
								<tr><td><span data-bind="text: number"></span></td><td><b><span data-bind="text: lastResponseId"></span></b>&nbsp;on&nbsp;<b><span data-bind="text: sLastClosedDate"></span></b>&nbsp;by&nbsp;<b><span data-bind="text: lastClosedBy"></span></b></td><td><a href='javascript:void(0)' title='Click here to Go to this Request' data-bind="click: $root.ClickGoToRequest">Go to Request</a></td></tr>
							</tbody>			
						</table>
					</fieldset>
				</div>
				<div id="divRequestsWithNoEmailSent" style="width:400px; cursor:pointer" title="Click here to View" data-bind="visible: arrRequestsWithNoEmailSent().length > 0">
					<fieldset style="border: 0px solid white">
						<legend class="warning" style="color:red"><span class="ui-icon ui-icon-alert"></span><a href="javascript:void(0)"><span data-bind="text: arrRequestsWithNoEmailSent().length"></span> Requests need Emails sent out</a></legend>
						<div id="divRequestsWithNoEmailSentItems" class="collapsed">
							<ul data-bind="foreach: arrRequestsWithNoEmailSent">
								<li>
									<a href="javascript:void(0);" title="Go to Request Details" data-bind="click: $root.ClickGoToRequest"><span data-bind="text: title"></span></a>
								</li>
							</ul>
						</div>
					</fieldset>	
				</div>
				<div id="divResponsesSubmitted" style="width:400px; cursor:pointer" title="Click here to View" data-bind="visible: arrResponsesSubmittedByAO().length > 0">
					<fieldset style="border: 0px solid white">
						<legend class="warning" style="color:red"><span class="ui-icon ui-icon-alert"></span><a href="javascript:void(0)"><span data-bind="text: arrResponsesSubmittedByAO().length"></span> Responses have been Submitted by the Action Offices</a></legend>
						<div id="divResponsesSubmittedItems" class="collapsed">
							<ul data-bind="foreach: arrResponsesSubmittedByAO">
								<li>
									<a href="javascript:void(0);" title="Go to Request Details" data-bind="click: $root.ClickGoToRequest"><span data-bind="text: title"></span></a>
								</li>
							</ul>
						</div>
					</fieldset>	
				</div>
				<div id="divRequestsAlmostInternalDue" style="width:400px; cursor:pointer" title="Click here to View" data-bind="visible: arrRequestsInternalAlmostDue().length > 0">
					<fieldset style="border: 0px solid white">
						<legend class="warning" style="color:red"><span class="ui-icon ui-icon-alert"></span><a href="javascript:void(0)"><span data-bind="text: arrRequestsInternalAlmostDue().length"></span> Requests are reaching their Internal Due Date</a></legend>
						<div id="divRequestsAlmostInternalDueItems" class="collapsed">
							<ul data-bind="foreach: arrRequestsInternalAlmostDue">
								<li>
									<a href="javascript:void(0);" title="Go to Request Details" data-bind="click: $root.ClickGoToRequest"><span data-bind="text: title"></span></a>
								</li>
							</ul>
						</div>
					</fieldset>	
				</div>
				<div id="divRequestsPastInternalDue" style="width:400px; cursor:pointer" title="Click here to View" data-bind="visible: arrRequestsInternalPastDue().length > 0">
					<fieldset style="border: 0px solid white">
						<legend class="warning" style="color:red"><span class="ui-icon ui-icon-alert"></span><a href="javascript:void(0)"><span data-bind="text: arrRequestsInternalPastDue().length"></span> Requests have PASSED their Internal Due Date</a></legend>
						<div id="divRequestsPastInternalDueItems" class="collapsed">
							<ul data-bind="foreach: arrRequestsInternalPastDue">
								<li>
									<a href="javascript:void(0);" title="Go to Request Details" data-bind="click: $root.ClickGoToRequest"><span data-bind="text: title"></span></a>
								</li>
							</ul>
						</div>
					</fieldset>	
				</div>	
				<div id="divRequestsAlmostDue" style="width:400px; cursor:pointer" title="Click here to View" data-bind="visible: arrRequestsAlmostDue().length > 0">
					<fieldset style="border: 0px solid white">
						<legend class="warning" style="color:red"><span class="ui-icon ui-icon-alert"></span><a href="javascript:void(0)"><span data-bind="text: arrRequestsAlmostDue().length"></span> Requests are reaching their Due Date</a></legend>
						<div id="divRequestsAlmostDueItems" class="collapsed">
							<ul data-bind="foreach: arrRequestsAlmostDue">
								<li>
									<a href="javascript:void(0);" title="Go to Request Details" data-bind="click: $root.ClickGoToRequest"><span data-bind="text: title"></span></a>
								</li>
							</ul>
						</div>
					</fieldset>	
				</div>
				
				<div id="divRequestsPastDue" style="width:400px; cursor:pointer" title="Click here to View" data-bind="visible: arrRequestsPastDue().length > 0">
					<fieldset style="border: 0px solid white">
						<legend class="warning" style="color:red"><span class="ui-icon ui-icon-alert"></span><a href="javascript:void(0)"><span data-bind="text: arrRequestsPastDue().length"></span> Requests have PASSED their Due Date</a></legend>
						<div id="divRequestsPastDueItems" class="collapsed">
							<ul data-bind="foreach: arrRequestsPastDue">
								<li>
									<a href="javascript:void(0);" title="Go to Request Details" data-bind="click: $root.ClickGoToRequest"><span data-bind="text: title"></span></a>
								</li>
							</ul>
						</div>
					</fieldset>	
				</div>
				
				<div id="divCheckedOutResponseDocs" style="width:400px; cursor:pointer" title="Click here to View" data-bind="visible: arrResponseDocsCheckedOut().length > 0">
					<fieldset style="border: 0px solid white">
						<legend class="warning" style="color:red"><span class="ui-icon ui-icon-alert"></span><a href="javascript:void(0)"><span data-bind="text: arrResponseDocsCheckedOut().length"></span> Response Documents are Checked Out</a></legend>
						<div id="divCheckedOutResponseDocsItems" class="collapsed">
							<ul data-bind="foreach: arrResponseDocsCheckedOut">
								<li>
									<a href="javascript:void(0);" title="Go to Request Details" data-bind="click: $root.ClickGoToRequest"><span data-bind="text: title"></span></a>
								</li>
							</ul>
						</div>
					</fieldset>	
				</div>
	
				<div id="divRequestsWithNoResponse" style="display:none; width:400px; cursor:pointer" title="Click here to View" data-bind="visible: arrRequestsWithNoResponses().length > 0">
					<fieldset style="border: 0px solid white">
						<legend class="warning" style="color:red"><span class="ui-icon ui-icon-alert"></span><a href="javascript:void(0)"><span data-bind="text: arrRequestsWithNoResponses().length"></span> Requests have 0 Responses</a></legend>
						<div id="divRequestsWithNoResponseItems" class="collapsed">
							<ul data-bind="foreach: arrRequestsWithNoResponses">
								<li>
									<a href="javascript:void(0);" title="Go to Request Details" data-bind="click: $root.ClickGoToRequest"><span data-bind="text: title"></span></a>
								</li>
							</ul>
						</div>
					</fieldset>	
				</div>
				
			</td>		
		</tr>
	</table>
</div>

<div id="tabs" style="display:none; margin-top:20px;" class="ui-tabs ui-widget">
	<ul class="ui-tabs-nav">
		<li><a href="#tabs-0">Request Status Report</a></li>
		<li><a href="#tabs-1">Response Status Report</a></li>
		<li><a href="#tabs-2">Request Information</a></li>
	</ul>
	
	<div id="tabs-0">
		<div style="padding-top:3px" data-bind="visible: arrRequests().length > 0">
			<a id="btnPrint1" title="Click here to Print" href="javascript:void(0)" class="hideOnPrint"><span class="ui-icon ui-icon-print">Print</span></a>
			<a class="export1 hideOnPrint" title="Export to CSV" href="#"><span class="ui-icon ui-icon-disk">Export to CSV</span></a>
			<a id="btnViewAllRequests" title="Clear All Filters and View All Requests" href="javascript:void(0)" data-bind="visible: arrFilteredRequestsCount() < arrRequests().length, click: ClearFiltersRequestTab"><span class="ui-icon ui-icon-circle-zoomout"></span>View All Requests</a>
		</div>
		<div id="divStatusReportRequests">
			<table id="tblStatusReportRequests" class="tablesorter report">
				<thead>
					<tr valign="top" class="rowFilters" data-bind="visible: arrRequests().length > 0">
						<th class="sorter-false" nowrap="nowrap"><select id="ddlRequestRequestID" data-bind="options: $root.ddOptionsRequestTabRequestID, value: filterRequestTabRequestID, optionsCaption: '-Select-'"></select></th>
						<th class="sorter-false" nowrap="nowrap"></th>
						<th class="sorter-false" nowrap="nowrap"><select id="ddlRequestSensitivity" data-bind="options: $root.ddOptionsRequestTabRequestSensitivity, value: filterRequestTabRequestSensitivity, optionsCaption: '-Select-'"></select></th>
						<th class="sorter-false" nowrap="nowrap"><select id="ddlRequestStatus" data-bind="options: $root.ddOptionsRequestTabRequestStatus, value: filterRequestTabRequestStatus, optionsCaption: '-Select-'"></select></th>
						<th class="sorter-false" nowrap="nowrap"><select id="ddlRequestInternalDueDate" data-bind="options: $root.ddOptionsRequestTabRequestInternalDueDate, value: filterRequestTabRequestInternalDueDate, optionsCaption: '-Select-'"></select></th>
						<th class="sorter-false" nowrap="nowrap"><select id="ddlRequestDueDate" data-bind="options: $root.ddOptionsRequestTabRequestDueDate, value: filterRequestTabRequestDueDate, optionsCaption: '-Select-'"></select></th>
						<th class="sorter-false" nowrap="nowrap"><select id="ddlRequestSample" data-bind="options: $root.ddOptionsRequestTabRequestSample, value: filterRequestTabRequestSample, optionsCaption: '-Select-'"></select></th>
						<th class="sorter-false" nowrap="nowrap"><select id="ddlRequestSentEmail" data-bind="options: $root.ddOptionsRequestTabRequestSentEmail, value: filterRequestTabRequestSentEmail, optionsCaption: '-Select-'"></select></th>
						<th class="sorter-false" nowrap="nowrap"><select id="ddlRequestAO" data-bind="options: $root.ddOptionsRequestTabRequestAO, value: filterRequestTabRequestAO, optionsCaption: '-Select-'"></select></th>
						<th class="sorter-false" nowrap="nowrap"></th>
						<th class="sorter-false" nowrap="nowrap"></th>
						<th class="sorter-false" nowrap="nowrap"></th>
					</tr>
					<tr valign="top">
						<th class="sorter-true" nowrap="nowrap">Request #</th>
						<th class="sorter-true" nowrap="nowrap">Subject</th>
						<th class="sorter-true" nowrap="nowrap">Sensitivity</th>
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
				<tbody id="fbody1" style="display:none"></tbody>
				<tfoot class="footer">
					<tr>
						<th colspan="12">Displaying <span id="spanRequestsDisplayedTotal" style="color:green" data-bind="text: arrFilteredRequestsCount()">0</span> out of <span id="spanRequestsTotal" style="color:green" data-bind="text: arrRequests().length">0</span> Requests</th>
					</tr>
				</tfoot>
			</table>
		</div>
	</div>
	
	<div id="tabs-1" style="display:none">
		<div id="divButtons" style="padding-top:3px" data-bind="visible: arrResponses().length > 0">
			<a id="btnPrint2" title="Click here to Print" href="javascript:void(0)" class="hideOnPrint"><span class="ui-icon ui-icon-print">Print</span></a>
			<a class="export2 hideOnPrint" title="Export to CSV" href="#"><span class="ui-icon ui-icon-disk">Export to CSV</span></a>
			<a id="btnViewAllResponses" title="Clear All Filters and View All Responses" href="javascript:void(0)" data-bind="visible: arrFilteredResponsesCount() < arrResponses().length, click: ClearFiltersResponseTab"><span class="ui-icon ui-icon-circle-zoomout"></span>View All Responses</a>
		</div>
		<div id="divStatusReportRespones">
			<table id="tblStatusReportResponses" class="tablesorter report" data-bind="visible: arrResponses().length > 0" >
				<thead>
					<tr valign="top" class="rowFilters" data-bind="visible: arrResponses().length > 0">
						<th class="sorter-false" nowrap="nowrap"><select id="ddlResponseRequestID" data-bind="options: $root.ddOptionsResponseTabRequestID, value: filterResponseTabRequestID, optionsCaption: '-Select-'"></select></th>
						<th class="sorter-false" nowrap="nowrap"><select id="ddlResponseSampleNum" data-bind="options: $root.ddOptionsResponseTabRequestSample, value: filterResponseTabSampleNum, optionsCaption: '-Select-'"></select></th>
						<th class="sorter-false" nowrap="nowrap"><select id="ddlResponseName" data-bind="options: $root.ddOptionsResponseTabResponseTitle, value: filterResponseTabResponseName, optionsCaption: '-Select-'"></select></th>
						<th class="sorter-false" nowrap="nowrap"><select id="ddlResponseRequestInternalDueDate" data-bind="options: $root.ddOptionsResponseTabRequestInternalDueDate, value: filterResponseTabRequestIntDueDate, optionsCaption: '-Select-'"></select></th>
						<th class="sorter-false" nowrap="nowrap"><select id="ddlResponseStatus" data-bind="options: $root.ddOptionsResponseTabResponseStatus, value: filterResponseTabResponseStatus, optionsCaption: '-Select-'"></select></th>
						<th class="sorter-false" nowrap="nowrap"><select id="ddlResponseAO" data-bind="options: $root.ddOptionsResponseTabResponseAO, value: filterResponseTabResponseAO, optionsCaption: '-Select-'"></select></th>
						<th class="sorter-false" nowrap="nowrap"></select></th>
						<th class="sorter-false" nowrap="nowrap"><select id="ddlResponseModified" data-bind="options: $root.ddOptionsResponseTabResponseModified, value: filterResponseTabResponseModified, optionsCaption: '-Select-'"></select></th>
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
				<tbody id="fbody2" style="display:none"></tbody>
				<tfoot class="footer">
					<tr>
						<th colspan="8">Displaying <span id="spanResponsesDisplayedTotal" style="color:green" data-bind="text: arrFilteredResponsesCount()">0</span> out of <span id="spanResponsesTotal" style="color:green" data-bind="text: arrResponses().length">0</span> Responses</th>
					</tr>
				</tfoot>
			</table>
		</div>
	</div>
	
	
	<div id="tabs-2" style="display:none">	
		<div style="padding-bottom:15px">
			<span>Request: </span><select id="ddlReqNum" title="Select a Request Number" data-bind="options: $root.ddOptionsRequestInfoTabRequestName, value: filterRequestInfoTabRequestName, optionsCaption: '-Select-'"></select>
		</div>
		
		<div id="divRequestClose" style="width:300px;" data-bind="visible: bDisplayClose">
			<fieldset style="border-color:GreenYellow">
				<legend style="font-weight:bold; font-size:12pt;">Action</legend>
				<span class="ui-icon ui-icon-locked"></span><a id="btnCloseRequest" href="javascript:void(0)" title="Close this Request" data-bind="click: ClickCloseRequest">Close this Request</a>
			</fielset>
		</div>
		
		<div id="divRequestInfo" data-bind="with: currentRequest">
			<fieldset>
				<legend>Request Information</legend>
				<table id="tblRequestInfo" class="tablesorter">
					<tbody>
						<tr>
							<td>Request #</td>
							<td><span id="requestInfoNum" data-bind="text: number"></span></td>
						</tr>
						<tr>
							<td>Subject</td>
							<td><span id="requestInfoSub" data-bind="text: subject"></span></td>
						</tr>
						<tr>
							<td>Sensitivity</td>
							<td><span id="requestInfoSensitivity" data-bind="text: sensitivity"></span></td>
						</tr>
						<tr>
							<td>Internal Due Date</td>
							<td><span id="requestInfoInternalDueDate" data-bind="text: internalDueDate"></span></td>
						</tr>
						<tr>
							<td>Due Date</td>
							<td><span id="requestInfoDueDate" data-bind="text: dueDate"></span></td>
						</tr>
						<tr>
							<td>Status</td>
							<td>
								<span id="requestInfoStatus" data-bind="text: status, style: { color:  status == 'Closed' ? 'red' : 'green' }"></span>
								<span data-bind="visible: status == 'Closed', style: { color: 'red'}">on <span data-bind="text: closedDate, style: { color: 'red'}"></span> </span>
							</td>
						</tr>
						<tr>
							<td>Sample?</td>
							<td>
								<span id="requestInfoSample">
									<span data-bind="if: sample"><span class='ui-icon ui-icon-check'></span> Yes</span>
									<span data-bind="if: !sample"><span class='ui-icon ui-icon-close'></span> No</span>
								</span>
							</td>
						</tr>
						<tr>
							<td>Reviewer</td>
							<td><span id="requestInfoReviewer" data-bind="text: reviewer"></span></td>
						</tr>
						<tr>
							<td>Owner</td>
							<td><span id="requestInfoOwner"  data-bind="text: owner"></span></td>
						</tr>
						<tr>
							<td>Receipt Date</td>
							<td><span id="requestInfoReceiptDate" data-bind="text: receiptDate"></span></td>
						</tr>
						<tr>
							<td>Memo Date</td>
							<td><span id="requestInfoMemoDate" data-bind="text: memoDate"></span></td>
						</tr>
						<tr>
							<td>Related Audit</td>
							<td><span id="requestInfoRelatedAudit" data-bind="text: relatedAudit"></span></td>
						</tr>
						<tr>
							<td>Action Items</td>
							<td><span id="requestInfoActionItems" data-bind="html: actionItems"></span></td>
						</tr>
						<tr>
							<td>Comments</td>
							<td><span id="requestInfoComments" data-bind="html: comments"></span></td>
						</tr>
						<tr>
							<td>Action Office(s)</td>
							<td>
								<span id="requestInfoActionOffice">
									<div style="cursor:pointer; white-space:nowrap" title="Click to view" >
										<span class="actionOfficeContainerRequestInfo" data-bind="toggleClick: $data, toggleClass: 'collapsed', classContainer: '.sr1-request-actionOfficeContainerRequestInfo-item'">
											<span class="ui-icon ui-icon-search"></span><a href="javascript:void(0)">View Action Offices</a>
											 <!-- ko foreach: actionOffices -->
												<div class="sr1-request-actionOfficeContainerRequestInfo-item collapsed" data-bind="text: ao"></div>
											 <!-- /ko -->	
										</span>
									</div>
								</span>
							</td>
						</tr>
						<tr>
							<td>Email Action Office(s)</td>
							<td>
								<span id="requestInfoActionOffice">
									<div style="cursor:pointer; white-space:nowrap" title="Click to view" >
										<span class="actionOfficeContainerRequestInfo" data-bind="toggleClick: $data, toggleClass: 'collapsed', classContainer: '.sr1-request-actionOfficeContainerRequestInfo-item'">
											<span class="ui-icon ui-icon-search"></span><a href="javascript:void(0)">View Email Action Offices</a>
											 <!-- ko foreach: emailActionOffices -->
												<div class="sr1-request-actionOfficeContainerRequestInfo-item collapsed" data-bind="text: ao"></div>
											 <!-- /ko -->	
										</span>
									</div>
								</span>
							</td>

						</tr>
						<tr>
							<td>Email Sent?</td>
							<td>
								<span data-bind="if: emailSent"><span class='ui-icon ui-icon-check'></span> Yes</span>
								<span data-bind="if: !emailSent"><span class='ui-icon ui-icon-close'></span> No</span>

								<fieldset style="width:225px; margin-top:5px; margin-left:10px; padding-left:10px;"><legend>Email Actions</legend>
									<div id="divSendEmailAction" style="padding-top:5px;" data-bind="visible: status == 'Open' || status == 'ReOpened'">
										<span class="ui-icon ui-icon-mail-closed"></span>
										<a data-bind="visible: !emailSent, click: $root.ClickSendEmail" title="Send Email to Action Offices" href="javascript:void(0)">Send Email to Action Offices</a>
										<a data-bind="visible: emailSent, click: $root.ClickSendEmail" title="ReSend Email to Action Offices" href="javascript:void(0)">Re-Send Email to Action Offices</a>
									</div>
									<div id="divEmailHistory" style="padding-top:5px;">
										<a title="View Email History" href="javascript:void(0)" data-bind="click: $root.ClickViewEmailHistoryFolder"><span class='ui-icon ui-icon-search'></span>View Email History</a>
										
									</div> 
								</fieldset>
							</td>
						</tr>
						<tr>
							<td>Special Permissions?</td>
							<td>
								<span data-bind="if: specialPerms == true"><span class='ui-icon ui-icon-check'></span> Yes</span>
								<span data-bind="if: specialPerms == false"><span class='ui-icon ui-icon-close'></span> No</span>
								<fieldset style="width:200px; margin-top:5px; margin-left:10px; padding-left:10px;"><legend>Special Permission Actions</legend>
									<div id="divResponsesGrantSpecialPermissions" style="padding-top:5px;">
										<a title="Grant Special Permissions" href="javascript:void(0)" data-bind="click: $root.ClickGrantSpecialPermissions"><span class="ui-icon ui-icon-unlocked"></span>Grant Special Permissions</a>
									</div>
									<div id="divResponsesRemoveSpecialPermissions" style="padding-top:5px;">
										<a title="Remove Special Permissions" href="javascript:void(0)" data-bind="click: $root.ClickRemoveSpecialPermissions"><span class="ui-icon ui-icon-locked"></span>Remove Special Permissions</a>
									</div>
								</fieldset>
							</td>
						</tr>
					</tbody>
				</table>
				<div id="divRequestInfoActions" style="padding-top:5px;">
					<fieldset style='width:200px;margin-left:10px; padding-left:10px;'>
						<legend>Request Actions</legend>
						<div><a title='View Request' href='javascript:void(0)' data-bind="click: $root.ClickViewRequest"><span class='ui-icon ui-icon-search'></span>View Request</a></div>
						<div><a title='Edit Request' href='javascript:void(0)' data-bind="click: $root.ClickEditRequest"><span class='ui-icon ui-icon-pencil'></span>Edit Request</a></div>
					</fieldset>
				</div>
			</fieldset>
		</div>
		
		<div id="divRequestDocs" data-bind="visible: currentRequest">
			<fieldset>
				<legend>Request Documents</legend>
				<div id="divEmptyRequestDocsMsg" style="border:0px !important; font-style:italic;" data-bind="visible: arrCurrentRequestRequestDocs().length <= 0">There are 0 Request Documents</div>
				<table id="tblRequestDocs" class="tablesorter" data-bind="visible: arrCurrentRequestRequestDocs().length > 0">
					<thead>				
						<tr valign="top">
							<th class="sorter-false" nowrap="nowrap">Name</th>
							<th class="sorter-false" nowrap="nowrap">Action</th>
						</tr>
					</thead>
					<tbody data-bind="foreach: arrCurrentRequestRequestDocs">
						<tr class="request-doc-item">
							<td class="request-doc-title" title="Click to Download"><a data-bind="downloadLink: '../_layouts/download.aspx?SourceUrl=:folder/:title'"><span data-bind="text: title"></span></a></td>
							<td class="request-doc-action">							
								<a title="View Request Document" href="javascript:void(0)" data-bind="click: $root.ClickViewRequestDoc"><span class="ui-icon ui-icon-search">View Request Doc</span></a>
								<a title="Edit Request Document" href="javascript:void(0)" data-bind="visible: requestStatus != 'Closed' && requestStatus != 'Canceled', click: $root.ClickEditRequestDoc"><span class="ui-icon ui-icon-pencil">Edit Request Doc</span></a>
							</td>
						</tr>

					</tbody>
					<tfoot>
						<tr valign="top">
							<th nowrap="nowrap" colspan="2">Total: <span id="tblRequestDocsTotal" data-bind="text: arrCurrentRequestRequestDocs().length">0</span></th>
						</tr>
					</tfoot>
				</table>
				<div id="divRequestDocActions" style="padding-top:5px;">
					<a title="Upload Request Document" href="javascript:void(0)" data-bind="click: $root.ClickUploadRequestDoc"><span class="ui-icon ui-icon-circle-arrow-n">Upload Request Document</span>Upload Request Doc</a>
				</div>
			</fieldset>
		</div>
		
		<div id="divCoverSheets" data-bind="visible: currentRequest">
			<fieldset>
				<legend>Cover Sheets/Supplemental Documents</legend>
				<div id="divEmptyCoversheetsMsg" style="border:0px !important; font-style:italic;" data-bind="visible: arrCurrentRequestCoverSheets().length <= 0" >There are 0 coversheets</div>
				<table id="tblCoverSheets" class="tablesorter report" data-bind="visible: arrCurrentRequestCoverSheets().length > 0">
					<thead>				
						<tr valign="top">
							<th class="sorter-false" nowrap="nowrap">Name</th>
							<th class="sorter-false" nowrap="nowrap">Action Office</th>
							<th class="sorter-false" nowrap="nowrap">Action</th>
						</tr>
					</thead>
					<tbody data-bind="foreach: arrCurrentRequestCoverSheets">					
						<tr class="coversheet-item">
							<td class="coversheet-title" title="Click to Download"><a data-bind="downloadLink: '../_layouts/download.aspx?SourceUrl=:folder/:title'"><span data-bind="text: title"></span></a></td>
							<td class="coversheet-ao">
							
								<div style="cursor:pointer" title="Click to view" data-bind="visible: $data.actionOffices.length > 0, toggleClick: $data, toggleClass: 'collapsed', classContainer: '.sr1-request-actionOfficeContainerRequestInfo-item'">
									<span class="ui-icon ui-icon-search"></span><span class="actionOfficeContainerRequestInfo"><a href="javascript:void(0)">View Action Offices</a></span>									
									 <!-- ko foreach: actionOffices -->
										<div class="sr1-request-actionOfficeContainerRequestInfo-item collapsed"><span data-bind="text: actionOffice"></span></div>
									 <!-- /ko -->	
								</div>							
							</td>
							<td class="coversheet-action">
								<a title="View Coversheet" href="javascript:void(0)" data-bind="click: $root.ClickViewCoversheet"><span class="ui-icon ui-icon-search">View Coversheet</span></a>
								<a title="Edit Coversheet" href="javascript:void(0)" data-bind="visible: requestStatus != 'Closed' && requestStatus != 'Canceled', click: $root.ClickEditCoversheet"><span class="ui-icon ui-icon-pencil">Edit Coversheet</span></a>
							</td>
						</tr>
					</tbody>
					<tfoot>
						<tr valign="top">
							<th nowrap="nowrap" colspan="3">Total: <span id="tblCoverSheetsTotal" data-bind="text: arrCurrentRequestCoverSheets().length">0</span></th>
						</tr>
					</tfoot>
				</table>
				<div id="divCoverSheetActions" style="padding-top:5px;">
					<a title="Upload Cover Sheet or Supplemental Document" href="javascript:void(0)" data-bind="click: ClickUploadCoverSheet"><span class="ui-icon ui-icon-circle-arrow-n"></span>Upload Cover Sheet or Supplemental Document</a>
				</div>
			</fieldset>
		</div>
		
		<div id="divResponses" data-bind="visible: currentRequest" >
			<fieldset>
				<legend>Responses</legend>		
				<div data-bind="with: currentRequest">	
					<div id="divResponsesActions" style="padding-top:5px;" data-bind="visible: status == 'Open' || status == 'ReOpened'">
						<div>
							<a title="Add Response" href="javascript:void(0)" data-bind="click: $root.ClickAddResponse"><span class="ui-icon ui-icon-circle-plus"></span>Add Response</a>
						</div>
						<div>
							<a title="Bulk Add Responses" href="javascript:void(0)" data-bind="click: $root.ClickBulkAddResponse"><span class="ui-icon ui-icon-circle-plus"></span>Bulk Add Responses</a>
						</div>
						<div data-bind="visible: $root.currentRequest && $root.arrCurrentRequestResponses().length > 0">
							<a title="Bulk Edit Responses" href="javascript:void(0)" data-bind="click: $root.ClickBulkEditResponse"><span class="ui-icon ui-icon-pencil"></span>Bulk Edit Responses</a>
						</div>
					</div>							
				</div>
				<div id="divResponsesShowHideFolderPerms" data-bind="visible: currentRequest && arrCurrentRequestResponses().length > 0">
					<a title="Show/Hide Response Folder Permissions" style="color:#0072bc !important" href="javascript:void(0)" data-bind="toggleClick: $data, toggleClass: 'response-permissions', containerType: 'any'"><span class="ui-icon ui-icon-gear"></span>Show/Hide Response Folder Permissions</a>
				</div>
				<table id="tblResponses" class="tablesorter report" data-bind="visible: arrCurrentRequestResponses().length > 0 ">
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
					<tbody data-bind="foreach: arrCurrentRequestResponses">
						<tr class="response-item">
							<td class="response-sample"><span data-bind="text: sample"></span></td>
							<td class="response-title" data-bind="attr: {'id': 'response-item-title-' + title}"><span data-bind="text: title"></span></td>
							<td class="response-actionOffice" data-bind="attr: {'title': toolTip}, style: styleTag">
								<span data-bind="text: actionOffice"></span><span data-bind="visible: poc" style="color:green">&nbsp;POC: </span><span data-bind="text: poc" style="color:green">
							</td>
							<td class="response-resStatus">
								
								<span data-bind="visible: resStatus != '7-Closed'" style="color:green"><span data-bind="text: resStatus"></span> </span>
								<span data-bind="visible: resStatus == '7-Closed'" style="color:red"><span data-bind="text: resStatus"></span>&nbsp;on&nbsp;<span data-bind="text: closedDate"></span>&nbsp;by&nbsp;<span data-bind="text: closedBy"></span></span>
								
								<div style="padding-top:5px; padding-left:20px;" data-bind="visible: resStatus == '7-Closed'">
									<span class="ui-icon ui-icon-gear"></span><a title="Click to Open Response" href="javascript:void(0)" data-bind="click: $root.ClickReOpenResponse">Open Response?</a>
								</div>								
							</td>
							<td class="response-returnReason" style="white-space:pre-line"><span data-bind="text: returnReason"></span></td>
							<td class="response-specialPermissions"><span data-bind="css: (specialPerms ? 'ui-icon ui-icon-check' : '')"></span></td>
							<td class="response-permissions"><span data-bind="html: groupPerms"></span></td>
							<td class="response-action">
								<a title='View Response' href='javascript:void(0)' data-bind="click: $root.ClickViewResponse"><span class='ui-icon ui-icon-search'>View Response</span></a>
								<a title='Edit Response' href='javascript:void(0)' data-bind="visible: resStatus != '7-Closed' && $parent.status != 'Closed' && $parent.status != 'Canceled', click: $root.ClickEditResponse"><span class='ui-icon ui-icon-pencil'>Edit Response</span></a>
							</td>
							<td class="response-responseDocs">
								<a title='View Response Documents' href='javascript:void(0)' data-bind="visible: resStatus != '7-Closed' && $parent.status != 'Closed' && $parent.status != 'Canceled', click: $root.ClickViewResponseDocFolder"><span class='ui-icon ui-icon-folder-collapsed'>View Folder</span></a>
								<a title='Upload Response Documents' href='javascript:void(0)' data-bind="visible: $parent.status != 'Closed' && $parent.status != 'Canceled' && ( resStatus == '1-Open' || resStatus == '2-Submitted' || resStatus == '3-Returned to Action Office' ||resStatus == '5-Returned to GFS' ), click: $root.ClickUploadToResponseDocFolder"><span class='ui-icon ui-icon-circle-arrow-n'>Upload Docs</span></a>
							</td>
						</tr>
					</tbody>
					<tfoot>
						<tr valign="top">
							<th colspan="9" nowrap="nowrap">Total: <span id="tblResponsesTotal" data-bind="text: arrCurrentRequestResponses().length">0</span></th>
						</tr>
					</tfoot>
				</table>
			</fieldset>
		</div>

		<div id="divResponseDocs" data-bind="visible: currentRequest">
			<fieldset><legend>Response Documents</legend>
				<div id="divEmptyResponseDocsMsg" style="border:0px !important; font-style:italic" data-bind="visible: cntResponseDocs() == 0">There are 0 response documents</div>
				
				<table id="tblResponseDocs" class="tablesorter report" data-bind="visible: cntResponseDocs() > 0">
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
					<tbody data-bind="foreach: { data: arrCurrentRequestResponseDocs, as: 'responseDocSummary'} ">
						<tr class="requestInfo-response-doc" data-bind="visible: responseDocSummary.responseDocs.length > 0">
							<td colspan="11">
								<img style="background-color: transparent;" src="/_layouts/images/plus.gif" title="Expand/Collapse" data-bind="toggleClick: $data, toggleClass: 'collapsed', containerType: 'doc', classContainer: '.requestInfo-response-doc'"/><span data-bind="text: responseDocSummary.responseTitle"></span>
							</td>
						</tr>
											
						<!-- ko foreach: responseDocSummary.responseDocs-->											
						   
						<tr class="requestInfo-response-doc-item collapsed" data-bind="style: styleTag">
							<td><img data-bind="attr:{ src: $parent.siteUrl + '/_layouts/images/' + docIcon}"></img></td>
							<td class="requestInfo-response-doc-title">							 
								<a title="Click to Download" data-bind="visible: $parent.responseStatus == '7-Closed' || $parent.requestStatus == 'Closed' || $parent.requestStatus == 'Canceled', downloadLink: '../_layouts/download.aspx?SourceUrl=:folder/:fileName'"><span data-bind="text: fileName"></span></a> 
								<span title="Click to Open" data-bind="visible: $parent.responseStatus != '7-Closed' && $parent.requestStatus != 'Closed' && $parent.requestStatus != 'Canceled', html: responseDocOpenInIELink ">								
								<span style="float:right" data-bind="visible: ( documentStatus == 'Open' || documentStatus == 'Marked for Deletion') && ($parent.requestStatus == 'Open' || $parent.requestStatus == 'ReOpened') "><a title="Delete Response Document" href="javascript:void(0)" data-bind="click: $root.ClickDeleteResponseDoc"><span class="ui-icon ui-icon-trash">Delete Response Document</span></a></span>
							</td>
							<td nowrap data-bind="text: title"></td>
							<td nowrap data-bind="text: receiptDate"></td>
							<td nowrap data-bind="text: fileSize"></td>
							<td nowrap>
								<span data-bind="visible: checkedOutBy != ''"><span data-bind="text: checkedOutBy"></span>&nbsp;<img style="background-color: transparent;" src="/_layouts/images/checkin.gif" title="Check In Document"/><a href="javascript:void(0)" title="Check In Document" data-bind="click: $root.ClickCheckInResponseDocument">Check In Document</a></span>
							</td>
							<td nowrap>
								<span data-bind="text: documentStatus"></span>
								<span data-bind="visible: documentStatus == 'Rejected' && ( $parent.requestStatus == 'Open' || $parent.requestStatus == 'ReOpened' ) "><a title="Clear Rejected Status" href="javascript:void(0)" data-bind="click: $root.ClickResendRejectedResponseDocToQA"><span class="ui-icon ui-icon-circle-check">Clear Rejected Status</span></a></span>
							</td>
							<td data-bind="html: rejectReason"></td>
							<td class="requestInfo-response-doc-modified" data-bind="text: modifiedDate"></td>
							<td class="requestInfo-response-doc-modifiedBy" data-bind="text: modifiedBy"></td>
							<td nowrap>
								<a title="Click to Download" data-bind="downloadLink: '../_layouts/download.aspx?SourceUrl=:folder/:fileName'"><span class='ui-icon ui-icon-arrowreturnthick-1-s'>Download Document</span></a> 
								<a title="View Response Document Properties" href="javascript:void(0)" data-bind="click: $root.ClickViewResponseDoc"><span class="ui-icon ui-icon-search">View Response Doc</span></a>
								<a title="Edit Response Document Properties" href="javascript:void(0)" data-bind="visible: $parent.responseStatus != '7-Closed' && $parent.requestStatus != 'Closed' && $parent.requestStatus != 'Canceled' && ( documentStatus == 'Sent to QA' || documentStatus == 'Open' || documentStatus == 'Submitted' ), click: $root.ClickEditResponseDoc"><span class="ui-icon ui-icon-pencil">Edit Response Doc</span></a>
							</td>
						</tr>
					
						<!-- /ko -->
	
					</tbody>
					<tfoot>
						<tr valign="top">
							<th colspan="11" nowrap="nowrap">Total: <span id="tblResponseDocsTotal" data-bind="text: cntResponseDocs()">0</span></th>
						</tr>
					</tfoot>
				</table>
			</fieldset>
		</div>
		
	</div>
</div>


<div id="divRanBulkUpdate" title="Do not delete Used for checking if bulk update ran" style="display:none"></div>

<script id="requestTemplate" type="text/x-jsrender">
	<tr class="sr1-request-item">
		<td class="sr1-request-requestNum"><a href="javascript:void(0);" title='Go to Request Details' onclick='Audit.IAReport.Report.GoToRequest("{{:reqNumber}}", "{{:title}}")'>{{:reqNumber}}</a></td>
		<td class="sr1-request-subject">{{:subject}}</td>
		<td class="sr1-request-sensitivity">{{:sensitivity}}</td>
		<td class="sr1-request-status">{{:status}}</td>
		<td class="sr1-request-internalDueDate" {{:internalDueDateStyle}}>{{:internalDueDate}}</td> 
		<td class="sr1-request-dueDate" {{:dueDateStyle}}>{{:dueDate}}</td>
		<td class="sr1-request-sample">
			{{if sample }}
   			 <span class='ui-icon ui-icon-check'>{{:sample}}</span>
			{{else}}
   			 <span class='ui-icon ui-icon-close'>{{:sample}}</span>
			{{/if}}
		</td>
		<td class="sr1-request-sentEmail">
			{{if sentEmail}}
   			 <span class='ui-icon ui-icon-check'>{{:sentEmail}}</span>
			{{else}}
   			 <span class='ui-icon ui-icon-close'>{{:sentEmail}}</span>
			{{/if}}
		</td>
		<td class="sr1-request-actionOffice">
			<div style='cursor:pointer; white-space:nowrap' title='Click to view' >
				<span class='actionOfficeContainer'>
					<span class='ui-icon ui-icon-search'></span><a href='javascript:void(0)'>View Action Offices</a>
					{{for actionOffices}}
						<div class='sr1-request-actionOffice-item collapsed'>{{:ao}}</div>
					{{/for }}
				</span>
			</div>
		</td>
		<td class="sr1-request-responseCount">{{:responseCount}}</td> 
		<td class="sr1-request-responsesOpenCount">{{:responsesOpenCount}}</td>
		<td class="sr1-request-responseDocCount">{{:responseDocCount}}</td> 
	</tr>
</script>

<script id="responseTemplate" type="text/x-jsrender">
	<tr class="sr2-response-item">
		<td class="sr2-response-requestNum"><a href="javascript:void(0);" title='Go to Request Details' onclick='Audit.IAReport.Report.GoToRequest("{{:reqNumber}}", "{{:title}}")'>{{:reqNumber}}</a></td>
		<td class="sr2-response-sample">{{:sample}}</td>
		<td class="sr2-response-title">{{:title}}</td>
		<td class="sr2-response-internalDueDate">{{:internalDueDate}}</td> 
		<td class="sr2-response-status">{{:status}}</td>
		<td class="sr2-response-ao">{{:ao}}</td>
		<td class="sr2-response-docCount">{{:docCount}}</td> 
		<td class="sr2-response-modified">{{:modified}}</td>
	</tr>
</script>


<div id="divTest"></div>

<link rel="stylesheet" type="text/css" href="../SiteAssets/css/jqueryui/1.11.3/themes/redmond/jquery-ui.min.css"  />
<link rel="stylesheet" type="text/css" href="../SiteAssets/css/tablesorter/style.css"  />
<link rel="stylesheet" type="text/css" href="../SiteAssets/css/Audit_Styles.css"/>
<link rel="stylesheet" type="text/css" href="../SiteAssets/css/Audit_Page_Reports.css"/>

<script type="text/javascript" src="../SiteAssets/js/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="../SiteAssets/js/jqueryui/1.11.3/jquery-ui.min.js"></script>
<script type="text/javascript" src="../SiteAssets/js/jquery.tablesorter.min.js" ></script>
<script type="text/javascript" src="../SiteAssets/js/jsrender.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.2/knockout-min.js"></script>

<script type="text/javascript" src="../SiteAssets/js/Audit_Page_Common.js"></script>
<script type="text/javascript" src="../SiteAssets/js/Audit_Page_KO_DB_IA.js"></script>

