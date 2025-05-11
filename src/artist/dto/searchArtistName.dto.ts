import { ValidateApiPropOptionalNumber, ValidateApiPropRequiredString } from 'src/decorator/validate.decorators';

export class SearchArtistNameQueryDto {
  @ValidateApiPropRequiredString() searchText: string;
  @ValidateApiPropOptionalNumber() page: number;
  @ValidateApiPropOptionalNumber() pageSize: number;
}
