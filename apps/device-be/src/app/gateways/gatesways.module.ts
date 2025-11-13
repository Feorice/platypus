import { Module } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';
import { EventsGateway } from './events.gateway';

@Module({
	providers: [EventsGateway, TasksService],
})
export class GatewaysModule {}
