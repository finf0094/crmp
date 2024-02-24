import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreatePluginDto } from './dto/create-plugin.dto';
import { UpdatePluginDto } from './dto/update-plugin.dto';
import { PluginEntity } from './entities/plugin.entity';

@Injectable()
export class PluginsService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(createPluginDto: CreatePluginDto) {
        const { productId, files, ...rest } = createPluginDto;

        return await this.prismaService.plugin.create({
            data: {
                ...rest,
                Product: {
                    connect: { id: productId },
                },
                files: {
                    create: files,
                },
            },
        });
    }

    async findAll() {
        const plugins = await this.prismaService.plugin.findMany({
            include: {
                files: true,
            },
        });

        return plugins.map((plugin) => new PluginEntity(plugin));
    }

    async findOne(id: string): Promise<PluginEntity> {
        const plugin = await this.prismaService.plugin.findUnique({
            where: { id },
            include: {
                files: true,
            },
        });

        return new PluginEntity(plugin);
    }

    async update(id: string, updatePluginDto: UpdatePluginDto) {
        const { productId, ...rest } = updatePluginDto;

        const data: any = {
            ...rest,
        };

        if (productId !== undefined) {
            data.Product = {
                connect: { id: productId },
            };
        }

        if (productId === null) {
            data.Product = {
                disconnect: true,
            };
        }

        return await this.prismaService.plugin.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        return await this.prismaService.plugin.delete({
            where: { id },
        });
    }
}
