import mongoose from "mongoose";

import { TokenPurpose } from "@greenhive/common";

interface TokenAttrs {
  id: string;
  value: string;
  createdAt: Date;
  expiresAt: Date;
  referenceId: string;
  purpose: TokenPurpose;
  usable: boolean;
}

interface TokenModel extends mongoose.Model<TokenDoc> {
  build(attrs: TokenAttrs): TokenDoc;
}

interface TokenDoc extends mongoose.Document {
  id: string;
  value: string;
  createdAt: Date;
  expiresAt: Date;
  referenceId: string;
  purpose: TokenPurpose;
  usable: boolean;
}

const tokenSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    value: {
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
    referenceId: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
      enum: Object.values(TokenPurpose),
    },
    usable: {
      type: Boolean,
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

tokenSchema.pre("save", function (next) {
  if (this.isNew) {
    this.set("usable", true);
  }

  next();
});

tokenSchema.statics.build = (attrs: TokenAttrs): TokenDoc => {
  return new Token(attrs);
};

const Token = mongoose.model<TokenDoc, TokenModel>("Token", tokenSchema);

export { Token };
