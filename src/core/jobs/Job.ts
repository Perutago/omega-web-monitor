import crypto from 'crypto';

import i18n from 'i18n';

import FetcherFactory from './FetcherFactory';
import IJob from './IJob';
import JobResult, { JobResultId } from '../entities/JobResult';
import IJobSetting from '../entities/IJobSetting';
import NotificationSetting from '../entities/INotificationSetting';
import Notification from '../notification-senders/Notification';
import NotificationSenderFactory from '../notification-senders/NotificationSenderFactory';
import IJobResultRepository from '../repositories/IJobResultRepository';

export default class Job implements IJob {
    constructor(private jobResultRepository: IJobResultRepository<JobResult>, private notificationSettings: NotificationSetting[], private jobSetting: IJobSetting) {
    }

    async runAsync(): Promise<void> {
        try {
            const prevResult = await this.jobResultRepository.readAsync(this.jobSetting.id);
            const resultText = await FetcherFactory.get(this.jobSetting).fetch();
            if (prevResult !== undefined && prevResult.result === resultText) {
                this.jobResultRepository.create(JobResult.getUnupdatedInstance(this.jobSetting.id, resultText));
                return;
            }
            const result = this.createJobResult(resultText);
            this.jobResultRepository.create(result);
            this.sendNotification(prevResult, result);
        } catch (error) {
            this.notificationSettings
                .map(NotificationSenderFactory.get)
                .forEach(sender => {
                    sender.send(Notification.error(this.jobSetting.name, this.jobSetting.url, error instanceof Error ? error.message : i18n.__('Error.Unknown')));
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

    private sendNotification(prevResult: JobResult | undefined, result: JobResult): void {
        this.notificationSettings
            .map(NotificationSenderFactory.get)
            .forEach(sender => {
                if (prevResult === undefined) {
                    sender.send(Notification.info(this.jobSetting.name, this.jobSetting.url, i18n.__('Notification.MonitoringStarted')));
                } else if (result.error) {
                    sender.send(Notification.error(this.jobSetting.name, this.jobSetting.url, result.error.message));
                } else {
                    sender.send(Notification.success(this.jobSetting.name, this.jobSetting.url, `${i18n.__('Notification.WebSiteUpdated')}\n\n${prevResult.result}\n↓\n${result.result}`));
                }
            });
    }
}
