import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenericEntity } from './generic-entity.entity';
import { RelayEntity } from './relay.entity';
import { SensorEntity } from './sensor.entity';
import { TimerEntity } from './timer.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			GenericEntity,
			TimerEntity,
			SensorEntity,
			RelayEntity,
		]),
	],
	exports: [TypeOrmModule],
	providers: [],
	controllers: [],
})
export class EntitiesModule {}
