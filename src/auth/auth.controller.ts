import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { Public } from './decorators/auth-public.decorator';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login/oauth')
  signUpWithOAuth(@Body() signInDto: Omit<SignUpDto, 'password'>) {
    return this.authService.signInWithOAuth(signInDto.email, signInDto.name);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(
      signUpDto.email,
      signUpDto.name,
      signUpDto.password,
    );
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('/')
  auth(@Req() request: Request) {
    return this.authService.auth(
      request?.headers?.authorization?.split(' ')[1],
    );
  }
}
