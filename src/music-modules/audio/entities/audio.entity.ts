import {
  ApiPropNumber,
  ApiPropType,
  ApiPropString,
} from 'src/decorator/entity.decorator';
import { Track } from 'src/music-modules/track/entities/track.entity';

export class Audio {
  @ApiPropNumber()
  id: number;

  @ApiPropString()
  label: string;

  @ApiPropString()
  path: string;

  @ApiPropNumber()
  size: number;

  @ApiPropNumber()
  length: number;

  @ApiPropNumber()
  createdAt: number;

  @ApiPropNumber()
  updatedAt: number;

  @ApiPropType(Track)
  track?: Track;
}
