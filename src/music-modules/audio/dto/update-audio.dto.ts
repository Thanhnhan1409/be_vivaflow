import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAudioDto } from './create-audio.dto';
import { IsString } from 'class-validator';

export class UpdateAudioUrlDto {
  @IsString()
  @ApiProperty({ example: 'https://res.cloudinary.com/doxcb6lhc/video/upload/v1748588601/SPOTDOWNLOADER.COM_One_Dance_gur7jr.mp3' })
  url: string;
}
