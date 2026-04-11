import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { mkdirSync } from 'node:fs';
import { extname } from 'node:path';
import { InvestmentProductsController } from './investment-products.controller';
import { InvestmentProductsService } from './investment-products.service';
import { InvestmentRequestsController } from './investment-requests.controller';
import { InvestmentRequestsService } from './investment-requests.service';

const uploadStorage = diskStorage({
  destination: (_req, _file, cb) => {
    const destination = 'uploads/investments';
    mkdirSync(destination, { recursive: true });
    cb(null, destination);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
  },
});

@Module({
  imports: [
    MulterModule.register({
      storage: uploadStorage,
    }),
  ],
  controllers: [InvestmentProductsController, InvestmentRequestsController],
  providers: [InvestmentProductsService, InvestmentRequestsService],
})
export class InvestmentsModule {}
