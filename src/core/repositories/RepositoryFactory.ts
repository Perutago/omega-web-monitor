import config from 'config';
import { RepositoryType } from '../Types';
import CsvJobResultRepository from './CsvJobResultRepository';
import IJobResultRepository from "./IJobResultRepository";
import IJobSettingRepository from './IJobSettingRepository';
import INotificationSettingRepository from './INotificationSettingRepository';
import JsonJobSettingRepository from './JsonJobSettingRepository';
import JsonNotificationSettingRepository from './JsonNotificationSettingRepository';

export default class RepositoryFactory {
    private static readonly repositories: Map<string, any> = new Map<string, any>();

    static getJobResult(): IJobResultRepository {
        const key = 'jobResult';
        if (!RepositoryFactory.repositories.has(key)) {
            const repositoryType = config.get(`repositoryType.${key}`) as RepositoryType;
            switch (repositoryType) {
                case RepositoryType.CSV:
                    RepositoryFactory.repositories.set(key, new CsvJobResultRepository());
                    break;
                default:
                    throw new Error(`Invalid repositoryType: ${repositoryType}`);
            }
        }
        return RepositoryFactory.repositories.get(key);
    }

    static getJobSetting(): IJobSettingRepository {
        const key = 'jobSetting';
        if (!RepositoryFactory.repositories.has(key)) {
            const repositoryType = config.get(`repositoryType.${key}`) as RepositoryType;
            switch (repositoryType) {
                case RepositoryType.JSON:
                    RepositoryFactory.repositories.set(key, new JsonJobSettingRepository());
                    break;
                default:
                    throw new Error(`Invalid repositoryType: ${repositoryType}`);
            }
        }
        return RepositoryFactory.repositories.get(key);
    }

    static getNotificationSetting(): INotificationSettingRepository {
        const key = 'notificationSetting';
        if (!RepositoryFactory.repositories.has(key)) {
            const repositoryType = config.get(`repositoryType.${key}`) as RepositoryType;
            switch (repositoryType) {
                case RepositoryType.JSON:
                    RepositoryFactory.repositories.set(key, new JsonNotificationSettingRepository());
                    break;
                default:
                    throw new Error(`Invalid repositoryType: ${repositoryType}`);
            }
        }
        return RepositoryFactory.repositories.get(key);
    }
}
