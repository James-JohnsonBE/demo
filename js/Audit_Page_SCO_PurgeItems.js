var Audit = window.Audit|| {};
Audit.AuditSitePurge = Audit.AuditSitePurge|| {};

$(document).ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', ExecuteOrDelayUntilScriptLoaded(InitAuditSitePurge, "sp.js"));

})	

function InitAuditSitePurge() 
{    
	Audit.AuditSitePurge.Purger = new Audit.AuditSitePurge.Load();
	Audit.AuditSitePurge.Init();
}

Audit.AuditSitePurge.Init = function()
{
	$("#btnLoadLib").click(function()
	{
		Audit.AuditSitePurge.Purger.LoadLib();
	});
}

Audit.AuditSitePurge.Load = function ()
{	
	var m_libraryName = "";
	var m_libraryType = null;
	var m_bRunTest = true;
	var m_cntr = 0;
	var m_cntrFailed = 0;
	var m_siteUrl = _spPageContextInfo.webServerRelativeUrl; //IE11 in sp 2013 does not recognize L_Menu_BaseUrl
	
	function m_fnLoadLib()
	{		
		m_libraryName = $("#tbLibName").val();
		
		$("#divMsgLoading").show();			
		$("#divTblOutput").html("");
		$("#divCntrOutput").html("");

		if( m_libraryName == null || $.trim(m_libraryName) == "" )
		{
			notifyId = SP.UI.Notify.addNotification("Please Specify a library name.", false);
			return;
		}
				
		var currCtx = new SP.ClientContext.get_current();
		var web = currCtx.get_web();
		
		list = currCtx.get_web().get_lists().getByTitle( m_libraryName );
		currCtx.load(list, 'Title', 'Id', 'BaseType');
		
		function OnSuccess(sender, args)
		{	
			m_libraryType = list.get_baseType();
			PrintTable();			
		}		
		function OnFailure(sender, args)
		{
			notifyId = SP.UI.Notify.addNotification("Request failed: "  + args.get_message() + "\n" + args.get_stackTrace(), false);
			$("#divMsgLoading").hide();			
		}
		currCtx.executeQueryAsync(OnSuccess, OnFailure);	
	}
	
	function PrintTable()
	{
		var output = "<table id='table_Libraries' class='tablesorter'><thead><tr><th>Library Name</th><th>Action</th></tr></thead><tbody id='fbody'>";
		
		if( m_libraryName != null && $.trim( m_libraryName ) != "" )
		{
			var title = m_libraryName;
			
			var libLink = FormatLibraryLink(title);
			var testLink = FormatPurgeLibraryLink(title, 0);
			var deleteLink = FormatPurgeLibraryLink(title, 1);
				
			if( libLink != null )
				output += "<tr><td>" + libLink + "</td><td>" + testLink + deleteLink + "</td></tr>";
			else
				output += "<tr><td colspan='2'>Cannot purge this type of list</td></tr>";
				
			output += "</tbody></table>";
		}
		else
		{
			output = "<div>Please provide the List or Library name</div>";
		}
		
		$("#divMsgLoading").hide();	
		$("#divTblOutput").html(output);		
	}
	
	function m_fnPurgeLibrary( libraryName, type ) 
	{
		//used in callback
		m_libraryName = libraryName;
		if( type == 0 )
			m_bRunTest = true;
		else 
			m_bRunTest = false;
		
		if( m_bRunTest )
			PurgeLibrary();
		else
		{
			var purgeLibraryRequestDlg = "<div id='purgeLibraryRequestDlg' style='padding:20px; height:100px; width:700px;'><div style='padding:20px;'><fieldset><legend style='color:red'>Attention</legend><p style='padding-top:10px;padding-bottom:10px;color:red; font-weight:bold; font-size:10pt'>Note: This Action is Unrecoverable and items will NOT be retrievable from the Recyle Bin.</p><span style='color:red; font-weight:bold;'>Are you sure you would like to PERMANENTLY PURGE all items from this list/library?</span><p><b><ul><li>" + libraryName + "</li></ul></b></p></span></fieldset></div>" + 	
				"<table style='padding-top:10px; width:200px; margin:0px auto'>" + 
					"<tr><td><input id='btnClientOk1' type='button' class='ms-ButtonHeightWidth' value='Yes, PURGE Items' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK)'/></td>" + 
					"<td class='ms-separator'>&#160;</td><td><input id='btnCancel' type='button' class='ms-ButtonHeightWidth' value='Close' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)'/></td></tr>" + 
				"</table></div>";
			
			$('body').append( purgeLibraryRequestDlg);
			
			var options = SP.UI.$create_DialogOptions();	
			options.title = "Purge Items";
			options.dialogReturnValueCallback = OnCallbackPurgeLibrary;
			options.html = document.getElementById("purgeLibraryRequestDlg") ;
			SP.UI.ModalDialog.showModalDialog(options);
		}
	}

	function OnCallbackPurgeLibrary(result, value)
	{
		if (result === SP.UI.DialogResult.OK) 
		{	
			PurgeLibrary();		
		}
	}
	
	function PurgeLibrary()
	{
		m_cntr = 0;
		m_cntrFailed = 0;
		
		$(".libPurgeLink").hide();
					
		var currCtx = SP.ClientContext.get_current();
		var oList = currCtx.get_web().get_lists().getByTitle( m_libraryName );
		
	    var libQuery = new SP.CamlQuery();
	    libQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title" Ascending="TRUE"/></OrderBy></Query></View>');
	    libItems = oList.getItems( libQuery );
		currCtx.load(libItems,'Include(Title, ID)');
		
		document.body.style.cursor = 'wait';
		
		function OnSuccess(sender, args) 
	    {   			    
	    	var listItemEnumerator = libItems.getEnumerator();
	    	
	    	var itemCount = libItems.get_count();
	    	if( m_bRunTest )
		    {
		    	$("#divCntrOutput").html("<span style='color:green'><b>(" +  itemCount + ")</b> top-level items found in <b>" + m_libraryName + "</b></span>");
		    	$(".libPurgeLink").show();
		    	document.body.style.cursor = 'default';
		    	return;
		    }
		    
		    if( itemCount == 0 )
		    {
		    	$("#divCntrOutput").html("<span style='color:green'>Purged <b>(" +  m_cntr + ")</b> top-level items from <b>" + m_libraryName + "</b></span>");
				SP.UI.Notify.addNotification("The list/library has been purged of <b>" +  m_cntr + "</b> items", false);
		    	$(".libPurgeLink").show();
		    	document.body.style.cursor = 'default';
		    	return;
		    }
		   	
		   	$("#btnLoadLib").hide();
		   	$(".libPurgeLink").hide();
		   	
			while(listItemEnumerator.moveNext())
			{
				var oListItem = listItemEnumerator.get_current();
				var ID = oListItem.get_item('ID');
				//var ID = oListItem.get_id();
				var oListItemDel = oList.getItemById(ID);
				oListItemDel.deleteObject();
				
				
				function OnSuccess1(sender, args) 
	    		{  
	    			m_cntr++;
		    		$("#divCntrOutput").html("<span style='color:green'>Purged <b>(" +  m_cntr + ")</b> top-level items from <b>" + m_libraryName + "</b></span>");
		    		
		    		if( (m_cntr + m_cntrFailed) == libItems.get_count())
		    		{
		    			document.body.style.cursor = 'default';
						SP.UI.Notify.addNotification("The list/library has been purged of <b>" +  m_cntr + "</b> top-level items", false);
						
						if( m_cntrFailed > 0 )
						{
							var failureMsg = "There were " +  m_cntrFailed + " failures";
							SP.UI.Notify.addNotification(failureMsg , false);
							
							$("#divCntrOutput").html( $("#divCntrOutput").html() + "<div style='color:red'>" + failureMsg + "</div>" );
						}
		    		}
	    		}
				function OnFailure1(sender, args) 
	    		{  
	    			m_cntrFailed++;
	    			
		    		$("#divCntrOutput").html("<span style='color:green'>Purged <b>(" +  m_cntr + ")</b> top-level items from <b>" + m_libraryName + "</b></span>");
		    		
		    		if( (m_cntr + m_cntrFailed) == libItems.get_count())
		    		{
		    			document.body.style.cursor = 'default';
						SP.UI.Notify.addNotification("The list/library has been purged of <b>" +  m_cntr + "</b> top-level items", false);

						if( m_cntrFailed > 0 )
						{
							var failureMsg = "There were " +  m_cntrFailed + " failures";
							SP.UI.Notify.addNotification(failureMsg , false);
							
							$("#divCntrOutput").html( $("#divCntrOutput").html() + "<div style='color:red'>" + failureMsg + "</div>" );
						}
		    		}
	    		}
	    		
				currCtx.executeQueryAsync(OnSuccess1, OnFailure1);
			}			
	    }	
	    function OnFailure(sender, args) 
	    {      
			//$("#tr" + m_itemIdActuals).css('background-color', 'white');
	    	alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
	    }
	    
		currCtx.executeQueryAsync(OnSuccess, OnFailure);
	}

	function FormatLibraryLink( libraryName )
	{
		if( m_libraryType === SP.BaseType.documentLibrary )
			return "<a style='color:#0072bc' href='" + m_siteUrl + "/" + libraryName + "' target='_blank'>" + libraryName + "</a>";
		else if(  m_libraryType === SP.BaseType.genericList )
			return "<a style='color:#0072bc' href='" + m_siteUrl + "/Lists/" + libraryName + "' target='_blank'>" + libraryName + "</a>";
		else
			return null;
	}
	
	function FormatPurgeLibraryLink( libraryName, isDelete )
	{
		var link = "";
		if( !isDelete )
			link = ' <a class="libPurgeLink" style="color: #0072bc !important;" href="javascript:void(0)" onclick="Audit.AuditSitePurge.Purger.PurgeLibrary(\'' + libraryName + '\', 0)" title="Click here to count the contents of this library"><span class="ui-icon ui-icon-info">Test Purge</span></a> ';
		else
			link = ' <a class="libPurgeLink" style="color: #0072bc !important;" href="javascript:void(0)" onclick="Audit.AuditSitePurge.Purger.PurgeLibrary(\'' + libraryName + '\', 1)" title="Click here to purge this library"><span class="ui-icon ui-icon-trash">Purge</span></a> ';
		return link;
	}
	
	var publicMembers = 
	{
		LoadLib: m_fnLoadLib,
		PurgeLibrary : function(title, type){ m_fnPurgeLibrary(title, type); } 
	}
	
	return publicMembers;
}
