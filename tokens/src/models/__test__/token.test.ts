import crypto from "crypto";
import mongoose from "mongoose";

import { TokenPurpose } from "@greenhive/common";
import { Token } from "../token";
import { mongo } from "mongoose";

it("builds a token", async () => {
  const token = Token.build({
    value: crypto.randomBytes(32).toString("hex"),
    userId: new mongoose.Types.ObjectId().toHexString(),
    purpose: TokenPurpose.USER_AUTHENTICATION,
  });
  await token.save();

  const tokenDoc = await Token.findById(token.id);
  expect(tokenDoc).toBeDefined();
});

it("fills the createdAt attribute automatically", async () => {
  const token = Token.build({
    value: crypto.randomBytes(32).toString("hex"),
    userId: new mongoose.Types.ObjectId().toHexString(),
    purpose: TokenPurpose.USER_AUTHENTICATION,
  });
  await token.save();

  expect(token.createdAt).toBeDefined();
});

it("sets the attribute 'isUsable' as true when created", async () => {
  const token = Token.build({
    value: crypto.randomBytes(32).toString("hex"),
    userId: new mongoose.Types.ObjectId().toHexString(),
    purpose: TokenPurpose.USER_AUTHENTICATION,
  });
  await token.save();

  expect(token.isUsable).toBeTruthy();
});
