import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import {
  AuthData,
  GetAuthData,
} from 'src/auth/decorator/get-auth-data.decorator';
import { AddTrackToPlaylistDto } from './dto/addTrackToPlaylist.dto';
import { UserGuard } from 'src/auth/guard/auth.guard';
// import { UpdatePlaylistDto } from './dto/update-playlist.dto';

@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  @UseGuards(UserGuard)
  create(
    @GetAuthData()
    authData: AuthData,
  ) {
    return this.playlistService.create(authData);
  }

  @Get()
  findAll() {
    return this.playlistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playlistService.findOne(+id);
  }

  @Get('my-playlists')
  @UseGuards(UserGuard)
  getMyPlaylists(@GetAuthData() authData: AuthData) {
    return this.playlistService.getMyPlaylists(authData);
  }

  @Post('/add-track')
  @UseGuards(UserGuard)
  addTrackToPlaylist(
    @Body() body: AddTrackToPlaylistDto,
    @GetAuthData() authData: AuthData,
  ) {
    return this.playlistService.addTrackToPlaylist(body, authData);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updatePlaylistDto: UpdatePlaylistDto,
  // ) {
  //   return this.playlistService.update(+id, updatePlaylistDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playlistService.remove(+id);
  }

  @Get(':id/recommend-tracks')
  recommendTracks(@Param('id') id: string) {
    return this.playlistService.getRecommendationTracks(+id);
  }
}
