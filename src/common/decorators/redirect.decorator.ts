import { CustomDecorator, SetMetadata } from '@nestjs/common'
import { REDIRECT_METADATA_KEY } from '../constants'

export interface IRedirectParams {
  route?: string
  useDefault?: boolean
}

export const Redirect = (params: IRedirectParams): CustomDecorator => SetMetadata(REDIRECT_METADATA_KEY, params)
