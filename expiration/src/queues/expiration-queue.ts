import Queue from 'bull';
import { TokenExpirationCompletePublisher } from '../events/publishers/token-expiration-complete-publisher';
import { natsWrapper } from '../nats-wrapper';

interface Payload {
    token: string;
}

const expirationQueue = new Queue<Payload>('verification-token:expiration', {
    redis: {
        host: process.env.REDIS_HOST
    }
});

expirationQueue.process(async (job) => {
    new TokenExpirationCompletePublisher(natsWrapper.client).publish({
        value: job.data.token
    })
})

export { expirationQueue };