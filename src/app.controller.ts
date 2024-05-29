import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AppLogger } from './share/module/logger/logger.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext('App');
  }

  @Get()
  getHello(): string {
    this.logger.info('Ini Log WinstonModule');

    return this.appService.getHello();
  }
}
