import ConstrainedEntity from "../primitives/ConstrainedEntity.js";
import TextField from "../fields/TextField.js";

export class ActiveViewer extends ConstrainedEntity {
  id = new TextField({
    displayName: "ID",
  });
  viewer = new TextField({
    displayName: "Viewer",
  });
  timestamp = new TextField({
    displayName: "Timestamp",
  });

  FieldMap = {
    id: this.id,
    viewer: this.viewer,
    timestamp: this.timestamp,
  };

  static Views = {
    All: ["id", "viewer", "timestamp"],
  };
}
