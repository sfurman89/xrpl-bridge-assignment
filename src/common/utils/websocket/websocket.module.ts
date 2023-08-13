import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ENV_XRPL_SERVER, WEBSOCKET } from '../../constants'
import { WebSocket } from 'ws'

@Global()
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [
    {
      provide: WEBSOCKET,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): WebSocket => new WebSocket(configService.get<string>(ENV_XRPL_SERVER))
    }
  ],
  exports: [WEBSOCKET]
})
export class WebsocketModule {}
