import mongoose from "mongoose";

import { UserCreatedEvent } from "@greenhive/common";
import { natsWrapper } from "../../../nats-wrapper";
import { UserCreatedListener } from "../user-created-listener";
import { Token } from "../../../models/token";

const setup = async () => {
    const listener = new UserCreatedListener(natsWrapper.client);

    const data: UserCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        firstName: 'Testy',
        lastName: 'GreenHive',
        username: 'Testy2024',
        email: 'testy@test.com'
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener,  data, msg };
}

it('creates a new token to verify the new user', async () => {
    const { listener, data, msg } = await setup();

    const tokenQty = await Token.countDocuments();
    expect(tokenQty).toEqual(0);

    await listener.onMessage(data, msg);

    expect(tokenQty).toEqual(1);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});