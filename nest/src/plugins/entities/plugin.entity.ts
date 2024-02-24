import { Plugin } from '@prisma/client';

export class PluginEntity implements Plugin {
    id: string;
    name: string;
    isPrivate: boolean;
    cloudPath: string;
    productId: string;

    constructor(plugin: Plugin) {
        Object.assign(this, plugin);
    }
}
