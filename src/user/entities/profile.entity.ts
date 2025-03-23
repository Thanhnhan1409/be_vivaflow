import { ApiPropNumber, ApiPropString } from 'src/decorator/entity.decorator';

export class Profile {
  @ApiPropNumber() id: number;
  @ApiPropNumber() userId: number;
  @ApiPropString() firstName: string;
  @ApiPropString() lastName: string;
  @ApiPropString() address: string;
}
