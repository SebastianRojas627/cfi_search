import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SinarapBody {
  @ApiPropertyOptional()
  numero_documento: string;
  @ApiPropertyOptional()
  complemento: string;
}

export interface RespuestaSinarap {
  numero_documento: string;
  complemento: string;
  nombres: string;
  paterno: string;
  materno?: string;
  fecha_nacimiento: Date;
  antecedentes: {
    FELCN: Antecedente[]
    FELCC: Antecedente[]
    TRANSITO: Antecedente[]
  };
}

export interface Antecedente {
  hecho: string | null;
  detalle: string | null;
  fecha: Date | null;
}

export interface RespuestaSinarapNormalizada {
  numero_documento: string;
  complemento: string;
  nombres: string;
  paterno: string;
  materno?: string;
  fecha_nacimiento: Date;
  antecedentes: AntecedenteNormalizado[];
}

export interface AntecedenteNormalizado {
  fuente: 'FELCC' | 'FELCN' | 'TRANSITO';
  hecho: string | null;
  detalle: string | null;
  fecha: Date | null;
}