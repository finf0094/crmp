import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { PrismaService } from '@prisma/prisma.service';
import { S3Service } from '@s3/s3.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly s3Service: S3Service,
        private readonly configService: ConfigService,
    ) {}

    async create(dto: CreateProductDto): Promise<ProductEntity> {
        const { name, isFree, isPrivate, price, paths, description } = dto;

        const data = {
            name,
            isFree,
            isPrivate,
            price,
            description,
            paths: { create: paths },
        };

        const createdProduct = await this.prismaService.product.create({
            data,
            include: { paths: true },
        });

        return new ProductEntity(createdProduct);
    }

    async findAll(): Promise<ProductEntity[]> {
        const products = await this.prismaService.product.findMany({
            include: { paths: true, screenshots: true, reviews: true },
        });
        return products.map((product) => new ProductEntity(product));
    }

    async findOne(id: string): Promise<ProductEntity> {
        const product = await this.prismaService.product.findUnique({
            where: { id },
            include: { paths: true, screenshots: true, reviews: true },
        });
        if (!product) {
            return null;
        }
        return new ProductEntity(product);
    }

    async update(id: string, dto: UpdateProductDto): Promise<ProductEntity> {
        const { name, isFree, isPrivate, price, description, paths, screenshots, reviews } = dto;

        const updateData: any = {
            ...(name !== undefined && { name }),
            ...(isFree !== undefined && { isFree }),
            ...(isPrivate !== undefined && { isPrivate }),
            ...(price !== undefined && { price }),
            ...(description !== undefined && { description }),
            ...(paths && {
                paths: {
                    update: {
                        where: { id: paths.id },
                        data: {
                            html: paths.html,
                            css: paths.css,
                            js: paths.js,
                        },
                    },
                },
            }),
            ...(screenshots && {
                screenshots: {
                    updateMany: screenshots.map((screenshot) => ({
                        where: { id: screenshot.id },
                        data: screenshot,
                    })),
                },
            }),
            ...(reviews && {
                reviews: {
                    updateMany: reviews.map((review) => ({
                        where: { id: review.id },
                        data: review,
                    })),
                },
            }),
        };

        const updatedProduct = await this.prismaService.product.update({
            where: { id },
            data: updateData,
            include: { paths: true, screenshots: true, reviews: true },
        });

        return new ProductEntity(updatedProduct);
    }
    async remove(id: string): Promise<void> {
        const existingProduct = await this.prismaService.product.findUnique({
            where: { id },
        });
        if (!existingProduct) {
            return null;
        }

        await this.prismaService.product.delete({
            where: { id },
        });
    }

    async uploadProductFile(
        dataBuffer: Buffer,
        filename: string,
        productId: string,
        fileType: 'screenshot' | 'store' | 'library',
    ): Promise<void> {
        const { Key } = await this.s3Service.uploadPublicFile(dataBuffer, filename);

        // Construct the URL from the Key
        // Note: Adjust the URL pattern if necessary for your S3 setup
        const fileUrl = `https://${this.configService.get<string>(
            'AWS_BUCKET_NAME',
        )}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${Key}`;

        if (fileType === 'screenshot') {
            await this.prismaService.screenshot.create({
                data: {
                    name: filename,
                    url: fileUrl,
                    productId,
                },
            });
        } else if (fileType === 'store' || fileType === 'library') {
            await this.prismaService.product.update({
                where: { id: productId },
                data: {
                    ...(fileType === 'store' && { storeUrl: fileUrl }),
                    ...(fileType === 'library' && { libraryUrl: fileUrl }),
                },
            });
        }
    }

    async downloadProductFile(
        productId: string,
        fileType: 'screenshot' | 'store' | 'library',
    ): Promise<{ data: Buffer; contentType: string }> {
        const product = await this.prismaService.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        let fileKey = '';
        if (fileType === 'screenshot') {
            const screenshot = await this.prismaService.screenshot.findFirst({
                where: { productId: productId },
            });
            if (!screenshot) {
                throw new NotFoundException('Screenshot not found');
            }
            fileKey = screenshot.url;
        } else if (fileType === 'store') {
            if (!product.storeUrl) {
                throw new NotFoundException('Store file not found');
            }
            fileKey = product.storeUrl;
        } else if (fileType === 'library') {
            if (!product.libraryUrl) {
                throw new NotFoundException('Library file not found');
            }
            fileKey = product.libraryUrl;
        }

        const data = await this.s3Service.downloadPublicFile(fileKey);
        const contentType = 'application/octet-stream';

        return { data, contentType };
    }
}
