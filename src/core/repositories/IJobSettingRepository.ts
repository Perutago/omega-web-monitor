import IJobSetting from '../entities/IJobSetting';

export default interface IJobSettingRepository {
    readAll(): Promise<IJobSetting[]>;

    read(id: string): Promise<IJobSetting | undefined>;

    create(entity: IJobSetting): Promise<void>;

    update(entity: IJobSetting): Promise<void>;

    delete(id: string): Promise<void>;
}
