import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import  { Model, Promise } from 'mongoose';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Auth } from './entities/auth.entity';
import { isUndefined } from 'util';

describe('AuthService', () => {
  let authService: AuthService;
  let model: Model<Auth>;
  let jwtService:JwtService

  const mockUser = {
    _id: '61c0ccf11d7bf83d153d7c06',
    name: 'abc',
    email: 'abc@gmail.com',
    password:"abc123"
  };

 let token = 'jwtToken';
  const mockAuthService = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getModelToken(Auth.name),
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    model = module.get<Model<Auth>>(getModelToken(Auth.name));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined',()=>{
    expect(authService).toBeDefined()
  })

  describe('create',()=>{
    const signUpDto = {
        name: 'abc',
        email: 'abc@gmail.com',
        password:"abc123"
    };
    it('should register the new user',async()=>{
        jest.spyOn(bcrypt,'genSalt').mockResolvedValue('salt')
        jest.spyOn(bcrypt,'hash').mockResolvedValue('hashedPassword')
        jest.spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockUser));
        const result = await authService.create(signUpDto);
        expect(bcrypt.hash).toHaveBeenCalled();
        expect(result).toEqual({ msg:'Signup Successfully' });
    })
    it('should throw internal server error', async () => {
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.reject({ code: 500}));

      await expect(authService.create(signUpDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  })

  describe('signIn', () => {
    const loginDto = {
      email: 'abc@gmail.com',
      password: 'abc123',
    };

    it('should login user and return the token', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);
      const result = await authService.signIn(loginDto);

      expect(result).toEqual({ token });
    });

    it('should throw invalid email error', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(null);

      expect(authService.signIn(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw invalid password error', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

      expect(authService.signIn(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
  

});