import { IsInt, IsOptional, IsPositive, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class PaginationDto {
	@ApiProperty({
		example: 10,
		description: 'Limit of items per page',
		required: false,
	})
	@IsInt()
	@IsOptional()
	@IsPositive()
	@Type(() => Number)
	limit?: number

	@IsInt()
	@IsOptional()
	@Min(0)
	@Type(() => Number)
	offset?: number
}
