import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('commitments')
export class CommitmentsModel {
  @PrimaryColumn('uuid')
  uuid: string;
  @CreateDateColumn()
  created_at?: Date;
  @UpdateDateColumn()
  updated_at?: Date;
  @DeleteDateColumn()
  deleted_at?: Date;

  @Column()
  date: Date;
  @Column()
  title: string;
  @Column()
  event_place: string;
  @Column()
  time: string;
}
