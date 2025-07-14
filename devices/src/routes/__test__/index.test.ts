import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";

it("can fetch a list of devices related to a user", async () => {
  const { cookie, id } = global.signin();

  await request(app)
    .post("/api/devices/new")
    .set("Cookie", cookie)
    .send({
      type: "tower",
      name: "testTower1",
      hardware: "1.0.0",
      firmware: "1.0.0",
    })
    .expect(201);
  await request(app)
    .post("/api/devices/new")
    .set("Cookie", cookie)
    .send({
      type: "tower",
      name: "testTower2",
      hardware: "1.0.0",
      firmware: "1.0.0",
    })
    .expect(201);
  await request(app)
    .post("/api/devices/new")
    .set("Cookie", cookie)
    .send({
      type: "tower",
      name: "testTower3",
      hardware: "1.0.0",
      firmware: "1.0.0",
    })
    .expect(201);

  const response = await request(app)
    .get("/api/devices")
    .set("Cookie", cookie)
    .send()
    .expect(200);
  expect(response.body.length).toEqual(3);
});
