var Audit = window.Audit || {};
Audit.AOReport = Audit.AOReport || {};

$(document).ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', ExecuteOrDelayUntilScriptLoaded(InitReport, "sp.js"));

})

function InitReport() 
{    
	Audit.AOReport.Report = new Audit.AOReport.NewReportPage();
	Audit.AOReport.Init();
}

Audit.AOReport.Init = function()
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
	       // location.href="https://example.com";
	       Audit.Common.Utilities.Refresh();
	    }
	}, 1000);
	*/
	
	function SetTimer()
	{
		var intervalRefreshID = setInterval(function() {
		    var divVal = $("#divCounter").text();
		    var count = divVal * 1 - 1;
		    $("#divCounter").text(count);
			if (count <= 0) 
			{
				if( !Audit.AOReport.Report.IsTransactionExecuting() )
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


Audit.AOReport.NewReportPage = function ()
{	
	var m_bigMap = new Object();
	var m_arrRequests = new Array();
	var m_arrResponses = new Array();
	var m_arrPermissions = new Array();
	var m_IA_SPGroupName = null;
	var m_bIsUserAnIA = false;
	
	var m_curResponseSelectedIsEditableByAO = false;
	var m_bIsTransactionExecuting = false;	

	//var m_coversheets = new Object();
	
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
		currCtx.load( m_requestItems, 'Include(ID, Title, ReqSubject, ReqStatus, InternalDueDate, ActionOffice, RelatedAudit, ActionItems, Comments, EmailSent, ClosedDate)');

		/*
		var coverSheetLib = web.get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleCoverSheets() );
		var coverSheetQuery = new SP.CamlQuery();	
		coverSheetQuery.set_viewXml('<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="ReqNum"/></OrderBy></Query></View>');
		m_CoverSheetItems = coverSheetLib.getItems( coverSheetQuery );
		currCtx.load(  m_CoverSheetItems, 'Include(ID, Title, ReqNum, ActionOffice, FileLeafRef, FileDirRef)');
		*/

		var responseList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleResponses() );
		var responseQuery = new SP.CamlQuery();	
		responseQuery.set_viewXml('<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="ReqNum"/></OrderBy></Query></View>');
		m_responseItems = responseList.getItems( responseQuery );
		currCtx.load( m_responseItems, 'Include(ID, Title, ReqNum, ActionOffice, ReturnReason, SampleNumber, ResStatus, Comments, Modified, ClosedDate, ClosedBy, POC)' );

		//make sure to only pull documents (fsobjtype = 0)
		var responseDocsLib = web.get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleResponseDocs() );
		var responseDocsQuery = new SP.CamlQuery();	
		responseDocsQuery.set_viewXml('<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">0</Value></Eq></Where></Query></View>');
		m_ResponseDocsItems = responseDocsLib.getItems( responseDocsQuery );
		currCtx.load( m_ResponseDocsItems, 'Include(ID, Title, ReqNum, ResID, DocumentStatus, ReceiptDate, FileLeafRef, FileDirRef, File_x0020_Size, Modified, Editor)');

		var aoList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleActionOffices() );
		var aoQuery = new SP.CamlQuery();	
		aoQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>');
		m_aoItems = aoList.getItems( aoQuery );
		currCtx.load( m_aoItems, 'Include(ID, Title, UserGroup)');

		//Library GUIDS
		m_responseDocsLibrary = currCtx.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleResponseDocs() );
		currCtx.load(m_responseDocsLibrary , 'Title', 'Id');

    	ownerGroup = web.get_associatedOwnerGroup();
	 	memberGroup = web.get_associatedMemberGroup();
	 	visitorGroup = web.get_associatedVisitorGroup();

	 	currCtx.load( ownerGroup );
	 	currCtx.load( memberGroup );
	 	currCtx.load( visitorGroup);
	
		//Site Users
		m_groupColl = web.get_siteGroups();
		currCtx.load( m_groupColl );
	/*	 non - site collection user cant enumerate groups
		currCtx.load( m_groupColl, "Include(Users)");*/
	   	
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
		Audit.Common.Utilities.LoadSiteGroups( m_groupColl );
		LoadLibGUIDS();
		Audit.Common.Utilities.LoadActionOffices( m_aoItems );
				
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
		//LoadCoverSheets();			
		LoadResponseDocs();
		
		UpdateDDs( m_arrResponses );		

		$("#tabs").tabs().show();
				
		LoadTabStatusReport( m_arrResponses , "fbody" );

		
	/*	setTimeout( function()
		{
			m_fnOnLoadFilterResponses('1-Open', '3-Returned to Action Office');
		}, 2000 );*/
	}
	
	function IsUserAnIA()
	{
		var ownerSPGroup = Audit.Common.Utilities.GetSPSiteGroup( ownerGroup.get_title() );
		var memberSPGroup = Audit.Common.Utilities.GetSPSiteGroup( memberGroup.get_title() );
		var visitorSPGroup = Audit.Common.Utilities.GetSPSiteGroup( visitorGroup.get_title() );
		
		var bIsUserAnIA = false;
		if( ownerSPGroup != null )
		{
			var listEnumerator = ownerSPGroup.get_users().getEnumerator(); 
			while (listEnumerator.moveNext()) 
			{
				 var item = listEnumerator.get_current();							 
				 var loginName = item.get_loginName();
				 
				 if( loginName == m_currentUser.get_loginName() )
				 {
					bIsUserAnIA = true;
				 }
			}
		}

		if( !bIsUserAnIA && memberSPGroup != null )
		{
			var listEnumerator = memberSPGroup.get_users().getEnumerator(); 
			while (listEnumerator.moveNext()) 
			{
				 var item = listEnumerator.get_current();							 
				 var loginName = item.get_loginName();
				 
				 if( loginName == m_currentUser.get_loginName() )
				 {
					bIsUserAnIA = true;
				 }
			}
		}

		if( !bIsUserAnIA && visitorSPGroup != null )
		{
			var listEnumerator = visitorSPGroup.get_users().getEnumerator(); 
			while (listEnumerator.moveNext()) 
			{
				 var item = listEnumerator.get_current();							 
				 var loginName = item.get_loginName();
				 
				 if( loginName == m_currentUser.get_loginName() )
				 {
					bIsUserAnIA = true;
				 }
			}
		}

		return bIsUserAnIA;
	}
	
	function LoadLibGUIDS()
	{				
		Audit.Common.Utilities.SetResponseDocLibGUID( m_responseDocsLibrary.get_id() );
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
			
			var emailSent = oListItem.get_item('EmailSent');
			if( !emailSent )
				continue;
			
			var id = oListItem.get_item('ID');
			var number = oListItem.get_item('Title');
			var status = oListItem.get_item('ReqStatus');

			var subject = oListItem.get_item('ReqSubject');
			if( subject == null )
				subject = "";
				
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

			var internalDueDate = oListItem.get_item('InternalDueDate');
			var closedDate = oListItem.get_item('ClosedDate');
			
			internalDueDate != null ? internalDueDate = internalDueDate.format("MM/dd/yyyy") : internalDueDate = "";
			closedDate != null ? closedDate = closedDate.format("MM/dd/yyyy") : closedDate = "";


			var requestObject = new Object();
			requestObject ["ID"] = id;
			requestObject ["number"] = number;
			requestObject ["subject"] = subject;
			requestObject ["status"] = status;
			requestObject ["internalDueDate"] = internalDueDate;
			requestObject ["actionOffice"] = actionOffice;
			requestObject ["comments"] = comments;
			requestObject ["relatedAudit"] = relatedAudit;
			requestObject ["actionItems"] = actionItems;
			requestObject ["emailSent"] = emailSent;			
			requestObject ["closedDate"] = closedDate;											
			requestObject ["responses"] = new Array();
			
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
				if( !responseObject.request || !responseObject.request.emailSent ) //if request is null, then there's probably a permission issue
					continue; 

				responseObject ["actionOffice"] = oListItem.get_item('ActionOffice');						
				if( responseObject ["actionOffice"] == null )
					responseObject ["actionOffice"] = "";
				else
					responseObject ["actionOffice"] = responseObject ["actionOffice"].get_lookupValue();
				if( responseObject ["actionOffice"] == "" )
					continue;
									

				responseObject ["poc"] = oListItem.get_item('POC');						
				if( responseObject ["poc"] == null )
					responseObject ["poc"] = "";
				else
					responseObject ["poc"] = responseObject ["poc"].get_lookupValue();
									
									
				responseObject ["ID"] = oListItem.get_item('ID');
				responseObject ["number"] = number;
				
				var title = oListItem.get_item('Title');
				responseObject ["title"] = title;
				
				responseObject ["resStatus"] = oListItem.get_item('ResStatus');
				if( responseObject.request.status == "Closed" || responseObject.request.status == "Canceled" ) //make it appear that it's closed so that it doesnt confuse AO
					responseObject ["resStatus"] = "7-Closed"; 

				var modifiedDate = oListItem.get_item('Modified');
				var closedDate = oListItem.get_item('ClosedDate');

				modifiedDate != null ? modifiedDate = modifiedDate.format("MM/dd/yyyy hh:mm tt") : modifiedDate = "";
				closedDate != null ? closedDate = closedDate.format("MM/dd/yyyy") : closedDate = "";
				
				responseObject ["modified"] = modifiedDate;						
				responseObject ["closedDate"] = closedDate;						
				responseObject ["closedBy"] = Audit.Common.Utilities.GetFriendlyDisplayName( oListItem, "ClosedBy");
				
				responseObject ["sample"] = oListItem.get_item('SampleNumber');
				if( responseObject ["sample"] == null )
					responseObject ["sample"] = "";
					
				var comments = oListItem.get_item('Comments');
				if( comments == null )
					comments = "";
				responseObject ["comments"] = comments;
				
				var returnReason = oListItem.get_item('ReturnReason');
				if( returnReason == null ) returnReason = "";
				responseObject ["returnReason"] = returnReason;

				responseObject ["responseDocs"] = new Array();				
				responseObject ["coversheets"] = new Array();
				
				responseObject ["arrIndex"] = cnt;
				m_arrResponses.push( responseObject );
				
				m_bigMap[ "response-" + title ] = responseObject;
				cnt++;
			}
		}
	}
	
	function LoadResponseDocs()
	{						
		var listItemEnumerator = m_ResponseDocsItems.getEnumerator();
		while(listItemEnumerator.moveNext())
		{
			var oListItem = listItemEnumerator.get_current();
		
			responseDocID = oListItem.get_item('ID');
			
			var requestNumber = oListItem.get_item('ReqNum');
			if( requestNumber != null )
				requestNumber = requestNumber.get_lookupValue();
				
			var responseID = oListItem.get_item('ResID');
			if( responseID != null )
				responseID = responseID.get_lookupValue();				
				
			if( requestNumber == null || responseID == null )
				continue;

			if( oListItem.get_item('DocumentStatus') == "Marked for Deletion")//ao can mark a document for deletion, but their permissions do not have delete. IA will have to delete
			{
				//do  nothing
			}
			else
			{
				try
				{
					var bigMapItem = m_bigMap[ "response-" + responseID ];
					
					var indexOfArrResponses = bigMapItem.arrIndex;
					var oResponse = m_arrResponses [ indexOfArrResponses ];
					if( oResponse )
					{
						var responseDocObject = new Object();
						responseDocObject ["ID"] = oListItem.get_item('ID');
						responseDocObject ["title"] = oListItem.get_item('Title');
						if( responseDocObject ["title"] == null )
							responseDocObject ["title"] = "";
						responseDocObject ["fileName"] = oListItem.get_item('FileLeafRef');
						responseDocObject ["folder"] = oListItem.get_item('FileDirRef');
						responseDocObject ["documentStatus"] = oListItem.get_item('DocumentStatus');
												
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
						
						oResponse["responseDocs"].push( responseDocObject );
					}
				}catch( err ){}
			}
		}
	}
	
		
	function UpdateDDs( arr )
	{
		var arrOpenResponses = new Array();
		var arrProcessedResponses = new Array();
		
		if( arr == null )
			return;
			
		var arrLength = arr.length;	
//		for( var x = 0; x < arrLength; x++ )
		while ( arrLength-- ) 
		{
			var oResponse = arr[ arrLength ];
			
			var responseStatus = oResponse.resStatus;
			var requestStatus = oResponse.request.status;

			//here must check if request status is open. It could be that the request closed, but the responses are open to maintain the record			
			if(  (requestStatus == "Open" || requestStatus == "ReOpened" ) && ( responseStatus == "1-Open" || responseStatus == "3-Returned to Action Office") ) //the user must be in the action offic and the email by IA must have been sent for them to update
				arrOpenResponses.push( oResponse.title );
				
			else //the user must be in the action offic and the email by IA must have been sent for them to update
				arrProcessedResponses.push( oResponse.title );
		}
		
		Audit.Common.Utilities.AddOptions( arrOpenResponses , "#ddlResponsesOpen", false, true);
		Audit.Common.Utilities.AddOptions( arrProcessedResponses, "#ddlResponsesProcessed", false, true);
	}
		
	function LoadTabStatusReport(arr, fbody)
	{	
		var body = $('#' + fbody);
		body.empty();
		body.html('').hide();
		
		if( arr == null )
			return;

		//hide the row on load - the filter function will show it
		var myTmpl = $.templates('<tr class="sr-response-item {{if highlight}}highlighted{{/if}}" style="display:none"><td class="sr-response-title">{{:title}}</td><td class="sr-response-subject">{{:subject}}</td><td class="sr-response-internalDueDate">{{:internalDueDate}}</td><td class="sr-response-status">{{:status}}</td><td class="sr-response-docCount">{{:docCount}}</td><td class="sr-response-modified">{{:modified}}</td></tr>');
		var responseArr = new Array();
					
		var arrResponseTitle = new Array();
		var arrResponseInternalDueDate = new Array();
		var arrResponseStatus = new Array();

		var responseStatus1 = "1-Open";
		var responseStatus2 = "3-Returned to Action Office";
		
		var count = 0;
		var resStatus1 = 0;
		var resStatus2 = 0;
		
		var arrlength = arr.length;
//		var r = new Array(), j = -1;
//		for( var x = 0; x < arrlength; x++ )
		while ( arrlength-- ) 
		{
			var oResponse = arr[ arrlength ];
			
			var responseTitle = oResponse.title;
			var link = "<a href=\"javascript:void(0);\" title='Go to Response Details' onclick='Audit.Common.Utilities.GoToResponse(\"" + responseTitle + "\"," + false + ")'>" + responseTitle + "</a>";
			
			//output += '<tr class="sr-response-item"><td class="sr-response-title">' + link + '</td><td class="sr-response-internalDueDate">' + oResponse.request.internalDueDate + '</td><td class="sr-response-status">' + oResponse.resStatus + '</td><td class="sr-response-docCount">' + oResponse.responseDocs.length + '</td><td class="sr-response-modifiedDate">' + oResponse.modified + '</td></tr>';
			
			var highlight = false;
			var responseStatus = oResponse.resStatus;
			if( responseStatus == responseStatus1 || responseStatus == responseStatus2 )
			{
				count++;
			//	r[++j] = '<tr class="sr-response-item highlighted"><td class="sr-response-title">';
				if( responseStatus == responseStatus1 )
					resStatus1 ++;
				else
					resStatus2 ++;
					
				highlight = true;
			}
			/*else
				r[++j] = '<tr class="sr-response-item"><td class="sr-response-title">';
				
			r[++j] = link ;
			r[++j] = '</td><td class="sr-response-internalDueDate">' ;
			r[++j] = oResponse.request.internalDueDate;
			r[++j] = '</td><td class="sr-response-status">';
			r[++j] = responseStatus;
			r[++j] = '</td><td class="sr-response-docCount">';
			r[++j] = oResponse.responseDocs.length;
			r[++j] = '</td><td class="sr-response-modifiedDate">';
			r[++j] = oResponse.modified;
			r[++j] = '</td></tr>';
*/

			var aResponse = {highlight: highlight, 
				title: link, 
				subject: oResponse.request.subject, 
				internalDueDate: oResponse.request.internalDueDate, 
				status: responseStatus, 
				docCount: oResponse.responseDocs.length, 
				modified: oResponse.modified};
			responseArr.push( aResponse );

			if( !Audit.Common.Utilities.ExistsInArr( arrResponseTitle, responseTitle  ) )
				arrResponseTitle.push( responseTitle  );
				
			if( !Audit.Common.Utilities.ExistsInArr( arrResponseInternalDueDate, oResponse.request.internalDueDate) )
				arrResponseInternalDueDate.push( oResponse.request.internalDueDate );
				
			if( !Audit.Common.Utilities.ExistsInArr( arrResponseStatus, responseStatus ) )
				arrResponseStatus.push( responseStatus  );
		}
		
		var html = myTmpl.render( responseArr );
		body.html( html ).show();
		
		//body.append( r.join( '' ) );
	
		$("#spanResponsesTotal").text( arr.length );
		$("#spanResponsesDisplayedTotal").text( arr.length );
			
		setTimeout( function()
		{		
			Audit.Common.Utilities.OnLoadDisplayTimeStamp();	
			//LoadDDOptionsTbl();
			
			Audit.Common.Utilities.AddOptions( arrResponseTitle, "#ddlResponseName", false, true);
			Audit.Common.Utilities.AddOptions( arrResponseInternalDueDate, "#ddlResponseRequestInternalDueDate", false);
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

		LoadTabResponseInfo( oResponse );
		LoadTabResponseInfoCoverSheets( oResponse );
		LoadTabResponseInfoResponseDocs( oResponse );
	}
	
	function ClearResponseInfo()
	{		
		$("#requestInfoSubject").text( "" );
		$("#requestInfoInternalDueDate").text( "" );
		$("#requestInfoRelatedAudit").text( "" );
		$("#requestInfoActionItems").html( "" );

		$("#responseInfoName").text( "" );
		$("#responseInfoStatus").text( "" );
		$("#responseInfoAO").text( "" ).html( "" );
		$("#responseInfoComments").html( "" );

		$("#divResponseInfo").hide();
		$("#divCoverSheets").hide();
		$("#divResponseDocs").hide();
		$("#divUpload").html( "" );

		$("#divEmptyCoversheetsMsg").hide();
		$("#tblCoverSheets").hide();
		$("#tblResponseDocs").hide();
		
		$("#tblCoverSheetsTotal").text( "0" );
		$("#tblResponseDocsTotal").text( "0" );
		
		$("#tblCoverSheets tbody").empty();
		$("#tblResponseDocs tbody").empty();
	}
			
	function LoadTabResponseInfo( oResponse )
	{	
		$("#requestInfoSubject").text( oResponse.request.subject );
		$("#requestInfoInternalDueDate").text( oResponse.request.internalDueDate );
		$("#requestInfoRelatedAudit").text( oResponse.request.relatedAudit );
		$("#requestInfoActionItems").html( oResponse.request.actionItems );

		var status = oResponse.resStatus;
		if( oResponse.resStatus == "7-Closed" )
		{
			if( oResponse.closedDate ) 
				status = '<span style="color:red">' + status + " on " + oResponse.closedDate + " by " + oResponse.closedBy + '</span>';
			else //if response closed date is empty, then the request was closed before the response was closed
				status = '<span style="color:red">' + status + " on " + oResponse.request.closedDate + " by " + oResponse.request.closedBy + '</span>';
		}
		else if( oResponse.resStatus == "3-Returned to Action Office" && oResponse.returnReason != null && oResponse.returnReason != "" )
		{
			status = '<span style="color:red">' + status + '</span><div style="color:red; padding-top:10px">' + oResponse.returnReason + '</div>';
		}
		else
		{
			status = '<span style="color:green">' + status + '</span>';
		}

		var responseFolderAddLink = "<a title='Upload Response Documents' href='javascript:void(0)' onclick='Audit.AOReport.Report.UploadResponseDoc(\"" + oResponse.number + "\",\"" + oResponse.title  + "\")'><span class='ui-icon ui-icon-circle-arrow-n'></span>Upload Response Document</a>";
				
		if( m_curResponseSelectedIsEditableByAO )
		{
			$(".divUpload").html( responseFolderAddLink );
		}
		else
		{
			$(".divUpload").html( "" );
		}
		
		
		var ao = oResponse.actionOffice;	
		if( oResponse.poc != null && oResponse.poc != "" )
		{
		 	ao = '<span title="This response has a POC">' + ao + ' <span style="color:green">POC: ' + oResponse.poc + '</span></span>';
		}
		
		$("#responseInfoName").text( oResponse.title );
		$("#responseInfoAO").html( ao );
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

	
		/*var cnt = 0;
		var sCoverSheets = "";
		
		var arrCoverSheets = m_coversheets[ oResponse.request.number ];
		
		if( arrCoverSheets )
		{
			for( var y = 0; y < arrCoverSheets.length; y++ )
			{
				var oCoversheet = arrCoverSheets[y];
				
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
		var currCtx = new SP.ClientContext.get_current();
		var web = currCtx.get_web();
		
		$("#divResponseDocs").show();
		$("#tblResponseDocsTotal").text( 0 );
		
		for( var z = 0; z < oResponse.responseDocs.length; z++ )
		{
			var oResponseDoc = oResponse.responseDocs[z];
			
			//this loads on execute
			oResponseDoc ["docIcon"] =  web.mapToIcon( oResponseDoc.fileName, '', SP.Utilities.IconSize.Size16);// m_siteUrl + "/" + _spPageContextInfo.layoutsUrl + "/images/" + docIcon;
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
			var sReponseDocs = "";
			var cnt = 0;
			var cntAddedByAO = 0;

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
							
			for( var z = 0; z < arrResponseSummary.length; z++ )
			{
				var oResponseSummary = arrResponseSummary[z];

				sReponseDocs += '<tr class="requestInfo-response-doc"><td colspan="10"><img style="background-color: transparent;" src="/_layouts/images/minus.gif" title="Expand/Collapse"/>' + oResponseSummary.responseTitle + '</td></tr>';

				for( var p = 0; p < oResponseSummary.responseDocs.length; p++ )
				{					
					var oResponseDoc = oResponseSummary.responseDocs[p];
		
					var docIcon = "<img src= '" + Audit.Common.Utilities.GetSiteUrl() + "/_layouts/images/" + oResponseDoc.docIcon.get_value() + "'></img>";
					var link = "<a href='javascript:void(0)' onclick='STSNavigate(\"../_layouts/download.aspx?SourceUrl=" + oResponseDoc.folder + "/" + oResponseDoc.fileName + "\")'>" + oResponseDoc.fileName + "</a>";

					var deleteLink = "";

					if( oResponseDoc.documentStatus == "Open" && ( oResponse.resStatus == "1-Open" || oResponse.resStatus == "3-Returned to Action Office" ) )
					{
						deleteLink = "<span style='float:right'><a title='Delete Response Document' href='javascript:void(0)' onclick='Audit.AOReport.Report.MarkForDeletionResponseDoc(\"" + oResponseDoc.ID + "\")'><span class='ui-icon ui-icon-trash'>Delete Response Document</span></a></span>";
						cntAddedByAO ++;
					}
					
					//dont color code for AO because it may confuse them
					//var styleTag = Audit.Common.Utilities.GetResponseDocStyleTag(oResponseDoc.documentStatus);
					sReponseDocs += '<tr class="requestInfo-response-doc-item">' + 
						'<td>' + docIcon + '</td>' +
						'<td class="requestInfo-response-doc-title" title="Click to Download">' + link  + deleteLink + '</td>' +
						'<td nowrap>' + oResponseDoc.title + '</td>' +
						'<td nowrap>' + oResponseDoc.receiptDate + '</td>' +
						'<td nowrap>' + oResponseDoc.fileSize + '</td>' +
						'<td class="requestInfo-response-doc-modified">' + oResponseDoc.modifiedDate + '</td>' +
						'<td class="requestInfo-response-doc-modifiedBy">' + oResponseDoc.modifiedBy + '</td>' +
					'</tr>';
					cnt++;
				}
			}
		
			$("#tblResponseDocs tbody").append( sReponseDocs );
			if( cnt > 0 )
			{
				$("#tblResponseDocsTotal").text( cnt );
				$("#tblResponseDocs").show();
				
				if( m_curResponseSelectedIsEditableByAO )
				{
					if( cntAddedByAO > 0 )
						$(".divSubmit").show();
					$(".two").show();
				}
			}
			else
			{
				$(".two").hide();
			}
			
			if( oResponse.resStatus == "3-Returned to Action Office" && oResponse.returnReason != null && oResponse.returnReason != "" )
			{	
				if( m_curResponseSelectedIsEditableByAO && cntAddedByAO == 0)
				{
					//notifyId = SP.UI.Notify.addNotification("Response Return Reason: " + oResponse.returnReason, false);
					var waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose("Notice - Response Needs to be Updated", "<span style=''><span class='ui-icon ui-icon-alert'></span>Response Return Reason: <span style='font-weight:bold; color:red;'>" + oResponse.returnReason + "</span></span>", 100, 500);
					setTimeout( function()
					{
						waitDialog.close();
					}, 5000 );
				}
			}
			
			
			if( oResponse.resStatus == "1-Open" || oResponse.resStatus == "3-Returned to Action Office" )
			{	
				if( m_curResponseSelectedIsEditableByAO && cntAddedByAO > 0)
				{
					//notifyId = SP.UI.Notify.addNotification("Response documents have been added, please remember to SUBMIT your Response Package", false);
					notifyId = SP.UI.Notify.addNotification("<div style='text-align:left'>Response documents have been added. <br/><br/>Your package <span style='font-weight:bold; color:red'>has not yet been submitted</span>. <br></br>Please review your documents and click on the link <b>SUBMIT this Response Package</b> below</div>", false);
					
					
					$(".btnSubmitPackage").parent().css({"background-color": "yellow", "font-weight": "inherit"});
					$(".btnSubmitPackage").get(0).scrollIntoView();
					
					function resetColor()
					{
						$(".btnSubmitPackage").parent().css({"background-color": "inherit", "font-weight": "inherit"});
					}
					setTimeout(function(){resetColor()}, 2000);
				}
				else if( m_curResponseSelectedIsEditableByAO && cntAddedByAO == 0 )
				{
					notifyId = SP.UI.Notify.addNotification("<div style='text-align:left'>Please review the Response Information and any CoverSheets/Supplemental Documents. <br/><br/>Then, click the link to <span style='font-weight:bold; color:gree'>Upload Response Documents</span> pertaining to this Response</div>", false);
				}
			}

			
			Audit.Common.Utilities.BindHandlerResponseDoc();
		}
	}
	
	function m_fnFormatEmailBodyToIAFromAO( oRequest, responseTitle )
	{
		var emailText = "<div>Audit Request Reference: <b>REQUEST_NUMBER</b></div>" +
			"<div>Audit Request Subject: <b>REQUEST_SUBJECT</b></div>" +		
			"<div>Audit Request Due Date: <b>REQUEST_DUEDATE</b></div><br/>" +		
			"<div>Below is the Response that was submitted: </div>" +
			"<div>RESPONSE_TITLE</div>" ;

		emailText = emailText.replace("REQUEST_NUMBER", oRequest.number );
		emailText = emailText.replace("REQUEST_SUBJECT", oRequest.subject );
		emailText = emailText.replace("REQUEST_DUEDATE", oRequest.internalDueDate );
		emailText = emailText.replace("REQUEST_ACTIONITEMS", oRequest.actionItems );	
		
		var responseTitleBody = "<ul><li>" + responseTitle + "</li></ul>";
		emailText = emailText.replace("RESPONSE_TITLE", responseTitleBody );	

		return emailText;
	}

	function m_fnUploadResponseDoc( requestID, responseID )
	{
		m_bIsTransactionExecuting = true;

//		notifyId = SP.UI.Notify.addNotification("<span style='font-size:11pt'><span class='ui-icon ui-icon-info'></span>Please <span style='font-weight:bold; color:green'>zip</span> the documents you are uploading.</span>", false);
		var waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose("Loading...", "<span style='font-size:11pt'><span class='ui-icon ui-icon-info'></span>If you are uploading <span style='font-weight:bold; color:green;text-decoration:underline'>multiple</span> documents, please <span style='font-weight:bold; color:green;text-decoration:underline'>zip </span> them.</span>", 100, 600);
		
		setTimeout( function()
		{
			waitDialog.close();
			
			var options = SP.UI.$create_DialogOptions();	
			options.title = "Upload Response Document to: " +  responseID ;
			options.dialogReturnValueCallback = OnCallbackForm;
	
			//this subfolder should have been created when the response was created
			var rootFolder = Audit.Common.Utilities.GetSiteUrl() + "/" + Audit.Common.Utilities.GetLibNameResponseDocs() + "/" + responseID;
			options.url = Audit.Common.Utilities.GetSiteUrl() + "/_layouts/Upload.aspx?List={" + Audit.Common.Utilities.GetResponseDocLibGUID() + "}&RootFolder=" + rootFolder + "&ReqNum=" + requestID + "&ResID=" + responseID;
			//notifyId = SP.UI.Notify.addNotification("Uploading documents to: " + options.url, false)
			SP.UI.ModalDialog.showModalDialog(options);
		}, 3000);
	}		
	
	function OnCallbackForm(result, value)
	{
		if (result === SP.UI.DialogResult.OK) 
		{
			Audit.Common.Utilities.Refresh();
		}
		else
			m_bIsTransactionExecuting = false;
	}

	function m_fnSubmitPackage()
	{
		var responseToSubmit = $("#ddlResponsesOpen").val();
		if( confirm("Are you sure you would like to submit these response documents? Note: You will NOT be able to make changes or upload any more documents after you submit this package."))
		{
			m_bIsTransactionExecuting = true;
			
			m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose("Submitting Response", "Please wait... Submitting Response", 200, 400);
			
		    var currCtx = new SP.ClientContext.get_current();
		  	var web = currCtx.get_web();
		  	
			var folderPath = Audit.Common.Utilities.GetSiteUrl() + "/" + Audit.Common.Utilities.GetLibNameResponseDocs() + "/" + responseToSubmit;
			var responseDocLib = web.get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleResponseDocs() );
			var responseDocQuery = new SP.CamlQuery();
		    responseDocQuery.set_viewXml('<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name=\'FileDirRef\'/><Value Type=\'Text\'>' + folderPath + '</Value></Eq><Eq><FieldRef Name=\'DocumentStatus\'/><Value Type=\'Text\'>Open</Value></Eq></And></Where></Query></View>');
		  	responseDocOpenItems = responseDocLib.getItems( responseDocQuery );
			currCtx.load ( responseDocOpenItems, "Include(ID, DocumentStatus, FileDirRef)");
		

			var emailList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleEmailHistory() );
			var emailListQuery = new SP.CamlQuery();	
			emailListQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>');
			emailListFolderItems = emailList.getItems( emailListQuery );
			currCtx.load( emailListFolderItems, 'Include(ID, Title, DisplayName)');
			
			function OnSuccessLoadedResponseDocs(sender, args)
			{	
				var ctOpenResponseDocs = 0;	
				if( responseDocOpenItems != null )
				{
					var listItemEnumerator = responseDocOpenItems.getEnumerator();
					while(listItemEnumerator.moveNext())
					{
						var oListItem = listItemEnumerator.get_current();
						oListItem.set_item("DocumentStatus", "Submitted");
						oListItem.update();		
						ctOpenResponseDocs++;
					}
				}
				
				if( ctOpenResponseDocs == 0 )
				{
					notifyId = SP.UI.Notify.addNotification("Please upload a Response document.", false);
					m_waitDialog.close();
					return;
				}

				var oRequest = null;
				try
				{
					var bigMapItem = m_bigMap[ "response-" + responseToSubmit ];
					var indexOfArrResponses = bigMapItem.arrIndex;
					oResponse = m_arrResponses [ indexOfArrResponses ];
					if( oResponse )
					{	
						oRequest = oResponse.request;
						
						var responseList = currCtx.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetListTitleResponses());
						responseItem = responseList.getItemById( oResponse.ID );						
						responseItem.set_item("ResStatus", "2-Submitted");
						responseItem.update();	
					}
				}
				catch( err )
				{ 
					alert( err ); 
					Audit.Common.Utilities.Refresh();
				}
				
				if( oRequest == null )
				{
					m_waitDialog.close();
					return;
				}	
						    	
		    	var emailSubject = "A Response has been Submitted by an Action Office: " + oRequest.number;
				var emailText = m_fnFormatEmailBodyToIAFromAO( oRequest, responseToSubmit );			 		
					
				var itemCreateInfo = new SP.ListItemCreationInformation();
			    itemCreateInfo.set_folderUrl( location.protocol + "//" + location.host + Audit.Common.Utilities.GetSiteUrl() + "/Lists/" + Audit.Common.Utilities.GetListNameEmailHistory() + "/" + oRequest.number );				    
			    oListItem = emailList.addItem( itemCreateInfo );
			    oListItem.set_item('Title', emailSubject);
			    oListItem.set_item('Body', emailText);
			    oListItem.set_item('To', m_IA_SPGroupName );
			    oListItem.set_item('ReqNum', oRequest.number );
 	  			oListItem.set_item('ResID', responseToSubmit );
 				oListItem.set_item('NotificationType', "IA Notification" );
			    oListItem.update();	

				function OnSuccessUpdateResponse(sender, args)
				{		
					document.body.style.cursor = 'default';
					m_waitDialog.close();
					Audit.Common.Utilities.Refresh();	
				}		
				function OnFailureUpdateResponse(sender, args)
				{
					m_waitDialog.close();
					statusId = SP.UI.Status.addStatus("Request failed: "  + args.get_message() + "\n" + args.get_stackTrace());
		   			SP.UI.Status.setStatusPriColor(statusId, 'red');
				}		
					
				currCtx.executeQueryAsync(OnSuccessUpdateResponse, OnFailureUpdateResponse);
			}	
			
			function OnFailureLoadedResponseDocs(sender, args)
			{
				m_waitDialog.close();
				statusId = SP.UI.Status.addStatus("Request failed: "  + args.get_message() + "\n" + args.get_stackTrace());
	   			SP.UI.Status.setStatusPriColor(statusId, 'red');
			}
			
			currCtx.executeQueryAsync(OnSuccessLoadedResponseDocs, OnFailureLoadedResponseDocs);					
		}
	}
	
	function m_fnMarkForDeletionResponseDoc( itemID )
	{
		if( confirm("Are you sure you would like to Delete this Response Document?") )
		{
			var currCtx = new SP.ClientContext(); 
			var responseDocsLib = currCtx.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetLibNameResponseDocs() );

		    oListItem = responseDocsLib.getItemById( itemID );
		    oListItem.set_item("DocumentStatus", "Marked for Deletion");
		    oListItem.update();		
		
			function OnSuccess(sender, args)
			{		
				Audit.Common.Utilities.Refresh();	
			}		
			function OnFailure(sender, args)
			{
				statusId = SP.UI.Status.addStatus("Request failed: "  + args.get_message() + "\n" + args.get_stackTrace());
	   			SP.UI.Status.setStatusPriColor(statusId, 'red');
			}
			currCtx.executeQueryAsync(OnSuccess, OnFailure);	
		}
	}

		
	function LoadDDOptionsTbl()
	{					
		var arrResponseTitle = new Array();
		var arrResponseInternalDueDate = new Array();
		var arrResponseStatus = new Array();

		var eacher = $(".sr-response-title");
		eacher.each(function()
		{
			var val = $(this).text();
			
			//if( !Audit.Common.Utilities.ExistsInArr( arrResponseTitle, val ))
			arrResponseTitle.push( val );
		});

		var eacher = $(".sr-response-internalDueDate");
		eacher.each(function()
		{
			var val = $(this).text();
			
			if( !Audit.Common.Utilities.ExistsInArr( arrResponseInternalDueDate, val ))
				arrResponseInternalDueDate.push( val );
		});
		
		var eacher = $(".sr-response-status");
		eacher.each(function()
		{
			var val = $(this).text();

			if( !Audit.Common.Utilities.ExistsInArr( arrResponseStatus, val ))
				arrResponseStatus.push( val );
		});
		
		Audit.Common.Utilities.AddOptions( arrResponseTitle, "#ddlResponseName", false, true);
		Audit.Common.Utilities.AddOptions( arrResponseInternalDueDate, "#ddlResponseRequestInternalDueDate", false);
		Audit.Common.Utilities.AddOptions( arrResponseStatus, "#ddlResponseStatus", false);
	}

	function BindTableSorter( rowCount, tableName)
	{	
		if( rowCount > 0 )
		{
			setTimeout( function()
			{
				$( "#" + tableName ).tablesorter(
				{
					//sortList: [[0,0],[2,0],[4,0]],
					//sort on hidden column modified 
					sortList: [[2,0]],				
					selectorHeaders: '.sorter-true'
				}); 
			}, 100 );
		}
	}
				
	function BindHandlersOnLoad()
	{
		$("#ddlResponsesOpen").change(function()
		{
			$("#ddlResponsesProcessed").val("");
			
			/*var response = $(this).val();
			if( response )
				$(".divSubmit").show();
			else*/
			//always hide until documents have been uploaded
			$(".divSubmit").hide();
			
			m_curResponseSelectedIsEditableByAO = true;	
			LoadResponseInfo( $(this).val() );		
			
		});
		
		$("#ddlResponsesProcessed").change(function()
		{
			$("#ddlResponsesOpen").val("");
			$(".divSubmit").hide();
			m_curResponseSelectedIsEditableByAO = false;	
			LoadResponseInfo( $(this).val() );
		});
				
		$("#btnViewAll").click(function()
		{
			m_fnClearFilterResponses();
		});

		$(".btnSubmitPackage").click(function()
		{
			m_fnSubmitPackage();
		});
		
		$( "#ddlResponseRequestInternalDueDate, #ddlResponseName, #ddlResponseStatus" ).change(function()
		{
			document.body.style.cursor = 'wait';
			setTimeout( function(){ m_fnFilterResponses()}, 200 );
		});

		BindPrintButton("#btnPrint1", "#divStatusReportRespones", "Action Office Response Status Report");
		//////////Note: for the export to work, make sure this is added to the html: <iframe id="CsvExpFrame" style="display: none"></iframe>
		BindExportButton(".export1", "AOResponseStatusReport_", "tblStatusReportResponses");

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
	

	function m_fnOnLoadFilterResponses( responseStatus1, responseStatus2 )
	{
		var count = 0;
		var resStatus1 = 0;
		var resStatus2 = 0;

		var eacher = $(".sr-response-item");
		eacher.each(function() 
		{							
			var resStatus =  $.trim( $(this).find(".sr-response-status").text() );
			
			if( (resStatus == responseStatus1 || resStatus == responseStatus2) )
			{
				$(this).addClass("highlighted");				
				count++;
				
				if( resStatus == responseStatus1)
					resStatus1 ++;
				else if( resStatus == responseStatus2)
					resStatus2 ++;
			}
		});

		if( count > 0)
		{
			$("#lblStatusReportResponsesMsg").html("<span class='ui-icon ui-icon-alert'></span>There are " + count + " Responses pending your review");
			
			if( resStatus1 > 0 && resStatus2 == 0 )
				$("#ddlResponseStatus").val( responseStatus1 ).change();
			else if( resStatus2 > 0 && resStatus1 == 0 )
				$("#ddlResponseStatus").val( responseStatus2 ).change();			
		}		
		else
			$("#lblStatusReportResponsesMsg").html("<span class='ui-icon ui-icon-circle-check'></span>There are 0 Responses pending your review");
	}

	function m_fnClearFilterResponses()
	{
		document.body.style.cursor = 'wait';
		
		$("#ddlResponseName").val("");
		$("#ddlResponseRequestInternalDueDate").val("");
		$("#ddlResponseStatus").val("");
		
		setTimeout( function(){ m_fnFilterResponses()}, 200 );
	}

	//Captures the values from all of the drop downs and uses them to filter the rows
	function m_fnFilterResponses() 
	{			
		var responseName = $("#ddlResponseName").val();
		var dueDate = $("#ddlResponseRequestInternalDueDate").val();
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
			
			if( !hide && responseName!= "" && $.trim( $(this).find(".sr-response-title").text() ) != responseName)
			{
				hide = true;				
			}		
			if( !hide && dueDate != "" && $.trim( $(this).find(".sr-response-internalDueDate").text() ) != dueDate )
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
				cntVisible ++;
			}
		});
		
		//Get the number of rows currently displayed and output that number to the user
	    var numOfVisibleRows = cntVisible; //this wont work if on another tab and refreshed $('.sr-response-item:visible').length;
	    var numRows = cntRows; //$('.sr-response-item').length;

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
		IsTransactionExecuting: function(){ return m_bIsTransactionExecuting; },
		MarkForDeletionResponseDoc: function(itemID){ m_fnMarkForDeletionResponseDoc(itemID); },
		UploadResponseDoc: function(requestID, responseID){ m_fnUploadResponseDoc(requestID, responseID); }
	}
	
	return publicMembers;
}
