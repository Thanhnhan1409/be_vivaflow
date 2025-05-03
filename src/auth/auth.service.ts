import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma, user } from '@prisma/client';
import * as argon from 'argon2';
import { pick } from 'lodash';
import { ErrorMessages, PlainToInstance } from 'src/helpers';
import { PrismaService } from 'src/prisma/prisma.service';

import { LoginDto, RefreshTokenDto, RegisterDto } from './dto/req.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  private readonly jwtSecret = this.config.get('JWT_SECRET');

  async register(dto: RegisterDto) {
    const hashedPassword = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          pwdHash: hashedPassword,
          profile: {
            create: {
              firstName: dto.firstName,
              lastName: dto.lastName,
            },
          },
        },
      });

      return this.signToken(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user)
      throw new ForbiddenException(ErrorMessages.AUTH.CREDENTIALS_INCORRECT);

    const passwordMatches = await argon.verify(user.pwdHash, dto.password);

    if (!passwordMatches)
      throw new ForbiddenException(ErrorMessages.AUTH.CREDENTIALS_INCORRECT);

    return this.signToken(user);
  }

  // async resetPasswordRequest(dto: RequestResetPasswordDto): Promise<void> {
  //   const resetToken = genRandomString(10);

  //   const user = await this.prisma.user.findFirst({
  //     where: {
  //       email: dto.email,
  //     },
  //   });

  //   if (!user) return;

  //   await this.prisma.user.update({
  //     data: {
  //       resetToken: resetToken,
  //     },
  //     where: {
  //       email: dto.email,
  //     },
  //   });

  //   await this.mailService.sendResetPasswordEmail(
  //     {
  //       email: user.email,
  //       name: user.name,
  //     },
  //     resetToken,
  //   );
  // }

  // async resetPassword(dto: ResetPasswordDto): Promise<void> {
  //   if (!dto.token)
  //     throw new BadRequestException(ErrorMessages.AUTH.INVALID_TOKEN);

  //   const user = await this.prisma.user.findFirst({
  //     where: {
  //       resetToken: dto.token,
  //     },
  //   });

  //   if (!user) throw new BadRequestException(ErrorMessages.AUTH.INVALID_TOKEN);

  //   const hashedPassword = await argon.hash(dto.password);

  //   await this.prisma.user.update({
  //     data: {
  //       password: hashedPassword,
  //       resetToken: null,
  //     },
  //     where: {
  //       email: user.email,
  //     },
  //   });
  // }

  async signToken(
    user: user,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const pickedFields: string[] = ['id', 'email', 'name', 'role', 'username'];
    const payload = pick(user, pickedFields);

    const accessToken: string = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: this.jwtSecret,
    });

    const refreshToken: string = await this.jwt.signAsync(payload, {
      expiresIn: '30d',
      secret: this.jwtSecret,
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    const payload = await this.jwt.verify(dto.refreshToken, {
      secret: this.jwtSecret,
    });

    delete payload.iat;
    delete payload.exp;

    const accessToken: string = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: this.jwtSecret,
    });

    return {
      accessToken: accessToken,
    };
  }

  async getMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        username: true,
        pwdHash: false,
      },
    });

    return PlainToInstance(User, user);
  }
}
