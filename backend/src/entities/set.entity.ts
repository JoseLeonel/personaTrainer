import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { WorkoutExercise } from './workout-exercise.entity';

@Entity()
export class Set {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  weight: number;

  @Column()
  reps: number;

  @ManyToOne(() => WorkoutExercise, we => we.sets, { onDelete: 'CASCADE' })
  workoutExercise: WorkoutExercise;

  @CreateDateColumn()
  createdAt: Date;
}
