import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCreditTypeDto } from './dtos/create-credit-type.dto';
import { UpdateCreditTypeDto } from './dtos/update-credit-type.dto';

@Injectable()
export class CreditTypesService {
  constructor(private prisma: PrismaService) {}

  async create(createCreditTypeDto: CreateCreditTypeDto) {
    return this.prisma.creditType.create({
      data: createCreditTypeDto,
      include: {
        indirectCharges: true,
      },
    });
  }

  async findAll() {
    return this.prisma.creditType.findMany({
      include: {
        indirectCharges: true,
      },
    });
  }

  async findOne(id: string) {
    const creditType = await this.prisma.creditType.findUnique({
      where: { id },
      include: {
        indirectCharges: true,
      },
    });

    if (!creditType) {
      throw new NotFoundException('Tipo de crédito no encontrado');
    }

    return creditType;
  }

  async update(id: string, updateCreditTypeDto: UpdateCreditTypeDto) {
    await this.findOne(id); // Verificar que existe

    return this.prisma.creditType.update({
      where: { id },
      data: updateCreditTypeDto,
      include: {
        indirectCharges: true,
      },
    });
  }

  async delete(id: string) {
    await this.findOne(id); // Verificar que existe

    return this.prisma.creditType.delete({
      where: { id },
    });
  }
}
