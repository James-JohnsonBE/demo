var Audit = window.Audit || {};
Audit.SPReport = Audit.SPReport || {};

var paramShowSiteActionsToAnyone = GetUrlKeyValue("ShowSiteActions")
if( paramShowSiteActionsToAnyone != true ) //hide it even for owners unless this param is passed into the URL; pass in param if you want to change the page web parts/settings
{
	$("#RibbonContainer-TabRowLeft").hide();
	$(".ms-siteactionsmenu").hide();
}
$(document).ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', ExecuteOrDelayUntilScriptLoaded(InitReport, "sp.js"));

})

function InitReport() 
{    
	Audit.SPReport.Report = new Audit.SPReport.NewReportPage();
	Audit.SPReport.Init();
}

Audit.SPReport.Init = function()
{
	var paramShowSiteActionsToAnyone = GetUrlKeyValue("ShowSiteActions")
	if( paramShowSiteActionsToAnyone != true ) //hide it even for owners unless this param is passed into the URL; pass in param if you want to change the page web parts/settings
	{
		$("#RibbonContainer-TabRowLeft").hide();
		$(".ms-siteactionsmenu").hide();
	}
	setInterval(function() {
	    var divVal = $("#divCounter").text();
	    var count = divVal * 1 - 1;
	    $("#divCounter").text(count);
	    if (count <= 0) {
	       Audit.Common.Utilities.Refresh();
	    }
	}, 1000);
}

Audit.SPReport.NewReportPage = function ()
{				
	var m_bigMap = new Object();
	var m_arrRequests = new Array();
	var m_arrResponses = new Array();
	
	var m_bHasAccessToViewPerms = false;
		
	LoadInfo();
		
	function LoadInfo()
	{		
		var currCtx = new SP.ClientContext.get_current();
		var web = currCtx.get_web();
		
		m_currentUser = web.get_currentUser();
		currCtx.load( m_currentUser ); 

		var requestList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleRequests() );
		var requestQuery = new SP.CamlQuery();	
		requestQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>');
		m_requestItems = requestList.getItems( requestQuery );
		currCtx.load( m_requestItems, 'Include(ID, Title, ReqSubject, ReqStatus, IsSample, InternalDueDate, ActionOffice, Comments, RelatedAudit, ActionItems, EmailSent, ClosedDate, Modified)');

		/*var coverSheetLib = web.get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleCoverSheets() );
		var coverSheetQuery = new SP.CamlQuery();	
		coverSheetQuery.set_viewXml('<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="ReqNum"/></OrderBy></Query></View>');
		m_CoverSheetItems = coverSheetLib.getItems( coverSheetQuery );
		currCtx.load( m_CoverSheetItems, 'Include(ID, Title, ReqNum, ActionOffice, FileLeafRef, FileDirRef)');
*/
		var responseList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleResponses() );
		var responseQuery = new SP.CamlQuery();	
		responseQuery.set_viewXml('<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="ReqNum"/></OrderBy></Query></View>');
		m_responseItems = responseList.getItems( responseQuery );
		currCtx.load( m_responseItems, 'Include(ID, Title, ReqNum, ActionOffice, SampleNumber, ResStatus, Comments, Modified, ClosedDate, ClosedBy)' );

		//make sure to only pull documents (fsobjtype = 0)
		var responseDocsLib = web.get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleResponseDocs() );
		var responseDocsQuery = new SP.CamlQuery();	
		responseDocsQuery.set_viewXml('<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="ReqNum"/><FieldRef Name="ResID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">0</Value></Eq></Where></Query></View>');
		m_ResponseDocsItems = responseDocsLib.getItems( responseDocsQuery );
		currCtx.load( m_ResponseDocsItems, 'Include(ID, FSObjType, Title, ReqNum, ResID, DocumentStatus, RejectReason, ReceiptDate, FileLeafRef, FileDirRef, File_x0020_Size, CheckoutUser, Modified, Editor)');
 	
		currCtx.executeQueryAsync(OnSuccess, OnFailure);	
		function OnSuccess(sender, args)
		{		
			var requestList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleRequests() );
			var requestQuery = new SP.CamlQuery();	
			requestQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>');
			m_requestItemsWithPerms = requestList.getItems( requestQuery );
			currCtx.load( m_requestItemsWithPerms, 'Include(ID, Title, ReqSubject, ReqStatus, IsSample, InternalDueDate, ActionOffice, Comments, RelatedAudit, ActionItems, EmailSent, ClosedDate, Modified, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))');
		
			function OnSuccess2(sender, args)
			{
				m_bHasAccessToViewPerms = true;
				m_requestItems = m_requestItemsWithPerms; 
				$("#divRefresh").show();
				m_fnLoadData();	
			}
			function OnFailure2(sender, args)
			{
				$("#divRefresh").show();
				m_fnLoadData();	
			}
			
			currCtx.executeQueryAsync(OnSuccess2, OnFailure2);
		}		
		function OnFailure(sender, args)
		{
			$("#divRefresh").hide();
			$("#divLoading").hide();

			statusId = SP.UI.Status.addStatus("Request failed: "  + args.get_message() + "\n" + args.get_stackTrace());
   			SP.UI.Status.setStatusPriColor(statusId, 'red');
		}
	}		
	
	function m_fnLoadData()
	{
		LoadRequests();
		LoadResponses();	
		//LoadCoverSheets();
		LoadResponseDocs();
		
		UpdateDDs( m_arrResponses );
		
		$("#tabs").tabs().show();
				
		LoadTabStatusReport( m_arrResponses, "fbody" );		
		//BindHandlersOnLoad();
	}
	
	function OnLoadDisplayTabAndRequest()
	{
		var paramResponseNum = GetUrlKeyValue("ResNum");
		if( paramResponseNum != null && paramResponseNum != "" )
		{
			$("#ddlResponses").val( paramResponseNum ).change();
		}
		
		var paramTabIndex = GetUrlKeyValue("Tab");
		if( paramTabIndex != null && paramTabIndex != "" )
		{
			$("#tabs").tabs("option", "active", paramTabIndex);
		}
	}

		
	function LoadRequests()
	{
		m_bigMap = new Object();
		m_arrRequests = new Array();

		var cnt = 0;				
		var listItemEnumerator = m_requestItems.getEnumerator();
		while(listItemEnumerator.moveNext())
		{
			var oListItem = listItemEnumerator.get_current();
			
			var id = oListItem.get_item('ID');
			var number = oListItem.get_item('Title');
			var status = oListItem.get_item('ReqStatus');
			var sample = oListItem.get_item('IsSample');
			var emailSent = oListItem.get_item('EmailSent');
			//if( !emailSent ) //what if ao was never notified by email and IA wants to skip them??
			//{
			//	continue;
			//}

			var subject = oListItem.get_item('ReqSubject');
			if( subject == null )
				subject = "";
				
			var internalDueDate = oListItem.get_item('InternalDueDate');
			var closedDate = oListItem.get_item('ClosedDate');
			
			internalDueDate != null ? internalDueDate = internalDueDate.format("MM/dd/yyyy") : internalDueDate = "";
			closedDate != null ? closedDate = closedDate.format("MM/dd/yyyy") : closedDate = "";
			
			var arrActionOffice = oListItem.get_item('ActionOffice');
			var actionOffice = "";
			for( var x = 0; x < arrActionOffice.length; x++ )
			{
				actionOffice += "<div>" + arrActionOffice[x].get_lookupValue() + "</div>";
			}	
				
			var comments = oListItem.get_item('Comments');
			var relatedAudit = oListItem.get_item('RelatedAudit');
			var actionItems = oListItem.get_item('ActionItems');
			
			if( comments == null )
				comments = "";
			if( relatedAudit == null )
				relatedAudit = "";	
			if( actionItems == null )
				actionItems = "";	

			var requestObject = new Object();
			requestObject ["ID"] = id;
			requestObject ["number"] = number;
			requestObject ["subject"] = subject;
			requestObject ["status"] = status;
			requestObject ["internalDueDate"] = internalDueDate;
			requestObject ["sample"] = sample;
			requestObject ["responses"] = new Array();
			requestObject ["actionOffice"] = actionOffice;
			requestObject ["comments"] = comments;
			requestObject ["emailSent"] = emailSent;
			requestObject ["closedDate"] = closedDate;											
			requestObject ["relatedAudit"] = relatedAudit;
			requestObject ["actionItems"] = actionItems;
			
			//if logged in user is a site owner, we want to see if the request has special perms so that the site owner only sees a filtered set of requests that have been specifically given special perms.
			//otherwise, if it's a user in the special perms group, this check is skipped and they'll see whatever they have access to
			if( m_bHasAccessToViewPerms )  
			{
				try
				{
					var permissionsToCheck = SP.PermissionKind.viewListItems;
					match1 = Audit.Common.Utilities.CheckSPItemHasGroupPermission(oListItem,  Audit.Common.Utilities.GetGroupNameSpecialPerm1(), permissionsToCheck );
					match2 = Audit.Common.Utilities.CheckSPItemHasGroupPermission(oListItem,  Audit.Common.Utilities.GetGroupNameSpecialPerm2(), permissionsToCheck );
					
					if( !match1 && !match2 )
						continue;
				}catch( err ){}
			}
			
			requestObject ["arrIndex"] = cnt;
			m_arrRequests.push( requestObject );
			
			m_bigMap[ "request-" + number ] = requestObject;
			cnt++;
		}
	}
	
	function LoadResponses()
	{				
		m_arrResponses = new Array();
		
		var cnt = 0;
		var listItemEnumerator = m_responseItems.getEnumerator();
		while(listItemEnumerator.moveNext())
		{
			var oListItem = listItemEnumerator.get_current();
			
			var number = oListItem.get_item('ReqNum');
			if( number != null )
			{
				number = number.get_lookupValue();
				
				var responseObject = new Object();
				responseObject ["request"] = m_bigMap[ "request-" + number ];//GetRequest( number );
				if( !responseObject.request || !responseObject.request.emailSent ) //they should see it if they have access; then there's probably a permissions issue
					continue; 
					
				//Special permissions users should only see responses that have been approved for QA or closed. The permissions should take care of this, but this is an extra safety measure
				responseObject ["resStatus"] = oListItem.get_item('ResStatus');					
				if( responseObject ["resStatus"] != "4-Approved for QA" && responseObject ["resStatus"] != "7-Closed" && responseObject ["resStatus"] != "6-Reposted After Rejection" )  
					continue;
				
				responseObject ["actionOffice"] = oListItem.get_item('ActionOffice');						
				if( responseObject ["actionOffice"] == null )
					responseObject ["actionOffice"] = "";
				else
					responseObject ["actionOffice"] = responseObject ["actionOffice"].get_lookupValue();
				if( responseObject ["actionOffice"] == "" )
					continue;
									
				responseObject ["ID"] = oListItem.get_item('ID');
				responseObject ["number"] = number;
			
				var title = oListItem.get_item('Title');
				responseObject ["title"] = title;

				var modified = oListItem.get_item('Modified');
				modified != null ? modified = modified.format("MM/dd/yyyy hh:mm tt") : modified= "";
				responseObject ["modified"] = modified;						

				var closedDate = oListItem.get_item('ClosedDate');
				closedDate != null ? closedDate = closedDate.format("MM/dd/yyyy") : closedDate = "";
				responseObject ["closedDate"] = closedDate;						

				var comments = oListItem.get_item('Comments');				
				if( comments == null )
					comments = "";
				responseObject ["comments"] = comments;
				
				responseObject ["closedBy"] = Audit.Common.Utilities.GetFriendlyDisplayName( oListItem, "ClosedBy");

				responseObject ["sample"] = oListItem.get_item('SampleNumber');
				if( responseObject ["sample"] == null )
					responseObject ["sample"] = "";
									
				responseObject["coversheets"] = new Array();
				responseObject["responseDocs"] = new Array();
				
				responseObject ["arrIndex"] = cnt;
				m_arrResponses.push( responseObject );
				
				m_bigMap[ "response-" + title ] = responseObject;
				cnt++;
			}
		}
	}
	
	/*function LoadCoverSheets()
	{				
		var listItemEnumerator = m_CoverSheetItems.getEnumerator();
		while(listItemEnumerator.moveNext())
		{
			var oListItem = listItemEnumerator.get_current();
			
			var requestNumber = oListItem.get_item('ReqNum');
			if( requestNumber != null )
			{
				requestNumber = requestNumber.get_lookupValue();

				for( var x = 0; x < m_arrResponses.length; x++ ) //do this for all responses
				{
					if( m_arrResponses[x]["number"] == requestNumber)
					{					
						var coversheetObject = new Object();
						
						var arrActionOffice = oListItem.get_item('ActionOffice');
						var actionOffice = new Array();
						if ( arrActionOffice.length > 0 )
						{
							for( var y = 0; y < arrActionOffice.length; y++ )
							{
								actionOffice.push( arrActionOffice[y].get_lookupValue() );
							}
						}
						coversheetObject ["actionOffice"] = actionOffice;
							
						coversheetObject ["ID"] = oListItem.get_item('ID');
						coversheetObject ["actionOffice"] = actionOffice;						
						coversheetObject ["title"] = oListItem.get_item('FileLeafRef');
						coversheetObject ["folder"] = oListItem.get_item('FileDirRef');
						
						m_arrResponses[x]["coversheets"].push( coversheetObject );
						
					}
				}
			}
		}
	}*/

	//To do need checked out docs?
	function LoadResponseDocs()
	{				
		//m_arrResponseDocsCheckedOut = new Array();
		
		var listItemEnumerator = m_ResponseDocsItems.getEnumerator();
		while(listItemEnumerator.moveNext())
		{
			var oListItem = listItemEnumerator.get_current();
			if( oListItem.get_item('DocumentStatus') == "Open" || oListItem.get_item('DocumentStatus') == "Marked for Deletion" || oListItem.get_item('DocumentStatus') == "Submitted") //shouldn't see any documents that have been uploaded by AO but not sent to them by IA
				continue;
		
			responseDocID = oListItem.get_item('ID');
			
			var requestNumber = oListItem.get_item('ReqNum');
			if( requestNumber != null )
				requestNumber = requestNumber.get_lookupValue();
				
			var responseID = oListItem.get_item('ResID');
			if( responseID != null )
				responseID = responseID.get_lookupValue();				
				
			if( requestNumber == null || responseID == null )
				continue;

			try
			{
				var bigMapItem = m_bigMap[ "response-" + responseID ];
				var indexOfArrResponses = bigMapItem.arrIndex;
				var oResponse = m_arrResponses [ indexOfArrResponses ];
				if( oResponse )
				{
					var responseDocObject = new Object();
					responseDocObject ["ID"] = oListItem.get_item('ID');
					responseDocObject ["title"] = oListItem.get_item('FileLeafRef');
					responseDocObject ["folder"] = oListItem.get_item('FileDirRef');
					responseDocObject ["documentStatus"] = oListItem.get_item('DocumentStatus');	 
											
					responseDocObject ["rejectReason"] = oListItem.get_item('RejectReason');	 
					if( responseDocObject ["rejectReason"] == null )
						responseDocObject ["rejectReason"] = "";
					
					var fileSize = oListItem.get_item('File_x0020_Size');
					fileSize = Audit.Common.Utilities.GetFriendlyFileSize( fileSize );												
					responseDocObject ["fileSize"] = fileSize;
					
					var receiptDate = "";
					if( oListItem.get_item('ReceiptDate') != null && oListItem.get_item('ReceiptDate') != "")
						receiptDate = oListItem.get_item('ReceiptDate').format("MM/dd/yyyy");
					responseDocObject ["receiptDate"] = receiptDate;						
					
					var modifiedDate = "";
					if( oListItem.get_item('Modified') != null && oListItem.get_item('Modified') != "")
						modifiedDate = oListItem.get_item('Modified').format("MM/dd/yyyy hh:mm tt");
					responseDocObject ["modifiedDate"] = modifiedDate;						
					
					responseDocObject ["modifiedBy"] = Audit.Common.Utilities.GetFriendlyDisplayName( oListItem, "Editor");
					responseDocObject ["checkedOutBy"] = Audit.Common.Utilities.GetFriendlyDisplayName( oListItem, "CheckoutUser");							
						
					oResponse["responseDocs"].push( responseDocObject );
					//bigMapItem["responseDocs"].push( responseDocObject );
				}
			}catch(err){}
		}
	}
	
	function UpdateDDs( arr )
	{
		var arrResponses = new Array();
		var arrLength = arr.length;
		//for( var x = 0; x < arrLength; x++ )
		while ( arrLength-- ) 
		{
			var oResponse = arr[ arrLength ];
						
			arrResponses.push( oResponse.title );				
		}
		
		Audit.Common.Utilities.AddOptions( arrResponses, "#ddlResponses", false, true );
	}
		
	function LoadTabStatusReport(arr, fbody)
	{		
		var body = $('#' + fbody);
		body.empty();
		body.html('');
		
		if( arr == null )
			return;


		//hide the row on load - the filter function will show it
		var myTmpl = $.templates('<tr class="sr-response-item" style="display:none"><td class="sr-response-requestNum">{{:reqNumber}}</td><td class="sr-response-requestStatus">{{:requestStatus}}</td><td class="sr-response-internalDueDate">{{:internalDueDate}}</td><td class="sr-response-sample">{{:sample}}</td><td class="sr-response-title">{{:title}}</td><td class="sr-response-status">{{:status}}</td><td class="sr-response-docCount">{{:docCount}}</td><td class="sr-response-modified">{{:modified}}</td></tr>');
		var responseArr = new Array();
			
		//var output = "";
		var oRequestNumbers = new Object();
		var oResponseRequestStatus = new Object();
		var oResponseInternalDueDate = new Object();
		var oResponseTitle = new Object();
		var oResponseSample = new Object();
		var oResponseStatus = new Object();

		var arrResponseRequestID = new Array();
		var arrResponseRequestStatus = new Array();
		var arrResponseInternalDueDate = new Array();
		var arrResponseTitle = new Array();
		var arrResponseSample = new Array();
		var arrResponseStatus = new Array();

		
		//var r = new Array(), j = -1;
		var arrLength = arr.length;
		while ( arrLength-- ) 
		//for( var x = 0; x < arrLength; x++ )
		{
			var oResponse = arr[ arrLength ];
			
			var responseTitle = oResponse.title;
			var requestStatus = oResponse.request.status;
			var responseStatus = oResponse.resStatus;

			var link = "<a href=\"javascript:void(0);\" title='Go to Response Details' onclick='Audit.SPReport.Report.GoToResponse(\"" + responseTitle  + "\"," + false + ")'>" + responseTitle + "</a>";


			var aResponse = { 
				reqNumber: oResponse.request.number, 
				requestStatus: requestStatus, 
				internalDueDate: oResponse.request.internalDueDate, 
				sample: oResponse.sample, 
				title: link, 
				status: responseStatus, 
				docCount: oResponse.responseDocs.length, 
				modified: oResponse.modified};
			responseArr.push( aResponse );


			if( !oRequestNumbers.hasOwnProperty( oResponse.request.number ) )
			{
				oRequestNumbers[ oResponse.request.number ] = 1;
				arrResponseRequestID.push( oResponse.request.number );
			}
			if( !oResponseRequestStatus.hasOwnProperty( requestStatus ) )
			{
				oResponseRequestStatus[ requestStatus ] = 1;
				arrResponseRequestStatus.push( requestStatus );
			}
			if( !oResponseInternalDueDate.hasOwnProperty( oResponse.request.internalDueDate) )
			{
				oResponseInternalDueDate[ oResponse.request.internalDueDate] = 1;
				arrResponseInternalDueDate.push( oResponse.request.internalDueDate);
			}
			if( !oResponseTitle.hasOwnProperty( responseTitle ) )
			{
				oResponseTitle[ responseTitle ] = 1;
				arrResponseTitle.push( responseTitle );
			}
			if( !oResponseSample.hasOwnProperty( oResponse.sample.toString()) )
			{
				oResponseSample[ oResponse.sample.toString()] = 1;
				arrResponseSample.push( oResponse.sample.toString());
			}
			if( !oResponseStatus.hasOwnProperty( responseStatus ) )
			{
				oResponseStatus[ responseStatus ] = 1;
				arrResponseStatus.push( responseStatus );
			}

			
			/*output += '<tr class="sr-response-item">' + 
				'<td class="sr-response-requestNum">' + oResponse.request.number + '</td>' +
				'<td class="sr-response-requestStatus">' + oResponse.request.status + '</td>' +
				'<td class="sr-response-internalDueDate">' + oResponse.request.internalDueDate + '</td>' +
				'<td class="sr-response-sample">' + oResponse.sample + '</td>' +
				'<td class="sr-response-title">' + link + '</td>' +
				'<td class="sr-response-status">' + oResponse.resStatus + '</td>' +
				'<td class="sr-response-docCount">' + oResponse.responseDocs.length + '</td>' +
				'<td class="sr-response-modified" nowrap>' + oResponse.modified + '</td>' +
			'</tr>';				
			*/

			/*r[++j] = '<tr class="sr-response-item">';
			r[++j] = '<td class="sr-response-requestNum">';
			r[++j] = oResponse.request.number;
			r[++j] = '</td><td class="sr-response-requestStatus">';
			r[++j] = oResponse.request.status;
			r[++j] = '</td><td class="sr-response-internalDueDate">';
			r[++j] = oResponse.request.internalDueDate;
			r[++j] = '</td><td class="sr-response-sample">';
			r[++j] = oResponse.sample;
			r[++j] = '</td><td class="sr-response-title">';
			r[++j] = link;
			r[++j] = '</td><td class="sr-response-status">';
			r[++j] = oResponse.resStatus;
			r[++j] = '</td><td class="sr-response-docCount">';
			r[++j] = oResponse.responseDocs.length;
			r[++j] = '</td><td class="sr-response-modified" nowrap>';
			r[++j] = oResponse.modified;
			r[++j] = '</td></tr>';*/
		}
				
		//body.append( r.join('') );
		
		var html = myTmpl.render( responseArr );
		body.html( html );

		$("#spanResponsesTotal").text( arr.length );
		$("#spanResponsesDisplayedTotal").text( arr.length );

		if( arr.length == 0 )
		{
			$("#tblStatusReportResponses").hide();
			$("#lblStatusReportResponsesMsg").show();
			$("#divButtons").hide();
		}
		
		//LoadDDOptionsTbl();
		setTimeout( function()
		{
			Audit.Common.Utilities.OnLoadDisplayTimeStamp();

			Audit.Common.Utilities.AddOptions( arrResponseRequestID, "#ddlResponseRequestID", false);
			Audit.Common.Utilities.AddOptions( arrResponseRequestStatus, "#ddlResponseRequestStatus", false);
			Audit.Common.Utilities.AddOptions( arrResponseInternalDueDate, "#ddlResponseRequestInternalDueDate", false);
			Audit.Common.Utilities.AddOptions( arrResponseTitle, "#ddlResponseName", false, true);
			Audit.Common.Utilities.AddOptions( arrResponseSample, "#ddlResponseSampleNum", false);
			Audit.Common.Utilities.AddOptions( arrResponseStatus, "#ddlResponseStatus", false);

			$(".rowFilters").show();
			
			$(".sr-response-item").show();

			BindTableSorter( arrLength, "tblStatusReportResponses");
	
			BindHandlersOnLoad();
	
			
			OnLoadDisplayTabAndRequest();
		}, 100 );
	}
	
	function LoadResponseInfo( responseNum )
	{	
		ClearResponseInfo();
	
		if( responseNum == "" )
			return;
			
		var oResponse = null;
		/*for( var x = 0; x < m_arrResponses.length; x ++ )
		{
			if( m_arrResponses[x].title == responseNum )
			{
				oResponse = m_arrResponses[x];
				break;
			}			
		}*/
		try
		{
			var bigMapItem = m_bigMap[ "response-" + responseNum ];
			var indexOfArrResponses = bigMapItem.arrIndex;
			oResponse = m_arrResponses [ indexOfArrResponses ];
		}catch(err){}
		
		if( oResponse == null )
			return;

		$("#divResponseInfo").show();
		$("#divCoverSheets").show();
		$("#divResponseDocs").show();

		LoadTabResponseInfo( oResponse );
		LoadTabResponseInfoCoverSheets( oResponse );
		LoadTabResponseInfoResponseDocs( oResponse );
	}
	
	function ClearResponseInfo()
	{		
		$("#requestInfoNum").text( "" );
		$("#requestInfoSub").text( "" );
		$("#requestInfoInternalDueDate").text( "" );
		$("#requestInfoStatus").text( "" );
		$("#requestInfoSample").text( "" );
		$("#requestInfoRelatedAudit").html( "" );
		$("#requestInfoActionItems").html( "" );

		$("#responseInfoName").text( "" );
		$("#responseInfoSampleNum").text( "" );
		$("#responseInfoAO").text( "" );
		$("#responseInfoStatus").text( "" );
		$("#responseInfoComments").text( "" );
		
		$("#divResponseInfo").hide();
		$("#divEmptyCoversheetsMsg").hide();
		$("#divCoverSheets").hide();
		$("#divResponseDocs").hide();

		$("#tblCoverSheets").hide();
		$("#tblResponseDocs").hide();
		
		$("#tblCoverSheetsTotal").text( "0" );
		$("#tblResponsesTotal").text( "0" );
		
		$("#tblCoverSheets tbody").empty();
		$("#tblResponseDocs tbody").empty();
	}
	
	function LoadTabResponseInfo( oResponse )
	{
		$("#requestInfoNum").text( oResponse.request.number );
		$("#requestInfoSub").text( oResponse.request.subject );
		$("#requestInfoInternalDueDate").text( oResponse.request.internalDueDate );
		
		if( oResponse.request.status == "Closed" )
		{
			$("#requestInfoStatus").html( "<span style='color:red'>" + oResponse.request.status + " on " + oResponse.request.closedDate + "</span>");	
		}
		else if( oResponse.request.status == "Canceled" )
		{
			$("#requestInfoStatus").html( "<span style='color:red'>" + oResponse.request.status + "</span>");	
		}
		else
			$("#requestInfoStatus").html( "<span style='color:green'>" + oResponse.request.status + "</span>");	

		$("#requestInfoSample").html( Audit.Common.Utilities.GetTrueFalseIcon( oResponse.request.sample ) );		
		$("#requestInfoRelatedAudit").text( oResponse.request.relatedAudit );
		$("#requestInfoActionItems").html( oResponse.request.actionItems );

		var status = oResponse.resStatus;
		if( oResponse.resStatus == "7-Closed" )
			status = '<span style="color:red">' + status + " on " + oResponse.closedDate + " by " + oResponse.closedBy + '</span>';
		else
			status = '<span style="color:green">' + status + '</span>';

		$("#responseInfoName").text( oResponse.title );
		$("#responseInfoSampleNum").text( oResponse.sample );
		$("#responseInfoAO").text( oResponse.actionOffice );
		$("#responseInfoStatus").html( status );
		$("#responseInfoComments").html( oResponse.comments );	
	}
		
	function LoadTabResponseInfoCoverSheets( oResponse )
	{
		var currCtx = new SP.ClientContext.get_current();
		var web = currCtx.get_web();

		var coverSheetLib = web.get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleCoverSheets() );
		var coverSheetQuery = new SP.CamlQuery();	
		coverSheetQuery.set_viewXml('<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="ReqNum"/><Value Type="Text">' + oResponse.request.number + '</Value></Eq></Where></Query></View>');
		m_subsetCoverSheetItems = coverSheetLib.getItems( coverSheetQuery );
		currCtx.load( m_subsetCoverSheetItems, 'Include(ID, Title, ReqNum, ActionOffice, FileLeafRef, FileDirRef)');

		var data = { oResponse: oResponse };		
		function OnSuccess(sender, args)
		{	
			var cnt = 0;
			var sCoverSheets = "";
			var listItemEnumerator = m_subsetCoverSheetItems.getEnumerator();
			while(listItemEnumerator.moveNext())
			{
				var oListItem = listItemEnumerator.get_current();
				
				if( oListItem.get_item("ActionOffice") != null )
				{
					var arrActionOffice = oListItem.get_item('ActionOffice');
					if ( arrActionOffice.length > 0 )
					{
						for( var y = 0; y < arrActionOffice.length; y++ )
						{
							var curActionOffice = arrActionOffice[y].get_lookupValue();
							
							if( curActionOffice == this.oResponse.actionOffice )
							{
								var csFolder = oListItem.get_item('FileDirRef');
								var csTitle = oListItem.get_item('FileLeafRef');
								
								//var link = "<a href='../_layouts/download.aspx?SourceUrl=" + csFolder + "/" + csTitle + "'>" + csTitle  + "</a>";
								var link = "<a href='javascript:void(0)' onclick='STSNavigate(\"../_layouts/download.aspx?SourceUrl=" + csFolder + "/" + csTitle + "\")'>" + csTitle + "</a>";

								sCoverSheets += '<tr class="coversheet-item"><td class="coversheet-title" title="Click to Download">' + link + '</td></tr>';
								cnt++;
								
								break;
							}
						}
					}					
				}
			}
			
			$("#tblCoverSheets tbody").append( sCoverSheets );
			if( cnt > 0 )
			{
				$("#tblCoverSheetsTotal").text( cnt );
				$("#tblCoverSheets").show();	
				$("#divEmptyCoversheetsMsg").hide();
			}
			else
			{
				$("#tblCoverSheets").hide();	
				$("#divEmptyCoversheetsMsg").show();
			}
		
		}
		function OnFailure(sender, args)
		{
			$("#tblCoverSheets").hide();	
			$("#divEmptyCoversheetsMsg").show();
		}
	    currCtx.executeQueryAsync(Function.createDelegate(data, OnSuccess), Function.createDelegate(data, OnFailure));

	/*	var cnt = 0;
		var sCoverSheets = "";
		for( var y = 0; y < oResponse.coversheets.length; y++ )
		{
			var oCoversheet = oResponse.coversheets[y];
			
			for( var x = 0; x < oCoversheet.actionOffice.length; x++ )
			{
				if( oCoversheet.actionOffice[x] == oResponse.actionOffice )
				{
					//var link = "<a href='../_layouts/download.aspx?SourceUrl=" + oCoversheet.folder + "/" + oCoversheet.title + "'>" + oCoversheet.title + "</a>";
					var link = "<a href='javascript:void(0)' onclick='STSNavigate(\"../_layouts/download.aspx?SourceUrl=" + oCoversheet.folder + "/" + oCoversheet.title + "\")'>" + oCoversheet.title + "</a>";

					sCoverSheets += '<tr class="coversheet-item"><td class="coversheet-title" title="Click to Download">' + link + '</td></tr>';
					cnt++;
					break;
				}
			}
		}
		$("#tblCoverSheets tbody").append( sCoverSheets );
		if( cnt > 0 )
		{
			$("#tblCoverSheetsTotal").text( cnt );
			$("#tblCoverSheets").show();	
			$("#divEmptyCoversheetsMsg").hide();
		}
		else
		{
			$("#tblCoverSheets").hide();	
			$("#divEmptyCoversheetsMsg").show();
		}*/
	}
	
	function LoadTabResponseInfoResponseDocs( oResponse )
	{	
		if( (oResponse == null || oResponse.responseDocs.length == 0) ) //an open response is selected and there are no documents
		{
			return;
		}
			
		var currCtx = new SP.ClientContext.get_current();
		var web = currCtx.get_web();
		
		for( var z = 0; z < oResponse.responseDocs.length; z++ )
		{
			var oResponseDoc = oResponse.responseDocs[z];
			
			//this loads on execute
			oResponseDoc ["docIcon"] =  web.mapToIcon( oResponseDoc.title, '', SP.Utilities.IconSize.Size16);// Audit.Common.Utilities.GetSiteUrl() + "/" + _spPageContextInfo.layoutsUrl + "/images/" + docIcon;
		}
		
		function OnSuccess(sender, args)
		{		
			RenderResponses( oResponse );	
		}		
		function OnFailure(sender, args)
		{
			statusId = SP.UI.Status.addStatus("Request failed: "  + args.get_message() + "\n" + args.get_stackTrace());
   			SP.UI.Status.setStatusPriColor(statusId, 'red');
		}
		currCtx.executeQueryAsync(OnSuccess, OnFailure);	
		
		function RenderResponses( oResponse )
		{
			$("#divEmptyResponseDocsMsg").hide();
			$("#tblResponseDocsTotal").text( 0 );
			
			if( oResponse == null || oResponse.responseDocs == null)
				return;

			var arrResponseSummary = new Array();
			for( var z = 0; z < oResponse.responseDocs.length; z++ )
			{
				var oResponseDoc = oResponse.responseDocs[z];
				
				var bFound = false;
				for( var b = 0; b < arrResponseSummary.length; b++ )
				{
					if( arrResponseSummary[b].responseTitle == oResponse.title )
					{
						bFound = true;
						arrResponseSummary[b].responseDocs.push( oResponseDoc );
						break;
					}
				}
				if( !bFound )
				{
					var oObject = new Object();
					
					var arrResponseDocs = new Array();
					arrResponseDocs.push( oResponseDoc );
					
					oObject["responseTitle"] = oResponse.title;
					oObject["responseDocs"] = arrResponseDocs;
					oObject["response"] = oResponse;
					
					arrResponseSummary.push( oObject );
				}
			}
				
						
			var sReponseDocs = "";
			var rowCount = 0;
			for( var z = 0; z < arrResponseSummary.length; z++ )
			{
				var oResponseSummary = arrResponseSummary[z];

				sReponseDocs += '<tr class="requestInfo-response-doc"><td colspan="10"><img style="background-color: transparent;" src="/_layouts/images/minus.gif" title="Expand/Collapse"/>' + oResponseSummary.responseTitle + '</td></tr>';

				for( var p = 0; p < oResponseSummary.responseDocs.length; p++ )
				{					
					var oResponseDoc = oResponseSummary.responseDocs[p];
		
					var docIcon = "<img src= '" + Audit.Common.Utilities.GetSiteUrl() + "/_layouts/images/" + oResponseDoc.docIcon.get_value() + "'></img>";
					//var link = "<a href='../_layouts/download.aspx?SourceUrl=" + oResponseDoc.folder + "/" + oResponseDoc.title + "'>" + oResponseDoc.title + "</a>";
					var link = "<a href='javascript:void(0)' onclick='STSNavigate(\"../_layouts/download.aspx?SourceUrl=" + oResponseDoc.folder + "/" + oResponseDoc.title + "\")'>" + oResponseDoc.title + "</a>";
					
					var styleTag = Audit.Common.Utilities.GetResponseDocStyleTag(oResponseDoc.documentStatus);

					sReponseDocs += '<tr class="requestInfo-response-doc-item" ' + styleTag + '>' + 
						'<td>' + docIcon + '</td>' +
						'<td class="requestInfo-response-doc-title" title="Click to Download">' + link  + '</td>' +
						'<td nowrap>' + oResponseDoc.receiptDate + '</td>' +
						'<td nowrap>' + oResponseDoc.fileSize + '</td>' +
						'<td nowrap>' + oResponseDoc.checkedOutBy + '</td>' +
						'<td nowrap>' + oResponseDoc.documentStatus + '</td>' +
						'<td nowrap>' + oResponseDoc.rejectReason + '</td>' +
						'<td class="requestInfo-response-doc-modified">' + oResponseDoc.modifiedDate + '</td>' +
						'<td class="requestInfo-response-doc-modifiedBy">' + oResponseDoc.modifiedBy + '</td>' +
					'</tr>';
					rowCount++;
				}
			}
					
			$("#tblResponseDocs tbody").append( sReponseDocs );
			if( rowCount > 0 )
			{
				$("#tblResponseDocsTotal").text( rowCount );
				$("#tblResponseDocs ").show();
			}
			if( rowCount == 0 )
			{
				$("#divEmptyResponseDocsMsg").show();
			}
			else
			{
				$("#divEmptyResponseDocsMsg").hide();
			}
			
			Audit.Common.Utilities.BindHandlerResponseDoc();
		}
	}				
				
	/*function LoadDDOptionsTbl()
	{					
		var arrResponseRequestID = new Array();
		var arrResponseRequestStatus = new Array();
		var arrResponseInternalDueDate = new Array();
		var arrResponseTitle = new Array();
		var arrResponseSample = new Array();
		var arrResponseStatus = new Array();

		var eacher = $(".sr-response-requestNum");
		eacher.each(function()
		{
			var val = $(this).text();
			if( !Audit.Common.Utilities.ExistsInArr( arrResponseRequestID, val ))
				arrResponseRequestID.push(val);
		});
		
		var eacher = $(".sr-response-requestStatus");
		eacher.each(function()
		{
			var val = $(this).text();
			if( !Audit.Common.Utilities.ExistsInArr( arrResponseRequestStatus, val ))
				arrResponseRequestStatus.push(val);
		});		
		
		var eacher = $(".sr-response-internalDueDate");
		eacher.each(function()
		{
			var val = $(this).text();
			if( !Audit.Common.Utilities.ExistsInArr( arrResponseInternalDueDate , val ))
				arrResponseInternalDueDate.push(val);
		});
		
		var eacher = $(".sr-response-title");
		eacher.each(function()
		{
			var val = $(this).text();
			//if( !Audit.Common.Utilities.ExistsInArr( arrResponseTitle , val ))
			arrResponseTitle.push(val);
		});
		
		var eacher = $(".sr-response-sample");
		eacher.each(function()
		{
			var val = $(this).text();
			if( !Audit.Common.Utilities.ExistsInArr( arrResponseSample , val ))
				arrResponseSample.push(val);
		});
		
		var eacher = $(".sr-response-status");
		eacher.each(function()
		{
			var val = $(this).text();
			if( !Audit.Common.Utilities.ExistsInArr( arrResponseStatus , val ))
				arrResponseStatus.push(val);
		});
		
		Audit.Common.Utilities.AddOptions( arrResponseRequestID, "#ddlResponseRequestID", false);
		Audit.Common.Utilities.AddOptions( arrResponseRequestStatus, "#ddlResponseRequestStatus", false);
		Audit.Common.Utilities.AddOptions( arrResponseInternalDueDate, "#ddlResponseRequestInternalDueDate", false);
		Audit.Common.Utilities.AddOptions( arrResponseTitle, "#ddlResponseName", false, true);
		Audit.Common.Utilities.AddOptions( arrResponseSample, "#ddlResponseSampleNum", false);
		Audit.Common.Utilities.AddOptions( arrResponseStatus, "#ddlResponseStatus", false);
	}*/

	function m_fnRefresh()
	{
		var curPath = location.pathname;
		
		var tabIndex = $("#tabs").tabs('option', 'active');
		curPath += "?Tab=" + tabIndex;

		if( tabIndex == 1 )
		{
			var responseNum = $("#ddlResponses").val();
			if( responseNum != "" )
				curPath += "&ResNum=" + responseNum;
		}
			
		location.href = curPath;
	}

	function m_fnGoToResponse( responseTitle )
	{
		$("#ddlResponses").val( responseTitle ).change();

		$('#tabs').tabs({ active: 1 });
	}

	function BindTableSorter( rowCount, tableName )
	{
		if( rowCount > 0 )
		{
			setTimeout( function()
			{
				$( "#" + tableName ).tablesorter(
				{
					//sortList: [[0,0],[2,0],[4,0]],
					sortList: [[7,1]],
					selectorHeaders: '.sorter-true'
				}); 
			}, 200 );
		}
	}
				
	function BindHandlersOnLoad()
	{
		$("#btnViewAll").click(function()
		{
			m_fnClearFilterResponses();
		});

		$("#ddlResponses").change(function()
		{
			m_curResponseSelectedIsEditableByAO = true;	
			LoadResponseInfo( $(this).val() );		
			
		});		
				
		$( "#ddlResponseRequestID, #ddlResponseRequestStatus, #ddlResponseRequestInternalDueDate, #ddlResponseName, #ddlResponseSampleNum, #ddlResponseStatus" ).change(function()
		{
			document.body.style.cursor = 'wait';
			setTimeout( function(){ m_fnFilterResponses()}, 200 );
		});
		
		BindPrintButton("#btnPrint1", "#divStatusReportRespones", "Special Permissions Response Status Report");
		//////////Note: for the export to work, make sure this is added to the html: <iframe id="CsvExpFrame" style="display: none"></iframe>
		BindExportButton(".export1", "SPResponseStatusReport_", "tblStatusReportResponses");
	}
	function BindPrintButton(btnPrint, divTbl, pageTitle)
	{
		$( btnPrint ).on("click", function(){ Audit.Common.Utilities.PrintStatusReport( pageTitle, divTbl); });
	}
	function BindExportButton(btnExport, fileNamePrefix, tbl)
	{
		$(btnExport).on('click', function (event) 
		{
			var curDate = new Date().format("yyyyMMdd_hhmmtt");
			Audit.Common.Utilities.ExportToCsv( fileNamePrefix + curDate, tbl );
	    });
	}

	function m_fnClearFilterResponses()
	{
		document.body.style.cursor = 'wait';
		$("#ddlResponseRequestID").val("");
		$("#ddlResponseRequestStatus").val("");
		$("#ddlResponseRequestInternalDueDate").val("");
		$("#ddlResponseName").val("");
		$("#ddlResponseSampleNum").val("");
		$("#ddlResponseStatus").val("");
		
		setTimeout( function(){ m_fnFilterResponses()}, 200 );
	}
	
	//Captures the values from all of the drop downs and uses them to filter the rows
	function m_fnFilterResponses() 
	{		
		var requestID = $("#ddlResponseRequestID").val();
		var requestStatus = $("#ddlResponseRequestStatus").val();
		var dueDate = $("#ddlResponseRequestInternalDueDate").val();
		var responseName = $("#ddlResponseName").val();
		var sampleNum = $("#ddlResponseSampleNum").val();
		var responseStatus = $("#ddlResponseStatus").val();
			
		//each row in the data form web part is marked with this class; it iterates through each to find the containing class to see if it matches
		//the value that has been selected in the drop down
		var cntVisible = 0;
		var cntRows = 0;
		
		var eacher = $(".sr-response-item");
		eacher.each(function() 
		{			
			cntRows ++;
			var hide = false;
			
			if( !hide && requestID != "" && $.trim( $(this).find(".sr-response-requestNum").text() ) != requestID )
			{
				hide = true;
			}		
			if( !hide && requestStatus != "" && $.trim( $(this).find(".sr-response-requestStatus").text() ) != requestStatus )
			{
				hide = true;
			}		
			if( !hide && dueDate != "" && $.trim( $(this).find(".sr-response-internalDueDate").text() ) != dueDate )
			{
				hide = true;
			}	
			if( !hide && responseName!= "" && $.trim( $(this).find(".sr-response-title").text() ) != responseName)
			{
				hide = true;				
			}		
			if( !hide && sampleNum != "" && $.trim( $(this).find(".sr-response-sample").text() ) != sampleNum )
			{
				hide = true;				
			}		
			if( !hide && responseStatus != "" && $.trim( $(this).find(".sr-response-status").text() ) != responseStatus )
			{
				hide = true;				
			}		

			if( hide )
				$(this).hide();
			else
			{
				$(this).show();
				cntVisible++;
			}
		});
		
		//Get the number of rows currently displayed and output that number to the user
	    var numOfVisibleRows = cntVisible;//$('.sr-response-item:visible').length;
	    var numRows = cntRows;//$('.sr-response-item').length;

		$("#spanResponsesDisplayedTotal").text( numOfVisibleRows );   		

		if( numOfVisibleRows == numRows )
			$("#btnViewAll").hide();
		else
			$("#btnViewAll").show();

		document.body.style.cursor = 'default';
	}	
		
	var publicMembers = 
	{
		Load: m_fnLoadData,
		GoToResponse: function(responseTitle){  m_fnGoToResponse(responseTitle); },
		Refresh: m_fnRefresh
	}
	
	return publicMembers;
}

	
	
	
	
