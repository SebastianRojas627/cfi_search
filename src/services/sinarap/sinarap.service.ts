import { HttpService } from "@nestjs/axios";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SinarapBody } from "./sinarap.interface";

const logger = new Logger('SINARAP');

@Injectable()
export class SinarapService {
  constructor(
    private readonly httpService: HttpService,
    private config: ConfigService,
  ) { }

  async searchSinarap(body: SinarapBody) {
    const { url } = this.config.get('sinarap');

    try {
      const response = await this.httpService.axiosRef.post(
        url,
        body,
      );

      return response.data;
    }
    catch (error) {
      logger.log(`Error en la consulta a SINARAP para la persona con CI ${body.numero_documento}`)
      throw new BadRequestException(`Error en la consulta a SINARAP para la persona con CI ${body.numero_documento}`)
    }
  }
}
