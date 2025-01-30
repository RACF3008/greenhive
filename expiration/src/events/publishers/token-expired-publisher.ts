import { Subjects, Publisher, TokenExpiredEvent } from '@greenhive/common'

export class TokenExpiredPublisher extends Publisher<TokenExpiredEvent> {
    subject: Subjects.TokenExpired = Subjects.TokenExpired
}