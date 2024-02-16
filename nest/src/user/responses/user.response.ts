import { Provider, Role, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponse implements User {
    id: string;
    email: string;

    @Exclude()
    password: string;

    @Exclude()
    createdAt: Date;

    @Exclude()
    provider: Provider;

    @Exclude()
    isBlocked: boolean;

    updatedAt: Date;
    roles: Role[];

    @Exclude()
    sid: string;
    boughtProducts: string[];

    constructor(user: User) {
        Object.assign(this, user);
    }
    username: string;
}
