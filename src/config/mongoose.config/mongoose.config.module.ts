import { Module } from '@nestjs/common'
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ENV_MONGODB_URI } from '../../common/constants'

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): MongooseModuleOptions => ({
        uri: configService.get<string>(ENV_MONGODB_URI)
      })
    })
  ]
})
export class MongooseConfigModule {}
