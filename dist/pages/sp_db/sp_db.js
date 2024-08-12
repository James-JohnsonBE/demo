(()=>{var He=String.raw,ye=He`
  <div class="audit">
    <iframe id="CsvExpFrame" style="display: none"></iframe>

    <div
      id="divCounter"
      style="display: none"
      title="used to auto refresh the page"
    >
      600
    </div>

    <div style="padding-bottom: 10px; display: none" id="divRefresh">
      <a
        title="Refresh this page"
        href="javascript:void(0)"
        onclick="Audit.SPReport.Report.Refresh()"
        ><span class="ui-icon ui-icon-refresh"></span>Refresh</a
      >
    </div>

    <div id="divLoading" style="color: green; padding-bottom: 10px">
      Please Wait... Loading
    </div>

    <div id="tabs" style="display: none; margin-top: 20px">
      <ul>
        <li><a href="#tabs-0">Status Report</a></li>
        <li><a href="#tabs-1">Responses</a></li>
      </ul>
      <div id="tabs-0">
        <div
          id="lblStatusReportResponsesMsg"
          style="padding-top: 5px; color: green"
          data-bind="visible: arrResponses().length == 0"
        >
          <span class="ui-icon ui-icon-info"></span>There are 0 responses for
          your review
        </div>
        <div
          id="divButtons"
          style="padding-top: 3px"
          data-bind="visible: arrResponses().length > 0"
        >
          <a
            id="btnPrint1"
            title="Click here to Print"
            href="javascript:void(0)"
            class="hideOnPrint"
            ><span class="ui-icon ui-icon-print">Print</span></a
          >
          <a class="export1 hideOnPrint" title="Export to CSV" href="#"
            ><span class="ui-icon ui-icon-disk">Export to CSV</span></a
          >
          <a
            id="btnViewAll"
            title="View All"
            href="javascript:void(0)"
            data-bind="visible: arrFilteredResponsesCount() < arrResponses().length, click: ClearFilters"
            ><span class="ui-icon ui-icon-circle-zoomout"></span>View All
            Responses</a
          >
        </div>

        <div id="divStatusReportRespones">
          <table
            id="tblStatusReportResponses"
            class="tablesorter report"
            data-bind="visible: arrResponses().length > 0"
          >
            <thead>
              <tr
                valign="top"
                class="rowFilters"
                data-bind="visible: arrResponses().length > 0"
              >
                <th class="sorter-false" nowrap="nowrap">
                  <select
                    id="ddlResponseRequestID"
                    data-bind="options: GetDistinctResponsesDDVals('reqNumber'), value: filterRequestID, optionsCaption: '-Select-', event:{ change: FilterChanged}"
                  ></select>
                </th>
                <th class="sorter-false" nowrap="nowrap">
                  <select
                    id="ddlResponseRequestStatus"
                    data-bind="options: GetDistinctResponsesDDVals('requestStatus'), value: filterRequestStatus, optionsCaption: '-Select-', event:{ change: FilterChanged}"
                  ></select>
                </th>
                <th class="sorter-false" nowrap="nowrap">
                  <select
                    id="ddlResponseRequestInternalDueDate"
                    data-bind="options: GetDistinctResponsesDDVals('internalDueDate'), value: filterRequestIntDueDate, optionsCaption: '-Select-', event:{ change: FilterChanged}"
                  ></select>
                </th>
                <th class="sorter-false" nowrap="nowrap">
                  <select
                    id="ddlResponseSampleNum"
                    data-bind="options: GetDistinctResponsesDDVals('sample'), value: filterSampleNum, optionsCaption: '-Select-', event:{ change: FilterChanged}"
                  ></select>
                </th>
                <th class="sorter-false" nowrap="nowrap">
                  <select
                    id="ddlResponseName"
                    data-bind="options: GetDistinctResponsesDDVals('title'), value: filterResponseName, optionsCaption: '-Select-', event:{ change: FilterChanged}"
                  ></select>
                </th>
                <th class="sorter-false" nowrap="nowrap">
                  <select
                    id="ddlResponseStatus"
                    data-bind="options: GetDistinctResponsesDDVals('status'), value: filterResponseStatus, optionsCaption: '-Select-', event:{ change: FilterChanged}"
                  ></select>
                </th>
                <th class="sorter-false" nowrap="nowrap"></th>
                <th class="sorter-false" nowrap="nowrap"></th>
              </tr>
              <tr valign="top">
                <th class="sorter-true" nowrap="nowrap">Request #</th>
                <th class="sorter-true" nowrap="nowrap">Request Status</th>
                <th class="sorter-true" nowrap="nowrap">Internal Due Date</th>
                <th class="sorter-true" nowrap="nowrap">Sample #</th>
                <th class="sorter-true" nowrap="nowrap">Response Name</th>
                <th class="sorter-true" nowrap="nowrap">Status</th>
                <th class="sorter-true" nowrap="nowrap"># of Documents</th>
                <th class="sorter-true" nowrap="nowrap">Modified</th>
              </tr>
            </thead>
            <tbody id="fbody" data-bind="foreach: arrResponses">
              <tr class="sr-response-item" data-bind="visible: visibleRow">
                <td class="sr-response-requestNum">
                  <span data-bind="text: reqNumber"></span>
                </td>
                <td class="sr-response-requestStatus">
                  <span data-bind="text: requestStatus"></span>
                </td>
                <td class="sr-response-internalDueDate">
                  <span data-bind="text: internalDueDate"></span>
                </td>
                <td class="sr-response-sample">
                  <span data-bind="text: sample"></span>
                </td>
                <td class="sr-response-title">
                  <a
                    href="javascript:void(0);"
                    title="Go to Response Details"
                    data-bind="click: $parent.GoToResponse"
                    ><span data-bind="text: title"></span
                  ></a>
                </td>
                <td class="sr-response-status">
                  <span data-bind="text: status"></span>
                </td>
                <td class="sr-response-docCount">
                  <span data-bind="text: docCount"></span>
                </td>
                <td class="sr-response-modified">
                  <span data-bind="text: modified"></span>
                </td>
              </tr>
            </tbody>
            <tfoot class="footer">
              <tr>
                <th colspan="8">
                  Displaying
                  <span
                    id="spanResponsesDisplayedTotal"
                    style="color: green"
                    data-bind="text: arrFilteredResponsesCount()"
                    >0</span
                  >
                  out of
                  <span
                    style="color: green"
                    data-bind="text: arrResponses().length"
                  ></span>
                  Responses
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div id="tabs-1">
        <div style="padding-bottom: 15px">
          <table>
            <tr>
              <td><span>Responses:</span></td>
              <td>
                <select
                  id="ddlResponses"
                  data-bind="options: GetDistinctResponsesDDVals('title'), value: filterResponseName2, optionsCaption: '-Select-'"
                ></select>
              </td>
            </tr>
          </table>
        </div>

        <div id="divResponseInfo" data-bind="with: currentResponse">
          <fieldset>
            <legend>Response Information</legend>
            <table id="tblResponseInfo" class="tablesorter">
              <tbody>
                <tr>
                  <td>Request #</td>
                  <td>
                    <span id="requestInfoNum" data-bind="text: number"></span>
                  </td>
                </tr>
                <tr>
                  <td>Request Status</td>
                  <td>
                    <span
                      id="requestInfoStatus"
                      data-bind="text: $parent.currentResponseRequestStatus, style: { color: $parent.currentResponseRequestStatusStyle }"
                    ></span>
                  </td>
                </tr>
                <tr>
                  <td>Subject</td>
                  <td>
                    <span
                      id="requestInfoSub"
                      data-bind="text: request.subject"
                    ></span>
                  </td>
                </tr>
                <tr>
                  <td>Due Date</td>
                  <td>
                    <span
                      id="requestInfoInternalDueDate"
                      data-bind="text: request.internalDueDate"
                    ></span>
                  </td>
                </tr>
                <tr>
                  <td>Sample?</td>
                  <td>
                    <span
                      id="requestInfoSample"
                      data-bind="text: request.sample, css: request.sample == true ? 'ui-icon ui-icon-check' : 'ui-icon ui-icon-close'"
                    ></span>
                  </td>
                </tr>
                <tr>
                  <td>Response</td>
                  <td>
                    <span id="responseInfoName" data-bind="text: title"></span>
                  </td>
                </tr>
                <tr>
                  <td>Response Status</td>
                  <td>
                    <span
                      id="responseInfoStatus"
                      data-bind="text: $parent.currentResponseStatus, style: { color:  resStatus == '7-Closed' ? 'red' : 'green' }"
                    ></span>
                  </td>
                </tr>
                <tr>
                  <td>Sample #</td>
                  <td>
                    <span
                      id="responseInfoSampleNum"
                      data-bind="text: sample"
                    ></span>
                  </td>
                </tr>
                <tr>
                  <td>Action Office</td>
                  <td>
                    <span
                      id="responseInfoAO"
                      data-bind="text: actionOffice"
                    ></span>
                  </td>
                </tr>
                <tr>
                  <td>Related Audit</td>
                  <td>
                    <span
                      id="requestInfoRelatedAudit"
                      data-bind="text: request.relatedAudit"
                    ></span>
                  </td>
                </tr>
                <tr>
                  <td>Action Items</td>
                  <td>
                    <span
                      id="requestInfoActionItems"
                      data-bind="html: request.actionItems "
                    ></span>
                  </td>
                </tr>
                <tr>
                  <td>Comments</td>
                  <td>
                    <span
                      id="responseInfoComments"
                      data-bind="html: comments"
                    ></span>
                  </td>
                </tr>
              </tbody>
            </table>
          </fieldset>
        </div>

        <div id="divCoverSheets" data-bind="visible: currentResponse">
          <fieldset>
            <legend>Cover Sheets/Supplemental Documents</legend>
            <div
              id="divEmptyCoversheetsMsg"
              style="border: 0px !important; font-style: italic"
              data-bind="visible: arrCoverSheets().length <= 0"
            >
              There are 0 cover sheets or supplemental documents
            </div>
            <table
              id="tblCoverSheets"
              class="tablesorter report"
              data-bind="visible: arrCoverSheets().length > 0"
            >
              <thead>
                <tr valign="top">
                  <th class="sorter-false" nowrap="nowrap">Name</th>
                </tr>
              </thead>
              <tbody data-bind="foreach: arrCoverSheets">
                <tr class="coversheet-item">
                  <td class="coversheet-title" title="Click to Download">
                    <a
                      data-bind="attr: { href: 'javascript:void(0)', onclick: link}"
                      ><span data-bind="text: title"></span
                    ></a>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr valign="top">
                  <th nowrap="nowrap">
                    Total:
                    <span
                      id="tblCoverSheetsTotal"
                      data-bind="text: arrCoverSheets().length"
                      >0</span
                    >
                  </th>
                </tr>
              </tfoot>
            </table>
          </fieldset>
        </div>

        <div id="divResponseDocs" data-bind="visible: currentResponse">
          <fieldset>
            <legend>Response Documents</legend>
            <div
              id="divEmptyResponseDocsMsg"
              style="border: 0px !important; font-style: italic"
              data-bind="visible: arrResponseDocs().length <= 0"
            >
              There are 0 response documents
            </div>
            <table
              id="tblResponseDocs"
              class="tablesorter report"
              data-bind="visible: arrResponseDocs().length > 0"
            >
              <thead>
                <tr valign="top">
                  <th class="sorter-false" nowrap="nowrap">Type</th>
                  <th class="sorter-false" nowrap="nowrap">Name</th>
                  <th class="sorter-false" nowrap="nowrap">Receipt Date</th>
                  <th class="sorter-false" nowrap="nowrap">File Size</th>
                  <th class="sorter-false" nowrap="nowrap">Checked Out</th>
                  <th class="sorter-false" nowrap="nowrap">Status</th>
                  <th class="sorter-false" nowrap="nowrap">Reason</th>
                  <th class="sorter-false" nowrap="nowrap">Modified</th>
                  <th class="sorter-false" nowrap="nowrap">Modified By</th>
                </tr>
              </thead>
              <tbody
                data-bind="foreach: { data: arrResponseDocs, as: 'responseDocSummary'} "
              >
                <tr class="requestInfo-response-doc">
                  <td colspan="10">
                    <img
                      style="background-color: transparent"
                      src="/_layouts/images/minus.gif"
                      title="Expand/Collapse"
                    /><span
                      data-bind="text: responseDocSummary.responseTitle"
                    ></span>
                  </td>
                </tr>

                <!-- ko foreach: responseDocSummary.responseDocs-->

                <tr
                  class="requestInfo-response-doc-item"
                  data-bind="style: styleTag"
                >
                  <td>
                    <img
                      data-bind="attr:{ src: $parent.siteUrl + '/_layouts/images/' + docIcon}"
                    />
                  </td>
                  <td
                    class="requestInfo-response-doc-title"
                    title="Click to Download"
                  >
                    <a
                      data-bind="attr: { href: 'javascript:void(0)', onclick: link}"
                      ><span data-bind="text: title"></span
                    ></a>
                  </td>
                  <td nowrap data-bind="text: receiptDate"></td>
                  <td nowrap data-bind="text: fileSize"></td>
                  <td nowrap data-bind="text: checkedOutBy"></td>
                  <td nowrap data-bind="text: documentStatus"></td>
                  <td nowrap data-bind="text: rejectReason"></td>
                  <td
                    class="requestInfo-response-doc-modified"
                    data-bind="text: modifiedDate"
                  ></td>
                  <td
                    class="requestInfo-response-doc-modifiedBy"
                    data-bind="text: modifiedBy"
                  ></td>
                </tr>

                <!-- /ko -->
              </tbody>
              <tfoot>
                <tr valign="top">
                  <th colspan="9" nowrap="nowrap">
                    Total:
                    <span
                      id="tblResponseDocsTotal"
                      data-bind="text: cntResponseDocs"
                      >0</span
                    >
                  </th>
                </tr>
              </tfoot>
            </table>
          </fieldset>
        </div>
      </div>
    </div>

    <div id="divTest"></div>
  </div>
`;window.Audit=window.Audit||{};Audit.Common=Audit.Common||{};function Ke(){Audit.Common.Utilities=new Audit.Common.NewUtilities,Audit.Common.Init()}Audit.Common.Init=function(){};Audit.Common.NewUtilities=function(){var I=_spPageContextInfo.webServerRelativeUrl,M="AuditRequests",q="AuditRequests",O="AuditRequestsInternal",Q="AuditRequestsInternal",H="AuditResponses",L="AuditResponses",W="AuditRequestDocs",Y="AuditRequestDocs",C="AuditCoverSheets",J="AuditCoverSheets",K="AuditResponseDocs",Z="AuditResponseDocs",z="AuditResponseDocsEA",j="AuditResponseDocsEA",ee="AuditOrganizations",te="AuditOrganizations",X="AuditEmails",ne="AuditEmails",re="AuditBulkResponses",se="AuditBulkResponses",ie="AuditBulkPermissions",ae="AuditBulkPermissions",oe="CGFS Special Access1",le="CGFS Special Access2",n="Quality Assurance",s="External Auditors",o=null,p=null,i=null;function h(e=!1){if(e){location.href=location.pathname;return}var t=location.pathname;if($("#tabs").html()!=null&&$("#tabs").html()!=""){var r=0;try{r=$("#tabs").tabs("option","active")}catch{}if(t+="?Tab="+r,r==0&&$("#ddlResponseName").val()!="")t+="&ResNum="+$("#ddlResponseName").val();else if(r==1){var a=$("#ddlResponsesOpen").val(),l=$("#ddlResponsesProcessed").val();a!=null&&a!=""?t+="&ResNum="+a:l!=null&&l!=""&&(t+="&ResNum="+l)}location.href=t}else location.reload()}function v(){var e=new Date;$("#divLoading").text("Loaded at "+e.format("MM/dd/yyyy hh:mm tt"))}function b(){var e=GetUrlKeyValue("Tab");e!=null&&e!=""&&$("#tabs").tabs("option","active",e);var t=!1,r=GetUrlKeyValue("ResNum");r!=null&&r!=""&&(e==0?$("#ddlResponseName option[value='"+r+"']").length>0&&($("#ddlResponseName").val(r).change(),t=!0):$("#ddlResponsesOpen option[value='"+r+"']").length>0?$("#ddlResponsesOpen").val(r).change():$("#ddlResponsesProcessed option[value='"+r+"']").length>0&&$("#ddlResponsesProcessed").val(r).change()),t||$(".sr-response-item").show()}function c(e,t){var r=0,a=0,l=0,d=0,u=0,g=$(".sr-response-item");g.each(function(){var S=$.trim($(this).find(".sr-response-requestStatus").text()),w=$.trim($(this).find(".sr-response-status").text());(w==e||w==t)&&(S=="Open"||S=="ReOpened")&&($(this).addClass("highlighted"),r++,w==e?d++:w==t&&u++,S=="Open"?a++:S=="ReOpened"&&l++)}),r>0?($("#lblStatusReportResponsesMsg").html("<span class='ui-icon ui-icon-alert'></span>There are "+r+" Responses pending your review"),d>0&&u==0?$("#ddlResponseStatus").val(e).change():u>0&&d==0&&$("#ddlResponseStatus").val(t).change()):$("#lblStatusReportResponsesMsg").html("<span class='ui-icon ui-icon-circle-check'></span>There are 0 Responses pending your review")}function f(e){p=new Array;for(var t=e.getEnumerator();t.moveNext();){var r=t.get_current(),a=r.get_id(),l=r.get_loginName(),d=r.get_title(),u=new Object;u.ID=a,u.loginName=l,u.title=d,u.group=r,p.push(u)}}function m(e){var t=null;if(p!=null){for(var r=0;r<p.length;r++)if(p[r].title==e){t=p[r].group;break}}return t}function y(e){i=new Array;for(var t=e.getEnumerator();t.moveNext();){var r=t.get_current(),a=r.get_item("ID"),l=r.get_item("Title"),d=r.get_item("UserGroup");d!=null?d=d.get_lookupValue():d="";var u=new Object;u.ID=a,u.title=l,u.userGroup=d,i.push(u)}}function A(e){var t=null;if(i!=null)for(var r=0;r<i.length;r++){var a=i[r];if(a.title==e){t=a.userGroup;break}}return t}function D(e,t,r){if(e==null||t==""||t==null||r==null)return!1;var a=!1,l=e.get_roleAssignments();if(l==null)return alert("Error retrieving role assignments"),!1;for(var d=l.getEnumerator();d.moveNext();){var u=d.get_current();if(u!=null){var g=u.get_member();if(g.isPropertyAvailable("Title")){var S=g.get_title(),w=u.get_roleDefinitionBindings();if(w!=null)for(var P=w.getEnumerator();P.moveNext();){var N=P.get_current(),k=N.get_name();if(S==t&&N.get_basePermissions().has(r)){a=!0;break}}}}}return a}function _(e,t){if(!t){var r=!1;$("#ddlResponsesOpen > option").each(function(){if($(this).text()==e)return r=!0,notifyId=SP.UI.Notify.addNotification("Displaying Response ("+e+")",!1),$("#ddlResponsesOpen").val(e).change(),!1}),r||$("#ddlResponsesProcessed > option").each(function(){if($(this).text()==e)return r=!0,notifyId=SP.UI.Notify.addNotification("Displaying Response ("+e+")",!1),$("#ddlResponsesProcessed").val(e).change(),!1}),$("#tabs").tabs({active:1})}}function T(e){var t={};return e=="Archived"?t={"background-color":"Gainsboro"}:e=="Approved"?t={"background-color":"PaleGreen"}:e=="Rejected"?t={"background-color":"LightSalmon"}:e=="Sent to QA"?t={"background-color":"LightCyan"}:e=="Submitted"?t={"background-color":"LemonChiffon"}:e=="Marked for Deletion"&&(t={"background-color":"Gainsboro","font-style":"italic"}),t}function U(e){var t="";return e=="Archived"?t=" style='background-color:Gainsboro;' ":e=="Approved"?t=" style='background-color:PaleGreen;' ":e=="Rejected"?t=" style='background-color:LightSalmon;' ":e=="Sent to QA"?t=" style='background-color:LightCyan;' ":e=="Submitted"?t=" style='background-color:LemonChiffon;' ":e=="Marked for Deletion"&&(t=" style='background-color:Gainsboro; font-style:italic' title='Marked for Deletion by the Action Office' "),t}function R(e,t){for(var r=!1,a=e.getEnumerator();a.moveNext();){var l=a.get_current(),d=l.get_displayName();if(d==t){var r=!0;break}}return r}var x=0,F=0;function ue(e,t,r,a){x=0,F=0;var l=new SP.ClientContext.get_current,d=l.get_web(),u=new SP.ListItemCreationInformation;u.set_underlyingObjectType(SP.FileSystemObjectType.folder),u.set_leafName(t),oNewEmailFolder=e.addItem(u),oNewEmailFolder.set_item("Title",t),oNewEmailFolder.update(),this.currentUser=d.get_currentUser(),this.ownerGroup=d.get_associatedOwnerGroup(),this.memberGroup=d.get_associatedMemberGroup(),this.visitorGroup=d.get_associatedVisitorGroup(),oNewEmailFolder.resetRoleInheritance(),oNewEmailFolder.breakRoleInheritance(!1,!1);var g=SP.RoleDefinitionBindingCollection.newObject(l);g.add(d.get_roleDefinitions().getByType(SP.RoleType.administrator));var S=SP.RoleDefinitionBindingCollection.newObject(l);S.add(d.get_roleDefinitions().getByType(SP.RoleType.contributor));var w=SP.RoleDefinitionBindingCollection.newObject(l);w.add(d.get_roleDefinitions().getByName("Restricted Read"));var P=SP.RoleDefinitionBindingCollection.newObject(l);P.add(d.get_roleDefinitions().getByName("Restricted Contribute")),oNewEmailFolder.get_roleAssignments().add(ownerGroup,g),oNewEmailFolder.get_roleAssignments().add(memberGroup,S),oNewEmailFolder.get_roleAssignments().add(visitorGroup,w);var N=Audit.Common.Utilities.GetSPSiteGroup(Audit.Common.Utilities.GetGroupNameQA());N!=null&&oNewEmailFolder.get_roleAssignments().add(N,P),oNewEmailFolder.get_roleAssignments().getByPrincipal(currentUser).deleteObject();function k(){if(this.requestItem){var G=this.requestItem.get_item("ActionOffice");if(G==null||G.length==0){this.OnComplete&&this.OnComplete(!0);return}for(var V=0;V<G.length;V++){var Le=G[V].get_lookupValue(),Ve=Audit.Common.Utilities.GetAOSPGroupName(Le),me=Audit.Common.Utilities.GetSPSiteGroup(Ve);if(me!=null){let he=function(){F++,F==x&&this.OnComplete&&this.OnComplete(!0)},Re=function(Je,Ze){F++,F==x&&this.OnComplete&&this.OnComplete(!0)};var Xe=he,Ye=Re;x++;var ce=new SP.ClientContext.get_current,Qe=ce.get_web(),ve=SP.RoleDefinitionBindingCollection.newObject(ce);ve.add(Qe.get_roleDefinitions().getByName("Restricted Contribute")),this.oNewEmailFolder.get_roleAssignments().add(me,ve);var ge={OnComplete:this.OnComplete};ce.executeQueryAsync(Function.createDelegate(ge,he),Function.createDelegate(ge,Re))}}}else this.OnComplete&&this.OnComplete(!0)}function E(G,V){statusId=SP.UI.Status.addStatus("Request failed: "+V.get_message()+`
`+V.get_stackTrace())}var B={requestItem:r,oNewEmailFolder,OnComplete:a};l.executeQueryAsync(Function.createDelegate(B,k),Function.createDelegate(B,E))}function de(e,t){var r=e,a=t;let l,d;r==null&&(r=""),a==null&&(a="");var u=r.lastIndexOf("-");if(u>=0){var g=r.substring(0,u+1),S=r.replace(g,""),w=parseInt(S,10),P=Audit.Common.Utilities.PadDigits(w,5);l=g+P}else l=r;var N=a.lastIndexOf("-");if(N>=0){var k=a.substring(0,N+1),E=a.replace(k,""),B=parseInt(E,10),G=Audit.Common.Utilities.PadDigits(B,5);d=k+G}else d=a;return l.toLowerCase().localeCompare(d.toLowerCase())}function be(e,t){var r=e.title,a=t.title,l,d;r==null&&(r=""),a==null&&(a="");var u=r.lastIndexOf("-");if(u>=0){var g=r.substring(0,u+1),S=r.replace(g,""),w=parseInt(S,10),P=Audit.Common.Utilities.PadDigits(w,5);l=g+P}else l=r;var N=a.lastIndexOf("-");if(N>=0){var k=a.substring(0,N+1),E=a.replace(k,""),B=parseInt(E,10),G=Audit.Common.Utilities.PadDigits(B,5);d=k+G}else d=a;return l.toLowerCase().localeCompare(d.toLowerCase())}function we(e,t){return e.toLowerCase().localeCompare(t.toLowerCase())}function De(e,t){return e==""?-1:t==""?1:new Date(e).getTime()-new Date(t).getTime()}function _e(e,t,r,a){if(e!=null){a?e.sort(de):r?e.sort(De):e.sort(we);var l=new Array,d=-1;l[++d]="<option value=''>-Select-</option>";for(var u=e.length,g=0;g<u;g++){var S=$.trim(e[g]);l[++d]="<option value='"+S+"'>"+S+"</option>"}var w=$(t);w.empty().append(l.join(""))}}function Ce(e,t){if(e==null)return!1;for(var r=e.length,a=0;a<r;a++)if(e[a]==t)return!0;return!1}function Ae(e){return e==!0?"<span class='ui-icon ui-icon-check'>"+e+"</span>":"<span class='ui-icon ui-icon-close'>"+e+"</span>"}function Te(e,t){var r=e.get_item(t);return r==null?"":r.get_lookupValue()}function Ne(e,t){e=e.toString();var r="";if(t>e.length)for(let a=0;a<t-e.length;a++)r+="0";return r+e.toString()}function Ge(e,t){var r=e>=0?1:-1;return(Math.round(e*Math.pow(10,t)+r*.001)/Math.pow(10,t)).toFixed(t)}function xe(e){return e==null||e==""?"":(e>1048576?e=Audit.Common.Utilities.PreciseRound(e/1048576,2)+" MB":e>1024?e=Audit.Common.Utilities.PreciseRound(e/1024,2)+" KB":e+=" B",e)}function Pe(e){function t(r){return r<10?"0"+r:r}return e.getUTCFullYear()+"-"+t(e.getUTCMonth()+1)+"-"+t(e.getUTCDate())+"T"+t(e.getUTCHours())+":"+t(e.getUTCMinutes())+":"+t(e.getUTCSeconds())+"Z"}function Ie(){$(".requestInfo-response-doc img").click(function(e){e.preventDefault();var t=$(this).attr("src");t=="/_layouts/images/minus.gif"?$(this).attr("src","/_layouts/images/plus.gif"):$(this).attr("src","/_layouts/images/minus.gif"),$(this).parent().parent().nextUntil("tr.requestInfo-response-doc").each(function(){$(this).toggleClass("collapsed")})})}function Fe(e){return $("select[title='"+e+"']").html()!==null?$("select[title='"+e+"']"):$("input[title='"+e+"']")}function ke(e){return $("select[title='"+e+"']").html()!==null?$("select[title='"+e+"'] option:selected").text():$("input[title='"+e+"']").val()}function qe(e,t){try{if(t==null)return;var r=fe("select","",e);if(r==null){var a=fe("input","",e);ShowDropdown(a.id);var l=document.getElementById(a.opt);pe(l,t),OptLoseFocus(l)}else pe(r,t)}catch{}}function pe(e,t){var r=e.options,a=r.length;if(e!=null){for(var l=0;l<a;l++)if(r[l].text==t)return e.selectedIndex=l,!0;return!1}}function fe(e,t,r){for(var a=t.length,l=document.getElementsByTagName(e),d=0;d<l.length;d++){var u=l[d].id;if(l[d].title==r&&(t==""||u.indexOf(t)==u.length-a))return l[d]}return null}function Ue(e){var t=SP.UI.$create_DialogOptions();t.title="User Manual",t.height=250,e!=null?t.url=Audit.Common.Utilities.GetSiteUrl()+"/pages/AuditUserManuals.aspx?FilterField1=DocType&FilterValue1="+e:t.url=Audit.Common.Utilities.GetSiteUrl()+"/pages/AuditUserManuals.aspx",SP.UI.ModalDialog.showModalDialog(t)}function Ee(e,t){var r=new Date,a=Audit.Common.Utilities.GetSiteUrl(),l=a+"/siteassets/css/tablesorter/style.css?v="+r.format("MM_dd_yyyy"),d=a+"/siteAssets/css/audit_styles.css?v="+r.format("MM_dd_yyyy"),u=$(t).html(),g=$("<div>").append(u);g.find(".sr-response-title a").each(function(){$(this).removeAttr("onclick"),$(this).removeAttr("href")}),u=g.html();var S=r.format("MM/dd/yyyy hh:mm tt");S="<div style='padding-bottom:10px;'>"+S+"</div>",u=S+u;var w=$("<div></div>"),P=$("<div></div>"),N=$.Deferred(),k=$.Deferred(),E="";w.load(l,function(){E+="<style>"+w.html()+"</style>",N.resolve()}),P.load(d,function(){E+="<style>"+P.html()+"</style>",k.resolve()}),$.when(N,k).done(function(){var B=`<HTML>
<HEAD>

<Title>`+e+`</Title>
`+E+`
<style>.hideOnPrint, .rowFilters {display:none}</style>
</HEAD>
<BODY>
`+u+`
</BODY>
</HTML>`,G=window.open("","printWebPart");G.document.open(),G.document.write(B),G.document.close(),G.print()})}function $e(e,t,r){var a=Be(t);r==!0&&(a=a.slice(1));var l=Me(a);if(navigator.userAgent.search("Trident")>=0)window.CsvExpFrame.document.open("text/html","replace"),window.CsvExpFrame.document.write(l),window.CsvExpFrame.document.close(),window.CsvExpFrame.focus(),window.CsvExpFrame.document.execCommand("SaveAs",!0,e+".csv");else{var d="data:text/csv;charset=utf-8,"+escape(l),u=document.createElement("a");u.href=d,u.download=e+".csv",document.body.appendChild(u),u.click(),document.body.removeChild(u)}}function Be(e){var t=document.getElementById(e);if(t.innerHTML.indexOf("rowFilters")>=0){var r=$("<div>").append(t.outerHTML);r.find(".rowFilters").each(function(){$(this).remove()}),t=r.find("table")[0]}if(t.innerHTML.indexOf("footer")>=0){var r=$("<div>").append(t.outerHTML);r.find(".footer").each(function(){$(this).remove()}),t=r.find("table")[0]}for(var a=[],l=0,d=t.rows.length;l<d;l++){a[l]=[];for(var u=0,g=t.rows[l].cells.length;u<g;u++){var S=t.rows[l].cells[u].textContent||t.rows[l].cells[u].innerText;a[l][u]=S.trim()}}return a}function Me(e){for(var t=typeof e!="object"?JSON.parse(e):e,r=`sep=,\r
`,a="",l,d,u=0;u<t.length;u++){a="";var g=t[u];for(l in g)g.hasOwnProperty(l)&&(d=g[l]+"",a+='"'+d.replace(/"/g,'""')+'",');a=a.slice(0,-1),r+=a+`\r
`}return r}var Oe={GetSiteUrl:function(){return I=="/"?"":I},GetListTitleRequests:function(){return M},GetListNameRequests:function(){return q},GetListTitleRequestsInternal:function(){return O},GetListNameRequestsInternal:function(){return Q},GetListTitleResponses:function(){return H},GetListNameResponses:function(){return L},GetLibTitleRequestDocs:function(){return W},GetLibNameRequestDocs:function(){return Y},GetLibTitleCoverSheets:function(){return C},GetLibNameCoverSheets:function(){return J},GetLibTitleResponseDocs:function(){return K},GetLibNameResponseDocs:function(){return Z},GetLibTitleResponseDocsEA:function(){return z},GetLibNameResponseDocsEA:function(){return j},GetListTitleActionOffices:function(){return ee},GetListNameActionOffices:function(){return te},GetListTitleEmailHistory:function(){return X},GetListNameEmailHistory:function(){return ne},GetListTitleBulkResponses:function(){return re},GetListNameBulkResponses:function(){return se},GetListTitleBulkPermissions:function(){return ie},GetListNameBulkPermissions:function(){return ae},GetGroupNameSpecialPerm1:function(){return oe},GetGroupNameSpecialPerm2:function(){return le},GetGroupNameQA:function(){return n},GetGroupNameEA:function(){return s},Refresh:h,OnLoadDisplayTimeStamp:v,OnLoadDisplayTabAndResponse:b,OnLoadFilterResponses:function(e,t){c(e,t)},SetResponseDocLibGUID:function(e){o=e},GetResponseDocLibGUID:function(){return o},LoadSiteGroups:function(e){f(e)},GetSPSiteGroup:function(e){return m(e)},LoadActionOffices:function(e){y(e)},GetActionOffices:function(){return i},GetAOSPGroupName:function(e){return A(e)},CheckSPItemHasGroupPermission:function(e,t,r){return D(e,t,r)},GoToResponse:function(e,t){_(e,t)},GetResponseDocStyleTag:function(e){return U(e)},GetResponseDocStyleTag2:function(e){return T(e)},CheckIfEmailFolderExists:function(e,t){return R(e,t)},CreateEmailFolder:function(e,t,r,a){return ue(e,t,r,a)},AddOptions:function(e,t,r,a){_e(e,t,r,a)},ExistsInArr:function(e,t){return Ce(e,t)},GetTrueFalseIcon:function(e){return Ae(e)},PadDigits:function(e,t){return Ne(e,t)},PreciseRound:function(e,t){return Ge(e,t)},GetFriendlyFileSize:function(e){return xe(e)},GetISODateString:function(e){return Pe(e)},GetFriendlyDisplayName:function(e,t){return Te(e,t)},BindHandlerResponseDoc:Ie,PrintStatusReport:function(e,t){Ee(e,t)},ExportToCsv:function(e,t,r){$e(e,t,r)},ViewUserManuals:function(e){Ue(e)},GetLookupDisplayText:function(e){return ke(e)},GetLookupFormField:function(e){return Fe(e)},SetLookupFromFieldNameByText:function(e,t){return qe(e,t)},SortResponseObjects:function(e,t){return be(e,t)},SortResponseTitles:de};return Oe};Ke();document.getElementById("app").innerHTML=ye;window.Audit=window.Audit||{};Audit.SPReport=Audit.SPReport||{};var We=GetUrlKeyValue("ShowSiteActions");We!=!0&&($("#RibbonContainer-TabRowLeft").hide(),$(".ms-siteactionsmenu").hide());document.readyState==="ready"||document.readyState==="complete"?Se():document.onreadystatechange=()=>{(document.readyState==="complete"||document.readyState==="ready")&&ExecuteOrDelayUntilScriptLoaded(function(){SP.SOD.executeFunc("sp.js","SP.ClientContext",Se)},"sp.js")};function Se(){Audit.SPReport.Report=new Audit.SPReport.NewReportPage,Audit.SPReport.Init()}Audit.SPReport.Init=function(){var I=GetUrlKeyValue("ShowSiteActions");I!=!0&&($("#RibbonContainer-TabRowLeft").hide(),$(".ms-siteactionsmenu").hide()),setInterval(function(){var M=$("#divCounter").text(),q=M*1-1;$("#divCounter").text(q),q<=0&&Audit.Common.Utilities.Refresh()},1e3)};Audit.SPReport.NewReportPage=function(){var I=new Object,M=new Array,q=new Array,O,Q,H,L,W=!1;ko.extenders.logChangeInArr=function(n,s){return n.subscribe(function(o){console.log(s+": "+JSON.stringify(o)),console.log(o.length)}),n};function Y(){var n=this;n.siteUrl=Audit.Common.Utilities.GetSiteUrl(),n.arrResponses=ko.observableArray(null),n.arrFilteredResponsesCount=ko.observable(0),n.filterRequestID=ko.observable(),n.filterRequestStatus=ko.observable(),n.filterRequestIntDueDate=ko.observable(),n.filterSampleNum=ko.observable(),n.filterResponseName=ko.observable(),n.filterResponseStatus=ko.observable(),n.filterResponseName2=ko.observable(),n.currentResponse=ko.observable(),n.arrCoverSheets=ko.observableArray(null),n.arrResponseDocs=ko.observableArray(null),n.cntResponseDocs=ko.observable(0),n.doSort=ko.observable(!1),n.currentResponseStatus=ko.computed(function(){return n.currentResponse()?n.currentResponse().resStatus=="7-Closed"?n.currentResponse().resStatus+" on "+n.currentResponse().closedDate+" by "+n.currentResponse().closedBy:n.currentResponse().resStatus:""},n).extend({notify:"always"}),n.currentResponseRequestStatus=ko.computed(function(){return n.currentResponse()?n.currentResponse().request.status=="Closed"?n.currentResponse().request.status+" on "+n.currentResponse().request.closedDate:n.currentResponse().request.status:""},n),n.currentResponseRequestStatusStyle=ko.computed(function(){return n.currentResponseStatus()!=""?n.currentResponse().request.status=="Closed"||n.currentResponse().request.status=="Canceled"?"red":"green":""},n),n.ClearFilters=function(){n.filterRequestID(""),n.filterRequestStatus(""),n.filterRequestIntDueDate(""),n.filterSampleNum(""),n.filterResponseName(""),n.filterResponseStatus("")},n.GetDistinctResponsesDDVals=function(s){return ko.computed({read:function(){var o=ko.utils.arrayMap(n.arrResponses(),function(i){return i[s]}),p=ko.utils.arrayGetDistinctValues(o).sort();return p}},n)},n.GoToResponse=function(s){$("#tabs").tabs({active:1}),n.filterResponseName2(s.title)},n.arrResponses.subscribe(function(s){n.arrResponses().length>0&&n.doSort()&&(n.arrFilteredResponsesCount(n.arrResponses().length),setTimeout(function(){$("#tblStatusReportResponses").tablesorter({sortList:[[7,1]],selectorHeaders:".sorter-true"})},200))}),n.filterResponseName2.subscribe(function(s){var o=I["response-"+n.filterResponseName2()];o?(n.currentResponse(o),ne(o),re(o)):(n.currentResponse(null),n.arrCoverSheets([]),n.arrResponseDocs([]),n.cntResponseDocs(0))}),n.FilterChanged=function(){setTimeout(function(){var s=n.filterRequestID(),o=n.filterRequestStatus(),p=n.filterRequestIntDueDate(),i=n.filterSampleNum(),h=n.filterResponseName(),v=n.filterResponseStatus();!s&&!o&&!p&&!i&&!h&&!v&&(ko.utils.arrayForEach(n.arrResponses(),function(f){f.visibleRow(!0)}),n.arrFilteredResponsesCount(n.arrResponses().length));var b=[];s=s||"",o=o||"",p=p||"",i=i||"",h=h||"",v=v||"";var c=0;ko.utils.arrayForEach(n.arrResponses(),function(f){var m=!1;!m&&s!=""&&f.reqNumber!=s&&(m=!0),!m&&o!=""&&f.requestStatus!=o&&(m=!0),!m&&p!=""&&f.internalDueDate!=p&&(m=!0),!m&&i!=""&&f.sample!=i&&(m=!0),!m&&h!=""&&f.title!=h&&(m=!0),!m&&v!=""&&f.status!=v&&(m=!0),f.visibleRow(!m),m||c++}),n.arrFilteredResponsesCount(c)},100)}}var C=new Y;ko.applyBindings(C),J();function J(){var n=new SP.ClientContext.get_current,s=n.get_web();let o=s.get_currentUser();n.load(o);var p=s.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleRequests()),i=new SP.CamlQuery;i.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'),O=p.getItems(i),n.load(O,"Include(ID, Title, ReqSubject, ReqStatus, IsSample, InternalDueDate, ActionOffice, Comments, RelatedAudit, ActionItems, EmailSent, ClosedDate, Modified)");var h=s.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleResponses()),v=new SP.CamlQuery;v.set_viewXml('<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="ReqNum"/></OrderBy></Query></View>'),Q=h.getItems(v),n.load(Q,"Include(ID, Title, ReqNum, ActionOffice, SampleNumber, ResStatus, Comments, Modified, ClosedDate, ClosedBy)");var b=s.get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs()),c=new SP.CamlQuery;c.set_viewXml('<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="ReqNum"/><FieldRef Name="ResID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">0</Value></Eq></Where></Query></View>'),H=b.getItems(c),n.load(H,"Include(ID, FSObjType, Title, ReqNum, ResID, DocumentStatus, RejectReason, ReceiptDate, FileLeafRef, FileDirRef, File_x0020_Size, CheckoutUser, Modified, Editor)"),n.executeQueryAsync(f,m);function f(y,A){var D=s.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleRequests()),_=new SP.CamlQuery;_.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>');var T=D.getItems(_);n.load(T,"Include(ID, Title, ReqSubject, ReqStatus, IsSample, InternalDueDate, ActionOffice, Comments, RelatedAudit, ActionItems, EmailSent, ClosedDate, Modified, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))");function U(x,F){W=!0,O=T,$("#divRefresh").show(),K()}function R(x,F){$("#divRefresh").show(),K()}n.executeQueryAsync(U,R)}function m(y,A){$("#divRefresh").hide(),$("#divLoading").hide(),L=SP.UI.Status.addStatus("Request failed: "+A.get_message()+`
`+A.get_stackTrace()),SP.UI.Status.setStatusPriColor(L,"red")}}function K(){z(),j(),ee(),$("#tabs").tabs().show(),te(q)}function Z(){var n=GetUrlKeyValue("ResNum");n!=null&&n!=""&&C.filterResponseName2(n);var s=GetUrlKeyValue("Tab");s!=null&&s!=""&&$("#tabs").tabs("option","active",s)}function z(){I=new Object,M=new Array;for(var n=0,s=O.getEnumerator();s.moveNext();){var o=s.get_current(),p=o.get_item("ID"),i=o.get_item("Title"),h=o.get_item("ReqStatus"),v=o.get_item("IsSample"),b=o.get_item("EmailSent"),c=o.get_item("ReqSubject");c==null&&(c="");var f=o.get_item("InternalDueDate"),m=o.get_item("ClosedDate");f!=null?f=f.format("MM/dd/yyyy"):f="",m!=null?m=m.format("MM/dd/yyyy"):m="";for(var y=o.get_item("ActionOffice"),A="",D=0;D<y.length;D++)A+="<div>"+y[D].get_lookupValue()+"</div>";var _=o.get_item("Comments"),T=o.get_item("RelatedAudit"),U=o.get_item("ActionItems");_==null&&(_=""),T==null&&(T=""),U==null&&(U="");var R=new Object;if(R.ID=p,R.number=i,R.subject=c,R.status=h,R.internalDueDate=f,R.sample=v,R.responses=new Array,R.actionOffice=A,R.comments=_,R.emailSent=b,R.closedDate=m,R.relatedAudit=T,R.actionItems=U,W)try{var x=SP.PermissionKind.viewListItems,F=Audit.Common.Utilities.CheckSPItemHasGroupPermission(o,Audit.Common.Utilities.GetGroupNameSpecialPerm1(),x),ue=Audit.Common.Utilities.CheckSPItemHasGroupPermission(o,Audit.Common.Utilities.GetGroupNameSpecialPerm2(),x);if(!F&&!ue)continue}catch{}R.arrIndex=n,M.push(R),I["request-"+i]=R,n++}}function j(){q=new Array;for(var n=0,s=Q.getEnumerator();s.moveNext();){var o=s.get_current(),p=o.get_item("ReqNum");if(p!=null){p=p.get_lookupValue();var i=new Object;if(i.request=I["request-"+p],!i.request||!i.request.emailSent||(i.resStatus=o.get_item("ResStatus"),i.resStatus!="4-Approved for QA"&&i.resStatus!="7-Closed"&&i.resStatus!="6-Reposted After Rejection")||(i.actionOffice=o.get_item("ActionOffice"),i.actionOffice==null?i.actionOffice="":i.actionOffice=i.actionOffice.get_lookupValue(),i.actionOffice==""))continue;i.ID=o.get_item("ID"),i.number=p;var h=o.get_item("Title");i.title=h;var v=o.get_item("Modified");v!=null?v=v.format("MM/dd/yyyy hh:mm tt"):v="",i.modified=v;var b=o.get_item("ClosedDate");b!=null?b=b.format("MM/dd/yyyy"):b="",i.closedDate=b;var c=o.get_item("Comments");c==null&&(c=""),i.comments=c,i.closedBy=Audit.Common.Utilities.GetFriendlyDisplayName(o,"ClosedBy"),i.sample=o.get_item("SampleNumber"),i.sample==null&&(i.sample=""),i.coversheets=new Array,i.responseDocs=new Array,i.arrIndex=n,q.push(i),I["response-"+h]=i,n++}}}function ee(){for(var n=H.getEnumerator();n.moveNext();){var s=n.get_current();if(!(s.get_item("DocumentStatus")=="Open"||s.get_item("DocumentStatus")=="Marked for Deletion"||s.get_item("DocumentStatus")=="Submitted")){var o=s.get_item("ID"),p=s.get_item("ReqNum");p!=null&&(p=p.get_lookupValue());var i=s.get_item("ResID");if(i!=null&&(i=i.get_lookupValue()),!(p==null||i==null))try{var h=I["response-"+i],v=h.arrIndex,b=q[v];if(b){var c=new Object;c.ID=s.get_item("ID"),c.title=s.get_item("FileLeafRef"),c.folder=s.get_item("FileDirRef"),c.documentStatus=s.get_item("DocumentStatus"),c.rejectReason=s.get_item("RejectReason"),c.rejectReason==null&&(c.rejectReason="");var f=s.get_item("File_x0020_Size");f=Audit.Common.Utilities.GetFriendlyFileSize(f),c.fileSize=f;var m="";s.get_item("ReceiptDate")!=null&&s.get_item("ReceiptDate")!=""&&(m=s.get_item("ReceiptDate").format("MM/dd/yyyy")),c.receiptDate=m;var y="";s.get_item("Modified")!=null&&s.get_item("Modified")!=""&&(y=s.get_item("Modified").format("MM/dd/yyyy hh:mm tt")),c.modifiedDate=y,c.modifiedBy=Audit.Common.Utilities.GetFriendlyDisplayName(s,"Editor"),c.checkedOutBy=Audit.Common.Utilities.GetFriendlyDisplayName(s,"CheckoutUser"),b.responseDocs.push(c)}}catch{}}}}function te(n){if(n!=null){for(var s=GetUrlKeyValue("LoadTest"),o=new Array,p=n.length;p--;){var i=n[p],h=i.title,v=i.request.status,b=i.resStatus,c={reqNumber:i.request.number,requestStatus:v,internalDueDate:i.request.internalDueDate,sample:i.sample,title:h,status:b,docCount:i.responseDocs.length,modified:i.modified,visibleRow:ko.observable(!0)};if(o.push(c),s)for(var f=0;f<299;f++)o.push(c)}o.length>0?X(o):Audit.Common.Utilities.OnLoadDisplayTimeStamp()}}function X(n){var s=[],o=!0,p=250;n.length==0?(o=!1,Audit.Common.Utilities.OnLoadDisplayTimeStamp(),ie(),Z()):n.length>=p?(s=n.slice(0,p),n.splice(0,p)):n.length>0&&(s=n.slice(0,n.length),n.splice(0,n.length)),o&&(ko.utils.arrayPushAll(C.arrResponses(),s),n.length==0&&C.doSort(!0),C.arrResponses.valueHasMutated(),setTimeout(function(){X(n)},100))}function ne(n){C.arrCoverSheets([]);var s=new SP.ClientContext.get_current,o=s.get_web(),p=o.get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleCoverSheets()),i=new SP.CamlQuery;i.set_viewXml('<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="ReqNum"/><Value Type="Text">'+n.request.number+"</Value></Eq></Where></Query></View>");var h=p.getItems(i);s.load(h,"Include(ID, Title, ReqNum, ActionOffice, FileLeafRef, FileDirRef)");var v={oResponse:n};function b(f,m){for(var y=new Array,A=h.getEnumerator();A.moveNext();){var D=A.get_current();if(D.get_item("ActionOffice")!=null){var _=D.get_item("ActionOffice");if(_.length>0)for(var T=0;T<_.length;T++){var U=_[T].get_lookupValue();if(U==this.oResponse.actionOffice){var R=D.get_item("FileDirRef"),x=D.get_item("FileLeafRef"),F=x.replace(/'/g,"&#39");y.push({folder:R,title:x,link:"STSNavigate('../_layouts/download.aspx?SourceUrl="+R+"/"+F+"')"});break}}}}ko.utils.arrayPushAll(C.arrCoverSheets(),y),C.arrCoverSheets.valueHasMutated()}function c(f,m){}s.executeQueryAsync(Function.createDelegate(v,b),Function.createDelegate(v,c))}function re(n){if(C.arrResponseDocs([]),C.cntResponseDocs(0),n==null||n.responseDocs.length==0)return;for(var s=new SP.ClientContext.get_current,o=s.get_web(),p=0;p<n.responseDocs.length;p++){var i=n.responseDocs[p];i.docIcon=o.mapToIcon(i.title,"",SP.Utilities.IconSize.Size16)}function h(c,f){b(n)}function v(c,f){L=SP.UI.Status.addStatus("Request failed: "+f.get_message()+`
`+f.get_stackTrace()),SP.UI.Status.setStatusPriColor(L,"red")}s.executeQueryAsync(h,v);function b(c){if(!(c==null||c.responseDocs==null)){for(var f=new Array,m=0;m<c.responseDocs.length;m++){var y=c.responseDocs[m];y.docIcon=y.docIcon.get_value(),y.styleTag=Audit.Common.Utilities.GetResponseDocStyleTag2(y.documentStatus),y.link="STSNavigate('../_layouts/download.aspx?SourceUrl="+y.folder+"/"+y.title+"')";for(var A=!1,D=0;D<f.length;D++)if(f[D].responseTitle==c.title){A=!0,f[D].responseDocs.push(y);break}if(!A){var _=new Object,T=new Array;T.push(y),_.responseTitle=c.title,_.responseDocs=T,_.response=c,f.push(_)}}ko.utils.arrayPushAll(C.arrResponseDocs(),f),C.arrResponseDocs.valueHasMutated(),C.cntResponseDocs(c.responseDocs.length),Audit.Common.Utilities.BindHandlerResponseDoc()}}}function se(){var n=location.pathname,s=$("#tabs").tabs("option","active");if(n+="?Tab="+s,s==1){var o=$("#ddlResponses").val();o!=""&&(n+="&ResNum="+o)}location.href=n}function ie(){ae("#btnPrint1","#divStatusReportRespones","Special Permissions Response Status Report"),oe(".export1","SPResponseStatusReport_","tblStatusReportResponses")}function ae(n,s,o){$(n).on("click",function(){Audit.Common.Utilities.PrintStatusReport(o,s)})}function oe(n,s,o){$(n).on("click",function(p){var i=new Date().format("yyyyMMdd_hhmmtt");Audit.Common.Utilities.ExportToCsv(s+i,o)})}var le={Load:K,Refresh:se};return le};})();
//# sourceMappingURL=sp_db.js.map
