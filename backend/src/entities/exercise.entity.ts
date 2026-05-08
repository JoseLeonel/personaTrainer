import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  primaryMuscleGroup: string;

  @Column({ nullable: true })
  secondaryMuscleGroup: string;

  @Column({ nullable: true })
  exerciseType: string;

  @Column({ nullable: true })
  difficultyLevel: string;

  @Column({ nullable: true })
  equipment: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  executionInstructions: string;

  @Column({ type: 'text', nullable: true })
  commonMistakes: string;

  // Technical
  @Column({ nullable: true })
  sets: number;

  @Column({ nullable: true })
  repetitions: string;

  @Column({ nullable: true })
  cadence: string;

  @Column({ nullable: true })
  rir: string;

  @Column({ nullable: true })
  restSeconds: number;

  @Column({ default: false })
  timerEnabled: boolean;

  // Multimedia
  @Column({ nullable: true }) // RN-02: Enforced at application level
  mainImageUrl: string;

  @Column({ type: 'text', array: true, nullable: true })
  galleryImages: string[];

  @Column({ nullable: true })
  videoUrl: string;

  @Column({ nullable: true })
  externalVideoUrl: string;

  @Column({ nullable: true })
  thumbnailUrl: string;

  // Status
  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
