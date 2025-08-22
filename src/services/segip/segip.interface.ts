import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SegipBody {
  @ApiProperty({ default: '' })
  ced: string;

  @ApiProperty({ default: '' })
  com: string;

  /*
  @ApiProperty({ default: '' })
  nom: string;

  @ApiProperty({ default: '' })
  pat: string;

  @ApiProperty({ default: '' })
  mat: string;
  */
}
