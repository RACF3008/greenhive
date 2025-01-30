import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TokenAttrs {
  value: string;
  createdAt: Date;
  expiresAt: Date;
  userId: string;
  purpose: string;
  usable: boolean;
}

interface TokenModel extends mongoose.Model<TokenDoc> {
  build(attrs: TokenAttrs): TokenDoc;
}

interface TokenDoc extends mongoose.Document {
  value: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
  purpose:string;
  usable: boolean;
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
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    usable: {
      type: Boolean,
      required: true,
      default: true,
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
    this.set('usable', true);
  }

  next();
});

tokenSchema.statics.build = (attrs: TokenAttrs): TokenDoc => {
  return new Token(attrs);
};

const Token = mongoose.model<TokenDoc, TokenModel>('Token', tokenSchema);

export { Token };
