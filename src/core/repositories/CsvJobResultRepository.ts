import fs from 'fs';

import * as csv from 'csv';

import IJobResultRepository from './IJobResultRepository';
import Result from '../entities/JobResult';
import JobResult from '../entities/JobResult';
import DateUtil from '../utils/DateUtil';

export default class CsvJobResultRepository implements IJobResultRepository<JobResult> {
    async read(jobId: string): Promise<JobResult | undefined> {
        const processFile = async () => {
            const records = [];
            const filePath = `./results/JobResult_${jobId}.csv`;
            if (fs.existsSync(filePath)) {
                for await (const record of fs.createReadStream(filePath).pipe(csv.parse())) {
                    records.push(Result.fromArray(record));
                }
            }
            return records;
        };
        const results = await processFile();
        return results.length === 0 ? undefined : results.pop();
    }

    create(entity: JobResult): void {
        const options = {
            quoted_string: true,
            columns: Object.getOwnPropertyNames(entity).map(name => ({ key: name })),
            cast: {
                boolean: (value: boolean) => value === true ? 'true' : 'false',
                date: (value: Date) => DateUtil.formatDefault(value),
            }
        };
        csv
            .stringify([entity], options)
            .pipe(fs.createWriteStream(`./results/JobResult_${entity.jobId}.csv`, { encoding: 'utf-8', flags: 'a' }));
    }
}
