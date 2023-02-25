import { Controller, Get } from '@nestjs/common'
import { Auth } from '../auth/decorators/auth.decorator'
import { ValidRoles } from '../auth/interfaces/valid-roles'
import { SeedService } from './seed.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
	constructor(private readonly seedService: SeedService) {}

	@Get()
	// @Auth(ValidRoles.ADMIN)
	executeSeed() {
		return this.seedService.runSeed()
	}
}
