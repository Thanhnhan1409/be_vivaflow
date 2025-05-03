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

// import { UpdatePlaylistDto } from './dto/update-playlist.dto';
@Injectable()
export class PlaylistService {
  constructor(private prisma: PrismaService) {}

  async create(authData: AuthData) {
    const createdCount = await this.prisma.playlist.count({
      where: { ownerUserId: authData.id },
    });

    const newPlaylist = await this.prisma.playlist.create({
      data: {
        coverImageUrl: 'https://via.placeholder.com/150?text=Playlist+Cover',
        name: `Playlist ${createdCount + 1}`,
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
    return PlainToInstance(
      PlaylistWithForeign,
      await this.prisma.playlist.findFirstOrThrow({
        where: { id },
        include: {
          ownerUser: true,
          playlist_track_links: {
            include: { track: true },
          },
        },
      }),
    );
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

    await this.prisma.playlist.update({
      where: { id: playlistId },
      data: {
        playlist_track_links: {
          connect: {
            id: trackId,
          },
        },
      },
    });
  }

  async removeTrackFromPlaylist(
    playlistId: number,
    trackId: number,
    authData: AuthData,
  ) {

    await this.prisma.track.findFirstOrThrow({
      where: { id: trackId },
    });

    const playlist = await this.prisma.playlist.findFirstOrThrow({
      where: { id: playlistId },
      include: {
        playlist_track_links: true,
      },
    });

    if (playlist.ownerUserId !== authData.id) {
      throw new UnauthorizedException('You are not the owner of this playlist');
    }
    if (
      playlist.playlist_track_links.findIndex((i) => i.id === trackId) === -1
    ) {
      throw new BadRequestException('This track is not in this playlist');
    }

    await this.prisma.playlist.update({
      where: { id: playlistId },
      data: {
        playlist_track_links: {
          disconnect: {
            id: trackId,
          },
        },
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

    const recommendationSpotifyTrackIds: string[] = []; // call recommendation service here

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
