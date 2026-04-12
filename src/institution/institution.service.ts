import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInstitutionDto } from './dtos/create-institution.dto';
import { UpdateInstitutionDto } from './dtos/update-institution.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class InstitutionService {
  private uploadDir = path.join(process.cwd(), 'uploads');

  constructor(private prisma: PrismaService) {
    // Crear la carpeta uploads si no existe
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async create(createInstitutionDto: CreateInstitutionDto) {
    return this.prisma.institution.create({
      data: createInstitutionDto,
    });
  }

  async findActive() {
    // Obtener la institución activa (la más reciente)
    return this.prisma.institution.findMany({
      take: 1,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const institution = await this.prisma.institution.findUnique({
      where: { id },
    });

    if (!institution) {
      throw new NotFoundException('Institución no encontrada');
    }

    return institution;
  }

  async update(id: string, updateInstitutionDto: UpdateInstitutionDto) {
    await this.findOne(id); // Verificar que existe

    return this.prisma.institution.update({
      where: { id },
      data: updateInstitutionDto,
    });
  }

  async uploadLogo(id: string, filename: string): Promise<string> {
    await this.findOne(id); // Verificar que existe

    // Guardar la URL relativa del logo
    const logoUrl = `/uploads/${filename}`;

    // Actualizar la institución con la URL del logo
    await this.prisma.institution.update({
      where: { id },
      data: { logoUrl },
    });

    return logoUrl;
  }
}
