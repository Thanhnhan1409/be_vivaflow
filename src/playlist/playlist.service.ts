import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PlainToInstance, PlainToInstanceList } from 'src/helpers';
import { Playlist, PlaylistWithForeign } from './entities/playlist.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthData } from 'src/auth/decorator/get-auth-data.decorator';
import { AddTrackToPlaylistDto } from './dto/addTrackToPlaylist.dto';
import { Track } from 'src/music-modules/track/entities/track.entity';
import { PlayListDTO } from './dto/create-playlist.dto';
import * as moment from 'moment';

// import { UpdatePlaylistDto } from './dto/update-playlist.dto';
@Injectable()
export class PlaylistService {
  constructor(private prisma: PrismaService) {}

  async create(authData: AuthData, playList: PlayListDTO) {
    const createdCount = await this.prisma.playlist.count({
      where: { ownerUserId: authData.id },
    });

    const newPlaylist = await this.prisma.playlist.create({
      data: {
        coverImageUrl: playList.coverImageUrl,
        name: playList.playListName,
        description: playList.description || '',
        ownerUser: {
          connect: {
            id: authData.id,
          },
        },
      },
    });

    return PlainToInstance(Playlist, newPlaylist);
  }

  findAll() {
    return `This action returns all playlist`;
  }

  async findOne(id: number) {
    return PlainToInstance(
      Playlist,
      await this.prisma.playlist.findFirstOrThrow({
        where: { id },
      }),
    );
  }

  async findOneWithForeign(id: number) {
    const playlist = await this.prisma.playlist.findFirstOrThrow({
        where: { id },
        include: {
          ownerUser: true,
          playlist_track_links: {
            include: { 
              track: {
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
              },
            },
          },
        },
      });
      const playlistWithCover = {
        ...playlist,
        playlist_track_links: playlist.playlist_track_links.map(link => ({
          ...link,
          track: {
            ...link.track,
            coverImageUrl: link.track?.album?.coverImageUrl ?? null,
            fullUrl: link.track?.audio?.fullUrl ?? null,
          },
        })),
      };
    
      return PlainToInstance(PlaylistWithForeign, playlistWithCover);
  }

  async getMyPlaylists(authData: AuthData) {
    const playlists = await this.prisma.playlist.findMany({
      where: {
        ownerUserId: authData.id,
      },
    });

    return PlainToInstanceList(Playlist, playlists);
  }

  async addTrackToPlaylist(dto: AddTrackToPlaylistDto, authData: AuthData) {
    const { playlistId, trackId } = dto;
    await this.prisma.track.findFirstOrThrow({
      where: { id: Number(trackId) },
    });

    const playlist = await this.prisma.playlist.findFirstOrThrow({
      where: { id: playlistId },
    });

    if (playlist.ownerUserId !== authData.id) {
      throw new UnauthorizedException('You are not the owner of this playlist');
    }

    await this.prisma.playlist_track_link.create({
      data: {
        playlist: { connect: { id: playlistId } },
        track: { connect: { id: trackId } },
        no: 1,
        createdAt: moment().unix(),
      },
    });
  }  

  async removeTrackFromPlaylist(dto: { playlistId: number; trackId: number }, authData: AuthData) {
    const { playlistId, trackId } = dto;

    await this.prisma.track.findFirstOrThrow({
      where: { id: Number(trackId) },
    });

    const playlist = await this.prisma.playlist.findFirstOrThrow({
      where: { id: playlistId },
    });
  
    if (playlist.ownerUserId !== authData.id) {
      throw new UnauthorizedException('You are not the owner of this playlist');
    }

    await this.prisma.playlist_track_link.deleteMany({
      where: {
        playlistId: playlistId,
        trackId: trackId,
      },
    });
  }  

  // update(id: number, updatePlaylistDto: UpdatePlaylistDto) {
  //   return `This action updates a #${id} playlist`;
  // }
  remove(id: number) {
    return `This action removes a #${id} playlist`;
  }

  // Return a list of recommendation track ids
  async getRecommendationTracks(playlistId: number): Promise<Track[]> {
    const trackInPlaylist = await this.prisma.playlist_track_link.findMany({
      where: {
        playlistId: playlistId,
      },
      include: {
        track: {
          select: {
            spotifyTrackId: true,
          },
        },
      },
    });

    if (trackInPlaylist.length === 0) {
      throw new BadRequestException('Playlist is empty');
    }

    const spotifyTrackIdsInPlaylist = trackInPlaylist.map(
      (i) => i.track.spotifyTrackId,
    );

    const recommendationSpotifyTrackIds: string[] = [];

    const recommendationTracks = await this.prisma.track.findMany({
      where: {
        OR: [
          // Condition 1: Track's spotify id is in recommendation list
          {
            spotifyTrackId: {
              in: recommendationSpotifyTrackIds,
            },
          },
          // Condition 2: Track's second spotify id is in recommendation list
          {
            track_spotifysecondtrackid_link: {
              some: {
                spotifySecondTrackId: {
                  in: spotifyTrackIdsInPlaylist,
                },
              },
            },
          },
        ],
      },
    });

    return PlainToInstanceList(Track, recommendationTracks);
  }
}
