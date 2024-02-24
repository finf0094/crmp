import { Product } from '@prisma/client';

export class ProductEntity implements Product {
    id: string;
    name: string;
    isFree: boolean;
    isPrivate: boolean;
    storeUrl: string;
    libraryUrl: string;
    productUrl: string;
    description: string;
    price: number;
    createdAt: Date;
    downloads: number;
    purchased: number;
    rating: number;
    discount: number;
    pathId: string;

    constructor(product: Product) {
        Object.assign(this, product);
    }
}
