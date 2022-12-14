import { IsNumber, IsString } from 'class-validator';
export class OrderDto {
  @IsString()
  name: string;
  @IsNumber()
  summary: number;
  createdDate: Date;
  submitDate: Date;
  status_id: number;
  user_id: number;
}
