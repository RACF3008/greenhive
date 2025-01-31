import mongoose from "mongoose";
import crypto from 'crypto';
import { Message } from 'node-nats-streaming'

import { TokenCreatedEvent, TokenPurpose } from "@greenhive/common";
import { TokenCreatedListener } from "../token-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { User } from "../../../models/user";
import { Token } from "../../../models/token";

const setup = async () => {
    const listener = new TokenCreatedListener(natsWrapper.client);

    const user = User.build({
        firstName: 'Testy',
        lastName: 'GreenHive',
        username: 'Testy2024',
        password: 'Passw0rd',
        email: 'testy@test.com',
        verified: false
    });
    await user.save();

    const data: TokenCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        value: crypto.randomBytes(32).toString('hex'),
        createdAt: new Date(),
        expiresAt: new Date(),
        purpose: TokenPurpose.USER_AUTHENTICATION,
        userId: user.id
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, user, data, msg};
};

it('creates a new token for user', async () => {
    const { listener, user, data, msg } = await setup();

    const initialCount = await Token.countDocuments();
    expect(initialCount).toBe(0);

    await listener.onMessage(data, msg);

    const finalCount = await Token.countDocuments();
    expect(finalCount).toBe(initialCount + 1);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});