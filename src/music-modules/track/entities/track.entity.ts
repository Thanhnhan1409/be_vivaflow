import { Album } from 'src/music-modules/album/entities/album.entity';
import { Audio } from 'src/music-modules/audio/entities/audio.entity';
import {
  ApiPropNumber,
  ApiPropString,
  ApiPropTypeOptional,
} from 'src/decorator/entity.decorator';
import {
  Pivot_PlaylistTrackLink,
  Pivot_SecondaryArtistTrackLink,
  Pivot_UserFavouriteTrack,
  Pivot_UserListenTrack,
} from 'src/pivot/pivots.entity';
import { Artist } from 'src/artist/entities/artist.entity';

export class Track {
  @ApiPropString() id: number;
  @ApiPropString() title: string;
  @ApiPropString() artistNames: string;
  @ApiPropString() spotifyTrackId: string;
  @ApiPropNumber() mainArtistId: number;
  @ApiPropNumber() listenCount: number;
  @ApiPropNumber() albumId: number;
  @ApiPropNumber() audioId: number;
}

export class TrackWithForeign extends Track {
  @ApiPropTypeOptional(Artist) mainArtist?: Artist;
  @ApiPropTypeOptional(Album) album?: Album;
  @ApiPropTypeOptional(Audio) audio?: Audio;

  @ApiPropTypeOptional([Pivot_UserListenTrack])
  user_listen_tracks?: Pivot_UserListenTrack[];

  @ApiPropTypeOptional([Pivot_UserFavouriteTrack])
  user_favourite_tracks?: Pivot_UserFavouriteTrack[];

  @ApiPropTypeOptional([Pivot_PlaylistTrackLink])
  playlist_track_links?: Pivot_PlaylistTrackLink[];

  @ApiPropTypeOptional([Pivot_SecondaryArtistTrackLink])
  secondary_artist_track_links: Pivot_SecondaryArtistTrackLink[];
}
