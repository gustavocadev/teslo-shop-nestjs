import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  constructor() {}

  getStaticProductImage(imageName: string) {
    const path = join(__dirname, '..', '..', 'static', 'products', imageName);

    if (!existsSync(path)) {
      throw new BadRequestException('Not Product found');
    }
    return path;
  }
}
