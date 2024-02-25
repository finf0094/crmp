import { JwtAuthGuard } from '@auth/guargs/jwt-auth.guard';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ProductsModule } from './products/products.module';
import { PluginsModule } from './plugins/plugins.module';
import { S3Module } from './s3/s3.module';

@Module({
    imports: [
        UserModule,
        PrismaModule,
        AuthModule,
        ConfigModule.forRoot({ isGlobal: true }),
        ProductsModule,
        PluginsModule,
        S3Module,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
