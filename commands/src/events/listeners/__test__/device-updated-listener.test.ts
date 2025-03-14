import mongoose from "mongoose";

import { DeviceStatus, DeviceType, DeviceUpdatedEvent } from "@greenhive/common";
import { natsWrapper } from "../../../nats-wrapper"
import { DeviceUpdatedListener } from "../device-updated-listener"
import { Device } from "../../../models/device";

const setup = async () => {
    const listener = new DeviceUpdatedListener(natsWrapper.client);

    const userId = new mongoose.Types.ObjectId().toHexString();

    const device = Device.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        type: DeviceType.TOWER,
        status: DeviceStatus.OFFLINE,
        gatewayIp: '192.168.1.2',
        userId
    });

    const data: DeviceUpdatedEvent['data'] = {
        id: device.id,
        version: 1,
        type: DeviceType.TOWER,
        name: 'testDevice',
        status: DeviceStatus.ONLINE,
        userId,
        lastUpdated: new Date(),
        gatewayIp: '192.168.0.1',
    };

    // @ts-ignore
    const msg: Message = {
    ack: jest.fn(),
    };

    return { listener, device, data, msg };
}

it('finds and saves new properties of a device', async () => {
    const { listener, device, data, msg } = await setup();
})