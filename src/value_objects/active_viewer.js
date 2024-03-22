import ConstrainedEntity from "../primitives/constrained_entity.js";
import TextField from "../fields/text_field.js";
import DateField, { dateFieldTypes } from "../fields/date_field.js";

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
