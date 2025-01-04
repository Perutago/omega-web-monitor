import crypto from 'crypto';

export default class JobResult {
    constructor(public id: string, public jobId: string, public createdAt: Date, public error: Error | null, public updated: boolean, public result: string | null) {
    }

    static fromArray(array: string[]): JobResult {
        return new JobResult(array[0], array[1], new Date(array[2]), array[3] ? new Error(array[3]) : null, array[4] === 'true', array[5]);
    }

    static getUnupdatedInstance(jobId: string, elementText: string): JobResult {
        return new JobResult(crypto.randomUUID(), jobId, new Date(), null, false, elementText);
    }
}
