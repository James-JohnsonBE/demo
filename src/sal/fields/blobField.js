import { registerFieldComponent } from "../infrastructure/index.js";
import { BaseField } from "./index.js";
import { BaseFieldModule } from "../components/fields/index.js";

const components = {
  view: "blob-view",
  edit: "blob-edit",
  new: "blob-edit",
};

registerFieldComponent({
  name: "blob",
  components,
  viewModel: BaseFieldModule,
});

export class BlobField extends BaseField {
  constructor(params) {
    super(params);
    this.entityType = params.entityType;
    this.multiple = params.multiple;

    if (ko.isObservable(this.entityType)) {
      this.entityType.subscribe(this.updateEntityTypeHandler);
    }

    this.updateEntityTypeHandler(ko.unwrap(this.entityType));
  }

  toString = ko.pureComputed(() => `${this.Value()?.length ?? "0"} items`);

  toJSON = ko.pureComputed(() => {
    if (!this.multiple) return this.TypedValue()?.toJSON();
    return this.TypedValues().map((value) => value.toJSON());
  });

  fromJSON = (input) => {
    if (!input) return;
    if (!this.multiple) {
      this.TypedValue()?.fromJSON(input);
      return;
    }
    input.map((obj) => {
      const newEntity = new this.entityConstructor();
      newEntity.fromJSON(obj);
      this.TypedValues.push(newEntity);
    });
  };

  TypedValues = ko.observableArray();
  TypedValue = ko.observable();

  get = () => {
    return JSON.stringify(this.toJSON());
  };

  set = (val) => {
    // if (DEBUG) console.log(val);
    this.Value(JSON.parse(val));
    this.fromJSON(this.Value());
  };

  get entityConstructor() {
    return ko.unwrap(this.entityType);
  }

  // use purecomputed for memoization, fields shouldn't change
  Cols = ko.pureComputed(() => {
    if (!ko.unwrap(this.entityType)) return [];

    const newEntity = new this.entityConstructor();

    return newEntity.FormFields();
  });

  NewItem = ko.observable();

  submit = () => {
    const errors = this.TypedValue()?.validate();
    if (errors.length) return;

    this.TypedValues.push(this.TypedValue());

    this.TypedValue(new this.entityConstructor());
  };

  add = (item) => this.TypedValues.push(item);
  remove = (item) => this.TypedValues.remove(item);

  updateEntityTypeHandler = (newType) => {
    if (!newType) return;

    this.TypedValue(new this.entityConstructor());
    this.fromJSON(this.Value());
  };

  applyValueToTypedValues = () => {
    if (!this.Value() || !this.TypedValue()) return;
    // TODO: Fix the mapping, is this a form?
    // if (!this.multiple) {
    //   mapObjectToEntity(this.Value(), this.TypedValue());
    //   return;
    // }

    // const typedItems = this.Value()?.map((item) => {
    //   const newEntity = new this.entityConstructor();
    //   mapObjectToEntity(item, newEntity);
    //   return newEntity;
    // });
    // this.TypedValues(typedItems);
  };
  components = components;
}
