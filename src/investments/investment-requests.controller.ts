import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { RequestStatus } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BiometricValidationDto } from './dto/biometric-validation.dto';
import { CreateInvestmentRequestDto } from './dto/create-investment-request.dto';
import { UpdateInvestmentRequestStatusDto } from './dto/update-investment-request-status.dto';
import { UploadInvestmentDocumentDto } from './dto/upload-investment-document.dto';
import { InvestmentRequestsService } from './investment-requests.service';

@ApiTags('Investment Requests')
@Controller('investment-requests')
export class InvestmentRequestsController {
  constructor(private readonly requestsService: InvestmentRequestsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear solicitud de inversion (cliente)' })
  create(@Body() dto: CreateInvestmentRequestDto) {
    return this.requestsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar solicitudes de inversion' })
  findAll() {
    return this.requestsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una solicitud de inversion' })
  findOne(@Param('id') id: string) {
    return this.requestsService.findOne(id);
  }

  @Post(':id/documents')
  @ApiOperation({ summary: 'Subir documento para solicitud de inversion' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        type: { type: 'string', example: 'IDENTITY' },
        file: { type: 'string', format: 'binary' },
      },
      required: ['type', 'file'],
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadDocument(
    @Param('id') id: string,
    @Body() dto: UploadInvestmentDocumentDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Debe adjuntar un archivo.');
    }

    return this.requestsService.uploadDocument(
      id,
      dto.type,
      `/uploads/investments/${file.filename}`,
    );
  }

  @Post(':id/biometric-validation')
  @ApiOperation({ summary: 'Validacion biometrica mock de la solicitud' })
  validateBiometric(
    @Param('id') id: string,
    @Body() dto: BiometricValidationDto,
  ) {
    return this.requestsService.validateBiometric(id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Actualizar estado final de solicitud (admin)' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateInvestmentRequestStatusDto,
  ) {
    const status = dto.status as RequestStatus;
    return this.requestsService.updateStatus(id, status);
  }
}
