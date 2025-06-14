import request from "supertest";

import { app } from "../../app";
import { Token } from "../../models/token";
import { User } from "../../models/user";
import { NotFoundError } from "@greenhive/common";

it("fails when username or email supplied do not exist", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      identifier: "test@test.com",
      password: "Passw0rd",
    })
    .expect(400);

  await request(app)
    .post("/api/users/signin")
    .send({
      identifier: "RACF3008",
      password: "Passw0rd",
    })
    .expect(400);
});

it("fails when incorrect password is given", async () => {
  const token = await global.signup();
  await global.userVerify(token);

  await request(app)
    .post("/api/users/signin")
    .send({
      identifier: "Testy2024",
      password: "incorrectPassword",
    })
    .expect(400);
  await request(app)
    .post("/api/users/signin")
    .send({
      identifier: "testy@test.com",
      password: "incorrectPassword",
    })
    .expect(400);
});

it("responds with a cookie when given valid credentials", async () => {
  const token = await global.signup();
  await global.userVerify(token);

  const firstResponse = await request(app)
    .post("/api/users/signin")
    .send({
      identifier: "Testy2024",
      password: "Passw0rd",
    })
    .expect(200);
  expect(firstResponse.get("Set-Cookie")).toBeDefined();

  await request(app).post("/api/users/signout").send({}).expect(200);

  const secondResponse = await request(app)
    .post("/api/users/signin")
    .send({
      identifier: "testy@test.com",
      password: "Passw0rd",
    })
    .expect(200);
  expect(secondResponse.get("Set-Cookie")).toBeDefined();
});

it("updates the lastLoginAt attribute", async () => {
  const signupResponse = await request(app)
    .post("/api/users/signup")
    .send({
      email: "testy@test.com",
      firstName: "Testy",
      lastName: "GreenHive",
      username: "Testy2024",
      password: "Passw0rd",
      repeatPassword: "Passw0rd",
    })
    .expect(201);

  const user = await User.findOne({ id: signupResponse.body.lastLoginAt });
  if (!user) {
    throw new NotFoundError();
  }
  expect(user.lastLoginAt).not.toBeDefined();

  user.verified = true;
  await user.save();

  const signinResponse = await request(app)
    .post("/api/users/signin")
    .send({
      identifier: "Testy2024",
      password: "Passw0rd",
    })
    .expect(200);

  expect(signinResponse.body.lastLoginAt).toBeDefined();
});
