import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class DailyLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  feeling: string; // e.g., 'Cansado', 'Bien', 'Dolor', 'Energía'

  @Column({ nullable: true })
  comments: string; // Comments for the trainer

  @ManyToOne(() => User)
  client: User;

  @CreateDateColumn()
  createdAt: Date;
}
