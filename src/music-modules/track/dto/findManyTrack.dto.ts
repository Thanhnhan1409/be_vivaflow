import {
  ValidateApiPropOptionalListOfNumber,
  ValidateApiPropOptionalListOfString,
  ValidateApiPropOptionalNumber,
  ValidateApiPropOptionalString,
} from 'src/decorator/validate.decorators';

export class FindManyTrackQueryDto {
  @ValidateApiPropOptionalListOfNumber() ids: number[];
  @ValidateApiPropOptionalListOfString() spotifyIds: string[];
  @ValidateApiPropOptionalNumber() artistId: number;
  @ValidateApiPropOptionalNumber() albumId: number;
  @ValidateApiPropOptionalString() spotifyAlbumId: string;
  @ValidateApiPropOptionalString() spotifyArtistId: string;
  @ValidateApiPropOptionalNumber() playlistId: number;
}
