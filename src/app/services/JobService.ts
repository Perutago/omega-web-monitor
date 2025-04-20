import i18n from 'i18n';
import Job from '../../core/jobs/Job';
import IJobSettingRepository from '../../core/repositories/IJobSettingRepository';
import RepositoryFactory from '../../core/repositories/RepositoryFactory';
import { ResultType } from './ResultType';

export default class JobService {
    private jobSettingRepository: IJobSettingRepository;

    constructor() {
        this.jobSettingRepository = RepositoryFactory.getJobSetting();
    }

    async run(id: string): ResultType<void> {
        const jobSetting = await this.jobSettingRepository.read(id);
        if (jobSetting) {
            const job = new Job(jobSetting);
            await job.run();
            return { success: true };
        } else {
            throw new Error(i18n.__('Error.NotExisted', id));
        }
    }
}
