import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateInvestmentProductDto {
  @ApiProperty({ example: 'Ahorro Vacacional' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Fondo para vacaciones', required: false })
  @IsOptional()
  @IsString()
  purpose?: string;

  @ApiProperty({ example: 300 })
  @IsNumber()
  @Min(0)
  minAmount: number;

  @ApiProperty({ example: 20000 })
  @IsNumber()
  @Min(0)
  maxAmount: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(1)
  minTermMonths: number;

  @ApiProperty({ example: 36 })
  @IsInt()
  @Min(1)
  maxTermMonths: number;

  @ApiProperty({ example: 7.5, description: 'Tasa anual en porcentaje' })
  @IsNumber()
  @Min(0)
  @Max(100)
  annualRate: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  allowOutOfMargin?: boolean;

  @ApiProperty({ example: 'MONTHLY', required: false })
  @IsOptional()
  @IsString()
  capitalizationFreq?: string;
}
