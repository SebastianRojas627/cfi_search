import { Module } from '@nestjs/common';
import { SearchModule } from './search/search.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SegipModule } from './services/segip/segip.module';
import externalApisConfig from './config/external-apis.config';
import { ItvModule } from './services/itv/itv.module';
import { SinarapModule } from './services/sinarap/sinarap.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      load: [externalApisConfig], 
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true
    }),

    SearchModule,
    SegipModule,
    ItvModule,
    SinarapModule,
    CoreModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
