import NotificationSetting from '../entities/NotificationSetting';

export default interface INotificationSettingRepository {
    readAll(): Promise<NotificationSetting[]>;

    read(id: string): Promise<NotificationSetting | undefined>;

    create(entity: NotificationSetting): Promise<void>;

    update(entity: NotificationSetting): Promise<void>;

    delete(id: string): Promise<void>;
}
