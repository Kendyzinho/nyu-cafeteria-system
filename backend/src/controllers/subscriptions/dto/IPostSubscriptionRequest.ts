import { IsNumber, IsNotEmpty, Min } from 'class-validator';

export class IPostSubscriptionRequest {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  planId: number;
}
