export default class CommentChainModule {
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
