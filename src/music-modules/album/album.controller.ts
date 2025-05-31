import { Controller, Get, Param, Delete, Query } from '@nestjs/common';
import { AlbumService } from './album.service';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  // @Post()
  // create(@Body() createAlbumDto: CreateAlbumDto) {
  //   return this.albumService.create(createAlbumDto);
  // }

  @Get()
  async findAll(
    @Query('pageNumber') page = '1',
    @Query('pageSize') limit = '10',
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    return this.albumService.findAll(pageNumber, limitNumber);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.albumService.findOneWithTrack(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
  //   return this.albumService.update(+id, updateAlbumDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.albumService.remove(+id);
  }

  @Get('with-tracks/:id')
  async getAlbumWithTracks(@Param('id') id: number) {
    return this.albumService.findOneWithTrack(+id);
  }

  @Get('with-artist/:id')
  async getAlbumWithArtist(@Param('id') id: number) {
    return this.albumService.findManyWithArtist(+id);
  }
}
