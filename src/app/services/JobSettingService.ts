import Service from './Service';
import Repository from '../../core/repositories/JsonJobSettingRepository';

export default class JobSettingService extends Service {
    private repository = new Repository();

    async list() {
        try {
            const data = await this.repository.readAllAsync();
            return {
                success: true,
                data
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    async get(id: string) {
        const settings = await this.repository.readAllAsync();
        return {
            success: true,
            data: settings.find(setting => setting.id === id) ?? null
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async add(json: any) {
        try {
            await this.repository.createAsync(JSON.parse(JSON.stringify(json)));
            return { success: true };
        } catch (error) {
            return this.handleError(error);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async update(json: any) {
        try {
            await this.repository.updateAsync(JSON.parse(JSON.stringify(json)));
            return { success: true };
        } catch (error) {
            return this.handleError(error);
        }
    }

    async remove(id: string) {
        try {
            await this.repository.deleteAsync(id);
            return { success: true };
        } catch (error) {
            return this.handleError(error);
        }
    }
}
