import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ValidationPipe,
    UseInterceptors,
    Response,
    UploadedFile,
    Res,
    StreamableFile,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'stream';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Post()
    async create(@Body(new ValidationPipe({ transform: true })) createProductDto: CreateProductDto) {
        return await this.productsService.create(createProductDto);
    }

    @Get()
    findAll() {
        return this.productsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }

    @Post(':id/upload-screenshot')
    @UseInterceptors(FileInterceptor('file'))
    async uploadScreenshot(@UploadedFile() file: Express.Multer.File, @Param('id') productId: string) {
        await this.productsService.uploadProductFile(file.buffer, file.originalname, productId, 'screenshot');
        return { message: 'Screenshot uploaded successfully' };
    }

    @Post(':id/upload-store')
    @UseInterceptors(FileInterceptor('file'))
    async uploadStoreFile(@UploadedFile() file: Express.Multer.File, @Param('id') productId: string) {
        await this.productsService.uploadProductFile(file.buffer, file.originalname, productId, 'store');
        return { message: 'Store file uploaded successfully' };
    }

    @Post(':id/upload-library')
    @UseInterceptors(FileInterceptor('file'))
    async uploadLibraryFile(@UploadedFile() file: Express.Multer.File, @Param('id') productId: string) {
        await this.productsService.uploadProductFile(file.buffer, file.originalname, productId, 'library');
        return { message: 'Library file uploaded successfully' };
    }

    @Get(':id/download/:fileType')
    async downloadFile(
        @Param('id') productId: string,
        @Param('fileType') fileType: 'screenshot' | 'store' | 'library',
    ): Promise<StreamableFile> {
        const { data, contentType } = await this.productsService.downloadProductFile(productId, fileType);

        // Тут стриминг файла
        const stream = new Readable();
        stream.push(data);
        stream.push(null);

        return new StreamableFile(stream, {
            type: contentType,
            disposition: `attachment; filename="${fileType}"`,
        });
    }
}
