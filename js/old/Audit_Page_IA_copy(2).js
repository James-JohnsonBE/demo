var Audit = window.Audit || {};
Audit.IAReport = Audit.IAReport || {};

ExecuteOrDelayUntilScriptLoaded(InitReport, "sp.js");	

function InitReport() 
{    

	/*********NOTE: the Contribute permission level needs to have manage permissions turned on ************/

	Audit.IAReport.Report = new Audit.IAReport.NewReportPage();
	Audit.IAReport.Init();
}

Audit.IAReport.Init = function()
{
	function SetTimer()
	{
		var intervalRefreshID = setInterval(function() {
		    var divVal = $("#divCounter").text();
		    var count = divVal * 1 - 1;
		    $("#divCounter").text(count);
			if (count <= 0) 
			{
				if( !Audit.IAReport.Report.IsTransactionExecuting() )
					Audit.IAReport.Report.Refresh();
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

Audit.IAReport.NewReportPage = function ()
{			
	var m_libCoverSheetLibraryGUID = null; //set below
	var m_libRequestDocsLibraryGUID = null; //set below
	var m_libResponseDocsLibraryGUID = null; //set below

	var m_arrRequests = new Array();
	var m_arrRequestsToClose = new Array();
	var m_arrResponseDocsCheckedOut = new Array();
	var m_arrPermissionsResponseFolders = new Array();
	
	var m_itemID = null;
	var m_requestNum = null;
	var m_responseTitle = null;
	var m_responseStatus = null;
		
	var m_bIsTransactionExecuting = false;	
	var m_statusId = null;
	
	var m_bIsSiteOwner = true;
	var m_sGoToResponseTitle = null;
	
	LoadInfo();
		
	function LoadInfo()
	{		
		var currCtx = new SP.ClientContext.get_current();
		var web = currCtx.get_web();
		
		var requestList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleRequests() );
		var requestQuery = new SP.CamlQuery();	
		requestQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>');
		m_requestItems = requestList.getItems( requestQuery );
		//need to check permissions because of displaying special perms and granting special perms
		//currCtx.load( m_requestItems, 'Include(ID, Title, ReqSubject, ReqStatus, IsSample, ReqDueDate, InternalDueDate, ActionOffice, EmailActionOffice, Reviewer, Owner, ReceiptDate, MemoDate, RelatedAudit, ActionItems, Comments, EmailSent, ClosedDate, ClosedBy, Modified, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))');
		currCtx.load( m_requestItems, 'Include(ID, Title, ReqSubject, ReqStatus, IsSample, ReqDueDate, InternalDueDate, ActionOffice, EmailActionOffice, Reviewer, Owner, ReceiptDate, MemoDate, RelatedAudit, ActionItems, Comments, EmailSent, ClosedDate, ClosedBy, Modified)');
		
		var responseList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleResponses() );
		var responseQuery = new SP.CamlQuery();	
		responseQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="ReqNum"/></OrderBy></Query></View>');
		m_responseItems = responseList.getItems( responseQuery );
		//need to check permissions because of granting/removing special perms
		//currCtx.load( m_responseItems, 'Include(ID, Title, ReqNum, ActionOffice, ReturnReason, SampleNumber, ResStatus, Comments, Modified, ClosedDate, ClosedBy, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))' );
		currCtx.load( m_responseItems, 'Include(ID, Title, ReqNum, ActionOffice, ReturnReason, SampleNumber, ResStatus, Comments, Modified, ClosedDate, ClosedBy)' );

		//make sure to only pull documents (fsobjtype = 0)
		var responseDocsLib = web.get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleResponseDocs() );
		var responseDocsQuery = new SP.CamlQuery();	
		responseDocsQuery.set_viewXml('<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="ReqNum"/><FieldRef Name="ResID"/></OrderBy><Where><Eq><FieldRef Name="ContentType"/><Value Type="Text">Document</Value></Eq></Where></Query></View>');
		m_ResponseDocsItems = responseDocsLib.getItems( responseDocsQuery );
		currCtx.load( m_ResponseDocsItems, 'Include(ID, Title, ReqNum, ResID, DocumentStatus, RejectReason, ReceiptDate, FileLeafRef, FileDirRef, File_x0020_Size, CheckoutUser, Modified, Editor)');
		
		m_groupColl = web.get_siteGroups();
		currCtx.load( m_groupColl );

		var aoList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleActionOffices() );
		var aoQuery = new SP.CamlQuery();	
		aoQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>');
		m_aoItems = aoList.getItems( aoQuery );
		currCtx.load( m_aoItems, 'Include(ID, Title, UserGroup)');
		
		currCtx.executeQueryAsync(OnSuccess, OnFailure);	
		function OnSuccess(sender, args)
		{					
			//FYI: Split this up because this function will fail if a user in the visitors group is on this page
			var currCtx = new SP.ClientContext.get_current();
			var web = currCtx.get_web();
			
			//make sure to only pull documents (fsobjtype = 0)
			var pagesLib = web.get_lists().getByTitle( "Pages" );
			var pagesQuery = new SP.CamlQuery();	
			pagesQuery.set_viewXml('<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="FileLeafRef"/><Value Type="Text">AO_DB.aspx</Value></Eq></Where></Query></View>');
			m_PageItems = pagesLib.getItems( pagesQuery);
			currCtx.load( m_PageItems, 'Include(ID, Title, FileLeafRef, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))');
			
			function OnSuccessLoadPages(sender, args)
			{
				$("#divIA").show();
				//if they can iterate the pages and the permissions on the pages, we'll consider them a site owner
				m_bIsSiteOwner = true;
				m_fnLoadData();	
				m_fnResetAODBPerms( m_PageItems );
			}
			function OnFailureLoadPages(sender, args)
			{
				$("#divIA").show();
				m_bIsSiteOwner = false;
				m_fnLoadData();	
			}
			currCtx.executeQueryAsync(OnSuccessLoadPages, OnFailureLoadPages);	

			setTimeout( function(){ m_fnLoadRemainder();}, 100 );
		}		
		function OnFailure(sender, args)
		{
			$("#divLoading").hide();
			statusId = SP.UI.Status.addStatus("Request failed: "  + args.get_message() + "\n" + args.get_stackTrace());
   			SP.UI.Status.setStatusPriColor(statusId, 'red');
   			m_bIsSiteOwner = false;
		}
	}	
	
	function m_fnRefresh( requestNumber )
	{
		var curPath = location.pathname;
	
		if( !requestNumber )
		{	
			var tabIndex = $("#tabs").tabs('option', 'active');
			curPath += "?Tab=" + tabIndex;
	
			if( tabIndex == 1 )
			{				
				var responseName = $("#ddlResponseName").val();
				if( responseName != null && responseName!= "" )
					curPath += "&ResNum=" + responseName;
			}
			else if( tabIndex == 2 )
			{
				var requestNum = $("#ddlReqNum").val();
				if( requestNum != null && requestNum != "" )
					curPath += "&ReqNum=" + requestNum;
			}
			location.href = curPath;
		}
		else
		{
			var curPath = location.pathname;
			
			var tabIndex = $("#tabs").tabs('option', 'active');
			curPath += "?Tab=" + tabIndex;
	
			if( requestNumber != null && requestNumber != "")
				curPath += "&ReqNum=" + requestNumber ;
			
			location.href = curPath;
		}
	}
	
	function m_fnLoadData()
	{
		Audit.Common.Utilities.LoadSiteGroups( m_groupColl );
		Audit.Common.Utilities.LoadActionOffices( m_aoItems );

		LoadRequests();
		LoadResponses();
		
		UpdateDDs( m_arrRequests );
		
		
		DisplayRequestsThatShouldClose();
		DisplayCheckedOutFiles ( m_arrResponseDocsCheckedOut );
		
		LoadTabStatusReport1( m_arrRequests, "fbody1" );
		var displayResponsesCnt = LoadTabStatusReport2( m_arrRequests, "fbody2" );
	
		//put this after loading tab 1 and tab 2
		LoadResponseDocs();
		BindTableSorter( 0, m_arrRequests.length, "tblStatusReportRequests"); //do this after updating the response doc count on tab1 so that sorting on column works
		BindTableSorter( 1, displayResponsesCnt, "tblStatusReportResponses"); //do this after updating the response doc count on tab2 so that sorting on column works
	
		LoadDDOptionsTbl();

		BindHandlersOnLoad();		
		
		$("#tabs").tabs().show();
		
		Audit.Common.Utilities.OnLoadDisplayTimeStamp();
		OnLoadDisplayTabAndRequest();		
	}
	
	function m_fnLoadRemainder()
	{		
		var currCtx = new SP.ClientContext.get_current();
		var web = currCtx.get_web();
		
		m_coversheetDocsLibrary = currCtx.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleCoverSheets() );
		currCtx.load( m_coversheetDocsLibrary, 'Title', 'Id');

		m_requestDocsLibrary = currCtx.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleRequestDocs() );
		currCtx.load( m_requestDocsLibrary , 'Title', 'Id');

		m_responseDocsLibrary = currCtx.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleResponseDocs() );
		currCtx.load( m_responseDocsLibrary , 'Title', 'Id');

		function OnSuccess(sender, args)
		{				
			LoadLibGUIDS();
		}		
		function OnFailure(sender, args)
		{
			statusId = SP.UI.Status.addStatus("Failed loading: "  + args.get_message() + "\n" + args.get_stackTrace());
   			SP.UI.Status.setStatusPriColor(statusId, 'red');
		}
		currCtx.executeQueryAsync(OnSuccess, OnFailure);	
	}

	//always check ao permissions and reset them
	function m_fnResetAODBPerms( pageItems )
	{
		var listItemEnumerator = pageItems.getEnumerator();
		while(listItemEnumerator.moveNext())
		{
			var oListItem = listItemEnumerator.get_current();
				    
			var bReset = false;
			
			if( !oListItem.get_hasUniqueRoleAssignments() )
				bReset = true;

			var arrAOs = Audit.Common.Utilities.GetActionOffices();	
			
			if( !bReset ) // check to see if all action offices have access to the AO_DB.aspx page
			{
				if( arrAOs != null )
				{		
					for( var x = 0; x < arrAOs.length; x++ )
					{					
						var bFound = false;
						
						var actionOfficeGroup = arrAOs[x].userGroup;
						if( actionOfficeGroup != null && actionOfficeGroup != "" )
						{
							var roleAssignments = oListItem.get_roleAssignments();
							var rolesEnumerator = roleAssignments.getEnumerator();
							while(rolesEnumerator.moveNext())
							{
								var role = rolesEnumerator.get_current();
								var roleMember = role.get_member();
								var memeberLoginName = roleMember.get_loginName();
								var memberTitleName = roleMember.get_title();
							
								if( memberTitleName == actionOfficeGroup )
									bFound = true;
							}	
							
							if( !bFound )
							{
								bReset = true;
								break;
							}	
						}
					}
				}
			}

			if( bReset ) //if at least one doesnt have access, reset the permissions on that page
			{	    			
				var currCtx = new SP.ClientContext.get_current();
				var web = currCtx.get_web(); 
				
				this.currentUser = web.get_currentUser();
		    	this.ownerGroup = web.get_associatedOwnerGroup();
			 	this.memberGroup = web.get_associatedMemberGroup();
			 	this.visitorGroup = web.get_associatedVisitorGroup();

				oListItem.resetRoleInheritance();
				oListItem.breakRoleInheritance( false, false );
	
				var roleDefBindingCollContribute = SP.RoleDefinitionBindingCollection.newObject( currCtx );
				roleDefBindingCollContribute.add( web.get_roleDefinitions().getByType( SP.RoleType.contributor) );
		
			    var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject( currCtx );
				roleDefBindingCollRestrictedRead.add( web.get_roleDefinitions().getByName("Restricted Read") );
		
				//add owner group
				oListItem.get_roleAssignments().add( ownerGroup, roleDefBindingCollContribute);
		
				//add member group
				oListItem.get_roleAssignments().add( memberGroup, roleDefBindingCollContribute );
				
				//add visitor group
				oListItem.get_roleAssignments().add( visitorGroup, roleDefBindingCollRestrictedRead );
				
				oListItem.get_roleAssignments().getByPrincipal( currentUser ).deleteObject();
				
				//Need to break up adding AOs because it exceeds the resource limit (request uses too many resources)
				function onUpdatAOPageSucceeded() 
				{
					//add action offices			
					if( arrAOs != null )
					{
						for( var x = 0; x < arrAOs.length; x++ )
						{											
							var actionOfficeGroupName = arrAOs[x].userGroup;
							var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup( actionOfficeGroupName );
		
							if( actionOfficeGroup != null && actionOfficeGroup != "" )
							{
								var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject( currCtx );
								roleDefBindingCollRestrictedRead.add( web.get_roleDefinitions().getByName("Restricted Read") );
				
								oListItem.get_roleAssignments().add( actionOfficeGroup, roleDefBindingCollRestrictedRead );	
								
								function onUpdatAOPageSucceeded2() 
								{
									
								}
								function onUpdatAOPageFailed2(sender, args) 
								{		
									//statusId = SP.UI.Status.addStatus("Request failed: "  + args.get_message() + "\n" + args.get_stackTrace());
								}
			    				currCtx.executeQueryAsync(Function.createDelegate(data, onUpdatAOPageSucceeded2), Function.createDelegate(data, onUpdatAOPageFailed2));

							}
						}			
					}				
				}
				
				function onUpdatAOPageFailed(sender, args) 
				{		
					statusId = SP.UI.Status.addStatus("Request failed: "  + args.get_message() + "\n" + args.get_stackTrace());
				}
		
				var data = {item: oListItem};			
			    currCtx.executeQueryAsync(Function.createDelegate(data, onUpdatAOPageSucceeded), Function.createDelegate(data, onUpdatAOPageFailed));
			}
			break;
		}
	}
	
	
	
	//QA doesnt have edit permissions rights on the response/response folder
	//Therefore, when IA gets alerted that the response has been updated by QA, check if response status is updated
	//and then update the permissions
	function m_fnCheckIfResponsePermissionsNeedUpdating ( requestStatus, title, OnCompletedChecking )
	{ 		
		for( var x = 0; x < m_arrRequests.length; x++ )
		{
			var oRequest = m_arrRequests[x];
			for( var y = 0; y < oRequest.responses.length; y++ )
			{
				if( oRequest.responses[y].title == title )
				{
					var doneBreakingResponse = false;
					m_fnBreakResponseAndFolderPermissions( requestStatus, oRequest.responses[y], false, true, function(doneBreakingResponse )
					{
						OnCompletedChecking ( true );
					});
				}
			}
		}
	}
	
	function OnLoadDisplayTabAndRequest()
	{		
		var paramTabIndex = GetUrlKeyValue("Tab");
		if( paramTabIndex != null && paramTabIndex != "" )
		{
			$("#tabs").tabs("option", "active", paramTabIndex);
		}

		if( paramTabIndex == 1 )
		{
			var paramResponseNum = GetUrlKeyValue("ResNum");
			if( paramResponseNum != null && paramResponseNum != "" )
			{
				$("#ddlResponseName").val( paramResponseNum ).change();
			}
		}
		else
		{
			var paramRequestNum = GetUrlKeyValue("ReqNum");
			if( paramRequestNum != null && paramRequestNum != "" )
			{
				$("#ddlReqNum").val( paramRequestNum ).change();
			}
		}	
	}

	function LoadRequests()
	{
		m_arrRequests = new Array();
				
		try
		{
			var listItemEnumerator = m_requestItems.getEnumerator();
			while(listItemEnumerator.moveNext())
			{
				var oListItem = listItemEnumerator.get_current();
				
				var id = oListItem.get_item('ID');
				var number = oListItem.get_item('Title');
				var status = oListItem.get_item('ReqStatus');
	
				var subject = oListItem.get_item('ReqSubject');
				if( subject == null )
					subject = "";
					
				var sample = oListItem.get_item('IsSample');
	
				var dueDate = oListItem.get_item('ReqDueDate');
				var internalDueDate = oListItem.get_item('InternalDueDate');
				var receiptDate = oListItem.get_item('ReceiptDate');
				var memoDate = oListItem.get_item('MemoDate');
				var closedDate = oListItem.get_item('ClosedDate');
	
				dueDate != null ? dueDate = dueDate.format("MM/dd/yyyy") : dueDate = "";
				internalDueDate != null ? internalDueDate = internalDueDate.format("MM/dd/yyyy") : internalDueDate = "";
				receiptDate != null ? receiptDate = receiptDate.format("MM/dd/yyyy") : receiptDate= "";
				memoDate != null ? memoDate = memoDate.format("MM/dd/yyyy") : memoDate= "";
				closedDate != null ? closedDate = closedDate.format("MM/dd/yyyy") : closedDate = "";
	
				var arrActionOffice = oListItem.get_item('ActionOffice');
				var actionOffice = "";
				if ( arrActionOffice.length > 0 )
				{
					actionOffice = "<div style='cursor:pointer; white-space:nowrap' title='Click to view' ><span class='actionOfficeContainer'><span class='ui-icon ui-icon-search'></span><a href='javascript:void(0)'>View Action Offices</a></span>";
					
					for( var x = 0; x < arrActionOffice.length; x++ )
					{
						actionOffice += "<div class='sr1-request-actionOffice-item collapsed'>" + arrActionOffice[x].get_lookupValue() + "</div>";
					}
					actionOffice += "</div>";
				}
	
				var arrActionOffice = oListItem.get_item('EmailActionOffice');
				var emailActionOffice = "";
				if ( arrActionOffice.length > 0 )
				{
					emailActionOffice = "<div style='cursor:pointer' title='Click to view' ><span class='actionOfficeContainer'><span class='ui-icon ui-icon-search'></span><a href='javascript:void(0)'>View Email Action Offices</a></span>";
				
					for( var x = 0; x < arrActionOffice.length; x++ )
					{
						emailActionOffice += "<div class='sr1-request-actionOffice-item collapsed'>" + arrActionOffice[x].get_lookupValue() + "</div>";
					}
					emailActionOffice += "</div>";
				}
						
				var comments = oListItem.get_item('Comments');
				var emailSent = oListItem.get_item('EmailSent');
				var reviewer = oListItem.get_item('Reviewer');
				var owner = oListItem.get_item('Owner');
				var relatedAudit = oListItem.get_item('RelatedAudit');
				var actionItems = oListItem.get_item('ActionItems');
			
				if( comments == null )
					comments = "";
				if( reviewer == null )
					reviewer = "";
				if( owner == null )
					owner = "";
				if( relatedAudit == null )
					relatedAudit = "";	
				if( actionItems == null )
					actionItems = "";	
			
				var closedBy = Audit.Common.Utilities.GetFriendlyDisplayName( oListItem, "ClosedBy");
	
	
				var requestObject = new Object();
				requestObject ["ID"] = id;
				requestObject ["number"] = number;
				requestObject ["subject"] = subject;
				requestObject ["dueDate"] = dueDate;
				requestObject ["status"] = status;
				requestObject ["internalDueDate"] = internalDueDate;
				requestObject ["sample"] = sample;
				requestObject ["requestDocs"] = new Array();
				requestObject ["coversheets"] = new Array();
				requestObject ["responses"] = new Array();
				requestObject ["responsesOpenCnt"] = 0;
				requestObject ["actionOffice"] = actionOffice;
				requestObject ["emailActionOffice"] = emailActionOffice;
				requestObject ["comments"] = comments;
				requestObject ["emailSent"] = emailSent;
				requestObject ["closedDate"] = closedDate;											
				requestObject ["closedBy"] = closedBy;
				requestObject ["reviewer"] = reviewer;
				requestObject ["owner"] = owner;
				requestObject ["receiptDate"] = receiptDate;
				requestObject ["memoDate"] = memoDate;
				requestObject ["relatedAudit"] = relatedAudit;
				requestObject ["actionItems"] = actionItems;
				requestObject ["item"] = oListItem;			
				
				m_arrRequests.push( requestObject );
				
				/*if( !oListItem.get_hasUniqueRoleAssignments() )
				{
					m_fnBreakRequestPermissions( oListItem, false );
				}*/
			}
		}catch( err )
		{
			alert( err );
		}
	}
	
	function LoadLibGUIDS()
	{				
		m_libResponseDocsLibraryGUID = m_responseDocsLibrary.get_id();
		m_libCoverSheetLibraryGUID = m_coversheetDocsLibrary.get_id();
		m_libRequestDocsLibraryGUID = m_requestDocsLibrary.get_id();
	}	
		
	function LoadRequestDocs( oRequest )
	{
		try
		{
			oRequest.requestDocs = new Array();
			 
			var listItemEnumerator = m_RequestDocItems.getEnumerator();
			while(listItemEnumerator.moveNext())
			{
				var oListItem = listItemEnumerator.get_current();
				
				var number = oListItem.get_item('ReqNum');
				if( number != null )
				{
					number = number.get_lookupValue();
					if( number == oRequest.number )
					{
						var requestDocObject = new Object();
						requestDocObject["ID"] = oListItem.get_item('ID');
						requestDocObject["title"] = oListItem.get_item('FileLeafRef');
						requestDocObject["folder"] = oListItem.get_item('FileDirRef');
						
						oRequest.requestDocs.push( requestDocObject);
					}
				}
			}
		}
		catch( err )
		{
			alert( err );
		}
	}

	function LoadCoverSheets( oRequest )
	{				
		try
		{
			oRequest.coversheets = new Array();
			
			var listItemEnumerator = m_CoverSheetItems.getEnumerator();
			while(listItemEnumerator.moveNext())
			{
				var oListItem = listItemEnumerator.get_current();
				
				var number = oListItem.get_item('ReqNum');
				if( number != null )
				{
					number = number.get_lookupValue();
					if( number == oRequest.number ) //just double checking here
					{
						var coversheetObject = new Object();
						coversheetObject ["ID"] = oListItem.get_item('ID');
						
						var arrActionOffice = oListItem.get_item('ActionOffice');
						var actionOffice = "";
						if ( arrActionOffice.length > 0 )
						{
							actionOffice = "<div style='cursor:pointer' title='Click to view' ><span class='ui-icon ui-icon-search'></span><span class='actionOfficeContainerRequestInfo'><a href='javascript:void(0)'>View Action Offices</a></span>";
							
							for( var y = 0; y < arrActionOffice.length; y++ )
							{
								actionOffice += "<div class='sr1-request-actionOfficeContainerRequestInfo-item collapsed'>" + arrActionOffice[y].get_lookupValue() + "</div>";
							}
							actionOffice += "</div>";
						}
						coversheetObject ["actionOffice"] = actionOffice;
	
						coversheetObject ["title"] = oListItem.get_item('FileLeafRef');
						coversheetObject ["folder"] = oListItem.get_item('FileDirRef');
						coversheetObject ["item"] = oListItem;
						
						oRequest.coversheets.push( coversheetObject );
					}
				}
			}
		}
		catch( err )
		{
			alert( err );
		}
	}
	
	function LoadResponses()
	{		
		try
		{		
			var listItemEnumerator = m_responseItems.getEnumerator();
			while(listItemEnumerator.moveNext())
			{
				var oListItem = listItemEnumerator.get_current();
				
				var number = oListItem.get_item('ReqNum');
				if( number != null )
				{
					number = number.get_lookupValue();
			
					for( var x = 0; x < m_arrRequests.length; x++ )
					{
						if( m_arrRequests[x]["number"] == number )
						{
							var returnReason = oListItem.get_item('ReturnReason');
							if( returnReason == null ) returnReason = "";
							
							var responseObject = new Object();
							responseObject ["ID"] = oListItem.get_item('ID');
							responseObject ["number"] = number;
							responseObject ["title"] = oListItem.get_item('Title');
							responseObject ["item"] = oListItem;
							
							var comments = oListItem.get_item('Comments');
							comments = $(comments).html();
							if( comments == null || comments == "" )
								responseObject ["comments"] = "";
							else
							{								
								comments = comments.replace(/[^a-z0-9\s]/gi, ' ');
								responseObject ["comments"] = comments;	
							}
								
							var modified = oListItem.get_item('Modified').format("MM/dd/yyyy hh:mm tt");
							responseObject ["modified"] = modified;						
	
							var closedDate = oListItem.get_item('ClosedDate');
							closedDate != null ? closedDate = closedDate.format("MM/dd/yyyy") : closedDate = "";
							responseObject ["closedDate"] = closedDate;						
									
							responseObject ["closedBy"] = Audit.Common.Utilities.GetFriendlyDisplayName( oListItem, "ClosedBy");
	
							responseObject ["sample"] = oListItem.get_item('SampleNumber');
							if( responseObject ["sample"] == null )
								responseObject ["sample"] = "";
							
							responseObject ["actionOffice"] = oListItem.get_item('ActionOffice');						
							if( responseObject ["actionOffice"] == null )
								responseObject ["actionOffice"] = "";
							else
								responseObject ["actionOffice"] = responseObject ["actionOffice"].get_lookupValue();
								
							responseObject ["returnReason"] = returnReason;
							responseObject ["resStatus"] = oListItem.get_item('ResStatus');
							
							if( responseObject ["resStatus"] != "7-Closed")
								m_arrRequests[x].responsesOpenCnt = m_arrRequests[x].responsesOpenCnt + 1;
								
							responseObject ["responseDocs"] = new Array();
							responseObject ["responseFolderItem"] = null;
							
							/*if( !oListItem.get_hasUniqueRoleAssignments() )
							{
								m_fnBreakResponsePermissions( oListItem, false, true);
							}
							*/
							m_arrRequests[x]["responses"].push( responseObject );
		
							break;
						}
					}
				}
			}
		}
		catch( err )
		{
			alert( err );
		}
	}
	
	
	function LoadResponseDocs()
	{				
		m_arrResponseDocsCheckedOut = new Array();
		
		try
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
	
				for( var x = 0; x < m_arrRequests.length; x++ )
				{
					var oRequest = m_arrRequests[x];
					if( oRequest["number"] == requestNumber )
					{					
						for( var y = 0; y < oRequest.responses.length; y++ )
						{
							if( oRequest.responses[y]["title"] == responseID )
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
								responseDocObject ["modifiedDate"] = modifiedDate ;						
								
								responseDocObject ["modifiedBy"] = Audit.Common.Utilities.GetFriendlyDisplayName( oListItem, "Editor");
								responseDocObject ["checkedOutBy"] = Audit.Common.Utilities.GetFriendlyDisplayName( oListItem, "CheckoutUser");							
								
								if( responseDocObject ["checkedOutBy"] != "")
								{
									responseDocObject["response"] = oRequest.responses[y];
									responseDocObject["request"] = oRequest;
									m_arrResponseDocsCheckedOut.push( responseDocObject  );
								}
								
								oRequest.responses[y]["responseDocs"].push( responseDocObject );
							}
						}
						break;
					}
				}
			} 
		}
		catch( err )
		{
			alert( err );
		}
		//this is used as a flag for the asynch rendering of responses; do not remove.
		//m_bLoadedResponseDocsItems = true;
		
		
		var arrRequestTitleAndDocCount = new Array();
		var arrResponseTitleAndDocCount = new Array();
		for( var x = 0; x < m_arrRequests.length; x++ )
		{
			var oRequest = m_arrRequests[x];
			if( oRequest.responses.length > 0  )
			{
				for( var y = 0; y < oRequest.responses.length; y ++ )
				{
					if( oRequest.responses.length > 0 )
					{
						var responseCount = oRequest.responses[y].responseDocs.length;
						arrResponseTitleAndDocCount.push([ oRequest.responses[y].title, responseCount]);
						
						var bFound = false;
						for( var z = 0; z < arrRequestTitleAndDocCount.length; z++ )
						{
							if( arrRequestTitleAndDocCount[z][0] == oRequest.number )
							{
								arrRequestTitleAndDocCount[z][1] += responseCount;
								bFound = true;
								break;
							}
						}
						if ( !bFound )
						{
							arrRequestTitleAndDocCount.push( [oRequest.number, responseCount] );
						}
					}
				}
			}
		}

		for( var x = 0; x < arrRequestTitleAndDocCount.length; x++ )
		{		
			var requestNum = arrRequestTitleAndDocCount[x][0];
			var responseCount = arrRequestTitleAndDocCount[x][1];
			$("[id='sr1-request-responseDocCount-" + requestNum + "']").text( responseCount ); //to account for spaces
			//$("#sr1-request-responseDocCount-" + responseTitle).text( responseCount );
		}
		for( var x = 0; x < arrResponseTitleAndDocCount.length; x++ )
		{		
			var responseTitle = arrResponseTitleAndDocCount[x][0];
			var responseCount = arrResponseTitleAndDocCount[x][1];
			$("[id='sr2-response-docCount-" + responseTitle + "']").text( responseCount ); //to account for spaces
			//$("#sr2-response-docCount-" + responseTitle).text( responseCount );
		}
	}
	
	function LoadResponseDocFolders()
	{
		m_arrPermissionsResponseFolders = new Array();
		
		try
		{
			var cntToBreak = 0;
			var cntBroken = 0;
			
			if( m_ResponseDocsFoldersItems != null )
			{
				var listItemEnumerator = m_ResponseDocsFoldersItems.getEnumerator();
				while(listItemEnumerator.moveNext())
				{
					var oListItem = listItemEnumerator.get_current();
					
					var itemName = oListItem.get_displayName();
					var itemId = oListItem.get_id();
					var itemUrl = oListItem.get_item('EncodedAbsUrl');
										
					//Set the title if for whatever reason the folder didnt have it's title set					
					if( oListItem.get_item("Title") == null )
					{
						var currCtx = new SP.ClientContext.get_current();
						var web = currCtx.get_web();
						
						oListItem.set_item("Title", itemName );
						oListItem.update();
						
						function OnSuccessUpdateTitle(sender, args)
						{		
						}		
						function OnFailureUpdateTitle(sender, args)
						{
						}
						currCtx.executeQueryAsync(OnSuccessUpdateTitle, OnFailureUpdateTitle);
					}
					
					var objFold = new Object();
					objFold["ID"] = itemId;
					//objFold["URL"] = itemUrl;
					//objFold["UniquePermissions"] = oListItem.get_hasUniqueRoleAssignments();
					objFold["ItemName"] = itemName;
					objFold["Item"] = oListItem;
					objFold["UserPermissions"] = new Array();
					objFold["GroupPermissions"] = new Array();
					
					if( m_bIsSiteOwner )
					{
						var roleAssignments = oListItem.get_roleAssignments();
						var rolesEnumerator = roleAssignments.getEnumerator();
						while(rolesEnumerator.moveNext())
						{
							var role = rolesEnumerator.get_current();
							var roleMember = role.get_member();
							var memeberLoginName = roleMember.get_loginName();
							var memberTitleName = roleMember.get_title();
							
							var permissionType = "UserPermissions";
							var principalType = roleMember.get_principalType();
							if (principalType == SP.Utilities.PrincipalType.securityGroup || principalType == SP.Utilities.PrincipalType.sharePointGroup)
							{
								permissionType = "GroupPermissions";
							}
		
							var roleDefs = role.get_roleDefinitionBindings();
								
							var roleDefsEnumerator = roleDefs.getEnumerator();
							while(roleDefsEnumerator.moveNext())
							{
								var rd = roleDefsEnumerator.get_current();
								var rdName = rd.get_name();
								
								objFold[ permissionType ].push(rdName + " - " + memberTitleName);
							}
						}
					}			
					
					m_arrPermissionsResponseFolders.push(objFold);
					
					for( var x = 0; x < m_arrRequests.length; x++ )
					{
						var oRequest = m_arrRequests[x];
						for( var y = 0; y < oRequest.responses.length; y++ )
						{
							if( oRequest.responses[y].title == itemName )
							{
								oRequest.responses[y].responseFolderItem = oListItem;
								break;
							}
						} 
					}
				}	
			}
		}
		catch( err )
		{
			
		}
	}
	
	function UpdateDDs( arr )
	{
		var arrRequests = new Array();
		for( var x = 0; x < arr.length; x++ )
		{
			var oRequest = arr[x];
			arrRequests.push( oRequest.number );			
		}

		Audit.Common.Utilities.AddOptions( arrRequests, "#ddlReqNum", false );
	}
		
	function LoadRequestInfo( requestNum )
	{
		ClearRequestInfo();
	
		if( requestNum == "" )
			return;
			
		var oRequest = null;
		for( var x = 0; x <  m_arrRequests.length; x ++ )
		{
			if( m_arrRequests[x].number == requestNum)
			{
				oRequest = m_arrRequests[x];
				break;
			}			
		}
		
		if( oRequest == null )
			return;

		$("#divRequestInfo").show();
		$("#divRequestDocs").show();
		$("#divCoverSheets").show();
		$("#divResponses").show();
		$("#divResponseDocs").show();
		
		LoadTabRequestInfoRequestInfo( oRequest );
	}
	
	function ClearRequestInfo()
	{
		$("#requestInfoNum").text( "" );
		$("#requestInfoSub").text( "" );
		$("#requestInfoInternalDueDate").text( "" );
		$("#requestInfoDueDate").text( "" );
		$("#requestInfoStatus").text( "" );
		$("#requestInfoSample").text( "" );
		$("#requestInfoReviewer").text( "" );
		$("#requestInfoOwner").text( "" );
		$("#requestInfoReceiptDate").text( "" );
		$("#requestInfoMemoDate").text( "" );
		$("#requestInfoRelatedAudit").text( "" );
		$("#requestInfoActionItems").html( "" );
		$("#requestInfoComments").html( "" );
		$("#requestInfoActionOffice").text( "" );
		$("#requestInfoEmailActionOffice").text( "" );
		$("#requestEmailSent").text( "" );
		$("#requestInfoSpecialPermissions").text( "" );
		$("#divResponsesGrantSpecialPermissions").html( "" );		
		$("#divResponsesRemoveSpecialPermissions").html( "" );
		
		$("#divRequestInfo").hide();
		$("#divRequestDocs").hide();
		$("#divCoverSheets").hide();
		$("#divResponses").hide();
		$("#divResponseDocs").hide();

		$("#tblRequestDocs").hide();
		$("#tblCoverSheets").hide();
		$("#tblResponses").hide();
		$("#tblResponseDocs").hide();
		
		$("#tblCoverSheetsTotal").text( "0" );
		$("#tblResponsesTotal").text( "0" );
		$("#tblResponseDocsTotal").text( "0" );
		
		$("#tblRequestDocs tbody").empty();
		$("#tblCoverSheets tbody").empty();
		$("#tblResponses tbody").empty();
		$("#tblResponseDocs tbody").empty();
		
		$("#divEmptyResponseDocsMsg").hide();
		$("#divRequestDocsLoading").show();
		$("#divCoversheetsLoading").show();
		$("#divResponsesLoading").show();
		$("#divResponseDocsLoading").show();

		$("#divRequestClose").hide();
	}

	function LoadTabRequestInfoRequestInfo( oRequest )
	{
		try
		{
			$("#requestInfoNum").text( oRequest.number );
			$("#requestInfoSub").text( oRequest.subject );
			$("#requestInfoInternalDueDate").text( oRequest.internalDueDate );
			$("#requestInfoDueDate").text( oRequest.dueDate );
			
			if( oRequest.status == "Closed" )
			{
				$("#requestInfoStatus").html( "<span style='color:red'>" + oRequest.status + " on " + oRequest.closedDate + " by " + oRequest.closedBy + "</span>");	
			}
			else if( oRequest.status == "Canceled" )
			{
				$("#requestInfoStatus").html( "<span style='color:red'>" + oRequest.status + "</span>");	
			}
			else
				$("#requestInfoStatus").html( "<span style='color:green'>" + oRequest.status + "</span>");	
	
			var sample = Audit.Common.Utilities.GetTrueFalseIcon( oRequest.sample ) + " No";
			if( oRequest.sample )
				sample = Audit.Common.Utilities.GetTrueFalseIcon( oRequest.sample ) + "Yes";
				
			$("#requestInfoSample").html( sample );		
			$("#requestInfoReviewer").text( oRequest.reviewer );
			$("#requestInfoOwner").text( oRequest.owner );
			$("#requestInfoReceiptDate").text( oRequest.receiptDate );
			$("#requestInfoMemoDate").text( oRequest.memoDate );
			$("#requestInfoRelatedAudit").text( oRequest.relatedAudit );
			$("#requestInfoActionItems").html( oRequest.actionItems );
			
			//do this to make sure handlers work
			var ao = oRequest.actionOffice;
			ao = ao.replace(/actionOfficeContainer/gi, "actionOfficeContainerRequestInfo");
			ao = ao.replace(/sr1-request-actionOffice-item/gi, "sr1-request-actionOfficeContainerRequestInfo-item");		
			$("#requestInfoActionOffice").html( ao );
			
			//do this to make sure handlers work
			var ao = oRequest.emailActionOffice;
			ao = ao.replace(/actionOfficeContainer/gi, "actionOfficeContainerRequestInfo");
			ao = ao.replace(/sr1-request-actionOffice-item/gi, "sr1-request-actionOfficeContainerRequestInfo-item");
			$("#requestInfoEmailActionOffice").html( ao );
			$("#requestInfoComments").html( oRequest.comments );

			//Display close request button if it should be closed
			$("#divRequestClose").hide();
			if( m_arrRequestsToClose && m_arrRequestsToClose.length > 0 )
			{
				for( var x = 0; x < m_arrRequestsToClose.length; x ++ )
				{
					var oIt = m_arrRequestsToClose[x];
					if( oIt.requestNumber == oRequest.number )
					{
						$("#divRequestClose").show();
						$("#btnCloseRequest").click(function(){
							m_fnCloseRequest();
						});
						break;
					}
				}	
			}

			///Requery to now get the request from the list, but this time with the permission attributes
			var currCtx = new SP.ClientContext.get_current();
			var web = currCtx.get_web();
			
			var requestList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleRequests() );
			var requestQuery = new SP.CamlQuery();	
			requestQuery.set_viewXml('<View><Query><Where><Eq><FieldRef Name="ID"/><Value Type="Text">' + oRequest.ID + '</Value></Eq></Where></Query></View>');
			m_aRequestItem = requestList.getItems( requestQuery );
			if( m_bIsSiteOwner )
				currCtx.load( m_aRequestItem, 'Include(ID, Title, ReqSubject, ReqStatus, IsSample, ReqDueDate, InternalDueDate, ActionOffice, EmailActionOffice, Reviewer, Owner, ReceiptDate, MemoDate, RelatedAudit, ActionItems, Comments, EmailSent, ClosedDate, ClosedBy, Modified, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))');
			else
				currCtx.load( m_aRequestItem, 'Include(ID, Title, ReqSubject, ReqStatus, IsSample, ReqDueDate, InternalDueDate, ActionOffice, EmailActionOffice, Reviewer, Owner, ReceiptDate, MemoDate, RelatedAudit, ActionItems, Comments, EmailSent, ClosedDate, ClosedBy, Modified)');
				
			var requestDocLib = web.get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleRequestDocs() );
			var requestDocQuery = new SP.CamlQuery();	
			requestDocQuery.set_viewXml('<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="ReqNum"/><Value Type="Text">' + oRequest.number + '</Value></Eq></Where></Query></View>');
			m_RequestDocItems = requestDocLib.getItems( requestDocQuery );
			currCtx.load( m_RequestDocItems, 'Include(ID, Title, ReqNum, FileLeafRef, FileDirRef)');
	
			var coverSheetLib = web.get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleCoverSheets() );
			var coverSheetQuery = new SP.CamlQuery();	
			coverSheetQuery.set_viewXml('<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="ReqNum"/><Value Type="Text">' + oRequest.number + '</Value></Eq></Where></Query></View>');
			m_CoverSheetItems = coverSheetLib.getItems( coverSheetQuery );
			if( m_bIsSiteOwner )
				currCtx.load( m_CoverSheetItems, 'Include(ID, Title, ReqNum, ActionOffice, FileLeafRef, FileDirRef, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))');
			else
				currCtx.load( m_CoverSheetItems, 'Include(ID, Title, ReqNum, ActionOffice, FileLeafRef, FileDirRef)');
			
			function OnSuccess(sender, args)
			{				
				//Update the item field on the request
				var listItemEnumerator = m_aRequestItem.getEnumerator();
				while(listItemEnumerator.moveNext())
				{
					var oListItem = listItemEnumerator.get_current();
					oRequest.item = oListItem;
					break;
				}
				
				if( m_bIsSiteOwner )
				{
					if( !oRequest.item.get_hasUniqueRoleAssignments() )
					{
						m_fnBreakRequestPermissions( oRequest.item, false );
					}
				}
				
				LoadRequestDocs( oRequest );
				LoadCoverSheets( oRequest );

				var match1 = false;
				var match2 = false;
				
				if( m_bIsSiteOwner )
				{
					var permissionsToCheck = SP.PermissionKind.viewListItems;
					match1 = Audit.Common.Utilities.CheckSPItemHasGroupPermission(oRequest.item,  Audit.Common.Utilities.GetGroupNameSpecialPerm1(), permissionsToCheck );
					match2 = Audit.Common.Utilities.CheckSPItemHasGroupPermission(oRequest.item,  Audit.Common.Utilities.GetGroupNameSpecialPerm2(), permissionsToCheck );
					
					if( match1 && match2 )
					{
						var specialPerms = '<span class="ui-icon ui-icon-check"></span> Yes';
						$("#requestInfoSpecialPermissions").html( specialPerms );
					}
					else
					{
						var specialPerms = '<span class="ui-icon ui-icon-close"></span> No';
						$("#requestInfoSpecialPermissions").html( specialPerms );
					}
				}
				
				if( oRequest.emailSent )
				{
					$("#requestInfoEmailSent").html( "<span class='ui-icon ui-icon-check'></span> Yes");
					$("#divSendEmailAction").html( "<span class='ui-icon ui-icon-mail-closed'></span><a title='Send Email to Action Offices' href='javascript:void(0)' onclick='Audit.IAReport.Report.SendEmail(" + oRequest.ID + ")'>Re-Send Email to Action Offices</a>");
				}
				else
				{
					$("#requestInfoEmailSent").html( "<span class='ui-icon ui-icon-close'></span> No");
					$("#divSendEmailAction").html( "<span class='ui-icon ui-icon-mail-closed'></span><a title='Send Email to Action Offices' href='javascript:void(0)' onclick='Audit.IAReport.Report.SendEmail(" + oRequest.ID + ")'>Send Email to Action Offices</a>");
				}
				
				$("#divEmailHistory").html( "<a title='View Email History' href='javascript:void(0)' onclick='Audit.IAReport.Report.ViewEmailHistoryFolder(\"" + oRequest.number  + "\")'><span class='ui-icon ui-icon-search'></span>View Email History</a>" );
		
				
				if( oRequest.status != "Open" && oRequest.status != "ReOpened")
				{
					$("#divSendEmailAction").html( "" ); //dont allow send email if the request status is not open
				}
				
				var requestLink = "<div><a title='View Request' href='javascript:void(0)' onclick='Audit.IAReport.Report.ViewRequest(" + oRequest.ID + ")'><span class='ui-icon ui-icon-search'>View Request</span>View Request</a></div>";
				var requestEditLink = "<div><a title='Edit Request' href='javascript:void(0)' onclick='Audit.IAReport.Report.EditRequest(\"" + oRequest.ID + "\",\"" + oRequest.number + "\")'><span class='ui-icon ui-icon-pencil'>Edit Request</span>Edit Request</a></div>";
				$("#divRequestInfoActions").html("<fieldset style='width:200px;margin-left:10px; padding-left:10px;'><legend>Request Actions</legend>" + requestLink + requestEditLink + "</fielset>");
		
				$("#divResponsesGrantSpecialPermissions").html( '<a title="Grant Special Permissions" href="javascript:void(0)" onclick="Audit.IAReport.Report.GrantSpecialPermissions(\'' + oRequest.number + '\')"><span class="ui-icon ui-icon-unlocked"></span>Grant Special Permissions</a>' );		
				$("#divResponsesRemoveSpecialPermissions").html( '<a title="Remove Special Permissions" href="javascript:void(0)" onclick="Audit.IAReport.Report.RemoveSpecialPermissions(\'' + oRequest.number + '\')"><span class="ui-icon ui-icon-locked"></span>Remove Special Permissions</a>' );		
				
				
				LoadTabRequestInfoRequestDocs( oRequest );
				LoadTabRequestInfoCoverSheets( oRequest );
				LoadTabRequestInfoResponses( oRequest );
			}
			function OnFailure(sender, args)
			{
			}
			currCtx.executeQueryAsync(OnSuccess, OnFailure);
		}
		catch( err )
		{
			alert( err );
		}
	}
	

	function LoadTabRequestInfoRequestDocs( oRequest )
	{		
		$("#divRequestDocsLoading").hide();
		
		var sRequestDocs = "";
		for( var y = 0; y < oRequest.requestDocs.length; y++ )
		{
			var oRequestDoc = oRequest.requestDocs[y];

			var requestDocLink = "<a title='View Request Document Properties' href='javascript:void(0)' onclick='Audit.IAReport.Report.ViewRequestDoc(" + oRequestDoc.ID + ")'><span class='ui-icon ui-icon-search'>View Request Doc</span></a>";
			var requestDocEditLink = "<a title='Edit Request Document Properties' href='javascript:void(0)' onclick='Audit.IAReport.Report.EditRequestDoc(" + oRequestDoc.ID + ")'><span class='ui-icon ui-icon-pencil'>Edit Request Doc</span></a>";
			
			var link = "<a href='../_layouts/download.aspx?SourceUrl=" + oRequestDoc.folder + "/" + oRequestDoc.title + "'>" + oRequestDoc.title + "</a>";
			sRequestDocs += '<tr class="request-doc-item">' + 
				'<td class="request-doc-title" title="Click to Download">' + link + '</td>' +
				'<td class="request-doc-action">' + requestDocLink + requestDocEditLink + '</td>' +
			'</tr>';
		}
		$("#tblRequestDocs tbody").append( sRequestDocs );
		
		if( oRequest.requestDocs.length > 0 )
		{
			$("#tblRequestDocsTotal").text( oRequest.requestDocs.length );
			$("#tblRequestDocs").show();	
		}
		$("#divRequestDocActions").html( '<a title="Upload Request Document" href="javascript:void(0)" onclick="Audit.IAReport.Report.UploadRequestDoc(\'' + oRequest.number + '\')"><span class="ui-icon ui-icon-circle-arrow-n">Upload Request Document</span>Upload Request Doc</a>' );		
	}
	
	
	function LoadTabRequestInfoCoverSheets( oRequest )
	{		
		$("#divCoversheetsLoading").hide();

		var sCoverSheets = "";
		for( var y = 0; y < oRequest.coversheets.length; y++ )
		{
			var oCoversheet = oRequest.coversheets[y];
			var actionOffice = oCoversheet.actionOffice;
			var coversheetLink = "<a title='View Coversheet' href='javascript:void(0)' onclick='Audit.IAReport.Report.ViewCoverSheet(" + oCoversheet.ID + ")'><span class='ui-icon ui-icon-search'>View Coversheet</span></a>";
			var coversheetEditLink = "<a title='Edit Coversheet' href='javascript:void(0)' onclick='Audit.IAReport.Report.EditCoverSheet(\"" + oCoversheet.ID + "\",\"" + oRequest.number  + "\")'><span class='ui-icon ui-icon-pencil'>Edit Coversheet</span></a>";
			
			var link = "<a href='../_layouts/download.aspx?SourceUrl=" + oCoversheet.folder + "/" + oCoversheet.title + "'>" + oCoversheet.title + "</a>";
			sCoverSheets += '<tr class="coversheet-item">' + 
				'<td class="coversheet-title" title="Click to Download">' + link + '</td>' +
				'<td class="coversheet-title">' + actionOffice + '</td>' +
				'<td class="coversheet-action">' + coversheetLink + coversheetEditLink + '</td>' +
			'</tr>';
		}
		$("#tblCoverSheets tbody").append( sCoverSheets );
		
		if( oRequest.coversheets.length > 0 )
		{
			$("#tblCoverSheetsTotal").text( oRequest.coversheets.length );
			$("#tblCoverSheets").show();	
		}
		$("#divCoverSheetActions").html( '<a title="Upload Cover Sheet or Supplemental Document" href="javascript:void(0)" onclick="Audit.IAReport.Report.UploadCoverSheet(\'' + oRequest.number + '\')"><span class="ui-icon ui-icon-circle-arrow-n"></span>Upload Cover Sheet or Supplemental Document</a>' );		

		BindActionOfficeRequestInfoHandler();
	}
	
	//when action office or qa updates the response and it comes back to IA, IA gets emailed a link with the response number; When they open the link in the browser, it will ]
	//take them to 2nd tab; When they click on the response (which is filtered), it will display tab 3 with the request details. At that point, it will try to check to see if the response permissions 
	//need to be updated
	function m_fnLoadResponseDocFolder( responseTitle, OnComplete )
	{
		var currCtx = new SP.ClientContext.get_current();
		var web = currCtx.get_web();
		
		var responseList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleResponses() );
		var responseQuery = new SP.CamlQuery();	
		responseQuery.set_viewXml('<View><Query><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' + responseTitle + '</Value></Eq></Where></Query></View>');
		m_aResponseItem = responseList.getItems( responseQuery );
		//need to check permissions because of granting/removing special perms
		currCtx.load( m_aResponseItem, 'Include(ID, Title, ReqNum, ActionOffice, ReturnReason, SampleNumber, ResStatus, Comments, Modified, ClosedDate, ClosedBy, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))' );

		var responseDocsLibFolderslist = currCtx.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleResponseDocs() );
		var responseDocsLibFolderslistQuery = new SP.CamlQuery();
		//include the dash
	    responseDocsLibFolderslistQuery.set_viewXml('<View><Query><Where><And><Eq><FieldRef Name="Title"/><Value Type="Text">' + responseTitle + '</Value></Eq><Eq><FieldRef Name="ContentType" /><Value Type="Text">Folder</Value></Eq></And></Where></Query></View>');
		m_ResponseDocsFoldersItems = responseDocsLibFolderslist.getItems(responseDocsLibFolderslistQuery);
		currCtx.load( m_ResponseDocsFoldersItems, "Include( DisplayName, Title, Id, EncodedAbsUrl, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))");
		
		function OnSuccess(sender, args)
		{	
			var oResponseItem = null;		
			//Requery the response item to now have the permissions on the responses; Avoid doing it at the top because it impacts load time
			var listItemEnumerator = m_aResponseItem.getEnumerator();
			while(listItemEnumerator.moveNext())
			{
				var oListItem = listItemEnumerator.get_current();
				
				for( var x = 0; x < m_arrRequests.length; x++ )
				{
					var oRequest = m_arrRequests[x];
					for( var y = 0; y < oRequest.responses.length; y++ )
					{
						if( oRequest.responses[y].title == responseTitle )
						{
							oRequest.responses[y].item = oListItem;
							break;
						}
					} 
				}
				
				break;
			}
			
			LoadResponseDocFolders( oResponseItem ); //really, this only runs through the one response and we're only doing this to set the response item's folder so that we can query the permissions on it
			
			OnComplete( true );
		}
		function OnFailure(sender, args)
		{
			OnComplete( false );
		}
		currCtx.executeQueryAsync(OnSuccess, OnFailure);
	}
	
	function LoadTabRequestInfoResponses( oRequest )
	{
		if( m_bIsSiteOwner )
		{
			/* for this specific response selected, check that the permissions don't need updating*/
			if( m_sGoToResponseTitle != null && m_sGoToResponseTitle != "" )
			{			
				m_fnLoadResponseDocFolder( m_sGoToResponseTitle, function( doneLoadingThisResponseFolder )
				{
					if( doneLoadingThisResponseFolder )
					{
						m_fnCheckIfResponsePermissionsNeedUpdating( oRequest.status, m_sGoToResponseTitle, function( doneCheckingResponseFolder )
						{
							if( doneCheckingResponseFolder )
							{
								LoadTabRequestInfoResponses2( oRequest);
							}
						});
					}
					else
						LoadTabRequestInfoResponses2( oRequest );
				});
			}
			else
				LoadTabRequestInfoResponses2( oRequest );
		}
		else
			LoadTabRequestInfoResponses2( oRequest );
	}
	
	function LoadTabRequestInfoResponses2( oRequest )
	{
		$("#divResponsesLoading").show();
		document.body.style.cursor = 'wait';
		m_notifyIDLoadingResponses = SP.UI.Notify.addNotification("Loading Responses...", true);
		
		var currCtx = new SP.ClientContext.get_current();
		var web = currCtx.get_web();

		var responseList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleResponses() );
		var responseQuery = new SP.CamlQuery();	
		responseQuery.set_viewXml('<View><Query><Where><Eq><FieldRef Name="ReqNum"/><Value Type="Text">' + oRequest.number + '</Value></Eq></Where></Query></View>');
		m_subsetResponseItems = responseList.getItems( responseQuery );
		//need to check permissions because of granting/removing special perms
		if( m_bIsSiteOwner )
			currCtx.load( m_subsetResponseItems, 'Include(ID, Title, ReqNum, ActionOffice, ReturnReason, SampleNumber, ResStatus, Comments, Modified, ClosedDate, ClosedBy, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))' );
		else
			currCtx.load( m_subsetResponseItems, 'Include(ID, Title, ReqNum, ActionOffice, ReturnReason, SampleNumber, ResStatus, Comments, Modified, ClosedDate, ClosedBy)' );

		var responseDocsLibFolderslist = currCtx.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleResponseDocs() );
		var responseDocsLibFolderslistQuery = new SP.CamlQuery();
		//include the dash
	    responseDocsLibFolderslistQuery.set_viewXml('<View><Query><Where><And><BeginsWith><FieldRef Name="Title"/><Value Type="Text">' + oRequest.number + '-</Value></BeginsWith><Eq><FieldRef Name="ContentType" /><Value Type="Text">Folder</Value></Eq></And></Where></Query></View>');
		m_ResponseDocsFoldersItems = responseDocsLibFolderslist.getItems( responseDocsLibFolderslistQuery );
		if( m_bIsSiteOwner )
			currCtx.load( m_ResponseDocsFoldersItems, "Include( DisplayName, Title, Id, EncodedAbsUrl, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))");
		else
			currCtx.load( m_ResponseDocsFoldersItems, "Include( DisplayName, Title, Id, EncodedAbsUrl)");
		
		function OnSuccess(sender, args)
		{
			//Requery all the response items for this request to now have the permissions on the responses; Avoid doing it at the top because it impacts load time
			var listItemEnumerator = m_subsetResponseItems.getEnumerator();
			while(listItemEnumerator.moveNext())
			{
				var oListItem = listItemEnumerator.get_current();
				var responseTitle = oListItem.get_item("Title");
				for( var x = 0; x < oRequest.responses.length; x++ )
				{
					if( oRequest.responses[x].title == responseTitle )
					{
						oRequest.responses[x].item = oListItem;
						
						if( m_bIsSiteOwner )
						{
							if( !oListItem.get_hasUniqueRoleAssignments() )
							{
								m_fnBreakResponsePermissions( oListItem, false, true);
							}
						}
						break;
					}
				}
			}
		
			LoadResponseDocFolders();
			
			var sResponses = "";		
			var responseCount = oRequest.responses.length;
			
			oRequest.responses.sort(function(a, b) {
				a = parseInt(a.sample, 10 );
				b = parseInt(b.sample, 10 );
				return a - b;
			});

			if( responseCount == 0 )
			{
				notifyId = SP.UI.Notify.addNotification(oRequest.number + " has 0 responses. Please create a Response", false);
			}
			
			for( var y = 0; y < responseCount; y++ )
			{
				var oResponse = oRequest.responses[y];
				
				var responseLink = "<a title='View Response' href='javascript:void(0)' onclick='Audit.IAReport.Report.ViewResponse(\"" + oRequest.number + "\",\"" + oResponse.ID + "\",\"" + oResponse.title  + "\",\"" + oResponse.resStatus + "\")'><span class='ui-icon ui-icon-search'>View Response</span></a>";
				var responseEditLink = "<a title='Edit Response' href='javascript:void(0)' onclick='Audit.IAReport.Report.EditResponse(\"" + oRequest.number + "\",\"" + oResponse.ID + "\",\"" + oResponse.title  + "\",\"" + oResponse.resStatus + "\")'><span class='ui-icon ui-icon-pencil'>Edit Response</span></a>";
				var responseFolderLink = "<a title='View Response Documents' href='javascript:void(0)' onclick='Audit.IAReport.Report.ViewResponseDocFolder(\"" + oResponse.title + "\")'><span class='ui-icon ui-icon-folder-collapsed'>View Folder</span></a>";
				var responseFolderAddLink = "<a title='Upload Response Documents' href='javascript:void(0)' onclick='Audit.IAReport.Report.UploadResponseDoc(\"" + oRequest.number + "\",\"" + oResponse.title  + "\")'><span class='ui-icon ui-icon-circle-arrow-n'>Upload Docs</span></a>";
				var responseReopenLink = "";
				
				if( oRequest.status == "Closed" || oRequest.status == "Canceled" )
				{
					responseEditLink = "";
					responseFolderLink = "";
					responseFolderAddLink = "";
				}
				if( oResponse.resStatus.indexOf("Closed") >= 0 )
				{
					responseEditLink = "";
					responseFolderLink = "";
					responseFolderAddLink = "";
					responseReopenLink = "<div style='padding-top:5px; padding-left:20px;'><span class='ui-icon ui-icon-gear'></span><a title='Click to Open Response' href='javascript:void(0)' onclick='Audit.IAReport.Report.ReOpenResponse(\"" + oRequest.number + "\",\"" + oResponse.title  + "\")'>Open Response?</a></div>";
				}
				if( oResponse.resStatus != "1-Open" && oResponse.resStatus != "2-Submitted" && oResponse.resStatus != "3-Returned to Action Office" && oResponse.resStatus != "5-Returned to GFS" )
				{
					responseFolderAddLink = "";
				}
				
				var arrRequestActionOffices = oRequest.item.get_item('ActionOffice');			
				var responseActionOfficeIsInRequest = false;
				if( arrRequestActionOffices != null )
				{
					for( var x = 0; x < arrRequestActionOffices.length; x++ )
					{
						if( arrRequestActionOffices[x].get_lookupValue() == oResponse.actionOffice)
						{
							responseActionOfficeIsInRequest = true;
						}
					}
				}
	
				var groupPerms = "";
				for( var x = 0; x < m_arrPermissionsResponseFolders.length; x++ )
				{
					if( m_arrPermissionsResponseFolders[x].ItemName == oResponse.title )
					{
						arrGroupPerms = m_arrPermissionsResponseFolders[x].GroupPermissions;
						
						var grouppermissionsArr = arrGroupPerms.sort();
						grouppermissionsArr.sort(function(a, b) {
	    					return a.toLowerCase().localeCompare(b.toLowerCase());
						});
						
						for( var z = 0; z < grouppermissionsArr.length; z++ )
						{
							groupPerms += "<div>" + grouppermissionsArr[z] + "</div>";	
						}
						break;
					}
				}			
				var specialPerms = "";
				if( groupPerms.indexOf( Audit.Common.Utilities.GetGroupNameSpecialPerm1() ) >= 0 && groupPerms.indexOf( Audit.Common.Utilities.GetGroupNameSpecialPerm2() ) >= 0 )
				{
					specialPerms = '<span class="ui-icon ui-icon-check"></span>';
				}
	
				var styleTag = "";
				if( !responseActionOfficeIsInRequest )
				{
					styleTag =' style="background-color:lightsalmon; font-style:italic; font-weight:bold; color:red !important;" title="This Action Office is not found in the Action Office list for the Request"';
				}				
				
				var resStatus = oResponse.resStatus;
				if( oResponse.resStatus == "7-Closed" )
				{
					//resStatus += " on " + oResponse.closedDate + " by " + oResponse.closedBy;
					resStatus = '<span style="color:red">' + resStatus + " on " + oResponse.closedDate + " by " + oResponse.closedBy + '</span>';
				}
				else
					resStatus = '<span style="color:green">' + resStatus + '</span>';
	
	
				var resID = "response-item-title-" + oResponse.title;
				var tooltip = "";//oResponse.comments; 
				sResponses += '<tr class="response-item" title="' + tooltip + '">' + 
					'<td class="response-sample">' + oResponse.sample + '</td>' +
					'<td id="' + resID + '" class="response-title">' + oResponse.title + '</td>' +
					'<td class="response-actionOffice" ' + styleTag +'>' + oResponse.actionOffice + '</td>' +
					'<td class="response-resStatus">' + resStatus + responseReopenLink +'</td>' +
					'<td class="response-returnReason ">' + oResponse.returnReason + '</td>' +
					'<td class="response-specialPermissions ">' + specialPerms + '</td>' +
					'<td class="response-permissions ">' + groupPerms + '</td>' +
					'<td class="response-action">' + responseLink + responseEditLink + '</td>' +
					'<td class="response-responseDocs">' + responseFolderLink + responseFolderAddLink + '</td>' +
				'</tr>';			
			}
	
			$("#tblResponses tbody").append( sResponses );	
			$("#divResponsesLoading").hide();
			SP.UI.Notify.removeNotification( m_notifyIDLoadingResponses );
		    m_notifyIDLoadingResponses = null;

			if( responseCount > 0 )
			{
				$("#tblResponsesTotal").text( responseCount );
				$("#tblResponses").show();
			}
	
			if( oRequest.status == "Open" || oRequest.status == "ReOpened" )
			{
				$("#divResponsesActions").html( '<div><a title="Add Response" href="javascript:void(0)" onclick="Audit.IAReport.Report.AddResponse(\'' + oRequest.number + '\')"><span class="ui-icon ui-icon-circle-plus"></span>Add Response</a></div><div><a title="Bulk Add Responses" href="javascript:void(0)" onclick="Audit.IAReport.Report.BulkAddResponse(\'' + oRequest.number + '\')"><span class="ui-icon ui-icon-circle-plus"></span>Bulk Add Responses</a></div>' );	
			}
			else
				$("#divResponsesActions").html( "" );		
				
			document.body.style.cursor = 'default';
			
			m_fnHighlightResponse();
			/*if( m_sGoToResponseTitle != null && m_sGoToResponseTitle != "" )
			{
				$("[id='response-item-title-" +  m_sGoToResponseTitle + "']").parent().css({"background-color": "palegreen", "font-weight": "inherit"});
				$("[id='response-item-title-" +  m_sGoToResponseTitle + "']").get(0).scrollIntoView();
				
				function resetColor( index )
				{
					$("[id='response-item-title-" +  m_sGoToResponseTitle + "']").parent().css({"background-color": "inherit", "font-weight": "inherit"});

					 m_sGoToResponseTitle = null;
				}
				setTimeout(function(){resetColor( m_sGoToResponseTitle )}, 2000);

				var cnt = 0; 
				$(".response-title").each(function()
				{
					if( $(this).text() == m_sGoToResponseTitle )
					{
						$(this).get(0).scrollIntoView(); 
						$(this).parent().css({"background-color": "palegreen", "font-weight": "inherit"});
						//$(this).parent().css({"background-color": "lightyellow", "font-weight": "bold"});
						
						function resetColor( index )
						{
							var text =  $(".response-title:eq(" + index + ")").text();
							$(".response-title:eq(" + index + ")").parent().css({"background-color": "inherit", "font-weight": "inherit"});
						}
						setTimeout(function(){resetColor( cnt )}, 2000);
						
						return false;
					}
					cnt++;
				});*/
			//}
			
			//m_sGoToResponseTitle = null;


			LoadTabRequestInfoResponseDocs( oRequest );
		}		
		function OnFailure(sender, args)
		{
			statusId = SP.UI.Status.addStatus("Request failed: "  + args.get_message() + "\n" + args.get_stackTrace());
   			SP.UI.Status.setStatusPriColor(statusId, 'red');
		}
		currCtx.executeQueryAsync(OnSuccess, OnFailure);		
	}
	
	function m_fnHighlightResponse()
	{
		if( m_sGoToResponseTitle != null && m_sGoToResponseTitle != "" )
		{
			$("[id='response-item-title-" +  m_sGoToResponseTitle + "']").parent().css({"background-color": "palegreen", "font-weight": "inherit"});
			$("[id='response-item-title-" +  m_sGoToResponseTitle + "']").get(0).scrollIntoView();
			
			function resetColor( index )
			{
				$("[id='response-item-title-" +  m_sGoToResponseTitle + "']").parent().css({"background-color": "inherit", "font-weight": "inherit"});

				 m_sGoToResponseTitle = null;
			}
			setTimeout(function(){resetColor( m_sGoToResponseTitle )}, 2000);
		}
	}
	
	function LoadTabRequestInfoResponseDocs( oRequest )
	{	
		$("#divResponseDocsLoading").hide();
		
		function OnSuccess(sender, args)
		{		
			RenderResponses( oRequest );	
		}		
		function OnFailure(sender, args)
		{
			statusId = SP.UI.Status.addStatus("Request failed: "  + args.get_message() + "\n" + args.get_stackTrace());
   			SP.UI.Status.setStatusPriColor(statusId, 'red');
		}
		
		var bHasResponseDoc = false;
		if( oRequest && oRequest.responses && oRequest.responses.length > 0 )
		{
			var currCtx = new SP.ClientContext.get_current();
			var web = currCtx.get_web();
			
			for( var y = 0; y < oRequest.responses.length; y++ )
			{
				var oResponse = oRequest.responses[y];
				if( oResponse && oResponse.responseDocs && oResponse.responseDocs.length > 0 )
				{
					for( var z = 0; z < oResponse.responseDocs.length; z++ )
					{
						var oResponseDoc = oResponse.responseDocs[z];
						
						//this loads on execute
						oResponseDoc ["docIcon"] = web.mapToIcon( oResponseDoc.title, '', SP.Utilities.IconSize.Size16);// m_siteUrl + "/" + _spPageContextInfo.layoutsUrl + "/images/" + docIcon;
						
						bHasResponseDoc = true;
					}
				}
			}
		}
		
		if( bHasResponseDoc )
		{
			currCtx.executeQueryAsync(OnSuccess, OnFailure);	
			$("#divEmptyResponseDocsMsg").hide();
		}
		else
		{
			$("#divEmptyResponseDocsMsg").show();
		}
			
		function RenderResponses( oRequest )
		{
			var sReponseDocs = "";
			var cnt = 0;
			
			oRequest.responses.sort(function(a, b) {
				return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
			});


			for( var y = 0; y < oRequest.responses.length; y++ )
			{
				var oResponse = oRequest.responses[y];

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
						oObject["request"] = oRequest;
						
						arrResponseSummary.push( oObject );
					}
				}
								
				for( var z = 0; z < arrResponseSummary.length; z++ )
				{
					var oResponseSummary = arrResponseSummary[z];
					//var responseFolderLink = "<a title='View Response Documents' href='javascript:void(0)' onclick='Audit.IAReport.Report.ViewResponseDocFolder(\"" + oResponse.responseTitle + "\")'><span>" + oResponse.responseTitle + "</span></a>";
					//var responseFolderAddLink = "<a title='Upload Response Documents' href='javascript:void(0)' onclick='Audit.IAReport.Report.UploadResponseDoc(\"" + oRequest.number + "\",\"" + oResponse.responseTitle + "\")'><span class='ui-icon ui-icon-plus'>Upload Docs</span></a>";

					sReponseDocs += '<tr class="requestInfo-response-doc"><td colspan="10"><img style="background-color: transparent;" src="/_layouts/images/plus.gif" title="Expand/Collapse"/>' + oResponseSummary.responseTitle + '</td></tr>';

					for( var p = 0; p < oResponseSummary.responseDocs.length; p++ )
					{					
						var oResponseDoc = oResponseSummary.responseDocs[p];
		
						var responseDocLink = "<a title='View Response Document Properties' href='javascript:void(0)' onclick='Audit.IAReport.Report.ViewResponseDoc(\"" + oResponseDoc.ID + "\",\"" + oRequest.ID + "\",\"" + oResponse.title + "\")'><span class='ui-icon ui-icon-search'>View Response Doc</span></a>";
						var responseEditLink = "<a title='Edit Response Document Properties' href='javascript:void(0)' onclick='Audit.IAReport.Report.EditResponseDoc(\"" + oResponseDoc.ID + "\",\"" + oRequest.ID + "\",\"" + oResponse.title + "\")'><span class='ui-icon ui-icon-pencil'>Edit Response Doc</span></a>";
						
						if( oResponseSummary.response.resStatus.indexOf("Closed") >= 0 )
						{
							responseEditLink = "";
						}
						if( oResponseSummary.request.status == "Closed" || oResponseSummary.request.status == "Canceled")
						{
							responseEditLink = "";
						}
						if( oResponseDoc.documentStatus != "Sent to QA" && oResponseDoc.documentStatus != "Open" && oResponseDoc.documentStatus != "Submitted")
						{
							responseEditLink = "";
						}
		
						var docIcon = "<img src= '" + Audit.Common.Utilities.GetSiteUrl() + "/_layouts/images/" + oResponseDoc.docIcon.get_value() + "'></img>";
						var link = "<a href='../_layouts/download.aspx?SourceUrl=" + oResponseDoc.folder + "/" + oResponseDoc.title + "'>" + oResponseDoc.title + "</a>";
						
						var checkinLink = "";
						if( oResponseDoc.checkedOutBy != "" )
						{
							checkinLink = oResponseDoc.checkedOutBy + ' <img style="background-color: transparent;" src="/_layouts/images/checkin.gif" title="Check In Document"/><a href="javascript:void(0)" title="Check In Document" onclick="Audit.IAReport.Report.CheckInResponseDoc(\'' + oResponseDoc.folder + '\',\'' + oResponseDoc.title + '\')">Check In Document</a>';
						}
						
						var styleTag = Audit.Common.Utilities.GetResponseDocStyleTag( oResponseDoc.documentStatus );

						var deleteLink = "";
						if( (oResponseDoc.documentStatus == "Open" || oResponseDoc.documentStatus == "Marked for Deletion" ) && ( oResponseSummary.request.status == "Open" || oResponseSummary.request.status == "ReOpened" ) )
							deleteLink = "<span style='float:right'><a title='Delete Response Document' href='javascript:void(0)' onclick='Audit.IAReport.Report.DeleteResponseDoc(\"" + oResponseDoc.ID + "\")'><span class='ui-icon ui-icon-trash'>Delete Response Document</span></a></span>";					

						if( oResponseDoc.documentStatus == "Marked for Deletion" )//decided later that marked for deletion shouldn't be shown to IA to avoid confusion
							continue; 
							
						sReponseDocs += '<tr class="requestInfo-response-doc-item collapsed" ' + styleTag + '>' + 
							'<td>' + docIcon + '</td>' +
							'<td class="requestInfo-response-doc-title" title="Click to Download">' + link + deleteLink + '</td>' +
							'<td nowrap>' + oResponseDoc.receiptDate + '</td>' +
							'<td nowrap>' + oResponseDoc.fileSize + '</td>' +
							'<td nowrap>' + checkinLink + '</td>' +
							'<td nowrap>' + oResponseDoc.documentStatus + '</td>' +
							'<td nowrap>' + oResponseDoc.rejectReason + '</td>' +
							'<td class="requestInfo-response-doc-modified">' + oResponseDoc.modifiedDate + '</td>' +
							'<td class="requestInfo-response-doc-modifiedBy">' + oResponseDoc.modifiedBy + '</td>' +
							'<td class="requestInfo-response-doc-action">' + responseDocLink + responseEditLink + '</td>' +
						'</tr>';
						cnt++;
					}
				}
			}
			
			$("#tblResponseDocs tbody").append( sReponseDocs );
			if( cnt > 0 )
			{
				$("#tblResponseDocsTotal").text( cnt );
				$("#tblResponseDocs").show();
			}
		
			Audit.Common.Utilities.BindHandlerResponseDoc();
		}
	}
	
	function DisplayCheckedOutFiles( arr )
	{
		$("#divCheckedOutResponseDocs").hide();
		
		var sCheckedOutFiles = "<ul>";
		for( var x = 0; x < arr.length; x ++ )
		{
			var oResponseDoc = arr[x];

			var responseTitle = oResponseDoc ["title"] + " (" + oResponseDoc ["checkedOutBy"] + ")";
			var oRequest = oResponseDoc ["request"];

			var link = "<a href=\"javascript:void(0);\" title='Go to Request Details' onclick='Audit.IAReport.Report.GoToRequest(\"" + oRequest.number  + "\")'>" + responseTitle + "</a>";

			sCheckedOutFiles += "<li>" + link + "</li>";
		}
		sCheckedOutFiles += "</ul>";

		if( arr.length > 0 )
		{
			$("#divCheckedOutResponseDocsItems").html( sCheckedOutFiles );
			$("#divCheckedOutResponseDocs").show();
		}
		else
		{
			$("#divCheckedOutResponseDocsItems").html( "" );
		}
	}

	function DisplayRequestsThatShouldClose()
	{		
		$("#divRequestsThatNeedToClose").hide();

		if( m_arrRequests == null || m_arrRequests.length == 0 )
			return;
		
		m_arrRequestsToClose = new Array();	
		for( var x = 0; x < m_arrRequests.length; x ++ )
		{
			var oRequest =  m_arrRequests[x];
						
			if(oRequest.status != "Closed") //check if all responses are closed
			{
				var countClosed = 0;
				for( var y = 0; y < oRequest.responses.length; y++ )
				{
					if( oRequest.responses[y].resStatus == "7-Closed")
					{
						countClosed++;
					}
				}
				
				if( oRequest.responses.length > 0 && oRequest.responses.length == countClosed )
				{
					var lastClosedDate = null;
					var lastClosedBy = null;
					var lastResponseId = null;
					var oResponse = null;
					for( var y = 0; y < oRequest.responses.length; y++ )
					{
						var closedDate = oRequest.responses[y].item.get_item('ClosedDate');
						if ( lastClosedDate == null || lastClosedDate < closedDate )
						{
							lastClosedDate = closedDate;
							lastClosedBy = oRequest.responses[y].closedBy;
							lastResponseId = oRequest.responses[y].title;
							oResponse = oRequest.responses[y];
						}
					}				
					
					m_arrRequestsToClose.push( {requestNumber: oRequest.number, lastResponseId: lastResponseId, lastClosedDate: lastClosedDate , lastClosedBy : lastClosedBy, oResponse: oResponse} );
				}
			}
		}	
		
		if( m_arrRequestsToClose.length > 0 )
		{
			$("#divRequestsThatNeedToClose").show();

			var sRequestsToClose = "";
			for( var x = 0; x < m_arrRequestsToClose.length; x ++ )
			{
				var oIt = m_arrRequestsToClose[x];
				
				var sLastClosedDate = "";
				if( oIt.lastClosedDate != null && oIt.lastClosedDate != "" )
					sLastClosedDate = oIt.lastClosedDate.format("MM/dd/yyyy hh:mm tt");
				
				//sRequestsToClose += "<tr><td>" + oIt.requestNumber + "</td><td><b>" +  oIt.lastResponseId + "</b> on <b>" + sLastClosedDate + "</b> by <b>" + oIt.lastClosedBy + "</b></td><td><a href='javascript:void(0)' title='Click here to Close this Request' onClick='Audit.IAReport.Report.CloseRequest(\"" + oIt.requestNumber  + "\")'>Close Request</a></td></tr>";
				//making user go to the request so that on 3rd tab, the permissions on the request have loaded					
				sRequestsToClose += "<tr><td>" + oIt.requestNumber + "</td><td><b>" +  oIt.lastResponseId + "</b> on <b>" + sLastClosedDate + "</b> by <b>" + oIt.lastClosedBy + "</b></td><td><a href='javascript:void(0)' title='Click here to Go to this Request' onClick='Audit.IAReport.Report.GoToRequest(\"" + oIt.requestNumber  + "\")'>Go to Request</a></td></tr>";
			}	

			$("#tblRequestsThatNeedToClose tbody").empty().append( sRequestsToClose );
		}
	}
	
	function LoadTabStatusReport1(arr, fbody)
	{		
		$('#' + fbody).empty();
		$('#' + fbody).html('');		
		
		if( arr == null )
			return;
		
		var arrInternalAlmostDue = new Array();
		var arrInternalPastDue = new Array();
		var arrAlmostDue = new Array();
		var arrPastDue = new Array();
		var arrRequestsWithNoResponses = new Array();
		
		var output = "";
		for( var x = 0; x < arr.length; x++ )
		{
			var oRequest = arr[x];
					
			var sample = Audit.Common.Utilities.GetTrueFalseIcon( oRequest.sample );
			var link = "<a href=\"javascript:void(0);\" title='Go to Request Details' onclick='Audit.IAReport.Report.GoToRequest(\"" + oRequest.number  + "\")'>" + oRequest.number + "</a>";

			var internalDueDateStyle = "";
			var dueDateStyle = "";
			if( m_fnIsRequestPastDue( oRequest, 0 ) )
			{
				internalDueDateStyle = ' style="background-color:salmon; font-weight:bold" title="Past Due"';
				arrInternalPastDue.push( [oRequest.number, oRequest.number] );
			}
			else if( m_fnIsRequestAlmostDue( oRequest, 0 ) )
			{
				internalDueDateStyle = ' style="background-color:coral; font-weight:bold" title="Almost Due"';				
				arrInternalAlmostDue.push( [oRequest.number, oRequest.number] );
			}
			
			if( m_fnIsRequestPastDue( oRequest, 1 ) )
			{
				dueDateStyle = ' style="background-color:salmon; font-weight:bold" title="Past Due"';				
				arrPastDue.push( [oRequest.number, oRequest.number] );
			}
			else if( m_fnIsRequestAlmostDue( oRequest, 1 ) )
			{
				dueDateStyle = ' style="background-color:coral; font-weight:bold" title="Almost Due"';				
				arrAlmostDue.push( [oRequest.number, oRequest.number] );
			}
			
			if( oRequest.responses.length == 0 )
			{
				arrRequestsWithNoResponses.push( [oRequest.number, oRequest.number] );
			}
			
			var rowResponseDocCountid = "sr1-request-responseDocCount-" + oRequest.number;
			output += '<tr class="sr1-request-item">' + 
				'<td class="sr1-request-requestNum">' + link + '</td>' +
				'<td class="sr1-request-subject">' + oRequest.subject + '</td>' +
				'<td class="sr1-request-status">' + oRequest.status + '</td>' +
				'<td class="sr1-request-internalDueDate"' + internalDueDateStyle + '">' + oRequest.internalDueDate + '</td>' +
				'<td class="sr1-request-dueDate"' + dueDateStyle + '>' + oRequest.dueDate + '</td>' +
				'<td class="sr1-request-sample">' + sample + '</td>' +
				'<td class="sr1-request-actionOffice">' + oRequest.actionOffice + '</td>' +
				'<td class="sr1-request-responseCount">' + oRequest.responses.length + '</td>' +
				'<td class="sr1-request-responsesOpenCount">' + oRequest.responsesOpenCnt + '</td>' +
				'<td class="sr1-request-responseDocCount" id="' + rowResponseDocCountid + '">0</td>' +
			'</tr>';				
		}
		
		$('#' + fbody).append( output );				
		$("#spanRequestsTotal").text( arr.length );
		$("#spanRequestsDisplayedTotal").text( arr.length );
				
		DisplayErrorMsg ( arrInternalAlmostDue, "divRequestsAlmostInternalDue", "divRequestsAlmostInternalDueItems");
		DisplayErrorMsg ( arrAlmostDue, "divRequestsAlmostDue", "divRequestsAlmostDueItems");
		DisplayErrorMsg ( arrInternalPastDue, "divRequestsPastInternalDue", "divRequestsPastInternalDueItems");
		DisplayErrorMsg ( arrPastDue, "divRequestsPastDue", "divRequestsPastDueItems");
		DisplayErrorMsg ( arrRequestsWithNoResponses, "divRequestsWithNoResponse", "divRequestsWithNoResponseItems");		
	}
	
	function DisplayErrorMsg( arr, container, containerItems )
	{
		if( arr == null ) return;
		
		if( arr.length > 0 )
		{
			var msg = "<ul>";
			for( var x = 0; x < arr.length; x++ )
			{
				if( arr[x][2] == null )
					var link = "<a href=\"javascript:void(0);\" title='Go to Request Details' onclick='Audit.IAReport.Report.GoToRequest(\"" + arr[x][1]  + "\")'>" + arr[x][0] + "</a>";
				else //this will go to response on the 3rd tab
					var link = "<a href=\"javascript:void(0);\" title='Go to Request Details' onclick='Audit.IAReport.Report.GoToRequest(\"" + arr[x][1]  + "\",\"" + arr[x][2]  + "\")'>" + arr[x][0] + "</a>";
				msg += "<li>" + link  + "</li>";
			}
			msg += "</ul>";
			
			$("#" + container).show();
			$("#" + containerItems ).html( msg );
		}
	}

	function LoadTabStatusReport2(arr, fbody)
	{		
		$('#' + fbody).empty();
		$('#' + fbody).html('');		
		
		if( arr == null )
			return;

		var arrSubmittedResponsesByAO = new Array();

		var cnt = 0;
		var output = "";
		for( var x = 0; x < arr.length; x++ )
		{
			var oRequest = arr[x];
					
			for( var y = 0; y < oRequest.responses.length; y++ )
			{			
				var oResponse = oRequest.responses[y];
				
				var link = "<a href=\"javascript:void(0);\" title='Go to Request Details' onclick='Audit.IAReport.Report.GoToRequest(\"" + oRequest.number  + "\", \"" + oResponse.title  + "\")'>" + oRequest.number + "</a>";
				
				var rowResponseDocCountid = "sr2-response-docCount-" + oResponse.title;
				output += '<tr class="sr2-response-item">' + 
					'<td class="sr2-response-requestNum">' + link + '</td>' +
					'<td class="sr2-response-sample">' + oResponse.sample + '</td>' +
					'<td class="sr2-response-title">' + oResponse.title + '</td>' +
					'<td class="sr2-response-internalDueDate">' + oRequest.internalDueDate + '</td>' +
					'<td class="sr2-response-status">' + oResponse.resStatus + '</td>' +
					'<td class="sr2-response-ao">' + oResponse.actionOffice + '</td>' +
					'<td class="sr2-response-docCount" id="' + rowResponseDocCountid + '"></td>' +
					'<td class="sr2-response-modified" nowrap>' + oResponse.modified + '</td>' +
				'</tr>';	
				cnt++;			
				
				if( oResponse.resStatus == "2-Submitted")
					arrSubmittedResponsesByAO.push( [oResponse.title, oRequest.number, oResponse.title] );
			}	
		}
		
		$('#' + fbody).append( output );				
		$("#spanResponsesTotal").text( cnt );
		$("#spanResponsesDisplayedTotal").text( cnt );
	
		DisplayErrorMsg ( arrSubmittedResponsesByAO , "divResponsesSubmitted", "divResponsesSubmittedItems");
		
		return cnt;
	}

	function m_fnViewPermissions()
	{
		window.open(Audit.Common.Utilities.GetSiteUrl() + "/pages/AuditPermissions.aspx", "_blank");
	}

	function m_fnIsRequestAlmostDue( oRequest, type)
	{
		var todayDate = new Date();
		var dueDate = null;
		if( type == 0 )
			dueDate = oRequest.internalDueDate;
		else if( type == 1 )
			dueDate = oRequest.dueDate;

		if( dueDate == null || dueDate == "" )
			return false;

		dueDate = new Date( dueDate );
		
		var one_day = 1000*60*60*24;
		var difference = Math.ceil( (todayDate.getTime() - dueDate.getTime())/(one_day) );
		
		if( (oRequest.status == "Open" || oRequest.status == "ReOpened") && difference >= 0 && difference <= 3 )
		{
			return true;
		}
		
		return false;
	}

	function m_fnIsRequestPastDue( oRequest, type )
	{
		var todayDate = new Date();
		var dueDate = null;
		if( type == 0 )
			dueDate = oRequest.internalDueDate;
		else if( type == 1 )
			dueDate = oRequest.dueDate;
		
		if( dueDate == null || dueDate == "" )
			return false;

		dueDate = new Date( dueDate );

		if( (oRequest.status == "Open" || oRequest.status == "ReOpened") && todayDate.getTime() >= dueDate.getTime() )
		{
			return true;
		}
		
		return false;
	}
	
	function m_fnCreateRequest()
	{
		if( !m_bIsSiteOwner )
		{
			SP.UI.Notify.addNotification("You do not have access to perform this action...", false);
			return;
		}

		m_bIsTransactionExecuting = true;
		
		var formName = "CustomNewForm.aspx";
		var options = SP.UI.$create_DialogOptions();	
		options.title = "Create a new Request";
		options.dialogReturnValueCallback = OnCallbackFormNewRequest;

		options.url = Audit.Common.Utilities.GetSiteUrl() + "/Lists/" + Audit.Common.Utilities.GetListNameRequests() + "/" + formName + "?Source=" + location.pathname;

		SP.UI.ModalDialog.showModalDialog(options);
	}
	
	function m_fnViewRequest( id ) 
	{	
		m_bIsTransactionExecuting = true;
		
		var formName = "DispForm.aspx";
		var options = SP.UI.$create_DialogOptions();	
		options.title = "View Request (ID:" + id + ")";
		options.height = 850;
		options.dialogReturnValueCallback = OnCallbackForm;

		options.url = Audit.Common.Utilities.GetSiteUrl() + "/Lists/" + Audit.Common.Utilities.GetListNameRequests() + "/" + formName + "?ID=" + id + GetSourceUrlForForms();

		SP.UI.ModalDialog.showModalDialog(options);
	}
	
	function m_fnEditRequest( id, requestNum ) 
	{		
		if( !m_bIsSiteOwner )
		{
			SP.UI.Notify.addNotification("You do not have access to perform this action...", false);
			return;
		}

		m_bIsTransactionExecuting = true;

		m_itemID = id;
		m_requestNum = requestNum;
		
		var formName = "EditForm.aspx";
		var options = SP.UI.$create_DialogOptions();	
		options.title = "Edit Request (" + requestNum + ")";
		options.dialogReturnValueCallback = OnCallbackFormEditRequest;
		
		//pass in request number so that the list form knows it came from the IA db and prevents saves otherwise
		options.url = Audit.Common.Utilities.GetSiteUrl() + "/Lists/" + Audit.Common.Utilities.GetListNameRequests() + "/" + formName + "?ID=" + id + "&ReqNum=" + requestNum + GetSourceUrlForForms();

		SP.UI.ModalDialog.showModalDialog(options);
	}
		
	function m_fnViewRequestDoc( id ) 
	{		
		m_bIsTransactionExecuting = true;

		var formName = "DispForm.aspx";
		var options = SP.UI.$create_DialogOptions();	
		options.title = "View Request Doc (ID:" + id + ")";
		options.dialogReturnValueCallback = OnCallbackForm;

		options.url = Audit.Common.Utilities.GetSiteUrl() + "/"+ Audit.Common.Utilities.GetLibNameRequestDocs() + "/Forms/" + formName + "?ID=" + id + GetSourceUrlForForms();

		SP.UI.ModalDialog.showModalDialog(options);
	}
	
	function m_fnEditRequestDoc( id ) 
	{		
		if( !m_bIsSiteOwner )
		{
			SP.UI.Notify.addNotification("You do not have access to perform this action...", false);
			return;
		}

		m_bIsTransactionExecuting = true;

		var formName = "CustomEditForm.aspx";
		var options = SP.UI.$create_DialogOptions();	
		options.title = "Edit Request Doc (ID:" + id + ")";
		options.height = "600";
		options.dialogReturnValueCallback = OnCallbackForm;

		options.url = Audit.Common.Utilities.GetSiteUrl() + "/"+ Audit.Common.Utilities.GetLibNameRequestDocs() + "/Forms/" + formName + "?ID=" + id + GetSourceUrlForForms();

		SP.UI.ModalDialog.showModalDialog(options);
	}
	
	function m_fnUploadRequestDoc( requestNum )
	{	
		if( !m_bIsSiteOwner )
		{
			SP.UI.Notify.addNotification("You do not have access to perform this action...", false);
			return;
		}

		m_bIsTransactionExecuting = true;

		var options = SP.UI.$create_DialogOptions();	
		options.title = "Upload Request Document to: " +  requestNum ;
		options.dialogReturnValueCallback = OnCallbackForm;

		var rootFolder = Audit.Common.Utilities.GetSiteUrl() + "/" + Audit.Common.Utilities.GetLibNameRequestDocs();
		
		options.url = Audit.Common.Utilities.GetSiteUrl() + "/_layouts/Upload.aspx?List=" + m_libRequestDocsLibraryGUID + "&RootFolder=" + rootFolder + "&ReqNum=" + requestNum + GetSourceUrlForForms();
		//notifyId = SP.UI.Notify.addNotification("Uploading documents to: " + options.url, false);
		SP.UI.ModalDialog.showModalDialog(options);
	}

	function m_fnViewCoverSheet( id ) 
	{		
		m_bIsTransactionExecuting = true;

		var formName = "DispForm.aspx";
		var options = SP.UI.$create_DialogOptions();	
		options.title = "View Coversheet (ID:" + id + ")";
		options.dialogReturnValueCallback = OnCallbackFormCoverSheet;
		
		options.url = Audit.Common.Utilities.GetSiteUrl() + "/"+ Audit.Common.Utilities.GetLibNameCoverSheets() + "/Forms/" + formName + "?ID=" + id + GetSourceUrlForForms();
		
		SP.UI.ModalDialog.showModalDialog(options);
	}
	
	function m_fnEditCoverSheet( id, requestNum) 
	{		
		if( !m_bIsSiteOwner )
		{
			SP.UI.Notify.addNotification("You do not have access to perform this action...", false);
			return;
		}

		m_bIsTransactionExecuting = true;

		var formName = "CustomEditForm.aspx";
		var options = SP.UI.$create_DialogOptions();	
		options.title = "Edit Coversheet (ID:" + id + ")";
		options.height = "600";
		options.dialogReturnValueCallback = OnCallbackFormCoverSheet;
		
		options.url = Audit.Common.Utilities.GetSiteUrl() + "/"+ Audit.Common.Utilities.GetLibNameCoverSheets() + "/Forms/" + formName + "?ID=" + id + "&ReqNum=" + requestNum + GetSourceUrlForForms();
		
		SP.UI.ModalDialog.showModalDialog(options);
	}
	
	function m_fnUploadCoverSheet( requestNum )
	{
		if( !m_bIsSiteOwner )
		{
			SP.UI.Notify.addNotification("You do not have access to perform this action...", false);
			return;
		}

		m_bIsTransactionExecuting = true;

		var options = SP.UI.$create_DialogOptions();	
		options.title = "Upload Cover Sheet/Supplemental Document to: " +  requestNum;
		options.dialogReturnValueCallback = OnCallbackFormCoverSheet;

		var rootFolder = Audit.Common.Utilities.GetSiteUrl() + "/" + Audit.Common.Utilities.GetLibNameCoverSheets();
		
		options.url = Audit.Common.Utilities.GetSiteUrl() + "/_layouts/Upload.aspx?List=" + m_libCoverSheetLibraryGUID + "&RootFolder=" + rootFolder + "&ReqNum=" + requestNum + GetSourceUrlForForms();		
		//notifyId = SP.UI.Notify.addNotification("Uploading documents to: " + options.url, false)
		
		SP.UI.ModalDialog.showModalDialog(options);
	}

	function m_fnBulkAddResponse( id )
	{
		if( !m_bIsSiteOwner )
		{
			SP.UI.Notify.addNotification("You do not have access to perform this action...", false);
			return;
		}

		m_bIsTransactionExecuting = true;
		
		var options = SP.UI.$create_DialogOptions();	
		options.title = "Bulk Add Responses (" + id + ")";
		options.dialogReturnValueCallback = OnCallbackFormBulkAddResponse;
		options.height = 800;
		options.url = Audit.Common.Utilities.GetSiteUrl() + "/pages/AuditBulkAddResponse.aspx?ReqNum=" + id + GetSourceUrlForForms();
		
		SP.UI.ModalDialog.showModalDialog(options);		
	}

	function m_fnGetNextSampleNumber( id )
	{
		var sampleNumber = 0;
		for( var x = 0; x < m_arrRequests.length; x ++ )
		{
			if( m_arrRequests[x].number == id )
			{
				for( var y = 0; y < m_arrRequests[x].responses.length; y++ )
				{
					if( m_arrRequests[x].responses[y].sample > sampleNumber )
						sampleNumber = m_arrRequests[x].responses[y].sample;
				}
				
				if( m_arrRequests[x].responses.length > 0 )
					sampleNumber++;
					
				break;
			}
		}
		return sampleNumber;
	}
	
	function m_fnAddResponse( id ) 
	{		
		if( !m_bIsSiteOwner )
		{
			SP.UI.Notify.addNotification("You do not have access to perform this action...", false);
			return;
		}

		m_bIsTransactionExecuting = true;
		
		var sampleNumber = m_fnGetNextSampleNumber( id );	
	
		var formName = "CustomNewForm.aspx";
		var options = SP.UI.$create_DialogOptions();	
		options.title = "Add Response to (Request Number:" + id + ")";
		options.dialogReturnValueCallback = OnCallbackFormNewResponse;
		
		options.url = Audit.Common.Utilities.GetSiteUrl() + "/Lists/" + Audit.Common.Utilities.GetListNameResponses() + "/" + formName + "?ReqNum=" + id + "&Sample=" + sampleNumber;
		
		SP.UI.ModalDialog.showModalDialog(options);
	}

	function m_fnViewResponse( requestNumber, id, responseTitle, responseStatus ) 
	{		
		m_bIsTransactionExecuting = true;

		//in case they click edit item from the view form
		m_requestNum = requestNumber;
		m_itemID = id;
		m_responseTitle = responseTitle;
		m_responseStatus = responseStatus;
	
		var formName = "DispForm.aspx";
		var options = SP.UI.$create_DialogOptions();	
		options.title = "View Response (" + responseTitle + ")";
		options.height = 600;
		options.dialogReturnValueCallback = OnCallbackForm;
		
		options.url = Audit.Common.Utilities.GetSiteUrl() + "/Lists/" + Audit.Common.Utilities.GetListNameResponses() + "/" + formName + "?ID=" + id + GetSourceUrlForForms();
		
		SP.UI.ModalDialog.showModalDialog(options);
	}
	
	function m_fnEditResponse( requestNumber, id, responseTitle, responseStatus ) 
	{	
		if( !m_bIsSiteOwner )
		{
			SP.UI.Notify.addNotification("You do not have access to perform this action...", false);
			return;
		}

		m_bIsTransactionExecuting = true;

		m_requestNum = requestNumber;
		m_itemID = id;
		m_responseTitle = responseTitle;
		m_responseStatus = responseStatus;
	
		var formName = "CustomEditForm.aspx";
		var options = SP.UI.$create_DialogOptions();	
		options.title = "Edit Response (" + responseTitle + ")";
		options.dialogReturnValueCallback = OnCallbackFormEditResponse;
		
		options.url = Audit.Common.Utilities.GetSiteUrl() + "/Lists/" + Audit.Common.Utilities.GetListNameResponses() + "/" + formName + "?ID=" + id + GetSourceUrlForForms();
		
		SP.UI.ModalDialog.showModalDialog(options);
	}

	function m_fnViewResponseDoc( id, requestID, responseID ) 
	{			
		m_bIsTransactionExecuting = true;

		var formName = "DispForm.aspx";
		var options = SP.UI.$create_DialogOptions();	
		options.title = "View Response Doc (ID:" + id + ")";
		options.height = "600";
		options.dialogReturnValueCallback = OnCallbackForm;
		
		options.url = Audit.Common.Utilities.GetSiteUrl() + "/"+ Audit.Common.Utilities.GetLibNameResponseDocs() + "/Forms/" + formName + "?ID=" + id + "&ReqNum=" + requestID + "&ResID=" + responseID + GetSourceUrlForForms();
		
		//alert( options.url );
		SP.UI.ModalDialog.showModalDialog(options);
	}
	
	function m_fnEditResponseDoc( id, requestID, responseID ) 
	{		
		if( !m_bIsSiteOwner )
		{
			SP.UI.Notify.addNotification("You do not have access to perform this action...", false);
			return;
		}

		m_bIsTransactionExecuting = true;

		//unable to use custom edit form in the document library because of folders
		var formName = "EditForm.aspx";
		var options = SP.UI.$create_DialogOptions();	
		options.title = "Edit ResponseDoc (ID:" + id + ")";
		options.dialogReturnValueCallback = OnCallbackForm;
				
		options.url = Audit.Common.Utilities.GetSiteUrl() + "/"+ Audit.Common.Utilities.GetLibNameResponseDocs() + "/Forms/" + formName + "?ID=" + id + "&ReqNum=" + requestID + "&ResID=" + responseID + GetSourceUrlForForms();
		//alert( options.url );
		
		SP.UI.ModalDialog.showModalDialog(options);
	}
	
	function m_fnCheckInResponseDoc( folder, fileName )
	{
		if( !m_bIsSiteOwner )
		{
			SP.UI.Notify.addNotification("You do not have access to perform this action...", false);
			return;
		}

		m_bIsTransactionExecuting = true;

		var options = SP.UI.$create_DialogOptions();	
		options.title = "Check in Response Document";
		options.height = "600";
		options.dialogReturnValueCallback = OnCallbackForm;
		
		options.url = Audit.Common.Utilities.GetSiteUrl() + "/_layouts/checkin.aspx?List={" + m_libResponseDocsLibraryGUID + "}&FileName=" + folder + "/" + fileName ;	

		SP.UI.ModalDialog.showModalDialog(options);
	}
	
	function m_fnViewResponseDocFolder( title )
	{
		m_bIsTransactionExecuting = true;

		var options = SP.UI.$create_DialogOptions();	
		options.title = "View Response Folder";
		options.height = "600";
		options.dialogReturnValueCallback = OnCallbackForm;
		
		//if they delete a document in this window, we want them to return to the current page
		options.url = Audit.Common.Utilities.GetSiteUrl() + "/pages/AuditResponseDocs.aspx?RootFolder=" + Audit.Common.Utilities.GetSiteUrl() + "/" + Audit.Common.Utilities.GetLibNameResponseDocs() + "/" + title;	
		//options.url = Audit.Common.Utilities.GetSiteUrl() + "/pages/AuditResponseDocs.aspx?RootFolder=" + Audit.Common.Utilities.GetSiteUrl() + "/" + Audit.Common.Utilities.GetLibNameResponseDocs() + "/" + title + GetSourceUrlForForms();	
		//options.url = m_siteUrl + "/"+ m_libNameResponseDocs + "/" + title;	
		//options.url = m_siteUrl + "/"+ m_libNameResponseDocs + "?RootFolder=" + m_siteUrl + "/"+ m_libNameResponseDocs + "/" + title;
		SP.UI.ModalDialog.showModalDialog(options);
	}
	
	function m_fnViewEmailHistoryFolder( reqNum )
	{
		m_bIsTransactionExecuting = true;

		var options = SP.UI.$create_DialogOptions();	
		options.title = "View Email History";
		//options.height = "600";
		//options.width = "900";
		options.autoSize = true;
		options.dialogReturnValueCallback = OnCallbackForm;
		
		options.url = Audit.Common.Utilities.GetSiteUrl() + "/pages/AuditEmailHistory.aspx?RootFolder=" + Audit.Common.Utilities.GetSiteUrl() + "/Lists/"+ Audit.Common.Utilities.GetListNameEmailHistory() + "/" + reqNum + GetSourceUrlForForms();	
		
		SP.UI.ModalDialog.showModalDialog(options);
	}
	
	//A response doc should end up in a folder under the response doc library and have the request ID and response ID specified
	function m_fnUploadResponseDoc( requestID, responseID )
	{
		if( !m_bIsSiteOwner )
		{
			SP.UI.Notify.addNotification("You do not have access to perform this action...", false);
			return;
		}

		m_bIsTransactionExecuting = true;
		//notifyId = SP.UI.Notify.addNotification("<span style='font-size:11pt'><span class='ui-icon ui-icon-info'></span>Please <span style='font-weight:bold; color:green'>zip</span> the documents you are uploading.</span>", false);
		
		var waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose("Loading...", "<span style='font-size:11pt'><span class='ui-icon ui-icon-info'></span>If you are uploading <span style='font-weight:bold; color:green;text-decoration:underline'>multiple</span> documents, please <span style='font-weight:bold; color:green;text-decoration:underline'>zip </span> them.</span>", 100, 600);
		
		setTimeout( function()
		{
			waitDialog.close();
			
			var options = SP.UI.$create_DialogOptions();	
			options.title = "Upload Response Document to: " +  responseID;
			options.dialogReturnValueCallback = OnCallbackForm;
	
			//this subfolder should have been created when the response was created
			var rootFolder = Audit.Common.Utilities.GetSiteUrl() + "/" + Audit.Common.Utilities.GetLibNameResponseDocs() + "/" + responseID;
			
			options.url = Audit.Common.Utilities.GetSiteUrl() + "/_layouts/Upload.aspx?List=" + m_libResponseDocsLibraryGUID + "&RootFolder=" + rootFolder + "&ReqNum=" + requestID + "&ResID=" + responseID;
			//notifyId = SP.UI.Notify.addNotification("Uploading documents to: " + options.url, false)
			SP.UI.ModalDialog.showModalDialog(options);
		}, 3000);
	}
	
	function m_fnDeleteResponseDoc( itemID )
	{
		if( !m_bIsSiteOwner )
		{
			SP.UI.Notify.addNotification("You do not have access to perform this action...", false);
			return;
		}

		if( confirm("Are you sure you would like to Delete this Response Document?") )
		{
			m_bIsTransactionExecuting = true;

			var currCtx = new SP.ClientContext(); 
			var responseDocsLib = currCtx.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetLibNameResponseDocs() );

		    this.oListItem = responseDocsLib.getItemById( itemID );
		
		    oListItem.recycle();
		
			function OnSuccess(sender, args)
			{		
				m_fnRefresh();
			}		
			function OnFailure(sender, args)
			{
				statusId = SP.UI.Status.addStatus("Request failed: "  + args.get_message() + "\n" + args.get_stackTrace());
	   			SP.UI.Status.setStatusPriColor(statusId, 'red');
			}
			currCtx.executeQueryAsync(OnSuccess, OnFailure);	
		}
	}
	
		//if request is closed, re-open request and reset perms
	//reset perms on response
	function m_fnReOpenResponse( requestNumber, responseTitle )
	{
		if( !m_bIsSiteOwner )
		{
			SP.UI.Notify.addNotification("You do not have access to perform this action...", false);
			return;
		}

		if( confirm( "Are you sure you would like to re-open this response (" + responseTitle + ")?" ))
		{
			m_bIsTransactionExecuting = true;
			
			document.body.style.cursor = 'wait';
		
			var currCtx2 = new SP.ClientContext.get_current();

			for( var y = 0; y < m_arrRequests.length; y++ )
			{
				if( m_arrRequests[y].number == requestNumber )
				{														
					for( var z = 0; z < m_arrRequests[y].responses.length; z++ )
					{
						//update the status of the response to open
						if( m_arrRequests[y].responses[z].title == responseTitle )
						{
							m_arrRequests[y].responses[z].item.set_item("ResStatus", "1-Open");
							m_arrRequests[y].responses[z].item.update();
							m_fnBreakResponseAndFolderPermissions( "ReOpened", m_arrRequests[y].responses[z], false, true );
		
							break;
						}
					}
					
					//make sure the status of the request is open
					//Todo: check here if request was closed, that it's now Reopened. If it was closed or canceled, open it. if it was open, do nothing to request
					var oListItem = m_arrRequests[y].item;	
					var curRequestStatus = oListItem.get_item("ReqStatus");
					if( curRequestStatus == "Closed" )
					{
						oListItem.set_item("ReqStatus", "ReOpened");
						oListItem.update();
					}
					else if ( curRequestStatus != "Open" ) 
					{
						oListItem.set_item("ReqStatus", "Open");					
						oListItem.update();
					}
					
					m_fnBreakRequestPermissions(oListItem, false );	
				}
			}
			
			currCtx2.executeQueryAsync
			(
				function () 
				{					
					setTimeout( function(){ m_fnRefresh()}, 1000 ); //add delay on this so that the other requests can refresh permissions and it will display properly
				}, 
				function (sender, args) 
				{
					alert( "Request failed: "  + args.get_message() + "\n" + args.get_stackTrace() );
					setTimeout( function(){ m_fnRefresh()}, 1000 ); //add delay on this so that the other requests can refresh permissions and it will display properly
				}
			);
						
		}
	}
	
	function m_fnCloseRequest()
	{
		if( !m_bIsSiteOwner )
		{
			SP.UI.Notify.addNotification("You do not have access to perform this action...", false);
			return;
		}
		
		var requestNumberToClose = $("#ddlReqNum").val();

		if( confirm("Are you sure you would like to Close this Request (" + requestNumberToClose + ")?" ) )
		{
			m_bIsTransactionExecuting = true;

			for( var x = 0; x < m_arrRequestsToClose.length; x++ )
			{
				var oIt = m_arrRequestsToClose[x];
				var requestNumber = oIt.requestNumber;
				
				if( requestNumberToClose != requestNumber )
					continue;
					
				var closedDate = oIt.lastClosedDate;
				var closedBy = oIt.lastClosedBy;
				
				var oRequest = m_fnGetRequestByNumber( requestNumber );
								
				oRequest.item.set_item("ClosedDate", oIt.oResponse.item.get_item("ClosedDate"));			
				oRequest.item.set_item("ClosedBy", oIt.oResponse.item.get_item("ClosedBy"));
				oRequest.item.set_item("ReqStatus", "Closed");			
					
				oRequest.item.update();
				
				m_fnBreakRequestPermissions( oRequest.item, true );
			}
		}
	}
	
	function m_fnDisplayHelpResponseDocs()
	{
		var helpDlg = "<div id='helpDlg' style='padding:20px; height:100px; width:700px'>" + 
		"<div style='padding:20px;'><fieldset><legend>Response Document Status</legend> <ul style='padding-top:10px;'>" + 
			"<li style='padding-top:5px;'><b>Open</b> - Uploaded by the Action Office but not yet submitted to the Internal Auditor</li>" + 
			"<li style='padding-top:5px;'><b>Submitted</b> - Submitted to the Internal Auditor by the Action Office</li>" + 
			"<li style='padding-top:5px;'><b>Sent to QA</b> - Submitted to the Quality Assurance team by the Internal Auditor</li>" + 
			"<li style='padding-top:5px;'><b>Approved</b> - Approved by the Quality Assurance team and submitted to the External Auditor</li>" + 
			"<li style='padding-top:5px;'><b>Rejected</b> - Rejected by the Quality Assurance team and returned to the Internal Auditor</li>" + 
			"<li style='padding-top:5px;'><b>Archived</b> - Previously Rejected by the Quality Assurance team and is now read-only for record keeping</li>" + 
			"</ul></fieldset></div>" + 	
			"<table style='padding-top:10px; width:200px; float:right;'>" + 
				"<tr><td class='ms-separator'>&#160;</td><td><input id='btnCancel' type='button' class='ms-ButtonHeightWidth' value='Close' title='Close Help' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)'/></td></tr>" + 
			"</table></div>";
		
		$('body').append( helpDlg );
		
		var options = SP.UI.$create_DialogOptions();	
		options.title = "Response Documents Help";
		options.dialogReturnValueCallback = OnCallbackForm;
		options.html = document.getElementById("helpDlg");
		SP.UI.ModalDialog.showModalDialog(options);

	}
	
	function m_fnGetRequest( requestNumber )
	{
		for( var x = 0; x < m_arrRequests.length; x++ )
		{
			if( m_arrRequests[x].number == requestNumber )
				return m_arrRequests[x];
		}
		return null;
	}

	
	function m_fnGetRequestByNumber ( requestNumber )
	{
		//this can be stale... 
		var oRequest = null;
		for( var x = 0; x < m_arrRequests.length; x++ )
		{
			if( m_arrRequests[x].number == requestNumber )
			{
				oRequest = m_arrRequests[x];
				break;
			}
		}
		return oRequest;
	}

	function m_fnGetRequestByID( requestID )
	{
		var oRequest = null;
		for( var y = 0; y < m_arrRequests.length; y++ )
		{
			if( m_arrRequests[y].ID == requestID )
			{
				oRequest = m_arrRequests[y];
				break;
			}
		}
		
		return oRequest;
	}
	
	function m_fnFormatEmailBodyToAO ( oRequest, responseTitles )
	{
		var emailText = "<div>Audit Request Reference: <b>REQUEST_NUMBER</b></div>" +
			"<div>Audit Request Subject: <b>REQUEST_SUBJECT</b></div>" +		
			"<div>Audit Request Due Date: <b>REQUEST_DUEDATE</b></div><br/>" +		
			"REQUEST_RELATEDAUDIT<br/>" +
			"<div>Below are the listed action items that have been requested for the Audit: </div>" +
			"<div>REQUEST_ACTIONITEMS<br/></div>" +		
			//"<div>Below is a link to Cover & Spreadsheet: ??</div>" +
			//"<div>N/A</div>" +
			"<div>Please provide responses for the following Sample(s): </div><br/>" +
			"<div>RESPONSE_TITLES</div>" ;
				

		emailText = emailText.replace("REQUEST_NUMBER", oRequest.number );
		emailText = emailText.replace("REQUEST_SUBJECT", oRequest.subject );
		emailText = emailText.replace("REQUEST_DUEDATE", oRequest.internalDueDate );
		emailText = emailText.replace("REQUEST_ACTIONITEMS", oRequest.actionItems );	
		
		if( responseTitles != null && responseTitles.length > 0 )
		{	
			function sortNumber(a, b) 
			{
				a = parseInt( a.sample, 10);
				b = parseInt( b.sample, 10 );
				
				return a - b;
			}
			responseTitles.sort(sortNumber);
			
			var responseTitleBody = "<ul>";
			for( var x = 0; x < responseTitles.length; x++ )
			{
				responseTitleBody += "<li>" + responseTitles[x].title + "</li>";
			}
			responseTitleBody += "</ul>";
			emailText = emailText.replace("RESPONSE_TITLES", responseTitleBody );	
		}
		else
		{
			emailText = emailText.replace("RESPONSE_TITLES", "" );	
		}
		
		if( oRequest.relatedAudit == null || oRequest.relatedAudit == "" )
			emailText = emailText.replace("REQUEST_RELATEDAUDIT", "<div>This is a new request, not similar to previous audit cycles.</div>");	
		else
			emailText = emailText.replace("REQUEST_RELATEDAUDIT", "<div>This request is similar to this previous cylce audit: " + oRequest.relatedAudit + "</div>");
		return emailText;
	}

	var m_emailCount = 0;
	function m_fnSendEmail( requestID )
	{
		if( !m_bIsSiteOwner )
		{
			SP.UI.Notify.addNotification("You do not have access to perform this action...", false);
			return;
		}

		if( confirm("Are you sure you would like to notify all Action Offices listed in the Email Action Offices field?") )
		{
			m_bIsTransactionExecuting = true;

			var currCtx = new SP.ClientContext.get_current();
			var web = currCtx.get_web();
			
			oRequest = m_fnGetRequestByID( requestID );
			
			if( oRequest == null )
			{
				alert("Error occurred");
				return;
			}

			if( oRequest.status != "Open" && oRequest.status != "ReOpened" )
			{
				SP.UI.Notify.addNotification("This request is not Open.", false);
				return;
			}

			var responseCount = oRequest.responses.length;
			if( responseCount == 0 )
			{
				SP.UI.Notify.addNotification("There are no responses associated with this request.", false);
				return;
			}
			
			var arrEmailActionOffice = new Array();
			var emailActionOffices = oRequest.item.get_item('EmailActionOffice');
			for( var x = 0; x < emailActionOffices.length; x++ )
			{
				arrEmailActionOffice.push( emailActionOffices[x].get_lookupValue() );
			}	
			
			if( arrEmailActionOffice.length == 0 )
			{
				SP.UI.Notify.addNotification("Unable to send an email. 0 Action Offices listed in the Email Action Office field", false);
				return;
			}



			var arrEmails = new Array();
			
			for( var y = 0; y < responseCount; y++ )
			{
				var oResponse = oRequest.responses[y];
				if( oResponse.resStatus != "1-Open" && oResponse.resStatus != "3-Returned to Action Office" )
				{
					SP.UI.Notify.addNotification("Skipping Response (" + oResponse.title + "). It's not Open or Returned to Action Office", false);
					continue;
				}
				
				var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName( oResponse.actionOffice );
				var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup( actionOfficeGroupName );

				if( actionOfficeGroupName == "" || actionOfficeGroupName == null || actionOfficeGroup == null )
				{
					SP.UI.Notify.addNotification("Unable to send an email. Action Office (" + oResponse.actionOffice + ") does not have a group associated with it", false);
					return;
				}
				
				//Iterate through the aos listed in the email action office field and if it matches this AO, then continue to create email for this AO
				var bAddThisAO = false;
				for( var x = 0; x < arrEmailActionOffice.length; x ++ )
				{
					if ( arrEmailActionOffice[x] == oResponse.actionOffice )
					{
						bAddThisAO = true;
						break;
					}
				}
				
				if( bAddThisAO )
				{
					var bFound = false;
					for( var x = 0; x < arrEmails.length; x++ )
					{
						if( arrEmails[x].actionOffice == actionOfficeGroupName)
						{
							var oResSample = new Object();
							oResSample["sample"] = oResponse.sample;
							oResSample["title"] = oResponse.title;
							arrEmails[x].responseTitles.push( oResSample );
							bFound = true;
						}
					}
					
					if ( !bFound )
					{
						var emailObject = new Object();
						emailObject.actionOffice = actionOfficeGroupName;
						emailObject.responseTitles = new Array();
						
						var oResSample = new Object();
						oResSample["sample"] = oResponse.sample;
						oResSample["title"] = oResponse.title;
						
						emailObject.responseTitles.push( oResSample );
						arrEmails.push( emailObject );
					}	
				}
			}
			
			if( arrEmails.length == 0 )
			{
				SP.UI.Notify.addNotification("Unable to send an email. 0 Action Offices in the Email Action Office field match the Responses", false);
				return;
			}					

			m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose("Sending Emails", "Please wait... sending email notifications to Action Offices", 100, 400);

			document.body.style.cursor = 'wait';
			
			var emailList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleEmailHistory() );

			var emailListQuery = new SP.CamlQuery();	
			emailListQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>');
			emailListFolderItems = emailList.getItems( emailListQuery );
			currCtx.load( emailListFolderItems, 'Include(ID, Title, DisplayName)');

			function OnSuccess(sender, args) 
		    {
				if( !Audit.Common.Utilities.CheckIfEmailFolderExists( emailListFolderItems, oRequest.number ) )
		    	{
		    		Audit.Common.Utilities.CreateEmailFolder( emailList, oRequest.number, oRequest.item);
		    	}
								
				m_emailCount = arrEmails.length;
				var cnt = 0;
				for( var y = 0; y < m_emailCount; y++ )
				{				
					var emailSubject = "Your Response Has Been Requested for Request Number: " + oRequest.number;
					var emailText = m_fnFormatEmailBodyToAO ( oRequest, arrEmails[y].responseTitles );				 		
					
					var itemCreateInfo = new SP.ListItemCreationInformation();
				    itemCreateInfo.set_folderUrl(location.protocol + "//" + location.host + Audit.Common.Utilities.GetSiteUrl() + "/Lists/" + Audit.Common.Utilities.GetListNameEmailHistory() + "/" + oRequest.number);				    
				    oListItem = emailList.addItem(itemCreateInfo);
				    oListItem.set_item('Title', emailSubject);
				    oListItem.set_item('Body', emailText);
				    oListItem.set_item('To', arrEmails[y].actionOffice );
				    oListItem.set_item('ReqNum', oRequest.number);
				    //oListItem.set_item('ResID', oResponse.number);
	  				oListItem.set_item('NotificationType', "AO Notification" );
				    oListItem.update();
					
		
					currCtx.executeQueryAsync
					(
						function () 
						{	
							cnt++;
							if( cnt == m_emailCount)
							{
								document.body.style.cursor = 'default';
																
								var requestList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleRequests() );
								oListItem = requestList.getItemById( requestID );
								oListItem.set_item("EmailSent", 1);			
								oListItem.update();
								
								currCtx.executeQueryAsync
								(
									function () 
									{	
										SP.UI.Notify.addNotification("Email Sent to Action Offices. ", false);
										setTimeout( function(){ m_fnRefresh() }, 1000 );					
									}, 
									function (sender, args) 
									{
										alert( "Request failed: "  + args.get_message() + "\n" + args.get_stackTrace() );
										m_fnRefresh();
									}
								);							
							}
						}, 
						function (sender, args) 
						{
							document.body.style.cursor = 'default';
							
							alert( "Request failed: "  + args.get_message() + "\n" + args.get_stackTrace() );
							m_fnRefresh();
						}
					);	
				}
		    }	
		    function OnFailure(sender, args) 
		    {      
				document.body.style.cursor = 'default';
		    	alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
		    }
		    
			currCtx.executeQueryAsync(OnSuccess, OnFailure);
		}
	}
	
	//This gets executed when on refresh if a request does not have broken permissions. When a new request is created from the list form, we 
	//cant set the permissions until it's been created. So, on callback, refresh is called and checks for requests that don't have broken permissions
	function m_fnBreakRequestPermissions( oListItem, refreshPageOnUpdate, responseStatus )
	{
		if( !m_bIsSiteOwner )
		{
			return;
		}

		var currCtx = new SP.ClientContext.get_current();
		var web = currCtx.get_web(); 
		
		this.currentUser = web.get_currentUser();
    	this.ownerGroup = web.get_associatedOwnerGroup();
	 	this.memberGroup = web.get_associatedMemberGroup();
	 	this.visitorGroup = web.get_associatedVisitorGroup();

		var qaHasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(oListItem,  Audit.Common.Utilities.GetGroupNameQA(), SP.PermissionKind.viewListItems);
		var special1HasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(oListItem,  Audit.Common.Utilities.GetGroupNameSpecialPerm1(), SP.PermissionKind.viewListItems);
		var special2HasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(oListItem,  Audit.Common.Utilities.GetGroupNameSpecialPerm2(), SP.PermissionKind.viewListItems);
		    
		oListItem.resetRoleInheritance();
		oListItem.breakRoleInheritance(false, false);
			
		var roleDefBindingCollAdmin = SP.RoleDefinitionBindingCollection.newObject( currCtx );
		roleDefBindingCollAdmin.add( web.get_roleDefinitions().getByType( SP.RoleType.administrator) );

		var roleDefBindingCollContribute = SP.RoleDefinitionBindingCollection.newObject( currCtx );
		roleDefBindingCollContribute.add( web.get_roleDefinitions().getByType( SP.RoleType.contributor) );

	    var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject( currCtx );
		roleDefBindingCollRestrictedRead.add( web.get_roleDefinitions().getByName("Restricted Read"));

	    var roleDefBindingCollRestrictedContribute = SP.RoleDefinitionBindingCollection.newObject( currCtx );
		roleDefBindingCollRestrictedContribute.add( web.get_roleDefinitions().getByName("Restricted Contribute"));

		//add owner group
		oListItem.get_roleAssignments().add( ownerGroup, roleDefBindingCollAdmin);

		//add member group
		oListItem.get_roleAssignments().add( memberGroup, roleDefBindingCollContribute );
		
		//add visitor group
		oListItem.get_roleAssignments().add( visitorGroup, roleDefBindingCollRestrictedRead );
			
		//add action offices			
		var arrActionOffice = oListItem.get_item('ActionOffice');
		if( arrActionOffice != null )
		{
			for( var x = 0; x < arrActionOffice.length; x++ )
			{
				var actionOfficeName = arrActionOffice[x].get_lookupValue();
				
				var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName( actionOfficeName );
				var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup( actionOfficeGroupName );
								
				if( actionOfficeGroup != null )
					oListItem.get_roleAssignments().add( actionOfficeGroup, roleDefBindingCollRestrictedRead );	
			}			
		}
											
		if( qaHasRead || responseStatus == "4-Approved for QA") //make sure qa gets read if it had access
		{
			var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameQA() );
			if( spGroupQA != null )					
				oListItem.get_roleAssignments().add( spGroupQA, roleDefBindingCollRestrictedRead );
		}

		if( special1HasRead ) //make sure qa gets read if it had access
		{
			var group1SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameSpecialPerm1() );
			if( group1SpecialPerm != null )					
				oListItem.get_roleAssignments().add( group1SpecialPerm, roleDefBindingCollRestrictedRead );
		}

		if( special2HasRead ) //make sure qa gets read if it had access
		{
			var group2SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameSpecialPerm2() );
			if( group2SpecialPerm != null )					
				oListItem.get_roleAssignments().add( group2SpecialPerm , roleDefBindingCollRestrictedRead );
		}

		oListItem.get_roleAssignments().getByPrincipal( currentUser ).deleteObject();

		var data = {title: oListItem.get_item('Title'), refreshPage: refreshPageOnUpdate, item: oListItem}
		function onUpdateReqPermsSucceeed() 
		{			
			if( this.refreshPage )
			{
				SP.UI.Notify.addNotification("Updated permissions on Request: " + this.title, false);
				setTimeout( function(){ m_fnRefresh() }, 500 );				
			}
		}
		
		function onUpdateReqPermsFailed(sender, args) 
		{		
			if( this.refreshPage )
			{
				SP.UI.Notify.addNotification("Failed to update Request: " + this.title + args.get_message() + "\n" + args.get_stackTrace() , false);
				setTimeout( function(){ m_fnRefresh() }, 500 );
			}
			else
			{
				SP.UI.Notify.addNotification("Failed to update permissions on Request: " + this.title + args.get_message() + "\n" + args.get_stackTrace() , false);
			}
		}

	    currCtx.executeQueryAsync(Function.createDelegate(data, onUpdateReqPermsSucceeed), Function.createDelegate(data, onUpdateReqPermsFailed));
	}

	function m_fnBreakEmailFolderPermissions( oListItem, oRequestItem, refreshPageOnUpdate )
	{
		var currCtx = new SP.ClientContext.get_current();
		var web = currCtx.get_web(); 
		
		this.currentUser = web.get_currentUser();
    	this.ownerGroup = web.get_associatedOwnerGroup();
	 	this.memberGroup = web.get_associatedMemberGroup();
	 	this.visitorGroup = web.get_associatedVisitorGroup();

		oListItem.resetRoleInheritance();
		oListItem.breakRoleInheritance(false, false);
			
		var roleDefBindingCollAdmin = SP.RoleDefinitionBindingCollection.newObject( currCtx );
		roleDefBindingCollAdmin.add( web.get_roleDefinitions().getByType( SP.RoleType.administrator) );

		var roleDefBindingCollContribute = SP.RoleDefinitionBindingCollection.newObject( currCtx );
		roleDefBindingCollContribute.add( web.get_roleDefinitions().getByType( SP.RoleType.contributor) );

	    var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject( currCtx );
		roleDefBindingCollRestrictedRead.add( web.get_roleDefinitions().getByName("Restricted Read"));

	    var roleDefBindingCollRestrictedContribute = SP.RoleDefinitionBindingCollection.newObject( currCtx );
		roleDefBindingCollRestrictedContribute.add( web.get_roleDefinitions().getByName("Restricted Contribute"));

		//add owner group
		oListItem.get_roleAssignments().add( ownerGroup, roleDefBindingCollAdmin);

		//add member group
		oListItem.get_roleAssignments().add( memberGroup, roleDefBindingCollContribute );
		
		//add visitor group
		oListItem.get_roleAssignments().add( visitorGroup, roleDefBindingCollRestrictedRead );
			
		if( oRequestItem )
		{
			//add action offices			
			var arrActionOffice = oRequestItem.get_item('ActionOffice');
			if( arrActionOffice != null )
			{
				for( var x = 0; x < arrActionOffice.length; x++ )
				{
					var actionOfficeName = arrActionOffice[x].get_lookupValue();
					
					var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName( actionOfficeName );
					var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup( actionOfficeGroupName );
									
					if( actionOfficeGroup != null )
						oListItem.get_roleAssignments().add( actionOfficeGroup, roleDefBindingCollRestrictedContribute);	
				}			
			}
		}
															
		var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameQA() );
		if( spGroupQA != null )					
			oListItem.get_roleAssignments().add( spGroupQA, roleDefBindingCollRestrictedContribute);

		oListItem.get_roleAssignments().getByPrincipal( currentUser ).deleteObject();
		var data = {title: oListItem.get_item('Title'), refreshPage: refreshPageOnUpdate, item: oListItem}
		
		function onUpdateEmailFolderPermsSucceeed() 
		{			
			if( this.refreshPage )
			{
				setTimeout( function(){ m_fnRefresh() }, 500 );				
			}
		}
		
		function onUpdateEmailFolderPermsFailed(sender, args) 
		{		
			if( this.refreshPage )
			{
				setTimeout( function(){ m_fnRefresh() }, 500 );
			}
		}

	    currCtx.executeQueryAsync(Function.createDelegate(data, onUpdateEmailFolderPermsSucceeed), Function.createDelegate(data, onUpdateEmailFolderPermsFailed));
	}
	
	var m_countCSToAdd = 0;
	var m_countCSAdded = 0;
	function m_fnBreakCoversheetPermissions( oListItem, grantQARead, refreshPageOnUpdate, OnComplete )
	{	
		m_countCSToAdd = 0;
		m_countCSAdded = 0;

		if( oListItem == null )
			return;
			
		var currCtx = new SP.ClientContext.get_current();
		var web = currCtx.get_web(); 
		
		this.currentUser = currCtx.get_web().get_currentUser();
    	this.ownerGroup = web.get_associatedOwnerGroup();
	 	this.memberGroup = web.get_associatedMemberGroup();
	 	this.visitorGroup = web.get_associatedVisitorGroup();
		    		    
		var qaHasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(oListItem,  Audit.Common.Utilities.GetGroupNameQA(), SP.PermissionKind.viewListItems);
		var special1HasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(oListItem,  Audit.Common.Utilities.GetGroupNameSpecialPerm1(), SP.PermissionKind.viewListItems);
		var special2HasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(oListItem,  Audit.Common.Utilities.GetGroupNameSpecialPerm2(), SP.PermissionKind.viewListItems);

		//check this because if it's inheriting, they'll have access
		if( !oListItem.get_hasUniqueRoleAssignments() )
		{
			qaHasRead = false;
			special1HasRead = false;
			special2HasRead = false;
		}

		oListItem.resetRoleInheritance();
		oListItem.breakRoleInheritance(false, false);
		
		var roleDefBindingCollAdmin = SP.RoleDefinitionBindingCollection.newObject( currCtx );
		roleDefBindingCollAdmin.add( currCtx.get_web().get_roleDefinitions().getByType( SP.RoleType.administrator) );

		var roleDefBindingCollContribute = SP.RoleDefinitionBindingCollection.newObject( currCtx );
		roleDefBindingCollContribute.add( currCtx.get_web().get_roleDefinitions().getByType( SP.RoleType.contributor) );

	    var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject( currCtx );
		roleDefBindingCollRestrictedRead.add( currCtx.get_web().get_roleDefinitions().getByName("Restricted Read"));

	    var roleDefBindingCollRestrictedContribute = SP.RoleDefinitionBindingCollection.newObject( currCtx );
		roleDefBindingCollRestrictedContribute.add( currCtx.get_web().get_roleDefinitions().getByName("Restricted Contribute"));

		//add owner group
		oListItem.get_roleAssignments().add( ownerGroup, roleDefBindingCollAdmin);

		//add member group
		oListItem.get_roleAssignments().add( memberGroup, roleDefBindingCollContribute );
		
		//add visitor group
		oListItem.get_roleAssignments().add( visitorGroup, roleDefBindingCollRestrictedRead );
		
		if( qaHasRead || grantQARead ) //make sure qa gets read if it had access
		{
			var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameQA() );
			if( spGroupQA != null )					
				oListItem.get_roleAssignments().add( spGroupQA, roleDefBindingCollRestrictedRead );
		}

		if( special1HasRead ) //make sure qa gets read if it had access
		{
			var group1SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameSpecialPerm1() );
			if( group1SpecialPerm!= null )					
				oListItem.get_roleAssignments().add( group1SpecialPerm, roleDefBindingCollRestrictedRead );
		}

		if( special2HasRead ) //make sure qa gets read if it had access
		{
			var group2SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameSpecialPerm2() );
			if( group2SpecialPerm != null )					
				oListItem.get_roleAssignments().add( group2SpecialPerm , roleDefBindingCollRestrictedRead );
		}
					
		oListItem.get_roleAssignments().getByPrincipal( currentUser ).deleteObject();
		
		function onUpdatedCSSucceeded() 
		{	
			var currCtx2 = new SP.ClientContext.get_current();
					
			var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject( currCtx2 );
			roleDefBindingCollRestrictedRead.add( currCtx2.get_web().get_roleDefinitions().getByName("Restricted Read"));

			//add action offices			
			var arrActionOffice = this.oListItem.get_item('ActionOffice');
			for( var x = 0; x < arrActionOffice.length; x++ )
			{
				var actionOfficeName = arrActionOffice[x].get_lookupValue();
				var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName( actionOfficeName );
				var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup( actionOfficeGroupName );
				if( actionOfficeGroup != null )
				{
					m_countCSToAdd++;

				    var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject( currCtx2 );
					roleDefBindingCollRestrictedRead.add( currCtx2.get_web().get_roleDefinitions().getByName("Restricted Read"));
					this.oListItem.get_roleAssignments().add( actionOfficeGroup, roleDefBindingCollRestrictedRead );
					
					function onUpdatedCSAOSucceeded() 
					{
						m_countCSAdded++;
						
						if( m_countCSAdded == m_countCSToAdd )
						{
							if( this.refreshPage )
								m_fnRefresh();
							else if( this.OnComplete )
								this.OnComplete( true );
						}						
					}
					function onUpdatedCSAOFailed(sender, args) 
					{		
						m_countCSAdded++;
						
						if( m_countCSAdded == m_countCSToAdd )
						{
							if( this.refreshPage )
								m_fnRefresh();
							else if( this.OnComplete )
								this.OnComplete( true );
						}						
					}
					
					var data = {refreshPage: this.refreshPage, OnComplete: this.OnComplete };
    				currCtx2.executeQueryAsync(Function.createDelegate(data, onUpdatedCSAOSucceeded), Function.createDelegate(data, onUpdatedCSAOFailed));
				}
			}
		}		
		
		function onUpdatedCSFailed(sender, args) 
		{
			SP.UI.Notify.addNotification("Failed to update permissions on Coversheet" + args.get_message() + "\n" + args.get_stackTrace(), false);
			
			if( this.refreshPage )
				m_fnRefresh();
			else if( this.OnComplete )
				this.OnComplete ( true ); //return true to continue executing
		}

		var data = {refreshPage: refreshPageOnUpdate, oListItem: oListItem, OnComplete: OnComplete};
	    currCtx.executeQueryAsync(Function.createDelegate(data, onUpdatedCSSucceeded), Function.createDelegate(data, onUpdatedCSFailed));
	}
	
	function m_fnBreakCoversheetPermissionsOnSpecialPerms( currCtx, oListItem, addSepcialPerms, refreshPageOnUpdate )
	{	
		if( oListItem == null )
			return;
		
		var web = currCtx.get_web(); 
		
		this.currentUser = currCtx.get_web().get_currentUser();
    	this.ownerGroup = web.get_associatedOwnerGroup();
	 	this.memberGroup = web.get_associatedMemberGroup();
	 	this.visitorGroup = web.get_associatedVisitorGroup();
		    		    
		oListItem.resetRoleInheritance();
		oListItem.breakRoleInheritance(false, false);
		
		var qaHasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(oListItem,  Audit.Common.Utilities.GetGroupNameQA(), SP.PermissionKind.viewListItems);
			
		var roleDefBindingCollAdmin = SP.RoleDefinitionBindingCollection.newObject( currCtx );
		roleDefBindingCollAdmin.add( currCtx.get_web().get_roleDefinitions().getByType( SP.RoleType.administrator) );

		var roleDefBindingCollContribute = SP.RoleDefinitionBindingCollection.newObject( currCtx );
		roleDefBindingCollContribute.add( currCtx.get_web().get_roleDefinitions().getByType( SP.RoleType.contributor) );

	    var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject( currCtx );
		roleDefBindingCollRestrictedRead.add( currCtx.get_web().get_roleDefinitions().getByName("Restricted Read"));

	    var roleDefBindingCollRestrictedContribute = SP.RoleDefinitionBindingCollection.newObject( currCtx );
		roleDefBindingCollRestrictedContribute.add( currCtx.get_web().get_roleDefinitions().getByName("Restricted Contribute"));

		//add owner group
		oListItem.get_roleAssignments().add( ownerGroup, roleDefBindingCollAdmin);

		//add member group
		oListItem.get_roleAssignments().add( memberGroup, roleDefBindingCollContribute );
		
		//add visitor group
		oListItem.get_roleAssignments().add( visitorGroup, roleDefBindingCollRestrictedRead );
			
		//add action offices			
		var arrActionOffice = oListItem.get_item('ActionOffice');
		for( var x = 0; x < arrActionOffice.length; x++ )
		{
			var actionOfficeName = arrActionOffice[x].get_lookupValue();
			var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName( actionOfficeName );
			var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup( actionOfficeGroupName );
			if( actionOfficeGroup != null )
				oListItem.get_roleAssignments().add( actionOfficeGroup, roleDefBindingCollRestrictedRead );				
		}
		
		if( qaHasRead ) //make sure qa gets read if it had access
		{
			var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameQA() );
			if( spGroupQA != null )					
				oListItem.get_roleAssignments().add( spGroupQA, roleDefBindingCollRestrictedRead );
		}

		if( addSepcialPerms ) //make sure qa gets read if it had access
		{
			var group1SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameSpecialPerm1() );
			if( group1SpecialPerm != null )					
				oListItem.get_roleAssignments().add( group1SpecialPerm, roleDefBindingCollRestrictedRead );

			var group2SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameSpecialPerm2() );
			if( group2SpecialPerm != null )					
				oListItem.get_roleAssignments().add( group2SpecialPerm , roleDefBindingCollRestrictedRead );
		}
					
		oListItem.get_roleAssignments().getByPrincipal( currentUser ).deleteObject();
	}
	

	//This gets executed when on refresh if a response does not have broken permissions. When a new response is created from the list form, we 
	//cant set the permissions until it's been created. So, on callback, refresh is called and checks for responses that don't have broken permissions
	function m_fnBreakResponseAndFolderPermissions( requestStatus, oResponse, refreshPageOnUpdate, checkStatus, OnComplete )
	{		
		if( !m_bIsSiteOwner )
		{
			OnComplete( true );
			return;
		}

		var currCtx = new SP.ClientContext.get_current();
		var web = currCtx.get_web(); 
		
		this.currentUser = currCtx.get_web().get_currentUser();
    	this.ownerGroup = web.get_associatedOwnerGroup();
	 	this.memberGroup = web.get_associatedMemberGroup();
	 	this.visitorGroup = web.get_associatedVisitorGroup();
	
		var qaHasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(oResponse.item,  Audit.Common.Utilities.GetGroupNameQA(), SP.PermissionKind.viewListItems);
		var special1HasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(oResponse.item,  Audit.Common.Utilities.GetGroupNameSpecialPerm1(), SP.PermissionKind.viewListItems);
		var special2HasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(oResponse.item,  Audit.Common.Utilities.GetGroupNameSpecialPerm2(), SP.PermissionKind.viewListItems);

		if( !oResponse.item.get_hasUniqueRoleAssignments() )
		{
			qaHasRead = false;
			special1HasRead = false;
			special2HasRead = false;
		}

		oResponse.item.resetRoleInheritance();
		oResponse.item.breakRoleInheritance(false, false);
		
		if( oResponse.responseFolderItem )
		{
			oResponse.responseFolderItem.resetRoleInheritance();
			oResponse.responseFolderItem.breakRoleInheritance(false, false);
		}
			
		var roleDefBindingCollAdmin = SP.RoleDefinitionBindingCollection.newObject( currCtx );
		roleDefBindingCollAdmin.add( currCtx.get_web().get_roleDefinitions().getByType( SP.RoleType.administrator) );

		var roleDefBindingCollContribute = SP.RoleDefinitionBindingCollection.newObject( currCtx );
		roleDefBindingCollContribute.add( currCtx.get_web().get_roleDefinitions().getByType( SP.RoleType.contributor) );

	    var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject( currCtx );
		roleDefBindingCollRestrictedRead.add( currCtx.get_web().get_roleDefinitions().getByName("Restricted Read"));

	    var roleDefBindingCollRestrictedContribute = SP.RoleDefinitionBindingCollection.newObject( currCtx );
		roleDefBindingCollRestrictedContribute.add( currCtx.get_web().get_roleDefinitions().getByName("Restricted Contribute"));


		//add owner group
		oResponse.item.get_roleAssignments().add( ownerGroup, roleDefBindingCollAdmin);

		//add member group
		oResponse.item.get_roleAssignments().add( memberGroup, roleDefBindingCollContribute );
		
		//add visitor group
		oResponse.item.get_roleAssignments().add( visitorGroup, roleDefBindingCollRestrictedRead );
		
		if( oResponse.responseFolderItem )
		{
			//add owner group
			oResponse.responseFolderItem.get_roleAssignments().add( ownerGroup, roleDefBindingCollAdmin);
	
			//add member group
			oResponse.responseFolderItem.get_roleAssignments().add( memberGroup, roleDefBindingCollContribute );
			
			//add visitor group
			oResponse.responseFolderItem.get_roleAssignments().add( visitorGroup, roleDefBindingCollRestrictedRead );
		}
		
			
		//add action offices			
		var actionOffice = oResponse.item.get_item('ActionOffice');
		if( actionOffice != null )
		{
			var actionOfficeName = actionOffice.get_lookupValue();
			var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName( actionOfficeName );
			var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup( actionOfficeGroupName );
			
			if( actionOfficeGroup != null )
			{
				if( checkStatus && (oResponse.item.get_item('ResStatus') == "1-Open" || oResponse.item.get_item('ResStatus') == "3-Returned to Action Office") && ( requestStatus == "Open" || requestStatus == "ReOpened") )
				{
					oResponse.item.get_roleAssignments().add( actionOfficeGroup, roleDefBindingCollRestrictedContribute);	
					if( oResponse.responseFolderItem )
						oResponse.responseFolderItem.get_roleAssignments().add( actionOfficeGroup, roleDefBindingCollRestrictedContribute);	
				}
				else
				{
					oResponse.item.get_roleAssignments().add( actionOfficeGroup, roleDefBindingCollRestrictedRead );
					if( oResponse.responseFolderItem )
					{
						oResponse.responseFolderItem.get_roleAssignments().add( actionOfficeGroup, roleDefBindingCollRestrictedRead );	
					}				
				}
			}
		}
		
		if( qaHasRead || oResponse.item.get_item("ResStatus") == "4-Approved for QA" || oResponse.item.get_item("ResStatus") == "6-Reposted After Rejection") //make sure qa gets read if it had access
		{
			var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameQA() );	
			if( spGroupQA != null )
			{	
				if( checkStatus && (oResponse.item.get_item("ResStatus") == "4-Approved for QA" || oResponse.item.get_item("ResStatus") == "6-Reposted After Rejection")  && ( requestStatus == "Open" || requestStatus == "ReOpened"))	
				{			
					oResponse.item.get_roleAssignments().add( spGroupQA, roleDefBindingCollRestrictedContribute);
					if( oResponse.responseFolderItem )
					{
						oResponse.responseFolderItem.get_roleAssignments().add( spGroupQA, roleDefBindingCollRestrictedContribute);
					}
				}
				else
				{
					oResponse.item.get_roleAssignments().add( spGroupQA, roleDefBindingCollRestrictedRead );
					if( oResponse.responseFolderItem )
					{
						oResponse.responseFolderItem.get_roleAssignments().add( spGroupQA, roleDefBindingCollRestrictedRead );
					}
				}
			}
		}
		
		if( special1HasRead && ( oResponse.item.get_item("ResStatus") == "4-Approved for QA" || oResponse.item.get_item("ResStatus") == "6-Reposted After Rejection" || oResponse.item.get_item("ResStatus") == "7-Closed" ))
		{
			var group1SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameSpecialPerm1() );
			if( group1SpecialPerm != null )
			{					
				oResponse.item.get_roleAssignments().add( group1SpecialPerm, roleDefBindingCollRestrictedRead );
				if( oResponse.responseFolderItem )
				{
					oResponse.responseFolderItem.get_roleAssignments().add( group1SpecialPerm, roleDefBindingCollRestrictedRead );
				}
			}
		}

		if( special2HasRead && ( oResponse.item.get_item("ResStatus") == "4-Approved for QA" || oResponse.item.get_item("ResStatus") == "6-Reposted After Rejection" || oResponse.item.get_item("ResStatus") == "7-Closed" ))
		{
			var group2SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameSpecialPerm2() );
			if( group2SpecialPerm != null )
			{
				oResponse.item.get_roleAssignments().add( group2SpecialPerm , roleDefBindingCollRestrictedRead );
				if( oResponse.responseFolderItem )
				{
					oResponse.responseFolderItem.get_roleAssignments().add( group2SpecialPerm , roleDefBindingCollRestrictedRead );
				}
			}
		}
											
		oResponse.item.get_roleAssignments().getByPrincipal( currentUser ).deleteObject();
		if( oResponse.responseFolderItem )
			oResponse.responseFolderItem.get_roleAssignments().getByPrincipal( currentUser ).deleteObject();

		var data = {title: oResponse.item.get_item('Title'), refreshPage: refreshPageOnUpdate, OnComplete: OnComplete}
		function onUpdateResponsePermsSucceeed() 
		{
			if( this.refreshPage )
			{
				SP.UI.Notify.addNotification("Updated permissions on Response: " + this.title, false);
				m_fnRefresh();				
			}
			else if( this.OnComplete )
				this.OnComplete( true );
		}
		
		function onUpdateResponsePermsFailed(sender, args) 
		{
			if( this.refreshPage )
			{
				SP.UI.Notify.addNotification("Failed to update permissions on Response: " + this.title + args.get_message() + "\n" + args.get_stackTrace() , false);
				m_fnRefresh();
			}
			else if( this.OnComplete )
				this.OnComplete( false );
		}

	    currCtx.executeQueryAsync(Function.createDelegate(data, onUpdateResponsePermsSucceeed), Function.createDelegate(data, onUpdateResponsePermsFailed));
	}



	//This gets executed when on refresh if a response does not have broken permissions. When a new response is created from the list form, we 
	//cant set the permissions until it's been created. So, on callback, refresh is called and checks for responses that don't have broken permissions
	function m_fnBreakResponsePermissions( oListItem, refreshPageOnUpdate, checkStatus )
	{		
		if( !m_bIsSiteOwner )
		{
			return;
		}

		var currCtx = new SP.ClientContext.get_current();
		var web = currCtx.get_web(); 
		
		this.currentUser = currCtx.get_web().get_currentUser();
    	this.ownerGroup = web.get_associatedOwnerGroup();
	 	this.memberGroup = web.get_associatedMemberGroup();
	 	this.visitorGroup = web.get_associatedVisitorGroup();
	
		//check QA before resetting	
		var permissionsToCheck = SP.PermissionKind.viewListItems;
		var qaHasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(oListItem,  Audit.Common.Utilities.GetGroupNameQA() , permissionsToCheck );
		var special1HasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(oListItem,  Audit.Common.Utilities.GetGroupNameSpecialPerm1(), SP.PermissionKind.viewListItems);
		var special2HasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(oListItem,  Audit.Common.Utilities.GetGroupNameSpecialPerm2(), SP.PermissionKind.viewListItems);

		if( !oListItem.get_hasUniqueRoleAssignments() )
		{
			qaHasRead = false;
			special1HasRead = false;
			special2HasRead = false;
		}

		oListItem.resetRoleInheritance();
		oListItem.breakRoleInheritance(false, false);
			
		var roleDefBindingCollAdmin = SP.RoleDefinitionBindingCollection.newObject( currCtx );
		roleDefBindingCollAdmin.add( currCtx.get_web().get_roleDefinitions().getByType( SP.RoleType.administrator) );

		var roleDefBindingCollContribute = SP.RoleDefinitionBindingCollection.newObject( currCtx );
		roleDefBindingCollContribute.add( currCtx.get_web().get_roleDefinitions().getByType( SP.RoleType.contributor) );

	    var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject( currCtx );
		roleDefBindingCollRestrictedRead.add( currCtx.get_web().get_roleDefinitions().getByName("Restricted Read"));

	    var roleDefBindingCollRestrictedContribute = SP.RoleDefinitionBindingCollection.newObject( currCtx );
		roleDefBindingCollRestrictedContribute.add( currCtx.get_web().get_roleDefinitions().getByName("Restricted Contribute"));


		//add owner group
		oListItem.get_roleAssignments().add( ownerGroup, roleDefBindingCollAdmin);

		//add member group
		oListItem.get_roleAssignments().add( memberGroup, roleDefBindingCollContribute );
		
		//add visitor group
		oListItem.get_roleAssignments().add( visitorGroup, roleDefBindingCollRestrictedRead );
			
		//add action offices			
		var actionOffice = oListItem.get_item('ActionOffice');
		if( actionOffice != null )
		{
			var actionOfficeName = actionOffice.get_lookupValue();
			var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName( actionOfficeName );
			var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup( actionOfficeGroupName );
			
			if( actionOfficeGroup != null )
			{
				if( checkStatus && (oListItem.get_item('ResStatus') == "1-Open" || oListItem.get_item('ResStatus') == "3-Returned to Action Office") )
					oListItem.get_roleAssignments().add( actionOfficeGroup, roleDefBindingCollRestrictedContribute);				
				else
					oListItem.get_roleAssignments().add( actionOfficeGroup, roleDefBindingCollRestrictedRead );				
			}
			
		}
		
		if( qaHasRead || oListItem.get_item("ResStatus") == "4-Approved for QA" || oListItem.get_item("ResStatus") == "6-Reposted After Rejection") //make sure qa gets read if it had access
		{
			var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameQA() );	
			if( spGroupQA != null )
			{	
				if( (oListItem.get_item("ResStatus") == "4-Approved for QA" || oListItem.get_item("ResStatus") == "6-Reposted After Rejection")  && checkStatus )				
					oListItem.get_roleAssignments().add( spGroupQA, roleDefBindingCollRestrictedContribute);
				else
					oListItem.get_roleAssignments().add( spGroupQA, roleDefBindingCollRestrictedRead );
			}
		}
		
		if( special1HasRead && ( oListItem.get_item("ResStatus") == "4-Approved for QA" || oListItem.get_item("ResStatus") == "6-Reposted After Rejection" || oListItem.get_item("ResStatus") == "7-Closed" ))
		{
			var group1SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameSpecialPerm1() );
			if( group1SpecialPerm != null )					
				oListItem.get_roleAssignments().add( group1SpecialPerm, roleDefBindingCollRestrictedRead );
		}

		if( special2HasRead && ( oListItem.get_item("ResStatus") == "4-Approved for QA" || oListItem.get_item("ResStatus") == "6-Reposted After Rejection" || oListItem.get_item("ResStatus") == "7-Closed" ))
		{
			var group2SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameSpecialPerm2() );
			if( group2SpecialPerm != null )					
				oListItem.get_roleAssignments().add( group2SpecialPerm , roleDefBindingCollRestrictedRead );
		}
											
		oListItem.get_roleAssignments().getByPrincipal( currentUser ).deleteObject();

		var data = {title: oListItem.get_item('Title'), refreshPage: refreshPageOnUpdate, item: oListItem}
		function onUpdateResponsePermsSucceeed() 
		{
			if( this.refreshPage )
			{
				SP.UI.Notify.addNotification("Updated permissions on Response: " + this.title, false);
				m_fnRefresh();				
			}
		}
		
		function onUpdateResponsePermsFailed(sender, args) 
		{
			if( this.refreshPage )
			{
				SP.UI.Notify.addNotification("Failed to update permissions on Response: " + this.title + args.get_message() + "\n" + args.get_stackTrace() , false);
				m_fnRefresh();
			}
		}

	    currCtx.executeQueryAsync(Function.createDelegate(data, onUpdateResponsePermsSucceeed), Function.createDelegate(data, onUpdateResponsePermsFailed));
	}
	
	function m_fnBreakResponseFolderPermissions(oListItemFolder, oListItemResponse, refreshPageOnUpdate, bCheckStatus, OnComplete)
	{
		if( !m_bIsSiteOwner )
		{
			OnComplete( true );
			return;
		}

		var currCtx = new SP.ClientContext.get_current();
		var web = currCtx.get_web(); 
		
		this.currentUser = currCtx.get_web().get_currentUser();
    	this.ownerGroup = web.get_associatedOwnerGroup();
	 	this.memberGroup = web.get_associatedMemberGroup();
	 	this.visitorGroup = web.get_associatedVisitorGroup();
	 	
	 	var qaHasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(oListItemFolder,  Audit.Common.Utilities.GetGroupNameQA(), SP.PermissionKind.viewListItems);
		var special1HasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(oListItemFolder,  Audit.Common.Utilities.GetGroupNameSpecialPerm1(), SP.PermissionKind.viewListItems);
		var special2HasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(oListItemFolder,  Audit.Common.Utilities.GetGroupNameSpecialPerm2(), SP.PermissionKind.viewListItems);
		
		if( !oListItemFolder.get_hasUniqueRoleAssignments() )
		{
			qaHasRead = false;
			special1HasRead = false;
			special2HasRead = false;
		}
  		    		    
		oListItemFolder.resetRoleInheritance();
		oListItemFolder.breakRoleInheritance(false, false);
			
		var roleDefBindingCollAdmin = SP.RoleDefinitionBindingCollection.newObject( currCtx );
		roleDefBindingCollAdmin.add( currCtx.get_web().get_roleDefinitions().getByType( SP.RoleType.administrator) );

		var roleDefBindingCollContribute = SP.RoleDefinitionBindingCollection.newObject( currCtx );
		roleDefBindingCollContribute.add( currCtx.get_web().get_roleDefinitions().getByType( SP.RoleType.contributor) );

	    var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject( currCtx );
		roleDefBindingCollRestrictedRead.add( currCtx.get_web().get_roleDefinitions().getByName("Restricted Read"));

	    var roleDefBindingCollRestrictedContribute = SP.RoleDefinitionBindingCollection.newObject( currCtx );
		roleDefBindingCollRestrictedContribute.add( currCtx.get_web().get_roleDefinitions().getByName("Restricted Contribute"));


		//add owner group
		oListItemFolder.get_roleAssignments().add( ownerGroup, roleDefBindingCollAdmin);

		//add member group
		oListItemFolder.get_roleAssignments().add( memberGroup, roleDefBindingCollContribute );
		
		//add visitor group
		oListItemFolder.get_roleAssignments().add( visitorGroup, roleDefBindingCollRestrictedRead );
			
		//add action offices			
		var actionOffice = oListItemResponse.get_item('ActionOffice');
		if( actionOffice != null )
		{
			var actionOfficeName = actionOffice.get_lookupValue();
			var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName( actionOfficeName );
			var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup( actionOfficeGroupName );
			
			if( actionOfficeGroup != null )
			{
				if( bCheckStatus && ( oListItemResponse.get_item('ResStatus') == "1-Open" || oListItemResponse.get_item('ResStatus') == "3-Returned to Action Office") )
					oListItemFolder.get_roleAssignments().add( actionOfficeGroup, roleDefBindingCollRestrictedContribute);				
				else
					oListItemFolder.get_roleAssignments().add( actionOfficeGroup, roleDefBindingCollRestrictedRead );				
			}
		}
		
		if( qaHasRead || oListItemResponse.get_item("ResStatus") == "4-Approved for QA" || oListItemResponse.get_item("ResStatus") == "6-Reposted After Rejection" ) //make sure qa gets read if it had access
		{
			var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameQA() );	
			if( spGroupQA != null )
			{	
				if( bCheckStatus && ( oListItemResponse.get_item("ResStatus") == "4-Approved for QA" || oListItemResponse.get_item("ResStatus") == "6-Reposted After Rejection") )				
					oListItemFolder.get_roleAssignments().add( spGroupQA, roleDefBindingCollRestrictedContribute);
				else
					oListItemFolder.get_roleAssignments().add( spGroupQA, roleDefBindingCollRestrictedRead );
			}
		}
		
		if( special1HasRead && ( oListItemResponse.get_item("ResStatus") == "4-Approved for QA" || oListItemResponse.get_item("ResStatus") == "6-Reposted After Rejection" || oListItemResponse.get_item("ResStatus") == "7-Closed" ))
		{
			var group1SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameSpecialPerm1() );
			if( group1SpecialPerm != null )					
				oListItemFolder.get_roleAssignments().add( group1SpecialPerm, roleDefBindingCollRestrictedRead );
		}

		if( special2HasRead && ( oListItemResponse.get_item("ResStatus") == "4-Approved for QA" || oListItemResponse.get_item("ResStatus") == "6-Reposted After Rejection" || oListItemResponse.get_item("ResStatus") == "7-Closed" ))
		{
			var group2SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameSpecialPerm2() );
			if( group2SpecialPerm != null )					
				oListItemFolder.get_roleAssignments().add( group2SpecialPerm, roleDefBindingCollRestrictedRead );
		}

											
		oListItemFolder.get_roleAssignments().getByPrincipal( currentUser ).deleteObject();
		
		var data = {title: oListItemResponse.get_item('Title'), refreshPage: refreshPageOnUpdate, OnComplete: OnComplete}
		function onUpdateResponseFolderPermsSucceeed() 
		{						
			if( this.refreshPage )
			{
				SP.UI.Notify.addNotification("Updated permissions on Response Folder: " + this.title, false);
				setTimeout( function(){ m_fnRefresh()}, 200 );
			}
			else if( this.OnComplete )
				this.OnComplete( true );
		}
		
		function onUpdateResponseFolderPermsFailed(sender, args) 
		{			
			if( this.refreshPage )
			{
				SP.UI.Notify.addNotification("Failed to update permissions on Response Folder: " + this.title + args.get_message() + "\n" + args.get_stackTrace() , false);
				setTimeout( function(){ m_fnRefresh()}, 200 );
			}
			else if (this.OnComplete)
			{
				this.OnComplete( true );
			}
		}

	    currCtx.executeQueryAsync(Function.createDelegate(data, onUpdateResponseFolderPermsSucceeed), Function.createDelegate(data, onUpdateResponseFolderPermsFailed));
	}

	function m_fnGrantSpecialPermissions( requestNumber )
	{
		if( !m_bIsSiteOwner )
		{
			SP.UI.Notify.addNotification("You do not have access to perform this action...", false);
			return;
		}

		//this can be stale... 
		var oRequest = m_fnGetRequestByNumber( requestNumber );
		if( oRequest == null )
			return;
		
		m_bIsTransactionExecuting = true;
	
		var cntGranted = 0;
		var cntToGrant = 0;
		var responseCount = oRequest.responses.length;
		for( var y = 0; y < responseCount; y++ )
		{
			var oResponse = oRequest.responses[y];
			
			if( oResponse.resStatus == "4-Approved for QA" || oResponse.resStatus == "6-Reposted After Rejection" || oResponse.resStatus == "7-Closed" )
			{
				cntToGrant++;
			}
		}
				
		if( confirm("Are you sure you would like to grant special permissions on this Request and to (" + cntToGrant + ") Responses?"))
		{			
			//document.body.style.cursor = 'wait';
			m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose("Information", "Please wait... granting Special Permissions <div id='divGrantCntr'></div>", 200, 400)
			
			var group1SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameSpecialPerm1() );
			var group2SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameSpecialPerm2() );
				
			var currCtx = SP.ClientContext.get_current();  	
		    var web = currCtx.get_web(); 
			this.currentUser = web.get_currentUser();
	    	this.ownerGroup = web.get_associatedOwnerGroup();
		 	this.memberGroup = web.get_associatedMemberGroup();
		 	this.visitorGroup = web.get_associatedVisitorGroup();
		    		
			var qaHasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(oRequest.item,  Audit.Common.Utilities.GetGroupNameQA(), SP.PermissionKind.viewListItems);
    
    		///////////////////////////////////////////////////////////////////////////////////////////////////////////
			//Update permissions to Request. everyone should get restricted read except for the associated member groups
			oRequest.item.resetRoleInheritance();
			oRequest.item.breakRoleInheritance(false, false);
			
			var roleDefBindingCollAdmin = SP.RoleDefinitionBindingCollection.newObject( currCtx );
			roleDefBindingCollAdmin.add( currCtx.get_web().get_roleDefinitions().getByType( SP.RoleType.administrator) );

			var roleDefBindingCollContribute = SP.RoleDefinitionBindingCollection.newObject( currCtx );
			roleDefBindingCollContribute.add( currCtx.get_web().get_roleDefinitions().getByType( SP.RoleType.contributor ) );

		    var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject( currCtx );
			roleDefBindingCollRestrictedRead.add( currCtx.get_web().get_roleDefinitions().getByName("Restricted Read"));

		    var roleDefBindingCollRestrictedContribute = SP.RoleDefinitionBindingCollection.newObject( currCtx );
			roleDefBindingCollRestrictedContribute.add( currCtx.get_web().get_roleDefinitions().getByName("Restricted Contribute"));

			//add associated site groups to request
			oRequest.item.get_roleAssignments().add( ownerGroup, roleDefBindingCollAdmin );	
			oRequest.item.get_roleAssignments().add( memberGroup, roleDefBindingCollContribute );
			oRequest.item.get_roleAssignments().add( visitorGroup, roleDefBindingCollRestrictedRead );

			//add special permissions to request
			if( group1SpecialPerm != null )
				oRequest.item.get_roleAssignments().add( group1SpecialPerm, roleDefBindingCollRestrictedRead );
			if( group2SpecialPerm!= null )
				oRequest.item.get_roleAssignments().add( group2SpecialPerm, roleDefBindingCollRestrictedRead );			
	
			oRequest.item.get_roleAssignments().getByPrincipal( currentUser ).deleteObject();
		
			//make sure qa gets read on request if it previously had access
			if( qaHasRead )
			{
				var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameQA() );						
				if( spGroupQA != null )
				{
					oRequest.item.get_roleAssignments().add( spGroupQA, roleDefBindingCollRestrictedRead );
				}
			}

			//add action offices to request
			var arrActionOffice = oRequest.item.get_item('ActionOffice');
			for( var x = 0; x < arrActionOffice.length; x++ )
			{
				var actionOfficeName = arrActionOffice[x].get_lookupValue();
				var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName( actionOfficeName );
				var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup( actionOfficeGroupName );
				
				if( actionOfficeGroup != null )
					oRequest.item.get_roleAssignments().add( actionOfficeGroup, roleDefBindingCollRestrictedRead );				
			}
			
			//Update coversheets to give special permissions access
			for( var x = 0; x < oRequest.coversheets.length; x++ )
			{
				var coversheetItem = oRequest.coversheets[x].item;
				if( coversheetItem )
				{
					m_fnBreakCoversheetPermissionsOnSpecialPerms( currCtx, coversheetItem, true, false );
				}
			}
									
///////////Update permissions responses - everyone should get restricted read, except for the associated member groups. action offices get contribute if open or returned to action office
			var responseCount = oRequest.responses.length;
			
			if( responseCount == 0 || cntToGrant == 0)
			{
				currCtx.executeQueryAsync
				(
					function () 
					{	
						document.body.style.cursor = 'default';
						
						notifyId = SP.UI.Notify.addNotification("Completed granting Special Permissions", false);
						setTimeout( function(){ m_fnRefresh()}, 200 );
					}, 
					function (sender, args) 
					{
						document.body.style.cursor = 'default';
						
						notifyId = SP.UI.Notify.addNotification("Request failed1: "  + args.get_message() + "\n" + args.get_stackTrace(), false)							
						m_fnRefresh();
					}
				);
				return;	 	
			}
					
			//grant special permissions on the responses and response folders
			for( var y = 0; y < responseCount; y++ )
			{
				var oResponse = oRequest.responses[y];
				if( oResponse.resStatus == "4-Approved for QA" || oResponse.resStatus == "6-Reposted After Rejection" || oResponse.resStatus == "7-Closed" )
				{	
					var qaHasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(oResponse.item,  Audit.Common.Utilities.GetGroupNameQA(), SP.PermissionKind.viewListItems);
					
					oResponse.item.resetRoleInheritance();
					oResponse.item.breakRoleInheritance(false, false);
	
					var group1SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameSpecialPerm1() );
					var group2SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameSpecialPerm2() );
					
					var roleDefBindingCollAdmin = SP.RoleDefinitionBindingCollection.newObject( currCtx );
					roleDefBindingCollAdmin.add( currCtx.get_web().get_roleDefinitions().getByType( SP.RoleType.administrator) );
		
					var roleDefBindingCollContribute = SP.RoleDefinitionBindingCollection.newObject( currCtx );
					roleDefBindingCollContribute.add( currCtx.get_web().get_roleDefinitions().getByType( SP.RoleType.contributor) );

					var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject( currCtx );
					roleDefBindingCollRestrictedRead.add( currCtx.get_web().get_roleDefinitions().getByName("Restricted Read"));
					
				    var roleDefBindingCollRestrictedContribute = SP.RoleDefinitionBindingCollection.newObject( currCtx );
					roleDefBindingCollRestrictedContribute.add( currCtx.get_web().get_roleDefinitions().getByName("Restricted Contribute"));

					//add owner group
					oResponse.item.get_roleAssignments().add( ownerGroup, roleDefBindingCollAdmin);
			
					//add member group
					oResponse.item.get_roleAssignments().add( memberGroup, roleDefBindingCollContribute );
					
					//add visitor group
					oResponse.item.get_roleAssignments().add( visitorGroup, roleDefBindingCollRestrictedRead );

					//add special permissions
					if( group1SpecialPerm != null )
						oResponse.item.get_roleAssignments().add( group1SpecialPerm, roleDefBindingCollRestrictedRead );
					if( group2SpecialPerm != null )
						oResponse.item.get_roleAssignments().add( group2SpecialPerm, roleDefBindingCollRestrictedRead );
					
					//add action offices
					var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName( oResponse.actionOffice );
					var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup( actionOfficeGroupName );
					if( actionOfficeGroup != null )
						oResponse.item.get_roleAssignments().add( actionOfficeGroup, roleDefBindingCollRestrictedRead );				

					if( qaHasRead ) //make sure qa gets read if it had access
					{
						var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameQA() );
						if( spGroupQA != null )
						{		
							if ( oResponse.item.get_item("ResStatus") == "4-Approved for QA" || oResponse.item.get_item("ResStatus") == "6-Reposted After Rejection" )										
								oResponse.item.get_roleAssignments().add( spGroupQA, roleDefBindingCollRestrictedContribute);
							else
								oResponse.item.get_roleAssignments().add( spGroupQA, roleDefBindingCollRestrictedRead );
						}
					}
								
					//////////Update response folders
					var groupPerms = "";
					for( var x = 0; x < m_arrPermissionsResponseFolders.length; x++ )
					{
						if( m_arrPermissionsResponseFolders[x].ItemName == oResponse.title )
						{
							var folderItem = m_arrPermissionsResponseFolders[x]["Item"];
							var qaHasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(folderItem,  Audit.Common.Utilities.GetGroupNameQA(), SP.PermissionKind.viewListItems);
							
							folderItem.resetRoleInheritance();
							folderItem.breakRoleInheritance(false, false);

							var roleDefBindingCollAdmin = SP.RoleDefinitionBindingCollection.newObject( currCtx );
							roleDefBindingCollAdmin.add( currCtx.get_web().get_roleDefinitions().getByType( SP.RoleType.administrator) );
				
							var roleDefBindingCollContribute = SP.RoleDefinitionBindingCollection.newObject( currCtx );
							roleDefBindingCollContribute.add( currCtx.get_web().get_roleDefinitions().getByType( SP.RoleType.contributor) );
		
							var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject( currCtx );
							roleDefBindingCollRestrictedRead.add( currCtx.get_web().get_roleDefinitions().getByName("Restricted Read"));
						  
							var roleDefBindingCollRestrictedContribute = SP.RoleDefinitionBindingCollection.newObject( currCtx );
							roleDefBindingCollRestrictedContribute.add( currCtx.get_web().get_roleDefinitions().getByName("Restricted Contribute"));

							//add owner group
							folderItem.get_roleAssignments().add( ownerGroup, roleDefBindingCollAdmin);
					
							//add member group
							folderItem.get_roleAssignments().add( memberGroup, roleDefBindingCollContribute );
							
							//add visitor group
							folderItem.get_roleAssignments().add( visitorGroup, roleDefBindingCollRestrictedRead );
							
							//add special permissions				
							if( group1SpecialPerm != null ) 			
								folderItem.get_roleAssignments().add( group1SpecialPerm, roleDefBindingCollRestrictedRead );
							if( group2SpecialPerm != null )
								folderItem.get_roleAssignments().add( group2SpecialPerm, roleDefBindingCollRestrictedRead );
							
							//add action office
							if( actionOfficeGroup != null )
								folderItem.get_roleAssignments().add( actionOfficeGroup, roleDefBindingCollRestrictedRead );	

							if( qaHasRead ) //make sure qa gets read if it had access
							{
								var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameQA() );
								
								if( spGroupQA != null )
								{
									if ( oResponse.item.get_item("ResStatus") == "4-Approved for QA" || oResponse.item.get_item("ResStatus") == "6-Reposted After Rejection" )										
										folderItem.get_roleAssignments().add( spGroupQA, roleDefBindingCollRestrictedContribute);
									else
										folderItem.get_roleAssignments().add( spGroupQA, roleDefBindingCollRestrictedRead );
								}
							}

							break;
						}
					}
							
					
					currCtx.executeQueryAsync
					(
						function () 
						{	
							cntGranted++;
							$("#divGrantCntr").text( cntGranted + " of " + cntToGrant + " Responses updated");
							if( cntGranted == cntToGrant )
							{
								document.body.style.cursor = 'default';
								
								notifyId = SP.UI.Notify.addNotification("Completed granting Special Permissions", false);
								setTimeout( function(){ m_fnRefresh()}, 200 );
							}
						}, 
						function (sender, args) 
						{
							document.body.style.cursor = 'default';

							notifyId = SP.UI.Notify.addNotification("Request failed2: "  + args.get_message() + "\n" + args.get_stackTrace(), false)							
							m_fnRefresh();
						}
					);	 
		
				}				
			}
			
			//SP.UI.Notify.addNotification("Granting Special Permissions to (" + cntToGrant + ") Responses", false);
		}
		else
			m_bIsTransactionExecuting = false;
	}	

	function m_fnRemoveSpecialPermissions( id )
	{		
		if( !m_bIsSiteOwner )
		{
			SP.UI.Notify.addNotification("You do not have access to perform this action...", false);
			return;
		}

		//this can be stale... 
		var oRequest = m_fnGetRequestByNumber( id );
		if( oRequest == null )
			return;
			
		m_bIsTransactionExecuting = true;
		
		var cntRemoved = 0;
		var cntToRemove = 0;
		var responseCount = oRequest.responses.length;
		for( var y = 0; y < responseCount; y++ )
		{
			var oResponse = oRequest.responses[y];
			
			if( oResponse.resStatus == "4-Approved for QA" || oResponse.resStatus == "6-Reposted After Rejection" || oResponse.resStatus == "7-Closed" )
			{
				cntToRemove ++;
			}
		}

		if( confirm("Are you sure you would like to remove special permissions on this Request and on (" + cntToRemove + ") Responses?"))
		{
			//document.body.style.cursor = 'wait';
			m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose("Information", "Please wait... removing Special Permissions <div id='divGrantCntr'></div>", 200, 400)

			var currCtx = SP.ClientContext.get_current();  	
		    var web = currCtx.get_web(); 
			this.currentUser = web.get_currentUser();
	    	this.ownerGroup = web.get_associatedOwnerGroup();
		 	this.memberGroup = web.get_associatedMemberGroup();
		 	this.visitorGroup = web.get_associatedVisitorGroup();
			
			var qaHasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(oRequest.item,  Audit.Common.Utilities.GetGroupNameQA(), SP.PermissionKind.viewListItems);

			var group1SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameSpecialPerm1() );
			var group2SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameSpecialPerm2() );

			oRequest.item.resetRoleInheritance();
			oRequest.item.breakRoleInheritance(false, false);
			
			var roleDefBindingCollAdmin = SP.RoleDefinitionBindingCollection.newObject( currCtx );
			roleDefBindingCollAdmin.add( currCtx.get_web().get_roleDefinitions().getByType( SP.RoleType.administrator) );

			var roleDefBindingCollContribute = SP.RoleDefinitionBindingCollection.newObject( currCtx );
			roleDefBindingCollContribute.add( currCtx.get_web().get_roleDefinitions().getByType( SP.RoleType.contributor) );

		    var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject( currCtx );
			roleDefBindingCollRestrictedRead.add( currCtx.get_web().get_roleDefinitions().getByName( "Restricted Read" ));

		    var roleDefBindingCollRestrictedContribute = SP.RoleDefinitionBindingCollection.newObject( currCtx );
			roleDefBindingCollRestrictedContribute.add( currCtx.get_web().get_roleDefinitions().getByName("Restricted Contribute"));

			//add owner group
			oRequest.item.get_roleAssignments().add( ownerGroup, roleDefBindingCollAdmin );
	
			//add member group
			oRequest.item.get_roleAssignments().add( memberGroup, roleDefBindingCollContribute );
			
			//add visitor group
			oRequest.item.get_roleAssignments().add( visitorGroup, roleDefBindingCollRestrictedRead );

			//add action offices 			
			var arrActionOffice = oRequest.item.get_item('ActionOffice');
			for( var x = 0; x < arrActionOffice.length; x++ )
			{
				var actionOfficeName = arrActionOffice[x].get_lookupValue();
				var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName( actionOfficeName );
				var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup( actionOfficeGroupName );
				if( actionOfficeGroup != null )
					oRequest.item.get_roleAssignments().add( actionOfficeGroup, roleDefBindingCollRestrictedRead );				
			}	
				
			if( qaHasRead ) //make sure qa gets read if it had access
			{
				var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameQA() );
				if( spGroupQA != null )						
					oRequest.item.get_roleAssignments().add( spGroupQA, roleDefBindingCollRestrictedRead );
			}

			oRequest.item.get_roleAssignments().getByPrincipal( currentUser ).deleteObject();
			///////////Update permissions responses - everyone should get restricted read, except for the associated member groups. action offices get contribute if open or returned to action office

			//////////Update coversheets
			for( var x = 0; x < oRequest.coversheets.length; x++ )
			{
				var coversheetItem = oRequest.coversheets[x].item;
				if( coversheetItem )
				{
					m_fnBreakCoversheetPermissionsOnSpecialPerms( currCtx, coversheetItem, false, false );
				}
			}

						
			var responseCount = oRequest.responses.length;
			
			if( responseCount == 0 || cntToRemove == 0)
			{
				currCtx.executeQueryAsync
				(
					function () 
					{	
						document.body.style.cursor = 'default';
						
						notifyId = SP.UI.Notify.addNotification("Completed removing Special Permissions", false);
						setTimeout( function(){ m_fnRefresh()}, 200 );
					}, 
					function (sender, args) 
					{
						document.body.style.cursor = 'default';
			
//						alert( "Request failed: "  + args.get_message() + "\n" + args.get_stackTrace() );
						notifyId = SP.UI.Notify.addNotification("Request failed1: "  + args.get_message() + "\n" + args.get_stackTrace(), false)							
						m_fnRefresh();
					}
				);
				return;	 	
			}


						
			for( var y = 0; y < responseCount; y++ )
			{
				var oResponse = oRequest.responses[y];
				if( oResponse.resStatus == "4-Approved for QA" || oResponse.resStatus == "6-Reposted After Rejection" || oResponse.resStatus == "7-Closed" )
				{	
					var qaHasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(oResponse.item,  Audit.Common.Utilities.GetGroupNameQA(), SP.PermissionKind.viewListItems);
					
					oResponse.item.resetRoleInheritance();
					oResponse.item.breakRoleInheritance(false, false);
	
					var group1SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameSpecialPerm1() );
					var group2SpecialPerm = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameSpecialPerm2() );
					
					var roleDefBindingCollAdmin = SP.RoleDefinitionBindingCollection.newObject( currCtx);
					roleDefBindingCollAdmin.add( currCtx.get_web().get_roleDefinitions().getByType( SP.RoleType.administrator) );
		
					var roleDefBindingCollContribute = SP.RoleDefinitionBindingCollection.newObject( currCtx);
					roleDefBindingCollContribute.add( currCtx.get_web().get_roleDefinitions().getByType( SP.RoleType.contributor) );

					var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject(currCtx);
					roleDefBindingCollRestrictedRead.add(currCtx.get_web().get_roleDefinitions().getByName( "Restricted Read" ));
					
					//add owner group
					oResponse.item.get_roleAssignments().add( ownerGroup, roleDefBindingCollAdmin);
			
					//add member group
					oResponse.item.get_roleAssignments().add( memberGroup, roleDefBindingCollContribute );
					
					//add visitor group
					oResponse.item.get_roleAssignments().add( visitorGroup, roleDefBindingCollRestrictedRead );
					
					//add action offices
					var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName( oResponse.actionOffice );
					var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup( actionOfficeGroupName );
					if( actionOfficeGroup != null )
						oResponse.item.get_roleAssignments().add( actionOfficeGroup, roleDefBindingCollRestrictedRead );				

					if( qaHasRead ) //make sure qa gets read if it had access
					{
						var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameQA() );
						if( spGroupQA != null )
						{
							if ( oResponse.item.get_item("ResStatus") == "4-Approved for QA" || oResponse.item.get_item("ResStatus") == "6-Reposted After Rejection")										
								oResponse.item.get_roleAssignments().add( spGroupQA, roleDefBindingCollRestrictedContribute);
							else
								oResponse.item.get_roleAssignments().add( spGroupQA, roleDefBindingCollRestrictedRead );
						}
					}
								
					//////////Update response folders
					var groupPerms = "";
					for( var x = 0; x < m_arrPermissionsResponseFolders.length; x++ )
					{
						if( m_arrPermissionsResponseFolders[x].ItemName == oResponse.title )
						{
							var folderItem = m_arrPermissionsResponseFolders[x]["Item"];

							var qaHasRead = Audit.Common.Utilities.CheckSPItemHasGroupPermission(folderItem,  Audit.Common.Utilities.GetGroupNameQA(), SP.PermissionKind.viewListItems);

							folderItem.resetRoleInheritance();
							folderItem.breakRoleInheritance(false, false);

							var roleDefBindingCollAdmin = SP.RoleDefinitionBindingCollection.newObject( currCtx );
							roleDefBindingCollAdmin.add( currCtx.get_web().get_roleDefinitions().getByType( SP.RoleType.administrator) );
				
							var roleDefBindingCollContribute = SP.RoleDefinitionBindingCollection.newObject( currCtx );
							roleDefBindingCollContribute.add( currCtx.get_web().get_roleDefinitions().getByType( SP.RoleType.contributor) );
		
							var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject( currCtx );
							roleDefBindingCollRestrictedRead.add( currCtx.get_web().get_roleDefinitions().getByName( "Restricted Read" ));

						    var roleDefBindingCollRestrictedContribute = SP.RoleDefinitionBindingCollection.newObject( currCtx );
							roleDefBindingCollRestrictedContribute.add( currCtx.get_web().get_roleDefinitions().getByName("Restricted Contribute"));

							//add owner group
							folderItem.get_roleAssignments().add( ownerGroup, roleDefBindingCollAdmin );
					
							//add member group
							folderItem.get_roleAssignments().add( memberGroup, roleDefBindingCollContribute );
							
							//add visitor group
							folderItem.get_roleAssignments().add( visitorGroup, roleDefBindingCollRestrictedRead );
												
							//add action office
							if( actionOfficeGroup != null )
							{		
								folderItem.get_roleAssignments().add( actionOfficeGroup , roleDefBindingCollRestrictedRead );	
							}
							
							if( qaHasRead ) //make sure qa gets read if it had access
							{
								var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup( Audit.Common.Utilities.GetGroupNameQA() );	
								if( spGroupQA != null )
								{
									if ( oResponse.item.get_item("ResStatus") == "4-Approved for QA" || oResponse.item.get_item("ResStatus") == "6-Reposted After Rejection" )										
										folderItem.get_roleAssignments().add( spGroupQA, roleDefBindingCollRestrictedContribute);
									else
										folderItem.get_roleAssignments().add( spGroupQA, roleDefBindingCollRestrictedRead );
								}
							}

							break;
						}
					}
					
					currCtx.executeQueryAsync
					(
						function () 
						{	
							cntRemoved++;
							$("#divGrantCntr").text( cntRemoved + " of " + cntToRemove + " Responses updated");
							if( cntRemoved == cntToRemove )
							{
								document.body.style.cursor = 'default';
								
								notifyId = SP.UI.Notify.addNotification("Completed removing Special Permissions", false);
								setTimeout( function(){ m_fnRefresh()}, 200 );
							}
						}, 
						function (sender, args) 
						{
							document.body.style.cursor = 'default';
							
							notifyId = SP.UI.Notify.addNotification("Request failed2: "  + args.get_message() + "\n" + args.get_stackTrace(), false)							

							//alert( "Request failed: "  + args.get_message() + "\n" + args.get_stackTrace() );
							m_fnRefresh();
						}
					);	 
		
				}				
			}			
		}
		else
			m_bIsTransactionExecuting = false;
	}
	
	function GetSourceUrlForForms()
	{
		var curPath = location.pathname;
		
		var tabIndex = $("#tabs").tabs('option', 'active');
		curPath += "?Tab=" + tabIndex;

		var requestNum = $("#ddlReqNum").val();
		if( requestNum != "" )
			curPath += "%26RequestNum=" + requestNum;
		
		var source = "&Source=" + curPath;
		return source;
	}

	function OnCallbackFormRefreshPage( result, value)
	{
		m_fnRefresh();
	}


	function OnCallbackForm(result, value)
	{
		if (result === SP.UI.DialogResult.OK) 
		{
			//alert( value );
			m_fnRefresh();
		}
		else
			m_bIsTransactionExecuting = false;
	}
	
	function OnCallbackFormNewRequest(result, value)
	{
		if (result === SP.UI.DialogResult.OK) 
		{
			//m_fnRefresh();
			//get last item inserted

			var currCtx = new SP.ClientContext.get_current();
			var web = currCtx.get_web();

			var requestList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleRequests() );
			var requestQuery = new SP.CamlQuery();	
			requestQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID" Ascending="FALSE"/></OrderBy></Query><RowLimit>1</RowLimit></View>');
			requestItems = requestList.getItems( requestQuery );
			//request status has internal name as response status in the request list
			currCtx.load( requestItems, 'Include(ID, Title, ActionOffice, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))');

			emailList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleEmailHistory() );
			var emailListQuery = new SP.CamlQuery();	
			emailListQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>');
			emailListFolderItems = emailList.getItems( emailListQuery );
			currCtx.load( emailListFolderItems, 'Include(ID, Title, DisplayName)');
			
			currCtx.executeQueryAsync
			(
				function () 
				{	
					var listItemEnumerator = requestItems.getEnumerator();
					while(listItemEnumerator.moveNext())
					{
						oListItem = listItemEnumerator.get_current();
						if( !oListItem.get_hasUniqueRoleAssignments() )
							m_fnBreakRequestPermissions( oListItem, false );
					
						$("#tabs").tabs("option", "active", 2);
						
						Audit.Common.Utilities.CreateEmailFolder( emailList, oListItem.get_item("Title"), oListItem );
						
		
						
						currCtx.executeQueryAsync
						(
							function () 
							{	
								m_fnRefresh( oListItem.get_item("Title") );
							}, 
							function (sender, args) 
							{
								m_fnRefresh( oListItem.get_item("Title") );
							}
						);

						break;
					}
				}, 
				function (sender, args) 
				{
					//alert( "Request failed: "  + args.get_message() + "\n" + args.get_stackTrace() );
					m_fnRefresh();
				}
			);

		}
	}

	function m_fnUpdateAllResponsePermissions( requestStatus, requestNum, responseDocsFolderItems, bCheckStatus, OnCompleteUpdateResponsePerms )
	{
		var cntResponsesToBreak = 0;
		var cntResponsesBroken = 0;
		for( var y = 0; y < m_arrRequests.length; y++ )
		{
			if( m_arrRequests[y].number == requestNum )
			{
				for( var z = 0; z <  m_arrRequests[y].responses.length; z++ )
				{
					cntResponsesToBreak++;					
					var doneBreakingResponse = false;
					m_fnBreakResponseAndFolderPermissions(requestStatus, m_arrRequests[y].responses[z], false, bCheckStatus, function( doneBreakingResponse )
					{
						if( doneBreakingResponse )
						{
							cntResponsesBroken++;
							if( cntResponsesBroken == cntResponsesToBreak )
							{
								OnCompleteUpdateResponsePerms ( true ); 
							}
						}
						else
							OnCompleteUpdateResponsePerms ( false );
					});	
				}
			}														
		}
		
		if( cntResponsesToBreak == 0 )
		{
			OnCompleteUpdateResponsePerms ( true );
		}
	}

//reset permissions on EA folder here
//rename all ea items
//rename all response docs
//rename all ea folders
//rename all ea docs


/*var folderPath = Audit.Common.Utilities.GetSiteUrl() + "/" + Audit.Common.Utilities.GetLibNameResponseDocs() + "/" + m_responseTitle;
var responseDocQuery2 = new SP.CamlQuery();
responseDocQuery2.set_viewXml('<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name=\'FileDirRef\'/><Value Type=\'Text\'>' + folderPath + '</Value></Eq><Eq><FieldRef Name=\'DocumentStatus\'/><Value Type=\'Text\'>Submitted</Value></Eq></And></Where></Query></View>');
responseDocSubmittedItems = responseDocLib.getItems( responseDocQuery2 );
currCtx.load(responseDocSubmittedItems, "Include(ID, DocumentStatus, FileDirRef)");
*/


	function m_fnRenameResponses( oRequest, oldRrequestNumber, newRequestNumber )
	{
		for( var x = 0; x < oRequest.responses.length; x++ )
		{
			var currCtx = new SP.ClientContext.get_current();
			var web = currCtx.get_web();
			
			var title = oRequest.responses[x].title;
			var newTitle = title.replace( oldRrequestNumber, newRequestNumber );
			oRequest.responses[x].item.set_item("Title", newTitle);
			oRequest.responses[x].item.update();

			currCtx.executeQueryAsync
			(
				function () 
				{	
				}, 
				function (sender, args) 
				{
				}
			);
		}
	}

	function m_fnRenameResponseFolders( responseDocsFoldersItems, oldRrequestNumber, newRequestNumber  )
	{
		var listItemEnumerator = responseDocsFoldersItems.getEnumerator();
		while(listItemEnumerator.moveNext())
		{
			var currCtx = new SP.ClientContext.get_current();
			var web = currCtx.get_web();

			var oListItemResponseDocFolder = listItemEnumerator.get_current();
		
			var itemName = oListItemResponseDocFolder.get_displayName();

			var test = itemName.replace( oldRrequestNumber, ""); //cant do an index test because there could be hyphens in the request number
			if( test.charAt(0) == "-")
			{
				var newTitle = itemName.replace( oldRrequestNumber, newRequestNumber  );
				oListItemResponseDocFolder.set_item( "FileLeafRef", newTitle );
				oListItemResponseDocFolder.set_item( "Title", newTitle );
				oListItemResponseDocFolder.update();
				
				currCtx.executeQueryAsync
				(
					function () 
					{	
					}, 
					function (sender, args) 
					{
					}
				);
			}
		}
	}
	
	function m_fnRenameResponsesDocs( responseDocsItems, oldRrequestNumber, newRequestNumber )
	{
		var listItemEnumerator = responseDocsItems.getEnumerator();
		while(listItemEnumerator.moveNext())
		{
			var currCtx = new SP.ClientContext.get_current();
			var web = currCtx.get_web();

			var oListItemResponseDocItem = listItemEnumerator.get_current();
		
			var itemName = oListItemResponseDocItem.get_displayName();

			var test = itemName.replace( oldRrequestNumber, ""); //cant do an index test because there could be hyphens in the request number
			if( test.charAt(0) == "-")
			{
				var newTitle = itemName.replace( oldRrequestNumber, newRequestNumber  );
				oListItemResponseDocItem.set_item( "FileLeafRef", newTitle );
				oListItemResponseDocItem.set_item( "Name", newTitle );
				oListItemResponseDocItem.update();
				
				currCtx.executeQueryAsync
				(
					function () 
					{	
					alert("updated response doc");
					}, 
					function (sender, args) 
					{
					alert("failed updated response doc");
					}
				);
			}
		}
	}
	
	function m_fnRenameEmailFolder( emailListFolderItems, oldRrequestNumber, newRequestNumber )
	{
		//rename the EMail Folder
		var listItemEnumerator = emailListFolderItems.getEnumerator();
		while(listItemEnumerator.moveNext())
		{
			var currCtx = new SP.ClientContext.get_current();
			var web = currCtx.get_web();

			var oListItemEmailFolder = listItemEnumerator.get_current();
			
			var itemName = oListItemEmailFolder.get_displayName();
			if( oldRrequestNumber == itemName )
			{
				var newTitle = itemName.replace( oldRrequestNumber, newRequestNumber );
				oListItemEmailFolder.set_item( "FileLeafRef", newTitle );
				oListItemEmailFolder.set_item( "Title", newTitle );
				oListItemEmailFolder.update();
				
				currCtx.executeQueryAsync
				(
					function () 
					{	
					}, 
					function (sender, args) 
					{
					}
				);
			}
		}	
	}

	//rename the External Auditor response folder
	function m_fnRenameEAFolder( eaListFolderItems, oldRrequestNumber, newRequestNumber )
	{
		//rename the EA folder
		var listItemEnumerator = eaListFolderItems.getEnumerator();
		while(listItemEnumerator.moveNext())
		{
			var currCtx = new SP.ClientContext.get_current();
			var web = currCtx.get_web();

			var oListItemEAFolder = listItemEnumerator.get_current();
			
			var itemName = oListItemEAFolder.get_displayName();
			if( oldRrequestNumber == itemName )
			{
				var newTitle = itemName.replace( oldRrequestNumber, newRequestNumber );
				oListItemEAFolder.set_item( "FileLeafRef", newTitle );
				oListItemEAFolder.set_item( "Title", newTitle );
				oListItemEAFolder.update();

				currCtx.executeQueryAsync
				(
					function () 
					{	
					}, 
					function (sender, args) 
					{
					}
				);
			}
		}
	}

	function OnCallbackFormEditRequest(result, value)
	{
		if (result === SP.UI.DialogResult.OK) 
		{
			m_bIsTransactionExecuting = true;
			
			notifyId = SP.UI.Notify.addNotification("Please wait...", false);
			document.body.style.cursor = 'wait';
		
			//alert( "must grant the new updated action offices permissions to this request");
		
			var currCtx = new SP.ClientContext.get_current();
			var web = currCtx.get_web();

			var requestList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleRequests() );
			var requestQuery = new SP.CamlQuery();				
			requestQuery.set_viewXml('<View><Query><Where><Eq><FieldRef Name="ID"/><Value Type="Text">' + m_itemID + '</Value></Eq></Where></Query></View>');
			requestItems = requestList.getItems( requestQuery );
			//request status has internal name as response status in the request list
			currCtx.load( requestItems, 'Include(ID, Title, ActionOffice, ReqStatus, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))');

			var emailList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleEmailHistory() );
			var emailListQuery = new SP.CamlQuery();	
			emailListQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>');
			emailListFolderItems = emailList.getItems( emailListQuery );
			currCtx.load( emailListFolderItems, 'Include(ID, Title, DisplayName)');

			var eaList = web.get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleResponseDocsEA() );
			var eaListQuery = new SP.CamlQuery();	
			eaListQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>');
			eaListFolderItems = eaList.getItems( eaListQuery );
			currCtx.load( eaListFolderItems, 'Include(ID, Title, DisplayName)');


			var responseDocsLibFolderslist = currCtx.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleResponseDocs() );
			//oTargetCTypes = list.get_contentTypes();
			//rootFolder = list.get_rootFolder();	
			var responseDocsLibFolderslistQuery = new SP.CamlQuery();
		    responseDocsLibFolderslistQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="Name"/></OrderBy><Where><Eq><FieldRef Name="FSObjType" /><Value Type="Lookup">1</Value></Eq></Where></Query></View>');
			responseDocsLibFolderslistQuery.set_folderServerRelativeUrl( Audit.Common.Utilities.GetSiteUrl() + "/" + Audit.Common.Utilities.GetLibNameResponseDocs() );
			responseDocsFoldersItems = responseDocsLibFolderslist.getItems(responseDocsLibFolderslistQuery);
			currCtx.load(responseDocsFoldersItems, "Include( DisplayName, Id, EncodedAbsUrl, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))");
	
			var data = {responseDocsFoldersItems: responseDocsFoldersItems, requestItemId: m_itemID }
			function onSuccess() 
			{			
				function m_fnUpdateEmailFolderPerms( requestNum, bRefresh)
				{
					var listItemEnumerator1 = emailListFolderItems.getEnumerator();
					while(listItemEnumerator1.moveNext()) //reset action offices if they were changes in the request form
					{
						var oEmailFolderItem = listItemEnumerator1.get_current();
					
						if( oEmailFolderItem.get_displayName() == requestNum )
						{
							m_fnBreakEmailFolderPermissions(oEmailFolderItem, oListItem, bRefresh );
						}
					}
				}
			
				var listItemEnumerator = requestItems.getEnumerator();
				while(listItemEnumerator.moveNext()) //reset action offices if they were changes in the request form
				{
					var oListItem = listItemEnumerator.get_current();
						
					if( m_requestNum == oListItem.get_item("Title") ) //if request number hasn't changed
					{
						m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose("Information", "Please wait... ", 200, 400);

						m_fnBreakRequestPermissions( oListItem, false );
						
						var doneUpdatingResponses = false;
						m_fnUpdateAllResponsePermissions( oListItem.get_item("ReqStatus"), m_requestNum, this.responseDocsFoldersItems,  true, function( doneUpdatingResponses )
						{
							if( doneUpdatingResponses )
							{
								m_fnUpdateEmailFolderPerms( m_requestNum, false );
								setTimeout( function(){ m_fnRefresh(); }, 200 );
							}
						} );
					}
					else //if request number changed, update responses; otherwise it will refresh and not hit this
					{
						m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose("Renaming Responses", "Please wait... Renaming Responses", 200, 400);

						m_fnBreakRequestPermissions( oListItem, false );

						var oRequest = m_fnGetRequestByNumber( m_requestNum );
						
						var newRequestNumber = oListItem.get_item("Title");

						m_fnRenameResponses( oRequest, m_requestNum, newRequestNumber);
						m_fnRenameResponseFolders( m_ResponseDocsFoldersItems, m_requestNum, newRequestNumber);
						m_fnRenameEmailFolder( emailListFolderItems, m_requestNum, newRequestNumber);
						m_fnRenameEAFolder( eaListFolderItems, m_requestNum, newRequestNumber);
						
						setTimeout( function(){ m_fnRefresh(newRequestNumber); }, 20000 );
					}
				}
			}
			function onFail(sender, args) 
			{		
					m_fnRefresh();
			}
	
		    currCtx.executeQueryAsync(Function.createDelegate(data, onSuccess), Function.createDelegate(data, onFail));
		}
		else
			m_bIsTransactionExecuting = false;
	}

	function OnCallbackFormCoverSheet( result, value )
	{
		if (result === SP.UI.DialogResult.OK) 
		{
			var currCtx = new SP.ClientContext.get_current();
			var web = currCtx.get_web();

			var coversheetList = web.get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleCoverSheets() );
			var coversheetQuery = new SP.CamlQuery();	
			coversheetQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="Modified" Ascending="FALSE"/></OrderBy></Query><RowLimit>1</RowLimit></View>');
			coversheetItems = coversheetList .getItems( coversheetQuery );
			currCtx.load( coversheetItems , 'Include(ID, Title, ActionOffice, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))');
			
			currCtx.executeQueryAsync
			(
				function () 
				{	
					var listItemEnumerator = coversheetItems.getEnumerator();
					while(listItemEnumerator.moveNext())
					{
						var oListItem = listItemEnumerator.get_current();
						m_fnBreakCoversheetPermissions( oListItem, false, true );
						
						break;
					}
				}, 
				function (sender, args) 
				{
					//alert( "Request failed: "  + args.get_message() + "\n" + args.get_stackTrace() );
					m_fnRefresh();
				}
			);
		}
		else
			m_bIsTransactionExecuting = false;
	}
	
	function OnCallbackFormBulkAddResponse( result, value)
	{
		//this is a field on this page that gets updated by the bulkupdate page if a bulk update operation has run
		if( $("#divRanBulkUpdate").text() == 1 ) 
			m_fnRefresh();
			
			
		/*//Iterate through all the responses/response folders created today and check/break permissions
		m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose("Please wait", "Please wait... Checking Response Folders <div id='bulkMsg'></div>", 200, 400);

		var currCtx = new SP.ClientContext.get_current();
		var web = currCtx.get_web();
		
		var responseList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleResponses() );
		var responseQuery = new SP.CamlQuery();	
		responseQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="ReqNum"/></OrderBy><Where><Eq><FieldRef Name="Created" /><Value Type="DateTime"><Today /></Value></Eq></Where></Query></View>');
		responseItems = responseList.getItems( responseQuery );
		currCtx.load( responseItems, 'Include(ID, Title, ReqNum, ActionOffice, ReturnReason, SampleNumber, ResStatus, ClosedDate, ClosedBy, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))' );
		
		var responseDocsLibFolderslist = currCtx.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleResponseDocs() );
		//oTargetCTypes = list.get_contentTypes();
		//rootFolder = list.get_rootFolder();	
		var responseDocsLibFolderslistQuery = new SP.CamlQuery();
	    responseDocsLibFolderslistQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="Name"/></OrderBy><Where><And><Eq><FieldRef Name="Created" /><Value Type="DateTime"><Today /></Value></Eq><Eq><FieldRef Name="FSObjType" /><Value Type="Lookup">1</Value></Eq></And></Where></Query></View>');
		responseDocsLibFolderslistQuery.set_folderServerRelativeUrl( Audit.Common.Utilities.GetSiteUrl() + "/" + Audit.Common.Utilities.GetLibNameResponseDocs() );
		responseDocsFoldersItems = responseDocsLibFolderslist.getItems( responseDocsLibFolderslistQuery );
		currCtx.load(responseDocsFoldersItems , "Include( DisplayName, Id, EncodedAbsUrl, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))");


		currCtx.executeQueryAsync
		(
			function () 
			{	
				var bBreakSomething = false;
				
				var listItemEnumerator = responseItems.getEnumerator();
				while(listItemEnumerator.moveNext())
				{
					var oListItem = listItemEnumerator.get_current();
					if( !oListItem.get_hasUniqueRoleAssignments() )
					{
						m_fnBreakResponsePermissions( oListItem, false, true );
						bBreakSomething = true;
					}
				}
				
				var cntFoldersToBreak = 0;
				var cntFoldersBroken = 0;
				var cntFoldersNotBroken = 0;
				var listItemEnumerator = responseDocsFoldersItems.getEnumerator();
				while(listItemEnumerator.moveNext())
				{
					var oListFolderItem = listItemEnumerator.get_current();
					if( !oListFolderItem.get_hasUniqueRoleAssignments() )
					{
						var folderDisplayName = oListFolderItem.get_displayName();
						
						//Get the response item because we need the status for breaking response folder permissions
						var oResponseItem = null;
						var listItemEnumerator1 = responseItems.getEnumerator();
						while(listItemEnumerator1.moveNext())
						{
							var oListItem = listItemEnumerator1.get_current();
							if( oListItem.get_item("Title") == folderDisplayName )
							{
								oResponseItem = oListItem;
								break;
							}
						}						

						if( oResponseItem )
						{
							cntFoldersToBreak++;
							$("#bulkMsg").text( cntFoldersBroken + " of " + cntFoldersToBreak + " Responses updated");
							
							var done = false;
							m_fnBreakResponseFolderPermissions( oListFolderItem, oResponseItem, false, true, function (done)
							{
								if( done )
									cntFoldersBroken++;
								else 
									cntFoldersNotBroken++;
								
								$("#bulkMsg").text( cntFoldersBroken + " of " + cntFoldersToBreak + " Responses updated");

								if( cntFoldersToBreak == ( cntFoldersBroken + cntFoldersNotBroken ) )
								{
									//alert("done here");
									m_fnRefresh();
								}
							});
							
							bBreakSomething = true;
						}
					}
				}
				
				if( bBreakSomething )
				{
					document.body.style.cursor = 'wait';
					notifyId = SP.UI.Notify.addNotification("Please wait... ", false);
					//setTimeout( function(){ m_fnRefresh()}, 10000 );
				}				
				else
				{
					m_bIsTransactionExecuting = false;
					document.body.style.cursor = 'default';
					m_waitDialog.close();
					//do nothing
				}
			}, 
			function (sender, args) 
			{
				m_bIsTransactionExecuting = false;
				//alert( "Request failed: "  + args.get_message() + "\n" + args.get_stackTrace() );
				m_fnRefresh();
			}
		);*/
	}

	function OnCallbackFormNewResponse( result, value )
	{
		if (result === SP.UI.DialogResult.OK) 
		{
			//m_fnRefresh();
			
			//get last item inserted
			var currCtx = new SP.ClientContext.get_current();
			var web = currCtx.get_web();

			var responseList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleResponses() );
			var responseQuery = new SP.CamlQuery();	
			responseQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID" Ascending="FALSE"/></OrderBy></Query><RowLimit>1</RowLimit></View>');
			responseItems = responseList.getItems( responseQuery );
			currCtx.load( responseItems , 'Include(ID, Title, ActionOffice, ReqNum, ResStatus, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))');
	
			currCtx.executeQueryAsync
			(
				function () 
				{	
					var oListItem = null;
					
					var listItemEnumerator = responseItems.getEnumerator();
					while(listItemEnumerator.moveNext())
					{
						oListItem = listItemEnumerator.get_current();
						if( oListItem && !oListItem.get_hasUniqueRoleAssignments() )
							m_fnBreakResponsePermissions( oListItem, false, true );
							
						break;
					}
					
					if( oListItem == null )
						return;
					
					var responseTitle = oListItem.get_item("Title");
					var requestNum = oListItem.get_item("ReqNum").get_lookupValue();

					this.currentUser = currCtx.get_web().get_currentUser();
					this.ownerGroup = currCtx.get_web().get_associatedOwnerGroup();
				 	this.memberGroup = currCtx.get_web().get_associatedMemberGroup();
				 	this.visitorGroup = currCtx.get_web().get_associatedVisitorGroup();

					
					var responseDocLib = currCtx.get_web().get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleResponseDocs() );
					var itemCreateInfo = new SP.ListItemCreationInformation();
					itemCreateInfo.set_underlyingObjectType( SP.FileSystemObjectType.folder );
					itemCreateInfo.set_leafName( responseTitle );
					oListFolderItem = responseDocLib.addItem( itemCreateInfo );			
					oListFolderItem.set_item("Title", responseTitle );
					oListFolderItem.update();
					
					oListFolderItem.breakRoleInheritance(false, false);
				
					//add owner group
					var roleDefBindingColl = SP.RoleDefinitionBindingCollection.newObject( currCtx );
					roleDefBindingColl.add( currCtx.get_web().get_roleDefinitions().getByType( SP.RoleType.administrator) );
					oListFolderItem.get_roleAssignments().add( ownerGroup, roleDefBindingColl );
					
					//add member group
					var roleDefBindingColl2 = SP.RoleDefinitionBindingCollection.newObject( currCtx );
					roleDefBindingColl2.add( currCtx.get_web().get_roleDefinitions().getByType( SP.RoleType.contributor) );
					oListFolderItem.get_roleAssignments().add( memberGroup, roleDefBindingColl2 );
					
					//add visitor group
					var roleDefBindingColl3 = SP.RoleDefinitionBindingCollection.newObject( currCtx );
					roleDefBindingColl3.add( currCtx.get_web().get_roleDefinitions().getByName( "Restricted Read") );
					oListFolderItem.get_roleAssignments().add( visitorGroup, roleDefBindingColl3 );
				
					//add action office
					var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName(oListItem.get_item("ActionOffice").get_lookupValue());	
					var actionOfficeGroupObj = Audit.Common.Utilities.GetSPSiteGroup( actionOfficeGroupName );
					if( actionOfficeGroupObj != null )
					{
						var roleDefBindingColl4 = SP.RoleDefinitionBindingCollection.newObject( currCtx );
						roleDefBindingColl4.add( currCtx.get_web().get_roleDefinitions().getByName( "Restricted Contribute" ) );
						oListFolderItem.get_roleAssignments().add( actionOfficeGroupObj, roleDefBindingColl4 );
					}
								
					//delete current logged in user from permissions because it gets added by default
					oListFolderItem.get_roleAssignments().getByPrincipal( currentUser ).deleteObject();

					//Audit.Common.Utilities.CreateEmailFolder( emailList, requestNum );

					currCtx.executeQueryAsync
					(
						function () 
						{	
							m_fnRefresh();
						},
						function (sender, args) 
						{
							//alert( "Request failed: "  + args.get_message() + "\n" + args.get_stackTrace() );
							m_fnRefresh();
						}
					);

				}, 
				function (sender, args) 
				{
					//alert( "Request failed: "  + args.get_message() + "\n" + args.get_stackTrace() );
					m_fnRefresh();
				}
			);
		}
		else
			m_bIsTransactionExecuting = false;
	}
	
	function OnCallbackFormEditResponse( result, value )
	{
		//m_itemID = id;
		//m_responseTitle = responseTitle
		
		if (result === SP.UI.DialogResult.OK) 
		{
			document.body.style.cursor = 'wait';
			notifyId = SP.UI.Notify.addNotification("Please wait... ", false);

			var currCtx = new SP.ClientContext.get_current();
			var web = currCtx.get_web();

			//get the response that was edited
			var responseList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleResponses() );
			var responseQuery = new SP.CamlQuery();	
			responseQuery.set_viewXml('<View><Query><FieldRef Name="Modified" Ascending="FALSE"/><Where><Eq><FieldRef Name=\'ID\'/><Value Type=\'Text\'>' + m_itemID + '</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>');
			responseItems = responseList.getItems( responseQuery );
			currCtx.load( responseItems, 'Include(ID, Title, ActionOffice, ResStatus, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))');

			//get the response folder of the response that was edited
			var responseDocLib = web.get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleResponseDocs() );
			var responseDocQuery = new SP.CamlQuery();
		    responseDocQuery.set_viewXml('<View><Query><Where><Eq><FieldRef Name=\'FileLeafRef\'/><Value Type=\'Text\'>' + m_responseTitle + '</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>');
		    responseFolderItems = responseDocLib.getItems( responseDocQuery );
			currCtx.load(responseFolderItems, "Include( Title, DisplayName, Id, EncodedAbsUrl, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))");

			var folderPath = Audit.Common.Utilities.GetSiteUrl() + "/" + Audit.Common.Utilities.GetLibNameResponseDocs() + "/" + m_responseTitle;
			var responseDocQuery2 = new SP.CamlQuery();
		    responseDocQuery2.set_viewXml('<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name=\'FileDirRef\'/><Value Type=\'Text\'>' + folderPath + '</Value></Eq><Eq><FieldRef Name=\'DocumentStatus\'/><Value Type=\'Text\'>Submitted</Value></Eq></And></Where></Query></View>');
		  	responseDocSubmittedItems = responseDocLib.getItems( responseDocQuery2 );
			currCtx.load(responseDocSubmittedItems, "Include(ID, DocumentStatus, FileDirRef, Created, FileLeafRef)");
		
			var responseDocQuery6 = new SP.CamlQuery();
		    responseDocQuery6.set_viewXml('<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name=\'FileDirRef\'/><Value Type=\'Text\'>' + folderPath + '</Value></Eq><Eq><FieldRef Name=\'DocumentStatus\'/><Value Type=\'Text\'>Open</Value></Eq></And></Where></Query></View>');
		  	responseDocOpenItems = responseDocLib.getItems( responseDocQuery6 );
			currCtx.load(responseDocOpenItems, "Include(ID, DocumentStatus, FileDirRef, Created, FileLeafRef)");

			var responseDocQuery3 = new SP.CamlQuery();
		    responseDocQuery3.set_viewXml('<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name=\'FileDirRef\'/><Value Type=\'Text\'>' + folderPath + '</Value></Eq><Eq><FieldRef Name=\'DocumentStatus\'/><Value Type=\'Text\'>Marked for Deletion</Value></Eq></And></Where></Query></View>');
		  	responseDocMarkedForDeletionItems = responseDocLib.getItems( responseDocQuery3);
			currCtx.load(responseDocMarkedForDeletionItems, "Include(ID, DocumentStatus, FileDirRef, Created, FileLeafRef)");
		
			var responseDocQuery4 = new SP.CamlQuery();
		    responseDocQuery4.set_viewXml('<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name=\'FileDirRef\'/><Value Type=\'Text\'>' + folderPath + '</Value></Eq><Eq><FieldRef Name=\'DocumentStatus\'/><Value Type=\'Text\'>Rejected</Value></Eq></And></Where></Query></View>');
		  	responseDocRejectedItems = responseDocLib.getItems( responseDocQuery4 );
			currCtx.load(responseDocRejectedItems, "Include(ID, DocumentStatus, FileDirRef, Created, FileLeafRef)");

			var responseDocQuery8 = new SP.CamlQuery();
		    responseDocQuery8.set_viewXml('<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name=\'FileDirRef\'/><Value Type=\'Text\'>' + folderPath + '</Value></Eq><Eq><FieldRef Name=\'DocumentStatus\'/><Value Type=\'Text\'>Sent to QA</Value></Eq></And></Where></Query></View>');
		  	responseDocSentToQAItems = responseDocLib.getItems( responseDocQuery8 );
			currCtx.load(responseDocSentToQAItems, "Include(ID, DocumentStatus, FileDirRef, Created, FileLeafRef)");

			var emailList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleEmailHistory() );
			var emailListQuery = new SP.CamlQuery();	
			emailListQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>');
			emailListFolderItems = emailList.getItems( emailListQuery );
			currCtx.load( emailListFolderItems, 'Include(ID, Title, DisplayName)');

			currCtx.executeQueryAsync
			(
				function () 
				{	
					//add this check in just in case			
					if( !Audit.Common.Utilities.CheckIfEmailFolderExists( emailListFolderItems, m_requestNum ) )
				    {
				    	Audit.Common.Utilities.CreateEmailFolder( emailList, m_requestNum )
				    }
				
					var oListItem = null;
					var newResponseFolderTitle = null;
					var listItemEnumerator = responseItems.getEnumerator();
					while(listItemEnumerator.moveNext())
					{
						oListItem = listItemEnumerator.get_current();
						newResponseFolderTitle = oListItem.get_item("Title");
						m_fnBreakResponsePermissions( oListItem, false, true );	
						break;
					}
					
					if( oListItem == null )
					{
						alert("Error");
					}
					
					var responseFolder = null;				
					var listItemEnumerator = responseFolderItems.getEnumerator();
					while(listItemEnumerator.moveNext())
					{
						responseFolder = listItemEnumerator.get_current();			
						m_fnBreakResponseFolderPermissions(responseFolder, oListItem, false, true); 
						break;
					}
					
					if( m_responseTitle != newResponseFolderTitle  )
					{
						responseFolder.set_item("FileLeafRef", newResponseFolderTitle);
						responseFolder.set_item("Title", newResponseFolderTitle);
						responseFolder.update();
					}
					
					if( oListItem.get_item("ResStatus") == "3-Returned to Action Office" && m_responseStatus != oListItem.get_item("ResStatus") ) //status changed
					{
						var oRequest = m_fnGetRequestByNumber( m_requestNum );
						
						var emailSubject = "Please Update your Response for Request Number: " + m_requestNum;
						var emailText = "<div>Audit Request Reference: <b>REQUEST_NUMBER</b></div>" +
							"<div>Audit Request Subject: <b>REQUEST_SUBJECT</b></div>" +		
							"<div>Audit Request Due Date: <b>REQUEST_DUEDATE</b></div><br/>" +		
							"REQUEST_RELATEDAUDIT<br/>" +
							"<div>Below are the listed action items that have been requested for the Audit: </div>" +
							"<div>REQUEST_ACTIONITEMS<br/></div>" +		
							//"<div>Below is a link to Cover & Spreadsheet: ??</div>" +
							//"<div>N/A</div>" +
							"<div>Please provide responses for the following Sample(s): </div><br/>" +
							"<div>RESPONSE_TITLES</div>" ;
								
				
						emailText = emailText.replace("REQUEST_NUMBER",  m_requestNum );
						emailText = emailText.replace("REQUEST_SUBJECT", oRequest.subject);
						emailText = emailText.replace("REQUEST_DUEDATE", oRequest.internalDueDate );
						emailText = emailText.replace("REQUEST_ACTIONITEMS", oRequest.actionItems );	
						emailText = emailText.replace("RESPONSE_TITLES", newResponseFolderTitle );	
						
						if( oRequest.relatedAudit == null || oRequest.relatedAudit == "" )
							emailText = emailText.replace("REQUEST_RELATEDAUDIT", "<div>This is a new request, not similar to previous audit cycles.</div>");	
						else
							emailText = emailText.replace("REQUEST_RELATEDAUDIT", "<div>This request is similar to this previous cylce audit" + oRequest.relatedAudit + "</div>");

						var ao = oListItem.get_item("ActionOffice");
						if( ao != null )
							ao = ao.get_lookupValue();
						else
							ao = "";
							
						var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName( ao )
						
						var itemCreateInfo = new SP.ListItemCreationInformation();
					    itemCreateInfo.set_folderUrl( location.protocol + "//" + location.host + Audit.Common.Utilities.GetSiteUrl() + "/Lists/" + Audit.Common.Utilities.GetListNameEmailHistory() + "/" + m_requestNum );				    
					    oListItemEmail = emailList.addItem( itemCreateInfo );
					    oListItemEmail.set_item('Title', emailSubject);
					    oListItemEmail.set_item('Body', emailText);
					    oListItemEmail.set_item('To', actionOfficeGroupName );
					    oListItemEmail.set_item('NotificationType', "AO Returned Notification" );
					    oListItemEmail.set_item('ReqNum', m_requestNum );
					    oListItemEmail.set_item('ResID', newResponseFolderTitle );
					    oListItemEmail.update();	
					    
					}

					else if( ( oListItem.get_item("ResStatus") == "4-Approved for QA" || oListItem.get_item("ResStatus") == "6-Reposted After Rejection" ) && m_responseStatus != oListItem.get_item("ResStatus") ) //status changed
					{
						var oRequest = m_fnGetRequestByNumber( m_requestNum );
						
						m_fnBreakRequestPermissions(oRequest.item, false, oListItem.get_item("ResStatus") );
					
						function m_fnGetNewResponseDocTitle( responseDocItem, responseName )
						{
							var createdDate = responseDocItem.get_item("Created");
							var newResponseDocTitle = responseName + "_" + createdDate.format("yyyyMMddTHHmmss");
							var oldResponseDocTitle = responseDocItem.get_item("FileLeafRef");
							var docName = oldResponseDocTitle.substring(0, oldResponseDocTitle.indexOf("."));
							var docExt = oldResponseDocTitle.replace(docName, "");
							newResponseDocTitle += docExt;
							return newResponseDocTitle;
						}
					
						var cntForQA = 0;
						if( responseDocSubmittedItems != null )
						{
							var listItemEnumerator1 = responseDocSubmittedItems.getEnumerator();
							while(listItemEnumerator1.moveNext())
							{
								var oListItem1 = listItemEnumerator1.get_current();
							
								oListItem1.set_item("FileLeafRef", m_fnGetNewResponseDocTitle( oListItem1, newResponseFolderTitle  ));	
								oListItem1.set_item("DocumentStatus", "Sent to QA");
								oListItem1.update();		
								cntForQA ++;
							}
						}
						if( responseDocOpenItems != null )
						{
							var listItemEnumerator1 = responseDocOpenItems.getEnumerator();
							while(listItemEnumerator1.moveNext())
							{
								var oListItem1 = listItemEnumerator1.get_current();
								
								oListItem1.set_item("FileLeafRef", m_fnGetNewResponseDocTitle( oListItem1, newResponseFolderTitle  ));	
								oListItem1.set_item("DocumentStatus", "Sent to QA");
								oListItem1.update();		
								cntForQA ++;
							}
						}
						if( responseDocSentToQAItems != null )
						{
							var listItemEnumerator1 = responseDocSentToQAItems.getEnumerator();
							while(listItemEnumerator1.moveNext())
							{
								var oListItem1 = listItemEnumerator1.get_current();
								cntForQA ++;
							}
						}
						
						//these are the documents that are marked for deletion by the AO
						if( responseDocMarkedForDeletionItems != null )
						{
							arrItemsToRecyle = new Array();
							
							var listItemEnumerator1= responseDocMarkedForDeletionItems.getEnumerator();
							while(listItemEnumerator1.moveNext())
							{
								var oListItem1 = listItemEnumerator1.get_current();
								arrItemsToRecyle.push( oListItem1 );
							}
							
							for( var x = 0; x < arrItemsToRecyle.length; x ++ )
							{
								arrItemsToRecyle[x].deleteObject(); //change this to delete to remove from recycle bin
							}
						}
						
						var cntRejected = 0;
						if( responseDocRejectedItems != null )
						{
							var listItemEnumerator1 = responseDocRejectedItems.getEnumerator();
							while(listItemEnumerator1.moveNext())
							{
								var oListItem1 = listItemEnumerator1.get_current();
								oListItem1.set_item("DocumentStatus", "Archived");
								oListItem1.update();		
								cntRejected++;
							}
						}
												
 						var requestNumber = oRequest.number
 						var requestSubject = oRequest.subject;
 						var internalDueDate = oRequest.internalDueDate;
				    	
				    	var emailSubject = "Your Approval Has Been Requested for Response Number: " + newResponseFolderTitle;
						var emailText = "<div>Audit Request Reference: <b>" + m_requestNum + "</b></div>" +
							"<div>Audit Request Subject: <b>"+ requestSubject + "</b></div>" +		
							"<div>Audit Request Due Date: <b>" + internalDueDate + "</b></div><br/>" +
							"<div>Response: <b><ul><li>" + newResponseFolderTitle + "</li></ul></b></div><br/>" +
							"<div>Please review: <b>" + cntForQA + "</b> documents.</div><br/>";
						
						var itemCreateInfo = new SP.ListItemCreationInformation();
					    itemCreateInfo.set_folderUrl( location.protocol + "//" + location.host + Audit.Common.Utilities.GetSiteUrl() + "/Lists/" + Audit.Common.Utilities.GetListNameEmailHistory() + "/" + m_requestNum );				    
					    oListItemEmail = emailList.addItem( itemCreateInfo );
					    oListItemEmail.set_item( 'Title', emailSubject);
					    oListItemEmail.set_item( 'Body', emailText);
					    oListItemEmail.set_item( 'To', Audit.Common.Utilities.GetGroupNameQA() );
					    oListItemEmail.set_item( 'NotificationType', "QA Notification" );
					    oListItemEmail.set_item( 'ReqNum', m_requestNum );
					    oListItemEmail.set_item( 'ResID', newResponseFolderTitle );
					    oListItemEmail.update();	
					    
					   					    
					    for( var x = 0; x < oRequest.coversheets.length; x++ )
					    {
					    	//give QA access to the coversheet
					    	//refresh on complete
					    	m_fnBreakCoversheetPermissions( oRequest.coversheets[x].item, true, false ); 
						}
					}
					
					currCtx.executeQueryAsync
					(
						function () 
						{	
						    document.body.style.cursor = 'default';
			    			setTimeout( function(){ m_fnRefresh()}, 1000 );
						}, 
						function (sender, args) 
						{
							alert( "Request failed: "  + args.get_message() + "\n" + args.get_stackTrace() );
							setTimeout( function(){ m_fnRefresh()}, 200 );
						}
					);	

				}, 
				function (sender, args) 
				{
					alert( "Request failed: "  + args.get_message() + "\n" + args.get_stackTrace() );
					setTimeout( function(){ m_fnRefresh()}, 200 );
				}
			);
		}	
		else
		{
			m_bIsTransactionExecuting = false;
		}
	}

	function m_fnGoToRequest( requestNumber, responseTitle )
	{
		notifyId = SP.UI.Notify.addNotification("Displaying Request (" + requestNumber + ")", false);

		m_sGoToResponseTitle = null;
		if( responseTitle != null && responseTitle != "" )
			m_sGoToResponseTitle = responseTitle;

		$('#tabs').tabs({ active: 2 });	

		if( $("#ddlReqNum").val() != requestNumber )
			$("#ddlReqNum").val( requestNumber ).change();		
		else if( m_sGoToResponseTitle != null )
		{
			//need to navigate to tab 2 for this to work
			m_fnHighlightResponse();
		}
	}

	function LoadDDOptionsTbl()
	{					
		var arrRequestID = new Array();
		var arrRequestStatus = new Array();
		var arrRequestInternalDueDate = new Array();
		var arrRequestDueDate = new Array();
		var arrRequestSample = new Array();
		var arrRequestAO = new Array();
		var arrRequestResponseCount = new Array();
		
		var arrResponseRequestID = new Array();
		var arrResponseTitle = new Array();
		var arrResponseSample = new Array();
		var arrResponseStatus = new Array();
		var arrResponseAO = new Array();
		var arrResponseModified = new Array();
		
		$(".sr1-request-requestNum").each(function()
		{
			var val = $(this).text();
			if( !Audit.Common.Utilities.ExistsInArr( arrRequestID, val ))
				arrRequestID.push(val);
		});
		
		$(".sr1-request-status").each(function()
		{
			var val = $(this).text();
			if( !Audit.Common.Utilities.ExistsInArr( arrRequestStatus, val ))
				arrRequestStatus.push(val);
		});
		
		$(".sr1-request-internalDueDate").each(function()
		{
			var val = $(this).text();
			if( !Audit.Common.Utilities.ExistsInArr( arrRequestInternalDueDate, val ))
				arrRequestInternalDueDate.push(val);
		});
		$(".sr1-request-dueDate").each(function()
		{
			var val = $(this).text();
			if( !Audit.Common.Utilities.ExistsInArr( arrRequestDueDate, val ))
				arrRequestDueDate.push(val);
		});
		$(".sr1-request-sample").each(function()
		{
			var val = $(this).text();
			if( !Audit.Common.Utilities.ExistsInArr( arrRequestSample , val ))
				arrRequestSample.push(val);
		});		
		$(".sr1-request-actionOffice-item").each(function()
		{
			var val = $(this).text();
			if( !Audit.Common.Utilities.ExistsInArr( arrRequestAO, val ))
				arrRequestAO.push(val);
		});		
		
		
		
		$(".sr2-response-requestNum").each(function()
		{
			var val = $(this).text();
			if( !Audit.Common.Utilities.ExistsInArr( arrResponseRequestID, val ))
				arrResponseRequestID.push(val);
		});
		$(".sr2-response-title").each(function()
		{
			var val = $(this).text();
			if( !Audit.Common.Utilities.ExistsInArr( arrResponseTitle, val ))
				arrResponseTitle.push(val);
		});
		$(".sr2-response-sample").each(function()
		{
			var val = $(this).text();
			if( !Audit.Common.Utilities.ExistsInArr( arrResponseSample , val ))
				arrResponseSample.push(val);
		});
		$(".sr2-response-status").each(function()
		{
			var val = $(this).text();
			if( !Audit.Common.Utilities.ExistsInArr( arrResponseStatus , val ))
				arrResponseStatus.push(val);
		});
		$(".sr2-response-ao").each(function()
		{
			var val = $(this).text();
			if( !Audit.Common.Utilities.ExistsInArr( arrResponseAO, val ))
				arrResponseAO.push(val);
		});
		$(".sr2-response-modified").each(function()
		{
			var val = $(this).text();
			if( val != null && val != "" )
			{
				val = val.split(" ")[0];
				if( !Audit.Common.Utilities.ExistsInArr( arrResponseModified, val ))
					arrResponseModified.push(val);
			}
		});

		//on tab1
		Audit.Common.Utilities.AddOptions( arrRequestID, "#ddlRequestRequestID", false);
		Audit.Common.Utilities.AddOptions( arrRequestStatus, "#ddlRequestStatus", false);
		Audit.Common.Utilities.AddOptions( arrRequestInternalDueDate, "#ddlRequestInternalDueDate", false);
		Audit.Common.Utilities.AddOptions( arrRequestDueDate, "#ddlRequestDueDate", false);
		Audit.Common.Utilities.AddOptions( arrRequestSample , "#ddlRequestSample", false);
		Audit.Common.Utilities.AddOptions( arrRequestAO, "#ddlRequestAO", false);
		
		//on tab2
		Audit.Common.Utilities.AddOptions( arrResponseRequestID, "#ddlResponseRequestID", false);
		Audit.Common.Utilities.AddOptions( arrRequestInternalDueDate, "#ddlResponseRequestInternalDueDate", false);
		Audit.Common.Utilities.AddOptions( arrResponseTitle, "#ddlResponseName", false);
		Audit.Common.Utilities.AddOptions( arrResponseSample, "#ddlResponseSampleNum", false);
		Audit.Common.Utilities.AddOptions( arrResponseStatus, "#ddlResponseStatus", false);
		Audit.Common.Utilities.AddOptions( arrResponseAO, "#ddlResponseAO", false);
		Audit.Common.Utilities.AddOptions( arrResponseModified , "#ddlResponseModified", true);
		
		$("#ddlResponseModified option").eq(1).before($("<option></option>").val("This Quarter").text("This Quarter"));
		$("#ddlResponseModified option").eq(1).before($("<option></option>").val("This Month").text("This Month"));
		$("#ddlResponseModified option").eq(1).before($("<option></option>").val("Last 7 Days").text("Last 7 Days"));
		
	}

	/*function UnBindTableSorter(tableName)
	{
		if( m_bLoaded )
		{
			$( '#' + tableName )
			 .unbind('appendCache applyWidgetId applyWidgets sorton update updateCell')
			 //.removeClass('tablesorter')
			 .find('thead th')
			 .unbind('click mousedown')
			 .removeClass('header headerSortDown headerSortUp');
		}
		m_bLoaded = true;
	}*/

	function BindTableSorter( type, rowCount, tableName)
	{
		if( rowCount > 0 )
		{
			if( type == 0 )
			{
				$( "#" + tableName ).tablesorter(
				{
					sortList: [[0,0],[1,0]],
					selectorHeaders: '.sorter-true'
				}); 
			}
			else if( type == 1 )
			{
				$( "#" + tableName ).tablesorter(
				{
					sortList: [[7,1]],
					selectorHeaders: '.sorter-true'
				}); 
			}
		}
	}		
	
	function BindActionOfficeHandler()
	{
		$(".actionOfficeContainer").click( function()
		{		
			 $(this).parent().find(".sr1-request-actionOffice-item").toggleClass( "collapsed" ); 
		});
	}
	
	function BindActionOfficeRequestInfoHandler()
	{
		$(".actionOfficeContainerRequestInfo").click( function()
		{		
			 $(this).parent().find(".sr1-request-actionOfficeContainerRequestInfo-item").toggleClass( "collapsed" ); 
		});
	}
	
	function BindHandlersOnLoad()
	{
		$("#linkSubmitNewReq").click(function()
		{
			m_fnCreateRequest();
		});
		
		$(".linkHelpResponseDocs").click(function()
		{
			m_fnDisplayHelpResponseDocs();
		});
		

		$("#ddlReqNum").change(function(){
			LoadRequestInfo( $(this).val() );
		});

		$(".warning").click(function()
		{
			 $(this).parent().find("div").toggleClass( "collapsed" ); 
			 $(this).parent().toggleClass( "colorRedLegend" ); 
		});
		
		BindActionOfficeHandler();

		$("#btnViewAllRequests").click(function()
		{
			m_fnClearFilterRequests();
		});
		
		$("#btnViewAllResponses").click(function()
		{
			m_fnClearFilterResponses();
		});

		$( "#ddlRequestRequestID, #ddlRequestStatus, #ddlRequestInternalDueDate, #ddlRequestDueDate, #ddlRequestSample, #ddlRequestAO" ).change(function()
		{
			document.body.style.cursor = 'wait';
			setTimeout( function(){ m_fnFilterRequests()}, 200 );
		});

		$( "#ddlResponseRequestID, #ddlResponseRequestInternalDueDate, #ddlResponseName, #ddlResponseSampleNum, #ddlResponseStatus, #ddlResponseAO, #ddlResponseModified" ).change(function()
		{
			document.body.style.cursor = 'wait';
			setTimeout( function(){ m_fnFilterResponses()}, 200 );
		});
	}
	
	function m_fnClearFilterRequests()
	{
		$("#ddlRequestRequestID").val("");
		$("#ddlRequestStatus").val("");
		$("#ddlRequestInternalDueDate").val("");
		$("#ddlRequestDueDate").val("");
		$("#ddlRequestSample").val("");
		$("#ddlRequestAO").val("");
		
		m_fnFilterRequests();
	}

	function m_fnClearFilterResponses()
	{
		$("#ddlResponseRequestID").val("");
		$("#ddlResponseRequestStatus").val("");
		$("#ddlResponseRequestInternalDueDate").val("");
		$("#ddlResponseName").val("");
		$("#ddlResponseSampleNum").val("");
		$("#ddlResponseStatus").val("");
		$("#ddlResponseAO").val("");
		$("#ddlResponseModified").val("");
		$("#ddlResponseRequestInternalDueDate").val("");
		
		m_fnFilterResponses();
	}

	//Captures the values from all of the drop downs and uses them to filter the rows
	function m_fnFilterRequests() 
	{		
		var requestID = $("#ddlRequestRequestID").val();
		var requestStatus = $("#ddlRequestStatus").val();
		var internalDueDate = $("#ddlRequestInternalDueDate").val();
		var dueDate = $("#ddlRequestDueDate").val();
		var requestSample = $("#ddlRequestSample").val();
		var requestAO = $("#ddlRequestAO").val();
			
		//each row in the data form web part is marked with this class; it iterates through each to find the containing class to see if it matches
		//the value that has been selected in the drop down
		var cntVisible = 0;
		var cntRows = 0;
		$(".sr1-request-item").each(function() 
		{			
			cntRows ++;
			var hide = false;
			
			if( !hide && requestID != "" && $.trim( $(this).find(".sr1-request-requestNum").text() ) != requestID )
			{
				hide = true;
			}		
			if( !hide && requestStatus != "" && $.trim( $(this).find(".sr1-request-status").text() ) != requestStatus )
			{
				hide = true;
			}	
			if( !hide && internalDueDate != "" && $.trim( $(this).find(".sr1-request-internalDueDate").text() ) != internalDueDate )
			{
				hide = true;				
			}		
			if( !hide && dueDate != "" && $.trim( $(this).find(".sr1-request-dueDate").text() ) != dueDate )
			{
				hide = true;				
			}		
			if( !hide && requestSample != "" && $.trim( $(this).find(".sr1-request-sample").text() ) != requestSample )
			{
				hide = true;				
			}		
			if( !hide && requestAO != "" )
			{
				var bFound = false;
				$(this).find(".sr1-request-actionOffice-item").each(function()
				{
					if( $(this).text() == requestAO )
					{
						bFound = true;
						return;
					}
				});
				if( !bFound )
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
	    var numOfVisibleRows = cntVisible;//$('.sr1-request-item:visible').length;
	    var numRows = cntRows;//$('.sr1-request-item').length;

		$("#spanRequestsDisplayedTotal").text( numOfVisibleRows );   		
		document.body.style.cursor = 'default';
		
		if( numRows == numOfVisibleRows )
			$("#btnViewAllRequests").hide();
		else
			$("#btnViewAllRequests").show();
	}

	//Captures the values from all of the drop downs and uses them to filter the rows
	function m_fnFilterResponses() 
	{		
		var requestID = $("#ddlResponseRequestID").val();
		var dueDate = $("#ddlResponseRequestInternalDueDate").val();
		var responseName = $("#ddlResponseName").val();
		var sampleNum = $("#ddlResponseSampleNum").val();
		var responseStatus = $("#ddlResponseStatus").val();
		var actionOffice = $("#ddlResponseAO").val();
		var modified = $("#ddlResponseModified").val();
			
		//each row in the data form web part is marked with this class; it iterates through each to find the containing class to see if it matches
		//the value that has been selected in the drop down
		var cntVisible = 0;
		var cntRows = 0;
		$(".sr2-response-item").each(function() 
		{		
			cntRows++;	
			var hide = false;
			
			if( !hide && requestID != "" && $.trim( $(this).find(".sr2-response-requestNum").text() ) != requestID )
			{
				hide = true;
			}		
			if( !hide && dueDate != "" && $.trim( $(this).find(".sr2-response-internalDueDate").text() ) != dueDate )
			{
				hide = true;
			}	
			if( !hide && responseName!= "" && $.trim( $(this).find(".sr2-response-title").text() ) != responseName)
			{
				hide = true;				
			}		
			if( !hide && sampleNum != "" && $.trim( $(this).find(".sr2-response-sample").text() ) != sampleNum )
			{
				hide = true;				
			}		
			if( !hide && responseStatus != "" && $.trim( $(this).find(".sr2-response-status").text() ) != responseStatus )
			{
				hide = true;				
			}		
			if( !hide && actionOffice!= "" && $.trim( $(this).find(".sr2-response-ao").text() ) != actionOffice)
			{
				hide = true;				
			}		
			if( !hide && modified != "" )
			{
				var curDate = new Date();
				var responseModifiedDate = $(this).find(".sr2-response-modified").text();
								
				if( modified == "Last 7 Days" )
				{
					var modifiedDate = new Date( responseModifiedDate );
					curDate.setDate( curDate.getDate() - 7 );
					if( curDate > modifiedDate )
						hide = true;
					
				}
				else if( modified == "This Month" )
				{
					var modifiedDate = new Date ( responseModifiedDate );
					curDate.setDate( 1 );
					if( curDate > modifiedDate )
						hide = true;

				}
				else if( modified == "This Quarter" )
				{
					var modifiedDate = new Date ( responseModifiedDate );
					
					if( modifiedDate.getFullYear() != curDate.getFullYear() )
					{
						hide = true;
					}
					else
					{
						var modifiedMonth = modifiedDate.getMonth();
						var curMonth = curDate.getMonth();
						
						if( curMonth == 0 || curMonth == 1 || curMonth == 2 )
						{
							if( modifiedMonth != 0 && modifiedMonth != 1 && modifiedMonth != 3 ) 
							{
								hide = true;
							}
						}
						else if( curMonth == 3 || curMonth == 4 || curMonth == 5 )
						{
							if( modifiedMonth != 3 && modifiedMonth != 4 && modifiedMonth != 5 ) 
							{
								hide = true;
							}
						}
						else if( curMonth == 6 || curMonth == 7 || curMonth == 8 )
						{
							if( modifiedMonth != 6 && modifiedMonth != 7 && modifiedMonth != 8 ) 
							{
								hide = true;
							}
						}
						else if( curMonth == 9 || curMonth == 10 || curMonth == 11 )
						{
							if( modifiedMonth != 9 && modifiedMonth != 10 && modifiedMonth != 11 ) 
							{
								hide = true;
							}
						}
					}
				}
				else if( $.trim(responseModifiedDate).indexOf( modified ) < 0  )
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
	    var numOfVisibleRows = cntVisible;//$('.sr2-response-item:visible').length;
	    var numRows = cntRows;//$('.sr2-response-item').length;

		$("#spanResponsesDisplayedTotal").text( numOfVisibleRows );   		
		document.body.style.cursor = 'default';

		if( numRows == numOfVisibleRows )
			$("#btnViewAllResponses").hide();
		else
			$("#btnViewAllResponses").show();
	}
	
	var publicMembers = 
	{
		Load: m_fnLoadData,
		ViewPermissions: m_fnViewPermissions,
		ViewRequest: function(id){ m_fnViewRequest(id); },
		EditRequest: function(id, requestNum){ m_fnEditRequest(id, requestNum); },
		ViewRequestDoc: function(id){ m_fnViewRequestDoc(id); },
		EditRequestDoc: function(id){ m_fnEditRequestDoc(id); },		
		ViewCoverSheet: function(id){ m_fnViewCoverSheet(id); },
		EditCoverSheet: function(id, requestNumber){ m_fnEditCoverSheet(id, requestNumber); },
		BulkAddResponse: function(id){ m_fnBulkAddResponse(id); },
		AddResponse: function(id){ m_fnAddResponse(id); },
		ViewResponse: function(requestNumber, id, responseTitle, responseStatus){ m_fnViewResponse(requestNumber, id, responseTitle, responseStatus); },
		EditResponse: function(requestNumber, id, responseTitle, responseStatus){ m_fnEditResponse(requestNumber, id, responseTitle, responseStatus); },
		ReOpenResponse: function(id, responseTitle){ m_fnReOpenResponse(id, responseTitle); },
		ViewResponseDoc: function(id, requestID, responseID){ m_fnViewResponseDoc(id, requestID, responseID); },
		EditResponseDoc: function(id, requestID, responseID){ m_fnEditResponseDoc(id, requestID, responseID); },
		CheckInResponseDoc: function (folder, fileName) { m_fnCheckInResponseDoc(folder, fileName); },
		ViewResponseDocFolder: function(title){ m_fnViewResponseDocFolder(title); },		
		ViewEmailHistoryFolder: function(requestNum){ m_fnViewEmailHistoryFolder(requestNum); },		
		UploadRequestDoc: function(requestNum){ m_fnUploadRequestDoc(requestNum); },
		DeleteResponseDoc: function(itemID){ m_fnDeleteResponseDoc(itemID); },		
		UploadCoverSheet: function(requestNum){ m_fnUploadCoverSheet(requestNum); },
		UploadResponseDoc: function(requestID, responseID){ m_fnUploadResponseDoc(requestID, responseID); },
		GrantSpecialPermissions: function(id){ m_fnGrantSpecialPermissions(id); },
		RemoveSpecialPermissions: function(id){ m_fnRemoveSpecialPermissions(id); },
		SendEmail: function(requestID){ m_fnSendEmail(requestID);},
		GoToRequest: function(requestNum, responseTitle){ m_fnGoToRequest(requestNum, responseTitle); },
		//CloseRequest: function(requestNumToClose){ m_fnCloseRequest(requestNumToClose); },
		IsTransactionExecuting: function(){ return m_bIsTransactionExecuting; },
		Refresh: m_fnRefresh
	}
	
	return publicMembers;
}	
