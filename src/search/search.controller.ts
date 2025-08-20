import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchRequestDto } from './dto/create-search.dto';
import { SegipBody } from 'src/services/segip/segip.interface';
import { ItvBody } from 'src/services/itv/itv.interface';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) { }

  @Post()
  async create(@Body() createSearchDto: SearchRequestDto) {
    return await this.searchService.processSearch(createSearchDto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/persona')
  async persona(@Body() body: SegipBody) {
    return await this.searchService.personaSearch(body);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/vehiculo')
  async vehiculo(@Body() body: ItvBody) {
    return await this.searchService.vehiculoSearch(body);
  }

}
