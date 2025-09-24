import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SegipService } from '../segip/segip.service';
import { SinarapBody } from './sinarap.interface';
import { SinarapService } from './sinarap.service';

@Controller('sinarap')
export class SinarapController {
  constructor(private readonly sinarapService: SinarapService) {}

  // @Post()
  // create(@Body() body: SinarapBody) {
  //   return this.sinarapService.searchSinarap(body);
  // }
}
