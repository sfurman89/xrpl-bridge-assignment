import { Test, TestingModule } from '@nestjs/testing'
import { AccountService } from './account.service'
import { CacheService } from '../../common/utils/cache/cache.service'
import { HelperService } from '../../common/helpers/helper/helper.service'
import { CLIENT, WEBSOCKET } from '../../common/constants'

describe('AccountService', () => {
  let service: AccountService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        { provide: CLIENT, useValue: {} },
        { provide: WEBSOCKET, useValue: {} },
        { provide: CacheService, useValue: {} },
        { provide: HelperService, useValue: {} }
      ]
    }).compile()

    service = module.get<AccountService>(AccountService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
