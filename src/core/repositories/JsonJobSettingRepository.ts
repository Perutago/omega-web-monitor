import config from 'config';
import crypto from 'crypto';
import fsSync from 'fs';
import fs from 'fs/promises';
import i18n from 'i18n';
import Entity from '../entities/IJobSetting';
import IJobSettingRepository from './IJobSettingRepository';

export default class JsonJobSettingRepository implements IJobSettingRepository {
    private readonly settingFilePath: string = config.get('jobSettingFilePath');

    async readAll(): Promise<Entity[]> {
        if (fsSync.existsSync(this.settingFilePath)) {
            return JSON.parse(await fs.readFile(this.settingFilePath, 'utf8')) as Entity[];
        } else {
            throw new Error(i18n.__('Error.FileNotFound', this.settingFilePath));
        }
    }

    async read(id: string): Promise<Entity | undefined> {
        const settings = await this.readAll();
        return settings.find(setting => setting.id === id);
    }

    async create(entity: Entity): Promise<void> {
        const settings = await this.readAll();
        settings.push(Object.assign(entity, { id: crypto.randomUUID() }));
        await this.writeFile(settings);
    }

    async update(entity: Entity): Promise<void> {
        let settings = await this.readAll();
        if (settings.some(setting => setting.id === entity.id)) {
            settings = settings.filter(setting => setting.id !== entity.id);
            settings.push(entity);
            await this.writeFile(settings);
        } else {
            throw new Error(i18n.__('Error.NotExisted', `id: ${entity.id}`));
        }
    }

    async delete(id: string): Promise<void> {
        const settings = await this.readAll();
        await this.writeFile(settings.filter(setting => setting.id !== id));
    }

    private async writeFile(settings: Entity[]): Promise<void> {
        const json = JSON.stringify(settings);
        await fs.writeFile(this.settingFilePath, json);
    }
}
