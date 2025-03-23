import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AuthTokenEntity {
  @Expose()
  @ApiProperty({ type: String })
  accessToken: string;

  @Expose()
  @ApiProperty({ type: String })
  refreshToken: string;
}

export class AuthPayload {
  @Expose()
  @ApiProperty({ type: Number })
  id: number;

  @Expose()
  @ApiProperty({ type: String })
  email: string;

  @Expose()
  @ApiProperty({ type: String })
  username: string;
}
