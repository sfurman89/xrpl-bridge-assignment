import { Field, InputType, Int, IntersectionType, ObjectType, registerEnumType } from '@nestjs/graphql'
import { AccountSetAsfFlags, ECDSA, Wallet as XrplWallet } from 'xrpl'
import {
  AccountCurrenciesTxResponse,
  AccountDeleteTxResponse,
  AccountInfoTxResponse,
  AccountSetTxResponse,
  AccountTransactionsTxResponse,
  IMemo,
  ISigner
} from '../transaction/transaction.entity'

export enum LedgerIndexType {
  validated = 'validated',
  closed = 'closed',
  current = 'current'
}

registerEnumType(ECDSA, {
  name: 'ECDSA'
})

registerEnumType(LedgerIndexType, {
  name: 'LedgerIndexType'
})

registerEnumType(AccountSetAsfFlags, {
  name: 'AccountSetAsfFlags'
})

@InputType()
export class WalletOptsInput {
  @Field({ nullable: true })
  masterAddress?: string

  @Field(() => ECDSA, { nullable: true })
  algorithm?: ECDSA
}

@ObjectType()
export class Wallet extends XrplWallet {
  @Field()
  publicKey: string

  @Field()
  privateKey: string

  @Field()
  classicAddress: string

  @Field({ nullable: true })
  seed?: string
}

@InputType()
export class XrpBalanceOptsInput {
  @Field({ nullable: true })
  ledger_hash?: string

  @Field(() => LedgerIndexType, { nullable: true })
  ledger_index?: LedgerIndexType
}

@InputType()
export class BalanceOpts {
  @Field({ nullable: true })
  peer?: string

  @Field(() => Int, { nullable: true })
  limit?: number
}

@InputType()
export class BalanceOptsInput extends IntersectionType(XrpBalanceOptsInput, BalanceOpts) {}

@ObjectType()
export class Balance {
  @Field()
  value: string

  @Field()
  currency: string

  @Field({ nullable: true })
  issuer?: string
}

@InputType()
export class AccountInfoInput {
  @Field()
  account: string

  @Field(() => Int, { nullable: true })
  api_version?: number

  @Field(() => Int, { nullable: true })
  id?: number

  @Field({ nullable: true })
  ledger_hash?: string

  @Field(() => LedgerIndexType, { nullable: true })
  ledger_index?: LedgerIndexType

  @Field(() => Boolean, { nullable: true })
  queue?: boolean

  @Field(() => Boolean, { nullable: true })
  signer_lists?: boolean

  @Field(() => Boolean, { nullable: true })
  strict?: boolean
}

@ObjectType()
export class AccountInfo extends AccountInfoTxResponse {}

@InputType()
export class AccountCurrenciesInput {
  @Field()
  account: string

  @Field(() => Int, { nullable: true })
  api_version?: number

  @Field(() => Int, { nullable: true })
  id?: number

  @Field({ nullable: true })
  ledger_hash?: string

  @Field(() => LedgerIndexType, { nullable: true })
  ledger_index?: LedgerIndexType

  @Field(() => Boolean, { nullable: true })
  strict?: boolean
}

@ObjectType()
export class AccountCurrencies extends AccountCurrenciesTxResponse {}

@InputType()
export class AccountTransactionsInput {
  @Field()
  account: string

  @Field(() => Int, { nullable: true })
  api_version?: number

  @Field(() => Boolean, { nullable: true })
  binary?: boolean

  @Field(() => Boolean, { nullable: true })
  forward?: boolean

  @Field(() => Int, { nullable: true })
  id?: number

  @Field({ nullable: true })
  ledger_hash?: string

  @Field(() => LedgerIndexType, { nullable: true })
  ledger_index?: LedgerIndexType

  @Field(() => Int, { nullable: true })
  ledger_index_max?: number

  @Field(() => Int, { nullable: true })
  ledger_index_min?: number

  @Field(() => Int, { nullable: true })
  limit?: number
}

@ObjectType()
export class AccountTransactions extends AccountTransactionsTxResponse {}

@ObjectType()
export class CreateAccount {
  @Field()
  wallet: Wallet

  @Field(() => Int)
  balance: number
}

@ObjectType()
@InputType({ description: 'Modifies the properties of an account in the XRP Ledger.' })
export class UpdateAccountInput {
  @Field()
  seed: string

  @Field({ nullable: true })
  AccountTxnID?: string

  @Field(() => Int, { nullable: true })
  ClearFlag?: number

  @Field({ nullable: true })
  Domain?: string

  @Field({ nullable: true })
  EmailHash?: string

  @Field({ nullable: true })
  Fee?: string

  @Field(() => Int, { nullable: true })
  Flags?: number

  @Field(() => Int, { nullable: true })
  LastLedgerSequence?: number

  @Field(() => [IMemo], { nullable: true })
  Memos?: IMemo[]

  @Field({ nullable: true })
  MessageKey?: string

  @Field({ nullable: true })
  NFTokenMinter?: string

  @Field(() => Int, { nullable: true })
  NetworkID?: number

  @Field(() => Int, { nullable: true })
  Sequence?: number

  @Field(() => AccountSetAsfFlags, { nullable: true })
  SetFlag?: AccountSetAsfFlags

  @Field(() => [ISigner], { nullable: true })
  Signers?: ISigner[]

  @Field({ nullable: true })
  SigningPubKey?: string

  @Field(() => Int, { nullable: true })
  SourceTag?: number

  @Field(() => Int, { nullable: true })
  TicketSize?: number

  @Field(() => Int, { nullable: true })
  TicketSequence?: number

  @Field(() => Int, { nullable: true })
  TransferRate?: number

  @Field({ nullable: true })
  TxnSignature?: string
}

@ObjectType()
export class UpdateAccount extends AccountSetTxResponse {}

@InputType({ description: 'Deletes an account and any objects it owns in the XRP Ledger.' })
export class DeleteAccountInput {
  @Field()
  seed: string

  @Field()
  destination: string
}

@ObjectType()
export class DeleteAccount extends AccountDeleteTxResponse {}
