import { Module } from '@nestjs/common'
import { redisStore } from 'cache-manager-redis-store'
import { CacheModule, CacheModuleAsyncOptions } from '@nestjs/cache-manager'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ENV_REDIS_HOST, ENV_REDIS_PORT } from '../../common/constants'

@Module({
  imports: [
    CacheModule.registerAsync<CacheModuleAsyncOptions>({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<CacheModuleAsyncOptions> =>
        ({
          store: await redisStore({
            socket: {
              host: configService.get<string>(ENV_REDIS_HOST),
              port: +configService.get<number>(ENV_REDIS_PORT)
            }
          }),
          isGlobal: true,
          ttl: 0
        }) as CacheModuleAsyncOptions
    })
  ]
})
export class CacheConfigModule {}
