import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';

export enum UserRole { CUSTOMER = 'customer', ADMIN = 'admin', SUPER_ADMIN = 'super_admin' }

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) email: string;
  @Column() firstName: string;
  @Column() lastName: string;
  @Column({ nullable: true }) phone: string;
  @Column({ select: false }) @Exclude() password: string;
  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER }) role: UserRole;
  @Column({ default: true }) isActive: boolean;
  @Column({ default: false }) emailVerified: boolean;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
