import JobSetting from '../entities/JobSetting';

export default interface IJobSettingRepository {
    readAll(): Promise<JobSetting[]>;

    read(id: string): Promise<JobSetting | undefined>;

    create(entity: JobSetting): Promise<void>;

    update(entity: JobSetting): Promise<void>;

    delete(id: string): Promise<void>;
}
