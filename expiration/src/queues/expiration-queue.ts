import Queue from 'bull';
import { TokenExpiredPublisher } from '../events/publishers/token-expired-publisher';
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
    new TokenExpiredPublisher(natsWrapper.client).publish({
        value: job.data.token
    })
})

export { expirationQueue };