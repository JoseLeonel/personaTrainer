import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

export enum PhotoType {
  UPPER_BODY = 'UPPER_BODY',
  LOWER_BODY = 'LOWER_BODY',
}

@Entity()
export class ProgressPhoto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: PhotoType,
  })
  photoType: PhotoType;

  @Column()
  filePath: string; // Store the relative path, e.g. /uploads/filename.jpg

  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  client: User;

  @CreateDateColumn()
  createdAt: Date;
}
