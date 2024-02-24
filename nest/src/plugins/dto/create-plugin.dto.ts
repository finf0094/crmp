import { IsBoolean, IsNotEmpty, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class FileDto {
    @IsString()
    @IsNotEmpty()
    path: string;

    @IsString()
    @IsNotEmpty()
    hash: string;

    @IsBoolean()
    checkHash: boolean;
}

export class CreatePluginDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsBoolean()
    isPrivate: boolean;

    @IsString()
    @IsNotEmpty()
    cloudPath: string;

    @IsUUID()
    productId: string;

    @ValidateNested({ each: true })
    @Type(() => FileDto)
    files: FileDto[];
}
