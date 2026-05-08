import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AuthService } from '../../application/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('trainers')
  async getTrainers() {
    return this.authService.getTrainers();
  }

  @Get('seed')
  async seedTrainer() {
    return this.authService.seedTrainer();
  }

  @Post('invite-code/:trainerId')
  async generateInviteCode(@Param('trainerId') trainerId: string) {
    return this.authService.generateInviteCode(parseInt(trainerId, 10));
  }

  @Get('invite-code/:trainerId')
  async getActiveInviteCode(@Param('trainerId') trainerId: string) {
    return this.authService.getActiveInviteCode(parseInt(trainerId, 10));
  }

  @Post('register')
  async register(@Body() registerPayload: any) {
    return this.authService.registerClient(registerPayload);
  }

  @Post('login')
  async login(@Body() loginPayload: any) {
    return this.authService.login(loginPayload);
  }
}
