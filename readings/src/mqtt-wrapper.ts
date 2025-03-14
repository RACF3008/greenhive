import mqtt, {
  MqttClient,
  IClientOptions,
  ISubscriptionMap,
  PacketCallback,
} from "mqtt";

class MqttWrapper {
  private _client?: MqttClient;

  // Getter para el cliente MQTT
  get client(): MqttClient {
    if (!this._client) {
      throw new Error("Cannot access MQTT client before connecting");
    }
    return this._client;
  }

  // Conectar al broker MQTT
  connect(brokerUrl: string, options?: IClientOptions): Promise<void> {
    this._client = mqtt.connect(brokerUrl, options);

    return new Promise<void>((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("Connected to MQTT Broker");
        resolve();
      });

      this.client.on("error", (err) => {
        console.error("MQTT connection error:", err);
        reject(err);
      });

      // Manejar reconexión automática
      this.client.on("close", () => {
        console.log("MQTT connection closed. Reconnecting...");
        this.connect(brokerUrl, options).catch(reject);
      });

      this.client.on("reconnect", () => {
        console.log("Reconnecting to MQTT Broker...");
      });
    });
  }

  // Desconectar del broker MQTT
  disconnect(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this._client) {
        this._client.end(false, {}, (err) => {
          if (err) {
            console.error("Error disconnecting from MQTT Broker:", err);
            reject(err);
          } else {
            console.log("Disconnected from MQTT Broker");
            resolve();
          }
        });
      } else {
        resolve(); // Si no hay cliente, no hay necesidad de desconectar
      }
    });
  }

  // Publicar un mensaje en un tema
  publish(
    topic: string,
    message: string,
    options?: mqtt.IClientPublishOptions
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.client.publish(topic, message, options, (err) => {
        if (err) {
          console.error("Error publishing message:", err);
          reject(err);
        } else {
          console.log(`Message published to ${topic}`);
          resolve();
        }
      });
    });
  }

  // Suscribirse a un tema
  subscribe(
    topic: string | string[],
    options?: mqtt.IClientSubscribeOptions
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.client.subscribe(topic, options, (err, granted) => {
        if (err) {
          console.error("Error subscribing to topic:", err);
          reject(err);
        } else {
          console.log(`Subscribed to topic(s):`, granted);
          resolve();
        }
      });
    });
  }

  // Escuchar mensajes en un tema
  onMessage(callback: (topic: string, message: Buffer) => void): void {
    this.client.on("message", callback);
  }
}

// Exportar una instancia del wrapper
export const mqttWrapper = new MqttWrapper();
