import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from './../products/products.service';
import { Repository } from 'typeorm';
import { initialData } from './data/data';
import { User } from 'src/auth/entities/user.entity';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private productService: ProductsService
  ) {}
  async runSeed() {
    await this.#deleteTables();

    const adminUser = await this.#insertUsers();

    await this.#insertNewProducts(adminUser);

    return 'This action adds a new seed';
  }

  async #deleteTables() {
    await this.productService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    await queryBuilder.delete().where({}).execute();
  }

  async #insertUsers() {
    const seedUsers = initialData.users;

    const users = [];

    const salt = await bcryptjs.genSalt(10);

    seedUsers.forEach((seedUser) => {
      seedUser.password = bcryptjs.hashSync(seedUser.password, salt);
      users.push(this.userRepository.create(seedUser));
    });

    const dbUsers = await this.userRepository.save(users);
    return dbUsers[0];
  }

  async #insertNewProducts(user: User) {
    this.productService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    for (const product of products) {
      insertPromises.push(this.productService.create(product, user));
    }

    await Promise.all(insertPromises);

    return true;
  }
}
