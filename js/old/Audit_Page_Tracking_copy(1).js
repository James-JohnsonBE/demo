var Audit = window.Audit || {};
Audit.AuditRequests = Audit.AuditRequests || {};

ExecuteOrDelayUntilScriptLoaded(InitReport, "sp.js");	

function InitReport() 
{    
	Audit.AuditRequests.Report = new Audit.AuditRequests.NewReportPage();
	Audit.AuditRequests.Init();
}

Audit.AuditRequests.Init = function()
{
}

Audit.AuditRequests.NewReportPage = function ()
{	
	var m_siteUrl = _spPageContextInfo.webServerRelativeUrl; //IE11 in sp 2013 does not recognize L_Menu_BaseUrl
	var m_listTitleRequests = "Audit Requests";
	var m_listNameRequests = "GFSAUDITREQUEST";

	var m_listTitleResponses = "Audit Responses";
	var m_listNameResponses = "Audit_Response";
	
	var m_libTitleCoverSheet = "Audit Cover & Spread Sheets";
	var m_libNameCoverSheet = "Audit_Response_Sheets";

	var m_libTitleResponseDocs = "Audit Response Documents";
	var m_libNameResponseDocs = "GFSAUDITRESPONSEDOCLIB";
	
	var m_stagingResponseDocsLibraryGUID = null; //set below
	var m_libTitleTempResponseDocs = "Staging Audit Response Documents";
	var m_libNameTempResponseDocs = "Temp_Audit_Resp_Doc";
	
	var m_arrRequests = new Array();
	
	LoadInfo();
		
	function LoadInfo()
	{		
		var currCtx = new SP.ClientContext.get_current();
		var web = currCtx.get_web();
		
		var requestList = web.get_lists().getByTitle( m_listTitleRequests );
		var requestQuery = new SP.CamlQuery();	
		requestQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="Request_x0020_Number"/></OrderBy></Query></View>');
		m_requestItems = requestList.getItems( requestQuery );
		//currCtx.load(m_requestItems);
		currCtx.load( m_requestItems, 'Include(ID, Request_x0020_Number, Request_x0020_Subject, Response_x0020_Status, Escalated_x003f_, Is_x0020_Sample, Request_x0020_DueDate, Internal_x0020_Due_x0020_Date)');

		var responseList = web.get_lists().getByTitle( m_listTitleResponses );
		var responseQuery = new SP.CamlQuery();	
		responseQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="Request_x0020_Number"/></OrderBy></Query></View>');
		m_responseItems = responseList.getItems( responseQuery );
		currCtx.load( m_responseItems );
		//currCtx.load( m_responseItems, 'Include(ID, Title, Request_x0020_Number,Sample_x0020_Number, Action_x0020_Office, Return_x0020_Reason, Request_x0020_Number_x0020_Subje, Previous_x0020_Response_x0020_St)');

		//load the guid of the staging library		
		m_stagingResponseDocsLibrary = currCtx.get_web().get_lists().getByTitle( m_libTitleTempResponseDocs );
		currCtx.load(m_stagingResponseDocsLibrary, 'Title', 'Id');

		var coverSheetLib = web.get_lists().getByTitle( m_libTitleCoverSheet );
		var coverSheetQuery = new SP.CamlQuery();	
		coverSheetQuery.set_viewXml('<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Request_x0020_Number"/></OrderBy></Query></View>');
		m_CoverSheetItems = coverSheetLib.getItems( coverSheetQuery );
		//currCtx.load( m_CoverSheetItems );
		currCtx.load(  m_CoverSheetItems , 'Include(ID, Title, Request_x0020_Number, FileLeafRef)');

			
		//make sure to only pull documents (fsobjtype = 0)
		var responseDocsLib = web.get_lists().getByTitle( m_libTitleResponseDocs );
		var responseDocsQuery = new SP.CamlQuery();	
		responseDocsQuery.set_viewXml('<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Request_x0020_Number"/><FieldRef Name="Response_x0020_ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">0</Value></Eq></Where></Query></View>');
		m_ResponseDocsItems = responseDocsLib.getItems( responseDocsQuery );
		//currCtx.load( m_ResponseDocsItems );
		currCtx.load(  m_ResponseDocsItems , 'Include(ID, FSObjType, Title, Request_x0020_Number, Response_x0020_ID, Document_x0020_Status, Receipt_x0020_Date, FileLeafRef, FileDirRef)');

		currCtx.executeQueryAsync(OnSuccess, OnFailure);	
		function OnSuccess(sender, args)
		{		
			m_fnLoadData();	
		}		
		function OnFailure(sender, args)
		{
			alert("Request failed"  + args.get_message() + "\n" + args.get_stackTrace() );		
		}
	}			
	
	function m_fnLoadData()
	{
		LoadRequests();
		LoadCoverSheets();
		LoadStagingResponseDocsLib();
		LoadResponses();
		LoadResponseDocs();
		
		UpdateTable( m_arrRequests, "fbody" );
		
		$("#divLoading").hide();
	}
	
	function LoadRequests()
	{
		m_arrRequests = new Array();
				
		var listItemEnumerator = m_requestItems.getEnumerator();
		while(listItemEnumerator.moveNext())
		{
			var oListItem = listItemEnumerator.get_current();
			
			var id = oListItem.get_item('ID');
			var number = oListItem.get_item('Request_x0020_Number');
			var status = oListItem.get_item('Response_x0020_Status');
			var subject = oListItem.get_item('Request_x0020_Subject');
			var escalated = oListItem.get_item('Escalated_x003f_');
			var sample = oListItem.get_item('Is_x0020_Sample');
			var dueDate = oListItem.get_item('Request_x0020_DueDate');
			var internalDueDate = oListItem.get_item('Internal_x0020_Due_x0020_Date');
				
			dueDate != null ? dueDate = dueDate.format("MM/dd/yyyy") : dueDate = "";
			internalDueDate != null ? internalDueDate = internalDueDate.format("MM/dd/yyyy") : internalDueDate = "";

			var requestObject = new Object();
			requestObject ["ID"] = id;
			requestObject ["number"] = number;
			requestObject ["subject"] = subject;
			requestObject ["status"] = status;
			requestObject ["escalated"] = escalated;
			requestObject ["sample"] = sample;
			requestObject ["dueDate"] = dueDate;
			requestObject ["internalDueDate"] = internalDueDate;
			requestObject ["coversheets"] = new Array();
			requestObject ["responses"] = new Array();
			m_arrRequests.push( requestObject );
		}
	}
	
	function LoadStagingResponseDocsLib()
	{				
		m_stagingResponseDocsLibraryGUID = m_stagingResponseDocsLibrary.get_id();
	}	

	function LoadCoverSheets()
	{				
		var listItemEnumerator = m_CoverSheetItems.getEnumerator();
		while(listItemEnumerator.moveNext())
		{
			var oListItem = listItemEnumerator.get_current();
			
			var number = oListItem.get_item('Request_x0020_Number').get_lookupValue();
		
			for( var x = 0; x < m_arrRequests.length; x++ )
			{
				if( m_arrRequests[x]["number"] == number )
				{					
					var coversheetObject = new Object();
					coversheetObject ["ID"] = oListItem.get_item('ID');
					coversheetObject ["title"] = oListItem.get_item('FileLeafRef');
					m_arrRequests[x]["coversheets"].push( coversheetObject );

					break;
				}
			}
		}
	}
	
	function LoadResponses()
	{				
		var listItemEnumerator = m_responseItems.getEnumerator();
		while(listItemEnumerator.moveNext())
		{
			var oListItem = listItemEnumerator.get_current();
			
			var number = oListItem.get_item('Request_x0020_Number').get_lookupValue();
		
			for( var x = 0; x < m_arrRequests.length; x++ )
			{
				if( m_arrRequests[x]["number"] == number )
				{
					var returnReason = oListItem.get_item('Return_x0020_Reason');
					if( returnReason == null ) returnReason = "";
					
					var responseObject = new Object();
					responseObject ["ID"] = oListItem.get_item('ID');
					responseObject ["number"] = number;
					responseObject ["title"] = oListItem.get_item('Title');
					responseObject ["sample"] = oListItem.get_item('Sample_x0020_Number');
					responseObject ["returnReason"] = returnReason;
					responseObject ["prevStatus"] = oListItem.get_item('Previous_x0020_Response_x0020_St');
					responseObject ["responseDocs"] = new Array();
					m_arrRequests[x]["responses"].push( responseObject );

					break;
				}
			}
		}
	}
	
	function LoadResponseDocs()
	{				
		var listItemEnumerator = m_ResponseDocsItems.getEnumerator();
		while(listItemEnumerator.moveNext())
		{
			var oListItem = listItemEnumerator.get_current();
			
			responseDocID =  oListItem.get_item('ID');
			
			var requestNumber = oListItem.get_item('Request_x0020_Number');
			if( requestNumber != null )
				requestNumber = requestNumber.get_lookupValue();
				
			var responseID = oListItem.get_item('Response_x0020_ID');
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
							oRequest.responses[y]["responseDocs"].push( responseDocObject );
						}
					}
					break;
				}
			}
		}
	}


	function UpdateTable(arr, fbody)
	{
		$('#' + fbody).empty();
		$('#' + fbody).html('');

		//arr.sort( SortArr(key) );
		
		for( var x = 0; x < arr.length; x++ )
		{
			var oRequest = arr[x];
			
			var escalated = "";
			oRequest.escalated ? escalated = "Yes" : escalated = "No";

			var sample = "";
			oRequest.sample ? sample = "Yes" : sample = "No";

			
			/************Requests**************/
			var requestLink = "<a title='View Request' href='javascript:void(0)' onclick='Audit.AuditRequests.Report.ViewRequest(" + oRequest.ID + ")'><span class='ui-icon ui-icon-search'>View Request</span></a>";
			var requestEditLink = "<a title='Edit Request' href='javascript:void(0)' onclick='Audit.AuditRequests.Report.EditRequest(" + oRequest.ID + ")'><span class='ui-icon ui-icon-pencil'>Edit Request</span></a>";
			
			$('#' + fbody).append('<tr class="request">' + 
				'<td class="request-number" style="text-align:left"><img style="background-color: transparent;" src="/_layouts/images/minus.gif">' + oRequest.number + '</td>' +
				'<td class="request-subject">' + oRequest.subject + '</td>' +
				'<td class="request-status">' + oRequest.status + '</td>' +
				'<td class="request-escalated">' + escalated + '</td>' +
				'<td class="request-sample">' + sample + '</td>' +
				'<td class="request-dueDate">' + oRequest.dueDate + '</td>' +
				'<td class="request-internalDueDate">' + oRequest.internalDueDate + '</td>' +
				'<td class="request-action">' + requestLink + requestEditLink + '</td>' +
			'</tr>');
			
			/************CoverSheet**************/
			$('#' + fbody).append('<tr class="coversheet-header">' + 
				'<td></td>' +
				'<td colspan="6" class="coversheet-header-title">Coversheets  (<span>' + oRequest.coversheets.length + '</span>)</td>' +
				'<td></td>' +
			'</tr>');
			
			for( var y = 0; y < oRequest.coversheets.length; y++ )
			{
				var oCoversheet = oRequest.coversheets[y];

				var coversheetLink = "<a title='View Coversheet' href='javascript:void(0)' onclick='Audit.AuditRequests.Report.ViewCoverSheet(" + oCoversheet.ID + ")'><span class='ui-icon ui-icon-search'>View Coversheet</span></a>";
				var coversheetEditLink = "<a title='Edit Coversheet' href='javascript:void(0)' onclick='Audit.AuditRequests.Report.EditCoverSheet(" + oCoversheet.ID + ")'><span class='ui-icon ui-icon-pencil'>Edit Coversheet</span></a>";
				
				$('#' + fbody).append('<tr class="coversheet-item">' + 
					'<td></td>' +
					'<td colspan="6" class="coversheet-title"><ul><li>' + oCoversheet.title + '</li></ul></td>' +
					'<td class="coversheet-action">' + coversheetLink + coversheetEditLink + '</td>' +
				'</tr>');
			}
			
			/************Responses**************/
			$('#' + fbody).append('<tr class="response-header">' + 
				'<td></td>' +
				'<td colspan="3" class="response-header-title">Responses (<span>' + oRequest.responses.length + '</span>)</td>' +
				'<td class="response-header-sample">Sample</td>' +
				'<td class="response-header-prevResponseStatus">Prev Response Status</td>' +
				'<td class="response-header-returnReason">Return Reason</td>' +
				'<td class="response-header-action"><a title="Add Response" href="javascript:void(0)" onclick="Audit.AuditRequests.Report.AddResponse(\'' + oRequest.number + '\')"><span class="ui-icon ui-icon-plus">Add Response</span></a></td>' +
			'</tr>');
			
			for( var y = 0; y < oRequest.responses.length; y++ )
			{
				var oResponse = oRequest.responses[y];
				
				var responseLink = "<a title='View Response' href='javascript:void(0)' onclick='Audit.AuditRequests.Report.ViewResponse(" + oResponse.ID + ")'><span class='ui-icon ui-icon-search'>View Response</span></a>";
				var responseEditLink = "<a title='Edit Response' href='javascript:void(0)' onclick='Audit.AuditRequests.Report.EditResponse(" + oResponse.ID + ")'><span class='ui-icon ui-icon-pencil'>Edit Response</span></a>";
				var responseFolderLink = "<a title='View Response Documents' href='javascript:void(0)' onclick='Audit.AuditRequests.Report.ViewResponseDocFolder(\"" + oResponse.title + "\")'><span class='ui-icon ui-icon-folder-collapsed'>View Folder</span></a>";
				var responseFolderAddLink = "<a title='Upload Response Documents' href='javascript:void(0)' onclick='Audit.AuditRequests.Report.UploadResponseDoc(\"" + oResponse.title  + "\")'><span class='ui-icon ui-icon-plus'>Upload Docs</span></a>";
				
				if( oResponse.prevStatus.indexOf("Closed") >= 0 )
				{
					responseEditLink = "";
					responseFolderAddLink = "";
				}
				
				$('#' + fbody).append('<tr class="response-item">' + 
				'<td></td>' +
					'<td colspan="3" class="response-title"><ul><li>' + oResponse.title + '</li></ul></td>' +
					'<td class="response-sample">' + oResponse.sample + '</td>' +
					'<td class="response-prevStatus">' + oResponse.prevStatus + '</td>' +
					'<td class="response-returnReason ">' + oResponse.returnReason + '</td>' +
					'<td class="response-action">' + responseLink + responseEditLink + responseFolderLink + responseFolderAddLink +'</td>' +
				'</tr>');
				
				/************Response Documents**************/
				for( var z = 0; z < oResponse.responseDocs.length; z++ )
				{
					var oResponseDoc = oResponse.responseDocs[z];
	
					var responseDocLink = "<a title='View Response Doc' href='javascript:void(0)' onclick='Audit.AuditRequests.Report.ViewResponseDoc(" + oResponseDoc.ID + ")'><span class='ui-icon ui-icon-search'>View Response Doc</span></a>";
					var responseEditLink = "<a title='Edit Response Doc' href='javascript:void(0)' onclick='Audit.AuditRequests.Report.EditResponseDoc(" + oResponseDoc.ID + ")'><span class='ui-icon ui-icon-pencil'>Edit Response Doc</span></a>";
					
					if( oResponse.prevStatus.indexOf("Closed") >= 0 )
					{
						responseEditLink = "";
					}

					$('#' + fbody).append('<tr class="response-doc">' + 
						'<td></td>' +
						'<td colspan="6" class="response-doc-title"><ul><li>' + oResponseDoc.title + '</li></ul></td>' +
						'<td class="response-doc-action">' + responseDocLink + responseEditLink + '</td>' +
					'</tr>');
				}
			}
		}
		
		$("#divTbl").show();
		
		BindHandlersOnOutput();
	}
	
	
	function m_fnViewRequest( id ) 
	{		
		//m_itemID = id;	

		var formName = "DispForm.aspx";
		var options = SP.UI.$create_DialogOptions();	
		options.title = "View Request (ID:" + id + ")";
		options.dialogReturnValueCallback = OnCallbackForm;
		options.url = m_siteUrl + "/Lists/" + m_listNameRequests + "/" + formName + "?ID=" + id;
		SP.UI.ModalDialog.showModalDialog(options);
	}
	
	function m_fnEditRequest( id ) 
	{		
		//m_itemID = id;	

		var formName = "EditForm.aspx";
		var options = SP.UI.$create_DialogOptions();	
		options.title = "Edit Request (ID:" + id + ")";
		options.dialogReturnValueCallback = OnCallbackForm;
		options.url = m_siteUrl + "/Lists/" + m_listNameRequests + "/" + formName + "?ID=" + id;
		SP.UI.ModalDialog.showModalDialog(options);
	}
	
	
	function m_fnAddResponse( id ) 
	{		
		//m_itemID = id;	

		var formName = "NewForm.aspx";
		var options = SP.UI.$create_DialogOptions();	
		options.title = "Add Response to (Request Number:" + id + ")";
		options.dialogReturnValueCallback = OnCallbackForm;
		options.url = m_siteUrl + "/Lists/" + m_listNameResponses + "/" + formName + "?Request%20Number=" + id;
		SP.UI.ModalDialog.showModalDialog(options);
	}

	function m_fnViewResponse( id ) 
	{		
		//m_itemID = id;	

		var formName = "DispForm.aspx";
		var options = SP.UI.$create_DialogOptions();	
		options.title = "View Response (ID:" + id + ")";
		options.dialogReturnValueCallback = OnCallbackForm;
		options.url = m_siteUrl + "/Lists/" + m_listNameResponses + "/" + formName + "?ID=" + id;
		SP.UI.ModalDialog.showModalDialog(options);
	}
	
	function m_fnEditResponse( id ) 
	{		
		//m_itemID = id;	

		var formName = "EditForm.aspx";
		var options = SP.UI.$create_DialogOptions();	
		options.title = "Edit Response (ID:" + id + ")";
		options.dialogReturnValueCallback = OnCallbackForm;
		options.url = m_siteUrl + "/Lists/" + m_listNameResponses + "/" + formName + "?ID=" + id;
		SP.UI.ModalDialog.showModalDialog(options);
	}
	
	function m_fnViewCoverSheet( id ) 
	{		
		//m_itemID = id;	

		var formName = "DispForm.aspx";
		var options = SP.UI.$create_DialogOptions();	
		options.title = "View Coversheet (ID:" + id + ")";
		options.dialogReturnValueCallback = OnCallbackForm;
		options.url = m_siteUrl + "/"+ m_libNameCoverSheet + "/Forms/" + formName + "?ID=" + id;
		SP.UI.ModalDialog.showModalDialog(options);
	}
	
	function m_fnEditCoverSheet( id ) 
	{		
		//m_itemID = id;	

		var formName = "EditForm.aspx";
		var options = SP.UI.$create_DialogOptions();	
		options.title = "Edit Coversheet (ID:" + id + ")";
		options.dialogReturnValueCallback = OnCallbackForm;
		options.url = m_siteUrl + "/"+ m_libNameCoverSheet + "/Forms/" + formName + "?ID=" + id;
		SP.UI.ModalDialog.showModalDialog(options);
	}

	function m_fnViewResponseDoc( id ) 
	{		
		//m_itemID = id;	

		var formName = "DispForm.aspx";
		var options = SP.UI.$create_DialogOptions();	
		options.title = "View Response Doc (ID:" + id + ")";
		options.dialogReturnValueCallback = OnCallbackForm;
		options.url = m_siteUrl + "/"+ m_libNameResponseDocs + "/Forms/" + formName + "?ID=" + id;
		SP.UI.ModalDialog.showModalDialog(options);
	}
	
	function m_fnViewResponseDocFolder(title)
	{
		var options = SP.UI.$create_DialogOptions();	
		options.title = "View Response Folder";
		options.dialogReturnValueCallback = OnCallbackForm;
		options.url = m_siteUrl + "/"+ m_libNameResponseDocs + "/" + title;
		SP.UI.ModalDialog.showModalDialog(options);
	}
	
	function m_fnUploadResponseDoc( responseID )
	{
		var options = SP.UI.$create_DialogOptions();	
		options.title = "Upload Response Document to: " +  responseID ;
		options.dialogReturnValueCallback = OnCallbackForm;

		var rootFolder = m_siteUrl + "/" + m_libNameTempResponseDocs;
		
		options.url = m_siteUrl + "/_layouts/Upload.aspx?List=" + m_stagingResponseDocsLibraryGUID + "&RootFolder=" + rootFolder + "&RespID=" + responseID;
		//alert( options.url );
		
		SP.UI.ModalDialog.showModalDialog(options);
	}
	
	function m_fnEditResponseDoc( id ) 
	{		
		//m_itemID = id;	

		var formName = "EditForm.aspx";
		var options = SP.UI.$create_DialogOptions();	
		options.title = "Edit ResponseDoc (ID:" + id + ")";
		options.dialogReturnValueCallback = OnCallbackForm;
		options.url = m_siteUrl + "/"+ m_libNameResponseDocs + "/Forms/" + formName + "?ID=" + id;
		SP.UI.ModalDialog.showModalDialog(options);
	}

	function OnCallbackForm(result, value)
	{
		//$("#request-" + m_itemID).removeClass("highlighted");	
		//$(".request-item").removeClass("unhighlighted");

		if (result === SP.UI.DialogResult.OK) 
		{
			location.reload();
		}
	}
	
	function BindHandlersOnOutput()
	{
		$('.request').click(function(event){
		
			event.preventDefault();
			var curIcon = $(this).find("img").attr("src");
			if( curIcon == "/_layouts/images/minus.gif")
				$(this).find("img").attr("src", "/_layouts/images/plus.gif");
			else
				$(this).find("img").attr("src", "/_layouts/images/minus.gif");
	
			//$(this).nextUntil('tr.Grouping').slideToggle(200);
			$(this).nextUntil('tr.request').each(function() {
				$(this).toggleClass("collapsed");
			});
		});
	}

	/*function BindHandlersOnLoad()
	{
		$("#ddlYear").change(function(){ LoadRequestsOnYear(); });
		$("#ddlType").change(function(){ m_showType = $("#ddlType").val(); DisplayReports(); });
		
		BindPrintButton("#btnPrint1", "#divTblOffice");
		BindPrintButton("#btnPrint2", "#divTblCar");
		BindPrintButton("#btnPrint3", "#divTblDriver");
		BindPrintButton("#btnPrint4", "#divTblRequester");


		BindPrintButton("#btnPrint1-1", "#divTblOffice-1");
		BindPrintButton("#btnPrint2-1", "#divTblCar-1");
		BindPrintButton("#btnPrint3-1", "#divTblDriver-1");
		BindPrintButton("#btnPrint4-1", "#divTblRequester-1");


		//Note: for the export to work, make sure this is added to the html: <iframe id="CsvExpFrame" style="display: none"></iframe>
		BindExportButton(".export1", "CarReservationsByOffice_", "tblByOffice");
		BindExportButton(".export2", "CarReservationsByCar_", "tblByCar");
		BindExportButton(".export3", "CarReservationsByDriver_", "tblByDriver");
		BindExportButton(".export4", "CarReservationsByRequester_", "tblByRequester");

		BindExportButton(".export1-1", "CarReservationsByOffice_", "tblByOffice-1");
		BindExportButton(".export2-1", "CarReservationsByCar_", "tblByCar-1");
		BindExportButton(".export3-1", "CarReservationsByDriver_", "tblByDriver-1");
		BindExportButton(".export4-1", "CarReservationsByRequester_", "tblByRequester-1");
	}
	
	function BindPrintButton(btnPrint, divTbl)
	{
		var pageTitle = 'Car Reservations (SharePoint Site)';
		$( btnPrint ).on("click", function(){ PrintPage(pageTitle , divTbl); });
	}
	
	function BindExportButton(btnExport, fileNamePrefix, tbl)
	{
		$(btnExport).on('click', function (event) 
		{
			var curDate = new Date().format("yyyyMMdd");
       		ExportToCsv(fileNamePrefix + curDate, tbl);
	    });
	}

	
	function ISODateString(d)
	{
	  function pad(n){return n < 10 ? '0'+n : n}
	  
	  return d.getUTCFullYear()+'-'
	      + pad(d.getUTCMonth()+1)+'-'
	      + pad(d.getUTCDate())+'T'
	      + pad(d.getUTCHours())+':'
	      + pad(d.getUTCMinutes())+':'
	      + pad(d.getUTCSeconds())+'Z'
	}



	function SumSelector(src, dest) 
	{
	    var findcol = "";
	    var totalcol = "";
	    var total = 0;
	    
	    $(src).each(function () 
	    {      		
    		val = $(this).text().replace(/[&\/\\#,+()$~%'":*?<>{}]/g,'');
			
			if( val != "" )
			{
		        total += parseFloat(val);	
	    	}
	     });
	          
		$(dest).html(addCommas(total));
	}
		
	function SortArr( fieldName )
	{
		 return function (a, b) 
		 {		 
			if( a[fieldName].toLowerCase() == b[fieldName].toLowerCase() )
				return 0;
			else if( a[fieldName].toLowerCase() > b[fieldName].toLowerCase())
				return 1;
			else return -1;	     	
		} 			
	}
	
	function addCommas(nStr) 
	{
		nStr += '';
		x = nStr.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) 
		{
		    x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	}

	function ExistsInArr(arr, fieldname, val)
	{
		if( arr == null ) return false;
		
		for( var x = 0; x < arr.length; x++ )
		{
			if( arr[x][fieldname] == val)
				return true;
		}
		return false;
	}
	
	function PadDigits(n, totalDigits) 
	{ 
		n = n.toString(); 
		var pd = ''; 
		if (totalDigits > n.length) 
		{ 
			for (i = 0; i < (totalDigits - n.length); i++) 
			{ 
				pd += '0'; 
			} 
		} 
		return pd + n.toString(); 
	} 

	function GetFriendlyDisplayName(oListItem, fieldName)
	{
		var user = oListItem.get_item(fieldName);
		if( user == null ) user = "";
		else 
			user = user.get_lookupValue();	
		return user;			
	}

	function BindHandlersAfterLoad()
	{
		function myCopyFunc(tableId)
		{
			return function (e) {

				var cloned = $(tableId).clone()
			
				cloned.find('img').each(function() {$(this).remove()});	
				cloned.find('td').each(function() {$(this).css("border", "1px solid")});
				cloned.find('th').each(function() {$(this).css("border", "1px solid")});
			
		    	if ( e&& e.clipboardData) 
		    	{
					e.preventDefault();
					e.clipboardData.setData('text/plain', cloned.html());
				} 
				else if (window.clipboardData) 
				{
					window.clipboardData.setData('Text',  cloned.html());
				}
				notifyId = SP.UI.Notify.addNotification("Copied to clipboard", false);
			}
		}
		
		function addEvent(evnt, elem, func, tableId) 
		{
		   if (elem.addEventListener)  // W3C DOM
		   //   elem.addEventListener("on"+evnt,func,false);
		   {
		   		elem.onclick = function () 
		   		{
			        document.execCommand('copy');
			    }
			    
			    btnCopy.addEventListener('copy', function (e) 
			    {
				    e.preventDefault();
					
					var cloned = $(tableId).clone()
					
					cloned.find('img').each(function() {$(this).remove()});	
					cloned.find('td').each(function() {$(this).css("border", "1px solid")});
					cloned.find('th').each(function() {$(this).css("border", "1px solid")});
		
				    if (e.clipboardData) 
				    {
				        e.clipboardData.setData('text/plain', cloned.html());
				    } 
				    else if (window.clipboardData) 
				    {
				        window.clipboardData.setData('Text', cloned.html());
				    }
					notifyId = SP.UI.Notify.addNotification("Copied to clipboard", false);
				});
		   }
		   else if (elem.attachEvent) 
		   { // IE DOM
		      elem.attachEvent("on"+evnt, func(tableId));
		   }
		   else 
		   { // No much to do
		      elem[evnt] = func(tableId);
		   }
		}

		addEvent("click", btnCopy1, myCopyFunc, '#divTblOffice');
		addEvent("click", btnCopy2, myCopyFunc, '#divTblCar');	
		addEvent("click", btnCopy3, myCopyFunc, '#divTblDriver');	
		addEvent("click", btnCopy4, myCopyFunc, '#divTblRequester');	


		addEvent("click", btnCopy11, myCopyFunc, '#divTblOffice-1');
		addEvent("click", btnCopy21, myCopyFunc, '#divTblCar-1');	
		addEvent("click", btnCopy31, myCopyFunc, '#divTblDriver-1');	
		addEvent("click", btnCopy41, myCopyFunc, '#divTblRequester-1');	
	}
	//This function will grab the html from the container var to display in a new window. 
	//It also loads the css files that are on the current page and appends it to the output that is displayed in a new window to maintain the styles
	function PrintPage(title, container)
	{
		var curDate = new Date();
		var cssLink1 = m_siteUrl + "/siteassets/css/tablesorter/style.css?v=" + curDate.format("MM_dd_yyyy");
		var cssLink2 = m_siteUrl + "/siteassets/css/CR_Styles.css?v=" + curDate.format("MM_dd_yyyy");
		var cssLink3 = m_siteUrl + "/siteassets/css/CR_Page_Reports.css?v=" + curDate.format("MM_dd_yyyy");
	
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
	*/
		
	var publicMembers = 
	{
		Load: m_fnLoadData,
		ViewRequest: function(id){ m_fnViewRequest(id); },
		EditRequest: function(id){ m_fnEditRequest(id); },
		AddResponse: function(id){ m_fnAddResponse(id); },
		ViewResponse: function(id){ m_fnViewResponse(id); },
		EditResponse: function(id){ m_fnEditResponse(id); },
		ViewCoverSheet: function(id){ m_fnViewCoverSheet(id); },
		EditCoverSheet: function(id){ m_fnEditCoverSheet(id); },
		ViewResponseDoc: function(id){ m_fnViewResponseDoc(id); },
		EditResponseDoc: function(id){ m_fnEditResponseDoc(id); },
		ViewResponseDocFolder: function(title){ m_fnViewResponseDocFolder(title); },
		UploadResponseDoc: function(responseID){ m_fnUploadResponseDoc(responseID); }
	}
	
	return publicMembers;
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

	
	
	
	
