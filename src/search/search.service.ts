import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from './entities/log.entity';
import { Repository } from 'typeorm';
import { SearchRequestDto, SujetoDto } from './dto/create-search.dto';
import { v4 as uuidv4 } from 'uuid';
import { segip, itv, sinarap, anhVehiculo, anhCargaCombustible } from '../mock';
import { SegipService } from 'src/services/segip/segip.service';
import { SinarapService } from 'src/services/sinarap/sinarap.service';
import { ItvService } from 'src/services/itv/itv.service';
import { SegipBody } from 'src/services/segip/segip.interface';
import { ItvBody } from 'src/services/itv/itv.interface';
import { AntecedenteNormalizado, RespuestaSinarap, RespuestaSinarapNormalizada, SinarapBody } from 'src/services/sinarap/sinarap.interface';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Log)
    private readonly logRepo: Repository<Log>,
    private readonly segipService: SegipService,
    private readonly sinarapService: SinarapService,
    private readonly itvService: ItvService,
  ) {}

  async processSearch(dto: SearchRequestDto) {
    const { sujeto, sistemas, numero_caso } = dto;
    const { tipo } = sujeto;

    const result: any = {
      tipo,
      ...(sujeto.tipo === 'persona'
        ? { ci: sujeto.ci }
        : { placa: sujeto.placa }),
    };

    if (tipo === 'persona') {
      if (sistemas.segip) {
        try {
          const segip: SegipBody = {
            ced: sujeto.ci!,
            com: '',
            nom: '',
            pat: '',
            mat: ''
          }
          const segipData = await this.segipService.searchSegip(segip)
          if (!segipData) throw new Error('No SEGIP records found');
          result.segip = segipData;
        } catch (err) {
          console.log(err)
          result.segip = {
            message: 'No SEGIP records found for this person.',
          };
        }
        await this.saveLog(dto, sujeto, 'SEGIP');
      }

      if (sistemas.sinarap) {
        try {
          const sinarap: SinarapBody = {
            numero_documento: sujeto.ci!,
            complemento: ''
          }

          const sinarapData = await this.sinarapService.searchSinarap(sinarap);
          console.log(sinarapData)
          if (!sinarapData) throw new Error('No SINARAP records found');
          result.sinarap = this.transformSinarapApiResponse(sinarapData.data);
        } catch (err) {
          result.sinarap = {
            message: 'No SINARAP records found for this person.',
          };
        }
        await this.saveLog(dto, sujeto, 'SINARAP');
      }
    } else if (tipo === 'vehiculo') {
      if (sistemas.itv) {
        try {
          const itv: ItvBody = {
            dato: sujeto.placa!
          }
          const itvData = await this.itvService.searchItv(itv)
          if (!itvData) throw new Error('No ITV records found');
          result.itv = itvData;
        } catch (err) {
          console.log(err)
          result.itv = { message: 'No ITV records found for this vehicle.' };
        }
        await this.saveLog(dto, sujeto, 'ITV');
      }

      if (sistemas.anh) {
        result.anh = {};

        if (sujeto.carguio_combustible) {
          try {
            const anhCargas = anhCargaCombustible.find(
              (item) => item.placa === sujeto.placa,
            );
            if (!anhCargas) throw new Error('No ANH records found');
            result.anh.cargas_combustible = anhCargas;
          } catch (err) {
            console.log(err);
            result.anh = {
              message: 'No ANH records found for this vehicle.',
            };
          }
          await this.saveLog(dto, sujeto, 'ANH');
        } else {
          try {
            const anhVehicle = anhVehiculo.find(
              (item) => item.placa === sujeto.placa,
            );
            if (!anhVehicle) throw new Error('No ANH records found');
            result.anh.vehiculo = anhVehicle;
          } catch (err) {
            result.anh = {
              message: 'No ANH records found for this vehicle.',
            };
          }
          await this.saveLog(dto, sujeto, 'ANH');
        }
      }
    }

    return {
      numero_caso,
      result,
    };
  }

  private async saveLog(
    dto: SearchRequestDto,
    sujeto: SujetoDto,
    sistema: string,
  ) {
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

  private transformSinarapApiResponse(sinarapResponse: RespuestaSinarap): RespuestaSinarapNormalizada {

  const antecedentes: AntecedenteNormalizado[] = [];

  for (const fuente of ['FELCC', 'FELCN', 'TRANSITO'] as const) {
    const lista = sinarapResponse.antecedentes[fuente] || [];
    for (const item of lista) {
      antecedentes.push({
        fuente,
        hecho: item.hecho,
        detalle: item.detalle,
        fecha: item.fecha,
      });
    }
  }

  return {
    numero_documento: sinarapResponse.numero_documento,
    complemento: sinarapResponse.complemento,
    nombres: sinarapResponse.nombres,
    paterno: sinarapResponse.paterno,
    materno: sinarapResponse.materno,
    fecha_nacimiento: sinarapResponse.fecha_nacimiento,
    antecedentes,
  };
}
}

