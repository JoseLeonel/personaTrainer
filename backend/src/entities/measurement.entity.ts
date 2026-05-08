import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Measurement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  weightKg: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  muscleMassKg: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  bodyFatPercentage: number;

  @ManyToOne(() => User, user => user.measurements)
  client: User;

  @CreateDateColumn()
  createdAt: Date;
}
