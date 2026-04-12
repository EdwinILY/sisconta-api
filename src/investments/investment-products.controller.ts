import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateInvestmentProductDto } from './dto/create-investment-product.dto';
import { SimulateInvestmentDto } from './dto/simulate-investment.dto';
import { UpdateInvestmentProductDto } from './dto/update-investment-product.dto';
import { InvestmentProductsService } from './investment-products.service';

@ApiTags('Investment Products')
@Controller('investment-products')
export class InvestmentProductsController {
  constructor(private readonly productsService: InvestmentProductsService) {}

  @Post()
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
  @ApiOperation({ summary: 'Actualizar producto de inversion (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateInvestmentProductDto) {
    return this.productsService.update(id, dto);
  }

  @Post(':id/simulate')
  @ApiOperation({ summary: 'Simular inversion de un producto' })
  simulate(@Param('id') id: string, @Body() dto: SimulateInvestmentDto) {
    return this.productsService.simulate(id, dto);
  }
}
