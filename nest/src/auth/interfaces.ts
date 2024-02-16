import { Token } from '@prisma/client';

export interface Tokens {
    accessToken: string;
    refreshToken: Token;
    user: JwtPayload;
}

export interface JwtPayload {
    id: string;
    email: string;
    username: string;
    roles: string[];
}
