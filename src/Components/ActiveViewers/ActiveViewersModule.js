import { ActiveViewer } from "../../valueObjects/ActiveViewer.js";
import { appContext } from "../../infrastructure/ApplicationDbContext.js";

export class ActiveViewersComponent {
  constructor({ entity, fieldName }) {
    this.entity = entity;
    this.blobField = entity[fieldName];
    this.fieldName = fieldName;
    this.viewers = this.blobField.TypedValues;
  }
  entity;
  blobField;
  fieldName;

  pushCurrentUser() {
    this.pushUser(_spPageContextInfo.userLoginName);
  }

  pushUser(loginName) {
    // Check if our viewer is listed
    var filteredViewers = this.viewers().filter(function (viewer) {
      return viewer.viewer != loginName;
    });

    this.viewers(filteredViewers);

    var viewer = new ActiveViewer();
    viewer.fromJSON({
      id: Math.ceil(Math.random() * 1000000).toString(16),
      viewer: loginName,
      timestamp: new Date().toLocaleString(),
    });
    this.viewers.push(viewer);
    this.commitChanges();
  }

  removeUser(viewerToRemove) {
    this.viewers.remove(viewerToRemove);
    this.commitChanges();
  }

  removeCurrentuser() {
    this.removeUserByLogin(_spPageContextInfo.userLoginName);
  }

  removeUserByLogin(loginName) {
    // Check if our viewer is listed
    var viewerToRemove = this.viewers().find(function (viewer) {
      return viewer.viewer == loginName;
    });

    if (viewerToRemove) {
      this.removeUser(viewerToRemove);
    }
  }

  onRemove = (viewerToRemove) => {
    if (confirm("Are you sure you want to delete this item?")) {
      this.removeUser(viewerToRemove);
    }
  };

  async commitChanges() {
    const set = appContext.Set(this.entity.constructor);
    if (!set) {
      alert("Cannot find entity set", this.entity);
      return;
    }
    await set.UpdateEntity(this.entity, [this.fieldName]);
  }
}

// TODO: convert to class
export function ActiveViewersModuleLegacy(requestId, props) {
  var requestListTitle = props.requestListTitle;
  var columnName = props.columnName;
  var initialValue = props.initialValue;
  var arrInitialViewers = [];
  // If we have comments here, try to parse them.
  if (initialValue) {
    try {
      arrInitialViewers = JSON.parse(initialValue);
      arrInitialViewers.forEach(function (viewer) {
        viewer.timestamp = new Date(viewer.timestamp);
      });
    } catch (e) {
      console.error("could not parse internal status comments.");
    }
  }
  var viewers = ko.observableArray(arrInitialViewers);

  function pushCurrentUser() {
    pushUser(_spPageContextInfo.userLoginName);
  }

  function pushUser(loginName) {
    // Check if our viewer is listed
    var filteredViewers = viewers().filter(function (viewer) {
      return viewer.viewer != loginName;
    });

    viewers(filteredViewers);

    var viewer = {
      id: Math.ceil(Math.random() * 1000000).toString(16),
      viewer: loginName,
      timestamp: new Date(),
    };
    viewers.push(viewer);
    commitChanges();
  }

  function removeCurrentuser() {
    removeUserByLogin(_spPageContextInfo.userLoginName);
  }

  function removeUserByLogin(loginName) {
    // Check if our viewer is listed
    var viewerToRemove = viewers().filter(function (viewer) {
      return viewer.viewer == loginName;
    });

    if (viewerToRemove.length) {
      removeUser(viewerToRemove[0]);
    }
  }

  function onRemove(viewerToRemove) {
    if (confirm("Are you sure you want to delete this item?")) {
      removeUser(viewerToRemove);
    }
  }

  function removeUser(viewerToRemove) {
    var viewerIndex = viewers.indexOf(viewerToRemove);
    viewers.splice(viewerIndex, 1);
    commitChanges();
  }

  function commitChanges() {
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();
    //Now push to the request item:
    var requestList = web.get_lists().getByTitle(requestListTitle);
    const oListItem = requestList.getItemById(requestId);
    oListItem.set_item(columnName, JSON.stringify(viewers()));
    oListItem.update();

    currCtx.load(oListItem);

    currCtx.executeQueryAsync(
      function onSuccess() {
        // console.log("Added User");
      },
      function onFailure(args, sender) {
        console.error("Failed to commit changes - " + columnName, args);
      }
    );
  }

  var publicMembers = {
    viewers: viewers,
    pushCurrentUser: pushCurrentUser,
    pushUser: pushUser,
    removeCurrentuser: removeCurrentuser,
    removeUserByLogin: removeUserByLogin,
    onRemove: onRemove,
  };

  return publicMembers;
}
