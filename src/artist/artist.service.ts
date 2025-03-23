import { Artist, ArtistWithForeign } from './entities/artist.entity';
import { Injectable } from '@nestjs/common';
// import { CreateArtistDto } from './dto/create-artist.dto';
// import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlainToInstance, PlainToInstanceList } from 'src/helpers';
import { FindManyArtistQueryDto } from './dto/findManyArtist.dto';
import { SearchArtistNameQueryDto } from './dto/searchArtistName.dto';
import { AuthData } from 'src/auth/decorator/get-auth-data.decorator';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  // TODO
  // create(createArtistDto: CreateArtistDto) {
  // return 'This action adds a new artist';
  // }

  async findAll() {
    const artists = await this.prisma.artist.findMany();

    return PlainToInstanceList(Artist, artists);
  }

  async findMany(filter: FindManyArtistQueryDto) {
    const artists = await this.prisma.artist.findMany({
      where: {
        id: filter.ids ? { in: filter.ids } : undefined,
        spotifyArtistId: filter.spotifyIds
          ? { in: filter.spotifyIds }
          : undefined,
      },
    });

    return PlainToInstanceList(Artist, artists);
  }

  async searchArtistName(filter: SearchArtistNameQueryDto) {
    const artists = await this.prisma.artist.findMany({
      where: {
        name: { contains: filter.searchText.trim() },
      },
    });

    return PlainToInstanceList(Artist, artists);
  }

  async findOne(id: number) {
    const artist = await this.prisma.artist.findFirstOrThrow({
      where: { id },
    });

    return PlainToInstance(Artist, artist);
  }

  async findOne_WithAlbums(id: number) {
    const artist = await this.prisma.artist.findFirstOrThrow({
      where: { id },
      include: { albums: true },
    });

    return PlainToInstance(ArtistWithForeign, artist);
  }

  async findOne_WithTracks(id: number) {
    const artist = await this.prisma.artist.findFirstOrThrow({
      where: { id },
      include: { tracks: true },
    });

    return PlainToInstance(ArtistWithForeign, artist);
  }

  async findOne_WithAllForeign(id: number) {
    const artist = await this.prisma.artist.findFirstOrThrow({
      where: { id },
      include: {
        albums: {
          include: { tracks: true },
          orderBy: {
            releasedAt: 'desc',
          },
        },
        tracks: {
          orderBy: { listenCount: 'desc' },
        },
      },
    });

    return PlainToInstance(ArtistWithForeign, artist);
  }

  async getRecentListenArtist(authData: AuthData) {
    const recentArtists = await this.prisma.user_listen_artist.findMany({
      where: {
        userId: authData.id,
      },
      orderBy: { updatedAt: 'desc' },
      take: 20,
      include: {
        artist: true,
      },
    });

    return PlainToInstanceList(
      Artist,
      recentArtists.map((i) => i.artist),
    );
  }

  // TODO
  // update(id: number, updateArtistDto: UpdateArtistDto) {
  //   return `This action updates a #${id} artist`;
  // }

  remove(id: number) {
    return `This action removes a #${id} artist`;
  }
}
