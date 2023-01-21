import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { ProductsService } from './../products/products.service';
import { Repository } from 'typeorm';
import { initialData } from './data/data';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private productService: ProductsService
  ) {}
  async runSeed() {
    await this.insertNewProducts();

    return 'This action adds a new seed';
  }

  async insertNewProducts() {
    this.productService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    for (const product of products) {
      insertPromises.push(this.productService.create(product));
    }

    await Promise.all(insertPromises);

    return true;
  }
}
