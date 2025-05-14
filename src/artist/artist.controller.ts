import {
  Controller,
  Get,
  // Post,
  // Body,
  // Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { FindManyArtistQueryDto } from './dto/findManyArtist.dto';
import { UserGuard } from 'src/auth/guard/auth.guard';
import {
  AuthData,
  GetAuthData,
} from 'src/auth/decorator/get-auth-data.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ToggleLikeTrackDto } from 'src/music-modules/track/dto/toggleLikeTrack.dto';
// import { CreateArtistDto } from './dto/create-artist.dto';
// import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  // @Post()
  // create(@Body() createArtistDto: CreateArtistDto) {
  //   return this.artistService.create(createArtistDto);
  // }

  @Get()
  async findAll(
    @Query('pageNumber') page = '1',
    @Query('pageSize') limit = '10',
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    return await this.artistService.findAll(pageNumber, limitNumber);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.artistService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateArtistDto: UpdateArtistDto) {
  //   return this.artistService.update(+id, updateArtistDto);
  // }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.artistService.remove(+id);
  }

  @Get('search-by-name/:searchText')
  async searchArtistName(
    @Param('searchText') searchText: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return await this.artistService.searchArtistName({
      searchText,
      page,
      pageSize
    });
  }

  @Get('find-many')
  @UseGuards(UserGuard)
  @ApiBearerAuth()
  async findMany(@Query() query: FindManyArtistQueryDto) {
    return await this.artistService.findMany(query);
  }

  @Get('with-tracks/:id')
  @UseGuards(UserGuard)
  @ApiBearerAuth()
  async findOneWithSong(@Param('id') id: string) {
    if (isNaN(+id)) throw new Error('Invalid artist id');
    return await this.artistService.findOne_WithTracks(+id);
  }

  @Get('with-albums/:id')
  @UseGuards(UserGuard)
  @ApiBearerAuth()
  async findOneWithAlbums(@Param('id') id: string) {
    if (isNaN(+id)) throw new Error('Invalid artist id');
    return await this.artistService.findOne_WithAlbums(+id);
  }

  @Get('recent-listen')
  @UseGuards(UserGuard)
  @ApiBearerAuth()
  async getRecentListenArtist(@GetAuthData() authData: AuthData) {
    return await this.artistService.getRecentListenArtist(authData);
  }

  @Post('toggle-follow')
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  async toggleLikeTrack(
    @Body('idList') idList: number[],
    @GetAuthData() authData: AuthData,
  ) {
    return await this.artistService.toggleFollowArtist(authData, idList);
  }
}
