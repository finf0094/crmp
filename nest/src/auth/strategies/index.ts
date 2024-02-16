import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { VkontakteStrategy } from './vkontakte.strategy';

export const STRTAGIES = [JwtStrategy, GoogleStrategy, VkontakteStrategy];
