import crypto from 'crypto';
import { Message } from 'node-nats-streaming';

import { SendVerificationEmailEvent } from '@greenhive/common';
import { SendVerificationEmailListener } from '../token-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { emailTransporter } from '../../../email-transporter';

const setup = async () => {
  // create an instance of the listener
  const listener = new SendVerificationEmailListener(natsWrapper.client);

  // create a fake data event
  const data: SendVerificationEmailEvent['data'] = {
    value: crypto.randomBytes(32).toString('hex'),
    user: {
      firstName: 'Name',
      email: 'test@test.com',
    },
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('sends an email with the verification link', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(emailTransporter.sendEmail).toHaveBeenCalledWith(
    data.user.email,
    'Verify your email',
    expect.stringContaining(data.value)
  );
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function
  await listener.onMessage(data, msg);

  // make sure msg.ack was called
  expect(msg.ack).toHaveBeenCalled();
});
