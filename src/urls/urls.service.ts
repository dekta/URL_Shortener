import {Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Url, UrlsDocument } from './urls.entity';
import { Model } from 'mongoose';
import CreateUrlDto from './dto/create-urls.dto';
import Env from 'src/utils/env';
import ShortUniqueId from 'short-unique-id';
import { isUrl } from 'src/utils/check-url-validation';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EXPIRATION_PERIOD_IN_DAYS } from 'src/utils/constants';

@Injectable()
export class UrlsService {
    constructor(
    @InjectModel(Url.name) private readonly urlModel: Model<UrlsDocument>,
  ) {}

   async getUrl(urlCode:string){
        const url = await this.urlModel.findOneAndUpdate(
            { urlCode: urlCode },
            { $inc: { clicks: 1 } },
            { new: true } 
        );
       if(url){
            return url.longUrl
       }
       else{
            return null
       }
    }
  
    async createUrl(createUrlDto: CreateUrlDto){
        const {longUrl} = createUrlDto
        const baseUrl = Env.baseurl.url
        if(!isUrl(baseUrl)){
            return {message:"Invalid base url"}
        }
        const uid = new ShortUniqueId({ length: 10 });
        const urlCode = uid.rnd()
        if(!isUrl(longUrl)){
            return {message:"Not valid url"}
        }
        let url = await this.urlModel.findOne({longUrl})
        if(url){
            return url
        }
        else{
            const shortUrl = baseUrl+'/urls/'+urlCode
            return new this.urlModel({
                longUrl,
                shortUrl,
                urlCode,
                date:new Date()
            }).save()
        }

    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async findTasksDueDateApproaching() {
        const currentTime = new Date();
        const IN_time = new Date(currentTime.getTime() + 330 * 60 * 1000);
        const exp_time = new Date(IN_time.setDate(IN_time.getDate()-EXPIRATION_PERIOD_IN_DAYS))
        await this.urlModel.deleteMany({createdAt: { $lt: exp_time } })
    }
}
