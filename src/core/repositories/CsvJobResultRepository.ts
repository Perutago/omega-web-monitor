import * as csv from 'csv';
import fsSync from 'fs';
import fs from 'fs/promises';
import Entity from '../entities/JobResult';
import DateUtil from '../utils/DateUtil';
import IJobResultRepository from './IJobResultRepository';

export default class CsvJobResultRepository implements IJobResultRepository {
    async read(jobId: string): Promise<Entity | undefined> {
        return this.readFile(`./results/JobResult_${jobId}.csv`);
    }

    async readAll(): Promise<Entity[]> {
        const records: Entity[] = [];
        for (const fileName of await fs.readdir('./results')) {
            const jobResult = await this.readFile(`./results/${fileName}`);
            if (jobResult) {
                records.push(jobResult);
            }
        }
        return records;
    }

    create(entity: Entity): void {
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

    private async readFile(filePath: string): Promise<Entity | undefined> {
        const processFile = async () => {
            const records: Entity[] = [];
            if (fsSync.existsSync(filePath)) {
                for await (const record of fsSync.createReadStream(filePath).pipe(csv.parse())) {
                    records.push(Entity.fromArray(record));
                }
            }
            return records;
        };
        const results = await processFile();
        return results.length === 0 ? undefined : results.pop();
    }
}
