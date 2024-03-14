import {Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Url, UrlsDocument } from './urls.entity';
import { AnyKeys, FilterQuery, Model } from 'mongoose';
import CreateUrlDto from './dto/create-urls.dto';
import Env from 'src/utils/env';
import ShortUniqueId from 'short-unique-id';
import { isUrl } from 'src/utils/check-url-validation';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EXPIRATION_PERIOD_IN_DAYS, EXPIRATION_TIME_IN_SEC, MAX_CLICKS_TO_CACHE } from 'src/utils/constants';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import DeviceDetector = require("device-detector-js");

@Injectable()
export class UrlsService {
    private readonly deviceDetector = new DeviceDetector();
    constructor(
    @InjectModel(Url.name) private readonly urlModel: Model<UrlsDocument>,
    @InjectRedis() private readonly redis: Redis,
  ) {}
 

   async redirectUrl(urlCode:string,userAgent:any){
        const device = this.deviceDetector.parse(userAgent);
        const cachedUrl = await this.redis.get(urlCode);
        const browser = device.client===null?'Unknown':device.client.name 
        const os = device.os===null?'Unknown':device.os.name 
        const deviceType = device.device===null?'Unknown': device.device.type
        if (cachedUrl) {
            this.updateDocument(urlCode,browser,os,deviceType)
            return cachedUrl;
        }
        const url = await this.urlModel.findOne({ urlCode });
        if(url){
            if(url.clicks>MAX_CLICKS_TO_CACHE){
                await this.redis.set(urlCode,url.longUrl,'EX', EXPIRATION_TIME_IN_SEC)
            }
            this.updateDocument(urlCode,browser,os,deviceType)
            return url.longUrl
       }
       else{
            return null
       }
    }

    async updateDocument(urlCode:string,browser:string,os:string,device:string){
        return await this.urlModel.findOneAndUpdate(
            { urlCode},
            { $inc: { clicks: 1 },$push: { 
                    urlStats: { 
                        device: device, 
                        browser: browser,
                        os:os,
                        clickedAt: new Date() 
                    } 
                } },
            { new: true }  );
    }
  
    async createUrl(userId:string,createUrlDto: CreateUrlDto){
        const {longUrl} = createUrlDto
        const baseUrl = Env.baseurl.url
        if(!isUrl(baseUrl)||!isUrl(longUrl)){
            return null
        }
        const uid = new ShortUniqueId({ length: 10 });
        const urlCode = uid.rnd()
        let url = await this.urlModel.findOne({longUrl})
        if(url){
            return {shortUrl:url.shortUrl,longUrl:url.longUrl}
        }
        else{
            const shortUrl = baseUrl+'/urls/'+urlCode
            this.urlModel.create({
                userId,
                longUrl,
                shortUrl,
                urlCode,
            })
            return {shortUrl,longUrl}
        }
    }

    async findAllUrls(query: FilterQuery<UrlsDocument>, projection: AnyKeys<Url>) {
    const urlsWithDetails = await this.urlModel.aggregate([
        {
            $match: query
        },
        {
            $lookup: {
                from: 'auths', 
                localField: 'userId',
                foreignField:'_id',
                as: 'user'
            }
        },
        {
            $unwind: '$user' 
        },
        {
            $project: {
                ...projection,
                    userName: '$user.name',
                }
            }
        ]);
        return urlsWithDetails;
    }


    async findUrlStats(query: FilterQuery<UrlsDocument>, projection: AnyKeys<Url>){
        const urlDoc = await this.urlModel.findOne(query,projection)
        const stats = urlDoc.urlStats || []
        let weeklyClicked =0
        let monthlyClicked =0
        let dailyClicked=0
        for(let i=0;i<stats.length;i++){
            const clickedDate = stats[i]['clickedAt'].getDate()
            const clickedMonth = stats[i]['clickedAt'].getMonth()+1
            const clickedDay = stats[i]['clickedAt'].getDay()
            const currentTime = new Date();
            const currentDate = currentTime.getDate()
            const currentMonth = currentTime.getMonth()+1
            if(clickedDate===currentDate){
                dailyClicked++
            }
            if(clickedMonth===currentMonth){
                monthlyClicked++
            }
            if(clickedDay>0 && clickedDay<7){
                weeklyClicked++
            }

        }
        return {dailyClicked,weeklyClicked,monthlyClicked,urlInfo:urlDoc}
    }


    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async findTasksDueDateApproaching() {
        const currentTime = new Date();
        const IN_time = new Date(currentTime.getTime() + 330 * 60 * 1000);
        const exp_time = new Date(IN_time.setDate(IN_time.getDate()-EXPIRATION_PERIOD_IN_DAYS))
        await this.urlModel.deleteMany({createdAt: { $lt: exp_time } })
    }
}
