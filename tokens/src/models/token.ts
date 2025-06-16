import mongoose from "mongoose";
import { TokenPurpose } from "@greenhive/common";

interface TokenAttrs {
  value: string;
  userId: string;
  purpose: TokenPurpose;
}

interface TokenModel extends mongoose.Model<TokenDoc> {
  build(attrs: TokenAttrs): TokenDoc;
}

interface TokenDoc extends mongoose.Document {
  value: string;
  userId: string;
  purpose: TokenPurpose;
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
      enum: Object.values(TokenPurpose),
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
      },
    },
  }
);

// Define expiration times (in minutes) depending on purpose
const EXPIRATION_TIMES: Record<TokenPurpose, number> = {
  [TokenPurpose.USER_AUTHENTICATION]: 10,
  [TokenPurpose.PASSWORD_RESET]: 10,
  // Si agregas más valores en el enum, TypeScript te obligará a agregarlos aquí
};

tokenSchema.pre<TokenDoc>("save", function (next) {
  if (this.isNew) {
    this.set("usable", true);
  }

  const expirationTime = EXPIRATION_TIMES[this.purpose];
  if (expirationTime) {
    this.set(
      "expiresAt",
      new Date(this.createdAt.getTime() + expirationTime * 60 * 1000)
    );
  } else {
    this.set("expiresAt", new Date(this.createdAt.getTime() + 10 * 60 * 1000));
  }

  next();
});

tokenSchema.statics.build = (attrs: TokenAttrs): TokenDoc => {
  return new Token(attrs);
};

const Token = mongoose.model<TokenDoc, TokenModel>("Token", tokenSchema);

export { Token };
