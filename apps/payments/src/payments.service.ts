import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateChargeDto, PaymentIntentResponseDto } from '@app/common';
import { ReservationsService } from 'apps/reservations/src/reservations.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2024-06-20',
    }
  );

  constructor(
    private readonly configService: ConfigService,
    private reservationsService: ReservationsService
  ) {}

  async createCharge(
    { amount }: CreateChargeDto
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    this.logger.log('Created new payment intent', paymentIntent);

    return paymentIntent;
  }

  async confirmPayment(req: any, signature: string) {
    let event;

    try {
      event = this.stripe.webhooks.constructEvent(req.body, signature, this.configService.get('STRIPE_SECRET_KEY'));
    } catch (err) {
      this.logger.warn('Stripe webhook error', err);
      throw new BadRequestException('Error during payment confirmation');
    }

    switch(event.type) {
      case 'payment_intent.succeeded':
        const paymentIntentSucceeded = event.data.object;
        const updatedReservation = await this.reservationsService.update(paymentIntentSucceeded.id, { confirmed: true });
        return updatedReservation;
      default:
        this.logger.warn('Stripe webhook unhandled event type', event);
        throw new BadRequestException('Unhandled event type');
    }
  }
}
