import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { Public } from '../../common/decorators';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('verify/:txRef')
  verify(@Param('txRef') txRef: string) { return this.paymentsService.verifyPayment(txRef); }

  @Public()
  @Post('webhook/chapa')
  chapaWebhook(@Body() payload: any) { return this.paymentsService.handleWebhook(payload); }
}
