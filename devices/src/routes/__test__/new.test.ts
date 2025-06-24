import request from "supertest";

import { app } from "../../app";
import { Device } from "../../models/device";

import { natsWrapper } from "../../nats-wrapper";
import { DeviceTypes } from "@greenhive/common";

it("requires auth to create a device", async () => {
  await request(app)
    .post("/api/devices/new")
    .send({
      type: DeviceTypes.TOWER,
      name: "testDevice",
      hardware: "v1.0.0",
      firmware: "v1.0.0",
    })
    .expect(401);
});

it("requires a valid body", async () => {
  const { cookie } = await global.signin();
  await request(app)
    .post("/api/devices/new")
    .set("Cookie", cookie)
    .send({
      type: DeviceTypes.TOWER,
      hardware: "v1.0.0",
      firmware: "v1.0.0",
    })
    .expect(400);
});

it("creates a new device document", async () => {
  const deviceCountBefore = await Device.countDocuments();
  expect(deviceCountBefore).toEqual(0);

  const { cookie } = await global.signin();
  await request(app)
    .post("/api/devices/new")
    .set("Cookie", cookie)
    .send({
      type: DeviceTypes.TOWER,
      name: "testDevice",
      hardware: "v1.0.0",
      firmware: "v1.0.0",
    })
    .expect(201);

  const deviceCountAfter = await Device.countDocuments();
  expect(deviceCountAfter).toEqual(1);
});

it("publishes a DeviceNewEvent to NATS", async () => {
  const { cookie } = await global.signin();
  await request(app)
    .post("/api/devices/new")
    .set("Cookie", cookie)
    .send({
      type: DeviceTypes.TOWER,
      name: "testDevice",
      hardware: "v1.0.0",
      firmware: "v1.0.0",
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

// Futuras implementaciones
it.todo(
  "limits the amount of devices a user can register before an alert is thrown"
);
