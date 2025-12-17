import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { TimerController } from './controllers/timer.controller';
import { EntitiesModule } from './db/entities/entities.module';
import { GatewaysModule } from './gateways/gatesways.module';
import { BootService } from './services/boot.service';
import { HardwareService } from './services/hardware.service';
import { TasksService } from './services/tasks.service';
import { TimerService } from './services/timer.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [configuration],
		}),
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
	providers: [
		BootService,
		AppService,
		TimerService,
		TasksService,
		HardwareService,
	],
})
export class AppModule {}
