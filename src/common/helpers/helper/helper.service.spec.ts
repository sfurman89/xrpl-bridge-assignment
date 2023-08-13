import { Test, TestingModule } from '@nestjs/testing'
import { HelperService } from './helper.service'
import { HelperModule } from './helper.module'

describe('HelperService', () => {
  let service: HelperService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HelperModule],
      providers: [HelperService]
    }).compile()

    service = module.get<HelperService>(HelperService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
