import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ChargesService } from './charges.service';
import { CreateChargeDto } from './dtos/create-charge.dto';
import { UpdateChargeDto } from './dtos/update-charge.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiBearerAuth()
@Controller('charges')
export class ChargesController {
  constructor(private chargesService: ChargesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async create(@Body() createChargeDto: CreateChargeDto) {
    return this.chargesService.create(createChargeDto);
  }

  @Get()
  async findAll() {
    return this.chargesService.findAll();
  }

  @Get('credit-type/:creditTypeId')
  async findByCreditType(@Param('creditTypeId') creditTypeId: string) {
    return this.chargesService.findByCreditType(creditTypeId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.chargesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async update(
    @Param('id') id: string,
    @Body() updateChargeDto: UpdateChargeDto,
  ) {
    return this.chargesService.update(id, updateChargeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async delete(@Param('id') id: string) {
    return this.chargesService.delete(id);
  }
}
