import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Auth } from './entities/auth.entity';
import { Model } from 'mongoose';
import { CreateAuthDto } from './dto/create-auth.dto';



@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Auth.name) private AuthModel: Model<Auth>
  ) {}

  async create(createAuthDto: CreateAuthDto){
    const {name, email, password } = createAuthDto;
    try{
      const userExist = await this.AuthModel.findOne({email})
      if(!userExist){
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        this.AuthModel.create({name, email, password: hashedPassword });
        return {msg:'Signup Successfully'}
      }
      else{
        return {msg:'User already exists'}
      } 
      }
      catch(error){
            throw new InternalServerErrorException();
      }
    
     
  }

  findOne(data:object) {
    return this.AuthModel.findOne(data)
  }

  async signIn(
    createAuthDto: CreateAuthDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = createAuthDto;
    const userObj = {email}
    const user = await this.AuthModel.findOne(userObj);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { id: user._id ,email:user.email};
      const accessToken: string = await this.jwtService.signAsync(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}