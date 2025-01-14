import crypto from 'crypto';
import fsSync from 'fs';
import fs from 'fs/promises';
import i18n from 'i18n';

import NotificationSetting from '../entities/INotificationSetting';
import StandardOutputNotificationSetting from '../entities/StandardOutputNotificationSetting';
import INotificationSettingRepository from './INotificationSettingRepository';

export default class JsonNotificationSettingRepository implements INotificationSettingRepository {
    static settingFileName = 'NotificationSetting.json';

    static get settingFilePath() {
        return `./settings/${JsonNotificationSettingRepository.settingFileName}`;
    }

    async readAllAsync(): Promise<NotificationSetting[]> {
        if (fsSync.existsSync(JsonNotificationSettingRepository.settingFilePath)) {
            const settings = JSON.parse(await fs.readFile(JsonNotificationSettingRepository.settingFilePath, 'utf8'));
            settings.push(new StandardOutputNotificationSetting());
            return settings;
        } else {
            throw new Error(i18n.__('Error.FileNotFound', JsonNotificationSettingRepository.settingFileName));
        }
    }

    async readAsync(id: string): Promise<NotificationSetting | undefined> {
        const settings = await this.readAllAsync();
        return settings.find(setting => setting.id === id);
    }

    async createAsync(entity: NotificationSetting): Promise<void> {
        const settings = await this.readAllAsync();
        settings.push(Object.assign(entity, { id: crypto.randomUUID() }));
        await this.writeFile(settings);
    }

    async updateAsync(entity: NotificationSetting): Promise<void> {
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

    private async writeFile(settings: NotificationSetting[]) {
        const json = JSON.stringify(settings);
        await fs.writeFile(JsonNotificationSettingRepository.settingFilePath, json);
    }
}
