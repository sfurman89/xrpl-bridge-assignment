import { Inject, Module, OnModuleDestroy } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GlobalExceptionFilter } from './common/filters/global-exception.filter'
import { CacheConfigModule } from './config/cache.config/cache.config.module'
import { ClientConfigModule } from './config/client.config/client.config.module'
import { GraphqlConfigModule } from './config/graphql.config/graphql.config.module'
import { MongooseConfigModule } from './config/mongoose.config/mongoose.config.module'
import { AccountModule } from './resources/account/account.module'
import { TransactionModule } from './resources/transaction/transaction.module'
import { HelperModule } from './common/helpers/helper/helper.module'
import { CacheModule } from './common/utils/cache/cache.module'
import { WebsocketModule } from './common/utils/websocket/websocket.module'
import { APP_FILTER } from '@nestjs/core'
import { CLIENT } from './common/constants'
import * as xrpl from 'xrpl'

@Module({
  imports: [
    CacheConfigModule,
    ClientConfigModule,
    GraphqlConfigModule,
    MongooseConfigModule,
    CacheModule,
    HelperModule,
    WebsocketModule,
    AccountModule,
    TransactionModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter
    }
  ]
})
export class AppModule implements OnModuleDestroy {
  constructor(@Inject(CLIENT) private readonly _client: xrpl.Client) {}

  public onModuleDestroy = (): Promise<void> => this._client.disconnect()
}
