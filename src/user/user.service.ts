import { Injectable } from '@nestjs/common';
import { AuthData } from 'src/auth/decorator/get-auth-data.decorator';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  constructor(private prisma: PrismaService) {}

  findAll() {
    return `This action returns all user`;
  }

  getFavoriteTracks(authData: AuthData) {
    return this.prisma.user_favourite_track.findMany({
      where: {
        userId: authData.id,
      },
    });
  }

  getRecentPlayTracks(authData: AuthData) {
    return this.prisma.user_listen_track.findMany({
      where: {
        userId: authData.id,
      },
      take: 20,
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  getMostPlayTracks(authData: AuthData) {
    return this.prisma.user_listen_track.findMany({
      where: {
        userId: authData.id,
      },
      take: 20,
      orderBy: {
        listenCount: 'desc',
      },
    });
  }

  getRecentPlayArtists(authData: AuthData) {
    return this.prisma.user_listen_artist.findMany({
      where: {
        userId: authData.id,
      },
      take: 20,
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  getMostPlayArtists(authData: AuthData) {
    return this.prisma.user_listen_artist.findMany({
      where: {
        userId: authData.id,
      },
      take: 20,
      orderBy: {
        listenCount: 'desc',
      },
    });
  }

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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
