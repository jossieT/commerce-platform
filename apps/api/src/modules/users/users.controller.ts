import { Controller, Get, Put, Body, Param, UseGuards, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CurrentUser } from '../../common/decorators';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me') getMe(@CurrentUser() user: any) { return user; }
  @Put('me') updateMe(@CurrentUser() user: any, @Body() body: any) { return this.usersService.update(user.id, body); }
  @Get('me/addresses') getAddresses(@CurrentUser() user: any) { return this.usersService.getAddresses(user.id); }
  @Post('me/addresses') addAddress(@CurrentUser() user: any, @Body() body: any) { return this.usersService.addAddress(user.id, body); }

  @Get() @UseGuards(RolesGuard) @Roles('admin', 'super_admin')
  findAll() { return this.usersService.findAll(); }

  @Get(':id') @UseGuards(RolesGuard) @Roles('admin', 'super_admin')
  findOne(@Param('id') id: string) { return this.usersService.findById(id); }
}
