import {
	BadRequestException,
	Controller,
	Param,
	Post,
	Res,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { FilesService } from './files.service'
import { fileFilter } from './helpers/fileFilter'
import { fileNamer } from './helpers/fileNamer'
import { Get } from '@nestjs/common'
import { Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Files - Get and upload images')
@Controller('files')
export class FilesController {
	constructor(
		private readonly filesService: FilesService,
		private readonly configService: ConfigService
	) {}

	@Post('product')
	@UseInterceptors(
		FileInterceptor('file', {
			fileFilter: fileFilter,
			// limits: {
			//   fileSize: 1024 * 1024 * 5,
			// }
			storage: diskStorage({
				destination: './static/products',
				filename: fileNamer,
			}),
		})
	)
	uploadFile(@UploadedFile() file: Express.Multer.File) {
		if (!file) {
			throw new BadRequestException('Make sure the file is an image')
		}

		const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`

		return {
			secureUrl,
		}
	}

	@Get('product/:imageName')
	findProductImage(@Res() res: Response, @Param('imageName') imageName: string) {
		const path = this.filesService.getStaticProductImage(imageName)

		res.sendFile(path)
	}
}
