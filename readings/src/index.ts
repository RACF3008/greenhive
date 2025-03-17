import mongoose from "mongoose";

import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { mqttWrapper } from "./mqtt-wrapper";
import { DeviceRegisteredListener } from "./events/listeners/device-registered-listener";
import { DeviceUpdatedListener } from "./events/listeners/device-updated-listener";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    // Configuración de MQTT
    await mqttWrapper.connect("mqtt://mosquitto-internal:1883", {
      username: process.env.MQTT_USER,
      password: process.env.MQTT_PASS,
    });
    mqttWrapper.client.on("close", () => {
      console.log("MQTT connection closed");
      process.exit();
    });
    mqttWrapper.client.on("error", (err) => {
      console.error("MQTT connection error:", err);
    });
    mqttWrapper.onMessage((topic, message) => {
      console.log(
        `MQTT message recieved on topic "${topic}": ${message.toString()}`
      );
    });
    // Suscribir a tópicos
    await mqttWrapper.subscribe("tower/tests");
    await mqttWrapper.subscribe("tower/readings");

    new DeviceRegisteredListener(natsWrapper.client).listen();
    new DeviceUpdatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!");
  });
};

start();
