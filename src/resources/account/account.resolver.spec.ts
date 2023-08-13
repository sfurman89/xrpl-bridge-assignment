import { Test, TestingModule } from '@nestjs/testing'
import { AccountResolver } from './account.resolver'
import { AccountService } from './account.service'
import { CacheService } from '../../common/utils/cache/cache.service'
import { HelperService } from '../../common/helpers/helper/helper.service'
import { CLIENT, WEBSOCKET } from '../../common/constants'

describe('AccountResolver', () => {
  let resolver: AccountResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountResolver,
        AccountService,
        { provide: CLIENT, useValue: {} },
        { provide: WEBSOCKET, useValue: {} },
        { provide: CacheService, useValue: {} },
        { provide: HelperService, useValue: {} }
      ]
    }).compile()

    resolver = module.get<AccountResolver>(AccountResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})

// const gql = '/graphql'
// describe('getWallet', () => {
//   let app: INestApplication
//
//   beforeAll(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule]
//     }).compile()
//
//     app = moduleFixture.createNestApplication()
//     await app.init()
//   })
//
//   afterAll(async () => {
//     await app.close()
//   })
//
//   describe(gql, () => {
//     describe('query', () => {
//       it('should get the wallet data', () => {
//         return request(app.getHttpServer())
//           .post(gql)
//           .send({ query: '{ getWallet(seed:"sEdSz4MVw1PkgHpTVfsP28LZp5eCY9V") {publicKey privateKey classicAddress}}' })
//           .expect(200)
//           .expect(res => {
//             console.log(res, 'RES')
//             expect(res.body.data.getWallet).toBeUndefined()
//           })
//       })
//     })
//   })
// })
