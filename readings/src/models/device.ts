import mongoose from 'mongoose';

interface DeviceAttrs {
  id: string;
  type: string;
  name: string;
  userId: string;
  version: number;
}

interface DeviceModel extends mongoose.Model<DeviceDoc> {
  build(attr: DeviceAttrs): DeviceDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<DeviceDoc | null>;
}

export interface DeviceDoc extends mongoose.Document {
  type: string;
  name: string;
  userId: string;
  version: number;
}

const deviceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    name: {
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
        delete ret.__v;
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
    name: attrs.name,
    userId: attrs.userId,
  });
};

const Device = mongoose.model<DeviceDoc, DeviceModel>('Device', deviceSchema);

export { Device };
