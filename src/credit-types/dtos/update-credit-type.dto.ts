import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  IsArray,
} from 'class-validator';

export class UpdateCreditTypeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minAmount?: number;

  @IsOptional()
  @IsNumber()
  maxAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  annualInterestRate?: number;

  @IsOptional()
  @IsArray()
  amortizationSystems?: string[]; // "FRENCH" o "GERMAN"
}
