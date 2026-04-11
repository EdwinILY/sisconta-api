import { ApiProperty } from '@nestjs/swagger';
import { RequestStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateInvestmentRequestStatusDto {
  @ApiProperty({ enum: [RequestStatus.APPROVED, RequestStatus.REJECTED] })
  @IsEnum(RequestStatus)
  status: RequestStatus;
}
