import {
    IsString,
    IsBoolean,
    IsUrl,
    ValidateNested,
    IsUUID,
    IsOptional,
    IsArray,
    IsDate,
    IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class PathDto {
    @IsUUID()
    @IsOptional()
    id?: string; // Made optional for creation scenarios

    @IsString()
    html: string;

    @IsString()
    css: string;

    @IsString()
    js: string;
}

class ScreenshotDto {
    @IsUUID()
    @IsOptional()
    id?: string; // Made optional for creation scenarios

    @IsString()
    name: string;

    @IsUrl()
    url: string;
}

class ReviewDto {
    @IsUUID()
    @IsOptional()
    id?: string; // Made optional for creation scenarios

    @IsString()
    username: string;

    @IsDate()
    createdAt: Date;

    @IsString()
    message: string;
}

export class CreateProductDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsBoolean()
    isFree: boolean;

    @IsBoolean()
    isPrivate: boolean;

    @IsUrl()
    previewUrl: string;

    @IsUrl()
    productUrl: string;

    @IsUrl()
    storeUrl: string;

    @IsUrl()
    libraryUrl: string;

    @IsNumber()
    price: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PathDto)
    paths: PathDto;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ScreenshotDto)
    screenshots: ScreenshotDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ReviewDto)
    reviews: ReviewDto[];
}
