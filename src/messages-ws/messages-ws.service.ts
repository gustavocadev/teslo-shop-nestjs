import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Socket } from 'socket.io'
import { User } from 'src/auth/entities/user.entity'
import { Repository } from 'typeorm'

type ConnectedClients = {
	[key: string]: {
		socket: Socket
		user: User
	}
}

@Injectable()
export class MessagesWsService {
	#connectedClients: ConnectedClients = {}

	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}

	async registerClient(client: Socket, userId: string) {
		const user = await this.userRepository.findOne({
			where: { id: userId },
		})

		if (!user) throw new Error('User not found')
		if (!user.isActive) throw new Error('User is not active')

		this.#connectedClients[client.id] = {
			socket: client,
			user,
		}
	}

	removeClient(clientId: string) {
		delete this.#connectedClients[clientId]
	}

	getConnectedClients(): string[] {
		return Object.keys(this.#connectedClients)
	}

	getUserFullNameBySocketId(socketId: string) {
		return this.#connectedClients[socketId].user.fullName
	}
}
