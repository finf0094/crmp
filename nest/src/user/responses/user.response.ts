import { Provider, Role, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponse implements User {
    id: string;
    email: string;
    username: string;
    updatedAt: Date;
    roles: Role[];

    @Exclude()
    password: string;

    @Exclude()
    createdAt: Date;

    @Exclude()
    provider: Provider;

    @Exclude()
    isBlocked: boolean;

    @Exclude()
    sid: string;
    boughtProducts: string[];

    constructor(user: User) {
        Object.assign(this, user);
    }
}
