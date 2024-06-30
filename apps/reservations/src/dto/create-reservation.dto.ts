import { Type } from 'class-transformer';
import { IsString, IsDate, IsNotEmpty, IsDefined, ValidateNested } from 'class-validator';
import { CreateChargeDto } from '@app/common';

export class CreateReservationDto {
  @IsDate()
  @Type(() => Date)
  startDate: Date;
  
  @IsDate()
  @Type(() => Date)
  endDate: Date;
  
  @IsString()
  @IsNotEmpty()
  placeId: string;
  
  @IsString()
  @IsNotEmpty()
  invoiceId: string;

  @IsDefined()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateChargeDto)
  charge: CreateChargeDto
}
