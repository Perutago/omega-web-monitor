import IEntity from '../entities/IJobSetting';

export default interface IJobSettingRepository {
    readAll(): Promise<IEntity[]>;

    read(key: string): Promise<IEntity | undefined>;

    create(entity: IEntity): Promise<void>;

    update(entity: IEntity): Promise<void>;

    delete(key: string): Promise<void>;
}
