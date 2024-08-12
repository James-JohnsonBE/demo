(() => {
  // src/pages/sp_db/SP_DB_Template.js
  var html = String.raw;
  var spDbTemplate = html`
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
`;

  // src/common/utilities.js
  window.Audit = window.Audit || {};
  Audit.Common = Audit.Common || {};
  function InitReport() {
    Audit.Common.Utilities = new Audit.Common.NewUtilities();
    Audit.Common.Init();
  }
  Audit.Common.Init = function() {
  };
  Audit.Common.NewUtilities = function() {
    var m_siteUrl = _spPageContextInfo.webServerRelativeUrl;
    var m_listTitleRequests = "AuditRequests";
    var m_listNameRequests = "AuditRequests";
    var m_listTitleRequestsInternal = "AuditRequestsInternal";
    var m_listNameRequestsInternal = "AuditRequestsInternal";
    var m_listTitleResponses = "AuditResponses";
    var m_listNameResponses = "AuditResponses";
    var m_libTitleRequestDocs = "AuditRequestDocs";
    var m_libNameRequestDocs = "AuditRequestDocs";
    var m_libTitleCoverSheet = "AuditCoverSheets";
    var m_libNameCoverSheet = "AuditCoverSheets";
    var m_libTitleResponseDocs = "AuditResponseDocs";
    var m_libNameResponseDocs = "AuditResponseDocs";
    var m_libTitleResponseDocsEA = "AuditResponseDocsEA";
    var m_libNameResponseDocsEA = "AuditResponseDocsEA";
    var m_listTitleActionOffices = "AuditOrganizations";
    var m_listNameActionOffices = "AuditOrganizations";
    var m_listTitleEmailHistory = "AuditEmails";
    var m_listNameEmailHistory = "AuditEmails";
    var m_listTitleBulkResponses = "AuditBulkResponses";
    var m_listNameBulkResponses = "AuditBulkResponses";
    var m_listTitleBulkPermissions = "AuditBulkPermissions";
    var m_listNameBulkPermissions = "AuditBulkPermissions";
    var m_groupNameSpecialPermName1 = "CGFS Special Access1";
    var m_groupNameSpecialPermName2 = "CGFS Special Access2";
    var m_groupNameQA = "Quality Assurance";
    var m_groupNameEA = "External Auditors";
    var m_libResponseDocsLibraryGUID = null;
    var m_arrSiteGroups = null;
    var m_arrAOs = null;
    function m_fnRefresh(hard = false) {
      if (hard) {
        location.href = location.pathname;
        return;
      }
      var curPath = location.pathname;
      if ($("#tabs").html() != null && $("#tabs").html() != "") {
        var tabIndex = 0;
        try {
          tabIndex = $("#tabs").tabs("option", "active");
        } catch (ex) {
        }
        curPath += "?Tab=" + tabIndex;
        if (tabIndex == 0 && $("#ddlResponseName").val() != "") {
          curPath += "&ResNum=" + $("#ddlResponseName").val();
        } else if (tabIndex == 1) {
          var responseNumOpen = $("#ddlResponsesOpen").val();
          var responseNumProcessed = $("#ddlResponsesProcessed").val();
          if (responseNumOpen != null && responseNumOpen != "")
            curPath += "&ResNum=" + responseNumOpen;
          else if (responseNumProcessed != null && responseNumProcessed != "")
            curPath += "&ResNum=" + responseNumProcessed;
        }
        location.href = curPath;
      } else {
        location.reload();
      }
    }
    function m_fnOnLoadDisplayTimeStamp() {
      var curDate = /* @__PURE__ */ new Date();
      $("#divLoading").text("Loaded at " + curDate.format("MM/dd/yyyy hh:mm tt"));
    }
    function m_fnOnLoadDisplayTabAndResponse() {
      var paramTabIndex = GetUrlKeyValue("Tab");
      if (paramTabIndex != null && paramTabIndex != "") {
        $("#tabs").tabs("option", "active", paramTabIndex);
      }
      var bFiltered = false;
      var paramResponseNum = GetUrlKeyValue("ResNum");
      if (paramResponseNum != null && paramResponseNum != "") {
        if (paramTabIndex == 0) {
          if ($("#ddlResponseName option[value='" + paramResponseNum + "']").length > 0) {
            $("#ddlResponseName").val(paramResponseNum).change();
            bFiltered = true;
          }
        } else {
          if ($("#ddlResponsesOpen option[value='" + paramResponseNum + "']").length > 0) {
            $("#ddlResponsesOpen").val(paramResponseNum).change();
          } else if ($("#ddlResponsesProcessed option[value='" + paramResponseNum + "']").length > 0) {
            $("#ddlResponsesProcessed").val(paramResponseNum).change();
          }
        }
      }
      if (!bFiltered) {
        $(".sr-response-item").show();
      }
    }
    function m_fnOnLoadFilterResponses(responseStatus1, responseStatus2) {
      var count = 0;
      var cntOpen = 0;
      var cntReOpened = 0;
      var resStatus1 = 0;
      var resStatus2 = 0;
      var eacher = $(".sr-response-item");
      eacher.each(function() {
        var reqStatus = $.trim($(this).find(".sr-response-requestStatus").text());
        var resStatus = $.trim($(this).find(".sr-response-status").text());
        if ((resStatus == responseStatus1 || resStatus == responseStatus2) && (reqStatus == "Open" || reqStatus == "ReOpened")) {
          $(this).addClass("highlighted");
          count++;
          if (resStatus == responseStatus1)
            resStatus1++;
          else if (resStatus == responseStatus2)
            resStatus2++;
          if (reqStatus == "Open")
            cntOpen++;
          else if (reqStatus == "ReOpened")
            cntReOpened++;
        }
      });
      if (count > 0) {
        $("#lblStatusReportResponsesMsg").html(
          "<span class='ui-icon ui-icon-alert'></span>There are " + count + " Responses pending your review"
        );
        if (resStatus1 > 0 && resStatus2 == 0)
          $("#ddlResponseStatus").val(responseStatus1).change();
        else if (resStatus2 > 0 && resStatus1 == 0)
          $("#ddlResponseStatus").val(responseStatus2).change();
      } else
        $("#lblStatusReportResponsesMsg").html(
          "<span class='ui-icon ui-icon-circle-check'></span>There are 0 Responses pending your review"
        );
    }
    function m_fnLoadSiteGroups(itemColl) {
      m_arrSiteGroups = new Array();
      var listItemEnumerator = itemColl.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        var id = oListItem.get_id();
        var loginName = oListItem.get_loginName();
        var title = oListItem.get_title();
        var groupObject = new Object();
        groupObject["ID"] = id;
        groupObject["loginName"] = loginName;
        groupObject["title"] = title;
        groupObject["group"] = oListItem;
        m_arrSiteGroups.push(groupObject);
      }
    }
    function m_fnGetSPSiteGroup(groupName) {
      var userGroup = null;
      if (m_arrSiteGroups != null) {
        for (var x = 0; x < m_arrSiteGroups.length; x++) {
          if (m_arrSiteGroups[x].title == groupName) {
            userGroup = m_arrSiteGroups[x].group;
            break;
          }
        }
      }
      return userGroup;
    }
    function m_fnLoadActionOffices(itemColl) {
      m_arrAOs = new Array();
      var listItemEnumerator = itemColl.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        var id = oListItem.get_item("ID");
        var title = oListItem.get_item("Title");
        var userGroup = oListItem.get_item("UserGroup");
        if (userGroup != null) {
          userGroup = userGroup.get_lookupValue();
        } else
          userGroup = "";
        var aoObject = new Object();
        aoObject["ID"] = id;
        aoObject["title"] = title;
        aoObject["userGroup"] = userGroup;
        m_arrAOs.push(aoObject);
      }
    }
    function m_fnGetAOSPGroupName(groupName) {
      var userGroup = null;
      if (m_arrAOs != null) {
        for (var x = 0; x < m_arrAOs.length; x++) {
          var oGroup = m_arrAOs[x];
          if (oGroup.title == groupName) {
            userGroup = oGroup.userGroup;
            break;
          }
        }
      }
      return userGroup;
    }
    function m_fnCheckSPItemHasGroupPermission(item, groupName, permissionLevel) {
      if (item == null || groupName == "" || groupName == null || permissionLevel == null)
        return false;
      var match = false;
      var roleAssignments = item.get_roleAssignments();
      if (roleAssignments == null) {
        alert("Error retrieving role assignments");
        return false;
      }
      var rolesEnumerator = roleAssignments.getEnumerator();
      while (rolesEnumerator.moveNext()) {
        var role = rolesEnumerator.get_current();
        if (role != null) {
          var roleMember = role.get_member();
          if (roleMember.isPropertyAvailable("Title")) {
            var memberTitleName = roleMember.get_title();
            var roleDefs = role.get_roleDefinitionBindings();
            if (roleDefs != null) {
              var roleDefsEnumerator = roleDefs.getEnumerator();
              while (roleDefsEnumerator.moveNext()) {
                var rd = roleDefsEnumerator.get_current();
                var rdName = rd.get_name();
                if (memberTitleName == groupName && rd.get_basePermissions().has(permissionLevel)) {
                  match = true;
                  break;
                }
              }
            }
          }
        }
      }
      return match;
    }
    function m_fnGoToResponse(responseTitle, isIA) {
      if (!isIA) {
        var bFound = false;
        $("#ddlResponsesOpen > option").each(function() {
          if ($(this).text() == responseTitle) {
            bFound = true;
            notifyId = SP.UI.Notify.addNotification(
              "Displaying Response (" + responseTitle + ")",
              false
            );
            $("#ddlResponsesOpen").val(responseTitle).change();
            return false;
          }
        });
        if (!bFound) {
          $("#ddlResponsesProcessed > option").each(function() {
            if ($(this).text() == responseTitle) {
              bFound = true;
              notifyId = SP.UI.Notify.addNotification(
                "Displaying Response (" + responseTitle + ")",
                false
              );
              $("#ddlResponsesProcessed").val(responseTitle).change();
              return false;
            }
          });
        }
        $("#tabs").tabs({ active: 1 });
      }
    }
    function m_fnGetResponseDocStyleTag2(documentStatus) {
      var styleTag = {};
      if (documentStatus == "Archived")
        styleTag = { "background-color": "Gainsboro" };
      else if (documentStatus == "Approved")
        styleTag = { "background-color": "PaleGreen" };
      else if (documentStatus == "Rejected")
        styleTag = { "background-color": "LightSalmon" };
      else if (documentStatus == "Sent to QA")
        styleTag = { "background-color": "LightCyan" };
      else if (documentStatus == "Submitted")
        styleTag = { "background-color": "LemonChiffon" };
      else if (documentStatus == "Marked for Deletion")
        styleTag = {
          "background-color": "Gainsboro",
          "font-style": "italic"
        };
      return styleTag;
    }
    function m_fnGetResponseDocStyleTag(documentStatus) {
      var styleTag = "";
      if (documentStatus == "Archived")
        styleTag = " style='background-color:Gainsboro;' ";
      else if (documentStatus == "Approved")
        styleTag = " style='background-color:PaleGreen;' ";
      else if (documentStatus == "Rejected")
        styleTag = " style='background-color:LightSalmon;' ";
      else if (documentStatus == "Sent to QA")
        styleTag = " style='background-color:LightCyan;' ";
      else if (documentStatus == "Submitted")
        styleTag = " style='background-color:LemonChiffon;' ";
      else if (documentStatus == "Marked for Deletion")
        styleTag = " style='background-color:Gainsboro; font-style:italic' title='Marked for Deletion by the Action Office' ";
      return styleTag;
    }
    function m_fnCheckIfEmailFolderExists(items, requestNumber) {
      var bFolderExists = false;
      var listItemEnumerator = items.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var folderItem = listItemEnumerator.get_current();
        var itemName = folderItem.get_displayName();
        if (itemName == requestNumber) {
          var bFolderExists = true;
          break;
        }
      }
      return bFolderExists;
    }
    var m_cntAddToEmailFolder = 0;
    var m_cntAddedToEmailFolder = 0;
    function m_fnCreateEmailFolder(list, requestNumber, requestItem, OnComplete) {
      m_cntAddToEmailFolder = 0;
      m_cntAddedToEmailFolder = 0;
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      var itemCreateInfo = new SP.ListItemCreationInformation();
      itemCreateInfo.set_underlyingObjectType(SP.FileSystemObjectType.folder);
      itemCreateInfo.set_leafName(requestNumber);
      oNewEmailFolder = list.addItem(itemCreateInfo);
      oNewEmailFolder.set_item("Title", requestNumber);
      oNewEmailFolder.update();
      this.currentUser = web.get_currentUser();
      this.ownerGroup = web.get_associatedOwnerGroup();
      this.memberGroup = web.get_associatedMemberGroup();
      this.visitorGroup = web.get_associatedVisitorGroup();
      oNewEmailFolder.resetRoleInheritance();
      oNewEmailFolder.breakRoleInheritance(false, false);
      var roleDefBindingCollAdmin = SP.RoleDefinitionBindingCollection.newObject(currCtx);
      roleDefBindingCollAdmin.add(
        web.get_roleDefinitions().getByType(SP.RoleType.administrator)
      );
      var roleDefBindingCollContribute = SP.RoleDefinitionBindingCollection.newObject(currCtx);
      roleDefBindingCollContribute.add(
        web.get_roleDefinitions().getByType(SP.RoleType.contributor)
      );
      var roleDefBindingCollRestrictedRead = SP.RoleDefinitionBindingCollection.newObject(currCtx);
      roleDefBindingCollRestrictedRead.add(
        web.get_roleDefinitions().getByName("Restricted Read")
      );
      var roleDefBindingCollRestrictedContribute = SP.RoleDefinitionBindingCollection.newObject(currCtx);
      roleDefBindingCollRestrictedContribute.add(
        web.get_roleDefinitions().getByName("Restricted Contribute")
      );
      oNewEmailFolder.get_roleAssignments().add(ownerGroup, roleDefBindingCollAdmin);
      oNewEmailFolder.get_roleAssignments().add(memberGroup, roleDefBindingCollContribute);
      oNewEmailFolder.get_roleAssignments().add(visitorGroup, roleDefBindingCollRestrictedRead);
      var spGroupQA = Audit.Common.Utilities.GetSPSiteGroup(
        Audit.Common.Utilities.GetGroupNameQA()
      );
      if (spGroupQA != null)
        oNewEmailFolder.get_roleAssignments().add(spGroupQA, roleDefBindingCollRestrictedContribute);
      oNewEmailFolder.get_roleAssignments().getByPrincipal(currentUser).deleteObject();
      function onUpdatePermsSucceeded() {
        if (this.requestItem) {
          var arrActionOffice = this.requestItem.get_item("ActionOffice");
          if (arrActionOffice == null || arrActionOffice.length == 0) {
            if (this.OnComplete)
              this.OnComplete(true);
            return;
          }
          for (var x = 0; x < arrActionOffice.length; x++) {
            var actionOfficeName = arrActionOffice[x].get_lookupValue();
            var actionOfficeGroupName = Audit.Common.Utilities.GetAOSPGroupName(actionOfficeName);
            var actionOfficeGroup = Audit.Common.Utilities.GetSPSiteGroup(
              actionOfficeGroupName
            );
            if (actionOfficeGroup != null) {
              let onUpdateAOPermsSucceeded2 = function() {
                m_cntAddedToEmailFolder++;
                if (m_cntAddedToEmailFolder == m_cntAddToEmailFolder) {
                  if (this.OnComplete)
                    this.OnComplete(true);
                }
              }, onUpdateAOPermsFailed2 = function(sender, args) {
                m_cntAddedToEmailFolder++;
                if (m_cntAddedToEmailFolder == m_cntAddToEmailFolder) {
                  if (this.OnComplete)
                    this.OnComplete(true);
                }
              };
              var onUpdateAOPermsSucceeded = onUpdateAOPermsSucceeded2, onUpdateAOPermsFailed = onUpdateAOPermsFailed2;
              m_cntAddToEmailFolder++;
              var currCtx2 = new SP.ClientContext.get_current();
              var web2 = currCtx2.get_web();
              var roleDefBindingCollRestrictedContribute2 = SP.RoleDefinitionBindingCollection.newObject(currCtx2);
              roleDefBindingCollRestrictedContribute2.add(
                web2.get_roleDefinitions().getByName("Restricted Contribute")
              );
              this.oNewEmailFolder.get_roleAssignments().add(actionOfficeGroup, roleDefBindingCollRestrictedContribute2);
              var data2 = { OnComplete: this.OnComplete };
              currCtx2.executeQueryAsync(
                Function.createDelegate(data2, onUpdateAOPermsSucceeded2),
                Function.createDelegate(data2, onUpdateAOPermsFailed2)
              );
            }
          }
        } else {
          if (this.OnComplete)
            this.OnComplete(true);
        }
      }
      function onUpdatePermsFailed(sender, args) {
        statusId = SP.UI.Status.addStatus(
          "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
        );
      }
      var data = {
        /*item: oListItem, */
        requestItem,
        oNewEmailFolder,
        OnComplete
      };
      currCtx.executeQueryAsync(
        Function.createDelegate(data, onUpdatePermsSucceeded),
        Function.createDelegate(data, onUpdatePermsFailed)
      );
    }
    function m_fnSortResponseTitleNoCase(a, b) {
      var aTitle = a;
      var bTitle = b;
      let newA, newB;
      if (aTitle == null)
        aTitle = "";
      if (bTitle == null)
        bTitle = "";
      var aIndex = aTitle.lastIndexOf("-");
      if (aIndex >= 0) {
        var subA = aTitle.substring(0, aIndex + 1);
        var lastA = aTitle.replace(subA, "");
        var intA = parseInt(lastA, 10);
        var newIntA = Audit.Common.Utilities.PadDigits(intA, 5);
        newA = subA + newIntA;
      } else
        newA = aTitle;
      var bIndex = bTitle.lastIndexOf("-");
      if (bIndex >= 0) {
        var subB = bTitle.substring(0, bIndex + 1);
        var lastB = bTitle.replace(subB, "");
        var intB = parseInt(lastB, 10);
        var newIntB = Audit.Common.Utilities.PadDigits(intB, 5);
        newB = subB + newIntB;
      } else
        newB = bTitle;
      return newA.toLowerCase().localeCompare(newB.toLowerCase());
    }
    function m_fnSortResponseObjectNoCase(a, b) {
      var aTitle = a.title;
      var bTitle = b.title;
      var newA;
      var newB;
      if (aTitle == null)
        aTitle = "";
      if (bTitle == null)
        bTitle = "";
      var aIndex = aTitle.lastIndexOf("-");
      if (aIndex >= 0) {
        var subA = aTitle.substring(0, aIndex + 1);
        var lastA = aTitle.replace(subA, "");
        var intA = parseInt(lastA, 10);
        var newIntA = Audit.Common.Utilities.PadDigits(intA, 5);
        newA = subA + newIntA;
      } else
        newA = aTitle;
      var bIndex = bTitle.lastIndexOf("-");
      if (bIndex >= 0) {
        var subB = bTitle.substring(0, bIndex + 1);
        var lastB = bTitle.replace(subB, "");
        var intB = parseInt(lastB, 10);
        var newIntB = Audit.Common.Utilities.PadDigits(intB, 5);
        newB = subB + newIntB;
      } else
        newB = bTitle;
      return newA.toLowerCase().localeCompare(newB.toLowerCase());
    }
    function m_fnSortNoCase(a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    }
    function m_fnSortDate(a, b) {
      if (a == "")
        return -1;
      if (b == "")
        return 1;
      return new Date(a).getTime() - new Date(b).getTime();
    }
    function m_fnAddOptions(arr, ddlID, dateSort, responseSort) {
      if (arr == null)
        return;
      if (responseSort)
        arr.sort(m_fnSortResponseTitleNoCase);
      else if (!dateSort)
        arr.sort(m_fnSortNoCase);
      else
        arr.sort(m_fnSortDate);
      var rOptions = new Array(), j = -1;
      rOptions[++j] = "<option value=''>-Select-</option>";
      var arrLength = arr.length;
      for (var x = 0; x < arrLength; x++) {
        var option = $.trim(arr[x]);
        rOptions[++j] = "<option value='" + option + "'>" + option + "</option>";
      }
      var thisDDL = $(ddlID);
      thisDDL.empty().append(rOptions.join(""));
    }
    function m_fnExistsInArr(arr, val) {
      if (arr == null)
        return false;
      var arrLength = arr.length;
      for (var x = 0; x < arrLength; x++) {
        if (arr[x] == val)
          return true;
      }
      return false;
    }
    function m_fnGetTrueFalseIcon(val) {
      if (val == true)
        return "<span class='ui-icon ui-icon-check'>" + val + "</span>";
      else
        return "<span class='ui-icon ui-icon-close'>" + val + "</span>";
    }
    function m_fnGetFriendlyDisplayName(oListItem, fieldName) {
      var user = oListItem.get_item(fieldName);
      if (user == null)
        return "";
      else
        return user.get_lookupValue();
    }
    function m_fnPadDigits(n, totalDigits) {
      n = n.toString();
      var pd = "";
      if (totalDigits > n.length) {
        for (let i = 0; i < totalDigits - n.length; i++) {
          pd += "0";
        }
      }
      return pd + n.toString();
    }
    function m_fnPreciseRound(num, decimals) {
      var sign = num >= 0 ? 1 : -1;
      return (Math.round(num * Math.pow(10, decimals) + sign * 1e-3) / Math.pow(10, decimals)).toFixed(decimals);
    }
    function m_fnGetFriendlyFileSize(fileSize) {
      if (fileSize == null || fileSize == "")
        return "";
      if (fileSize > 1048576) {
        fileSize = Audit.Common.Utilities.PreciseRound(fileSize / 1048576, 2) + " MB";
      } else if (fileSize > 1024) {
        fileSize = Audit.Common.Utilities.PreciseRound(fileSize / 1024, 2) + " KB";
      } else {
        fileSize += " B";
      }
      return fileSize;
    }
    function m_fnISODateString(d) {
      function pad(n) {
        return n < 10 ? "0" + n : n;
      }
      return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()) + "T" + pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds()) + "Z";
    }
    function m_fnBindHandlerResponseDoc() {
      $(".requestInfo-response-doc img").click(function(event) {
        event.preventDefault();
        var curIcon = $(this).attr("src");
        if (curIcon == "/_layouts/images/minus.gif")
          $(this).attr("src", "/_layouts/images/plus.gif");
        else
          $(this).attr("src", "/_layouts/images/minus.gif");
        $(this).parent().parent().nextUntil("tr.requestInfo-response-doc").each(function() {
          $(this).toggleClass("collapsed");
        });
      });
    }
    function m_fnGetLookupFormField(fieldTitle) {
      if ($("select[title='" + fieldTitle + "']").html() !== null) {
        return $("select[title='" + fieldTitle + "']");
      } else {
        return $("input[title='" + fieldTitle + "']");
      }
    }
    function m_fnGetLookupDisplayText(fieldTitle) {
      if ($("select[title='" + fieldTitle + "']").html() !== null) {
        return $("select[title='" + fieldTitle + "'] option:selected").text();
      } else {
        return $("input[title='" + fieldTitle + "']").val();
      }
    }
    function m_fnSetLookupFromFieldNameByText(fieldName, text) {
      try {
        if (text == void 0)
          return;
        var theSelect = m_fnGetTagFromIdentifierAndTitle("select", "", fieldName);
        if (theSelect == null) {
          var theInput = m_fnGetTagFromIdentifierAndTitle("input", "", fieldName);
          ShowDropdown(theInput.id);
          var opt = document.getElementById(theInput.opt);
          m_fnSetSelectedOptionByText(opt, text);
          OptLoseFocus(opt);
        } else {
          m_fnSetSelectedOptionByText(theSelect, text);
        }
      } catch (ex) {
      }
    }
    function m_fnSetSelectedOptionByText(select, text) {
      var opts = select.options;
      var optLength = opts.length;
      if (select == null)
        return;
      for (var i = 0; i < optLength; i++) {
        if (opts[i].text == text) {
          select.selectedIndex = i;
          return true;
        }
      }
      return false;
    }
    function m_fnGetTagFromIdentifierAndTitle(tagName, identifier, title) {
      var idLength = identifier.length;
      var tags = document.getElementsByTagName(tagName);
      for (var i = 0; i < tags.length; i++) {
        var tagID = tags[i].id;
        if (tags[i].title == title && (identifier == "" || tagID.indexOf(identifier) == tagID.length - idLength)) {
          return tags[i];
        }
      }
      return null;
    }
    function m_fnViewUserManuals(docType) {
      var options = SP.UI.$create_DialogOptions();
      options.title = "User Manual";
      options.height = 250;
      if (docType != null)
        options.url = Audit.Common.Utilities.GetSiteUrl() + "/pages/AuditUserManuals.aspx?FilterField1=DocType&FilterValue1=" + docType;
      else
        options.url = Audit.Common.Utilities.GetSiteUrl() + "/pages/AuditUserManuals.aspx";
      SP.UI.ModalDialog.showModalDialog(options);
    }
    function m_fnPrintPage(pageTitle, divTbl) {
      var curDate = /* @__PURE__ */ new Date();
      var siteUrl = Audit.Common.Utilities.GetSiteUrl();
      var cssLink1 = siteUrl + "/siteassets/css/tablesorter/style.css?v=" + curDate.format("MM_dd_yyyy");
      var cssLink2 = siteUrl + "/siteAssets/css/audit_styles.css?v=" + curDate.format("MM_dd_yyyy");
      var divOutput = $(divTbl).html();
      var updatedDivOutput = $("<div>").append(divOutput);
      updatedDivOutput.find(".sr-response-title a").each(function() {
        $(this).removeAttr("onclick");
        $(this).removeAttr("href");
      });
      divOutput = updatedDivOutput.html();
      var printDateString = curDate.format("MM/dd/yyyy hh:mm tt");
      printDateString = "<div style='padding-bottom:10px;'>" + printDateString + "</div>";
      divOutput = printDateString + divOutput;
      var cssFile1 = $("<div></div>");
      var cssFile2 = $("<div></div>");
      var def1 = $.Deferred();
      var def2 = $.Deferred();
      var cssFileText = "";
      cssFile1.load(cssLink1, function() {
        cssFileText += "<style>" + cssFile1.html() + "</style>";
        def1.resolve();
      });
      cssFile2.load(cssLink2, function() {
        cssFileText += "<style>" + cssFile2.html() + "</style>";
        def2.resolve();
      });
      $.when(def1, def2).done(function() {
        var html2 = "<HTML>\n<HEAD>\n\n<Title>" + pageTitle + "</Title>\n" + cssFileText + "\n<style>.hideOnPrint, .rowFilters {display:none}</style>\n</HEAD>\n<BODY>\n" + divOutput + "\n</BODY>\n</HTML>";
        var printWP = window.open("", "printWebPart");
        printWP.document.open();
        printWP.document.write(html2);
        printWP.document.close();
        printWP.print();
      });
    }
    function m_fnExportToCsv(fileName, tableName, removeHeader) {
      var data = m_fnGetCellValues(tableName);
      if (removeHeader == true)
        data = data.slice(1);
      var csv = m_fnConvertToCsv(data);
      if (navigator.userAgent.search("Trident") >= 0) {
        window.CsvExpFrame.document.open("text/html", "replace");
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
    function m_fnGetCellValues(tableName) {
      var table = document.getElementById(tableName);
      if (table.innerHTML.indexOf("rowFilters") >= 0) {
        var deets = $("<div>").append(table.outerHTML);
        deets.find(".rowFilters").each(function() {
          $(this).remove();
        });
        table = deets.find("table")[0];
      }
      if (table.innerHTML.indexOf("footer") >= 0) {
        var deets = $("<div>").append(table.outerHTML);
        deets.find(".footer").each(function() {
          $(this).remove();
        });
        table = deets.find("table")[0];
      }
      var tableArray = [];
      for (var r = 0, n = table.rows.length; r < n; r++) {
        tableArray[r] = [];
        for (var c = 0, m = table.rows[r].cells.length; c < m; c++) {
          var text = table.rows[r].cells[c].textContent || table.rows[r].cells[c].innerText;
          tableArray[r][c] = text.trim();
        }
      }
      return tableArray;
    }
    function m_fnConvertToCsv(objArray) {
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
      GetSiteUrl: function() {
        if (m_siteUrl == "/")
          return "";
        else
          return m_siteUrl;
      },
      GetListTitleRequests: function() {
        return m_listTitleRequests;
      },
      GetListNameRequests: function() {
        return m_listNameRequests;
      },
      GetListTitleRequestsInternal: function() {
        return m_listTitleRequestsInternal;
      },
      GetListNameRequestsInternal: function() {
        return m_listNameRequestsInternal;
      },
      GetListTitleResponses: function() {
        return m_listTitleResponses;
      },
      GetListNameResponses: function() {
        return m_listNameResponses;
      },
      GetLibTitleRequestDocs: function() {
        return m_libTitleRequestDocs;
      },
      GetLibNameRequestDocs: function() {
        return m_libNameRequestDocs;
      },
      GetLibTitleCoverSheets: function() {
        return m_libTitleCoverSheet;
      },
      GetLibNameCoverSheets: function() {
        return m_libNameCoverSheet;
      },
      GetLibTitleResponseDocs: function() {
        return m_libTitleResponseDocs;
      },
      GetLibNameResponseDocs: function() {
        return m_libNameResponseDocs;
      },
      GetLibTitleResponseDocsEA: function() {
        return m_libTitleResponseDocsEA;
      },
      GetLibNameResponseDocsEA: function() {
        return m_libNameResponseDocsEA;
      },
      GetListTitleActionOffices: function() {
        return m_listTitleActionOffices;
      },
      GetListNameActionOffices: function() {
        return m_listNameActionOffices;
      },
      GetListTitleEmailHistory: function() {
        return m_listTitleEmailHistory;
      },
      GetListNameEmailHistory: function() {
        return m_listNameEmailHistory;
      },
      GetListTitleBulkResponses: function() {
        return m_listTitleBulkResponses;
      },
      GetListNameBulkResponses: function() {
        return m_listNameBulkResponses;
      },
      GetListTitleBulkPermissions: function() {
        return m_listTitleBulkPermissions;
      },
      GetListNameBulkPermissions: function() {
        return m_listNameBulkPermissions;
      },
      GetGroupNameSpecialPerm1: function() {
        return m_groupNameSpecialPermName1;
      },
      GetGroupNameSpecialPerm2: function() {
        return m_groupNameSpecialPermName2;
      },
      GetGroupNameQA: function() {
        return m_groupNameQA;
      },
      GetGroupNameEA: function() {
        return m_groupNameEA;
      },
      Refresh: m_fnRefresh,
      OnLoadDisplayTimeStamp: m_fnOnLoadDisplayTimeStamp,
      OnLoadDisplayTabAndResponse: m_fnOnLoadDisplayTabAndResponse,
      OnLoadFilterResponses: function(responseStatus1, responseStatus2) {
        m_fnOnLoadFilterResponses(responseStatus1, responseStatus2);
      },
      SetResponseDocLibGUID: function(libGUID) {
        m_libResponseDocsLibraryGUID = libGUID;
      },
      GetResponseDocLibGUID: function() {
        return m_libResponseDocsLibraryGUID;
      },
      LoadSiteGroups: function(itemColl) {
        m_fnLoadSiteGroups(itemColl);
      },
      GetSPSiteGroup: function(groupName) {
        return m_fnGetSPSiteGroup(groupName);
      },
      LoadActionOffices: function(itemColl) {
        m_fnLoadActionOffices(itemColl);
      },
      GetActionOffices: function() {
        return m_arrAOs;
      },
      GetAOSPGroupName: function(groupName) {
        return m_fnGetAOSPGroupName(groupName);
      },
      CheckSPItemHasGroupPermission: function(item, groupName, permissionLevel) {
        return m_fnCheckSPItemHasGroupPermission(
          item,
          groupName,
          permissionLevel
        );
      },
      GoToResponse: function(responseTitle, isIA) {
        m_fnGoToResponse(responseTitle, isIA);
      },
      GetResponseDocStyleTag: function(documentStatus) {
        return m_fnGetResponseDocStyleTag(documentStatus);
      },
      GetResponseDocStyleTag2: function(documentStatus) {
        return m_fnGetResponseDocStyleTag2(documentStatus);
      },
      CheckIfEmailFolderExists: function(items, requestNumber) {
        return m_fnCheckIfEmailFolderExists(items, requestNumber);
      },
      CreateEmailFolder: function(list, requestNumber, requestItem, OnComplete) {
        return m_fnCreateEmailFolder(
          list,
          requestNumber,
          requestItem,
          OnComplete
        );
      },
      AddOptions: function(arr, ddlID, dateSort, responseSort) {
        m_fnAddOptions(arr, ddlID, dateSort, responseSort);
      },
      ExistsInArr: function(arr, val) {
        return m_fnExistsInArr(arr, val);
      },
      GetTrueFalseIcon: function(val) {
        return m_fnGetTrueFalseIcon(val);
      },
      PadDigits: function(n, totalDigits) {
        return m_fnPadDigits(n, totalDigits);
      },
      PreciseRound: function(num, decimals) {
        return m_fnPreciseRound(num, decimals);
      },
      GetFriendlyFileSize: function(fileSize) {
        return m_fnGetFriendlyFileSize(fileSize);
      },
      GetISODateString: function(d) {
        return m_fnISODateString(d);
      },
      GetFriendlyDisplayName: function(oListItem, fieldName) {
        return m_fnGetFriendlyDisplayName(oListItem, fieldName);
      },
      BindHandlerResponseDoc: m_fnBindHandlerResponseDoc,
      PrintStatusReport: function(pageTitle, divTbl) {
        m_fnPrintPage(pageTitle, divTbl);
      },
      ExportToCsv: function(fileName, tableName, removeHeader) {
        m_fnExportToCsv(fileName, tableName, removeHeader);
      },
      ViewUserManuals: function(docType) {
        m_fnViewUserManuals(docType);
      },
      //GetLookupFieldText: function( fieldName ){ return m_fnGetLookupFieldText( fieldName); },
      GetLookupDisplayText: function(fieldName) {
        return m_fnGetLookupDisplayText(fieldName);
      },
      GetLookupFormField: function(fieldName) {
        return m_fnGetLookupFormField(fieldName);
      },
      SetLookupFromFieldNameByText: function(fieldName, text) {
        return m_fnSetLookupFromFieldNameByText(fieldName, text);
      },
      SortResponseObjects: function(a, b) {
        return m_fnSortResponseObjectNoCase(a, b);
      },
      SortResponseTitles: m_fnSortResponseTitleNoCase
    };
    return publicMembers;
  };
  InitReport();

  // src/pages/sp_db/sp_db.js
  document.getElementById("app").innerHTML = spDbTemplate;
  window.Audit = window.Audit || {};
  Audit.SPReport = Audit.SPReport || {};
  var paramShowSiteActionsToAnyone = GetUrlKeyValue("ShowSiteActions");
  if (paramShowSiteActionsToAnyone != true) {
    $("#RibbonContainer-TabRowLeft").hide();
    $(".ms-siteactionsmenu").hide();
  }
  if (document.readyState === "ready" || document.readyState === "complete") {
    InitReport2();
  } else {
    document.onreadystatechange = () => {
      if (document.readyState === "complete" || document.readyState === "ready") {
        ExecuteOrDelayUntilScriptLoaded(function() {
          SP.SOD.executeFunc("sp.js", "SP.ClientContext", InitReport2);
        }, "sp.js");
      }
    };
  }
  function InitReport2() {
    Audit.SPReport.Report = new Audit.SPReport.NewReportPage();
    Audit.SPReport.Init();
  }
  Audit.SPReport.Init = function() {
    var paramShowSiteActionsToAnyone2 = GetUrlKeyValue("ShowSiteActions");
    if (paramShowSiteActionsToAnyone2 != true) {
      $("#RibbonContainer-TabRowLeft").hide();
      $(".ms-siteactionsmenu").hide();
    }
    setInterval(function() {
      var divVal = $("#divCounter").text();
      var count = divVal * 1 - 1;
      $("#divCounter").text(count);
      if (count <= 0) {
        Audit.Common.Utilities.Refresh();
      }
    }, 1e3);
  };
  Audit.SPReport.NewReportPage = function() {
    var m_bigMap = new Object();
    var m_arrRequests = new Array();
    var m_arrResponses = new Array();
    var m_requestItems;
    var m_responseItems;
    var m_ResponseDocsItems;
    var statusId2;
    var m_bHasAccessToViewPerms = false;
    ko.extenders.logChangeInArr = function(target, option) {
      target.subscribe(function(newValue) {
        console.log(option + ": " + JSON.stringify(newValue));
        console.log(newValue.length);
      });
      return target;
    };
    function ViewModel() {
      var self = this;
      self.siteUrl = Audit.Common.Utilities.GetSiteUrl();
      self.arrResponses = ko.observableArray(null);
      self.arrFilteredResponsesCount = ko.observable(0);
      self.filterRequestID = ko.observable();
      self.filterRequestStatus = ko.observable();
      self.filterRequestIntDueDate = ko.observable();
      self.filterSampleNum = ko.observable();
      self.filterResponseName = ko.observable();
      self.filterResponseStatus = ko.observable();
      self.filterResponseName2 = ko.observable();
      self.currentResponse = ko.observable();
      self.arrCoverSheets = ko.observableArray(null);
      self.arrResponseDocs = ko.observableArray(null);
      self.cntResponseDocs = ko.observable(0);
      self.doSort = ko.observable(false);
      self.currentResponseStatus = ko.computed(function() {
        if (self.currentResponse()) {
          if (self.currentResponse().resStatus == "7-Closed")
            return self.currentResponse().resStatus + " on " + self.currentResponse().closedDate + " by " + self.currentResponse().closedBy;
          return self.currentResponse().resStatus;
        }
        return "";
      }, self).extend({ notify: "always" });
      self.currentResponseRequestStatus = ko.computed(function() {
        if (self.currentResponse()) {
          if (self.currentResponse().request.status == "Closed")
            return self.currentResponse().request.status + " on " + self.currentResponse().request.closedDate;
          return self.currentResponse().request.status;
        }
        return "";
      }, self);
      self.currentResponseRequestStatusStyle = ko.computed(function() {
        if (self.currentResponseStatus() != "") {
          if (self.currentResponse().request.status == "Closed" || self.currentResponse().request.status == "Canceled")
            return "red";
          else
            return "green";
        }
        return "";
      }, self);
      self.ClearFilters = function() {
        self.filterRequestID("");
        self.filterRequestStatus("");
        self.filterRequestIntDueDate("");
        self.filterSampleNum("");
        self.filterResponseName("");
        self.filterResponseStatus("");
      };
      self.GetDistinctResponsesDDVals = function(fieldName) {
        return ko.computed(
          {
            read: function() {
              var types = ko.utils.arrayMap(self.arrResponses(), function(item) {
                return item[fieldName];
              });
              var ddArr = ko.utils.arrayGetDistinctValues(types).sort();
              return ddArr;
            }
          },
          self
        );
      };
      self.GoToResponse = function(response) {
        $("#tabs").tabs({ active: 1 });
        self.filterResponseName2(response.title);
      };
      self.arrResponses.subscribe(function(newValue) {
        if (self.arrResponses().length > 0 && self.doSort()) {
          self.arrFilteredResponsesCount(self.arrResponses().length);
          setTimeout(function() {
            $("#tblStatusReportResponses").tablesorter({
              sortList: [[7, 1]],
              selectorHeaders: ".sorter-true"
            });
          }, 200);
        }
      });
      self.filterResponseName2.subscribe(function(newValue) {
        var oResponse = m_bigMap["response-" + self.filterResponseName2()];
        if (oResponse) {
          self.currentResponse(oResponse);
          LoadTabResponseInfoCoverSheets(oResponse);
          LoadTabResponseInfoResponseDocs(oResponse);
        } else {
          self.currentResponse(null);
          self.arrCoverSheets([]);
          self.arrResponseDocs([]);
          self.cntResponseDocs(0);
        }
      });
      self.FilterChanged = function() {
        setTimeout(function() {
          var requestID = self.filterRequestID();
          var requestStatus = self.filterRequestStatus();
          var requestIntDueDate = self.filterRequestIntDueDate();
          var sampleNum = self.filterSampleNum();
          var responseName = self.filterResponseName();
          var responseStatus = self.filterResponseStatus();
          if (!requestID && !requestStatus && !requestIntDueDate && !sampleNum && !responseName && !responseStatus) {
            ko.utils.arrayForEach(self.arrResponses(), function(item) {
              item.visibleRow(true);
            });
            self.arrFilteredResponsesCount(self.arrResponses().length);
          }
          var result = [];
          requestID = !requestID ? "" : requestID;
          requestStatus = !requestStatus ? "" : requestStatus;
          requestIntDueDate = !requestIntDueDate ? "" : requestIntDueDate;
          sampleNum = !sampleNum ? "" : sampleNum;
          responseName = !responseName ? "" : responseName;
          responseStatus = !responseStatus ? "" : responseStatus;
          var count = 0;
          ko.utils.arrayForEach(self.arrResponses(), function(item) {
            var hide = false;
            if (!hide && requestID != "" && item.reqNumber != requestID)
              hide = true;
            if (!hide && requestStatus != "" && item.requestStatus != requestStatus)
              hide = true;
            if (!hide && requestIntDueDate != "" && item.internalDueDate != requestIntDueDate)
              hide = true;
            if (!hide && sampleNum != "" && item.sample != sampleNum)
              hide = true;
            if (!hide && responseName != "" && item.title != responseName)
              hide = true;
            if (!hide && responseStatus != "" && item.status != responseStatus)
              hide = true;
            item.visibleRow(!hide);
            if (!hide)
              count++;
          });
          self.arrFilteredResponsesCount(count);
        }, 100);
      };
    }
    var _myViewModel = new ViewModel();
    ko.applyBindings(_myViewModel);
    LoadInfo();
    function LoadInfo() {
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      const m_currentUser = web.get_currentUser();
      currCtx.load(m_currentUser);
      var requestList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleRequests());
      var requestQuery = new SP.CamlQuery();
      requestQuery.set_viewXml(
        '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'
      );
      m_requestItems = requestList.getItems(requestQuery);
      currCtx.load(
        m_requestItems,
        "Include(ID, Title, ReqSubject, ReqStatus, IsSample, InternalDueDate, ActionOffice, Comments, RelatedAudit, ActionItems, EmailSent, ClosedDate, Modified)"
      );
      var responseList = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleResponses());
      var responseQuery = new SP.CamlQuery();
      responseQuery.set_viewXml(
        '<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="ReqNum"/></OrderBy></Query></View>'
      );
      m_responseItems = responseList.getItems(responseQuery);
      currCtx.load(
        m_responseItems,
        "Include(ID, Title, ReqNum, ActionOffice, SampleNumber, ResStatus, Comments, Modified, ClosedDate, ClosedBy)"
      );
      var responseDocsLib = web.get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());
      var responseDocsQuery = new SP.CamlQuery();
      responseDocsQuery.set_viewXml(
        '<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="ReqNum"/><FieldRef Name="ResID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">0</Value></Eq></Where></Query></View>'
      );
      m_ResponseDocsItems = responseDocsLib.getItems(responseDocsQuery);
      currCtx.load(
        m_ResponseDocsItems,
        "Include(ID, FSObjType, Title, ReqNum, ResID, DocumentStatus, RejectReason, ReceiptDate, FileLeafRef, FileDirRef, File_x0020_Size, CheckoutUser, Modified, Editor)"
      );
      currCtx.executeQueryAsync(OnSuccess, OnFailure);
      function OnSuccess(sender, args) {
        var requestList2 = web.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleRequests());
        var requestQuery2 = new SP.CamlQuery();
        requestQuery2.set_viewXml(
          '<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'
        );
        var m_requestItemsWithPerms = requestList2.getItems(requestQuery2);
        currCtx.load(
          m_requestItemsWithPerms,
          "Include(ID, Title, ReqSubject, ReqStatus, IsSample, InternalDueDate, ActionOffice, Comments, RelatedAudit, ActionItems, EmailSent, ClosedDate, Modified, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"
        );
        function OnSuccess2(sender2, args2) {
          m_bHasAccessToViewPerms = true;
          m_requestItems = m_requestItemsWithPerms;
          $("#divRefresh").show();
          m_fnLoadData();
        }
        function OnFailure2(sender2, args2) {
          $("#divRefresh").show();
          m_fnLoadData();
        }
        currCtx.executeQueryAsync(OnSuccess2, OnFailure2);
      }
      function OnFailure(sender, args) {
        $("#divRefresh").hide();
        $("#divLoading").hide();
        statusId2 = SP.UI.Status.addStatus(
          "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
        );
        SP.UI.Status.setStatusPriColor(statusId2, "red");
      }
    }
    function m_fnLoadData() {
      LoadRequests();
      LoadResponses();
      LoadResponseDocs();
      $("#tabs").tabs().show();
      LoadTabStatusReport(m_arrResponses);
    }
    function OnLoadDisplayTabAndRequest() {
      var paramResponseNum = GetUrlKeyValue("ResNum");
      if (paramResponseNum != null && paramResponseNum != "") {
        _myViewModel.filterResponseName2(paramResponseNum);
      }
      var paramTabIndex = GetUrlKeyValue("Tab");
      if (paramTabIndex != null && paramTabIndex != "") {
        $("#tabs").tabs("option", "active", paramTabIndex);
      }
    }
    function LoadRequests() {
      m_bigMap = new Object();
      m_arrRequests = new Array();
      var cnt = 0;
      var listItemEnumerator = m_requestItems.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        var id = oListItem.get_item("ID");
        var number = oListItem.get_item("Title");
        var status = oListItem.get_item("ReqStatus");
        var sample = oListItem.get_item("IsSample");
        var emailSent = oListItem.get_item("EmailSent");
        var subject = oListItem.get_item("ReqSubject");
        if (subject == null)
          subject = "";
        var internalDueDate = oListItem.get_item("InternalDueDate");
        var closedDate = oListItem.get_item("ClosedDate");
        internalDueDate != null ? internalDueDate = internalDueDate.format("MM/dd/yyyy") : internalDueDate = "";
        closedDate != null ? closedDate = closedDate.format("MM/dd/yyyy") : closedDate = "";
        var arrActionOffice = oListItem.get_item("ActionOffice");
        var actionOffice = "";
        for (var x = 0; x < arrActionOffice.length; x++) {
          actionOffice += "<div>" + arrActionOffice[x].get_lookupValue() + "</div>";
        }
        var comments = oListItem.get_item("Comments");
        var relatedAudit = oListItem.get_item("RelatedAudit");
        var actionItems = oListItem.get_item("ActionItems");
        if (comments == null)
          comments = "";
        if (relatedAudit == null)
          relatedAudit = "";
        if (actionItems == null)
          actionItems = "";
        var requestObject = new Object();
        requestObject["ID"] = id;
        requestObject["number"] = number;
        requestObject["subject"] = subject;
        requestObject["status"] = status;
        requestObject["internalDueDate"] = internalDueDate;
        requestObject["sample"] = sample;
        requestObject["responses"] = new Array();
        requestObject["actionOffice"] = actionOffice;
        requestObject["comments"] = comments;
        requestObject["emailSent"] = emailSent;
        requestObject["closedDate"] = closedDate;
        requestObject["relatedAudit"] = relatedAudit;
        requestObject["actionItems"] = actionItems;
        if (m_bHasAccessToViewPerms) {
          try {
            var permissionsToCheck = SP.PermissionKind.viewListItems;
            var match1 = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
              oListItem,
              Audit.Common.Utilities.GetGroupNameSpecialPerm1(),
              permissionsToCheck
            );
            var match2 = Audit.Common.Utilities.CheckSPItemHasGroupPermission(
              oListItem,
              Audit.Common.Utilities.GetGroupNameSpecialPerm2(),
              permissionsToCheck
            );
            if (!match1 && !match2)
              continue;
          } catch (err) {
          }
        }
        requestObject["arrIndex"] = cnt;
        m_arrRequests.push(requestObject);
        m_bigMap["request-" + number] = requestObject;
        cnt++;
      }
    }
    function LoadResponses() {
      m_arrResponses = new Array();
      var cnt = 0;
      var listItemEnumerator = m_responseItems.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        var number = oListItem.get_item("ReqNum");
        if (number != null) {
          number = number.get_lookupValue();
          var responseObject = new Object();
          responseObject["request"] = m_bigMap["request-" + number];
          if (!responseObject.request || !responseObject.request.emailSent)
            continue;
          responseObject["resStatus"] = oListItem.get_item("ResStatus");
          if (responseObject["resStatus"] != "4-Approved for QA" && responseObject["resStatus"] != "7-Closed" && responseObject["resStatus"] != "6-Reposted After Rejection")
            continue;
          responseObject["actionOffice"] = oListItem.get_item("ActionOffice");
          if (responseObject["actionOffice"] == null)
            responseObject["actionOffice"] = "";
          else
            responseObject["actionOffice"] = responseObject["actionOffice"].get_lookupValue();
          if (responseObject["actionOffice"] == "")
            continue;
          responseObject["ID"] = oListItem.get_item("ID");
          responseObject["number"] = number;
          var title = oListItem.get_item("Title");
          responseObject["title"] = title;
          var modified = oListItem.get_item("Modified");
          modified != null ? modified = modified.format("MM/dd/yyyy hh:mm tt") : modified = "";
          responseObject["modified"] = modified;
          var closedDate = oListItem.get_item("ClosedDate");
          closedDate != null ? closedDate = closedDate.format("MM/dd/yyyy") : closedDate = "";
          responseObject["closedDate"] = closedDate;
          var comments = oListItem.get_item("Comments");
          if (comments == null)
            comments = "";
          responseObject["comments"] = comments;
          responseObject["closedBy"] = Audit.Common.Utilities.GetFriendlyDisplayName(oListItem, "ClosedBy");
          responseObject["sample"] = oListItem.get_item("SampleNumber");
          if (responseObject["sample"] == null)
            responseObject["sample"] = "";
          responseObject["coversheets"] = new Array();
          responseObject["responseDocs"] = new Array();
          responseObject["arrIndex"] = cnt;
          m_arrResponses.push(responseObject);
          m_bigMap["response-" + title] = responseObject;
          cnt++;
        }
      }
    }
    function LoadResponseDocs() {
      var listItemEnumerator = m_ResponseDocsItems.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        if (oListItem.get_item("DocumentStatus") == "Open" || oListItem.get_item("DocumentStatus") == "Marked for Deletion" || oListItem.get_item("DocumentStatus") == "Submitted")
          continue;
        var responseDocID = oListItem.get_item("ID");
        var requestNumber = oListItem.get_item("ReqNum");
        if (requestNumber != null)
          requestNumber = requestNumber.get_lookupValue();
        var responseID = oListItem.get_item("ResID");
        if (responseID != null)
          responseID = responseID.get_lookupValue();
        if (requestNumber == null || responseID == null)
          continue;
        try {
          var bigMapItem = m_bigMap["response-" + responseID];
          var indexOfArrResponses = bigMapItem.arrIndex;
          var oResponse = m_arrResponses[indexOfArrResponses];
          if (oResponse) {
            var responseDocObject = new Object();
            responseDocObject["ID"] = oListItem.get_item("ID");
            responseDocObject["title"] = oListItem.get_item("FileLeafRef");
            responseDocObject["folder"] = oListItem.get_item("FileDirRef");
            responseDocObject["documentStatus"] = oListItem.get_item("DocumentStatus");
            responseDocObject["rejectReason"] = oListItem.get_item("RejectReason");
            if (responseDocObject["rejectReason"] == null)
              responseDocObject["rejectReason"] = "";
            var fileSize = oListItem.get_item("File_x0020_Size");
            fileSize = Audit.Common.Utilities.GetFriendlyFileSize(fileSize);
            responseDocObject["fileSize"] = fileSize;
            var receiptDate = "";
            if (oListItem.get_item("ReceiptDate") != null && oListItem.get_item("ReceiptDate") != "")
              receiptDate = oListItem.get_item("ReceiptDate").format("MM/dd/yyyy");
            responseDocObject["receiptDate"] = receiptDate;
            var modifiedDate = "";
            if (oListItem.get_item("Modified") != null && oListItem.get_item("Modified") != "")
              modifiedDate = oListItem.get_item("Modified").format("MM/dd/yyyy hh:mm tt");
            responseDocObject["modifiedDate"] = modifiedDate;
            responseDocObject["modifiedBy"] = Audit.Common.Utilities.GetFriendlyDisplayName(oListItem, "Editor");
            responseDocObject["checkedOutBy"] = Audit.Common.Utilities.GetFriendlyDisplayName(
              oListItem,
              "CheckoutUser"
            );
            oResponse["responseDocs"].push(responseDocObject);
          }
        } catch (err) {
        }
      }
    }
    function LoadTabStatusReport(arr) {
      if (arr == null)
        return;
      var bLoadTest = GetUrlKeyValue("LoadTest");
      var responseArr = new Array();
      var arrLength = arr.length;
      while (arrLength--) {
        var oResponse = arr[arrLength];
        var responseTitle = oResponse.title;
        var requestStatus = oResponse.request.status;
        var responseStatus = oResponse.resStatus;
        var aResponse = {
          reqNumber: oResponse.request.number,
          requestStatus,
          internalDueDate: oResponse.request.internalDueDate,
          sample: oResponse.sample,
          title: responseTitle,
          status: responseStatus,
          docCount: oResponse.responseDocs.length,
          modified: oResponse.modified,
          visibleRow: ko.observable(true)
        };
        responseArr.push(aResponse);
        if (bLoadTest) {
          for (var x = 0; x < 299; x++) {
            responseArr.push(aResponse);
          }
        }
      }
      if (responseArr.length > 0) {
        DoUpdateModel(responseArr);
      } else {
        Audit.Common.Utilities.OnLoadDisplayTimeStamp();
      }
    }
    function DoUpdateModel(arrResponsesToAdd) {
      var subArr = [];
      var bContinue = true;
      var batchSize = 250;
      if (arrResponsesToAdd.length == 0) {
        bContinue = false;
        Audit.Common.Utilities.OnLoadDisplayTimeStamp();
        BindHandlersOnLoad();
        OnLoadDisplayTabAndRequest();
      } else if (arrResponsesToAdd.length >= batchSize) {
        subArr = arrResponsesToAdd.slice(0, batchSize);
        arrResponsesToAdd.splice(0, batchSize);
      } else if (arrResponsesToAdd.length > 0) {
        subArr = arrResponsesToAdd.slice(0, arrResponsesToAdd.length);
        arrResponsesToAdd.splice(0, arrResponsesToAdd.length);
      }
      if (bContinue) {
        ko.utils.arrayPushAll(_myViewModel.arrResponses(), subArr);
        if (arrResponsesToAdd.length == 0)
          _myViewModel.doSort(true);
        _myViewModel.arrResponses.valueHasMutated();
        setTimeout(function() {
          DoUpdateModel(arrResponsesToAdd);
        }, 100);
      }
    }
    function LoadTabResponseInfoCoverSheets(oResponse) {
      _myViewModel.arrCoverSheets([]);
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      var coverSheetLib = web.get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleCoverSheets());
      var coverSheetQuery = new SP.CamlQuery();
      coverSheetQuery.set_viewXml(
        '<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="ReqNum"/><Value Type="Text">' + oResponse.request.number + "</Value></Eq></Where></Query></View>"
      );
      var m_subsetCoverSheetItems = coverSheetLib.getItems(coverSheetQuery);
      currCtx.load(
        m_subsetCoverSheetItems,
        "Include(ID, Title, ReqNum, ActionOffice, FileLeafRef, FileDirRef)"
      );
      var data = { oResponse };
      function OnSuccess(sender, args) {
        var arrCS = new Array();
        var listItemEnumerator = m_subsetCoverSheetItems.getEnumerator();
        while (listItemEnumerator.moveNext()) {
          var oListItem = listItemEnumerator.get_current();
          if (oListItem.get_item("ActionOffice") != null) {
            var arrActionOffice = oListItem.get_item("ActionOffice");
            if (arrActionOffice.length > 0) {
              for (var y = 0; y < arrActionOffice.length; y++) {
                var curActionOffice = arrActionOffice[y].get_lookupValue();
                if (curActionOffice == this.oResponse.actionOffice) {
                  var csFolder = oListItem.get_item("FileDirRef");
                  var csTitle = oListItem.get_item("FileLeafRef");
                  var encodedTitle = csTitle.replace(/'/g, "&#39");
                  arrCS.push({
                    folder: csFolder,
                    title: csTitle,
                    link: "STSNavigate('../_layouts/download.aspx?SourceUrl=" + csFolder + "/" + encodedTitle + "')"
                  });
                  break;
                }
              }
            }
          }
        }
        ko.utils.arrayPushAll(_myViewModel.arrCoverSheets(), arrCS);
        _myViewModel.arrCoverSheets.valueHasMutated();
      }
      function OnFailure(sender, args) {
      }
      currCtx.executeQueryAsync(
        Function.createDelegate(data, OnSuccess),
        Function.createDelegate(data, OnFailure)
      );
    }
    function LoadTabResponseInfoResponseDocs(oResponse) {
      _myViewModel.arrResponseDocs([]);
      _myViewModel.cntResponseDocs(0);
      if (oResponse == null || oResponse.responseDocs.length == 0) {
        return;
      }
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      for (var z = 0; z < oResponse.responseDocs.length; z++) {
        var oResponseDoc = oResponse.responseDocs[z];
        oResponseDoc["docIcon"] = web.mapToIcon(
          oResponseDoc.title,
          "",
          SP.Utilities.IconSize.Size16
        );
      }
      function OnSuccess(sender, args) {
        RenderResponses(oResponse);
      }
      function OnFailure(sender, args) {
        statusId2 = SP.UI.Status.addStatus(
          "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
        );
        SP.UI.Status.setStatusPriColor(statusId2, "red");
      }
      currCtx.executeQueryAsync(OnSuccess, OnFailure);
      function RenderResponses(oResponse2) {
        if (oResponse2 == null || oResponse2.responseDocs == null)
          return;
        var arrResponseSummary = new Array();
        for (var z2 = 0; z2 < oResponse2.responseDocs.length; z2++) {
          var oResponseDoc2 = oResponse2.responseDocs[z2];
          oResponseDoc2.docIcon = oResponseDoc2.docIcon.get_value();
          oResponseDoc2.styleTag = Audit.Common.Utilities.GetResponseDocStyleTag2(
            oResponseDoc2.documentStatus
          );
          oResponseDoc2.link = "STSNavigate('../_layouts/download.aspx?SourceUrl=" + oResponseDoc2.folder + "/" + oResponseDoc2.title + "')";
          var bFound = false;
          for (var b = 0; b < arrResponseSummary.length; b++) {
            if (arrResponseSummary[b].responseTitle == oResponse2.title) {
              bFound = true;
              arrResponseSummary[b].responseDocs.push(oResponseDoc2);
              break;
            }
          }
          if (!bFound) {
            var oObject = new Object();
            var arrResponseDocs = new Array();
            arrResponseDocs.push(oResponseDoc2);
            oObject["responseTitle"] = oResponse2.title;
            oObject["responseDocs"] = arrResponseDocs;
            oObject["response"] = oResponse2;
            arrResponseSummary.push(oObject);
          }
        }
        ko.utils.arrayPushAll(_myViewModel.arrResponseDocs(), arrResponseSummary);
        _myViewModel.arrResponseDocs.valueHasMutated();
        _myViewModel.cntResponseDocs(oResponse2.responseDocs.length);
        Audit.Common.Utilities.BindHandlerResponseDoc();
      }
    }
    function m_fnRefresh() {
      var curPath = location.pathname;
      var tabIndex = $("#tabs").tabs("option", "active");
      curPath += "?Tab=" + tabIndex;
      if (tabIndex == 1) {
        var responseNum = $("#ddlResponses").val();
        if (responseNum != "")
          curPath += "&ResNum=" + responseNum;
      }
      location.href = curPath;
    }
    function BindHandlersOnLoad() {
      BindPrintButton(
        "#btnPrint1",
        "#divStatusReportRespones",
        "Special Permissions Response Status Report"
      );
      BindExportButton(
        ".export1",
        "SPResponseStatusReport_",
        "tblStatusReportResponses"
      );
    }
    function BindPrintButton(btnPrint, divTbl, pageTitle) {
      $(btnPrint).on("click", function() {
        Audit.Common.Utilities.PrintStatusReport(pageTitle, divTbl);
      });
    }
    function BindExportButton(btnExport, fileNamePrefix, tbl) {
      $(btnExport).on("click", function(event) {
        var curDate = (/* @__PURE__ */ new Date()).format("yyyyMMdd_hhmmtt");
        Audit.Common.Utilities.ExportToCsv(fileNamePrefix + curDate, tbl);
      });
    }
    var publicMembers = {
      Load: m_fnLoadData,
      Refresh: m_fnRefresh
    };
    return publicMembers;
  };
})();
//# sourceMappingURL=sp_db.js.map
