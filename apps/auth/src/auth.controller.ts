import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuad } from './guards/local-auth.guard';
import { CurrentUser } from './users/current-user.decorator';
import { UserDocument } from './users/models/users.schema';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuad)
  @Post('login')
  async login (
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response
  ) {
    await this.authService.login(user, response);
    response.send(user);
  }
}
