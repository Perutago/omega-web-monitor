import Job from './Job';
import IJobSetting from '../entities/IJobSetting';
import NotificationSetting from '../entities/INotificationSetting';
import JobResultRepository from '../repositories/CsvJobResultRepository';

export default class JobFactory {
    static get(notificationSettings: NotificationSetting[], jobSetting: IJobSetting) {
        return new Job(new JobResultRepository(), notificationSettings, jobSetting);
    }
}
