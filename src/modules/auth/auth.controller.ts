import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
import { Cookie } from 'src/shared/decorators/cookies.decorator';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthResponse } from './dto/respons.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Register a new user',
    description: 'Create a new user account with the provided information.',
  })
  @ApiOkResponse({
    description: 'The user has been successfully registered.',
    type: AuthResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data. Please check the provided information.',
  })
  @ApiConflictResponse({
    description: 'The email is already in use or invalid data provided.',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: RegisterDto,
  ) {
    return await this.authService.register(res, dto);
  }

  @ApiOperation({
    summary: 'User login',
    description:
      'Authenticate a user with their email and password, and receive access and refresh tokens.',
  })
  @ApiOkResponse({
    description: 'The user has been successfully registered.',
    type: AuthResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data. Please check the provided information.',
  })
  @ApiNotFoundResponse({
    description: 'Invalid email or password',
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginDto,
  ) {
    return await this.authService.login(res, dto);
  }

  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Obtain a new access token using a valid refresh token.',
  })
  @ApiOkResponse({
    description: 'A new access token has been successfully generated.',
    type: AuthResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired refresh token. Please log in again.',
  })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(
    @Cookie('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.refresh(refreshToken, res);
  }

  @ApiOperation({
    summary: 'User logout',
    description: 'Log out the user by clearing the authentication cookies.',
  })
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
