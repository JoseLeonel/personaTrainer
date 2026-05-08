import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { WeeklyPlan } from './weekly-plan.entity';
import { WorkoutExercise } from './workout-exercise.entity';

@Entity()
export class Workout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // e.g., 'Push (Pecho, Tríceps)'

  @Column({ nullable: true })
  dayOfWeek: number; // 1 = Monday, 7 = Sunday (useful for templates)

  @Column({ type: 'date', nullable: true })
  date: Date; // Specific date for the client's workout

  @ManyToOne(() => WeeklyPlan, plan => plan.workouts, { onDelete: 'CASCADE' })
  weeklyPlan: WeeklyPlan;

  @OneToMany(() => WorkoutExercise, we => we.workout, { cascade: true })
  workoutExercises: WorkoutExercise[];

  @CreateDateColumn()
  createdAt: Date;
}
