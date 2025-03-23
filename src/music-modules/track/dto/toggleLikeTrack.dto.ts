import { ValidateApiPropRequired01 } from 'src/decorator/validate.decorators';
export class ToggleLikeTrackDto {
  @ValidateApiPropRequired01()
  trackId: number;
  @ValidateApiPropRequired01()
  toggleOn: 1 | 0;
}
