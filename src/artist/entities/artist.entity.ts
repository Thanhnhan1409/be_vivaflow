import { Type } from 'class-transformer';
import {
  ApiPropNumber,
  ApiPropString,
  ApiPropStringOptional,
  ApiPropTypeOptional,
} from 'src/decorator/entity.decorator';
import { Album } from 'src/music-modules/album/entities/album.entity';
import { Track } from 'src/music-modules/track/entities/track.entity';
import { User } from 'src/user/entities/user.entity';

export class Artist {
  @ApiPropNumber() id: number;
  @ApiPropString() spotifyArtistId: string;
  @ApiPropString() name: string;
  @ApiPropString() introduction: string;
  @ApiPropNumber() userId: number;

  @ApiPropStringOptional() avatarImageUrl: string;
  @ApiPropNumber() createdAt: number;
  @ApiPropNumber() updatedAt: number;
}

export class ArtistWithForeign extends Artist {
  @ApiPropTypeOptional([Album])
  @Type(() => Album)
  albums: Album[];
  @ApiPropTypeOptional([Track])
  @Type(() => Track)
  tracks: Track[];
  @ApiPropTypeOptional(User) User: User;
}
