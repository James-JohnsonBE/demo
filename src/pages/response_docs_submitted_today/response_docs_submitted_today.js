import "../../common/utilities.js";

var Audit = window.Audit || {};
Audit.ResponseDocsReport = Audit.ResponseDocsReport || {};

if (document.readyState === "ready" || document.readyState === "complete") {
  InitReport();
} else {
  document.onreadystatechange = () => {
    if (document.readyState === "complete" || document.readyState === "ready") {
      ExecuteOrDelayUntilScriptLoaded(function () {
        SP.SOD.executeFunc("sp.js", "SP.ClientContext", InitReport);
      }, "sp.js");
    }
  };
}

function InitReport() {
  /*********NOTE: the Contribute permission level needs to have manage permissions turned on ************/

  Audit.ResponseDocsReport.Report =
    new Audit.ResponseDocsReport.NewReportPage();
  Audit.ResponseDocsReport.Init();
}

Audit.ResponseDocsReport.Init = function () {};

Audit.ResponseDocsReport.NewReportPage = function () {
  var m_arrResponses = new Array();
  var m_bigMap = new Object();
  var m_arrResponseDocs = new Array();

  LoadInfo();

  function LoadInfo() {
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    var responseList = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetListTitleResponses());
    var responseQuery = new SP.CamlQuery();
    responseQuery.set_viewXml(
      '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="ResStatus"/><Value Type="Text">1-Open</Value></Where></Eq></Query></View>'
    );
    m_responseItems = responseList.getItems(responseQuery);
    currCtx.load(m_responseItems, "Include(ID, Title, ReqNum)");

    //make sure to only pull documents (fsobjtype = 0)
    var responseDocsLib = web
      .get_lists()
      .getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
    var responseDocsQuery = new SP.CamlQuery();
    responseDocsQuery.set_viewXml(
      '<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name="Created"/><Value Type="DateTime" IncludeTimeValue="FALSE"><Today /></Value></Eq><Eq><FieldRef Name="ContentType"/><Value Type="Text">Document</Value></Eq></And></Where></Query></View>'
    );
    //responseDocsQuery.set_viewXml('<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="ContentType"/><Value Type="Text">Document</Value></Eq></Where></Query></View>');
    m_ResponseDocsItems = responseDocsLib.getItems(responseDocsQuery);
    currCtx.load(
      m_ResponseDocsItems,
      "Include(ID, Title, ResID, DocumentStatus, FileLeafRef, FileDirRef, Modified, Editor)"
    );

    currCtx.executeQueryAsync(OnSuccess, OnFailure);
    function OnSuccess(sender, args) {
      m_fnLoadData();
    }
    function OnFailure(sender, args) {
      $("#divLoading").hide();
      statusId = SP.UI.Status.addStatus(
        "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
      );
      SP.UI.Status.setStatusPriColor(statusId, "red");
    }
  }

  function m_fnLoadData() {
    LoadResponses();
    LoadResponseDocs();

    DisplayTable("fbody");

    Audit.Common.Utilities.OnLoadDisplayTimeStamp();
  }

  function m_fnRefresh() {
    var curPath = location.pathname;
    location.href = curPath;
  }

  function DisplayTable(fbody) {
    $("#" + fbody).empty();
    $("#" + fbody).html("");

    var output = "";
    var cnt = 0;
    for (var x = 0; x < m_arrResponses.length; x++) {
      var oResponse = m_arrResponses[x];
      if (oResponse.responseDocs && oResponse.responseDocs.length > 0) {
        for (var y = 0; y < oResponse.responseDocs.length; y++) {
          oResponseDoc = oResponse.responseDocs[y];

          var onc =
            "onclick=\"return DispEx(this,event,'TRUE','FALSE','FALSE','SharePoint.OpenDocuments.3','1','SharePoint.OpenDocuments','','','','2','0','0','0x7fffffffffffffff','','')\"";
          var responseDoclink =
            "<a  onmousedown=\"return VerifyHref(this,event,'1','SharePoint.OpenDocuments','')\" " +
            onc +
            " href='" +
            oResponseDoc.folder +
            "/" +
            oResponseDoc.title +
            "'>" +
            oResponseDoc.title +
            "</a>";

          var responseDocDownloadlink =
            "<a href='../_layouts/download.aspx?SourceUrl=" +
            oResponseDoc.folder +
            "/" +
            oResponseDoc.title +
            "'><span class='ui-icon ui-icon-arrowreturnthick-1-s'>Download Document</span></a>";
          var responseLink =
            "<a href='" +
            Audit.Common.Utilities.GetSiteUrl() +
            "/SitePages/IA_DB.aspx?Tab=request-detail&request-detail-tab=response-docs&ReqNum=" +
            oResponse.requestNumber +
            "' target='_blank'>" +
            oResponse.title +
            "</a>";

          output +=
            '<tr class="sr-responsedoc-item">' +
            '<td class="sr-responsedoc-responseTitle" title="Go to Response">' +
            responseLink +
            "</td>" +
            '<td class="sr-responsedoc-docTitle">' +
            responseDoclink +
            "</td>" +
            '<td class="sr-response-downloadlink" title="Click to Download" nowrap>' +
            responseDocDownloadlink +
            "</td>" +
            '<td class="sr-response-modified" nowrap>' +
            oResponseDoc.modifiedDate +
            "</td>" +
            "</tr>";
          cnt++;
        }
      }
    }

    $("#" + fbody).append(output);

    $("#divOutput").show();

    $("#spanDocTotal").text(cnt);

    if (cnt == 0) {
      $("#divOutput").hide();
      $("#divMsgEmptyDocs").show();
    } else {
      $("#divMsgEmptyDocs").hide();
      $("#divOutput").show();
      BindTableSorter(cnt, "tblOutput");
    }

    $("#divRefresh").show();
  }

  function BindTableSorter(rowCount, tableName) {
    if (rowCount > 0) {
      $("#" + tableName).tablesorter({
        sortList: [
          [0, 0],
          [1, 0],
        ],
        selectorHeaders: ".sorter-true",
      });
    }
  }

  function LoadResponses() {
    try {
      m_arrResponses = new Array();
      m_bigMap = new Object();

      var listItemEnumerator = m_responseItems.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();

        var responseObject = new Object();
        responseObject["ID"] = oListItem.get_item("ID");

        var number = oListItem.get_item("ReqNum");
        if (number != null) number = number.get_lookupValue();
        responseObject["requestNumber"] = number;

        var title = oListItem.get_item("Title");
        responseObject["title"] = title;

        responseObject["item"] = oListItem;
        responseObject["responseDocs"] = new Array();

        m_arrResponses.push(responseObject);
        m_bigMap["response-" + title] = responseObject;
      }
    } catch (err) {
      alert(err);
    }
  }

  function LoadResponseDocs() {
    try {
      var listItemEnumerator = m_ResponseDocsItems.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();

        responseDocID = oListItem.get_item("ID");

        var responseID = oListItem.get_item("ResID");
        if (responseID != null) responseID = responseID.get_lookupValue();

        if (responseID == null) continue;

        var oResponse = m_bigMap["response-" + responseID];
        if (oResponse) {
          var responseDocObject = new Object();
          responseDocObject["ID"] = oListItem.get_item("ID");
          responseDocObject["title"] = oListItem.get_item("FileLeafRef");
          responseDocObject["folder"] = oListItem.get_item("FileDirRef");

          var modifiedDate = "";
          if (
            oListItem.get_item("Modified") != null &&
            oListItem.get_item("Modified") != ""
          )
            modifiedDate = oListItem
              .get_item("Modified")
              .format("MM/dd/yyyy hh:mm tt");
          responseDocObject["modifiedDate"] = modifiedDate;

          responseDocObject["modifiedBy"] =
            Audit.Common.Utilities.GetFriendlyDisplayName(oListItem, "Editor");

          oResponse["responseDocs"].push(responseDocObject);
        }
      }
    } catch (err) {
      alert(err);
    }
  }

  function PrintPage(pageTitle, divTbl) {
    var curDate = new Date();
    var siteUrl = Audit.Common.Utilities.GetSiteUrl();
    var cssLink1 =
      siteUrl +
      "/siteassets/css/tablesorter/style.css?v=" +
      curDate.format("MM_dd_yyyy");
    var cssLink2 =
      siteUrl +
      "/siteAssets/css/audit_styles.css?v=" +
      curDate.format("MM_dd_yyyy");

    var divOutput = $(divTbl).html();

    //remove hyperlinks pointing to the job codes
    var updatedDivOutput = $("<div>").append(divOutput);
    updatedDivOutput.find(".sr1-request-requestNum a").each(function () {
      $(this).removeAttr("onclick");
      $(this).removeAttr("href");
    });

    updatedDivOutput.find(".sr2-response-requestNum a").each(function () {
      $(this).removeAttr("onclick");
      $(this).removeAttr("href");
    });

    divOutput = updatedDivOutput.html();

    var printDateString = curDate.format("MM/dd/yyyy hh:mm tt");
    printDateString =
      "<div style='padding-bottom:10px;'>" + printDateString + "</div>";
    divOutput = printDateString + divOutput;

    var cssFile1 = $("<div></div>");
    var cssFile2 = $("<div></div>");

    var def1 = $.Deferred();
    var def2 = $.Deferred();

    var cssFileText = "";
    cssFile1.load(cssLink1, function () {
      cssFileText += "<style>" + cssFile1.html() + "</style>";
      def1.resolve();
    });
    cssFile2.load(cssLink2, function () {
      cssFileText += "<style>" + cssFile2.html() + "</style>";
      def2.resolve();
    });

    //gets called asynchronously after the css files have been loaded
    $.when(def1, def2).done(function () {
      var html =
        "<HTML>\n" +
        "<HEAD>\n\n" +
        "<Title>" +
        pageTitle +
        "</Title>\n" +
        cssFileText +
        "\n" +
        "<style>" +
        ".hideOnPrint, .rowFilters, .actionOfficeContainer {display:none}" +
        "</style>\n" +
        "</HEAD>\n" +
        "<BODY>\n" +
        divOutput +
        "\n" +
        "</BODY>\n" +
        "</HTML>";

      var printWP = window.open("", "printWebPart");
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
  function ExportToCsv(fileName, tableName, removeHeader) {
    var data = GetCellValues(tableName);

    if (removeHeader == true) data = data.slice(1);

    var csv = ConvertToCsv(data);
    //	console.log( csv );
    if (navigator.userAgent.search("Trident") >= 0) {
      window.CsvExpFrame.document.open("text/html", "replace");
      //		window.CsvExpFrame.document.open("application/csv", "replace");
      //		window.CsvExpFrame.document.charset = "utf-8";
      //		window.CsvExpFrame.document.open("application/ms-excel", "replace");
      window.CsvExpFrame.document.write(csv);
      window.CsvExpFrame.document.close();
      window.CsvExpFrame.focus();
      window.CsvExpFrame.document.execCommand(
        "SaveAs",
        true,
        fileName + ".csv"
      );
    } else {
      var uri = "data:text/csv;charset=utf-8," + escape(csv);
      var downloadLink = document.createElement("a");
      downloadLink.href = uri;
      downloadLink.download = fileName + ".csv";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  }

  function GetCellValues(tableName) {
    var table = document.getElementById(tableName);

    //remove headers and footers
    if (table.innerHTML.indexOf("rowFilters") >= 0) {
      var deets = $("<div>").append(table.outerHTML);
      deets.find(".rowFilters").each(function () {
        $(this).remove();
      });
      table = deets.find("table")[0];
    }
    if (table.innerHTML.indexOf("footer") >= 0) {
      var deets = $("<div>").append(table.outerHTML);
      deets.find(".footer").each(function () {
        $(this).remove();
      });
      table = deets.find("table")[0];
    }

    if (table.innerHTML.indexOf("actionOfficeContainer") >= 0) {
      var deets = $("<div>").append(table.outerHTML);
      deets.find(".actionOfficeContainer").each(function () {
        $(this).remove();
      });

      deets.find(".sr1-request-actionOffice-item").each(function () {
        var curText = $(this).text() + ", ";

        $(this).text(curText);
      });

      table = deets.find("table")[0];
    }

    var tableArray = [];
    for (var r = 0, n = table.rows.length; r < n; r++) {
      tableArray[r] = [];
      for (var c = 0, m = table.rows[r].cells.length; c < m; c++) {
        var text =
          table.rows[r].cells[c].textContent ||
          table.rows[r].cells[c].innerText;
        tableArray[r][c] = text.trim();
      }
    }
    return tableArray;
  }

  function ConvertToCsv(objArray) {
    var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    var str = "sep=,\r\n";
    var line = "";
    var index;
    var value;
    for (var i = 0; i < array.length; i++) {
      line = "";
      var array1 = array[i];
      for (index in array1) {
        if (array1.hasOwnProperty(index)) {
          value = array1[index] + "";
          line += '"' + value.replace(/"/g, '""') + '",';
        }
      }
      line = line.slice(0, -1);
      str += line + "\r\n";
    }
    return str;
  }

  var publicMembers = {
    Load: m_fnLoadData,
    Refresh: m_fnRefresh,
  };

  return publicMembers;
};
