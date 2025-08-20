import { HttpService } from "@nestjs/axios";
import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SegipBody } from "./segip.interface";
import { Repository } from "typeorm";
import { SegipEntity } from "./entities/segip.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { normalizeDate } from "../../common/dateParser"

const logger = new Logger('SEGIP')

@Injectable()
export class SegipService {
  constructor(
    private readonly httpService: HttpService,
    private config: ConfigService,
    @InjectRepository(SegipEntity)
    private readonly segipRepository: Repository<SegipEntity>,
  ) { }

  async searchSegip(body: SegipBody): Promise<SegipEntity> {
    const { url, token } = this.config.get('segip');

    try {
      const response = await this.httpService.axiosRef.post(
        url,
        body,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data;
    }
    catch (error) {
      logger.log(`Error en la consulta a SEGIP para la persona con CI ${body.ced}`)
      throw new BadRequestException(`Error en la consulta a SEGIP para la persona con CI ${body.ced}`)
    }
  }

  private async actualizarSegip(body: SegipBody): Promise<SegipEntity> {
    const { ced } = body;
    const respuestaSegip = await this.searchSegip(body)
    const parsedDate = normalizeDate(respuestaSegip.FechaNacimiento.toString())
    if (respuestaSegip) {
      await this.segipRepository.update(
        { NumeroDocumento: ced }, {
        ...respuestaSegip,
        FechaNacimiento: String(parsedDate),
        fecha_actualizacion: new Date()
      }
      )
      logger.log(`Consulta a SEGIP, actualizacion a persona con CI: ${ced}`)
      return (await this.findOneByCI(body))!
    } else {
      throw new NotFoundException(`No se obtuvieron resultados para persona con CI: ${ced}`)
    }
  }

  private async registrarSegip(body: SegipBody): Promise<SegipEntity> {
    const { ced } = body;
    const respuestaSegip = await this.searchSegip(body);
    const parsedDate = normalizeDate(respuestaSegip.FechaNacimiento.toString())
    if (respuestaSegip) {
      const guardarSegip = this.segipRepository.create({
        ...respuestaSegip,
        FechaNacimiento: String(parsedDate),
        fecha_creacion: new Date(),
        fecha_actualizacion: new Date()
      })
      logger.log(`Consulta a SEGIP, se registra nueva persona con CI: ${ced}`)
      return await this.segipRepository.save(guardarSegip)
    } else {
      throw new NotFoundException(`No se obtuvieron resultados para persona con CI: ${ced}`)
    }
  }

  private async findOneByCI(body: SegipBody): Promise<SegipEntity | null> {
    const { ced } = body;
    return await this.segipRepository.findOne({
      where: { NumeroDocumento: ced }
    });
  }

  private async segipEstaActualizado(fechaActualizacion: Date): Promise<boolean> {

    const ultimaActualizacion = new Date(fechaActualizacion);
    const ahora = new Date();

    const diferenciaMs = ahora.getTime() - ultimaActualizacion.getTime();
    const diferenciaDias = diferenciaMs / (1000 * 60 * 60 * 24);

    return diferenciaDias <= 30
  }

  async consultaSegip(body: SegipBody): Promise<SegipEntity> {

    const resultadoSegip = await this.findOneByCI(body);

    if (resultadoSegip !== null) {
      if (await this.segipEstaActualizado(resultadoSegip.fecha_actualizacion)) {
        logger.log(`Consulta a SEGIP ya existente la persona con CI: ${resultadoSegip.NumeroDocumento}`)
        return resultadoSegip;
      } else {
        return await this.actualizarSegip(body)
      }
    } else {
      return await this.registrarSegip(body)
    }
  }
}
