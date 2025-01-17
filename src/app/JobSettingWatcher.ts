import config from 'config';
import { CronJob } from 'cron';
import fsSync from 'fs';
import { default as IJobSetting, default as JobSetting } from '../core/entities/IJobSetting';
import RepositoryFactory from '../core/repositories/RepositoryFactory';

export default class JobSettingWatcher {
    private cronJobs: CronJob[] = [];

    constructor(public callback: (jobSetting: IJobSetting) => Promise<void>) {
        fsSync.watchFile(config.get('jobSettingFilePath'), async () => {
            this.unloadJobSetting();
            await this.loadJobSetting();
        })
    }

    async loadJobSetting(): Promise<void> {
        const jobSettingRepository = RepositoryFactory.getJobSetting();
        const jobSettings = await jobSettingRepository.readAll();
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
