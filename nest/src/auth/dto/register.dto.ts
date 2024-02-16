import { IsPasswordsMatchingConstraint } from '@common/decorators';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, Validate } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(12)
    username: string;

    @IsOptional()
    sid?: string;

    @IsString()
    @MinLength(8)
    @IsNotEmpty()
    password: string;

    @IsString()
    @MinLength(8)
    @Validate(IsPasswordsMatchingConstraint)
    @IsNotEmpty()
    passwordRepeat: string;
}
