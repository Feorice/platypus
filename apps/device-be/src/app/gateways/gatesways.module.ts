import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EntitiesModule } from '../db/entities/entities.module';
import { HardwareService } from '../services/hardware.service';
import { SensorService } from '../services/sensor.service';
import { TasksService } from '../services/tasks.service';
import { EventsGateway } from './events.gateway';

@Module({
	imports: [EntitiesModule],
	providers: [
		TasksService,
		HardwareService,
		SensorService,
		EventsGateway,
		ConfigService,
	],
})
export class GatewaysModule {}
