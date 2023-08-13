import { Controller, Get } from '@nestjs/common'
import { Redirect } from './common/decorators/redirect.decorator'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly _appService: AppService) {}

  @Get()
  @Redirect({ useDefault: true })
  getHello(): string {
    return this._appService.getHello()
  }
}
