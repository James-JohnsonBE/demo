import { directRegisterComponent } from "../../sal/infrastructure/index.js";
import { bulkAddResponseTemplate } from "./BulkAddResponseTemplate.js";

const componentName = "bulk-add-response-form";

export class BulkAddResponseForm {
  componentName = componentName;
  params = this;
}

directRegisterComponent(componentName, {
  template: bulkAddResponseTemplate,
});
