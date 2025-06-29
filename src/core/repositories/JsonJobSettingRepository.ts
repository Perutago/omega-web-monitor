import AppConfig from '../../app/config/AppConfig';
import Entity, { JobSettingId } from '../entities/IJobSetting';
import BaseJsonRepository from './BaseJsonRepository';
import IJobSettingRepository from './IJobSettingRepository';

export default class JsonJobSettingRepository extends BaseJsonRepository<Entity> implements IJobSettingRepository {
    get jsonFilePath(): string {
        return AppConfig.jobSettingFilePath;
    }

    async readAll(): Promise<Entity[]> {
        return await this.readFile();
    }

    async read(key: string): Promise<Entity | undefined> {
        const entities = await this.readAll();
        return entities.find(e => e.id === key);
    }

    async create(entity: Entity): Promise<void> {
        const entities = await this.readAll();
        entity.id = entity.id ?? JobSettingId.of(crypto.randomUUID())
        await this.writeFile(entities.concat([entity]));
    }

    async update(entity: Entity): Promise<void> {
        const entities = await this.readAll();
        if (entities.some(e => e.id === entity.id)) {
            await this.writeFile(entities.filter(e => e.id !== entity.id).concat([entity]));
        }
    }

    async delete(key: string): Promise<void> {
        const entities = await this.readAll();
        await this.writeFile(entities.filter(e => e.id !== key));
    }
}
