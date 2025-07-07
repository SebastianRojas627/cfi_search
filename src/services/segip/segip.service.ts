import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SegipBody } from "./segip.interface";

@Injectable()
export class SegipService {
  constructor(
    private readonly httpService: HttpService,
    private config: ConfigService,
  ) {}

  async searchSegip(body: SegipBody) {
    const { url, token } = this.config.get('segip');

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
