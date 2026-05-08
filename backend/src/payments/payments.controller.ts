import { Controller, Post, Body, Param, Get, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('register')
  registerPayment(
    @Body('clientId') clientId: number,
    @Body('amount') amount: number,
    @Body('paymentDate') paymentDate: string,
    @Body('notes') notes?: string,
  ) {
    return this.paymentsService.registerPayment(clientId, amount, paymentDate, notes);
  }

  @Get('defaulters')
  getDefaulters(@Query('trainerId') trainerId: number) {
    return this.paymentsService.getDefaulters(trainerId);
  }
}
