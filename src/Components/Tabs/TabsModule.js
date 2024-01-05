import { setUrlParam } from "../../common/Router.js";

// const urlParam = "Tab";

export class TabsModule {
  constructor(tabOpts, urlParam = "Tab") {
    this.urlParam = urlParam;
    ko.utils.arrayPushAll(this.tabOpts, tabOpts);
    this.selectedTab.subscribe(this.tabChangeHandler);
    window.addEventListener("popstate", this.popStateHandler);
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

  selectTab = (tab) => this.selectById(tab.id);

  selectById = (tabId) =>
    this.selectedTab(this.tabOpts().find((tab) => tab.id == tabId));

  tabChangeHandler = (newTab) => {
    if (newTab) setUrlParam(this.urlParam, newTab.id);
    // window.history.pushState({ tab: { id: newTab.id } }, "", newTab.id);
  };

  popStateHandler = (event) => {
    if (event.state) {
      if (event.state[this.urlParam])
        this.selectById(event.state[this.urlParam]);
    }
  };
}

export class Tab {
  constructor(id, linkText, template) {
    this.id = id;
    this.linkText = linkText;
    this.template = template;
  }
}
