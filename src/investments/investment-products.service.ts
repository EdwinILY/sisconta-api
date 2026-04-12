import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvestmentProductDto } from './dto/create-investment-product.dto';
import { SimulateInvestmentDto } from './dto/simulate-investment.dto';
import { UpdateInvestmentProductDto } from './dto/update-investment-product.dto';

@Injectable()
export class InvestmentProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateInvestmentProductDto) {
    this.validateProductRanges(
      dto.minAmount,
      dto.maxAmount,
      dto.minTermMonths,
      dto.maxTermMonths,
    );

    return this.prisma.investmentProduct.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.investmentProduct.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.investmentProduct.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Producto de inversion no encontrado.');
    }

    return product;
  }

  async update(id: string, dto: UpdateInvestmentProductDto) {
    const existing = await this.findOne(id);

    const minAmount = dto.minAmount ?? existing.minAmount;
    const maxAmount = dto.maxAmount ?? existing.maxAmount;
    const minTermMonths = dto.minTermMonths ?? existing.minTermMonths;
    const maxTermMonths = dto.maxTermMonths ?? existing.maxTermMonths;

    this.validateProductRanges(
      minAmount,
      maxAmount,
      minTermMonths,
      maxTermMonths,
    );

    return this.prisma.investmentProduct.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.investmentProduct.delete({
      where: { id },
    });
  }

  async simulate(productId: string, dto: SimulateInvestmentDto) {
    const product = await this.findOne(productId);

    const amountInRange =
      dto.amount >= product.minAmount && dto.amount <= product.maxAmount;

    const termInRange =
      dto.termMonths >= product.minTermMonths &&
      dto.termMonths <= product.maxTermMonths;

    const outOfMargin = !amountInRange || !termInRange;

    if (outOfMargin && !product.allowOutOfMargin) {
      throw new BadRequestException(
        `Los parametros estan fuera de rango. Monto permitido: ${product.minAmount} - ${product.maxAmount}. Plazo permitido: ${product.minTermMonths} - ${product.maxTermMonths} meses.`,
      );
    }

    const monthlyRate = product.annualRate / 100 / 12;
    const schedule = this.buildProjection(
      dto.amount,
      dto.termMonths,
      monthlyRate,
    );
    const maturityAmount = schedule[schedule.length - 1]?.finalBalance ?? dto.amount;
    const totalInterest = maturityAmount - dto.amount;

    return {
      productId: product.id,
      productName: product.name,
      purpose: product.purpose,
      amount: dto.amount,
      termMonths: dto.termMonths,
      annualRate: product.annualRate,
      monthlyRate: Number(monthlyRate.toFixed(6)),
      capitalizationFreq: product.capitalizationFreq,
      allowOutOfMargin: product.allowOutOfMargin,
      outOfMargin,
      warnings: outOfMargin
        ? [
            'La simulacion se encuentra fuera de los rangos configurados para este producto.',
          ]
        : [],
      maturityAmount: Number(maturityAmount.toFixed(2)),
      totalInterest: Number(totalInterest.toFixed(2)),
      projection: schedule,
      configuredRange: {
        minAmount: product.minAmount,
        maxAmount: product.maxAmount,
        minTermMonths: product.minTermMonths,
        maxTermMonths: product.maxTermMonths,
      },
    };
  }

  validateAmountAndTerm(
    product: {
      minAmount: number;
      maxAmount: number;
      minTermMonths: number;
      maxTermMonths: number;
      allowOutOfMargin: boolean;
    },
    amount: number,
    termMonths: number,
  ) {
    const amountInRange =
      amount >= product.minAmount && amount <= product.maxAmount;

    const termInRange =
      termMonths >= product.minTermMonths &&
      termMonths <= product.maxTermMonths;

    if ((!amountInRange || !termInRange) && !product.allowOutOfMargin) {
      throw new BadRequestException(
        `Los parametros estan fuera de rango. Monto permitido: ${product.minAmount} - ${product.maxAmount}. Plazo permitido: ${product.minTermMonths} - ${product.maxTermMonths} meses.`,
      );
    }

    return {
      amountInRange,
      termInRange,
      outOfMargin: !amountInRange || !termInRange,
    };
  }

  private buildProjection(
    amount: number,
    termMonths: number,
    monthlyRate: number,
  ) {
    const projection: Array<{
      month: number;
      initialBalance: number;
      interest: number;
      finalBalance: number;
    }> = [];

    let balance = amount;

    for (let month = 1; month <= termMonths; month++) {
      const initialBalance = balance;
      const interest = initialBalance * monthlyRate;
      const finalBalance = initialBalance + interest;

      projection.push({
        month,
        initialBalance: Number(initialBalance.toFixed(2)),
        interest: Number(interest.toFixed(2)),
        finalBalance: Number(finalBalance.toFixed(2)),
      });

      balance = finalBalance;
    }

    return projection;
  }

  private validateProductRanges(
    minAmount: number,
    maxAmount: number,
    minTermMonths: number,
    maxTermMonths: number,
  ) {
    if (minAmount > maxAmount) {
      throw new BadRequestException(
        'El monto minimo no puede ser mayor al monto maximo.',
      );
    }

    if (minTermMonths > maxTermMonths) {
      throw new BadRequestException(
        'El plazo minimo no puede ser mayor al plazo maximo.',
      );
    }
  }
}
