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
import { CreditTypesService } from './credit-types.service';
import { CreateCreditTypeDto } from './dtos/create-credit-type.dto';
import { UpdateCreditTypeDto } from './dtos/update-credit-type.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiBearerAuth()
@Controller('credit-types')
export class CreditTypesController {
  constructor(private creditTypesService: CreditTypesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async create(@Body() createCreditTypeDto: CreateCreditTypeDto) {
    return this.creditTypesService.create(createCreditTypeDto);
  }

  @Get()
  async findAll() {
    return this.creditTypesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.creditTypesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async update(
    @Param('id') id: string,
    @Body() updateCreditTypeDto: UpdateCreditTypeDto,
  ) {
    return this.creditTypesService.update(id, updateCreditTypeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async delete(@Param('id') id: string) {
    return this.creditTypesService.delete(id);
  }
}
