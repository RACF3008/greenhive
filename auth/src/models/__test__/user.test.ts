import mongoose from "mongoose";

import { User } from "../user";

it("implements optimistic concurrency control", async () => {
  const user = User.build({
    firstName: "Testy",
    lastName: "GreenHive",
    username: "Testy2024",
    email: "testy@test.com",
    password: "Passw0rd",
  });

  await user.save();

  const firstInstance = await User.findById(user.id);
  const secondInstance = await User.findById(user.id);

  firstInstance!.set({ username: "Testy2025" });
  secondInstance!.set({ username: "Testy" });

  await firstInstance!.save();

  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error("Should not reach this point");
});

it("increments version number on save", async () => {
  const user = User.build({
    firstName: "Testy",
    lastName: "GreenHive",
    username: "Testy2024",
    email: "testy@test.com",
    password: "Passw0rd",
  });

  await user.save();
  expect(user.version).toEqual(0);

  await user.save();
  expect(user.version).toEqual(1);

  await user.save();
  expect(user.version).toEqual(2);
});

it("fills the createdAt and updatedAt attributes automatically", async () => {
  const user = User.build({
    firstName: "Testy",
    lastName: "GreenHive",
    username: "Testy2024",
    email: "testy@test.com",
    password: "Passw0rd",
  });
  await user.save();
  expect(user.createdAt).toBeDefined();

  await user.save();
  expect(user.updatedAt).toBeDefined();
});

it("sets the attribute 'verified' as false when created", async () => {
  const user = User.build({
    firstName: "Testy",
    lastName: "GreenHive",
    username: "Testy2024",
    email: "testy@test.com",
    password: "Passw0rd",
  });
  await user.save();
  expect(user.verified).toBeFalsy();
});
