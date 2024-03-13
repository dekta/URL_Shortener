import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type AuthsDocument = HydratedDocument<Auth>;
@Schema({ timestamps: true })
export class Auth {
  @Prop()
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;
}
export const AuthSchema = SchemaFactory.createForClass(Auth);
