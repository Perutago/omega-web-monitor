import fsSync from 'fs';
import fs from 'fs/promises';
import * as csv from 'csv';

import IJobResultRepository from './IJobResultRepository';
import JobResult from '../entities/JobResult';
import DateUtil from '../utils/DateUtil';

export default class CsvJobResultRepository implements IJobResultRepository<JobResult> {
    async read(jobId: string): Promise<JobResult | undefined> {
        return this.readFile(`./results/JobResult_${jobId}.csv`);
    }

    async readAll(): Promise<JobResult[]> {
        const records: JobResult[] = [];
        for (const fileName of await fs.readdir('./results')) {
            const jobResult = await this.readFile(`./results/${fileName}`);
            if (jobResult) {
                records.push(jobResult);
            }
        }
        return records;
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
            .pipe(fsSync.createWriteStream(`./results/JobResult_${entity.jobId}.csv`, { encoding: 'utf-8', flags: 'a' }));
    }

    private async readFile(filePath: string): Promise<JobResult | undefined> {
        const processFile = async () => {
            const records: JobResult[] = [];
            if (fsSync.existsSync(filePath)) {
                for await (const record of fsSync.createReadStream(filePath).pipe(csv.parse())) {
                    records.push(JobResult.fromArray(record));
                }
            }
            return records;
        };
        const results = await processFile();
        return results.length === 0 ? undefined : results.pop();
    }
}
