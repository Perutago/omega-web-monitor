import IEntity from '../../core/entities/INotificationSetting';
import IRepository from '../../core/repositories/INotificationSettingRepository';
import RepositoryFactory from '../../core/repositories/RepositoryFactory';
import { ResultType } from './ResultType';

export default class NotificationSettingService {
    private repository: IRepository;

    constructor() {
        this.repository = RepositoryFactory.getNotificationSetting();
    }

    async list(): ResultType<IEntity[]> {
        return {
            success: true,
            data: await this.repository.readAll(),
        };
    }

    async get(id: string): ResultType<IEntity> {
        return {
            success: true,
            data: await this.repository.read(id) ?? null
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
