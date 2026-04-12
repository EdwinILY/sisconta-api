import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  IsBoolean,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ChargeType } from '@prisma/client';

export class CreateChargeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  type: ChargeType; // FIXED o PERCENTAGE

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  value: number;

  @IsOptional()
  @IsBoolean()
  mandatory?: boolean;

  @IsNotEmpty()
  @IsUUID()
  creditTypeId: string;
}
