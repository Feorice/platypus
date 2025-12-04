import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntitiesController } from './entities/entities.controller';
import { EntitiesService } from './entities/entities.service';
import { GenericEntity } from './entities/entity.entity';

@Module({
	imports: [TypeOrmModule.forFeature([GenericEntity])],
	providers: [EntitiesService],
	controllers: [EntitiesController],
})
export class EntitiesModule {}
