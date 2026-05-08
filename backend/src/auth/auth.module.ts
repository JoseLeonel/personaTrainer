import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { AuthService } from './application/auth.service';
import { AuthRepository } from './infrastructure/adapters/auth.repository';
import { I_AUTH_REPOSITORY } from './domain/ports/auth.repository.interface';
import { User } from '../entities/user.entity';
import { SystemParameter } from '../entities/system-parameter.entity';
import { InviteCode } from '../entities/invite-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, SystemParameter, InviteCode])],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: I_AUTH_REPOSITORY,
      useClass: AuthRepository,
    },
  ],
})
export class AuthModule {}
