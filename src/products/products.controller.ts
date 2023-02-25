import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	ParseUUIDPipe,
	Query,
} from '@nestjs/common'
import { ProductsService } from './products.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { PaginationDto } from '../common/dtos/pagination.dto'
import { Auth } from '../auth/decorators/auth.decorator'
// import { ValidRoles } from '../auth/interfaces/valid-roles'
import { GetUser } from '../auth/decorators/get-user.decorator'
import { User } from '../auth/entities/user.entity'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Product } from 'src/products/entities/product.entity'

@ApiTags('Products')
@Controller('products')
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Post()
	@Auth()
	@ApiResponse({
		status: 201,
		description: 'The record has been successfully created.',
		type: Product,
	})
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 400, description: 'Bad Request.' })
	create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
		return this.productsService.create(createProductDto, user)
	}

	@Get()
	findAll(@Query() paginationDto: PaginationDto) {
		console.log(paginationDto)
		return this.productsService.findAll(paginationDto)
	}

	@Get(':term')
	findOne(@Param('term') term: string) {
		return this.productsService.findOnePlain(term)
	}

	@Patch(':id')
	@Auth()
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateProductDto: UpdateProductDto,
		@GetUser() user: User
	) {
		return this.productsService.update(id, updateProductDto, user)
	}

	@Delete(':id')
	@Auth()
	remove(@Param('id', ParseUUIDPipe) id: string) {
		return this.productsService.remove(id)
	}
}
