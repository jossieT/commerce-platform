import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('addresses')
export class AddressEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() userId: string;
  @ManyToOne(() => UserEntity) @JoinColumn({ name: 'userId' }) user: UserEntity;
  @Column({ default: 'Home' }) label: string;
  @Column() fullName: string;
  @Column() phone: string;
  @Column() street: string;
  @Column() city: string;
  @Column() region: string;
  @Column({ default: 'Ethiopia' }) country: string;
  @Column({ default: false }) isDefault: boolean;
  @CreateDateColumn() createdAt: Date;
}
