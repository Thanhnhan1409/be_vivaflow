import { Artist } from 'src/artist/entities/artist.entity';
import {
  ApiPropNumber,
  ApiPropString,
  ApiPropTypeOptional,
} from 'src/decorator/entity.decorator';
import {
  Pivot_UserFavouriteTrack,
  Pivot_UserListenAlbum,
  Pivot_UserListenTrack,
} from 'src/pivot/pivots.entity';
import { Playlist } from 'src/playlist/entities/playlist.entity';
import { Profile } from './profile.entity';

export class User {
  @ApiPropNumber() id: number;

  @ApiPropString() username: string;
  @ApiPropString() email: string;
  @ApiPropString() pwdHash: string;
  @ApiPropString() pwdSalt: string;
  @ApiPropString() avatarImageUrl: string;
  @ApiPropNumber() createdAt: number;
  @ApiPropNumber() updatedAt: number;
}

export class UserWithForeign extends User {
  @ApiPropTypeOptional(Profile) profile?: Profile;
  @ApiPropTypeOptional(Artist) artist?: Artist;
  @ApiPropTypeOptional([Pivot_UserListenTrack])
  user_listen_track?: Pivot_UserListenTrack[];
  @ApiPropTypeOptional([Pivot_UserListenAlbum])
  user_listen_album?: Pivot_UserListenAlbum[];
  @ApiPropTypeOptional([Playlist]) playlist?: Playlist[];
  @ApiPropTypeOptional([Pivot_UserFavouriteTrack])
  user_favourite_tracks?: Pivot_UserFavouriteTrack[];
}
