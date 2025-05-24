import i18n from 'i18n';
import IJobSetting from '../entities/IJobSetting';
import JobResult from '../entities/JobResult';
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
                this.jobResultRepository.create(JobResult.unupdated(this.jobSetting.id, resultText));
                return;
            }
            this.jobResultRepository.create(JobResult.updated(this.jobSetting.id, resultText));
            await this.sendNotification(prevResult === undefined
                ? Notification.info(this.jobSetting.name, this.jobSetting.url, i18n.__('Notification.MonitoringStarted'))
                : Notification.success(this.jobSetting.name, this.jobSetting.url, `${i18n.__('Notification.WebSiteUpdated')}\n\n${prevResult.result}\n↓\n${resultText}`)
            );
        } catch (error) {
            console.error(error);
            this.jobResultRepository.create(JobResult.error(this.jobSetting.id, error instanceof Error ? error : new Error(i18n.__('Error.Unknown'))));
            await this.sendNotification(Notification.error(this.jobSetting.name, this.jobSetting.url, error instanceof Error ? error.message : i18n.__('Error.Unknown')));
        }
    }

    private async sendNotification(notification: Notification): Promise<void> {
        const { notificationSettingIds } = this.jobSetting;
        const notificationSettings = await Promise.all(notificationSettingIds.map(id => this.notificationSettingRepository.read(id)));
        notificationSettings
            .filter(setting => setting !== undefined)
            .map(NotificationSenderFactory.get)
            .forEach(async sender => {
                await sender.send(notification);
            });
    }
}
