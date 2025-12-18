import { Injectable, Logger } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <Nest does not like it when this is import type>
import { SchedulerRegistry } from '@nestjs/schedule';
import type { CronJob } from 'cron';

@Injectable()
export class TasksService {
	constructor(private schedulerRegistry: SchedulerRegistry) {}

	// private readonly logger = new Logger('TasksService');

	getJob(name: string): CronJob<null, null> | undefined {
		const jobExists = this.schedulerRegistry.doesExist('cron', name);
		if (jobExists) {
			return this.schedulerRegistry.getCronJob(name);
		}

		return undefined;
	}

	addJob(name: string, job: CronJob) {
		// this.logger.log(`Adding cron job: ${name}`);
		const jobExists = this.schedulerRegistry.doesExist('cron', name);
		if (!jobExists) {
			this.schedulerRegistry.addCronJob(name, job);
		}
	}

	startJob(name: string) {
		// this.logger.log(`Starting cron job: ${name}`);
		const jobExists = this.schedulerRegistry.doesExist('cron', name);
		if (jobExists) {
			const job = this.schedulerRegistry.getCronJob(name);

			if (!job.isActive) {
				job.start();
			}
		}
	}

	stopJob(name: string) {
		// this.logger.log(`Stopping cron job: ${name}`);
		const jobExists = this.schedulerRegistry.doesExist('cron', name);
		if (jobExists) {
			const job = this.schedulerRegistry.getCronJob(name);

			if (job.isActive) {
				job.stop();
			}
		}
	}
}
