import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';


// export type AuthsDocument = HydratedDocument<Auth>;
@Schema({ timestamps: true })
export class Auth extends Document {
  @Prop({
    type: String,
    default: function genUUID() {
      return uuidv4();
    },
  })
  _id: string;

  @Prop()
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;
}
export const AuthSchema = SchemaFactory.createForClass(Auth);
