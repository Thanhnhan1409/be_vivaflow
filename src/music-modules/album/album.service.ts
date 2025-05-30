import { Injectable } from '@nestjs/common';
import { PlainToInstance } from 'src/helpers';
import { PrismaService } from 'src/prisma/prisma.service';
import { Album, AlbumWithForeign, AlbumWithTrack } from './entities/album.entity';
// import { CreateAlbumDto } from './dto/create-album.dto';
// import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}
  // create(createAlbumDto: CreateAlbumDto) {
  //   return 'This action adds a new album';
  // }

  async findAll(page = 1, limit = 10) {
    const skip = (Number(page) - 1) * Number(limit);

    const [albums, total] = await this.prisma.$transaction([
      this.prisma.album.findMany({
        skip,
        take: Number(limit),
        include: { artist: true },
        orderBy: { temp_popularity: 'desc' },
      }),
      this.prisma.album.count(),
    ]);

    return {
      data: PlainToInstance(Album, albums),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const album = await this.prisma.album.findFirstOrThrow({
      where: { id: Number(id) },
    });

    return PlainToInstance(Album, album);
  }

  async findOneWithTrack(id: number) {
    const album = await this.prisma.album.findFirstOrThrow({
      where: { id: Number(id) },
      include: {
        tracks: {
          include: {
            album: {
              select: {
                coverImageUrl: true,
              },
            },
            audio: {
              select: {
                fullUrl: true,
              },
            },
          },
        },
      },
    });

    return PlainToInstance(AlbumWithTrack, {
      ...album,
      tracks: album.tracks.map((track) => ({
        ...track,
        coverImageUrl: track.album?.coverImageUrl || null,
        fullUrl: track.audio?.fullUrl || null,
      })),
    });
  }

  async findOneWithForeign(id: number) {
    const album = this.prisma.album.findFirstOrThrow({
      where: { id: Number(id) },
      include: { artist: true, tracks: true },
    });

    return PlainToInstance(AlbumWithForeign, album);
  }

  // update(id: number, updateAlbumDto: UpdateAlbumDto) {
  //   return `This action updates a #${id} album`;
  // }

  remove(id: number) {
    return `This action removes a #${id} album`;
  }
}
