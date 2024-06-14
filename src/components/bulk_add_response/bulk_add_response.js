import { appContext } from "../../infrastructure/application_db_context.js";
import { toggle } from "../../sal/components/modal/modalDialog.js";

import { registerComponent } from "../../sal/infrastructure/index.js";

const componentName = "bulk-add-response-form";
export class BulkAddResponseForm {
  componentName = componentName;
  params = this;
}

registerComponent({
  name: componentName,
  folder: "bulk_add_response",
  template: "BulkAddResponseTemplate",
});
