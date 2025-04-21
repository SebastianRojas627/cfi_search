import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from './entities/log.entity';
import { Repository } from 'typeorm';
import { SearchRequestDto, SujetoDto } from './dto/create-search.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Log)
    private readonly logRepo: Repository<Log>,
  ) {}

  async processSearch(dto: SearchRequestDto) {
    const results: any[] = [];

    for (const sujeto of dto.sujetos) {
      const result: any = { tipo: sujeto.tipo, placa: sujeto.placa, ci: sujeto.ci };

      if (sujeto.tipo === 'persona') {
        if (dto.sistemas.segip) {
          result.segip = this.getMockSegip(sujeto);
          await this.saveLog(dto, sujeto, 'SEGIP');
        }
        if (dto.sistemas.sinarap) {
          result.sinarap = this.getMockSinarap(sujeto);
          await this.saveLog(dto, sujeto, 'SINARAP');
        }
      } else if (sujeto.tipo === 'vehiculo' && dto.sistemas.itv) {
        result.itv = this.getMockITV(sujeto);
        await this.saveLog(dto, sujeto, 'ITV');
      }

      results.push(result);
    }

    return results;
  }

  private async saveLog(dto: SearchRequestDto, sujeto: SujetoDto, sistema: string) {
    const log = this.logRepo.create({
      log_id: uuidv4(),
      numero_caso: dto.numero_caso,
      investigador: dto.investigador,
      tipo: sujeto.tipo,
      nombres: sujeto.nombres,
      apellido_paterno: sujeto.apellido_paterno,
      apellido_materno: sujeto.apellido_materno,
      ci: sujeto.ci,
      placa: sujeto.placa,
      sistema,
    });
    await this.logRepo.save(log);
  }

  // MOCKS
  private getMockSegip(sujeto: SujetoDto) {
    return {
      Nombres: sujeto.nombres ?? 'JHERY',
      PrimerApellido: sujeto.apellido_paterno ?? 'CHAVEZ',
      SegundoApellido: sujeto.apellido_materno ?? 'APAZA',
      NumeroDocumento: sujeto.ci ?? '10691042',
      Genero: 'MASCULINO',
      FechaNacimiento: '11/11/2000',
      Nacionalidad: 'BOLIVIANO',
    };
  }

  private getMockSinarap(sujeto: SujetoDto) {
    return {
      TRANSITO: 'NO SE ENCONTRARON REGISTROS',
      FELCC: [{
        Nombre: `${sujeto.nombres} ${sujeto.apellido_paterno} ${sujeto.apellido_materno}`,
        CI: sujeto.ci,
        FechaNacimiento: '13/08/1973',
        Caso: '52600',
        Fecha: '10/08/2000',
        Hecho: 'estafa y otros',
        Juzgado: 'P. J. GTIAS.',
      }],
      FELCN: 'NO SE ENCONTRARON REGISTROS',
      FELCV: 'NO SE ENCONTRARON REGISTROS',
      DIPROVE: 'NO SE ENCONTRARON REGISTROS',
    };
  }

  private getMockITV(sujeto: SujetoDto) {
    return {
      datos_tecnicos: {
        placa: sujeto.placa,
        marca: 'TOYOTA',
        modelo: '2008',
        industria: 'JAPON',
        clase: 'VAGONETA',
        servicio: 'PARTICULAR',
        tipo_vehiculo: 'LAND CRUISER PRADO',
        color: 'ROJO OSCURO MICA',
        cilindrada: '2694',
        chasis: 'JTEBL29J905088245',
        motor: '2TR0515813',
        radicatoria: 'LA PAZ',
      },
    };
  }
}
