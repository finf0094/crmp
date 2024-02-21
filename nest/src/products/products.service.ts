import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class ProductsService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(dto: CreateProductDto): Promise<ProductEntity> {
        const { name, isFree, isPrivate, previewUrl, productUrl, price, paths, storeUrl, libraryUrl, description } =
            dto;

        const data = {
            name,
            isFree,
            isPrivate,
            previewUrl,
            productUrl,
            price,
            storeUrl,
            libraryUrl,
            description,
            paths: { create: paths },
        };

        const createdProduct = await this.prismaService.product.create({
            data,
            include: { paths: true }, // Включение связанных путей в результат
        });

        // Преобразование созданного продукта в экземпляр ProductEntity
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
        const {
            name,
            isFree,
            isPrivate,
            previewUrl,
            productUrl,
            price,
            storeUrl,
            libraryUrl,
            description,
            paths, // Теперь это одиночный объект, а не массив
            screenshots,
            reviews,
        } = dto;

        // Подготовка объекта данных для обновления, включая только поля, которые не undefined
        const updateData: any = {
            ...(name !== undefined && { name }),
            ...(isFree !== undefined && { isFree }),
            ...(isPrivate !== undefined && { isPrivate }),
            ...(previewUrl !== undefined && { previewUrl }),
            ...(productUrl !== undefined && { productUrl }),
            ...(price !== undefined && { price }),
            ...(storeUrl !== undefined && { storeUrl }),
            ...(libraryUrl !== undefined && { libraryUrl }),
            ...(description !== undefined && { description }),
            // Обновление связанного пути, если он предоставлен
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
            // Для screenshots и reviews логика остается прежней
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
}
