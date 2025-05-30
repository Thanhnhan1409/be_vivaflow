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

  async findAll(page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
  
    const [artists, total] = await this.prisma.$transaction([
      this.prisma.artist.findMany({
        skip,
        take,
        orderBy: { temp_popularity : 'desc' },
      }),
      this.prisma.artist.count(),
    ]);
  
    return {
      data: PlainToInstanceList(Artist, artists),
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
  

  async findMany(filter: FindManyArtistQueryDto) {
    const page = Number(filter.page) || 1;
    const limit = Number(filter.pageSize) || 10;
    const skip = (page - 1) * limit;
    const [artists, total] =  await this.prisma.$transaction([
      this.prisma.artist.findMany({
        skip,
        take: limit,
        where: {
          id: filter.ids ? { in: filter.ids.map(id => Number(id)) } : undefined,
          spotifyArtistId: filter.spotifyIds
            ? { in: filter.spotifyIds }
            : undefined,
        },
      }),
      this.prisma.artist.count(),
    ]);

    return {
      data: PlainToInstanceList(Artist, artists),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async searchArtistName(filter: SearchArtistNameQueryDto) {
    const page = Number(filter.page) || 1;
    const limit = Number(filter.pageSize) || 10;
    const skip = (page - 1) * limit;
    const [artists, total] = await this.prisma.$transaction([
      this.prisma.artist.findMany({
        skip,
        take: limit,
        where: {
          name: { contains: filter.searchText.trim() },
        },
      }),
      this.prisma.artist.count(),
    ]);

    return {
      data: PlainToInstanceList(Artist, artists),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async findOne(id: number) {
    const artist = await this.prisma.artist.findFirstOrThrow({
      where: { id: Number(id) },
    });

    return PlainToInstance(Artist, artist);
  }

  async findOne_WithAlbums(id: number) {
    console.log('findOne', id);
    const artist = await this.prisma.artist.findFirstOrThrow({
      where: { id },
      include: { albums: true },
    });

    return PlainToInstance(ArtistWithForeign, artist);
  }

  async findOne_WithTracks(id: number) {
    console.log('findOne', id);
    const artist = await this.prisma.artist.findFirstOrThrow({
      where: { id },
      include: {
        tracks: {
          include: {
            album: {
              select: {
                coverImageUrl: true,
              },
            },
            audio: {
              select: {
                fullUrl: true,
              }
            }
          },
        } 
      },
    });
    return PlainToInstance(ArtistWithForeign, {
      ...artist,
      tracks: artist.tracks.map((track) => ({
        ...track,
        coverImageUrl: track.album?.coverImageUrl || null,
        fullUrl: track.audio?.fullUrl || null,
      }))
    });
  }

  async findOne_WithAllForeign(id: number) {
    console.log('findOne', id);
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

  async getFollowingArtists(authData: AuthData) {
    const recentArtists = await this.prisma.user_listen_artist.findMany({
      where: {
        userId: authData.id,
        listenCount: 1,
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
  
  async toggleFollowArtist(authData: AuthData, artistIds: number[]) {
    const userId = Number(authData.id);
    const now = Math.floor(Date.now() / 1000);
    
    await Promise.all(
      artistIds.map(async (artistId) => {
        const record = await this.prisma.user_listen_artist.findUnique({
          where: {
            userId_artistId: {
              userId,
              artistId,
            },
          },
        });

        if (!record) {
          return this.prisma.user_listen_artist.create({
            data: {
              userId,
              artistId,
              listenCount: 1,
              createdAt: now,
            },
          });
        } else {
          const newCount = record.listenCount === 1 ? 0 : 1;
          return this.prisma.user_listen_artist.update({
            where: {
              userId_artistId: {
                userId,
                artistId,
              },
            },
            data: {
              listenCount: newCount,
              updatedAt: now,
            },
          });
        }
      })
    );

    return true;
  } 


  // TODO
  // update(id: number, updateArtistDto: UpdateArtistDto) {
  //   return `This action updates a #${id} artist`;
  // }

  remove(id: number) {
    return `This action removes a #${id} artist`;
  }
}
