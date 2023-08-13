import { HttpException, HttpStatus } from '@nestjs/common'
import { IGraphQLErrorException } from '../interfaces/index.interface'

export class ErrorException extends HttpException {
  constructor(response: string | IGraphQLErrorException, code: number = HttpStatus.BAD_REQUEST) {
    super(response, code)
  }
}
