import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class SystemParameter {
  @PrimaryColumn()
  key: string;

  @Column()
  value: string;

  @Column({ nullable: true })
  description: string;
}
