import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/utils/decorators/public';
import { CreateAuthDto } from './dto/create-auth.dto';



@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/signup')
  signUp(@Body() createAuthDto: CreateAuthDto){
    return this.authService.create(createAuthDto);
  }

  @Public()
  @Post('/login')
  signIn(
    @Body() createAuthDto: CreateAuthDto,
  ){
    return this.authService.signIn(createAuthDto);
  }
}