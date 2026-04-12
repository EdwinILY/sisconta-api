import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateInvestmentProductDto } from './dto/create-investment-product.dto';
import { SimulateInvestmentDto } from './dto/simulate-investment.dto';
import { UpdateInvestmentProductDto } from './dto/update-investment-product.dto';
import { InvestmentProductsService } from './investment-products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Investment Products')
@ApiBearerAuth()
@Controller('investment-products')
export class InvestmentProductsController {
  constructor(private readonly productsService: InvestmentProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Crear producto de inversion (admin)' })
  create(@Body() dto: CreateInvestmentProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar productos de inversion' })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto de inversion por id' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Actualizar producto de inversion (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateInvestmentProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Eliminar producto de inversion (admin)' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Post(':id/simulate')
  @ApiOperation({ summary: 'Simular inversion de un producto' })
  simulate(@Param('id') id: string, @Body() dto: SimulateInvestmentDto) {
    return this.productsService.simulate(id, dto);
  }
}
