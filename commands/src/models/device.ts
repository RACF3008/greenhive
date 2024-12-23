import mongoose from 'mongoose';

interface DeviceAttrs {
  id: string;
  type: string;
  status: string;
  gatewayIp: string;
  userId: string;
}

interface DeviceModel extends mongoose.Model<DeviceDoc> {
  build(attr: DeviceAttrs): DeviceDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<DeviceDoc | null>;
}

interface DeviceDoc extends mongoose.Document {
  type: string;
  status: string;
  gatewayIp: string;
  userId: string;
  version: number;
}

const deviceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    gatewayIp: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    version: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

deviceSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Device.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

deviceSchema.statics.build = (attrs: DeviceAttrs) => {
  return new Device({
    _id: attrs.id,
    type: attrs.type,
    status: attrs.status,
    gatewayIp: attrs.gatewayIp,
    userId: attrs.userId,
  });
};

const Device = mongoose.model<DeviceDoc, DeviceModel>('Device', deviceSchema);

export { Device };
