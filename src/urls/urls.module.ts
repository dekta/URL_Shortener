import { Module } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Url, UrlSchema } from './urls.entity';
import { UrlsController } from './urls.controller';

@Module({
  imports:[MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]),],
  providers: [UrlsService],
  controllers: [UrlsController]
})
export class UrlsModule {}
