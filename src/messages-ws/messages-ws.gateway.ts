import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { NewMessageDto } from './dtos/new-message.dto'
import { MessagesWsService } from './messages-ws.service'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface'
import { User } from 'src/auth/entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@WebSocketGateway({
	cors: true,
	namespace: '/',
})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() wss: Server

	constructor(
		private readonly messagesWsService: MessagesWsService,
		private readonly jwtService: JwtService
	) {}

	async handleConnection(client: Socket) {
		// console.log('Client connected', client.id)
		const token = (client.handshake.headers.token as string) ?? 'No hay jwt'
		let payload: JwtPayload

		try {
			payload = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			})
			await this.messagesWsService.registerClient(client, payload.id)
		} catch (error) {
			client.disconnect()
			return
		}

		this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())
	}
	handleDisconnect(client: Socket) {
		// console.log('Client disconnected', client.id)
		this.messagesWsService.removeClient(client.id)
		// console.log({ conectados: this.messagesWsService.getConnectedClients() })

		this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())
	}
	@SubscribeMessage('message-from-client')
	async handleMessageFromClient(client: Socket, payload: NewMessageDto) {
		// esto solo se envia al cliente que envio el mensaje
		// client.emit('message-from-server', {
		// 	fullName: 'Server',
		// 	message: payload.message ?? '',
		// })

		// esto envia a todos menos al que envio el mensaje
		// client.broadcast.emit('message-from-server', {
		// 	fullName: 'Server',
		// 	message: payload.message ?? '',
		// } as NewMessageDto)

		// esto envia a todos incluyendo al que envio el mensaje
		const fullName = this.messagesWsService.getUserFullNameBySocketId(client.id)
		this.wss.emit('message-from-server', {
			fullName,
			message: payload.message ?? '',
			id: client.id ?? '',
		})
	}
}
