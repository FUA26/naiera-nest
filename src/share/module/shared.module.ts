import { Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import appConfig from 'src/configs/app/app.config';
import { PrismaModule } from './prisma/prisma.module';
import authConfig from 'src/configs/app/auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig],
      envFilePath: ['.env'],
    }),
    LoggerModule,
    PrismaModule,
  ],
  exports: [LoggerModule, ConfigModule, PrismaModule],
})
export class SharedModule {}
