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
import type { SensorEntity } from '../db/entities/sensor.entity';
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
		this.startDefaultJobs();
	}

	createDefaultJobs() {
		this.tasksService.addJob(
			'hardware:sensors',
			new CronJob(CronExpression.EVERY_5_SECONDS, async () => {
				const promises: Promise<{
					scale: string;
					temperature: number;
					humidity: number;
				} | null>[] = [];
				const sensors: { type: 11 | 22; pin: number }[] = [
					{ type: 22, pin: 17 },
					{ type: 22, pin: 22 },
					{ type: 22, pin: 23 },
					{ type: 22, pin: 10 },
				];

				sensors.forEach((sensor) => {
					promises.push(
						this.hardwareService.getSensorData(sensor.type, sensor.pin),
					);
				});

				const data = await Promise.all(promises);

				this.server.sockets.emit('sensors', data);

				// const sensorData = await this.hardwareService.getSensorData();

				// if (sensorData) {
				// 	await this.sensorService.create(sensorData as Partial<SensorEntity>);
				// 	this.server.sockets.emit('sensor:DHT22', sensorData);
				// }
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
		this.tasksService.startJob('hardware:sensors');
		this.tasksService.startJob('server:stats');
	}

	async handleConnection(client: Socket): Promise<void> {}

	async handleDisconnect(client: Socket): Promise<void> {}
}
