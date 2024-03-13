import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlsModule } from './urls/urls.module';
import { MongooseModule } from '@nestjs/mongoose';
import Env from './utils/env';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import AuthGuard from './auth/auth.guard';

@Module({
  imports: [MongooseModule.forRoot(Env.database.mongo_url),UrlsModule,ScheduleModule.forRoot(), AuthModule],
  controllers: [AppController],
  providers: [AppService,{
      provide: APP_GUARD,
      useClass: AuthGuard,
    }],
    
})
export class AppModule {}
