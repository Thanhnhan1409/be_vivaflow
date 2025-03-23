import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { TrackModule } from './music-modules/track/track.module';
import { AlbumModule } from './music-modules/album/album.module';
import { AudioModule } from './music-modules/audio/audio.module';
import { ArtistModule } from './artist/artist.module';
import { PlaylistModule } from './playlist/playlist.module';
import { UserModule } from './user/user.module';
import AppConfig from './config/configuration';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [AppConfig],
    }),
    AuthModule,
    TrackModule,
    AlbumModule,
    AudioModule,
    ArtistModule,
    PlaylistModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
