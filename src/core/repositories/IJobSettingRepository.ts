import IJobSetting from '../entities/IJobSetting';

export default interface IJobSettingRepository {
    readAllAsync(): Promise<IJobSetting[]>;

    readAsync(id: string): Promise<IJobSetting | undefined>;

    createAsync(entity: IJobSetting): Promise<void>;

    updateAsync(entity: IJobSetting): Promise<void>;

    deleteAsync(id: string): Promise<void>;
}
