var Audit = window.Audit || {};
Audit.DBAlerts = Audit.DBAlerts || {};

if (document.readyState === "ready" || document.readyState === "complete") {
  InitDBAlerts();
} else {
  document.onreadystatechange = () => {
    if (document.readyState === "complete" || document.readyState === "ready") {
      ExecuteOrDelayUntilScriptLoaded(function () {
        SP.SOD.executeFunc("sp.js", "SP.ClientContext", InitDBAlerts);
      }, "sp.js");
    }
  };
}

function InitDBAlerts() {
  Audit.DBAlerts.Report = new Audit.DBAlerts.NewAlertPage();
  Audit.DBAlerts.Init();
}

Audit.DBAlerts.Init = function () {};

Audit.DBAlerts.NewAlertPage = function () {
  LoadInfo();

  function LoadInfo() {
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    var curDate = new Date();
    var now = curDate.format("yyyy-MM-ddTHH:mm:ssZ");
    var auditAlertsList = web.get_lists().getByTitle("AuditAlerts");
    var auditListQuery = new SP.CamlQuery();
    //	auditListQuery.set_viewXml('<View><Query><Where><Or><IsNull><FieldRef Name="StartDate"/></IsNull><Leq><FieldRef Name="StartDate"/><Value Type="DateTime" IncludeTimeValue="TRUE">' +  now  + '</Value></Leq></Or></Where></Query></View>');
    auditListQuery.set_viewXml(
      '<View><Query><Where><And><Or><IsNull><FieldRef Name="StartDate"/></IsNull><Leq><FieldRef Name="StartDate"/><Value Type="DateTime" IncludeTimeValue="TRUE">' +
        now +
        '</Value></Leq></Or><Or><IsNull><FieldRef Name="EndDate"/></IsNull><Geq><FieldRef Name="EndDate"/><Value Type="DateTime" IncludeTimeValue="TRUE">' +
        now +
        "</Value></Geq></Or></And></Where></Query></View>"
    );
    m_alertItems = auditAlertsList.getItems(auditListQuery);
    currCtx.load(m_alertItems, "Include(ID, Title, Body)");

    currCtx.executeQueryAsync(OnSuccess, OnFailure);
    function OnSuccess(sender, args) {
      var count = 0;
      var output = "<div class='auditAlert'><ul>";
      var listItemEnumerator = m_alertItems.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();

        var title = oListItem.get_item("Title");
        var body = oListItem.get_item("Body");

        output += "<li>" + title + "<div>" + body + "</div></li>";
        count++;
      }
      output += "<ul><div>";

      if (count == 0) output = "";

      $("#divAlerts").html(output);
    }
    function OnFailure(sender, args) {
      statusId = SP.UI.Status.addStatus(
        "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
      );
    }
  }

  var publicMembers = {};

  return publicMembers;
};
