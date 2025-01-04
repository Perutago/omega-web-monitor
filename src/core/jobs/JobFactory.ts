import Job from './Job';
import JobSetting from '../entities/JobSetting';
import NotificationSetting from '../entities/NotificationSetting';
import JobResultRepository from '../repositories/CsvJobResultRepository';

export default class JobFactory {
    static get(notificationSettings: NotificationSetting[], jobSetting: JobSetting) {
        return new Job(new JobResultRepository(), notificationSettings, jobSetting);
    }
}
