import BaseFieldModule from "../BaseFieldModule.js";

export default class PeopleModule extends BaseFieldModule {
  constructor(params) {
    super(params);
  }

  getUniqueId = () => {
    return `people-component-${this.displayName}-${Math.floor(
      Math.random() * 100
    )}`;
  };
}
