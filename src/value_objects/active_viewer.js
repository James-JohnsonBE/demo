import { ConstrainedEntity } from "../sal/primitives/index.js";
import { TextField, DateField, dateFieldTypes } from "../sal/fields/index.js";

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
