import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async findAll() {
    return await this.productRepository.find();
  }
  async findOne(id: number) {
    return await this.productRepository.findOne({
      where: { id: id },
    });
  }
}
