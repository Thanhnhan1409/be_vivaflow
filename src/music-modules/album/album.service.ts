import { Injectable } from '@nestjs/common';
import { PlainToInstance } from 'src/helpers';
import { PrismaService } from 'src/prisma/prisma.service';
import { Album } from './entities/album.entity';
// import { CreateAlbumDto } from './dto/create-album.dto';
// import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}
  // create(createAlbumDto: CreateAlbumDto) {
  //   return 'This action adds a new album';
  // }

  findAll() {
    return `This action returns all album`;
  }

  findOne(id: number) {
    const album = this.prisma.album.findFirstOrThrow({
      where: { id },
    });

    return PlainToInstance(Album, album);
  }

  findOneWithTrack(id: number) {
    const album = this.prisma.album.findFirstOrThrow({
      where: { id },
      include: { tracks: true },
    });

    return PlainToInstance(Album, album);
  }

  findOneWithForeign(id: number) {
    const album = this.prisma.album.findFirstOrThrow({
      where: { id },
      include: { artist: true, tracks: true },
    });

    return PlainToInstance(Album, album);
  }

  // update(id: number, updateAlbumDto: UpdateAlbumDto) {
  //   return `This action updates a #${id} album`;
  // }

  remove(id: number) {
    return `This action removes a #${id} album`;
  }
}
