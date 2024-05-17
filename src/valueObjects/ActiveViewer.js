import ConstrainedEntity from "../primitives/ConstrainedEntity.js";
import TextField from "../fields/TextField.js";
import DateField, { dateFieldTypes } from "../fields/DateField.js";

export class ActiveViewer extends ConstrainedEntity {
  id = new TextField({
    displayName: "ID",
  });
  viewer = new TextField({
    displayName: "Viewer",
  });
  timestamp = new DateField({
    displayName: "Timestamp",
    type: dateFieldTypes.datetime,
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
