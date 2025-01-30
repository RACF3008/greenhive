import { Message } from 'node-nats-streaming';

import {
  Subjects,
  Listener,
  UserCreatedEvent,
} from '@greenhive/common';
import { queueGroupName } from '../queue-group-name';
import { User } from '../../models/user';

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  readonly subject = Subjects.UserCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: UserCreatedEvent['data'], msg: Message) {
    const user = User.build({
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email
    });
    user.save();

    msg.ack();
  }
}