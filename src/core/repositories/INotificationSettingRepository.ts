import NotificationSetting from '../entities/INotificationSetting';

export default interface INotificationSettingRepository {
    readAllAsync(): Promise<NotificationSetting[]>;

    readAsync(id: string): Promise<NotificationSetting | undefined>;

    createAsync(entity: NotificationSetting): Promise<void>;

    updateAsync(entity: NotificationSetting): Promise<void>;

    deleteAsync(id: string): Promise<void>;
}
