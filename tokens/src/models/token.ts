import mongoose from "mongoose";

interface TokenAttrs {
  value: string;
  userId: string;
  purpose: string;
}

interface TokenModel extends mongoose.Model<TokenDoc> {
  build(attrs: TokenAttrs): TokenDoc;
}

interface TokenDoc extends mongoose.Document {
  value: string;
  userId: string;
  purpose: string;
  expiresAt: Date;
  isUsable: boolean;
  createdAt: Date;
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
    purpose: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: false,
    },
    isUsable: {
      type: Boolean,
      required: true,
      default: true,
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
