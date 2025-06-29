import config from 'config';

interface IAppConfig {
    jobSettingFilePath: string;
    locale: 'en' | 'ja-JP';
    localesDirectory: string;
    notificationSettingFilePath: string;
    repositoryType: {
        jobResult: 'csv' | 'json';
        jobSetting: 'json';
        notificationSetting: 'json';
    };
    timeZone: string;
}

class AppConfig {
    private readonly values: IAppConfig;

    constructor() {
        this.values = {
            jobSettingFilePath: config.get('jobSettingFilePath'),
            locale: config.get('locale'),
            localesDirectory: config.get('localesDirectory'),
            notificationSettingFilePath: config.get('notificationSettingFilePath'),
            repositoryType: config.get('repositoryType'),
            timeZone: config.get('timeZone'),
        };
        // NOTE: ここでバリデーションを追加することもできる
    }

    get jobSettingFilePath(): string {
        return this.values.jobSettingFilePath;
    }

    get locale(): 'en' | 'ja-JP' {
        return this.values.locale;
    }

    get localesDirectory(): string {
        return this.values.localesDirectory;
    }

    get notificationSettingFilePath(): string {
        return this.values.notificationSettingFilePath;
    }

    get repositoryType(): {
        jobResult: 'csv' | 'json';
        jobSetting: 'json';
        notificationSetting: 'json';
    } {
        return this.values.repositoryType;
    }

    get timeZone(): string {
        return this.values.timeZone;
    }
}

export default new AppConfig();
