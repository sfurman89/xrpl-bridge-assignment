import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AccountService } from './account.service'
import {
  Balance,
  CreateAccount,
  BalanceOptsInput,
  WalletOptsInput,
  XrpBalanceOptsInput,
  Wallet,
  DeleteAccountInput,
  UpdateAccountInput,
  DeleteAccount,
  UpdateAccount,
  AccountInfoInput,
  AccountInfo,
  AccountCurrenciesInput,
  AccountCurrencies,
  AccountTransactions,
  AccountTransactionsInput
} from './account.entity'

@Resolver()
export class AccountResolver {
  constructor(private readonly _accountService: AccountService) {}

  @Query(() => Wallet)
  getWallet(@Args('seed') seed: string, @Args('opts', { nullable: true }) opts?: WalletOptsInput): Promise<Wallet> {
    return this._accountService.getWallet(seed, opts)
  }

  @Query(() => String)
  getXrpBalance(
    @Args('account') account: string,
    @Args('opts', { nullable: true }) opts?: XrpBalanceOptsInput
  ): Promise<string> {
    return this._accountService.getXrpBalance(account, opts)
  }

  @Query(() => [Balance])
  getBalances(
    @Args('account') account: string,
    @Args('opts', { nullable: true }) opts?: BalanceOptsInput
  ): Promise<Balance[]> {
    return this._accountService.getBalances(account, opts)
  }

  @Query(() => AccountInfo)
  getAccountInfo(@Args('input') args: AccountInfoInput): Promise<AccountInfo> {
    return this._accountService.getAccountInfo(args)
  }

  @Query(() => AccountCurrencies)
  getAccountCurrencies(@Args('input') args: AccountCurrenciesInput): Promise<AccountCurrencies> {
    return this._accountService.getAccountCurrencies(args)
  }

  @Query(() => AccountTransactions)
  getAccountTransactions(@Args('input') args: AccountTransactionsInput): Promise<AccountTransactions> {
    return this._accountService.getAccountTransactions(args)
  }

  @Mutation(() => CreateAccount)
  createAccount(): Promise<CreateAccount> {
    return this._accountService.createAccount()
  }

  @Mutation(() => UpdateAccount)
  updateAccount(@Args('input') args: UpdateAccountInput): Promise<UpdateAccount> {
    return this._accountService.updateAccount(args)
  }

  @Mutation(() => DeleteAccount)
  deleteAccount(@Args('input') args: DeleteAccountInput): Promise<DeleteAccount> {
    return this._accountService.deleteAccount(args)
  }
}
