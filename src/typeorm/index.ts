import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Status } from '../orders/entities/status.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderProduct } from '../orders/entities/order-product.entity';
const entities = [User, Product, Status, Order, OrderProduct];

export { User, Product, Status, Order, OrderProduct };
export default entities;
