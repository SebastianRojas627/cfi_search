import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ItvService } from "./itv.service";
import { ItvController } from "./itv.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ItvEntity } from "./entities/itv.entity";
import { OwnerItv } from "./entities/itv-owner.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([ItvEntity, OwnerItv]),
    HttpModule
  ],
  controllers: [ItvController],
  providers: [ItvService],
  exports: [ItvService]
})
export class ItvModule { }