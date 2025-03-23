import { ValidateApiPropRequiredNumber } from 'src/decorator/validate.decorators';

export class AddTrackToPlaylistDto {
  @ValidateApiPropRequiredNumber() playlistId: number;
  @ValidateApiPropRequiredNumber() trackId: number;
}
