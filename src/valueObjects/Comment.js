import ConstrainedEntity from "../primitives/ConstrainedEntity.js";
import TextField from "../fields/TextField.js";

export class Comment extends ConstrainedEntity {
  id = new TextField({
    displayName: "ID",
  });
  Text = new TextField({
    displayName: "Comment",
  });
  Author = new TextField({
    displayName: "Author",
  });
  Timestamp = new TextField({
    displayName: "Timestamp",
  });

  FieldMap = {
    ID: this.id,
    Text: this.Text,
    Author: this.Author,
    Timestamp: this.Timestamp,
  };

  static Views = {
    All: ["ID", "Text", "Author", "Timestamp"],
  };
}
