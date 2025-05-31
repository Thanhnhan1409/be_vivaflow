import { AlbumGroup, AlbumType } from '@prisma/client';
import { Type } from 'class-transformer';
import { Artist } from 'src/artist/entities/artist.entity';
import {
  ApiPropEnumOptional,
  ApiPropNumber,
  ApiPropString,
  ApiPropStringOptional,
  ApiPropTypeOptional,
} from 'src/decorator/entity.decorator';
import { Track } from 'src/music-modules/track/entities/track.entity';
import { Pivot_UserListenAlbum } from 'src/pivot/pivots.entity';

export class Album {
  @ApiPropNumber() id: number;
  @ApiPropNumber() spotifyAlbumId: number;
  @ApiPropStringOptional() title: string;

  @ApiPropNumber() artistId: number;
  @ApiPropStringOptional() coverImageUrl: string;

  @ApiPropEnumOptional(AlbumGroup) albumGroup?: AlbumGroup;
  @ApiPropEnumOptional(AlbumGroup) albumType?: AlbumType;

  @ApiPropNumber() releasedAt: number;
  @ApiPropNumber() createdAt: number;
  @ApiPropNumber() updatedAt: number;

  @ApiPropTypeOptional(() => Artist)
  @Type(() => Artist)
  artist?: Artist;
}
export class AlbumWithForeign {
  @ApiPropTypeOptional(Track)
  @Type(() => Track)
  tracks?: Track[];
  @ApiPropTypeOptional(Artist)
  @Type(() => Artist)
  artist?: Artist;

  @ApiPropTypeOptional(Pivot_UserListenAlbum)
  @Type(() => Pivot_UserListenAlbum)
  user_listen_albums?: Pivot_UserListenAlbum[];
}

export class AlbumWithTrack extends Album {
  @ApiPropTypeOptional([Track])
  @Type(() => Track)
  tracks?: Track[];
}