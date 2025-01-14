import crypto, { UUID } from 'crypto';
import { Brand } from '../Types';

export default class JobResult {
    constructor(public id: JobResultId, public jobId: string, public createdAt: Date, public error: Error | null, public updated: boolean, public result: string | null) {
    }

    static fromArray(array: string[]): JobResult {
        return new JobResult(JobResultId.of(array[0] as UUID), array[1], new Date(array[2]), array[3] ? new Error(array[3]) : null, array[4] === 'true', array[5]);
    }

    static getUnupdatedInstance(jobId: string, elementText: string): JobResult {
        return new JobResult(JobResultId.of(crypto.randomUUID()), jobId, new Date(), null, false, elementText);
    }
}

export type JobResultId = Brand<string, "JobSettingId">;
export const JobResultId = {
    of(id: UUID): JobResultId {
        return id as JobResultId;
    }
};