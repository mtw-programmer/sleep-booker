import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { NOTIFICATIONS_SERVICE } from '@app/common';
import { ReservationsService } from 'apps/reservations/src/reservations.service';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';
import { UsersService } from 'apps/auth/src/users/users.service';

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
    private reservationsService: ReservationsService,
    private usersService: UsersService,
    @Inject(NOTIFICATIONS_SERVICE) private readonly notificationsService: ClientProxy
  ) {}

  async createCharge(
    { amount, email }: PaymentsCreateChargeDto
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    this.logger.log('Created new payment intent', paymentIntent);

    this.notificationsService.emit('notify_email', {
      email,
      text: `Your payment intent of price $${(amount / 100).toFixed(2)} has been created successfully. Confirm the payment to finish your reservation.`
    });

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
        const updatedReservation = await this.reservationsService.updateByInvoiceId(paymentIntentSucceeded.id, { confirmed: true });
        const userId = updatedReservation.userId;
        const { email } = await this.usersService.getUser({ _id: userId });
        this.notificationsService.emit('notify_email', {
          email,
          text: 'Your reservation has been successfully confirmed.'
        });
        return updatedReservation;
      default:
        this.logger.warn('Stripe webhook unhandled event type', event);
        throw new BadRequestException('Unhandled event type');
    }
  }
}
