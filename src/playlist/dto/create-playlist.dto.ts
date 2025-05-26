import { IsString } from "class-validator";

export class PlayListDTO {
  @IsString()
  playListName: string;

  @IsString()
  description: string;

  @IsString()
  coverImageUrl: string;
}