import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewaysModule } from './gateways/gatesways.module';

@Module({
	imports: [ScheduleModule.forRoot(), GatewaysModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
