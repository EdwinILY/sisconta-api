import { PartialType } from '@nestjs/swagger';
import { CreateInvestmentProductDto } from './create-investment-product.dto';

export class UpdateInvestmentProductDto extends PartialType(
  CreateInvestmentProductDto,
) {}
