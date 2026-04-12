import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { InvestmentsModule } from './investments/investments.module';
import { AuthModule } from './auth/auth.module';
import { InstitutionModule } from './institution/institution.module';
import { CreditTypesModule } from './credit-types/credit-types.module';
import { ChargesModule } from './charges/charges.module';

@Module({
  imports: [
    PrismaModule,
    InvestmentsModule,
    AuthModule,
    InstitutionModule,
    CreditTypesModule,
    ChargesModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'sisconta_secret_2024',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
