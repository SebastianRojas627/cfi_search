import { Module } from "@nestjs/common";
import { SegipService } from "./segip.service";
import { HttpModule } from "@nestjs/axios";
import { SegipController } from "./segip.controller";

@Module({
  imports: [HttpModule],
  controllers: [SegipController],
  providers: [SegipService],
  exports: [SegipService]
})
export class SegipModule {}