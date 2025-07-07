import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ItvService } from "./itv.service";
import { ItvController } from "./itv.controller";

@Module({
  imports: [HttpModule],
  controllers: [ItvController],
  providers: [ItvService],
  exports: [ItvService]
})
export class ItvModule {}