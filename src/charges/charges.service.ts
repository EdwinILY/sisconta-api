import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChargeDto } from './dtos/create-charge.dto';
import { UpdateChargeDto } from './dtos/update-charge.dto';

@Injectable()
export class ChargesService {
  constructor(private prisma: PrismaService) {}

  async create(createChargeDto: CreateChargeDto) {
    return this.prisma.indirectCharge.create({
      data: createChargeDto,
    });
  }

  async findAll() {
    return this.prisma.indirectCharge.findMany();
  }

  async findByCreditType(creditTypeId: string) {
    return this.prisma.indirectCharge.findMany({
      where: { creditTypeId },
    });
  }

  async findOne(id: string) {
    const charge = await this.prisma.indirectCharge.findUnique({
      where: { id },
    });

    if (!charge) {
      throw new NotFoundException('Cargo indirecto no encontrado');
    }

    return charge;
  }

  async update(id: string, updateChargeDto: UpdateChargeDto) {
    await this.findOne(id); // Verificar que existe

    return this.prisma.indirectCharge.update({
      where: { id },
      data: updateChargeDto,
    });
  }

  async delete(id: string) {
    await this.findOne(id); // Verificar que existe

    return this.prisma.indirectCharge.delete({
      where: { id },
    });
  }
}
