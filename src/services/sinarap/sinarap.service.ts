import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SinarapBody } from "./sinarap.interface";

@Injectable()
export class SinarapService {
  constructor(
    private readonly httpService: HttpService,
    private config: ConfigService,
  ) {}

  async searchSinarap(body: SinarapBody) {
    const { url } = this.config.get('sinarap');

    const response = await this.httpService.axiosRef.post(
      url,
      body,
    );

    return response.data;
  }
}
