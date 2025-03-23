import {
  ValidateApiPropOptionalListOfNumber,
  ValidateApiPropOptionalListOfString,
} from 'src/decorator/validate.decorators';

export class FindManyArtistQueryDto {
  @ValidateApiPropOptionalListOfNumber() ids: number[];
  @ValidateApiPropOptionalListOfString() spotifyIds: string[];
}
