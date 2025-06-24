import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";

import { natsWrapper } from "../../nats-wrapper";
import { DeviceTypes, OwnerTypes } from "@greenhive/common";

it("returns a 401 if the user is not authenticated", async () => {
  await request(app)
    .put(`/api/devices/${new mongoose.Types.ObjectId().toHexString()}`)
    .send({
      type: DeviceTypes.TOWER,
      name: "testDevice",
      hardware: "v1.0.0",
      firmware: "v1.0.0",
    })
    .expect(401);
});

it("returns a 400 if there are wrong/missing fields in request", async () => {
  const { cookie, id } = global.signin();

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

  await request(app)
    .put(`/api/devices/${response.body.id}`)
    .set("Cookie", cookie)
    .send({})
    .expect(400);
});

it("accepts only OwnerType options for ownerType field", async () => {
  const { cookie, id } = global.signin();

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

  await request(app)
    .put(`/api/devices/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      name: "testDeviceUpdated",
      ownerId: new mongoose.Types.ObjectId().toHexString(),
      ownerType: "wrongOwnerType",
    })
    .expect(400);
});

it("returns a 404 if device id is not found", async () => {
  const { cookie } = global.signin();

  const nonExistingDeviceId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/devices/${nonExistingDeviceId}`)
    .set("Cookie", cookie)
    .send({
      name: "testDeviceUpdated",
      ownerId: new mongoose.Types.ObjectId().toHexString(),
      ownerType: OwnerTypes.CLUSTER,
    })
    .expect(404);
});

it("returns a 401 if the user does not own the device", async () => {
  const { cookie: cookie1, id: id1 } = global.signin();
  const response = await request(app)
    .post("/api/devices/new")
    .set("Cookie", cookie1)
    .send({
      type: DeviceTypes.TOWER,
      name: "testDevice",
      hardware: "v1.0.0",
      firmware: "v1.0.0",
    })
    .expect(201);

  const { cookie: cookie2, id: id2 } = global.signin();
  await request(app)
    .put(`/api/devices/${response.body.id}`)
    .set("Cookie", cookie2)
    .send({
      name: "updatedTestDevice",
      description: "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
      ownerId: new mongoose.Types.ObjectId().toHexString(),
      ownerType: OwnerTypes.CLUSTER,
    })
    .expect(401);
});

it.todo(
  "updates the device with the provided information when owned by the user"
);
// , async () => {
//   const { cookie, id } = global.signin();

//   const response = await request(app)
//     .post("/api/devices/new")
//     .set("Cookie", cookie)
//     .send({
//       type: DeviceTypes.TOWER,
//       name: "testDevice",
//       hardware: "v1.0.0",
//       firmware: "v1.0.0",
//     })
//     .expect(201);

//   await request(app)
//     .put(`/api/devices/${response.body.id}`)
//     .set("Cookie", cookie)
//     .send({
//       name: "updatedTestDevice",
//       description: "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
//       ownerId: new mongoose.Types.ObjectId().toHexString(),
//       ownerType: OwnerTypes.CLUSTER,
//     })
//     .expect(200);

// const deviceResponse = await request(app)
//   .get(`/api/devices/${response.body.id}`)
//   .send()
//   .expect(200);

// expect(deviceResponse.body.name).toEqual("updatedTestDevice");
// }

it.todo("allows only device's cluster members (with permissions) to update it");

it("publishes a deviceUpdatedEvent to NATS", async () => {
  const { cookie } = global.signin();
  const response = await request(app)
    .post("/api/devices/new")
    .set("Cookie", cookie)
    .send({
      type: DeviceTypes.TOWER,
      name: "testDevice",
      hardware: "v1.0.0",
      firmware: "v1.0.0",
    });

  await request(app)
    .put(`/api/devices/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      name: "updatedTestDevice",
      description: "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
      ownerId: new mongoose.Types.ObjectId().toHexString(),
      ownerType: OwnerTypes.CLUSTER,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it.todo("publishes a DeviceInfoSet message to MQTT");
