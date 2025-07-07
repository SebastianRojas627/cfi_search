import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export interface SegipBody {
  ced: string;
  com: string;
  nom: string;
  pat: string;
  mat: string;
}
