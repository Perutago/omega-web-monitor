import IEntity from '../entities/IJobSetting';

export default interface IJobSettingRepository {
    readAll(): Promise<IEntity[]>;

    read(id: string): Promise<IEntity | undefined>;

    create(entity: IEntity): Promise<void>;

    update(entity: IEntity): Promise<void>;

    delete(id: string): Promise<void>;
}
