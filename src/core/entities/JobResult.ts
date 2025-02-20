import crypto, { UUID } from 'crypto';
import { Brand } from '../Types';
import IEntity from './IEntity';

export default class JobResult implements IEntity {
    get key(): string {
        return this.id;
    }

    private constructor(public id: JobResultId, public jobSettingId: string, public createdAt: Date, public error: Error | null, public updated: boolean, public result: string | null) {
    }

    static fromArray(array: string[]): JobResult {
        return new JobResult(JobResultId.of(array[0] as UUID), array[1], new Date(array[2]), array[3] ? new Error(array[3]) : null, array[4] === 'true', array[5]);
    }

    static unupdated(jobSettingId: string, elementText: string): JobResult {
        return new JobResult(JobResultId.of(crypto.randomUUID()), jobSettingId, new Date(), null, false, elementText);
    }

    static updated(jobSettingId: string, elementText: string): JobResult {
        return new JobResult(JobResultId.of(crypto.randomUUID()), jobSettingId, new Date(), null, true, elementText);
    }

    static error(jobSettingId: string, error: Error): JobResult {
        return new JobResult(JobResultId.of(crypto.randomUUID()), jobSettingId, new Date(), error, false, null);
    }
}

export type JobResultId = Brand<string, "JobSettingId">;
export const JobResultId = {
    of(id: UUID): JobResultId {
        return id as JobResultId;
    }
};
