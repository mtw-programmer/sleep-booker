import { IsInt, Min } from 'class-validator';

export class CreateChargeDto {
  @IsInt()
  @Min(50)
  amount: number;
}