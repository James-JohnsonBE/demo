var Audit = window.Audit || {};
Audit.QAReport = Audit.QAReport || {};

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
	Audit.QAReport.Report = new Audit.QAReport.NewReportPage();
	Audit.QAReport.Init();
}

Audit.QAReport.Init = function()
{
	var paramShowSiteActionsToAnyone = GetUrlKeyValue("ShowSiteActions")
	if( paramShowSiteActionsToAnyone != true ) //hide it even for owners unless this param is passed into the URL; pass in param if you want to change the page web parts/settings
	{
		$("#RibbonContainer-TabRowLeft").hide();
		$(".ms-siteactionsmenu").hide();
	}
	/*setInterval(function() {
	    var divVal = $("#divCounter").text();
	    var count = divVal * 1 - 1;
	    $("#divCounter").text(count);
	    if (count <= 0) {
	       Audit.Common.Utilities.Refresh();
	    }
	}, 1000);*/
	
	function SetTimer()
	{
		var intervalRefreshID = setInterval(function() {
		    var divVal = $("#divCounter").text();
		    var count = divVal * 1 - 1;
		    $("#divCounter").text(count);
			if (count <= 0) 
			{
				if( !Audit.QAReport.Report.IsTransactionExecuting() )
					Audit.Common.Utilities.Refresh();
				else
				{
					clearInterval( intervalRefreshID );
					$("#divCounter").text("1200");
					SetTimer();
				}
		    }
		}, 1000);
	}
	
	SetTimer();

}

Audit.QAReport.NewReportPage = function ()
{				
	var m_arrRequests = new Array();
	var m_arrResponses = new Array();
	
	var m_bigMap = new Object();
	
	var m_IA_SPGroupName = null;
	var m_itemID = null;
	var m_RejectReason = "";

	var m_bIsTransactionExecuting = false;	
	
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

		var responseList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleResponses() );
		var responseQuery = new SP.CamlQuery();	
		responseQuery.set_viewXml('<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="ReqNum"/></OrderBy></Query></View>');
		m_responseItems = responseList.getItems( responseQuery );
		currCtx.load( m_responseItems, 'Include(ID, Title, ReqNum, ActionOffice, SampleNumber, ResStatus, Comments, Modified, ClosedDate, ClosedBy)' );

		//make sure to only pull documents (fsobjtype = 0)
		var responseDocsLib = web.get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleResponseDocs() );
		var responseDocsQuery = new SP.CamlQuery();	
		responseDocsQuery.set_viewXml('<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="ContentType"/><Value Type="Text">Document</Value></Eq></Where></Query></View>');
		m_ResponseDocsItems = responseDocsLib.getItems( responseDocsQuery );
		currCtx.load( m_ResponseDocsItems, 'Include(ID, Title, ReqNum, ResID, DocumentStatus, RejectReason, ReceiptDate, FileLeafRef, FileDirRef, File_x0020_Size, Modified, Editor)');

	 	memberGroup = web.get_associatedMemberGroup();
	 	currCtx.load( memberGroup );

		currCtx.executeQueryAsync(OnSuccess, OnFailure);	
		function OnSuccess(sender, args)
		{				
			$("#divRefresh").show();
			m_fnLoadData();	
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
		if( memberGroup != null )
			m_IA_SPGroupName = memberGroup.get_title();
		if( m_IA_SPGroupName == null || m_IA_SPGroupName == "" )
		{
			statusId = SP.UI.Status.addStatus("Unable to retrieve the IA SharePoint Group. Please contact the Administrator");
   			SP.UI.Status.setStatusPriColor(statusId, 'red');
   			return;
		}

		LoadRequests();
		LoadResponses();
		LoadResponseDocs();	
		
		UpdateDDs( m_arrResponses );
		
		//console.time( 'LoadTabStatusReport' );
		LoadTabStatusReport( m_arrResponses, "fbody" );
		//console.timeEnd( 'LoadTabStatusReport' );
		//BindHandlersOnLoad();
			
		//$("#tabs").tabs().show();
		//Audit.Common.Utilities.OnLoadDisplayTimeStamp();
		//Audit.Common.Utilities.OnLoadDisplayTabAndResponse();
		//Audit.Common.Utilities.OnLoadFilterResponses('4-Approved for QA', '6-Reposted After Rejection');
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
			//if( !emailSent ) 
			//{
			//	continue;
			//}

			var subject = oListItem.get_item('ReqSubject');
			if( subject == null )
				subject = "";
				
			var arrActionOffice = oListItem.get_item('ActionOffice');
			var actionOffice = "";
			for( var x = 0; x < arrActionOffice.length; x++ )
			{
				actionOffice += "<div>" + arrActionOffice[x].get_lookupValue() + "</div>";
			}	
				
			var internalDueDate = oListItem.get_item('InternalDueDate');
			var closedDate = oListItem.get_item('ClosedDate');

			internalDueDate != null ? internalDueDate = internalDueDate.format("MM/dd/yyyy") : internalDueDate = "";
			closedDate != null ? closedDate = closedDate.format("MM/dd/yyyy") : closedDate = "";
			
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
			requestObject ["actionOffice"] = actionOffice;
			requestObject ["comments"] = comments;
			requestObject ["emailSent"] = emailSent;
			requestObject ["closedDate"] = closedDate;											
			requestObject ["relatedAudit"] = relatedAudit;
			requestObject ["actionItems"] = actionItems;
			
			requestObject ["arrIndex"] = cnt;
			m_arrRequests.push( requestObject );
			
			m_bigMap[ number ] = requestObject;
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
				responseObject ["request"] = m_bigMap[ number ];//GetRequest( number );
				if( !responseObject.request || !responseObject.request.emailSent ) //they should see it if they have access; then there's probably a permissions issue 
					continue; 

				responseObject ["item"] = oListItem;
				
				responseObject ["resStatus"] = oListItem.get_item('ResStatus');

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
				
				var modifiedDate = oListItem.get_item('Modified');
				modifiedDate != null ? modifiedDate = modifiedDate.format("MM/dd/yyyy hh:mm tt") : modifiedDate = "";
				responseObject ["modified"] = modifiedDate;						

				responseObject ["sample"] = oListItem.get_item('SampleNumber');
				if( responseObject ["sample"] == null )
					responseObject ["sample"] = "";
					
				responseObject ["coversheets"] = new Array();
				responseObject ["responseDocs"] = new Array();
				
				responseObject ["arrIndex"] = cnt;
				m_arrResponses.push( responseObject );

				m_bigMap[ "response-" + title ] = responseObject;
				cnt++;
			}
		}
	}

	//To do need checked out docs?
	function LoadResponseDocs()
	{				
		//m_arrResponseDocsCheckedOut = new Array();
		
		var listItemEnumerator = m_ResponseDocsItems.getEnumerator();
		while(listItemEnumerator.moveNext())
		{
			var oListItem = listItemEnumerator.get_current();
			if( oListItem.get_item('DocumentStatus') == "Open" || oListItem.get_item('DocumentStatus') == "Marked for Deletion" || oListItem.get_item('DocumentStatus') == "Submitted") //QA shouldn't see any documents that have been uploaded by AO but not sent to them by IA
				continue;
				
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
					
					//if( responseDocObject ["documentStatus"] == "Marked for Deletion" || responseDocObject ["documentStatus"] == "Open" || responseDocObject ["documentStatus"] == "Submitted") //this should never be the case
					//	continue;
						
					responseDocObject ["rejectReason"] = oListItem.get_item('RejectReason');	 
					if( responseDocObject ["rejectReason"] == null )
						responseDocObject ["rejectReason"] = "";
					else
						responseDocObject ["rejectReason"] = responseDocObject ["rejectReason"].replace(/(\r\n|\n|\r)/gm, "<br/>");
					
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
					responseDocObject ["modifiedDate"] = modifiedDate ;						
					
					responseDocObject ["modifiedBy"] = Audit.Common.Utilities.GetFriendlyDisplayName( oListItem, "Editor");
					
					responseDocObject["item"] = oListItem;
					
					oResponse["responseDocs"].push( responseDocObject );
					//bigMapItem["responseDocs"].push( responseDocObject );
				}
			}
			catch( err ) {}	
		}
	}
		
	function UpdateDDs( arr )
	{	
		var arrOpenResponses = new Array();
		var arrProcessedResponses = new Array();
		if( arr == null )
			return;
			
		var arrLength = arr.length;
		//for( var x = 0; x < arrlength; x++ )
		while ( arrLength-- ) 
		{
			var oResponse = arr[ arrLength ];
					
			var responseStatus = oResponse.resStatus;
			var requestStatus = oResponse.request.status;
			
			//here must check if request status is open. It could be that the request closed, but the responses are open to maintain the record			
			if( (responseStatus == "4-Approved for QA" || responseStatus == "6-Reposted After Rejection" ) && ( requestStatus  == "Open" || requestStatus == "ReOpened") ) //the user must be in the action offic and the email by IA must have been sent for them to update
				arrOpenResponses.push( oResponse.title );				
			else
				arrProcessedResponses.push( oResponse.title );
		}
				
		Audit.Common.Utilities.AddOptions( arrOpenResponses, "#ddlResponsesOpen", false, true );
		Audit.Common.Utilities.AddOptions( arrProcessedResponses, "#ddlResponsesProcessed", false, true );
	}
		
	function LoadTabStatusReport(arr, fbody)
	{		
		var body = $('#' + fbody);
		body.empty();
		body.html('');
		
		if( arr == null )
			return;

		//hide the row on load - the filter function will show it
		var myTmpl = $.templates('<tr class="sr-response-item {{if highlight}}highlighted{{/if}}" style="display:none"><td class="sr-response-requestNum">{{:reqNumber}}</td><td class="sr-response-requestSubject">{{:reqSubject}}</td><td class="sr-response-requestStatus">{{:requestStatus}}</td><td class="sr-response-internalDueDate">{{:internalDueDate}}</td><td class="sr-response-sample">{{:sample}}</td><td class="sr-response-title">{{:title}}</td><td class="sr-response-status">{{:status}}</td><td class="sr-response-docCount">{{:docCount}}</td><td class="sr-response-modified">{{:modified}}</td></tr>');
		var responseArr = new Array();


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

		var responseStatus1 = "4-Approved for QA";
		var responseStatus2 = "6-Reposted After Rejection";

		var count = 0;
		var resStatus1 = 0;
		var resStatus2 = 0;

		var r = new Array(), j = -1;
				
		var arrlength = arr.length;
		//for( var x = 0; x < arrlength; x++ )
		while ( arrlength-- ) 
		{
			var oResponse = arr[ arrlength ];
			
			var responseTitle = oResponse.title;
			var link = "<a href=\"javascript:void(0);\" title='Go to Response Details' onclick='Audit.Common.Utilities.GoToResponse(\"" + responseTitle + "\"," + false + ")'>" + responseTitle + "</a>";
			
			//	output += '<tr class="sr-response-item"><td class="sr-response-requestNum">' + oResponse.request.number + '</td><td class="sr-response-requestStatus">' + oResponse.request.status + '</td><td class="sr-response-internalDueDate">' + oResponse.request.internalDueDate + '</td><td class="sr-response-sample">' + oResponse.sample + '</td><td class="sr-response-title">' + link + '</td><td class="sr-response-status">' + oResponse.resStatus + '</td><td class="sr-response-docCount">' + oResponse.responseDocs.length + '</td><td class="sr-response-modified" nowrap>' + oResponse.modified + '</td></tr>';	
			
			var requestStatus = oResponse.request.status;
			var responseStatus = oResponse.resStatus;
			
			var highlight = false;
			if( (responseStatus == responseStatus1 || responseStatus == responseStatus2 ) && ( requestStatus == "Open" || requestStatus == "ReOpened") )
			{
				count++;
			//	r[++j] = '<tr class="sr-response-item highlighted"><td class="sr-response-requestNum">';
				
				if( responseStatus == responseStatus1 )
					resStatus1 ++;
				else
					resStatus2 ++;
				highlight = true;
			}
			//else
			//	r[++j] = '<tr class="sr-response-item"><td class="sr-response-requestNum">';
				
		/*	r[++j] = oResponse.request.number;
			r[++j] = '</td><td class="sr-response-requestStatus">';
			r[++j] = requestStatus;
			r[++j] = '</td><td class="sr-response-internalDueDate">';
			r[++j] = oResponse.request.internalDueDate;
			r[++j] = '</td><td class="sr-response-sample">';
			r[++j] = oResponse.sample;
			r[++j] = '</td><td class="sr-response-title">';
			r[++j] = link;
			r[++j] = '</td><td class="sr-response-status">';
			r[++j] = responseStatus;
			r[++j] = '</td><td class="sr-response-docCount">';
			r[++j] = oResponse.responseDocs.length;
			r[++j] = '</td><td class="sr-response-modified" nowrap>';
			r[++j] = oResponse.modified;
			r[++j] = '</td></tr>';	*/	
			

			var aResponse = {highlight: highlight, 
				reqNumber: oResponse.request.number, 
				reqSubject: oResponse.request.subject, 
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
		}
							
		var html = myTmpl.render( responseArr );
		body.html( html );
		
		//body.html( r.join('') );
		//body.append( r.join('') );
				
		$("#spanResponsesTotal").text( arr.length );
		$("#spanResponsesDisplayedTotal").text( arr.length );

		$("#tabs").tabs().show();

		setTimeout( function()
		{		
			Audit.Common.Utilities.OnLoadDisplayTimeStamp();
			//console.time( 'LoadDDOptionsTbl' );
			//LoadDDOptionsTbl();
			//console.timeEnd( 'LoadDDOptionsTbl' );
	
			Audit.Common.Utilities.AddOptions( arrResponseRequestID, "#ddlResponseRequestID", false);
			Audit.Common.Utilities.AddOptions( arrResponseRequestStatus, "#ddlResponseRequestStatus", false);
			Audit.Common.Utilities.AddOptions( arrResponseInternalDueDate, "#ddlResponseRequestInternalDueDate", false);
			Audit.Common.Utilities.AddOptions( arrResponseTitle, "#ddlResponseName", false, true);
			Audit.Common.Utilities.AddOptions( arrResponseSample, "#ddlResponseSampleNum", false, true);
			Audit.Common.Utilities.AddOptions( arrResponseStatus, "#ddlResponseStatus", false);
			$(".rowFilters").show();
		
			BindTableSorter( arr.length, "tblStatusReportResponses");
			
			BindHandlersOnLoad();
			
			if( arr.length == 0 )
			{
				$("#tblStatusReportResponses").hide();
				$("#divButtons").hide();
			}
				
			if( count > 0)
			{
				$("#lblStatusReportResponsesMsg").html("<span class='ui-icon ui-icon-alert'></span>There are " + count + " Responses pending your review");
				
				if( resStatus1 > 0 && resStatus2 == 0 )
					$("#ddlResponseStatus").val( responseStatus1 ).change();
				else if( resStatus2 > 0 && resStatus1 == 0 )
					$("#ddlResponseStatus").val( responseStatus2 ).change();			
				else
					$("#ddlResponseRequestStatus").val( "Open" ).change();
			}		
			else
				$("#lblStatusReportResponsesMsg").html("<span class='ui-icon ui-icon-circle-check'></span>There are 0 Responses pending your review");
				
			Audit.Common.Utilities.OnLoadDisplayTabAndResponse();
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
		$("#responseInfoComments").html( "" );

		$("#divResponseInfo").hide();
		$("#divCoverSheets").hide();
		$("#divResponseDocs").hide();

		$("#divEmptyCoversheetsMsg").hide();
		$("#tblCoverSheets").hide();
		$("#tblResponseDocs").hide();
		
		$("#tblCoverSheetsTotal").text( "0" );
		$("#tblResponseDocsTotal").text( "0" );
		
		$("#tblCoverSheets tbody").empty();	
		$("#tblResponseDocs tbody").empty();
		
		$(".divBulkApprove").hide();
		$(".divCloseResponse").hide();
		$(".divReturnToCGFS").hide();
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
		{
			var closedDate = oResponse.item.get_item('ClosedDate');
			closedDate != null ? closedDate = closedDate.format("MM/dd/yyyy") : closedDate = "";
				
			var closedBy = Audit.Common.Utilities.GetFriendlyDisplayName( oResponse.item, "ClosedBy");
				
			status = '<span style="color:red">' + status + " on " + closedDate + " by " + closedBy + '</span>';
		}
		else
			status = '<span style="color:green">' + status + '</span>';

		$("#responseInfoName").text( oResponse.title );
		$("#responseInfoSampleNum").text( oResponse.sample );
		$("#responseInfoAO").text( oResponse.actionOffice );
		$("#responseInfoStatus").html( status );
		
		var responseComments = oResponse.item.get_item('Comments');				
		if( responseComments == null )
			responseComments = "";
					
		$("#responseInfoComments").html( responseComments );	
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
	}
	
	function LoadTabResponseInfoResponseDocs( oResponse )
	{	
		$(".divBulkApprove").hide();
		$(".divCloseResponse").hide();
		$(".divReturnToCGFS").hide();
		$("#divEmptyResponseDocsMsg").hide();
		$("#tblResponseDocsTotal").text( 0 );
		
		if( (oResponse == null || oResponse.responseDocs.length == 0) && $("#ddlResponsesOpen").val() != "" ) //an open response is selected and there are no documents
		{
			notifyId = SP.UI.Notify.addNotification("There are 0 documents to review for " + $("#ddlResponsesOpen").val(), false);
			$(".divReturnToCGFS").show();
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
			if( oResponse == null )
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
			var cntCanBeApprovedOrRejected = 0;
			var cntApprovedOrArchived = 0;
			var bDisplayingCloseBtn = false;
			for( var z = 0; z < arrResponseSummary.length; z++ )
			{
				var oResponseSummary = arrResponseSummary[z];

				sReponseDocs += '<tr class="requestInfo-response-doc"><td colspan="10"><img style="background-color: transparent;" src="/_layouts/images/minus.gif" title="Expand/Collapse"/>' + oResponseSummary.responseTitle + '</td></tr>';

				for( var p = 0; p < oResponseSummary.responseDocs.length; p++ )
				{					
					var oResponseDoc = oResponseSummary.responseDocs[p];
	
					var actionLink = "";
					
					if( (oResponseSummary.response.resStatus == "4-Approved for QA" || oResponseSummary.response.resStatus == "6-Reposted After Rejection") && oResponseDoc.documentStatus == "Sent to QA" )
					{
						var approveLink = "<a title='Approve this Document' href='javascript:void(0)' onclick='Audit.QAReport.Report.ApproveResponseDoc(\"" + oResponseDoc.ID + "\",\"" + oResponseDoc.title + "\")'><span class='ui-icon ui-icon-circle-check'>Approve Response Doc</span></a>";
						var rejectLink = "<a title='Reject this Document' href='javascript:void(0)' onclick='Audit.QAReport.Report.RejectResponseDoc(\"" + oResponseDoc.ID + "\",\"" + oResponseDoc.title + "\")'><span class='ui-icon ui-icon-circle-close'>Reject Response Doc</span></a>";
						
						actionLink = approveLink  + " " + rejectLink;
						cntCanBeApprovedOrRejected++;
						$(".divBulkApprove").show();			
					}
					else if ( (oResponseSummary.response.resStatus == "4-Approved for QA" || oResponseSummary.response.resStatus == "6-Reposted After Rejection")  && oResponseDoc.documentStatus == "Rejected" )
					{
						$(".divReturnToCGFS").show();
					} 					
					else if( (oResponseSummary.response.resStatus == "4-Approved for QA" || oResponseSummary.response.resStatus == "6-Reposted After Rejection") && ( oResponseDoc.documentStatus == "Archived" || oResponseDoc.documentStatus == "Approved" ) )
					{
						cntApprovedOrArchived++;
					}
					
					var docIcon = "<img src= '" + Audit.Common.Utilities.GetSiteUrl() + "/_layouts/images/" + oResponseDoc.docIcon.get_value() + "'></img>";
					//var link = "<a href='../_layouts/download.aspx?SourceUrl=" + oResponseDoc.folder + "/" + oResponseDoc.title + "'>" + oResponseDoc.title + "</a>";
					var link = "<a href='javascript:void(0)' onclick='STSNavigate(\"../_layouts/download.aspx?SourceUrl=" + oResponseDoc.folder + "/" + oResponseDoc.title + "\")'>" + oResponseDoc.title + "</a>";

					var styleTag = Audit.Common.Utilities.GetResponseDocStyleTag(oResponseDoc.documentStatus);

					sReponseDocs += '<tr class="requestInfo-response-doc-item" ' + styleTag + '>' + 
						'<td>' + docIcon + '</td>' +
						'<td class="requestInfo-response-doc-title" title="Click to Download">' + link  + '</td>' +
						'<td nowrap>' + oResponseDoc.receiptDate + '</td>' +
						'<td nowrap>' + oResponseDoc.fileSize + '</td>' +
						'<td nowrap>' + oResponseDoc.documentStatus + '</td>' +
						'<td>' + oResponseDoc.rejectReason + '</td>' +
						'<td nowrap>' + actionLink + '</td>' +
						'<td class="requestInfo-response-doc-modified">' + oResponseDoc.modifiedDate + '</td>' +
						'<td class="requestInfo-response-doc-modifiedBy">' + oResponseDoc.modifiedBy + '</td>' +
					'</tr>';
					rowCount++;
				}
				
				//this is a fail safe check in case the response didnt close for some reason but all of the documents are approved or archived
				if( cntApprovedOrArchived == oResponseSummary.responseDocs.length && $("#ddlResponsesOpen").val() != "" )//make sure an open response is selected
				{
					$(".divCloseResponse").show();				
					SP.UI.Notify.addNotification("This Response did not automatically close. Please close this response.", false);
					$("#btnCloseResponse").focus();	
					bDisplayingCloseBtn = true;				
				} 
			}
			
			
			if( !bDisplayingCloseBtn && cntCanBeApprovedOrRejected == 0 && $("#ddlResponsesOpen").val() != "" ) //make sure an open response is selected
			{
				$(".divReturnToCGFS").show();
			}
		
			$("#tblResponseDocs tbody").append( sReponseDocs );
			if( rowCount > 0 )
			{
				$("#tblResponseDocsTotal").text( rowCount );
				$("#tblResponseDocs").show();
			}
			
			if( rowCount == 0 )
				$("#divEmptyResponseDocsMsg").show();
			else
				$("#divEmptyResponseDocsMsg").hide();
			
			Audit.Common.Utilities.BindHandlerResponseDoc();
		}
	}				
	
	function m_fnDisplayHelpResponseDocs()
	{
		var helpDlg = "<div id='helpDlg' style='padding:20px; height:100px; width:700px'>" + 
			"<div style='padding:20px;'><fieldset><legend>Response Document Status</legend> <ul style='padding-top:10px;'>" + 
				"<li style='padding-top:5px;'><b>Submitted</b> - Submitted to the Internal Auditor by the Action Office</li>" + 
				"<li style='padding-top:5px;'><b>Sent to QA</b> - Submitted to the Quality Assurance team by the Internal Auditor</li>" + 
				"<li style='padding-top:5px;'><b>Approved</b> - Approved by the Quality Assurance team and submitted to the External Auditor</li>" + 
				"<li style='padding-top:5px;'><b>Rejected</b> - Rejected by the Quality Assurance team and returned to the Internal Auditor</li>" + 
				"<li style='padding-top:5px;'><b>Archived</b> - Previously Rejected by the Quality Assurance team and is now read-only for record keeping</li>" + 
				"</ul></fieldset></div>" + 	
			"<div style='padding:20px; padding-top:10px;'><fieldset style='padding-top:10px;'><legend>Actions</legend> If the Response Status is <b>4-Approved for QA</b> or <b>6-Reposted After Rejection</b>, then the documents can be <b>Approved</b> or <b>Rejected</b><ul style='padding-top:10px;'>" + 
				"<li style='padding-top:5px;'><b>Approve</b> - Submit the document to the External Auditor</li>" + 
				"<li style='padding-top:5px;'><b>Reject</b> - Reject the document and return to the Internal Auditor</li>" + 
				"</ul></fieldset></div>" + 	
			"<table style='padding-top:10px; width:200px; float:right'>" + 
				"<tr><td class='ms-separator'>&#160;</td><td><input id='btnCancel' type='button' class='ms-ButtonHeightWidth' value='Close' title='Close Help' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)'/></td></tr>" + 
			"</table></div>";
		
		$('body').append( helpDlg );
		
		var options = SP.UI.$create_DialogOptions();	
		options.title = "Response Documents Help";
		options.dialogReturnValueCallback = OnCallbackForm;
		options.html = document.getElementById("helpDlg");
		SP.UI.ModalDialog.showModalDialog( options );

	}
	

	m_cntToApprove = 0;
	m_cntApproved = 0;
	function m_fnApproveAll()
	{
		m_bIsTransactionExecuting = true;
		
		var approveResponseDocDlg = "<div id='approveResponseDocDlg' style='padding:20px; height:100px'><div style='padding:20px;'>Are you sure you would like to <span style='font-weight:bold; color:green'>Approve</span> all remaining documents?</span></div>" + 	
			"<table style='padding-top:10px; width:200px; margin:0px auto'>" + 
				"<tr><td><input id='btnClientOk1' type='button' class='ms-ButtonHeightWidth' value='Send to Auditor' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK)'/></td>" + 
				"<td class='ms-separator'>&#160;</td><td><input id='btnCancel' type='button' class='ms-ButtonHeightWidth' value='Close' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)'/></td></tr>" + 
			"</table></div>";
		
		$('body').append( approveResponseDocDlg );
		
		var options = SP.UI.$create_DialogOptions();	
		options.title = "Approve Response Documents";
		options.dialogReturnValueCallback = OnCallbackApproveAllResponseDoc;
		options.html = document.getElementById("approveResponseDocDlg");
		SP.UI.ModalDialog.showModalDialog(options);

	}

	function m_fnApproveResponseDoc( id, responseTitle ) 
	{
		m_bIsTransactionExecuting = true;
		//used in callback
		m_itemID = id;
		m_RejectReason = "";
		
		var approveResponseDocDlg = "<div id='approveResponseDocDlg' style='padding:20px; height:100px'><div style='padding:20px;'>Are you sure you would like to <span style='font-weight:bold; color:green'>Approve</span> the Response Document? <p style='padding-top:10px; font-weight:bold; color:green'>" + responseTitle + "</p></span></div>" + 	
			"<table style='padding-top:10px; width:200px; margin:0px auto'>" + 
				"<tr><td><input id='btnClientOk1' type='button' class='ms-ButtonHeightWidth' value='Send to Auditor' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK)'/></td>" + 
				"<td class='ms-separator'>&#160;</td><td><input id='btnCancel' type='button' class='ms-ButtonHeightWidth' value='Close' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)'/></td></tr>" + 
			"</table></div>";
		
		$('body').append( approveResponseDocDlg );
		
		var options = SP.UI.$create_DialogOptions();	
		options.title = "Approve Response Document";
		options.dialogReturnValueCallback = OnCallbackApproveResponseDoc;
		options.html = document.getElementById("approveResponseDocDlg");
		SP.UI.ModalDialog.showModalDialog(options);
	}

	function m_fnRejectResponseDoc( id, responseTitle) 
	{
		m_bIsTransactionExecuting = true;
		//used in callback
		m_itemID = id;
		m_RejectReason = "";
		
		var rejectResponseDocDlg = "<div id='rejectResponseDocDlg' style='padding:20px; height:100px'><div style='padding:20px;'>Are you sure you would like to <span style='font-weight:bold; color:DarkRed'>Reject</span> the Response Document? <p style='padding-top:10px; font-weight:bold; color:DarkRed'>" + responseTitle + "</p><p style='padding-top:10px'>If so, please specify the reason: </p><p><textarea id='txtRejectReason' cols='50' rows='3' onkeyup='Audit.QAReport.Report.GetCancelReason()'></textarea></p></span></div>" + 	
			"<table style='padding-top:10px; width:200px; margin:0px auto'>" + 
				"<tr><td><input id='btnClientOk1' type='button' class='ms-ButtonHeightWidth' value='Yes, Reject Document' disabled='disabled' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK)'/></td>" + 
				"<td class='ms-separator'>&#160;</td><td><input id='btnCancel' type='button' class='ms-ButtonHeightWidth' value='Close' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)'/></td></tr>" + 
			"</table></div>";
		
		$('body').append( rejectResponseDocDlg );
		
		var options = SP.UI.$create_DialogOptions();	
		options.title = "Reject Response Document";
		options.dialogReturnValueCallback = OnCallbackRejectResponseDoc;
		options.html = document.getElementById("rejectResponseDocDlg");
		SP.UI.ModalDialog.showModalDialog(options);
		$("#txtRejectReason").focus();
	}
	
	function m_fnCloseResponse()
	{
		m_bIsTransactionExecuting = true;

		var responseDocDlg = "<div id='responseDocDlg' style='padding:20px; height:100px'><div style='padding:20px;'>All documents in this response are Approved. Are you sure you would like to <span style='font-weight:bold; color:green'>Close this Response</span>? </span></div>" + 	
			"<table style='padding-top:10px; width:200px; margin:0px auto'>" + 
				"<tr><td><input id='btnClientOk1' type='button' class='ms-ButtonHeightWidth' value='Close Response' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK)'/></td>" + 
				"<td class='ms-separator'>&#160;</td><td><input id='btnCancel' type='button' class='ms-ButtonHeightWidth' value='Close' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)'/></td></tr>" + 
			"</table></div>";
		
		$('body').append( responseDocDlg );
		
		var options = SP.UI.$create_DialogOptions();	
		options.title = "Close Response";
		options.dialogReturnValueCallback = OnCallbackCloseResponse;
		options.html = document.getElementById("responseDocDlg");
		SP.UI.ModalDialog.showModalDialog(options);
	}
	
	function m_fnReturnToCGFS()
	{	
		m_bIsTransactionExecuting = true;

		var responseDocDlg = "<div id='responseDocDlg' style='padding:20px; height:100px'><div style='padding:20px;'>Are you sure you would like to <span style='font-weight:bold; color:darkred'>Return this Response to CGFS</span>? <p style='padding-top:10px;'><b>Note</b>: If you return it, you will no longer be able to Approve or Reject the Remaining Response Documents</p></span></div>" + 	
			"<table style='padding-top:10px; width:200px; margin:0px auto'>" + 
				"<tr><td><input id='btnClientOk1' type='button' class='ms-ButtonHeightWidth' value='Return to CGFS' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK)'/></td>" + 
				"<td class='ms-separator'>&#160;</td><td><input id='btnCancel' type='button' class='ms-ButtonHeightWidth' value='Close' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)'/></td></tr>" + 
			"</table></div>";
		
		$('body').append( responseDocDlg );
		
		var options = SP.UI.$create_DialogOptions();	
		options.title = "Return to CGFS";
		options.dialogReturnValueCallback = OnCallbackReturnToCGFS;
		options.html = document.getElementById("responseDocDlg");
		SP.UI.ModalDialog.showModalDialog(options);
	}
		
	function m_fnFormatEmailBodyToIAFromQA( oRequest, responseTitle )
	{
		var emailText = "<div>Audit Request Reference: <b>REQUEST_NUMBER</b></div>" +
			"<div>Audit Request Subject: <b>REQUEST_SUBJECT</b></div>" +		
			"<div>Audit Request Due Date: <b>REQUEST_DUEDATE</b></div><br/>" +		
			"<div>Below is the Response that was updated: </div>" +
			"<div>RESPONSE_TITLE</div>" ;

		emailText = emailText.replace("REQUEST_NUMBER", oRequest.number );
		emailText = emailText.replace("REQUEST_SUBJECT", oRequest.subject );
		emailText = emailText.replace("REQUEST_DUEDATE", oRequest.internalDueDate );
		emailText = emailText.replace("REQUEST_ACTIONITEMS", oRequest.actionItems );	
		
		var responseTitleBody = "<ul><li>" + responseTitle + "</li></ul>";
		emailText = emailText.replace("RESPONSE_TITLE", responseTitleBody );	

		return emailText;
	}

	function m_fnGetResponseByTitle ( title )
	{
		var oResponse = null;
		/*for( var x = 0; x < m_arrResponses.length; x++ )
		{
			if( m_arrResponses[x].title == title )
			{
				oResponse = m_arrResponses[x];
				break;
			}
		}*/
		try
		{
			oResponse = m_bigMap[ "response-" + title ];
		}catch( err ){}
		
		return oResponse;
	}
	
	function m_fnCreateEAFolder( requestNumber )
	{
		var ctx2 = new SP.ClientContext.get_current();
    	
    	//Check if folder exists in EA library
    	var bFolderExists = false;
    	var listItemEnumerator = eaReponseDocsFolderItems.getEnumerator();
		while(listItemEnumerator.moveNext())
		{
			var folderItem = listItemEnumerator.get_current();
		
			var itemName = folderItem.get_displayName();			
			if( itemName == requestNumber )
			{
				bFolderExists = true;
				break;
			}
		}
		
		//If folder doesn't exist, create it in EA library
		if ( !bFolderExists  )
		{
			var earesponseDocLib = ctx2.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleResponseDocsEA() );
			
			var itemCreateInfo = new SP.ListItemCreationInformation();
			itemCreateInfo.set_underlyingObjectType( SP.FileSystemObjectType.folder );
			itemCreateInfo.set_leafName( requestNumber );
			
			oNewEAFolder = earesponseDocLib.addItem( itemCreateInfo );				
			oNewEAFolder.set_item("Title", requestNumber);
			oNewEAFolder.update();
			
			
			function OnSuccess(sender, args) 
		    {   		    
			}
		    function OnFailure(sender, args) 
		    {      
		    }

			ctx2.executeQueryAsync(OnSuccess, OnFailure);
		}
	}
	
	function m_fnCreateEAEmailLogItem()
	{
		var ctx2 = new SP.ClientContext.get_current();
    	
    	//Check if an item exists in EA Email log list library
    	var bExists = false;
    	var listItemEnumerator = eaEmailLogListItems.getEnumerator();
		while(listItemEnumerator.moveNext())
		{
			var emailLogItems = listItemEnumerator.get_current();
		
			var bExists = true;
			break;
		}
		
		//If folder doesn't exist, create it in EA library
		if ( !bExists )
		{
			var eaEmailLogList = ctx2.get_web().get_lists().getByTitle( "AuditEAEmailLog" );
			var date = new Date();
			var friendlyName = date.format("MM/dd/yyyy");
			
			var itemCreateInfo = new SP.ListItemCreationInformation();			
			oNewEmailLogItem = eaEmailLogList.addItem( itemCreateInfo );				
			oNewEmailLogItem.set_item("Title", friendlyName );
			oNewEmailLogItem.update();
			
			
			function OnSuccess(sender, args) 
		    {   		    
			}
		    function OnFailure(sender, args) 
		    {      
		    }

			ctx2.executeQueryAsync(OnSuccess, OnFailure);
		}
	}

	

	function m_fnGetRequestByResponseTitle( responseTitle )
	{
		var oRequest = null;
		
		/*for( var x = 0; x < m_arrResponses.length; x++ )
		{
			if( m_arrResponses[x].title == responseTitle )
			{
				oRequest = m_arrResponses[x].request;
				
				break;
			}
		}*/
		try
		{
			var response = m_bigMap[ "response-" + responseTitle ];
			if( response )
				oRequest = response.request;
		}catch( err ){}
		
		return oRequest;
	}
	
	function m_fnCreateEmailToIAFromQA( emailList, oRequest, responseTitle, emailSubject )
	{
		if( !oRequest || !emailList )
			return;
			
		var emailText = m_fnFormatEmailBodyToIAFromQA( oRequest, responseTitle);			 		
			
		var itemCreateInfo = new SP.ListItemCreationInformation();
	    itemCreateInfo.set_folderUrl( location.protocol + "//" + location.host + Audit.Common.Utilities.GetSiteUrl() + "/Lists/" + Audit.Common.Utilities.GetListNameEmailHistory() + "/" + oRequest.number );				    
	    oListItem = emailList.addItem( itemCreateInfo );
	    oListItem.set_item('Title', emailSubject);
	    oListItem.set_item('Body', emailText);
	    oListItem.set_item('To', m_IA_SPGroupName );
	    oListItem.set_item('ReqNum', oRequest.number );
 	  	oListItem.set_item('ResID', responseTitle );
		oListItem.set_item('NotificationType', "IA Notification" );
	    oListItem.update();			
	}

	function OnCallbackForm(result, value)
	{
		if (result === SP.UI.DialogResult.OK) 
		{
		}
	}
	
	function OnCallbackCloseResponse( result, value )
	{
		if (result === SP.UI.DialogResult.OK) 
		{
			m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose("Closing Response", "Please wait... Closing Response", 200, 400);

			var responseTitle = $("#ddlResponsesOpen").val();
			
			var ctx2 = SP.ClientContext.get_current();

			var aresponseList = ctx2.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetListTitleResponses() );
			var aresponseQuery = new SP.CamlQuery();	
			aresponseQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' + responseTitle + '</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>');
			aresponseItems = aresponseList.getItems( aresponseQuery );
			ctx2.load( aresponseItems );

			var emailList = ctx2.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetListTitleEmailHistory() );
			var emailListQuery = new SP.CamlQuery();	
			emailListQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>');
			emailListFolderItems = emailList.getItems( emailListQuery );
			ctx2.load( emailListFolderItems, 'Include(ID, FSObjType, Title, DisplayName)');


			function OnSuccess(sender, args) 
		    {   		    
	    		var listItemEnumerator = aresponseItems.getEnumerator();
				while( listItemEnumerator.moveNext() )
				{
					var oListItemResponse = listItemEnumerator.get_current();
					
					var responseTitle = oListItemResponse.get_item("Title");
				
					var curDate = new Date();
					oListItemResponse.set_item( "ResStatus", "7-Closed");
					//oListItemResponse.set_item( "ClosedDate", Audit.Common.Utilities.GetISODateString( curDate) );									
					var newClosedTime = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), curDate.getHours(), curDate.getMinutes(), curDate.getSeconds(), curDate.getMilliseconds());
					oListItemResponse.set_item( "ClosedDate", newClosedTime );
					oListItemResponse.set_item( "ClosedBy", _spPageContextInfo.userId );
					oListItemResponse.update();
														
					var oRequest = null;
					/*for( var x = 0; x < m_arrResponses.length; x++ )
					{
						if( m_arrResponses[x].title == responseTitle )
						{
							oRequest = m_arrResponses[x].request;
						}
					}*/
					try
					{
						var mapResponse = m_bigMap[ "response-" + responseTitle ];
						if( mapResponse )
							oRequest = mapResponse.request;
					}catch( err ){}
					
					
					if( oRequest )
					{				    	
						m_fnCreateEmailToIAFromQA( emailList, oRequest, responseTitle, "An Audit Response has been Closed by the Quality Assurance Team: " + responseTitle );
					}
					else
						m_waitDialog.close();
					
					ctx2.executeQueryAsync(
						function()
			    		{
							m_waitDialog.close();
							
			    			Audit.Common.Utilities.Refresh(); 			
						},
						function()
			    		{
							m_waitDialog.close();
			    			Audit.Common.Utilities.Refresh(); 			
						}		
					);
					
					break; //should only be once
				}														
			}
		    function OnFailure(sender, args) 
		    {      
				m_waitDialog.close();
		    	alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
		    }

			ctx2.executeQueryAsync(OnSuccess, OnFailure);
		}
		else
			m_bIsTransactionExecuting = false;

	}

	function OnCallbackReturnToCGFS(result, value)
	{
		if (result === SP.UI.DialogResult.OK) 
		{
			m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose("Returning to CGFS", "Please wait... Returning to CGFS", 200, 400);

			var responseTitle = $("#ddlResponsesOpen").val();
			
			var ctx2 = SP.ClientContext.get_current();

			var aresponseList = ctx2.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetListTitleResponses() );
			var aresponseQuery = new SP.CamlQuery();	
			aresponseQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' + responseTitle + '</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>');
			aresponseItems = aresponseList.getItems( aresponseQuery );
			ctx2.load( aresponseItems );

			var emailList = ctx2.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetListTitleEmailHistory() );
			var emailListQuery = new SP.CamlQuery();	
			emailListQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>');
			emailListFolderItems = emailList.getItems( emailListQuery );
			ctx2.load( emailListFolderItems, 'Include(ID, FSObjType, Title, DisplayName)');


			function OnSuccess(sender, args) 
		    {   		    
	    		var listItemEnumerator = aresponseItems.getEnumerator();
				while( listItemEnumerator.moveNext() )
				{
					var oListItemResponse = listItemEnumerator.get_current();
					
					var responseTitle = oListItemResponse.get_item("Title");
				
					var curDate = new Date();
					oListItemResponse.set_item( "ResStatus", "5-Returned to GFS");
					oListItemResponse.update();

					var oRequest = null;
					/*for( var x = 0; x < m_arrResponses.length; x++ )
					{
						if( m_arrResponses[x].title == responseTitle )
						{
							oRequest = m_arrResponses[x].request;
						}
					}*/
					try
					{
						var mapResponse = m_bigMap[ "response-" + responseTitle ];
						if( mapResponse )
							oRequest = mapResponse.request;
					}catch(err){}
					
					if( oRequest )
					{
						/*if( !Audit.Common.Utilities.CheckIfEmailFolderExists( emailListFolderItems, oRequest.number) )
				    	{
				    		Audit.Common.Utilities.CreateEmailFolder( emailList, oRequest.number );
				    	}*/
				    	
						m_fnCreateEmailToIAFromQA( emailList, oRequest, responseTitle, "An Audit Response has been Returned by the Quality Assurance Team: " + responseTitle);				    	
					}
					else
						m_waitDialog.close();

					
					ctx2.executeQueryAsync(
						function()
			    		{
							m_waitDialog.close();
							
			    			Audit.Common.Utilities.Refresh(); 			
						},
						function()
			    		{
							m_waitDialog.close();
			    			Audit.Common.Utilities.Refresh(); 			
						}		
					);
					
					break; //should only be once
				}														
			}
		    function OnFailure(sender, args) 
		    {      
				m_waitDialog.close();
		    	alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
		    }

			ctx2.executeQueryAsync(OnSuccess, OnFailure);
		}
		else
			m_bIsTransactionExecuting = false;
	}

	function OnCallbackApproveResponseDoc(result, value)
	{
		if (result === SP.UI.DialogResult.OK) 
		{		
			m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose("Approving Response Document", "Please wait... Approving Response Document", 200, 400);
		
			var clientContext = SP.ClientContext.get_current();
			var oList = clientContext.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleResponseDocs() );
			
			oListItem = oList.getItemById( m_itemID );	
			clientContext.load( oListItem );
			
			var eaResponseDocsLib = clientContext.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleResponseDocsEA() );
			var earesponseDocsQuery = new SP.CamlQuery();	
			earesponseDocsQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>');
			eaReponseDocsFolderItems = eaResponseDocsLib.getItems( earesponseDocsQuery );
			clientContext.load( eaReponseDocsFolderItems , 'Include(ID, FSObjType, Title, DisplayName)');
			
			//make sure ea email folder exists
			var eaEmailLogList = clientContext.get_web().get_lists().getByTitle( "AuditEAEmailLog" );
			var eaEmailLogListQuery = new SP.CamlQuery();	
			eaEmailLogListQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="Created"/><Value IncludeTimeValue="FALSE" Type="DateTime"><Today/></Value></Eq></Where></Query></View>');
			eaEmailLogListItems = eaEmailLogList.getItems( eaEmailLogListQuery );
			clientContext.load( eaEmailLogListItems, 'Include(ID)');

			function OnSuccess(sender, args) 
		    {   
		    	var oResponse = m_fnGetResponseByTitle( $("#ddlResponsesOpen").val() );
				
				if( oResponse == null || oResponse.request == null )
				{
					m_waitDialog.close();
					return;
				}
				oRequest = oResponse.request;
				folderPath = oRequest.number;

				m_fnCreateEAFolder( folderPath );
		    	m_fnCreateEAEmailLogItem();				
										
				var requestId = oRequest.number;
				var responseNumber = oResponse.title;
				var fileName = oListItem.get_item("FileLeafRef");

		  		var ctx2 = new SP.ClientContext.get_current();
				var oList = ctx2.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleResponseDocs() );
				
				//refetch to avoid version conflict
				oListItem = oList.getItemById( m_itemID );
				
				var file = oListItem.get_file();
				var absoluteSiteUrl = location.protocol + "//" + location.host + _spPageContextInfo.webServerRelativeUrl + "/";
				var destinationFileNameUrl = absoluteSiteUrl + Audit.Common.Utilities.GetLibTitleResponseDocsEA() + '/' + folderPath + '/' + fileName; 
				file.copyTo( destinationFileNameUrl, 1 );

				oListItem.set_item("DocumentStatus", "Approved");
				oListItem.set_item("RejectReason", "");		
				oListItem.update();
								
		    	var siteUrl = location.protocol + "//" + location.host ;
				var urlOfNewFile = destinationFileNameUrl.replace( siteUrl, '' );    
				newFile = ctx2.get_web().getFileByServerRelativeUrl( urlOfNewFile );   
				ctx2.load(newFile,'ListItemAllFields'); 
				//ctx2.load(newFile, 'Include(ID)'); 
					
				//alert( "folderPath: " + folderPath );
				var data = {responseTitle: responseNumber , copiedFileName: destinationFileNameUrl, requestId: requestId, responseNumber: responseNumber};
			    //Execute the query and pass the data with our deferred object
			    
			    //Check for all response docs statuses, if there are no more pending actions, close the response and set the closed date of the response
			    function onUpdateResFolderSuccess() 
				{					
					if( this.responseTitle == null || this.responseTitle == undefined || this.responseTitle == "" )
					{
						m_waitDialog.close();
						alert( "Error: empty response title ");
						return;								
					} 
									    
					var ctx3 = SP.ClientContext.get_current();
					
					//update the file in the EA document library with the request/response properties
					var idOfCopiedFile = newFile.get_listItemAllFields().get_id();					
					var oEADocLib = ctx3.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleResponseDocsEA() );
					oListFileItem = oEADocLib .getItemById( idOfCopiedFile  );
					oListFileItem.set_item("RequestNumber", this.requestId);
					oListFileItem.set_item("ResponseID", this.responseNumber);
					oListFileItem.update();
									    
					var aresponseList = ctx3.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetListTitleResponses() );
					var aresponseQuery = new SP.CamlQuery();	
					aresponseQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' + this.responseTitle + '</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>');
					aresponseItems = aresponseList.getItems( aresponseQuery );
					ctx3.load( aresponseItems );

					var folderPath = Audit.Common.Utilities.GetSiteUrl() + "/" + Audit.Common.Utilities.GetLibNameResponseDocs() + "/" + this.responseTitle;
					var aresponseDocList = ctx3.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleResponseDocs() );
					var aresponseDocQuery = new SP.CamlQuery();	
					aresponseDocQuery.set_viewXml('<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><And><Eq><FieldRef Name="FSObjType"/><Value Type="Text">0</Value></Eq><Eq><FieldRef Name="FileDirRef"/><Value Type="Text">' +  folderPath + '</Value></Eq></And></Where></Query></View>');
					aresponseDocItems = aresponseDocList.getItems( aresponseDocQuery );
					ctx3.load( aresponseDocItems );

					var emailList = ctx3.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetListTitleEmailHistory() );
					var emailListQuery = new SP.CamlQuery();	
					emailListQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>');
					emailListFolderItems = emailList.getItems( emailListQuery );
					ctx3.load( emailListFolderItems, 'Include(ID, FSObjType, Title, DisplayName)');

					function onUpdateSucceededZZ() 
					{
						notifyId = SP.UI.Notify.addNotification("Approved Response Document", false);
						
						bUpdateResponseStatus = true;
			    		var listxItemEnumerator = aresponseDocItems.getEnumerator();
			    		
			    		var bRejected = false;
						while(listxItemEnumerator.moveNext())
						{
							var oListItemResponseDoc = listxItemEnumerator.get_current();
							var oListItemResponseDocStatus = oListItemResponseDoc.get_item('DocumentStatus');
												
							if( oListItemResponseDocStatus == "Open" ||  oListItemResponseDocStatus == "Submitted" || oListItemResponseDocStatus == "Sent to QA")//there should never be one that's open, but checking anyway
							{
								bUpdateResponseStatus = false;
							}
							else if( oListItemResponseDocStatus == "Rejected" )
							{
								bRejected = true;
							}
						}						
						
						//Update the Response status
						//if all items have completed (none are open or sent to QA), then update the status
						//If one is rejected, then returned to gfs. otherwise, close the response
						if( bUpdateResponseStatus )
						{
							var oRequest = m_fnGetRequestByResponseTitle( this.responseTitle );
							/*if( oRequest )
							{
								if( !Audit.Common.Utilities.CheckIfEmailFolderExists( emailListFolderItems, oRequest.number ) )
						    	{
						    		Audit.Common.Utilities.CreateEmailFolder( emailList, oRequest.number);
						    	}
					    	}*/
							
				    		var listxxItemEnumerator = aresponseItems.getEnumerator();
							while(listxxItemEnumerator.moveNext())
							{
								var oListItemResponse = listxxItemEnumerator.get_current();

								if( !bRejected )
								{
									var curDate = new Date();
									oListItemResponse.set_item( "ResStatus", "7-Closed");
									//oListItemResponse.set_item( "ClosedDate", Audit.Common.Utilities.GetISODateString( curDate) );									
									var newClosedTime = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), curDate.getHours(), curDate.getMinutes(), curDate.getSeconds(), curDate.getMilliseconds());
									oListItemResponse.set_item( "ClosedDate", newClosedTime );

									oListItemResponse.set_item( "ClosedBy", _spPageContextInfo.userId );
																		
									m_fnCreateEmailToIAFromQA( emailList, oRequest, this.responseTitle, "An Audit Response has been Closed by the Quality Assurance Team: " + this.responseTitle);
									
								}
								else
								{
									oListItemResponse.set_item( "ResStatus", "5-Returned to GFS");
									
									m_fnCreateEmailToIAFromQA( emailList, oRequest, this.responseTitle, "An Audit Response has been Returned by the Quality Assurance Team: " + this.responseTitle);
								}
								
								oListItemResponse.update();
								
								ctx3.executeQueryAsync(function()
					    		{
									m_waitDialog.close();
					    			Audit.Common.Utilities.Refresh();
								});
								
								break; //should only be once
							}														
						}
						else
						{		    		
							m_waitDialog.close();
							Audit.Common.Utilities.Refresh();
						}					
					}
					function onUpdateFailedZZ()
					{
						m_waitDialog.close();
					}
					
					var data = {responseTitle: this.responseTitle};
				    ctx3.executeQueryAsync(Function.createDelegate(data, onUpdateSucceededZZ), Function.createDelegate(data, onUpdateFailedZZ));//After this line "return true" in PreSaveAction() will execute and then CallBackMethods will run.	
				}
				
				function onUpdateResFolderFail(sender, args) 
				{
					m_waitDialog.close();

		    		alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
					Audit.Common.Utilities.Refresh();
				}

			    ctx2.executeQueryAsync(Function.createDelegate(data, onUpdateResFolderSuccess), Function.createDelegate(data, onUpdateResFolderFail));//After this line "return true" in PreSaveAction() will execute and then CallBackMethods will run.
		    }	
		    function OnFailure(sender, args) 
		    {      
				m_waitDialog.close();
		    	alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
		    }
		    
			clientContext.executeQueryAsync(OnSuccess, OnFailure);
		}
		else
			m_bIsTransactionExecuting = false;
	}

	function OnCallbackRejectResponseDoc(result, value)
	{
		if (result === SP.UI.DialogResult.OK) 
		{			
			m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose("Rejecting Response Document", "Please wait... Rejecting Response Document", 200, 400);

			var clientContext = SP.ClientContext.get_current();
			var oList = clientContext.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleResponseDocs() );
			
			oListItem = oList.getItemById( m_itemID );	
			clientContext.load(oListItem);
			
			function OnSuccess(sender, args) 
		    {   	
		  		var ctx2 = new SP.ClientContext.get_current();
				var oList = ctx2.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleResponseDocs() );
				
				//refetch to avoid version conflict
				oListItem = oList.getItemById( m_itemID );
				oListItem.set_item("DocumentStatus", "Rejected");
				oListItem.set_item("RejectReason", m_RejectReason);
							
				oListItem.update();
				
				var siteUrl = location.protocol + "//" + location.host + _spPageContextInfo.webServerRelativeUrl + "/";
		    	filePath = oListItem.get_item("FileDirRef");	
		    	fileName = oListItem.get_item("FileLeafRef");	
		    	var lastInd = filePath.lastIndexOf("/");
		    	var urlpath = filePath.substring( 0, lastInd + 1);
		    	var responseTitle = filePath.replace(urlpath, "" );

				var folderPath = Audit.Common.Utilities.GetSiteUrl() + "/" + Audit.Common.Utilities.GetLibNameResponseDocs() + "/" + responseTitle;
				var aresponseDocList = ctx2.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleResponseDocs() );
				var aresponseDocQuery = new SP.CamlQuery();	
				aresponseDocQuery.set_viewXml('<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><And><Eq><FieldRef Name="FSObjType"/><Value Type="Text">0</Value></Eq><Eq><FieldRef Name="FileDirRef"/><Value Type="Text">' +  folderPath + '</Value></Eq></And></Where></Query></View>');
				aresponseDocItems = aresponseDocList.getItems( aresponseDocQuery );
				ctx2.load( aresponseDocItems );


				var aresponseList = ctx2.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetListTitleResponses() );
				var aresponseQuery = new SP.CamlQuery();	
				aresponseQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' + responseTitle + '</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>');
				aresponseItems = aresponseList.getItems( aresponseQuery );
				ctx2.load( aresponseItems );

				var emailList = ctx2.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetListTitleEmailHistory() );
				var emailListQuery = new SP.CamlQuery();	
				emailListQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>');
				emailListFolderItems = emailList.getItems( emailListQuery );
				ctx2.load( emailListFolderItems, 'Include(ID, FSObjType, Title, DisplayName)');

				function onUpdateSucceededZZ() 
				{
					notifyId = SP.UI.Notify.addNotification("Rejected Response Document", false);
					
					bUpdateResponseStatus = true;
		    		var listxItemEnumerator = aresponseDocItems.getEnumerator();
		    		
					while(listxItemEnumerator.moveNext())
					{
						var oListItemResponseDoc = listxItemEnumerator.get_current();
						var oListItemResponseDocStatus = oListItemResponseDoc.get_item('DocumentStatus');
											
						if( oListItemResponseDocStatus == "Open" || oListItemResponseDocStatus == "Submitted" || oListItemResponseDocStatus == "Sent to QA") //there should never be one that's open, but checking anyway
						{
							bUpdateResponseStatus = false;
						}
					}
					
					//Update the Response status
					//if all items have completed (none are open or sent to QA), then update the status to returned to gfs because we know
					//at least 1 was rejected					
					if( bUpdateResponseStatus )
					{
						var oRequest = m_fnGetRequestByResponseTitle( this.responseTitle );
						/*if( oRequest )
						{
							if( !Audit.Common.Utilities.CheckIfEmailFolderExists( emailListFolderItems, oRequest.number ) )
					    	{
					    		Audit.Common.Utilities.CreateEmailFolder( emailList, oRequest.number);
					    	}
						}*/
						
			    		var listxxItemEnumerator = aresponseItems.getEnumerator();
						while(listxxItemEnumerator.moveNext())
						{
							var oListItemResponse = listxxItemEnumerator.get_current();

							
							var curDate = new Date();
							oListItemResponse.set_item( "ResStatus", "5-Returned to GFS");
							oListItemResponse.update();
							
							m_fnCreateEmailToIAFromQA( emailList, oRequest, this.responseTitle, "An Audit Response has been Returned by the Quality Assurance Team: " + this.responseTitle);
							
							ctx2.executeQueryAsync(function()
				    		{
								m_waitDialog.close();
				    			Audit.Common.Utilities.Refresh();				    			
							});
							
							break; //should only be once
						}														
					}
					else
					{		    		
						m_waitDialog.close();
						Audit.Common.Utilities.Refresh();
					}
					
				}				
				function onUpdateFailedZZ() 
				{
					m_waitDialog.close();
				}
				
				var data = {responseTitle: responseTitle};
			    ctx2.executeQueryAsync(Function.createDelegate(data, onUpdateSucceededZZ), Function.createDelegate(data, onUpdateFailedZZ));//After this line "return true" in PreSaveAction() will execute and then CallBackMethods will run.	
		    }	
		    function OnFailure(sender, args) 
		    {      
				m_waitDialog.close();
		    	alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
		    }
		    
			clientContext.executeQueryAsync(OnSuccess, OnFailure);
		}
		else
			m_bIsTransactionExecuting = false;
	}

	function OnCallbackApproveAllResponseDoc(result, value)
	{
		if (result === SP.UI.DialogResult.OK) 
		{
			m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose("Approving Response Documents", "Please wait... Approving Response Documents", 200, 400);

			var responseTitle = $("#ddlResponsesOpen").val();
			
			var clientContext = SP.ClientContext.get_current();

			//make sure ea folder exists
			var eaResponseDocsLib = clientContext.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleResponseDocsEA() );
			var earesponseDocsQuery = new SP.CamlQuery();	
			earesponseDocsQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>');
			eaReponseDocsFolderItems = eaResponseDocsLib.getItems( earesponseDocsQuery );
			clientContext.load( eaReponseDocsFolderItems , 'Include(ID, FSObjType, Title, DisplayName)');
			
			//make sure ea email folder exists
			var eaEmailLogList = clientContext.get_web().get_lists().getByTitle( "AuditEAEmailLog" );
			var eaEmailLogListQuery = new SP.CamlQuery();	
			eaEmailLogListQuery .set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="Created"/><Value IncludeTimeValue="FALSE" Type="DateTime"><Today/></Value></Eq></Where></Query></View>');
			eaEmailLogListItems = eaEmailLogList.getItems( eaEmailLogListQuery );
			clientContext.load( eaEmailLogListItems, 'Include(ID)');

			function OnSuccess(sender, args) 
		    {   		    

				var oRequest = null;
				var oResponse = null;
				oResponse = m_fnGetResponseByTitle( $("#ddlResponsesOpen").val() );
				
				if( oResponse == null || oResponse.request == null )
					return;

				oRequest = oResponse.request;
				folderPath = oRequest.number;
		    	
		    	m_fnCreateEAFolder( oRequest.number );				
		    	m_fnCreateEAEmailLogItem();				
										
				var requestId = oRequest.number;
				var responseNumber = oResponse.title;				

				m_cntToApprove = 0;
				m_cntApproved = 0;
				
				for( var x = 0; x < oResponse.responseDocs.length; x++ )
				{
					if( oResponse.responseDocs[x].documentStatus != "Sent to QA" )
						continue;
					
					m_cntToApprove++;
					
			  		var ctx2 = new SP.ClientContext.get_current();
					var oList = ctx2.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleResponseDocs() );

					//refetch to avoid version conflict
					oListItem = oResponse.responseDocs[x].item;
					fileName = oListItem.get_item("FileLeafRef");
					oListItem = oList.getItemById( oListItem.get_item("ID") );
					
					//copy the file to the EA library
					var file = oListItem.get_file();
		    		var absoluteSiteUrl = location.protocol + "//" + location.host + _spPageContextInfo.webServerRelativeUrl + "/";
					var destinationFileNameUrl = absoluteSiteUrl + Audit.Common.Utilities.GetLibTitleResponseDocsEA() + '/' + folderPath + '/' + fileName; 				
					file.copyTo( destinationFileNameUrl, 1 );
	
					//update the reponse
					oListItem.set_item("DocumentStatus", "Approved");
					oListItem.set_item("RejectReason", "");						
					oListItem.update();
									
					//load the file
			    	var siteUrl = location.protocol + "//" + location.host ;
					var urlOfNewFile = destinationFileNameUrl.replace( siteUrl, '' );    
					newFile = ctx2.get_web().getFileByServerRelativeUrl( urlOfNewFile );   
					ctx2.load(newFile,'ListItemAllFields'); 

					var data = {responseTitle: responseNumber, copiedFileName: destinationFileNameUrl, requestId: requestId, responseNumber: responseNumber, newFile:newFile};
					
					function onUpdateResFolderSuccess() 
					{					
						if( this.responseTitle == null || this.responseTitle == undefined || this.responseTitle == "" )
						{
							document.body.style.cursor = 'default';
							//alert( "Error: empty response title ");
							notifyId = SP.UI.Notify.addNotification("Error: empty response title ", false);

							m_waitDialog.close();
							return;								
						} 
						
										    
						var ctx3 = SP.ClientContext.get_current();
						
						//update the file in the EA document library with the request/response properties
						var idOfCopiedFile = this.newFile.get_listItemAllFields().get_id();
						var oEADocLib = ctx3.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleResponseDocsEA() );
						oListFileItem = oEADocLib .getItemById( idOfCopiedFile  );
						oListFileItem.set_item("RequestNumber", this.requestId);
						oListFileItem.set_item("ResponseID", this.responseNumber);
						oListFileItem.update();
										    
						var aresponseList = ctx3.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetListTitleResponses() );
						var aresponseQuery = new SP.CamlQuery();	
						aresponseQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' + this.responseTitle + '</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>');
						aresponseItems = aresponseList.getItems( aresponseQuery );
						ctx3.load( aresponseItems );
	
						var folderPath = Audit.Common.Utilities.GetSiteUrl() + "/" + Audit.Common.Utilities.GetLibNameResponseDocs() + "/" + this.responseTitle;
						var aresponseDocList = ctx3.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleResponseDocs() );
						var aresponseDocQuery = new SP.CamlQuery();	
						aresponseDocQuery.set_viewXml('<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><And><Eq><FieldRef Name="FSObjType"/><Value Type="Text">0</Value></Eq><Eq><FieldRef Name="FileDirRef"/><Value Type="Text">' +  folderPath + '</Value></Eq></And></Where></Query></View>');
						aresponseDocItems = aresponseDocList.getItems( aresponseDocQuery );
						ctx3.load( aresponseDocItems );
	
						var emailList = ctx3.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetListTitleEmailHistory() );
						var emailListQuery = new SP.CamlQuery();	
						emailListQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>');
						emailListFolderItems = emailList.getItems( emailListQuery );
						ctx3.load( emailListFolderItems, 'Include(ID, FSObjType, Title, DisplayName)');

						
						function onUpdateSucceededZZ() 
						{
							m_cntApproved++;
							
							if( m_cntApproved != m_cntToApprove	)
							{
								//skip the code below if all of the expected documents that were to be approved haven't yet approved
								return;
							}
							
							notifyId = SP.UI.Notify.addNotification("Approved Response Documents", false);
							
							bUpdateResponseStatus = true;
				    		var listxItemEnumerator = this.aresponseDocItems.getEnumerator();
				    		
				    		var bRejected = false;
							while(listxItemEnumerator.moveNext())
							{
								var oListItemResponseDoc = listxItemEnumerator.get_current();
								var oListItemResponseDocStatus = oListItemResponseDoc.get_item('DocumentStatus');
													
								if( oListItemResponseDocStatus == "Open" ||  oListItemResponseDocStatus == "Submitted" || oListItemResponseDocStatus == "Sent to QA")//there should never be one that's open, but checking anyway
								{
									bUpdateResponseStatus = false;
								}
								else if( oListItemResponseDocStatus == "Rejected" )
								{
									bRejected = true;
								}
							}						
							
							//Update the Response status
							//if all items have completed (none are open or sent to QA), then update the status
							//If one is rejected, then returned to gfs. otherwise, close the response
							if( bUpdateResponseStatus )
							{
								var oRequest = m_fnGetRequestByResponseTitle( this.responseTitle );
								/*if( oRequest )
								{
									if( !Audit.Common.Utilities.CheckIfEmailFolderExists( this.emailListFolderItems, oRequest.number ) )
							    	{
							    		Audit.Common.Utilities.CreateEmailFolder( this.emailList, oRequest.number);
							    	}
						    	}*/
								
					    		var listxxItemEnumerator = this.aresponseItems.getEnumerator();
								while(listxxItemEnumerator.moveNext())
								{
									var oListItemResponse = listxxItemEnumerator.get_current();
	
									if( !bRejected )
									{
										var curDate = new Date();
										oListItemResponse.set_item( "ResStatus", "7-Closed");
										//oListItemResponse.set_item( "ClosedDate", Audit.Common.Utilities.GetISODateString( curDate) );									
										var newClosedTime = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), curDate.getHours(), curDate.getMinutes(), curDate.getSeconds(), curDate.getMilliseconds());
										oListItemResponse.set_item( "ClosedDate", newClosedTime );
	
										oListItemResponse.set_item( "ClosedBy", _spPageContextInfo.userId );
																			
										m_fnCreateEmailToIAFromQA( this.emailList, oRequest, this.responseTitle, "An Audit Response has been Closed by the Quality Assurance Team: " + this.responseTitle);
										
									}
									else
									{
										oListItemResponse.set_item( "ResStatus", "5-Returned to GFS");
										
										m_fnCreateEmailToIAFromQA( this.emailList, oRequest, this.responseTitle, "An Audit Response has been Returned by the Quality Assurance Team: " + this.responseTitle);
									}
									
									oListItemResponse.update();
									
									ctx3.executeQueryAsync(function()
						    		{
										m_waitDialog.close();
						    			Audit.Common.Utilities.Refresh();
									});
									
									break; //should only be once
								}														
							}
							else
							{		    
								m_waitDialog.close();
								Audit.Common.Utilities.Refresh();
							}					
						}
						function onUpdateFailedZZ()
						{
							m_waitDialog.close();
						}
					
						var data = {responseTitle: this.responseTitle, emailList: emailList, aresponseItems: aresponseItems,  aresponseDocItems : aresponseDocItems, emailListFolderItems: emailListFolderItems};
					    ctx3.executeQueryAsync(Function.createDelegate(data, onUpdateSucceededZZ), Function.createDelegate(data, onUpdateFailedZZ));//After this line "return true" in PreSaveAction() will execute and then CallBackMethods will run.	
					}					
					function onUpdateResFolderFail(sender, args) 
					{
						m_waitDialog.close();
	
						notifyId = SP.UI.Notify.addNotification('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace(), false);
	
			    		alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
						Audit.Common.Utilities.Refresh();
					}
			  	 	ctx2.executeQueryAsync(Function.createDelegate(data, onUpdateResFolderSuccess), Function.createDelegate(data, onUpdateResFolderFail));//After this line "return true" in PreSaveAction() will execute and then CallBackMethods will run.						    
				}
			}
		    function OnFailure(sender, args) 
		    {      
				m_waitDialog.close();
		    	alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
		    }

			clientContext.executeQueryAsync(OnSuccess, OnFailure);
		}
		
		else
			m_bIsTransactionExecuting = false;
	}
	
	/*
	function LoadDDOptionsTbl()
	{						
	
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

		var eacher = $(".sr-response-requestNum");
		eacher.each(function()
		{
			var val = $(this).text();
			if( !oRequestNumbers.hasOwnProperty( val ) )
			{
				oRequestNumbers[ val ] = 1;
				arrResponseRequestID.push( val );
			}
			//if( !Audit.Common.Utilities.ExistsInArr( arrResponseRequestID, val ))
			//	arrResponseRequestID.push(val);
		});
		
		var eacher = $(".sr-response-requestStatus");
		eacher.each(function()
		{
			var val = $(this).text();
			if( !oResponseRequestStatus.hasOwnProperty( val ) )
			{
				oResponseRequestStatus[ val ] = 1;
				arrResponseRequestStatus.push( val );
			}
			//if( !Audit.Common.Utilities.ExistsInArr( arrResponseRequestStatus, val ))
			//	arrResponseRequestStatus.push(val);
		});		
		
		var eacher = $(".sr-response-internalDueDate");
		eacher.each(function()
		{
			var val = $(this).text();
			if( !oResponseInternalDueDate.hasOwnProperty( val ) )
			{
				oResponseInternalDueDate[ val ] = 1;
				arrResponseInternalDueDate.push( val );
			}

			//if( !Audit.Common.Utilities.ExistsInArr( arrResponseInternalDueDate , val ))
			//	arrResponseInternalDueDate.push(val);
		});
		
		var eacher = $(".sr-response-title");
		eacher.each(function()
		{
			var val = $(this).text();
			if( !oResponseTitle.hasOwnProperty( val ) )
			{
				oResponseTitle[ val ] = 1;
				arrResponseTitle.push( val );
			}

			//if( !Audit.Common.Utilities.ExistsInArr( arrResponseTitle , val ))
			//	arrResponseTitle.push(val);
		});
		
		var eacher = $(".sr-response-sample");
		eacher.each(function()
		{
			var val = $(this).text();
			if( !oResponseSample.hasOwnProperty( val ) )
			{
				oResponseSample[ val ] = 1;
				arrResponseSample.push( val );
			}

			//if( !Audit.Common.Utilities.ExistsInArr( arrResponseSample , val ))
			//	arrResponseSample.push(val);
		});
		
		var eacher = $(".sr-response-status");
		eacher.each(function()
		{
			var val = $(this).text();
			if( !oResponseStatus.hasOwnProperty( val ) )
			{
				oResponseStatus[ val ] = 1;
				arrResponseStatus.push( val );
			}

			//if( !Audit.Common.Utilities.ExistsInArr( arrResponseStatus , val ))
			//	arrResponseStatus.push(val);
		});
		
		Audit.Common.Utilities.AddOptions( arrResponseRequestID, "#ddlResponseRequestID", false);
		Audit.Common.Utilities.AddOptions( arrResponseRequestStatus, "#ddlResponseRequestStatus", false);
		Audit.Common.Utilities.AddOptions( arrResponseInternalDueDate, "#ddlResponseRequestInternalDueDate", false);
		Audit.Common.Utilities.AddOptions( arrResponseTitle, "#ddlResponseName", false);
		Audit.Common.Utilities.AddOptions( arrResponseSample, "#ddlResponseSampleNum", false);
		Audit.Common.Utilities.AddOptions( arrResponseStatus, "#ddlResponseStatus", false);
	}*/

	function BindTableSorter( rowCount, tableName)
	{
		if( rowCount > 0 )
		{
			setTimeout( function()
			{
				$( "#" + tableName ).tablesorter(
				{
					//sortList: [[0,0],[2,0],[4,0]],
					sortList: [[3,0]],
					selectorHeaders: '.sorter-true'
				}); 
			}, 200 );
		}
	}
				
	function BindHandlersOnLoad()
	{
		$(".linkHelpResponseDocs").click(function()
		{
			m_fnDisplayHelpResponseDocs();
		});

		$("#ddlResponsesOpen").change(function()
		{
			$("#ddlResponsesProcessed").val("");
			$(".divCloseResponse").hide();
			$(".divReturnToCGFS").hide();
			
			var response = $(this).val();
			if( response )
				$("#divSubmit").show();
			else
				$("#divSubmit").hide();
			
			LoadResponseInfo( $(this).val() );				
		});
		
		$("#ddlResponsesProcessed").change(function()
		{
			$("#ddlResponsesOpen").val("");
			$(".divCloseResponse").hide();
			$(".divReturnToCGFS").hide();
			$("#divSubmit").hide();
			LoadResponseInfo( $(this).val() );
		});
		
		$("#btnViewAll").click(function()
		{
			m_fnClearFilterResponses();
		});

		$(".btnCloseResponse").click(function()
		{
			m_fnCloseResponse();
		});

		$(".btnReturnToCGFS").click(function()
		{
			m_fnReturnToCGFS();
		});
		
		$(".btnApproveAll").click(function()
		{
			m_fnApproveAll();
		});
				
		$( "#ddlResponseRequestID, #ddlResponseRequestStatus, #ddlResponseRequestInternalDueDate, #ddlResponseName, #ddlResponseSampleNum, #ddlResponseStatus" ).change(function()
		{
			document.body.style.cursor = 'wait';
			setTimeout( function(){ m_fnFilterResponses()}, 200 );
		});
		BindPrintButton("#btnPrint1", "#divStatusReportRespones", "QA Response Status Report");
		//////////Note: for the export to work, make sure this is added to the html: <iframe id="CsvExpFrame" style="display: none"></iframe>
		BindExportButton(".export1", "QAResponseStatusReport_", "tblStatusReportResponses");
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
	    var numOfVisibleRows = cntVisible; //$('.sr-response-item:visible').length;
	    var numRows = cntRows; //$('.sr-response-item').length;

		$("#spanResponsesDisplayedTotal").text( numOfVisibleRows );
		
		if( numOfVisibleRows == numRows)
			$("#btnViewAll").hide();
		else
			$("#btnViewAll").show();

		document.body.style.cursor = 'default';
	}	
		
	var publicMembers = 
	{
		Load: m_fnLoadData,
		ApproveResponseDoc: function(id, responseTitle){ m_fnApproveResponseDoc(id, responseTitle); },
		RejectResponseDoc: function(id, responseTitle){ m_fnRejectResponseDoc(id, responseTitle); },
		IsTransactionExecuting: function(){ return m_bIsTransactionExecuting; },
		GetCancelReason: function(){ 
			m_RejectReason = $("#txtRejectReason").val(); 
			if( $.trim(m_RejectReason) == "" )
				$("#btnClientOk1").attr("disabled","disabled");
			else
				$("#btnClientOk1").removeAttr("disabled");
			return m_RejectReason;
		}
	}
	
	return publicMembers;
}

	
	
	
	
