import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dtos/login-user.dto';
import { UsersService } from '../users/users.service';
import { UserInfoDto } from '../users/dtos/user-info.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'User login' })
  @Post('/login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @ApiOperation({ summary: 'User activate via email' })
  @Post('/activate/:activationUUID')
  async activateAccount(@Param('activationUUID') activationUUID: string) {
    return await this.authService.activateAccount(activationUUID);
  }

  @ApiOperation({ summary: 'Resend user activation link' })
  @Post('/resend')
  async resendActivationLink(@Body() userInfo: UserInfoDto) {
    return await this.authService.sendMail(userInfo);
  }
}
