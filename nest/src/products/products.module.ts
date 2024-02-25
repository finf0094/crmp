import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from '@prisma/prisma.service';
import { S3Service } from '@s3/s3.service';

@Module({
    controllers: [ProductsController],
    providers: [ProductsService, PrismaService, S3Service],
})
export class ProductsModule {}
