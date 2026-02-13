import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { argon2id, hash } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { jwtPayload } from './interfaces/jwt.inteface';
import ms, { StringValue } from 'ms';

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;
  private readonly jwtAccessToken: number;
  private readonly jwtRefreshToken: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.jwtSecret = this.configService.getOrThrow<string>('JWT_SECRET');

    const accessRow = this.configService.getOrThrow<string>(
      'JWT_ACCESS_TOKEN',
    ) as StringValue;
    const refreshRow = this.configService.getOrThrow<string>(
      'JWT_REFRESH_TOKEN',
    ) as StringValue;

    this.jwtAccessToken = ms(accessRow) / 1000;
    this.jwtRefreshToken = ms(refreshRow) / 1000;
  }

  async register(dto: RegisterDto) {
    const { email, password, name } = dto;
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const user = await this.prisma.user.create({
      data: {
        email,
        password: await hash(password, { type: argon2id }),
        name,
      },
    });
    return this.generateToken(user.id);
  }

  private generateToken(id: string) {
    const payload: jwtPayload = { sub: id };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.jwtAccessToken,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.jwtRefreshToken,
    });

    return { accessToken, refreshToken };
  }
}
