export const mqttWrapper = {
  publish: jest.fn().mockImplementation((topic, message, options) => {
    console.log(`Mock MQTT publish: ${topic} -> ${message}`);
    return Promise.resolve();
  }),
  onMessage: jest.fn(),
};
