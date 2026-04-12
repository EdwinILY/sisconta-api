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

  create(dto: CreateInvestmentProductDto) {
    this.validateProductRanges(
      dto.minAmount,
      dto.maxAmount,
      dto.minTermMonths,
      dto.maxTermMonths,
    );
    return this.prisma.investmentProduct.create({ data: dto });
  }

  findAll() {
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

  async simulate(productId: string, dto: SimulateInvestmentDto) {
    const product = await this.findOne(productId);
    this.validateAmountAndTerm(product, dto.amount, dto.termMonths);

    const monthlyRate = product.annualRate / 100 / 12;
    const maturityAmount = dto.amount * (1 + monthlyRate) ** dto.termMonths;
    const totalInterest = maturityAmount - dto.amount;

    return {
      productId: product.id,
      productName: product.name,
      amount: dto.amount,
      termMonths: dto.termMonths,
      annualRate: product.annualRate,
      monthlyRate,
      maturityAmount: Number(maturityAmount.toFixed(2)),
      totalInterest: Number(totalInterest.toFixed(2)),
      capitalizationFreq: product.capitalizationFreq,
      allowOutOfMargin: product.allowOutOfMargin,
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
    if (product.allowOutOfMargin) {
      return;
    }

    const amountInRange =
      amount >= product.minAmount && amount <= product.maxAmount;
    const termInRange =
      termMonths >= product.minTermMonths &&
      termMonths <= product.maxTermMonths;
    if (!amountInRange || !termInRange) {
      throw new BadRequestException(
        `Los parametros estan fuera de rango. Monto: ${product.minAmount} - ${product.maxAmount}, plazo: ${product.minTermMonths} - ${product.maxTermMonths}.`,
      );
    }
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
