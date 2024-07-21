import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Response } from 'express';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('create_charge')
  async createCharge(@Payload() data: PaymentsCreateChargeDto) {
    return this.paymentsService.createCharge(data);
  }

  @Post('webhook')
  async handleWebhook(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
    const signature = req.headers['stripe-signature'] as string;
    this.paymentsService.confirmPayment(req, signature);
    response.send();
  }
}
