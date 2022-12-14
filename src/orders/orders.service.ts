import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository, In } from 'typeorm';
import { Status } from './entities/status.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CreateOrderProductDto } from './dto/create-order-product.dto';
import { OrderProduct } from './entities/order-product.entity';
@Injectable()
export class OrdersService {
  private STATUS_SUBMITTED = 'Submitted';
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectRepository(OrderProduct)
    private readonly orderProductRepository: Repository<OrderProduct>,
  ) {}
  async create(userId: number, createOrder: CreateOrderDto) {
    let summary = 0;
    const statusDraft = await this.statusRepository.findOne({
      where: { name: 'Draft' },
    });
    const listIdProduct = createOrder.products.map((item) => item.productId);
    const productList = await this.productRepository.find({
      where: { id: In(listIdProduct) },
    });
    for (const item of productList) {
      const cost = item.price * item.quantity;
      summary += cost;
    }
    let orderId: number;
    // start create Order
    try {
      const name = `Order at ${new Date().toISOString()}`;
      const order = new Order();
      order.userId = userId;
      order.statusId = statusDraft.id;
      order.name = name;
      order.summary = summary;
      const resultOrder = await this.orderRepository.save(order);
      this.logger.info(`Create order: ${resultOrder.id} Success`, {
        ServiceName: OrdersService.name,
      });
      for (const item of createOrder.products) {
        const orderProduct = new OrderProduct();
        orderProduct.order = resultOrder;
        orderProduct.productId = item.productId;
        orderProduct.quantity = item.quantity;
        await this.orderProductRepository.save(orderProduct);
      }
      this.logger.info(`Create orderProduct: ${resultOrder.id} Success`, {
        ServiceName: OrdersService.name,
      });
    } catch (error) {
      this.logger.error(`Error create order: ${error.message}`);
      throw error;
    }
    return {
      message: 'Create order success',
    };
  }
  async updateOrderStatus(
    userId: number,
    orderId: number,
    updateOrderStatus: UpdateOrderStatusDto,
  ) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user', 'status'],
    });
    if (!order) {
      throw new HttpException('Order not found', 400);
    }
    if (order.status.name === updateOrderStatus.status) {
      throw new HttpException('Status equal old status', 400);
    }
    if (order.user.id !== userId) {
      throw new HttpException('You not owner order', 400);
    }
    const listStatus = await this.statusRepository.find();
    const mapStatusByName = new Map();
    for (const item of listStatus) {
      mapStatusByName.set(item.name, item.id);
    }
    if (order.status.id === mapStatusByName.get('Cancel')) {
      throw new HttpException('Order is cancel.', 400);
    }
    if (updateOrderStatus.status === this.STATUS_SUBMITTED) {
      order.submitDate = new Date();
    }
    order.status.id = mapStatusByName.get(updateOrderStatus.status);
    await this.orderRepository.save(order);
    return {
      message: 'Update order status success',
    };
  }
  async findAll(userId: number) {
    const orderList = await this.orderRepository.find({
      where: { userId },
      relations: ['status', 'user', 'orderProducts', 'orderProducts.product'],
      order: { id: 'DESC' },
    });
    return orderList;
  }
  async findOne(userId: number, orderId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, userId: userId },
      relations: ['status', 'user', 'orderProducts', 'orderProducts.product'],
    });
    if (!order) {
      throw new HttpException('Order not found', 400);
    }
    if (order.userId !== userId) {
      throw new HttpException('You not owner order', 400);
    }
    return order;
  }
}
