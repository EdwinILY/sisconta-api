import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Min } from 'class-validator';

export class SimulateInvestmentDto {
  @ApiProperty({ example: 5000 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: 12 })
  @IsInt()
  @Min(1)
  termMonths: number;
}
