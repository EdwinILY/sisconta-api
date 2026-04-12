import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, RequestStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  BiometricForceResult,
  BiometricValidationDto,
} from './dto/biometric-validation.dto';
import { CreateInvestmentRequestDto } from './dto/create-investment-request.dto';
import { InvestmentProductsService } from './investment-products.service';

@Injectable()
export class InvestmentRequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productsService: InvestmentProductsService,
  ) {}

  async create(dto: CreateInvestmentRequestDto) {
    if (!dto.acceptTerms) {
      throw new BadRequestException(
        'Debe aceptar terminos y condiciones para solicitar la inversion.',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    const product = await this.productsService.findOne(dto.productId);
    this.productsService.validateAmountAndTerm(
      product,
      dto.amount,
      dto.termMonths,
    );

    return this.prisma.investmentRequest.create({
      data: {
        userId: dto.userId,
        productId: dto.productId,
        amount: dto.amount,
        termMonths: dto.termMonths,
        status: RequestStatus.PENDING,
      },
      include: {
        user: { select: { id: true, email: true } },
        product: true,
      },
    });
  }

  async findOne(id: string) {
    const request = await this.prisma.investmentRequest.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true } },
        product: true,
        documents: true,
        biometricVerification: true,
      },
    });

    if (!request) {
      throw new NotFoundException('Solicitud de inversion no encontrada.');
    }
    return request;
  }

  async findAll() {
    return this.prisma.investmentRequest.findMany({
      include: {
        user: { select: { id: true, email: true } },
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async uploadDocument(id: string, type: string, fileUrl: string) {
    await this.findOne(id);

    await this.prisma.investmentDocument.create({
      data: {
        investmentRequestId: id,
        type,
        fileUrl,
      },
    });

    await this.prisma.investmentRequest.update({
      where: { id },
      data: {
        status: RequestStatus.DOCUMENTS_UPLOADED,
      },
    });

    return this.findOne(id);
  }

  async validateBiometric(id: string, dto: BiometricValidationDto) {
    const request = await this.findOne(id);

    const result = dto.forceResult ?? BiometricForceResult.SUCCESS;
    const isSuccessful = result === BiometricForceResult.SUCCESS;
    const metadata = dto.metadata as Prisma.InputJsonValue | undefined;

    await this.prisma.biometricVerification.upsert({
      where: { investmentRequestId: id },
      create: {
        investmentRequestId: id,
        status: result,
        modality: dto.modality ?? 'FACE',
        metadata,
        verifiedAt: isSuccessful ? new Date() : null,
      },
      update: {
        status: result,
        modality:
          dto.modality ?? request.biometricVerification?.modality ?? 'FACE',
        metadata,
        verifiedAt: isSuccessful ? new Date() : null,
      },
    });

    await this.prisma.investmentRequest.update({
      where: { id },
      data: {
        status: isSuccessful
          ? RequestStatus.BIOMETRIC_VALIDATED
          : RequestStatus.REJECTED,
      },
    });

    return this.findOne(id);
  }

  async updateStatus(id: string, status: RequestStatus) {
    await this.findOne(id);

    if (
      status !== RequestStatus.APPROVED &&
      status !== RequestStatus.REJECTED
    ) {
      throw new BadRequestException(
        'Solo se permite actualizar a APPROVED o REJECTED en este endpoint.',
      );
    }

    return this.prisma.investmentRequest.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { id: true, email: true } },
        product: true,
        documents: true,
        biometricVerification: true,
      },
    });
  }
}
