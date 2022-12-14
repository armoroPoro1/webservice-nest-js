import { IsNumber, IsPositive } from 'class-validator';
export class CreateOrderProductDto {
  @IsNumber()
  productId: number;
  @IsNumber()
  @IsPositive()
  quantity: number;
}
