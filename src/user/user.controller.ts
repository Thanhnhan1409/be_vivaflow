import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserGuard } from 'src/auth/guard/auth.guard';
import {
  AuthData,
  GetAuthData,
} from 'src/auth/decorator/get-auth-data.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get('recent-play-tracks')
  @UseGuards(UserGuard)
  getRecentPlayTracks(@GetAuthData() authData: AuthData) {
    return this.userService.getRecentPlayTracks(authData);
  }

  @Get('most-play-tracks')
  @UseGuards(UserGuard)
  getMostPlayTracks(@GetAuthData() authData: AuthData) {
    return this.userService.getMostPlayTracks(authData);
  }

  @Get('recent-play-artists')
  @UseGuards(UserGuard)
  getRecentPlayArtists(@GetAuthData() authData: AuthData) {
    return this.userService.getRecentPlayArtists(authData);
  }

  @Get('most-play-artists')
  @UseGuards(UserGuard)
  getMostPlayArtists(@GetAuthData() authData: AuthData) {
    return this.userService.getMostPlayArtists(authData);
  }

  @Get('recent-play-albums')
  @UseGuards(UserGuard)
  getRecentPlayAlbums(@GetAuthData() authData: AuthData) {
    return this.userService.getRecentPlayAlbum(authData);
  }
}
