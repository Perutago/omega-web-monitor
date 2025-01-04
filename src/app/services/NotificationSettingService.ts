import Service from './Service';
import Repository from '../../core/repositories/JsonNotificationSettingRepository';

export default class NotificationSettingService extends Service {
    repository = new Repository();

    async list() {
        try {
            const data = await this.repository.readAll();
            return {
                success: true,
                data
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    async get(id: string) {
        const settings = await this.repository.readAll();
        return {
            success: true,
            data: settings.find(setting => setting.id === id) ?? null
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async add(json: any) {
        try {
            await this.repository.create(JSON.parse(JSON.stringify(json)));
            return { success: true };
        } catch (error) {
            return this.handleError(error);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async update(json: any) {
        try {
            await this.repository.update(JSON.parse(JSON.stringify(json)));
            return { success: true };
        } catch (error) {
            return this.handleError(error);
        }
    }

    async remove(id: string) {
        try {
            await this.repository.delete(id);
            return { success: true };
        } catch (error) {
            return this.handleError(error);
        }
    }
}
