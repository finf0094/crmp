import { GoogleGuard } from './google.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './role.guard';
import { VkontakteGuard } from './vkontakte.guard';

export const GUARDS = [JwtAuthGuard, RolesGuard, GoogleGuard, VkontakteGuard];
