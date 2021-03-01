"use strict";

var Audit = window.Audit|| {};
Audit.AuditSiteUpdateGroups = Audit.AuditSiteUpdateGroups || {};

ExecuteOrDelayUntilScriptLoaded(InitAuditSiteUpdateGroups, "sp.js");	

function InitAuditSiteUpdateGroups() 
{    
	Audit.AuditSiteUpdateGroups.UpdateGroups = new Audit.AuditSiteUpdateGroups.Load();
	Audit.AuditSiteUpdateGroups.Init();
}

Audit.AuditSiteUpdateGroups.Init = function()
{
}

Audit.AuditSiteUpdateGroups.Load = function ()
{	
	var m_arrGroupNames = new Array();
	var m_siteUrl = _spPageContextInfo.webServerRelativeUrl; //IE11 in sp 2013 does not recognize L_Menu_BaseUrl

	var m_arrRows = new Array();
	var m_arrErrors = new Array();
	var m_arrGroups = new Array();
	
	LoadSiteGroups();
	
	function LoadSiteGroups()
	{
		var currCtx = new SP.ClientContext.get_current();
		var web = currCtx.get_web();
		collGroup = currCtx.get_web().get_siteGroups();
	    currCtx.load(collGroup);
	   	currCtx.load(collGroup, "Include(Users)")
	    
		currCtx.executeQueryAsync(OnSuccess, OnFailure);
		
		function OnSuccess(sender, args)
		{
			m_arrGroups = new Array();
			var listEnumerator = collGroup.getEnumerator(); 
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
					 arrPerms.push(displayName);
				}
				
				arrPerms.sort();						
				var users = "";
				for( var g = 0; g < arrPerms.length; g++ )
				{
					 users += arrPerms[g] + ";";							 
				}

				var oGroup = new Object();
				oGroup["Title"] = groupName;
				oGroup["Users"] = users;
				oGroup["SPGroupID"] = groupID;
				m_arrGroups.push( oGroup );
			} 
			
			$("#divValidateButtons").show();
		}	
		function OnFailure(sender, args)
		{
			$("#divMsgLoading").hide();
			$("#divTblOutput").html("<div style='padding-top:10px;'>Unable to load</div>");
		}		
	}
		
	function ValidateRows()
	{
		$("#divValidation").hide();
		$("#tblRows").html("");
		$("#submittedRows").html("");
	
		m_arrErrors = new Array();
		m_arrRows = new Array();
		
		var rows = $("#inputRows").html();		
		var lines = $('textarea').val().split('\n');	
		var lineCount = 0;
		
		for(var i = 0; i < lines.length;i++)
		{
			var bAdded = false;
			
			var cellValue = lines[i].split("\t");
			
			if( cellValue.length == 2 )
			{	
				groupName = cellValue[0];
				groupPerms = cellValue[1];
				groupPerms = groupPerms.replace(/\s/g, "");

				var bFound = false;
				for( var x = 0; x < m_arrGroups.length; x++ )
				{
					var oSiteGroup = m_arrGroups[x]["Title"];
					if( oSiteGroup.toLowerCase() == groupName.toLowerCase())
					{
						var obj = new Object();
						obj["groupName"] = groupName;
						obj["newPerms"] = groupPerms;
						obj["curPerms"] = m_arrGroups[x]["Users"];
						obj["SPGroupID"] = m_arrGroups[x]["SPGroupID"];
						m_arrRows.push(obj);
						
						bAdded = true;
						break;
					}					
				}
				
				lineCount++;
			}
			if( !bAdded && $.trim(lines[i]) != "" )
			{
				m_arrErrors.push([i + 1, lines[i] ]);
				lineCount++;
			}	
		}
		
		PrintTableValidation(lineCount);	
	}
	
	function PrintTableValidation(lineCount)
	{
		$("#divValidation").show();
		$("#btnSubmit").hide();
	
		var errorOutput = "<table class='tablesorter report'><thead><tr><th colspan='2'>Removed lines with unexpected # of cells or data</th></tr><tr><th>Line #</th><th>Line value</th></tr></thead><tbody>";
		
		for( var x = 0; x < m_arrErrors.length; x++ )
		{	
			var linenumber = m_arrErrors[x][0];
			var lineval = m_arrErrors[x][1];
			errorOutput += "<tr><td style='text-align:left'>" + linenumber + "</td><td style='text-align:left'>" + lineval + "</td></tr>";
		}
		
		if( m_arrErrors.length > 0 )
		{
			errorOutput += "</tbody></table>";
			$("#tblErrors").html(errorOutput);
		}
		else
		{
			$("#tblErrors").html("");
		}
		

		var output = "<div style='padding-top:5px;'>Processed: " + lineCount + " lines</div><table class='tablesorter report'><thead><tr><th>Add?</th><th nowrap>Row #</th><th>Group Name</th><th>Current Users</th><th>Replace with these Users</th></tr></thead>"
		output += "<tr><td colspan='18' style='text-align:left'><input id='chboxSelectAll' type='checkbox' onClick='Audit.AuditSiteUpdateGroups.UpdateGroups.CheckAll()' > Check All?</td></tr><tbody>";

		for( var x = 0; x < m_arrRows.length; x++ )
		{
			var oRow = m_arrRows[x];
			
			var groupName = oRow["groupName"];
			var newPerms = oRow["newPerms"];				
			var curPerms = oRow["curPerms"];				
	
			newPerms = GetFriendlyUsers( newPerms );
			curPerms = GetFriendlyUsers( curPerms );
			
			var rownum = x + 1;	
	
			output += "<tr id='row_" + rownum + "'>" + 
			"<td>" + "<input type='checkbox' onclick='Audit.AuditSiteUpdateGroups.UpdateGroups.CBChanged(" + rownum + ")' id='cb_" + rownum + "' checked ></input></td>" + 
			"<td nowrap>" + rownum + "</td>" + 
			"<td nowrap><span>" + groupName + "</span></td>" + 
			"<td>" + curPerms + "</td>" + 
			"<td>" + newPerms + "</td>"; 
		}
		output += "</tbody></table>";
		
		if( m_arrRows.length > 0 )
		{
			$("#tblRows").html(output);
			$("#btnSubmit").show();
		}
		else
		{
			alert("0 lines were successfully translated. Please provide the input data");
		}
	}
	
	function GetFriendlyUsers( perms )
	{
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

	var m_CountToSubmit = 0;
	var m_CountSubmitted = 0;
	function SubmitRows()
	{
		$("#submittedRows").html("");
	
		if( m_arrRows.length == 0 )
		{
			alert("O records were provided");
			return;
		}
		
		if( confirm("Are you sure you would like to Update the selected Groups?"))
		{
			m_arrErrors = new Array();
			
			$("#divValidateButtons").hide();
			$("#btnSubmit").hide();
			$("#submittedRows").html("Please wait as the groups are updated...");
			setTimeout(function()
			{			
				m_CountSubmitted = 0;
				m_CountToSubmit = 0;
				for( var x = 0; x < m_arrRows.length; x++ )
				{
					var id = x + 1;
					
					if( $('#cb_' +  id).is(':checked') && $('#cb_' +  id).is(':visible') )
					{
						m_CountToSubmit++;
					}			
				}
				
				for( var x = 0; x < m_arrRows.length; x++ )
				{
					var id = x + 1;
					if( $('#cb_' +  id).is(':checked') && $('#cb_' +  id).is(':visible') )
					{
						var groupName = m_arrRows[x]["groupName"];
						var curPerms = m_arrRows[x]["curPerms"];
						var newPerms = m_arrRows[x]["newPerms"];
						var spGroupID = m_arrRows[x]["SPGroupID"];
						
						var ctx = SP.ClientContext.get_current();  
						var web = ctx.get_web();
						var collGroup = web.get_siteGroups();
	   					var oGroup = collGroup.getById( spGroupID ); 
   
   						/** Delete existing permissions in group */
						var arrPerm = curPerms.split(";");
						for( var y = 0; y < arrPerm.length; y++ )
						{			
							var accountName = arrPerm[y];
							if( accountName!= null && $.trim(accountName) != "" )
							{
								var oUser = web.ensureUser( accountName );
								oGroup.get_users().remove( oUser );
							}
						}

   						/** Add new users to permissions in group */
						var arrPerm = newPerms.split(";");
						for( var y = 0; y < arrPerm.length; y++ )
						{
							var accountName = arrPerm[y];
							if( accountName!= null && $.trim(accountName) != "" )
							{
								var oUser = web.ensureUser( accountName );
								oGroup.get_users().addUser( oUser );
							}
						}
	
						ctx.executeQueryAsync
						 (
							function () 
							{
								m_CountSubmitted++;
								$("#submittedRows").html("<span style='color:green; font-weight:bold;'>" +  m_CountSubmitted + "</span> groups were updated.")
								if( m_CountSubmitted == m_CountToSubmit )
								{
									LoadErrors();
									$("#divValidateButtons").show();

								}
							}, 
							function (sender, args) 
							{
								//window.location.href = window.location.href;
								//alert("Error occurred. " + args.get_message() + '\n'+ args.get_stackTrace() );
								m_CountSubmitted++;
								
								m_arrErrors.push("Error occurred. " + args.get_message() );
		
								$("#submittedRows").html("<span style='color:green; font-weight:bold;'>" +  m_CountSubmitted + "</span> groups were updated.")
								if( m_CountSubmitted == m_CountToSubmit )
								{
									LoadErrors();
									$("#divValidateButtons").show();
								}
							}
						);
					}
				}
			}, 100);
			
		}
	}
	
	function LoadErrors()
	{
		var output = "<ul>";
		for( var x = 0; x < m_arrErrors.length; x++ )
		{
			output += "<li>" + m_arrErrors[x] + "</li>";
		}
		output += "</ul>";
		
		if( m_arrErrors.length == 0 )
			output = "";
			
		$("#tblErrors").html( output );
	}
	
	function ClearRows()
	{
		m_arrRows = new Array();
		m_arrErrors = new Array();
		$("#divValidation").hide();
		$("#tblRows").html("");
		$("#submittedRows").html("");
		$('textarea').val("");
	}

	function CBChanged(id)
	{
		if( $('#cb_' +  id).is(':checked') )
		{
			 $("#row_" + id).removeClass("removed");		  
		}
		else
		{
			 $("#row_" + id).addClass("removed");		  
		}
	}

	function CheckAll()
	{
		var checkAll = $("#chboxSelectAll").is(':checked');
		
		for( var x = 0; x < m_arrRows.length; x++ )
		{
			var id = x + 1;
			
			if( $('#cb_' +  id).is(':visible') )
			{
				if( checkAll )
				{
					$('#cb_' +  id).attr('checked','checked');
					$("#row_" + id).removeClass("removed");		  
				}
				else 
				{
					$('#cb_' +  id).removeAttr('checked');
					$("#row_" + id).addClass("removed");		  
				}		
			}
		}
	}

	
	var publicMembers = 
	{
		ValidateRows: ValidateRows,
		ClearRows: ClearRows,
		SubmitRows: SubmitRows,
		CheckAll: CheckAll,
		CBChanged: CBChanged
	}
	
	return publicMembers;
}
