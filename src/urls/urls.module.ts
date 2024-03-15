import { Module } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Url, UrlSchema } from './urls.entity';
import { UrlsController } from './urls.controller';
import { RedisModule } from '@nestjs-modules/ioredis';
import Env from 'src/utils/env';

@Module({
  imports:[
    RedisModule.forRoot({
      type: 'single',
      url: Env.redis.redis_server,
    }),
    MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]),  
  ],
  providers: [UrlsService],
  controllers: [UrlsController],
  exports:[UrlsService]
})
export class UrlsModule {}
