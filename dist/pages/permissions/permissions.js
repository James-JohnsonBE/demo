(()=>{var Qe=String.raw,Ve=Qe`
  <link
    rel="stylesheet"
    type="text/css"
    href="/sites/CGFS/Style Library/apps/audit/lib/jquery-ui-1.13.2/jquery-ui.theme.min.css"
  />
  <link
    rel="stylesheet"
    type="text/css"
    href="/sites/CGFS/Style Library/apps/audit/lib/tablesorter-2.31.3/css/theme.default.min.css"
  />

  <div class="audit">
    <iframe id="CsvExpFrame" style="display: none"></iframe>

    <div style="padding-bottom: 10px">
      <a
        id="btnRefresh"
        title="Refresh this page"
        style="display: none"
        href="javascript:void(0)"
        onclick="Audit.Permissions.Report.Refresh()"
        ><span class="ui-icon ui-icon-refresh"></span>Refresh</a
      >
    </div>

    <div id="divLoading" style="color: green; padding-bottom: 10px">
      Please Wait... Loading
    </div>

    <div id="divErrorMsg" style="color: red; padding-bottom: 10px"></div>

    <div id="tabs" style="display: none; margin-top: 20px">
      <ul>
        <li><a href="#tabs-0">Action Office Groups and Users</a></li>
        <li><a href="#tabs-1">Site Groups and Users</a></li>
        <li style="display: none"><a href="#tabs-2">Request Permissions</a></li>
        <li style="display: none">
          <a href="#tabs-3">Response Permissions</a>
        </li>
        <li style="display: none">
          <a href="#tabs-4">Response Folder Permissions</a>
        </li>
      </ul>

      <div id="tabs-0">
        <fieldset style="width: 300px">
          <legend>Actions</legend>
          <a
            style="display: none"
            id="btnPrint"
            title="Click here to Print"
            href="javascript:void(0)"
            class="hideOnPrint"
            ><span class="ui-icon ui-icon-print">Print</span></a
          >
          <a
            style="display: none"
            class="export hideOnPrint"
            title="Export to CSV"
            href="#"
            ><span class="ui-icon ui-icon-disk">Export to CSV</span></a
          >

          <div>
            <a
              id="linkGetVerification"
              title="Select Action Office(s) to Obtain Verification of User"
              disabled="disabled"
              href="javascript:void(0)"
              ><span class="ui-icon ui-icon-gear"></span>Obtain Action Office
              Verification</a
            >
          </div>
          <div>
            <a
              id="linkEmailHistory"
              title="View Email History"
              href="javascript:void(0)"
              ><span class="ui-icon ui-icon-search"></span>View Email History</a
            >
          </div>
          <div>
            <a
              id="linkUploadPermissions"
              title="Import Users to SharePoint Groups"
              href="javascript:void(0)"
              ><span class="ui-icon ui-icon-person"></span>Import Users into
              Groups</a
            >
          </div>
          <div>
            <a
              id="linkViewAO"
              title="View Action Offices"
              href="javascript:void(0)"
              ><span class="ui-icon ui-icon-search"></span>View Action Office
              Details</a
            >
          </div>
          <div>
            <a
              title="Add Action Office"
              href="#"
              id="linkAddAO"
              title="Add Action Office"
              ><span class="ui-icon ui-icon-circle-plus"></span>Add Action
              Office</a
            >
          </div>
        </fieldset>
        <div id="divTblOutput" style="width: 100%; padding-bottom: 10px">
          <table id="table_Groups" class="tablesorter">
            <thead>
              <tr>
                <th class="removeOnExport">
                  <input
                    class="cbAOAll"
                    id="cbAOAll"
                    type="checkbox"
                    style="cursor: pointer"
                  />
                  Check All?
                </th>
                <th>Action Office</th>
                <th>SharePoint Group Name</th>
                <th>
                  Users<a
                    id="linkViewExportFriendly"
                    style="float: right"
                    title="View Export Friendly"
                    href="javascript:void(0)"
                    ><span class="ui-icon ui-icon-gear"></span>View Export
                    Friendly</a
                  >
                </th>
              </tr>
            </thead>
            <tbody id="fbody"></tbody>
            <tfoot>
              <tr>
                <th colspan="4" style="text-align: left; white-space: nowrap">
                  Total: <span id="spanTotalAOS">0</span>
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div id="tabs-1">
        <div
          id="divTblSiteUsersOutput"
          style="width: 100%; padding-bottom: 10px"
        >
          <table id="table_SiteGroups" class="tablesorter">
            <thead>
              <tr>
                <th>SharePoint Group Name</th>
                <th>Users</th>
              </tr>
            </thead>
            <tbody id="fbodySPGroups"></tbody>
          </table>
        </div>
      </div>

      <div id="tabs-2">
        <table id="tblRequestsPermissions" class="tablesorter">
          <thead>
            <tr valign="top">
              <th class="sorter-false" nowrap="nowrap">
                <select id="ddlRequestID"></select>
              </th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
            </tr>
            <tr valign="top">
              <th class="sorter-false" nowrap="nowrap">Request Number</th>
              <th class="sorter-false" nowrap="nowrap">Status</th>
              <th class="sorter-false" nowrap="nowrap">Action Offices(s)</th>
              <th class="sorter-false" nowrap="nowrap">Special Perms?</th>
              <th class="sorter-false" nowrap="nowrap">Permissions</th>
            </tr>
          </thead>
          <tbody></tbody>
          <tfoot>
            <tr valign="top">
              <th nowrap="nowrap" colspan="5">
                Total: <span id="tblRequestsPermsTotal">0</span>
              </th>
            </tr>
          </tfoot>
        </table>
      </div>

      <div id="tabs-3" style="display: none">
        <table id="tblResponsePermissions" class="tablesorter">
          <thead>
            <tr valign="top">
              <th class="sorter-false" nowrap="nowrap">
                <select id="ddlResponseRequestID"></select>
              </th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
            </tr>
            <tr valign="top">
              <th class="sorter-false" nowrap="nowrap">Request Number</th>
              <th class="sorter-false" nowrap="nowrap">Response ID</th>
              <th class="sorter-false" nowrap="nowrap">Status</th>
              <th class="sorter-false" nowrap="nowrap">
                Request Action Offices(s)
              </th>
              <th class="sorter-false" nowrap="nowrap">
                Response Action Office
              </th>
              <th class="sorter-false" nowrap="nowrap">
                Request Special Perms?
              </th>
              <th class="sorter-false" nowrap="nowrap">
                Response Special Perms?
              </th>
              <th class="sorter-false" nowrap="nowrap">Permissions</th>
            </tr>
          </thead>
          <tbody></tbody>
          <tfoot>
            <tr valign="top">
              <th nowrap="nowrap" colspan="8">
                Total: <span id="tblResponsePermsTotal">0</span>
              </th>
            </tr>
          </tfoot>
        </table>
      </div>

      <div id="tabs-4" style="display: none">
        <table id="tblResponseFolderPermissions" class="tablesorter">
          <thead>
            <tr valign="top">
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap">
                <select id="ddlResponseFolderResponseID"></select>
              </th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false" nowrap="nowrap"></th>
            </tr>
            <tr valign="top">
              <th class="sorter-false" nowrap="nowrap">Request Number</th>
              <th class="sorter-false" nowrap="nowrap">Response ID</th>
              <th class="sorter-false" nowrap="nowrap">Folder Name</th>
              <th class="sorter-false" nowrap="nowrap">Response Status</th>
              <th class="sorter-false" nowrap="nowrap">
                Request Action Offices(s)
              </th>
              <th class="sorter-false" nowrap="nowrap">
                Response Action Office
              </th>
              <th class="sorter-false" nowrap="nowrap">
                Request Special Perms?
              </th>
              <th class="sorter-false" nowrap="nowrap">
                Response Special Perms?
              </th>
              <th class="sorter-false" nowrap="nowrap">
                Folder Special Perms?
              </th>
              <th class="sorter-false" nowrap="nowrap">Permissions</th>
            </tr>
          </thead>
          <tbody></tbody>
          <tfoot>
            <tr valign="top">
              <th nowrap="nowrap" colspan="10">
                Total: <span id="tblResponseFolderPermsTotal">0</span>
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
`;window.Audit=window.Audit||{};Audit.Common=Audit.Common||{};function je(){Audit.Common.Utilities=new Audit.Common.NewUtilities,Audit.Common.Init()}Audit.Common.Init=function(){};Audit.Common.NewUtilities=function(){var U=_spPageContextInfo.webServerRelativeUrl,E="AuditRequests",Oe="AuditRequests",N="AuditRequestsInternal",Z="AuditRequestsInternal",q="AuditResponses",H="AuditResponses",Q="AuditRequestDocs",M="AuditRequestDocs",V="AuditCoverSheets",j="AuditCoverSheets",W="AuditResponseDocs",z="AuditResponseDocs",oe="AuditResponseDocsEA",K="AuditResponseDocsEA",ae="AuditOrganizations",$e="AuditOrganizations",Te="AuditEmails",Ue="AuditEmails",F="AuditBulkResponses",ee="AuditBulkResponses",le="AuditBulkPermissions",ue="AuditBulkPermissions",ce="CGFS Special Access1",de="CGFS Special Access2",pe="Quality Assurance",Y="External Auditors",ie=null,I=null,L=null;function me(e=!1){if(e){location.href=location.pathname;return}var t=location.pathname;if($("#tabs").html()!=null&&$("#tabs").html()!=""){var r=0;try{r=$("#tabs").tabs("option","active")}catch{}if(t+="?Tab="+r,r==0&&$("#ddlResponseName").val()!="")t+="&ResNum="+$("#ddlResponseName").val();else if(r==1){var a=$("#ddlResponsesOpen").val(),d=$("#ddlResponsesProcessed").val();a!=null&&a!=""?t+="&ResNum="+a:d!=null&&d!=""&&(t+="&ResNum="+d)}location.href=t}else location.reload()}function re(){var e=new Date;$("#divLoading").text("Loaded at "+e.format("MM/dd/yyyy hh:mm tt"))}function te(){var e=GetUrlKeyValue("Tab");e!=null&&e!=""&&$("#tabs").tabs("option","active",e);var t=!1,r=GetUrlKeyValue("ResNum");r!=null&&r!=""&&(e==0?$("#ddlResponseName option[value='"+r+"']").length>0&&($("#ddlResponseName").val(r).change(),t=!0):$("#ddlResponsesOpen option[value='"+r+"']").length>0?$("#ddlResponsesOpen").val(r).change():$("#ddlResponsesProcessed option[value='"+r+"']").length>0&&$("#ddlResponsesProcessed").val(r).change()),t||$(".sr-response-item").show()}function xe(e,t){var r=0,a=0,d=0,p=0,u=0,h=$(".sr-response-item");h.each(function(){var y=$.trim($(this).find(".sr-response-requestStatus").text()),b=$.trim($(this).find(".sr-response-status").text());(b==e||b==t)&&(y=="Open"||y=="ReOpened")&&($(this).addClass("highlighted"),r++,b==e?p++:b==t&&u++,y=="Open"?a++:y=="ReOpened"&&d++)}),r>0?($("#lblStatusReportResponsesMsg").html("<span class='ui-icon ui-icon-alert'></span>There are "+r+" Responses pending your review"),p>0&&u==0?$("#ddlResponseStatus").val(e).change():u>0&&p==0&&$("#ddlResponseStatus").val(t).change()):$("#lblStatusReportResponsesMsg").html("<span class='ui-icon ui-icon-circle-check'></span>There are 0 Responses pending your review")}function fe(e){I=new Array;for(var t=e.getEnumerator();t.moveNext();){var r=t.get_current(),a=r.get_id(),d=r.get_loginName(),p=r.get_title(),u=new Object;u.ID=a,u.loginName=d,u.title=p,u.group=r,I.push(u)}}function ve(e){var t=null;if(I!=null){for(var r=0;r<I.length;r++)if(I[r].title==e){t=I[r].group;break}}return t}function he(e){L=new Array;for(var t=e.getEnumerator();t.moveNext();){var r=t.get_current(),a=r.get_item("ID"),d=r.get_item("Title"),p=r.get_item("UserGroup");p!=null?p=p.get_lookupValue():p="";var u=new Object;u.ID=a,u.title=d,u.userGroup=p,L.push(u)}}function ge(e){var t=null;if(L!=null)for(var r=0;r<L.length;r++){var a=L[r];if(a.title==e){t=a.userGroup;break}}return t}function we(e,t,r){if(e==null||t==""||t==null||r==null)return!1;var a=!1,d=e.get_roleAssignments();if(d==null)return alert("Error retrieving role assignments"),!1;for(var p=d.getEnumerator();p.moveNext();){var u=p.get_current();if(u!=null){var h=u.get_member();if(h.isPropertyAvailable("Title")){var y=h.get_title(),b=u.get_roleDefinitionBindings();if(b!=null)for(var P=b.getEnumerator();P.moveNext();){var R=P.get_current(),S=R.get_name();if(y==t&&R.get_basePermissions().has(r)){a=!0;break}}}}}return a}function se(e,t){if(!t){var r=!1;$("#ddlResponsesOpen > option").each(function(){if($(this).text()==e)return r=!0,notifyId=SP.UI.Notify.addNotification("Displaying Response ("+e+")",!1),$("#ddlResponsesOpen").val(e).change(),!1}),r||$("#ddlResponsesProcessed > option").each(function(){if($(this).text()==e)return r=!0,notifyId=SP.UI.Notify.addNotification("Displaying Response ("+e+")",!1),$("#ddlResponsesProcessed").val(e).change(),!1}),$("#tabs").tabs({active:1})}}function ye(e){var t={};return e=="Archived"?t={"background-color":"Gainsboro"}:e=="Approved"?t={"background-color":"PaleGreen"}:e=="Rejected"?t={"background-color":"LightSalmon"}:e=="Sent to QA"?t={"background-color":"LightCyan"}:e=="Submitted"?t={"background-color":"LemonChiffon"}:e=="Marked for Deletion"&&(t={"background-color":"Gainsboro","font-style":"italic"}),t}function Ae(e){var t="";return e=="Archived"?t=" style='background-color:Gainsboro;' ":e=="Approved"?t=" style='background-color:PaleGreen;' ":e=="Rejected"?t=" style='background-color:LightSalmon;' ":e=="Sent to QA"?t=" style='background-color:LightCyan;' ":e=="Submitted"?t=" style='background-color:LemonChiffon;' ":e=="Marked for Deletion"&&(t=" style='background-color:Gainsboro; font-style:italic' title='Marked for Deletion by the Action Office' "),t}function _e(e,t){for(var r=!1,a=e.getEnumerator();a.moveNext();){var d=a.get_current(),p=d.get_displayName();if(p==t){var r=!0;break}}return r}var J=0,B=0;function Pe(e,t,r,a){J=0,B=0;var d=new SP.ClientContext.get_current,p=d.get_web(),u=new SP.ListItemCreationInformation;u.set_underlyingObjectType(SP.FileSystemObjectType.folder),u.set_leafName(t),oNewEmailFolder=e.addItem(u),oNewEmailFolder.set_item("Title",t),oNewEmailFolder.update(),this.currentUser=p.get_currentUser(),this.ownerGroup=p.get_associatedOwnerGroup(),this.memberGroup=p.get_associatedMemberGroup(),this.visitorGroup=p.get_associatedVisitorGroup(),oNewEmailFolder.resetRoleInheritance(),oNewEmailFolder.breakRoleInheritance(!1,!1);var h=SP.RoleDefinitionBindingCollection.newObject(d);h.add(p.get_roleDefinitions().getByType(SP.RoleType.administrator));var y=SP.RoleDefinitionBindingCollection.newObject(d);y.add(p.get_roleDefinitions().getByType(SP.RoleType.contributor));var b=SP.RoleDefinitionBindingCollection.newObject(d);b.add(p.get_roleDefinitions().getByName("Restricted Read"));var P=SP.RoleDefinitionBindingCollection.newObject(d);P.add(p.get_roleDefinitions().getByName("Restricted Contribute")),oNewEmailFolder.get_roleAssignments().add(ownerGroup,h),oNewEmailFolder.get_roleAssignments().add(memberGroup,y),oNewEmailFolder.get_roleAssignments().add(visitorGroup,b);var R=Audit.Common.Utilities.GetSPSiteGroup(Audit.Common.Utilities.GetGroupNameQA());R!=null&&oNewEmailFolder.get_roleAssignments().add(R,P),oNewEmailFolder.get_roleAssignments().getByPrincipal(currentUser).deleteObject();function S(){if(this.requestItem){var C=this.requestItem.get_item("ActionOffice");if(C==null||C.length==0){this.OnComplete&&this.OnComplete(!0);return}for(var k=0;k<C.length;k++){var Ce=C[k].get_lookupValue(),qe=Audit.Common.Utilities.GetAOSPGroupName(Ce),Ee=Audit.Common.Utilities.GetSPSiteGroup(qe);if(Ee!=null){let Le=function(){B++,B==J&&this.OnComplete&&this.OnComplete(!0)},Me=function(Ye,Je){B++,B==J&&this.OnComplete&&this.OnComplete(!0)};var We=Le,Ke=Me;J++;var De=new SP.ClientContext.get_current,He=De.get_web(),Fe=SP.RoleDefinitionBindingCollection.newObject(De);Fe.add(He.get_roleDefinitions().getByName("Restricted Contribute")),this.oNewEmailFolder.get_roleAssignments().add(Ee,Fe);var Ie={OnComplete:this.OnComplete};De.executeQueryAsync(Function.createDelegate(Ie,Le),Function.createDelegate(Ie,Me))}}}else this.OnComplete&&this.OnComplete(!0)}function x(C,k){statusId=SP.UI.Status.addStatus("Request failed: "+k.get_message()+`
`+k.get_stackTrace())}var T={requestItem:r,oNewEmailFolder,OnComplete:a};d.executeQueryAsync(Function.createDelegate(T,S),Function.createDelegate(T,x))}function ne(e,t){var r=e,a=t;let d,p;r==null&&(r=""),a==null&&(a="");var u=r.lastIndexOf("-");if(u>=0){var h=r.substring(0,u+1),y=r.replace(h,""),b=parseInt(y,10),P=Audit.Common.Utilities.PadDigits(b,5);d=h+P}else d=r;var R=a.lastIndexOf("-");if(R>=0){var S=a.substring(0,R+1),x=a.replace(S,""),T=parseInt(x,10),C=Audit.Common.Utilities.PadDigits(T,5);p=S+C}else p=a;return d.toLowerCase().localeCompare(p.toLowerCase())}function be(e,t){var r=e.title,a=t.title,d,p;r==null&&(r=""),a==null&&(a="");var u=r.lastIndexOf("-");if(u>=0){var h=r.substring(0,u+1),y=r.replace(h,""),b=parseInt(y,10),P=Audit.Common.Utilities.PadDigits(b,5);d=h+P}else d=r;var R=a.lastIndexOf("-");if(R>=0){var S=a.substring(0,R+1),x=a.replace(S,""),T=parseInt(x,10),C=Audit.Common.Utilities.PadDigits(T,5);p=S+C}else p=a;return d.toLowerCase().localeCompare(p.toLowerCase())}function Ge(e,t){return e.toLowerCase().localeCompare(t.toLowerCase())}function Se(e,t){return e==""?-1:t==""?1:new Date(e).getTime()-new Date(t).getTime()}function Ne(e,t,r,a){if(e!=null){a?e.sort(ne):r?e.sort(Se):e.sort(Ge);var d=new Array,p=-1;d[++p]="<option value=''>-Select-</option>";for(var u=e.length,h=0;h<u;h++){var y=$.trim(e[h]);d[++p]="<option value='"+y+"'>"+y+"</option>"}var b=$(t);b.empty().append(d.join(""))}}function ke(e,t){if(e==null)return!1;for(var r=e.length,a=0;a<r;a++)if(e[a]==t)return!0;return!1}function X(e){return e==!0?"<span class='ui-icon ui-icon-check'>"+e+"</span>":"<span class='ui-icon ui-icon-close'>"+e+"</span>"}function Re(e,t){var r=e.get_item(t);return r==null?"":r.get_lookupValue()}function i(e,t){e=e.toString();var r="";if(t>e.length)for(let a=0;a<t-e.length;a++)r+="0";return r+e.toString()}function s(e,t){var r=e>=0?1:-1;return(Math.round(e*Math.pow(10,t)+r*.001)/Math.pow(10,t)).toFixed(t)}function l(e){return e==null||e==""?"":(e>1048576?e=Audit.Common.Utilities.PreciseRound(e/1048576,2)+" MB":e>1024?e=Audit.Common.Utilities.PreciseRound(e/1024,2)+" KB":e+=" B",e)}function n(e){function t(r){return r<10?"0"+r:r}return e.getUTCFullYear()+"-"+t(e.getUTCMonth()+1)+"-"+t(e.getUTCDate())+"T"+t(e.getUTCHours())+":"+t(e.getUTCMinutes())+":"+t(e.getUTCSeconds())+"Z"}function m(){$(".requestInfo-response-doc img").click(function(e){e.preventDefault();var t=$(this).attr("src");t=="/_layouts/images/minus.gif"?$(this).attr("src","/_layouts/images/plus.gif"):$(this).attr("src","/_layouts/images/minus.gif"),$(this).parent().parent().nextUntil("tr.requestInfo-response-doc").each(function(){$(this).toggleClass("collapsed")})})}function g(e){return $("select[title='"+e+"']").html()!==null?$("select[title='"+e+"']"):$("input[title='"+e+"']")}function w(e){return $("select[title='"+e+"']").html()!==null?$("select[title='"+e+"'] option:selected").text():$("input[title='"+e+"']").val()}function _(e,t){try{if(t==null)return;var r=c("select","",e);if(r==null){var a=c("input","",e);ShowDropdown(a.id);var d=document.getElementById(a.opt);O(d,t),OptLoseFocus(d)}else O(r,t)}catch{}}function O(e,t){var r=e.options,a=r.length;if(e!=null){for(var d=0;d<a;d++)if(r[d].text==t)return e.selectedIndex=d,!0;return!1}}function c(e,t,r){for(var a=t.length,d=document.getElementsByTagName(e),p=0;p<d.length;p++){var u=d[p].id;if(d[p].title==r&&(t==""||u.indexOf(t)==u.length-a))return d[p]}return null}function v(e){var t=SP.UI.$create_DialogOptions();t.title="User Manual",t.height=250,e!=null?t.url=Audit.Common.Utilities.GetSiteUrl()+"/pages/AuditUserManuals.aspx?FilterField1=DocType&FilterValue1="+e:t.url=Audit.Common.Utilities.GetSiteUrl()+"/pages/AuditUserManuals.aspx",SP.UI.ModalDialog.showModalDialog(t)}function o(e,t){var r=new Date,a=Audit.Common.Utilities.GetSiteUrl(),d=a+"/siteassets/css/tablesorter/style.css?v="+r.format("MM_dd_yyyy"),p=a+"/siteAssets/css/audit_styles.css?v="+r.format("MM_dd_yyyy"),u=$(t).html(),h=$("<div>").append(u);h.find(".sr-response-title a").each(function(){$(this).removeAttr("onclick"),$(this).removeAttr("href")}),u=h.html();var y=r.format("MM/dd/yyyy hh:mm tt");y="<div style='padding-bottom:10px;'>"+y+"</div>",u=y+u;var b=$("<div></div>"),P=$("<div></div>"),R=$.Deferred(),S=$.Deferred(),x="";b.load(d,function(){x+="<style>"+b.html()+"</style>",R.resolve()}),P.load(p,function(){x+="<style>"+P.html()+"</style>",S.resolve()}),$.when(R,S).done(function(){var T=`<HTML>
<HEAD>

<Title>`+e+`</Title>
`+x+`
<style>.hideOnPrint, .rowFilters {display:none}</style>
</HEAD>
<BODY>
`+u+`
</BODY>
</HTML>`,C=window.open("","printWebPart");C.document.open(),C.document.write(T),C.document.close(),C.print()})}function f(e,t,r){var a=D(t);r==!0&&(a=a.slice(1));var d=G(a);if(navigator.userAgent.search("Trident")>=0)window.CsvExpFrame.document.open("text/html","replace"),window.CsvExpFrame.document.write(d),window.CsvExpFrame.document.close(),window.CsvExpFrame.focus(),window.CsvExpFrame.document.execCommand("SaveAs",!0,e+".csv");else{var p="data:text/csv;charset=utf-8,"+escape(d),u=document.createElement("a");u.href=p,u.download=e+".csv",document.body.appendChild(u),u.click(),document.body.removeChild(u)}}function D(e){var t=document.getElementById(e);if(t.innerHTML.indexOf("rowFilters")>=0){var r=$("<div>").append(t.outerHTML);r.find(".rowFilters").each(function(){$(this).remove()}),t=r.find("table")[0]}if(t.innerHTML.indexOf("footer")>=0){var r=$("<div>").append(t.outerHTML);r.find(".footer").each(function(){$(this).remove()}),t=r.find("table")[0]}for(var a=[],d=0,p=t.rows.length;d<p;d++){a[d]=[];for(var u=0,h=t.rows[d].cells.length;u<h;u++){var y=t.rows[d].cells[u].textContent||t.rows[d].cells[u].innerText;a[d][u]=y.trim()}}return a}function G(e){for(var t=typeof e!="object"?JSON.parse(e):e,r=`sep=,\r
`,a="",d,p,u=0;u<t.length;u++){a="";var h=t[u];for(d in h)h.hasOwnProperty(d)&&(p=h[d]+"",a+='"'+p.replace(/"/g,'""')+'",');a=a.slice(0,-1),r+=a+`\r
`}return r}var A={GetSiteUrl:function(){return U=="/"?"":U},GetListTitleRequests:function(){return E},GetListNameRequests:function(){return Oe},GetListTitleRequestsInternal:function(){return N},GetListNameRequestsInternal:function(){return Z},GetListTitleResponses:function(){return q},GetListNameResponses:function(){return H},GetLibTitleRequestDocs:function(){return Q},GetLibNameRequestDocs:function(){return M},GetLibTitleCoverSheets:function(){return V},GetLibNameCoverSheets:function(){return j},GetLibTitleResponseDocs:function(){return W},GetLibNameResponseDocs:function(){return z},GetLibTitleResponseDocsEA:function(){return oe},GetLibNameResponseDocsEA:function(){return K},GetListTitleActionOffices:function(){return ae},GetListNameActionOffices:function(){return $e},GetListTitleEmailHistory:function(){return Te},GetListNameEmailHistory:function(){return Ue},GetListTitleBulkResponses:function(){return F},GetListNameBulkResponses:function(){return ee},GetListTitleBulkPermissions:function(){return le},GetListNameBulkPermissions:function(){return ue},GetGroupNameSpecialPerm1:function(){return ce},GetGroupNameSpecialPerm2:function(){return de},GetGroupNameQA:function(){return pe},GetGroupNameEA:function(){return Y},Refresh:me,OnLoadDisplayTimeStamp:re,OnLoadDisplayTabAndResponse:te,OnLoadFilterResponses:function(e,t){xe(e,t)},SetResponseDocLibGUID:function(e){ie=e},GetResponseDocLibGUID:function(){return ie},LoadSiteGroups:function(e){fe(e)},GetSPSiteGroup:function(e){return ve(e)},LoadActionOffices:function(e){he(e)},GetActionOffices:function(){return L},GetAOSPGroupName:function(e){return ge(e)},CheckSPItemHasGroupPermission:function(e,t,r){return we(e,t,r)},GoToResponse:function(e,t){se(e,t)},GetResponseDocStyleTag:function(e){return Ae(e)},GetResponseDocStyleTag2:function(e){return ye(e)},CheckIfEmailFolderExists:function(e,t){return _e(e,t)},CreateEmailFolder:function(e,t,r,a){return Pe(e,t,r,a)},AddOptions:function(e,t,r,a){Ne(e,t,r,a)},ExistsInArr:function(e,t){return ke(e,t)},GetTrueFalseIcon:function(e){return X(e)},PadDigits:function(e,t){return i(e,t)},PreciseRound:function(e,t){return s(e,t)},GetFriendlyFileSize:function(e){return l(e)},GetISODateString:function(e){return n(e)},GetFriendlyDisplayName:function(e,t){return Re(e,t)},BindHandlerResponseDoc:m,PrintStatusReport:function(e,t){o(e,t)},ExportToCsv:function(e,t,r){f(e,t,r)},ViewUserManuals:function(e){v(e)},GetLookupDisplayText:function(e){return w(e)},GetLookupFormField:function(e){return g(e)},SetLookupFromFieldNameByText:function(e,t){return _(e,t)},SortResponseObjects:function(e,t){return be(e,t)},SortResponseTitles:ne};return A};je();window.Audit=window.Audit||{};Audit.Permissions=Audit.Permissions||{};document.getElementById("app").innerHTML=Ve;document.readyState==="ready"||document.readyState==="complete"?Be():document.onreadystatechange=()=>{(document.readyState==="complete"||document.readyState==="ready")&&ExecuteOrDelayUntilScriptLoaded(function(){SP.SOD.executeFunc("sp.js","SP.ClientContext",Be)},"sp.js")};function Be(){Audit.Permissions.Report=new Audit.Permissions.Load,Audit.Permissions.Init()}Audit.Permissions.Init=function(){};Audit.Permissions.Load=function(){var U=new Array,E=new Array,Oe=new Array,N=null,Z=null,q=null,H=null,Q=null,M,V,j=null,W="AOVerifications",z=new Object;oe();function oe(){var i=new SP.ClientContext.get_current,s=i.get_web(),l=s.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleActionOffices()),n=new SP.CamlQuery;n.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>');var m=l.getItems(n);i.load(m,"Include(ID, Title, UserGroup)");var g=s.get_associatedOwnerGroup(),w=s.get_associatedMemberGroup(),_=s.get_associatedVisitorGroup();i.load(g),i.load(w),i.load(_),i.executeQueryAsync(O,c);function O(v,o){Audit.Common.Utilities.LoadActionOffices(m),q=g.get_title(),H=w.get_title(),Q=_.get_title(),$("#tabs").tabs().show(),he(),Audit.Common.Utilities.OnLoadDisplayTimeStamp(),ae();var f=GetUrlKeyValue("IsDlg");(f==null||f==""||f==!1)&&$("#btnRefresh").show();var D=!1;ue(function(G){G&&(ce(),de())})}function c(v,o){$("#divLoading").hide(),statusId=SP.UI.Status.addStatus("Request failed: "+o.get_message()+`
`+o.get_stackTrace()),SP.UI.Status.setStatusPriColor(statusId,"red")}}function K(){var i=location.pathname,s=$("#tabs").tabs("option","active");i+="?Tab="+s,location.href=i}function ae(){var i=GetUrlKeyValue("Tab");i!=null&&i!=""&&$("#tabs").tabs("option","active",i)}function $e(){U=new Array;var i=SP.ClientContext.get_current(),s=i.get_web();this.ownerGroup=s.get_associatedOwnerGroup(),this.memberGroup=s.get_associatedMemberGroup(),this.visitorGroup=s.get_associatedVisitorGroup();for(var l=m_requestItems.getEnumerator();l.moveNext();){for(var n=l.get_current(),m=n.get_item("ID"),g=n.get_item("Title"),w=n.get_item("ReqStatus"),_=n.get_item("IsSample"),O=n.get_item("ActionOffice"),c="",v=0;v<O.length;v++)c+="<div>"+O[v].get_lookupValue()+"</div>";var o=new Object;o.ID=m,o.number=g,o.status=w,o.sample=_,o.responses=new Array,o.actionOffice=c,o.item=n,ee(o,n),U.push(o)}for(var f=new Array,D=0,G="",A=new Array,e=-1,t=U.length,v=0;v<t;v++){var r=U[v],g=r.number;f.push(g);for(var w=r.status,a=r.actionOffice,d=r.permissionsDisplay,p=Audit.Common.Utilities.GetTrueFalseIcon(r.hasSpecialPermissions),u=!1,h="",y=0;y<r.item.get_item("ActionOffice").length;y++){for(var b=r.item.get_item("ActionOffice")[y].get_lookupValue(),P=Audit.Common.Utilities.GetAOSPGroupName(b),R=!1,S=0;S<r.arrUserPermissions.length;S++)r.arrUserPermissions[S].name==P&&(R=!0);for(var S=0;S<r.arrGroupPermissions.length;S++)r.arrGroupPermissions[S].name==P&&(R=!0);R||(h=' title="Missing Action Office in this set of Permissions" ',u=!0)}if(!u){for(var x=!1,S=0;S<r.arrUserPermissions.length;S++){for(var T=!1,C=r.arrUserPermissions[S].name,y=0;y<r.item.get_item("ActionOffice").length;y++){var b=r.item.get_item("ActionOffice")[y].get_lookupValue(),P=Audit.Common.Utilities.GetAOSPGroupName(b);C==P&&(T=!0)}if(T||(C==q||C==H||C==Q||C==Audit.Common.Utilities.GetGroupNameQA()||C==Audit.Common.Utilities.GetGroupNameSpecialPerm1()||C==Audit.Common.Utilities.GetGroupNameSpecialPerm2()?T=!0:T=!1),!T){x=!0;break}}for(var S=0;S<r.arrGroupPermissions.length;S++){for(var T=!1,C=r.arrGroupPermissions[S].name,y=0;y<r.item.get_item("ActionOffice").length;y++){var b=r.item.get_item("ActionOffice")[y].get_lookupValue(),P=Audit.Common.Utilities.GetAOSPGroupName(b);C==P&&(T=!0)}if(T||(C==q||C==H||C==Q||C==Audit.Common.Utilities.GetGroupNameQA()||C==Audit.Common.Utilities.GetGroupNameSpecialPerm1()||C==Audit.Common.Utilities.GetGroupNameSpecialPerm2()?T=!0:T=!1),!T){x=!0;break}}x&&(h=' title="User or Group found in this set of Permissions that does not belong" ',u=!0)}var k="";u&&(k=' style="background-color:lightsalmon" '+h,D++);var Ce=`<a href="javascript:void(0);" onclick='Audit.Permissions.Report.GoToRequest("`+r.number+`")'>`+r.number+"</a>";A[++e]='<tr class="request-perm-item" ',A[++e]=k,A[++e]=">",A[++e]='<td class="request-perm-item-number" title="Request number">',A[++e]=Ce,A[++e]="</td>",A[++e]='<td class="request-perm-item-status" title="Request status">',A[++e]=w,A[++e]="</td>",A[++e]='<td class="request-perm-item-actionOffices" title="Request action offices">',A[++e]=a,A[++e]="</td>",A[++e]='<td class="request-perm-item-specialPerms" title="Request special permissions?">',A[++e]=p,A[++e]="</td>",A[++e]='<td class="request-perm-item-perms" title="Request permissions">',A[++e]=d,A[++e]="</td>",A[++e]="</tr>"}$("#tblRequestsPermissions tbody").append(A.join("")),$("#tblRequestsPermsTotal").text(U.length),D>0&&$("#divErrorMsg").html($("#divErrorMsg").html()+"<div><fieldset><legend>Request Permissions</legend><span class='ui-icon ui-icon-alert'></span>There are ("+D+") Requests with Permission issues detected</fielset></div>"),Audit.Common.Utilities.AddOptions(f,"#ddlRequestID",!1)}function Te(){E=new Array;for(var i=m_responseItems.getEnumerator();i.moveNext();){var s=i.get_current(),l=s.get_item("ReqNum");if(l!=null){l=l.get_lookupValue();var n=new Object;n.ID=s.get_item("ID"),n.number=l,n.title=s.get_item("Title"),n.item=s,n.sample=s.get_item("SampleNumber"),n.sample==null&&(n.sample=""),n.actionOffice=s.get_item("ActionOffice"),n.actionOffice==null?n.actionOffice="":n.actionOffice=n.actionOffice.get_lookupValue(),n.resStatus=s.get_item("ResStatus"),ee(n,s),E.push(n)}}for(var m=new Array,g=new Array,w=new Array,_=0,O="",c=new Array,v=-1,o=E.length,f=0;f<o;f++){for(var D=E[f],l=D.number,G=D.title,A=D.resStatus,e=D.actionOffice,t=D.permissionsDisplay,r=Audit.Common.Utilities.GetTrueFalseIcon(D.hasSpecialPermissions),a=!1,d="",p=null,u="",h=0;h<U.length;h++)if(U[h].number==l){a=U[h].hasSpecialPermissions,d=Audit.Common.Utilities.GetTrueFalseIcon(U[h].hasSpecialPermissions),p=U[h].item.get_item("ActionOffice"),u=U[h].actionOffice;break}var y=!1;!a&&D.hasSpecialPermissions&&(y=!0,m.push(G)),D.hasSpecialPermissions&&A!="4-Approved for QA"&&A!="7-Closed"&&(y=!0,g.push(G));for(var b=!1,h=0;h<p.length;h++)p[h].get_lookupValue()==e&&(b=!0);b||(y=!0,w.push(G));var P="";y&&(P=' style="background-color:lightsalmon" ',_++);var R=`<a href="javascript:void(0);" onclick='Audit.Permissions.Report.GoToResponse("`+G+`")'>`+G+"</a>";u=u.replace(e,"<b>"+e+"</b>"),c[++v]='<tr class="response-perm-item" ',c[++v]=P,c[++v]=">",c[++v]='<td class="response-perm-item-number" title="Request number" nowrap>',c[++v]=l,c[++v]="</td>",c[++v]='<td class="response-perm-item-title" title="Response title" nowrap>',c[++v]=R,c[++v]="</td>",c[++v]='<td class="response-perm-item-status" title="Response status" nowrap>',c[++v]=A,c[++v]="</td>",c[++v]='<td class="response-perm-item-requestActionOffices" title="Request action offices" nowrap>',c[++v]=u,c[++v]="</td>",c[++v]='<td class="response-perm-item-actionOffice" title="Response action office">',c[++v]=e,c[++v]="</td>",c[++v]='<td class="response-perm-item-requestSpecialPerms" title="Special permissions?">',c[++v]=d,c[++v]="</td>",c[++v]='<td class="response-perm-item-specialPerms" title="Special permissions">',c[++v]=r,c[++v]="</td>",c[++v]='<td class="response-perm-item-perms" title="Response permissions" nowrap>',c[++v]=t,c[++v]="</td></tr>"}if($("#tblResponsePermissions tbody").append(c.join("")),$("#tblResponsePermsTotal").text(E.length),_>0){var S=F(m,"These Responses have Special Permisions, but their Requests do not"),x=F(g,"These Responses have Special Permisions, but their Response Status is NOT '4-Approved for QA' or '7-Closed'"),T=F(w,"These Responses have an Action Office that is not specified in the Request's Action Offices");$("#divErrorMsg").html($("#divErrorMsg").html()+"<div style='padding-bottom:5px;'><fieldset><legend>Response Permissions</legend><span class='ui-icon ui-icon-alert'></span>There are ("+_+") Responses with Permission issues detected."+S+x+T+"</fielset></div>")}}function Ue(){for(var i=new Array,s=m_ResponseDocsFoldersItems.getEnumerator();s.moveNext();)for(var l=s.get_current(),n=l.get_displayName(),m=0;m<E.length;m++)if(E[m].title==n){var g=new Object;g.title=n,g.response=E[m],ee(g,l),i.push(g);break}for(var w=new Array,_=new Array,O=new Array,c=0,v="",o=new Array,f=-1,D=i.length,m=0;m<D;m++){for(var G=i[m],A=G.response.number,e=G.response.title,n=G.title,t=G.response.resStatus,r=G.response.actionOffice,a=G.response.permissionsDisplay,d=Audit.Common.Utilities.GetTrueFalseIcon(G.hasSpecialPermissions),p=Audit.Common.Utilities.GetTrueFalseIcon(G.response.hasSpecialPermissions),u=!1,h="",y=null,b="",P=0;P<U.length;P++)if(U[P].number==A){u=U[P].hasSpecialPermissions,h=Audit.Common.Utilities.GetTrueFalseIcon(U[P].hasSpecialPermissions),y=U[P].item.get_item("ActionOffice"),b=U[P].actionOffice;break}var R=!1;!u&&G.response.hasSpecialPermissions&&(R=!0,w.push(e)),G.response.hasSpecialPermissions&&t!="4-Approved for QA"&&t!="7-Closed"&&(R=!0,_.push(e));for(var S=!1,P=0;P<y.length;P++)y[P].get_lookupValue()==r&&(S=!0);S||(R=!0,O.push(e));var x="";R&&(x=' style="background-color:lightsalmon" ',c++),b=b.replace(r,"<b>"+r+"</b>"),o[++f]='<tr class="responseFolder-perm-item" ',o[++f]=x,o[++f]=">",o[++f]='<td class="responseFolder-perm-item-number" title="Request number" nowrap>',o[++f]=A,o[++f]="</td>",o[++f]='<td class="responseFolder-perm-item-responseTitle" title="Response title">',o[++f]=e,o[++f]="</td>",o[++f]='<td class="responseFolder-perm-item-title" title="Response folder" nowrap>',o[++f]=n,o[++f]="</td>",o[++f]='<td class="responseFolder-perm-item-status" title="Response status" nowrap>',o[++f]=t,o[++f]="</td>",o[++f]='<td class="responseFolder-perm-item-requestActionOffices" title="Request action offices" nowrap>',o[++f]=b,o[++f]="</td>",o[++f]='<td class="responseFolder-perm-item-responseActionOffice" title="Response action office" nowrap>',o[++f]=r,o[++f]="</td>",o[++f]='<td class="responseFolder-perm-item-requestSpecialPerms" title="Request special permissions?" nowrap>',o[++f]=h,o[++f]="</td>",o[++f]='<td class="responseFolder-perm-item-responseSpecialPerms" title="Response special permissions?" nowrap>',o[++f]=d,o[++f]="</td>",o[++f]='<td class="responseFolder-perm-item-specialPerms" title="Response folder special permissions" nowrap>',o[++f]=p,o[++f]="</td>",o[++f]='<td class="responseFolder-perm-item-perms" title="Folder permissions" nowrap>',o[++f]=a,o[++f]="</td></tr>"}if($("#tblResponseFolderPermissions tbody").append(o.join("")),$("#tblResponseFolderPermsTotal").text(i.length),c>0){var T=F(w,"These Response Folders have Special Permisions, but their Requests do not"),C=F(_,"These Response Folders have Special Permisions, but their Reponse Status is NOT '4-Approved for QA' or '7-Closed'"),k=F(O,"These Response Folders have an Action Office that is not specified in the Request's Action Offices");$("#divErrorMsg").html($("#divErrorMsg").html()+"<div style='padding-bottom:5px;'><fieldset><legend>Response Folder Permissions</legend><span class='ui-icon ui-icon-alert'></span>There are ("+c+") Response Folders with Permission issues detected."+T+C+k+"</fieldset></div>")}}function F(i,s){var l="";if(i.length>0){l="<div style='padding-bottom:5px;'>"+s+"<ul>";for(var n=0;n<i.length;n++)l+="<li>"+i+"</li>";l+="</ul></div>"}return l}function ee(i,s){i.UserPermissions=new Array,i.GroupPermissions=new Array,i.arrUserPermissions=new Array,i.arrGroupPermissions=new Array;for(var l=s.get_roleAssignments(),n=l.getEnumerator();n.moveNext();){var m=n.get_current(),g=m.get_member(),w=g.get_loginName(),_=g.get_title(),O="UserPermissions",c=g.get_principalType();(c==SP.Utilities.PrincipalType.securityGroup||c==SP.Utilities.PrincipalType.sharePointGroup)&&(O="GroupPermissions");for(var v=m.get_roleDefinitionBindings(),o=v.getEnumerator();o.moveNext();){var f=o.get_current(),D=f.get_name();i[O].push(D+" - "+_);var G=new Object;G.name=_,G.permissionLevel=D,i["arr"+O].push(G)}}for(var A="",e=0;e<i.UserPermissions.length;e++)A+="<div style='white-space:nowrap'>"+i.UserPermissions[e]+"</div>";for(var e=0;e<i.GroupPermissions.length;e++)A+="<div style='white-space:nowrap'>"+i.GroupPermissions[e]+"</div>";var t=!1;A.indexOf(Audit.Common.Utilities.GetGroupNameSpecialPerm1())>=0&&A.indexOf(Audit.Common.Utilities.GetGroupNameSpecialPerm2())>=0&&(t=!0),A!=""&&(A="<div class='permsLink' style='cursor:pointer' title='Click to view' ><a href='javascript:void(0)'>View</a><div class='permsInfo collapsed'>"+A+"</div></div>"),i.permissionsDisplay=A,i.hasSpecialPermissions=t}function le(){$(".permsLink").click(function(){$(this).find(".permsInfo").toggleClass("collapsed")})}function ue(i){N=new Array;var s=new SP.ClientContext.get_current,l=s.get_web();Z=s.get_web().get_siteGroups(),s.load(Z);function n(g,w){N=new Array;for(var _=Z.getEnumerator();_.moveNext();){var O=_.get_current(),c=O.get_title();c=$.trim(c);var v=O.get_id(),o=new Object;o.Title=c,o.ID=v,o.Users=null,N.push(o)}i(!0)}function m(g,w){i(!0)}s.executeQueryAsync(n,m)}function ce(i){z=new Object,$("#linkGetVerification").prop("disabled",!0);for(var s=Audit.Common.Utilities.GetActionOffices(),l="",n=0,m=0;m<s.length;m++){var g=s[m].title;if(!(g.indexOf("Select Action")>0)){n++;var w=s[m].userGroup,_="",O="";if(w!=null&&w!=""){for(var c=0;c<N.length;c++)if(N[c].Title==w){_=N[c].ID;break}}_!=""?l+="<tr class='trGroup'><td class='removeOnExport'><input class='cbAO' id='cbAO"+m+"' type='checkbox' style='cursor: pointer;'></td><td class='actionOfficeName'>"+g+`</td><td class='groupName' style='white-space:nowrap'><a href='javascript:void(0)' onclick='Audit.Permissions.Report.ViewSitePermissionsGroup("`+_+'","'+w+`")'>`+w+"</a></td><td class='groupPerms' id='groupPerms"+m+"' ></td></tr>":l+="<tr class='trGroup'><td class='removeOnExport'><input class='cbAO' id='cbAO"+m+"' type='checkbox' style='cursor: pointer;'></td><td class='actionOfficeName'>"+g+"</td><td class='groupName' style='white-space:nowrap'></td><td class='groupPerms' id='groupPerms"+m+"' ></td></tr>"}}s.length==0?l="<div>0 Action Groups found</div>":($("#fbody").html(l),$("#spanTotalAOS").text(n)),$(".cbAO").click(function(){var t=0;$(".cbAO").each(function(){if($(this).is(":checked")){t++;return}}),t>0?$("#linkGetVerification").prop("disabled",!1):$("#linkGetVerification").prop("disabled",!0)});for(var v=0,m=0;m<s.length;m++){var g=s[m].title;if(!(g.indexOf("Select Action")>0)){for(var w=s[m].userGroup,_=null,c=0;c<N.length;c++)if(N[c].Title==w){_=N[c].ID;break}if(_!=null){let p=function(){for(var h=new Array,y=this.collUser.getEnumerator();y.moveNext();){var b=y.get_current(),P=b.get_loginName()+" ("+b.get_title()+")";h.push(P)}h=h.sort();for(var R="",S=0;S<h.length;S++)R+=h[S]+"; ";$("#groupPerms"+this.x).html(te(R)),z[this.groupName]=R},u=function(h,y){};v++;var o=new SP.ClientContext.get_current,f=o.get_web(),D=f.get_siteGroups(),G=D.getById(_),A=G.get_users();o.load(A);var e={x:m,groupName:w,collUser:A};o.executeQueryAsync(Function.createDelegate(e,p),Function.createDelegate(e,u))}}}}function de(i){var s=Audit.Common.Utilities.GetActionOffices(),l="",n=new Array;n.push(q),n.push(H),n.push(Q),n.push(Audit.Common.Utilities.GetGroupNameQA()),n.push(Audit.Common.Utilities.GetGroupNameEA()),n.push(Audit.Common.Utilities.GetGroupNameSpecialPerm1()),n.push(Audit.Common.Utilities.GetGroupNameSpecialPerm2());for(var m=0,g=0;g<n.length;g++){m++;for(var w=n[g],_="",O="",c=0;c<N.length;c++)if(N[c].Title==w){_=N[c].ID;break}l+=`<tr class='trSPGroup'><td class='spgroupName' style='white-space:nowrap'><a href='javascript:void(0)' onclick='Audit.Permissions.Report.ViewSitePermissionsGroup("`+_+'","'+w+`")'>`+w+"</a></td><td class='spgroupPerms' id='spgroupPerms"+g+"' ></td></tr>"}$("#fbodySPGroups").html(l);for(var v=0,g=0;g<n.length;g++){for(var w=n[g],_=null,c=0;c<N.length;c++)if(N[c].Title==w){_=N[c].ID;break}if(_!=null){let d=function(){for(var u=new Array,h=this.collUser.getEnumerator();h.moveNext();){var y=h.get_current(),b=y.get_loginName()+" ("+y.get_title()+")";u.push(b)}u=u.sort();for(var P="",R=0;R<u.length;R++)P+=u[R]+"; ";$("#spgroupPerms"+this.x).html(te(P))},p=function(u,h){};v++;var o=new SP.ClientContext.get_current,f=o.get_web(),D=f.get_siteGroups(),G=D.getById(_),A=G.get_users();o.load(A);var e={x:g,collUser:A};o.executeQueryAsync(Function.createDelegate(e,d),Function.createDelegate(e,p))}}}function pe(i,s,l){var n=i+"<br/>Please verify the following users for <b>"+s+"</b><br/><div>"+l+"</div>";return n}var Y=0;function ie(){j="";var i="";if($(".trGroup").each(function(){var n=$(this).find("input");if(n&&n.is(":checked")){var m=$.trim($(this).find(".groupName").text());m!=null&&m!=""&&(i+="<li>"+m+"</li>")}}),i==""){M=SP.UI.Notify.addNotification("Please select an Action Office",!1);return}else i="<ul style='color:green'>"+i+"</ul>";var s="<div id='verificationDocDlg' style='padding:20px; height:100px'><div style='padding:20px; width:600px'>Are you sure you would like to Email the following Action Offices for Verification?<p style='padding-top:10px'>"+i+"</p> <p style='padding-top:10px'>If so, please specify any Custom Message to Append to the Outgoing Email Text: </p><p><input id='txtOutgoingEmailText' maxlength='300' size='100' onkeyup='Audit.Permissions.Report.GetEmailText()'></input></p></span></div><table style='padding-top:10px; width:400px; margin:0px auto'><tr><td><input id='btnClientOk1' type='button' class='ms-ButtonHeightWidth' value='Yes Send Email' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK)'/></td><td class='ms-separator'>&#160;</td><td><input id='btnCancel' type='button' class='ms-ButtonHeightWidth' value='Close' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)'/></td></tr></table></div>";$("body").append(s);var l=SP.UI.$create_DialogOptions();l.title="Email Action Office for User Verification",l.dialogReturnValueCallback=I,l.html=document.getElementById("verificationDocDlg"),SP.UI.ModalDialog.showModalDialog(l)}function I(i,s){i===SP.UI.DialogResult.OK&&(V=SP.UI.ModalDialog.showWaitScreenWithNoClose("Sending Emails","Please wait... Sending Emails",200,400),setTimeout(function(){L()},1e3))}function L(){var i=new SP.ClientContext.get_current,s=i.get_web(),l=s.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory()),n=new SP.CamlQuery;n.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>');var m=l.getItems(n);i.load(m,"Include(ID, FSObjType, Title, DisplayName)");function g(_,O){Audit.Common.Utilities.CheckIfEmailFolderExists(m,W)||Audit.Common.Utilities.CreateEmailFolder(l,W,null),Y=0,$(".trGroup").each(function(){var v=$(this).find("input");if(v&&v.is(":checked")){var o=$.trim($(this).find(".groupName").text());o!=null&&o!=""&&Y++}}),Y==0&&(M=SP.UI.Notify.addNotification("Please select an Action Office",!1),V.close());var c=0;$(".trGroup").each(function(){var v=$(this).find("input"),o=$.trim($(this).find(".groupName").text());if(v&&v.is(":checked")&&o!=null&&o!=""){var f=z[o];f=te(f);var D="Please review the Audit Tool users for ("+o+")",G=pe(j,o,f),A=new SP.ListItemCreationInformation;A.set_folderUrl(location.protocol+"//"+location.host+Audit.Common.Utilities.GetSiteUrl()+"/Lists/"+Audit.Common.Utilities.GetListNameEmailHistory()+"/"+W);var e=l.addItem(A);e.set_item("Title",D),e.set_item("Body",G),e.set_item("To",o),e.set_item("NotificationType","AO Verification"),e.update(),i.executeQueryAsync(function(){c++,c==Y&&(V.close(),M=SP.UI.Notify.addNotification("Completed Sending Email Verifications",!1),re())},function(t,r){V.close(),alert("Request failed: "+r.get_message()+`
`+r.get_stackTrace()),K()})}})}function w(_,O){V.close()}i.executeQueryAsync(g,w)}function me(){$("#linkGetVerification").prop("disabled",!1),$(".trGroup").each(function(){var i=$(this).find("input");i&&!i.is(":checked")&&i.prop("checked",!0)})}function re(){$("#linkGetVerification").prop("disabled",!0),$(".trGroup").each(function(){var i=$(this).find("input");i&&i.is(":checked")&&i.prop("checked",!1)})}function te(i){if(i==null||i=="")return"";i=i.replace(/; /gi,";");var s=i.split(";");s=s.sort();for(var l="<ul>",n=0;n<s.length;n++)s[n]!=null&&$.trim(s[n])&&(l+="<li>"+s[n]+"</li>");return l+="</ul>",l}function xe(){var i=new Array,s=new Array;$(".request-perm-item-number").each(function(){var l=$(this).text();Audit.Common.Utilities.ExistsInArr(i,l)||i.push(l)}),$(".response-perm-item-title").each(function(){var l=$(this).text();Audit.Common.Utilities.ExistsInArr(s,l)||s.push(l)}),Audit.Common.Utilities.AddOptions(i,"#ddlResponseRequestID",!1),Audit.Common.Utilities.AddOptions(s,"#ddlResponseFolderResponseID",!1)}function fe(i){M=SP.UI.Notify.addNotification("Displaying Request ("+i+")",!1),$("#ddlResponseRequestID").val(i).change(),$("#tabs").tabs({active:1})}function ve(i){M=SP.UI.Notify.addNotification("Displaying Response ("+i+")",!1),$("#ddlResponseFolderResponseID").val(i).change(),$("#tabs").tabs({active:2})}function he(){Ae("#btnPrint","#divTblOutput"),_e(".export","GroupPermissions_","table_Groups"),le(),$("#ddlRequestID").change(function(){$("#ddlResponseRequestID").val($(this).val()),setTimeout(function(){se()},10)}),$("#ddlResponseRequestID").change(function(){$("#ddlRequestID").val($(this).val()),setTimeout(function(){se()},10)}),$("#ddlResponseFolderResponseID").change(function(){setTimeout(function(){ye()},10)}),$("#linkViewAO").click(function(){ge()}),$("#linkAddAO").click(function(){we()}),$("#linkUploadPermissions").click(function(){Se()}),$("#linkGetVerification").click(function(){ie()}),$("#linkEmailHistory").click(function(){Ge()}),$("#linkViewExportFriendly").click(function(){$(".removeOnExport").toggle(),$(".groupPerms").each(function(){if($(this).html().toLowerCase().indexOf("<ul>")>=0){var i="";$(this).find("LI").each(function(){var s=$(this).text(),l=s.indexOf("(");l>=0&&(s=s.substring(0,l)),s=$.trim(s),i+=s+";"}),$(this).html(i)}})}),$("#cbAOAll").click(function(){$(this).is(":checked")?me():re()})}function ge(){var i=SP.UI.$create_DialogOptions();i.title="View Action Office Details",i.autoSize=!0,i.dialogReturnValueCallback=X,i.url=Audit.Common.Utilities.GetSiteUrl()+"/lists/"+Audit.Common.Utilities.GetListNameActionOffices(),SP.UI.ModalDialog.showModalDialog(i)}function we(){var i="NewForm.aspx",s=SP.UI.$create_DialogOptions();s.title="Add Action Office",s.autoSize=!0,s.dialogReturnValueCallback=X,s.url=Audit.Common.Utilities.GetSiteUrl()+"/lists/"+Audit.Common.Utilities.GetListNameActionOffices()+"/"+i,SP.UI.ModalDialog.showModalDialog(s)}function se(){var i=$("#ddlRequestID").val();$(".request-perm-item").each(function(){var s=!1;!s&&i!=""&&$.trim($(this).find(".request-perm-item-number").text())!=i&&(s=!0),s?$(this).hide():$(this).show()}),$(".response-perm-item").each(function(){var s=!1;!s&&i!=""&&$.trim($(this).find(".response-perm-item-number").text())!=i&&(s=!0),s?$(this).hide():$(this).show()})}function ye(){var i=$("#ddlResponseFolderResponseID").val();$(".responseFolder-perm-item").each(function(){var s=!1;!s&&i!=""&&$.trim($(this).find(".responseFolder-perm-item-title").text())!=i&&(s=!0),s?$(this).hide():$(this).show()})}function Ae(i,s){var l="Audit Site Group Permissions (SharePoint Site)";$(i).on("click",function(){J(l,s)})}function _e(i,s,l){$(i).on("click",function(n){var m=new Date().format("yyyyMMdd");B(s+m,l)})}function J(i,s){var l=new Date,n=Audit.Common.Utilities.GetSiteUrl()+"/siteassets/css/tablesorter/style.css?v="+l.format("MM_dd_yyyy"),m=Audit.Common.Utilities.GetSiteUrl()+"/siteassets/css/audit_styles.css?v="+l.format("MM_dd_yyyy"),g=Audit.Common.Utilities.GetSiteUrl()+"/siteassets/css/audit_page_reports.css?v="+l.format("MM_dd_yyyy"),w=$(s).html(),_=l.format("MM/dd/yyyy hh:mm tt");_="<div style='padding-bottom:10px;'>"+_+"</div>",w=_+w;var O=$("<div></div>"),c=$("<div></div>"),v=$("<div></div>"),o=$.Deferred(),f=$.Deferred(),D=$.Deferred(),G="";O.load(n,function(){G+="<style>"+O.html()+"</style>",o.resolve()}),c.load(m,function(){G+="<style>"+c.html()+"</style>",f.resolve()}),v.load(g,function(){G+="<style>"+v.html()+"</style>",D.resolve()}),$.when(o,f,D).done(function(){var A=`<HTML>
<HEAD>

<Title>`+i+`</Title>
`+G+`
<style>.hideOnPrint {display:none}</style>
</HEAD>
<BODY>
`+w+`
</BODY>
</HTML>`,e=window.open("","printWebPart");e.document.open(),e.document.write(A),e.document.close(),e.print()})}function B(i,s,l){var n=Pe(s);l==!0&&(n=n.slice(1));var m=ne(n);if(navigator.userAgent.search("Trident")>=0)window.CsvExpFrame.document.open("text/html","replace"),window.CsvExpFrame.document.write(m),window.CsvExpFrame.document.close(),window.CsvExpFrame.focus(),window.CsvExpFrame.document.execCommand("SaveAs",!0,i+".csv");else{var g="data:text/csv;charset=utf-8,"+escape(m),w=document.createElement("a");w.href=g,w.download=i+".csv",document.body.appendChild(w),w.click(),document.body.removeChild(w)}}function Pe(i){for(var s=document.getElementById(i),l=[],n=0,m=s.rows.length;n<m;n++){l[n]=[];for(var g=0,w=s.rows[n].cells.length;g<w;g++){var _=s.rows[n].cells[g].textContent||s.rows[n].cells[g].innerText;l[n][g]=_.trim()}}return l}function ne(i){for(var s=typeof i!="object"?JSON.parse(i):i,l=`sep=,\r
`,n="",m,g,w=0;w<s.length;w++){n="";var _=s[w];for(m in _)_.hasOwnProperty(m)&&(g=_[m]+"",n+='"'+g.replace(/"/g,'""')+'",');n=n.slice(0,-1),l+=n+`\r
`}return l}function be(i,s){var l=window.open(location.protocol+"//"+location.host+Audit.Common.Utilities.GetSiteUrl()+"/_layouts/people.aspx?MembershipGroupId="+i+"&IsDlg=1");setTimeout(function(){l.document.title="Group: "+s},2e3)}function Ge(){var i=SP.UI.$create_DialogOptions();i.title="View Email History",i.autoSize=!0,i.dialogReturnValueCallback=X,i.url=Audit.Common.Utilities.GetSiteUrl()+"/pages/AuditEmailHistory.aspx?RootFolder="+Audit.Common.Utilities.GetSiteUrl()+"/Lists/"+Audit.Common.Utilities.GetListNameEmailHistory()+"/"+W,SP.UI.ModalDialog.showModalDialog(i)}function Se(){var i=SP.UI.$create_DialogOptions();i.title="Upload Permissions",i.height="800",i.autoSize=!0,i.dialogReturnValueCallback=X,i.url=Audit.Common.Utilities.GetSiteUrl()+"/pages/AuditUpdateSiteGroups.aspx",SP.UI.ModalDialog.showModalDialog(i)}function Ne(i,s){}function ke(i,s){K()}function X(i,s){i===SP.UI.DialogResult.OK&&K()}var Re={GoToRequest:function(i){fe(i)},GoToResponse:function(i){ve(i)},ViewSitePermissionsGroup:function(i,s){be(i,s)},GetEmailText:function(){return j=$("#txtOutgoingEmailText").val(),j},Refresh:K};return Re};})();
//# sourceMappingURL=permissions.js.map
