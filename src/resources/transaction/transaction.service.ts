import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { dropsToXrp } from 'xrpl'
import { AccountService } from '../account/account.service'
import { MonitorTransactions, MonitorTransactionsInput, SendXrpInput, SendXrp, Transaction } from './transaction.entity'
import { PubSub } from 'graphql-subscriptions'
import { ITransaction } from './interfaces/transaction.interface'
import { HelperService } from '../../common/helpers/helper/helper.service'
import { CacheService } from '../../common/utils/cache/cache.service'
import { CLIENT, MONITOR_TRANSACTION_PAYLOAD, TRANSACTION, WEBSOCKET } from '../../common/constants'
import { Model } from 'mongoose'
import { WebSocket } from 'ws'
import * as xrpl from 'xrpl'

@Injectable()
export class TransactionService {
  constructor(
    @Inject(CLIENT) private readonly _client: xrpl.Client,
    @Inject(WEBSOCKET) private readonly _webSocket: WebSocket,
    @Inject(WEBSOCKET) private readonly _webSocketRequest: WebSocket,
    @InjectModel(TRANSACTION) private readonly _transactionModel: Model<ITransaction>,
    private readonly _accountService: AccountService,
    private readonly _cacheService: CacheService,
    private readonly _helperService: HelperService,
    private _pubSub: PubSub
  ) {
    this._initializeEvents()
  }

  private _initializeEvents = (): void => {
    if (this._webSocket.readyState === WebSocket.OPEN) {
      this._webSocket.addEventListener('message', async ({ data }): Promise<void> => {
        const response = JSON.parse(data as string)
        if (response.type === 'transaction') {
          const monitorTransactionPayload: MonitorTransactions = this._helperService.parseTransactionResponse(response)
          await this._createTransaction(monitorTransactionPayload)
          return this._pubSub.publish(MONITOR_TRANSACTION_PAYLOAD, {
            ...monitorTransactionPayload,
            transaction: {
              ...monitorTransactionPayload.transaction,
              amount: dropsToXrp(monitorTransactionPayload.transaction.amount)
            }
          })
        }
      })
    }
  }

  private _createTransaction = async (monitorTransaction: MonitorTransactions): Promise<ITransaction> =>
    new this._transactionModel({
      ...monitorTransaction.transaction,
      error: monitorTransaction?.error
    }).save()

  getTransaction = async (hash: string): Promise<Transaction | null> => {
    const transaction = await this._cacheService.get<Transaction>(hash)
    if (transaction) return transaction
    if (this._webSocketRequest.readyState !== WebSocket.OPEN) return null
    this._webSocketRequest.send(
      JSON.stringify({
        command: 'tx',
        transaction: hash,
        binary: false
      })
    )
    return new Promise(resolve => {
      this._webSocketRequest.onmessage = async ({ data }): Promise<void> => {
        const transaction: Transaction = JSON.parse(data as string)
        await this._cacheService.set(hash, transaction)
        resolve(transaction)
      }
    })
  }

  sendXrp = async (params: SendXrpInput): Promise<SendXrp> => {
    const wallet = await this._accountService.getWallet(params.seed, undefined, true)
    return (await this._client.submitAndWait(
      wallet.sign(
        await this._client.autofill({
          TransactionType: 'Payment',
          Account: wallet.classicAddress,
          Amount: xrpl.xrpToDrops(params.amount),
          Destination: params.destination
        })
      ).tx_blob
    )) as any as SendXrp
  }

  monitorTransactions = (params: MonitorTransactionsInput): void => {
    if (this._webSocket.readyState === WebSocket.OPEN) {
      this._webSocket.send(
        JSON.stringify({
          command: 'subscribe',
          accounts: params.wallets
        })
      )
    }
  }
}
