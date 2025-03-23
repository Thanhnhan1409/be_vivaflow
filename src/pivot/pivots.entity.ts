import { Artist } from 'src/artist/entities/artist.entity';
import {
  ApiPropNumber,
  ApiPropTypeOptional,
} from 'src/decorator/entity.decorator';
import { Track } from 'src/music-modules/track/entities/track.entity';
import { Playlist } from 'src/playlist/entities/playlist.entity';

export class Pivot_UserListenTrack {
  @ApiPropNumber() id: number;
  @ApiPropNumber() userId: number;
  @ApiPropNumber() trackId: number;

  @ApiPropTypeOptional(Track)
  track?: Track;
}

export class Pivot_UserFavouriteTrack {
  @ApiPropNumber() id: number;
  @ApiPropNumber() userId: number;
  @ApiPropNumber() trackId: number;

  @ApiPropTypeOptional(Track)
  track?: Track;
}

export class Pivot_PlaylistTrackLink {
  @ApiPropNumber() id: number;
  @ApiPropNumber() playlistId: number;
  @ApiPropNumber() trackId: number;

  @ApiPropTypeOptional(Track) track?: Track;
  @ApiPropTypeOptional(Playlist) playlist?: Playlist;
}

export class Pivot_UserListenAlbum {
  @ApiPropNumber() id: number;

  @ApiPropNumber() userId: number;

  @ApiPropNumber() albumId: number;
}

// secondary_artist_track_links
export class Pivot_SecondaryArtistTrackLink {
  @ApiPropNumber() id: number;
  @ApiPropNumber() artistId: number;
  @ApiPropNumber() trackId: number;

  @ApiPropTypeOptional(Track)
  track?: Track;

  @ApiPropTypeOptional(Artist)
  artist?: Artist;
}
