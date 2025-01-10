import crypto from 'crypto';
import fsSync from 'fs';
import fs from 'fs/promises';

import i18n from 'i18n';

import INotificationSettingRepository from './INotificationSettingRepository';
import NotificationSetting from '../entities/NotificationSetting';
import StandardOutputNotificationSetting from '../entities/StandardOutputNotificationSetting';

export default class JsonNotificationSettingRepository implements INotificationSettingRepository {
    static settingFileName = 'NotificationSetting.json';

    static get settingFilePath() {
        return `./settings/${JsonNotificationSettingRepository.settingFileName}`;
    }

    async readAll(): Promise<NotificationSetting[]> {
        if (fsSync.existsSync(JsonNotificationSettingRepository.settingFilePath)) {
            const settings = JSON.parse(await fs.readFile(JsonNotificationSettingRepository.settingFilePath, 'utf8'));
            settings.push(new StandardOutputNotificationSetting());
            return settings;
        } else {
            throw new Error(i18n.__('Error.FileNotFound', JsonNotificationSettingRepository.settingFileName));
        }
    }

    async read(id: string): Promise<NotificationSetting | undefined> {
        const settings = await this.readAll();
        return settings.find(setting => setting.id === id);
    }

    async create(entity: NotificationSetting): Promise<void> {
        const settings = await this.readAll();
        settings.push(Object.assign(entity, { id: crypto.randomUUID() }));
        await this.writeFile(settings);
    }

    async update(entity: NotificationSetting): Promise<void> {
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

    private async writeFile(settings: NotificationSetting[]) {
        const json = JSON.stringify(settings);
        await fs.writeFile(JsonNotificationSettingRepository.settingFilePath, json);
    }
}
