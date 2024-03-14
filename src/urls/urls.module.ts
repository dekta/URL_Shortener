import { Module } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Url, UrlSchema } from './urls.entity';
import { UrlsController } from './urls.controller';
import { RedisModule } from '@nestjs-modules/ioredis';
import Env from 'src/utils/env';

@Module({
  imports:[MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]), RedisModule.forRoot({
      type: 'single',
      url: Env.redis.redis_server,
    }),
  ],
  providers: [UrlsService],
  controllers: [UrlsController]
})
export class UrlsModule {}
