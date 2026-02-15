import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { argon2id, hash, verify } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { jwtPayload } from './interfaces/jwt.inteface';
import ms, { StringValue } from 'ms';
import { User } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { isDev } from 'src/shared/utils/is-dev.util';

@Injectable()
export class AuthService {
  private readonly jwtAccessToken: number;
  private readonly jwtRefreshToken: number;
  private readonly cookieDomain: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    const accessRow = this.configService.getOrThrow<string>(
      'JWT_ACCESS_TOKEN',
    ) as StringValue;
    const refreshRow = this.configService.getOrThrow<string>(
      'JWT_REFRESH_TOKEN',
    ) as StringValue;
    const cookieDomain = this.configService.get<string>('COOKIE_DOMAIN');
    if (cookieDomain) this.cookieDomain = cookieDomain;

    this.jwtAccessToken = ms(accessRow) / 1000;
    this.jwtRefreshToken = ms(refreshRow) / 1000;
  }
  private async checkUserByEmail(
    email: string,
    validator?: (user: User | null) => void,
  ): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (validator) validator(user);
    return user;
  }

  async login(res: Response, dto: LoginDto) {
    const { email, password } = dto;
    const user = (await this.checkUserByEmail(email, (user) => {
      if (!user) throw new NotFoundException('Invalid email or password');
    })) as User;
    const isPasswordValid = await verify(user.password, password);
    if (!isPasswordValid)
      throw new NotFoundException('Invalid email or password');
    return this.auth(user.id, res);
  }

  logout(res: Response) {
    this.clearRefreshCookie(res);
    return { message: 'Logged out successfully' };
  }

  async register(res: Response, dto: RegisterDto) {
    const { email, password, name } = dto;
    await this.checkUserByEmail(email, (user) => {
      if (user)
        throw new ConflictException('User with this email already exists');
    });
    const user = await this.prisma.user.create({
      data: {
        email,
        password: await hash(password, { type: argon2id }),
        name,
      },
    });
    return this.auth(user.id, res);
  }
  async refresh(refreshToken: string, res: Response) {
    try {
      const payload =
        await this.jwtService.verifyAsync<jwtPayload>(refreshToken);

      if (payload.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true },
      });

      if (!user) throw new Error('User not found');
      return this.auth(user.id, res);
    } catch (e) {
      console.error('Error refreshing token:', e);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private auth(userId: string, res: Response) {
    const { accessToken, refreshToken } = this.generateToken(userId);
    const refreshTokenExpires = new Date(
      Date.now() + this.jwtRefreshToken * 1000,
    );
    this.setCookie(res, refreshToken, refreshTokenExpires);
    return { accessToken };
  }

  private generateToken(id: string) {
    const payload = { sub: id };
    const accessToken = this.jwtService.sign(
      { ...payload, type: 'access' as const },
      {
        expiresIn: this.jwtAccessToken,
      },
    );
    const refreshToken = this.jwtService.sign(
      { ...payload, type: 'refresh' as const },
      {
        expiresIn: this.jwtRefreshToken,
      },
    );

    return { accessToken, refreshToken };
  }

  private setCookie(res: Response, value: string, expires: Date) {
    const isDevEnv = isDev(this.configService);
    res.cookie('refreshToken', value, {
      httpOnly: true,
      secure: !isDevEnv,
      sameSite: isDevEnv ? 'none' : 'lax',
      expires,
    });
  }

  private clearRefreshCookie(res: Response) {
    const isDevEnv = isDev(this.configService);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: !isDevEnv,
      sameSite: isDevEnv ? 'none' : 'lax',
    });
  }
}
