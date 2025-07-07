import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ItvBody } from "./itv.interface";

@Injectable()
export class ItvService {
  constructor(
    private readonly httpService: HttpService,
    private config: ConfigService,
  ) {}

  async searchItv(body: ItvBody) {
    const { url, token } = this.config.get('itv');

    const response = await this.httpService.axiosRef.post(
      url,
      body,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return response.data;
  }
}
