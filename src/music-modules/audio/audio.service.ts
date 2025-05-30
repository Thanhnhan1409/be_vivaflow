import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAudioDto } from './dto/create-audio.dto';
import { UpdateAudioUrlDto } from './dto/update-audio.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AudioService {
  constructor(private prisma: PrismaService) {}
  create(createAudioDto: CreateAudioDto) {
    return 'This action adds a new audio';
  }

  findAll() {
    return `This action returns all audio`;
  }

  findOne(id: number) {
    return `This action returns a #${id} audio`;
  }

  remove(id: number) {
    return `This action removes a #${id} audio`;
  }

  async getLabelFromAudio() {
    const audios = await this.prisma.audio.findMany({
      select: {
        label: true,
      },
    });
  
    return audios.map(audio => {
      const label = audio.label || "";
      const parts = label.split("->");
      return parts[1]?.trim() || "";
    });
  }

  async updateAudioUrlByTrackId(trackId: number, body: UpdateAudioUrlDto) {
    const track = await this.prisma.track.findUnique({
      where: { id: Number(trackId) },
      select: { audioId: true },
    });
  
    if (!track || !track.audioId) {
      throw new NotFoundException('Track hoặc audio không tồn tại');
    }
    await this.prisma.audio.update({
      where: { id: track.audioId },
      data: { fullUrl: body.url },
    });
  
    return { success: true, audioId: track.audioId, fullUrl: body.url };
  }
}
