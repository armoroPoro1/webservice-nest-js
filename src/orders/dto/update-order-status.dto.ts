import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderStatusDto extends PartialType(CreateOrderDto) {
  @IsString()
  status: string;
}
