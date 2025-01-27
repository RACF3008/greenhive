import { Subjects, Publisher, TokenExpirationCompleteEvent } from '@greenhive/common'

export class TokenExpirationCompletePublisher extends Publisher<TokenExpirationCompleteEvent> {
    subject: Subjects.TokenExpirationComplete = Subjects.TokenExpirationComplete
}