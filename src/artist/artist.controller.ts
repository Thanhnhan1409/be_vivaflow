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
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { FindManyArtistQueryDto } from './dto/findManyArtist.dto';
import { UserGuard } from 'src/auth/guard/auth.guard';
import {
  AuthData,
  GetAuthData,
} from 'src/auth/decorator/get-auth-data.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
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
  findAll() {
    return this.artistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artistService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateArtistDto: UpdateArtistDto) {
  //   return this.artistService.update(+id, updateArtistDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.artistService.remove(+id);
  }

  @Get('search-by-name/:searchText')
  searchArtistName(
    @Param('searchText') searchText: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.artistService.searchArtistName({
      searchText,
      page,
      pageSize
    });
  }

  @Get('find-many')
  @UseGuards(UserGuard)
  @ApiBearerAuth()
  findMany(@Query() query: FindManyArtistQueryDto) {
    return this.artistService.findMany(query);
  }

  @Get('with-tracks/:id')
  @UseGuards(UserGuard)
  @ApiBearerAuth()
  findOneWithSong(@Param('id') id: string) {
    if (isNaN(+id)) throw new Error('Invalid artist id');
    return this.artistService.findOne_WithTracks(+id);
  }

  @Get('with-albums/:id')
  @UseGuards(UserGuard)
  @ApiBearerAuth()
  findOneWithAlbums(@Param('id') id: string) {
    if (isNaN(+id)) throw new Error('Invalid artist id');
    return this.artistService.findOne_WithAlbums(+id);
  }

  @Get('recent-listen')
  @UseGuards(UserGuard)
  @ApiBearerAuth()
  getRecentListenArtist(@GetAuthData() authData: AuthData) {
    return this.artistService.getRecentListenArtist(authData);
  }
}
