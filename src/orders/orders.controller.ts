import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { AuthGuard } from '@nestjs/passport';
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Req() req: any, @Body() createOrderDto: CreateOrderDto) {
    const userId: number = req.user.userId;
    return this.ordersService.create(userId, createOrderDto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch('update-status/:id')
  UpdateStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateStatusOrderDto: UpdateOrderStatusDto,
  ) {
    console.log('req.user:', req.user);
    const userId: number = req.user.userId;
    return this.ordersService.updateOrderStatus(
      userId,
      +id,
      updateStatusOrderDto,
    );
  }
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Req() req: any) {
    const userId: number = req.user.userId;
    return this.ordersService.findAll(userId);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    const userId: number = req.user.userId;
    return this.ordersService.findOne(userId, +id);
  }
}
