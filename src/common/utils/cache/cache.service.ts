import { Global, Inject, Injectable } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { ClientMethodEnum } from '../../enums/client-method.enum'
import { CLIENT } from '../../constants'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import * as xrpl from 'xrpl'
import * as _ from 'lodash'

@Global()
@Injectable()
export class CacheService {
  constructor(
    @Inject(CLIENT) private readonly _client: xrpl.Client,
    @Inject(CACHE_MANAGER) private readonly _cache: Cache
  ) {}

  generateKey = (obj: any, separator: string = ':'): string =>
    _.isObject(obj) ? Object.values(obj).join(separator).replace(/^/, separator) : ''

  get = <T>(key: string): Promise<T | undefined> => this._cache.get<T>(key)

  set = (key: string, value: unknown, ttl?: number): Promise<void> => this._cache.set(key, value, ttl)

  getSet = async <T>(
    key: string,
    params: any[],
    clientMethod?: ClientMethodEnum,
    ignoreCache: boolean = false
  ): Promise<T> => {
    let data: T = await this._cache.get<T>(key)
    if (ignoreCache || !data) {
      data = clientMethod
        ? await this._client[clientMethod](params[0], params[1])
        : xrpl.Wallet.fromSeed.apply(null, params)
      ignoreCache || (await this._cache.set(key, data))
    }
    return data
  }
}
