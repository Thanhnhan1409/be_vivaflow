import { IsNotEmpty, IsNumber } from 'class-validator';
import { ValidateApiPropRequired01 } from 'src/decorator/validate.decorators';
export class ToggleLikeTrackDto {
  @IsNumber()
  @IsNotEmpty()
  trackId: number;
  
  @ValidateApiPropRequired01()
  toggleOn: 1 | 0;
}
