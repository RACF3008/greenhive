import mongoose from 'mongoose';

interface LogAttrs {
  deviceId: String;
  deviceType: string;
  deviceName: string;
  eventType: string;
  payload: string;
  severity: string;
  source: string;
  timeStamp: Date;
}

interface LogModel extends mongoose.Model<LogDoc> {
  build(attr: LogAttrs): LogDoc;
}

interface LogDoc extends mongoose.Document {
  eventType: string;
  deviceId: String;
  deviceType: string;
  deviceName: string;
  message: string;
  severity: string;
  timeStamp: Date;
}

const logSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
    },
    deviceType: {
      type: String,
      required: true,
    },
    deviceName: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
    },
    payload: {
      type: JSON,
      required: true,
    },
    severity: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    timeStamp: {
      type: Date,
      required: true,
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

logSchema.pre('save', function (next) {
  this.set('timeStamp', new Date().toISOString());
  next();
});

logSchema.statics.build = (attrs: LogAttrs) => {
  return new Log(attrs);
};

const Log = mongoose.model<LogDoc, LogModel>('Log', logSchema);

export { Log };
