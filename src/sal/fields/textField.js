import { registerFieldComponent } from "../infrastructure/index.js";
import { BaseField } from "./index.js";
import { BaseFieldModule } from "../components/fields/index.js";

const components = {
  view: "text-view",
  edit: "text-edit",
  new: "text-edit",
};

registerFieldComponent({
  name: "text",
  components,
  viewModel: BaseFieldModule,
  folder: "text",
});

export class TextField extends BaseField {
  constructor(params) {
    super(params);
    this.attr = params.attr ?? {};
    this.options = params.options ?? null;
  }

  options;

  components = components;
}
