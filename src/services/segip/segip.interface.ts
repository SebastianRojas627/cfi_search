import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SegipBody {
  @ApiProperty()
  ced: string;
  @ApiProperty()
  com: string;
  @ApiProperty()
  nom: string;
  @ApiProperty()
  pat: string;
  @ApiProperty()
  mat: string;
}
