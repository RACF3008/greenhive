import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TokenAttrs {
  value: string;
  userId: string;
  used: boolean;
}

interface TokenModel extends mongoose.Model<TokenDoc> {
  build(attrs: TokenAttrs): TokenDoc;
}

interface TokenDoc extends mongoose.Document {
  value: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
  used: boolean;
}

const tokenSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
    used: {
      type: Boolean,
      required: true,
      default: false,
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

tokenSchema.pre('save', function (next) {
  if (this.isNew) {
    this.set('createdAt', new Date().toISOString());

    this.set('expiresAt', new Date(Date.now() + 300 * 1000).toISOString());

    this.set('used', false);
  }

  next();
});

tokenSchema.statics.build = (attrs: TokenAttrs): TokenDoc => {
  return new Token(attrs);
};

const Token = mongoose.model<TokenDoc, TokenModel>('Token', tokenSchema);

export { Token };
