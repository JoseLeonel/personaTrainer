import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainerDashboardController } from './trainer-dashboard.controller';
import { TrainerDashboardService } from './trainer-dashboard.service';
import { User } from '../entities/user.entity';
import { Payment } from '../entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Payment])],
  controllers: [TrainerDashboardController],
  providers: [TrainerDashboardService],
})
export class TrainerDashboardModule {}
