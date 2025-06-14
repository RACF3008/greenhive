import request from "supertest";

import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";
import { currentUser, NotAuthorizedError } from "@greenhive/common";
import ts from "typescript";

it("returns a 401 when the user is not logged in", async () => {
  return request(app)
    .put("/api/users/update")
    .send({ firstName: "Rodrigo", lastName: "Cruz" })
    .expect(401);
});

it("returns a 400 if the information is incorrect", async () => {
  const token = await global.signup();
  const cookie = await global.userVerify(token);
  if (!cookie) {
    throw new NotAuthorizedError();
  }

  await request(app)
    .put("/api/users/update")
    .set("Cookie", cookie)
    .send({
      firstName: "Testy",
      lastName: "GreenHive",
      username: "",
      email: "testy2025@test.com",
    })
    .expect(400);
});

it("changes user information", async () => {
  const token = await global.signup();
  const cookie = await global.userVerify(token);
  if (!cookie) {
    throw new NotAuthorizedError();
  }

  const { body } = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);
  const usernameBefore = body.currentUser.username;

  const { body: currentUserAfter } = await request(app)
    .put("/api/users/update")
    .set("Cookie", cookie)
    .send({
      firstName: "Testy",
      lastName: "GreenHive",
      username: "Testy2025",
      email: "testy@test.com",
    })
    .expect(200);

  const usernameAfter = currentUserAfter.username;

  expect(usernameBefore).not.toEqual(usernameAfter);
});

it("allows old data to go into the database", async () => {
  const token = await global.signup();
  const cookie = await global.userVerify(token);

  const { body } = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);
  const currentUserBefore = body.currentUser;

  const { body: currentUserAfter } = await request(app)
    .put("/api/users/update")
    .set("Cookie", cookie)
    .send({
      firstName: "Testy",
      lastName: "GreenHive",
      username: "Testy2024",
      email: "testy@test.com",
    })
    .expect(200);

  expect({
    firstName: currentUserBefore.firstName,
    lastName: currentUserBefore.lastName,
    username: currentUserBefore.username,
    email: currentUserBefore.email,
  }).toEqual({
    firstName: currentUserAfter.firstName,
    lastName: currentUserAfter.lastName,
    username: currentUserAfter.username,
    email: currentUserAfter.email,
  });
});
it("sends a user:updated event", async () => {
  const token = await global.signup();
  const cookie = await global.userVerify(token);

  await request(app)
    .put("/api/users/update")
    .set("Cookie", cookie)
    .send({
      firstName: "Testy",
      lastName: "GreenHive",
      username: "Testy2024",
      email: "testy@test.com",
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
