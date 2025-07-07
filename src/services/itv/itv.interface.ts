import { ApiPropertyOptional } from "@nestjs/swagger";

export class ItvBody {
  @ApiPropertyOptional()
  dato: string;
}
