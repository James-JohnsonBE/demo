export class TabsModule {
  constructor(tabOpts) {
    ko.utils.arrayPushAll(this.tabOpts, tabOpts);
  }

  tabOpts = ko.observableArray();
  selectedTab = ko.observable();

  isSelected = (tab) => {
    return tab.id == this.selectedTab()?.id;
  };

  clickTabLink = (tab) => {
    this.selectedTab(tab);
    console.log("selected: " + tab.id);
  };

  selectTab = (tab) => this.selectedTab(tab);

  selectById = (tabId) =>
    this.selectedTab(this.tabOpts().find((tab) => tab.id == tabId));
}

export class Tab {
  constructor(id, linkText, template) {
    this.id = id;
    this.linkText = linkText;
    this.template = template;
  }

  clickLink = () => {
    console.log("selected: " + this.id);
  };
}
