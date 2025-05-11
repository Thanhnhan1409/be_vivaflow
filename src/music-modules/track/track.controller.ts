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
import { TrackService } from './track.service';
// import { CreateTrackDto } from './dto/create-track.dto';
// import { UpdateTrackDto } from './dto/update-track.dto';
import { FindManyTrackQueryDto } from './dto/findManyTrack.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  AuthData,
  GetAuthData,
} from 'src/auth/decorator/get-auth-data.decorator';
import { ToggleLikeTrackDto } from './dto/toggleLikeTrack.dto';
import { UserGuard } from 'src/auth/guard/auth.guard';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  // @Post()
  // create(@Body() createTrackDto: CreateTrackDto) {
  //   return this.trackService.create(createTrackDto);
  // }

  @Get()
  async findAll(
    @Query('pageNumber') page = '1',
    @Query('pageSize') limit = '10',
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    return await this.trackService.findAll(pageNumber, limitNumber);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.trackService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
  //   return this.trackService.update(+id, updateTrackDto);
  // }

  @Get('get-many-by-query')
  async findMany(@Query() query: FindManyTrackQueryDto) {
    return await this.trackService.findMany(query);
  }

  @Get('get-recent')
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  async GetRecentTracks(@GetAuthData() authData: AuthData) {
    return await this.trackService.getRecentListenTracks(authData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trackService.remove(+id);
  }

  @Post(':id/listen')
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  async listenToTrack(
    @Param('id') id: string,
    @GetAuthData() authData: AuthData,
  ) {
    console.log('id', id);
    
    console.log('auth', authData);
    
    return await this.trackService.listenTrack(+id, authData);
  }

  @Post(':id/toggle-like')
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  async toggleLikeTrack(
    @Body() body: ToggleLikeTrackDto,
    @GetAuthData() authData: AuthData,
  ) {
    return await this.trackService.toggleLikeTrack(body, authData);
  }
}
