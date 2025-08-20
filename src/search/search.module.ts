import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './entities/log.entity';
import { SegipModule } from 'src/services/segip/segip.module';
import { ItvModule } from 'src/services/itv/itv.module';
import { SinarapModule } from 'src/services/sinarap/sinarap.module';
import { HttpServiceWrapper } from 'src/core/services/http.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
      TypeOrmModule.forFeature([Log]),
      SegipModule,
      ItvModule,
      SinarapModule,
      HttpModule
    ],
  controllers: [SearchController],
  providers: [SearchService, HttpServiceWrapper],
})
export class SearchModule {}
