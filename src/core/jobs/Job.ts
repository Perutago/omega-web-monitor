import crypto from 'crypto';

import i18n from 'i18n';

import FetcherFactory from './FetcherFactory';
import IJob from './IJob';
import JobResult from '../entities/JobResult';
import JobSetting from '../entities/JobSetting';
import NotificationSetting from '../entities/NotificationSetting';
import Notification from '../notification-senders/Notification';
import NotificationSenderFactory from '../notification-senders/NotificationSenderFactory';
import IJobResultRepository from '../repositories/IJobResultRepository';
import DateUtil from '../utils/DateUtil';

export default class Job implements IJob {
    constructor(private jobResultRepository: IJobResultRepository<JobResult>, private notificationSettings: NotificationSetting[], private jobSetting: JobSetting) {
    }

    async run() {
        try {
            const prevResult = await this.jobResultRepository.read(this.jobSetting.id);
            if (prevResult !== undefined && new Date() < DateUtil.add(prevResult.createdAt, this.jobSetting.duration)) {
                return;
            }
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
                .map(setting => NotificationSenderFactory.get(setting))
                .forEach(sender => {
                    sender.send(new Notification('error', this.jobSetting.name, this.jobSetting.url, error instanceof Error ? error.message : i18n.__('Error.Unknown')));
                });
        }
    }

    private createJobResult(resultText: string) {
        const now = new Date();
        const uuid = crypto.randomUUID();
        try {
            return new JobResult(uuid, this.jobSetting.id, now, null, true, resultText);
        } catch (error) {
            return new JobResult(uuid, this.jobSetting.id, now, error instanceof Error ? error : new Error(i18n.__('Error.Unknown')), false, null);
        }
    }

    private sendNotification(prevResult: JobResult | undefined, result: JobResult) {
        const durationString = DateUtil.formatDuration(this.jobSetting.duration);
        this.notificationSettings
            .map(setting => NotificationSenderFactory.get(setting))
            .forEach(sender => {
                if (prevResult === undefined) {
                    sender.send(new Notification('info', this.jobSetting.name, this.jobSetting.url, i18n.__('Notification.MonitoringStarted', durationString)));
                } else if (result.error) {
                    sender.send(new Notification('error', this.jobSetting.name, this.jobSetting.url, result.error.message));
                } else {
                    sender.send(new Notification('success', this.jobSetting.name, this.jobSetting.url, `${i18n.__('Notification.WebSiteUpdated', durationString)}\n\n${result.result}`));
                }
            });
    }
}
