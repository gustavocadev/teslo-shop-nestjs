import { ProductImage } from './product-image.entity'
import { User } from '../../auth/entities/user.entity'
import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

@Entity({ name: 'products' })
export class Product {
	@ApiProperty({
		example: '5f9f1c5c-7b1f-4b5c-8c1a-1c5c7b1f4b5c',
		description: 'Unique identifier for the product',
		uniqueItems: true,
	})
	@PrimaryGeneratedColumn('uuid')
	id: string

	@ApiProperty({
		example: 'Nike Air Force 1',
		description: 'Name of the product',
		uniqueItems: true,
	})
	@Column('text', {
		unique: true,
	})
	title: string

	@ApiProperty({
		example: 100,
		description: 'Price of the product',
	})
	@Column('float', { default: 0 })
	price: number

	@ApiProperty({
		example:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vitae ultricies ultricies, nunc nisl ultrices nisl, nec ultricies nisl nunc sed nisl. Sed euismod, nisl vitae ultricies ultricies, nunc nisl ultrices nisl, nec ultricies nisl nunc sed nisl.',
		description: 'Description of the product',
	})
	@Column({
		type: 'text',
		nullable: true,
	})
	description: string

	@ApiProperty({
		example: 'nike_air_force_1',
		description: 'Slug of the product',
	})
	@Column({
		type: 'text',
		unique: true,
	})
	slug: string

	@ApiProperty({
		example: 10,
		description: 'Stock of the product',
	})
	@Column('int', { default: 0 })
	stock: number

	@ApiProperty({
		example: ['M', 'L', 'XL'],
		description: 'Rating of the product',
	})
	@Column('text', { array: true })
	sizes: string[]

	@ApiProperty({
		example: 'male',
		description: 'Gender of the product',
	})
	@Column('text')
	gender: string

	@ApiProperty({
		example: 'shoes',
		description: 'Category of the product',
	})
	@Column('text', { array: true, default: [] })
	tags: string[]

	@ApiProperty({
		example:
			'https://images.unsplash.com/photo-1610000000000-000000000000?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
		description: 'Image of the product',
	})
	// images
	@OneToMany(() => ProductImage, (productImage) => productImage.product, {
		cascade: true,
		eager: true,
	})
	images?: ProductImage[]

	@ManyToOne(() => User, (user) => user.product, {
		// eager means that when we get a product, we also get the user
		eager: true,
	})
	user: User

	@BeforeInsert()
	checkSlugInsert() {
		if (!this.slug) {
			this.slug = this.title
		}

		this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '')
	}

	@BeforeUpdate()
	checkSlugUpdate() {
		this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '')
	}
}
