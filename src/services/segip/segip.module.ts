import { Module } from "@nestjs/common";
import { SegipService } from "./segip.service";
import { HttpModule } from "@nestjs/axios";
import { SegipController } from "./segip.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SegipEntity } from "./entities/segip.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([SegipEntity]),
    HttpModule
  ],
  controllers: [SegipController],
  providers: [SegipService],
  exports: [SegipService]
})
export class SegipModule { }