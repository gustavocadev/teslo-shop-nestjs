import {
	Controller,
	Post,
	Body,
	Get,
	UseGuards,
	Request,
	Headers,
	SetMetadata,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { GetUser } from './decorators/get-user.decorator'
import { User } from './entities/user.entity'
import { RawHeaders } from './decorators/raw-headers.decorator'
import { UserRoleGuard } from './guards/user-role.guard'
import { RoleProtected } from './decorators/role-protected.decorator'
import { ValidRoles } from './interfaces/valid-roles'
import { Auth } from './decorators/auth.decorator'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	create(@Body() createUserDto: CreateUserDto) {
		return this.authService.create(createUserDto)
	}

	@Post('login')
	loginUser(@Body() loginUserDto: LoginUserDto) {
		return this.authService.login(loginUserDto)
	}

	@Get('check-auth-status')
	@Auth()
	checkAuthStatus(@GetUser() user: User) {
		return this.authService.checkAuthStatus(user)
	}

	@Get('private')
	@UseGuards(AuthGuard())
	testingPrivateRoute(
		@GetUser() user: User,
		@GetUser('email') userEmail: string,
		@RawHeaders() rawHeaders: string[],
		@Headers() headers: string[]
	) {
		// @Request() req: Express.Request

		return {
			message: 'This is a private route',
			user,
			userEmail,
			rawHeaders,
			headers,
		}
	}
	// @SetMetadata('roles', ['admin', 'super-user'])

	@Get('private2')
	@RoleProtected(ValidRoles.SUPER_USER, ValidRoles.ADMIN, ValidRoles.USER)
	@UseGuards(AuthGuard(), UserRoleGuard)
	async PrivateRoute2(@GetUser() user: User) {
		return {
			message: 'This is a private route',
			user,
		}
	}

	@Get('private3')
	@Auth(ValidRoles.ADMIN)
	async PrivateRoute3(@GetUser() user: User) {
		return {
			message: 'This is a private route',
			user,
		}
	}
}
