import { ApiProperty } from '@nestjs/swagger';

export class SujetoDto {
  @ApiProperty({ enum: ['vehiculo', 'persona'] })
  tipo: 'vehiculo' | 'persona';

  @ApiProperty({ required: false })
  ci?: string;

  @ApiProperty({ required: false })
  complemento?: string;

  @ApiProperty({ required: false })
  placa?: string;

  /*
  @ApiProperty({ required: false })
  carguio_combustible?: boolean;

  @ApiProperty({ required: false })
  fechaini?: Date;

  @ApiProperty({ required: false })
  fechafin?: Date;
  */
}

export class SistemasDto {
  @ApiProperty()
  segip: boolean;

  @ApiProperty()
  sinarap: boolean;

  @ApiProperty()
  itv: boolean;

  // @ApiProperty()
  // anh: boolean;
}

export class SearchRequestDto {
  @ApiProperty()
  solicitud_informacion_id: string;

  @ApiProperty({ type: SujetoDto })
  sujeto: SujetoDto;

  @ApiProperty({ type: SistemasDto })
  sistemas: SistemasDto;
}
