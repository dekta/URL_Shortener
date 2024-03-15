import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import Env from 'src/utils/env';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from './entities/auth.entity';

@Module({
  imports:[JwtModule.register({
      global: true,
      secret: Env.jwt.crypt_salt,
      signOptions: { expiresIn: String(Env.jwt.expiry) },
    }),
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }])
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
