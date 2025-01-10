import config from 'config';
import { CronJob } from 'cron';
import fsSync from 'fs';

import JobSettingRepository from '../core/repositories/JsonJobSettingRepository';
import JobSetting from '../core/entities/JobSetting';
import JsonJobSettingRepository from '../core/repositories/JsonJobSettingRepository';

export default class JobSettingWatcher {
    private cronJobs: CronJob[] = [];

    constructor(public callback: (jobSetting: JobSetting) => Promise<void>) {
        fsSync.watchFile(JsonJobSettingRepository.settingFilePath, async () => {
            this.unloadJobSetting();
            await this.loadJobSetting();
        })
    }

    async loadJobSetting(): Promise<void> {
        const jobSettingRepository = new JobSettingRepository();
        const jobSettings = await jobSettingRepository.readAll();
        this.cronJobs.push(...jobSettings.map(jobSetting => this.createCronJob(jobSetting)));
    }

    private unloadJobSetting(): void {
        this.cronJobs.forEach(cronJob => cronJob.stop());
        this.cronJobs.splice(0);
    }

    private createCronJob(jobSetting: JobSetting): CronJob {
        return CronJob.from({
            cronTime: jobSetting.cronTime,
            onTick: async () => {
                await this.callback(jobSetting);
            },
            start: true,
            timeZone: config.get('timeZone'),
        });
    }
}
