import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface UserAttrs {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  version: number;
}

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
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

userSchema.set('versionKey', 'version');
userSchema.plugin(updateIfCurrentPlugin);

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User({
    _id: attrs.id,
    firstName: attrs.firstName,
    lastName: attrs.lastName,
    username: attrs.username,
    email: attrs.email,
  });
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
