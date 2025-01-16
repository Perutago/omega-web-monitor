import INotificationSetting from '../../core/entities/INotificationSetting';
import IRepository from '../../core/repositories/INotificationSettingRepository';

export default class NotificationSettingService<T extends IRepository> {
    private repository: T;

    constructor(repository: new () => T) {
        this.repository = new repository();
    }

    async list(): ResultType<INotificationSetting[]> {
        return {
            success: true,
            data: await this.repository.readAll(),
        };
    }

    async get(id: string): ResultType<INotificationSetting> {
        const settings = await this.repository.readAll();
        return {
            success: true,
            data: settings.find(setting => setting.id === id) ?? null
        };
    }

    async add(json: unknown): ResultType<void> {
        await this.repository.create(JSON.parse(JSON.stringify(json)));
        return { success: true };
    }

    async update(json: unknown): ResultType<void> {
        await this.repository.update(JSON.parse(JSON.stringify(json)));
        return { success: true };
    }

    async remove(id: string): ResultType<void> {
        await this.repository.delete(id);
        return { success: true };
    }
}
