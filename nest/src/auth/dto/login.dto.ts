import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    username: string;

    @IsOptional()
    sid?: string;

    @IsString()
    @MinLength(8)
    @IsNotEmpty()
    password: string;
}
