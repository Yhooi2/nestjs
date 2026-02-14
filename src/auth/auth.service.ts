import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { argon2id, hash, verify } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { jwtPayload } from './interfaces/jwt.inteface';
import ms, { StringValue } from 'ms';
import { User } from '@prisma/client';
import { LoginDto } from './dto/login.dto';

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
  private async chekUserByEmail(
    email: string,
    validator?: (user: User | null) => void,
  ): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (validator) validator(user);
    return user;
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;
    const user = (await this.chekUserByEmail(email, (user) => {
      if (!user) throw new NotFoundException('Invalid email or password');
    })) as User;
    const isPasswordValid = await verify(user.password, password);
    if (!isPasswordValid)
      throw new NotFoundException('Invalid email or password');
    return this.generateToken(user.id);
  }

  async register(dto: RegisterDto) {
    const { email, password, name } = dto;
    await this.chekUserByEmail(email, (user) => {
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
