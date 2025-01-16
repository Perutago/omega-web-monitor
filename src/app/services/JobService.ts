import i18n from 'i18n';

import Job from '../../core/jobs/Job';
import IJobResultRepository from '../../core/repositories/IJobResultRepository';
import IJobSettingRepository from '../../core/repositories/IJobSettingRepository';
import INotificationSettingRepository from '../../core/repositories/INotificationSettingRepository';

export default class JobService<T extends IJobResultRepository, U extends IJobSettingRepository, V extends INotificationSettingRepository> {
    private jobResultRepository: T;

    private jobSettingRepository: U;

    private notificationSettingRepository: V;

    constructor(jobResultRepository: new () => T, jobSettingRepository: new () => U, notificationSettingRepository: new () => V) {
        this.jobResultRepository = new jobResultRepository();
        this.jobSettingRepository = new jobSettingRepository();
        this.notificationSettingRepository = new notificationSettingRepository();
    }

    async run(id: string): ResultType<void> {
        const jobSetting = await this.jobSettingRepository.read(id);
        if (jobSetting) {
            const notificationSettings = await this.notificationSettingRepository.readAll();
            const job = new Job(this.jobResultRepository, notificationSettings, jobSetting);
            await job.run();
            return { success: true };
        } else {
            throw new Error(i18n.__('Error.NotExisted', id));
        }
    }
}
