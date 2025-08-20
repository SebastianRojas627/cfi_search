import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItvService } from './itv.service';
import { ItvBody } from './itv.interface';

@Controller('itv')
export class ItvController {
  constructor(private readonly itvService: ItvService) {}

   @Post()
   create(@Body() body: ItvBody) {
     return this.itvService.searchItv(body);
   }
}
