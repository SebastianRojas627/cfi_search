import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './entities/log.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([Log]),
    ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
