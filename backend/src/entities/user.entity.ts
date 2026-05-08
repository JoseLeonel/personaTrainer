import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, OneToOne } from 'typeorm';
import { WeeklyPlan } from './weekly-plan.entity';
import { Measurement } from './measurement.entity';
import { ClientProfile } from './client-profile.entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  TRAINER = 'TRAINER',
  CLIENT = 'CLIENT',
}

export enum UserStatus {
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  ACTIVE = 'ACTIVE',
  REJECTED = 'REJECTED',
  INACTIVE = 'INACTIVE',
}

export enum PaymentStatus {
  PAID = 'PAID',
  PENDING = 'PENDING',
  OVERDUE = 'OVERDUE',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENT })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING_APPROVAL })
  status: UserStatus;

  @Column({ nullable: true })
  password?: string;

  // --- Client specific fields ---
  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Column({ type: 'date', nullable: true })
  nextPaymentDate: Date;

  @OneToOne(() => ClientProfile, profile => profile.user, { cascade: true, nullable: true })
  profile: ClientProfile;

  // Self-referencing relationship: A client belongs to a trainer (who is also a user)
  @ManyToOne(() => User, user => user.clients, { nullable: true })
  trainer: User;

  @OneToMany(() => User, user => user.trainer)
  clients: User[];

  @OneToMany(() => WeeklyPlan, plan => plan.client)
  weeklyPlans: WeeklyPlan[];

  @OneToMany(() => Measurement, measurement => measurement.client)
  measurements: Measurement[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
