import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UrlsDocument = HydratedDocument<Url>;

class Link_Stats {
    @Prop({default:'unknown'})
    referral_source: string;

    @Prop({default:'unknown'})
    browser: string;

    @Prop({default:'unknown'})
    device : string;

    @Prop({default:'unknown'})
    os : string;

    @Prop()
    clickedAt : Date;
}

@Schema({ timestamps: true })
export class Url {
    @Prop()
    userId: string;

    @Prop()
    urlCode: string;

    @Prop()
    longUrl: string;

    @Prop()
    shortUrl: string;

    @Prop({default:0})
    clicks: number;

    @Prop({type:Array<object>})
    urlStats:Array<object>
   
}
export const UrlSchema = SchemaFactory.createForClass(Url);
