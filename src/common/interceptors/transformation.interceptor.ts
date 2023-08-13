import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { IRedirectParams } from '../decorators/redirect.decorator'
import { RedirectException } from '../exceptions/redirect.exception'
import { REDIRECT_METADATA_KEY } from '../constants'

export interface IResponse<T> {
  data: T
}

@Injectable()
export class TransformationInterceptor<T> implements NestInterceptor<T, IResponse<T>> {
  constructor(private readonly _reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<IResponse<T>> {
    const redirectParams =
      this._reflector.get<IRedirectParams>(REDIRECT_METADATA_KEY, context.getHandler()) ?? undefined
    if (redirectParams) {
      throw new RedirectException(redirectParams)
    }
    return next.handle()
  }
}
