import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { PaymentEntity, PaymentStatus } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(PaymentEntity) private paymentRepo: Repository<PaymentEntity>,
    private httpService: HttpService,
    private config: ConfigService,
  ) {}

  async initiatePayment(orderId: string, amount: number, userEmail: string, firstName: string, lastName: string) {
    const txRef = `ORD-${orderId}-${uuidv4().slice(0, 8)}`;
    const baseUrl = this.config.get('chapa.baseUrl');
    const apiUrl = `${this.config.get('app.storefrontUrl')}/api`;

    const { data } = await firstValueFrom(
      this.httpService.post(
        `${baseUrl}/transaction/initialize`,
        {
          amount: amount.toString(),
          currency: 'ETB',
          email: userEmail,
          first_name: firstName,
          last_name: lastName,
          tx_ref: txRef,
          callback_url: `${this.config.get('app.storefrontUrl')}/orders/${orderId}/confirmation`,
          return_url: `${this.config.get('app.storefrontUrl')}/orders/${orderId}/confirmation`,
          customization: { title: 'Checkout', description: `Order ${orderId}` },
        },
        { headers: { Authorization: `Bearer ${this.config.get('chapa.secretKey')}` } },
      ),
    );

    if (data.status !== 'success') throw new BadRequestException('Failed to initiate payment');

    const payment = this.paymentRepo.create({ orderId, txRef, amount, currency: 'ETB', status: PaymentStatus.PENDING });
    await this.paymentRepo.save(payment);

    return { checkoutUrl: data.data.checkout_url, txRef };
  }

  async verifyPayment(txRef: string) {
    const baseUrl = this.config.get('chapa.baseUrl');
    const { data } = await firstValueFrom(
      this.httpService.get(`${baseUrl}/transaction/verify/${txRef}`, {
        headers: { Authorization: `Bearer ${this.config.get('chapa.secretKey')}` },
      }),
    );

    const payment = await this.paymentRepo.findOne({ where: { txRef } });
    if (!payment) throw new BadRequestException('Payment record not found');

    if (data.status === 'success' && data.data.status === 'success') {
      payment.status = PaymentStatus.SUCCESS;
      payment.chapaTransactionId = data.data.id;
      payment.paidAt = new Date();
      payment.metadata = data.data;
      await this.paymentRepo.save(payment);
      return { verified: true, payment };
    }

    payment.status = PaymentStatus.FAILED;
    await this.paymentRepo.save(payment);
    return { verified: false, payment };
  }

  async handleWebhook(payload: any) {
    this.logger.log(`Chapa webhook received: ${JSON.stringify(payload)}`);
    const { trx_ref, status } = payload;
    if (status === 'success') await this.verifyPayment(trx_ref);
  }
}
