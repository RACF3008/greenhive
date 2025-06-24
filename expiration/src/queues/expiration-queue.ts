import Queue from "bull";
import { ExpirationTokenPublisher } from "../events/publishers/expiration-token-publisher";
import { natsWrapper } from "../nats-wrapper";

interface Payload {
  id: string;
}

const expirationQueue = new Queue<Payload>("verification-token:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  new ExpirationTokenPublisher(natsWrapper.client).publish({
    id: job.data.id,
  });
});

export { expirationQueue };
