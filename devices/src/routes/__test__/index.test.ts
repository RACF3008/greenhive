import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";

it.todo("can fetch a list of devices related to a user");

// , async () => {
//   const { cookie, id } = global.signin();
//   const fakeId = new mongoose.Types.ObjectId().toHexString();

//   await request(app)
//     .post("/api/devices/new")
//     .send({
//       type: "tower",
//       name: "testDevice1",
//       status: "online",
//       userId: id,
//     })
//     .expect(201);
//   await request(app)
//     .post("/api/devices/new")
//     .send({
//       type: "tower",
//       name: "testDevice1",
//       status: "online",
//       userId: fakeId,
//     })
//     .expect(201);
//   await request(app)
//     .post("/api/devices/new")
//     .send({
//       type: "tower",
//       name: "testDevice1",
//       status: "online",
//       userId: id,
//     })
//     .expect(201);

//   const response = await request(app)
//     .get("/api/devices")
//     .set("Cookie", cookie)
//     .send()
//     .expect(200);
//   expect(response.body.length).toEqual(2);
// }
