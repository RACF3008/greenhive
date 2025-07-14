export const mqttWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (
          topic: string,
          message: string,
          options: any,
          callback: () => void
        ) => {
          if (typeof options === "function") {
            callback = options;
          }
          callback?.();
        }
      ),
  },
};
