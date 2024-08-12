import { html } from "../../sal/infrastructure/index.js";

export const requestDetailViewTemplate = html`
  <div class="request-detail-view" data-bind="visible: currentRequest">
    <div id="divRequestInfoContainer">
      <div
        id="divRequestClose"
        style="width: 300px"
        data-bind="visible: bDisplayClose"
      >
        <fieldset style="border-color: GreenYellow">
          <legend style="font-weight: bold; font-size: 12pt">Action</legend>
          <span class="fa-solid fa-lock"></span
          ><button
            type="button"
            class="btn btn-link"
            id="btnCloseRequest"
            title="Close this Request"
            data-bind="click: $root.ClickCloseRequest"
          >
            Close this Request
          </button>
        </fieldset>
      </div>

      <div data-bind="if: currentRequestResponsesReadyToClose().length">
        <fieldset class="emphasized-section">
          <legend>Responses Ready to Close</legend>
          <table class="tablesorter">
            <thead>
              <tr>
                <th>Response</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody data-bind="foreach: currentRequestResponsesReadyToClose">
              <tr>
                <td
                  class="response-title"
                  data-bind="attr: {'id': 'response-item-title-' + title}"
                >
                  <span
                    title="View Response Docs"
                    class="btn btn-link"
                    data-bind="text: title, click: $parent.viewResponseDocs"
                  ></span>
                </td>
                <td>
                  <button
                    type="button"
                    class="btn btn-link"
                    title="Close Response"
                    data-bind="click: clickCloseResponse"
                  >
                    <span class="fa-solid fa-circle-check"></span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <button
            type="button"
            class="btn btn-link"
            title="Close all Responses"
            data-bind="click: clickCloseReadyResponses"
          >
            <span class="fa-solid fa-check-double"></span> Close All Responses
          </button>
        </fieldset>
      </div>

      <div
        id="divRequestInfo"
        class="audit-form request-info-form"
        data-bind="with: currentRequest"
      >
        <div class="form-header">
          <h3 class="uppercase form-title">
            AUDIT REQUEST DETAILS
            <span class="fw-semibold" data-bind="text: number"></span> |
            <span class="text-primary"
              >FY-<span data-bind="text: fiscalYear"></span
            ></span>
          </h3>
          <button
            type="button"
            class="btn btn-link form-title"
            data-bind="click: $parent.refreshRequest"
          >
            <i title="Refresh Request" class="fa-solid fa-arrows-rotate"></i>
          </button>
        </div>
        <!-- ko if: typeof(activeViewers) != 'undefined' -->
        <div
          id="divRequestActiveViewers"
          data-bind="visible: activeViewers.viewers().length, with: activeViewers"
        >
          <fieldset>
            <legend>
              <span class="fa-solid fa-triangle-exclamation"></span
              ><span data-bind="text: viewers().length"></span> Active Viewers
            </legend>
            <ul data-bind="foreach: viewers">
              <li>
                <div class="active-viewer">
                  <div
                    data-bind="text: viewer + ' @ ' + timestamp.toLocaleString()"
                  ></div>
                  <div
                    style="cursor: pointer"
                    data-bind="click: $parent.onRemove"
                    class="fa-solid fa-xmark"
                  ></div>
                </div>
              </li>
            </ul>
          </fieldset>
        </div>
        <!-- /ko -->
        <div class="form-row uppercase">
          <dl class="">
            <dt>Request #</dt>
            <dd data-bind="text: number"></dd>
            <dt>Subject</dt>
            <dd data-bind="text: subject"></dd>
            <dt>Requesting Office</dt>
            <dd data-bind="text: requestingOffice"></dd>
            <dt>Sensitivity</dt>
            <dd data-bind="text: sensitivity"></dd>
            <dt>Internal Due Date</dt>
            <dd data-bind="text: internalDueDate"></dd>
            <dt>Due Date</dt>
            <dd data-bind="text: dueDate"></dd>
          </dl>
          <dl>
            <dt>Type</dt>
            <dd data-bind="text: reqType"></dd>
            <dt>Status</dt>
            <dd>
              <span
                id="requestInfoStatus"
                class="uppercase"
                data-bind="text: status, class: status == 'Closed' ? 'danger' : 'success' "
              ></span>
              <span class="danger" data-bind="visible: status == 'Closed'"
                >on
                <span data-bind="text: closedDate"></span>
              </span>
            </dd>
            <dt>Sample?</dt>
            <dd>
              <span id="requestInfoSample">
                <span data-bind="if: sample"
                  ><span class="fa-solid fa-check"></span> Yes</span
                >
                <span data-bind="if: !sample"
                  ><span class="fa-solid fa-xmark"></span> No</span
                >
              </span>
            </dd>
            <dt>Receipt Date</dt>
            <dd data-bind="text: receiptDate"></dd>
            <dt>Related Audit</dt>
            <dd data-bind="text: relatedAudit"></dd>
          </dl>
        </div>
        <div class="form-row">
          <dl>
            <dt>Action Items</dt>
            <dd data-bind="html: actionItems"></dd>
            <dt>Comments</dt>
            <dd data-bind="html: comments"></dd>
          </dl>
        </div>

        <div class="form-row">
          <div class="emphasized-section">
            <div class="fw-semibold">Internal Status Comments</div>
            <!-- ko if: typeof(internalStatus) != 'undefined' -->
            <div class="commentChain" data-bind="with: internalStatus">
              <div data-bind="if: comments().length">
                <!-- ko if: showHistoryBool -->
                <!-- ko foreach: comments -->
                <div class="comment card">
                  <div class="card-body">
                    <div class="text" data-bind="text: text"></div>
                    <div>
                      <span
                        class="info"
                        data-bind="text: author + ' @ ' + timestamp.toLocaleString()"
                      ></span>
                      <button
                        type="button"
                        title="Delete Comment"
                        class="remove btn btn-link danger"
                        data-bind="click: $parent.onRemove"
                      >
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <!-- /ko -->
                <!-- /ko -->
                <!-- ko ifnot: showHistoryBool -->
                <div
                  class="comment card"
                  data-bind="with: comments()[comments().length - 1]"
                >
                  <div class="card-body">
                    <div class="text" data-bind="text: text"></div>
                    <div>
                      <span
                        class="info"
                        data-bind="text: author + ' @ ' + timestamp.toLocaleString()"
                      ></span>
                      <button
                        type="button"
                        title="Delete Comment"
                        class="remove btn btn-link danger"
                        data-bind="click: $parent.onRemove"
                      >
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <!-- /ko -->
              </div>
              <button
                type="button"
                class="btn btn-link"
                title="Show hidden comments"
                data-bind="click: toggleShowHistory"
              >
                <span class="fa-solid fa-comments"></span>
                Toggle Comment History (<span
                  data-bind="text: comments().length"
                ></span>
                Total)
              </button>
              <div class="new-comment">
                <textarea
                  class="form-control w-full"
                  cols="50"
                  data-bind="textInput: newCommentText"
                  placeholder="Leave a new comment..."
                ></textarea>
                <button
                  type="button"
                  class="btn btn-primary"
                  data-bind="click: onSubmit, enable: newCommentText"
                >
                  Submit
                </button>
              </div>
            </div>
            <!-- /ko -->
          </div>
        </div>
        <div class="form-row">
          <dl>
            <dt>Action Office(s)</dt>
            <dd>
              <!-- ko ifnot: actionOffices.length -->
              0 Action Offices
              <!-- /ko -->
              <span
                id="requestInfoActionOffice"
                data-bind="if: actionOffices.length"
              >
                <div
                  style="cursor: pointer; white-space: nowrap"
                  title="Click to view"
                >
                  <span
                    class="actionOfficeContainerRequestInfo"
                    data-bind="toggleClick: $data, toggleClass: 'collapsed', classContainer: '.sr1-request-actionOfficeContainerRequestInfo-item'"
                  >
                    <span class="fa-solid fa-magnifying-glass"></span
                    ><button type="button" class="btn btn-link">
                      View
                      <span data-bind="text: actionOffices.length"></span>
                      Action Offices
                    </button>
                    <!-- ko foreach: actionOffices -->
                    <div
                      class="sr1-request-actionOfficeContainerRequestInfo-item collapsed"
                      data-bind="text: ao"
                    ></div>
                    <!-- /ko -->
                  </span>
                </div>
              </span>
            </dd>
          </dl>
          <dl>
            <dt>Email Action Office(s)</dt>
            <dd>
              <!-- ko ifnot: emailActionOffices.length -->
              0 Email Action Offices
              <!-- /ko -->
              <span
                id="requestInfoActionOffice"
                data-bind="if: emailActionOffices.length"
              >
                <div
                  style="cursor: pointer; white-space: nowrap"
                  title="Click to view"
                >
                  <span
                    class="actionOfficeContainerRequestInfo"
                    data-bind="toggleClick: $data, toggleClass: 'collapsed', classContainer: '.sr1-request-actionOfficeContainerRequestInfo-item'"
                  >
                    <span class="fa-solid fa-magnifying-glass"></span
                    ><button type="button" class="btn btn-link">
                      View
                      <span data-bind="text: emailActionOffices.length"></span>
                      Email Action Offices
                    </button>
                    <!-- ko foreach: emailActionOffices -->
                    <div
                      class="sr1-request-actionOfficeContainerRequestInfo-item collapsed"
                      data-bind="text: ao"
                    ></div>
                    <!-- /ko -->
                  </span>
                </div>
              </span>
            </dd>
          </dl>
        </div>
        <div class="form-row">
          <dl>
            <dt>Email Sent?</dt>
            <dd>
              <span data-bind="if: emailSent"
                ><span class="fa-solid fa-check"></span> Yes</span
              >
              <span data-bind="if: !emailSent"
                ><span class="fa-solid fa-xmark"></span> No</span
              >
            </dd>
          </dl>
          <fieldset
            class="emphasized-section"
            style="
            width: 225px;
            margin-top: 5px;
            margin-left: 10px;
            padding-left: 10px;
          "
          >
            <legend>Email Actions</legend>
            <div
              id="divSendEmailAction"
              style="padding-top: 5px"
              data-bind="visible: status == 'Open' || status == 'ReOpened'"
            >
              <span class="fa-solid fa-paper-plane"></span>
              <button
                type="button"
                class="btn btn-link"
                data-bind="visible: !emailSent, click: $root.ClickSendEmail, enable: emailActionOffices.length"
                title="Send Email to Action Offices"
              >
                Send Email to Action Offices
              </button>
              <button
                type="button"
                class="btn btn-link"
                data-bind="visible: emailSent, click: $root.ClickSendEmail, enable: emailActionOffices.length"
                title="ReSend Email to Action Offices"
              >
                Re-Send Email to Action Offices
              </button>
            </div>
            <div id="divEmailHistory" style="padding-top: 5px">
              <button
                type="button"
                class="btn btn-link"
                title="View Email History"
                data-bind="click: $root.ClickViewEmailHistoryFolder"
              >
                <span class="fa-solid fa-magnifying-glass"></span> View Email
                History
              </button>
            </div>
            <div id="divSyncEmailActionOffices" style="padding-top: 5px">
              <button
                type="button"
                class="btn btn-link"
                title="Synchronize Email Action Offices"
                data-bind="click: $root.ClickSyncEmailActionOffices"
              >
                <span class="fa-solid fa-right-left"></span> Synchronize Email
                Action Offices
              </button>
            </div>
          </fieldset>
        </div>
        <div class="form-row">
          <dl>
            <dt>Special Permissions?</dt>
            <dd>
              <span data-bind="if: specialPerms == true"
                ><span class="fa-solid fa-check"></span> Yes</span
              >
              <span data-bind="if: specialPerms == false"
                ><span class="fa-solid fa-xmark"></span> No</span
              >
            </dd>
          </dl>
          <fieldset
            class="emphasized-section"
            style="
            width: 200px;
            margin-top: 5px;
            margin-left: 10px;
            padding-left: 10px;
          "
          >
            <legend>Special Permission Actions</legend>
            <div
              id="divResponsesGrantSpecialPermissions"
              style="padding-top: 5px"
            >
              <button
                type="button"
                class="btn btn-link"
                title="Grant Special Permissions"
                data-bind="click: $root.ClickGrantSpecialPermissions"
              >
                <span class="fa-solid fa-unlock"></span> Grant Special
                Permissions
              </button>
            </div>
            <div
              id="divResponsesRemoveSpecialPermissions"
              style="padding-top: 5px"
            >
              <button
                type="button"
                class="btn btn-link"
                title="Remove Special Permissions"
                data-bind="click: $root.ClickRemoveSpecialPermissions"
              >
                <span class="fa-solid fa-lock"></span> Remove Special
                Permissions
              </button>
            </div>
          </fieldset>
        </div>
        <tr></tr>

        <div id="divRequestInfoActions" class="form-row">
          <fieldset class="form-actions emphasized-section">
            <legend>Request Actions</legend>
            <div>
              <button
                type="button"
                class="btn btn-primary"
                title="View Version History"
                data-bind="click: $parent.ClickViewRequestHistory"
              >
                <span class="fa-solid fa-clock-rotate-left"></span> View Version
                History
              </button>
            </div>
            <div>
              <button
                type="button"
                class="btn btn-primary"
                title="View Request"
                data-bind="click: $root.ClickViewRequest"
              >
                <span class="fa-solid fa-magnifying-glass"></span> View Request
              </button>
            </div>
            <div>
              <button
                type="button"
                class="btn btn-success"
                title="Edit Request"
                data-bind="click: $root.ClickEditRequest"
              >
                <span class="fa-solid fa-pencil"></span> Edit Request
              </button>
            </div>
            <!-- ko ifnot: emailSent  -->
            <div>
              <button
                type="button"
                class="btn btn-danger"
                title="Delete Request"
                data-bind="click: $parent.ClickDeleteRequest"
              >
                <span class="fa-solid fa-trash"></span> Delete Request
              </button>
            </div>
            <!-- /ko -->
          </fieldset>
        </div>
      </div>
    </div>

    <div class="ui-tabs-secondary request-detail-documents">
      <!-- ko using: tabs -->
      <ul class="ui-tabs-nav" data-bind="foreach: tabOpts">
        <li
          data-bind="text: linkText, 
          click: $parent.clickTabLink, 
          css: {active: $parent.isSelected($data)}"
        ></li>
      </ul>
      <!-- ko foreach: tabOpts -->
      <div
        data-bind="component: {
            name: template.id,
            params: template.data
          },
          visible: $parent.isSelected($data)"
      ></div>
      <!-- /ko -->
      <!-- /ko -->
    </div>
  </div>
`;
