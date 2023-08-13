import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { RedirectException } from '../exceptions/redirect.exception'
import { ConfigService } from '@nestjs/config'
import { IRedirectParams } from '../decorators/redirect.decorator'
import { ErrorException } from '../exceptions/error.exception'
import { XrplError } from 'xrpl'
import { ENV_DEFAULT_ROUTE } from '../constants'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly _configService: ConfigService) {}
  catch = async (exception: any, argumentsHost: ArgumentsHost): Promise<any> => {
    const response = argumentsHost.switchToHttp().getResponse()
    if (exception instanceof RedirectException) {
      const { route } = exception.getResponse() as IRedirectParams
      if (route) return response.redirect(route)
    }
    if (exception instanceof HttpException) {
      return response.redirect(this._configService.get<string>(ENV_DEFAULT_ROUTE))
    }
    throw new ErrorException(
      {
        message: exception?.getResponse?.()?.message ?? exception?.message ?? exception?.message?.error,
        context: argumentsHost.switchToRpc().getContext()
      },
      exception?.getStatus?.() || exception instanceof XrplError
        ? HttpStatus.BAD_REQUEST
        : HttpStatus.INTERNAL_SERVER_ERROR
    )
  }
}
