import crypto from 'crypto';
import fsSync from 'fs';
import fs from 'fs/promises';

import i18n from 'i18n';

import IJobSettingRepository from './IJobSettingRepository';
import JobSetting from '../entities/JobSetting';

export default class JsonJobSettingRepository implements IJobSettingRepository {
    static settingFileName = 'JobSetting.json';

    static get settingFilePath() {
        return `./settings/${JsonJobSettingRepository.settingFileName}`;
    }

    async readAll(): Promise<JobSetting[]> {
        if (fsSync.existsSync(JsonJobSettingRepository.settingFilePath)) {
            const settings = JSON.parse(await fs.readFile(JsonJobSettingRepository.settingFilePath, 'utf8'));
            return settings;
        } else {
            throw new Error(i18n.__('Error.FileNotFound', JsonJobSettingRepository.settingFileName));
        }
    }

    async read(id: string): Promise<JobSetting | undefined> {
        const settings = await this.readAll();
        return settings.find(setting => setting.id === id);
    }

    async create(entity: JobSetting): Promise<void> {
        const settings = await this.readAll();
        settings.push(Object.assign(entity, { id: crypto.randomUUID() }));
        await this.writeFile(settings);
    }

    async update(entity: JobSetting): Promise<void> {
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

    private async writeFile(settings: JobSetting[]): Promise<void> {
        const json = JSON.stringify(settings);
        await fs.writeFile(JsonJobSettingRepository.settingFilePath, json);
    }
}
