import { HttpService } from "@nestjs/axios";
import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ItvBody } from "./itv.interface";
import { Repository } from "typeorm";
import { ItvEntity } from "./entities/itv.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { normalizeDate } from "src/common/dateParser";
import { OwnerItv } from "./entities/itv-owner.entity";

const logger = new Logger('ITV')

@Injectable()
export class ItvService {
  constructor(
    private readonly httpService: HttpService,
    private config: ConfigService,
    @InjectRepository(ItvEntity)
    private readonly itvRepository: Repository<ItvEntity>,
    @InjectRepository(OwnerItv)
    private readonly ownerItvRepository: Repository<OwnerItv>
  ) { }

  async searchItv(body: ItvBody): Promise<ItvEntity> {
    const { url, token } = this.config.get('itv');

    try {
      const response = await this.httpService.axiosRef.post(
        url,
        body,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return response.data
    }
    catch (error) {
      logger.log(`Error en la consulta a ITV para el vehiculo con la placa ${body.dato}`)
      throw new BadRequestException(`Error en la consulta a ITV para el vehiculo con la placa ${body.dato}`)
    }
  }

  private async actualizarItv(body: ItvBody, oldRespuestaItv: ItvEntity): Promise<ItvEntity> {
    const { dato } = body;
    const respuestaItv = await this.searchItv(body);
    if (respuestaItv && oldRespuestaItv) {
      try {
        const { personas } = respuestaItv;
        const oldPersonas = oldRespuestaItv.personas;
        oldRespuestaItv.datos_tecnicos.fotografia = respuestaItv.datos_tecnicos.fotografia;
        oldRespuestaItv.fecha_actualizacion = new Date();


        const personasExistentesDB = oldPersonas.map((persona) => {
          return persona.gestion
        })

        const newPersonas = personas.filter((persona) => !(personasExistentesDB.includes(persona.gestion))).map((persona) => {
          const parsedDate = persona.fecha_nacimiento ? normalizeDate(persona.fecha_nacimiento.toString()) : null;
          return {
            ...persona,
            fecha_nacimiento: parsedDate ? new Date(parsedDate) : null,
          }
        })

        /*
        personas.forEach(async (persona) => {
          const { nro_documento } = persona;
          const parsedDate = persona.fecha_nacimiento ? normalizeDate(persona.fecha_nacimiento.toString()) : null;
          if (personasExistentesDB.includes(nro_documento)) {
            await this.ownerItvRepository.update(
              { nro_documento }, { ...persona, fecha_nacimiento: String(parsedDate) }
            )
          } else {
            const newOwner = this.ownerItvRepository.create({
              ...persona,
              fecha_nacimiento: parsedDate ? String(parsedDate) : null,
              owner_itv_id: respuesta_id
            })
            await this.ownerItvRepository.save(newOwner);
          }
        })
          */
        const updatedPersonas = [...oldPersonas, ...newPersonas];
        oldRespuestaItv.personas = updatedPersonas;
        await this.itvRepository.save(oldRespuestaItv);

        logger.log(`Consulta a ITV, actualizacion del vehiculo con placa: ${dato}`)
        const itvActualizado = await this.findOneByPlaca(body)
        return itvActualizado!
      }
      catch (error) {
        console.log(`Error en la consulta al vehiculo: ${body}`);
        console.error(error);
        return respuestaItv;
      }

    } else {
      throw new NotFoundException(`No se obtuvieron resultados para vehiculo con placa: ${dato}`)
    }
  }

  private async registrarItv(body: ItvBody): Promise<ItvEntity> {
    const { dato } = body;
    const respuestaItv = await this.searchItv(body);
    if (respuestaItv) {
      try {
        const { personas, ...datos_tecnicos } = respuestaItv;
        const updatedPersonas = personas.map((persona) => {
          const parsedDate = persona.fecha_nacimiento ? normalizeDate(persona.fecha_nacimiento.toString()) : null;
          return {
            ...persona,
            fecha_nacimiento: parsedDate ? String(parsedDate) : null,
          }
        })

        const guardarItv = await this.itvRepository.create({
          ...datos_tecnicos,
          personas: updatedPersonas,
          fecha_creacion: new Date(),
          fecha_actualizacion: new Date()
        });
        logger.log(`Consulta a ITV, se registro nuevo vehiculo con placa: ${dato}`)
        return await this.itvRepository.save(guardarItv);
      }
      catch (error) {
        console.log(`Error en la consulta al vehiculo: ${body}`);
        console.error(error);
        return respuestaItv;
      }
    } else {
      throw new NotFoundException(`No se obtuvieron resultados para vehiculo con placa: ${dato}`)
    }
  }

  private async itvEstaActualizado(fechaActualizacion: Date): Promise<boolean> {
    const ultimaActualizacion = new Date(fechaActualizacion);
    const ahora = new Date();

    const diferenciaMs = ahora.getTime() - ultimaActualizacion.getTime();
    const diferenciaDias = diferenciaMs / (1000 * 60 * 60 * 24)

    return diferenciaDias <= 60;
  }

  async findOneByPlaca(body: ItvBody): Promise<ItvEntity | null> {
    const { dato } = body;
    return await this.itvRepository.findOne({
      where: {
        datos_tecnicos: {
          placa: dato
        }
      }
    });
  }

  async consultaItv(body: ItvBody): Promise<ItvEntity> {
    const resultadoItv = await this.findOneByPlaca(body);

    if (resultadoItv !== null) {
      if (await this.itvEstaActualizado(resultadoItv.fecha_actualizacion)) {
        logger.log(`Se tiene actualizado al vehiculo con placa: ${resultadoItv.datos_tecnicos.placa}`)
        return resultadoItv;
      } else {
        return await this.actualizarItv(body, resultadoItv)
      }
    } else {
      return await this.registrarItv(body)
    }
  }
}
