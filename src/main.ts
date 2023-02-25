import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const logger = new Logger('Bootstrap')

	app.setGlobalPrefix('api')

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
		})
	)

	const config = new DocumentBuilder()
		.setTitle('Teslo rest api')
		.setDescription('Tesloshop endpoints')
		.setVersion('1.0')
		.build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('api', app, document)

	await app.listen(process.env.PORT ?? 3000)
	logger.log(`Application listening on port ${process.env.PORT ?? 3000}`)
}
bootstrap()
