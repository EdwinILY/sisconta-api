import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadInvestmentDocumentDto {
  @ApiProperty({ example: 'IDENTITY' })
  @IsString()
  @IsNotEmpty()
  type: string;
}
