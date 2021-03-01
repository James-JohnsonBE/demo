"use strict";

var Audit = window.Audit|| {};
Audit.Permissions = Audit.Permissions || {};

ExecuteOrDelayUntilScriptLoaded(InitPermissions, "sp.js");	

function InitPermissions() 
{    
	Audit.Permissions.GetGroups = new Audit.Permissions.Load();
	Audit.Permissions.Init();
}

Audit.Permissions.Init = function()
{
}

Audit.Permissions.Load = function ()
{	
	var m_siteUrl = _spPageContextInfo.webServerRelativeUrl; //IE11 in sp 2013 does not recognize L_Menu_BaseUrl
	
	m_fnLoadGroups();
	
	function m_fnLoadGroups()
	{					
		$("#divMsgLoading").show();			
		$("#divTblOutput").html("");
					
		var currCtx = new SP.ClientContext.get_current();
		var web = currCtx.get_web();
		collGroup = currCtx.get_web().get_siteGroups();
	    currCtx.load(collGroup);
	   	currCtx.load(collGroup, "Include(Users)")
	    
		currCtx.executeQueryAsync(OnSuccess, OnFailure);
		
		function OnSuccess(sender, args)
		{
			var arrGroups = new Array();
			var listEnumerator = collGroup.getEnumerator(); 
			while (listEnumerator.moveNext()) 
			{ 
				var item = listEnumerator.get_current(); 
				groupName = item.get_title(); 
				groupName = $.trim(groupName);
				
			
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
					 users += arrPerms[g] + "; ";							 
				}

				
				var oGroup = new Object();
				oGroup["Title"] = groupName;
				oGroup["Users"] = users;
				arrGroups.push( oGroup );
			} 
			
			var output = "<table id='table_Groups' class='tablesorter' style='width:800px'><thead><tr><th>Group Name</th><th>Users</th></tr></thead><tbody id='fbody'>";
			
			for( var x = 0; x < arrGroups.length; x++ )
			{
				var groupName = arrGroups[x].Title;
				var perms = arrGroups[x].Users;
				
				output += "<tr><td class='groupName' style='white-space:nowrap'>" + groupName + "</td><td id='groupPerms" + x +"' >" + perms + "</td></tr>";
			}
			output += "</tbody><tfoot><tr><th colspan = '3' style='text-align:left;white-space:nowrap'>Total: " + arrGroups.length + "</th></tr></tfoot></table>";
			
			if( arrGroups == 0 )
			{
				output = "<div>0 Groups found</div>";
			}
			
			$("#divMsgLoading").hide();	
			$("#divTblOutput").html(output);		
		
		
			m_fnBindHandlersOnLoad();
		}
		function OnFailure(sender, args)
		{
			$("#divMsgLoading").hide();
			$("#divTblOutput").html("<div style='padding-top:10px;'>Unable to load</div>");
		}		
	}
		
	function m_fnBindHandlersOnLoad()
	{
		m_fnBindPrintButton("#btnPrint", "#divTblOutput");

		/**Note: for the export to work, make sure this is added to the html: <iframe id="CsvExpFrame" style="display: none"></iframe>**/
		m_fnBindExportButton(".export", "GroupPermissions_", "table_Groups");
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
		var cssLink1 = m_siteUrl + "/siteassets/css/tablesorter/style.css?v=" + curDate.format("MM_dd_yyyy");
		var cssLink2 = m_siteUrl + "/siteassets/css/Audit_Styles.css?v=" + curDate.format("MM_dd_yyyy");
		var cssLink3 = m_siteUrl + "/siteassets/css/Audit_Page_Reports.css?v=" + curDate.format("MM_dd_yyyy");
	
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
	
	var publicMembers = 
	{
		LoadGroups: m_fnLoadGroups
	}
	
	return publicMembers;
}
