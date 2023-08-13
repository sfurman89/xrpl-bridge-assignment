import { Global, Module } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CLIENT, ENV_XRPL_SERVER } from '../../common/constants'
import * as xrpl from 'xrpl'

@Global()
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [
    {
      provide: CLIENT,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<xrpl.Client> => {
        const client = new xrpl.Client(configService.get<string>(ENV_XRPL_SERVER))
        await client.connect()
        return client
      }
    },
    {
      provide: PubSub,
      useClass: PubSub
    }
  ],
  exports: [CLIENT, PubSub]
})
export class ClientConfigModule {}
