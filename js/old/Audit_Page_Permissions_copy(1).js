
var Audit = window.Audit|| {};
Audit.Permissions = Audit.Permissions || {};

ExecuteOrDelayUntilScriptLoaded(InitPermissions, "sp.js");	

function InitPermissions() 
{    
	Audit.Permissions.Report = new Audit.Permissions.Load();
	Audit.Permissions.Init();
}

Audit.Permissions.Init = function()
{

}

Audit.Permissions.Load = function ()
{	
	//var m_siteUrl = _spPageContextInfo.webServerRelativeUrl; //IE11 in sp 2013 does not recognize L_Menu_BaseUrl
	var m_arrRequests = new Array();
	var m_arrResponses = new Array();
	var m_arrResponseFolders = new Array();
	
	var m_collGroup = null;
	var m_ownerGroupName = null;
	var m_memberGroupName = null;
	var m_visitorGroupName = null;
	
	var m_txtOutgoingEmailText = null;
	
	var m_emailFolderName = "AOVerifications";
	
	LoadInfo();
	
	function LoadInfo()
	{					
		//$("#divTblOutput").html("");
					
		var currCtx = new SP.ClientContext.get_current();
		var web = currCtx.get_web();

		var requestList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleRequests() );
		var requestQuery = new SP.CamlQuery();	
		requestQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>');
		m_requestItems = requestList.getItems( requestQuery );
		//request status has internal name as response status in the request list
		currCtx.load( m_requestItems, 'Include(ID, Title, ReqSubject, ReqStatus, IsSample, ReqDueDate, InternalDueDate, ActionOffice, EmailSent, Modified, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))');
	    
		var responseList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleResponses() );
		var responseQuery = new SP.CamlQuery();	
		responseQuery.set_viewXml('<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="ReqNum"/></OrderBy></Query></View>');
		m_responseItems = responseList.getItems( responseQuery );
		currCtx.load( m_responseItems, 'Include(ID, Title, ReqNum, ActionOffice, ReturnReason, SampleNumber, ResStatus, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))' );

		var responseDocsLibFolderslist = web.get_lists().getByTitle( Audit.Common.Utilities.GetLibTitleResponseDocs() );
		var responseDocsLibFolderslistQuery = new SP.CamlQuery();
	    responseDocsLibFolderslistQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="Name"/></OrderBy><Where><Eq><FieldRef Name="FSObjType" /><Value Type="Lookup">1</Value></Eq></Where></Query></View>');
		responseDocsLibFolderslistQuery.set_folderServerRelativeUrl( Audit.Common.Utilities.GetSiteUrl() + "/" + Audit.Common.Utilities.GetLibNameResponseDocs() );
		m_ResponseDocsFoldersItems = responseDocsLibFolderslist.getItems(responseDocsLibFolderslistQuery);
		currCtx.load( m_ResponseDocsFoldersItems, "Include( DisplayName, Id, ContentType, EncodedAbsUrl, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))");
		
		var aoList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleActionOffices() );
		var aoQuery = new SP.CamlQuery();	
		aoQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>');
		m_aoItems = aoList.getItems( aoQuery );
		currCtx.load( m_aoItems, 'Include(ID, Title, UserGroup)');


    	this.ownerGroup = web.get_associatedOwnerGroup();
	 	this.memberGroup = web.get_associatedMemberGroup();
	 	this.visitorGroup = web.get_associatedVisitorGroup();
	 	currCtx.load( ownerGroup );
	 	currCtx.load( memberGroup );
	 	currCtx.load( visitorGroup );

		currCtx.executeQueryAsync(OnSuccess, OnFailure);		
		function OnSuccess(sender, args)
		{
			Audit.Common.Utilities.LoadActionOffices( m_aoItems );
			
			m_ownerGroupName = ownerGroup.get_title();
			m_memberGroupName = memberGroup.get_title();
			m_visitorGroupName = visitorGroup.get_title();

			m_fnLoadRequestPermissions();
			m_fnLoadResponsePermissions();
			m_fnLoadResponseFolderPermissions();
			
			LoadDDOptions();
			
			$("#tabs").tabs().show();
			
			m_fnBindHandlersOnLoad();

			Audit.Common.Utilities.OnLoadDisplayTimeStamp();
			m_fnOnLoadDisplayTab();
			
			var isModalDlg = GetUrlKeyValue('IsDlg');
			if( isModalDlg == null || isModalDlg ==  "" ||  isModalDlg == false)
			{
				$("#btnRefresh").show();
			}

						
			var currCtx = new SP.ClientContext.get_current();
			var web = currCtx.get_web();
			m_collGroup = currCtx.get_web().get_siteGroups();
		    currCtx.load( m_collGroup );
		   	currCtx.load( m_collGroup, "Include(Users)")
		   	
			function OnSuccess1(sender, args)
			{
				m_fnDisplaySPGroupPermissions( m_collGroup );
			}
			function OnFailure1(sender, args)
			{
			
			}				
			currCtx.executeQueryAsync(OnSuccess1, OnFailure1);		
		}
		function OnFailure(sender, args)
		{
			$("#divLoading").hide();

			statusId = SP.UI.Status.addStatus("Request failed: "  + args.get_message() + "\n" + args.get_stackTrace());
   			SP.UI.Status.setStatusPriColor(statusId, 'red');
		}		
	}
		
	function m_fnRefresh()
	{
		var curPath = location.pathname;
		
		var tabIndex = $("#tabs").tabs('option', 'active');
		curPath += "?Tab=" + tabIndex;
		
		location.href = curPath;
	}

	function m_fnOnLoadDisplayTab( )
	{
		var paramTabIndex = GetUrlKeyValue("Tab");
		if( paramTabIndex != null && paramTabIndex != "" )
		{
			$("#tabs").tabs("option", "active", paramTabIndex);
		}
	}
	
	
	function m_fnLoadRequestPermissions()
	{
		m_arrRequests = new Array();
				
		var currCtx = SP.ClientContext.get_current();  	
		var web = currCtx.get_web(); 
			
		this.ownerGroup = web.get_associatedOwnerGroup();
		this.memberGroup = web.get_associatedMemberGroup();
		this.visitorGroup = web.get_associatedVisitorGroup();
		 	
		 	
		var listItemEnumerator = m_requestItems.getEnumerator();
		while(listItemEnumerator.moveNext())
		{
			var oListItem = listItemEnumerator.get_current();
			
			var id = oListItem.get_item('ID');
			var number = oListItem.get_item('Title');
			var status = oListItem.get_item('ReqStatus');

			var sample = oListItem.get_item('IsSample');
			var arrActionOffice = oListItem.get_item('ActionOffice');
			var actionOffice = "";
			for( var x = 0; x < arrActionOffice.length; x++ )
			{
				actionOffice += "<div>" + arrActionOffice[x].get_lookupValue() + "</div>";
			}	

			var requestObject = new Object();
			requestObject ["ID"] = id;
			requestObject ["number"] = number;
			requestObject ["status"] = status;
			requestObject ["sample"] = sample;
			requestObject ["responses"] = new Array();
			requestObject ["actionOffice"] = actionOffice;
			requestObject ["item"] = oListItem;
			
			m_fnLoadPermsOnItem( requestObject, oListItem );

			m_arrRequests.push( requestObject );
		}
		
		var arrRequestIDs = new Array();
		var errorCount = 0;
		var sTablePermissionsBody = "";
		for( var x = 0; x < m_arrRequests.length; x ++ )
		{
			var oRequest = m_arrRequests[x];
	
			var number = oRequest.number;
			arrRequestIDs.push( number );
			var status = oRequest.status;
			var actionOffices = oRequest.actionOffice;			
			var permsDisplay = oRequest.permissionsDisplay;
			var hasSecialPerms = Audit.Common.Utilities.GetTrueFalseIcon( oRequest.hasSpecialPermissions );
			
			var flagItem = false;
			var errToolTip = "";
			
			for( var y = 0; y < oRequest.item.get_item('ActionOffice').length; y++ )
			{
				var actionOfficeName = oRequest.item.get_item('ActionOffice')[y].get_lookupValue();
				var groupNameActionOffice = Audit.Common.Utilities.GetAOSPGroupName( actionOfficeName );
				
				var bFoundPermission = false;
				for( var z = 0; z < oRequest.arrUserPermissions.length; z++ )
					if( oRequest.arrUserPermissions[z].name == groupNameActionOffice ) bFoundPermission = true;
				for( var z = 0; z < oRequest.arrGroupPermissions.length; z++ )
					if( oRequest.arrGroupPermissions[z].name == groupNameActionOffice ) bFoundPermission = true;

				if( !bFoundPermission )
				{
					errToolTip = ' title="Missing Action Office in this set of Permissions" ';
					flagItem = true;
				}
			}
			
			if( !flagItem ) //check if groups/users found in the permissions that are not part of the AOs
			{
				var bError = false;
				for( var z = 0; z < oRequest.arrUserPermissions.length; z++ )
				{
					var bFound = false;
					var name = oRequest.arrUserPermissions[z].name;
					for( var y = 0; y < oRequest.item.get_item('ActionOffice').length; y++ )
					{
						var actionOfficeName = oRequest.item.get_item('ActionOffice')[y].get_lookupValue();
						var groupNameActionOffice = Audit.Common.Utilities.GetAOSPGroupName( actionOfficeName );
						if( name == groupNameActionOffice )
						{
							bFound = true;
						}
					}
					if ( !bFound )
					{
						if( name == m_ownerGroupName || name == m_memberGroupName || name == m_visitorGroupName || name == Audit.Common.Utilities.GetGroupNameQA() || name == Audit.Common.Utilities.GetGroupNameSpecialPerm1() || name == Audit.Common.Utilities.GetGroupNameSpecialPerm2()  )
						{
							bFound = true;
						}
						else
						{
							bFound = false;
						}
					}
					if( !bFound )
					{
						bError = true;
						break;
					}
				}
				for( var z = 0; z < oRequest.arrGroupPermissions.length; z++ )
				{
					var bFound = false;
					var name = oRequest.arrGroupPermissions[z].name;
					for( var y = 0; y < oRequest.item.get_item('ActionOffice').length; y++ )
					{
						var actionOfficeName = oRequest.item.get_item('ActionOffice')[y].get_lookupValue();
						var groupNameActionOffice = Audit.Common.Utilities.GetAOSPGroupName( actionOfficeName );
						if( name == groupNameActionOffice )
						{
							bFound = true;
						}
					}
					if ( !bFound )
					{
						if( name == m_ownerGroupName || name == m_memberGroupName || name == m_visitorGroupName || name == Audit.Common.Utilities.GetGroupNameQA() || name == Audit.Common.Utilities.GetGroupNameSpecialPerm1() || name == Audit.Common.Utilities.GetGroupNameSpecialPerm2()  )
						{
							bFound = true;
						}	    	
						else
						{
							bFound = false;
						}
					}
					if( !bFound )
					{
						bError = true;
						break;
					}
				}
				
				if( bError )
				{
					errToolTip = ' title="User or Group found in this set of Permissions that does not belong" ';
					flagItem = true;
				}
			}
			
			
			//if( oRequest.hasSpecialPermissions && ( status != "4-Approved for QA" && status != "7-Closed" ) )// this should never be the case
			//	flagItem = true;
			
			var styleTag = "";
			if( flagItem )
			{
				styleTag = ' style="background-color:lightsalmon" ' + errToolTip ;
				errorCount ++;
			}			

			var link = "<a href=\"javascript:void(0);\" onclick='Audit.Permissions.Report.GoToRequest(\"" + oRequest.number  + "\")'>" + oRequest.number + "</a>";

			sTablePermissionsBody += '<tr class="request-perm-item" ' + styleTag + '>' + 
				'<td class="request-perm-item-number" title="Request number">' + link + '</td>' +
				'<td class="request-perm-item-status" title="Request status">' + status + '</td>' +
				'<td class="request-perm-item-actionOffices" title="Request action offices">' + actionOffices + '</td>' +
				'<td class="request-perm-item-specialPerms" title="Request special permissions?">' + hasSecialPerms + '</td>' +
				'<td class="request-perm-item-perms" title="Request permissions">' + permsDisplay + '</td>' +
			'</tr>';
			
			
		}
		
		$("#tblRequestsPermissions tbody").append( sTablePermissionsBody );
		
		$("#tblRequestsPermsTotal").text( m_arrRequests.length );
		
		if( errorCount > 0 )
		{
			$("#divErrorMsg").html( $("#divErrorMsg").html() + "<div><fieldset><legend>Request Permissions</legend><span class='ui-icon ui-icon-alert'></span>There are (" + errorCount + ") Requests with Permission issues detected</fielset></div>");
		}
		
		Audit.Common.Utilities.AddOptions(arrRequestIDs, "#ddlRequestID", false);
	}

	function m_fnLoadResponsePermissions()
	{
		m_arrResponses = new Array();
		
		var listItemEnumerator = m_responseItems.getEnumerator();
		while(listItemEnumerator.moveNext())
		{
			var oListItem = listItemEnumerator.get_current();
			
			var number = oListItem.get_item('ReqNum');
			if( number != null )
			{
				number = number.get_lookupValue();
				
				var responseObject = new Object();
				responseObject ["ID"] = oListItem.get_item('ID');
				responseObject ["number"] = number;
				responseObject ["title"] = oListItem.get_item('Title');
				responseObject ["item"] = oListItem;
				
				responseObject ["sample"] = oListItem.get_item('SampleNumber');
				if( responseObject ["sample"] == null )
					responseObject ["sample"] = "";
				
				responseObject ["actionOffice"] = oListItem.get_item('ActionOffice');						
				if( responseObject ["actionOffice"] == null )
					responseObject ["actionOffice"] = "";
				else
					responseObject ["actionOffice"] = responseObject ["actionOffice"].get_lookupValue();
					
				responseObject ["resStatus"] = oListItem.get_item('ResStatus');
				
				m_fnLoadPermsOnItem( responseObject, oListItem );
				
				m_arrResponses.push( responseObject );	
			}
		}
		
		var arrErrorRequestNoSpecialPerms = new Array();
		var arrErrorResponseHasSpecialPerms = new Array();
		var arrErrorResponseActionOfficeNotInRequest = new Array();
		
		var errorCount = 0;		
		var sTablePermissionsBody = "";
		for( var x = 0; x < m_arrResponses.length; x ++ )
		{
			var oResponse = m_arrResponses[x];
	
			var number = oResponse.number;
			var title = oResponse.title;
			var status = oResponse.resStatus;
			var actionOffice = oResponse.actionOffice;			
			var perms = oResponse.permissionsDisplay;
			var hasSpecialPerms = Audit.Common.Utilities.GetTrueFalseIcon( oResponse.hasSpecialPermissions );

			var bRequestSpecialPerms = false;
			var requestSpecialPerms = "";
			var arrRequestActionOffices = null;
			var requestActionOffices = "";
			for( var y = 0; y < m_arrRequests.length; y++ )
			{
				if( m_arrRequests[y].number == number )
				{
					bRequestSpecialPerms = m_arrRequests[y].hasSpecialPermissions;
					requestSpecialPerms = Audit.Common.Utilities.GetTrueFalseIcon( m_arrRequests[y].hasSpecialPermissions );
					arrRequestActionOffices = m_arrRequests[y].item.get_item('ActionOffice');
					requestActionOffices = m_arrRequests[y].actionOffice;
					break;
				}
			}
			
			var flagItem = false;
			if( !bRequestSpecialPerms && oResponse.hasSpecialPermissions ) // this should never be the case
			{
				flagItem = true;
				arrErrorRequestNoSpecialPerms.push( title );
			}
			if( oResponse.hasSpecialPermissions && ( status != "4-Approved for QA" && status != "7-Closed" ) )
			{
				flagItem = true;
				arrErrorResponseHasSpecialPerms.push( title );
			}
			
			var responseActionOfficeIsInRequest = false;
			for( var y = 0; y < arrRequestActionOffices.length;y++ )
			{
				if( arrRequestActionOffices[y].get_lookupValue() == actionOffice )
				{
					responseActionOfficeIsInRequest = true;
				}
			}	

			if( !responseActionOfficeIsInRequest )
			{
				flagItem = true;
				arrErrorResponseActionOfficeNotInRequest.push( title );
			}
			
			var styleTag = "";
			if( flagItem )
			{
				styleTag = ' style="background-color:lightsalmon" ';
				errorCount ++;
			}			

			var link = "<a href=\"javascript:void(0);\" onclick='Audit.Permissions.Report.GoToResponse(\"" + title  + "\")'>" + title + "</a>";

			requestActionOffices = requestActionOffices.replace(actionOffice, "<b>" + actionOffice + "</b>");
			sTablePermissionsBody += '<tr class="response-perm-item" ' + styleTag + '>' + 
				'<td class="response-perm-item-number" title="Request number" nowrap>' + number + '</td>' +
				'<td class="response-perm-item-title" title="Response title" nowrap>' + link + '</td>' +
				'<td class="response-perm-item-status" title="Response status" nowrap>' + status + '</td>' +
				'<td class="response-perm-item-requestActionOffices" title="Request action offices" nowrap>' + requestActionOffices + '</td>' +
				'<td class="response-perm-item-actionOffice" title="Response action office">' + actionOffice + '</td>' +
				'<td class="response-perm-item-requestSpecialPerms" title="Special permissions?">' + requestSpecialPerms + '</td>' +
				'<td class="response-perm-item-specialPerms" title="Special permissions">' + hasSpecialPerms + '</td>' +
				'<td class="response-perm-item-perms" title="Response permissions" nowrap>' + perms + '</td>' +
			'</tr>';
		}
		
		$("#tblResponsePermissions tbody").append( sTablePermissionsBody );
		
		$("#tblResponsePermsTotal").text( m_arrResponses.length );
		
		if( errorCount > 0 )
		{
			var errorMsg1 = m_fnGetErrorMsg(arrErrorRequestNoSpecialPerms, "These Responses have Special Permisions, but their Requests do not");
			var errorMsg2 = m_fnGetErrorMsg(arrErrorResponseHasSpecialPerms , "These Responses have Special Permisions, but their Response Status is NOT '4-Approved for QA' or '7-Closed'");
			var errorMsg3 = m_fnGetErrorMsg(arrErrorResponseActionOfficeNotInRequest, "These Responses have an Action Office that is not specified in the Request's Action Offices");

			$("#divErrorMsg").html( $("#divErrorMsg").html() + "<div style='padding-bottom:5px;'><fieldset><legend>Response Permissions</legend><span class='ui-icon ui-icon-alert'></span>There are (" + errorCount + ") Responses with Permission issues detected." + errorMsg1 + errorMsg2 + errorMsg3 + "</fielset></div>");
		}
	}
	
	function m_fnLoadResponseFolderPermissions()
	{
		var m_arrResponseFolders = new Array();
		
		var listItemEnumerator = m_ResponseDocsFoldersItems.getEnumerator();
		while(listItemEnumerator.moveNext())
		{
			var oListItem = listItemEnumerator.get_current();
			
			var folderName = oListItem.get_displayName();
			for( var x = 0; x < m_arrResponses.length; x ++ )
			{
				if( m_arrResponses[x].title == folderName )
				{
					var responseFolderObject = new Object();
					responseFolderObject ["title"] = folderName ;
					responseFolderObject ["response"] =  m_arrResponses[x];

					m_fnLoadPermsOnItem( responseFolderObject, oListItem );

					m_arrResponseFolders.push( responseFolderObject );	
					break;
				}
			}
		}
		
		var arrErrorRequestNoSpecialPerms = new Array();
		var arrErrorResponseHasSpecialPerms = new Array();
		var arrErrorResponseActionOfficeNotInRequest = new Array();
		
		var errorCount = 0;		
		var sTablePermissionsBody = "";
		for( var x = 0; x < m_arrResponseFolders.length; x ++ )
		{
			var oResponseFolder = m_arrResponseFolders[x];
	
			var number = oResponseFolder.response.number;
			var title = oResponseFolder.response.title;
			var folderName = oResponseFolder.title;
			var status = oResponseFolder.response.resStatus;
			var responseActionOffice = oResponseFolder.response.actionOffice;			
			var perms = oResponseFolder.response.permissionsDisplay;
			var hasSpecialPerms = Audit.Common.Utilities.GetTrueFalseIcon( oResponseFolder.hasSpecialPermissions );
			var responseSpecialPerms = Audit.Common.Utilities.GetTrueFalseIcon( oResponseFolder.response.hasSpecialPermissions );

			var bRequestSpecialPerms = false;
			var requestSpecialPerms = "";
			var arrRequestActionOffices = null;
			var requestActionOffices = "";
			for( var y = 0; y < m_arrRequests.length; y++ )
			{
				if( m_arrRequests[y].number == number )
				{
					bRequestSpecialPerms = m_arrRequests[y].hasSpecialPermissions;
					requestSpecialPerms = Audit.Common.Utilities.GetTrueFalseIcon( m_arrRequests[y].hasSpecialPermissions );
					arrRequestActionOffices = m_arrRequests[y].item.get_item('ActionOffice');
					requestActionOffices = m_arrRequests[y].actionOffice;
					break;
				}
			}
			
			var flagItem = false;
			if( !bRequestSpecialPerms && oResponseFolder.response.hasSpecialPermissions ) // this should never be the case
			{
				flagItem = true;
				arrErrorRequestNoSpecialPerms.push( title );
			}
			if( oResponseFolder.response.hasSpecialPermissions && ( status != "4-Approved for QA" && status != "7-Closed" ) )
			{
				flagItem = true;
				arrErrorResponseHasSpecialPerms.push( title );
			}
			
			var responseActionOfficeIsInRequest = false;
			for( var y = 0; y < arrRequestActionOffices.length;y++ )
			{
				if( arrRequestActionOffices[y].get_lookupValue() == responseActionOffice)
				{
					responseActionOfficeIsInRequest = true;
				}
			}	

			if( !responseActionOfficeIsInRequest )
			{
				flagItem = true;
				arrErrorResponseActionOfficeNotInRequest.push( title );
			}
			
			var styleTag = "";
			if( flagItem )
			{
				styleTag = ' style="background-color:lightsalmon" ';
				errorCount ++;
			}			
			
			requestActionOffices = requestActionOffices.replace(responseActionOffice, "<b>" + responseActionOffice + "</b>");
			sTablePermissionsBody += '<tr class="responseFolder-perm-item" ' + styleTag + '>' + 
				'<td class="responseFolder-perm-item-number" title="Request number" nowrap>' + number  + '</td>' +
				'<td class="responseFolder-perm-item-responseTitle" title="Response title">' + title  + '</td>' +
				'<td class="responseFolder-perm-item-title" title="Response folder" nowrap>' + folderName + '</td>' +
				'<td class="responseFolder-perm-item-status" title="Response status" nowrap>' + status + '</td>' +
				'<td class="responseFolder-perm-item-requestActionOffices" title="Request action offices" nowrap>' + requestActionOffices + '</td>' +
				'<td class="responseFolder-perm-item-responseActionOffice" title="Response action office" nowrap>' + responseActionOffice + '</td>' +
				'<td class="responseFolder-perm-item-requestSpecialPerms" title="Request special permissions?" nowrap>' + requestSpecialPerms + '</td>' +
				'<td class="responseFolder-perm-item-responseSpecialPerms" title="Response special permissions?" nowrap>' + hasSpecialPerms + '</td>' +
				'<td class="responseFolder-perm-item-specialPerms" title="Response folder special permissions" nowrap>' + responseSpecialPerms + '</td>' +
				'<td class="responseFolder-perm-item-perms" title="Folder permissions" nowrap>' + perms + '</td>' +
			'</tr>';
		}
		
		$("#tblResponseFolderPermissions tbody").append( sTablePermissionsBody );
		
		$("#tblResponseFolderPermsTotal").text( m_arrResponseFolders.length );
		
		if( errorCount > 0 )
		{
			var errorMsg1 = m_fnGetErrorMsg(arrErrorRequestNoSpecialPerms, "These Response Folders have Special Permisions, but their Requests do not");
			var errorMsg2 = m_fnGetErrorMsg(arrErrorResponseHasSpecialPerms , "These Response Folders have Special Permisions, but their Reponse Status is NOT '4-Approved for QA' or '7-Closed'");
			var errorMsg3 = m_fnGetErrorMsg(arrErrorResponseActionOfficeNotInRequest, "These Response Folders have an Action Office that is not specified in the Request's Action Offices");

			$("#divErrorMsg").html( $("#divErrorMsg").html() + "<div style='padding-bottom:5px;'><fieldset><legend>Response Folder Permissions</legend><span class='ui-icon ui-icon-alert'></span>There are (" + errorCount + ") Response Folders with Permission issues detected." + errorMsg1 + errorMsg2 + errorMsg3 + "</fieldset></div>");
		}
	}

	function m_fnGetErrorMsg( arr, msgTitle )
	{
		var errorMsg = "";
		if( arr.length > 0 )
		{
			errorMsg = "<div style='padding-bottom:5px;'>" + msgTitle  + "<ul>";
			for( var x = 0; x < arr.length; x++ )
			{
				errorMsg += "<li>" + arr+ "</li>";
			}
			errorMsg += "</ul></div>";
		}
		return errorMsg;
	}

	function m_fnLoadPermsOnItem( item, oListItem )
	{
		item ["UserPermissions"] = new Array();
		item ["GroupPermissions"] = new Array();

		item ["arrUserPermissions"] = new Array();
		item ["arrGroupPermissions"] = new Array();
		
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
				
				item[ permissionType ].push(rdName + " - " + memberTitleName);
				
				var pmObject = new Object();
				pmObject.name = memberTitleName;
				pmObject.permissionLevel = rdName;
				
				item[ "arr" + permissionType ].push( pmObject );
			}			
		}
		
		var perms = "";
		for( var z = 0; z < item.UserPermissions.length; z++ )
			perms += "<div style='white-space:nowrap'>" + item.UserPermissions[z] + "</div>";
		for( var z = 0; z < item.GroupPermissions.length; z++ )
			perms += "<div style='white-space:nowrap'>" + item.GroupPermissions[z] + "</div>";
			
		var specialPerms = false;
		if( perms.indexOf( Audit.Common.Utilities.GetGroupNameSpecialPerm1() ) >= 0 && perms.indexOf( Audit.Common.Utilities.GetGroupNameSpecialPerm2() ) >= 0 )
		{
			specialPerms = true;
		}
		
		if( perms != "" )
			perms = "<div class='permsLink' style='cursor:pointer' title='Click to view' ><a href='javascript:void(0)'>View</a><div class='permsInfo collapsed'>" + perms + "</div></div>";
		item ["permissionsDisplay"] = perms;
		item ["hasSpecialPermissions"] = specialPerms;
	}
	
	function m_fnBindHandlerPermissionLinks()
	{
		$(".permsLink").click( function()
		{		
			 $(this).find(".permsInfo").toggleClass( "collapsed" ); 
		});
	}

	function m_fnDisplaySPGroupPermissions( itemCollection )
	{
		var arrGroups = new Array();
		var listEnumerator = itemCollection.getEnumerator(); 
		while (listEnumerator.moveNext()) 
		{ 
			var item = listEnumerator.get_current(); 
			groupName = item.get_title(); 			
			groupName = $.trim(groupName);
			groupID = item.get_id();

			var arrPerms = new Array();
			var listEnumerator1 = item.get_users().getEnumerator(); 
			while (listEnumerator1.moveNext()) 
			{
				 var item1 = listEnumerator1.get_current();							 
				 var displayName = item1.get_loginName();
				 arrPerms.push( displayName );
			}
			
			arrPerms.sort();						
			var users = "";
			for( var g = 0; g < arrPerms.length; g++ )
			{
				 users += arrPerms[g] + "; ";							 
			}

			var oGroup = new Object();
			oGroup["Title"] = groupName;
			oGroup["ID"] = groupID;
			oGroup["Users"] = users;
			arrGroups.push( oGroup );
		} 
			
		var aos = Audit.Common.Utilities.GetActionOffices();
		var output = "";	
		var aoCnt = 0;
		for( var x = 0; x < aos.length; x ++ )
		{
			var actionOfficeName = aos[x].title;
			if( actionOfficeName.indexOf("Select Action") > 0 )
				continue;
			
			aoCnt ++;	
			
			var groupName = aos[x].userGroup;
			var groupId = "";
			var perms = "";
			
			for( var y = 0; y < arrGroups.length; y++ )
			{
				if( arrGroups[y].Title == groupName )
				{
					groupId = arrGroups[y].ID;
					perms = arrGroups[y].Users;
					break;
				}
			}
			
			output += "<tr class='trGroup'><td class='removeOnExport'><input class='cbAO' id='cbAO" + x + "' type='checkbox' style='cursor: pointer;'></td><td class='actionOfficeName'>" + actionOfficeName + "</td><td class='groupName' style='white-space:nowrap'><a href='javascript:void(0)' onclick='Audit.Permissions.Report.ViewSitePermissionsGroup(\"" + groupId + "\",\"" + groupName + "\")'>" + groupName + "</a></td><td class='groupPerms' id='groupPerms" + x +"' >" + m_fnGetFriendlyUsers( perms ) + "</td></tr>";
		}

		if( arrGroups.length == 0 )
		{
			output = "<div>0 Site Groups found</div>";
		}
		else if( aos.length == 0 )
		{
			output = "<div>0 Action Groups found</div>";
		}
		else
		{
			$("#fbody").html( output );
			$("#spanTotalAOS").text( aoCnt );
		}
	}

	function m_fnFormatEmailBodyToAOForVerification ( m_txtOutgoingEmailText, group, users )
	{
		var emailText = m_txtOutgoingEmailText + "<br/>" + 
						"Please verify the following users for <b>" + group + "</b><br/>" +
						"<div>" + users  + "</div>"; 
		
		return emailText;
	}


	var m_emailCount = 0;
	function m_fnGetVerification()
	{
		m_txtOutgoingEmailText = "";
		
		var aos = "";
    	$(".trGroup").each(function() 
		{							
			var cb = $(this).find("input");
			if( cb && cb.is(':checked'))
			{
				var group = $.trim( $(this).find(".groupName").text() );
				if( group != null && group != "" )
					aos += "<li>" + group + "</li>";
			}
		});
		
		if( aos == "" )
		{
			notifyId = SP.UI.Notify.addNotification("Please select an Action Office", false);																	
			return;
		}
		else
		{
			aos = "<ul style='color:green'>" + aos + "</ul>";
		}

		var verificationDocDlg = "<div id='verificationDocDlg' style='padding:20px; height:100px'><div style='padding:20px; width:600px'>Are you sure you would like to Email the following Action Offices for Verification?<p style='padding-top:10px'>" + aos + "</p> <p style='padding-top:10px'>If so, please specify any Custom Message to Append to the Outgoing Email Text: </p><p><input id='txtOutgoingEmailText' maxlength='300' size='100' onkeyup='Audit.Permissions.Report.GetEmailText()'></input></p></span></div>" + 	
		"<table style='padding-top:10px; width:400px; margin:0px auto'>" + 
			"<tr><td><input id='btnClientOk1' type='button' class='ms-ButtonHeightWidth' value='Yes Send Email' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK)'/></td>" + 
			"<td class='ms-separator'>&#160;</td><td><input id='btnCancel' type='button' class='ms-ButtonHeightWidth' value='Close' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)'/></td></tr>" + 
		"</table></div>";
		
		$('body').append( verificationDocDlg );
		
		var options = SP.UI.$create_DialogOptions();	
		options.title = "Email Action Office for User Verification";
		options.dialogReturnValueCallback = OnCallbackSendVerification;
		options.html = document.getElementById("verificationDocDlg");
		SP.UI.ModalDialog.showModalDialog(options);
	}
	
	function OnCallbackSendVerification(result, value)
	{
		if (result === SP.UI.DialogResult.OK) 
		{		
			m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose("Sending Emails", "Please wait... Sending Emails", 200, 400);

			setTimeout( function(){ m_fnSendVerificationEmails();}, 1000 );			
		}
	}
	
	function m_fnSendVerificationEmails()
	{
		var currCtx = new SP.ClientContext.get_current();
		var web = currCtx.get_web();

		var emailList = web.get_lists().getByTitle( Audit.Common.Utilities.GetListTitleEmailHistory() );
		var emailListQuery = new SP.CamlQuery();	
		emailListQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>');
		emailListFolderItems = emailList.getItems( emailListQuery );
		currCtx.load( emailListFolderItems, 'Include(ID, FSObjType, Title, DisplayName)');

		function OnSuccess(sender, args) 
	    {
	    	//document.body.style.cursor = 'wait';

			if( !Audit.Common.Utilities.CheckIfEmailFolderExists( emailListFolderItems, m_emailFolderName ) )
	    	{
	    		Audit.Common.Utilities.CreateEmailFolder( emailList, m_emailFolderName, null);
	    	}
	    	
	    	m_emailCount = 0;
	    	$(".trGroup").each(function() 
			{							
				var cb = $(this).find("input");
				if( cb && cb.is(':checked'))
				{
					var group = $.trim( $(this).find(".groupName").text() );
					if( group != null && group != "" )
						m_emailCount++;
				}
			});

			if( m_emailCount == 0 )
			{
				notifyId = SP.UI.Notify.addNotification("Please select an Action Office", false);																	
				//document.body.style.cursor = 'default';
				m_waitDialog.close();
			}

			var cnt = 0;
			$(".trGroup").each(function() 
			{	
				var cb = $(this).find("input");
				var aoName = $.trim( $(this).find(".actionOfficeName").text() );
				var group = $.trim( $(this).find(".groupName").text() );
				var users = $.trim( $(this).find(".groupPerms").html() );
						
				if( cb && cb.is(':checked') && group != null && group != "" )
				{				
					var emailSubject = "Please review the Audit Tool users for (" + group + ")";	
					var emailText = m_fnFormatEmailBodyToAOForVerification ( m_txtOutgoingEmailText, group, users  );	
					var itemCreateInfo = new SP.ListItemCreationInformation();
				    itemCreateInfo.set_folderUrl(location.protocol + "//" + location.host + Audit.Common.Utilities.GetSiteUrl() + "/Lists/" + Audit.Common.Utilities.GetListNameEmailHistory() + "/" + m_emailFolderName);				    
				    oListItemEmail = emailList.addItem( itemCreateInfo );
				    oListItemEmail.set_item('Title', emailSubject );
				    oListItemEmail.set_item('Body', emailText );
				    oListItemEmail.set_item('To', group );
	  				oListItemEmail.set_item('NotificationType', "AO Verification" );
				    oListItemEmail.update();
					
					currCtx.executeQueryAsync
					(
						function () 
						{	
							cnt++;
							if( cnt == m_emailCount)
							{
								m_waitDialog.close();
								//document.body.style.cursor = 'default';
								notifyId = SP.UI.Notify.addNotification("Completed Sending Email Verifications", false);	
								
								m_fnUncheckCheckboxes();
								//m_fnViewEmailHistoryFolder();																
							}
						}, 
						function (sender, args) 
						{
							//document.body.style.cursor = 'default';
							m_waitDialog.close();
							alert( "Request failed: "  + args.get_message() + "\n" + args.get_stackTrace() );
							m_fnRefresh();
						}
					);	
				}
			});
	    }
		function OnFailure(sender, args)
		{
			m_waitDialog.close();
		}		
		
		currCtx.executeQueryAsync(OnSuccess, OnFailure);

	}
	
	function m_fnCheckCheckboxes()
	{
		$("#linkGetVerification").removeAttr("disabled");
		
		$(".trGroup").each(function() 
		{							
			var cb = $(this).find("input");
			if( cb && !cb.is(':checked'))
			{
				cb.prop('checked', true);
			}
		});
	}

	function m_fnUncheckCheckboxes()
	{
		$("#linkGetVerification").attr("disabled", "disabled");
		
		$(".trGroup").each(function() 
		{							
			var cb = $(this).find("input");
			if( cb && cb.is(':checked'))
			{
				cb.prop('checked', false);
			}
		});
	}
	
	function m_fnGetFriendlyUsers( perms )
	{
		if( perms == null || perms == "" )
			return "";
			
		var permArr = perms.split(";");
		permArr = permArr.sort();
		var output = "<ul>";
		for( var x = 0; x < permArr.length; x ++ )
		{
			if( permArr[x] != null && $.trim(permArr[x]) )
			{
				output += "<li>" + permArr[x] + "</li>";
			}
		}
		output += "</ul>";
		return output;
	}
	/*function m_fnDisplaySPGroupPermissions( itemCollection )
	{
		var arrGroups = new Array();
		var listEnumerator = itemCollection.getEnumerator(); 
		while (listEnumerator.moveNext()) 
		{ 
			var item = listEnumerator.get_current(); 
			groupName = item.get_title(); 			
			groupName = $.trim(groupName);
			groupID = item.get_id();

			var arrPerms = new Array();
			var listEnumerator1 = item.get_users().getEnumerator(); 
			while (listEnumerator1.moveNext()) 
			{
				 var item1 = listEnumerator1.get_current();							 
				 var displayName = item1.get_loginName();
				 arrPerms.push( displayName );
			}
			
			arrPerms.sort();						
			var users = "";
			for( var g = 0; g < arrPerms.length; g++ )
			{
				 users += arrPerms[g] + "; ";							 
			}

			var oGroup = new Object();
			oGroup["Title"] = groupName;
			oGroup["ID"] = groupID;
			oGroup["Users"] = users;
			arrGroups.push( oGroup );
		} 
			
		var output = "<table id='table_Groups' class='tablesorter' style='width:800px'><thead><tr><th>SharePoint Group Name</th><th>Users</th></tr></thead><tbody id='fbody'>";
		
		for( var x = 0; x < arrGroups.length; x++ )
		{
			var groupName = arrGroups[x].Title;
			var groupId = arrGroups[x].ID;
			var perms = arrGroups[x].Users;
			
			output += "<tr><td class='groupName' style='white-space:nowrap'><a href='javascript:void(0)' onclick='Audit.Permissions.Report.ViewSitePermissionsGroup(\"" + groupId + "\",\"" + groupName + "\")'>" + groupName + "</a></td><td id='groupPerms" + x +"' >" + perms + "</td></tr>";
		}
		output += "</tbody><tfoot><tr><th colspan = '3' style='text-align:left;white-space:nowrap'>Total: " + arrGroups.length + "</th></tr></tfoot></table>";
		
		if( arrGroups.length == 0 )
		{
			output = "<div>0 Groups found</div>";
		}
		
		$("#divTblOutput").html( output );
	}*/

	function LoadDDOptions()
	{					
		var arrResponseRequestID = new Array();
		var arrResponseTitle = new Array();
		
		$(".request-perm-item-number").each(function()
		{
			var val = $(this).text();
			if( !Audit.Common.Utilities.ExistsInArr( arrResponseRequestID, val ))
				arrResponseRequestID.push(val);
		});
		
		$(".response-perm-item-title").each(function()
		{
			var val = $(this).text();
			if( !Audit.Common.Utilities.ExistsInArr( arrResponseTitle , val ))
				arrResponseTitle .push(val);
		});
		
		Audit.Common.Utilities.AddOptions(arrResponseRequestID, "#ddlResponseRequestID", false);
		Audit.Common.Utilities.AddOptions(arrResponseTitle , "#ddlResponseFolderResponseID", false);
	}
	
	function m_fnGoToRequest( requestNumber )
	{
		notifyId = SP.UI.Notify.addNotification("Displaying Request (" + requestNumber + ")", false);

		$("#ddlResponseRequestID").val( requestNumber ).change();

		$('#tabs').tabs({ active: 1 });	
	}
	
	function m_fnGoToResponse( responseTitle )
	{
		notifyId = SP.UI.Notify.addNotification("Displaying Response (" + responseTitle + ")", false);

		$("#ddlResponseFolderResponseID").val( responseTitle ).change();

		$('#tabs').tabs({ active: 2 });	
	}


	function m_fnBindHandlersOnLoad()
	{
		m_fnBindPrintButton("#btnPrint", "#divTblOutput");

		/**Note: for the export to work, make sure this is added to the html: <iframe id="CsvExpFrame" style="display: none"></iframe>**/
		m_fnBindExportButton(".export", "GroupPermissions_", "table_Groups");

		m_fnBindHandlerPermissionLinks();


		$( "#ddlRequestID" ).change(function()
		{
			$("#ddlResponseRequestID").val( $(this).val());
			
			setTimeout( function(){ FilterRequests();}, 10 );
		});

		$( "#ddlResponseRequestID" ).change(function()
		{
			$("#ddlRequestID").val( $(this).val());
			
			setTimeout( function(){ FilterRequests();}, 10 );
		});
		
		$( "#ddlResponseFolderResponseID" ).change(function()
		{
			setTimeout( function(){ FilterResponses();}, 10 );
		});
		
		$("#linkViewAO").click(function()
		{
			m_fnViewAOs();
		});
		$("#linkAddAO").click(function()
		{
			m_fnAddAO();
		});
		
		$("#linkUploadPermissions").click(function()
		{
			m_fnUploadPermissions();
		});

		$("#linkGetVerification").click(function()
		{
			 m_fnGetVerification();
		});
		
		$("#linkEmailHistory").click(function()
		{
			m_fnViewEmailHistoryFolder();
		});
		
		$("#linkViewExportFriendly").click(function()
		{
			$(".removeOnExport").toggle();
			
			$(".groupPerms").each(function()
			{
				if( $(this).html().toLowerCase().indexOf("<ul>") >= 0 )
				{
					var friendlyNames = "";

					$(this).find("LI").each(function()
					{
						friendlyNames += $(this).text() + ";";
					});
					
					$(this).html( friendlyNames );
				}
			});
		});
		
		$("#cbAOAll").click(function()
		{
			if( $(this).is(':checked'))
				m_fnCheckCheckboxes();
			else
				m_fnUncheckCheckboxes();
		});
		
		$(".cbAO").click(function()
		{
			var count = 0;
			$(".cbAO").each(function() 
			{							
				if( $(this).is(':checked'))
				{
					count++;
					return;
				}
			});

			if( count > 0 )
				$("#linkGetVerification").removeAttr("disabled");
			else
				$("#linkGetVerification").attr("disabled", "disabled");
		});
	}
	
	function m_fnViewAOs()
	{
		var options = SP.UI.$create_DialogOptions();	
		options.title = "View Action Office Details";
		//options.height = "800";
		options.autoSize = true;
		options.dialogReturnValueCallback = OnCallbackForm;
		
		options.url = Audit.Common.Utilities.GetSiteUrl() + "/lists/" + Audit.Common.Utilities.GetListNameActionOffices();	

		SP.UI.ModalDialog.showModalDialog(options);
	}
	
	function m_fnAddAO()
	{		
		var formName = "NewForm.aspx";
		var options = SP.UI.$create_DialogOptions();	
		options.title = "Add Action Office";
		//options.height = "800";
		options.autoSize = true;
		options.dialogReturnValueCallback = OnCallbackForm;
		
		options.url = Audit.Common.Utilities.GetSiteUrl() + "/lists/" + Audit.Common.Utilities.GetListNameActionOffices() + "/" + formName ;	

		SP.UI.ModalDialog.showModalDialog(options);
	}

	//Captures the values from all of the drop downs and uses them to filter the rows
	function FilterRequests() 
	{		
		var requestID = $("#ddlRequestID").val();
			
		//each row in the data form web part is marked with this class; it iterates through each to find the containing class to see if it matches
		//the value that has been selected in the drop down
		$(".request-perm-item").each(function() 
		{			
			var hide = false;
			
			if( !hide && requestID != "" && $.trim( $(this).find(".request-perm-item-number").text() ) != requestID )
			{
				hide = true;
			}		
			
			if( hide )
				$(this).hide();
			else
				$(this).show();		
		});

		//each row in the data form web part is marked with this class; it iterates through each to find the containing class to see if it matches
		//the value that has been selected in the drop down
		$(".response-perm-item").each(function() 
		{			
			var hide = false;
			
			if( !hide && requestID != "" && $.trim( $(this).find(".response-perm-item-number").text() ) != requestID )
			{
				hide = true;
			}		
			
			if( hide )
				$(this).hide();
			else
				$(this).show();		
		});
	}

	//Captures the values from all of the drop downs and uses them to filter the rows
	function FilterResponses() 
	{		
		var responseTitle = $("#ddlResponseFolderResponseID").val();
			
		//each row in the data form web part is marked with this class; it iterates through each to find the containing class to see if it matches
		//the value that has been selected in the drop down
		$(".responseFolder-perm-item").each(function() 
		{			
			var hide = false;
			
			if( !hide && responseTitle != "" && $.trim( $(this).find(".responseFolder-perm-item-title").text() ) != responseTitle)
			{
				hide = true;
			}		
			
			if( hide )
				$(this).hide();
			else
				$(this).show();		
		});
	}
	
	function m_fnBindPrintButton(btnPrint, divTbl)
	{
		var pageTitle = 'Audit Site Group Permissions (SharePoint Site)';
		$( btnPrint ).on("click", function(){ PrintPage(pageTitle , divTbl); });
	}
	
	function m_fnBindExportButton(btnExport, fileNamePrefix, tbl)
	{
		$(btnExport).on('click', function (event) 
		{
			var curDate = new Date().format("yyyyMMdd");
       		ExportToCsv(fileNamePrefix + curDate, tbl);
	    });
	}
	
	//This function will grab the html from the container var to display in a new window. 
	//It also loads the css files that are on the current page and appends it to the output that is displayed in a new window to maintain the styles
	function PrintPage(title, container)
	{
		var curDate = new Date();
		var cssLink1 = Audit.Common.Utilities.GetSiteUrl() + "/siteassets/css/tablesorter/style.css?v=" + curDate.format("MM_dd_yyyy");
		var cssLink2 = Audit.Common.Utilities.GetSiteUrl() + "/siteassets/css/Audit_Styles.css?v=" + curDate.format("MM_dd_yyyy");
		var cssLink3 = Audit.Common.Utilities.GetSiteUrl() + "/siteassets/css/Audit_Page_Reports.css?v=" + curDate.format("MM_dd_yyyy");
	
	 	var divOutput = $(container).html();
		 
	 	var printDateString = curDate.format("MM/dd/yyyy hh:mm tt");
	 	printDateString = "<div style='padding-bottom:10px;'>" + printDateString + "</div>";	
		divOutput = printDateString + divOutput;
		
		var cssFile1 = $('<div></div>');
		var cssFile2 = $('<div></div>');
		var cssFile3 = $('<div></div>');
		
		var def1 = $.Deferred();
   		var def2 = $.Deferred();
   		var def3 = $.Deferred();
   		
   		var cssFileText = "";
   		cssFile1.load( cssLink1, function() { cssFileText += "<style>" + cssFile1.html() + "</style>"; def1.resolve()} );
		cssFile2.load( cssLink2, function() { cssFileText += "<style>" + cssFile2.html() + "</style>"; def2.resolve()} );
		cssFile3.load( cssLink3, function() { cssFileText += "<style>" + cssFile3.html() + "</style>"; def3.resolve()} );

		$.when(def1, def2, def3).done(function(){
	
		 	var html = "<HTML>\n" + 
		 		"<HEAD>\n\n"+  
					"<Title>" + title + "</Title>\n" + 
					cssFileText + "\n" +
					"<style>"+
						".hideOnPrint {display:none}"+
					"</style>\n"+
				"</HEAD>\n" + 
				"<BODY>\n" + divOutput + "\n" +"</BODY>\n" + 
				"</HTML>";  
		
		
		 	var printWP = window.open("","printWebPart");
		    printWP.document.open();
		    //insert content
		    printWP.document.write(html);
		    	
		    printWP.document.close();
		     //open print dialog
		    printWP.print();
   		});	    
	}
	//make sure iframe with id csvexprframe is added to page up top
	//http://stackoverflow.com/questions/18185660/javascript-jquery-exporting-data-in-csv-not-working-in-ie
	function ExportToCsv(fileName, tableName, removeHeader) 
	{
		var data = GetCellValues(tableName);
		if( removeHeader == true )
			data = data.slice(1);
		
		var csv = ConvertToCsv(data);
		if (navigator.userAgent.search("Trident") >= 0) 
		{
			window.CsvExpFrame.document.open("text/html", "replace");
			window.CsvExpFrame.document.write(csv);
			window.CsvExpFrame.document.close();
			window.CsvExpFrame.focus();
			window.CsvExpFrame.document.execCommand('SaveAs', true, fileName + ".csv");
		} 
		else 
		{
			var uri = "data:text/csv;charset=utf-8," + escape(csv);
			var downloadLink = document.createElement("a");
			downloadLink.href = uri;
			downloadLink.download = fileName + ".csv";
			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);
		}
	};

	function GetCellValues(tableName) 
	{
		var table = document.getElementById( tableName );
		
		var tableArray = [];
		for (var r = 0, n = table.rows.length; r < n; r++) 
		{
			tableArray[r] = [];
			for (var c = 0, m = table.rows[r].cells.length; c < m; c++) 
			{
				var text = table.rows[r].cells[c].textContent || table.rows[r].cells[c].innerText;
				tableArray[r][c] = text.trim();
			}
		}
		return tableArray;
	}
	
	function ConvertToCsv(objArray) 
	{
		var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
		var str = "sep=,\r\n";
		var line = "";
		var index;
		var value;
		for (var i = 0; i < array.length; i++) 
		{
			line = "";
			var array1 = array[i];
			for (index in array1) 
			{
				if (array1.hasOwnProperty(index)) 
				{
					value = array1[index] + "";
					line += "\"" + value.replace(/"/g, "\"\"") + "\",";
				}
			}
			line = line.slice(0, -1);
			str += line + "\r\n";
		}
		return str;
	};
	
	function m_fnViewSitePermissionsGroup( groupID, groupName  ) 
	{		
		
		var options = SP.UI.$create_DialogOptions();	
		options.title = "View Site Permissions on Group " + groupName;
		options.dialogReturnValueCallback = OnCallbackFormAutoRefresh;
		
		//pass in request number so that the list form knows it came from the IA db and prevents saves otherwise
		options.url = Audit.Common.Utilities.GetSiteUrl() + "/_layouts/people.aspx?MembershipGroupId=" + groupID;

		SP.UI.ModalDialog.showModalDialog(options);
	}
	
	function m_fnViewEmailHistoryFolder()
	{
		var options = SP.UI.$create_DialogOptions();	
		options.title = "View Email History";
		//options.height = "600";
		//options.width = "900";
		options.autoSize = true;
		options.dialogReturnValueCallback = OnCallbackForm;
		
		options.url = Audit.Common.Utilities.GetSiteUrl() + "/pages/AuditEmailHistory.aspx?RootFolder=" + Audit.Common.Utilities.GetSiteUrl() + "/Lists/"+ Audit.Common.Utilities.GetListNameEmailHistory() + "/" + m_emailFolderName;	
		
		SP.UI.ModalDialog.showModalDialog(options);
	}

	function m_fnUploadPermissions()
	{
		m_bIsTransactionExecuting = true;
		
		var options = SP.UI.$create_DialogOptions();	
		options.title = "Upload Permissions";
		options.height = "800";
		options.autoSize = true;
		options.dialogReturnValueCallback = OnCallbackForm;
		
		options.url = Audit.Common.Utilities.GetSiteUrl() + "/pages/AuditUpdateSiteGroups.aspx";	

		SP.UI.ModalDialog.showModalDialog(options);
	}

	function OnCallbackFormAutoRefresh(result, value)
	{
		m_fnRefresh();
	}
	
	function OnCallbackForm(result, value)
	{
		if (result === SP.UI.DialogResult.OK) 
		{
			m_fnRefresh();
		}
	}

	var publicMembers = 
	{
		GoToRequest: function(requestNum){ m_fnGoToRequest(requestNum); },
		GoToResponse: function(responseTitle){ m_fnGoToResponse(responseTitle); },
		ViewSitePermissionsGroup: function(groupID, groupName){ m_fnViewSitePermissionsGroup(groupID, groupName); },
		GetEmailText: function(){ 
			m_txtOutgoingEmailText = $("#txtOutgoingEmailText").val(); 
			/*if( $.trim(m_txtOutgoingEmailText) == "" )
				$("#btnClientOk1").attr("disabled","disabled");
			else
				$("#btnClientOk1").removeAttr("disabled");*/
			return m_txtOutgoingEmailText ;
		},
		Refresh: m_fnRefresh
	}
	
	return publicMembers;
}
