import crypto from 'crypto';

import JobResult from './JobResult';

export default class ElementTextComparerResult extends JobResult {
    constructor(public id: string, public jobId: string, public createdAt: Date, public error: Error | null, public elementText: string, public updated: boolean) {
        super(id, jobId, createdAt, error, updated, elementText);
    }

    static fromArray(array: string[]) {
        return new ElementTextComparerResult(array[0], array[1], new Date(array[2]), array[3] ? new Error(array[3]) : null, array[4], array[5] === 'true');
    }

    static getUnupdatedInstance(jobId: string, elementText: string): JobResult {
        return new ElementTextComparerResult(crypto.randomUUID(), jobId, new Date(), null, elementText, false);
    }
}
