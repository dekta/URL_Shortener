import { Body, Controller, Get, Header, Param, Post, Res } from '@nestjs/common';
import { UrlsService } from './urls.service';
import CreateUrlDto from './dto/create-urls.dto';
import { Response } from 'express';

@Controller('urls')
export class UrlsController {
    constructor(
    private readonly urlsService: UrlsService,
  ) {}
    
    @Post('/shorturl')
    async shortUrl(@Body()createUrlDto:CreateUrlDto){
        const url = await this.urlsService.createUrl(createUrlDto)
        if(url){
            return url
        }
        return {message:"some error occured"}
    }

    @Get('/:urlCode')
    async redirectUrl(@Param('urlCode')urlCode:string ,  @Res() res: Response){
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        const url = await this.urlsService.getUrl(urlCode)
        if(url){
           return res.redirect(301, url);
        }
        else{
            return res.status(404).send('URL not found');
        }
    }
}
