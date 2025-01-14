import crypto from 'crypto';
import fsSync from 'fs';
import fs from 'fs/promises';

import i18n from 'i18n';

import IJobSettingRepository from './IJobSettingRepository';
import IJobSetting from '../entities/IJobSetting';

export default class JsonJobSettingRepository implements IJobSettingRepository {
    static settingFileName = 'JobSetting.json';

    static get settingFilePath() {
        return `./settings/${JsonJobSettingRepository.settingFileName}`;
    }

    async readAllAsync(): Promise<IJobSetting[]> {
        if (fsSync.existsSync(JsonJobSettingRepository.settingFilePath)) {
            const settings = JSON.parse(await fs.readFile(JsonJobSettingRepository.settingFilePath, 'utf8'));
            return settings;
        } else {
            throw new Error(i18n.__('Error.FileNotFound', JsonJobSettingRepository.settingFileName));
        }
    }

    async readAsync(id: string): Promise<IJobSetting | undefined> {
        const settings = await this.readAllAsync();
        return settings.find(setting => setting.id === id);
    }

    async createAsync(entity: IJobSetting): Promise<void> {
        const settings = await this.readAllAsync();
        settings.push(Object.assign(entity, { id: crypto.randomUUID() }));
        await this.writeFile(settings);
    }

    async updateAsync(entity: IJobSetting): Promise<void> {
        let settings = await this.readAllAsync();
        if (settings.some(setting => setting.id === entity.id)) {
            settings = settings.filter(setting => setting.id !== entity.id);
            settings.push(entity);
            await this.writeFile(settings);
        } else {
            throw new Error(i18n.__('Error.NotExisted', `id: ${entity.id}`));
        }
    }

    async deleteAsync(id: string): Promise<void> {
        const settings = await this.readAllAsync();
        await this.writeFile(settings.filter(setting => setting.id !== id));
    }

    private async writeFile(settings: IJobSetting[]): Promise<void> {
        const json = JSON.stringify(settings);
        await fs.writeFile(JsonJobSettingRepository.settingFilePath, json);
    }
}
