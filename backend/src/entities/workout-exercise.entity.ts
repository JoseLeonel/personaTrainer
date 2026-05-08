import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Workout } from './workout.entity';
import { Exercise } from './exercise.entity';
import { Set } from './set.entity';

@Entity()
export class WorkoutExercise {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Workout, workout => workout.workoutExercises, { onDelete: 'CASCADE' })
  workout: Workout;

  @ManyToOne(() => Exercise, { eager: true })
  exercise: Exercise;

  @Column()
  targetSets: number;

  @Column()
  targetReps: number;

  @Column({ nullable: true })
  restTimeSeconds: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  suggestedWeight: number; // Auto-filled by the system based on previous session

  @Column({ nullable: true })
  technicalNotes: string; // Trainer's notes for the client

  @Column({ default: false })
  isCompleted: boolean; // For the checklist feature

  @OneToMany(() => Set, set => set.workoutExercise, { cascade: true })
  sets: Set[];
}
