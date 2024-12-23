import mongoose from 'mongoose';

interface DeviceAttrs {
  id: string;
  type: string;
  name: string;
  userId: string;
}

interface DeviceModel extends mongoose.Model<DeviceDoc> {
  build(attr: DeviceAttrs): DeviceDoc;
}

export interface DeviceDoc extends mongoose.Document {
  id: string;
  type: string;
  name: string;
  userId: string;
}
