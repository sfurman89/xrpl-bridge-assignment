import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { TransactionResolver } from './transaction.resolver'
import { TransactionService } from './transaction.service'
import { PubSub } from 'graphql-subscriptions'
import { AccountService } from '../account/account.service'
import { CacheService } from '../../common/utils/cache/cache.service'
import { HelperService } from '../../common/helpers/helper/helper.service'
import { CLIENT, TRANSACTION, WEBSOCKET } from '../../common/constants'

describe('TransactionResolver', () => {
  let resolver: TransactionResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionResolver,
        TransactionService,
        { provide: CLIENT, useValue: {} },
        { provide: WEBSOCKET, useValue: {} },
        { provide: getModelToken(TRANSACTION), useValue: {} },
        { provide: AccountService, useValue: {} },
        { provide: CacheService, useValue: {} },
        { provide: HelperService, useValue: {} },
        { provide: PubSub, useValue: {} }
      ]
    }).compile()

    resolver = module.get<TransactionResolver>(TransactionResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
