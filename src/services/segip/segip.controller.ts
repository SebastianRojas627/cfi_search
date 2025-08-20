import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SegipService } from './segip.service';
import { SegipBody } from './segip.interface';

@Controller('segip')
export class SegipController {
  constructor(private readonly segipService: SegipService) { }

  @Post()
  async create(@Body() body: SegipBody) {
    return await this.segipService.searchSegip(body);
  }
}
