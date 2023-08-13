import { Module } from '@nestjs/common'
import { TransactionService } from './transaction.service'
import { TransactionResolver } from './transaction.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import { AccountService } from '../account/account.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TransactionSchema } from './transaction.schema'

@Module({
  imports: [ConfigModule, MongooseModule.forFeature([{ name: 'Transaction', schema: TransactionSchema }])],
  providers: [TransactionResolver, TransactionService, AccountService, ConfigService]
})
export class TransactionModule {}
