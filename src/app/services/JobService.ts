import i18n from 'i18n';

import Service from './Service';
import JobFactory from '../../core/jobs/JobFactory';
import JobSettingRepository from '../../core/repositories/JsonJobSettingRepository';
import NotificationSettingRepository from '../../core/repositories/JsonNotificationSettingRepository';

export default class JobService extends Service {
    private jobSettingRepository = new JobSettingRepository();

    private notificationSettingRepository = new NotificationSettingRepository();

    async run(id: string) {
        try {
            const jobSetting = await this.jobSettingRepository.readAsync(id);
            if (jobSetting) {
                const notificationSettings = await this.notificationSettingRepository.readAllAsync();
                const job = JobFactory.get(notificationSettings, jobSetting);
                await job.runAsync();
                return {
                    success: true,
                    data: null,
                };
            } else {
                throw new Error(i18n.__('Error.NotExisted', id));
            }
        } catch (error) {
            return this.handleError(error);
        }
    }
}
