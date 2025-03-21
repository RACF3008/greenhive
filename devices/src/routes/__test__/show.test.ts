import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";

it("returns a 404 if device is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  const response = await request(app)
    .get(`/api/devices/${id}`)
    .send()
    .expect(404);
});

it("returns a the device info if it is found", async () => {
  const { id } = global.signin();

  const response = await request(app)
    .post("/api/devices/new")
    .send({
      type: "tower",
      name: "testDevice",
      status: "online",
      userId: id,
    })
    .expect(201);

  const deviceResponse = await request(app)
    .get(`/api/devices/${response.body.id}`)
    .send()
    .expect(200);

  expect(deviceResponse.body.type).toEqual("tower");
  expect(deviceResponse.body.name).toEqual("testDevice");
});
