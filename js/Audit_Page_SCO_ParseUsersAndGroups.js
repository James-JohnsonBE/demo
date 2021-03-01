<link rel="stylesheet" href="../SiteAssets/css/jqueryui/1.11.3/themes/redmond/jquery-ui.min.css" />
<style type="text/css"> 
.error 
{
	background-color: PapayaWhip;
	color: red !important;    
	font-style: italic;
}
.error td
{
	color: gray;    
}

.normal td
{
	font-weight :bold;
	color: teal !important;    
}
.removed td
{
	background-color: Gainsboro;
	color: gray;    
	/*text-decoration: line-through*/; 
	font-style: italic;
}
.addValue
{
	background-color: palegreen !important;
}


</style>

<div>
	<div style="padding-bottom:5px">Please copy and paste from the powershell script (Groups and Users):</div> 
	<div>
		<textarea id="inputRows" rows="10" cols="100"></textarea>
	</div>
	<div id="divValidateButtons" style="vertical-align:bottom; padding-top:5px;" >
		<input type="button" onclick="ValidateRows();" value="Validate Data"></input>
		<input type="button" onclick="ClearRows();" value="Clear Data"></input>
	</div>
</div>
<div id="divValidation" style="display:none">
	<div id="tblErrors"></div>
	<div id="tblUnfoundUsers" style="color:red"></div>
	<div id="tblRows"></div>
</div>

<link rel="stylesheet" type="text/css" href="../../SiteAssets/css/tablesorter/style.css"  />
<link rel="stylesheet" type="text/css" href="../../SiteAssets/css/Audit_Styles.css"/>
<link rel="stylesheet" type="text/css" href="../../SiteAssets/css/Audit_Page_Reports.css"/>


<script type="text/javascript" src="../../SiteAssets/js/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="../../SiteAssets/js/jqueryui/1.11.3/jquery-ui.min.js"></script>
<script type = "text/javascript"> 
var m_siteUrl = _spPageContextInfo.webServerRelativeUrl; //L_Menu_BaseUrl does not work in SP 2013 IE 11


var arrRows = new Array();
var arrErrors = new Array();

SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function (){} ); 
SP.SOD.executeOrDelayUntilScriptLoaded(init,"sp.js"); 
function init()
{	
}

function ClearRows()
{
	arrRows = new Array();
	arrErrors = new Array();
	$("#divValidation").hide();
	$("#tblRows").html("");
	$('textarea').val("");
}

function ValidateRows()
{
	$("#divValidation").hide();
	$("#tblRows").html("");
	$("#submittedRows").html("");

	arrErrors = new Array();
	arrRows = new Array();
	
	var rows = $("#inputRows").html();
	
	var lines = $('textarea').val().split('\n');
	
	var lineCount = 0;
	
	for(var i = 0; i < lines.length;i++)
	{
		var bAdded = false;
		
		var cellValue = lines[i].split("\t");
		if( cellValue.length == 1 )
		{	
			var valueInCell = $.trim(cellValue[0]);
			
			if( valueInCell != "" )
			{
				if( valueInCell.toLowerCase().indexOf("group: ") >= 0 )
				{
					var groupName = valueInCell.substring( 7 );
				
					var obj = new Object();
					obj["group"] = groupName;
					obj["users"] = new Array();
					
					arrRows.push( obj );
					bAdded = true;
					lineCount++;
				}
				else
				{
					var username = valueInCell.substring( 6 );
					obj.users.push( username );
					bAdded = true;
					lineCount++;
				}
			}
		}
		if( !bAdded && $.trim(lines[i]) != "" )
		{
			arrErrors.push([i + 1, lines[i] ]);
			lineCount++;
		}	
	}

	var currCtx = new SP.ClientContext.get_current();
	var web = currCtx.get_web();
/*	collGroup = currCtx.get_web().get_siteGroups();
    currCtx.load(collGroup);
   	currCtx.load(collGroup, "Include(Users)")

	result = SP.Utilities.Utility.resolvePrincipal(currCtx, web, "Barrios, Cristina H", SP.Utilities.PrincipalType.user, SP.Utilities.PrincipalSource.all, null, false );
*/
	function OnSuccessUpdateGroupProps(sender, args)
	{
		//result.get_loginName();
		

//		alert( true );
				
		PrintTableValidation( lineCount );
	}
	
	function OnFailureUpdateGroupProps(sender, args)
	{
		alert( error );
	
	//]::ResolvePrincipal($web, $DisplayName, "All", "All", $null, $false)
	}
	var data = {};
	currCtx.executeQueryAsync(Function.createDelegate(data, OnSuccessUpdateGroupProps), Function.createDelegate(data, OnFailureUpdateGroupProps));
}


var	m_countToRun = 0;
var	m_countRan = 0;
var	m_waitDialog = null;
var isDlgOpen = false;

var curOutput = "";
function PrintTableValidation(lineCount)
{
	$("#divValidation").show();
	$("#tblUnfoundUsers").html("");
	$("#tblRows").html("");

	var errorOutput = "<table class='tablesorter'><thead><tr><th colspan='2'>Removed lines with unexpected # of cells or data</th></tr><tr><th>Line #</th><th>Line value</th></tr></thead>";
	
	for( var x = 0; x < arrErrors.length; x++ )
	{	
		var linenumber = arrErrors[x][0];
		var lineval = arrErrors[x][1];
		errorOutput += "<tr><td style='text-align:left'>" + linenumber + "</td><td style='text-align:left'>" + lineval + "</td></tr>";
	}
	
	if( arrErrors.length > 0 )
	{
		errorOutput += "</table>";
		$("#tblErrors").html( errorOutput );
	}
	else
	{
		$("#tblErrors").html("");
	}
					
	var output = "<div style='padding-top:5px;'>Processed: " + lineCount + " lines</div><table class='tablesorter' id='outputTable'><thead><tr><th>Group</th><th>Users</th></tr></thead><tbody id='fbody'>"

	var cntUsers = 0;
	for( var x = 0; x < arrRows.length; x++ )
	{
		var group = arrRows[x]["group"];
		var users = arrRows[x]["users"];
		var userNames = "";
		for( var y = 0; y < users.length; y++ )
		{
			userNames += users[y] + "; ";
			cntUsers ++;
		}
		
		var rownum = x + 1;	
		output += "<tr id='row_" + rownum + "'  class='normal'>" + 
		"<td nowrap>" + group + "</td>" + 
		"<td nowrap class='usernames'>" + userNames + "</td></tr>"; 
	}
	output +="</tbody><tfoot><tr><th colspan='2'>Total: " + arrRows.length + "</th></tr></tfoot></table>";
	
	if( arrRows.length > 0 )
	{
		$("#tblRows").html(output);
		$("#btnSubmit").show();
		
		curOutput = output;
	}
	else
	{
		alert("0 lines were successfully translated. Please provide the input data");
	}

	m_countToRun = 0;
	m_countRan = 0;
	m_waitDialog = null;
	isDlgOpen = false;
	
	if( cntUsers > 0 )
		m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose("Validating users", "Please wait... validating users", 200, 400);
	
	setTimeout( function()
	{
	
	for( var x = 0; x < arrRows.length; x++ )
	{
		var users = arrRows[x]["users"];
		for( var y = 0; y < users.length; y++ )
		{
			var userDisplayName = $.trim( users[y] );
			if( userDisplayName != "" )
			{
				m_countToRun++;
				
				/*if( !isDlgOpen )
				{
					m_waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose("Validating users", "Please wait... validating users", 200, 400);
					isDlgOpen = true;
				}*/
				
				
				var currCtx = new SP.ClientContext.get_current();
				var web = currCtx.get_web();
				//collGroup = currCtx.get_web().get_siteGroups();
			    //currCtx.load(collGroup);
			   	//currCtx.load(collGroup, "Include(Users)")
				result = SP.Utilities.Utility.resolvePrincipal(currCtx, web, userDisplayName, SP.Utilities.PrincipalType.user, SP.Utilities.PrincipalSource.all, null, false );

				function OnSuccess(sender, args)
				{
					m_countRan ++ ;
					if( this.result && this.result.get_loginName() != null && this.result.get_loginName() != "" )
					{
						var loginName = this.result.get_loginName();
						var userDisplayName = this.userDisplayName;
						curOutput = curOutput.split( userDisplayName ).join( loginName );
					}
					else
					{
						var userDisplayName = this.userDisplayName;
						
						curOutput = curOutput.split( userDisplayName + ";" ).join( "" );

						var curunfound = $("#tblUnfoundUsers").html();
						curunfound += "<div>" + userDisplayName + "</div>";
						$("#tblUnfoundUsers").html( curunfound );
					}
										
					if( m_countToRun == m_countRan )
					{
						m_waitDialog.close();
						$("#outputTable").html( curOutput );
					}					
				}
				
				function OnFailure(sender, args)
				{
					m_countRan ++;
					if( m_countToRun == m_countRan )
					{
						m_waitDialog.close();
						$("#outputTable").html( curOutput );
					}

					alert( error );				
				}
				var data = {userDisplayName: userDisplayName, result:result};
				currCtx.executeQueryAsync(Function.createDelegate(data, OnSuccess), Function.createDelegate(data, OnFailure));
	
			}
		}		
	}
	}, 1000);
}

function isNumberKey(evt)
{
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}



</script>
