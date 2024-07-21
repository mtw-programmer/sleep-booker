import { PartialType } from '@nestjs/mapped-types';
import { CreateReservationDto } from './create-reservation.dto';
import { IsBoolean } from 'class-validator';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
  @IsBoolean()
  confirmed: boolean;
}
