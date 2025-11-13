import { Logger } from '@nestjs/common';
import { CronExpression } from '@nestjs/schedule';
import {
	type OnGatewayConnection,
	type OnGatewayDisconnect,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { CronJob } from 'cron';
import type { Server, Socket } from 'socket.io';
// biome-ignore lint/style/useImportType: <Nest does not like it when this is import type>
import { TasksService } from '../tasks/tasks.service';

const getRandomNumber = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
	private readonly logger = new Logger('TasksService');

	@WebSocketServer()
	server!: Server;

	constructor(private tasksService: TasksService) {
		tasksService.addJob(
			'atmosphere',
			new CronJob(CronExpression.EVERY_SECOND, () => {
				const value = getRandomNumber(70, 75);
				this.server.sockets.emit('atmosphere:data', {
					temperature: value,
					humidity: 35,
					scale: 'C',
				});
			}),
		);
	}

	handleConnection(client: Socket, ...args: any[]): any {
		this.logger.log(`${client.id} connected`);
		this.tasksService.startJob('atmosphere');
	}

	async handleDisconnect(client: Socket, ...args: any[]): Promise<void> {
		this.logger.log(`${client.id} disconnected`);
		const noClients = !(await this.server.sockets.fetchSockets()).length;

		if (noClients) {
			this.tasksService.stopJob('atmosphere');
		}
	}
}
