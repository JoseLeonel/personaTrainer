import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Workout } from './workout.entity';

@Entity()
export class WeeklyPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // e.g., 'Semana 1 - Hipertrofia'

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ default: false })
  isTemplate: boolean; // True if it's a reusable template created by the trainer

  @ManyToOne(() => User, user => user.weeklyPlans, { nullable: true })
  client: User; // Null if it's a template

  @ManyToOne(() => User)
  trainer: User; // The trainer who created it

  @OneToMany(() => Workout, workout => workout.weeklyPlan)
  workouts: Workout[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
