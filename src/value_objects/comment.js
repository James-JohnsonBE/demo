import { ConstrainedEntity } from "../sal/primitives/index.js";
import { TextField, DateField, dateFieldTypes } from "../sal/fields/index.js";

export class Comment extends ConstrainedEntity {
  constructor(params) {
    super(params);
  }

  id = new TextField({
    displayName: "ID",
  });
  text = new TextField({
    displayName: "Comment",
  });
  author = new TextField({
    displayName: "author",
  });
  timestamp = new TextField({
    displayName: "timestamp",
  });

  FieldMap = {
    id: this.id,
    text: this.text,
    author: this.author,
    timestamp: this.timestamp,
  };

  static Create({ id, text, author, timestamp }) {
    const newComment = new Comment();
    newComment.id.Value(id);
    newComment.text.Value(text);
    newComment.author.Value(author);
    newComment.timestamp.Value(timestamp);

    return newComment;
  }
  static Views = {
    All: ["id", "text", "author", "timestamp"],
  };
}
