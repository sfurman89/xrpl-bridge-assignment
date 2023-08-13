import { HttpException, HttpStatus } from '@nestjs/common'

export class RedirectException extends HttpException {
  constructor(message?: string | object) {
    super(message, HttpStatus.CONTINUE)
  }
}
