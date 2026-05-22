import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Public } from '../../common/decorators';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public() @Post('register')
  register(@Body() dto: RegisterDto) { return this.authService.register(dto); }

  @Public() @UseGuards(AuthGuard('local')) @Post('login') @HttpCode(HttpStatus.OK)
  login(@Request() req: any) { return this.authService.login(req.user); }

  @Public() @Post('refresh') @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshTokenDto) { return this.authService.refresh(dto.refreshToken); }
}
