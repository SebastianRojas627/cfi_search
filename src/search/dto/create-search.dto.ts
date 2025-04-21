import { ApiProperty } from '@nestjs/swagger';

export class SujetoDto {
  @ApiProperty({ enum: ['vehiculo', 'persona'] })
  tipo: 'vehiculo' | 'persona';

  @ApiProperty({ required: false })
  nombres?: string;

  @ApiProperty({ required: false })
  apellido_paterno?: string;

  @ApiProperty({ required: false })
  apellido_materno?: string;

  @ApiProperty({ required: false })
  ci?: string;

  @ApiProperty({ required: false })
  placa?: string;
}

export class SistemasDto {
  @ApiProperty()
  segip: boolean;

  @ApiProperty()
  sinarap: boolean;

  @ApiProperty()
  itv: boolean;
}

export class SearchRequestDto {
  @ApiProperty()
  numero_caso: number;

  @ApiProperty()
  investigador: string;

  @ApiProperty({ type: [SujetoDto] })
  sujetos: SujetoDto[];

  @ApiProperty({ type: SistemasDto })
  sistemas: SistemasDto;
}
