import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { OrderProduct } from '../../orders/entities/order-product.entity';
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  price: number;
  @Column()
  quantity: number;
  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product)
  orderProducts: OrderProduct[];
}
