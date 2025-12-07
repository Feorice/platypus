import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TimerController } from './controllers/timer.controller';
import { EntitiesModule } from './db/entities/entities.module';
import { GatewaysModule } from './gateways/gatesways.module';
import { TasksService } from './services/tasks.service';
import { TimerService } from './services/timer.service';

@Module({
	imports: [
		EntitiesModule,
		TypeOrmModule.forRoot({
			type: 'better-sqlite3',
			database: join(__dirname, '..', '/db/data.db'),
			autoLoadEntities: true,
			synchronize: true,
		}),
		ScheduleModule.forRoot(),
		GatewaysModule,
	],
	controllers: [AppController, TimerController],
	providers: [AppService, TimerService, TasksService],
})
export class AppModule {}
