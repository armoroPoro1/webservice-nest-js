import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsPositive, ValidateNested } from 'class-validator';
import { CreateOrderProductDto } from './create-order-product.dto';
export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderProductDto)
  products: CreateOrderProductDto[];
}
