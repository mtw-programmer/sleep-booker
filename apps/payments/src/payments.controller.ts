import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateChargeDto } from '@app/common';
import { Response } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('create_charge')
  async createCharge(@Payload() data: CreateChargeDto) {
    return this.paymentsService.createCharge(data);
  }

  @Post('webhook')
  async handleWebhook(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
    const signature = req.headers['stripe-signature'] as string;
    this.paymentsService.confirmPayment(req, signature);
    response.send();
  }
}
