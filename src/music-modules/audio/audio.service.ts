import { Injectable } from '@nestjs/common';
import { CreateAudioDto } from './dto/create-audio.dto';
import { UpdateAudioDto } from './dto/update-audio.dto';
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

  update(id: number, updateAudioDto: UpdateAudioDto) {
    return `This action updates a #${id} audio`;
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
      return parts[1]?.trim() || ""; // Lấy phần sau "->"
    });
  }
}
