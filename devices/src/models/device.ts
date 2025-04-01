import mongoose from "mongoose";

import { DeviceStatus, DeviceTypes } from "@greenhive/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { TowerPayload, WeatherStationPayload } from "../shared/types";

interface DeviceAttrs {
  type: DeviceTypes;
  name?: string;
  status: DeviceStatus;
  userId?: string;
  payload?: TowerPayload | WeatherStationPayload;
}

interface DeviceModel extends mongoose.Model<DeviceDoc> {
  build(attr: DeviceAttrs): DeviceDoc;
}

interface DeviceDoc extends mongoose.Document {
  type: DeviceTypes;
  name?: string;
  status: DeviceStatus;
  userId?: string;
  payload?: TowerPayload | WeatherStationPayload;
  lastUpdated: Date;
  version: number;
}

const deviceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: Object.values(DeviceTypes),
    },
    name: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(DeviceStatus),
      default: DeviceStatus.OFFLINE,
    },
    userId: {
      type: String,
      required: false,
    },
    payload: {
      type: Object,
      required: false,
      validate: {
        validator: function (this: DeviceDoc, value: any) {
          // Validate based on the device type
          if (this.type === DeviceTypes.TOWER) {
            // Check if the payload matches TowerPayload
            return (
              typeof value.tankLevel === "number" &&
              Object.keys(value).length === 1
            );
          } else if (this.type === DeviceTypes.WEATHER_STATION) {
            // Check if the payload matches WeatherStationPayload
            return (
              typeof value.sunlight === "number" &&
              typeof value.rainQuantity === "number" &&
              typeof value.windForce === "number" &&
              typeof value.temperature === "number" &&
              typeof value.humidity === "number" &&
              Object.keys(value).length === 5
            );
          }
          return false; // Invalid type
        },
        message: (props: any) => {
          return `Payload does not match the expected structure for device type.`;
        },
      },
    },
    lastUpdated: {
      type: Date,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

deviceSchema.pre("save", function (next) {
  this.set("lastUpdated", new Date().toISOString());
  next();
});

deviceSchema.set("versionKey", "version");
deviceSchema.plugin(updateIfCurrentPlugin);

deviceSchema.statics.build = (attrs: DeviceAttrs) => {
  return new Device(attrs);
};

const Device = mongoose.model<DeviceDoc, DeviceModel>("Device", deviceSchema);

export { Device, DeviceDoc };
