import mongoose from 'mongoose';

import { TowerPayload, StationPayload } from '../interfaces/reading-payload';
import { DeviceDoc } from './device';

interface ReadingAttrs {
  userId: string;
  payload: TowerPayload | StationPayload;
  device: DeviceDoc;
}

interface ReadingDoc extends mongoose.Document {
  userId: string;
  payload: TowerPayload | StationPayload;
  device: DeviceDoc;
  timeStamp: Date;
}

interface ReadingModel extends mongoose.Model<ReadingDoc> {
  build(attr: ReadingAttrs): ReadingDoc;
}

const readingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    payload: {
      type: Object,
      required: true,
    },
    device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device',
      required: true,
    },
    timeStamp: {
      type: Date,
      required: false,
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

readingSchema.pre('save', function (next) {
  this.set('timeStamp', new Date().toISOString());
  next();
});

readingSchema.statics.build = (attr: ReadingAttrs) => {
  return new Reading(attr);
};

const Reading = mongoose.model<ReadingDoc, ReadingModel>(
  'Reading',
  readingSchema
);

export { Reading };
