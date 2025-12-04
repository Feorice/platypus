import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EntitiesModule } from './db/entities/entities.module';
import { GatewaysModule } from './gateways/gatesways.module';

console.log(`${__dirname}/db/**/*.entity{.ts,.js}`);
@Module({
	imports: [
		EntitiesModule,
		TypeOrmModule.forRoot({
			type: 'better-sqlite3',
			database: `dist/db/data.db`,
			autoLoadEntities: true,
			synchronize: true,
		}),
		ScheduleModule.forRoot(),
		GatewaysModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
