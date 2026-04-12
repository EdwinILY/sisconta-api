import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsBoolean,
} from 'class-validator';
import { ChargeType } from '@prisma/client';

export class UpdateChargeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  type?: ChargeType; // FIXED o PERCENTAGE

  @IsOptional()
  @IsNumber()
  @Min(0)
  value?: number;

  @IsOptional()
  @IsBoolean()
  mandatory?: boolean;
}
