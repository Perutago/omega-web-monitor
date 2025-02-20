import config from 'config';
import Entity from '../entities/IJobSetting';
import BaseJsonRepository from './BaseJsonRepository';
import IJobSettingRepository from './IJobSettingRepository';

export default class JsonJobSettingRepository extends BaseJsonRepository<Entity> implements IJobSettingRepository {
    get jsonFilePath(): string {
        return config.get('jobSettingFilePath');
    }

    async readAll(): Promise<Entity[]> {
        return await this.readFile();
    }

    async read(key: string): Promise<Entity | undefined> {
        const entities = await this.readAll();
        return entities.find(e => e.key === key);
    }

    async create(entity: Entity): Promise<void> {
        const entities = await this.readAll();
        await this.writeFile(entities.concat([entity]));
    }

    async update(entity: Entity): Promise<void> {
        const entities = await this.readAll();
        if (this.hasEntity(entities, entity.key)) {
            await this.writeFile(entities.filter(e => e.key !== entity.key).concat([entity]));
        }
    }

    async delete(key: string): Promise<void> {
        const entities = await this.readAll();
        await this.writeFile(entities.filter(e => e.key !== key));
    }
}
