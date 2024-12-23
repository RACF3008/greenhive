import mongoose from 'mongoose';

import { DeviceStatus } from '@greenhive/common';
import { DeviceTypes } from '../enums/device-types';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface DeviceAttrs {
  type: DeviceTypes;
  name: string;
  status: DeviceStatus;
  userId: string;
  gatewayIp: string;
  payload?: Object;
}

interface DeviceModel extends mongoose.Model<DeviceDoc> {
  build(attr: DeviceAttrs): DeviceDoc;
}

interface DeviceDoc extends mongoose.Document {
  type: DeviceTypes;
  name: string;
  status: DeviceStatus;
  userId: string;
  gatewayIp: string;
  payload?: Object;
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
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(DeviceStatus),
      default: DeviceStatus.OFFLINE,
    },
    userId: {
      type: String,
      required: true,
    },
    gatewayIp: {
      type: String,
      required: true,
    },
    payload: {
      type: Object,
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

deviceSchema.pre('save', function (next) {
  this.set('lastUpdated', new Date().toISOString());
  next();
});

deviceSchema.set('versionKey', 'version');
deviceSchema.plugin(updateIfCurrentPlugin);

deviceSchema.statics.build = (attrs: DeviceAttrs) => {
  return new Device(attrs);
};

const Device = mongoose.model<DeviceDoc, DeviceModel>('Device', deviceSchema);

export { Device };
