import "../../common/utilities.js";

window.Audit = window.Audit || {};
Audit.EAReport = Audit.EAReport || {};

const html = String.raw;

const roDbTemplate = html`
  <div class="audit">
    <div style="padding-bottom: 10px">
      <a
        title="Refresh this page"
        href="javascript:void(0)"
        onclick="Audit.Common.Utilities.Refresh()"
        ><span class="ui-icon ui-icon-refresh"></span>Refresh</a
      >
      <span id="lblFilteredOn" style="padding-left: 10px"></span>
    </div>

    <div id="divExplorerView"></div>
  </div>
`;

document.getElementById("app").innerHTML = roDbTemplate;

var paramShowSiteActionsToAnyone = GetUrlKeyValue("ShowSiteActions");
if (paramShowSiteActionsToAnyone != true) {
  //hide it even for owners unless this param is passed into the URL; pass in param if you want to change the page web parts/settings
  //Hide Site Actions (fail safe even though master page does it)
  // document.getElementById("#RibbonContainer-TabRowLeft").style.display = "none";
  // document.getElementById("#s4-ribbonrow").style.display = "none";
}

if (document.readyState === "ready" || document.readyState === "complete") {
  InitReport();
} else {
  document.onreadystatechange = () => {
    if (document.readyState === "complete" || document.readyState === "ready") {
      InitReport();
    }
  };
}

function InitReport() {
  Audit.EAReport.Report = new Audit.EAReport.NewReportPage();
  Audit.EAReport.Init();
}

Audit.EAReport.Init = function () {};

Audit.EAReport.NewReportPage = function () {
  var path =
    location.protocol +
    "//" +
    location.host +
    Audit.Common.Utilities.GetSiteUrl() +
    "/" +
    Audit.Common.Utilities.GetLibTitleResponseDocsEA();
  //$("#divExplorerView").html( '<a href="#" onClick="javascript:CoreInvoke(\'NavigateHttpFolder\', \'http://cgfsauditst.rm.state.gov/sites/itaudit/AuditResponseDocsEA/\', \'_blank\');">View In Explorer</a>');
  // $("#divExplorerView").html(
  //   '<span class="ui-icon ui-icon-folder-open"></span><a title="Open documents in Explorer View" href="#" onClick="javascript:CoreInvoke(\'NavigateHttpFolder\', \'' +
  //     path +
  //     "', '_blank');\">View In Explorer</a>"
  // );

  var filterField = GetUrlKeyValue("FilterField1");
  var filterValue = GetUrlKeyValue("FilterValue1");

  if (filterField == "Modified" && filterValue != null && filterValue != "") {
    filterValue = filterValue.replace(/%2D/g, "/");
    filterValue = filterValue.replace(/-/g, "/");
    var modifiedDate = new Date(filterValue);
    modifiedDate = modifiedDate.format("M/d/yyyy");

    document.getElementById("lblFilteredOn").innerHTML =
      "Filtered Documents (<b>" +
      filterField +
      "</b> = <b>" +
      modifiedDate +
      "</b>)";
  } else if (
    filterField != null &&
    filterField != "" &&
    filterValue != null &&
    filterValue != ""
  ) {
    document.getElementById("lblFilteredOn").innerHTML =
      "Filtered Documents (<b>" +
      filterField +
      "</b> = <b>" +
      filterValue +
      "</b>)";
  } else {
    document.getElementById("lblFilteredOn").innerHTML = "";
  }
  var publicMembers = {
    //Load: m_fnLoadData
  };

  return publicMembers;
};
