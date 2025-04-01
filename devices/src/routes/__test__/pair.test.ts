import request from "supertest";

import { app } from "../../app";
import { Device } from "../../models/device";

import { natsWrapper } from "../../nats-wrapper";
import { DeviceStatus, DeviceTypes } from "@greenhive/common";

it("has a route a handler listening to /api/devices/pair for post requests", async () => {
  const response = await request(app).post("/api/devices/pair").send({});

  expect(response.status).not.toEqual(404);
});

it("pairs a new device with the provided token", async () => {
  let devices = await Device.find({});
  expect(devices.length).toEqual(0);

  const { id } = global.signin();
  const device = await Device.build({
    type: DeviceTypes.TOWER,
    name: "testDevice",
    status: DeviceStatus.ONLINE,
    userId: id,
  });
  await device.save();

  devices = await Device.find({});
  expect(devices.length).toEqual(1);
});

it("returns an error if an invalid parameter is given", async () => {
  const { id } = global.signin();
  await request(app)
    .post("/api/devices/pair")
    .send({
      token: "",
    })
    .expect(400);

  await request(app).post("/api/devices/pair").send({}).expect(400);
});

test.todo("sets the device");
test.todo("publishes a DeviceUpdatedEvent to NATS");
test.todo("publishes a TokenUsedEvent to NATS");
