import { Controller, Get, Post, UseGuards, Request, HttpStatus, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller('/auth')
export class AppController {
  constructor(private readonly appService: AppService,
              private authService: AuthService) {}

  //@UseGuards(AuthGuard('local'))
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    //return req.user;
    return this.authService.login(req.user);
  }

  @Post('/logout')
  async logout(@Request() req, @Res() res) {
    return res.sendStatus(HttpStatus.OK);
  }
  
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
