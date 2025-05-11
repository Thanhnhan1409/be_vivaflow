import {
  ValidateApiPropOptionalListOfNumber,
  ValidateApiPropOptionalListOfString,
  ValidateApiPropOptionalNumber,
} from 'src/decorator/validate.decorators';

export class FindManyArtistQueryDto {
  @ValidateApiPropOptionalListOfNumber() ids: number[];
  @ValidateApiPropOptionalListOfString() spotifyIds: string[];
  @ValidateApiPropOptionalNumber() page: number;
  @ValidateApiPropOptionalNumber() pageSize: number;
}
