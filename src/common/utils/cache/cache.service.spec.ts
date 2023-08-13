import { Test, TestingModule } from '@nestjs/testing'
import { CacheService } from './cache.service'
import { CLIENT } from '../../constants'
import { CACHE_MANAGER } from '@nestjs/cache-manager'

describe('CacheService', () => {
  let service: CacheService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CacheService, { provide: CLIENT, useValue: {} }, { provide: CACHE_MANAGER, useValue: {} }]
    }).compile()

    service = module.get<CacheService>(CacheService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
