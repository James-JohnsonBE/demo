import { appContext } from "../../infrastructure/application_db_context.js";
import { registerComponent } from "../../infrastructure/register_components.js";
import { Comment } from "../../value_objects/comment.js";

const commentChainComponentName = "commentChain";

export class CommentChainComponent {
  constructor({ entity, fieldName }) {
    this.entity = entity;
    this.blobField = entity[fieldName];
    this.fieldName = fieldName;
  }
  entity;
  blobField;
  fieldName;

  componentName = commentChainComponentName;
}

class CommentChainModule {
  constructor({ entity, fieldName, blobField }) {
    this.entity = entity;
    this.fieldName = fieldName;
    this.blobField = blobField;
    this.comments = blobField.TypedValues;
  }

  // comments = ko.observableArray();
  newCommentText = ko.observable();

  showHistoryBool = ko.observable(false);

  toggleShowHistory = function () {
    this.showHistoryBool(!this.showHistoryBool());
  };

  async onSubmit() {
    var comment = Comment.Create({
      id: Math.ceil(Math.random() * 1000000).toString(16),
      text: this.newCommentText(),
      author: _spPageContextInfo.userLoginName,
      timestamp: new Date().toLocaleString(),
    });
    this.blobField.add(comment);
    await this.commitChanges();
    this.newCommentText("");
  }

  onRemove = (commentToRemove) => {
    if (confirm("Are you sure you want to delete this item?")) {
      this.blobField.remove(commentToRemove);
      this.commitChanges();
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

registerComponent({
  name: commentChainComponentName,
  folder: "comment_chain",
  module: CommentChainModule,
  template: "CommentChainTemplate",
});

export class CommentChainModuleLegacy {
  constructor(requestId, props) {
    this.requestId = requestId;
    this.requestListTitle = props.requestListTitle;
    this.columnName = props.columnName;

    const initialValue = props.initialValue;
    if (initialValue) {
      try {
        const arrInitialComments = JSON.parse(initialValue);
        arrInitialComments.map(function (comment) {
          comment.timestamp = new Date(comment.timestamp);
        });
        this.comments(arrInitialComments);
      } catch (e) {
        console.error("could not parse internal status comments.");
      }
    }
  }

  comments = ko.observableArray();
  newCommentText = ko.observable();

  showHistoryBool = ko.observable(false);

  toggleShowHistory = function () {
    this.showHistoryBool(!this.showHistoryBool());
  };

  onSubmit = () => {
    var comment = {
      id: Math.ceil(Math.random() * 1000000).toString(16),
      text: this.newCommentText(),
      author: _spPageContextInfo.userLoginName,
      timestamp: new Date(),
    };
    this.comments.push(comment);
    this.commitChanges();
    this.newCommentText("");
  };

  onRemove = (commentToRemove) => {
    if (confirm("Are you sure you want to delete this item?")) {
      this.comments.remove(commentToRemove);
      this.commitChanges();
    }
  };

  commitChanges = () => {
    const currCtx = new SP.ClientContext.get_current();
    const web = currCtx.get_web();
    //Now push to the request item:
    const requestList = web.get_lists().getByTitle(this.requestListTitle);
    const oListItem = requestList.getItemById(this.requestId);
    oListItem.set_item(this.columnName, JSON.stringify(this.comments()));
    oListItem.update();

    currCtx.load(oListItem);

    currCtx.executeQueryAsync(
      function onSuccess() {
        // console.log("Updated comments");
      },
      function onFailure(args, sender) {
        console.error("Failed to commit changes.", args);
      }
    );
  };
}
