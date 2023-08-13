import { Inject, Injectable } from '@nestjs/common'
import {
  WalletOptsInput,
  Wallet,
  XrpBalanceOptsInput,
  BalanceOptsInput,
  Balance,
  CreateAccount,
  UpdateAccountInput,
  DeleteAccountInput,
  DeleteAccount,
  UpdateAccount,
  AccountInfoInput,
  AccountInfo,
  AccountCurrenciesInput,
  AccountCurrencies,
  AccountTransactionsInput,
  AccountTransactions
} from './account.entity'
import { CacheService } from '../../common/utils/cache/cache.service'
import { ClientMethodEnum } from '../../common/enums/client-method.enum'
import { HelperService } from '../../common/helpers/helper/helper.service'
import { WebSocket } from 'ws'
import { CLIENT, WEBSOCKET } from '../../common/constants'
import * as xrpl from 'xrpl'

@Injectable()
export class AccountService {
  constructor(
    @Inject(CLIENT) private readonly _client: xrpl.Client,
    @Inject(WEBSOCKET) private readonly _webSocket: WebSocket,
    private readonly _cacheService: CacheService,
    private readonly _helperService: HelperService
  ) {}

  getWallet = (seed: string, params?: WalletOptsInput, ignoreCache: boolean = false): Promise<Wallet> =>
    this._cacheService.getSet<Wallet>(
      `${seed}:getWallet${this._cacheService.generateKey(params)}`,
      [seed, params],
      null,
      ignoreCache
    )

  getXrpBalance = (account: string, params?: XrpBalanceOptsInput): Promise<string> =>
    this._cacheService.getSet<string>(
      `${account}:getXrpBalance${this._cacheService.generateKey(params)}`,
      [account, params],
      ClientMethodEnum.getXrpBalance
    )

  getBalances = (account: string, params?: BalanceOptsInput): Promise<Balance[]> =>
    this._cacheService.getSet<Balance[]>(
      `${account}:getBalances${this._cacheService.generateKey(params)}`,
      [account, params],
      ClientMethodEnum.getBalances
    )

  getAccountInfo = (params: AccountInfoInput): Promise<AccountInfo | null> => {
    if (this._webSocket.readyState !== WebSocket.OPEN) return null
    this._webSocket.send(
      JSON.stringify({
        command: 'account_info',
        ...params
      })
    )
    return new Promise(resolve => {
      this._webSocket.onmessage = async ({ data }): Promise<void> => {
        resolve(JSON.parse(data as string))
      }
    })
  }

  getAccountCurrencies = (params: AccountCurrenciesInput): Promise<AccountCurrencies | null> => {
    if (this._webSocket.readyState !== WebSocket.OPEN) return null
    this._webSocket.send(
      JSON.stringify({
        command: 'account_currencies',
        ...params
      })
    )
    return new Promise(resolve => {
      this._webSocket.onmessage = async ({ data }): Promise<void> => {
        resolve(JSON.parse(data as string))
      }
    })
  }

  getAccountTransactions = (params: AccountTransactionsInput): Promise<AccountTransactions | null> => {
    if (this._webSocket.readyState !== WebSocket.OPEN) return null
    this._webSocket.send(
      JSON.stringify({
        command: 'account_tx',
        ...params
      })
    )
    return new Promise(resolve => {
      this._webSocket.onmessage = async ({ data }): Promise<void> => {
        resolve(JSON.parse(data as string))
      }
    })
  }

  createAccount = (): Promise<CreateAccount> => this._client.fundWallet()

  updateAccount = async (params: UpdateAccountInput): Promise<UpdateAccount> => {
    const account = await this.getWallet(params.seed, undefined, true)
    return (await this._client.submitAndWait(
      account.sign(
        await this._client.autofill({
          TransactionType: 'AccountSet',
          Account: account.classicAddress,
          ...this._helperService.formatUpdateAccountParams(params)
        })
      ).tx_blob
    )) as any as UpdateAccount
  }

  deleteAccount = async (params: DeleteAccountInput): Promise<DeleteAccount> => {
    const wallet = await this.getWallet(params.seed, undefined, true)
    return (await this._client.submitAndWait(
      wallet.sign(
        await this._client.autofill({
          TransactionType: 'AccountDelete',
          Account: wallet.classicAddress,
          Destination: params.destination
        })
      ).tx_blob
    )) as any as DeleteAccount
  }
}
