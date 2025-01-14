import config from 'config';
import { CronJob } from 'cron';
import fsSync from 'fs';

import JobSettingRepository from '../core/repositories/JsonJobSettingRepository';
import IJobSetting from '../core/entities/IJobSetting';
import JsonJobSettingRepository from '../core/repositories/JsonJobSettingRepository';
import JobSetting from '../core/entities/IJobSetting';

export default class JobSettingWatcher {
    private cronJobs: CronJob[] = [];

    constructor(public callback: (jobSetting: IJobSetting) => Promise<void>) {
        fsSync.watchFile(JsonJobSettingRepository.settingFilePath, async () => {
            this.unloadJobSetting();
            await this.loadJobSetting();
        })
    }

    async loadJobSetting(): Promise<void> {
        const jobSettingRepository = new JobSettingRepository();
        const jobSettings = await jobSettingRepository.readAllAsync();
        this.cronJobs.push(...jobSettings.filter(jobSetting => jobSetting.cronTime && jobSetting.enabled).map(jobSetting => this.createCronJob(jobSetting)));
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
