import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';

export enum BiometricForceResult {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export class BiometricValidationDto {
  @ApiProperty({ example: 'FACE', required: false })
  @IsOptional()
  @IsString()
  modality?: string;

  @ApiProperty({ required: false, enum: BiometricForceResult })
  @IsOptional()
  @IsEnum(BiometricForceResult)
  forceResult?: BiometricForceResult;

  @ApiProperty({
    required: false,
    example: {
      confidence: 0.98,
      provider: 'mock-provider',
    },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
