import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";
import { DeviceTypes } from "@greenhive/common";

it("requires auth to show a device", async () => {
  await request(app)
    .get(`/api/devices/${new mongoose.Types.ObjectId()}`)
    .send()
    .expect(401);
});

it("returns a 404 if device is not found", async () => {
  const { cookie } = await global.signin();
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .get(`/api/devices/${id}`)
    .set("Cookie", cookie)
    .send()
    .expect(404);
});

it("returns a the device info if it is found and belongs to the current user", async () => {
  const { cookie } = global.signin();

  const response = await request(app)
    .post("/api/devices/new")
    .set("Cookie", cookie)
    .send({
      type: DeviceTypes.TOWER,
      name: "testDevice",
      hardware: "v1.0.0",
      firmware: "v1.0.0",
    })
    .expect(201);

  const deviceResponse = await request(app)
    .get(`/api/devices/${response.body.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(deviceResponse.body.type).toEqual("tower");
  expect(deviceResponse.body.name).toEqual("testDevice");
});
