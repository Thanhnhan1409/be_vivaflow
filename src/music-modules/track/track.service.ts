import { ToggleLikeTrackDto } from './dto/toggleLikeTrack.dto';
import { Injectable } from '@nestjs/common';
// import { CreateTrackDto } from './dto/create-track.dto';
// import { UpdateTrackDto } from './dto/update-track.dto';
import { AuthData } from 'src/auth/decorator/get-auth-data.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlainToInstance, PlainToInstanceList } from 'src/helpers';
import { FindManyTrackQueryDto } from './dto/findManyTrack.dto';
import { isNil } from 'lodash';
import { Track, TrackWithForeign } from './entities/track.entity';
import moment from 'moment';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  // create(createTrackDto: CreateTrackDto) {
  //   console.log(createTrackDto);
  //   return 'This action adds a new track';
  // }

  async findAll() {
    const tracks = await this.prisma.track.findMany({});

    return PlainToInstanceList(Track, tracks);
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
    const tracks = await this.prisma.track.findMany({
      where: {
        id: filter.ids ? { in: filter.ids } : undefined,
        spotifyTrackId: filter.spotifyIds
          ? { in: filter.spotifyIds }
          : undefined,
        OR: [
          {
            mainArtist:
              !isNil(filter.artistId) || !isNil(filter.spotifyArtistId)
                ? {
                    id: !isNil(filter.artistId) ? filter.artistId : undefined,
                    spotifyArtistId: !isNil(filter.spotifyArtistId)
                      ? filter.spotifyArtistId
                      : undefined,
                  }
                : undefined,
          },
          {
            secondary_artist_track_links:
              !isNil(filter.artistId) || !isNil(filter.spotifyArtistId)
                ? {
                    some: {
                      artist: {
                        id: !isNil(filter.artistId)
                          ? filter.artistId
                          : undefined,
                        spotifyArtistId: !isNil(filter.spotifyArtistId)
                          ? filter.spotifyArtistId
                          : undefined,
                      },
                    },
                  }
                : undefined,
          },
        ],
        albumId: filter.albumId ? filter.albumId : undefined,
        playlist_track_links: filter.playlistId
          ? {
              some: {
                playlistId: filter.playlistId,
              },
            }
          : undefined,
      },
      include: {
        mainArtist: true,
        secondary_artist_track_links: {
          include: {
            artist: true,
          },
        },
      },
    });

    return PlainToInstanceList(TrackWithForeign, tracks);
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
      where: { id: +dto.trackId },
    });

    const like = await this.prisma.user_favourite_track.findFirst({
      where: {
        trackId,
        userId: authData.id,
      },
    });

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
}
