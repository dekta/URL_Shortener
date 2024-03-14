import { Body, Controller, Get, Param, Post, Request, Res } from '@nestjs/common';
import { UrlsService } from './urls.service';
import CreateUrlDto from './dto/create-urls.dto';
import { Response } from 'express';
import { Public } from 'src/utils/decorators/public';
import { APIResponse } from 'src/utils/response.util';
import { Throttle } from '@nestjs/throttler';



@Controller('urls')
export class UrlsController {
    constructor(
    private readonly urlsService: UrlsService,
  ) {}
    
    // Api for creating short url
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Post('/shorturl')
    async shortUrl(@Body()createUrlDto:CreateUrlDto,@Request() req){
        try{
            const userId = req.user.id;
            const urlDoc= await this.urlsService.createUrl(userId.toString(),createUrlDto)
            if(urlDoc){
                return APIResponse.create(urlDoc,"short url created",201,true)
            }
            return APIResponse.badRequest("some error occur while creating url",400,false)

        }
        catch(err){
            return APIResponse.internalServerError(err,false)
        }
        
    }

    //Retrieve all short URLs details for a user
    @Get('/allshorturls')
    async getAllShortUrls(@Request() req){
        const userId = req.user.id;
        const query = {userId} 
        const projection={shortUrl:1,longUrl:1,clicks:1,createdAt:1,urlCode:1}
        try{
            const urls = await this.urlsService.findAllUrls(query,projection)
            if(urls){
                const totalUrls = urls.length
                return APIResponse.found({data:urls,totalUrls},"All short urls with details",200,true)
            }
            return APIResponse.notfound("No urls found",404,false)

        }
        catch(err){
            return APIResponse.internalServerError(err,false)
        }
        
    }


    // short url 
    @Public()
    @Get('/:urlCode')
    async redirectUrl(@Param('urlCode')urlCode:string ,  @Res() res: Response ,@Request() req){
        try{
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            const userAgent = req.headers['user-agent']
            const url = await this.urlsService.redirectUrl(urlCode,userAgent)
            if(url){
               return res.redirect(301, url); 
            }
            else{
                return APIResponse.notfound('URL not found',404)
            }
        }
        catch(err){
            return APIResponse.internalServerError(err,false)
        }
        
    }


    // short url analytics
    @Get('/urlstats/:urlCode')
    async getUrlStats(@Request() req, @Param('urlCode')urlCode:string){
        const userId = req.user.id;
        const query = {userId,urlCode} 
        const projection={shortUrl:1,longUrl:1,urlStats:1}
        try{
            const url = await this.urlsService.findUrlStats(query,projection)
            if(url){
                return APIResponse.found(url,"short url stats",200,true)

            }
            return APIResponse.notfound('URL not found',404)

        }
        catch(err){
            return APIResponse.internalServerError(err,false)
        }
       
    }



}
