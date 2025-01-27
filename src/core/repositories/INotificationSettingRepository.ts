import IEntity from '../entities/INotificationSetting';

export default interface INotificationSettingRepository {
    readAll(): Promise<IEntity[]>;

    read(id: string): Promise<IEntity | undefined>;

    create(entity: IEntity): Promise<void>;

    update(entity: IEntity): Promise<void>;

    delete(id: string): Promise<void>;
}
