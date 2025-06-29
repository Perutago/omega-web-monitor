import AppConfig from '../../app/config/AppConfig';
import CsvJobResultRepository from './CsvJobResultRepository';
import IJobResultRepository from "./IJobResultRepository";
import IJobSettingRepository from './IJobSettingRepository';
import INotificationSettingRepository from './INotificationSettingRepository';
import JsonJobSettingRepository from './JsonJobSettingRepository';
import JsonNotificationSettingRepository from './JsonNotificationSettingRepository';

export default class RepositoryFactory {
    private static readonly jobResultRepositories = new Map<string, IJobResultRepository>();

    private static readonly jobSettingRepositories = new Map<string, IJobSettingRepository>();

    private static readonly notificationSettingRepositories = new Map<string, INotificationSettingRepository>();

    static getJobResult(): IJobResultRepository {
        const key = 'jobResult';
        if (!RepositoryFactory.jobResultRepositories.has(key)) {
            const repositoryType = AppConfig.repositoryType.jobResult;
            switch (repositoryType) {
                case 'csv':
                    RepositoryFactory.jobResultRepositories.set(key, new CsvJobResultRepository());
                    break;
                default:
                    throw new Error(`Invalid repositoryType: ${repositoryType}`);
            }
        }
        return RepositoryFactory.jobResultRepositories.get(key)!;
    }

    static getJobSetting(): IJobSettingRepository {
        const key = 'jobSetting';
        if (!RepositoryFactory.jobSettingRepositories.has(key)) {
            const repositoryType = AppConfig.repositoryType.jobSetting;
            switch (repositoryType) {
                case 'json':
                    RepositoryFactory.jobSettingRepositories.set(key, new JsonJobSettingRepository());
                    break;
                default:
                    throw new Error(`Invalid repositoryType: ${repositoryType}`);
            }
        }
        return RepositoryFactory.jobSettingRepositories.get(key)!;
    }

    static getNotificationSetting(): INotificationSettingRepository {
        const key = 'notificationSetting';
        if (!RepositoryFactory.notificationSettingRepositories.has(key)) {
            const repositoryType = AppConfig.repositoryType.notificationSetting;
            switch (repositoryType) {
                case 'json':
                    RepositoryFactory.notificationSettingRepositories.set(key, new JsonNotificationSettingRepository());
                    break;
                default:
                    throw new Error(`Invalid repositoryType: ${repositoryType}`);
            }
        }
        return RepositoryFactory.notificationSettingRepositories.get(key)!;
    }
}
