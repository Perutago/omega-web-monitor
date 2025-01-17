import crypto from 'crypto';
import i18n from 'i18n';
import IJobSetting from '../entities/IJobSetting';
import JobResult, { JobResultId } from '../entities/JobResult';
import Notification from '../notification-senders/Notification';
import NotificationSenderFactory from '../notification-senders/NotificationSenderFactory';
import RepositoryFactory from '../repositories/RepositoryFactory';
import FetcherFactory from './FetcherFactory';
import IJob from './IJob';

export default class Job implements IJob {
    private jobResultRepository = RepositoryFactory.getJobResult();

    private notificationSettingRepository = RepositoryFactory.getNotificationSetting();

    constructor(private jobSetting: IJobSetting) {
    }

    async run(): Promise<void> {
        try {
            const prevResult = await this.jobResultRepository.read(this.jobSetting.id);
            const resultText = await FetcherFactory.get(this.jobSetting).fetch();
            if (prevResult !== undefined && prevResult.result === resultText) {
                this.jobResultRepository.create(JobResult.getUnupdatedInstance(this.jobSetting.id, resultText));
                return;
            }
            const result = this.createJobResult(resultText);
            this.jobResultRepository.create(result);
            await this.sendNotification(prevResult, result);
        } catch (error) {
            console.error(error);
            const notificationSettings = await this.notificationSettingRepository.readAll();
            notificationSettings
                .map(NotificationSenderFactory.get)
                .forEach(async sender => {
                    await sender.send(Notification.error(this.jobSetting.name, this.jobSetting.url, error instanceof Error ? error.message : i18n.__('Error.Unknown')));
                });
        }
    }

    private createJobResult(resultText: string): JobResult {
        const now = new Date();
        const uuid = crypto.randomUUID();
        try {
            return new JobResult(JobResultId.of(uuid), this.jobSetting.id, now, null, true, resultText);
        } catch (error) {
            return new JobResult(JobResultId.of(uuid), this.jobSetting.id, now, error instanceof Error ? error : new Error(i18n.__('Error.Unknown')), false, null);
        }
    }

    private async sendNotification(prevResult: JobResult | undefined, result: JobResult): Promise<void> {
        const notificationSettings = await this.notificationSettingRepository.readAll();
        notificationSettings
            .map(NotificationSenderFactory.get)
            .forEach(async sender => {
                const notification = (() => {
                    if (prevResult === undefined) {
                        return Notification.info(this.jobSetting.name, this.jobSetting.url, i18n.__('Notification.MonitoringStarted'));
                    } else if (result.error) {
                        return Notification.error(this.jobSetting.name, this.jobSetting.url, result.error.message);
                    } else {
                        return Notification.success(this.jobSetting.name, this.jobSetting.url, `${i18n.__('Notification.WebSiteUpdated')}\n\n${prevResult.result}\n↓\n${result.result}`);
                    }
                })();
                await sender.send(notification);
            });
    }
}
