import { registerFieldComponent } from "../infrastructure/RegisterComponents.js";
import BaseField from "./BaseField.js";

const components = {
  view: "blob-view",
  edit: "blob-edit",
  new: "blob-edit",
};

registerFieldComponent("blob", components);

export default class BlobField extends BaseField {
  constructor(params) {
    super(params);
    this.entityType = params.entityType;
    this.multiple = params.multiple;
    this.entityType.subscribe(this.updateEntityTypeHandler);
    // this.Value.subscribe(this.updateEntityTypeHandler);
    this.updateEntityTypeHandler(this.entityType());
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
    if (window.DEBUG) console.log(val);
    this.Value(JSON.parse(val));
    this.fromJSON(this.Value());
  };

  get entityConstructor() {
    return ko.utils.unwrapObservable(this.entityType);
  }

  // use purecomputed for memoization, fields shouldn't change
  Cols = ko.pureComputed(() => {
    if (!this.entityType()) return [];

    const newEntity = new this.entityConstructor();

    return newEntity.FormFields();
  });

  // ColKeys = ko.pureComputed(() =>
  //   new this.entityConstructor()?.FormFieldKeys()
  // );

  NewItem = ko.observable();

  submit = () => {
    const errors = this.TypedValue()?.validate();
    if (errors.length) return;

    this.TypedValues.push(this.TypedValue());

    this.TypedValue(new this.entityConstructor());
  };

  remove = (item) => this.TypedValues.remove(item);

  updateEntityTypeHandler = (newType) => {
    if (!newType) return;

    this.TypedValue(new this.entityConstructor());
    this.fromJSON(this.Value());

    // this.applyValueToTypedValues();
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
