import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { SinarapService } from "./sinarap.service";
import { SinarapController } from "./sinarap.controller";

@Module({
  imports: [HttpModule],
  controllers: [SinarapController],
  providers: [SinarapService],
  exports: [SinarapService]
})
export class SinarapModule {}