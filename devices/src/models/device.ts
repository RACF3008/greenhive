import mongoose from "mongoose";

import { DeviceStatus, DeviceTypes } from "@greenhive/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { TowerPayload, WeatherStationPayload } from "../shared/types";

interface DeviceAttrs {
  type: DeviceTypes;
  name: string;
  description?: string;
  ownerId: string;
  ownerType: string;
  hardware: string;
  firmware: string;
}

interface DeviceModel extends mongoose.Model<DeviceDoc> {
  build(attr: DeviceAttrs): DeviceDoc;
}

interface DeviceDoc extends mongoose.Document {
  type: DeviceTypes;
  name: string;
  description: string;
  ownerId: string;
  ownerType: string;
  hardware: string;
  firmware: string;
  createdAt: Date;
  updatedAt: Date;
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
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    ownerId: {
      type: String,
      required: true,
    },
    ownerType: {
      type: String,
      required: true,
    },
    hardware: {
      type: String,
      required: true,
    },
    firmware: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
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
