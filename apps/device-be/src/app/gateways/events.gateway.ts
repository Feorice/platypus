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
import { HardwareService } from '../services/hardware.service';
// biome-ignore lint/style/useImportType: <Nest does not like it when this is import type>
import { SensorService } from '../services/sensor.service';
// biome-ignore lint/style/useImportType: <Nest does not like it when this is import type>
import { TasksService } from '../services/tasks.service';

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
	private readonly logger = new Logger('TasksService');

	@WebSocketServer()
	server!: Server;

	constructor(
		private tasksService: TasksService,
		private hardwareService: HardwareService,
		private sensorService: SensorService,
	) {
		this.createDefaultJobs();
	}

	createDefaultJobs() {
		this.tasksService.addJob(
			'sensor:DHT22',
			new CronJob(CronExpression.EVERY_SECOND, async () => {
				const sensorData = await this.hardwareService.getSensorData();
				await this.sensorService.create(sensorData);
				this.server.sockets.emit('sensor:DHT22', sensorData);
			}),
		);

		this.tasksService.addJob(
			'server:stats',
			new CronJob(CronExpression.EVERY_SECOND, async () => {
				this.server.sockets.emit('server:stats', {
					localTime: new Date().toString(),
				});
			}),
		);
	}

	handleConnection(client: Socket): void {
		this.logger.log(`${client.id} connected`);
		this.tasksService.startJob('sensor:DHT22');
		this.tasksService.startJob('server:stats');
	}

	async handleDisconnect(client: Socket): Promise<void> {
		this.logger.log(`${client.id} disconnected`);
		const noClients = !(await this.server.sockets.fetchSockets()).length;

		if (noClients) {
			this.tasksService.stopJob('sensor:DHT22');
		}
	}
}
