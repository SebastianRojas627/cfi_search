import { ApiPropertyOptional } from "@nestjs/swagger";
import { ItvEntity } from "./entities/itv.entity";
import { OwnerItv } from "./entities/itv-owner.entity";

export class ItvBody {
  @ApiPropertyOptional()
  dato: string;
}
