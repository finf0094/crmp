import { Public, UserAgent } from '@common/decorators';
import { HttpService } from '@nestjs/axios';
import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpStatus,
    Post,
    Query,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserResponse } from '@user/responses';
import { Request, Response } from 'express';
import { map, mergeMap } from 'rxjs';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { GoogleGuard } from './guargs/google.guard';
import { Tokens } from './interfaces';
import { handleTimeoutAndErrors } from '@common/helpers';
import { Provider } from '@prisma/client';
import { VkontakteGuard } from './guargs/vkontakte.guard';

const REFRESH_TOKEN = 'refreshtoken';

@Public()
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {}

    @UseInterceptors(ClassSerializerInterceptor)
    @Post('register')
    async register(@Body() dto: RegisterDto) {
        const user = await this.authService.register(dto);
        if (!user) {
            throw new BadRequestException(
                `Не получается зарегистрировать пользователя с данными ${JSON.stringify(dto)}`,
            );
        }
        return new UserResponse(user);
    }

    @Post('login')
    async login(@Body() dto: LoginDto, @Res() res: Response, @UserAgent() agent: string) {
        const tokens = await this.authService.login(dto, agent);
        if (!tokens) {
            throw new BadRequestException(`Не получается войти с данными ${JSON.stringify(dto)}`);
        }

        this.sendTokens(tokens, res);
    }

    @Get('logout')
    async logout(@Body(REFRESH_TOKEN) refreshToken: string, @Res() res: Response) {
        if (!refreshToken) {
            res.sendStatus(HttpStatus.OK);
            return;
        }
        await this.authService.deleteRefreshToken(refreshToken);
        res.cookie(REFRESH_TOKEN, '', { httpOnly: true, secure: true, expires: new Date() });
        res.sendStatus(HttpStatus.OK);
    }

    @Get('refresh-tokens')
    async refreshTokens(@Body(REFRESH_TOKEN) refreshToken: string, @Res() res: Response, @UserAgent() agent: string) {
        if (!refreshToken) {
            throw new UnauthorizedException();
        }
        const tokens = await this.authService.refreshTokens(refreshToken, agent);
        if (!tokens) {
            throw new UnauthorizedException();
        }
        this.sendTokens(tokens, res);
    }

    private sendTokens(tokens: Tokens, res: Response) {
        if (!tokens) {
            throw new UnauthorizedException();
        }
        res.status(HttpStatus.CREATED).json({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: tokens.user,
        });
    }

    @UseGuards(GoogleGuard)
    @Get('google')
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    googleAuth() {}

    @UseGuards(GoogleGuard)
    @Get('google/callback')
    googleAuthCallback(@Req() req: Request, @Res() res: Response) {
        const token = req.user['accessToken'];
        return res.redirect(`http://localhost:3000/api/auth/success-google?token=${token}`);
    }

    @Get('success-google')
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    successGoogle(@Query('token') token: string, @UserAgent() agent: string, @Res() res: Response) {
        return this.httpService.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`).pipe(
            mergeMap(({ data: { email } }) => this.authService.providerAuth(email, agent, Provider.GOOGLE)),
            map((data) => this.sendTokens(data, res)),
            handleTimeoutAndErrors(),
        );
    }

    @UseGuards(VkontakteGuard)
    @Get('vkontakte')
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    vkontakteAuth() {}

    @UseGuards(VkontakteGuard)
    @Get('vkontakte/callback')
    vkontakteAuthCallback(@Req() req: Request, @Res() res: Response) {
        const token = req.user['accessToken'];
        return res.redirect(`http://localhost:3000/api/auth/success-google?token=${token}`);
    }

    @Get('success-vkontakte')
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    successVkontakte(@Query('token') token: string, @UserAgent() agent: string, @Res() res: Response) {
        return this.httpService
            .get(`https://api.vk.com/method/users.get?fields=email&access_token=${token}&v=5.131`)
            .pipe(
                mergeMap(({ data: { email } }) => this.authService.providerAuth(email, agent, Provider.VKONTAKTE)),
                map((data) => this.sendTokens(data, res)),
                handleTimeoutAndErrors(),
            );
    }
}
