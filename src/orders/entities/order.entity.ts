import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
  JoinTable,
} from 'typeorm';
import { Status } from './status.entity';
import { User } from '../../users/entities/user.entity';
import { OrderProduct } from './order-product.entity';
@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  summary: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdDate: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  submitDate: Date;
  @Column()
  userId: number;

  @Column()
  statusId: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Status, (status) => status.id)
  status: Status;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
  orderProducts: OrderProduct[];
}
