import { ValidateApiPropRequiredString } from 'src/decorator/validate.decorators';

export class SearchArtistNameQueryDto {
  @ValidateApiPropRequiredString() searchText: string;
}
