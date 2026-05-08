import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum ExperienceLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum MainGoal {
  LOSE_FAT = 'LOSE_FAT',
  GAIN_MUSCLE = 'GAIN_MUSCLE',
  RECOMPOSITION = 'RECOMPOSITION',
  PERFORMANCE = 'PERFORMANCE',
  HEALTH = 'HEALTH',
}

export enum PlanType {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  SEMIANNUAL = 'SEMIANNUAL',
  ANNUAL = 'ANNUAL',
}

export enum ChargeType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
}

@Entity()
export class ClientProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, user => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  // --- 1. Datos personales ---
  @Column({ nullable: true })
  photoUrl: string;

  @Column({ nullable: true })
  identificationNumber: string;

  @Column({ type: 'date', nullable: true })
  dob: Date;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  // --- 2. Datos físicos iniciales ---
  @Column({ type: 'float', nullable: true })
  currentWeight: number; // kg

  @Column({ type: 'float', nullable: true })
  height: number; // cm

  @Column({ type: 'float', nullable: true })
  initialBodyFat: number; // percentage at start

  @Column({ type: 'float', nullable: true })
  bodyFat: number; // current percentage

  // Medidas
  @Column({ type: 'float', nullable: true }) waist: number;
  @Column({ type: 'float', nullable: true }) hips: number;
  @Column({ type: 'float', nullable: true }) chest: number;
  @Column({ type: 'float', nullable: true }) arms: number;
  @Column({ type: 'float', nullable: true }) legs: number;

  // --- 3. Objetivo del cliente ---
  @Column({ type: 'enum', enum: MainGoal, nullable: true })
  mainGoal: MainGoal;

  @Column({ type: 'float', nullable: true })
  targetWeight: number;

  @Column({ nullable: true })
  estimatedTime: string;

  // --- 4. Nivel y experiencia ---
  @Column({ type: 'enum', enum: ExperienceLevel, nullable: true })
  experienceLevel: ExperienceLevel;

  @Column({ nullable: true })
  trainingTime: string;

  @Column({ nullable: true })
  previousTrainingType: string;

  // --- 5. Salud y restricciones ---
  @Column({ type: 'text', nullable: true })
  injuries: string;

  @Column({ type: 'text', nullable: true })
  medicalConditions: string;

  @Column({ type: 'text', nullable: true })
  medication: string;

  @Column({ type: 'text', nullable: true })
  physicalLimitations: string;

  // --- 6. Hábitos del cliente ---
  @Column({ nullable: true })
  trainingDays: number;

  @Column({ nullable: true })
  preferredTime: string;

  @Column({ nullable: true })
  activityLevel: string; // e.g., sedentario, activo

  @Column({ nullable: true })
  sleepQuality: string; // e.g., baja, media, alta

  // --- 7. Nutrición ---
  @Column({ nullable: true })
  dietType: string;

  @Column({ type: 'text', nullable: true })
  foodRestrictions: string;

  @Column({ nullable: true })
  caloricGoal: number;

  @Column({ type: 'text', nullable: true })
  preferences: string;

  // --- 8. Evaluación inicial (Escala 1-5) ---
  @Column({ nullable: true }) dailyEnergy: number;
  @Column({ nullable: true }) stressLevel: number;
  @Column({ nullable: true }) motivation: number;
  @Column({ nullable: true }) expectedAdherence: number;

  // --- 10. Datos comerciales (negocio) ---
  @Column({ type: 'enum', enum: PlanType, nullable: true })
  planType: PlanType;

  @Column({ type: 'enum', enum: ChargeType, nullable: true })
  chargeType: ChargeType;

  @Column({ type: 'float', nullable: true })
  servicePrice: number;

  @Column({ nullable: true })
  trainingDaysCount: number; // Manual override for training days

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  renewalDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // --- Computed properties ---
  get age(): number | null {
    if (!this.dob) return null;
    const diff_ms = Date.now() - new Date(this.dob).getTime();
    const age_dt = new Date(diff_ms); 
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  }

  get bmi(): number | null {
    if (!this.currentWeight || !this.height) return null;
    const heightInMeters = this.height / 100;
    return parseFloat((this.currentWeight / (heightInMeters * heightInMeters)).toFixed(2));
  }
}
