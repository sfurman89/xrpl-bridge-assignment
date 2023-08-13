import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql'
import { TransactionService } from './transaction.service'
import { MonitorTransactions, MonitorTransactionsInput, SendXrpInput, SendXrp, Transaction } from './transaction.entity'
import { PubSub } from 'graphql-subscriptions'
import { MONITOR_TRANSACTION_PAYLOAD } from '../../common/constants'

@Resolver()
export class TransactionResolver {
  constructor(
    private readonly _transactionService: TransactionService,
    private _pubSub: PubSub
  ) {}

  @Query(() => Transaction)
  getTransaction(@Args('hash') hash: string): Promise<Transaction> {
    return this._transactionService.getTransaction(hash)
  }

  @Mutation(() => SendXrp)
  sendXrp(@Args('input') args: SendXrpInput): Promise<SendXrp> {
    return this._transactionService.sendXrp(args)
  }

  @Subscription(() => MonitorTransactions, {
    resolve: payload => payload
  })
  monitorTransactions(@Args('input') args: MonitorTransactionsInput): AsyncIterator<MonitorTransactions> {
    this._transactionService.monitorTransactions(args)
    return this._pubSub.asyncIterator(MONITOR_TRANSACTION_PAYLOAD)
  }
}
