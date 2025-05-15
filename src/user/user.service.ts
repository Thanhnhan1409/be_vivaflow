import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthData } from 'src/auth/decorator/get-auth-data.decorator';
import { PlainToInstance, PlainToInstanceList } from 'src/helpers';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './entities/user.entity';
import { Pivot_UserFavouriteTrack } from 'src/pivot/pivots.entity';
import { Track } from 'src/music-modules/track/entities/track.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  constructor(private prisma: PrismaService) {}

  findAll() {
    return `This action returns all user`;
  }

  async getFavoriteTracks(authData: AuthData) {
    const tracks = await this.prisma.user_favourite_track.findMany({
      where: {
        userId: authData.id,
      },
      include: { track: true },
    }); 
    return PlainToInstanceList(Pivot_UserFavouriteTrack, tracks);
  }

  async getRecentPlayTracks(authData: AuthData) {
    const tracks = await this.prisma.user_listen_track.findMany({
      where: {
        userId: authData.id,
      },
      take: 20,
      orderBy: {
        listenCount: 'desc',
      },
    });
    return PlainToInstanceList(Track, tracks)
  }

  // async getMostPlayTracks(authData: AuthData) {
  //   const tracks = await this.prisma.user_listen_track.findMany({
  //     where: {
  //       userId: authData.id,
  //     },
  //     take: 20,
  //     orderBy: {
  //       listenCount: 'desc',
  //     },
  //   });
  //   return PlainToInstanceList(Track, tracks)
  // }

  // getRecentPlayArtists(authData: AuthData) {
  //   return this.prisma.user_listen_artist.findMany({
  //     where: {
  //       userId: authData.id,
  //     },
  //     take: 20,
  //     orderBy: {
  //       updatedAt: 'desc',
  //     },
  //   });
  // }

  // getMostPlayArtists(authData: AuthData) {
  //   return this.prisma.user_listen_artist.findMany({
  //     where: {
  //       userId: authData.id,
  //     },
  //     take: 20,
  //     orderBy: {
  //       listenCount: 'desc',
  //     },
  //   });
  // }

  getRecentPlayAlbum(authData: AuthData) {
    return this.prisma.user_listen_album.findMany({
      where: {
        userId: authData.id,
      },
      take: 20,
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    // return `This action returns a #${id} user`;
    const user = await this.prisma.user.findFirstOrThrow({
      where: {id: Number(id)}
    });
    return PlainToInstance(User, user);
  }

  private async findUserOrThrow(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  private async ensureUniqueEmail(email: string, userId: number) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== userId) {
      throw new ConflictException('Email already in use');
    }
  }

  private async ensureUniqueUsername(username: string, userId: number) {
    const existing = await this.prisma.user.findUnique({ where: { username } });
    if (existing && existing.id !== userId) {
      throw new ConflictException('Username already in use');
    }
  }

  private nowUnix(): number {
    return Math.floor(Date.now() / 1000);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findUserOrThrow(id);
    await this.ensureUniqueEmail(updateUserDto.email, id);
    await this.ensureUniqueUsername(updateUserDto.username, id);

    return this.prisma.user.update({
      where: { id: Number(id) },
      data: {
        email: updateUserDto.email,
        fullname: updateUserDto.fullname,
        username: updateUserDto.username,
        updatedAt: this.nowUnix(),
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
