import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateInvestmentRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 3000 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: 12 })
  @IsInt()
  @Min(1)
  termMonths: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  acceptTerms: boolean;
}
