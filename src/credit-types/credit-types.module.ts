import { Module } from '@nestjs/common';
import { CreditTypesService } from './credit-types.service';
import { CreditTypesController } from './credit-types.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CreditTypesService],
  controllers: [CreditTypesController],
})
export class CreditTypesModule {}
