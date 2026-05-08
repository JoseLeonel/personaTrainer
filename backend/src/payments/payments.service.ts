import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from '../entities/payment.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async registerPayment(clientId: number, amount: number, paymentDate: string, notes?: string): Promise<Payment> {
    const client = await this.userRepository.findOne({ where: { id: clientId } });
    if (!client) {
      throw new NotFoundException(`Cliente con ID ${clientId} no encontrado.`);
    }

    const payment = this.paymentRepository.create({
      client,
      amount,
      paymentDate: new Date(paymentDate),
      status: PaymentStatus.PAID,
      notes,
    });

    return this.paymentRepository.save(payment);
  }

  async getDefaulters(trainerId: number): Promise<User[]> {
    // Para simplificar, buscamos los usuarios que tienen un lastPayment vencido 
    // Esto se calculará dinámicamente o se basará en nextPaymentDate
    const today = new Date();
    
    // Find clients whose nextPaymentDate < today
    return this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.trainerId = :trainerId', { trainerId })
      .andWhere('user.role = :role', { role: 'CLIENT' })
      .andWhere('user.status = :status', { status: 'ACTIVE' })
      .andWhere('user.nextPaymentDate < :today', { today })
      .getMany();
  }
}
