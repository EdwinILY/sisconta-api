import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  Max,
  IsArray,
  IsUUID,
} from 'class-validator';

export class CreateCreditTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  minAmount: number;

  @IsNotEmpty()
  @IsNumber()
  maxAmount: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  annualInterestRate: number;

  @IsNotEmpty()
  @IsArray()
  amortizationSystems: string[]; // "FRENCH" o "GERMAN"

  @IsNotEmpty()
  @IsUUID()
  institutionId: string;
}
