import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { TransactionService } from './transaction.service'
import { CacheService } from '../../common/utils/cache/cache.service'
import { HelperService } from '../../common/helpers/helper/helper.service'
import { AccountService } from '../account/account.service'
import { PubSub } from 'graphql-subscriptions'
import { CLIENT, TRANSACTION, WEBSOCKET } from '../../common/constants'

describe('TransactionService', () => {
  let service: TransactionService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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

    service = module.get<TransactionService>(TransactionService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
