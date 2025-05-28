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
import { ApiBearerAuth } from '@nestjs/swagger';
import { PlayListDTO } from './dto/create-playlist.dto';
// import { UpdatePlaylistDto } from './dto/update-playlist.dto';

@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  create(
    @GetAuthData()
    authData: AuthData,
    @Body()
    playList: PlayListDTO
  ) {
    return this.playlistService.create(authData, playList);
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
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  getMyPlaylists(@GetAuthData() authData: AuthData) {
    return this.playlistService.getMyPlaylists(authData);
  }

  @Get('tracks-with-foreign/:id')
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  getTrackWithForeign(@Param('id') id: string) {
    return this.playlistService.findOneWithForeign(+id);
  }

  @Post('/add-track')
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  addTrackToPlaylist(
    @Body() body: AddTrackToPlaylistDto,
    @GetAuthData() authData: AuthData,
  ) {
    return this.playlistService.addTrackToPlaylist(body, authData);
  }

  @Post('/remove-track')
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  removeTrackFromPlaylist(
    @Body() body: AddTrackToPlaylistDto,
    @GetAuthData() authData: AuthData,
  ) {
    return this.playlistService.removeTrackFromPlaylist(body, authData);
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
