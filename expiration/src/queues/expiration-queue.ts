import Queue from 'bull';

interface Payload {
    tokenId: string;
}

const expirationQueue = new Queue<Payload>('verification-token:expiration', {
    redis: {
        host: process.env.REDIS_HOST
    }
});

expirationQueue.process(async (job) => {
    console.log('publish expiration complete event for ', job.data.tokenId);
})

export { expirationQueue };