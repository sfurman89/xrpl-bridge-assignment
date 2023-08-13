import { Field, Float, InputType, Int, InterfaceType, IntersectionType, ObjectType } from '@nestjs/graphql'
import { AccountSetAsfFlags } from 'xrpl'

@InterfaceType({ isAbstract: true })
class IDynamicParam {
  @Field(() => String)
  private value: string

  getValue = (): any => JSON.parse(this.value)

  setValue = (value: any): void => {
    this.value = JSON.stringify(value)
  }
}

@InterfaceType()
class IResponseWarning {
  @Field(() => Int)
  id: number

  @Field()
  message: string

  @Field(() => IDynamicParam, { nullable: true })
  details?: IDynamicParam
}

@InputType('IMemoParamsInput', { isAbstract: true })
@ObjectType('IMemoParamsType')
export class IMemoParams {
  @Field({ nullable: true })
  MemoData?: string

  @Field({ nullable: true })
  MemoType?: string

  @Field({ nullable: true })
  MemoFormat?: string
}

@InputType('IMemoInput', { isAbstract: true })
@ObjectType('IMemoType')
export class IMemo {
  @Field(() => IMemoParams)
  Memo: IMemoParams
}

@InputType('ISignerParamsInput', { isAbstract: true })
@ObjectType('ISignerParamsType')
export class ISignerParams {
  @Field()
  Account: string

  @Field()
  TxnSignature: string

  @Field()
  SigningPubKey: string
}

@InputType('ISignerInput', { isAbstract: true })
@ObjectType('ISignerType')
export class ISigner {
  @Field(() => ISignerParams)
  Signer: ISignerParams
}

@ObjectType()
class ITransactionMetadata {
  @Field(() => String, { nullable: true })
  delivered_amount?: string

  @Field(() => Int)
  TransactionIndex: number

  @Field()
  TransactionResult: string
}

@InterfaceType()
export class IBaseTransaction {
  @Field()
  Account: string

  @Field()
  TransactionType: string

  @Field({ nullable: true })
  Fee?: string

  @Field(() => Int, { nullable: true })
  Sequence?: number

  @Field({ nullable: true })
  AccountTxnID?: string

  @Field(() => Int, { nullable: true })
  Flags?: number

  @Field(() => Int, { nullable: true })
  LastLedgerSequence?: number

  @Field(() => [IMemo], { nullable: true })
  Memos?: IMemo[]

  @Field(() => [ISigner], { nullable: true })
  Signers?: ISigner[]

  @Field(() => Int, { nullable: true })
  SourceTag?: number

  @Field({ nullable: true })
  SigningPubKey?: string

  @Field(() => Int, { nullable: true })
  TicketSequence?: number

  @Field({ nullable: true })
  TxnSignature?: string

  @Field(() => Int, { nullable: true })
  NetworkID?: number
}

@InterfaceType()
class IPayment extends IBaseTransaction {
  @Field({ defaultValue: 'Payment' })
  TransactionType: 'Payment'

  @Field({ nullable: true })
  Amount?: string

  @Field({ nullable: true })
  Destination?: string

  @Field({ nullable: true })
  DestinationTag?: number

  @Field({ nullable: true })
  InvoiceID?: string

  @Field({ nullable: true })
  SendMax?: string

  @Field({ nullable: true })
  DeliverMin?: string

  @Field(() => Int, { nullable: true })
  Flags?: number
}

@ObjectType()
class IAccountData {
  @Field()
  Account: string

  @Field()
  Balance: string

  @Field(() => Int, { nullable: true })
  Flags?: number

  @Field({ nullable: true })
  LedgerEntryType?: string

  @Field(() => Int, { nullable: true })
  OwnerCount?: number

  @Field({ nullable: true })
  PreviousTxnID?: string

  @Field(() => Int, { nullable: true })
  PreviousTxnLgrSeq?: number

  @Field(() => Int, { nullable: true })
  Sequence?: number

  @Field({ nullable: true })
  index?: string
}

@ObjectType()
class IAccountFlags {
  @Field(() => Boolean, { nullable: true })
  defaultRipple?: boolean

  @Field(() => Boolean, { nullable: true })
  depositAuth?: boolean

  @Field(() => Boolean, { nullable: true })
  disableMasterKey?: boolean

  @Field(() => Boolean, { nullable: true })
  disallowIncomingCheck?: boolean

  @Field(() => Boolean, { nullable: true })
  disallowIncomingNFTokenOffer?: boolean

  @Field(() => Boolean, { nullable: true })
  disallowIncomingPayChan?: boolean

  @Field(() => Boolean, { nullable: true })
  disallowIncomingTrustline?: boolean

  @Field(() => Boolean, { nullable: true })
  disallowIncomingXRP?: boolean

  @Field(() => Boolean, { nullable: true })
  globalFreeze?: boolean

  @Field(() => Boolean, { nullable: true })
  noFreeze?: boolean

  @Field(() => Boolean, { nullable: true })
  passwordSpent?: boolean

  @Field(() => Boolean, { nullable: true })
  requireAuthorization?: boolean

  @Field(() => Boolean, { nullable: true })
  requireDestinationTag?: boolean
}

@InterfaceType()
export class IAccountSet extends IBaseTransaction {
  @Field({ defaultValue: 'AccountSet' })
  TransactionType: 'AccountSet'

  @Field(() => Int, { nullable: true })
  Flags?: number

  @Field(() => Int, { nullable: true })
  ClearFlag?: number

  @Field({ nullable: true })
  Domain?: string

  @Field({ nullable: true })
  EmailHash?: string

  @Field({ nullable: true })
  MessageKey?: string

  @Field(() => AccountSetAsfFlags, { nullable: true })
  SetFlag?: AccountSetAsfFlags

  @Field(() => Int, { nullable: true })
  TransferRate?: number

  @Field(() => Int, { nullable: true })
  TicketSize?: number

  @Field({ nullable: true })
  NFTokenMinter?: string
}

@InterfaceType()
class IAccountDelete extends IBaseTransaction {
  @Field({ defaultValue: 'AccountDelete' })
  TransactionType: 'AccountDelete'

  @Field()
  Destination: string

  @Field(() => Int, { nullable: true })
  DestinationTag?: number
}

@InterfaceType()
class IBaseResponse {
  @Field(() => Int, { nullable: true })
  id?: number

  @Field({ nullable: true, defaultValue: 'response' })
  type?: 'response' | string

  @Field({ nullable: true, defaultValue: 'success' })
  status?: 'success' | string

  @Field({ nullable: true, defaultValue: 'load' })
  warning?: 'load'

  @Field(() => [IResponseWarning])
  warnings?: IResponseWarning[]

  @Field(() => Boolean, { nullable: true })
  forwarded?: boolean

  @Field(() => Int, { nullable: true })
  api_version?: number
}

@InterfaceType()
class IResultParams {
  @Field()
  hash: string

  @Field(() => Int, { nullable: true })
  ledger_index?: number

  @Field(() => ITransactionMetadata, { nullable: true })
  meta?: ITransactionMetadata

  @Field(() => Boolean, { nullable: true })
  validated?: boolean

  @Field(() => Int, { nullable: true })
  date?: number
}

@ObjectType()
class IResultPayment extends IntersectionType(IResultParams, IPayment) {}

@ObjectType()
class IResultPaymentTx extends IntersectionType(IResultParams, IPayment) {
  @Field(() => Int, { nullable: true })
  inLedger?: number
}

@ObjectType()
class IResultAccountInfo {
  @Field(() => IAccountData)
  account_data: IAccountData

  @Field(() => IAccountFlags)
  account_flags: IAccountFlags

  @Field(() => Int)
  ledger_current_index: number

  @Field(() => Boolean, { nullable: true })
  validated?: boolean
}

@ObjectType()
class IResultAccountCurrencies {
  @Field(() => Int)
  ledger_current_index: number

  @Field(() => [String])
  receive_currencies: string[]

  @Field(() => [String])
  send_currencies: string[]

  @Field(() => Boolean, { nullable: true })
  validated?: boolean
}

@ObjectType()
class IResultAccountTxTransaction {
  @Field(() => ITransactionMetadata, { nullable: true })
  meta?: ITransactionMetadata

  @Field(() => IResultPayment, { nullable: true })
  tx?: IResultPayment

  @Field(() => Boolean, { nullable: true })
  validated?: boolean
}

@ObjectType()
class IResultAccountTransactions {
  @Field()
  account: string

  @Field(() => Int)
  ledger_index_max: number

  @Field(() => Int)
  ledger_index_min: number

  @Field(() => Int)
  limit: number

  @Field(() => [IResultAccountTxTransaction])
  transactions: IResultAccountTxTransaction[]

  @Field(() => Boolean, { nullable: true })
  validated?: boolean
}

@ObjectType()
class IResultAccountSet extends IntersectionType(IResultParams, IAccountSet) {
  @Field(() => Int, { nullable: true })
  inLedger?: number
}

@ObjectType()
class IResultAccountDelete extends IntersectionType(IResultParams, IAccountDelete) {
  @Field(() => Int, { nullable: true })
  inLedger?: number
}

@InterfaceType()
class SendXrpTxResponse extends IBaseResponse {
  @Field(() => IResultPayment)
  result: IResultPayment
}

@ObjectType()
class TransactionParams {
  @Field()
  account: string

  @Field()
  destination: string

  @Field({ nullable: true })
  amount?: string

  @Field({ nullable: true })
  currency?: string

  @Field()
  hash: string

  @Field({ nullable: true })
  message?: string
}

@InterfaceType()
class TxResponse extends IBaseResponse {
  @Field(() => IResultPaymentTx, { nullable: true })
  result?: IResultPaymentTx
}

@ObjectType()
export class AccountInfoTxResponse extends IBaseResponse {
  @Field(() => IResultAccountInfo)
  result: IResultAccountInfo
}

@ObjectType()
export class AccountCurrenciesTxResponse extends IBaseResponse {
  @Field(() => IResultAccountCurrencies)
  result: IResultAccountCurrencies
}

@ObjectType()
export class AccountTransactionsTxResponse extends IBaseResponse {
  @Field(() => IResultAccountTransactions)
  result: IResultAccountTransactions
}

@InterfaceType()
export class AccountDeleteTxResponse extends IBaseResponse {
  @Field(() => IResultAccountDelete, { nullable: true })
  result?: IResultAccountDelete
}

@InterfaceType()
export class AccountSetTxResponse extends IBaseResponse {
  @Field(() => IResultAccountSet, { nullable: true })
  result?: IResultAccountSet
}

@ObjectType()
export class Transaction extends TxResponse {}

@InputType()
export class SendXrpInput {
  @Field()
  seed: string

  @Field()
  destination: string

  @Field(() => Float, { nullable: true })
  amount: number
}

@ObjectType()
export class SendXrp extends SendXrpTxResponse {
  @Field(() => Boolean, { nullable: true })
  searched_all?: boolean
}

@ObjectType()
export class MonitorTransactions {
  @Field(() => TransactionParams, { nullable: true })
  transaction?: TransactionParams

  @Field({ nullable: true })
  error?: string
}

@ObjectType()
@InputType('MonitorTransactionsInput')
export class MonitorTransactionsInput {
  @Field(() => [String])
  wallets: string[]
}
