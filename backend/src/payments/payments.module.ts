import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment } from '../entities/payment.entity';
import { User } from '../entities/user.entity';
import { ClientProfile } from '../entities/client-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, User, ClientProfile])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
