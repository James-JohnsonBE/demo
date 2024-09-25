import { appContext } from "../../infrastructure/application_db_context.js";
import { directRegisterComponent } from "../../sal/infrastructure/index.js";
import { bulkAddResponseTemplate } from "./BulkAddResponseTemplate.js";
import { toggle } from "../../sal/components/modal/modalDialog.js";
import { addResponse } from "../../services/audit_response_service.js";

const componentName = "bulk-add-response-form";

export class BulkAddResponseForm {
  constructor({ request }) {
    this.request = request;
    this.Init();
  }

  request;
  bulkResponseItems = ko.observableArray();
  working = ko.observable(false);
  hasRun = ko.observable(false);

  enableCreate = ko.pureComputed(() => {
    const items = ko.unwrap(this.bulkResponseItems);
    const len = items.length;

    if (!len) return false;

    // If not all items have been successfully inserted;
    if (items.filter((item) => item.status() == "succeeded").length == len)
      return false;

    return true;
  });

  showFinish = ko.pureComputed(() => {
    return this.hasRun();
  });

  async Init() {
    this.fetchBulkResponses();
  }

  async clickUploadResponses() {
    toggle(false);
    await appContext.AuditBulkResponses.ShowForm(
      "BulkAddResponse.aspx",
      "Bulk Add Responses",
      {}
    );

    toggle(true);

    this.fetchBulkResponses();
  }

  async fetchBulkResponses() {
    const bulkResponses = await appContext.AuditBulkResponses.ToList(true);

    this.bulkResponseItems(
      bulkResponses.map((bulkResponse) => {
        // response.ReqNum.set(this.request);
        return {
          bulkResponse,
          status: ko.observable(),
          message: ko.observable(),
        };
      })
    );
  }

  async clickSubmitResponses() {
    this.working(true);

    const request = ko.unwrap(this.request);
    const bulkResponses = ko.unwrap(this.bulkResponseItems);

    const failedInserts = [];

    const insertPromises = bulkResponses.map(async (bulkResponseItem) => {
      bulkResponseItem.status("pending");

      const bulkResponse = bulkResponseItem.bulkResponse;

      const response = bulkResponse.toResponse(request);

      const result = await addResponse(request, response);

      if (result.isFailure) {
        failedInserts.push([result.error, bulkResponse]);
        bulkResponseItem.status("failed");
        bulkResponseItem.message(result.error);
        return;
      }

      bulkResponseItem.status("succeeded");
      bulkResponseItem.message("Success!");

      await appContext.AuditBulkResponses.RemoveEntity(bulkResponse);
    });

    await Promise.all(insertPromises);

    this.hasRun(true);
    this.working(false);
  }

  clickFinish() {
    this.onComplete(SP.UI.DialogResult.OK);
  }

  componentName = componentName;
  params = this;
}

directRegisterComponent(componentName, {
  template: bulkAddResponseTemplate,
});
