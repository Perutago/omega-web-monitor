import Service from './Service';
import JobFactory from '../../core/jobs/JobFactory';
import JobSettingRepository from '../../core/repositories/JsonJobSettingRepository';
import NotificationSettingRepository from '../../core/repositories/JsonNotificationSettingRepository';

export default class JobService extends Service {
    jobSettingRepository = new JobSettingRepository();
    notificationSettingRepository = new NotificationSettingRepository();
    async run(id: string) {
        try {
            const jobSetting = await this.jobSettingRepository.read(id);
            if (jobSetting) {
                const notificationSettings = await this.notificationSettingRepository.readAll();
                const job = JobFactory.get(notificationSettings, jobSetting);
                job.run();
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
