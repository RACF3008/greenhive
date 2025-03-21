import request from "supertest";

import { app } from "../../app";
import { Device } from "../../models/device";

import { natsWrapper } from "../../nats-wrapper";

it("has a route a handler listening to /api/devices/new for post requests", async () => {
  const response = await request(app).post("/api/devices/new").send({});

  expect(response.status).not.toEqual(404);
});

it("registers a device if correct data is given", async () => {
  let devices = await Device.find({});
  expect(devices.length).toEqual(0);

  const { id } = global.signin();
  await request(app)
    .post("/api/devices/new")
    .send({
      type: "tower",
      name: "testDevice",
      status: "online",
      userId: id,
    })
    .expect(201);

  devices = await Device.find({});
  expect(devices.length).toEqual(1);
});

it("returns an error if an invalid parameter is given", async () => {
  const { id } = global.signin();
  await request(app)
    .post("/api/devices/new")
    .send({
      type: "notAtype",
      name: "testDevice",
      status: "online",
      userId: id,
    })
    .expect(400);

  await request(app)
    .post("/api/devices/new")
    .send({
      type: "tower",
      name: "testDevice",
      status: "connected",
      userId: id,
    })
    .expect(400);

  await request(app)
    .post("/api/devices/new")
    .send({
      type: "tower",
      name: "testDevice",
      status: "online",
      userId: "notAValidUserId",
    })
    .expect(400);
});

it("publishes a deviceRegisteredEvent to NATS", async () => {
  const { id } = global.signin();
  await request(app)
    .post("/api/devices/new")
    .send({
      type: "tower",
      name: "testDevice",
      status: "online",
      userId: id,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
