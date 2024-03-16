import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('auth_users')
export class UserModel {
  @PrimaryColumn('uuid')
  uuid: string;
  @CreateDateColumn()
  created_at?: Date;
  @UpdateDateColumn()
  updated_at?: Date;
  @DeleteDateColumn()
  deleted_at?: Date;

  @Column()
  name: string;
  @Column()
  email: string;
  @Column()
  password: string;
}
