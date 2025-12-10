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
import { SensorEntity } from '../db/entities/sensor.entity';

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
		this.startDefaultJobs();
	}

	createDefaultJobs() {
		this.tasksService.addJob(
			'sensor:DHT22',
			new CronJob(CronExpression.EVERY_5_SECONDS, async () => {
				const sensorData = await this.hardwareService.getSensorData();

				if (sensorData) {
					await this.sensorService.create(sensorData as Partial<SensorEntity>);
					this.server.sockets.emit('sensor:DHT22', sensorData);
				}
				
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

	startDefaultJobs() {
		this.tasksService.startJob('sensor:DHT22')
		this.tasksService.startJob('server:stats')
	}

	async handleConnection(client: Socket): Promise<void> {
		// this.logger.log(`${client.id} connected`);

		// const clientCount = (await this.server.sockets.fetchSockets()).length
		// Logger.debug({clientCount})
		// if (!clientCount) {
		// 	this.tasksService.startJob('sensor:DHT22');
		// 	this.tasksService.startJob('server:stats');
		// }
	}

	async handleDisconnect(client: Socket): Promise<void> {
		// this.logger.log(`${client.id} disconnected`);
		// const clientCount = (await this.server.sockets.fetchSockets()).length;

		// if (!clientCount) {
		// 	this.tasksService.stopJob('sensor:DHT22');
		// }
	}
}
