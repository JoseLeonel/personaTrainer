import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import { Payment, PaymentStatus } from '../entities/payment.entity';

@Injectable()
export class TrainerDashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async getMetrics(trainerId: number) {
    // 1. Clientes Activos
    const activeClients = await this.userRepository.count({
      where: { trainer: { id: trainerId }, role: UserRole.CLIENT, status: UserStatus.ACTIVE }
    });

    // 2. Pendientes de pago
    const today = new Date();
    const defaulters = await this.userRepository.createQueryBuilder('user')
      .where('user.trainerId = :trainerId', { trainerId })
      .andWhere('user.role = :role', { role: UserRole.CLIENT })
      .andWhere('user.status = :status', { status: UserStatus.ACTIVE })
      .andWhere('user.nextPaymentDate < :today', { today })
      .getCount();

    // 3. Ingresos del mes
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const paymentsThisMonth = await this.paymentRepository.createQueryBuilder('payment')
      .leftJoin('payment.client', 'client')
      .where('client.trainerId = :trainerId', { trainerId })
      .andWhere('payment.status = :status', { status: PaymentStatus.PAID })
      .andWhere('payment.paymentDate >= :firstDay', { firstDay: firstDayOfMonth })
      .select('SUM(payment.amount)', 'total')
      .getRawOne();

    const monthlyIncome = paymentsThisMonth.total ? parseFloat(paymentsThisMonth.total) : 0;

    // 4. Riesgo de abandono (Placeholder: Múltiples días sin entrenar)
    // Para simplificar, retornaremos un valor estático o calculado básico
    const abandonmentRisk = 0; 
    
    // 5. Sin entrenar hoy
    const missingTrainingToday = 0;

    return {
      activeClients,
      pendingPayments: defaulters,
      missingTrainingToday,
      abandonmentRisk,
      monthlyIncome,
    };
  }
}
