import { ToggleLikeTrackDto } from './dto/toggleLikeTrack.dto';
import { Injectable } from '@nestjs/common';
// import { CreateTrackDto } from './dto/create-track.dto';
// import { UpdateTrackDto } from './dto/update-track.dto';
import { AuthData } from 'src/auth/decorator/get-auth-data.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlainToInstance, PlainToInstanceList } from 'src/helpers';
import { FindManyTrackQueryDto } from './dto/findManyTrack.dto';
import { isNil } from 'lodash';
import { Lyrics, Track, TrackWithForeign } from './entities/track.entity';
import * as moment from 'moment';
import { Prisma } from '@prisma/client';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  // create(createTrackDto: CreateTrackDto) {
  //   console.log(createTrackDto);
  //   return 'This action adds a new track';
  // }

  async findAll(searchText = '', page = 1, limit = 10) {
    const skip = (Number(page) - 1) * Number(limit);
  
    const [tracks, total] = await this.prisma.$transaction([
      this.prisma.track.findMany({
        skip,
        take: Number(limit),
        where: { title: { contains: searchText.trim() }, },
        orderBy: { temp_popularity : 'desc' },
      }),
      this.prisma.track.count(),
    ]);
  
    return {
      data: PlainToInstanceList(Track, tracks),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const track = await this.prisma.track.findFirst({
      where: {
        id,
      },
    });

    return PlainToInstance(Track, track);
  }

  // update(id: number, updateTrackDto: UpdateTrackDto) {
  //   console.log(updateTrackDto);
  //   return `This action updates a #${id} track`;
  // }

  remove(id: number) {
    return `This action removes a #${id} track`;
  }

  async findMany(filter: FindManyTrackQueryDto) {
    const page = Number(filter.pageNumber) || 1;
    const limit = Number(filter.pageSize) || 10;
    
    const skip = (page - 1) * limit;
    const cleanedSpotifyIds = (filter.spotifyIds || []).map(id => id.trim()).filter(Boolean);
    const cleanedIds = (filter.ids || []).filter(id => typeof id === 'number' && !isNaN(id));
    const artistConditions = [];
    if (!isNil(filter.artistId) || !isNil(filter.spotifyArtistId)) {
      artistConditions.push({
        mainArtist: {
          ...(filter.artistId != null && { id: filter.artistId }),
          ...(filter.spotifyArtistId != null && { spotifyArtistId: filter.spotifyArtistId }),
        },
      });
      artistConditions.push({
        secondary_artist_track_links: {
          some: {
            artist: {
              ...(filter.artistId != null && { id: filter.artistId }),
              ...(filter.spotifyArtistId != null && { spotifyArtistId: filter.spotifyArtistId }),
            },
          },
        },
      });
    }

    const where: Prisma.trackWhereInput = {
      id: cleanedIds.length > 0 ? { in: cleanedIds } : undefined,
      spotifyTrackId: cleanedSpotifyIds.length > 0 ? { in: cleanedSpotifyIds } : undefined,
      albumId: filter.albumId ?? undefined,
      playlist_track_links: filter.playlistId
        ? {
            some: {
              playlistId: filter.playlistId,
            },
          }
        : undefined,
      ...(artistConditions.length > 0 ? { OR: artistConditions } : {}),
    };


    const tracks = await this.prisma.track.findMany({
      skip,
      take: limit,
      where,
      include: {
        mainArtist: true,
        secondary_artist_track_links: {
          include: {
            artist: true,
          },
        },
      },
    });

    return  {
      data: PlainToInstanceList(TrackWithForeign, tracks),
      meta: {
        total: tracks.length,
        page,
        limit,
        totalPages: Math.ceil(tracks.length / limit),
      },
    };
  }

  async getRecentListenTracks(authData: AuthData) {
    const recentTracks = await this.prisma.user_listen_track.findMany({
      where: {
        userId: authData.id,
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        track: true,
      },
      take: 20,
    });

    return PlainToInstanceList(
      Track,
      recentTracks.map((i) => i.track),
    );
  }

  async toggleLikeTrack(dto: ToggleLikeTrackDto, authData: AuthData) {
    const { toggleOn, trackId } = dto;
    await this.prisma.track.findFirstOrThrow({
      where: { id: Number(dto.trackId) },
    });

    const like = await this.prisma.user_favourite_track.findFirst({
      where: {
        trackId,
        userId: authData.id,
      },
    });
    
    // like: 1, unlike: 0
    if (toggleOn === 1 && !like) {
      await this.prisma.user_favourite_track.create({
        data: {
          trackId,
          userId: authData.id,
        },
      });
    } else if (!(toggleOn === 0) && like) {
      await this.prisma.user_favourite_track.delete({
        where: {
          id: like.id,
        },
      });
    }

    return true;
  }

  async listenTrack(trackId: number, authData: AuthData) {
    return this.prisma.user_listen_track.upsert({
      where: {
        user_listen_track_userId_trackId_unique: {
          userId: authData.id,
          trackId,
        },
      },
      update: {
        updatedAt: moment().unix(),
        listenCount: {
          increment: 1,
        },
      },
      create: {
        userId: authData.id,
        trackId,
        listenCount: 1,
        updatedAt: moment().unix(),
        createdAt: moment().unix(),
      },
    });
  }

  async tracksInAlbum(albumId: number) {
    const tracks = await this.prisma.track.findMany({
      where: {
        albumId: Number(albumId),
      },
    });

    return PlainToInstanceList(Track, tracks);
  }

  async getLyric(trackId: number) {
    const lyrics = await this.prisma.lyrics.findFirst({
      where: {
        id: Number(trackId),
      },
    });

    return PlainToInstance(Lyrics, lyrics);
  }
}
