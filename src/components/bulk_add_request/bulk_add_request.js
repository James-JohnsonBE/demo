import { appContext } from "../../infrastructure/application_db_context.js";
import { onAddNewRequest, addNewRequest } from "../../services/index.js";
import { toggle } from "../../sal/components/modal/modalDialog.js";

import { directRegisterComponent } from "../../sal/infrastructure/index.js";
import { bulkAddRequestTemplate } from "./BulkAddRequestTemplate.js";

const componentName = "bulk-add-request-form";
export class BulkAddRequestForm {
  constructor() {}

  bulkRequestItems = ko.observableArray();
  working = ko.observable(false);

  async Init() {
    // TODO: need to initialize audit organizations store
    // await appContext.AuditOrganizations.ToList();
    // await LoadInfo();
    this.fetchBulkRequests();
  }

  async clickUploadResponses() {
    toggle(false);
    await appContext.AuditBulkRequests.ShowForm(
      "BulkAddRequest.aspx",
      "Bulk Add Requests",
      {}
    );

    toggle(true);

    this.fetchBulkRequests();
  }

  async fetchBulkRequests() {
    console.log("Request added callback");
    const bulkRequests = await appContext.AuditBulkRequests.ToList(true);

    // Decorate our bulk requests with an object to keep track of view specific stuff
    this.bulkRequestItems(
      bulkRequests.map((bulkRequest) => {
        return {
          bulkRequest,
          status: ko.observable(""),
          message: ko.observable(""),
        };
      })
    );
  }

  async clickSubmitRequests() {
    this.working(true);
    // 1. Query all AuditBulkRequests
    const bulkRequestItems = this.bulkRequestItems();

    const failedInserts = [];
    // 2. Create new AuditRequests
    const insertPromises = bulkRequestItems.map(async (bulkRequestItem) => {
      bulkRequestItem.status("pending");
      // Map the bulk request to a an AuditRequest
      const bulkRequest = bulkRequestItem.bulkRequest;

      const newRequest = bulkRequest.toRequest();
      newRequest.Reminders.Value(newRequest.Reminders.Options());

      // a. Insert new Request
      try {
        await addNewRequest(newRequest);
        await onAddNewRequest(newRequest);
      } catch (e) {
        failedInserts.push([e, bulkRequest]);
        bulkRequestItem.status("failed");
        bulkRequestItem.message(e.message);
        return;
      }
      //  a. Update bulkRequests view
      bulkRequestItem.status("succeeded");

      //  b. Delete successfully created AuditBulkRequests
      await appContext.AuditBulkRequests.RemoveEntity(bulkRequest);
    });
    // Reload Page
    const insertResults = await Promise.all(insertPromises);
    // If any failed, need to alert user!
    this.working(false);
  }

  componentName = componentName;
  params = this;
}

directRegisterComponent(componentName, {
  template: bulkAddRequestTemplate,
});
