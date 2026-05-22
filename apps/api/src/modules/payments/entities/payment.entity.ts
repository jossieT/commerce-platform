import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
export enum PaymentStatus { PENDING='pending', SUCCESS='success', FAILED='failed', CANCELLED='cancelled', REFUNDED='refunded' }
export enum PaymentProvider { CHAPA='chapa' }

@Entity('payments')
export class PaymentEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() orderId: string;
  @Column({ type: 'enum', enum: PaymentProvider, default: PaymentProvider.CHAPA }) provider: PaymentProvider;
  @Column({ unique: true }) txRef: string;
  @Column({ nullable: true }) chapaTransactionId: string;
  @Column('decimal', { precision: 10, scale: 2 }) amount: number;
  @Column({ default: 'ETB' }) currency: string;
  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING }) status: PaymentStatus;
  @Column({ type: 'jsonb', nullable: true }) metadata: Record<string, unknown>;
  @Column({ nullable: true }) paidAt: Date;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
