import { Publisher, Subjects, ReadingReceivedEvent } from '@greenhive/common';

export class ReadingReceivedPublisher extends Publisher<ReadingReceivedEvent> {
  readonly subject = Subjects.ReadingReceived;
}
