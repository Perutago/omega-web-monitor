import fsSync from 'fs';
import fs from 'fs/promises';

import i18n from 'i18n';

import IJobSettingRepository from './IJobSettingRepository';
import JobSetting from '../entities/JobSetting';
import JobSettingFactory from '../entities/JobSettingFactory';

export default class JsonJobSettingRepository implements IJobSettingRepository {
    static settingFileName = 'JobSetting.json';

    get settingFilePath() {
        return `./settings/${JsonJobSettingRepository.settingFileName}`;
    }

    async readAll(): Promise<JobSetting[]> {
        if (fsSync.existsSync(this.settingFilePath)) {
            const settings: JobSetting[] = [];
            const jsonSettings = JSON.parse(await fs.readFile(this.settingFilePath, 'utf8'));
            for (let i = 0; i < jsonSettings.length; i++) {
                settings.push(JobSettingFactory.fromJson(jsonSettings[i]));
            }
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
        settings.push(entity);
        await this.writeFile(settings);
    }

    async update(entity: JobSetting): Promise<void> {
        let settings = await this.readAll();
        settings = settings.filter(setting => setting.id !== entity.id);
        settings.push(entity);
        await this.writeFile(settings);
    }

    async delete(id: string): Promise<void> {
        const settings = await this.readAll();
        await this.writeFile(settings.filter(setting => setting.id !== id));
    }

    private async writeFile(settings: JobSetting[]): Promise<void> {
        const json = JSON.stringify(settings);
        await fs.writeFile(this.settingFilePath, json);
    }
}
