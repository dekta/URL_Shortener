import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UrlsDocument = HydratedDocument<Url>;
@Schema({ timestamps: true })
export class Url {
    @Prop()
    urlCode: string;

    @Prop()
    longUrl: string;

    @Prop()
    shortUrl: string;

    @Prop({default:0})
    clicks: number;

}
export const UrlSchema = SchemaFactory.createForClass(Url);
