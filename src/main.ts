import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { GlobalExceptionFilter } from './common/filters/global-exception.filter'
import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TransformationInterceptor } from './common/interceptors/transformation.interceptor'
import { Reflector } from '@nestjs/core'

let app: INestApplication<any>

async function bootstrap() {
  app = await NestFactory.create(AppModule)
  app.enableShutdownHooks()
  app.useGlobalInterceptors(new TransformationInterceptor(new Reflector()))
  app.useGlobalFilters(new GlobalExceptionFilter(new ConfigService()))
  await app.listen(3000)
}
bootstrap()

export const getAppInstance = () => app
